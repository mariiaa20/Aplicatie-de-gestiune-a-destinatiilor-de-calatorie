import { Link, useOutletContext } from "react-router-dom";
import PassportBook, { BookPage } from "../components/PassportBook.jsx";
import styles from "./AboutPage.module.css";

// the table of contents of the passport
const CONTENTS = [
  { to: "/", name: "My Travel List", pages: "2–3", note: "add a place, tick it when you have been there" },
  { to: "/globe", name: "Travel Globe", pages: "4–7", note: "visited countries hatched, a stamp for every trip" },
  { to: "/inspiration", name: "Get inspired", pages: "8–21", note: "40 ideas as visas, with filters" },
  { to: "/where-next", name: "Where next?", pages: "Gate", note: "a departure board picks your next trip" }
];

// every stage of the project, as an entry stamp; the dates are the days of the commits
const ENTRIES = [
  { stage: 1, title: "Static mockup", note: "HTML and CSS", date: "29 SEP 2026", shape: "oval" },
  { stage: 2, title: "Data logic", note: "plain JavaScript", date: "11 OCT 2026", shape: "box" },
  { stage: 3, title: "Vite + React", note: "the first app", date: "19 OCT 2026", shape: "round" },
  { stage: 4, title: "Components", note: "cards from data", date: "20 OCT 2026", shape: "box" },
  { stage: 5, title: "State", note: "tick, delete, dark mode", date: "27 OCT 2026", shape: "oval" },
  { stage: 6, title: "Mock API", note: "json-server", date: "02 NOV 2026", shape: "round" },
  { stage: 7, title: "Forms", note: "validation, saving", date: "15 NOV 2026", shape: "oval" },
  { stage: 8, title: "Routing", note: "pages, CSS Modules", date: "16 NOV 2026", shape: "box" }
];
const NEXT = { stage: 9, title: "Own backend", note: "Express" };

const SHAPES = { oval: styles.oval, box: styles.box, round: styles.round };
const INKS = [styles.inkCity, styles.inkBeach, styles.inkMountain, styles.inkWine];

// About: the first two pages of the passport, i and ii, before the travel pages
export default function AboutPage() {
  const { destinations, loading } = useOutletContext();
  const visited = destinations.filter((d) => d.visited).length;

  return (
    <div className="page-wide">
      <PassportBook spread={0} spreadCount={1} onSpreadChange={() => {}}>
        <BookPage number="i" className={styles.page}>
          <h2 className="card-title">About this passport</h2>
          <p className={styles.intro}>
            Travel Destinations Manager keeps the places I want to see and the places I have
            already been, like the pages of a passport: a list to plan, a globe that fills up
            with every trip, and a few pages of ideas for the next one.
          </p>

          <dl className={styles.holder}>
            <div>
              <dt>Issued for</dt>
              <dd>Tehnologii Web, semester project</dd>
            </div>
            <div>
              <dt>Issued by</dt>
              <dd>UPB, Faculty of Industrial Engineering and Robotics</dd>
            </div>
            <div>
              <dt>Valid</dt>
              <dd>2026–2027</dd>
            </div>
          </dl>

          <h3 className={styles.heading}>Your journey so far</h3>
          <div className={styles.stats}>
            <p>
              <span className={styles.number}>{loading ? "…" : destinations.length}</span>
              destinations
            </p>
            <p>
              <span className={styles.number}>{loading ? "…" : visited}</span>
              visited
            </p>
            <p>
              <span className={styles.number}>{loading ? "…" : destinations.length - visited}</span>
              still to go
            </p>
          </div>

          <h3 className={styles.heading}>Contents</h3>
          <ol className={styles.contents}>
            {CONTENTS.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className={styles.entry}>
                  <span className={styles.entryName}>{item.name}</span>
                  <span className={styles.leader} aria-hidden="true" />
                  <span className={styles.entryPages}>{item.pages}</span>
                </Link>
                <span className={styles.entryNote}>{item.note}</span>
              </li>
            ))}
          </ol>
        </BookPage>

        <BookPage number="ii" className={styles.page}>
          <h2 className="card-title">Entries</h2>
          <p className={styles.intro}>Every stage of the project left a stamp on this page.</p>

          <ul className={styles.stamps}>
            {ENTRIES.map((entry, i) => (
              <li
                key={entry.stage}
                className={`${styles.stamp} ${SHAPES[entry.shape]} ${INKS[i % INKS.length]}`}
                style={{ "--tilt": `${[-8, 5, -3, 9, -11, 4, -6, 7][i]}deg` }}
              >
                <span className={styles.stampStage}>Stage {entry.stage}</span>
                <span className={styles.stampTitle}>{entry.title}</span>
                <span className={styles.stampNote}>{entry.note}</span>
                <span className={styles.stampDate}>{entry.date}</span>
              </li>
            ))}
            {/* the next stage has no stamp yet */}
            <li className={`${styles.stamp} ${styles.next}`}>
              <span className={styles.stampStage}>Stage {NEXT.stage}</span>
              <span className={styles.stampTitle}>{NEXT.title}</span>
              <span className={styles.stampNote}>{NEXT.note}</span>
              <span className={styles.stampDate}>coming soon</span>
            </li>
          </ul>

          <h3 className={styles.heading}>Made with</h3>
          <p className={styles.madeWith}>
            React and Vite, React Router for the pages, CSS Modules for the styles, d3-geo and the
            world-atlas map for the globe, json-server for the data, the Wikipedia API for the
            photos and the Web Audio API for the clack of the departure board.
          </p>
        </BookPage>
      </PassportBook>
    </div>
  );
}
