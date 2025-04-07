# Query Key Used Viewer

A visual debug tool for inspecting where your `globalQueryKeys` are used in the app.  
Works alongside [`@query-key-gen/used-generator`](https://www.npmjs.com/package/@query-key-gen/used-generator).

---

## 🚀 Installation

```bash
pnpm add @query-key-gen/used-viewer
```

---

## 🧪 Requirements

- You must use [`@query-key-gen/used-generator`](https://www.npmjs.com/package/@query-key-gen/used-generator) to generate the `queryKeyUsedInfo` file.
- `getInfo` should return that generated array.

---

## ⚙️ Usage

Import and use the viewer inside your React app (e.g. in `main.tsx`):

```tsx
import { QueryKeyUsedViewer } from '@query-key-gen/used-viewer/test';
import '@query-key-gen/used-viewer/style.css';

import { createRoot } from 'react-dom/client';
import App from './App';
import { queryKeyUsedInfo } from './query-key-used-info';

createRoot(document.getElementById('root')!).render(
    <>
        <App />
        <QueryKeyUsedViewer initialOpen={true} getInfo={() => queryKeyUsedInfo} />
    </>
);
```

---

## 🔧 Props

| Prop          | Type                       | Description                                                                        |
| ------------- | -------------------------- | ---------------------------------------------------------------------------------- |
| `initialOpen` | `boolean`                  | Whether the viewer should be open by default                                       |
| `getInfo`     | `() => QueryKeyUsedInfo[]` | A function that returns the array of `queryKeyUsedInfo` collected by the generator |

---

## 🎯 Use Cases

- 🔍 Inspect which query keys are used where
- 🧹 Clean up unused `queryKeys`
- 📊 Debug React Query integration visually
- 🧠 Improve visibility into query usage

---

## 📦 File Structure Example

```
src/
├── App.tsx
├── main.tsx
├── query-key-used-info.ts  ← auto-generated
└── ...
```

![img]("./assets/example.png")
