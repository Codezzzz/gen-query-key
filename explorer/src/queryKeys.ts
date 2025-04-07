const user = {
    def: ['user'],
    '{id}': (id: number) => ['user', id],
    'list-{paging}': (paging: { page: number; size: 0 }) => ['user', 'list', paging],
    'infinite-{paging}': (paging: { page: number; size: 0 }) => ['user', 'infinite', paging],
    suspense: ['user', 'suspense']
} as const;

const post = {
    def: ['post'],
    '{id}': (id: number) => ['post', id]
} as const;

export const globalQueryKeys = {
    user,
    post
} as const;
