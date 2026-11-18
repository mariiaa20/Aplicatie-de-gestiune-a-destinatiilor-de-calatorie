import DestinationCard from "./DestinationCard.jsx";
import { useLanguage } from "../i18n/LanguageContext.js";
import styles from "./DestinationList.module.css";

// Receives the list and the functions and passes them to each card, without changing anything.
export default function DestinationList({
  destinations,
  onToggle,
  onDelete,
  onRate,
  emptyMessage,
  firstIndex = 0 // the second page of a list keeps counting from the first, for the stamps
}) {
  const { t } = useLanguage();
  if (!destinations || destinations.length === 0) {
    return <p className="empty-message">{emptyMessage ?? t.common.noDestinations}</p>;
  }

  return (
    <ul className={styles.destinationsList}>
      {destinations.map((destination, index) => (
        <DestinationCard
          key={destination.id}
          stampIndex={firstIndex + index}
          destination={destination}
          onToggle={onToggle}
          onDelete={onDelete}
          onRate={onRate}
        />
      ))}
    </ul>
  );
}