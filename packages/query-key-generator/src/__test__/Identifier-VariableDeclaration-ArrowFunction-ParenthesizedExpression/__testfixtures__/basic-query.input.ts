import { useInfiniteQuery, useQueries, useQuery, useSuspenseQuery } from '@tanstack/react-query';

const userFactory = () => ({
    queryKey: ['user'],
    queryFn: () => {}
});
export function useUserQuery() {
    useQuery(userFactory());
}

const userDetailFactory = () => ({
    queryKey: ['user', 'detail'],
    queryFn: () => {}
});
export function useUserDetailQuery() {
    useQuery(userDetailFactory());
}

const postFactory = () => ({
    queryKey: ['post'],
    queryFn: () => {}
});
export function usePostQuery() {
    useQuery(postFactory());
}

const postDetailFactory = () => ({
    queryKey: ['post', 'detail'],
    queryFn: () => {}
});
export function usePostDetailQuery() {
    useQuery(postDetailFactory());
}

/// useSuspenseQuery

const userSuspenseFactory = () => ({
    queryKey: ['user', 'suspense'],
    queryFn: () => {}
});
export function useUserSuspenseQuery() {
    useSuspenseQuery(userSuspenseFactory());
}

const postSuspenseFactory = () => ({
    queryKey: ['post', 'suspense'],
    queryFn: () => {}
});
export function usePostSuspenseQuery() {
    useSuspenseQuery(postSuspenseFactory());
}

// useQueries

const userQueriesFactory = () => ({
    queryKey: ['user', 'queries'],
    queryFn: () => {}
});
const postQueriesFactory = () => ({
    queryKey: ['post', 'queries'],
    queryFn: () => {}
});
export function usePostAndPostByIdQuery() {
    useQueries({
        queries: [userQueriesFactory(), postQueriesFactory()]
    });
}

// useInfiniteQuery

const userInfiniteFactory = () => ({
    queryKey: ['user', 'infinite'],
    initialPageParam: 0,
    getNextPageParam: () => {
        return 0;
    }
});

export function useUserInfiniteQuery() {
    useInfiniteQuery(userInfiniteFactory());
}

const postInfiniteFactory = () => ({
    queryKey: ['post', 'infinite'],
    initialPageParam: 0,
    getNextPageParam: () => {
        return 0;
    }
});
export function usePostInfiniteQuery() {
    useInfiniteQuery(postInfiniteFactory());
}
