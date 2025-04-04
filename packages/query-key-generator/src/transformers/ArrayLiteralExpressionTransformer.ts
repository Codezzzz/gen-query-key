import ts from 'typescript';
import { QueryKeyStructureFactory } from '../factories';
import { IQueryNodeType } from '../types';
import { makeQueryKeyName } from '../utils';

namespace ArrayLiteralExpressionTransformer {
    export const transformer = ({
        arrayLiteral,
        write,
        checker,
        separator = '-'
    }: {
        write: (
            ...args: Parameters<typeof QueryKeyStructureFactory.write>
        ) => ts.PropertyAssignment;
        arrayLiteral: IQueryNodeType[];
        checker: ts.TypeChecker;
        separator?: string;
    }) => {
        const name =
            arrayLiteral.length === 1 ? 'def' : makeQueryKeyName(arrayLiteral.slice(1), separator);

        if (name.length === 0) {
            return;
        }

        return write({
            identifierName: `"${name}"`,
            node: arrayLiteral,
            checker
        });
    };
}

export { ArrayLiteralExpressionTransformer };
