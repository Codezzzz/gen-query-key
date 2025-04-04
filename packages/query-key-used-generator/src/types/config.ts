import { z } from 'zod';

export const configSchema = z.object({
    output: z.string().default('src/query-key-used-info.ts'),
    path: z.string().default('./src/**/*.{jsx,tsx,ts}'),
    globalQueryKeyName: z.string().default('globalQueryKeys'),
    ignoreFiles: z.array(z.string()).default([])
});

export type ConfigOptions = z.infer<typeof configSchema>;

export const defaultConfig: Required<ConfigOptions> = {
    output: './src/query-key-used-info.ts',
    path: './src/**/*.{jsx,tsx,ts}',
    ignoreFiles: ['.d.ts', 'queryKeys.ts'],
    globalQueryKeyName: 'globalQueryKeys'
};
