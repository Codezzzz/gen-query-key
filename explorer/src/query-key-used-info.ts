interface QueryKeyUsedInfo {
    sourceFile: {
        name: string;
    };
    ['query-key']: {
        name: string;
        pos: number;
        end: number;
    };
    func: {
        name: string;
        pos: number;
        end: number;
    };
}

export const queryKeyUsedInfo: QueryKeyUsedInfo[] = [
    {
        sourceFile: { name: 'service/mutation.ts' },
        'query-key': { name: "globalQueryKeys.post['def']", pos: 384, end: 412 },
        func: { name: 'useExampleMutation', pos: 130, end: 436 }
    }
];
