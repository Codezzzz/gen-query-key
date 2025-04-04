import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const toCamelCase = (str: string): string => {
    return str.replace(/[^a-zA-Z0-9]+(.)/g, (_, letter) => letter.toUpperCase());
};

const prettify = (output: string) => {
    const prettier = path.resolve('./node_modules/.bin/prettier');
    if (fs.existsSync(prettier)) execSync(`${prettier} --write --cache ${output}`);
};

const logger = (() => {
    const prefix = '[QUERY-KEY-USED-GENERATOR]: ';
    const log = () => {
        return {
            warn: (msg: string) => {
                console.warn(`[WARN]${prefix}${msg}`);
            },
            error: (msg: string) => {
                console.error(`[ERROR]${prefix}${msg}`);
            },
            info: (msg: string) => {
                console.log(`[INFO]${prefix}${msg}`);
            }
        };
    };

    return log();
})();

export { logger, prettify, toCamelCase };
