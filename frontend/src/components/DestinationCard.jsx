const TYPE_LABELS = {
  "city-break": "City Break",
  beach: "Beach",
  mountain: "Mountain"
};

export default function DestinationCard({ destination }) {
  return (
    <li className={destination.visited ? "destination-card done" : "destination-card"}>
      <div className="destination-info">
        <h3>{destination.title}</h3>
        <p className="destination-category">{destination.category}</p>
        <span className={`badge badge-${destination.type}`}>
          {TYPE_LABELS[destination.type] || destination.type}
        </span>
      </div>
      <span className="destination-status">
        {destination.visited ? "Visited" : "Planned"}
      </span>
    </li>
  );
}