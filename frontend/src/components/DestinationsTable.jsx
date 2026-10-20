const CATEGORIES = [
  { key: "city-break", label: "City Break", badgeClass: "badge-city-break" },
  { key: "beach", label: "Beach", badgeClass: "badge-beach" },
  { key: "mountain", label: "Mountain", badgeClass: "badge-mountain" }
];

export default function DestinationsTable({ destinations, onToggle }) {
  return (
    <div className="my-travel-list-container">
      <h2 className="card-title">My Travel List</h2>
      
      <div className="side-by-side-grid">
        {CATEGORIES.map((cat) => {
          const items = destinations.filter((d) => d.type === cat.key);
          const planned = items.filter((d) => !d.visited).length;

          return (
            <div key={cat.key} className="category-column">
              <div className="column-header">
                <span className={`badge ${cat.badgeClass}`}>{cat.label}</span>
                <span className="column-count">{planned} planned</span>
              </div>

              <table className="single-category-table">
                <thead>
                  <tr>
                    <th>Destination</th>
                    <th className="th-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length > 0 ? (
                    items.map((item) => (
                      <tr
                        key={item.id}
                        className={item.visited ? "row-is-visited" : ""}
                        onClick={() => onToggle && onToggle(item.id)}
                        title="Click to toggle status"
                      >
                        <td className="dest-title-cell">
                          <span className="dest-text">{item.title}</span>
                        </td>
                        <td className="th-right">
                          <span className={`status-pill ${item.visited ? "pill-visited" : "pill-planned"}`}>
                            {item.visited ? "✓ Visited" : "○ Planned"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="empty-category-cell">
                        No items
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
}