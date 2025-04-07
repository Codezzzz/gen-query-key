const user = {
    def: ['user'],
    '{id}': (id: number) => ['user', id],
    'list-{paging}': (paging: { page: number; size: 0 }) => ['user', 'list', paging],
    'infinite-{paging}': (paging: { page: number; size: 0 }) => ['user', 'infinite', paging],
    suspense: ['user', 'suspense'],
    'query-option-list': ['user', 'query-option', 'list']
} as const;
const post = {
    def: ['post'],
    '{id}': (id: number) => ['post', id]
} as const;
const bankList = {
    def: ['bankList'],
    '{id}': (id: string) => ['bankList', id]
} as const;
export const globalQueryKeys = {
    user,
    post,
    bankList
} as const;
