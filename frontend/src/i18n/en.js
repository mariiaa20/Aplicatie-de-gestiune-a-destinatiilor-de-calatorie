// Toate textele site-ului în engleză.
// ro.js are exact aceleași chei, cu textele în română.
// Unde textul depinde de un număr sau de un nume, valoarea e o funcție.

// "1 place", "3 places"
const count = (n, one, many) => `${n} ${n === 1 ? one : many}`;
// doar cuvântul, fără număr (când numărul e scris separat, mai mare)
const word = (n, one, many) => (n === 1 ? one : many);

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default {
  code: "en",
  locale: "en-GB",

  // ---------- valorile fixe ale unei destinații ----------
  months: MONTHS,
  // așa cum apar în propoziții: "in April"
  monthInText: (index) => MONTHS[index],
  // pe biletul de avion: "15 APR 2027"
  monthsPrinted: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
  types: { "city-break": "City Break", beach: "Beach", mountain: "Mountain" },
  categories: { Vacation: "Vacation", Business: "Business" },
  budgets: {
    "under-500": { label: "Under €500", short: "<€500" },
    "500-1000": { label: "€500 – €1,000", short: "€500–1k" },
    "1000-2000": { label: "€1,000 – €2,000", short: "€1–2k" },
    "over-2000": { label: "Over €2,000", short: "€2k+" }
  },
  euro: (n) => `€${n.toLocaleString("en-US")}`,
  regions: {
    Europe: "Europe",
    Asia: "Asia",
    Americas: "Americas",
    "Africa & Middle East": "Africa & Middle East",
    Oceania: "Oceania"
  },
  continents: {
    Europe: "Europe",
    Asia: "Asia",
    Africa: "Africa",
    "North America": "North America",
    "South America": "South America",
    Oceania: "Oceania"
  },
  // în engleză textele din date rămân cum sunt scrise acolo
  highlights: {},
  then: {},

  // ---------- ce se repetă pe mai multe pagini ----------
  common: {
    loadingList: "Loading destinations…",
    // înainte și după <code>npm run api</code>
    serverError: (error) => `Something went wrong with the server: ${error}. Is `,
    serverErrorEnd: " running?",
    backToList: "Back to My Travel List",
    notSet: "Not set",
    anyBudget: "Any budget",
    anyMonth: "Any month",
    from: "From",
    to: "To",
    fromMonth: "From month",
    toMonth: "To month",
    budget: "Budget",
    search: "Search",
    visited: "Visited",
    planned: "Planned",
    saving: "Saving…",
    addToList: "Add to my list",
    inList: "In your list",
    clearFilters: "Clear filters",
    delete: "Delete",
    deleteItem: (name) => `Delete ${name}`,
    markVisited: (name) => `Mark ${name} as visited`,
    yourRating: "Your rating",
    stars: (n) => `${n} out of 5 stars`,
    photoCredit: "Photo: Wikipedia",
    previousPages: "Previous pages",
    nextPages: "Next pages",
    openingPage: "Opening the page…",
    noDestinations: "No destinations found."
  },

  layout: {
    subtitle: "Manage and organize your travel destinations.",
    navLabel: "Pages",
    nav: {
      list: "My Travel List",
      globe: "Travel Globe",
      inspire: "Get inspired",
      next: "Where next?",
      stats: "Stats",
      about: "About"
    },
    light: "☀️ Light mode",
    dark: "🌙 Dark mode",
    language: "Language",
    plane: "airplane",
    footer: "Tehnologii Web project, UPB, 2026"
  },

  form: {
    title: "Add a destination",
    name: "Destination name",
    namePlaceholder: "e.g. Lisbon, Portugal",
    type: "Location type",
    category: "Trip category",
    period: "Desired period (optional)",
    budget: "Budget (optional)",
    why: "Why go there? (optional)",
    whyPlaceholder: "e.g. Tram rides and sunset viewpoints",
    photo: "Photo",
    uploadedAlt: "Your uploaded photo",
    previewAlt: (title) => `${title} preview`,
    noPhoto: "No photo found for this name.",
    typeForPhoto: "Type a name to see a photo.",
    upload: "Upload your own",
    remove: "Remove",
    submit: "Add destination",
    errors: {
      required: "The destination name is required.",
      tooLong: (max) => `The name can have at most ${max} characters.`,
      noLetter: "The name must contain at least one letter.",
      taken: (name) => `"${name}" is already in your travel list.`,
      whyTooLong: (max) => `The description can have at most ${max} characters.`,
      saveFailed: (message) => `Could not save the destination: ${message}`,
      notImage: "Please choose an image file.",
      tooLarge: "The image is too large (max 10 MB).",
      unreadable: "This image could not be read."
    }
  },

  home: {
    title: "My Travel List",
    summary: (total, planned) => `${count(total, "destination", "destinations")}, ${planned} planned`
  },

  table: {
    empty: "No destinations yet. Add your first one with the form on the left.",
    searchPlaceholder: "A name…",
    month: "Travel month",
    sortBy: "Sort by",
    sorts: {
      added: "Order added",
      name: "Name, A to Z",
      budget: "Budget, lowest first",
      season: "Season, soonest first"
    },
    shown: (shown, total) => `${shown} of ${total} shown`,
    clear: "Clear",
    plannedCount: (n) => `${n} planned`,
    destination: "Destination",
    status: "Status",
    rowTitle: "Click to toggle status",
    details: "Details",
    period: "Desired period",
    fromFor: (name) => `From month for ${name}`,
    toFor: (name) => `To month for ${name}`,
    noItems: "No items"
  },

  detail: {
    loading: "Loading the destination…",
    missingTitle: "No such destination",
    missingError: (error) => `The destination could not be loaded: ${error}.`,
    missingHint: "Maybe it was deleted, or the link is old.",
    record: (id) => `Destination record no. ${id}`,
    inSeason: "It is the best season right now. Time to pack.",
    seasonTomorrow: (month) => `The best season starts tomorrow, in ${month}.`,
    seasonIn: (days, month) => `The best season starts in ${days} days, in ${month}.`,
    type: "Location type",
    category: "Trip category",
    status: "Status",
    period: "Desired period",
    rating: "Rating",
    afterTrip: "After the trip",
    bestTime: (period) => `Best time to go: ${period}.`,
    stamp: "Visited",
    markPlanned: "Mark as planned",
    markVisited: "Mark as visited",
    onGlobe: "See it on the globe"
  },

  undo: {
    // înainte și după numele locului, scris îngroșat
    before: "",
    after: " was deleted.",
    undo: "Undo",
    close: "Close"
  },

  weather: {
    title: (month) => `Weather in ${month}`,
    day: "by day",
    night: "at night",
    rainyDays: (n) => word(n, "rainy day", "rainy days"),
    source: (month, year) => `Measured in ${month} ${year}, from Open-Meteo.`
  },

  globe: {
    spreads: ["Your travel globe", "Visited places"],
    svgLabel: (n) => `Globe with ${n} visited countries`,
    home: "Bucharest, where every trip starts",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    reset: "Back to the whole globe",
    title: "Your travel globe",
    lead:
      "Tick a place and its country gets hatched. Click a name to fly there, drag to turn the globe, scroll or pinch to zoom.",
    countriesVisited: (n) => word(n, "country visited", "countries visited"),
    wishList: "still on the wish list",
    visitedCountries: "Visited countries",
    yourDestinations: "Your destinations",
    notFound: "not found",
    looking: "looking…",
    legend: {
      visitedCountry: "Visited country",
      plannedCountry: "Planned country",
      visitedPlace: "Visited place",
      plannedPlace: "Planned place",
      route: "Flight from Bucharest"
    },
    missing: (n) =>
      n === 1
        ? "1 destination is not on the globe: no location was found for its name on Wikipedia."
        : `${n} destinations are not on the globe: no location was found for their names on Wikipedia.`,
    visitedTitle: "Visited Places",
    noStamps: "No stamps yet.",
    stamps: (n) => `${count(n, "stamp", "stamps")} in the passport. Give each trip a rating.`,
    visitedEmpty:
      "Tick a destination on the globe page or in My Travel List and its stamp appears here."
  },

  inspire: {
    tabs: { all: "All ideas", "city-break": "City breaks", beach: "Beach", mountain: "Mountain" },
    tabsLabel: "Kind of trip",
    region: "Region",
    anywhere: "Anywhere",
    when: "When",
    searchPlaceholder: "A city, a country, a word…",
    surprise: "Surprise me",
    all: (n) => `${n} ideas in the passport.`,
    matching: (shown, total) => `${shown} of ${total} ideas match.`,
    title: "Get inspired",
    subtitle:
      "Each visa is an idea for a trip. Add one and it goes to My Travel List with its best season as the period.",
    noMatch: "No ideas match these filters.",
    visa: "Visa",
    added: "Added", // the stamp across a visa already in the list
    type: "Type",
    bestTime: "Best time"
  },

  next: {
    title: "Where next?",
    lead: "Can't choose your next trip? Let the departure board pick one for you.",
    pickFrom: "Pick from",
    fromList: "My Travel List",
    anywhere: "🌍 Anywhere in the world",
    when: "When can you go?",
    leavingFrom: "Leaving from",
    passenger: "Passenger",
    passengerPlaceholder: "Your name",
    soundOn: "🔊 Sound on",
    soundOff: "🔈 Sound off",
    emptyList: "Nothing to pick: no place in My Travel List fits these choices.",
    emptyAnywhere: "No place fits that month and budget. Try other choices.",
    switchAnywhere: "Pick from anywhere in the world",
    picking: "Picking…",
    again: "Pick again",
    pick: "Pick my next trip",
    noAirport: "Not on the board, because they have no airport we know of: ",
    inRomania: "Not on the board, because they are in Romania and easier to reach without a plane: ",
    // a smaller city: the flight leaves from the nearest big airport
    viaOption: (city, airport) => `${city} (flying from ${airport})`,
    // pe tablă intră doar litere fără diacritice, cel mult 9
    remarks: {
      boarding: "BOARDING",
      onTime: "ON TIME",
      delayed: "DELAYED",
      gateOpen: "GATE OPEN",
      scheduled: "SCHEDULED"
    }
  },

  board: {
    departures: "Departures",
    columns: { time: "Time", destination: "Destination", gate: "Gate", remark: "Remarks" }
  },

  pass: {
    label: (title) => `Boarding pass to ${title}`,
    heading: "Boarding pass",
    traveller: "Traveller",
    then: (text) => `Then ${text}.`,
    landIn: (city) => `You land right in ${city}.`,
    byRoad: (road, city) => `${road} by road from ${city}`,
    fields: {
      passenger: "Passenger",
      flight: "Flight",
      date: "Date",
      boarding: "Boarding",
      gate: "Gate",
      seat: "Seat",
      class: "Class",
      trip: "Trip"
    },
    classes: {
      "under-500": "Economy",
      "500-1000": "Economy Plus",
      "1000-2000": "Business",
      "over-2000": "First"
    },
    openPage: "Open its page",
    tickets: "Find tickets on Skyscanner ↗",
    download: "Download pass"
  },

  airports: { Bucharest: "Bucharest" },

  stats: {
    loading: "Counting your trips…",
    title: "Passport stats",
    lead: "Everything here is counted from My Travel List.",
    placesVisited: (n) => word(n, "place visited", "places visited"),
    countries: (n) => word(n, "country", "countries"),
    continents: "continents",
    stillToGo: "still to go",
    continentsTitle: "Continents",
    trips: (n) => count(n, "trip", "trips"),
    notYet: "not yet",
    countriesTitle: "Countries with a stamp",
    // înainte și după linkul spre My Travel List
    noStampsBefore: "No stamps yet. Tick a place in ",
    noStampsAfter: " when you have been there.",
    kindsTitle: "Kinds of trip",
    visitedKey: "visited",
    plannedKey: "planned",
    kindVisited: (kind, n) => `${kind}: ${n} visited`,
    kindPlanned: (kind, n) => `${kind}: ${n} planned`,
    kindValue: (visited, planned) => `${visited} visited, ${planned} planned`,
    monthsTitle: "When you want to go",
    busiest: (month, n) => `${month} is the month with the most places in season (${n}).`,
    monthTip: (month, n) => `${month}: ${count(n, "place", "places")}`,
    noMonths: "Set a period for your planned trips to see the months here.",
    budgetTitle: "Planned budget",
    // ... between <strong>€1,500</strong> and <strong>€3,000</strong>.
    budgetLead: (n) => `The ${n} planned ${word(n, "trip", "trips")} with a budget would cost between `,
    and: " and ",
    noBudget: "Give your planned trips a budget to add them up here."
  },

  about: {
    title: "About this passport",
    intro:
      "Travel Destinations Manager keeps the places I want to see and the places I have already been, like the pages of a passport: a list to plan, a globe that fills up with every trip, and a few pages of ideas for the next one.",
    issuedFor: "Issued for",
    issuedForValue: "Tehnologii Web, semester project",
    issuedBy: "Issued by",
    issuedByValue: "UPB, Faculty of Industrial Engineering and Robotics",
    valid: "Valid",
    journey: "Your journey so far",
    destinations: "destinations",
    visited: "visited",
    stillToGo: "still to go",
    contentsTitle: "Contents",
    contents: {
      list: "add a place, tick it when you have been there",
      globe: "visited countries hatched, a stamp for every trip",
      inspire: "40 ideas as visas, with filters",
      stats: "countries, continents and what the next trips cost",
      next: "a departure board picks your next trip"
    },
    gate: "Gate",
    entriesTitle: "Entries",
    entriesIntro: "Every stage of the project left a stamp on this page.",
    stage: (n) => `Stage ${n}`,
    stages: {
      1: ["Static mockup", "HTML and CSS"],
      2: ["Data logic", "plain JavaScript"],
      3: ["Vite + React", "the first app"],
      4: ["Components", "cards from data"],
      5: ["State", "tick, delete, dark mode"],
      6: ["Mock API", "json-server"],
      7: ["Forms", "validation, saving"],
      8: ["Routing", "pages, CSS Modules"],
      9: ["Own backend", "Express"]
    },
    comingSoon: "coming soon",
    madeWithTitle: "Made with",
    madeWith:
      "React and Vite, React Router for the pages, CSS Modules for the styles, d3-geo and the world-atlas map for the globe, json-server for the data, the Wikipedia API for the photos, Open-Meteo for the weather and the Web Audio API for the clack of the departure board."
  },

  intro: {
    welcome: "Welcome aboard",
    tagline: "Your trips, your stamps, your next flight.",
    document: "Travel document",
    passport: "Passport",
    skip: "Skip"
  },

  notFound: {
    title: "Page not found",
    text: "There is no page at this address. Maybe the link is old."
  }
};
