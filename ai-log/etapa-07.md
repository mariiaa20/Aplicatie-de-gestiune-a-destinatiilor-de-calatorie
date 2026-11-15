# Stage 7: AI log

## Tools
- Claude

## Conversations
- https://claude.ai/code/session_012W8eU67niV8s7Tn6Qd34D4 (Form with validation, saving every change to json-server, tw.json and data-testid, then pages, the travel globe and the passport look)

## Key requests

### 1. The add form on my own data
- Asked: Help with stage 7 on my theme, with the fields my destinations already have in `db.json`, not the title and priority from the TaskFlow example.
- Got: A new `DestinationForm.jsx` where every field is controlled (`value` + `onChange`): name, location type, trip category, period, budget and a short "why go there". `validate()` returns one message or an empty string, and `handleSubmit` stops there if there is a message, so nothing is sent. The message is shown in the page, under the fields, with `aria-invalid` on the name field.
- Changed or rejected: I added two rules of my own: the name must contain at least one letter, and the same place cannot be added twice (the form gets the existing names from `App`). I kept the photo upload from stage 5 as an optional field.

### 2. Every change saved on the server
- Asked: Why a destination I added disappeared after refresh, and how to make adding, ticking and deleting stay.
- Got: The rule "server first, then state". `api.js` got `createDestination` (POST), `updateDestination` (PATCH) and `deleteDestination` (DELETE), all through the shared `request()` function. `App` changes the list only after the server answers and uses the object the server sends back, so the id comes from json-server. While saving, the button is disabled and says "Saving…", and the form is cleared only if the save worked.
- Changed or rejected: I asked for PATCH instead of PUT for ticking and for the rating, because only one field changes and PUT would replace the whole object.

### 3. tw.json and data-testid
- Asked: Where to put the `data-testid` attributes, because my list is split in three tables, and the destinations also appear on other pages.
- Got: `tw.json` in the root of the repository, and the attributes only on the rows of My Travel List (`item` with `data-id`, `item-title`, `item-toggle`, `item-delete`, `empty`) and on the form. The form and the list stay together on the home page, because the automated check adds an item and looks for it on the same page.
- Changed or rejected: I wanted the globe to be the home page, but I kept the form on `/` until the stage is graded. It is a four-line change later.

### 4. Extra features and the new look
- Asked: Separate pages, a globe where the countries I visited get hatched, and a more elegant design, because the light blue looked like a site for children.
- Got: Pages with `react-router-dom` (My Travel List, Travel Globe, Get inspired), a globe drawn with `d3-geo` and the `world-atlas` map, with zoom and drag, and the coordinates of each place taken from Wikipedia. Then a passport theme: leather cover, paper pages with a guilloché pattern, visited places as ink stamps. Get inspired became the visa pages of the passport, with 40 ideas, filters and a "Surprise me" button, and the pages turn with an animation, on the globe page too.
- Changed or rejected: I rejected the first passport version because it was too plain, a page with a few colours. The second one looks like a real open passport book, with a spine in the middle and page numbers.

## What I learned / what did not work
I learned that a form in React is just state: every input shows a value from `useState` and changes it on every key, so validation is a normal function that reads that state before anything is sent. I understood why the list should change only after the server answers: if the save fails, the screen does not show something that does not exist, and the id comes from the server, not from my code. I also saw why `try / finally` matters: without `finally`, a failed save would leave the button stuck on "Saving…". For the page turn I learned that `useLayoutEffect` runs after React changes the page but before the browser shows it, so there is still time to copy the old page and turn it. What did not work at first: changes I made in `App.css` did not show up, because I had two dev servers open and was looking at the old one.