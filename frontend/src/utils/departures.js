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
// classes: numele claselor în limba aleasă (t.pass.classes)
export function travelClass(budget, classes) {
  return classes[budget] || classes["under-500"];
}

// "HH:MM", minutes from now
export function timeFromNow(minutes, now = new Date()) {
  const time = new Date(now.getTime() + minutes * 60000);
  return `${String(time.getHours()).padStart(2, "0")}:${String(time.getMinutes()).padStart(2, "0")}`;
}

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

// Companiile vând bilete cam cu 11 luni înainte, iar pentru o zi prea apropiată
// rămân puține locuri: zborul e între 2 săptămâni și 300 de zile de azi.
const MIN_DAYS_AHEAD = 14;
const MAX_DAYS_AHEAD = 300;
const DAY_MS = 24 * 60 * 60 * 1000;

// The day of the flight: in the first month of the best season that can still be booked.
// "4" -> "6" in November gives a day in April next year. Returns a Date.
export function flightDay(from, to, title, today = new Date()) {
  const day = (hashOf(title) % 27) + 1;
  const earliest = today.getTime() + MIN_DAYS_AHEAD * DAY_MS;
  const latest = new Date(today.getTime() + MAX_DAYS_AHEAD * DAY_MS);
  for (let step = 0; step <= 12; step++) {
    const date = new Date(today.getFullYear(), today.getMonth() + step, day);
    if (date.getTime() < earliest) continue;
    if (date > latest) break;
    if (!from || periodIncludesMonth(from, to, String(date.getMonth() + 1))) return date;
  }
  // the season is too far away to book: the last day that can be booked, the closest to it
  return new Date(latest.getFullYear(), latest.getMonth(), latest.getDate());
}

// "15 APR 2027", as printed on the pass
// months: prescurtările în limba aleasă (t.monthsPrinted), de exemplu "IAN" în română
export function printedDate(date, months = MONTHS) {
  return `${String(date.getDate()).padStart(2, "0")} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// A search for one-way flights on Skyscanner, already filled in:
// skyscanner.ro/transport/flights/otp/lis/270415/  (the date is written YYMMDD)
export function ticketsUrl(fromCode, toCode, date) {
  const yymmdd =
    String(date.getFullYear()).slice(2) +
    String(date.getMonth() + 1).padStart(2, "0") +
    String(date.getDate()).padStart(2, "0");
  return `https://www.skyscanner.ro/transport/flights/${fromCode.toLowerCase()}/${toCode.toLowerCase()}/${yymmdd}/`;
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
