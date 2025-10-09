import { defineConfig, type UserConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  
  const config: UserConfig = {
    // Base URL configuration
    base: isProduction ? '/legal_AID/' : '/',
    
    // Plugins
    plugins: [react()],
    
    // Resolve configuration
    resolve: {
      alias: [
        { find: '@', replacement: path.resolve(__dirname, './client') },
        { find: '@shared', replacement: path.resolve(__dirname, './shared') }
      ]
    },
    
    // Build configuration
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: !isProduction,
      minify: isProduction ? 'esbuild' : false,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu']
          }
        }
      }
    },
    
    // Server configuration (development only)
    server: !isProduction ? {
      host: '0.0.0.0',
      port: 3000,
      strictPort: true,
      open: true,
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (p: string) => p.replace(/^\/api/, '')
        }
      },
      fs: {
        allow: [
          "./client",
          "./shared",
          "./public",
          "."
        ]
      }
    } : undefined
  };

  return config;
});
