import ts from 'typescript';

namespace VariableDeclarationFactory {
    const factory = ts.factory;
    export const write = (
        name: string,
        node: ts.Expression | ts.ObjectLiteralExpression,
        isConst: boolean = false
    ) => {
        const typeNode = () => {
            if (isConst) {
                return factory.createAsExpression(
                    node,
                    factory.createTypeReferenceNode(factory.createIdentifier('const'), undefined)
                );
            }

            return node;
        };

        return factory.createVariableDeclaration(
            factory.createIdentifier(name),
            undefined,
            undefined,
            typeNode()
        );
    };
}

namespace VariableDeclarationListFactory {
    const factory = ts.factory;

    export const write = (
        variables: ts.VariableDeclaration[],
        flag: ts.NodeFlags = ts.NodeFlags.Const
    ) => {
        return factory.createVariableDeclarationList(variables, flag);
    };
}

export { VariableDeclarationFactory, VariableDeclarationListFactory };
