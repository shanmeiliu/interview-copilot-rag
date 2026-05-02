import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./app/auth";
import "./index.css";

const basePath = import.meta.env.VITE_APP_BASE_PATH || "/";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter basename={basePath}>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);