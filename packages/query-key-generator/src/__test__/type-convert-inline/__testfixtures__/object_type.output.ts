const primitive = {
    def: ['primitive'],
    'string-{data}': (data: { id: number }) => ['primitive', 'string', data],
    'number-{data}': (data: { id: number }) => ['primitive', 'number', data],
    'boolean-{data}': (data: { id: boolean }) => ['primitive', 'boolean', data],
    'undefined-{data}': (data: { id: undefined }) => ['primitive', 'undefined', data],
    'null-{data}': (data: { id: null }) => ['primitive', 'null', data],
    'literal-{data}': (data: { id: 'literal' }) => ['primitive', 'literal', data]
} as const;
const union = {
    def: ['union'],
    '{data}': (data: { id: string | number }) => ['union', data],
    'depth-{data}': (data: {
        id: {
            a: string | string;
        };
    }) => ['union', 'depth', data]
} as const;
const intersection = {
    def: ['intersection'],
    '{data}': (data: { id: string | number }) => ['intersection', data],
    'object-{data}': (data: {
        id: {
            a: string;
        } & {
            b: number;
        };
    }) => ['intersection', 'object', data],
    'literal-{data}': (data: {
        id: {
            a: string;
        } & {
            b: number;
        } & {
            c: 'literal';
        };
    }) => ['intersection', 'literal', data],
    'depth-{data}': (data: {
        id: {
            a: string & string;
            b: {
                c: string & string;
            };
        };
    }) => ['intersection', 'depth', data]
} as const;
const unknownType = {
    def: ['unknownType'],
    '{data}': (data: { id: unknown }) => ['unknownType', data]
} as const;
const voidType = {
    def: ['voidType'],
    '{data}': (data: { id: void }) => ['voidType', data]
} as const;
const neverType = {
    def: ['neverType'],
    '{data}': (data: { id: never }) => ['neverType', data]
} as const;
const tuple = {
    def: ['tuple'],
    '{data}': (data: {
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
        ];
    }) => ['tuple', data]
} as const;
const array = {
    def: ['array'],
    '{data}': (data: { id: string[] }) => ['array', data]
} as const;
const deepObject = {
    def: ['deepObject'],
    '{data}': (data: {
        id: {
            a: string;
            b: {
                c: string;
            };
        };
    }) => ['deepObject', data],
    'allType-{data}': (data: {
        id: {
            str: string;
            num: number;
            bool: boolean;
            nul: null;
            undef: undefined;
            literal: 'literal';
            union: string | number;
            intersection: {
                a: string;
            } & {
                b: number;
            };
            tuple: [string, number];
            nested: {
                arr: string[];
                obj: {
                    x: string;
                    y: number;
                };
                deep: {
                    very: {
                        deep: 'deep';
                    };
                };
            };
        };
    }) => ['deepObject', 'allType', data]
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
    deepObject
} as const;
