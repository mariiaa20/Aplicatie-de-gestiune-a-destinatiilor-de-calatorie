import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import DepartureBoard from "../components/DepartureBoard.jsx";
import BoardingPass from "../components/BoardingPass.jsx";
import { SUGGESTIONS } from "../data/suggestions.js";
import { MONTH_NAMES, periodIncludesMonth } from "../utils/travelOptions.js";
import { boardText, gateOf, pickOne, someOthers, timeFromNow } from "../utils/departures.js";
import { unlockFlapSound } from "../utils/flapSound.js";
import styles from "./WhereNextPage.module.css";

const LINES = 6;
const OTHER_REMARKS = ["ON TIME", "ON TIME", "DELAYED", "GATE OPEN", "SCHEDULED", "ON TIME"];

// one line of the board for a trip
function rowFor(trip, line, remark) {
  return {
    time: timeFromNow(20 + line * 15),
    destination: boardText(trip.title),
    gate: gateOf(trip.title),
    remark
  };
}

// Where next? A departure board picks the next trip at random,
// then prints a boarding pass for it.
export default function WhereNextPage() {
  const { destinations, loading, error, addSuggestion } = useOutletContext();

  const [source, setSource] = useState("list"); // "list" or "anywhere"
  const [month, setMonth] = useState("");
  const [passenger, setPassenger] = useState("");
  const [sound, setSound] = useState(true);
  const [pick, setPick] = useState(null); // the trip the board stops on
  const [rows, setRows] = useState([]); // what the board should show
  const [phase, setPhase] = useState("idle"); // "idle", "rolling", "landed"
  const [saving, setSaving] = useState(false);
  const [rolls, setRolls] = useState(0); // how many times the board was asked to pick

  // the places the board can choose from, with the same fields for both sources
  const pool = useMemo(() => {
    const inList = (title) => destinations.find((d) => d.title.toLowerCase() === title.toLowerCase());
    const planned = destinations
      .filter((d) => !d.visited)
      .map((d) => ({ ...d, from: d.periodFrom, to: d.periodTo }));
    // "Anywhere": the places still to visit from the list, plus every idea not in it yet
    const trips =
      source === "list" ? planned : [...planned, ...SUGGESTIONS.filter((s) => !inList(s.title))];
    // places without a period can go any month
    return month ? trips.filter((t) => !t.from || periodIncludesMonth(t.from, t.to, month)) : trips;
  }, [destinations, source, month]);

  // before the first pick, the board shows a few scheduled departures
  const idleRows = useMemo(
    () => someOthers(pool, null, LINES).map((trip, line) => rowFor(trip, line, "SCHEDULED")),
    [pool]
  );
  const boardRows = phase === "idle" ? idleRows : rows;

  // the trip on the boarding pass, with its id if it is (now) in My Travel List
  const listed = pick && destinations.find((d) => d.title.toLowerCase() === pick.title.toLowerCase());
  const trip = pick && (listed ? { ...pick, id: listed.id } : pick);

  function handlePick() {
    unlockFlapSound(); // a click: the browser now lets the board make a sound
    const chosen = pickOne(pool, pick?.title);
    if (!chosen) return;
    const others = someOthers(pool, chosen, LINES - 1);
    setPick(chosen);
    setRows([
      rowFor(chosen, 0, "BOARDING"),
      ...others.map((trip, i) => rowFor(trip, i + 1, OTHER_REMARKS[i % OTHER_REMARKS.length]))
    ]);
    setPhase("rolling");
    setRolls(rolls + 1);
  }

  function changeSource(next) {
    setSource(next);
    setPhase("idle");
    setPick(null);
  }

  async function handleAdd() {
    setSaving(true);
    try {
      await addSuggestion({
        title: pick.title,
        type: pick.type,
        category: "Vacation",
        periodFrom: pick.from || "",
        periodTo: pick.to || "",
        budget: pick.budget || "",
        highlight: pick.highlight || "",
        photo: ""
      });
    } finally {
      setSaving(false);
    }
  }

  const planned = destinations.filter((d) => !d.visited).length;
  const ideasLeft = SUGGESTIONS.filter(
    (s) => !destinations.some((d) => d.title.toLowerCase() === s.title.toLowerCase())
  ).length;

  return (
    <div className={`page-wide ${styles.page}`}>
      <div className={styles.intro}>
        <h2 className={styles.title}>Where next?</h2>
        <p className={styles.lead}>Can't choose your next trip? Let the departure board pick one for you.</p>
      </div>

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

      <div className={styles.controls}>
        <div className={styles.tabs} role="group" aria-label="Pick from">
          <span className={styles.tabsLabel}>Pick from</span>
          <button
            type="button"
            className={styles.tab}
            aria-pressed={source === "list"}
            onClick={() => changeSource("list")}
          >
            My Travel List <span className={styles.count}>{planned}</span>
          </button>
          <button
            type="button"
            className={styles.tab}
            aria-pressed={source === "anywhere"}
            onClick={() => changeSource("anywhere")}
          >
            🌍 Anywhere in the world <span className={styles.count}>{planned + ideasLeft}</span>
          </button>
        </div>

        <label className={styles.field}>
          <span>When can you go?</span>
          <select value={month} onChange={(e) => setMonth(e.target.value)}>
            <option value="">Any month</option>
            {MONTH_NAMES.map((name, index) => (
              <option key={name} value={String(index + 1)}>
                {name}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span>Passenger</span>
          <input
            type="text"
            value={passenger}
            maxLength={24}
            placeholder="Your name"
            onChange={(e) => setPassenger(e.target.value)}
          />
        </label>

        <button
          type="button"
          className={styles.soundToggle}
          aria-pressed={sound}
          onClick={() => setSound(!sound)}
        >
          {sound ? "🔊 Sound on" : "🔈 Sound off"}
        </button>
      </div>

      {!loading && (
        <>
          <DepartureBoard
            rows={boardRows}
            lines={LINES}
            highlight={phase === "landed"}
            rollKey={rolls}
            sound={sound && phase === "rolling"}
            onSettled={() => phase === "rolling" && setPhase("landed")}
          />

          <div className={styles.pickBar}>
            {pool.length === 0 ? (
              <p className={styles.empty}>
                {source === "list"
                  ? "Nothing to pick: every place in My Travel List is visited, or none fits that month."
                  : "No place fits that month. Try another month."}
                {source === "list" && (
                  <button type="button" className={styles.switch} onClick={() => changeSource("anywhere")}>
                    Pick from anywhere in the world
                  </button>
                )}
              </p>
            ) : (
              <button
                type="button"
                className={styles.pickButton}
                onClick={handlePick}
                disabled={phase === "rolling"}
              >
                {phase === "rolling" ? "Picking…" : phase === "landed" ? "Pick again" : "Pick my next trip"}
              </button>
            )}
          </div>

          {/* the pass comes out of the slot under the board once it has stopped */}
          {phase === "landed" && trip && (
            <div className={styles.slot} key={trip.title}>
              <BoardingPass
                trip={trip}
                passenger={passenger}
                boardingTime={rows[0]?.time}
                onAdd={handleAdd}
                saving={saving}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}