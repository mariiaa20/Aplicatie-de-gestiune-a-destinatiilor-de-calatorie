import DestinationCard from "./DestinationCard.jsx";
import { useLanguage } from "../i18n/LanguageContext.js";
import styles from "./DestinationList.module.css";

// Receives the list and the functions and passes them to each card, without changing anything.
export default function DestinationList({
  destinations,
  onToggle,
  onDelete,
  onRate,
  emptyMessage
}) {
  const { t } = useLanguage();
  if (!destinations || destinations.length === 0) {
    return <p className="empty-message">{emptyMessage ?? t.common.noDestinations}</p>;
  }

  return (
    <ul className={styles.destinationsList}>
      {destinations.map((destination) => (
        <DestinationCard
          key={destination.id}
          destination={destination}
          onToggle={onToggle}
          onDelete={onDelete}
          onRate={onRate}
        />
      ))}
    </ul>
  );
}