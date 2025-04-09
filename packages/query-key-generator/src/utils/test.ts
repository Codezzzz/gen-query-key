import { Programmer } from '@query-key-gen/generator-common';
import { readdirSync, readFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { QueryKeyGenerator } from '../core/QueryKeyGenerator.js';
import { defaultConfig } from '../types/config.js';

interface RunFixtureTestsOptions {
    fixturesDir: string;
    extension?: string;
    name?: string;
}

export function runFixtureTests({
    fixturesDir,
    extension = 'ts',
    name
}: RunFixtureTestsOptions): void {
    // transform 폴더명을 fixturesDir에서 추론
    const transformName = name || basename(dirname(fixturesDir));

    const inputFiles = readdirSync(fixturesDir)
        .filter(filename => filename.endsWith(`.input.${extension}`))
        .map(filename => basename(filename, `.input.${extension}`));

    describe(`${transformName} generate queryKey tests`, () => {
        inputFiles.forEach(testCase => {
            test(`${testCase} correctly`, async () => {
                const inputPath = join(fixturesDir, `${testCase}.input.${extension}`);
                const resultPath = join(fixturesDir, `${testCase}.result.${extension}`);
                const outputPath = join(fixturesDir, `${testCase}.output.${extension}`);

                const config = {
                    ...defaultConfig,
                    path: inputPath,
                    output: outputPath,
                    ignoreFiles: [outputPath]
                };

                const program = new Programmer(config);
                const queryKeyGenerator = new QueryKeyGenerator(program, config);

                await queryKeyGenerator.execute();

                const output = readFileSync(outputPath, 'utf8');
                const result = readFileSync(resultPath, 'utf8');

                const trimOutput = replacer(output);
                const trimResult = replacer(result);

                expect(trimOutput).toBe(trimResult);
            });
        });
    });
}

const replacer = (str: string) => {
    // 공백, 따옴표, 쉼표 제거, ; 제거
    return str.replace(/[\s'"]/g, '').replace(/;/g, '');
};
