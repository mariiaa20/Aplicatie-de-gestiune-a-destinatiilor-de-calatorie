import { Component } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext.js";
import styles from "./PageErrorBoundary.module.css";

// Ce se vede când o pagină se strică: un mesaj și un buton, în loc de un ecran alb.
// Mesajul tehnic de dedesubt spune ce s-a întâmplat (bun de trimis mai departe).
function PageError({ error }) {
  const { t } = useLanguage();
  return (
    <section className={`card-box page-single ${styles.pageError}`} role="alert">
      <h2 className="card-title">{t.pageError.title}</h2>
      <p>{t.pageError.text}</p>
      <p className={`error ${styles.details}`}>
        <code>{String(error?.message || error)}</code>
      </p>
      <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
        {t.pageError.reload}
      </button>
    </section>
  );
}

// React prinde erorile unei pagini doar cu o componentă de tip clasă (error boundary).
class Boundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    console.error(error);
  }

  render() {
    return this.state.error ? <PageError error={this.state.error} /> : this.props.children;
  }
}

// Învelește o pagină: dacă ea se strică (de exemplu, fișierul ei nu se poate încărca),
// restul site-ului merge mai departe. La o altă adresă se pornește de la zero.
export default function PageErrorBoundary({ children }) {
  const { pathname } = useLocation();
  return <Boundary key={pathname}>{children}</Boundary>;
}
