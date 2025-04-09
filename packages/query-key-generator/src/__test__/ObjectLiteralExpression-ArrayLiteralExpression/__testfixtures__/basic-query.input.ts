import { useInfiniteQuery, useQueries, useQuery, useSuspenseQuery } from '@tanstack/react-query';

export function useUserQuery() {
    useQuery({
        queryKey: ['user']
    });
}

export function useUserDetailQuery() {
    useQuery({
        queryKey: ['user', 'detail']
    });
}

export function usePostQuery() {
    useQuery({
        queryKey: ['post']
    });
}

export function usePostDetailQuery() {
    useQuery({
        queryKey: ['post', 'detail']
    });
}

/// useSuspenseQuery

export function useUserSuspenseQuery() {
    useSuspenseQuery({
        queryKey: ['user', 'suspense']
    });
}

export function usePostSuspenseQuery() {
    useSuspenseQuery({
        queryKey: ['post', 'suspense']
    });
}

// useQueries

export function usePostAndPostByIdQuery() {
    useQueries({
        queries: [{ queryKey: ['user', 'queries'] }, { queryKey: ['post', 'queries'] }]
    });
}

// useInfiniteQuery

export function useUserInfiniteQuery() {
    useInfiniteQuery({
        queryKey: ['user', 'infinite'],
        initialPageParam: 0,
        getNextPageParam: () => {
            return 0;
        }
    });
}

export function usePostInfiniteQuery() {
    useInfiniteQuery({
        queryKey: ['post', 'infinite'],
        initialPageParam: 0,
        getNextPageParam: () => {
            return 0;
        }
    });
}
