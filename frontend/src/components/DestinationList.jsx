import DestinationCard from "./DestinationCard.jsx";

// Receives the list and the functions and passes them to each card, without changing anything.
export default function DestinationList({
  destinations,
  onToggle,
  onDelete,
  onRate,
  emptyMessage = "No destinations found."
}) {
  if (!destinations || destinations.length === 0) {
    return <p className="empty-message">{emptyMessage}</p>;
  }

  return (
    <ul className="destinations-list">
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