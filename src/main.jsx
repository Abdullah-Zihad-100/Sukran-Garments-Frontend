import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AdminProvider } from "./Context/AdminContext.jsx";
import { Toaster } from "react-hot-toast";
import { FavoritesProvider } from "./Context/FavoritesContext.jsx";

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
