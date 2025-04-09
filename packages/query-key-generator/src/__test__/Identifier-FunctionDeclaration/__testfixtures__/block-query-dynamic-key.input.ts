import { useInfiniteQuery, useQueries, useQuery, useSuspenseQuery } from '@tanstack/react-query';

function userFactory(id: string) {
    return {
        queryKey: ['user', id],
        queryFn: () => {}
    };
}

export function useUserQuery(id: string) {
    useQuery(userFactory(id));
}

function userDetailFactory(id: string) {
    return {
        queryKey: ['user', 'detail', id],
        queryFn: () => {}
    };
}
export function useUserDetailQuery(id: string) {
    useQuery(userDetailFactory(id));
}

function postFactory(id: string) {
    return {
        queryKey: ['post', id],
        queryFn: () => {}
    };
}
export function usePostQuery(id: string) {
    useQuery(postFactory(id));
}

function postDetailFactory(id: string) {
    return {
        queryKey: ['post', 'detail', id],
        queryFn: () => {}
    };
}
export function usePostDetailQuery(id: string) {
    useQuery(postDetailFactory(id));
}

/// useSuspenseQuery

function userSuspenseFactory(id: string) {
    return {
        queryKey: ['user', 'suspense', id],
        queryFn: () => {}
    };
}
export function useUserSuspenseQuery(id: string) {
    useSuspenseQuery(userSuspenseFactory(id));
}

function postSuspenseFactory(id: string) {
    return {
        queryKey: ['post', 'suspense', id],
        queryFn: () => {}
    };
}
export function usePostSuspenseQuery(id: string) {
    useSuspenseQuery(postSuspenseFactory(id));
}

// useQueries

function userQueriesFactory(id: string) {
    return {
        queryKey: ['user', 'queries', id],
        queryFn: () => {}
    };
}
function postQueriesFactory(id: string) {
    return {
        queryKey: ['post', 'queries', id],
        queryFn: () => {}
    };
}
export function usePostAndPostByIdQuery(id: string) {
    useQueries({
        queries: [userQueriesFactory(id), postQueriesFactory(id)]
    });
}

// useInfiniteQuery

function userInfiniteFactory(id: string) {
    return {
        queryKey: ['user', 'infinite', id],
        initialPageParam: 0,
        getNextPageParam: () => {
            return 0;
        }
    };
}

export function useUserInfiniteQuery(id: string) {
    useInfiniteQuery(userInfiniteFactory(id));
}

function postInfiniteFactory(id: string) {
    return {
        queryKey: ['post', 'infinite', id],
        initialPageParam: 0,
        getNextPageParam: () => {
            return 0;
        }
    };
}
export function usePostInfiniteQuery(id: string) {
    useInfiniteQuery(postInfiniteFactory(id));
}
