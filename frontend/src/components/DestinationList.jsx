import DestinationCard from "./DestinationCard.jsx";

export default function DestinationList({ destinations, onToggle }) {
  if (!destinations || destinations.length === 0) {
    return <p className="empty-message">No destinations found.</p>;
  }

  return (
    <ul className="destinations-list">
      {destinations.map((destination) => (
        <DestinationCard 
          key={destination.id} 
          destination={destination} 
          onToggle={onToggle}
        />
      ))}
    </ul>
  );
}