import { createContext, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import http from '../http.js';
import { useNavigate } from 'react-router-dom';
import { showError, showSuccess } from '../utilities/toast.jsx';

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token'));
    const isAuthenticated = !!accessToken;
    const { data: user, isLoading } = useQuery({
        queryKey: ['profile'],
        queryFn: () => http.get('/auth/profile'),
        enabled: isAuthenticated,
        staleTime: 5 * 60 * 1000,
    });
    const isVerified = !!user?.email_verified_at;

    const login = async (accessToken) => {
        localStorage.setItem('access_token', accessToken);
        setAccessToken(accessToken);
        await queryClient.invalidateQueries(['profile']);
    };

    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken, isAuthenticated, isVerified, user, isLoading, login }}>
            {children}
        </AuthContext.Provider>
    );
}
