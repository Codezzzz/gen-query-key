import type { Edge } from '@xyflow/react';
import { useCallback } from 'react';
import { NodeTypes, type INode, type QueryKeyUsedInfo } from '../types';
import { createGroupByQueryKeyName } from '../utils';

const createId = (key: string, name: string) => {
    return `${key}-${name}`;
};

const createFuncId = (key: string, item: QueryKeyUsedInfo) => {
    const { func } = item;
    return `${key}-${item.sourceFile.name}-${func.name}-func-${func.pos}-${func.end}`;
};

const useCreateNode = () => {
    const createNodes = useCallback((queryInfo: QueryKeyUsedInfo[]) => {
        const groupByQueryKeyName = createGroupByQueryKeyName(queryInfo);

        const queryKeyNodes = Object.entries(groupByQueryKeyName).map(
            ([key, value], groupIndex) => {
                const prevGroupLength = Object.values(groupByQueryKeyName)
                    .slice(0, groupIndex)
                    .reduce((acc, item) => acc + item.length, 0);

                const groupGap = prevGroupLength * 300;

                const queryKeyNode = {
                    id: key,
                    type: NodeTypes.QueryKey,
                    data: { name: key },
                    position: { x: 0, y: groupGap }
                };

                const sourceFileNodes = value
                    .filter(
                        (item, index, self) =>
                            self.findIndex(t => t.sourceFile.name === item.sourceFile.name) ===
                            index
                    )
                    .map((item, index) => {
                        const { sourceFile } = item;
                        return {
                            id: createId(key, sourceFile.name),
                            type: NodeTypes.SourceFile,
                            data: { name: sourceFile.name },
                            position: { x: 1000, y: index * 300 + groupGap }
                        };
                    });

                const funcNodes = value.map((item, index) => {
                    const { func } = item;
                    return {
                        id: createFuncId(key, item),
                        type: NodeTypes.Func,
                        data: { name: func.name },
                        position: { x: 1500, y: index * 300 + groupGap }
                    };
                });

                const queryKeyToSourceEdges = value.map(item => {
                    const targetId = createId(key, item.sourceFile.name);
                    const edgeId = targetId + +item.func.pos;
                    return {
                        id: edgeId,
                        source: key,
                        target: targetId
                    };
                }) satisfies Edge[];

                const sourceToFuncEdges = value.map(item => {
                    const targetId = createFuncId(key, item);
                    const edgeId = targetId;
                    const sourceId = createId(key, item.sourceFile.name);
                    return {
                        id: edgeId,
                        source: sourceId,
                        target: targetId
                    };
                }) satisfies Edge[];

                const mergedNodes = [queryKeyNode, ...sourceFileNodes, ...funcNodes];
                const mergedEdges = [...queryKeyToSourceEdges, ...sourceToFuncEdges];

                return {
                    mergedNodes,
                    mergedEdges
                };
            }
        );

        const groupNodes = queryKeyNodes.flatMap(item => item.mergedNodes) satisfies INode[];
        const groupEdges = queryKeyNodes.flatMap(item => item.mergedEdges) satisfies Edge[];

        return {
            groupNodes,
            groupEdges
        };
    }, []);

    return { createNodes };
};

export { useCreateNode };
