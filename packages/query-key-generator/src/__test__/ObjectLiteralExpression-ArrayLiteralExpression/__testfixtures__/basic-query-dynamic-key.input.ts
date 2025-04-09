import { useInfiniteQuery, useQueries, useQuery, useSuspenseQuery } from '@tanstack/react-query';

export function useUserByIdQuery(id: string) {
    useQuery({
        queryKey: ['user', id]
    });
}

export function usePostByIdQuery(id: string) {
    useQuery({
        queryKey: ['post', id]
    });
}

export function useUserListFilterQuery(filter: { page: number; limit: number }) {
    useQuery({
        queryKey: ['user', 'list', filter]
    });
}

/// useSuspenseQuery

export function useUserSuspenseQuery(id: string) {
    useSuspenseQuery({
        queryKey: ['user', 'suspense', id]
    });
}

export function usePostSuspenseQuery(id: string) {
    useSuspenseQuery({
        queryKey: ['post', 'suspense', id]
    });
}

// useQueries

export function usePostAndPostByIdQuery(id: string) {
    useQueries({
        queries: [{ queryKey: ['user', 'queries', id] }, { queryKey: ['post', 'queries', id] }]
    });
}

// useInfiniteQuery

export function useUserInfiniteQuery(id: string) {
    useInfiniteQuery({
        queryKey: ['user', 'infinite', id],
        initialPageParam: 0,
        getNextPageParam: () => {
            return 0;
        }
    });
}

export function usePostInfiniteQuery(id: string) {
    useInfiniteQuery({
        queryKey: ['post', 'infinite', id],
        initialPageParam: 0,
        getNextPageParam: () => {
            return 0;
        }
    });
}
