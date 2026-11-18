import { useLanguage } from "../i18n/LanguageContext.js";

// Mesajul arătat când serverul json-server nu răspunde, același pe toate paginile.
// data-testid="error" e ce caută verificarea automată.
export default function ServerError({ error, className = "error page-status" }) {
  const { t } = useLanguage();
  return (
    <p className={className} data-testid="error">
      {t.common.serverError(error)}
      <code>npm run api</code>
      {t.common.serverErrorEnd}
    </p>
  );
}
