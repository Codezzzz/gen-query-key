import { Programmer } from '@query-key-gen/generator-common';
import { QueryKeyGenerator } from '../core';
import { defaultConfig } from '../types/config';
import fs from 'fs';

const config = {
    ...defaultConfig,
    path: './src/__test__/input.ts',
    output: './src/__test__/output.ts',
    ignoreFiles: ['./src/__test__/output.ts']
};

describe('test', () => {
    let program: Programmer;
    let queryKeyGenerator: QueryKeyGenerator;

    beforeEach(() => {
        program = new Programmer(config);
        queryKeyGenerator = new QueryKeyGenerator(program, config);
    });

    it('should be true', async () => {
        await queryKeyGenerator.execute();

        await new Promise(resolve => setTimeout(resolve, 10));

        //
        const output = fs.readFileSync('./src/__test__/output.ts', 'utf8');
        const result = fs.readFileSync('./src/__test__/result.ts', 'utf8');

        // 공백, 줄바꿈, 따음표 제거
        const trimOutput = replacer(output);
        const trimResult = replacer(result);

        console.log('trimOutput', trimOutput);
        console.log('trimResult', trimResult);

        expect(trimOutput).toBe(trimResult);
    });
});

const replacer = (str: string) => {
    // 공백, 줄바꿈, 따음표 제거
    return str.replace(/[\s'"]/g, '');
};
