# Stage 3: AI log

## Tools
- Gemini

## Conversations
- https://gemini.google.com/app/ada4978d37457783 (Initializing Vite + React project, resolving Windows environment paths and Node.js setup, moving legacy files to mockup, and adapting component logic)

## Key requests

### 1. Environment Setup & Windows Path Navigation
- Asked: Help troubleshooting terminal errors (`Move-Item` / `'npm' is not recognized` and system cannot find Desktop path).
- Got: Step-by-step guidance to navigate into the OneDrive Desktop path, clone the repository locally, download and install the official Node.js LTS `.msi` package, and verify Node/NPM availability.
- Changed or rejected: Followed the recommended manual installation to ensure long-term stability and full compatibility with the course requirements instead of unsupported package managers.

### 2. Project Scaffolding with Vite & React
- Asked: Scaffold the project structure inside `frontend/` while keeping historical code safe.
- Got: Commands to create the `mockup/` folder, move legacy assets (`index.html`, `style.css`, `destinatii.js`), and run `npm create vite@latest frontend -- --template react` using ESLint.
- Changed or rejected: Kept the exact directory layout required by the stage guide, discarding default Vite starter files (`vite.svg`, demo assets) to avoid build clutter.

### 3. Component Migration & English Localization
- Asked: Migrate the Stage 2 data array and counting logic into `frontend/src/App.jsx`, reuse previous styles in `App.css`, and localize all UI labels and titles into English.
- Got: Refactored `App.jsx` holding the `destinations` array, derived count calculation for planned destinations (`filter((d) => !d.visited).length`), raw JSON output via `<pre>`, and updated `index.html`.
- Changed or rejected: Accepted the localized structure directly as it aligned with the travel destinations theme and the naming conventions established in Stage 2.

## What I learned / what did not work
I learned how to set up and scaffold a React project using Vite alongside strict ESLint configurations. I also learned how to troubleshoot command line path issues when working within cloud-synced folders (OneDrive) and how the Node.js runtime links to system variables. On the frontend side, I understood how React components consume external-like static data arrays and dynamically compute derived states (such as active/planned counters) before rendering raw data blocks.
