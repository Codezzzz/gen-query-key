import {
    Background,
    Controls,
    MiniMap,
    ReactFlow,
    ReactFlowProvider,
    useEdgesState,
    useNodesState,
    useReactFlow,
    type Edge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { FuncNode, QueryKeyNode, SourceFileNode } from './components/Node';
import { useCreateNode } from './hooks/useCreateNode';
import { useInitialize } from './hooks/useInitialize';
import { type INode, type QueryKeyUsedInfo } from './types';

/**
 *
 * @param initialOpen - whether the viewer is open
 * @param importFunc - a function that imports the query key used info
 * @example
 * <QueryKeyUsedViewer
 *     initialOpen={true}
 *     importFunc={() => import('./query-key-used-info')}
 * />
 * @returns
 */
const QueryKeyUsedViewer = ({
    initialOpen = false,
    getInfo
}: {
    initialOpen?: boolean;
    getInfo: () => QueryKeyUsedInfo[];
}) => {
    const { isInit } = useInitialize();
    const [open, setOpen] = useState(initialOpen);
    const [queryInfo, setQueryInfo] = useState<QueryKeyUsedInfo[]>([]);

    useEffect(() => {
        if (!open || !isInit) return;
        const dynamicQueryImport = () => {
            const queryKeyUsedInfo = getInfo();
            setQueryInfo(queryKeyUsedInfo);
        };

        const interval = setInterval(() => {
            dynamicQueryImport();
        }, 1000);

        dynamicQueryImport();

        return () => clearInterval(interval);
    }, [open, isInit]);

    if (!isInit) {
        return null;
    }

    return (
        <>
            {createPortal(
                <ReactFlowProvider>
                    <div
                        style={{
                            position: 'fixed',
                            bottom: 50,
                            right: 100,
                            zIndex: 1000
                        }}
                    >
                        <button onClick={() => setOpen(!open)}>
                            QueryKeyUsedViewer {open ? 'open' : 'close'}
                        </button>
                    </div>
                    {open && <Viewer queryInfo={queryInfo} />}
                </ReactFlowProvider>,
                document.getElementById('query-key-used-viewer-root')!
            )}
        </>
    );
};

const Viewer = ({ queryInfo }: { queryInfo: QueryKeyUsedInfo[] }) => {
    const { createNodes } = useCreateNode();
    const { fitView } = useReactFlow();

    const [nodes, setNodes, onNodesChange] = useNodesState([] as INode[]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[]);

    const setNodesAndEdges = useCallback(
        (queryInfo: QueryKeyUsedInfo[]) => {
            const { groupNodes, groupEdges } = createNodes(queryInfo);
            setNodes(groupNodes);
            setEdges(groupEdges);
            fitView();
        },
        [createNodes, fitView, setEdges, setNodes]
    );

    useEffect(() => {
        setNodesAndEdges(queryInfo);
    }, [createNodes, queryInfo, setEdges, setNodes, setNodesAndEdges]);

    const handleQueryKeyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const queryKeyName = e.target.value;
        const nextQueryInfo =
            queryKeyName === 'reset'
                ? queryInfo
                : queryInfo.filter(item => item['query-key'].name === queryKeyName);
        setNodesAndEdges(nextQueryInfo);
    };

    const uniqueName = (queryInfo: QueryKeyUsedInfo[]) => {
        return queryInfo.filter(
            (item, index, self) =>
                self.findIndex(t => t['query-key'].name === item['query-key'].name) === index
        );
    };

    const queryInfoUniqueByQueryKeyName = useMemo(() => {
        return uniqueName(queryInfo).map(item => item['query-key'].name);
    }, [queryInfo]);

    return (
        <div
            style={{
                width: '100vw',
                height: '100vh'
            }}
        >
            <select
                onChange={handleQueryKeyChange}
                style={{
                    marginLeft: 10,
                    marginTop: 10,
                    height: 30,
                    width: 200,
                    outline: 'none',
                    borderRadius: 5,
                    paddingLeft: 10,
                    fontSize: 14,
                    color: '#333'
                }}
            >
                <option defaultChecked value="reset">
                    Select queryKey
                </option>
                {queryInfoUniqueByQueryKeyName.map(item => (
                    <option key={item} value={item}>
                        {item}
                    </option>
                ))}
            </select>

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                fitView
                nodeTypes={{
                    'query-key': QueryKeyNode,
                    'source-file': SourceFileNode,
                    func: FuncNode
                }}
            />
            <Controls />
            <MiniMap nodeStrokeWidth={1} position="bottom-left" style={{ marginLeft: 50 }} />
            <Background />
        </div>
    );
};

export default QueryKeyUsedViewer;
