import { defineConfig } from 'vite'

export default defineConfig({  
  test: {  
    environment: 'node',
    include: ['**/*.test.{jsx,cjs}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: './backend/coverage',
    },
  },
})
