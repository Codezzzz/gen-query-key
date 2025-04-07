import { z } from 'zod';

export const configSchema = z.object({
    output: z.string().optional().catch('src/queryKeys.ts'),
    globalQueryKeyName: z.string().optional().catch('globalQueryKeys'),
    separator: z.string().optional().catch('-'),
    path: z.string().optional().catch('./src/**/*.{jsx,tsx,ts}'),
    ignoreFiles: z.array(z.string()).optional().catch([]),
    factoryPrefix: z.string().optional().catch('')
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
