import { Outlet } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Sidebar from './Sidebar.jsx';
import Box from '@mui/material/Box';

export default function DashboardLayout() {
    return (
        <Stack direction="row" gap={1}>
            <Sidebar />
            <Box mt={8}>
                <Outlet />
            </Box>
        </Stack>
    );
}
