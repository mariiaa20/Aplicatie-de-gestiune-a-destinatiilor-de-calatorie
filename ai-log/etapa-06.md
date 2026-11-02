# Stage 6: AI log

## Tools
- Claude

## Conversations
- https://claude.ai/chat/b252a1a2-fab0-4426-a807-9980e9615623 (Moving the data to json-server, loading it with useEffect, loading and error states)

## Key requests

### 1. Adapting the stage to the project
- Asked: Help with stage 6 on my own theme instead of the TaskFlow example.
- Got: The names adapted to my project (`destinations` key, `/destinations` route, `fetchDestinations`, "Loading destinations…"), a `db.json` with six destinations that keep all the fields my components already use, `api.js`, `.env.example` and the new `App.jsx`.
- Changed or rejected: Added a sixth destination with the Business category, so that both trip categories and all three location types appear in the list.

### 2. Where to show the loading and error messages
- Asked: My page has three cards (Visited Places, My Travel List, Get inspired), not one list like the example, so where should the messages go?
- Got: A single message box that replaces all three cards and spans the full width of the grid, instead of a message repeated in every card. The add form and the filters are hidden too, since they make no sense without data.
- Changed or rejected: Kept it. For the colours, the error box uses the `--danger` variables already defined in all three theme blocks in stage 5, so no new variables were needed.

### 3. Errors while running it
- Asked: Why `npm run api` says "Missing script", why `localhost:3001` shows only `{}`, and why Vite cannot find `./api.js`.
- Got: The commands have to run inside `frontend/`, where `package.json` is, not in the repository root; the data is at `/destinations`, not at the root address; and `api.js` has to sit in `src/`, next to `App.jsx`.
- Changed or rejected: Fixed all three on my side, no code changes needed.

## What I learned / what did not work
I learned that `fetch` only throws when it cannot reach the server, so a 404 or a 500 has to be caught by checking `res.ok`. I understood why the function passed to `useEffect` cannot be async and why the cleanup with `ignore` matters, and I saw in the Network tab the two requests caused by React mounting the component twice in development. I also learned to always check the route in the browser first: if the JSON is not there, no React code can fix it.