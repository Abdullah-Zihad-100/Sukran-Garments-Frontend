import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path"; // 1. Eiti oboshoy import korte hobe

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // 2. alias ke resolve er bhetor rakhte hobe
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
