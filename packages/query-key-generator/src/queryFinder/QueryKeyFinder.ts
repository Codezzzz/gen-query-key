import ts from 'typescript';
import { IQueryNodeType, QueryNodeKind } from '../types';
import { UseQueryFinder } from './UseQueryFinder';
import { logger } from '../utils';

namespace QueryKeyFinder {
    export type IFindQueryKeyReturn = ReturnType<typeof findQueryKey>;

    const PROPERTY_NAME = 'queryKey';

    export const findQueryKey = ({
        useQueries,
        checker
    }: {
        useQueries: UseQueryFinder.IFindUserQueryReturn;
        checker: ts.TypeChecker;
    }) => {
        const result = useQueries
            .map(value => {
                const arrayLiteral = visitor(value, checker);

                return arrayLiteral;
            })
            .flat();

        return result;
    };

    const visitor = (value: ts.CallExpression, checker: ts.TypeChecker) => {
        const arrayLiteral: IQueryNodeType[][] = [];

        const visit = (node: ts.Node) => {
            if (ts.isCallExpression(node)) {
                const expression = node.expression;
                const args = node.arguments;

                args.forEach(arg => {
                    //   useQuery(exampleQueryService.queryOptions);
                    //   useQuery(exampleQueryService.queryOptions());
                    if (ts.isPropertyAccessExpression(arg)) {
                        const symbol = checker.getSymbolAtLocation(arg);

                        if (symbol && symbol.valueDeclaration) {
                            const valueDeclaration = symbol.valueDeclaration;

                            if (ts.isPropertyAssignment(valueDeclaration)) {
                                const initializer = valueDeclaration.initializer;

                                if (initializer && ts.isCallExpression(initializer)) {
                                    console.log(initializer);
                                    visit(initializer);
                                }
                            }
                        }
                    }

                    //  useQuery(exampleQueryService.queryOptions());
                    if (ts.isCallExpression(arg)) {
                        const expression = arg.expression;
                        visit(expression);
                    }

                    // useQuery(exampleQueryService);
                    if (ts.isIdentifier(arg)) {
                        const symbol = checker.getSymbolAtLocation(arg);

                        if (symbol && symbol.valueDeclaration) {
                            const valueDeclaration = symbol.valueDeclaration;

                            if (ts.isVariableDeclaration(valueDeclaration)) {
                                const initializer = valueDeclaration.initializer;

                                if (initializer) {
                                    visit(initializer);
                                }
                            }
                        }
                    }

                    if (ts.isObjectLiteralExpression(arg)) {
                        visit(arg);
                        // const properties = arg.properties;

                        // properties.forEach(property => {
                        //     if (ts.isPropertyAssignment(property)) {
                        //         const initializer = property.initializer;

                        //         if (ts.isArrayLiteralExpression(initializer)) {
                        //             arrayLiteral.push(
                        //                 makeArrayLiteral(initializer.elements, checker)
                        //             );
                        //         }
                        //     }
                        // });
                    }
                });

                if (ts.isIdentifier(expression)) {
                    const symbol = checker.getSymbolAtLocation(expression);

                    if (symbol && symbol.valueDeclaration) {
                        const valueDeclaration = symbol.valueDeclaration;

                        if (ts.isVariableDeclaration(valueDeclaration)) {
                            const initializer = valueDeclaration.initializer;

                            if (initializer && ts.isCallExpression(initializer)) {
                                visit(initializer);
                            }
                        }
                    }
                }

                if (ts.isPropertyAccessExpression(expression)) {
                    const symbol = checker.getSymbolAtLocation(expression);

                    if (symbol && symbol.valueDeclaration) {
                        const valueDeclaration = symbol.valueDeclaration;

                        if (ts.isPropertyAssignment(valueDeclaration)) {
                            const initializer = valueDeclaration.initializer;

                            if (initializer && ts.isArrowFunction(initializer)) {
                                const body = initializer.body;

                                if (ts.isArrayLiteralExpression(body)) {
                                    arrayLiteral.push(makeArrayLiteral(body.elements, checker));
                                }

                                if (ts.isBlock(body)) {
                                    const statements = body.statements;

                                    statements.forEach(statement => {
                                        if (ts.isReturnStatement(statement)) {
                                            const expression = statement.expression;

                                            if (expression && ts.isCallExpression(expression)) {
                                                const argument = expression.arguments;

                                                argument.forEach(arg => {
                                                    if (ts.isObjectLiteralExpression(arg)) {
                                                        arrayLiteral.push(
                                                            objectExpression(arg, checker)
                                                        );
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }

                                if (ts.isCallExpression(body)) {
                                    visit(body);

                                    // const argument = body.arguments;

                                    // argument.forEach(arg => {
                                    //     if (ts.isObjectLiteralExpression(arg)) {
                                    //         const properties = arg.properties;

                                    //         properties.forEach(property => {
                                    //             if (ts.isPropertyAssignment(property)) {
                                    //                 const initializer = property.initializer;

                                    //                 if (ts.isArrayLiteralExpression(initializer)) {
                                    //                     arrayLiteral.push(
                                    //                         makeArrayLiteral(
                                    //                             initializer.elements,
                                    //                             checker
                                    //                         )
                                    //                     );
                                    //                 }
                                    //             }
                                    //         });
                                    //     }
                                    // });
                                }
                            }
                        }
                    }
                }
            }

            if (ts.isIdentifier(node)) {
                const identifierSymbol = checker.getSymbolAtLocation(node);

                if (identifierSymbol) {
                    const valueDeclaration = identifierSymbol.valueDeclaration;

                    if (valueDeclaration && ts.isVariableDeclaration(valueDeclaration)) {
                        const objectInitializer = valueDeclaration.initializer;

                        if (objectInitializer && ts.isObjectLiteralExpression(objectInitializer)) {
                            const targetProperty = findPropertyByQueryKey(
                                objectInitializer.properties
                            );

                            if (targetProperty && ts.isPropertyAssignment(targetProperty)) {
                                const targetInitializer = targetProperty.initializer;

                                if (ts.isArrayLiteralExpression(targetInitializer)) {
                                    arrayLiteral.push(
                                        makeArrayLiteral(targetInitializer.elements, checker)
                                    );
                                }

                                if (ts.isArrowFunction(targetInitializer)) {
                                    const body = targetInitializer.body;

                                    if (ts.isArrayLiteralExpression(body)) {
                                        arrayLiteral.push(makeArrayLiteral(body.elements, checker));
                                    }
                                }
                            }
                        }

                        if (objectInitializer && ts.isArrowFunction(objectInitializer)) {
                            const body = objectInitializer.body;

                            if (ts.isCallExpression(body)) {
                                visit(body);
                            }
                        }
                    }
                }
            }

            /**
             * useQuery({
             *  queryKey: ~
             * })
             */
            if (ts.isObjectLiteralExpression(node)) {
                arrayLiteral.push(objectExpression(node, checker));
            }

            ts.forEachChild(node, visit);
        };

        visit(value);

        if (arrayLiteral.flat().length === 0) {
            logger.warn('This function is not provided. : \n' + value.getText());
        }

        return arrayLiteral;
    };

    const objectExpression = (node: ts.ObjectLiteralExpression, checker: ts.TypeChecker) => {
        let arrayLiteral: IQueryNodeType[] = [];

        const properties = node.properties;

        properties.forEach(property => {
            if (ts.isPropertyAssignment(property) && property.name.getText() === 'queryKey') {
                const initializer = property.initializer;
                /**
                 * useQuery({
                 *  queryKey: ['keys']
                 * })
                 */
                if (ts.isArrayLiteralExpression(initializer)) {
                    arrayLiteral = makeArrayLiteral(initializer.elements, checker);
                }

                /**
                 * useQuery({
                 *  queryKey: keys()
                 * })
                 */
                if (ts.isCallExpression(initializer)) {
                    const expression = initializer.expression;

                    if (ts.isIdentifier(expression)) {
                        const valueDeclaration =
                            checker.getSymbolAtLocation(expression)?.valueDeclaration;

                        if (valueDeclaration && ts.isVariableDeclaration(valueDeclaration)) {
                            const initializer = valueDeclaration.initializer;

                            if (initializer && ts.isArrowFunction(initializer)) {
                                const body = initializer.body;

                                if (ts.isArrayLiteralExpression(body)) {
                                    const elements = body.elements;

                                    arrayLiteral = makeArrayLiteral(elements, checker);
                                }
                            }
                        }

                        if (valueDeclaration && ts.isFunctionDeclaration(valueDeclaration)) {
                            const body = valueDeclaration.body;

                            if (body && ts.isBlock(body)) {
                                const statements = body.statements;

                                statements.forEach(statement => {
                                    if (ts.isReturnStatement(statement)) {
                                        const expression = statement.expression;

                                        if (expression && ts.isArrayLiteralExpression(expression)) {
                                            arrayLiteral = makeArrayLiteral(
                                                expression.elements,
                                                checker
                                            );
                                        }
                                    }
                                });
                            }
                        }
                    }
                }

                /**
                 * const test = {
                 *  queryKey: ['1111']
                 * }
                 *
                 * useQuery({
                 *  queryKey: test.queryKey
                 * })
                 */
                if (ts.isPropertyAccessExpression(initializer)) {
                    arrayLiteral = propertyAccessExpression(initializer, checker);
                }

                /**
                 * 
                 * const test = {
                        queryKeys: () => ['1111']
                    }

                 * useQuery({
                 *  queryKey: test.queryKeys()
                 * })
                 */
                if (ts.isCallExpression(initializer)) {
                    const expression = initializer.expression;

                    if (ts.isPropertyAccessExpression(expression)) {
                        arrayLiteral = propertyAccessExpression(expression, checker);
                    }
                }
            }
        });

        return arrayLiteral;
    };

    const makeArrayLiteral = (elements: ts.NodeArray<ts.Expression>, checker: ts.TypeChecker) => {
        return elements
            .map(el => {
                if (ts.isStringLiteral(el)) {
                    return {
                        name: el.text,
                        type: el,
                        kind: QueryNodeKind.StringLiteral
                    };
                }

                if (ts.isIdentifier(el)) {
                    const symbol = checker.getSymbolAtLocation(el);
                    const type = checker.getTypeAtLocation(el);

                    const valueDeclaration = symbol?.valueDeclaration;

                    const typeKind = type.symbol?.valueDeclaration?.kind;

                    /**
                     * @description typeof keyword
                     */
                    if (valueDeclaration && ts.isParameter(valueDeclaration)) {
                        if (valueDeclaration.type?.kind === ts.SyntaxKind.TypeQuery) {
                            return {
                                name: el.text,
                                type: type,
                                symbol: symbol,
                                kind: QueryNodeKind.TypeOfKeyword
                            };
                        }
                    }

                    /**
                     * @description enum keyword
                     */
                    if (
                        typeKind === ts.SyntaxKind.EnumMember ||
                        typeKind === ts.SyntaxKind.EnumDeclaration
                    ) {
                        return {
                            name: el.text,
                            type: type,
                            symbol: symbol,
                            kind: QueryNodeKind.EnumMember
                        };
                    }

                    /**
                     * @description symbol keyword
                     */
                    if (symbol && symbol.getDeclarations()) {
                        return {
                            name: symbol.getName(),
                            type: symbol,
                            kind: QueryNodeKind.Symbol
                        };
                    }
                }

                return undefined;
            })
            .filter(Boolean) as IQueryNodeType[];
    };

    const propertyAccessExpression = (
        node: ts.PropertyAccessExpression,
        checker: ts.TypeChecker
    ) => {
        const expression = node.expression;
        const propertyName = node.name.getText();
        let arrayLiteral: IQueryNodeType[] = [];

        if (expression && ts.isIdentifier(expression)) {
            const valueDeclaration = checker.getSymbolAtLocation(expression)?.valueDeclaration;

            if (valueDeclaration && ts.isVariableDeclaration(valueDeclaration)) {
                const objectInitializer = valueDeclaration.initializer;

                if (objectInitializer && ts.isObjectLiteralExpression(objectInitializer)) {
                    const targetProperty = objectInitializer.properties.find(
                        prop =>
                            ts.isPropertyAssignment(prop) && prop.name.getText() === propertyName
                    );

                    if (targetProperty && ts.isPropertyAssignment(targetProperty)) {
                        const targetInitializer = targetProperty.initializer;

                        if (ts.isArrayLiteralExpression(targetInitializer)) {
                            arrayLiteral = makeArrayLiteral(targetInitializer.elements, checker);
                        }

                        if (ts.isArrowFunction(targetInitializer)) {
                            const body = targetInitializer.body;

                            if (ts.isArrayLiteralExpression(body)) {
                                arrayLiteral = makeArrayLiteral(body.elements, checker);
                            }
                        }
                    }
                }
            }
        }

        return arrayLiteral;
    };

    /**
     * @description find property by queryKey recursively
     */
    const findPropertyByQueryKey = (properties: ts.NodeArray<ts.ObjectLiteralElement>) => {
        for (const prop of properties) {
            if (ts.isPropertyAssignment(prop)) {
                const initializer = prop.initializer;

                // Arrow function 처리
                if (ts.isArrowFunction(initializer)) {
                    /**
                     * () => {
                     *  return {
                     *      queryKey: ['key']
                     *  }
                     * }
                     */
                    if (ts.isBlock(initializer.body)) {
                        const statements = initializer.body.statements;

                        for (const statement of statements) {
                            if (ts.isReturnStatement(statement)) {
                                const expression = statement.expression;

                                if (expression && ts.isObjectLiteralExpression(expression)) {
                                    return findPropertyByQueryKey(expression.properties);
                                }
                            }
                        }
                    }

                    /**
                     * () => ({
                     *  queryKey: ['key']
                     * })
                     */
                    if (ts.isParenthesizedExpression(initializer.body)) {
                        const expression = initializer.body.expression;

                        if (expression && ts.isObjectLiteralExpression(expression)) {
                            return findPropertyByQueryKey(expression.properties);
                        }
                    }
                }

                if (ts.isObjectLiteralExpression(initializer)) {
                    return findPropertyByQueryKey(initializer.properties);
                }

                /**
                 * @description find queryKey return
                 */
                if (ts.isIdentifier(prop.name) && prop.name.getText() === PROPERTY_NAME) {
                    return prop;
                }
            }
        }

        return undefined;
    };
}

export { QueryKeyFinder };
