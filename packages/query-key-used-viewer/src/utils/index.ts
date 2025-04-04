import type { QueryKeyUsedInfo } from '../types';

const createGroupByQueryKeyName = (queryInfo: QueryKeyUsedInfo[]) => {
    return queryInfo.reduce(
        (acc, item) => {
            const { 'query-key': queryKey } = item;
            acc[queryKey.name] = [...(acc[queryKey.name] || []), item];
            return acc;
        },
        {} as Record<string, QueryKeyUsedInfo[]>
    );
};

export { createGroupByQueryKeyName };
