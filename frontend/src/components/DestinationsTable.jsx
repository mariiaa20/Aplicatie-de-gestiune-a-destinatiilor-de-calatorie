import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import DestinationAvatar from "./DestinationAvatar.jsx";
import DestinationPhoto from "./DestinationPhoto.jsx";
import DeleteButton from "./DeleteButton.jsx";
import { BUDGET_OPTIONS, formatPeriod, periodIncludesMonth } from "../utils/travelOptions.js";
import { LOCATION_TYPES } from "../constants.js";
import { daysToSeason } from "../utils/season.js";
import { playStamp } from "../utils/flapSound.js";
import { useLanguage } from "../i18n/LanguageContext.js";
import styles from "./DestinationsTable.module.css";

// "Jun – Aug · €1–2k" shown under the destination name, in the chosen language (t)
const getMeta = (item, t) =>
  [formatPeriod(item.periodFrom, item.periodTo, t.months), t.budgets[item.budget]?.short]
    .filter(Boolean)
    .join(" · ");

// the orders the list can be sorted in; numele lor sunt în t.table.sorts
const SORTS = {
  added: () => 0,
  name: (a, b) => a.title.localeCompare(b.title),
  budget: (a, b) => budgetRank(a) - budgetRank(b),
  season: (a, b) => daysToSeason(a) - daysToSeason(b)
};

// position of a budget in BUDGET_OPTIONS; no budget goes last
function budgetRank(item) {
  const index = BUDGET_OPTIONS.findIndex((b) => b.key === item.budget);
  return index === -1 ? BUDGET_OPTIONS.length : index;
}

// Stage 7: the add form moved to DestinationForm. This table only shows,
// filters and edits the destinations; every change goes up to App.
export default function DestinationsTable({ destinations, onToggle, onDelete, onUpdate }) {
  const { t } = useLanguage();
  const [expandedId, setExpandedId] = useState(null);
  const [budgetFilter, setBudgetFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("added");
  // the row that was just ticked: its stamp falls on the page
  const [stampedId, setStampedId] = useState(null);

  if (destinations.length === 0) {
    return (
      <p className="empty-message" data-testid="empty">
        {t.table.empty}
      </p>
    );
  }

  // the options of the selects, in the chosen language; value stays the same in both
  const monthOptions = t.months.map((name, index) => (
    <option key={index} value={String(index + 1)}>
      {name}
    </option>
  ));
  const budgetChoices = BUDGET_OPTIONS.map((budget) => (
    <option key={budget.key} value={budget.key}>
      {t.budgets[budget.key].label}
    </option>
  ));

  const query = search.trim().toLowerCase();
  const filtersActive = Boolean(budgetFilter || monthFilter || query);
  // filter, then sort a copy (sort would change the array in place)
  const visibleDestinations = destinations
    .filter(
      (d) =>
        (!query || d.title.toLowerCase().includes(query)) &&
        (!budgetFilter || d.budget === budgetFilter) &&
        (!monthFilter || periodIncludesMonth(d.periodFrom, d.periodTo, monthFilter))
    )
    .slice()
    .sort(SORTS[sortBy]);

  const clearFilters = () => {
    setBudgetFilter("");
    setMonthFilter("");
    setSearch("");
  };

  // ticking a place as visited also stamps it, with a thud
  function handleToggle(item) {
    if (!item.visited) {
      setStampedId(item.id);
      playStamp();
    }
    onToggle(item.id);
  }

  const toggleDetails = (event, id) => {
    event.stopPropagation(); // do not toggle visited when opening details
    setExpandedId((current) => (current === id ? null : id));
  };

  return (
    <div className={styles.myTravelListContainer}>
      <div className={styles.filterBar}>
        <div className={`${styles.filterField} ${styles.searchField}`}>
          <label htmlFor="filter-search">{t.common.search}</label>
          <input
            id="filter-search"
            type="search"
            value={search}
            placeholder={t.table.searchPlaceholder}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className={styles.filterField}>
          <label htmlFor="filter-budget">{t.common.budget}</label>
          <select
            id="filter-budget"
            value={budgetFilter}
            onChange={(e) => setBudgetFilter(e.target.value)}
          >
            <option value="">{t.common.anyBudget}</option>
            {budgetChoices}
          </select>
        </div>

        <div className={styles.filterField}>
          <label htmlFor="filter-month">{t.table.month}</label>
          <select
            id="filter-month"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
          >
            <option value="">{t.common.anyMonth}</option>
            {monthOptions}
          </select>
        </div>

        <div className={styles.filterField}>
          <label htmlFor="filter-sort">{t.table.sortBy}</label>
          <select id="filter-sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            {Object.keys(SORTS).map((key) => (
              <option key={key} value={key}>
                {t.table.sorts[key]}
              </option>
            ))}
          </select>
        </div>

        {filtersActive && (
          <>
            <span className={styles.filterCount}>
              {t.table.shown(visibleDestinations.length, destinations.length)}
            </span>
            <button type="button" className="btn btn-ghost btn-small" onClick={clearFilters}>
              {t.table.clear}
            </button>
          </>
        )}
      </div>

      <div className={styles.sideBySideGrid}>
        {LOCATION_TYPES.map((cat) => {
          const items = visibleDestinations.filter((d) => d.type === cat.value);
          const planned = items.filter((d) => !d.visited).length;

          return (
            <div key={cat.value} className={styles.categoryColumn}>
              <div className={styles.columnHeader}>
                <span className={`badge badge-${cat.value}`}>{t.types[cat.value]}</span>
                <span className={styles.columnCount}>{t.table.plannedCount(planned)}</span>
              </div>

              <table className={styles.singleCategoryTable}>
                <thead>
                  <tr>
                    <th>{t.table.destination}</th>
                    <th className={styles.thRight}>{t.table.status}</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length > 0 ? (
                    items.map((item) => {
                      const isExpanded = expandedId === item.id;
                      const meta = getMeta(item, t);

                      return (
                        <Fragment key={item.id}>
                          {/* Stage 7: the data-testid attributes are only on this list,
                              which holds every destination, so each one is counted once */}
                          <tr
                            className={item.visited ? styles.rowIsVisited : undefined}
                            onClick={() => handleToggle(item)}
                            title={t.table.rowTitle}
                            data-testid="item"
                            data-id={item.id}
                          >
                            <td className={styles.destTitleCell}>
                              <div className={styles.titleCellInner}>
                                {/* controlled checkbox: shows what the data says, changes it on click */}
                                <input
                                  type="checkbox"
                                  className={styles.rowCheck}
                                  checked={item.visited}
                                  onChange={() => handleToggle(item)}
                                  onClick={(e) => e.stopPropagation()}
                                  aria-label={t.common.markVisited(item.title)}
                                  data-testid="item-toggle"
                                />
                                <DestinationAvatar title={item.title} photo={item.photo} />
                                <div className={styles.titleCellText}>
                                  {/* Stage 8: the title opens the detail page; stopPropagation
                                      keeps the click from also ticking the row */}
                                  <Link
                                    to={`/destinations/${item.id}`}
                                    className={styles.destText}
                                    onClick={(e) => e.stopPropagation()}
                                    data-testid="item-link"
                                  >
                                    {item.title}
                                  </Link>
                                  <span className={styles.destSub}>
                                    {meta && <span>{meta}</span>}
                                    <button
                                      type="button"
                                      className={styles.detailsLink}
                                      aria-expanded={isExpanded}
                                      onClick={(e) => toggleDetails(e, item.id)}
                                    >
                                      {t.table.details} <span className={styles.chev} aria-hidden="true">▾</span>
                                    </button>
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className={styles.thRight}>
                              <div className={styles.statusCell}>
                                <span
                                  className={`${styles.statusPill} ${
                                    item.visited ? styles.pillVisited : styles.pillPlanned
                                  } ${item.visited && item.id === stampedId ? styles.stampIn : ""}`}
                                >
                                  {item.visited ? `✓ ${t.common.visited}` : `○ ${t.common.planned}`}
                                </span>
                                <DeleteButton
                                  label={item.title}
                                  small
                                  testId="item-delete"
                                  onDelete={() => onDelete(item.id)}
                                />
                              </div>
                            </td>
                          </tr>

                          {isExpanded && (
                            <tr className={styles.detailRow}>
                              <td colSpan="2">
                                <div className={styles.detailBox}>
                                  <DestinationPhoto title={item.title} photo={item.photo} />
                                  {item.highlight && (
                                    <p className={styles.detailHighlight}>{item.highlight}</p>
                                  )}

                                  <div className={styles.detailField}>
                                    <span className={styles.detailLabel}>{t.table.period}</span>
                                    <div className="detail-pair">
                                      <select
                                        aria-label={t.table.fromFor(item.title)}
                                        value={item.periodFrom || ""}
                                        onChange={(e) =>
                                          onUpdate(
                                            item.id,
                                            e.target.value
                                              ? { periodFrom: e.target.value }
                                              : { periodFrom: "", periodTo: "" }
                                          )
                                        }
                                      >
                                        <option value="">{t.common.from}</option>
                                        {monthOptions}
                                      </select>
                                      <select
                                        aria-label={t.table.toFor(item.title)}
                                        value={item.periodTo || ""}
                                        disabled={!item.periodFrom}
                                        onChange={(e) =>
                                          onUpdate(item.id, { periodTo: e.target.value })
                                        }
                                      >
                                        <option value="">{t.common.to}</option>
                                        {monthOptions}
                                      </select>
                                    </div>
                                  </div>

                                  <div className={styles.detailField}>
                                    <label className={styles.detailLabel} htmlFor={`budget-${item.id}`}>
                                      {t.common.budget}
                                    </label>
                                    <select
                                      id={`budget-${item.id}`}
                                      value={item.budget || ""}
                                      onChange={(e) =>
                                        onUpdate(item.id, { budget: e.target.value })
                                      }
                                    >
                                      <option value="">{t.common.notSet}</option>
                                      {budgetChoices}
                                    </select>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="2" className={styles.emptyCategoryCell}>
                        {t.table.noItems}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
}