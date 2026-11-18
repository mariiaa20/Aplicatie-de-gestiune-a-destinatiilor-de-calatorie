import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext.js";
import styles from "./NotFoundPage.module.css";

// Any address that matched no route. data-testid="not-found" is what the
// automated check looks for after opening an address that does not exist.
export default function NotFoundPage() {
  const { t } = useLanguage();
  return (
    <div className="page-single">
      <section className={`card-box ${styles.notFound}`} data-testid="not-found">
        <h2 className="card-title">{t.notFound.title}</h2>
        <p>{t.notFound.text}</p>
        <Link to="/" className="btn btn-primary">
          {t.common.backToList}
        </Link>
      </section>
    </div>
  );
}
