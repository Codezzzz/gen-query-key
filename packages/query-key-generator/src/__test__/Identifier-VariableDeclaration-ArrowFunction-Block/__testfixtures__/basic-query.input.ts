import { useInfiniteQuery, useQueries, useQuery, useSuspenseQuery } from '@tanstack/react-query';

const userFactory = () => {
    return {
        queryKey: ['user'],
        queryFn: () => {}
    };
};

export function useUserQuery() {
    useQuery(userFactory());
}

const userDetailFactory = () => {
    return {
        queryKey: ['user', 'detail'],
        queryFn: () => {}
    };
};
export function useUserDetailQuery() {
    useQuery(userDetailFactory());
}

const postFactory = () => {
    return {
        queryKey: ['post'],
        queryFn: () => {}
    };
};
export function usePostQuery() {
    useQuery(postFactory());
}

const postDetailFactory = () => {
    return {
        queryKey: ['post', 'detail'],
        queryFn: () => {}
    };
};
export function usePostDetailQuery() {
    useQuery(postDetailFactory());
}

/// useSuspenseQuery

const userSuspenseFactory = () => {
    return {
        queryKey: ['user', 'suspense'],
        queryFn: () => {}
    };
};
export function useUserSuspenseQuery() {
    useSuspenseQuery(userSuspenseFactory());
}

const postSuspenseFactory = () => {
    return {
        queryKey: ['post', 'suspense'],
        queryFn: () => {}
    };
};
export function usePostSuspenseQuery() {
    useSuspenseQuery(postSuspenseFactory());
}

// useQueries

const userQueriesFactory = () => {
    return {
        queryKey: ['user', 'queries'],
        queryFn: () => {}
    };
};
const postQueriesFactory = () => {
    return {
        queryKey: ['post', 'queries'],
        queryFn: () => {}
    };
};
export function usePostAndPostByIdQuery() {
    useQueries({
        queries: [userQueriesFactory(), postQueriesFactory()]
    });
}

// useInfiniteQuery

const userInfiniteFactory = () => {
    return {
        queryKey: ['user', 'infinite'],
        initialPageParam: 0,
        getNextPageParam: () => {
            return 0;
        }
    };
};

export function useUserInfiniteQuery() {
    useInfiniteQuery(userInfiniteFactory());
}

const postInfiniteFactory = () => {
    return {
        queryKey: ['post', 'infinite'],
        initialPageParam: 0,
        getNextPageParam: () => {
            return 0;
        }
    };
};
export function usePostInfiniteQuery() {
    useInfiniteQuery(postInfiniteFactory());
}
