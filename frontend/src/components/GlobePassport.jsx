import { useState } from "react";
import PassportBook, { BookPage } from "./PassportBook.jsx";
import TravelGlobe from "./TravelGlobe.jsx";
import DestinationList from "./DestinationList.jsx";
import { useLanguage } from "../i18n/LanguageContext.js";
import styles from "./GlobePassport.module.css";

// Travel Globe page: the passport open on pages 4-5 (the globe and its notes);
// turn the page for 6-7, a stamp and a rating for every visited place.
const FIRST_PAGE = 4;

export default function GlobePassport({ destinations, onToggle, onDelete, onRate }) {
  const [spread, setSpread] = useState(0);
  const { t } = useLanguage();
  // the names of the two spreads, written on the page buttons
  const spreads = t.globe.spreads;

  const visited = destinations.filter((d) => d.visited);
  // the left page also holds the title, so it takes the first half, rounded up
  const half = Math.ceil(visited.length / 2);

  return (
    <PassportBook
      spread={spread}
      spreadCount={spreads.length}
      onSpreadChange={setSpread}
      labels={spreads}
    >
      {spread === 0 ? (
        <TravelGlobe destinations={destinations} onToggle={onToggle} firstPage={FIRST_PAGE} />
      ) : (
        <>
          <BookPage number={FIRST_PAGE + 2} className={styles.visitedPage}>
            <h2 className="card-title">{t.globe.visitedTitle}</h2>
            <p className={styles.visitedLead}>
              {visited.length === 0 ? t.globe.noStamps : t.globe.stamps(visited.length)}
            </p>
            <DestinationList
              destinations={visited.slice(0, half)}
              onToggle={onToggle}
              onDelete={onDelete}
              onRate={onRate}
              emptyMessage={t.globe.visitedEmpty}
            />
          </BookPage>

          <BookPage number={FIRST_PAGE + 3} className={styles.visitedPage}>
            {visited.length > 1 && (
              <DestinationList
                destinations={visited.slice(half)}
                onToggle={onToggle}
                onDelete={onDelete}
                onRate={onRate}
              />
            )}
          </BookPage>
        </>
      )}
    </PassportBook>
  );
}
