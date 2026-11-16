import { useEffect, useRef, useState } from "react";
import DestinationPhoto from "./DestinationPhoto.jsx";
import PassportBook, { BookPage } from "./PassportBook.jsx";
import {
  BUDGET_OPTIONS,
  MONTH_NAMES,
  formatPeriod,
  getBudget,
  periodIncludesMonth
} from "../utils/travelOptions.js";
import { REGIONS, SUGGESTIONS } from "../data/suggestions.js";
import { TYPE_LABELS } from "../constants.js";
import styles from "./InspirationSection.module.css";

// the coloured line of each visa: one ink per kind of place (mountain is the default)
const VISA_INK = {
  "city-break": styles.visaCityBreak,
  beach: styles.visaBeach
};

const TYPE_TABS = [
  { key: "all", label: "All ideas" },
  { key: "city-break", label: "City breaks" },
  { key: "beach", label: "Beach" },
  { key: "mountain", label: "Mountain" }
];

const EMPTY_FILTERS = {
  type: "all",
  region: "",
  budget: "",
  month: "",
  search: ""
};

// 3 visas on each page, 2 pages on each spread
const PER_PAGE = 3;
const PER_SPREAD = PER_PAGE * 2;

// the visa pages come after the globe (pages 4-7)
const FIRST_PAGE_NUMBER = 8;

// "Lisbon, Portugal" -> "V<LISBON<PORTUGAL<<<<<<..." (always 44 characters)
function machineLine(title) {
  const letters = title
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/[^A-Z]+/g, "<");
  return `V<${letters}`.padEnd(44, "<").slice(0, 44);
}

function matches(suggestion, filters) {
  const search = filters.search.trim().toLowerCase();

  if (filters.type !== "all" && suggestion.type !== filters.type) return false;
  if (filters.region && suggestion.region !== filters.region) return false;
  if (filters.budget && suggestion.budget !== filters.budget) return false;
  if (filters.month && !periodIncludesMonth(suggestion.from, suggestion.to, filters.month)) {
    return false;
  }
  if (
    search &&
    !suggestion.title.toLowerCase().includes(search) &&
    !suggestion.highlight.toLowerCase().includes(search)
  ) {
    return false;
  }
  return true;
}

export default function InspirationSection({ destinations = [], onAdd }) {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [spread, setSpread] = useState(0);
  // the idea chosen by "Surprise me", it gets a gold frame
  const [picked, setPicked] = useState("");
  // Stage 7: the title being saved; while it is set, every Add button waits,
  // so a double click cannot create the same destination twice
  const [savingTitle, setSavingTitle] = useState("");
  // the passport, so "Surprise me" can turn its pages
  const bookRef = useRef(null);

  const isAdded = (title) =>
    destinations.some((d) => (d.title || "").toLowerCase() === title.toLowerCase());

  // derived values, nothing extra in state
  const visible = SUGGESTIONS.filter((suggestion) => matches(suggestion, filters));
  const spreadCount = Math.max(1, Math.ceil(visible.length / PER_SPREAD));
  const current = Math.min(spread, spreadCount - 1);
  const onSpread = visible.slice(current * PER_SPREAD, (current + 1) * PER_SPREAD);
  const pages = [onSpread.slice(0, PER_PAGE), onSpread.slice(PER_PAGE)];
  const leftNumber = FIRST_PAGE_NUMBER + current * 2;
  const notAddedYet = visible.filter((suggestion) => !isAdded(suggestion.title));
  const hasFilters = JSON.stringify(filters) !== JSON.stringify(EMPTY_FILTERS);

  // after "Surprise me", bring the chosen visa into view
  useEffect(() => {
    if (!picked) return;
    const visa = document.querySelector(`[data-visa="${CSS.escape(picked)}"]`);
    visa?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [picked, current]);

  function changeFilter(name, value) {
    setFilters({ ...filters, [name]: value });
    setSpread(0);
    setPicked("");
  }

  function clearFilters() {
    setFilters(EMPTY_FILTERS);
    setSpread(0);
    setPicked("");
  }

  // called by the passport when a page is turned
  function showSpread(index) {
    setSpread(index);
    setPicked("");
  }

  function surpriseMe() {
    if (notAddedYet.length === 0) return;
    const choice = notAddedYet[Math.floor(Math.random() * notAddedYet.length)];
    const index = visible.indexOf(choice);
    // turns the pages if the idea is on another spread, then frames it
    bookRef.current?.turnTo(Math.floor(index / PER_SPREAD));
    setPicked(choice.title);
  }

  async function handleAdd(suggestion) {
    setSavingTitle(suggestion.title);
    try {
      await onAdd({
        title: suggestion.title,
        type: suggestion.type,
        category: "Vacation",
        // the best season goes in as the period; it can be changed in My Travel List
        periodFrom: suggestion.from,
        periodTo: suggestion.to,
        budget: suggestion.budget,
        highlight: suggestion.highlight,
        photo: ""
      });
    } finally {
      setSavingTitle("");
    }
  }

  function renderVisa(suggestion) {
    const added = isAdded(suggestion.title);
    const saving = savingTitle === suggestion.title;
    const budget = getBudget(suggestion.budget);

    const classes = [
      styles.visa,
      VISA_INK[suggestion.type],
      added ? styles.isAdded : "",
      picked === suggestion.title ? styles.isPicked : ""
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <article key={suggestion.title} className={classes} data-visa={suggestion.title}>
        <div className={styles.visaPhoto}>
          <DestinationPhoto title={suggestion.title} />
        </div>

        <div className={styles.visaBody}>
          <p className={styles.visaHead}>
            <span>Visa</span>
            <span className={styles.visaRegion}>{suggestion.region}</span>
          </p>

          <h3 className={styles.visaTitle}>{suggestion.title}</h3>
          <p className={styles.visaText}>{suggestion.highlight}</p>

          <dl className={styles.visaFields}>
            <div>
              <dt>Type</dt>
              <dd>{TYPE_LABELS[suggestion.type]}</dd>
            </div>
            <div>
              <dt>Budget</dt>
              <dd>{budget?.short ?? suggestion.budget}</dd>
            </div>
            <div>
              <dt>Best time</dt>
              <dd>{formatPeriod(suggestion.from, suggestion.to)}</dd>
            </div>
          </dl>

          <button
            type="button"
            className={`btn btn-primary ${styles.visaAdd}`}
            disabled={added || savingTitle !== ""}
            onClick={() => handleAdd(suggestion)}
          >
            {added ? "In your list" : saving ? "Saving…" : "Add to my list"}
          </button>
        </div>

        <p className={styles.visaMrz} aria-hidden="true">
          {machineLine(suggestion.title)}
        </p>
      </article>
    );
  }

  return (
    <>
      {/* the filters, pressed into the leather above the passport */}
      <div className={styles.inspireDesk}>
        <div className={styles.deskTabs} role="group" aria-label="Kind of trip">
          {TYPE_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={styles.deskTab}
              aria-pressed={filters.type === tab.key}
              onClick={() => changeFilter("type", tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className={styles.deskFields}>
          <label className={styles.deskField}>
            <span>Region</span>
            <select
              value={filters.region}
              onChange={(e) => changeFilter("region", e.target.value)}
            >
              <option value="">Anywhere</option>
              {REGIONS.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.deskField}>
            <span>Budget</span>
            <select
              value={filters.budget}
              onChange={(e) => changeFilter("budget", e.target.value)}
            >
              <option value="">Any budget</option>
              {BUDGET_OPTIONS.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.deskField}>
            <span>When</span>
            <select
              value={filters.month}
              onChange={(e) => changeFilter("month", e.target.value)}
            >
              <option value="">Any month</option>
              {MONTH_NAMES.map((name, index) => (
                <option key={name} value={String(index + 1)}>
                  {name}
                </option>
              ))}
            </select>
          </label>

          <label className={`${styles.deskField} ${styles.deskSearch}`}>
            <span>Search</span>
            <input
              type="search"
              value={filters.search}
              placeholder="A city, a country, a word…"
              onChange={(e) => changeFilter("search", e.target.value)}
            />
          </label>

          <button
            type="button"
            className={styles.deskSurprise}
            disabled={notAddedYet.length === 0}
            onClick={surpriseMe}
          >
            Surprise me
          </button>
        </div>

        <p className={styles.deskSummary} aria-live="polite">
          {visible.length === SUGGESTIONS.length
            ? `${SUGGESTIONS.length} ideas in the passport.`
            : `${visible.length} of ${SUGGESTIONS.length} ideas match.`}
          {hasFilters && (
            <button type="button" className={styles.deskClear} onClick={clearFilters}>
              Clear filters
            </button>
          )}
        </p>
      </div>

      {/* the passport, open on the visa pages */}
      <PassportBook
        ref={bookRef}
        spread={current}
        spreadCount={spreadCount}
        onSpreadChange={showSpread}
      >
        <BookPage
          // a new key on every spread, so the pages fade in on a phone
          key={`left-${current}`}
          number={leftNumber}
          className={styles.visaPage}
        >
          <h2 className="card-title">Get inspired</h2>
          <p className={styles.inspireSubtitle}>
            Each visa is an idea for a trip. Add one and it goes to My Travel List with its best
            season as the period.
          </p>

          {visible.length === 0 ? (
            <div className={styles.visaEmpty}>
              <p>No ideas match these filters.</p>
              <button type="button" className="btn btn-primary" onClick={clearFilters}>
                Clear filters
              </button>
            </div>
          ) : (
            pages[0].map(renderVisa)
          )}
        </BookPage>

        <BookPage key={`right-${current}`} number={leftNumber + 1} className={styles.visaPage}>
          {pages[1].map(renderVisa)}
        </BookPage>
      </PassportBook>
    </>
  );
}
