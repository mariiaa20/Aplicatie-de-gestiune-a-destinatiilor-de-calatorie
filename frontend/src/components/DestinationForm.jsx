import { useRef, useState } from "react";
import { useWikiPhoto } from "../hooks/useWikiPhoto.js";
import { BUDGET_OPTIONS } from "../utils/travelOptions.js";
import { LOCATION_TYPES, TRIP_CATEGORIES } from "../constants.js";
import { useLanguage } from "../i18n/LanguageContext.js";
import styles from "./DestinationForm.module.css";
// the preview uses the same frame as the photos in the rest of the app
import photoStyles from "./DestinationPhoto.module.css";

const TITLE_MAX = 100;
const HIGHLIGHT_MAX = 140;
const MAX_FILE_BYTES = 10 * 1024 * 1024;

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
      reject(new Error("unreadable")); // mesajul pentru utilizator e ales în handleFile
    };
    img.src = url;
  });
}

// Controlled form: React state is the source of truth for every field
export default function DestinationForm({ onAdd, existingTitles = [] }) {
  const { t } = useLanguage();
  const errors = t.form.errors;
  const [title, setTitle] = useState("");
  const [type, setType] = useState(LOCATION_TYPES[0].value);
  const [category, setCategory] = useState(TRIP_CATEGORIES[0]);
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

  // lunile, în limba aleasă; value rămâne numărul lunii, la fel în ambele limbi
  const monthOptions = t.months.map((name, index) => (
    <option key={index} value={String(index + 1)}>
      {name}
    </option>
  ));

  // Returns the error message, or "" when the data is fine
  function validate() {
    const name = title.trim();
    if (name === "") return errors.required;
    if (name.length > TITLE_MAX) return errors.tooLong(TITLE_MAX);
    // Extra rule of the theme: a place has a name made of letters, not only digits or symbols
    if (!/\p{L}/u.test(name)) return errors.noLetter;
    // Extra rule of the theme: the same place cannot be planned twice
    const taken = existingTitles.some(
      (existing) => existing.trim().toLowerCase() === name.toLowerCase()
    );
    if (taken) return errors.taken(name);
    if (highlight.trim().length > HIGHLIGHT_MAX) {
      return errors.whyTooLong(HIGHLIGHT_MAX);
    }
    return "";
  }

  function resetForm() {
    setTitle("");
    setType(LOCATION_TYPES[0].value);
    setCategory(TRIP_CATEGORIES[0]);
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
      setError(errors.saveFailed(err.message));
    } finally {
      setSaving(false);
    }
  }

  async function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPhotoError(errors.notImage);
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setPhotoError(errors.tooLarge);
      return;
    }

    try {
      setUploadedPhoto(await resizeImage(file));
      setPhotoError("");
    } catch {
      setPhotoError(errors.unreadable);
    }
  }

  function removeUploadedPhoto() {
    setUploadedPhoto("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <form
      className={styles.destinationForm}
      onSubmit={handleSubmit}
      noValidate
      data-testid="form"
    >
      <div className={styles.field}>
        <label htmlFor="dest-title">{t.form.name}</label>
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
          placeholder={t.form.namePlaceholder}
          maxLength={TITLE_MAX}
          aria-invalid={invalid}
          aria-describedby={error ? "dest-form-error" : undefined}
          data-testid="form-title"
        />
      </div>

      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label htmlFor="dest-type">{t.form.type}</label>
          <select
            id="dest-type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            data-testid="form-type"
          >
            {LOCATION_TYPES.map((option) => (
              <option key={option.value} value={option.value}>
                {t.types[option.value]}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="dest-category">{t.form.category}</label>
          <select
            id="dest-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            data-testid="form-category"
          >
            {/* value rămâne "Vacation" / "Business", ca în db.json; doar textul se traduce */}
            {TRIP_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {t.categories[c]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="dest-from">{t.form.period}</label>
        <div className="detail-pair">
          <select
            id="dest-from"
            aria-label={t.common.fromMonth}
            value={periodFrom}
            onChange={(e) => {
              setPeriodFrom(e.target.value);
              if (!e.target.value) setPeriodTo("");
            }}
            data-testid="form-periodFrom"
          >
            <option value="">{t.common.from}</option>
            {monthOptions}
          </select>
          <select
            aria-label={t.common.toMonth}
            value={periodTo}
            disabled={!periodFrom}
            onChange={(e) => setPeriodTo(e.target.value)}
            data-testid="form-periodTo"
          >
            <option value="">{t.common.to}</option>
            {monthOptions}
          </select>
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="dest-budget">{t.form.budget}</label>
        <select
          id="dest-budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          data-testid="form-budget"
        >
          <option value="">{t.common.notSet}</option>
          {BUDGET_OPTIONS.map((b) => (
            <option key={b.key} value={b.key}>
              {t.budgets[b.key].label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="dest-highlight">{t.form.why}</label>
        <input
          id="dest-highlight"
          type="text"
          value={highlight}
          onChange={(e) => setHighlight(e.target.value)}
          placeholder={t.form.whyPlaceholder}
          maxLength={HIGHLIGHT_MAX}
          data-testid="form-highlight"
        />
      </div>

      <div className={styles.field}>
        <span className={styles.fieldLabel}>{t.form.photo}</span>
        <div className={styles.photoPicker}>
          <div className={styles.photoPreview}>
            {uploadedPhoto ? (
              <figure className={photoStyles.destPhoto}>
                <img src={uploadedPhoto} alt={t.form.uploadedAlt} />
              </figure>
            ) : autoPhoto.status === "found" ? (
              <figure className={photoStyles.destPhoto}>
                <img src={autoPhoto.photo.url} alt={t.form.previewAlt(title)} />
                <figcaption>{t.common.photoCredit}</figcaption>
              </figure>
            ) : autoPhoto.status === "loading" ? (
              <div
                className={`${photoStyles.destPhoto} ${photoStyles.destPhotoLoading}`}
                aria-hidden="true"
              />
            ) : (
              <div className={styles.photoEmpty}>
                {autoPhoto.status === "missing" ? t.form.noPhoto : t.form.typeForPhoto}
              </div>
            )}
          </div>

          <div className={styles.photoActions}>
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
              {t.form.upload}
            </button>
            {uploadedPhoto && (
              <button
                type="button"
                className="btn btn-ghost btn-small"
                onClick={removeUploadedPhoto}
              >
                {t.form.remove}
              </button>
            )}
            {photoError && <p className={styles.photoError} role="alert">{photoError}</p>}
          </div>
        </div>
      </div>

      {error && (
        <p
          id="dest-form-error"
          className={styles.formError}
          role="alert"
          data-testid="form-error"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        className={`btn btn-primary ${styles.formSubmit}`}
        disabled={saving}
        data-testid="form-submit"
      >
        {saving ? t.common.saving : t.form.submit}
      </button>
    </form>
  );
}