import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ChakraProvider } from '@chakra-ui/react';

const queryClient = new QueryClient();


ReactDOM.createRoot(document.getElementById('root')).render(
  <ChakraProvider>

  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider >
  </ChakraProvider>,
)
