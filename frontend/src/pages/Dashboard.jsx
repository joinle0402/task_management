import { Navigate } from 'react-router-dom';

export default function Dashboard() {
    return <Navigate to="/admin/tasks" replace />;
}
