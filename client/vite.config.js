import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Proxies /api to the .NET API so the React dev server avoids CORS issues.
// Run the API first: dotnet run (https://localhost:7231)
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://localhost:7231',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
