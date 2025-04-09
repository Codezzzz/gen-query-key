const user = {
    def: ['user'],
    '{id}': (id: string) => ['user', id],
    'detail-{id}': (id: string) => ['user', 'detail', id],
    'suspense-{id}': (id: string) => ['user', 'suspense', id],
    'queries-{id}': (id: string) => ['user', 'queries', id],
    'infinite-{id}': (id: string) => ['user', 'infinite', id]
} as const;
const post = {
    def: ['post'],
    '{id}': (id: string) => ['post', id],
    'detail-{id}': (id: string) => ['post', 'detail', id],
    'suspense-{id}': (id: string) => ['post', 'suspense', id],
    'queries-{id}': (id: string) => ['post', 'queries', id],
    'infinite-{id}': (id: string) => ['post', 'infinite', id]
} as const;
export const globalQueryKeys = {
    user,
    post
} as const;
