# Stage 2: AI log

## Tools
- Gemini

## Conversations
- https://share.gemini.google/nzBb6kOv5y9v (Generating JavaScript data logic, immutable functions, and custom CSS animations for the travel app)

## Key requests

### 1. Data logic in JavaScript
- Asked: Help with separating data logic into a JS file using immutable functions as required for Stage 2.
- Got: The `destinations.js` file with implementations using `map`, `filter`, and `reduce` for listing, searching, adding, and deleting destinations, plus console tests.
- Changed or rejected: Kept the structure exactly as provided since it successfully followed the immutability rules and correctly calculated the next ID.

### 2. Custom Aesthetic Animations & Gradient
- Asked: Add creative animations, a pink/purple gradient background, and a flying airplane to make the UI look extremely good without altering functionality.
- Got: Advanced CSS keyframes (`slideDown`, `floatText`, `popIn`), hover effects, and a pure CSS flying airplane using a `::before` pseudo-element.
- Changed or rejected: I kept all the visual enhancements as they perfectly matched the travel theme and the aesthetic vision of the project without breaking the layout.

## What I learned / what did not work
I learned how to manipulate arrays immutably in JavaScript (using the spread operator instead of `.push()`), which is essential for preparing the app for React. I also learned how to use CSS pseudo-elements (`::before`) and `@keyframes` to create complex, non-intrusive background animations (like the flying airplane) that do not block user interactions.
