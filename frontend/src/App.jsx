import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import VerifyEmail from '@/pages/VerifyEmail';
import PublicRoute from '@/components/routes/PublicRoute.jsx';
import ProtectedRoute from '@/components/routes/ProtectedRoute.jsx';
import TaskList from '@/pages/Task/TaskList.jsx';
import Dashboard from '@/pages/Dashboard.jsx';
import ForgotPassword from '@/pages/ForgotPassword.jsx';
import VerifyForgotPassword from '@/pages/VerifyForgotPassword.jsx';
import ResetPassword from '@/pages/ResetPassword.jsx';
import Callback from '@/pages/Callback.jsx';
import DashboardLayout from '@/components/DashboardLayout.jsx';

export default function App() {
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
                    </Route>
                </Route>
            </Route>
        </Routes>
    );
}
