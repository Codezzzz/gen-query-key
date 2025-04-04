import { QueryKeyUsedViewer } from '@query-key/used-viewer/test';
import '@query-key/used-viewer/style.css';

import { createRoot } from 'react-dom/client';
import App from './App';
import { queryKeyUsedInfo } from './query-key-used-info';

createRoot(document.getElementById('root')!).render(
    <>
        <App />
        <QueryKeyUsedViewer
            initialOpen={true}
            getInfo={() => {
                return queryKeyUsedInfo;
            }}
        />
    </>
);
