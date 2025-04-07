# 🔍 Query Key Used Generator

Vite plugin that scans your project and tracks where `queryKey` values from `globalQueryKeys` are used — useful for dead query analysis, usage stats, or documentation.

> 📦 Compatible with [`@query-key-gen/generator`](https://npmjs.com/package/@query-key-gen/generator)  
> 🛠 Designed for use with [React Query](https://tanstack.com/query)

---

## 🚀 1. Installation

```bash
pnpm add @query-key-gen/used-generator
```

---

## ⚙️ 2. Setup

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import QueryKeyUsedPlugin from '@query-key-gen/used-generator';

export default defineConfig({
    plugins: [react(), QueryKeyUsedPlugin()]
});
```

---

## 📘 Configuration Guide

All options are **optional**. If not specified, default values will be used.

| Option               | Type       | Default                               | Required | Description                                                       |
| -------------------- | ---------- | ------------------------------------- | -------- | ----------------------------------------------------------------- |
| `output`             | `string`   | `'./src/query-key-used-info.ts'`      | ❌       | Path to the file where usage info will be written                 |
| `globalQueryKeyName` | `string`   | `'globalQueryKeys'`                   | ❌       | The variable name of the generated global query key object        |
| `ignoreFiles`        | `string[]` | `['.d.ts', 'query-key-used-info.ts']` | ❌       | Files to exclude from analysis (e.g., generated files, type defs) |

---

## ⚠️ Caution: Using with `@query-key-gen/generator`

If you're using [`@query-key-gen/generator`](https://npmjs.com/package/@query-key-gen/generator) together with this plugin, **make sure to exclude its output file** in the `ignoreFiles` array to prevent circular analysis or unnecessary tracking.

### ✅ Example

```ts
// @query-key-gen/generator output path add
QueryKeyUsedPlugin({
    ignoreFiles: ['./src/queryKeys.ts']
});
```

---

## 🛠 Full Example

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import QueryKeyUsedPlugin from '@query-key-gen/used-generator';

export default defineConfig({
    plugins: [
        react(),
        QueryKeyUsedPlugin({
            output: './src/query-key-used-info.ts',
            globalQueryKeyName: 'globalQueryKeys',
            ignoreFiles: ['**/test/**', 'legacy.ts', './src/queryKeys.ts']
        })
    ]
});
```

---

## 📄 Generated Output Format

The plugin will generate a file like `query-key-used-info.ts` containing an array of usage entries:

```ts
interface QueryKeyUsedInfo {
    sourceFile: {
        name: string;
    };
    ['query-key']: {
        name: string;
        pos: number;
        end: number;
    };
    func: {
        name: string;
        pos: number;
        end: number;
    };
}

export const queryKeyUsedInfo: QueryKeyUsedInfo[] = [
    {
        sourceFile: { name: 'service/mutation.ts' },
        'query-key': { name: "globalQueryKeys.post['def']", pos: 384, end: 412 },
        func: { name: 'useExampleMutation', pos: 130, end: 436 }
    }
];
```

### 💡 Uses

- Analyze which `queryKey`s are actively used
- Clean up unused keys
- Visualize usage map of data dependencies
