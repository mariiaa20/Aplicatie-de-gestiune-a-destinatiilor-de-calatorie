import './App.css'

const initialDestinations = [
  {
    id: 1,
    title: "Tokyo, Japan",
    visited: false,
    type: "city-break",
    category: "Vacation"
  },
  {
    id: 2,
    title: "Santorini, Greece",
    visited: true,
    type: "beach",
    category: "Vacation"
  },
  {
    id: 3,
    title: "Banff National Park",
    visited: false,
    type: "mountain",
    category: "Vacation"
  }
];

function App() {
  const appName = "Travel Destinations Manager";
  const totalCount = initialDestinations.length;
  const plannedCount = initialDestinations.filter(d => !d.visited).length;

  return (
    <>
      <header className="header-section">
        <h1>{appName}</h1>
        <p>Manage and organize your travel destinations.</p>
        <div className="badge-counter">
          {totalCount} destinations, {plannedCount} planned
        </div>
      </header>

      <div className="card-container">
        <h2 className="card-title">My Destinations</h2>
        <span className="plane-badge" role="img" aria-label="airplane">✈️</span>
        <pre className="raw-json">
          {JSON.stringify(initialDestinations, null, 2)}
        </pre>
      </div>
    </>
  );
}

export default App;