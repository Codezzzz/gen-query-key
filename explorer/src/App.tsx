import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Example from './Example';

function App() {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <Example />
        </QueryClientProvider>
    );
}

export default App;
