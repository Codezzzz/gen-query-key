import ts from 'typescript';

import { GenericRunner } from '../../../common/src';
import {
    GlobalQueryKeyStatement,
    QueryKeyStatementFactory,
    QueryKeyStructureFactory
} from '../factories';
import { QueryKeyFinder, UseQueryFinder } from '../queryFinder';
import { ArrayLiteralExpressionTransformer, FileTransformer } from '../transformers';
import { IQueryNodeType } from '../types';
import { groupByFirstName, logger, makeQueryKeyName, prettify } from '../utils';
import { ConfigOptions } from '../types/config';

class QueryKeyGenerator extends GenericRunner<ConfigOptions> {
    /**
     * - get useQuery, useSuspenseQuery ... callExpression
     * - callExpression arrayLiteralExpression
     * - query info inject to arrayLiteralExpression
     */
    private getQueryKeysFormat = (sourceFiles: ts.SourceFile[], checker: ts.TypeChecker) => {
        const useQueries = UseQueryFinder.findUseQuery({
            sourceFiles: sourceFiles
        });

        const queryKeys = QueryKeyFinder.findQueryKey({
            useQueries: useQueries,
            checker
        });

        return queryKeys;
    };

    private transformer = (
        queryKeys: QueryKeyFinder.IFindQueryKeyReturn,
        checker: ts.TypeChecker
    ) => {
        const config = this.config;
        const set = new Set<string>();

        const queryKeysLength = queryKeys.length > 0;
        const isExistDef = queryKeys.some(item => item.length === 1);
        const anotherNode = queryKeys.filter(item => item.length !== 1).flatMap(item => item)[0];
        /**
         * queryKey가 하나 이상이고, 기본 키가 없고, 다른 키가 있을 때
         * 다른 키의 첫번째 요소를 가져온다
         */
        const isDefault = queryKeysLength && !isExistDef && !!anotherNode;

        /**
         * queryKey이름이 중복되지 않게 한다.
         */
        const uniqueQueryKeys = queryKeys.filter(item => {
            const name = makeQueryKeyName(item, config.separator);

            if (set.has(name)) {
                return false;
            }
            set.add(name);
            return true;
        });

        const create = (item: IQueryNodeType[]) => {
            const result = ArrayLiteralExpressionTransformer.transformer({
                arrayLiteral: item,
                write: QueryKeyStructureFactory.write,
                checker,
                separator: config.separator
            });

            return result ? [result] : [];
        };

        const first = (isDefault ? create([anotherNode]) : []) as ts.PropertyAssignment[];

        return first.concat(uniqueQueryKeys.flatMap(create));
    };
    private generateQueryKeyStatement = (
        keys: Record<string, IQueryNodeType[][]>,
        checker: ts.TypeChecker
    ) => {
        const config = this.config;
        return Object.keys(keys)
            .map(key => {
                if (!keys[key]) return null;
                const transformed = this.transformer(keys[key], checker);

                return {
                    key,
                    statement: QueryKeyStatementFactory.write(
                        transformed,
                        key,
                        config.factoryPrefix
                    )
                };
            })
            .filter(Boolean) as { key: string; statement: ts.VariableStatement }[];
    };

    private printer = async (
        sourceFile: ts.SourceFile,
        keyStatement: { key: string; statement: ts.VariableStatement }[],
        mergeKeyStatement: ts.VariableStatement
    ) => {
        const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

        FileTransformer.transform({
            sourceFile,
            printer,
            statements: [...keyStatement.map(item => item.statement), mergeKeyStatement]
        });
    };

    protected override process = async () => {
        const config = this.config;
        const start = Date.now();
        logger.info('start query key generator');
        try {
            const { program, checker } = await this.programmer.create();
            const { outputFile, projectFiles } = await this.programmer.findFiles(program);
            const queryKeys = this.getQueryKeysFormat(projectFiles, checker);
            const groupQueryKeys = groupByFirstName(queryKeys);
            const keyStatements = this.generateQueryKeyStatement(groupQueryKeys, checker);
            const mergeKeyStatement = GlobalQueryKeyStatement.write(
                keyStatements,
                config.globalQueryKeyName,
                config.factoryPrefix
            );
            this.printer(outputFile, keyStatements, mergeKeyStatement);
            prettify(outputFile.fileName);
        } catch (error) {
            if (error instanceof Error) {
                logger.error(`ERROR: ${error.message}\n${error.stack}`);
            }
        } finally {
            logger.info(`query key generator completed in ${Date.now() - start} ms`);
        }
    };
}

export { QueryKeyGenerator };
