# Aplicatie-de-gestiune-a-destinatiilor-de-calatorie
# Travel Destinations Manager
An application that helps users manage and organize their travel destinations.

## Data model
| Field | Type | Notes |
|---|---|---|
| Destination Name | text | required, max 100 chars |
| Visited | boolean | toggled from the list, default false |
| Location Type | fixed values | Beach, Mountain, City Break |
| Trip Category | relation | Vacation, Business |
| Traveler | relation | the owner of the item |

Sample data used across all stages:
1. Tokyo, Japan — planned, City Break
2. Santorini, Greece — visited, Beach
3. Banff National Park — planned, Mountain

## How to run
```bash
cd frontend
npm install
npm run dev
```
Then open the address Vite prints, `http://localhost:5173` by default.

## AI usage
| Tool | Used for |
|---|---|
| ChatGPT / Gemini | README structure, data model, stages 1-4 |
| Claude | Stage 5: state, delete, light and dark theme |

Details per stage: see the `ai-log/` folder.

## Status
- [x] Stage 1: static mockup
- [x] Stage 2: data logic in JavaScript
- [x] Stage 3: Vite and React project
- [x] Stage 4: components rendered from data
- [x] Stage 5: local state and events
- [ ] Stage 6: loading data from a mock API

## Stage 2: data logic
Plain JavaScript, no DOM. `destinations.js` holds the array and the functions that read and change it. Results are printed in the browser console (F12).

| ID | Requirement | Where (permalink) | How to check |
|---|---|---|---|
| S2-R1 | JS file linked, logs on page load | index.html#L.. | open page, F12 |
| S2-R2 | 3+ items with id, name, state, tag | destinations.js#L..-L.. | read |
| S2-R3 | list, count, search, add, toggle, delete | destinations.js#L..-L.. | console output |
| S2-R4 | add rejects empty name and invalid tag | destinations.js#L..-L.. | last 2 console lines |
| S2-R5 | original array unchanged after add | destinations.js#L.. | console line |
| S2-R6 | README Stage 2 section + AI log | README.md, ai-log/etapa-02.md | read |
| S2-R7 | commit "Stage 2" pushed | link to the commit | commit history |

## Stage 3: Vite and React project
The app now lives in `frontend/`, built with Vite and React. The destination data from stage 2 has been moved into the main component (`App.jsx`), and the destination list is temporarily rendered in raw JSON format.

### Checklist

| ID | Requirement | Where (permalink) | How to check |
| :--- | :--- | :--- | :--- |
| S3-R1 | npm run dev starts without errors | frontend/package.json | `npm install`, `npm run dev` |
| S3-R2 | app name and counter computed from data | frontend/src/App.jsx | edit data, save |
| S3-R3 | data from README, not from the example | frontend/src/App.jsx | compare with README |
| S3-R4 | stage 1 styles reused | frontend/src/App.css | look at the page |
| S3-R5 | node_modules ignored, build passes | frontend/.gitignore | `npm run build` |
| S3-R6 | README Stage 3 section + AI log | README.md, ai-log/etapa-03.md | read |
| S3-R7 | commit "Stage 3" pushed | https://github.com/mariiaa20/Aplicatie-de-gestiune-a-destinatiilor-de-calatorie/commit/e92830a | commit history |

## Stage 4: components rendered from data
The raw JSON view was replaced with reusable React components rendering data:
- `DestinationList` receives the destinations array and maps it to cards, handling the empty state message.
- `DestinationCard` receives an individual destination object through props and formats title, category, type badge, and visit status.

### Checklist

| ID | Requirement | Where (permalink) | How to check |
| :--- | :--- | :--- | :--- |
| S4-R1 | 2+ components in src/components/ | frontend/src/components/ | open folder |
| S4-R2 | card receives data through props | frontend/src/components/DestinationCard.jsx | read code |
| S4-R3 | map + key={id}, no console warnings | frontend/src/components/DestinationList.jsx | F12, Console |
| S4-R4 | message for empty list | frontend/src/components/DestinationList.jsx | pass `[]` as prop |
| S4-R5 | state changes the card look | frontend/src/components/DestinationCard.jsx | toggle `visited` boolean |
| S4-R6 | README Stage 4 section + AI log | README.md, ai-log/etapa-04.md | read |
| S4-R7 | commit "Stage 4" pushed | [commit link] | commit history |

## Stage 5: local state and events
The destination list lives in React state, inside `App`. Ticking and deleting now work straight from the page, and the counters in the header follow on their own, because they are recalculated from the list on every render instead of being stored. A button in the top right corner of the page switches between light and dark mode. Changes are lost on refresh, which is what stage 6 and stage 10 fix.

What the stage added:
- `App` owns the list and both update functions. `handleToggleVisited` uses `map` and `handleDeleteDestination` uses `filter`, so a new array is built every time and nothing in state is changed in place.
- `DestinationList` and `DestinationsTable` do not change anything; they only pass the functions down to the cards and the rows, which call them.
- Each card and each table row has a controlled checkbox (`checked` + `onChange`) and a delete button. `DeleteButton` is a small shared component, so the icon and the `aria-label` are written once.
- The theme is kept in state for the button label, while the `data-theme` attribute on `<html>` is what the CSS reacts to. The button sits outside `<header>`: the header has `backdrop-filter`, which makes it the containing block for a `position: fixed` child, so inside it the button stayed glued to the header instead of the page.
- Every colour in `App.css` moved into a CSS variable. The dark theme only redefines those variables, in two blocks (the system preference and the explicit choice), with no duplicated rules per component.

### Checklist

| ID | Requirement | Where (permalink) | How to check |
| :--- | :--- | :--- | :--- |
| S5-R1 | list kept in useState, in App | frontend/src/App.jsx#L.. | read |
| S5-R2 | toggling changes state and card look | frontend/src/App.jsx#L..-L.., frontend/src/components/DestinationCard.jsx#L.. | click a checkbox |
| S5-R3 | delete removes the item | frontend/src/App.jsx#L.., frontend/src/components/DeleteButton.jsx#L.. | click the bin icon |
| S5-R4 | header counter derived, not in state | frontend/src/App.jsx#L.. | toggle, watch header |
| S5-R5 | immutable updates (no push, splice, assignment) | frontend/src/App.jsx#L..-L.. | read |
| S5-R6 | light / dark toggle: state + data-theme on html | frontend/src/App.jsx#L..-L.., frontend/src/App.css#L..-L.. | click the button, both system themes |
| S5-R7 | no console warnings; README + AI log | README.md, ai-log/etapa-05.md | F12, Console |
| S5-R8 | commit "Stage 5" pushed | [commit link] | commit history |