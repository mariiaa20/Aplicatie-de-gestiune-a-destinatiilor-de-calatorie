import { useOutletContext } from "react-router-dom";
import ServerError from "../components/ServerError.jsx";
import { useLanguage } from "../i18n/LanguageContext.js";
import InspirationSection from "../components/InspirationSection.jsx";
import styles from "./InspirationPage.module.css";

// Get inspired: the visa pages of the passport, from page 8 on
export default function InspirationPage() {
  const { destinations, loading, error, addSuggestion } = useOutletContext();
  const { t } = useLanguage();

  return (
    <div className="page-wide">
      {loading && (
        <p className="info page-status" data-testid="loading">
          {t.common.loadingList}
        </p>
      )}
      {error && <ServerError error={error} />}

      <section className={`card-box ${styles.cardBoxWide}`}>
        {!loading && <InspirationSection destinations={destinations} onAdd={addSuggestion} />}
      </section>
    </div>
  );
}
