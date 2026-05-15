import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const basePath = process.env.VITE_APP_BASE_PATH || "/";

console.log("Vite base path:", basePath);

export default defineConfig({
  base: basePath.endsWith("/") ? basePath : `${basePath}/`,
  plugins: [react()],
  server: {
    port: 5173,
  },
});