import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(() => {
  const base = process.env.VITE_APP_BASE_PATH || "/";

  return {
    base: base.endsWith("/") ? base : `${base}/`,
    plugins: [react()],
    server: {
      port: 5173,
    },
  };
});