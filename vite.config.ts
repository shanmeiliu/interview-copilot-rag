import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const basePath = process.env.VITE_APP_BASE_PATH || "/";
const apiBasePath = process.env.VITE_API_BASE_PATH || "";

console.log("Vite base path:", basePath);
console.log("Vite API base path:", apiBasePath);

const proxyTarget = process.env.VITE_DEV_API_PROXY_TARGET || "http://localhost:8080";

export default defineConfig({
  base: basePath.endsWith("/") ? basePath : `${basePath}/`,
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: proxyTarget,
        changeOrigin: true,
      },
      "/healthz": {
        target: proxyTarget,
        changeOrigin: true,
      },
      "/version": {
        target: proxyTarget,
        changeOrigin: true,
      },
    },
  },
});