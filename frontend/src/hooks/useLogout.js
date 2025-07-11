import http from '../http.js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { showSuccess } from '../utilities/toast.jsx';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { LoaderContext } from '../contexts/LoaderContext.jsx';
import { use } from 'react';

export function useLogout() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { setAccessToken } = use(AuthContext);
    const { showLoading, hideLoading } = use(LoaderContext);

    return useMutation({
        mutationFn: async () => await http.post('/auth/logout'),
        onMutate: () => showLoading(),
        onSuccess: (response) => {
            showSuccess('Logged out successfully');
        },
        onError: (error) => {
            console.log(error);
            showError('Logout failed. Please try again.');
        },
        onSettled: () => {
            // ✅ Always run this, whether logout succeeds or fails
            hideLoading();
            localStorage.removeItem('access_token');
            queryClient.removeQueries();
            setAccessToken(null);
            navigate('/login');
        },
    });
}
