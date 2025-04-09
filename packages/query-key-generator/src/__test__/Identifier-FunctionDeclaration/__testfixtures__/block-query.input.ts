import { useInfiniteQuery, useQueries, useQuery, useSuspenseQuery } from '@tanstack/react-query';

function userFactory() {
    return {
        queryKey: ['user'],
        queryFn: () => {}
    };
}

export function useUserQuery() {
    useQuery(userFactory());
}

function userDetailFactory() {
    return {
        queryKey: ['user', 'detail'],
        queryFn: () => {}
    };
}
export function useUserDetailQuery() {
    useQuery(userDetailFactory());
}

function postFactory() {
    return {
        queryKey: ['post'],
        queryFn: () => {}
    };
}
export function usePostQuery() {
    useQuery(postFactory());
}

function postDetailFactory() {
    return {
        queryKey: ['post', 'detail'],
        queryFn: () => {}
    };
}
export function usePostDetailQuery() {
    useQuery(postDetailFactory());
}

/// useSuspenseQuery

function userSuspenseFactory() {
    return {
        queryKey: ['user', 'suspense'],
        queryFn: () => {}
    };
}
export function useUserSuspenseQuery() {
    useSuspenseQuery(userSuspenseFactory());
}

function postSuspenseFactory() {
    return {
        queryKey: ['post', 'suspense'],
        queryFn: () => {}
    };
}
export function usePostSuspenseQuery() {
    useSuspenseQuery(postSuspenseFactory());
}

// useQueries

function userQueriesFactory() {
    return {
        queryKey: ['user', 'queries'],
        queryFn: () => {}
    };
}
function postQueriesFactory() {
    return {
        queryKey: ['post', 'queries'],
        queryFn: () => {}
    };
}
export function usePostAndPostByIdQuery() {
    useQueries({
        queries: [userQueriesFactory(), postQueriesFactory()]
    });
}

// useInfiniteQuery

function userInfiniteFactory() {
    return {
        queryKey: ['user', 'infinite'],
        initialPageParam: 0,
        getNextPageParam: () => {
            return 0;
        }
    };
}

export function useUserInfiniteQuery() {
    useInfiniteQuery(userInfiniteFactory());
}

function postInfiniteFactory() {
    return {
        queryKey: ['post', 'infinite'],
        initialPageParam: 0,
        getNextPageParam: () => {
            return 0;
        }
    };
}
export function usePostInfiniteQuery() {
    useInfiniteQuery(postInfiniteFactory());
}
