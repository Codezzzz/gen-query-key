import { z } from 'zod';

export const configSchema = z.object({
    output: z.string().optional().catch('src/query-key-used-info.ts'),
    path: z.string().optional().catch('./src/**/*.{jsx,tsx,ts}'),
    globalQueryKeyName: z.string().optional().catch('globalQueryKeys'),
    ignoreFiles: z.array(z.string()).optional().catch([])
});

export type ConfigOptions = z.infer<typeof configSchema>;

export const defaultConfig: Required<ConfigOptions> = {
    output: './src/query-key-used-info.ts',
    path: './src/**/*.{jsx,tsx,ts}',
    ignoreFiles: ['.d.ts', 'queryKeys.ts'],
    globalQueryKeyName: 'globalQueryKeys'
};
