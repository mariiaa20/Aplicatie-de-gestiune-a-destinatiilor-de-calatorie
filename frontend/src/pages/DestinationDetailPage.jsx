import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchDestination } from "../api.js";
import { TYPE_LABELS } from "../constants.js";
import { formatPeriod, getBudget } from "../utils/travelOptions.js";
import DestinationPhoto from "../components/DestinationPhoto.jsx";
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

// The data page of one destination, at /destinations/:id.
// It asks the server for this destination only, so it also works after a refresh
// or when the address is typed by hand.
export default function DestinationDetailPage() {
  const { id } = useParams(); // always text, for example "3"
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        Loading the destination…
      </p>
    );
  }

  if (error) {
    return (
      <div className="page-single">
        <section className={`card-box ${styles.missing}`}>
          <h2 className="card-title">No such destination</h2>
          <p className="error" data-testid="error">
            The destination could not be loaded: {error}.
          </p>
          <p className={styles.missingHint}>Maybe it was deleted, or the link is old.</p>
          <Link to="/" className="btn btn-primary">
            Back to My Travel List
          </Link>
        </section>
      </div>
    );
  }

  const budget = getBudget(destination.budget);
  const period = formatPeriod(destination.periodFrom, destination.periodTo);
  const rating = destination.rating || 0;

  return (
    <div className={styles.page}>
      <section
        className={`card-box ${styles.detail} ${INK[destination.type] ?? ""}`}
        data-testid="detail"
      >
        <Link to="/" className={styles.back}>
          ‹ Back to My Travel List
        </Link>

        <div className={styles.record}>
          <div className={styles.photo}>
            <DestinationPhoto title={destination.title} photo={destination.photo} />
          </div>

          <div className={styles.info}>
            <p className={styles.kind}>Destination record no. {destination.id}</p>
            <h2
              className={styles.title}
              data-testid="detail-title"
            >
              {destination.title}
            </h2>
            {destination.highlight && (
              <p className={styles.highlight}>{destination.highlight}</p>
            )}

            {/* the fields that do not fit on the line in My Travel List */}
            <dl className={styles.fields}>
              <div>
                <dt>Location type</dt>
                <dd>
                  <span className={`badge badge-${destination.type}`}>
                    {TYPE_LABELS[destination.type] || destination.type}
                  </span>
                </dd>
              </div>
              <div>
                <dt>Trip category</dt>
                <dd>{destination.category}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{destination.visited ? "Visited" : "Planned"}</dd>
              </div>
              <div>
                <dt>Desired period</dt>
                <dd>{period || "Not set"}</dd>
              </div>
              <div>
                <dt>Budget</dt>
                <dd>{budget ? budget.label : "Not set"}</dd>
              </div>
              <div>
                <dt>Rating</dt>
                <dd>
                  {destination.visited && rating > 0 ? (
                    <span className={styles.stars} aria-label={`${rating} out of 5 stars`}>
                      {"★".repeat(rating)}
                      <span className={styles.starsEmpty}>{"★".repeat(5 - rating)}</span>
                    </span>
                  ) : destination.visited ? (
                    "Not rated yet"
                  ) : (
                    "After the trip"
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {destination.visited && (
          <span className={styles.stamp} aria-hidden="true">
            Visited
          </span>
        )}

        <div className={styles.actions}>
          <Link to="/globe" className="btn btn-ghost">
            See it on the globe
          </Link>
        </div>

        <p className={styles.mrz} aria-hidden="true">
          {machineLines(destination).join("\n")}
        </p>
      </section>
    </div>
  );
}
