import { useEffect, useState } from "react";

const SUMMARY_URL = "https://en.wikipedia.org/api/rest_v1/page/summary/";
const SEARCH_URL =
  "https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrlimit=5" +
  "&prop=pageimages&piprop=thumbnail&pithumbsize=500&format=json&origin=*&gsrsearch=";

const cache = new Map();   // name -> photo or null (only for definitive answers)
const pending = new Map(); // name -> lookup that is already running
let queue = Promise.resolve();

// Runs lookups one after another so a burst of requests does not get refused
function enqueue(task) {
  const run = queue.then(task);
  queue = run.catch(() => {});
  return run;
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Photo from the article summary. null = the article has no photo / does not exist.
// Throws when Wikipedia is temporarily unavailable.
async function fromSummary(name) {
  for (let attempt = 0; attempt < 2; attempt++) {
    const response = await fetch(
      SUMMARY_URL + encodeURIComponent(name.replace(/ /g, "_"))
    );

    if (response.ok) {
      const data = await response.json();
      if (data.type !== "disambiguation" && data.thumbnail?.source) {
        return {
          url: data.thumbnail.source,
          pageUrl: data.content_urls?.desktop?.page
        };
      }
      return null;
    }

    if (response.status === 404) return null;
    await wait(700); // 429 / 5xx: wait a moment and try once more
  }
  throw new Error("Wikipedia is busy");
}

// Fallback: search articles with this name and take the first one that has a photo
async function fromSearch(name) {
  const response = await fetch(SEARCH_URL + encodeURIComponent(name));
  if (!response.ok) throw new Error(`Search failed (${response.status})`);

  const data = await response.json();
  const pages = Object.values(data.query?.pages ?? {})
    .filter((page) => page.thumbnail?.source)
    .sort((a, b) => a.index - b.index);

  if (pages.length === 0) return null;
  return {
    url: pages[0].thumbnail.source,
    pageUrl: `https://en.wikipedia.org/?curid=${pages[0].pageid}`
  };
}

async function lookup(name) {
  // "Tokyo, Japan" -> try the full name first, then just "Tokyo"
  const shortName = name.split(",")[0].trim();
  const candidates = [...new Set([name, shortName])];

  for (const candidate of candidates) {
    const photo = await fromSummary(candidate);
    if (photo) return photo;
  }
  return fromSearch(shortName);
}

function fetchWikiPhoto(rawName) {
  const name = rawName.trim();
  const key = name.toLowerCase();

  if (cache.has(key)) return Promise.resolve(cache.get(key));
  if (pending.has(key)) return pending.get(key);

  const request = enqueue(() => lookup(name))
    .then((photo) => {
      cache.set(key, photo);
      if (!photo) console.info(`No Wikipedia photo found for "${name}"`);
      return photo;
    })
    .catch((error) => {
      // temporary problem: do not remember it, so it can be retried later
      console.warn(`Photo lookup failed for "${name}":`, error);
      return null;
    })
    .finally(() => pending.delete(key));

  pending.set(key, request);
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
      const photo = await fetchWikiPhoto(name);
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