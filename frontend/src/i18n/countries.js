// Numele țărilor în limba aleasă.
// Harta globului (world-atlas) și aeroporturile scriu țările în engleză. Browserul știe
// numele fiecărei țări în orice limbă după codul ei din două litere (RO, FR...), prin
// Intl.DisplayNames, așa că aici doar găsim codul pentru un nume în engleză.

// numele pe care Intl nu le scrie la fel ca harta sau ca aeroporturile
const ALIASES = {
  "United States of America": "US", "United States": "US", USA: "US",
  "Czech Republic": "CZ", Turkey: "TR", "South Korea": "KR", "North Korea": "KP",
  Vatican: "VA", Macedonia: "MK", eSwatini: "SZ", Palestine: "PS", Myanmar: "MM",
  "Côte d'Ivoire": "CI", "Dem. Rep. Congo": "CD", Congo: "CG", "Central African Rep.": "CF",
  "Dominican Rep.": "DO", "Eq. Guinea": "GQ", "S. Sudan": "SS", "W. Sahara": "EH",
  "Bosnia and Herz.": "BA", "Cabo Verde": "CV", "São Tomé and Principe": "ST",
  "Trinidad and Tobago": "TT", "Antigua and Barb.": "AG", "St. Kitts and Nevis": "KN",
  "St. Vin. and Gren.": "VC", "Saint Lucia": "LC", "Solomon Is.": "SB", "Marshall Is.": "MH",
  "N. Mariana Is.": "MP", "Cook Is.": "CK", "Falkland Is.": "FK", "Cayman Is.": "KY",
  "British Virgin Is.": "VG", "U.S. Virgin Is.": "VI", "Turks and Caicos Is.": "TC",
  "Faeroe Is.": "FO", "Pitcairn Is.": "PN", "Wallis and Futuna Is.": "WF",
  "Fr. Polynesia": "PF", "French Polynesia": "PF", "Fr. S. Antarctic Lands": "TF",
  "St. Pierre and Miquelon": "PM", "St-Martin": "MF", "St-Barthélemy": "BL", "Saint Helena": "SH",
  "S. Geo. and the Is.": "GS", "Br. Indian Ocean Ter.": "IO", "Heard I. and McDonald Is.": "HM",
  Åland: "AX", Macao: "MO", "Hong Kong": "HK"
};

let codes = null;

// o singură dată: numele în engleză al fiecărui cod, de la AA la ZZ, întors pe dos
function codeOf(name) {
  if (!codes) {
    codes = new Map(Object.entries(ALIASES));
    const english = new Intl.DisplayNames(["en"], { type: "region" });
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (const a of letters) {
      for (const b of letters) {
        try {
          const found = english.of(a + b);
          if (found && found !== a + b && !codes.has(found)) codes.set(found, a + b);
        } catch {
          // un cod pe care browserul nu îl știe
        }
      }
    }
  }
  return codes.get(name);
}

const namers = {};

// countryName("Germany", "ro") -> "Germania"; un nume necunoscut rămâne cum era
export function countryName(name, lang) {
  if (!name || lang === "en") return name;
  const code = codeOf(name);
  if (!code) return name;
  try {
    namers[lang] ??= new Intl.DisplayNames([lang], { type: "region" });
    return namers[lang].of(code) || name;
  } catch {
    return name;
  }
}
