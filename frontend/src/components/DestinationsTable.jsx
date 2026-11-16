import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import DestinationAvatar from "./DestinationAvatar.jsx";
import DestinationPhoto from "./DestinationPhoto.jsx";
import DeleteButton from "./DeleteButton.jsx";
import {
  BUDGET_OPTIONS,
  MONTH_NAMES,
  formatPeriod,
  getBudget,
  periodIncludesMonth
} from "../utils/travelOptions.js";
import { LOCATION_TYPES } from "../constants.js";
import styles from "./DestinationsTable.module.css";

const MONTH_OPTIONS = MONTH_NAMES.map((name, index) => (
  <option key={name} value={String(index + 1)}>
    {name}
  </option>
));

const BUDGET_CHOICES = BUDGET_OPTIONS.map((budget) => (
  <option key={budget.key} value={budget.key}>
    {budget.label}
  </option>
));

// "Jun – Aug · €1–2k" shown under the destination name
const getMeta = (item) =>
  [formatPeriod(item.periodFrom, item.periodTo), getBudget(item.budget)?.short]
    .filter(Boolean)
    .join(" · ");

// Stage 7: the add form moved to DestinationForm. This table only shows,
// filters and edits the destinations; every change goes up to App.
export default function DestinationsTable({ destinations, onToggle, onDelete, onUpdate }) {
  const [expandedId, setExpandedId] = useState(null);
  const [budgetFilter, setBudgetFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");

  if (destinations.length === 0) {
    return (
      <p className="empty-message" data-testid="empty">
        No destinations yet. Add your first one with the form on the left.
      </p>
    );
  }

  const filtersActive = Boolean(budgetFilter || monthFilter);
  const visibleDestinations = destinations.filter(
    (d) =>
      (!budgetFilter || d.budget === budgetFilter) &&
      (!monthFilter || periodIncludesMonth(d.periodFrom, d.periodTo, monthFilter))
  );

  const clearFilters = () => {
    setBudgetFilter("");
    setMonthFilter("");
  };

  const toggleDetails = (event, id) => {
    event.stopPropagation(); // do not toggle visited when opening details
    setExpandedId((current) => (current === id ? null : id));
  };

  return (
    <div className={styles.myTravelListContainer}>
      <div className={styles.filterBar}>
        <div className={styles.filterField}>
          <label htmlFor="filter-budget">Budget</label>
          <select
            id="filter-budget"
            value={budgetFilter}
            onChange={(e) => setBudgetFilter(e.target.value)}
          >
            <option value="">Any budget</option>
            {BUDGET_CHOICES}
          </select>
        </div>

        <div className={styles.filterField}>
          <label htmlFor="filter-month">Travel month</label>
          <select
            id="filter-month"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
          >
            <option value="">Any month</option>
            {MONTH_OPTIONS}
          </select>
        </div>

        {filtersActive && (
          <>
            <span className={styles.filterCount}>
              {visibleDestinations.length} of {destinations.length} shown
            </span>
            <button type="button" className="btn btn-ghost btn-small" onClick={clearFilters}>
              Clear
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
                <span className={`badge badge-${cat.value}`}>{cat.label}</span>
                <span className={styles.columnCount}>{planned} planned</span>
              </div>

              <table className={styles.singleCategoryTable}>
                <thead>
                  <tr>
                    <th>Destination</th>
                    <th className={styles.thRight}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length > 0 ? (
                    items.map((item) => {
                      const isExpanded = expandedId === item.id;
                      const meta = getMeta(item);

                      return (
                        <Fragment key={item.id}>
                          {/* Stage 7: the data-testid attributes are only on this list,
                              which holds every destination, so each one is counted once */}
                          <tr
                            className={item.visited ? styles.rowIsVisited : undefined}
                            onClick={() => onToggle(item.id)}
                            title="Click to toggle status"
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
                                  onChange={() => onToggle(item.id)}
                                  onClick={(e) => e.stopPropagation()}
                                  aria-label={`Mark ${item.title} as visited`}
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
                                      Details <span className={styles.chev} aria-hidden="true">▾</span>
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
                                  }`}
                                >
                                  {item.visited ? "✓ Visited" : "○ Planned"}
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
                                    <span className={styles.detailLabel}>Desired period</span>
                                    <div className="detail-pair">
                                      <select
                                        aria-label={`From month for ${item.title}`}
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
                                        <option value="">From</option>
                                        {MONTH_OPTIONS}
                                      </select>
                                      <select
                                        aria-label={`To month for ${item.title}`}
                                        value={item.periodTo || ""}
                                        disabled={!item.periodFrom}
                                        onChange={(e) =>
                                          onUpdate(item.id, { periodTo: e.target.value })
                                        }
                                      >
                                        <option value="">To</option>
                                        {MONTH_OPTIONS}
                                      </select>
                                    </div>
                                  </div>

                                  <div className={styles.detailField}>
                                    <label className={styles.detailLabel} htmlFor={`budget-${item.id}`}>
                                      Budget
                                    </label>
                                    <select
                                      id={`budget-${item.id}`}
                                      value={item.budget || ""}
                                      onChange={(e) =>
                                        onUpdate(item.id, { budget: e.target.value })
                                      }
                                    >
                                      <option value="">Not set</option>
                                      {BUDGET_CHOICES}
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
                        No items
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