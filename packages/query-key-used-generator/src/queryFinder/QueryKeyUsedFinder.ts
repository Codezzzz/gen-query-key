import ts from 'typescript';

namespace QueryKeyUsedFinder {
    export type QueryKeyUsedFinderReturnType = ReturnType<typeof find>;

    export const find = (sourceFiles: ts.SourceFile[], globalQueryKeyName: string) => {
        // find globalQueryKeys using place
        const globalQueryKeys = sourceFiles.map(sourceFile => {
            return findGlobalQueryKeys(sourceFile, globalQueryKeyName);
        });

        const queryKeyByDeclaration = globalQueryKeys.flatMap(keys => {
            const usedDeclarations = keys.findNode.map(key => {
                // 해당 key에서 사용중인 함수를 찾는다.
                const declaration = findUsedDeclaration(key.node);

                return {
                    ...key,
                    declaration,
                    sourceFile: keys.sourceFile
                };
            });

            return usedDeclarations;
        });

        return queryKeyByDeclaration;
    };

    const findGlobalQueryKeys = (node: ts.SourceFile, globalQueryKeyName: string) => {
        const findNode: {
            node: ts.Node;
            parent: ts.Node | null;
        }[] = [];

        const findText = [globalQueryKeyName];

        const visitor = (node: ts.Node) => {
            // import 구문은 무시
            if (ts.isImportDeclaration(node)) {
                return;
            }

            if (ts.isCallExpression(node) || ts.isIdentifier(node)) {
                if (ts.isIdentifier(node) && findText.includes(node.getText())) {
                    const grandParent = node.parent.parent;

                    if (ts.isPropertyAccessExpression(node.parent)) {
                        const isGlobalQueryKey = findText.some(text =>
                            grandParent.getText().includes(text)
                        );

                        findNode.push({
                            node,
                            parent: isGlobalQueryKey ? grandParent : null
                        });
                    }
                }
            }

            ts.forEachChild(node, visitor);
        };

        visitor(node);

        return { findNode, sourceFile: node };
    };

    const findUsedDeclaration = (node: ts.Node) => {
        let parentNode = node.parent; // 부모 노드 탐색

        let declaration: ts.FunctionDeclaration | ts.VariableDeclaration | null = null;

        // 사용중인 함수를 찾을 때까지 부모를 계속 탐색
        while (parentNode) {
            if (ts.isFunctionDeclaration(parentNode)) {
                declaration = parentNode;
                break;
            }

            if (
                ts.isVariableDeclaration(parentNode) &&
                parentNode.initializer &&
                ts.isArrowFunction(parentNode.initializer)
            ) {
                declaration = parentNode;
                break;
            }

            parentNode = parentNode.parent;
        }

        return declaration;
    };
}

export { QueryKeyUsedFinder };
