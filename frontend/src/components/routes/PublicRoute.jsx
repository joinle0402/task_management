import { Outlet, Navigate } from 'react-router-dom';
import { use } from 'react';
import { AuthContext } from '../../contexts/AuthContext.jsx';
import Loader from '@/components/Loader.jsx';

export default function PublicRoute() {
    const { isAuthenticated, isVerified, isLoading } = use(AuthContext);
    console.log('PublicRoute', { isLoading });
    if (isLoading) return <Loader isLoading={isLoading} />;
    if (!isAuthenticated) return <Outlet />; // Not logged in → allow
    if (!isVerified) return <Navigate to="/verify-email" replace />; // Logged in but unverified → redirect to verify
    return <Navigate to="/admin/dashboard" replace />; // Logged in and verified → redirect to dashboard
}
