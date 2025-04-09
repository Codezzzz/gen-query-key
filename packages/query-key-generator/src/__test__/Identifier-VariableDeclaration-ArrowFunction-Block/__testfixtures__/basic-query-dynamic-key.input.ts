import { useInfiniteQuery, useQueries, useQuery, useSuspenseQuery } from '@tanstack/react-query';

const userFactory = (id: string) => {
    return {
        queryKey: ['user', id],
        queryFn: () => {}
    };
};

export function useUserQuery(id: string) {
    useQuery(userFactory(id));
}

const userDetailFactory = (id: string) => {
    return {
        queryKey: ['user', 'detail', id],
        queryFn: () => {}
    };
};
export function useUserDetailQuery(id: string) {
    useQuery(userDetailFactory(id));
}

const postFactory = (id: string) => {
    return {
        queryKey: ['post', id],
        queryFn: () => {}
    };
};
export function usePostQuery(id: string) {
    useQuery(postFactory(id));
}

const postDetailFactory = (id: string) => {
    return {
        queryKey: ['post', 'detail', id],
        queryFn: () => {}
    };
};
export function usePostDetailQuery(id: string) {
    useQuery(postDetailFactory(id));
}

/// useSuspenseQuery

const userSuspenseFactory = (id: string) => {
    return {
        queryKey: ['user', 'suspense', id],
        queryFn: () => {}
    };
};
export function useUserSuspenseQuery(id: string) {
    useSuspenseQuery(userSuspenseFactory(id));
}

const postSuspenseFactory = (id: string) => {
    return {
        queryKey: ['post', 'suspense', id],
        queryFn: () => {}
    };
};
export function usePostSuspenseQuery(id: string) {
    useSuspenseQuery(postSuspenseFactory(id));
}

// useQueries

const userQueriesFactory = (id: string) => {
    return {
        queryKey: ['user', 'queries', id],
        queryFn: () => {}
    };
};
const postQueriesFactory = (id: string) => {
    return {
        queryKey: ['post', 'queries', id],
        queryFn: () => {}
    };
};
export function usePostAndPostByIdQuery(id: string) {
    useQueries({
        queries: [userQueriesFactory(id), postQueriesFactory(id)]
    });
}

// useInfiniteQuery

const userInfiniteFactory = (id: string) => {
    return {
        queryKey: ['user', 'infinite', id],
        initialPageParam: 0,
        getNextPageParam: () => {
            return 0;
        }
    };
};

export function useUserInfiniteQuery(id: string) {
    useInfiniteQuery(userInfiniteFactory(id));
}

const postInfiniteFactory = (id: string) => {
    return {
        queryKey: ['post', 'infinite', id],
        initialPageParam: 0,
        getNextPageParam: () => {
            return 0;
        }
    };
};
export function usePostInfiniteQuery(id: string) {
    useInfiniteQuery(postInfiniteFactory(id));
}
