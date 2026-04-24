import eslint from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import pluginUnicorn from 'eslint-plugin-unicorn';
import tseslint from 'typescript-eslint';

export default defineConfig([
    globalIgnores(['dist', 'dist-ssr', 'coverage', 'docs', 'api', 'node_modules']),
    {
        files: ['**/*.{ts,tsx}'],
        plugins: {
            unicorn: pluginUnicorn
        },
        extends: [
            eslint.configs.recommended,
            ...tseslint.configs.recommended,
            reactHooks.configs.flat.recommended,
            reactRefresh.configs.vite
        ],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node
            }
        },
        rules: {
            'no-console': 'warn',
            'no-debugger': 'warn',
            'react-refresh/only-export-components': 'off'
        }
    },
    {
        files: ['tests/**/*.{ts,tsx}'],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node
            }
        }
    },
    {
        files: ['cypress/**/*.{ts,tsx}'],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node
            }
        }
    }
]);
