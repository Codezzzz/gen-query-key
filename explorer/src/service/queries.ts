import {
    queryOptions,
    useInfiniteQuery,
    useQueries,
    useQuery,
    useSuspenseQuery
} from '@tanstack/react-query';

export function useUserQuery() {
    useQuery({
        queryKey: ['user']
    });
}
export function useUserByIdQuery(id: number) {
    useQuery({
        queryKey: ['user', id]
    });
}

export function useUserListQuery(paging: { page: number; size: 0 }) {
    useQuery({
        queryKey: ['user', 'list', paging]
    });
}

export function usePostAndPostByIdQuery(id: number) {
    useQueries({
        queries: [
            {
                queryKey: ['post'],
                queryFn: () => {
                    return Promise.resolve([]);
                }
            },
            {
                queryKey: ['post', id],
                queryFn: () => {
                    return Promise.resolve([]);
                }
            }
        ]
    });
}

export function useUserInfiniteQuery(paging: { page: number; size: 0 }) {
    useInfiniteQuery({
        queryKey: ['user', 'infinite', paging],
        queryFn: () => {
            return Promise.resolve([]);
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, pages) => {
            return lastPage.length > 0 ? pages.length + 1 : undefined;
        }
    });
}

export function useUserSuspenseQuery() {
    useSuspenseQuery({
        queryKey: ['user', 'suspense']
    });
}

const userListQueryOptions = queryOptions({
    queryKey: ['user', 'query-option', 'list'],
    queryFn: () => {
        return Promise.resolve([]);
    }
});

export function useUserListByQueryOptions() {
    useQuery(userListQueryOptions);
}

const keys = {
    default: 'bank',
    bankList: (id: string) => [keys.default, 'bankList', id]
};

export const bankListQueryService = {
    queryKey: (id: string) => {
        return keys.bankList(id);
    },
    queryOptions: (id: string) => ({
        queryKey: bankListQueryService.queryKey(id),
        queryFn: () => {
            return Promise.resolve([]);
        }
    })
};
export function useGetBankListQuery() {
    return useQuery(bankListQueryService.queryOptions('1'));
}
