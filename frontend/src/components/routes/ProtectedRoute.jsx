import { AuthContext } from '../../contexts/AuthContext.jsx';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { use } from 'react';
import Loader from '@/components/Loader.jsx';

export default function ProtectedRoute() {
    const { isAuthenticated, profileUser, isVerified, isLoading } = use(AuthContext);
    const location = useLocation();
    if (isLoading) return <Loader isLoading={isLoading} />;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (!profileUser) return <Loader isLoading={isLoading} />;
    if (!isVerified && location.pathname !== '/verify-email') return <Navigate to="/verify-email" replace />;
    if (isVerified && location.pathname === '/verify-email') return <Navigate to="/admin/dashboard" replace />;
    return <Outlet />;
}
