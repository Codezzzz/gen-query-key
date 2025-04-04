import { useLayoutEffect, useState } from 'react';

const useInitialize = () => {
    const [isInit, setIsInit] = useState(false);
    useLayoutEffect(() => {
        const root = document.body;
        const queryKeyUsedViewerRoot = document.getElementById('query-key-used-viewer-root');
        if (root && !queryKeyUsedViewerRoot) {
            const queryKeyUsedViewerRoot = document.createElement('div');
            queryKeyUsedViewerRoot.id = 'query-key-used-viewer-root';
            queryKeyUsedViewerRoot.style.position = 'fixed';
            queryKeyUsedViewerRoot.style.top = '0';
            queryKeyUsedViewerRoot.style.left = '0';
            queryKeyUsedViewerRoot.style.backgroundColor = 'white';
            root.appendChild(queryKeyUsedViewerRoot);
        }

        setIsInit(true);
    }, []);

    return { isInit };
};

export { useInitialize };
