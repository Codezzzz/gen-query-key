import ts from 'typescript';
import { IQueryNodeSymbol } from '../types';

namespace TypeConverterFactory {
    const factory = ts.factory;

    const typeCache = new WeakMap<ts.Type, ts.TypeNode>();

    export const transform = (
        symbol: IQueryNodeSymbol,
        checker: ts.TypeChecker,
        isTypeReference?: boolean
    ): ts.TypeNode | undefined => {
        const type = checker.getTypeOfSymbol(symbol);
        const declaration = symbol.declarations;
        const valueDeclaration = symbol.valueDeclaration;

        if (valueDeclaration && ts.isParameter(valueDeclaration)) {
            const type = valueDeclaration.type;

            if (type) {
                if (ts.isTupleTypeNode(type)) {
                    return tuple(type, checker);
                }

                if (ts.isArrayTypeNode(type)) {
                    return array(type, checker);
                }

                if (ts.isUnionTypeNode(type)) {
                    return unionOrIntersection(type, checker, true);
                }

                if (ts.isTypeLiteralNode(type)) {
                    return typeLiteral(type, checker);
                }

                if (ts.isIntersectionTypeNode(type)) {
                    return unionOrIntersection(type, checker, false);
                }

                if (ts.isTypeReferenceNode(type)) {
                    const symbol = checker.getSymbolAtLocation(type.typeName);

                    if (symbol) {
                        return transform(symbol, checker, true);
                    }
                }
            }
        }

        if (valueDeclaration && ts.isEnumDeclaration(valueDeclaration)) {
            return enumToUnionFromEnumDeclaration(valueDeclaration, checker);
        }

        if (declaration && isTypeReference) {
            const typeNode = typeDeclaration(declaration, checker);

            if (typeNode) {
                return typeNode;
            }
        }

        const typeName = checker.typeToString(type);

        const isKeywordTypeNode = keywordTypeNode(typeName);

        if (isKeywordTypeNode) {
            return isKeywordTypeNode;
        }

        // if (type.isUnion()) {
        //     if (type.symbol?.exports) {
        //         return enumToUnion(type, checker);
        //     }
        //     return union(type, checker);
        // }

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
            case 'undefined':
                return factory.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword);
            case 'null':
                return factory.createLiteralTypeNode(factory.createNull());
            case 'unknown':
                return factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword);
            case 'never':
                return factory.createKeywordTypeNode(ts.SyntaxKind.NeverKeyword);
            case 'object':
                return factory.createKeywordTypeNode(ts.SyntaxKind.ObjectKeyword);
            case 'void':
                return factory.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword);
        }

        return undefined;
    };

    const literalKindToKeyword = (element: ts.LiteralTypeNode) => {
        const literal = element.literal;

        switch (literal.kind) {
            case ts.SyntaxKind.NullKeyword:
                return keywordTypeNode('null');

            case ts.SyntaxKind.TrueKeyword:
                return factory.createLiteralTypeNode(factory.createTrue());

            case ts.SyntaxKind.FalseKeyword:
                return factory.createLiteralTypeNode(factory.createFalse());

            case ts.SyntaxKind.NumericLiteral:
                return factory.createLiteralTypeNode(
                    factory.createNumericLiteral((literal as ts.NumericLiteral).text)
                );

            case ts.SyntaxKind.StringLiteral:
                return factory.createLiteralTypeNode(
                    factory.createStringLiteral((literal as ts.StringLiteral).text)
                );
            case ts.SyntaxKind.BigIntLiteral:
                return factory.createLiteralTypeNode(
                    factory.createBigIntLiteral((literal as ts.BigIntLiteral).text)
                );
        }

        return undefined;
    };

    const literal = (type: ts.Type, checker: ts.TypeChecker): ts.TypeLiteralNode => {
        const properties = type.getProperties().map(prop => {
            const isOptional = TypeConverterFactoryGuard.isOptional(prop);

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

    const unionOrIntersection = (
        typeNode: ts.UnionTypeNode | ts.IntersectionTypeNode,
        checker: ts.TypeChecker,
        isUnion: boolean
    ) => {
        const types = typeNode.types;

        const node = types
            .map(element => {
                const kind = element.kind;

                if (kind === ts.SyntaxKind.StringKeyword) {
                    return keywordTypeNode('string');
                }

                if (kind === ts.SyntaxKind.NumberKeyword) {
                    return keywordTypeNode('number');
                }

                if (kind === ts.SyntaxKind.BooleanKeyword) {
                    return keywordTypeNode('boolean');
                }

                if (kind === ts.SyntaxKind.UndefinedKeyword) {
                    return keywordTypeNode('undefined');
                }

                if (kind === ts.SyntaxKind.ObjectKeyword) {
                    return keywordTypeNode('object');
                }

                if (kind === ts.SyntaxKind.AnyKeyword) {
                    return keywordTypeNode('any');
                }

                if (ts.isLiteralTypeNode(element)) {
                    const keyword = literalKindToKeyword(element);

                    if (keyword) {
                        return keyword;
                    }
                }

                // check
                if (ts.isTypeLiteralNode(element)) {
                    return typeLiteral(element, checker);
                }

                if (ts.isTypeReferenceNode(element)) {
                    const symbol = checker.getSymbolAtLocation(element.typeName);

                    if (symbol) {
                        return transform(symbol, checker, true);
                    }
                }

                return undefined;
            })
            .filter(Boolean) as ts.TypeNode[];

        return isUnion
            ? factory.createUnionTypeNode(node)
            : factory.createIntersectionTypeNode(node);
    };

    const intersection = (
        intersection: ts.IntersectionType,
        checker: ts.TypeChecker
    ): ts.TypeNode => {
        const types = intersection.types;

        const intersectionNode = types
            .map(t => {
                const typeName = checker.typeToString(t);

                if (TypeConverterFactoryGuard.isObjectType(t)) {
                    const properties = generateProperties(t, checker);

                    return factory.createTypeLiteralNode(properties);
                }

                if (TypeConverterFactoryGuard.isLiteralType(t)) {
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

    export const enumToUnionFromEnumDeclaration = (
        type: ts.EnumDeclaration,
        checker: ts.TypeChecker
    ) => {
        const members = type.members;

        const unionType = members
            .map(member => {
                const initial = member.initializer;

                if (!initial) return undefined;
                if (ts.isStringLiteral(initial)) {
                    return factory.createLiteralTypeNode(factory.createStringLiteral(initial.text));
                }

                if (ts.isNumericLiteral(initial)) {
                    return factory.createLiteralTypeNode(
                        factory.createNumericLiteral(initial.text)
                    );
                }

                if (ts.isPropertyAccessExpression(initial)) {
                    const symbol = checker.getSymbolAtLocation(initial.name);

                    if (symbol) {
                        return transform(symbol, checker);
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

    export const tuple = (type: ts.TupleTypeNode, checker: ts.TypeChecker) => {
        const elements = type.elements;

        const node = elements
            .map(element => {
                const kind = element.kind;

                if (kind === ts.SyntaxKind.StringKeyword) {
                    return keywordTypeNode('string');
                }

                if (kind === ts.SyntaxKind.NumberKeyword) {
                    return keywordTypeNode('number');
                }

                if (kind === ts.SyntaxKind.BooleanKeyword) {
                    return keywordTypeNode('boolean');
                }

                if (kind === ts.SyntaxKind.UndefinedKeyword) {
                    return keywordTypeNode('undefined');
                }

                if (kind === ts.SyntaxKind.ObjectKeyword) {
                    return keywordTypeNode('object');
                }

                if (kind === ts.SyntaxKind.AnyKeyword) {
                    return keywordTypeNode('any');
                }

                if (kind === ts.SyntaxKind.UnknownKeyword) {
                    return keywordTypeNode('unknown');
                }

                if (kind === ts.SyntaxKind.NeverKeyword) {
                    return keywordTypeNode('never');
                }

                if (kind === ts.SyntaxKind.VoidKeyword) {
                    return keywordTypeNode('void');
                }

                if (ts.isLiteralTypeNode(element)) {
                    const keyword = literalKindToKeyword(element);

                    if (keyword) {
                        return keyword;
                    }
                }

                // check
                if (ts.isTypeLiteralNode(element)) {
                    return typeLiteral(element, checker);
                }

                if (ts.isTypeReferenceNode(element)) {
                    const symbol = checker.getSymbolAtLocation(element.typeName);

                    if (symbol) {
                        return transform(symbol, checker);
                    }
                }

                return undefined;
            })
            .filter(Boolean) as ts.TypeNode[];
        return factory.createTupleTypeNode(node);
    };

    const array = (type: ts.ArrayTypeNode, checker: ts.TypeChecker) => {
        const element = type.elementType;

        if (element.kind === ts.SyntaxKind.StringKeyword) {
            return factory.createArrayTypeNode(
                factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
            );
        }

        if (element.kind === ts.SyntaxKind.NumberKeyword) {
            return factory.createArrayTypeNode(
                factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)
            );
        }

        if (element.kind === ts.SyntaxKind.BooleanKeyword) {
            return factory.createArrayTypeNode(
                factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword)
            );
        }

        if (element.kind === ts.SyntaxKind.UndefinedKeyword) {
            return factory.createArrayTypeNode(
                factory.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword)
            );
        }

        if (element.kind === ts.SyntaxKind.NullKeyword) {
            return factory.createArrayTypeNode(factory.createLiteralTypeNode(factory.createNull()));
        }

        if (element.kind === ts.SyntaxKind.AnyKeyword) {
            return factory.createArrayTypeNode(
                factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)
            );
        }

        if (element.kind === ts.SyntaxKind.ObjectKeyword) {
            return factory.createArrayTypeNode(
                factory.createKeywordTypeNode(ts.SyntaxKind.ObjectKeyword)
            );
        }

        if (element.kind === ts.SyntaxKind.UnknownKeyword) {
            return factory.createArrayTypeNode(
                factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword)
            );
        }

        if (element.kind === ts.SyntaxKind.NeverKeyword) {
            return factory.createArrayTypeNode(
                factory.createKeywordTypeNode(ts.SyntaxKind.NeverKeyword)
            );
        }

        if (ts.isTypeLiteralNode(element)) {
            return factory.createArrayTypeNode(typeLiteral(element, checker));
        }

        if (ts.isParenthesizedTypeNode(element)) {
            const type = element.type;

            if (ts.isUnionTypeNode(type)) {
                return factory.createArrayTypeNode(unionOrIntersection(type, checker, true));
            }

            if (ts.isIntersectionTypeNode(type)) {
                return factory.createArrayTypeNode(unionOrIntersection(type, checker, false));
            }
        }

        return undefined;
    };

    const typeLiteral = (type: ts.TypeLiteralNode, checker: ts.TypeChecker) => {
        const properties = type.members
            .map(member => {
                const name = member.name;

                if (ts.isPropertySignature(member) && member.type && name) {
                    const type = member.type;

                    /// ---- primitive type start ----

                    if (type.kind === ts.SyntaxKind.StringKeyword) {
                        return factory.createPropertySignature(
                            undefined,
                            name,
                            undefined,
                            factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
                        );
                    }

                    // number
                    if (type.kind === ts.SyntaxKind.NumberKeyword) {
                        return factory.createPropertySignature(
                            undefined,
                            name,
                            undefined,
                            factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)
                        );
                    }

                    if (type.kind === ts.SyntaxKind.BooleanKeyword) {
                        return factory.createPropertySignature(
                            undefined,
                            name,
                            undefined,
                            factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword)
                        );
                    }

                    if (type.kind === ts.SyntaxKind.NullKeyword) {
                        return factory.createPropertySignature(
                            undefined,
                            name,
                            undefined,
                            factory.createLiteralTypeNode(factory.createNull())
                        );
                    }

                    if (type.kind === ts.SyntaxKind.AnyKeyword) {
                        return factory.createPropertySignature(
                            undefined,
                            name,
                            undefined,
                            factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)
                        );
                    }

                    // undefined
                    if (type.kind === ts.SyntaxKind.UndefinedKeyword) {
                        return factory.createPropertySignature(
                            undefined,
                            name,
                            undefined,
                            factory.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword)
                        );
                    }

                    if (type.kind === ts.SyntaxKind.LiteralType && ts.isLiteralTypeNode(type)) {
                        return factory.createPropertySignature(
                            undefined,
                            name,
                            undefined,
                            literalKindToKeyword(type)
                        );
                    }

                    /// ---- primitive type end ----

                    if (type.kind === ts.SyntaxKind.UnknownKeyword) {
                        return factory.createPropertySignature(
                            undefined,
                            name,
                            undefined,
                            keywordTypeNode('unknown')
                        );
                    }

                    if (type.kind === ts.SyntaxKind.NeverKeyword) {
                        return factory.createPropertySignature(
                            undefined,
                            name,
                            undefined,
                            keywordTypeNode('never')
                        );
                    }

                    if (type.kind === ts.SyntaxKind.VoidKeyword) {
                        return factory.createPropertySignature(
                            undefined,
                            name,
                            undefined,
                            keywordTypeNode('void')
                        );
                    }

                    if (ts.isUnionTypeNode(type)) {
                        return factory.createPropertySignature(
                            undefined,
                            name,
                            undefined,
                            unionOrIntersection(type, checker, true)
                        );
                    }

                    if (ts.isIntersectionTypeNode(type)) {
                        return factory.createPropertySignature(
                            undefined,
                            name,
                            undefined,
                            unionOrIntersection(type, checker, false)
                        );
                    }

                    if (ts.isStringLiteral(type)) {
                        return factory.createPropertySignature(
                            undefined,
                            name,
                            undefined,
                            factory.createLiteralTypeNode(factory.createStringLiteral(type.text))
                        );
                    }

                    if (ts.isNumericLiteral(type)) {
                        return factory.createPropertySignature(
                            undefined,
                            name,
                            undefined,
                            factory.createLiteralTypeNode(factory.createNumericLiteral(type.text))
                        );
                    }

                    // recursive
                    if (ts.isTypeLiteralNode(type)) {
                        return factory.createPropertySignature(
                            undefined,
                            name,
                            undefined,
                            typeLiteral(type, checker)
                        );
                    }

                    if (ts.isTypeReferenceNode(type)) {
                        const symbol = checker.getSymbolAtLocation(type.typeName);

                        const typeArgument = type.typeArguments;

                        if (symbol && !typeArgument) {
                            return factory.createPropertySignature(
                                undefined,
                                name,
                                undefined,
                                transform(symbol, checker, true)
                            );
                        }

                        if (symbol && typeArgument) {
                            const node = typeArgument
                                .map(t => {
                                    if (ts.isTypeReferenceNode(t)) {
                                        const symbol = checker.getSymbolAtLocation(t.typeName);

                                        if (symbol) {
                                            return transform(symbol, checker, true);
                                        }
                                    }

                                    if (ts.isLiteralTypeNode(t)) {
                                        return literalKindToKeyword(t);
                                    }

                                    if (ts.isTypeLiteralNode(t)) {
                                        return typeLiteral(t, checker);
                                    }
                                    if (ts.isUnionTypeNode(t)) {
                                        return unionOrIntersection(t, checker, true);
                                    }

                                    if (ts.isIntersectionTypeNode(t)) {
                                        return unionOrIntersection(t, checker, false);
                                    }

                                    return t;
                                })
                                .filter(Boolean) as ts.TypeNode[];

                            return factory.createPropertySignature(
                                undefined,
                                name,
                                undefined,
                                factory.createTypeReferenceNode(
                                    factory.createIdentifier('Record'),
                                    node
                                )
                            );
                        }
                    }

                    if (ts.isTupleTypeNode(type)) {
                        return factory.createPropertySignature(
                            undefined,
                            name,
                            undefined,
                            tuple(type, checker)
                        );
                    }

                    if (ts.isArrayTypeNode(type)) {
                        return factory.createPropertySignature(
                            undefined,
                            name,
                            undefined,
                            array(type, checker)
                        );
                    }
                }

                return undefined;
            })
            .filter(Boolean) as ts.PropertySignature[];

        return factory.createTypeLiteralNode(properties);
    };

    const typeDeclaration = (type: ts.Declaration[], checker: ts.TypeChecker) => {
        return type
            .map(declaration => {
                if (ts.isTypeAliasDeclaration(declaration)) {
                    const type = declaration.type;

                    if (ts.isTypeLiteralNode(type)) {
                        return typeLiteral(type, checker);
                    }
                }

                if (ts.isInterfaceDeclaration(declaration)) {
                    // check
                    return undefined;
                }

                return undefined;
            })
            .filter(Boolean)[0] as ts.TypeNode;
    };
}

const TypeConverterFactoryGuard = {
    isObjectType: (type: ts.Type): boolean => {
        return !!(type.flags & ts.TypeFlags.Object);
    },

    isLiteralType: (type: ts.Type): boolean => {
        return (
            !!(type.flags & ts.TypeFlags.StringLiteral) ||
            !!(type.flags & ts.TypeFlags.NumberLiteral) ||
            !!(type.flags & ts.TypeFlags.BooleanLiteral)
        );
    },
    isOptional: (symbol: ts.Symbol) => {
        return symbol.valueDeclaration &&
            (ts.isParameter(symbol.valueDeclaration) ||
                ts.isPropertySignature(symbol.valueDeclaration))
            ? !!symbol.valueDeclaration.questionToken
            : !!(symbol.getFlags() & ts.SymbolFlags.Optional);
    }
};

export { TypeConverterFactory, TypeConverterFactoryGuard };

// const unionNode = types
//     .map(t => {
//         const typeName = checker.typeToString(t);

//         if (TypeConverterFactoryGuard.isObjectType(t)) {
//             const properties = generateProperties(t, checker);

//             return factory.createTypeLiteralNode(properties);
//         }

//         if (TypeConverterFactoryGuard.isLiteralType(t)) {
//             return factory.createLiteralTypeNode(
//                 factory.createStringLiteral(typeName.replace(/"/g, ''))
//             );
//         }

//         return keywordTypeNode(typeName);
//     })
//     .filter(Boolean) as ts.TypeNode[];

// return factory.createUnionTypeNode(unionNode);
