import { createRoot } from "react-dom/client";

import App from "./App";

import "./index.css";
import "./portfolio-refresh.css";
import "./portfolio-refresh-overrides.css";

// /games is a standalone static page; if the host ever falls back to the app for it, hand off to the file.
if (window.location.pathname.replace(/\/$/, "") === "/games") {
  window.location.replace("/games/index.html");
} else {
  createRoot(document.getElementById("root")!).render(<App />);
}
