import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import useDestinations from "../hooks/useDestinations.js";
import UndoToast from "./UndoToast.jsx";
import PassportIntro from "./PassportIntro.jsx";
import { LANGUAGES, useLanguage } from "../i18n/LanguageContext.js";
import styles from "./Layout.module.css";

// Starting theme: the one set in the operating system.
// Passed to useState without parentheses, so React calls it only on the first render.
function getInitialTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// What every page has: the cover with the title, the navigation, the theme button
// și butoanele de limbă (EN / RO).
// The page of the current address is drawn in the place of <Outlet />.
export default function Layout() {
  const [theme, setTheme] = useState(getInitialTheme);
  const { t, lang, setLang } = useLanguage();

  // the list, loaded once here and shared with the pages (see useDestinations.js)
  const travel = useDestinations();
  const visitedCount = travel.destinations.filter((d) => d.visited).length;

  // Theme switch: state keeps the button label, the data-theme attribute drives the CSS
  function handleToggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
  }

  return (
    <>
      {/* the passport opening, on the first visit */}
      <PassportIntro />

      <span className={styles.planeBadge} role="img" aria-label={t.layout.plane}>✈️</span>

      {/* outside <header>: its backdrop-filter would anchor a fixed button to the
          header instead of to the page */}
      <div className={styles.cornerTools}>
        {/* limba site-ului: cea apăsată e cea folosită acum */}
        <div className={styles.langSwitch} role="group" aria-label={t.layout.language}>
          {LANGUAGES.map((language) => (
            <button
              key={language.code}
              type="button"
              className={styles.langOption}
              aria-pressed={lang === language.code}
              lang={language.code}
              title={language.name}
              onClick={() => setLang(language.code)}
            >
              {language.short}
            </button>
          ))}
        </div>

        <button
          type="button"
          className={styles.themeToggle}
          onClick={handleToggleTheme}
          aria-pressed={theme === "dark"}
        >
          {theme === "dark" ? t.layout.light : t.layout.dark}
        </button>
      </div>

      <header className={styles.headerSection}>
        <h1>Travel Destinations Manager</h1>
        <p>{t.layout.subtitle}</p>

        {/* NavLink marks the open page with aria-current="page", which the CSS uses;
            "end" on the first link, or "/" would match every address */}
        <nav className={styles.mainNav} aria-label={t.layout.navLabel} data-testid="nav">
          <NavLink to="/" end className={styles.navLink}>
            {t.layout.nav.list}
          </NavLink>
          <NavLink to="/globe" className={styles.navLink}>
            {t.layout.nav.globe}
            <span className={styles.navCount}>{visitedCount}</span>
          </NavLink>
          <NavLink to="/inspiration" className={styles.navLink}>
            {t.layout.nav.inspire}
          </NavLink>
          <NavLink to="/where-next" className={styles.navLink}>
            {t.layout.nav.next}
          </NavLink>
          <NavLink to="/stats" className={styles.navLink}>
            {t.layout.nav.stats}
          </NavLink>
          <NavLink to="/about" className={styles.navLink}>
            {t.layout.nav.about}
          </NavLink>
        </nav>
      </header>

      <main className={styles.main}>
        <Outlet context={travel} />
      </main>

      <UndoToast deleted={travel.lastDeleted} onUndo={travel.undoDelete} onClose={travel.forgetDeleted} />

      <footer className={styles.footer}>{t.layout.footer}</footer>
    </>
  );
}
