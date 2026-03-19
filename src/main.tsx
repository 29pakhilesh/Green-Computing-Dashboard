import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import TopicsPage from "./TopicsPage";
import "./index.css";

const rootElement = document.getElementById("root") as HTMLElement;
const hash = typeof window !== "undefined" ? window.location.hash : "";
const isTopicsView = hash === "#topic";

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>{isTopicsView ? <TopicsPage /> : <App />}</React.StrictMode>
);
