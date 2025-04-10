import { useQuery } from '@tanstack/react-query';

enum Test {
    A,
    B,
    C = 5,
    D
}

const est = {
    queryKey: (data: Test) => ['test', data]
};
export function useTest(data: Test) {
    useQuery({
        queryKey: est.queryKey(data)
    });
}
