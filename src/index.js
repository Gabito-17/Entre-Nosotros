import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { UserProvider } from "./hooks/UserProvider.tsx";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    
      <App />

);

// Activar Service Worker
//serviceWorkerRegistration.register();

reportWebVitals();
