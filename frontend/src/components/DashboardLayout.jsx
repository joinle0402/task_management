import { Outlet } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Sidebar from '@/components/Sidebar.jsx';

export default function DashboardLayout() {
    return (
        <Stack direction="row" gap={1}>
            <Sidebar />
            <Box mt={8} width="100%">
                <Outlet />
            </Box>
        </Stack>
    );
}
