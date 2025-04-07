import { useInfiniteQuery, useQueries, useQuery, useSuspenseQuery } from '@tanstack/react-query';

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
        queryKey: ['user', 'suspense'],
        queryFn: () => {
            return Promise.resolve([]);
        }
    });
}
// export function useExampleQueryWithId(id: string) {
//     useQuery({
//         queryKey: ['example', id],
//         queryFn: () => {
//             return Promise.resolve([]);
//         }
//     });
// }

// export function useExampleDetailQuery() {
//     useQuery({
//         queryKey: ['example', 'detail'],
//         queryFn: () => {
//             return Promise.resolve([]);
//         }
//     });
// }

// export function useExampleDetailByIdQuery(id: string) {
//     useQuery({
//         queryKey: ['example', 'detail', id],
//         queryFn: () => {
//             return Promise.resolve([]);
//         }
//     });
// }

// export function useExampleFilterQuery(filter: { page: number; limit: number }) {
//     useQuery({
//         queryKey: ['example', filter],
//         queryFn: () => {
//             return Promise.resolve([]);
//         }
//     });
// }

// const exampleQueryOptions = queryOptions({
//     queryKey: ['example', 'options'],
//     queryFn: () => {
//         return Promise.resolve([]);
//     }
// });

// export function useExampleQueryWithOptions() {
//     useQuery(exampleQueryOptions);
// }

// const exampleQueryOptionsWithId = (id: string) =>
//     queryOptions({
//         queryKey: ['example', id, 'options'],
//         queryFn: () => {
//             return Promise.resolve([]);
//         }
//     });

// export function useExampleQueryWithIdAndOptions(id: string) {
//     useQuery(exampleQueryOptionsWithId(id));
// }
// const exampleQueryService = {
//     queryOptions: () => {
//         return queryOptions({
//             queryKey: ['example', 'options'],
//             queryFn: () => {
//                 return Promise.resolve([]);
//             }
//         });
//     }
// };
// export function useExampleQueryWithService() {
//     useQuery(exampleQueryService.queryOptions());
// }

// 커링
// const createQueryKey =
//     (baseKey: string) =>
//     (...args: (string | number | object)[]) => {
//         return [baseKey, ...args];
//     };

// // 사용 예
// const userKey = createQueryKey('user');
// const postKey = createQueryKey('post');

// export function usePostQuery() {
//     useQuery({
//         queryKey: postKey('456') // ['post', '456']
//     });
// }

// function useUserQuery() {
//     useQuery({
//         queryKey: userKey('123', 'profile') // ['user', '123', 'profile']
//     });
// }

// class
// function createQueryResource(baseKey: string, fetcher: (...args: any[]) => Promise<any>) {
//     return (...args: any[]) => ({
//         queryKey: [baseKey, ...args],
//         queryFn: () => fetcher(...args)
//     });
// }

// // 사용 예
// const userDetailQuery = createQueryResource('user', (id: string) => fetchUserDetail(id));

// function useUserDetailQuery() {
//     useQuery(userDetailQuery('123'));
// }
