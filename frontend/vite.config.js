import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Listen on all interfaces (allows Docker access)
    port: 5173,
    strictPort: false,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'smart-quiz-major-project.ngrok.app',
      '.ngrok.dev',
      '.ngrok.io',
      '.ngrok.app',
      '192.168.1.27'
    ],
    hmr: {
      clientPort: 5173
    },
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:4000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        // Force new hash by including timestamp in build
        entryFileNames: `assets/[name]-[hash]-${Date.now()}.js`,
        chunkFileNames: `assets/[name]-[hash]-${Date.now()}.js`,
        assetFileNames: `assets/[name]-[hash]-${Date.now()}.[ext]`,
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return undefined;
          }

          const modulePath = id
            .split('node_modules/')[1]
            ?.split('/');

          if (!modulePath || modulePath.length === 0) {
            return 'vendor';
          }

          const first = modulePath[0];
          const packageName = first.startsWith('@')
            ? `${first}/${modulePath[1]}`
            : first;

          return packageName
            .replace('@', '')
            .replace(/\//g, '-');
        }
      }
    }
  }
});
