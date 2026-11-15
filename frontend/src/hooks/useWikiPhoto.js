import { useEffect, useState } from "react";
import { fetchWikiSummary, searchWikiArticles, searchWikiPlaces } from "../api.js";

// What Wikipedia already answered, kept for as long as the page is open
const summaries = new Map(); // name -> article summary, or null when there is no article
const photos = new Map();    // name -> { url, pageUrl } or null
const places = new Map();    // name -> { lat, lon } or null
const pending = new Map();   // lookups that are already running
let queue = Promise.resolve();

// Runs lookups one after another so a burst of requests does not get refused
function enqueue(task) {
  const run = queue.then(task);
  queue = run.catch(() => {});
  return run;
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// One summary request per name, shared by the photo and the location lookups.
// Throws when Wikipedia is temporarily unavailable.
async function getSummary(name) {
  const key = name.toLowerCase();
  if (summaries.has(key)) return summaries.get(key);

  for (let attempt = 0; attempt < 2; attempt++) {
    const response = await fetchWikiSummary(name);

    if (response.ok) {
      const data = await response.json();
      const summary = data.type === "disambiguation" ? null : data;
      summaries.set(key, summary);
      return summary;
    }

    if (response.status === 404) {
      summaries.set(key, null);
      return null;
    }
    await wait(700); // 429 / 5xx: wait a moment and try once more
  }
  throw new Error("Wikipedia is busy");
}

// "Tokyo, Japan" -> try the full name first, then just "Tokyo"
function candidatesFor(name) {
  const shortName = name.split(",")[0].trim();
  return [...new Set([name, shortName])];
}

async function lookupPhoto(name) {
  const candidates = candidatesFor(name);
  for (const candidate of candidates) {
    const summary = await getSummary(candidate);
    if (summary?.thumbnail?.source) {
      return { url: summary.thumbnail.source, pageUrl: summary.content_urls?.desktop?.page };
    }
  }

  // Fallback: search articles with this name and take the first one that has a photo
  const response = await searchWikiArticles(candidates[candidates.length - 1]);
  if (!response.ok) throw new Error(`Search failed (${response.status})`);
  const data = await response.json();
  const page = Object.values(data.query?.pages ?? {})
    .filter((p) => p.thumbnail?.source)
    .sort((a, b) => a.index - b.index)[0];
  return page
    ? { url: page.thumbnail.source, pageUrl: `https://en.wikipedia.org/?curid=${page.pageid}` }
    : null;
}

async function lookupPlace(name) {
  const candidates = candidatesFor(name);
  for (const candidate of candidates) {
    const summary = await getSummary(candidate);
    if (summary?.coordinates) {
      return { lat: summary.coordinates.lat, lon: summary.coordinates.lon };
    }
  }

  // Fallback: the first search result that has coordinates (for a country,
  // usually a city in it, which is enough to find the country on the map)
  const response = await searchWikiPlaces(candidates[candidates.length - 1]);
  if (!response.ok) throw new Error(`Search failed (${response.status})`);
  const data = await response.json();
  const page = Object.values(data.query?.pages ?? {})
    .filter((p) => p.coordinates?.length)
    .sort((a, b) => a.index - b.index)[0];
  return page ? { lat: page.coordinates[0].lat, lon: page.coordinates[0].lon } : null;
}

// Runs a lookup once per name. A definite answer is remembered; a temporary
// failure gives undefined and is not remembered, so it can be tried again later.
function cached(store, kind, lookup, rawName) {
  const name = rawName.trim();
  const key = name.toLowerCase();
  if (store.has(key)) return Promise.resolve(store.get(key));

  const pendingKey = `${kind}:${key}`;
  if (pending.has(pendingKey)) return pending.get(pendingKey);

  const request = enqueue(() => lookup(name))
    .then((value) => {
      store.set(key, value);
      return value;
    })
    .catch(() => undefined)
    .finally(() => pending.delete(pendingKey));

  pending.set(pendingKey, request);
  return request;
}

// delay (ms) lets the add form wait until the user stops typing
export function useWikiPhoto(title, enabled = true, delay = 0) {
  const [result, setResult] = useState({ name: "", photo: null });
  const name = title.trim();
  const active = enabled && name.length >= 2;

  useEffect(() => {
    if (!active) return;

    let cancelled = false;
    const timer = setTimeout(async () => {
      const photo = await cached(photos, "photo", lookupPhoto, name);
      if (!cancelled) setResult({ name, photo });
    }, delay);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [name, active, delay]);

  if (!active) return { status: "idle", photo: null };
  if (result.name !== name) return { status: "loading", photo: null };
  return { status: result.photo ? "found" : "missing", photo: result.photo };
}

// Location of several destinations at once, for the globe.
// Returns { [title]: { lat, lon } }; null = no location found, missing = still looking.
export function useWikiCoordinates(titles) {
  const [found, setFound] = useState({});
  // one string, so the effect runs again only when the list of names really changes
  const key = titles
    .map((t) => t.trim())
    .filter((t) => t.length >= 2)
    .join("\n");

  useEffect(() => {
    if (!key) return;
    let cancelled = false;

    for (const title of key.split("\n")) {
      cached(places, "place", lookupPlace, title).then((place) => {
        if (cancelled) return;
        setFound((prev) =>
          title in prev && prev[title] === place ? prev : { ...prev, [title]: place }
        );
      });
    }

    return () => {
      cancelled = true;
    };
  }, [key]);

  return found;
}