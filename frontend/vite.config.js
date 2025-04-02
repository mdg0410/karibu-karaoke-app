import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'https://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  define: {
    'process.env': {
      REACT_APP_API_URL: JSON.stringify(process.env.REACT_APP_API_URL || 'http://localhost:5000/api')
    }
  }
});
