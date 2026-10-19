const destinations = [
  { id: 1, title: "Paris", visited: false, type: "city-break", category: "Vacation" },
  { id: 2, title: "Maldives", visited: true, type: "beach", category: "Vacation" },
  { id: 3, title: "Swiss Alps", visited: false, type: "mountain", category: "Vacation" }
];

export default function App() {
  const plannedCount = destinations.filter((d) => !d.visited).length;

  return (
    <>
      <header className="app-header">
        <h1>Travel Destinations Manager</h1>
        <p>Organize, track, and plan your travel destinations.</p>
        <p className="app-count">
          {destinations.length} destinations, {plannedCount} planned
        </p>
      </header>

      <main className="container">
        <section className="panel">
          <h2>My Destinations</h2>
          <pre>{JSON.stringify(destinations, null, 2)}</pre>
        </section>
      </main>
    </>
  );
}