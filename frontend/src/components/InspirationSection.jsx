import { useEffect, useRef, useState } from "react";
import DestinationPhoto from "./DestinationPhoto.jsx";
import PassportBook, { BookPage } from "./PassportBook.jsx";
import { BUDGET_OPTIONS, formatPeriod, periodIncludesMonth } from "../utils/travelOptions.js";
import { REGIONS, SUGGESTIONS } from "../data/suggestions.js";
import { useLanguage } from "../i18n/LanguageContext.js";
import { playStamp } from "../utils/flapSound.js";
import styles from "./InspirationSection.module.css";

// the coloured line of each visa: one ink per kind of place (mountain is the default)
const VISA_INK = {
  "city-break": styles.visaCityBreak,
  beach: styles.visaBeach
};

// the tabs above the passport; their names are in t.inspire.tabs
const TYPE_TABS = ["all", "city-break", "beach", "mountain"];

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

// highlight: the description in the chosen language, so the search finds what is on screen
function matches(suggestion, highlight, filters) {
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
    !highlight.toLowerCase().includes(search)
  ) {
    return false;
  }
  return true;
}

export default function InspirationSection({ destinations = [], onAdd }) {
  const { t } = useLanguage();
  // the description of an idea: in Romanian from ro.js, in English as it is in suggestions.js
  const highlightOf = (suggestion) => t.highlights[suggestion.title] ?? suggestion.highlight;
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [spread, setSpread] = useState(0);
  // the idea chosen by "Surprise me", it gets a gold frame
  const [picked, setPicked] = useState("");
  // Stage 7: the title being saved; while it is set, every Add button waits,
  // so a double click cannot create the same destination twice
  const [savingTitle, setSavingTitle] = useState("");
  const [justAdded, setJustAdded] = useState(""); // the visa that was stamped a moment ago
  // the passport, so "Surprise me" can turn its pages
  const bookRef = useRef(null);

  const isAdded = (title) =>
    destinations.some((d) => (d.title || "").toLowerCase() === title.toLowerCase());

  // derived values, nothing extra in state
  const visible = SUGGESTIONS.filter((suggestion) =>
    matches(suggestion, highlightOf(suggestion), filters)
  );
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
      const saved = await onAdd({
        title: suggestion.title,
        type: suggestion.type,
        category: "Vacation",
        // the best season goes in as the period; it can be changed in My Travel List
        periodFrom: suggestion.from,
        periodTo: suggestion.to,
        budget: suggestion.budget,
        // saved in the language that is on screen when you add it
        highlight: highlightOf(suggestion),
        photo: ""
      });
      // saved: the stamp falls on the visa, with its thud
      if (saved) {
        setJustAdded(suggestion.title);
        playStamp();
      }
    } finally {
      setSavingTitle("");
    }
  }

  // index: the place of the visa on its page, so the stamps of a page land one after another
  function renderVisa(suggestion, index) {
    const added = isAdded(suggestion.title);
    const saving = savingTitle === suggestion.title;
    const budget = t.budgets[suggestion.budget];

    const classes = [
      styles.visa,
      VISA_INK[suggestion.type],
      added ? styles.isAdded : "",
      picked === suggestion.title ? styles.isPicked : "",
      justAdded === suggestion.title ? styles.isJustAdded : ""
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <article
        key={suggestion.title}
        className={classes}
        data-visa={suggestion.title}
        data-stamp={t.inspire.added}
        // added now: the stamp lands at once; already in the list: one after another
        style={{ "--stamp-delay": justAdded === suggestion.title ? "0ms" : `${250 + index * 160}ms` }}
      >
        <div className={styles.visaPhoto}>
          <DestinationPhoto title={suggestion.title} />
        </div>

        <div className={styles.visaBody}>
          <p className={styles.visaHead}>
            <span>{t.inspire.visa}</span>
            <span className={styles.visaRegion}>{t.regions[suggestion.region]}</span>
          </p>

          <h3 className={styles.visaTitle}>{suggestion.title}</h3>
          <p className={styles.visaText}>{highlightOf(suggestion)}</p>

          <dl className={styles.visaFields}>
            <div>
              <dt>{t.inspire.type}</dt>
              <dd>{t.types[suggestion.type]}</dd>
            </div>
            <div>
              <dt>{t.common.budget}</dt>
              <dd>{budget?.short ?? suggestion.budget}</dd>
            </div>
            <div>
              <dt>{t.inspire.bestTime}</dt>
              <dd>{formatPeriod(suggestion.from, suggestion.to, t.months)}</dd>
            </div>
          </dl>

          <button
            type="button"
            className={`btn btn-primary ${styles.visaAdd}`}
            disabled={added || savingTitle !== ""}
            onClick={() => handleAdd(suggestion)}
          >
            {added ? t.common.inList : saving ? t.common.saving : t.common.addToList}
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
        <div className={styles.deskTabs} role="group" aria-label={t.inspire.tabsLabel}>
          {TYPE_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              className={styles.deskTab}
              aria-pressed={filters.type === tab}
              onClick={() => changeFilter("type", tab)}
            >
              {t.inspire.tabs[tab]}
            </button>
          ))}
        </div>

        <div className={styles.deskFields}>
          <label className={styles.deskField}>
            <span>{t.inspire.region}</span>
            <select
              value={filters.region}
              onChange={(e) => changeFilter("region", e.target.value)}
            >
              <option value="">{t.inspire.anywhere}</option>
              {REGIONS.map((region) => (
                <option key={region} value={region}>
                  {t.regions[region]}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.deskField}>
            <span>{t.common.budget}</span>
            <select
              value={filters.budget}
              onChange={(e) => changeFilter("budget", e.target.value)}
            >
              <option value="">{t.common.anyBudget}</option>
              {BUDGET_OPTIONS.map((option) => (
                <option key={option.key} value={option.key}>
                  {t.budgets[option.key].label}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.deskField}>
            <span>{t.inspire.when}</span>
            <select
              value={filters.month}
              onChange={(e) => changeFilter("month", e.target.value)}
            >
              <option value="">{t.common.anyMonth}</option>
              {t.months.map((name, index) => (
                <option key={index} value={String(index + 1)}>
                  {name}
                </option>
              ))}
            </select>
          </label>

          <label className={`${styles.deskField} ${styles.deskSearch}`}>
            <span>{t.common.search}</span>
            <input
              type="search"
              value={filters.search}
              placeholder={t.inspire.searchPlaceholder}
              onChange={(e) => changeFilter("search", e.target.value)}
            />
          </label>

          <button
            type="button"
            className={styles.deskSurprise}
            disabled={notAddedYet.length === 0}
            onClick={surpriseMe}
          >
            {t.inspire.surprise}
          </button>
        </div>

        <p className={styles.deskSummary} aria-live="polite">
          {visible.length === SUGGESTIONS.length
            ? t.inspire.all(SUGGESTIONS.length)
            : t.inspire.matching(visible.length, SUGGESTIONS.length)}
          {hasFilters && (
            <button type="button" className={styles.deskClear} onClick={clearFilters}>
              {t.common.clearFilters}
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
          <h2 className="card-title">{t.inspire.title}</h2>
          <p className={styles.inspireSubtitle}>{t.inspire.subtitle}</p>

          {visible.length === 0 ? (
            <div className={styles.visaEmpty}>
              <p>{t.inspire.noMatch}</p>
              <button type="button" className="btn btn-primary" onClick={clearFilters}>
                {t.common.clearFilters}
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
