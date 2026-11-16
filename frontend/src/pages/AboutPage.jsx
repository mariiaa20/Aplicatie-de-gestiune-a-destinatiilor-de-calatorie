import { Link } from "react-router-dom";
import styles from "./AboutPage.module.css";

// What the app is and how it is made
export default function AboutPage() {
  return (
    <div className="page-single">
      <section className={`card-box ${styles.about}`}>
        <h2 className="card-title">About this passport</h2>
        <p>
          Travel Destinations Manager keeps the places I want to see and the places I have
          already been, like the pages of a passport. It was built step by step during the
          semester, for the Tehnologii Web project.
        </p>

        <h3 className={styles.heading}>The pages</h3>
        <ul className={styles.pages}>
          <li>
            <Link to="/">My Travel List</Link>: add a destination, tick it when you have been
            there, open it to see all its details.
          </li>
          <li>
            <Link to="/globe">Travel Globe</Link>: the countries you have visited, hatched on a
            globe, and a stamp for every trip.
          </li>
          <li>
            <Link to="/inspiration">Get inspired</Link>: 40 ideas for the next trip, as visas,
            with filters and a "Surprise me" button.
          </li>
        </ul>

        <h3 className={styles.heading}>Made with</h3>
        <p>
          React and Vite, React Router for the pages, CSS Modules for the styles, d3-geo and
          the world-atlas map for the globe, json-server for the data and the Wikipedia API
          for the photos.
        </p>
      </section>
    </div>
  );
}
