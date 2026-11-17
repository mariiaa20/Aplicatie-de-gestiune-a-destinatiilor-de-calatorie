import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import useDestinations from "../hooks/useDestinations.js";
import styles from "./Layout.module.css";

// Starting theme: the one set in the operating system.
// Passed to useState without parentheses, so React calls it only on the first render.
function getInitialTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// What every page has: the cover with the title, the navigation, the theme button.
// The page of the current address is drawn in the place of <Outlet />.
export default function Layout() {
  const [theme, setTheme] = useState(getInitialTheme);

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
      <span className={styles.planeBadge} role="img" aria-label="airplane">✈️</span>

      {/* outside <header>: its backdrop-filter would anchor a fixed button to the
          header instead of to the page */}
      <button
        type="button"
        className={styles.themeToggle}
        onClick={handleToggleTheme}
        aria-pressed={theme === "dark"}
      >
        {theme === "dark" ? "☀️ Light mode" : "🌙 Dark mode"}
      </button>

      <header className={styles.headerSection}>
        <h1>Travel Destinations Manager</h1>
        <p>Manage and organize your travel destinations.</p>

        {/* NavLink marks the open page with aria-current="page", which the CSS uses;
            "end" on the first link, or "/" would match every address */}
        <nav className={styles.mainNav} aria-label="Pages" data-testid="nav">
          <NavLink to="/" end className={styles.navLink}>
            My Travel List
          </NavLink>
          <NavLink to="/globe" className={styles.navLink}>
            Travel Globe
            <span className={styles.navCount}>{visitedCount}</span>
          </NavLink>
          <NavLink to="/inspiration" className={styles.navLink}>
            Get inspired
          </NavLink>
          <NavLink to="/where-next" className={styles.navLink}>
            Where next?
          </NavLink>
          <NavLink to="/about" className={styles.navLink}>
            About
          </NavLink>
        </nav>
      </header>

      <main className={styles.main}>
        <Outlet context={travel} />
      </main>

      <footer className={styles.footer}>Tehnologii Web project, UPB, 2026</footer>
    </>
  );
}
