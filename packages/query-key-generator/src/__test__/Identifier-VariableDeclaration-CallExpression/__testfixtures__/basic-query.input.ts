import {
    infiniteQueryOptions,
    queryOptions,
    useInfiniteQuery,
    useQueries,
    useQuery,
    useSuspenseQuery
} from '@tanstack/react-query';

const userFactory = queryOptions({
    queryKey: ['user']
});

export function useUserQuery() {
    useQuery(userFactory);
}

const userDetailFactory = queryOptions({
    queryKey: ['user', 'detail']
});
export function useUserDetailQuery() {
    useQuery(userDetailFactory);
}

const postFactory = queryOptions({
    queryKey: ['post']
});
export function usePostQuery() {
    useQuery(postFactory);
}

const postDetailFactory = queryOptions({
    queryKey: ['post', 'detail']
});
export function usePostDetailQuery() {
    useQuery(postDetailFactory);
}

/// useSuspenseQuery

const userSuspenseFactory = queryOptions({
    queryKey: ['user', 'suspense']
});
export function useUserSuspenseQuery() {
    useSuspenseQuery(userSuspenseFactory);
}

const postSuspenseFactory = queryOptions({
    queryKey: ['post', 'suspense']
});
export function usePostSuspenseQuery() {
    useSuspenseQuery(postSuspenseFactory);
}

// useQueries

const userQueriesFactory = queryOptions({
    queryKey: ['user', 'queries']
});

const postQueriesFactory = queryOptions({
    queryKey: ['post', 'queries']
});

const queriesFactory = {
    queries: [userQueriesFactory, postQueriesFactory]
};

export function usePostAndPostByIdQuery() {
    useQueries(queriesFactory);
}

// useInfiniteQuery

const userInfiniteFactory = infiniteQueryOptions({
    queryKey: ['user', 'infinite'],
    initialPageParam: 0,
    getNextPageParam: () => {
        return 0;
    }
});

export function useUserInfiniteQuery() {
    useInfiniteQuery(userInfiniteFactory);
}

const postInfiniteFactory = infiniteQueryOptions({
    queryKey: ['post', 'infinite'],
    initialPageParam: 0,
    getNextPageParam: () => {
        return 0;
    }
});
export function usePostInfiniteQuery() {
    useInfiniteQuery(postInfiniteFactory);
}
