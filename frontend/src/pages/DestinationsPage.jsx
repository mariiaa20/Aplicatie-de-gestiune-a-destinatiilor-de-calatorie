import { useOutletContext } from "react-router-dom";
import DestinationForm from "../components/DestinationForm.jsx";
import DestinationsTable from "../components/DestinationsTable.jsx";
import styles from "./DestinationsPage.module.css";

// Home page, pages 2-3 of the passport: the form on the left, the list on the right.
// The form stays next to the list, because the automated check adds a destination
// and looks for it on this page.
export default function DestinationsPage() {
  const {
    destinations,
    loading,
    error,
    addDestination,
    toggleVisited,
    removeDestination,
    changeDestination
  } = useOutletContext();

  // Derived values: recalculated on every render, never kept in state
  const plannedCount = destinations.filter((d) => !d.visited).length;

  return (
    <div className={styles.mainContentLayout}>
      <div className={styles.sideColumn}>
        <section className={`card-box ${styles.cardBoxForm}`}>
          <h2 className="card-title">Add a destination</h2>
          <DestinationForm
            onAdd={addDestination}
            existingTitles={destinations.map((d) => d.title)}
          />
        </section>
      </div>

      <section className={`card-box ${styles.cardBoxSecondary}`}>
        <h2 className="card-title">My Travel List</h2>
        {/* the counter moved here from the header, which is now the same on every page */}
        {!loading && (
          <p className={styles.summary}>
            {destinations.length} destinations, {plannedCount} planned
          </p>
        )}

        {loading && (
          <p className={`info ${styles.listStatus}`} data-testid="loading">
            Loading destinations…
          </p>
        )}

        {error && (
          <p className={`error ${styles.listStatus}`} data-testid="error">
            Something went wrong with the server: {error}. Is <code>npm run api</code> running?
          </p>
        )}

        {/* !loading, without !error: if a toggle fails, the list stays on screen */}
        {!loading && (
          <DestinationsTable
            destinations={destinations}
            onToggle={toggleVisited}
            onDelete={removeDestination}
            onUpdate={changeDestination}
          />
        )}
      </section>
    </div>
  );
}
