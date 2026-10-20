# Stage 4: AI log

## Tools
- Gemini

## Conversations
- https://gemini.google.com/app/e9e0d3919d369005 (Building React components from data, conditional rendering, and Vite troubleshooting)

## Key requests

### 1. Component modularization from data
- Asked: Adapt Stage 4 requirements to the Travel Destinations Manager theme by replacing raw JSON rendering with dedicated React components.
- Got: Two components in `frontend/src/components/`: `DestinationCard.jsx` (receives a destination via props, renders title, category, type badge, and status) and `DestinationList.jsx` (handles mapping with unique `key={id}` and conditional rendering for empty lists).
- Changed or rejected: Kept the exact field names defined in Stage 2 (`title`, `visited`, `type`, `category`) to ensure continuity across all stages.

### 2. Layout integration & visited state styling
- Asked: Integrate the new list and card components into `App.jsx` and adapt `App.css` so visited destinations change visual state without altering the existing purple-pink theme and flight animations.
- Got: Updated `App.jsx` and added CSS rules (`.destinations-list`, `.destination-card`, `.done`, `.badge-*`) that add strikethrough styling and altered opacity/borders for visited items.
- Changed or rejected: Kept the existing card container and animated plane intact, only replacing the obsolete `.raw-json` styles.

### 3. PowerShell & Vite execution troubleshooting
- Asked: Fix terminal errors (`PSSecurityException` and missing `package.json`) preventing `npm run dev` from starting.
- Got: Solutions using `npm.cmd` to bypass PowerShell script execution restrictions, navigating into `frontend/` before launching Vite, and keeping the process active in the terminal to avoid connection refused errors.
- Changed or rejected: Used `npm.cmd run dev` directly from the `frontend/` directory to run the development server without modifying system-wide execution policies.

## What I learned / what did not work
<<<<<<< HEAD
I learned how to structure and pass data via props between parent and child components (`App` -> `DestinationList` -> `DestinationCard`). I understood why React requires a unique `key` prop when rendering arrays with `.map()`, and how to implement conditional rendering for empty data states. I also learned how to troubleshoot Windows PowerShell script execution security policies when running npm tools.
=======
I learned how to structure and pass data via props between parent and child components (`App` -> `DestinationList` -> `DestinationCard`). I understood why React requires a unique `key` prop when rendering arrays with `.map()`, and how to implement conditional rendering for empty data states. I also learned how to troubleshoot Windows PowerShell script execution security policies when running npm tools.
>>>>>>> 7cc760b1aaa038f36f6057335f2b348f3d8bc061
