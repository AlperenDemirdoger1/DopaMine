import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false,
    open: true,
    host: true, // Expose to all network interfaces
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
