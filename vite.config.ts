import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: [
        'src/store/**',
        'src/components/ui/**',
        'src/features/errors/**',
        'src/features/clients/hooks/**',
      ],
      thresholds: {
        lines: 88,
        functions: 88,
        branches: 80,
        statements: 88,
      },
    },
  },
})
