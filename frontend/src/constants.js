// The fixed values of a destination and their labels, in one place.
// The form, the list, the cards, the detail page and Get inspired all read them from here.

export const LOCATION_TYPES = [
  { value: "city-break", label: "City Break" },
  { value: "beach", label: "Beach" },
  { value: "mountain", label: "Mountain" }
];

// { "city-break": "City Break", beach: "Beach", mountain: "Mountain" }
export const TYPE_LABELS = Object.fromEntries(
  LOCATION_TYPES.map((type) => [type.value, type.label])
);

export const TRIP_CATEGORIES = ["Vacation", "Business"];
