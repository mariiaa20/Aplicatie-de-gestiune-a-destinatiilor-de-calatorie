import { createContext, useContext } from "react";
import en from "./en.js";

// Limbile site-ului: codul, ce scrie pe buton și numele întreg
export const LANGUAGES = [
  { code: "en", short: "EN", name: "English" },
  { code: "ro", short: "RO", name: "Română" }
];

// Contextul ține limba aleasă și textele ei. Valoarea de aici e folosită doar
// dacă o componentă ar fi desenată în afara lui <LanguageProvider>.
export const LanguageContext = createContext({ lang: "en", setLang: () => {}, t: en });

// În orice componentă: const { t, lang, setLang } = useLanguage();
// t.nav.list, t.form.errors.required, t.table.shown(3, 10) ...
export function useLanguage() {
  return useContext(LanguageContext);
}
