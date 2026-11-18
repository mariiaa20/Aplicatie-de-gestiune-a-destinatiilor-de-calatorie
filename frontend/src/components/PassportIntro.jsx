import { useEffect, useState } from "react";
import { useLanguage } from "../i18n/LanguageContext.js";
import styles from "./PassportIntro.module.css";

const SEEN_KEY = "tdm-intro-seen";

// Show the opening only on the first visit in this browser tab. Not for automated tests
// (navigator.webdriver), and not for people who asked their system for less motion.
// Adding ?intro to the address shows it again.
function shouldShow() {
  if (new URLSearchParams(window.location.search).has("intro")) return true;
  if (navigator.webdriver) return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    return !sessionStorage.getItem(SEEN_KEY);
  } catch {
    return false;
  }
}

// The first thing people see: the passport closed on the leather, the gold catching
// the light, then the cover opens and the app is the first page.
export default function PassportIntro() {
  const [show, setShow] = useState(shouldShow);
  const { t } = useLanguage();

  function close() {
    setShow(false);
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // private mode: it will just show again next time
    }
  }

  // Escape skips it too
  useEffect(() => {
    if (!show) return undefined;
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show]);

  if (!show) return null;

  return (
    <div
      className={styles.intro}
      onClick={close}
      // the last animation of the overlay is its fade out: then it is gone for good
      onAnimationEnd={(e) => e.target === e.currentTarget && e.animationName.includes("introOut") && close()}
      aria-hidden="true"
    >
      <div className={styles.book}>
        {/* the first page, seen when the cover opens */}
        <div className={styles.page}>
          <p className={styles.welcome}>{t.intro.welcome}</p>
          <p className={styles.pageTitle}>{t.intro.tagline}</p>
          <span className={styles.pageLine} />
          <p className={styles.mrz}>P&lt;TRVDESTINATIONS&lt;&lt;MANAGER&lt;&lt;&lt;&lt;</p>
        </div>

        {/* the cover turns on its left edge; it has two faces, the leather and its inside */}
        <div className={styles.cover}>
          <div className={styles.coverInside} />
          <div className={styles.coverFront}>
            <div className={styles.frame}>
              <p className={styles.country}>{t.intro.document}</p>
              <svg className={styles.emblem} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.1">
                <circle cx="24" cy="24" r="17" />
                <ellipse cx="24" cy="24" rx="7" ry="17" />
                <ellipse cx="24" cy="24" rx="13" ry="17" />
                <path d="M24 7v34M9 16h30M7 24h34M9 32h30" />
                <circle cx="24" cy="24" r="21" strokeWidth="0.6" />
              </svg>
              <p className={styles.passport}>{t.intro.passport}</p>
              <p className={styles.name}>Travel Destinations Manager</p>
              {/* the little chip symbol of an electronic passport */}
              <svg className={styles.chip} viewBox="0 0 40 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <rect x="1" y="1" width="38" height="22" rx="3" />
                <circle cx="20" cy="12" r="5" />
                <path d="M1 12h14M25 12h14" />
              </svg>
            </div>
            {/* the light that slides over the gold */}
            <span className={styles.shine} />
          </div>
        </div>
      </div>

      <button type="button" className={styles.skip} onClick={close}>
        {t.intro.skip}
      </button>
    </div>
  );
}
