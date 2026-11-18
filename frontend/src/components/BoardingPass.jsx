import { Link } from "react-router-dom";
import { HOME_AIRPORT, ROMANIAN_AIRPORTS, airportLabel } from "../data/airports.js";
import { downloadPassImage } from "../utils/passImage.js";
import {
  barcodeBars,
  flightDay,
  flightOf,
  gateOf,
  printedDate,
  seatOf,
  ticketsUrl,
  travelClass
} from "../utils/departures.js";
import { useLanguage } from "../i18n/LanguageContext.js";
import styles from "./BoardingPass.module.css";

// The ticket printed under the board for the place it stopped on.
// trip: { title, type, budget, from, to, highlight, airport, id? }  (id only if it is in My Travel List)
// home: the Romanian airport the trip starts from
export default function BoardingPass({ trip, passenger, boardingTime, onAdd, saving, home = HOME_AIRPORT }) {
  const HOME = home;
  const { t } = useLanguage();
  const fields = t.pass.fields;
  const homeLabel = airportLabel(HOME, t.airports);
  // from a small airport: the nearest big one, for a second search that finds more flights
  const near = ROMANIAN_AIRPORTS.find((airport) => airport.code === HOME.near);
  const nearLabel = near && airportLabel(near, t.airports);
  const name = (passenger.trim() || t.pass.traveller).toUpperCase();
  const code = trip.airport.code;
  const day = flightDay(trip.from, trip.to, trip.title);
  const date = printedDate(day, t.monthsPrinted);
  const seatClass = travelClass(trip.budget, t.pass.classes);
  const tripKind = t.types[trip.type] || trip.type;
  const seat = seatOf(trip.title, name);
  const gate = gateOf(trip.title);
  const bars = barcodeBars(trip.title + name);
  // how to get from the airport to the place, translated in ro.js after the English text
  const then = trip.airport.then
    ? t.pass.then(t.then[trip.airport.then] ?? trip.airport.then)
    : t.pass.landIn(trip.title.split(",")[0]);
  let x = 0;

  // the same ticket, drawn as a picture you can keep or send
  function handleDownload() {
    downloadPassImage({
      labels: { heading: t.pass.heading, ...fields },
      name,
      fromCode: HOME.code,
      fromCity: homeLabel,
      toCode: code,
      toCity: trip.airport.city,
      then,
      date,
      boarding: boardingTime,
      flight: flightOf(trip.title),
      gate,
      seat,
      travelClass: seatClass,
      trip: tripKind,
      why: trip.highlight,
      bars
    });
  }

  return (
    <article className={styles.pass} aria-label={t.pass.label(trip.title)}>
      <div className={styles.main}>
        <header className={styles.band}>
          <span>{t.pass.heading}</span>
          <span className={styles.airline}>Passport Air</span>
        </header>

        <div className={styles.route}>
          <div>
            <p className={styles.code}>{HOME.code}</p>
            <p className={styles.city}>{homeLabel}</p>
          </div>
          <div className={styles.path} aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
            </svg>
          </div>
          <div className={styles.to}>
            <p className={styles.code}>{code}</p>
            <p className={styles.city}>{trip.airport.city}</p>
          </div>
        </div>

        {/* places without an airport of their own: how to get there from the one you land at */}
        <p className={styles.then}>{then}</p>
        {/* from a small airport many routes do not exist; the nearest big one has more */}
        {near && <p className={styles.fewFlights}>{t.pass.fewFlights(homeLabel, nearLabel)}</p>}

        <dl className={styles.fields}>
          <div>
            <dt>{fields.passenger}</dt>
            <dd>{name}</dd>
          </div>
          <div>
            <dt>{fields.flight}</dt>
            <dd>{flightOf(trip.title)}</dd>
          </div>
          <div>
            <dt>{fields.date}</dt>
            <dd>{date}</dd>
          </div>
          <div>
            <dt>{fields.boarding}</dt>
            <dd>{boardingTime}</dd>
          </div>
          <div>
            <dt>{fields.gate}</dt>
            <dd>{gate}</dd>
          </div>
          <div>
            <dt>{fields.seat}</dt>
            <dd>{seat}</dd>
          </div>
          <div>
            <dt>{fields.class}</dt>
            <dd>{seatClass}</dd>
          </div>
          <div>
            <dt>{fields.trip}</dt>
            <dd>{tripKind}</dd>
          </div>
        </dl>

        {trip.highlight && <p className={styles.why}>{trip.highlight}</p>}

        <div className={styles.actions}>
          {trip.id !== undefined ? (
            <Link to={`/destinations/${trip.id}`} className="btn btn-primary">
              {t.pass.openPage}
            </Link>
          ) : (
            <button type="button" className="btn btn-primary" onClick={onAdd} disabled={saving}>
              {saving ? t.common.saving : t.common.addToList}
            </button>
          )}
          {/* a real search for this flight, on that day; opens in a new tab */}
          <a
            href={ticketsUrl(HOME.code, code, day)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            {/* with two searches, each button says where it searches from */}
            {near && near.code !== code ? t.pass.ticketsFrom(homeLabel) : t.pass.tickets}
          </a>
          {near && near.code !== code && (
            <a
              href={ticketsUrl(near.code, code, day)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              {t.pass.ticketsFrom(nearLabel)}
            </a>
          )}
          <button type="button" className="btn btn-ghost" onClick={handleDownload}>
            {t.pass.download}
          </button>
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
            <dt>{fields.seat}</dt>
            <dd>{seat}</dd>
          </div>
          <div>
            <dt>{fields.gate}</dt>
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
