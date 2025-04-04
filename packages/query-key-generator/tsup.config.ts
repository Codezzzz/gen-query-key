import { defineConfig } from 'tsup';

export default defineConfig([
    {
        entry: ['src/index.ts'],
        outDir: 'lib',
        format: ['cjs', 'esm'],
        dts: { entry: 'src/index.ts' }
    }
]);
