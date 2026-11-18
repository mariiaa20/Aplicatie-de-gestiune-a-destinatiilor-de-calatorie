// Toate textele site-ului în română. Cheile sunt aceleași ca în en.js.
// Numele locurilor (Lisbon, Portugal...) rămân scrise ca în date, pentru că după ele
// se caută poza pe Wikipedia și aeroportul.

// În română, de la 20 în sus se spune „de”: 1 destinație, 5 destinații, 20 de destinații
function needsDe(n) {
  const rest = n % 100;
  return n !== 0 && (rest === 0 || rest >= 20);
}
const count = (n, one, many) => (n === 1 ? `1 ${one}` : `${n} ${needsDe(n) ? "de " : ""}${many}`);
// doar cuvântul, fără număr (când numărul e scris separat, mai mare)
const word = (n, one, many) => (n === 1 ? one : `${needsDe(n) ? "de " : ""}${many}`);

const MONTHS = [
  "Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie",
  "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"
];

export default {
  code: "ro",
  locale: "ro-RO",

  // ---------- valorile fixe ale unei destinații ----------
  months: MONTHS,
  // în mijlocul propoziției lunile se scriu cu literă mică: „în aprilie”
  monthInText: (index) => MONTHS[index].toLowerCase(),
  monthsPrinted: ["IAN", "FEB", "MAR", "APR", "MAI", "IUN", "IUL", "AUG", "SEP", "OCT", "NOI", "DEC"],
  types: { "city-break": "City break", beach: "Plajă", mountain: "Munte" },
  categories: { Vacation: "Vacanță", Business: "Afaceri" },
  budgets: {
    "under-500": { label: "Sub 500 €", short: "<500 €" },
    "500-1000": { label: "500 – 1.000 €", short: "500–1k €" },
    "1000-2000": { label: "1.000 – 2.000 €", short: "1–2k €" },
    "over-2000": { label: "Peste 2.000 €", short: "2k+ €" }
  },
  euro: (n) => `${n.toLocaleString("ro-RO")} €`,
  regions: {
    Europe: "Europa",
    Asia: "Asia",
    Americas: "America",
    "Africa & Middle East": "Africa și Orientul Mijlociu",
    Oceania: "Oceania"
  },
  continents: {
    Europe: "Europa",
    Asia: "Asia",
    Africa: "Africa",
    "North America": "America de Nord",
    "South America": "America de Sud",
    Oceania: "Oceania"
  },

  // descrierile ideilor din Get inspired (data/suggestions.js), după numele locului
  highlights: {
    "Lisbon, Portugal": "Străzi cu faianță, plimbări cu tramvaiul și apusuri de pe belvedere.",
    "Kyoto, Japan": "Temple liniștite, ceainării și păduri de bambus.",
    "Reykjavik, Iceland": "Izvoare termale, peisaje vulcanice și aurora boreală.",
    "Dubrovnik, Croatia": "Un oraș vechi între ziduri, deasupra Adriaticii.",
    "Prague, Czech Republic": "Turnuri gotice, poduri vechi și berării primitoare.",
    "Vienna, Austria": "Palate, cafenele vieneze și târguri de Crăciun.",
    "Istanbul, Turkey": "Bazaruri, moschei și feriboturi între două continente.",
    "Sibiu, Romania": "Piețe colorate, acoperișuri cu ochi și festivaluri vara.",
    "Edinburgh, Scotland": "Un castel pe stâncă, străduțe înguste și festivalul din august.",
    "Marrakech, Morocco": "Souk-uri pline de viață, riaduri cu fântâni și ceai de mentă.",
    "Cape Town, South Africa": "Table Mountain, pinguini și podgorii aproape de oraș.",
    "Hanoi, Vietnam": "Mâncare de stradă, lacuri și un cartier vechi plin de viață.",
    "Seoul, South Korea": "Palate regale, piețe de noapte și culorile toamnei.",
    "New York City, USA": "Muzee, Central Park și priveliști de pe acoperișuri.",
    "Mexico City, Mexico": "Picturi murale, piețe și unele dintre cele mai bune tacos pe care le vei mânca.",
    "Buenos Aires, Argentina": "Tango, cafenele vechi și cine lungi, până târziu în noapte.",
    "Maldives": "Vile deasupra apei și lagune turcoaz.",
    "Bali, Indonesia": "Terase de orez, temple și plaje pentru surf.",
    "Phi Phi Islands, Thailand": "Faleze de calcar, bărci long-tail și apă limpede.",
    "Algarve, Portugal": "Faleze aurii, peșteri marine și orășele de pescari.",
    "Sardinia, Italy": "Nisip alb, apă foarte limpede și sate liniștite.",
    "Crete, Greece": "Nisip roz la Elafonissi, chei și porturi vechi.",
    "Vama Veche, Romania": "Un sat boem la Marea Neagră, cu muzică până dimineața.",
    "Zanzibar, Tanzania": "Plantații de mirodenii, Stone Town și plaje lungi, albe.",
    "Seychelles": "Bolovani de granit pe nisip și țestoase uriașe.",
    "Tulum, Mexico": "Ruine maya deasupra mării și băi în cenote.",
    "Bora Bora, French Polynesia": "Un vârf verde în mijlocul unei lagune albastre.",
    "Whitsunday Islands, Australia": "Plaja Whitehaven și Marea Barieră de Corali la un pas.",
    "Zermatt, Switzerland": "Străzi fără mașini și Matterhornul în fiecare fereastră.",
    "Dolomites, Italy": "Vârfuri zimțate, cabane și lacuri alpine.",
    "Chamonix, France": "Schi sub Mont Blanc și o telecabină până în nori.",
    "Făgăraș Mountains, Romania": "Transfăgărășanul, lacul Bâlea și trasee lungi pe creastă.",
    "High Tatras, Slovakia": "Munți mici, priveliști mari și lacuri pe fiecare traseu.",
    "Atlas Mountains, Morocco": "Sate berbere, văi adânci și urcarea pe Toubkal.",
    "Kilimanjaro, Tanzania": "Acoperișul Africii, urcat în cam o săptămână.",
    "Annapurna, Nepal": "Ceainării, steaguri de rugăciune și vârfuri de peste 8.000 de metri.",
    "Mount Fuji, Japan": "O urcare noaptea, ca să vezi răsăritul de sus.",
    "Machu Picchu, Peru": "Drumul incașilor și un oraș pierdut în nori.",
    "Torres del Paine, Chile": "Turnuri de granit, ghețari și vântul puternic al Patagoniei.",
    "Queenstown, New Zealand": "Lacuri, drumeții și locul unde s-a născut bungee jumping-ul."
  },

  // cum ajungi de la aeroport la loc (data/airports.js), după textul în engleză
  then: {
    "1 h 30 by road to Banff": "1 h 30 cu mașina până la Banff",
    "1 h 20 by train to Kyoto": "1 h 20 cu trenul până la Kyoto",
    "45 min by bus to Reykjavik": "45 min cu autobuzul până la Reykjavik",
    "a boat or seaplane to the island": "cu barca sau cu hidroavionul până pe insulă",
    "2 h by ferry to the islands": "2 h cu feribotul până la insule",
    "1 h by road to Vama Veche": "1 h cu mașina până în Vama Veche",
    "2 h by road to Tulum": "2 h cu mașina până la Tulum",
    "a 50 min island flight to Bora Bora": "un zbor de 50 min până pe Bora Bora",
    "3 h 30 by train to Zermatt": "3 h 30 cu trenul până la Zermatt",
    "2 h 30 by road to the Dolomites": "2 h 30 cu mașina până în Dolomiți",
    "1 h by road to Chamonix": "1 h cu mașina până la Chamonix",
    "1 h by road to the mountains": "1 h cu mașina până la munte",
    "2 h 30 by road to the Tatras": "2 h 30 cu mașina până în Tatra",
    "1 h 30 by road to the mountains": "1 h 30 cu mașina până la munte",
    "a short flight to Pokhara": "un zbor scurt până la Pokhara",
    "2 h by bus to Mount Fuji": "2 h cu autobuzul până la Muntele Fuji",
    "3 h 30 by train to Machu Picchu": "3 h 30 cu trenul până la Machu Picchu",
    "5 h by road to the park": "5 h cu mașina până în parc"
  },

  // ---------- ce se repetă pe mai multe pagini ----------
  common: {
    loadingList: "Se încarcă destinațiile…",
    serverError: (error) => `A apărut o problemă cu serverul: ${error}. Ai pornit `,
    serverErrorEnd: "?",
    backToList: "Înapoi la Lista mea",
    notSet: "Neales",
    anyBudget: "Orice buget",
    anyMonth: "Orice lună",
    from: "De la",
    to: "Până la",
    fromMonth: "Luna de început",
    toMonth: "Luna de sfârșit",
    budget: "Buget",
    search: "Caută",
    visited: "Vizitat",
    planned: "Planificat",
    saving: "Se salvează…",
    addToList: "Adaugă în listă",
    inList: "E deja în listă",
    clearFilters: "Șterge filtrele",
    delete: "Șterge",
    deleteItem: (name) => `Șterge ${name}`,
    markVisited: (name) => `Marchează ${name} ca vizitată`,
    yourRating: "Nota ta",
    stars: (n) => `${n} din 5 stele`,
    photoCredit: "Foto: Wikipedia",
    previousPages: "Paginile anterioare",
    nextPages: "Paginile următoare",
    openingPage: "Se deschide pagina…",
    noDestinations: "Nu am găsit destinații."
  },

  layout: {
    subtitle: "Planifică și organizează-ți destinațiile de călătorie.",
    navLabel: "Pagini",
    nav: {
      list: "Lista mea",
      globe: "Globul călătoriilor",
      inspire: "Inspirație",
      next: "Unde mergem?",
      stats: "Statistici",
      about: "Despre"
    },
    light: "☀️ Mod luminos",
    dark: "🌙 Mod întunecat",
    language: "Limba",
    plane: "avion",
    footer: "Proiect la Tehnologii Web, UPB, 2026"
  },

  form: {
    title: "Adaugă o destinație",
    name: "Numele destinației",
    namePlaceholder: "ex. Lisbon, Portugal",
    type: "Tipul locului",
    category: "Categoria călătoriei",
    period: "Perioada dorită (opțional)",
    budget: "Buget (opțional)",
    why: "De ce să mergi acolo? (opțional)",
    whyPlaceholder: "ex. Plimbări cu tramvaiul și apusuri frumoase",
    photo: "Fotografie",
    uploadedAlt: "Fotografia încărcată de tine",
    previewAlt: (title) => `Previzualizare ${title}`,
    noPhoto: "Nu am găsit nicio fotografie pentru acest nume.",
    typeForPhoto: "Scrie un nume ca să vezi o fotografie.",
    upload: "Încarcă una proprie",
    remove: "Elimină",
    submit: "Adaugă destinația",
    errors: {
      required: "Numele destinației este obligatoriu.",
      tooLong: (max) => `Numele poate avea cel mult ${max} de caractere.`,
      noLetter: "Numele trebuie să conțină cel puțin o literă.",
      taken: (name) => `„${name}” este deja în lista ta.`,
      whyTooLong: (max) => `Descrierea poate avea cel mult ${max} de caractere.`,
      saveFailed: (message) => `Destinația nu a putut fi salvată: ${message}`,
      notImage: "Alege un fișier de tip imagine.",
      tooLarge: "Imaginea e prea mare (cel mult 10 MB).",
      unreadable: "Imaginea nu a putut fi citită."
    }
  },

  home: {
    title: "Lista mea de călătorii",
    summary: (total, planned) =>
      `${count(total, "destinație", "destinații")}, ${count(planned, "planificată", "planificate")}`
  },

  table: {
    empty: "Nu ai încă nicio destinație. Adaug-o pe prima cu formularul din stânga.",
    searchPlaceholder: "Un nume…",
    month: "Luna călătoriei",
    sortBy: "Ordonează după",
    sorts: {
      added: "Ordinea adăugării",
      name: "Nume, de la A la Z",
      budget: "Buget, crescător",
      season: "Sezon, cel mai apropiat"
    },
    shown: (shown, total) => `${shown} din ${total} afișate`,
    clear: "Resetează",
    plannedCount: (n) => count(n, "planificată", "planificate"),
    destination: "Destinație",
    status: "Stare",
    rowTitle: "Click ca să schimbi starea",
    details: "Detalii",
    period: "Perioada dorită",
    fromFor: (name) => `Luna de început pentru ${name}`,
    toFor: (name) => `Luna de sfârșit pentru ${name}`,
    noItems: "Nimic aici"
  },

  detail: {
    loading: "Se încarcă destinația…",
    missingTitle: "Destinația nu există",
    missingError: (error) => `Destinația nu a putut fi încărcată: ${error}.`,
    missingHint: "Poate a fost ștearsă sau linkul e vechi.",
    record: (id) => `Fișa destinației nr. ${id}`,
    inSeason: "Acum e cel mai bun sezon. E timpul să-ți faci bagajul.",
    seasonTomorrow: (month) => `Cel mai bun sezon începe mâine, în ${month}.`,
    seasonIn: (days, month) => `Cel mai bun sezon începe peste ${count(days, "zi", "zile")}, în ${month}.`,
    type: "Tipul locului",
    category: "Categoria călătoriei",
    status: "Stare",
    period: "Perioada dorită",
    rating: "Notă",
    afterTrip: "După călătorie",
    bestTime: (period) => `Cea mai bună perioadă: ${period}.`,
    stamp: "Vizitat",
    markPlanned: "Marchează ca planificată",
    markVisited: "Marchează ca vizitată",
    onGlobe: "Vezi-o pe glob"
  },

  undo: {
    before: "",
    after: " a fost ștearsă.",
    undo: "Anulează",
    close: "Închide"
  },

  weather: {
    title: (month) => `Vremea în ${month}`,
    day: "ziua",
    night: "noaptea",
    rainyDays: (n) => word(n, "zi ploioasă", "zile ploioase"),
    source: (month, year) => `Măsurată în ${month} ${year}, de Open-Meteo.`
  },

  globe: {
    spreads: ["Globul tău", "Locuri vizitate"],
    svgLabel: (n) => `Glob cu ${count(n, "țară vizitată", "țări vizitate")}`,
    home: "București, de unde pleacă fiecare călătorie",
    zoomIn: "Mărește",
    zoomOut: "Micșorează",
    reset: "Înapoi la tot globul",
    title: "Globul tău",
    lead:
      "Bifează un loc și țara lui se hașurează. Apasă pe un nume ca să zbori acolo, trage ca să rotești globul, folosește rotița sau două degete ca să mărești.",
    countriesVisited: (n) => word(n, "țară vizitată", "țări vizitate"),
    wishList: "încă pe lista de dorințe",
    visitedCountries: "Țări vizitate",
    yourDestinations: "Destinațiile tale",
    notFound: "negăsit",
    looking: "se caută…",
    legend: {
      visitedCountry: "Țară vizitată",
      plannedCountry: "Țară planificată",
      visitedPlace: "Loc vizitat",
      plannedPlace: "Loc planificat",
      route: "Zbor din București"
    },
    missing: (n) =>
      n === 1
        ? "O destinație nu apare pe glob: nu am găsit pe Wikipedia unde se află."
        : `${count(n, "destinație", "destinații")} nu apar pe glob: nu am găsit pe Wikipedia unde se află.`,
    visitedTitle: "Locuri vizitate",
    noStamps: "Încă nicio ștampilă.",
    stamps: (n) => `${count(n, "ștampilă", "ștampile")} în pașaport. Dă o notă fiecărei călătorii.`,
    visitedEmpty: "Bifează o destinație pe pagina globului sau în Lista mea și ștampila ei apare aici."
  },

  inspire: {
    tabs: { all: "Toate ideile", "city-break": "City break", beach: "Plajă", mountain: "Munte" },
    tabsLabel: "Tipul călătoriei",
    region: "Regiune",
    anywhere: "Oriunde",
    when: "Când",
    searchPlaceholder: "Un oraș, o țară, un cuvânt…",
    surprise: "Surprinde-mă",
    all: (n) => `${count(n, "idee", "idei")} în pașaport.`,
    matching: (shown, total) =>
      `${shown} din ${count(total, "idee", "idei")} ${shown === 1 ? "se potrivește" : "se potrivesc"}.`,
    title: "Inspirație",
    subtitle:
      "Fiecare viză e o idee de călătorie. Adaug-o și ajunge în Lista mea, cu cel mai bun sezon drept perioadă.",
    noMatch: "Nicio idee nu se potrivește cu aceste filtre.",
    visa: "Viză",
    added: "Adăugat",
    type: "Tip",
    bestTime: "Perioada"
  },

  next: {
    title: "Unde mergem?",
    lead: "Nu te poți hotărî unde să mergi? Lasă panoul de plecări să aleagă pentru tine.",
    pickFrom: "Alege din",
    fromList: "Lista mea",
    anywhere: "🌍 Oriunde în lume",
    when: "Când poți pleca?",
    leavingFrom: "Plec din",
    passenger: "Pasager",
    passengerPlaceholder: "Numele tău",
    soundOn: "🔊 Cu sunet",
    soundOff: "🔈 Fără sunet",
    emptyList: "Nu am din ce alege: niciun loc din Lista mea nu se potrivește cu alegerile tale.",
    emptyAnywhere: "Niciun loc nu se potrivește cu luna și bugetul alese. Încearcă altceva.",
    switchAnywhere: "Alege de oriunde din lume",
    picking: "Se alege…",
    again: "Mai alege o dată",
    pick: "Alege-mi următoarea călătorie",
    noAirport: "Nu apar pe panou, pentru că nu știm ce aeroport au: ",
    inRomania: "Nu apar pe panou, pentru că sunt în România și ajungi mai ușor fără avion: ",
    viaOption: (city, airport) => `${city} (zbor din ${airport})`,
    // pe tablă intră doar litere fără diacritice, cel mult 9
    remarks: {
      boarding: "IMBARCARE",
      onTime: "LA TIMP",
      delayed: "INTARZIAT",
      gateOpen: "LA POARTA",
      scheduled: "PROGRAMAT"
    }
  },

  board: {
    departures: "Plecări",
    columns: { time: "Ora", destination: "Destinație", gate: "Poarta", remark: "Stare" }
  },

  pass: {
    label: (title) => `Carte de îmbarcare spre ${title}`,
    heading: "Carte de îmbarcare",
    traveller: "Călător",
    then: (text) => `Apoi ${text}.`,
    landIn: (city) => `Aterizezi chiar în ${city}.`,
    byRoad: (road, city) => `${road} cu mașina din ${city}`,
    fields: {
      passenger: "Pasager",
      flight: "Zbor",
      date: "Data",
      boarding: "Îmbarcare",
      gate: "Poarta",
      seat: "Loc",
      class: "Clasa",
      trip: "Călătorie"
    },
    classes: {
      "under-500": "Economic",
      "500-1000": "Economic Plus",
      "1000-2000": "Business",
      "over-2000": "Întâi"
    },
    openPage: "Deschide pagina ei",
    tickets: "Caută bilete pe Skyscanner ↗",
    download: "Descarcă biletul"
  },

  airports: { Bucharest: "București" },

  stats: {
    loading: "Se numără călătoriile…",
    title: "Statisticile pașaportului",
    lead: "Totul de aici e numărat din Lista mea.",
    placesVisited: (n) => word(n, "loc vizitat", "locuri vizitate"),
    countries: (n) => word(n, "țară", "țări"),
    continents: "continente",
    stillToGo: "încă de vizitat",
    continentsTitle: "Continente",
    trips: (n) => count(n, "călătorie", "călătorii"),
    notYet: "încă nu",
    countriesTitle: "Țări cu ștampilă",
    noStampsBefore: "Încă nicio ștampilă. Bifează un loc în ",
    noStampsAfter: " după ce ai fost acolo.",
    kindsTitle: "Tipuri de călătorii",
    visitedKey: "vizitate",
    plannedKey: "planificate",
    kindVisited: (kind, n) => `${kind}: ${count(n, "vizitată", "vizitate")}`,
    kindPlanned: (kind, n) => `${kind}: ${count(n, "planificată", "planificate")}`,
    kindValue: (visited, planned) =>
      `${count(visited, "vizitată", "vizitate")}, ${count(planned, "planificată", "planificate")}`,
    monthsTitle: "Când vrei să pleci",
    busiest: (month, n) => `${month} e luna cu cele mai multe locuri în sezon (${n}).`,
    monthTip: (month, n) => `${month}: ${count(n, "loc", "locuri")}`,
    noMonths: "Alege o perioadă pentru călătoriile planificate și lunile apar aici.",
    budgetTitle: "Bugetul planificat",
    budgetLead: (n) =>
      n === 1
        ? "Singura călătorie planificată cu buget ar costa între "
        : `Cele ${count(n, "călătorie", "călătorii")} planificate cu buget ar costa între `,
    and: " și ",
    noBudget: "Dă un buget călătoriilor planificate ca să le aduni aici."
  },

  about: {
    title: "Despre acest pașaport",
    intro:
      "Travel Destinations Manager păstrează locurile pe care vreau să le văd și pe cele în care am fost deja, ca paginile unui pașaport: o listă pentru planuri, un glob care se umple cu fiecare călătorie și câteva pagini cu idei pentru următoarea.",
    issuedFor: "Emis pentru",
    issuedForValue: "Tehnologii Web, proiect de semestru",
    issuedBy: "Emis de",
    issuedByValue: "UPB, Facultatea de Inginerie Industrială și Robotică",
    valid: "Valabil",
    journey: "Drumul tău până acum",
    destinations: "destinații",
    visited: "vizitate",
    stillToGo: "încă de vizitat",
    contentsTitle: "Cuprins",
    contents: {
      list: "adaugi un loc și îl bifezi după ce ai fost acolo",
      globe: "țările vizitate hașurate, o ștampilă pentru fiecare călătorie",
      inspire: "40 de idei sub formă de vize, cu filtre",
      stats: "țări, continente și cât costă următoarele călătorii",
      next: "un panou de plecări îți alege următoarea călătorie"
    },
    gate: "Poarta",
    entriesTitle: "Intrări",
    entriesIntro: "Fiecare etapă a proiectului a lăsat o ștampilă pe această pagină.",
    stage: (n) => `Etapa ${n}`,
    stages: {
      1: ["Machetă statică", "HTML și CSS"],
      2: ["Logica datelor", "JavaScript simplu"],
      3: ["Vite + React", "prima aplicație"],
      4: ["Componente", "carduri din date"],
      5: ["Stare", "bifare, ștergere, temă"],
      6: ["API simulat", "json-server"],
      7: ["Formulare", "validare, salvare"],
      8: ["Rutare", "pagini, CSS Modules"],
      9: ["Backend propriu", "Express"]
    },
    comingSoon: "în curând",
    madeWithTitle: "Făcut cu",
    madeWith:
      "React și Vite, React Router pentru pagini, CSS Modules pentru stiluri, d3-geo și harta world-atlas pentru glob, json-server pentru date, API-ul Wikipedia pentru fotografii, Open-Meteo pentru vreme și Web Audio API pentru clămpănitul panoului de plecări."
  },

  intro: {
    welcome: "Bine ai venit la bord",
    tagline: "Călătoriile tale, ștampilele tale, următorul tău zbor.",
    document: "Document de călătorie",
    passport: "Pașaport",
    skip: "Sari peste"
  },

  notFound: {
    title: "Pagina nu există",
    text: "La această adresă nu e nicio pagină. Poate linkul e vechi."
  }
};
