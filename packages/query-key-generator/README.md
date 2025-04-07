# <p align="center">Query key generator</p>

<p align="center">
  <a href="https://npmjs.com/package/@query-key-gen/generator"><img src="https://img.shields.io/npm/v/@query-key-gen/generator.svg"/></a>
  <a href="https://npmjs.com/package/@query-key-gen/generator"><img src="https://img.shields.io/npm/l/@query-key-gen/generator.svg?color=blue"/></a>
</p>

<p align="center">
  <a href="https://npmjs.com/package/@query-key-gen/generator"><img src="https://img.shields.io/npm/dm/generouted.svg"/></a>
  <a href="https://npmjs.com/package/@query-key-gen/generator"><img src="https://img.shields.io/npm/dt/@query-key-gen/generator.svg"/></a>
</p>
<br>

<br>

Generated for [Vite](https://vitejs.dev)

### 1. Installation

```shell
pnpm add @query-key-gen/generator
```

### 2. Setup

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import QueryKeyGeneratorPlugin from '@query-key-gen/generator';

export default defineConfig({ plugins: [react(), QueryKeyGeneratorPlugin()] });
```

#### 📘 Query Key Generator – Configuration Guide

`@query-key-gen/generator` is a Vite plugin that automatically generates `queryKey` definitions by scanning your project files. You can customize the behavior of the plugin through its configuration options.

---

#### 🔧 Configuration Options

All options are **optional**. If not specified, default values will be used.

| Option               | Type       | Default                               | Required | Description                                                            |
| -------------------- | ---------- | ------------------------------------- | -------- | ---------------------------------------------------------------------- |
| `output`             | `string`   | `'./src/queryKeys.ts'`                | ❌       | Path to the output file where generated query keys will be written.    |
| `globalQueryKeyName` | `string`   | `'globalQueryKeys'`                   | ❌       | Name of the global query key object exported from the generated file.  |
| `separator`          | `string`   | `'-'`                                 | ❌       | Separator used when building query key strings. E.g., `user-detail`.   |
| `ignoreFiles`        | `string[]` | `['.d.ts', 'query-key-used-info.ts']` | ❌       | List of file names or extensions to exclude from query key generation. |
| `factoryPrefix`      | `string`   | `''`                                  | ❌       | Prefix for generated factory function names (e.g., userQueryKey`).     |

---

#### 🛠 Example

```ts
// vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import QueryKeyGeneratorPlugin from '@query-key-gen/generator';

export default defineConfig({
    plugins: [
        react(),
        QueryKeyGeneratorPlugin({
            output: './src/utils/queryKeys.ts',
            globalQueryKeyName: 'queryKeys',
            separator: '_',
            ignoreFiles: ['**/test/**', 'legacy.ts'],
            factoryPrefix: 'QueryKey'
        })
    ]
});
```

### 3 ⚙️ How Query Keys Are Generated

When you use 'useQuery','useSuspenseQuery','useInfiniteQuery','useQueries', 'useSuspenseQueries' and provide a `queryKey` directly in your code, the plugin will statically analyze it and automatically generate a corresponding query key factory in your output file.

### 🔍 Example: Source Code

```ts
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
        queryKey: ['user', 'suspense']
    });
}
```

#### /src/queryKeys.ts

```ts
const user = {
    def: ['user'],
    '{id}': (id: number) => ['user', id],
    'list-{paging}': (paging: { page: number; size: 0 }) => ['user', 'list', paging],
    'infinite-{paging}': (paging: { page: number; size: 0 }) => ['user', 'infinite', paging],
    suspense: ['user', 'suspense']
} as const;

const post = {
    def: ['post'],
    '{id}': (id: number) => ['post', id]
} as const;

export const globalQueryKeys = {
    user,
    post
} as const;
```

### 3. ♻️ Using `globalQueryKeys` with `queryClient.invalidateQueries`

Using globalQueryKeys with React Query’s queryClient.invalidateQueries() allows you to invalidate cache in a type-safe and typo-proof way using strongly typed query keys.

---

```ts
import { useQueryClient } from '@tanstack/react-query';
import { globalQueryKeys } from '@/queryKeys'; // generated file

const queryClient = useQueryClient();

queryClient.invalidateQueries({
    queryKey: globalQueryKeys.user.def
});
```
