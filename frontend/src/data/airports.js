// The airport you fly to for each place, with its IATA code (the three letters on tickets).
// Some places have no airport of their own: "then" says how to get there from the airport.
// Where next? only picks places that are in this list.

export const HOME_AIRPORT = { code: "OTP", city: "Bucharest", name: "Henri Coandă" };

const AIRPORTS = {
  // the destinations in db.json
  "tokyo": { code: "HND", city: "Tokyo", name: "Haneda" },
  "santorini": { code: "JTR", city: "Santorini", name: "Santorini" },
  "banff national park": { code: "YYC", city: "Calgary", then: "1 h 30 by road to Banff" },
  "brussels": { code: "BRU", city: "Brussels", name: "Brussels Airport" },

  // City breaks
  "lisbon": { code: "LIS", city: "Lisbon", name: "Humberto Delgado" },
  "kyoto": { code: "KIX", city: "Osaka", name: "Kansai", then: "1 h 20 by train to Kyoto" },
  "reykjavik": { code: "KEF", city: "Keflavík", then: "45 min by bus to Reykjavik" },
  "dubrovnik": { code: "DBV", city: "Dubrovnik" },
  "prague": { code: "PRG", city: "Prague", name: "Václav Havel" },
  "vienna": { code: "VIE", city: "Vienna" },
  "istanbul": { code: "IST", city: "Istanbul" },
  "sibiu": { code: "SBZ", city: "Sibiu" },
  "edinburgh": { code: "EDI", city: "Edinburgh" },
  "marrakech": { code: "RAK", city: "Marrakech", name: "Menara" },
  "cape town": { code: "CPT", city: "Cape Town" },
  "hanoi": { code: "HAN", city: "Hanoi", name: "Noi Bai" },
  "seoul": { code: "ICN", city: "Seoul", name: "Incheon" },
  "new york city": { code: "JFK", city: "New York", name: "John F. Kennedy" },
  "mexico city": { code: "MEX", city: "Mexico City" },
  "buenos aires": { code: "EZE", city: "Buenos Aires", name: "Ezeiza" },

  // Beach
  "maldives": { code: "MLE", city: "Malé", then: "a boat or seaplane to the island" },
  "bali": { code: "DPS", city: "Denpasar" },
  "phi phi islands": { code: "HKT", city: "Phuket", then: "2 h by ferry to the islands" },
  "algarve": { code: "FAO", city: "Faro" },
  "sardinia": { code: "CAG", city: "Cagliari" },
  "crete": { code: "HER", city: "Heraklion" },
  "vama veche": { code: "CND", city: "Constanța", then: "1 h by road to Vama Veche" },
  "zanzibar": { code: "ZNZ", city: "Zanzibar" },
  "seychelles": { code: "SEZ", city: "Mahé" },
  "tulum": { code: "CUN", city: "Cancún", then: "2 h by road to Tulum" },
  "bora bora": { code: "PPT", city: "Papeete", then: "a 50 min island flight to Bora Bora" },
  "whitsunday islands": { code: "HTI", city: "Hamilton Island" },

  // Mountain
  "zermatt": { code: "ZRH", city: "Zurich", then: "3 h 30 by train to Zermatt" },
  "dolomites": { code: "VCE", city: "Venice", then: "2 h 30 by road to the Dolomites" },
  "chamonix": { code: "GVA", city: "Geneva", then: "1 h by road to Chamonix" },
  "fagaras mountains": { code: "SBZ", city: "Sibiu", then: "1 h by road to the mountains" },
  "high tatras": { code: "KRK", city: "Kraków", then: "2 h 30 by road to the Tatras" },
  "atlas mountains": { code: "RAK", city: "Marrakech", then: "1 h 30 by road to the mountains" },
  "kilimanjaro": { code: "JRO", city: "Kilimanjaro" },
  "annapurna": { code: "KTM", city: "Kathmandu", then: "a short flight to Pokhara" },
  "mount fuji": { code: "HND", city: "Tokyo", then: "2 h by bus to Mount Fuji" },
  "machu picchu": { code: "CUZ", city: "Cusco", then: "3 h 30 by train to Machu Picchu" },
  "torres del paine": { code: "PUQ", city: "Punta Arenas", then: "5 h by road to the park" },
  "queenstown": { code: "ZQN", city: "Queenstown" }
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
