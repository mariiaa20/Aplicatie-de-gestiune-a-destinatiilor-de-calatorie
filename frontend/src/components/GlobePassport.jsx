import { useState } from "react";
import PassportBook, { BookPage } from "./PassportBook.jsx";
import TravelGlobe from "./TravelGlobe.jsx";
import DestinationList from "./DestinationList.jsx";
import styles from "./GlobePassport.module.css";

// Travel Globe page: the passport open on pages 4-5 (the globe and its notes);
// turn the page for 6-7, a stamp and a rating for every visited place.
const FIRST_PAGE = 4;
const SPREADS = ["Your travel globe", "Visited places"];

export default function GlobePassport({ destinations, onToggle, onDelete, onRate }) {
  const [spread, setSpread] = useState(0);

  const visited = destinations.filter((d) => d.visited);
  // the left page also holds the title, so it takes the first half, rounded up
  const half = Math.ceil(visited.length / 2);

  return (
    <PassportBook
      spread={spread}
      spreadCount={SPREADS.length}
      onSpreadChange={setSpread}
      labels={SPREADS}
    >
      {spread === 0 ? (
        <TravelGlobe destinations={destinations} onToggle={onToggle} firstPage={FIRST_PAGE} />
      ) : (
        <>
          <BookPage number={FIRST_PAGE + 2} className={styles.visitedPage}>
            <h2 className="card-title">Visited Places</h2>
            <p className={styles.visitedLead}>
              {visited.length === 0
                ? "No stamps yet."
                : `${visited.length} ${visited.length === 1 ? "stamp" : "stamps"} in the passport. Give each trip a rating.`}
            </p>
            <DestinationList
              destinations={visited.slice(0, half)}
              onToggle={onToggle}
              onDelete={onDelete}
              onRate={onRate}
              emptyMessage="Tick a destination on the globe page or in My Travel List and its stamp appears here."
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
