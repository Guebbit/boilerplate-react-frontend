import eslint from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import pluginCypress from 'eslint-plugin-cypress';
import pluginOxlint from 'eslint-plugin-oxlint';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReactRefresh from 'eslint-plugin-react-refresh';
import pluginUnicorn from 'eslint-plugin-unicorn';
import pluginVitest from '@vitest/eslint-plugin';
import typescriptEslint from 'typescript-eslint';

export default defineConfig([
    globalIgnores(['dist', 'dist-ssr', 'coverage', 'docs', 'api', 'node_modules']),
    {
        files: ['**/*.{ts,tsx}'],
        extends: [
            eslint.configs.recommended,
            ...typescriptEslint.configs.recommended,
            pluginReactHooks.configs['recommended-latest'],
            pluginReactRefresh.configs.vite,
            ...pluginOxlint.configs['flat/recommended'],
            pluginUnicorn.configs['flat/recommended']
        ],
        languageOptions: {
            globals: {
                ...globals.browser
            },
            ecmaVersion: 'latest',
            sourceType: 'module'
        },
        rules: {
            'no-console': 'warn',
            'no-debugger': 'warn',
            '@typescript-eslint/use-unknown-in-catch-callback-variable': 'off',
            '@typescript-eslint/no-non-null-assertion': 'off',
            'unicorn/no-nested-ternary': 'off',
            'unicorn/prevent-abbreviations': 'off',
            'unicorn/filename-case': 'off'
        }
    },
    {
        ...pluginVitest.configs.recommended,
        files: ['tests/**/*', '**/*.{spec,test}.{ts,tsx}']
    },
    {
        ...pluginCypress.configs.recommended,
        files: [
            'cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}',
            'cypress/support/**/*.{js,ts,jsx,tsx}'
        ]
    }
]);
