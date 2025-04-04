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

const NodeTypes = {
    QueryKey: 'query-key',
    SourceFile: 'source-file',
    Func: 'func'
} as const;

type INodeTypes = (typeof NodeTypes)[keyof typeof NodeTypes];

type INode = {
    id: string;
    type: INodeTypes;
    data: {
        name: string;
    };
    position: {
        x: number;
        y: number;
    };
};

export { NodeTypes };
export type { INode, INodeTypes, QueryKeyUsedInfo };
