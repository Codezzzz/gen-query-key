import { Plugin } from 'vite';

import path from 'path';

import { Programmer } from '@query-key-gen/generator-common';
import { QueryKeyGenerator } from './core';
import { ConfigOptions, configSchema, defaultConfig } from './types/config';

export default function QueryKeyPlugin(_config?: Omit<ConfigOptions, 'path'>): Plugin {
    const config = configSchema.parse({
        ...defaultConfig,
        ..._config,
        ignoreFiles: [...defaultConfig.ignoreFiles, ...(_config?.ignoreFiles ?? [])]
    }) as Required<ConfigOptions>;

    const rootDir = process.cwd(); // 프로젝트 루트 경로
    const ignoreFiles = config.ignoreFiles;
    const program = new Programmer(config);
    const generator = new QueryKeyGenerator(program, config);

    return {
        name: '@query-key-gen/generator',
        enforce: 'pre',
        configureServer(server) {
            const listener = (absolutePath = '') => {
                const filePath = path.relative(rootDir, absolutePath);
                const outputPath = path.relative(rootDir, config.output);

                if (!filePath.startsWith('src') || filePath.startsWith(outputPath)) return;
                if (
                    ignoreFiles.some(item => {
                        const ignorePath = path.relative(process.cwd(), item);
                        return filePath.includes(ignorePath);
                    })
                ) {
                    return;
                }

                generator.execute();
            };
            server.watcher.on('add', listener);
            server.watcher.on('change', listener);
            server.watcher.on('unlink', listener);
        },
        buildStart() {
            generator.execute();
        }
    };
}
