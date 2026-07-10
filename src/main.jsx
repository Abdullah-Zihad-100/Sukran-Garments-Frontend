import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AdminProvider } from "./context/AdminContext.js";
import { Toaster } from "react-hot-toast";
import { FavoritesProvider } from "./context/FavoritesContext.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AdminProvider>
      <FavoritesProvider>
        <App />
        <Toaster position="top-right" />
      </FavoritesProvider>
    </AdminProvider>
  </StrictMode>,
);
