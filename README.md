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
1. Paris, active, City Break
2. Maldives, done, Beach
3. Swiss Alps, active, Mountain

## How to run
Open `index.html` in a browser. No build step, no server.

## AI usage
| Tool | Used for |
|---|---|
| ChatGPT / Gemini | Generating the initial README structure and adapting the data model |

Details per stage:
* Stage 1: see the ai-log/ folder.

## Status
- [x] Stage 1: static mockup
- [x] Stage 2: data logic in JavaScript
- [ ] Stage 3: Vite and React project

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
