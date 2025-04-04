import ts from 'typescript';
import { IQueryNodeSymbol } from '../types';

namespace TypeConverterFactory {
    const factory = ts.factory;

    const typeCache = new WeakMap<ts.Type, ts.TypeNode>();

    export const transform = (
        symbol: IQueryNodeSymbol,
        checker: ts.TypeChecker
    ): ts.TypeNode | undefined => {
        const type = checker.getTypeOfSymbol(symbol);

        const typeName = checker.typeToString(type);

        if (type.isUnion()) {
            if (type.symbol?.exports) {
                return enumToUnion(type, checker);
            }

            return union(type, checker);
        }

        if (type.isIntersection()) {
            return intersection(type, checker);
        }

        if (type.isNumberLiteral()) {
            return factory.createLiteralTypeNode(factory.createNumericLiteral(typeName));
        }

        if (type.isStringLiteral()) {
            const name = typeName.replace(/"/g, '');
            return factory.createLiteralTypeNode(factory.createStringLiteral(name));
        }

        const isKeywordTypeNode = keywordTypeNode(typeName);

        if (isKeywordTypeNode) {
            return isKeywordTypeNode;
        }

        if (typeCache.has(type)) {
            return typeCache.get(type)!;
        }

        const typeNode = literal(type, checker);
        typeCache.set(type, typeNode); // 캐싱

        return typeNode;
    };

    const keywordTypeNode = (name: string) => {
        switch (name) {
            case 'string':
                return factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
            case 'number':
                return factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
            case 'boolean':
                return factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword);
            case 'any':
                return factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword);
            case 'void':
                return factory.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword);
        }

        return undefined;
    };

    const literal = (type: ts.Type, checker: ts.TypeChecker): ts.TypeLiteralNode => {
        const properties = type.getProperties().map(prop => {
            const isOptional = TypeConverterFactory.isOptional(prop);
            return factory.createPropertySignature(
                undefined,
                prop.getName(),
                isOptional ? factory.createToken(ts.SyntaxKind.QuestionToken) : undefined,
                transform(prop, checker)
            );
        });

        return factory.createTypeLiteralNode(properties);
    };

    const generateProperties = (type: ts.Type, checker: ts.TypeChecker, isReadonly?: boolean) => {
        const properties = type.getProperties();
        const propertyNames = new Set<string>();

        properties.forEach(prop => {
            propertyNames.add(prop.getName());
        });

        return properties.map(prop => {
            return factory.createPropertySignature(
                isReadonly ? [factory.createToken(ts.SyntaxKind.ReadonlyKeyword)] : undefined,
                prop.getName(),
                undefined,
                transform(prop, checker)
            );
        });
    };

    const isObjectType = (type: ts.Type): boolean => {
        return !!(type.flags & ts.TypeFlags.Object);
    };

    const isLiteralType = (type: ts.Type): boolean => {
        return (
            !!(type.flags & ts.TypeFlags.StringLiteral) ||
            !!(type.flags & ts.TypeFlags.NumberLiteral) ||
            !!(type.flags & ts.TypeFlags.BooleanLiteral)
        );
    };

    const union = (unionType: ts.UnionType, checker: ts.TypeChecker) => {
        const types = unionType.types;

        const unionNode = types
            .map(t => {
                const typeName = checker.typeToString(t);

                if (isObjectType(t)) {
                    const properties = generateProperties(t, checker);

                    return factory.createTypeLiteralNode(properties);
                }

                if (isLiteralType(t)) {
                    return factory.createLiteralTypeNode(
                        factory.createStringLiteral(typeName.replace(/"/g, ''))
                    );
                }

                return keywordTypeNode(typeName);
            })
            .filter(Boolean) as ts.TypeNode[];

        return factory.createUnionTypeNode(unionNode);
    };

    const intersection = (
        intersection: ts.IntersectionType,
        checker: ts.TypeChecker
    ): ts.TypeNode => {
        const types = intersection.types;

        const intersectionNode = types
            .map(t => {
                const typeName = checker.typeToString(t);

                if (isObjectType(t)) {
                    const properties = generateProperties(t, checker);

                    return factory.createTypeLiteralNode(properties);
                }

                if (isLiteralType(t)) {
                    return factory.createLiteralTypeNode(
                        factory.createStringLiteral(typeName.replace(/"/g, ''))
                    );
                }

                return keywordTypeNode(typeName);
            })
            .filter(Boolean) as ts.TypeNode[];
        return factory.createIntersectionTypeNode(intersectionNode);
    };

    export const enumToUnion = (
        type: ts.Type,
        checker: ts.TypeChecker
    ): ts.TypeNode | undefined => {
        const enumValues = Array.from(type.symbol?.exports?.values() ?? []);

        const unionType = enumValues
            .map(value => {
                const declaration = value.valueDeclaration;
                if (declaration && ts.isEnumMember(declaration)) {
                    const name = value.getName();
                    const enumValue = checker.getConstantValue(declaration);

                    if (typeof enumValue === 'string') {
                        return ts.factory.createLiteralTypeNode(
                            ts.factory.createStringLiteral(enumValue)
                        );
                    } else if (typeof enumValue === 'number') {
                        return ts.factory.createLiteralTypeNode(
                            ts.factory.createNumericLiteral(enumValue.toString())
                        );
                    } else {
                        return ts.factory.createTypeReferenceNode(name, undefined);
                    }
                }
                return undefined;
            })
            .filter(Boolean) as ts.TypeNode[];

        return factory.createUnionTypeNode(unionType);
    };

    export const typeofKeyword = (type: ts.Type, checker: ts.TypeChecker) => {
        const properties = generateProperties(type, checker, true);

        return factory.createTypeLiteralNode(properties);
    };

    export const isOptional = (symbol: ts.Symbol) => {
        return symbol.valueDeclaration &&
            (ts.isParameter(symbol.valueDeclaration) ||
                ts.isPropertySignature(symbol.valueDeclaration))
            ? !!symbol.valueDeclaration.questionToken
            : !!(symbol.getFlags() & ts.SymbolFlags.Optional);
    };
}

export { TypeConverterFactory };
