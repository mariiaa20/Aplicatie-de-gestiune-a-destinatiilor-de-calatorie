import { Link, useOutletContext } from "react-router-dom";
import PassportBook, { BookPage } from "../components/PassportBook.jsx";
import { LOCATION_TYPES } from "../constants.js";
import { CONTINENTS, whereIs } from "../data/airports.js";
import { BUDGET_OPTIONS, periodIncludesMonth } from "../utils/travelOptions.js";
import { useLanguage } from "../i18n/LanguageContext.js";
import { countryName } from "../i18n/countries.js";
import styles from "./StatsPage.module.css";

// what a budget range means in euro, to add up the planned trips
const BUDGET_EUR = {
  "under-500": [0, 500],
  "500-1000": [500, 1000],
  "1000-2000": [1000, 2000],
  "over-2000": [2000, 2000]
};

// Passport stats: pages 22 and 23, everything counted from My Travel List
export default function StatsPage() {
  const { destinations, loading } = useOutletContext();
  const { t, lang } = useLanguage();

  if (loading) {
    return (
      <p className="info page-status" data-testid="loading">
        {t.stats.loading}
      </p>
    );
  }

  const visited = destinations.filter((d) => d.visited);
  const planned = destinations.filter((d) => !d.visited);

  // countries and continents of the places already visited
  const places = visited.map((d) => whereIs(d.title));
  // the names in the chosen language, in alphabetical order for that language
  const countries = [...new Set(places.map((p) => p.country).filter(Boolean))]
    .map((name) => countryName(name, lang))
    .sort((a, b) => a.localeCompare(b, t.locale));
  const continentCount = (name) => places.filter((p) => p.continent === name).length;
  const continentsSeen = CONTINENTS.filter((name) => continentCount(name) > 0);

  // trips by kind of place: visited and planned
  const kinds = LOCATION_TYPES.map((type) => ({
    ...type,
    label: t.types[type.value],
    visited: visited.filter((d) => d.type === type.value).length,
    planned: planned.filter((d) => d.type === type.value).length
  }));
  const kindMax = Math.max(1, ...kinds.map((k) => k.visited + k.planned));

  // how many places you would like to visit in each month
  const months = t.months.map((name, i) => ({
    name,
    count: planned.filter((d) => d.periodFrom && periodIncludesMonth(d.periodFrom, d.periodTo, String(i + 1))).length
  }));
  const monthMax = Math.max(1, ...months.map((m) => m.count));
  const busiest = months.reduce((best, m) => (m.count > best.count ? m : best), months[0]);

  // what the planned trips would cost together
  const priced = planned.filter((d) => BUDGET_EUR[d.budget]);
  const low = priced.reduce((sum, d) => sum + BUDGET_EUR[d.budget][0], 0);
  const high = priced.reduce((sum, d) => sum + BUDGET_EUR[d.budget][1], 0);
  const hasOpenEnd = priced.some((d) => d.budget === "over-2000");
  const budgets = BUDGET_OPTIONS.map((option) => ({
    ...option,
    label: t.budgets[option.key].label,
    count: planned.filter((d) => d.budget === option.key).length
  }));
  const budgetMax = Math.max(1, ...budgets.map((b) => b.count));

  return (
    <div className="page-wide">
      <PassportBook spread={0} spreadCount={1} onSpreadChange={() => {}}>
        <BookPage number="22" className={styles.page}>
          <h2 className="card-title">{t.stats.title}</h2>
          <p className={styles.lead}>{t.stats.lead}</p>

          <div className={styles.tiles}>
            <p>
              <span className={styles.big}>{visited.length}</span>
              {t.stats.placesVisited(visited.length)}
            </p>
            <p>
              <span className={styles.big}>{countries.length}</span>
              {t.stats.countries(countries.length)}
            </p>
            <p>
              <span className={styles.big}>
                {continentsSeen.length}
                <small>/{CONTINENTS.length}</small>
              </span>
              {t.stats.continents}
            </p>
            <p>
              <span className={styles.big}>{planned.length}</span>
              {t.stats.stillToGo}
            </p>
          </div>

          <h3 className={styles.heading}>{t.stats.continentsTitle}</h3>
          <ul className={styles.continents}>
            {CONTINENTS.map((name) => {
              const count = continentCount(name);
              return (
                <li key={name} className={count ? styles.seen : styles.notYet}>
                  {t.continents[name]}
                  <span>{count ? t.stats.trips(count) : t.stats.notYet}</span>
                </li>
              );
            })}
          </ul>

          <h3 className={styles.heading}>{t.stats.countriesTitle}</h3>
          {countries.length ? (
            <p className={styles.countries}>{countries.join(", ")}.</p>
          ) : (
            <p className={styles.empty}>
              {t.stats.noStampsBefore}
              <Link to="/">{t.layout.nav.list}</Link>
              {t.stats.noStampsAfter}
            </p>
          )}
        </BookPage>

        <BookPage number="23" className={styles.page}>
          <h3 className={styles.heading}>{t.stats.kindsTitle}</h3>
          <ul className={styles.legend} aria-hidden="true">
            <li>
              <span className={styles.keyVisited} /> {t.stats.visitedKey}
            </li>
            <li>
              <span className={styles.keyPlanned} /> {t.stats.plannedKey}
            </li>
          </ul>
          <ul className={styles.kinds}>
            {kinds.map((kind) => (
              <li key={kind.value}>
                <span className={styles.kindName}>{kind.label}</span>
                <span className={styles.track}>
                  {kind.visited > 0 && (
                    <span
                      className={styles.barVisited}
                      style={{ width: `${(kind.visited / kindMax) * 100}%` }}
                      data-tip={t.stats.kindVisited(kind.label, kind.visited)}
                    />
                  )}
                  {kind.planned > 0 && (
                    <span
                      className={styles.barPlanned}
                      style={{ width: `${(kind.planned / kindMax) * 100}%` }}
                      data-tip={t.stats.kindPlanned(kind.label, kind.planned)}
                    />
                  )}
                </span>
                <span className={styles.kindValue}>
                  {t.stats.kindValue(kind.visited, kind.planned)}
                </span>
              </li>
            ))}
          </ul>

          <h3 className={styles.heading}>{t.stats.monthsTitle}</h3>
          {busiest.count > 0 ? (
            <>
              <p className={styles.note}>
                {t.stats.busiest(busiest.name, busiest.count)}
              </p>
              <div className={styles.months} role="img" aria-label={months.map((m) => `${m.name}: ${m.count}`).join(", ")}>
                {months.map((m) => (
                  <div key={m.name} className={styles.monthColumn}>
                    <span
                      className={m === busiest ? `${styles.monthBar} ${styles.busiest}` : styles.monthBar}
                      style={{ height: `${(m.count / monthMax) * 100}%` }}
                      data-tip={t.stats.monthTip(m.name, m.count)}
                    >
                      {m === busiest && <span className={styles.monthValue}>{m.count}</span>}
                    </span>
                    <span className={styles.monthName}>{m.name.slice(0, 1)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className={styles.empty}>{t.stats.noMonths}</p>
          )}

          <h3 className={styles.heading}>{t.stats.budgetTitle}</h3>
          {priced.length > 0 ? (
            <>
              <p className={styles.note}>
                {t.stats.budgetLead(priced.length)}
                <strong>{t.euro(low)}</strong>
                {t.stats.and}
                <strong>
                  {t.euro(high)}
                  {hasOpenEnd ? "+" : ""}
                </strong>
                .
              </p>
              <ul className={styles.budgets}>
                {budgets.map((b) => (
                  <li key={b.key}>
                    <span className={styles.kindName}>{b.label}</span>
                    <span className={styles.track}>
                      {b.count > 0 && (
                        <span
                          className={styles.barVisited}
                          style={{ width: `${(b.count / budgetMax) * 100}%` }}
                          data-tip={`${b.label}: ${b.count}`}
                        />
                      )}
                    </span>
                    <span className={styles.kindValue}>{b.count}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className={styles.empty}>{t.stats.noBudget}</p>
          )}
        </BookPage>
      </PassportBook>
    </div>
  );
}
