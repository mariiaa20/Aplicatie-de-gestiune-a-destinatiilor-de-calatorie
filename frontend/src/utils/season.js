import { MONTH_NAMES, periodIncludesMonth } from "./travelOptions.js";

const DAY_MS = 24 * 60 * 60 * 1000;

// When does the best period of a place start, counted from today?
// { inSeason: true } if today is inside the period,
// { days: 134, month: "April", monthIndex: 3 } if it starts later, or null when no period is set.
// monthIndex (0-11) lasă pagina să scrie luna în limba aleasă.
export function seasonCountdown(periodFrom, periodTo, today = new Date()) {
  if (!periodFrom) return null;
  const to = periodTo || periodFrom;
  if (periodIncludesMonth(periodFrom, to, String(today.getMonth() + 1))) return { inSeason: true, days: 0 };

  const startMonth = Number(periodFrom) - 1;
  let year = today.getFullYear();
  if (startMonth <= today.getMonth()) year += 1; // this year's start is already past
  const start = new Date(year, startMonth, 1);
  const midnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return { inSeason: false, days: Math.round((start - midnight) / DAY_MS), month: MONTH_NAMES[startMonth], monthIndex: startMonth };
}

// for sorting: in season first, then the ones that start soonest, then no period
export function daysToSeason(item) {
  const countdown = seasonCountdown(item.periodFrom, item.periodTo);
  return countdown ? countdown.days : Infinity;
}
