import { fileURLToPath } from 'node:url';

import { configDefaults, defineConfig, mergeConfig } from 'vitest/config';

import viteConfig from './vite.config';

export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            environment: 'jsdom',
            include: ['tests/unit/**/*.spec.ts', 'tests/unit/**/*.spec.tsx'],
            exclude: [...configDefaults.exclude, 'e2e/**', 'src/**/__tests__/**'],
            setupFiles: ['./tests/unit/setup.ts'],
            root: fileURLToPath(new URL('./', import.meta.url))
        }
    })
);
