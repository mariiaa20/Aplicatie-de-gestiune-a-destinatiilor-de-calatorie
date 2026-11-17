import { periodIncludesMonth } from "./travelOptions.js";

// Helpers for the departure board and the boarding pass.
// Everything that looks random on the pass (gate, seat, flight) comes from the
// name of the place, so the same place always gets the same gate and seat.

export const BOARD_CHARS = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:-.";

// a small number made from a text: "Lisbon" always gives the same one
export function hashOf(text) {
  let hash = 7;
  for (const char of String(text)) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash;
}

// "Făgăraș Mountains, Romania" -> "FAGARAS MOUNTAINS", only letters the board can show
export function boardText(text) {
  return String(text)
    .split(",")[0]
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9 :.-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// a three letter code, like the ones on luggage tags: LIS, NYC, TDP
export function airportCode(title) {
  const words = boardText(title).split(" ").filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 3).padEnd(3, "X");
  if (words.length === 2) return (words[0][0] + words[1].slice(0, 2)).padEnd(3, "X");
  return words.slice(0, 3).map((word) => word[0]).join("");
}

export function gateOf(title) {
  const hash = hashOf(title);
  return "ABCDEF"[hash % 6] + String(((hash >>> 3) % 24) + 1);
}

export function seatOf(title, passenger) {
  const hash = hashOf(title + passenger);
  return String((hash % 32) + 1) + "ABCDEF"[(hash >>> 5) % 6];
}

export function flightOf(title) {
  return `PA ${100 + (hashOf(title) % 900)}`;
}

// the budget decides the class: a pass is more fun when it says "First"
export function travelClass(budget) {
  return (
    { "under-500": "Economy", "500-1000": "Economy Plus", "1000-2000": "Business", "over-2000": "First" }[budget] ||
    "Economy"
  );
}

// "HH:MM", minutes from now
export function timeFromNow(minutes, now = new Date()) {
  const time = new Date(now.getTime() + minutes * 60000);
  return `${String(time.getHours()).padStart(2, "0")}:${String(time.getMinutes()).padStart(2, "0")}`;
}

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

// The day of the flight: the first month of the best season, starting next month.
// "4" -> "6" in November gives a day in April next year.
export function flightDate(from, to, title, today = new Date()) {
  const day = (hashOf(title) % 27) + 1;
  for (let step = 1; step <= 12; step++) {
    const date = new Date(today.getFullYear(), today.getMonth() + step, day);
    if (!from || periodIncludesMonth(from, to, String(date.getMonth() + 1))) {
      return `${String(day).padStart(2, "0")} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
    }
  }
  return "";
}

// the bars of the barcode: thin and thick, from the text
export function barcodeBars(text, count = 46) {
  let hash = hashOf(text);
  const bars = [];
  for (let i = 0; i < count; i++) {
    hash = (hash * 1103515245 + 12345) >>> 0;
    bars.push(1 + ((hash >>> 16) % 3));
  }
  return bars;
}

// picks one item, if possible not the one picked last time
export function pickOne(items, last) {
  if (items.length === 0) return null;
  const others = items.length > 1 ? items.filter((item) => item.title !== last) : items;
  return others[Math.floor(Math.random() * others.length)];
}

// a few other items for the other lines of the board
export function someOthers(items, chosen, count) {
  const rest = items.filter((item) => item.title !== chosen?.title);
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }
  return rest.slice(0, count);
}
