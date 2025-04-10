import ts from 'typescript';
import { IQueryNodeType, QueryNodeKind } from '../types/QueryNodeType';
import { TypeGuard, nodeByName } from '../utils';
import { TypeConverterFactory, TypeConverterFactoryGuard } from './TypeConverterFactory';
namespace QueryKeyStructureFactory {
    const factory = ts.factory;

    export const write = ({
        identifierName,
        node,
        checker
    }: {
        identifierName: string;
        node: IQueryNodeType[];
        checker: ts.TypeChecker;
    }) => {
        const isStringLiteral = node.every(item => TypeGuard.stringLiteral(item.type));
        const arrayLiteralExpression = arrayLiteral(node);

        /**
         * only string literal
         * ["example", "detail"]
         */
        if (isStringLiteral) {
            return factory.createPropertyAssignment(
                factory.createIdentifier(identifierName),
                arrayLiteralExpression
            );
        }

        const parameterDeclarations = parameter(
            node.filter(item => !TypeGuard.stringLiteral(item.type)),
            checker
        );

        return factory.createPropertyAssignment(
            factory.createIdentifier(identifierName),
            factory.createArrowFunction(
                undefined,
                undefined,
                [...parameterDeclarations],
                undefined,
                factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                arrayLiteralExpression
            )
        );
    };

    const arrayLiteral = (node: IQueryNodeType[]) => {
        const literal = node
            .map(item => {
                if (TypeGuard.stringLiteral(item.type)) {
                    return nodeByName.stringLiteral(item.name);
                }

                if (TypeGuard.symbol(item.type)) {
                    return nodeByName.identifier(item.name);
                }

                if (TypeGuard.tsType(item.type)) {
                    return nodeByName.identifier(item.name);
                }

                return nodeByName.identifier(item.name);
            })
            .filter(Boolean) as ts.Expression[];

        const arrayLiteralExpression = factory.createArrayLiteralExpression(literal, false);

        return arrayLiteralExpression;
    };

    const parameter = (node: IQueryNodeType[], checker: ts.TypeChecker) => {
        return node
            .map(item => {
                if (TypeGuard.symbol(item.type)) {
                    const isOptional = TypeConverterFactoryGuard.isOptional(item.type);
                    return factory.createParameterDeclaration(
                        undefined,
                        undefined,
                        nodeByName.identifier(item.name),
                        isOptional ? factory.createToken(ts.SyntaxKind.QuestionToken) : undefined,
                        TypeConverterFactory.transform(item.type, checker),
                        undefined
                    );
                }

                if (TypeGuard.tsType(item.type) && item.kind === QueryNodeKind.EnumMember) {
                    const isOptional = TypeConverterFactoryGuard.isOptional(item.symbol!);

                    return factory.createParameterDeclaration(
                        undefined,
                        undefined,
                        nodeByName.identifier(item.name),
                        isOptional ? factory.createToken(ts.SyntaxKind.QuestionToken) : undefined,
                        TypeConverterFactory.enumToUnion(item.type, checker),
                        undefined
                    );
                }

                if (TypeGuard.tsType(item.type) && item.kind === QueryNodeKind.TypeOfKeyword) {
                    const isOptional = TypeConverterFactoryGuard.isOptional(item.symbol!);

                    const typeOfNode = TypeConverterFactory.typeofKeyword(item.type, checker);

                    return factory.createParameterDeclaration(
                        undefined,
                        undefined,
                        nodeByName.identifier(item.name),
                        isOptional ? factory.createToken(ts.SyntaxKind.QuestionToken) : undefined,
                        typeOfNode,
                        undefined
                    );
                }

                if (TypeGuard.tuple(item.type) && item.kind === QueryNodeKind.Tuple) {
                    const isOptional = TypeConverterFactoryGuard.isOptional(item.symbol!);

                    const tupleNode = TypeConverterFactory.tuple(item.type, checker);

                    return factory.createParameterDeclaration(
                        undefined,
                        undefined,
                        nodeByName.identifier(item.name),
                        isOptional ? factory.createToken(ts.SyntaxKind.QuestionToken) : undefined,
                        tupleNode,
                        undefined
                    );
                }

                return undefined;
            })
            .filter(Boolean) as ts.ParameterDeclaration[];
    };
}

export { QueryKeyStructureFactory };
