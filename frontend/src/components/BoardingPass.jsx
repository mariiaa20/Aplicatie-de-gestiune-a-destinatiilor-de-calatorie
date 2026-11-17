import { Link } from "react-router-dom";
import { TYPE_LABELS } from "../constants.js";
import {
  airportCode,
  barcodeBars,
  flightDate,
  flightOf,
  gateOf,
  seatOf,
  travelClass
} from "../utils/departures.js";
import styles from "./BoardingPass.module.css";

// the trip always starts at home
const HOME = { code: "OTP", city: "Bucharest" };

// The ticket printed under the board for the place it stopped on.
// trip: { title, type, budget, from, to, highlight, id? }  (id only if it is in My Travel List)
export default function BoardingPass({ trip, passenger, boardingTime, onAdd, saving }) {
  const name = (passenger.trim() || "Traveller").toUpperCase();
  const code = airportCode(trip.title);
  const date = flightDate(trip.from, trip.to, trip.title);
  const seat = seatOf(trip.title, name);
  const gate = gateOf(trip.title);
  const bars = barcodeBars(trip.title + name);
  let x = 0;

  return (
    <article className={styles.pass} aria-label={`Boarding pass to ${trip.title}`}>
      <div className={styles.main}>
        <header className={styles.band}>
          <span>Boarding pass</span>
          <span className={styles.airline}>Passport Air</span>
        </header>

        <div className={styles.route}>
          <div>
            <p className={styles.code}>{HOME.code}</p>
            <p className={styles.city}>{HOME.city}</p>
          </div>
          <div className={styles.path} aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
            </svg>
          </div>
          <div className={styles.to}>
            <p className={styles.code}>{code}</p>
            <p className={styles.city}>{trip.title}</p>
          </div>
        </div>

        <dl className={styles.fields}>
          <div>
            <dt>Passenger</dt>
            <dd>{name}</dd>
          </div>
          <div>
            <dt>Flight</dt>
            <dd>{flightOf(trip.title)}</dd>
          </div>
          <div>
            <dt>Date</dt>
            <dd>{date || "Open date"}</dd>
          </div>
          <div>
            <dt>Boarding</dt>
            <dd>{boardingTime}</dd>
          </div>
          <div>
            <dt>Gate</dt>
            <dd>{gate}</dd>
          </div>
          <div>
            <dt>Seat</dt>
            <dd>{seat}</dd>
          </div>
          <div>
            <dt>Class</dt>
            <dd>{travelClass(trip.budget)}</dd>
          </div>
          <div>
            <dt>Trip</dt>
            <dd>{TYPE_LABELS[trip.type] || trip.type}</dd>
          </div>
        </dl>

        {trip.highlight && <p className={styles.why}>{trip.highlight}</p>}

        <div className={styles.actions}>
          {trip.id !== undefined ? (
            <Link to={`/destinations/${trip.id}`} className="btn btn-primary">
              Open its page
            </Link>
          ) : (
            <button type="button" className="btn btn-primary" onClick={onAdd} disabled={saving}>
              {saving ? "Saving…" : "Add to my list"}
            </button>
          )}
        </div>
      </div>

      {/* the part the gate keeps, after the line of holes */}
      <aside className={styles.stub} aria-hidden="true">
        <p className={styles.stubName}>{name}</p>
        <p className={styles.stubRoute}>
          {HOME.code} <span>›</span> {code}
        </p>
        <dl className={styles.stubFields}>
          <div>
            <dt>Seat</dt>
            <dd>{seat}</dd>
          </div>
          <div>
            <dt>Gate</dt>
            <dd>{gate}</dd>
          </div>
        </dl>
        <svg className={styles.barcode} viewBox={`0 0 ${bars.reduce((a, b) => a + b + 1, 0)} 40`} preserveAspectRatio="none">
          {bars.map((width, i) => {
            const bar = <rect key={i} x={x} y="0" width={width} height="40" />;
            x += width + 1;
            return bar;
          })}
        </svg>
      </aside>
    </article>
  );
}
