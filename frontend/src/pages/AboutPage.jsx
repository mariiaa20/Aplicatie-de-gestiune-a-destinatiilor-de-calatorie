import { Link, useOutletContext } from "react-router-dom";
import PassportBook, { BookPage } from "../components/PassportBook.jsx";
import { useLanguage } from "../i18n/LanguageContext.js";
import { printedDate } from "../utils/departures.js";
import styles from "./AboutPage.module.css";

// the table of contents of the passport; the names and notes are in t.layout.nav and t.about.contents
const CONTENTS = [
  { key: "list", to: "/", pages: "2–3" },
  { key: "globe", to: "/globe", pages: "4–7" },
  { key: "inspire", to: "/inspiration", pages: "8–21" },
  { key: "stats", to: "/stats", pages: "22–23" },
  { key: "next", to: "/where-next", pages: null } // null: the Gate, not a page number
];

// every stage of the project, as an entry stamp; the dates are the days of the commits
// (luna de la 0: 8 = septembrie). Titlurile sunt în t.about.stages.
const ENTRIES = [
  { stage: 1, date: new Date(2026, 8, 29), shape: "oval" },
  { stage: 2, date: new Date(2026, 9, 11), shape: "box" },
  { stage: 3, date: new Date(2026, 9, 19), shape: "round" },
  { stage: 4, date: new Date(2026, 9, 20), shape: "box" },
  { stage: 5, date: new Date(2026, 9, 27), shape: "oval" },
  { stage: 6, date: new Date(2026, 10, 2), shape: "round" },
  { stage: 7, date: new Date(2026, 10, 15), shape: "oval" },
  { stage: 8, date: new Date(2026, 10, 16), shape: "box" }
];
const NEXT_STAGE = 9;

const SHAPES = { oval: styles.oval, box: styles.box, round: styles.round };
const INKS = [styles.inkCity, styles.inkBeach, styles.inkMountain, styles.inkWine];

// About: the first two pages of the passport, i and ii, before the travel pages
export default function AboutPage() {
  const { destinations, loading } = useOutletContext();
  const visited = destinations.filter((d) => d.visited).length;
  const { t } = useLanguage();
  const about = t.about;

  return (
    <div className="page-wide">
      <PassportBook spread={0} spreadCount={1} onSpreadChange={() => {}}>
        <BookPage number="i" className={styles.page}>
          <h2 className="card-title">{about.title}</h2>
          <p className={styles.intro}>{about.intro}</p>

          <dl className={styles.holder}>
            <div>
              <dt>{about.issuedFor}</dt>
              <dd>{about.issuedForValue}</dd>
            </div>
            <div>
              <dt>{about.issuedBy}</dt>
              <dd>{about.issuedByValue}</dd>
            </div>
            <div>
              <dt>{about.valid}</dt>
              <dd>2026–2027</dd>
            </div>
          </dl>

          <h3 className={styles.heading}>{about.journey}</h3>
          <div className={styles.stats}>
            <p>
              <span className={styles.number}>{loading ? "…" : destinations.length}</span>
              {about.destinations}
            </p>
            <p>
              <span className={styles.number}>{loading ? "…" : visited}</span>
              {about.visited}
            </p>
            <p>
              <span className={styles.number}>{loading ? "…" : destinations.length - visited}</span>
              {about.stillToGo}
            </p>
          </div>

          <h3 className={styles.heading}>{about.contentsTitle}</h3>
          <ol className={styles.contents}>
            {CONTENTS.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className={styles.entry}>
                  <span className={styles.entryName}>{t.layout.nav[item.key]}</span>
                  <span className={styles.leader} aria-hidden="true" />
                  <span className={styles.entryPages}>{item.pages ?? about.gate}</span>
                </Link>
                <span className={styles.entryNote}>{about.contents[item.key]}</span>
              </li>
            ))}
          </ol>
        </BookPage>

        <BookPage number="ii" className={styles.page}>
          <h2 className="card-title">{about.entriesTitle}</h2>
          <p className={styles.intro}>{about.entriesIntro}</p>

          <ul className={styles.stamps}>
            {ENTRIES.map((entry, i) => (
              <li
                key={entry.stage}
                className={`${styles.stamp} ${SHAPES[entry.shape]} ${INKS[i % INKS.length]}`}
                style={{ "--tilt": `${[-8, 5, -3, 9, -11, 4, -6, 7][i]}deg` }}
              >
                <span className={styles.stampStage}>{about.stage(entry.stage)}</span>
                <span className={styles.stampTitle}>{about.stages[entry.stage][0]}</span>
                <span className={styles.stampNote}>{about.stages[entry.stage][1]}</span>
                <span className={styles.stampDate}>{printedDate(entry.date, t.monthsPrinted)}</span>
              </li>
            ))}
            {/* the next stage has no stamp yet */}
            <li className={`${styles.stamp} ${styles.next}`}>
              <span className={styles.stampStage}>{about.stage(NEXT_STAGE)}</span>
              <span className={styles.stampTitle}>{about.stages[NEXT_STAGE][0]}</span>
              <span className={styles.stampNote}>{about.stages[NEXT_STAGE][1]}</span>
              <span className={styles.stampDate}>{about.comingSoon}</span>
            </li>
          </ul>

          <h3 className={styles.heading}>{about.madeWithTitle}</h3>
          <p className={styles.madeWith}>{about.madeWith}</p>
        </BookPage>
      </PassportBook>
    </div>
  );
}
