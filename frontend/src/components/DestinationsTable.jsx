import { Fragment, useState } from "react";
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

const CATEGORIES = [
  { key: "city-break", label: "City Break", badgeClass: "badge-city-break" },
  { key: "beach", label: "Beach", badgeClass: "badge-beach" },
  { key: "mountain", label: "Mountain", badgeClass: "badge-mountain" }
];

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
    <div className="my-travel-list-container">
      <div className="filter-bar">
        <div className="filter-field">
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

        <div className="filter-field">
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
            <span className="filter-count">
              {visibleDestinations.length} of {destinations.length} shown
            </span>
            <button type="button" className="btn btn-ghost btn-small" onClick={clearFilters}>
              Clear
            </button>
          </>
        )}
      </div>

      <div className="side-by-side-grid">
        {CATEGORIES.map((cat) => {
          const items = visibleDestinations.filter((d) => d.type === cat.key);
          const planned = items.filter((d) => !d.visited).length;

          return (
            <div key={cat.key} className="category-column">
              <div className="column-header">
                <span className={`badge ${cat.badgeClass}`}>{cat.label}</span>
                <span className="column-count">{planned} planned</span>
              </div>

              <table className="single-category-table">
                <thead>
                  <tr>
                    <th>Destination</th>
                    <th className="th-right">Status</th>
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
                            className={item.visited ? "row-is-visited" : ""}
                            onClick={() => onToggle(item.id)}
                            title="Click to toggle status"
                            data-testid="item"
                            data-id={item.id}
                          >
                            <td className="dest-title-cell">
                              <div className="title-cell-inner">
                                {/* controlled checkbox: shows what the data says, changes it on click */}
                                <input
                                  type="checkbox"
                                  className="row-check"
                                  checked={item.visited}
                                  onChange={() => onToggle(item.id)}
                                  onClick={(e) => e.stopPropagation()}
                                  aria-label={`Mark ${item.title} as visited`}
                                  data-testid="item-toggle"
                                />
                                <DestinationAvatar title={item.title} photo={item.photo} />
                                <div className="title-cell-text">
                                  <span className="dest-text" data-testid="item-title">
                                    {item.title}
                                  </span>
                                  <span className="dest-sub">
                                    {meta && <span>{meta}</span>}
                                    <button
                                      type="button"
                                      className="details-link"
                                      aria-expanded={isExpanded}
                                      onClick={(e) => toggleDetails(e, item.id)}
                                    >
                                      Details <span className="chev" aria-hidden="true">▾</span>
                                    </button>
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="th-right">
                              <div className="status-cell">
                                <span className={`status-pill ${item.visited ? "pill-visited" : "pill-planned"}`}>
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
                            <tr className="detail-row">
                              <td colSpan="2">
                                <div className="detail-box">
                                  <DestinationPhoto title={item.title} photo={item.photo} />
                                  {item.highlight && (
                                    <p className="detail-highlight">{item.highlight}</p>
                                  )}

                                  <div className="detail-field">
                                    <span className="detail-label">Desired period</span>
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

                                  <div className="detail-field">
                                    <label className="detail-label" htmlFor={`budget-${item.id}`}>
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
                      <td colSpan="2" className="empty-category-cell">
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