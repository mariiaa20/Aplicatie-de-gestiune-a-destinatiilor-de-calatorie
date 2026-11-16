import { useOutletContext } from "react-router-dom";
import InspirationSection from "../components/InspirationSection.jsx";
import styles from "./InspirationPage.module.css";

// Get inspired: the visa pages of the passport, from page 8 on
export default function InspirationPage() {
  const { destinations, loading, error, addSuggestion } = useOutletContext();

  return (
    <div className="page-wide">
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

      <section className={`card-box ${styles.cardBoxWide}`}>
        {!loading && <InspirationSection destinations={destinations} onAdd={addSuggestion} />}
      </section>
    </div>
  );
}
