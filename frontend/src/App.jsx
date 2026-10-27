import { useState } from 'react';
import './App.css';
import DestinationList from './components/DestinationList.jsx';
import DestinationsTable from './components/DestinationsTable.jsx';
import InspirationSection from './components/InspirationSection.jsx';

const initialDestinations = [
  {
    id: 1,
    title: "Tokyo, Japan",
    visited: false,
    type: "city-break",
    category: "Vacation",
    rating: 0,
    periodFrom: "4",
    periodTo: "",
    budget: "over-2000",
    highlight: "Temples, street food and neon nights, with cherry blossoms in spring."
  },
  {
    id: 2,
    title: "Santorini, Greece",
    visited: true,
    type: "beach",
    category: "Vacation",
    rating: 4,
    periodFrom: "",
    periodTo: "",
    budget: "500-1000",
    highlight: "Whitewashed villages and caldera sunsets in Oia."
  },
  {
    id: 3,
    title: "Banff National Park",
    visited: false,
    type: "mountain",
    category: "Vacation",
    rating: 0,
    periodFrom: "6",
    periodTo: "8",
    budget: "1000-2000",
    highlight: "Turquoise lakes and Rocky Mountain trails, with skiing in winter."
  }
];

// Starting theme: the one set in the operating system.
// Passed to useState without parentheses, so React calls it only on the first render.
function getInitialTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function App() {
  const [destinations, setDestinations] = useState(initialDestinations);
  const [theme, setTheme] = useState(getInitialTheme);

  const appName = "Travel Destinations Manager";

  // Derived values: recalculated on every render, never kept in state
  const totalCount = destinations.length;
  const plannedCount = destinations.filter((d) => !d.visited).length;
  const visitedDestinations = destinations.filter((d) => d.visited);

  // Immutable update: new list, new object only for the changed item
  const handleToggleVisited = (id) => {
    setDestinations((prev) =>
      prev.map((dest) =>
        dest.id === id ? { ...dest, visited: !dest.visited } : dest
      )
    );
  };

  // Immutable delete: filter builds a new list without that item
  const handleDeleteDestination = (id) => {
    setDestinations((prev) => prev.filter((dest) => dest.id !== id));
  };

  // Changes some fields of one destination (period, budget, rating...)
  const handleUpdateDestination = (id, changes) => {
    setDestinations((prev) =>
      prev.map((dest) => (dest.id === id ? { ...dest, ...changes } : dest))
    );
  };

  const handleRateDestination = (id, rating) =>
    handleUpdateDestination(id, { rating });

  // Adds a new destination without mutating the previous array
  const handleAddDestination = (details) => {
    setDestinations((prev) => {
      const nextId = prev.reduce((max, d) => Math.max(max, d.id), 0) + 1;
      return [...prev, { ...details, id: nextId, visited: false, rating: 0 }];
    });
  };

  // Theme switch: state keeps the button label, the data-theme attribute drives the CSS
  const handleToggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
  };

  return (
    <>
      <span className="plane-badge" role="img" aria-label="airplane">✈️</span>

      {/* outside <header>: its backdrop-filter would anchor a fixed button to the
          header instead of to the page */}
      <button
        type="button"
        className="theme-toggle"
        onClick={handleToggleTheme}
        aria-pressed={theme === "dark"}
      >
        {theme === "dark" ? "☀️ Light mode" : "🌙 Dark mode"}
      </button>

      <header className="header-section">
        <h1>{appName}</h1>
        <p>Manage and organize your travel destinations.</p>
        <div className="badge-counter">
          {totalCount} destinations, {plannedCount} planned
        </div>
      </header>

      <main className="main-content-layout">
        {/* Left card: only the visited destinations, with star reviews */}
        <section className="card-box card-box-primary">
          <h2 className="card-title">Visited Places</h2>
          <DestinationList
            destinations={visitedDestinations}
            onToggle={handleToggleVisited}
            onDelete={handleDeleteDestination}
            onRate={handleRateDestination}
            emptyMessage="No visited places yet. Tick a destination in My Travel List to mark it as visited."
          />
        </section>

        {/* Right card: My Travel List with photos, filters, details and the add button */}
        <section className="card-box card-box-secondary">
          <DestinationsTable
            destinations={destinations}
            onToggle={handleToggleVisited}
            onDelete={handleDeleteDestination}
            onAdd={handleAddDestination}
            onUpdate={handleUpdateDestination}
          />
        </section>

        {/* Full-width card: suggestions with photos */}
        <section className="card-box card-box-wide">
          <InspirationSection
            destinations={destinations}
            onAdd={handleAddDestination}
          />
        </section>
      </main>
    </>
  );
}

export default App;