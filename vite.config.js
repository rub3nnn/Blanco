import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      // Estrategia de actualización
      registerType: "autoUpdate",

      // Configuración para desarrollo (opcional, útil para probar)
      devOptions: {
        enabled: true,
      },

      // Archivos a incluir en la precarga (offline)
      includeAssets: ["icon.png"],

      // El Manifiesto (La identidad de tu app)
      manifest: {
        name: "Blanco - El impostor",
        short_name: "Blanco",
        description: "Descubre al impostor entre los jugadores.",
        theme_color: "#ffffff",
        icons: [
          {
            src: "logo-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "logo-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
