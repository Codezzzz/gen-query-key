import { useQuery } from '@tanstack/react-query';

// --------- primitive type ---------
export function useObjectString(data: { id: number }) {
    useQuery({
        queryKey: ['primitive', 'string', data]
    });
}

export function useObjectNumber(data: { id: number }) {
    useQuery({
        queryKey: ['primitive', 'number', data]
    });
}

export function useObjectBoolean(data: { id: boolean }) {
    useQuery({
        queryKey: ['primitive', 'boolean', data]
    });
}

export function useObjectUndefined(data: { id: undefined }) {
    useQuery({
        queryKey: ['primitive', 'undefined', data]
    });
}

export function useObjectNull(data: { id: null }) {
    useQuery({
        queryKey: ['primitive', 'null', data]
    });
}

export function useObjectLiteral(data: { id: 'literal' }) {
    useQuery({
        queryKey: ['primitive', 'literal', data]
    });
}

// --------- primitive type end ---------

// --------- union type ---------
export function useUnion(data: { id: string | number }) {
    useQuery({
        queryKey: ['union', data]
    });
}

export function useUnionDepth(data: { id: { a: string | string } }) {
    useQuery({
        queryKey: ['union', 'depth', data]
    });
}

// --------- union type end ---------

// --------- intersection type ---------

export function useIntersection(data: { id: string | number }) {
    useQuery({
        queryKey: ['intersection', data]
    });
}

export function useIntersectionObject(data: { id: { a: string } & { b: number } }) {
    useQuery({
        queryKey: ['intersection', 'object', data]
    });
}

export function useIntersectionLiteral(data: {
    id: { a: string } & { b: number } & { c: 'literal' };
}) {
    useQuery({
        queryKey: ['intersection', 'literal', data]
    });
}

export function useIntersectionDepth(data: {
    id: { a: string & string; b: { c: string & string } };
}) {
    useQuery({
        queryKey: ['intersection', 'depth', data]
    });
}

// --------- intersection type end ---------

// unknown type
export function useUnknown(data: { id: unknown }) {
    useQuery({
        queryKey: ['unknownType', data]
    });
}

// void type
export function useVoid(data: { id: void }) {
    useQuery({
        queryKey: ['voidType', data]
    });
}

// never type
export function useNever(data: { id: never }) {
    useQuery({
        queryKey: ['neverType', data]
    });
}

// tuple
export function useTuple(data: {
    id: [string, number, boolean, undefined, null, 'literal', { a: string }, { b: number }];
}) {
    useQuery({
        queryKey: ['tuple', data]
    });
}

// --------- tuple end ---------

// --------- array type ---------
export function useArray(data: { id: string[] }) {
    useQuery({
        queryKey: ['array', data]
    });
}

// --------- array type end ---------

// deep object type

export function useDeepObject(data: { id: { a: string; b: { c: string } } }) {
    useQuery({
        queryKey: ['deepObject', data]
    });
}
export function useDeepObjectAllType(data: {
    id: {
        str: string;
        num: number;
        bool: boolean;
        nul: null;
        undef: undefined;
        literal: 'literal';
        union: string | number;
        intersection: { a: string } & { b: number };
        tuple: [string, number];
        nested: {
            arr: string[];
            obj: { x: string; y: number };
            deep: {
                very: {
                    deep: 'deep';
                };
            };
        };
    };
}) {
    useQuery({
        queryKey: ['deepObject', 'allType', data]
    });
}

// --------- deep object type end ---------
