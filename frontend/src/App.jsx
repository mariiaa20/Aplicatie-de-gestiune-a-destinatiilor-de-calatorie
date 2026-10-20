import { useState } from 'react';
import './App.css';
import DestinationList from './components/DestinationList.jsx';
import DestinationsTable from './components/DestinationsTable.jsx';

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
  const [destinations, setDestinations] = useState(initialDestinations);

  const appName = "Travel Destinations Manager";
  const totalCount = destinations.length;
  const plannedCount = destinations.filter((d) => !d.visited).length;

  const handleToggleVisited = (id) => {
    setDestinations((prev) =>
      prev.map((dest) =>
        dest.id === id ? { ...dest, visited: !dest.visited } : dest
      )
    );
  };

  return (
    <>
      <span className="plane-badge" role="img" aria-label="airplane">✈️</span>

      <header className="header-section">
        <h1>{appName}</h1>
        <p>Manage and organize your travel destinations.</p>
        <div className="badge-counter">
          {totalCount} destinations, {plannedCount} planned
        </div>
      </header>

      <main className="main-content-layout">
        {/* CARDUL 1: Lista principala cu actiuni */}
        <section className="card-box card-box-primary">
          <h2 className="card-title">My Destinations</h2>
          <DestinationList
            destinations={destinations}
            onToggle={handleToggleVisited}
          />
        </section>

        {/* CARDUL 2 COMPLET SEPARAT: My Travel List pe categorii */}
        <section className="card-box card-box-secondary">
          <DestinationsTable
            destinations={destinations}
            onToggle={handleToggleVisited}
          />
        </section>
      </main>
    </>
  );
}

export default App;