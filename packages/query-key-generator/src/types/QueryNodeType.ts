import ts from 'typescript';

export type IQueryNodeSymbol = ts.Symbol;

export type IQueryNodeStringLiteral = ts.StringLiteral;

export type IQueryNodeTSType = ts.Type;

export const QueryNodeKind = {
    StringLiteral: 'StringLiteral',
    Symbol: 'Symbol',
    EnumMember: 'EnumMember',
    TypeOfKeyword: 'TypeOfKeyword'
};

type IQueryNodeKind = keyof typeof QueryNodeKind;

export type IQueryNodeType = {
    name: string;
    kind: IQueryNodeKind;
    type: IQueryNodeSymbol | IQueryNodeStringLiteral | IQueryNodeTSType;
    symbol?: IQueryNodeSymbol;
};
