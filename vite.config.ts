import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  base: "/new-speed-typing-test/",
  plugins: [react(), tailwindcss(), svgr()],
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // Allow accessing the dev server via the ngrok host
    allowedHosts: ["partly-popular-airedale.ngrok-free.app"],
    // Listen on all interfaces so tunnels/proxies can reach it
    host: true,
  },
});
