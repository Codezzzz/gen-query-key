import { z } from 'zod';

export const configSchema = z.object({
    output: z.string().default('src/queryKeys.ts'),
    globalQueryKeyName: z.string().default('globalQueryKeys'),
    separator: z.string().default('-'),
    path: z.string().default('./src/**/*.{jsx,tsx,ts}'),
    ignoreFiles: z.array(z.string()).default([]),
    factoryPrefix: z.string().default('')
});

export type ConfigOptions = z.infer<typeof configSchema>;

export const defaultConfig: Required<ConfigOptions> = {
    output: './src/queryKeys.ts',
    globalQueryKeyName: 'globalQueryKeys',
    separator: '-',
    path: './src/**/*.{jsx,tsx,ts}',
    ignoreFiles: ['.d.ts', 'query-key-used-info.ts'],
    factoryPrefix: ''
};
