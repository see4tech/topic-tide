// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react-swc";
// import path from "path";
// import { componentTagger } from "lovable-tagger";

// // https://vitejs.dev/config/
// export default defineConfig(({ mode }) => ({
//   server: {
//     host: "::",
//     port: 8080,
//   },
//   plugins: [
//     react(),
//     mode === 'development' && componentTagger(),
//   ].filter(Boolean),
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
// }));
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    'process.env.VITE_HERO_BG_COLOR': JSON.stringify(process.env.VITE_HERO_BG_COLOR),
    'process.env.VITE_FOOTER_BG_COLOR': JSON.stringify(process.env.VITE_FOOTER_BG_COLOR),
    'process.env.VITE_BODY_BG_COLOR': JSON.stringify(process.env.VITE_BODY_BG_COLOR),
    'process.env.VITE_HERO_FONT_COLOR': JSON.stringify(process.env.VITE_HERO_FONT_COLOR),
    'process.env.VITE_FOOTER_FONT_COLOR': JSON.stringify(process.env.VITE_FOOTER_FONT_COLOR),
  }
});
