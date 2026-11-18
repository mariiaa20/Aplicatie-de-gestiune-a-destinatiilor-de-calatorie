import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { fetchDestination } from "../api.js";
import { BUDGET_OPTIONS, formatPeriod } from "../utils/travelOptions.js";
import { seasonCountdown } from "../utils/season.js";
import { playStamp } from "../utils/flapSound.js";
import DestinationPhoto from "../components/DestinationPhoto.jsx";
import StarRating from "../components/StarRating.jsx";
import MonthWeather from "../components/MonthWeather.jsx";
import { useLanguage } from "../i18n/LanguageContext.js";
import styles from "./DestinationDetailPage.module.css";

// "Lisbon, Portugal" -> "LISBON<PORTUGAL", the way names are printed in a machine line
function machineText(text) {
  return String(text)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "<");
}

// two lines of 44 characters, like the bottom of a passport's data page
function machineLines(destination) {
  const first = `D<${machineText(destination.type)}<<${machineText(destination.title)}`;
  const second = `TDM${String(destination.id).padStart(6, "0")}<<${destination.visited ? "V" : "P"}`;
  return [first, second].map((line) => line.padEnd(44, "<").slice(0, 44));
}

// the stamp and the coloured line use the ink of the kind of place
const INK = {
  "city-break": styles.inkCity,
  beach: styles.inkBeach,
  mountain: styles.inkMountain
};

// "The season starts in 134 days (April)." or "It is the season right now.", in the language of t
function countdownText(destination, t) {
  if (destination.visited) return null;
  const countdown = seasonCountdown(destination.periodFrom, destination.periodTo);
  if (!countdown) return null;
  if (countdown.inSeason) return t.detail.inSeason;
  const month = t.monthInText(countdown.monthIndex);
  if (countdown.days === 1) return t.detail.seasonTomorrow(month);
  return t.detail.seasonIn(countdown.days, month);
}

// The data page of one destination, at /destinations/:id.
// It asks the server for this destination only, so it also works after a refresh
// or when the address is typed by hand. Its fields can be changed here too.
export default function DestinationDetailPage() {
  const { id } = useParams(); // always text, for example "3"
  const { changeDestination, removeDestination } = useOutletContext();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stamped, setStamped] = useState(false); // the stamp was just put on, so it falls

  // runs again when the id in the address changes, for example with the browser's Back button
  useEffect(() => {
    let ignore = false;

    fetchDestination(id)
      .then((data) => {
        if (!ignore) {
          setDestination(data);
          setError(null); // an error from an earlier id no longer applies
        }
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  if (loading) {
    return (
      <p className="info page-status" data-testid="loading">
        {t.detail.loading}
      </p>
    );
  }

  if (error) {
    return (
      <div className="page-single">
        <section className={`card-box ${styles.missing}`}>
          <h2 className="card-title">{t.detail.missingTitle}</h2>
          <p className="error" data-testid="error">
            {t.detail.missingError(error)}
          </p>
          <p className={styles.missingHint}>{t.detail.missingHint}</p>
          <Link to="/" className="btn btn-primary">
            {t.common.backToList}
          </Link>
        </section>
      </div>
    );
  }

  // the same server-first rule as the list: the page shows what the server saved
  async function save(changes) {
    const updated = await changeDestination(destination.id, changes);
    if (updated) setDestination(updated);
  }

  function toggleVisited() {
    if (!destination.visited) {
      setStamped(true);
      playStamp();
    } else {
      setStamped(false); // so the next stamp falls again
    }
    save({ visited: !destination.visited });
  }

  // deleted on the server, then back to the list, where "Undo" waits for a few seconds
  async function handleDelete() {
    if (await removeDestination(destination.id)) navigate("/");
  }

  const period = formatPeriod(destination.periodFrom, destination.periodTo, t.months);
  const countdown = countdownText(destination, t);
  const monthOptions = t.months.map((name, index) => (
    <option key={index} value={String(index + 1)}>
      {name}
    </option>
  ));
  // the weather of the month you want to go, or of next month if no period is set
  const weatherMonth = destination.periodFrom || String(((new Date().getMonth() + 1) % 12) + 1);

  return (
    <div className={styles.page}>
      <section
        className={`card-box ${styles.detail} ${INK[destination.type] ?? ""} ${stamped ? styles.thump : ""}`}
        data-testid="detail"
      >
        <Link to="/" className={styles.back}>
          ‹ {t.common.backToList}
        </Link>

        <div className={styles.record}>
          <div className={styles.photo}>
            <DestinationPhoto title={destination.title} photo={destination.photo} />
          </div>

          <div className={styles.info}>
            <p className={styles.kind}>{t.detail.record(destination.id)}</p>
            <h2 className={styles.title} data-testid="detail-title">
              {destination.title}
            </h2>
            {destination.highlight && (
              <p className={styles.highlight}>{destination.highlight}</p>
            )}
            {countdown && <p className={styles.countdown}>{countdown}</p>}

            {/* the fields that do not fit on the line in My Travel List; most can be changed here */}
            <dl className={styles.fields}>
              <div>
                <dt>{t.detail.type}</dt>
                <dd>
                  <span className={`badge badge-${destination.type}`}>
                    {t.types[destination.type] || destination.type}
                  </span>
                </dd>
              </div>
              <div>
                <dt>{t.detail.category}</dt>
                <dd>{t.categories[destination.category] || destination.category}</dd>
              </div>
              <div>
                <dt>{t.detail.status}</dt>
                <dd>{destination.visited ? t.common.visited : t.common.planned}</dd>
              </div>
              <div>
                <dt>{t.detail.period}</dt>
                <dd className={styles.pair}>
                  <select
                    aria-label={t.common.fromMonth}
                    value={destination.periodFrom || ""}
                    onChange={(e) => save({ periodFrom: e.target.value })}
                  >
                    <option value="">{t.common.notSet}</option>
                    {monthOptions}
                  </select>
                  <span aria-hidden="true">–</span>
                  <select
                    aria-label={t.common.toMonth}
                    value={destination.periodTo || ""}
                    disabled={!destination.periodFrom}
                    onChange={(e) => save({ periodTo: e.target.value })}
                  >
                    <option value="">{t.common.notSet}</option>
                    {monthOptions}
                  </select>
                </dd>
              </div>
              <div>
                <dt>{t.common.budget}</dt>
                <dd>
                  <select
                    aria-label={t.common.budget}
                    value={destination.budget || ""}
                    onChange={(e) => save({ budget: e.target.value })}
                  >
                    <option value="">{t.common.notSet}</option>
                    {BUDGET_OPTIONS.map((option) => (
                      <option key={option.key} value={option.key}>
                        {t.budgets[option.key].label}
                      </option>
                    ))}
                  </select>
                </dd>
              </div>
              <div>
                <dt>{t.detail.rating}</dt>
                <dd>
                  {destination.visited ? (
                    <StarRating
                      value={destination.rating || 0}
                      onChange={(value) => save({ rating: value })}
                    />
                  ) : (
                    t.detail.afterTrip
                  )}
                </dd>
              </div>
            </dl>

            <MonthWeather title={destination.title} month={weatherMonth} />
            {period && <p className={styles.periodNote}>{t.detail.bestTime(period)}</p>}
          </div>
        </div>

        {destination.visited && (
          <span className={stamped ? `${styles.stamp} ${styles.stampIn}` : styles.stamp} aria-hidden="true">
            {t.detail.stamp}
          </span>
        )}

        <div className={styles.actions}>
          <button type="button" className="btn btn-primary" onClick={toggleVisited}>
            {destination.visited ? t.detail.markPlanned : t.detail.markVisited}
          </button>
          <Link to="/globe" className="btn btn-ghost">
            {t.detail.onGlobe}
          </Link>
          <button type="button" className={`btn btn-ghost ${styles.delete}`} onClick={handleDelete}>
            {t.common.delete}
          </button>
        </div>

        <p className={styles.mrz} aria-hidden="true">
          {machineLines(destination).join("\n")}
        </p>
      </section>
    </div>
  );
}
