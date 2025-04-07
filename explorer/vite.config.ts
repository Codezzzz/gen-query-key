import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// import QueryKeyGeneratorPlugin from '@query-key-generator/core';
import QueryKeyPlugin from '@query-key-gen/generator';
import QueryKeyUsedPlugin from '@query-key-gen/used-generator';
// https://vite.dev/config/

export default defineConfig({
    plugins: [react(), QueryKeyPlugin(), QueryKeyUsedPlugin()],
    resolve: { alias: { '@': '/src' } }
});
