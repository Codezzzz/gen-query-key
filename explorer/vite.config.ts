import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// import QueryKeyGeneratorPlugin from '@query-key-generator/core';
import QueryKeyPlugin from '../packages/query-key-generator/lib/index';
import QueryKeyUsedPlugin from '../packages/query-key-used-generator/lib/index';
// https://vite.dev/config/

export default defineConfig({
    plugins: [react(), QueryKeyPlugin(), QueryKeyUsedPlugin()],
    resolve: { alias: { '@': '/src' } }
});
