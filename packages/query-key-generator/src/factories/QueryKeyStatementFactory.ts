import ts from 'typescript';
import { ObjectLiteralExpressionFactory } from './ObjectLiteralExpressionFactory';
import {
    VariableDeclarationFactory,
    VariableDeclarationListFactory
} from './VariableDeclarationFactory';

namespace QueryKeyStatementFactory {
    const factory = ts.factory;

    export const write = (
        propertyAssignments: ts.PropertyAssignment[],
        keyName: string,
        factoryPrefix: string
    ) => {
        return factory.createVariableStatement(
            undefined,
            VariableDeclarationListFactory.write(
                [
                    VariableDeclarationFactory.write(
                        keyName + factoryPrefix,
                        ObjectLiteralExpressionFactory.write([...propertyAssignments]),
                        true
                    )
                ],
                ts.NodeFlags.Const
            )
        );
    };
}

export { QueryKeyStatementFactory };
