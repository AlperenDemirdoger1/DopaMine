import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false,
    open: true,
    host: true, // Expose to all network interfaces
    allowedHosts: ['react-vite-app-tunnel-uecgywsd.devinapps.com', 'devinapps.com'],
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
