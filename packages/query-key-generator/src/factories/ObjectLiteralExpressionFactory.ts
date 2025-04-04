import ts from 'typescript';

namespace ObjectLiteralExpressionFactory {
    const factory = ts.factory;

    const objectLiteralExpression = (properties: ts.PropertyAssignment[]) => {
        return factory.createObjectLiteralExpression(properties, true);
    };

    export const write = (properties: ts.PropertyAssignment[]) => {
        return objectLiteralExpression(properties);
    };
}

export { ObjectLiteralExpressionFactory };
