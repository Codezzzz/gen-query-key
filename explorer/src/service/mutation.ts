import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useExampleMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => {
            return Promise.resolve();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({});
        }
    });
};
