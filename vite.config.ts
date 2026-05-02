import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; // تم تغييرها من swc للنسخة القياسية
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: "/",
});
