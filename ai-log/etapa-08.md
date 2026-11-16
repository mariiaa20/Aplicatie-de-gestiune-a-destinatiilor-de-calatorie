# Stage 8: AI log

## Tools
- Claude

## Conversations
- https://claude.ai/code/session_012W8eU67niV8s7Tn6Qd34D4 (Layout with Outlet, detail page, About and 404 pages, moving the styles to CSS Modules)

## Key requests

### 1. Layout and routes
- Asked: How to change my app for stage 8, because I already had React Router from stage 7, with three pages written directly in `App.jsx`.
- Got: `App.jsx` now has only the routes. A route without a path renders `Layout`, and every page is drawn inside it where `<Outlet />` is. The header, the navigation (`data-testid="nav"`) and the theme button are written once, in `Layout.jsx`. Each page has its own file in `src/pages/`.
- Changed or rejected: The guide moves all the state into the list page, but my globe and Get inspired pages need the same list. So the state went into a custom hook, `useDestinations`, that `Layout` calls once and passes to the pages with `<Outlet context>`. This way the number of visited places in the navigation stays correct on every page.

### 2. The detail page
- Asked: A detail page for each destination that does not just repeat the row from the list, and that looks like the rest of the passport.
- Got: `DestinationDetailPage` at `/destinations/:id`, which reads the id with `useParams()` and asks the server for that destination only, with `fetchDestination(id)`. It looks like a passport data page: a photo, the name, the description, all the fields, the "Visited" stamp in the ink of the kind of place and two code lines at the bottom. An id that does not exist shows an error message and a button back to the list.
- Changed or rejected: The name in My Travel List became a `Link`. A click on the row still ticks it, so the link stops the click from reaching the row (`stopPropagation`). I also made the names on the visited stamps open the detail page.

### 3. CSS Modules
- Asked: How to split my `App.css` of almost 3800 lines into one file per component, without changing how the site looks.
- Got: `index.css` with the colour variables for both themes and the classes every page uses (the sheet, titles, buttons, badges, messages), and a `.module.css` next to every component and page. The class names became camelCase, so in JSX they are written `styles.cardRow`. Rules that were overwritten later by the passport theme were removed. Screenshots of every page, before and after, were compared to check that nothing moved.
- Changed or rejected: Some rules used classes from two components at once, for example the delete button that appears when the mouse is over a card. Each of them was rewritten so that it belongs to one component only.

## What I learned / what did not work
I understood that with React Router the browser loads one HTML page, and a `Link` only changes the address, so the state is not lost. A normal `<a href>` would load everything again. `useParams()` always gives text, and the effect of the detail page needs `[id]` in its list, otherwise going from one destination to another with the Back button would keep the old one on screen. With CSS Modules every class gets a unique name at build time, so `.card` in one file cannot break `.card` in another. The global classes stay simple text, like `className="btn btn-primary"`. What did not work at first: my CSS had a lot of old rules from the first "sky" theme that were hidden under the passport theme, and it took a while to see which ones were really used. I also learned why leaving the globe page was sometimes slow: the spinning globe changed its state on every frame, and React Router changes pages in a transition, which those updates kept interrupting. Putting the spin in `startTransition` too fixed it.
