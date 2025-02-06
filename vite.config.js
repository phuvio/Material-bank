import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: './frontend',
  server: {
    proxy: {
      // eslint-disable-next-line no-undef
      '/api': process.env.NODE_ENV === 'production'
        ? 'https://material-bank-backend-449a0f56d7d0.herokuapp.com'
        : 'http://localhost:3001',
    },
  },
  build: {
    outDir: './frontend/dist',
  },
  plugins: [react()],
  define: {
    // eslint-disable-next-line no-undef
    'process.env': process.env,
  },
  include: [
    'frontend/**/*.test.{js,jsx,ts,tsx}',
    'frontend/**/__tests__/*.{js,jsx,ts,tsx}',
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './testSetup.js',
    coverage: {
      provider: 'v8', // or 'istanbul' for detailed reports
      reporter: ['text', 'lcov'],
    },
  },
})
