import { Handle, Position } from '@xyflow/react';

const styles = {
    width: 'w-fit',
    height: '100px',
    backgroundColor: '#e0e0e0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    borderRadius: '10px'
};

function QueryKeyNode({ data }: { data: { name: string; id: string } }) {
    return (
        <div style={styles}>
            <div style={{ fontSize: '18px', fontFamily: 'Bold', color: '#000' }}>{data.name}</div>
            <Handle type="source" position={Position.Right} id={data.id} />
        </div>
    );
}

function SourceFileNode({ data }: { data: { name: string; id: string } }) {
    return (
        <div style={styles}>
            <div style={{ fontSize: '18px', fontFamily: 'Bold', color: '#000' }}>{data.name}</div>
            <Handle type="target" position={Position.Left} id={data.id} />
            <Handle type="source" position={Position.Right} id={data.id} />
        </div>
    );
}

function FuncNode({ data }: { data: { name: string; id: string } }) {
    return (
        <div style={styles}>
            <div style={{ fontSize: '18px', fontFamily: 'Bold', color: '#000' }}>{data.name}</div>
            <Handle type="target" position={Position.Left} id={data.id} />
        </div>
    );
}

export { QueryKeyNode, SourceFileNode, FuncNode };
