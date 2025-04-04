import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { globbySync } from 'globby';
import dts from 'vite-plugin-dts';
import pkg from './package.json';

export default defineConfig({
    logLevel: 'warn',

    plugins: [
        dts({
            entryRoot: 'src',
            staticImport: true
        }),
        react()
    ],
    build: {
        target: 'esnext',
        minify: true,
        cssCodeSplit: false,
        lib: {
            entry: './src/index.ts',
            name: 'named',
            formats: ['es', 'umd']
        },
        outDir: 'lib',
        rollupOptions: {
            logLevel: 'silent',

            external: [...Object.keys(pkg.peerDependencies ?? {}), 'react/jsx-runtime'],
            output: {
                assetFileNames: 'style.css'
            }
        }
    }
});
