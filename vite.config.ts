import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  
  // For GitHub Pages, use the repository name as base
  // For local development, use root
  base: process.env.NODE_ENV === 'production' ? '/legal_AID/' : '/',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
    host: "::",
    port: 3000, // Changed to 3000 to match Netlify dev port
    strictPort: true,
    open: true,
    fs: {
      // Allow serving files from the project root
      allow: [
        "./client", 
        "./shared",
        "./public",
        "." // Allow serving from project root
      ],
      deny: [
        // Default Vite restrictions
        "**/node_modules/**",
        "**/.git/**",
        // Your custom restrictions
        ".env", 
        ".env.*", 
        "*.{crt,pem}",
        "server/**"
      ],
    },
  },
  build: {
    outDir: mode === 'production' ? 'docs' : 'dist/spa',
  },
  plugins: [react(), expressPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));


function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development (serve mode)
    configureServer(server) {
      const app = createServer();

      // Add Express app as middleware to Vite dev server
      server.middlewares.use(app);
    },
  };
}
