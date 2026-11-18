import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import DepartureBoard from "../components/DepartureBoard.jsx";
import BoardingPass from "../components/BoardingPass.jsx";
import { SUGGESTIONS } from "../data/suggestions.js";
import { ROMANIAN_AIRPORTS, airportFor, airportLabel } from "../data/airports.js";
import { BUDGET_OPTIONS, periodIncludesMonth } from "../utils/travelOptions.js";
import { boardText, gateOf, pickOne, someOthers, timeFromNow } from "../utils/departures.js";
import { unlockFlapSound } from "../utils/flapSound.js";
import ServerError from "../components/ServerError.jsx";
import { useLanguage } from "../i18n/LanguageContext.js";
import styles from "./WhereNextPage.module.css";

const LINES = 6;
// the remarks are kept as keys; the text, in the chosen language, is in t.next.remarks
const OTHER_REMARKS = ["onTime", "onTime", "delayed", "gateOpen", "scheduled", "onTime"];

// one line of the board for a trip: the board shows the place itself,
// the boarding pass says which airport you fly to and how you get there
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
  const { t } = useLanguage();

  const [source, setSource] = useState("list"); // "list" or "anywhere"
  const [month, setMonth] = useState("");
  const [budget, setBudget] = useState("");
  const [passenger, setPassenger] = useState("");
  // the airport the trip starts from, remembered for the next visit
  const [homeCode, setHomeCode] = useState(() => {
    try {
      return localStorage.getItem("tdm-home-airport") || "OTP";
    } catch {
      return "OTP";
    }
  });
  const home = ROMANIAN_AIRPORTS.find((a) => a.code === homeCode) || ROMANIAN_AIRPORTS[0];
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
    // "Anywhere": the places still to visit from the list, plus every idea not in it yet,
    // each idea with its description in the chosen language
    const ideas = SUGGESTIONS.filter((s) => !inList(s.title)).map((s) => ({
      ...s,
      highlight: t.highlights[s.title] ?? s.highlight
    }));
    const trips = source === "list" ? planned : [...planned, ...ideas];
    return (
      trips
        // only places we can fly to: each one gets its airport
        .map((t) => ({ ...t, airport: airportFor(t.title) }))
        .filter((t) => t.airport)
        // no flight to the airport you leave from (Sibiu from Sibiu)
        .filter((t) => t.airport.code !== homeCode)
        // places without a period can go any month
        .filter((t) => !month || !t.from || periodIncludesMonth(t.from, t.to, month))
        .filter((t) => !budget || t.budget === budget)
    );
  }, [destinations, source, month, budget, homeCode, t]);

  // places from the list that the board leaves out, because we do not know their airport
  const noAirport = destinations.filter((d) => !d.visited && !airportFor(d.title));

  // before the first pick, the board shows a few scheduled departures
  const idleRows = useMemo(
    () => someOthers(pool, null, LINES).map((trip, line) => rowFor(trip, line, "scheduled")),
    [pool]
  );
  // the remark keys become text in the chosen language
  const boardRows = (phase === "idle" ? idleRows : rows).map((row) => ({
    ...row,
    remark: t.next.remarks[row.remark]
  }));

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
      rowFor(chosen, 0, "boarding"),
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

  // how many places each button can pick from (only places with an airport)
  const planned = destinations.filter((d) => !d.visited && airportFor(d.title)).length;
  const ideasLeft = SUGGESTIONS.filter(
    (s) => airportFor(s.title) && !destinations.some((d) => d.title.toLowerCase() === s.title.toLowerCase())
  ).length;

  return (
    <div className={`page-wide ${styles.page}`}>
      <div className={styles.intro}>
        <h2 className={styles.title}>{t.next.title}</h2>
        <p className={styles.lead}>{t.next.lead}</p>
      </div>

      {loading && (
        <p className="info page-status" data-testid="loading">
          {t.common.loadingList}
        </p>
      )}
      {error && <ServerError error={error} />}

      <div className={styles.controls}>
        <div className={styles.tabs} role="group" aria-label={t.next.pickFrom}>
          <span className={styles.tabsLabel}>{t.next.pickFrom}</span>
          <button
            type="button"
            className={styles.tab}
            aria-pressed={source === "list"}
            onClick={() => changeSource("list")}
          >
            {t.next.fromList} <span className={styles.count}>{planned}</span>
          </button>
          <button
            type="button"
            className={styles.tab}
            aria-pressed={source === "anywhere"}
            onClick={() => changeSource("anywhere")}
          >
            {t.next.anywhere} <span className={styles.count}>{planned + ideasLeft}</span>
          </button>
        </div>

        <label className={styles.field}>
          <span>{t.next.when}</span>
          <select value={month} onChange={(e) => setMonth(e.target.value)}>
            <option value="">{t.common.anyMonth}</option>
            {t.months.map((name, index) => (
              <option key={index} value={String(index + 1)}>
                {name}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span>{t.common.budget}</span>
          <select value={budget} onChange={(e) => setBudget(e.target.value)}>
            <option value="">{t.common.anyBudget}</option>
            {BUDGET_OPTIONS.map((option) => (
              <option key={option.key} value={option.key}>
                {t.budgets[option.key].label}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span>{t.next.leavingFrom}</span>
          <select
            value={homeCode}
            onChange={(e) => {
              setHomeCode(e.target.value);
              try {
                localStorage.setItem("tdm-home-airport", e.target.value);
              } catch {
                // private mode: the choice is just not remembered
              }
            }}
          >
            {ROMANIAN_AIRPORTS.map((airport) => (
              <option key={airport.code} value={airport.code}>
                {airportLabel(airport, t.airports)} ({airport.code})
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span>{t.next.passenger}</span>
          <input
            type="text"
            value={passenger}
            maxLength={24}
            placeholder={t.next.passengerPlaceholder}
            onChange={(e) => setPassenger(e.target.value)}
          />
        </label>

        <button
          type="button"
          className={styles.soundToggle}
          aria-pressed={sound}
          onClick={() => setSound(!sound)}
        >
          {sound ? t.next.soundOn : t.next.soundOff}
        </button>
      </div>

      {!loading && (
        <>
          <DepartureBoard
            rows={boardRows}
            lines={LINES}
            airport={`${airportLabel(home, t.airports)} ${home.code}`}
            highlight={phase === "landed"}
            rollKey={rolls}
            sound={sound && phase === "rolling"}
            onSettled={() => phase === "rolling" && setPhase("landed")}
          />

          <div className={styles.pickBar}>
            {pool.length === 0 ? (
              <p className={styles.empty}>
                {source === "list" ? t.next.emptyList : t.next.emptyAnywhere}
                {source === "list" && (
                  <button type="button" className={styles.switch} onClick={() => changeSource("anywhere")}>
                    {t.next.switchAnywhere}
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
                {phase === "rolling" ? t.next.picking : phase === "landed" ? t.next.again : t.next.pick}
              </button>
            )}
          </div>

          {noAirport.length > 0 && (
            <p className={styles.note}>
              {t.next.noAirport}
              {noAirport.map((d) => d.title).join(", ")}.
            </p>
          )}

          {/* the pass comes out of the slot under the board once it has stopped */}
          {phase === "landed" && trip && (
            <div className={styles.slot} key={trip.title}>
              <BoardingPass
                trip={trip}
                passenger={passenger}
                boardingTime={rows[0]?.time}
                onAdd={handleAdd}
                saving={saving}
                home={home}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
