import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@shared": path.resolve(__dirname, "./src/shared"),
      "@modules": path.resolve(__dirname, "./src/modules"),
    },
  },
  server: {
    open: true, // Mở trình duyệt
    port: 5173, // Port cố định
    strictPort: true, // Báo lỗi nếu port bận (thay vì tự đổi)
    host: true, // Expose ra network
    cors: true, // Enable CORS
  },
});
