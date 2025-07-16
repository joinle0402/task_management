import { createContext, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import http from '@/http.js';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token'));
    const [profileUser, setProfileUser] = useState(null);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { isLoading } = useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            const profileUser = await http.get('/auth/profile');
            setProfileUser(profileUser);
            return profileUser;
        },
        enabled: !!accessToken && !profileUser,
        staleTime: 5 * 60 * 1000,
        retry: false,
    });
    const isAuthenticated = !!accessToken;
    const isVerified = !!profileUser?.email_verified_at;

    const login = async (accessToken, profileUser) => {
        localStorage.setItem('access_token', accessToken);
        setAccessToken(accessToken);
        setProfileUser(profileUser);
        if (profileUser) {
            queryClient.setQueryData(['profile'], profileUser); // Optional: populate cache
        } else {
            await queryClient.invalidateQueries(['profile']);
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        queryClient.removeQueries();
        setAccessToken(null);
        setProfileUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider
            value={{ accessToken, setAccessToken, setProfileUser, isAuthenticated, isVerified, profileUser, isLoading, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}
