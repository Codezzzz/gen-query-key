import { useQuery } from '@tanstack/react-query';

export function useUserQuery() {
    useQuery({
        queryKey: ['user']
    });
}
