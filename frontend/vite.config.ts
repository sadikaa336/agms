import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

export default defineConfig({
  plugins: [
    tanstackStart({
      importProtection: {
        behavior: "error",
        client: {
          files: ["**/server/**"],
          specifiers: ["server-only"],
        },
      },
      server: { entry: "server" },
    }),
    tailwindcss(),
    react(),
    nitro({
      prerender: {
        routes: [
          "/",
          "/login",
          "/meters",
          "/customers",
          "/simulator",
          "/monitoring",
          "/recharges",
          "/tariffs",
          "/users",
          "/logs",
          "/reports",
          "/consumer",
        ],
        crawlLinks: true,
      },
    }),
  ],
  resolve: {
    tsconfigPaths: true,
    alias: {
      "@": "/src",
    },
  },
  css: {
    transformer: "lightningcss",
  },
  server: {
    host: "::",
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
