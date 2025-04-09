const user = {
    def: ['user'],
    detail: ['user', 'detail'],
    suspense: ['user', 'suspense'],
    queries: ['user', 'queries'],
    infinite: ['user', 'infinite']
} as const;
const post = {
    def: ['post'],
    detail: ['post', 'detail'],
    suspense: ['post', 'suspense'],
    queries: ['post', 'queries'],
    infinite: ['post', 'infinite']
} as const;
export const globalQueryKeys = {
    user,
    post
} as const;
