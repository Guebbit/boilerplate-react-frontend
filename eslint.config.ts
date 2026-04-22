import eslint from '@eslint/js';
import globals from 'globals';
import pluginUnicorn from 'eslint-plugin-unicorn';
import pluginVitest from '@vitest/eslint-plugin';
import pluginCypress from 'eslint-plugin-cypress';
import pluginOxlint from 'eslint-plugin-oxlint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
    globalIgnores([
        'dist',
        'dist-ssr',
        'coverage',
        'docs',
        'api',
        'node_modules',
        'eslint.config.js'
    ]),

    {
        files: ['**/*.{ts,mts,tsx}'],
        extends: [
            eslint.configs.recommended,
            ...tseslint.configs.recommended,
            reactHooks.configs.flat.recommended,
            reactRefresh.configs.vite,
            ...pluginOxlint.configs['flat/recommended'],
            pluginUnicorn.configs['flat/recommended']
        ],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node
            },
            ecmaVersion: 'latest',
            sourceType: 'module'
        },
        rules: {
            'no-console': 'warn',
            'no-debugger': 'warn',
            '@typescript-eslint/no-non-null-assertion': 'off',
            '@typescript-eslint/use-unknown-in-catch-callback-variable': 'off',
            'no-nested-ternary': 'off',
            'unicorn/no-nested-ternary': 'off',
            'unicorn/prefer-top-level-await': 'off',
            'unicorn/better-regex': 'warn',
            'unicorn/consistent-destructuring': 'warn',
            'unicorn/filename-case': [
                'error',
                {
                    case: 'camelCase'
                }
            ],
            'unicorn/catch-error-name': [
                'error',
                {
                    name: 'error'
                }
            ],
            'unicorn/prevent-abbreviations': [
                'error',
                {
                    replacements: {
                        i: false,
                        e: false,
                        len: false,
                        prop: false,
                        props: false,
                        prev: false,
                        opts: {
                            options: true
                        },
                        ref: {
                            reference: false
                        }
                    }
                }
            ]
        }
    },

    {
        files: ['**/*.tsx'],
        rules: {
            'unicorn/filename-case': [
                'error',
                {
                    case: 'pascalCase'
                }
            ]
        }
    },

    {
        files: ['tests/**/*', '**/*.spec.ts', '**/*.test.ts', '**/*.d.ts'],
        rules: {
            'unicorn/filename-case': 'off',
            'unicorn/prevent-abbreviations': 'off'
        }
    },

    {
        files: ['**/*.d.ts'],
        rules: {
            '@typescript-eslint/naming-convention': 'off'
        }
    },

    {
        ...pluginVitest.configs.recommended,
        files: ['src/**/__tests__/*', 'tests/**/*', '**/*.{spec,test}.{ts,tsx}']
    },

    {
        ...pluginCypress.configs.recommended,
        files: [
            'cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}',
            'cypress/support/**/*.{js,ts,jsx,tsx}'
        ]
    }
]);
