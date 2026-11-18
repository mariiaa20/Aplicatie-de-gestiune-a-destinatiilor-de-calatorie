import { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext.js";
import styles from "./StarRating.module.css";

// label: optional; without it the text is "Your rating" in the chosen language
export default function StarRating({ value = 0, onChange, label }) {
  const { t } = useLanguage();
  const [hovered, setHovered] = useState(0);
  const text = label ?? t.common.yourRating;
  const shown = hovered || value;

  return (
    <div
      className={styles.starRating}
      role="group"
      aria-label={text}
      onMouseLeave={() => setHovered(0)}
    >
      <span className={styles.starRatingLabel}>{text}</span>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={star <= shown ? `${styles.starBtn} ${styles.filled}` : styles.starBtn}
          aria-label={t.common.stars(star)}
          aria-pressed={star === value}
          onMouseEnter={() => setHovered(star)}
          onClick={() => onChange(star === value ? 0 : star)}
        >
          ★
        </button>
      ))}
    </div>
  );
}