import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./firebase/AuthContext.js";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter basename="/spil-cafeen">
        <App />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
