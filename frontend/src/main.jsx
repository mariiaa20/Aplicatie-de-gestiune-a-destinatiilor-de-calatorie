import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
// The shared styles go first, so the .module.css files of the components,
// loaded after them, win when two rules are equally specific
import "./index.css";
import App from "./App.jsx";

// BrowserRouter lets the app read the address bar and show the matching page
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
