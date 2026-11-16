import { Link } from "react-router-dom";
import StarRating from "./StarRating.jsx";
import DeleteButton from "./DeleteButton.jsx";
import { TYPE_LABELS } from "../constants.js";
import styles from "./DestinationCard.module.css";

export default function DestinationCard({ destination, onToggle, onDelete, onRate }) {
  const { id, title, category, type, visited, rating = 0 } = destination;

  return (
    <li className={visited ? `${styles.destinationCard} ${styles.done}` : styles.destinationCard}>
      <div className={styles.cardRow}>
        {/* Stage 8: a div instead of a label, because the title is now a link;
            the checkbox gets an aria-label, so a screen reader knows what it ticks */}
        <div className={styles.cardMain}>
          <input
            type="checkbox"
            className="card-check"
            checked={visited}
            onChange={() => onToggle(id)}
            aria-label={`Mark ${title} as visited`}
          />

          <div className={styles.destinationDetails}>
            <h3>
              <Link to={`/destinations/${id}`} className={styles.titleLink}>
                {title}
              </Link>
            </h3>
            <p className={styles.destinationCategory}>{category}</p>

            <div className={styles.cardMeta}>
              <span className={`badge badge-${type}`}>{TYPE_LABELS[type] || type}</span>
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
