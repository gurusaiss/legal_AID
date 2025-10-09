import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import type { UserConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }): UserConfig => {
  const isProduction = mode === 'production';
  
  const config: UserConfig = {
    // Base URL configuration
    base: isProduction ? '/legal_AID/' : '/',
    
    // Plugins
    plugins: [react()],
    
    // Resolve configuration
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './client'),
        '@shared': path.resolve(__dirname, './shared')
      }
    },
    
    // Build configuration
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: !isProduction,
      minify: isProduction ? 'esbuild' : false
    },
    
    // Server configuration (only for development)
    server: !isProduction ? {
      host: '0.0.0.0',
      port: 3000,
      strictPort: true,
      open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
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
