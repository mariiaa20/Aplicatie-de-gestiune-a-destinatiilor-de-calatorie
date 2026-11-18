import { useOutletContext } from "react-router-dom";
import ServerError from "../components/ServerError.jsx";
import { useLanguage } from "../i18n/LanguageContext.js";
import GlobePassport from "../components/GlobePassport.jsx";
import styles from "./GlobePage.module.css";

// The travel record, as two spreads of the passport: the globe on pages 4-5,
// then turn the page for the visited places on 6-7
export default function GlobePage() {
  const { destinations, loading, error, toggleVisited, removeDestination, rateDestination } =
    useOutletContext();
  const { t } = useLanguage();

  return (
    <div className={`page-wide ${styles.globePage}`}>
      {loading && (
        <p className="info page-status" data-testid="loading">
          {t.common.loadingList}
        </p>
      )}
      {error && <ServerError error={error} />}

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
