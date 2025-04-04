import ts from 'typescript';

namespace UseQueryFinder {
    const matchQuery = [
        'useQuery',
        'useSuspenseQuery',
        'useInfiniteQuery',
        'useQueries',
        'useSuspenseQueries'
    ];

    export type IQueryFiner = {
        sourceFiles: ts.SourceFile[];
    };

    export type IFindUserQueryReturn = ReturnType<typeof findUseQuery>;

    /**
     *
     * @param sourceFile
     * @param checker
     * @returns ts.CallExpression[]
     *
     */
    export const findUseQuery = ({ sourceFiles }: IQueryFiner) => {
        const result = sourceFiles
            .map(sourceFile => {
                return findCallExpressions(sourceFile);
            })
            .flat();

        return result;
    };

    const findCallExpressions = (node: ts.Node) => {
        const callExpressions: ts.CallExpression[] = [];

        const visit = (node: ts.Node) => {
            if (ts.isCallExpression(node) && isUseQuery(node)) {
                callExpressions.push(node);
            }

            ts.forEachChild(node, visit);
        };

        visit(node);

        return callExpressions;
    };

    const isUseQuery = (callExpression: ts.CallExpression) => {
        const isMatch =
            ts.isIdentifier(callExpression.expression) &&
            matchQuery.includes(callExpression.expression.text);

        return isMatch;
    };
}

export { UseQueryFinder };

// namespace UseQueryFinder {
//     export type IQueryFiner = {
//         sourceFiles: ts.SourceFile[];
//         checker: ts.TypeChecker;
//     };

//     export type IFindUserQueryReturn = ReturnType<typeof findUseQuery>;

//     /**
//      *
//      * @param sourceFile
//      * @param checker
//      * @returns key : caller, value : callExpression
//      *
//      */
//     export const findUseQuery = ({ sourceFiles, checker }: IQueryFiner) => {
//         const map = new Map<ts.FunctionDeclaration | ts.VariableDeclaration, ts.CallExpression>();

//         const visit = (node: ts.Node) => {
//             if (ts.isVariableDeclaration(node) || ts.isFunctionDeclaration(node)) {
//                 const callExpressions = findCallExpressions(node);
//                 callExpressions.forEach(expression => {
//                     map.set(node, expression);
//                 });
//             }

//             ts.forEachChild(node, visit);
//         };

//         sourceFiles.forEach(item => {
//             visit(item);
//         });

//         const result: Map<string, ts.CallExpression> = new Map();

//         map.forEach((value, key) => {
//             if (key.name) {
//                 const symbol = checker.getSymbolAtLocation(key.name);

//                 /**
//                  *  hook에서 사용하는 함수인지 확인한다.
//                  */
//                 if (symbol && symbol.getName().startsWith('use')) {
//                     result.set(symbol.getName(), value);
//                 }
//             }
//         });

//         return result;
//     };

//     const findCallExpressions = (node: ts.Node) => {
//         const callExpressions: ts.CallExpression[] = [];

//         const visit = (node: ts.Node) => {
//             if (ts.isCallExpression(node) && isUseQuery(node)) {
//                 callExpressions.push(node as ts.CallExpression);
//             }

//             ts.forEachChild(node, visit);
//         };

//         visit(node);

//         return callExpressions;
//     };

//     const isUseQuery = (callExpression: ts.CallExpression) => {
//         const matchText = ['useQuery', 'useSuspenseQuery'];

//         const isMatch =
//             ts.isIdentifier(callExpression.expression) &&
//             matchText.includes(callExpression.expression.text);

//         return isMatch;
//     };
// }

// export { UseQueryFinder };
