import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { LoaderProvider } from './contexts/LoaderContext.jsx';
import Loader from './components/Loader.jsx';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <CssBaseline />
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <LoaderProvider>
                    <AuthProvider>
                        <Loader />
                        <App />
                        <ReactQueryDevtools initialIsOpen={false} />
                    </AuthProvider>
                </LoaderProvider>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 5000,
                        style: {
                            background: '#333',
                            color: '#fff',
                            fontSize: '0.95rem',
                        },
                        success: {
                            iconTheme: {
                                primary: '#4caf50',
                                secondary: '#fff',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: '#f44336',
                                secondary: '#fff',
                            },
                        },
                    }}
                />
            </QueryClientProvider>
        </BrowserRouter>
    </StrictMode>,
);
