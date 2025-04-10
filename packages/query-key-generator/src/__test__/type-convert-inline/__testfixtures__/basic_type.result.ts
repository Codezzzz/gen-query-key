const primitive = {
    def: ['primitive'],
    'number-{id}': (id: number) => ['primitive', 'number', id],
    'string-{id}': (id: string) => ['primitive', 'string', id],
    'boolean-{id}': (id: boolean) => ['primitive', 'boolean', id],
    'undefined-{id}': (id: undefined) => ['primitive', 'undefined', id],
    'null-{id}': (id: null) => ['primitive', 'null', id],
    'literal-{id}': (id: 'literal') => ['primitive', 'literal', id]
} as const;
const union = {
    def: ['union'],
    '{id}': (id: string | number) => ['union', id],
    'literal-{id}': (id: 'literal' | 'literal2') => ['union', 'literal', id],
    'literal-and-other-type-{id}': (id: 'literal' | number) => [
        'union',
        'literal-and-other-type',
        id
    ],
    'literal-and-object-type-{id}': (
        id:
            | 'literal'
            | {
                  a: string;
              }
    ) => ['union', 'literal-and-object-type', id]
} as const;
const intersection = {
    def: ['intersection'],
    '{id}': (
        id: {
            a: string;
        } & {
            b: number;
        }
    ) => ['intersection', id],
    'literal-and-object-type-{id}': (
        id: {
            a: string;
        } & {
            b: number;
        } & {
            c: 'literal';
        } & {
            d: {
                e: string;
            };
        }
    ) => ['intersection', 'literal-and-object-type', id],
    'literal-{id}': (
        id: {
            a: string;
        } & {
            b: number;
        } & {
            c: 'literal';
        }
    ) => ['intersection', 'literal', id]
} as const;
const unknownType = {
    def: ['unknownType'],
    '{id}': (id: unknown) => ['unknownType', id]
} as const;
const voidType = {
    def: ['voidType'],
    '{id}': (id: void) => ['voidType', id]
} as const;
const neverType = {
    def: ['neverType'],
    '{id}': (id: never) => ['neverType', id]
} as const;
const tuple = {
    def: ['tuple'],
    '{id}': (
        id: [
            string,
            number,
            boolean,
            undefined,
            null,
            'literal',
            {
                a: string;
            },
            {
                b: number;
            }
        ]
    ) => ['tuple', id]
} as const;
const array = {
    def: ['array'],
    '{id}-{id2}': (id: string[], id2: number[]) => ['array', id, id2],
    'union-{data}': (data: { id: (string | number)[] }) => ['array', 'union', data],
    'union-literal-{data}': (data: {
        id: ({
            a: string;
        } & number)[];
    }) => ['array', 'union', 'literal', data],
    'intersection-{data}': (data: { id: (string & number)[] }) => ['array', 'intersection', data]
} as const;
const record = {
    def: ['record'],
    '{data}': (data: { id: Record<string, number> }) => ['record', data],
    'literal-{data}': (data: { id: Record<string, 'literal'> }) => ['record', 'literal', data],
    'literal-other-type-{data}': (data: { id: Record<string, 'literal' | number> }) => [
        'record',
        'literal',
        'other-type',
        data
    ]
} as const;
export const globalQueryKeys = {
    primitive,
    union,
    intersection,
    unknownType,
    voidType,
    neverType,
    tuple,
    array,
    record
} as const;
