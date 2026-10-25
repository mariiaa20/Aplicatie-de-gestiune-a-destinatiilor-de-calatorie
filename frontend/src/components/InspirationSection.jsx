import DestinationPhoto from "./DestinationPhoto.jsx";
import { getBudget } from "../utils/travelOptions.js";

const TYPE_LABELS = {
  "city-break": "City Break",
  beach: "Beach",
  mountain: "Mountain"
};

// Rough budgets per trip, you can change them after adding a destination
const SUGGESTIONS = [
  {
    title: "Lisbon, Portugal",
    type: "city-break",
    budget: "500-1000",
    highlight: "Tiled streets, tram rides and sunset viewpoints."
  },
  {
    title: "Kyoto, Japan",
    type: "city-break",
    budget: "over-2000",
    highlight: "Quiet temples, tea houses and bamboo groves."
  },
  {
    title: "Reykjavik, Iceland",
    type: "city-break",
    budget: "1000-2000",
    highlight: "Hot springs, volcanic landscapes and northern lights."
  },
  {
    title: "Dubrovnik, Croatia",
    type: "city-break",
    budget: "500-1000",
    highlight: "A walled old town above the Adriatic."
  },
  {
    title: "Maldives",
    type: "beach",
    budget: "over-2000",
    highlight: "Overwater villas and turquoise lagoons."
  },
  {
    title: "Bali, Indonesia",
    type: "beach",
    budget: "1000-2000",
    highlight: "Rice terraces, temples and surf beaches."
  },
  {
    title: "Swiss Alps",
    type: "mountain",
    budget: "over-2000",
    highlight: "Scenic trains, glacier views and storybook villages."
  },
  {
    title: "Dolomites, Italy",
    type: "mountain",
    budget: "500-1000",
    highlight: "Jagged peaks, mountain huts and alpine lakes."
  }
];

export default function InspirationSection({ destinations, onAdd }) {
  const isAdded = (title) =>
    destinations.some((d) => d.title.toLowerCase() === title.toLowerCase());

  return (
    <>
      <h2 className="card-title">Get inspired</h2>
      <p className="inspire-subtitle">
        Ideas for your next trip. Add one to My Travel List, then set your own period.
      </p>

      <div className="inspire-grid">
        {SUGGESTIONS.map((suggestion) => {
          const added = isAdded(suggestion.title);

          return (
            <article key={suggestion.title} className="inspire-card">
              <DestinationPhoto title={suggestion.title} />

              <div className="card-meta">
                <span className={`badge badge-${suggestion.type}`}>
                  {TYPE_LABELS[suggestion.type]}
                </span>
                <span className="chip">{getBudget(suggestion.budget).label}</span>
              </div>

              <h3 className="inspire-title">{suggestion.title}</h3>
              <p className="inspire-text">{suggestion.highlight}</p>

              <button
                type="button"
                className="btn btn-primary"
                disabled={added}
                onClick={() =>
                  onAdd({
                    title: suggestion.title,
                    type: suggestion.type,
                    category: "Vacation",
                    periodFrom: "",
                    periodTo: "",
                    budget: suggestion.budget,
                    highlight: suggestion.highlight,
                    photo: ""
                  })
                }
              >
                {added ? "✓ Added" : "+ Add"}
              </button>
            </article>
          );
        })}
      </div>
    </>
  );
}