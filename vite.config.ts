import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      // Expose VITE_ prefixed vars through import.meta.env (automatic)
      // Also expose GEMINI_API_KEY without prefix for server-side geminiService compatibility
      'process.env.GEMINI_API_KEY': JSON.stringify(
        env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY || ''
      ),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      port: 5173,
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Core React
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
              return 'vendor';
            }
            // Animation
            if (id.includes('node_modules/framer-motion') || id.includes('node_modules/motion')) {
              return 'motion';
            }
            // Charts (admin only)
            if (id.includes('node_modules/recharts') || id.includes('node_modules/d3')) {
              return 'charts';
            }
            // Barcode scanner (admin only — heaviest chunk)
            if (id.includes('node_modules/html5-qrcode') || id.includes('node_modules/jsbarcode')) {
              return 'barcode';
            }
            // AI / Gemini
            if (id.includes('node_modules/@google')) {
              return 'ai';
            }
            // Remaining node_modules
            if (id.includes('node_modules')) {
              return 'libs';
            }
          },
        },
      },
    },
  };
});
