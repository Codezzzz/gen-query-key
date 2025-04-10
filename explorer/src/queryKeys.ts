const test = {
    def: ['test'],
    '{data}': (data: 0 | 1 | 5 | 6) => ['test', data]
} as const;
export const globalQueryKeys = {
    test
} as const;
