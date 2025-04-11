import { Programmer } from '@query-key-gen/generator-common';
import { readdirSync, readFileSync } from 'node:fs';
import path, { basename, dirname, join } from 'node:path';
import prettier from 'prettier';
import { describe, expect, test } from 'vitest';
import { QueryKeyGenerator } from '../core/QueryKeyGenerator.js';
import { defaultConfig } from '../types/config.js';
interface RunFixtureTestsOptions {
    fixturesDir: string;
    extension?: string;
    name?: string;
}

const prettierConfig: prettier.Options = {
    parser: 'typescript',
    arrowParens: 'avoid',
    printWidth: 1000000000,
    singleQuote: true,
    trailingComma: 'none',
    bracketSpacing: true,
    tabWidth: 4,
    semi: false
};

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

    // transformName 상대 경로로 변환
    const transformNamePath = path
        .relative(process.cwd(), transformName)
        .replace('src/__test__/', '')
        .replace('/generator.test.ts', '');

    describe(`${transformNamePath} generate queryKey tests`, () => {
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

                // run prettier
                const prettierOutput = await prettier.format(output, prettierConfig);
                const prettierResult = await prettier.format(result, prettierConfig);

                expect(prettierOutput).toBe(prettierResult);
            });
        });
    });
}
