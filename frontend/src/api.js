// All HTTP requests live here; the components never call fetch directly.
// In stage 9 the server changes by editing a single address.
export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

export async function fetchDestinations() {
  const res = await fetch(`${API_URL}/destinations`);
  if (!res.ok) {
    throw new Error(`Server error: ${res.status}`);
  }
  return res.json();
}