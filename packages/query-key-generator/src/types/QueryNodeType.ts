import ts from 'typescript';

export type IQueryNodeSymbol = ts.Symbol;

export type IQueryNodeStringLiteral = ts.StringLiteral;

export type IQueryNodeTSType = ts.Type;

export type IQueryNodeTupleType = ts.TupleTypeNode;

export const QueryNodeKind = {
    StringLiteral: 'StringLiteral',
    Symbol: 'Symbol',
    EnumMember: 'EnumMember',
    TypeOfKeyword: 'TypeOfKeyword',
    Tuple: 'Tuple'
};

type IQueryNodeKind = keyof typeof QueryNodeKind;

export type IQueryNodeType = {
    name: string;
    kind: IQueryNodeKind;
    type: IQueryNodeSymbol | IQueryNodeStringLiteral | IQueryNodeTSType | IQueryNodeTupleType;
    symbol?: IQueryNodeSymbol;
};
