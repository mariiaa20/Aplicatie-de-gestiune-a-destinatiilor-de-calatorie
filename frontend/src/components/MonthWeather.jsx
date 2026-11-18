import { useEffect, useState } from "react";
import { fetchMonthWeather } from "../api.js";
import { useWikiCoordinates } from "../hooks/useWikiPhoto.js";
import { useLanguage } from "../i18n/LanguageContext.js";
import styles from "./MonthWeather.module.css";

// What the weather was like in a place, in the month you want to go.
// The place is found on Wikipedia (the same lookup as the globe), the weather comes from Open-Meteo.
export default function MonthWeather({ title, month }) {
  const coords = useWikiCoordinates([title])[title.trim()];
  const [weather, setWeather] = useState(null);
  const [failed, setFailed] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (!coords) return undefined;
    let ignore = false;
    fetchMonthWeather(coords.lat, coords.lon, month)
      .then((data) => {
        if (!ignore) {
          setWeather(data);
          setFailed(false);
        }
      })
      .catch(() => {
        if (!ignore) setFailed(true);
      });
    return () => {
      ignore = true;
    };
  }, [coords, month]);

  // nothing to show until the numbers are here, and nothing at all if the place
  // was not found or the weather service did not answer
  if (!coords || failed || !weather) return null;

  const monthName = t.monthInText(Number(month) - 1);

  return (
    <section className={styles.weather} aria-live="polite">
      <h3 className={styles.title}>{t.weather.title(monthName)}</h3>
      <div className={styles.values}>
        <p>
          <span className={styles.number}>{weather.high}°</span>
          {t.weather.day}
        </p>
        <p>
          <span className={styles.number}>{weather.low}°</span>
          {t.weather.night}
        </p>
        <p>
          <span className={styles.number}>{weather.rainyDays}</span>
          {t.weather.rainyDays(weather.rainyDays)}
        </p>
      </div>
      <p className={styles.source}>
        {t.weather.source(monthName, weather.year)}
      </p>
    </section>
  );
}
