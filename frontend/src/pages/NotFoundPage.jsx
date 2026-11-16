import { Link } from "react-router-dom";
import styles from "./NotFoundPage.module.css";

// Any address that matched no route. data-testid="not-found" is what the
// automated check looks for after opening an address that does not exist.
export default function NotFoundPage() {
  return (
    <div className="page-single">
      <section className={`card-box ${styles.notFound}`} data-testid="not-found">
        <h2 className="card-title">Page not found</h2>
        <p>There is no page at this address. Maybe the link is old.</p>
        <Link to="/" className="btn btn-primary">
          Back to My Travel List
        </Link>
      </section>
    </div>
  );
}
