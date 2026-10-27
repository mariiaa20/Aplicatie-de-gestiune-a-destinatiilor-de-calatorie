import StarRating from "./StarRating.jsx";
import DeleteButton from "./DeleteButton.jsx";

const TYPE_LABELS = {
  "city-break": "City Break",
  beach: "Beach",
  mountain: "Mountain"
};

export default function DestinationCard({ destination, onToggle, onDelete, onRate }) {
  const { id, title, category, type, visited, rating = 0 } = destination;

  return (
    <li className={visited ? "destination-card done" : "destination-card"}>
      <div className="card-row">
        {/* the label wraps checkbox + text, so clicking the title ticks the box too */}
        <label className="card-main">
          <input
            type="checkbox"
            className="card-check"
            checked={visited}
            onChange={() => onToggle(id)}
          />

          <div className="destination-details">
            <h3>{title}</h3>
            <p className="destination-category">{category}</p>

            <div className="card-meta">
              <span className={`badge badge-${type}`}>
                {TYPE_LABELS[type] || type}
              </span>
            </div>
          </div>
        </label>

        {onDelete && <DeleteButton label={title} onDelete={() => onDelete(id)} />}
      </div>

      {/* outside the label: inside it, clicking a star would also toggle the checkbox */}
      {visited && onRate && (
        <StarRating value={rating} onChange={(value) => onRate(id, value)} />
      )}
    </li>
  );
}