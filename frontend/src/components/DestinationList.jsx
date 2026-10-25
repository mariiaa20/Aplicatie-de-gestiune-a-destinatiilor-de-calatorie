import DestinationCard from "./DestinationCard.jsx";

export default function DestinationList({
  destinations,
  onToggle,
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
          onRate={onRate}
        />
      ))}
    </ul>
  );
}