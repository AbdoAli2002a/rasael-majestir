import { defineConfig } from "vite";
import react from  "@vitejs/plugin-react": "^5.0.4", // تم تغييرها من swc للنسخة القياسية
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
