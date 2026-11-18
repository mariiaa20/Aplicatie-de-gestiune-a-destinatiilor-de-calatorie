import { useEffect, useState } from "react";
import { LanguageContext } from "./LanguageContext.js";
import en from "./en.js";
import ro from "./ro.js";

const TEXTS = { en, ro };
const SAVED_KEY = "tdm-language";

// Limba de la început: cea aleasă data trecută; altfel română dacă browserul e în română,
// altfel engleză. Verificarea automată (navigator.webdriver) primește mereu engleza.
function startingLanguage() {
  try {
    const saved = localStorage.getItem(SAVED_KEY);
    if (TEXTS[saved]) return saved;
  } catch {
    // modul privat: nu putem citi alegerea, mergem mai departe
  }
  if (navigator.webdriver) return "en";
  return (navigator.language || "").toLowerCase().startsWith("ro") ? "ro" : "en";
}

// Învelește toată aplicația (vezi main.jsx), ca fiecare pagină să știe limba
export default function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(startingLanguage);

  // <html lang="ro">: cititoarele de ecran pronunță corect, iar browserul nu mai oferă traducerea
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  function setLang(next) {
    setLangState(next);
    try {
      localStorage.setItem(SAVED_KEY, next);
    } catch {
      // modul privat: alegerea ține doar până se închide pagina
    }
  }

  return <LanguageContext value={{ lang, setLang, t: TEXTS[lang] }}>{children}</LanguageContext>;
}
