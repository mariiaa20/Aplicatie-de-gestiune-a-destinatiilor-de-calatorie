import { useOutletContext } from "react-router-dom";
import GlobePassport from "../components/GlobePassport.jsx";
import styles from "./GlobePage.module.css";

// The travel record, as two spreads of the passport: the globe on pages 4-5,
// then turn the page for the visited places on 6-7
export default function GlobePage() {
  const { destinations, loading, error, toggleVisited, removeDestination, rateDestination } =
    useOutletContext();

  return (
    <div className={`page-wide ${styles.globePage}`}>
      {loading && (
        <p className="info page-status" data-testid="loading">
          Loading destinations…
        </p>
      )}
      {error && (
        <p className="error page-status" data-testid="error">
          Something went wrong with the server: {error}. Is <code>npm run api</code> running?
        </p>
      )}

      {/* drawn only once the data is here, so the globe does not fly
          to a country just because the list arrived */}
      {!loading && (
        <GlobePassport
          destinations={destinations}
          onToggle={toggleVisited}
          onDelete={removeDestination}
          onRate={rateDestination}
        />
      )}
    </div>
  );
}
