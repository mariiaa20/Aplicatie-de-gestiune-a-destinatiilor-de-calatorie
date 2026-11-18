import { Link } from "react-router-dom";
import StarRating from "./StarRating.jsx";
import DeleteButton from "./DeleteButton.jsx";
import { useLanguage } from "../i18n/LanguageContext.js";
import styles from "./DestinationCard.module.css";

// stampIndex: the place of the card in its list, so the stamps land one after another
export default function DestinationCard({ destination, onToggle, onDelete, onRate, stampIndex = 0 }) {
  const { id, title, category, type, visited, rating = 0 } = destination;
  const { t } = useLanguage();

  return (
    <li
      className={visited ? `${styles.destinationCard} ${styles.done}` : styles.destinationCard}
      data-stamp={t.detail.stamp}
      // the stamps of a list land one after another
      style={{ "--stamp-delay": `${150 + stampIndex * 140}ms` }}
    >
      <div className={styles.cardRow}>
        {/* Stage 8: a div instead of a label, because the title is now a link;
            the checkbox gets an aria-label, so a screen reader knows what it ticks */}
        <div className={styles.cardMain}>
          <input
            type="checkbox"
            className="card-check"
            checked={visited}
            onChange={() => onToggle(id)}
            aria-label={t.common.markVisited(title)}
          />

          <div className={styles.destinationDetails}>
            <h3>
              <Link to={`/destinations/${id}`} className={styles.titleLink}>
                {title}
              </Link>
            </h3>
            <p className={styles.destinationCategory}>{t.categories[category] || category}</p>

            <div className={styles.cardMeta}>
              <span className={`badge badge-${type}`}>{t.types[type] || type}</span>
            </div>
          </div>
        </div>

        {onDelete && <DeleteButton label={title} onDelete={() => onDelete(id)} />}
      </div>

      {visited && onRate && (
        <div className={styles.rating}>
          <StarRating value={rating} onChange={(value) => onRate(id, value)} />
        </div>
      )}
    </li>
  );
}
