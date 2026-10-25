import { Fragment, useRef, useState } from "react";
import DestinationAvatar from "./DestinationAvatar.jsx";
import DestinationPhoto from "./DestinationPhoto.jsx";
import { useWikiPhoto } from "../hooks/useWikiPhoto.js";
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

const TRIP_CATEGORIES = ["Vacation", "Business"];
const MAX_PHOTO_BYTES = 2 * 1024 * 1024;

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

export default function DestinationsTable({ destinations, onToggle, onAdd, onUpdate }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState(CATEGORIES[0].key);
  const [category, setCategory] = useState(TRIP_CATEGORIES[0]);
  const [periodFrom, setPeriodFrom] = useState("");
  const [periodTo, setPeriodTo] = useState("");
  const [budget, setBudget] = useState("");
  const [highlight, setHighlight] = useState("");
  const [uploadedPhoto, setUploadedPhoto] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [budgetFilter, setBudgetFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const fileInputRef = useRef(null);

  // live photo preview while typing the name (waits 600 ms after the last key)
  const autoPhoto = useWikiPhoto(title, isFormOpen && !uploadedPhoto, 600);

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

  const resetForm = () => {
    setTitle("");
    setType(CATEGORIES[0].key);
    setCategory(TRIP_CATEGORIES[0]);
    setPeriodFrom("");
    setPeriodTo("");
    setBudget("");
    setHighlight("");
    setUploadedPhoto("");
    setPhotoError("");
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCancel = () => {
    resetForm();
    setIsFormOpen(false);
  };

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPhotoError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setPhotoError("The image is too large (max 2 MB).");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedPhoto(reader.result);
      setPhotoError("");
    };
    reader.readAsDataURL(file);
  };

  const removeUploadedPhoto = () => {
    setUploadedPhoto("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = title.trim();

    if (!trimmed) {
      setError("Please enter a destination name.");
      return;
    }

    onAdd({
      title: trimmed,
      type,
      category,
      periodFrom,
      periodTo,
      budget,
      highlight: highlight.trim(),
      photo: uploadedPhoto
    });
    resetForm();
    setIsFormOpen(false);
  };

  const toggleDetails = (event, id) => {
    event.stopPropagation(); // do not toggle visited when opening details
    setExpandedId((current) => (current === id ? null : id));
  };

  return (
    <div className="my-travel-list-container">
      <div className="list-header">
        <h2 className="card-title">My Travel List</h2>
        <button
          type="button"
          className="btn btn-primary"
          aria-expanded={isFormOpen}
          onClick={() => (isFormOpen ? handleCancel() : setIsFormOpen(true))}
        >
          {isFormOpen ? "Close" : "+ Add destination"}
        </button>
      </div>

      {isFormOpen && (
        <form className="add-form" onSubmit={handleSubmit} noValidate>
          <div className="field field-wide">
            <label htmlFor="dest-title">Destination name</label>
            <input
              id="dest-title"
              type="text"
              maxLength={100}
              placeholder="e.g. Lisbon, Portugal"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError("");
              }}
              autoFocus
            />
          </div>

          <div className="field field-wide">
            <span className="field-label">Photo</span>
            <div className="photo-picker">
              <div className="photo-preview">
                {uploadedPhoto ? (
                  <figure className="dest-photo">
                    <img src={uploadedPhoto} alt="Your uploaded photo" />
                  </figure>
                ) : autoPhoto.status === "found" ? (
                  <figure className="dest-photo">
                    <img src={autoPhoto.photo.url} alt={`${title} preview`} />
                    <figcaption>Photo: Wikipedia</figcaption>
                  </figure>
                ) : autoPhoto.status === "loading" ? (
                  <div className="dest-photo dest-photo-loading" aria-hidden="true" />
                ) : (
                  <div className="photo-empty">
                    {autoPhoto.status === "missing"
                      ? "No photo found for this name."
                      : "Type a name to see a photo."}
                  </div>
                )}
              </div>

              <div className="photo-actions">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFile}
                />
                <button
                  type="button"
                  className="btn btn-ghost btn-small"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload your own
                </button>
                {uploadedPhoto && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-small"
                    onClick={removeUploadedPhoto}
                  >
                    Remove
                  </button>
                )}
                <p className="photo-hint">
                  A photo is found automatically on Wikipedia, or upload your own (max 2 MB).
                </p>
                {photoError && <p className="photo-error" role="alert">{photoError}</p>}
              </div>
            </div>
          </div>

          <div className="field">
            <label htmlFor="dest-type">Location type</label>
            <select
              id="dest-type"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.key} value={cat.key}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="dest-category">Trip category</label>
            <select
              id="dest-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {TRIP_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="dest-from">Desired period (optional)</label>
            <div className="detail-pair">
              <select
                id="dest-from"
                aria-label="From month"
                value={periodFrom}
                onChange={(e) => {
                  setPeriodFrom(e.target.value);
                  if (!e.target.value) setPeriodTo("");
                }}
              >
                <option value="">From</option>
                {MONTH_OPTIONS}
              </select>
              <select
                aria-label="To month"
                value={periodTo}
                disabled={!periodFrom}
                onChange={(e) => setPeriodTo(e.target.value)}
              >
                <option value="">To</option>
                {MONTH_OPTIONS}
              </select>
            </div>
          </div>

          <div className="field">
            <label htmlFor="dest-budget">Budget (optional)</label>
            <select
              id="dest-budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            >
              <option value="">Not set</option>
              {BUDGET_CHOICES}
            </select>
          </div>

          <div className="field field-wide">
            <label htmlFor="dest-highlight">Why go there? (optional)</label>
            <input
              id="dest-highlight"
              type="text"
              maxLength={140}
              placeholder="e.g. Tram rides, tiled streets and sunset viewpoints"
              value={highlight}
              onChange={(e) => setHighlight(e.target.value)}
            />
          </div>

          {error && <p className="form-error" role="alert">{error}</p>}

          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add
            </button>
          </div>
        </form>
      )}

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
                          <tr
                            className={item.visited ? "row-is-visited" : ""}
                            onClick={() => onToggle && onToggle(item.id)}
                            title="Click to toggle status"
                          >
                            <td className="dest-title-cell">
                              <div className="title-cell-inner">
                                <DestinationAvatar title={item.title} photo={item.photo} />
                                <div className="title-cell-text">
                                  <span className="dest-text">{item.title}</span>
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
                              <span className={`status-pill ${item.visited ? "pill-visited" : "pill-planned"}`}>
                                {item.visited ? "✓ Visited" : "○ Planned"}
                              </span>
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