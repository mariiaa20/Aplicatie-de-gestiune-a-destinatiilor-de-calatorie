// Datele de test si valorile permise
const destinations = [
  { id: 1, title: "Paris", visited: false, type: "city-break", category: "Vacation" },
  { id: 2, title: "Maldives", visited: true, type: "beach", category: "Vacation" },
  { id: 3, title: "Swiss Alps", visited: false, type: "mountain", category: "Vacation" }
];

// Functiile aplicatiei
const LOCATION_TYPES = ["city-break", "beach", "mountain"];

// 1. List titles using map
function listTitles(list) {
  return list.map((d) => d.title);
}

// Numararea elementelor active
function countPlanned(list) {
  return list.filter((d) => !d.visited).length;
}

function searchByTitle(list, text) {
  return list.filter((d) => d.title.toLowerCase().includes(text.toLowerCase()));
}

// Calculul urmatorului ID disponibil
function nextId(list) {
  return list.reduce((max, d) => Math.max(max, d.id), 0) + 1;
}

// Adăugarea unui element nou cu validare
function addDestination(list, title, type, category = "Vacation") {
  const cleanTitle = title.trim();
  
  if (!cleanTitle) {
    console.log("Error: Destination name cannot be empty.");
    return list;
  }
  
  if (!LOCATION_TYPES.includes(type)) {
    console.log(`Error: Invalid location type '${type}'.`);
    return list;
  }
  
  const newItem = {
    id: nextId(list),
    title: cleanTitle,
    visited: false,
    type: type,
    category: category
  };
  
  return [...list, newItem];
}

// Comutarea starii (vizitat / nevizitat)
function toggleVisited(list, id) {
  return list.map((d) => (d.id === id ? { ...d, visited: !d.visited } : d));
}

function deleteDestination(list, id) {
  return list.filter((d) => d.id !== id);
}

// Testele din consola
console.log("--- Read ---");
console.log("Titles:", listTitles(destinations).join(", "));
console.log("Planned:", countPlanned(destinations));
console.log("Search 'alps':", listTitles(searchByTitle(destinations, "alps")).join(", "));

console.log("--- Add ---");
let currentList = addDestination(destinations, "Rome", "city-break");
console.log("New list length:", currentList.length, "destinations");
console.log("Original list length:", destinations.length, "destinations"); 

console.log("--- Edit & Delete ---");
currentList = toggleVisited(currentList, 1);
console.log("After visiting id 1, planned:", countPlanned(currentList));

currentList = deleteDestination(currentList, 2);
console.log("After deleting id 2, remaining titles:", listTitles(currentList).join(", "));

console.log("--- Validation ---");
addDestination(currentList, "   ", "beach"); // Should log empty name error
addDestination(currentList, "London", "space"); 
