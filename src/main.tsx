import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Importe o componente BrowserRouter
import { App } from "./App.tsx";
import "./global.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      {" "}
      {/* Encapsule o App com BrowserRouter */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
