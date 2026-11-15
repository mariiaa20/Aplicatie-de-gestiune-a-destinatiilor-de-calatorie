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