import StarRating from "./StarRating.jsx";

const TYPE_LABELS = {
  "city-break": "City Break",
  beach: "Beach",
  mountain: "Mountain"
};

export default function DestinationCard({ destination, onToggle, onRate }) {
  const { id, title, category, type, visited, rating = 0 } = destination;

  return (
    <li className={visited ? "destination-card done" : "destination-card"}>
      <div className="destination-details">
        <h3>{title}</h3>
        <p className="destination-category">{category}</p>

        <div className="card-meta">
          <span className={`badge badge-${type}`}>
            {TYPE_LABELS[type] || type}
          </span>
        </div>

        {visited && onRate && (
          <StarRating value={rating} onChange={(value) => onRate(id, value)} />
        )}
      </div>

      <button
        type="button"
        className="toggle-btn"
        onClick={() => onToggle(id)}
        title={visited ? "Move back to planned" : "Mark as visited"}
      >
        {visited ? "✓ Visited" : "○ Planned"}
      </button>
    </li>
  );
}