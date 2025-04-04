import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import ts, { factory } from 'typescript';
import { IQueryNodeType, QueryNodeKind } from '../types/QueryNodeType';

const TypeGuard = {
    symbol: (node: IQueryNodeType['type']): node is ts.Symbol => {
        return typeof node === 'object' && 'escapedName' in node;
    },
    stringLiteral: (node: IQueryNodeType['type']): node is ts.StringLiteral => {
        return ts.isStringLiteral(node as ts.Node);
    },
    tsType: (node: IQueryNodeType['type']): node is ts.Type => {
        return typeof node === 'object' && 'symbol' in node;
    }
};

const nodeByName = {
    identifier: (name: string) => {
        return factory.createIdentifier(name);
    },
    stringLiteral: (name: string) => {
        return factory.createStringLiteral(name.replace(/'/g, ''));
    }
};

const toCamelCase = (str: string): string => {
    return str.replace(/[^a-zA-Z0-9]+(.)/g, (_, letter) => letter.toUpperCase());
};

const makeQueryKeyName = (literal: IQueryNodeType[], separator: string) => {
    return literal
        .map(node => {
            const name = node.name;
            if (node.kind !== QueryNodeKind.StringLiteral) {
                return `{${name}}`;
            }

            return name;
        })
        .join(separator);
};

const groupByFirstName = (data: IQueryNodeType[][]): Record<string, IQueryNodeType[][]> => {
    return data.reduce(
        (acc, group) => {
            if (group.length > 0) {
                const firstItem = group[0]; // 첫 번째 항목 가져오기
                const firstItemName = firstItem?.name; // 첫 번째 항목의 name 속성 접근
                if (!firstItemName) {
                    return acc;
                }

                /**
                 * query-key-name, query.key.name
                 * -> queryKeyName
                 */
                const camelCaseName = toCamelCase(firstItemName);

                if (!acc[camelCaseName]) {
                    acc[camelCaseName] = [];
                }
                acc[camelCaseName].push(group);
            }
            return acc;
        },
        {} as Record<string, IQueryNodeType[][]>
    );
};

const prettify = (output: string) => {
    const prettier = path.resolve('./node_modules/.bin/prettier');
    if (fs.existsSync(prettier)) execSync(`${prettier} --write --cache ${output}`);
};

const logger = (() => {
    const prefix = '[QUERY-KEY-GENERATOR]: ';
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

export { groupByFirstName, logger, makeQueryKeyName, nodeByName, TypeGuard, prettify, toCamelCase };
