export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// label și short sunt în engleză; pe ecran apar cele din t.budgets (i18n/en.js, i18n/ro.js)
export const BUDGET_OPTIONS = [
  { key: "under-500", label: "Under €500", short: "<€500" },
  { key: "500-1000", label: "€500 – €1,000", short: "€500–1k" },
  { key: "1000-2000", label: "€1,000 – €2,000", short: "€1–2k" },
  { key: "over-2000", label: "Over €2,000", short: "€2k+" }
];

// "6" + "8" -> "Jun – Aug", "4" -> "Apr"
// months: numele lunilor în limba aleasă (t.months); fără ele, în engleză
export function formatPeriod(from, to, months = MONTH_NAMES) {
  if (!from) return "";
  const start = months[Number(from) - 1].slice(0, 3);
  if (!to || to === from) return start;
  return `${start} – ${months[Number(to) - 1].slice(0, 3)}`;
}

// true if the month (1-12) is inside the period; handles ranges like Nov–Feb
export function periodIncludesMonth(from, to, month) {
  if (!from) return false;
  const start = Number(from);
  const end = to ? Number(to) : start;
  const target = Number(month);
  return start <= end
    ? target >= start && target <= end
    : target >= start || target <= end;
}