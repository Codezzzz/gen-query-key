import ts from 'typescript';

namespace GlobalQueryKeyStatement {
    const factory = ts.factory;
    export const write = (
        keyStatement: { key: string; statement: ts.VariableStatement }[],
        keyName: string,
        factoryPrefix: string
    ) => {
        return factory.createVariableStatement(
            [factory.createToken(ts.SyntaxKind.ExportKeyword)],
            factory.createVariableDeclarationList(
                [
                    factory.createVariableDeclaration(
                        factory.createIdentifier(keyName),
                        undefined,
                        undefined,
                        factory.createAsExpression(
                            factory.createObjectLiteralExpression(
                                [
                                    ...keyStatement.map(item => {
                                        return factory.createShorthandPropertyAssignment(
                                            factory.createIdentifier(item.key + factoryPrefix)
                                        );
                                    })
                                ],
                                true
                            ),
                            factory.createTypeReferenceNode(
                                factory.createIdentifier('const'),
                                undefined
                            )
                        )
                    )
                ],
                ts.NodeFlags.Const
            )
        );
    };
}

export { GlobalQueryKeyStatement };
