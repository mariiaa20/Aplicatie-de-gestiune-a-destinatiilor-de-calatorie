// All HTTP requests live here; the components never call fetch directly.
// In stage 9 the server changes by editing a single address.
export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

// Shared function: sends JSON and throws if the answer is not 2xx
async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  if (!res.ok) {
    throw new Error(`Server error: ${res.status}`);
  }
  // 204 No Content has no body, and res.json() would throw on it
  return res.status === 204 ? null : res.json();
}

export function fetchDestinations() {
  return request("/destinations");
}

// Stage 8: one destination, for its detail page. A missing id answers 404,
// and request() turns that into an error the page can show.
export function fetchDestination(id) {
  return request(`/destinations/${id}`);
}

// The new destination goes without an id: the server gives it one
export function createDestination(destination) {
  return request("/destinations", {
    method: "POST",
    body: JSON.stringify(destination),
  });
}

// PATCH sends only the fields that changed
export function updateDestination(id, changes) {
  return request(`/destinations/${id}`, {
    method: "PATCH",
    body: JSON.stringify(changes),
  });
}

export function deleteDestination(id) {
  return request(`/destinations/${id}`, { method: "DELETE" });
}

// Wikipedia, for the destination photos. It is another server, so these two
// skip request(): a JSON header on a plain GET would add an extra CORS check.
const WIKI_SUMMARY_URL = "https://en.wikipedia.org/api/rest_v1/page/summary/";
const WIKI_SEARCH_URL =
  "https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrlimit=5" +
  "&prop=pageimages&piprop=thumbnail&pithumbsize=500&format=json&origin=*&gsrsearch=";

export function fetchWikiSummary(name) {
  return fetch(WIKI_SUMMARY_URL + encodeURIComponent(name.replace(/ /g, "_")));
}

export function searchWikiArticles(name) {
  return fetch(WIKI_SEARCH_URL + encodeURIComponent(name));
}

// Same search, but asking for the coordinates of each article (for the globe)
const WIKI_PLACES_URL =
  "https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrlimit=5" +
  "&prop=coordinates&colimit=max&format=json&origin=*&gsrsearch=";

export function searchWikiPlaces(name) {
  return fetch(WIKI_PLACES_URL + encodeURIComponent(name));
}

// ---------- Weather (Open-Meteo, free, no key needed) ----------
// The real weather of one whole month, the last time that month happened:
// daily highs, lows and rain, turned into averages for the detail page.
export async function fetchMonthWeather(lat, lon, month, today = new Date()) {
  const m = Number(month); // 1-12
  // a month that is already over: this year if it is behind us, otherwise last year
  const year = m < today.getMonth() + 1 ? today.getFullYear() : today.getFullYear() - 1;
  const last = new Date(year, m, 0).getDate(); // day 0 of the next month = last day of this one
  const pad = (n) => String(n).padStart(2, "0");
  const params = new URLSearchParams({
    latitude: lat.toFixed(3),
    longitude: lon.toFixed(3),
    start_date: `${year}-${pad(m)}-01`,
    end_date: `${year}-${pad(m)}-${pad(last)}`,
    daily: "temperature_2m_max,temperature_2m_min,precipitation_sum",
    timezone: "auto"
  });
  const res = await fetch(`https://archive-api.open-meteo.com/v1/archive?${params}`);
  if (!res.ok) throw new Error(`Weather error: ${res.status}`);
  const { daily } = await res.json();
  const average = (values) => {
    const known = values.filter((v) => typeof v === "number");
    return known.length ? Math.round(known.reduce((sum, v) => sum + v, 0) / known.length) : null;
  };
  return {
    month: m,
    year,
    high: average(daily.temperature_2m_max),
    low: average(daily.temperature_2m_min),
    rainyDays: daily.precipitation_sum.filter((mm) => mm >= 1).length
  };
}

