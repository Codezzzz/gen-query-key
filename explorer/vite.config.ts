import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// import QueryKeyGeneratorPlugin from '@query-key-generator/core';
import QueryKeyPlugin from '../packages/query-key-generator/lib/index';

// https://vite.dev/config/

export default defineConfig({
    plugins: [react(), QueryKeyPlugin()],
    resolve: { alias: { '@': '/src' } }
});
