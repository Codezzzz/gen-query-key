// eslint.config.js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
    {
        ignores: [
            'node_modules',
            'packages/**/lib/**',
            'coverage',
            'public',
            'pnpm-lock.yaml',
            'pnpm-workspace.yaml',
            '.turbo'
        ]
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,

    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module'
            }
        },
        plugins: {
            '@typescript-eslint': tseslint.plugin
        },
        rules: {
            '@typescript-eslint/no-namespace': 'off'
            // 사용자 정의 룰 추가 가능
        }
    },

    {
        files: ['.eslintrc.{js,cjs}'],
        languageOptions: {
            sourceType: 'script',
            ecmaVersion: 'latest'
        },
        env: {
            node: true
        }
    }
];
