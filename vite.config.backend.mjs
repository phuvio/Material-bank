import { defineConfig } from 'vite'

export default defineConfig({  
  test: {  
    environment: 'node',
    include: ['backend/**/*.test.{jsx,cjs}'],
    exclude: ['frontend/**', 'vite.*', 'eslint.*', 'testSetup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: './backend/coverage',
      exclude: ['frontend/**', 'vite.*', 'eslint.*', 'testSetup.js']
    },
  },
})
