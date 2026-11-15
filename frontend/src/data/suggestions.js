// Ideas for the Get inspired page.
// from / to = the best months to go (1-12), the same format as periodFrom / periodTo.
// A period like "11" -> "3" goes over New Year (November to March).
// budget uses the keys from utils/travelOptions.js

export const REGIONS = ["Europe", "Asia", "Americas", "Africa & Middle East", "Oceania"];

export const SUGGESTIONS = [
  // ---------- City breaks ----------
  {
    title: "Lisbon, Portugal",
    type: "city-break",
    region: "Europe",
    budget: "500-1000",
    from: "4",
    to: "6",
    highlight: "Tiled streets, tram rides and sunset viewpoints."
  },
  {
    title: "Kyoto, Japan",
    type: "city-break",
    region: "Asia",
    budget: "over-2000",
    from: "3",
    to: "5",
    highlight: "Quiet temples, tea houses and bamboo groves."
  },
  {
    title: "Reykjavik, Iceland",
    type: "city-break",
    region: "Europe",
    budget: "1000-2000",
    from: "9",
    to: "3",
    highlight: "Hot springs, volcanic landscapes and northern lights."
  },
  {
    title: "Dubrovnik, Croatia",
    type: "city-break",
    region: "Europe",
    budget: "500-1000",
    from: "5",
    to: "6",
    highlight: "A walled old town above the Adriatic."
  },
  {
    title: "Prague, Czech Republic",
    type: "city-break",
    region: "Europe",
    budget: "under-500",
    from: "4",
    to: "6",
    highlight: "Gothic towers, old bridges and cosy beer halls."
  },
  {
    title: "Vienna, Austria",
    type: "city-break",
    region: "Europe",
    budget: "500-1000",
    from: "11",
    to: "12",
    highlight: "Palaces, coffee houses and Christmas markets."
  },
  {
    title: "Istanbul, Turkey",
    type: "city-break",
    region: "Europe",
    budget: "500-1000",
    from: "4",
    to: "5",
    highlight: "Bazaars, mosques and ferries between two continents."
  },
  {
    title: "Sibiu, Romania",
    type: "city-break",
    region: "Europe",
    budget: "under-500",
    from: "5",
    to: "9",
    highlight: "Colourful squares, roofs with eyes and summer festivals."
  },
  {
    title: "Edinburgh, Scotland",
    type: "city-break",
    region: "Europe",
    budget: "500-1000",
    from: "6",
    to: "8",
    highlight: "A castle on a rock, narrow closes and the August festival."
  },
  {
    title: "Marrakech, Morocco",
    type: "city-break",
    region: "Africa & Middle East",
    budget: "500-1000",
    from: "3",
    to: "5",
    highlight: "Busy souks, riads with fountains and mint tea."
  },
  {
    title: "Cape Town, South Africa",
    type: "city-break",
    region: "Africa & Middle East",
    budget: "1000-2000",
    from: "11",
    to: "3",
    highlight: "Table Mountain, penguins and wine farms nearby."
  },
  {
    title: "Hanoi, Vietnam",
    type: "city-break",
    region: "Asia",
    budget: "1000-2000",
    from: "10",
    to: "12",
    highlight: "Street food, lakes and a busy old quarter."
  },
  {
    title: "Seoul, South Korea",
    type: "city-break",
    region: "Asia",
    budget: "1000-2000",
    from: "9",
    to: "11",
    highlight: "Royal palaces, night markets and autumn colours."
  },
  {
    title: "New York City, USA",
    type: "city-break",
    region: "Americas",
    budget: "over-2000",
    from: "9",
    to: "11",
    highlight: "Museums, Central Park and views from the rooftops."
  },
  {
    title: "Mexico City, Mexico",
    type: "city-break",
    region: "Americas",
    budget: "1000-2000",
    from: "3",
    to: "5",
    highlight: "Murals, markets and some of the best tacos you will eat."
  },
  {
    title: "Buenos Aires, Argentina",
    type: "city-break",
    region: "Americas",
    budget: "over-2000",
    from: "10",
    to: "11",
    highlight: "Tango, old cafés and long dinners late at night."
  },

  // ---------- Beach ----------
  {
    title: "Maldives",
    type: "beach",
    region: "Asia",
    budget: "over-2000",
    from: "11",
    to: "4",
    highlight: "Overwater villas and turquoise lagoons."
  },
  {
    title: "Bali, Indonesia",
    type: "beach",
    region: "Asia",
    budget: "1000-2000",
    from: "5",
    to: "9",
    highlight: "Rice terraces, temples and surf beaches."
  },
  {
    title: "Phi Phi Islands, Thailand",
    type: "beach",
    region: "Asia",
    budget: "1000-2000",
    from: "11",
    to: "4",
    highlight: "Limestone cliffs, long-tail boats and clear water."
  },
  {
    title: "Algarve, Portugal",
    type: "beach",
    region: "Europe",
    budget: "500-1000",
    from: "6",
    to: "9",
    highlight: "Golden cliffs, sea caves and small fishing towns."
  },
  {
    title: "Sardinia, Italy",
    type: "beach",
    region: "Europe",
    budget: "500-1000",
    from: "6",
    to: "9",
    highlight: "White sand, very clear water and quiet villages."
  },
  {
    title: "Crete, Greece",
    type: "beach",
    region: "Europe",
    budget: "500-1000",
    from: "5",
    to: "10",
    highlight: "Pink sand at Elafonissi, gorges and old harbours."
  },
  {
    title: "Vama Veche, Romania",
    type: "beach",
    region: "Europe",
    budget: "under-500",
    from: "7",
    to: "8",
    highlight: "A free-spirited village by the Black Sea, music until morning."
  },
  {
    title: "Zanzibar, Tanzania",
    type: "beach",
    region: "Africa & Middle East",
    budget: "1000-2000",
    from: "6",
    to: "10",
    highlight: "Spice farms, Stone Town and long white beaches."
  },
  {
    title: "Seychelles",
    type: "beach",
    region: "Africa & Middle East",
    budget: "over-2000",
    from: "4",
    to: "5",
    highlight: "Granite boulders on the sand and giant tortoises."
  },
  {
    title: "Tulum, Mexico",
    type: "beach",
    region: "Americas",
    budget: "1000-2000",
    from: "11",
    to: "4",
    highlight: "Maya ruins above the sea and swims in cenotes."
  },
  {
    title: "Bora Bora, French Polynesia",
    type: "beach",
    region: "Oceania",
    budget: "over-2000",
    from: "5",
    to: "10",
    highlight: "A green peak in the middle of a blue lagoon."
  },
  {
    title: "Whitsunday Islands, Australia",
    type: "beach",
    region: "Oceania",
    budget: "over-2000",
    from: "8",
    to: "10",
    highlight: "Whitehaven Beach and the Great Barrier Reef close by."
  },

  // ---------- Mountain ----------
  {
    title: "Zermatt, Switzerland",
    type: "mountain",
    region: "Europe",
    budget: "over-2000",
    from: "6",
    to: "9",
    highlight: "Car-free streets and the Matterhorn from every window."
  },
  {
    title: "Dolomites, Italy",
    type: "mountain",
    region: "Europe",
    budget: "500-1000",
    from: "6",
    to: "9",
    highlight: "Jagged peaks, mountain huts and alpine lakes."
  },
  {
    title: "Chamonix, France",
    type: "mountain",
    region: "Europe",
    budget: "1000-2000",
    from: "12",
    to: "3",
    highlight: "Skiing under Mont Blanc and a cable car to the clouds."
  },
  {
    title: "Făgăraș Mountains, Romania",
    type: "mountain",
    region: "Europe",
    budget: "under-500",
    from: "7",
    to: "9",
    highlight: "The Transfăgărășan road, Bâlea Lake and long ridge hikes."
  },
  {
    title: "High Tatras, Slovakia",
    type: "mountain",
    region: "Europe",
    budget: "under-500",
    from: "6",
    to: "9",
    highlight: "Small range, big views, mountain lakes on every trail."
  },
  {
    title: "Atlas Mountains, Morocco",
    type: "mountain",
    region: "Africa & Middle East",
    budget: "500-1000",
    from: "4",
    to: "6",
    highlight: "Berber villages, valleys and a hike up Toubkal."
  },
  {
    title: "Kilimanjaro, Tanzania",
    type: "mountain",
    region: "Africa & Middle East",
    budget: "over-2000",
    from: "6",
    to: "10",
    highlight: "The roof of Africa, climbed in about a week."
  },
  {
    title: "Annapurna, Nepal",
    type: "mountain",
    region: "Asia",
    budget: "1000-2000",
    from: "10",
    to: "11",
    highlight: "Tea houses, prayer flags and peaks over 8,000 metres."
  },
  {
    title: "Mount Fuji, Japan",
    type: "mountain",
    region: "Asia",
    budget: "over-2000",
    from: "7",
    to: "8",
    highlight: "A night climb to watch the sunrise from the top."
  },
  {
    title: "Machu Picchu, Peru",
    type: "mountain",
    region: "Americas",
    budget: "1000-2000",
    from: "5",
    to: "9",
    highlight: "The Inca Trail and a lost city in the clouds."
  },
  {
    title: "Torres del Paine, Chile",
    type: "mountain",
    region: "Americas",
    budget: "over-2000",
    from: "11",
    to: "3",
    highlight: "Granite towers, glaciers and strong Patagonian wind."
  },
  {
    title: "Queenstown, New Zealand",
    type: "mountain",
    region: "Oceania",
    budget: "1000-2000",
    from: "12",
    to: "3",
    highlight: "Lakes, hikes and the home of the bungee jump."
  }
];