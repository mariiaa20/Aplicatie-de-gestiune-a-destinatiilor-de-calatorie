import { useEffect, useState } from 'react';
import { Link, Navigate, NavLink, Route, Routes } from 'react-router-dom';
import './App.css';
import DestinationForm from './components/DestinationForm.jsx';
import DestinationsTable from './components/DestinationsTable.jsx';
import GlobePassport from './components/GlobePassport.jsx';
import InspirationSection from './components/InspirationSection.jsx';
import {
  createDestination,
  deleteDestination,
  fetchDestinations,
  updateDestination
} from './api.js';

// Starting theme: the one set in the operating system.
// Passed to useState without parentheses, so React calls it only on the first render.
function getInitialTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function App() {
  // The list starts empty, because the data comes from the server.
  // It lives here, above the pages, so it is loaded once and shared by all of them.
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState(getInitialTheme);

  const appName = "Travel Destinations Manager";

  // Runs once, after the first render
  useEffect(() => {
    let ignore = false; // no state is set if the page closed in the meantime

    // load is declared inside, because the function given to useEffect cannot be async
    async function load() {
      try {
        const data = await fetchDestinations();
        if (!ignore) setDestinations(data);
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  // Derived values: recalculated on every render, never kept in state
  const totalCount = destinations.length;
  const plannedCount = destinations.filter((d) => !d.visited).length;
  const visitedDestinations = destinations.filter((d) => d.visited);

  // Stage 7: server first, then state. Only what was saved reaches the screen,
  // and the id comes from the server, it is not made up here.
  // No try: the error goes back to the form, which shows it next to the fields.
  async function handleAddDestination(details) {
    const created = await createDestination({ visited: false, rating: 0, ...details });
    setDestinations((prev) => [...prev, created]);
    setError(null);
  }

  // "Get inspired" has no form of its own, so a failed save is shown on the page
  async function handleAddSuggestion(details) {
    try {
      await handleAddDestination(details);
    } catch (err) {
      setError(err.message);
    }
  }

  // PATCH sends only what changed; the list then takes the object the server returned
  async function handleUpdateDestination(id, changes) {
    try {
      const updated = await updateDestination(id, changes);
      setDestinations((prev) => prev.map((dest) => (dest.id === id ? updated : dest)));
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }

  // The current value is read from the list, because PATCH sends only { visited }
  function handleToggleVisited(id) {
    const dest = destinations.find((d) => d.id === id);
    if (dest) return handleUpdateDestination(id, { visited: !dest.visited });
  }

  const handleRateDestination = (id, rating) =>
    handleUpdateDestination(id, { rating });

  async function handleDeleteDestination(id) {
    try {
      await deleteDestination(id);
      setDestinations((prev) => prev.filter((dest) => dest.id !== id));
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }

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

        {/* NavLink marks the open page with aria-current="page", which the CSS uses */}
        <nav className="main-nav" aria-label="Pages">
          <NavLink to="/" end className="nav-link">
            My Travel List
          </NavLink>
          <NavLink to="/globe" className="nav-link">
            Travel Globe
            <span className="nav-count">{visitedDestinations.length}</span>
          </NavLink>
          <NavLink to="/inspiration" className="nav-link">
            Get inspired
          </NavLink>
        </nav>
      </header>

      {/* Shown above every page: the data is shared, so is its loading state */}
      {loading && (
        <p className="info list-status page-status" data-testid="loading">
          Loading destinations…
        </p>
      )}

      {error && (
        <p className="error list-status page-status" data-testid="error">
          Something went wrong with the server: {error}. Is <code>npm run api</code> running?
        </p>
      )}

      <Routes>
        {/* Home page: the form stays next to the list, because the automated
            check of stage 7 adds a destination and looks for it on this page */}
        <Route
          path="/"
          element={
            <main className="main-content-layout">
              <div className="side-column">
                <section className="card-box card-box-form">
                  <h2 className="card-title">Add a destination</h2>
                  <DestinationForm
                    onAdd={handleAddDestination}
                    existingTitles={destinations.map((d) => d.title)}
                  />
                </section>
              </div>

              <section className="card-box card-box-secondary">
                <h2 className="card-title">My Travel List</h2>
                {/* !loading, without !error: if a toggle fails, the list stays on screen */}
                {!loading && (
                  <DestinationsTable
                    destinations={destinations}
                    onToggle={handleToggleVisited}
                    onDelete={handleDeleteDestination}
                    onUpdate={handleUpdateDestination}
                  />
                )}
              </section>
            </main>
          }
        />

        {/* The travel record, as two spreads of the passport: the globe on
            pages 4-5, then turn the page for the visited places on 6-7 */}
        <Route
          path="/globe"
          element={
            <main className="page-wide globe-page">
              {/* drawn only once the data is here, so the globe does not fly
                  to a country just because the list arrived */}
              {!loading && (
                <GlobePassport
                  destinations={destinations}
                  onToggle={handleToggleVisited}
                  onDelete={handleDeleteDestination}
                  onRate={handleRateDestination}
                />
              )}
            </main>
          }
        />

        {/* the old address of Visited Places still works */}
        <Route path="/visited" element={<Navigate to="/globe" replace />} />

        <Route
          path="/inspiration"
          element={
            <main className="page-wide">
              <section className="card-box card-box-wide">
                {!loading && (
                  <InspirationSection
                    destinations={destinations}
                    onAdd={handleAddSuggestion}
                  />
                )}
              </section>
            </main>
          }
        />

        {/* Any other address */}
        <Route
          path="*"
          element={
            <main className="page-single">
              <section className="card-box not-found">
                <h2 className="card-title">Page not found</h2>
                <p>There is no page at this address. Maybe the link is old.</p>
                <Link to="/" className="btn btn-primary">
                  Back to My Travel List
                </Link>
              </section>
            </main>
          }
        />
      </Routes>
    </>
  );
}

export default App;
