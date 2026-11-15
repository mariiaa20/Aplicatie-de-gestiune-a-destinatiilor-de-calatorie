import { useRef, useState } from "react";
import { useWikiPhoto } from "../hooks/useWikiPhoto.js";
import { BUDGET_OPTIONS, MONTH_NAMES } from "../utils/travelOptions.js";

// ADAPT: the fields and the fixed values of the travel theme
const TYPES = [
  { value: "city-break", label: "City Break" },
  { value: "beach", label: "Beach" },
  { value: "mountain", label: "Mountain" }
];
const CATEGORIES = ["Vacation", "Business"];
const TITLE_MAX = 100;
const HIGHLIGHT_MAX = 140;
const MAX_FILE_BYTES = 10 * 1024 * 1024;

const MONTH_OPTIONS = MONTH_NAMES.map((name, index) => (
  <option key={name} value={String(index + 1)}>
    {name}
  </option>
));

// The photo is saved in db.json as text, so it is shrunk first:
// a phone photo of 4 MB becomes about 100 KB.
function resizeImage(file, maxSide = 800) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.8));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("This image could not be read."));
    };
    img.src = url;
  });
}

// Controlled form: React state is the source of truth for every field
export default function DestinationForm({ onAdd, existingTitles = [] }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState(TYPES[0].value);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [periodFrom, setPeriodFrom] = useState("");
  const [periodTo, setPeriodTo] = useState("");
  const [budget, setBudget] = useState("");
  const [highlight, setHighlight] = useState("");
  const [uploadedPhoto, setUploadedPhoto] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [error, setError] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  // live photo preview while typing the name (waits 600 ms after the last key)
  const autoPhoto = useWikiPhoto(title, !uploadedPhoto, 600);

  // Returns the error message, or "" when the data is fine
  function validate() {
    const t = title.trim();
    if (t === "") return "The destination name is required.";
    if (t.length > TITLE_MAX) return `The name can have at most ${TITLE_MAX} characters.`;
    // Extra rule of the theme: a place has a name made of letters, not only digits or symbols
    if (!/\p{L}/u.test(t)) return "The name must contain at least one letter.";
    // Extra rule of the theme: the same place cannot be planned twice
    const taken = existingTitles.some(
      (existing) => existing.trim().toLowerCase() === t.toLowerCase()
    );
    if (taken) return `"${t}" is already in your travel list.`;
    if (highlight.trim().length > HIGHLIGHT_MAX) {
      return `The description can have at most ${HIGHLIGHT_MAX} characters.`;
    }
    return "";
  }

  function resetForm() {
    setTitle("");
    setType(TYPES[0].value);
    setCategory(CATEGORIES[0]);
    setPeriodFrom("");
    setPeriodTo("");
    setBudget("");
    setHighlight("");
    setUploadedPhoto("");
    setPhotoError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e) {
    e.preventDefault(); // stops the page from reloading
    const message = validate();
    if (message) {
      setError(message);
      setInvalid(true);
      return; // nothing is sent
    }
    setError("");
    setInvalid(false);
    setSaving(true);
    try {
      await onAdd({
        title: title.trim(),
        type,
        category,
        periodFrom,
        periodTo,
        budget,
        highlight: highlight.trim(),
        photo: uploadedPhoto
      });
      resetForm(); // only after the server confirmed the save
    } catch (err) {
      // the text stays in the fields, so the user can try again
      setError(`Could not save the destination: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPhotoError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setPhotoError("The image is too large (max 10 MB).");
      return;
    }

    try {
      setUploadedPhoto(await resizeImage(file));
      setPhotoError("");
    } catch (err) {
      setPhotoError(err.message);
    }
  }

  function removeUploadedPhoto() {
    setUploadedPhoto("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <form
      className="destination-form"
      onSubmit={handleSubmit}
      noValidate
      data-testid="form"
    >
      <div className="field">
        <label htmlFor="dest-title">Destination name</label>
        <input
          id="dest-title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (invalid) {
              setInvalid(false);
              setError("");
            }
          }}
          placeholder="e.g. Lisbon, Portugal"
          maxLength={TITLE_MAX}
          aria-invalid={invalid}
          aria-describedby={error ? "dest-form-error" : undefined}
          data-testid="form-title"
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="dest-type">Location type</label>
          <select
            id="dest-type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            data-testid="form-type"
          >
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
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
            data-testid="form-category"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
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
            data-testid="form-periodFrom"
          >
            <option value="">From</option>
            {MONTH_OPTIONS}
          </select>
          <select
            aria-label="To month"
            value={periodTo}
            disabled={!periodFrom}
            onChange={(e) => setPeriodTo(e.target.value)}
            data-testid="form-periodTo"
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
          data-testid="form-budget"
        >
          <option value="">Not set</option>
          {BUDGET_OPTIONS.map((b) => (
            <option key={b.key} value={b.key}>
              {b.label}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="dest-highlight">Why go there? (optional)</label>
        <input
          id="dest-highlight"
          type="text"
          value={highlight}
          onChange={(e) => setHighlight(e.target.value)}
          placeholder="e.g. Tram rides and sunset viewpoints"
          maxLength={HIGHLIGHT_MAX}
          data-testid="form-highlight"
        />
      </div>

      <div className="field">
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
            {/* a file input cannot be controlled: the browser keeps the file, not React */}
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
            {photoError && <p className="photo-error" role="alert">{photoError}</p>}
          </div>
        </div>
      </div>

      {error && (
        <p
          id="dest-form-error"
          className="form-error"
          role="alert"
          data-testid="form-error"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        className="btn btn-primary form-submit"
        disabled={saving}
        data-testid="form-submit"
      >
        {saving ? "Saving…" : "Add destination"}
      </button>
    </form>
  );
}