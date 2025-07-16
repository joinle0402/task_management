import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import DashboardLayout from '@/components/DashboardLayout.jsx';
import PublicRoute from '@/components/routes/PublicRoute.jsx';
import ProtectedRoute from '@/components/routes/ProtectedRoute.jsx';
import Login from '@/pages/Auth/Login';
import Register from '@/pages/Auth/Register';
import VerifyEmail from '@/pages/Auth/VerifyEmail';
import ForgotPassword from '@/pages/Auth/ForgotPassword.jsx';
import VerifyForgotPassword from '@/pages/Auth/VerifyForgotPassword.jsx';
import ResetPassword from '@/pages/Auth/ResetPassword.jsx';
import Callback from '@/pages/Auth/Callback.jsx';
import TaskList from '@/pages/Task/TaskList.jsx';
import NotFound from '@/pages/Common/NotFound';
import Dashboard from '@/pages/Dashboard.jsx';
import UserList from '@/pages/User/UserList';
import UserForm from '@/pages/User/UserForm';
import { use } from 'react';
import { AuthContext } from './contexts/AuthContext';
import Loader from './components/Loader';

export default function App() {
    const { isLoading } = use(AuthContext);
    if (isLoading) {
        return <Loader isLoading={isLoading} />;
    }
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route element={<PublicRoute />}>
                    <Route path="login" element={<Login />} />
                    <Route path="/auth/:provider/callback" element={<Callback />} />
                    <Route path="register" element={<Register />} />
                    <Route path="forgot-password" element={<ForgotPassword />} />
                    <Route path="forgot-password/verify" element={<VerifyForgotPassword />} />
                    <Route path="reset-password" element={<ResetPassword />} />
                    <Route index element={<Navigate to="/login" replace />} />
                </Route>
                <Route element={<ProtectedRoute />}>
                    <Route path="verify-email" element={<VerifyEmail />} />
                    <Route path="admin" element={<DashboardLayout />}>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="tasks" element={<TaskList />} />
                        <Route path="users" element={<UserList />} />
                        <Route path="users/create" element={<UserForm />} />
                    </Route>
                </Route>
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}
