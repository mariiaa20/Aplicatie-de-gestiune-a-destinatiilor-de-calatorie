// The airport you fly to for each place, with its IATA code (the three letters on tickets),
// and the country and continent of the place, for the Stats page.
// Some places have no airport of their own: "then" says how to get there from the airport.
// Where next? only picks places that are in this list.

// The 17 airports in Romania with commercial flights, to choose where the trip starts.
// Bucharest Otopeni is first: it has by far the most flights.
// near: din aeroporturile mici pleacă puține zboruri și Skyscanner găsește des 0 rezultate,
// așa că biletul oferă și căutarea din cel mai apropiat aeroport mare
// (Otopeni, Cluj-Napoca, Timișoara sau Iași). Cele patru mari nu au near.
export const ROMANIAN_AIRPORTS = [
  { code: "OTP", city: "Bucharest", name: "Otopeni" },
  { code: "BBU", city: "Bucharest", name: "Băneasa", near: "OTP" },
  { code: "CLJ", city: "Cluj-Napoca" },
  { code: "TSR", city: "Timișoara" },
  { code: "IAS", city: "Iași" },
  { code: "SBZ", city: "Sibiu", near: "CLJ" },
  { code: "GHV", city: "Brașov", near: "OTP" },
  { code: "CND", city: "Constanța", near: "OTP" },
  { code: "BCM", city: "Bacău", near: "IAS" },
  { code: "SCV", city: "Suceava", near: "IAS" },
  { code: "CRA", city: "Craiova", near: "OTP" },
  { code: "OMR", city: "Oradea", near: "CLJ" },
  { code: "TGM", city: "Târgu Mureș", near: "CLJ" },
  { code: "BAY", city: "Baia Mare", near: "CLJ" },
  { code: "SUJ", city: "Satu Mare", near: "CLJ" },
  { code: "ARW", city: "Arad", near: "TSR" },
  { code: "TCE", city: "Tulcea", near: "OTP" }
];

export const HOME_AIRPORT = ROMANIAN_AIRPORTS[0];

// "Bucharest Băneasa", "Cluj-Napoca": the name shown in the list and on the pass
// cities: numele orașelor în limba aleasă (t.airports), de exemplu Bucharest -> București
export function airportLabel(airport, cities = {}) {
  const city = cities[airport.city] || airport.city;
  return airport.name ? `${city} ${airport.name}` : city;
}

const AIRPORTS = {
  // the destinations in db.json
  "tokyo": { code: "HND", city: "Tokyo", name: "Haneda", country: "Japan", continent: "Asia" },
  "santorini": { code: "JTR", city: "Santorini", name: "Santorini", country: "Greece", continent: "Europe" },
  "banff national park": { code: "YYC", city: "Calgary", then: "1 h 30 by road to Banff", country: "Canada", continent: "North America" },
  "brussels": { code: "BRU", city: "Brussels", name: "Brussels Airport", country: "Belgium", continent: "Europe" },

  // City breaks
  "lisbon": { code: "LIS", city: "Lisbon", name: "Humberto Delgado", country: "Portugal", continent: "Europe" },
  "kyoto": { code: "KIX", city: "Osaka", name: "Kansai", then: "1 h 20 by train to Kyoto", country: "Japan", continent: "Asia" },
  "reykjavik": { code: "KEF", city: "Keflavík", then: "45 min by bus to Reykjavik", country: "Iceland", continent: "Europe" },
  "dubrovnik": { code: "DBV", city: "Dubrovnik", country: "Croatia", continent: "Europe" },
  "prague": { code: "PRG", city: "Prague", name: "Václav Havel", country: "Czech Republic", continent: "Europe" },
  "vienna": { code: "VIE", city: "Vienna", country: "Austria", continent: "Europe" },
  "istanbul": { code: "IST", city: "Istanbul", country: "Turkey", continent: "Europe" },
  "sibiu": { code: "SBZ", city: "Sibiu", country: "Romania", continent: "Europe" },
  "edinburgh": { code: "EDI", city: "Edinburgh", country: "United Kingdom", continent: "Europe" },
  "marrakech": { code: "RAK", city: "Marrakech", name: "Menara", country: "Morocco", continent: "Africa" },
  "cape town": { code: "CPT", city: "Cape Town", country: "South Africa", continent: "Africa" },
  "hanoi": { code: "HAN", city: "Hanoi", name: "Noi Bai", country: "Vietnam", continent: "Asia" },
  "seoul": { code: "ICN", city: "Seoul", name: "Incheon", country: "South Korea", continent: "Asia" },
  "new york city": { code: "JFK", city: "New York", name: "John F. Kennedy", country: "United States", continent: "North America" },
  "mexico city": { code: "MEX", city: "Mexico City", country: "Mexico", continent: "North America" },
  "buenos aires": { code: "EZE", city: "Buenos Aires", name: "Ezeiza", country: "Argentina", continent: "South America" },

  // Beach
  "maldives": { code: "MLE", city: "Malé", then: "a boat or seaplane to the island", country: "Maldives", continent: "Asia" },
  "bali": { code: "DPS", city: "Denpasar", country: "Indonesia", continent: "Asia" },
  "phi phi islands": { code: "HKT", city: "Phuket", then: "2 h by ferry to the islands", country: "Thailand", continent: "Asia" },
  "algarve": { code: "FAO", city: "Faro", country: "Portugal", continent: "Europe" },
  "sardinia": { code: "CAG", city: "Cagliari", country: "Italy", continent: "Europe" },
  "crete": { code: "HER", city: "Heraklion", country: "Greece", continent: "Europe" },
  "vama veche": { code: "CND", city: "Constanța", then: "1 h by road to Vama Veche", country: "Romania", continent: "Europe" },
  "zanzibar": { code: "ZNZ", city: "Zanzibar", country: "Tanzania", continent: "Africa" },
  "seychelles": { code: "SEZ", city: "Mahé", country: "Seychelles", continent: "Africa" },
  "tulum": { code: "CUN", city: "Cancún", then: "2 h by road to Tulum", country: "Mexico", continent: "North America" },
  "bora bora": { code: "PPT", city: "Papeete", then: "a 50 min island flight to Bora Bora", country: "French Polynesia", continent: "Oceania" },
  "whitsunday islands": { code: "HTI", city: "Hamilton Island", country: "Australia", continent: "Oceania" },

  // Mountain
  "zermatt": { code: "ZRH", city: "Zurich", then: "3 h 30 by train to Zermatt", country: "Switzerland", continent: "Europe" },
  "dolomites": { code: "VCE", city: "Venice", then: "2 h 30 by road to the Dolomites", country: "Italy", continent: "Europe" },
  "chamonix": { code: "GVA", city: "Geneva", then: "1 h by road to Chamonix", country: "France", continent: "Europe" },
  "fagaras mountains": { code: "SBZ", city: "Sibiu", then: "1 h by road to the mountains", country: "Romania", continent: "Europe" },
  "high tatras": { code: "KRK", city: "Kraków", then: "2 h 30 by road to the Tatras", country: "Slovakia", continent: "Europe" },
  "atlas mountains": { code: "RAK", city: "Marrakech", then: "1 h 30 by road to the mountains", country: "Morocco", continent: "Africa" },
  "kilimanjaro": { code: "JRO", city: "Kilimanjaro", country: "Tanzania", continent: "Africa" },
  "annapurna": { code: "KTM", city: "Kathmandu", then: "a short flight to Pokhara", country: "Nepal", continent: "Asia" },
  "mount fuji": { code: "HND", city: "Tokyo", then: "2 h by bus to Mount Fuji", country: "Japan", continent: "Asia" },
  "machu picchu": { code: "CUZ", city: "Cusco", then: "3 h 30 by train to Machu Picchu", country: "Peru", continent: "South America" },
  "torres del paine": { code: "PUQ", city: "Punta Arenas", then: "5 h by road to the park", country: "Chile", continent: "South America" },
  "queenstown": { code: "ZQN", city: "Queenstown", country: "New Zealand", continent: "Oceania" }
};

// "Făgăraș Mountains, Romania" -> "fagaras mountains"
function keyOf(title) {
  return String(title)
    .split(",")[0]
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

// the airport for a place, or null if we do not know one
export function airportFor(title) {
  return AIRPORTS[keyOf(title)] || null;
}

export const CONTINENTS = ["Europe", "Asia", "Africa", "North America", "South America", "Oceania"];

// { country, continent } of a place; for a place we do not know, the country is
// taken from the name ("Brasov, Romania" -> "Romania") and the continent stays unknown
export function whereIs(title) {
  const known = airportFor(title);
  if (known) return { country: known.country, continent: known.continent };
  const parts = String(title).split(",");
  return { country: parts.length > 1 ? parts[parts.length - 1].trim() : null, continent: null };
}
