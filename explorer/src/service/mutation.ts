import { useMutation, useQueryClient } from '@tanstack/react-query';
import { globalQueryKeys } from '../queryKeys';

export const useExampleMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => {
            return Promise.resolve();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: globalQueryKeys.post['def'] });
        }
    });
};
