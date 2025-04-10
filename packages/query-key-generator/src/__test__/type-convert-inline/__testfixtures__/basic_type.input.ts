import { useQuery } from '@tanstack/react-query';

// --------- primitive type-----------
export function useNumber(id: number) {
    useQuery({
        queryKey: ['primitive', 'number', id]
    });
}

export function useString(id: string) {
    useQuery({
        queryKey: ['primitive', 'string', id]
    });
}

export function useBoolean(id: boolean) {
    useQuery({
        queryKey: ['primitive', 'boolean', id]
    });
}

export function useUndefined(id: undefined) {
    useQuery({
        queryKey: ['primitive', 'undefined', id]
    });
}

export function useNull(id: null) {
    useQuery({
        queryKey: ['primitive', 'null', id]
    });
}

export function useLiteral(id: 'literal') {
    useQuery({
        queryKey: ['primitive', 'literal', id]
    });
}

// ---------- primitive end --------------

// ------------- union type ---------------
export function useUnion(id: string | number) {
    useQuery({
        queryKey: ['union', id]
    });
}

export function useUnionWithLiteral(id: 'literal' | 'literal2') {
    useQuery({
        queryKey: ['union', 'literal', id]
    });
}

export function useUnionWithLiteralAndOtherType(id: 'literal' | number) {
    useQuery({
        queryKey: ['union', 'literal-and-other-type', id]
    });
}

export function useUnionWithLiteralAndObjectType(id: 'literal' | { a: string }) {
    useQuery({
        queryKey: ['union', 'literal-and-object-type', id]
    });
}

// --------------- union type end ----------

// ------------ intersection type-----------
export function useIntersection(id: { a: string } & { b: number }) {
    useQuery({
        queryKey: ['intersection', id]
    });
}

export function useIntersectionWithLiteralAndObjectType(
    id: { a: string } & { b: number } & { c: 'literal' } & { d: { e: string } }
) {
    useQuery({
        queryKey: ['intersection', 'literal-and-object-type', id]
    });
}

export function useIntersectionWithLiteral(id: { a: string } & { b: number } & { c: 'literal' }) {
    useQuery({
        queryKey: ['intersection', 'literal', id]
    });
}

// ---------------- intersection type end -----------

// unknown type
export function useUnknown(id: unknown) {
    useQuery({
        queryKey: ['unknownType', id]
    });
}

// void type
export function useVoid(id: void) {
    useQuery({
        queryKey: ['voidType', id]
    });
}

// never type
export function useNever(id: never) {
    useQuery({
        queryKey: ['neverType', id]
    });
}

// tuple type
export function useTuple(
    id: [string, number, boolean, undefined, null, 'literal', { a: string }, { b: number }]
) {
    useQuery({
        queryKey: ['tuple', id]
    });
}

// --------- tuple end ---------

// array type
export function useArray(id: string[], id2: number[]) {
    useQuery({
        queryKey: ['array', id, id2]
    });
}

export function useArrayOfUnion(data: { id: (string | number)[] }) {
    useQuery({
        queryKey: ['array', 'union', data]
    });
}

export function useArrayOfUnionWithLiteral(data: { id: ({ a: string } & number)[] }) {
    useQuery({
        queryKey: ['array', 'union', 'literal', data]
    });
}

export function useArrayOfIntersection(data: { id: (string & number)[] }) {
    useQuery({
        queryKey: ['array', 'intersection', data]
    });
}

// --------- array end ---------

// record

export function useRecord(data: { id: Record<string, number> }) {
    useQuery({
        queryKey: ['record', data]
    });
}

export function useRecordWithLiteral(data: { id: Record<string, 'literal'> }) {
    useQuery({
        queryKey: ['record', 'literal', data]
    });
}

export function useRecordWithLiteralAndOtherType(data: { id: Record<string, 'literal' | number> }) {
    useQuery({
        queryKey: ['record', 'literal', 'other-type', data]
    });
}
