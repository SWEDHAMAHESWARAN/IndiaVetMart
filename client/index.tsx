import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Render only from here
const container = document.getElementById("root")!;
const root = ReactDOM.createRoot(container);
root.render(<App />);
