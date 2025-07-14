import { Outlet } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Header from '@/components/Header';

function MainLayout() {
    return (
        <Stack direction="column" minHeight="100vh">
            <Header />
            <Box flexGrow={1} py={2}>
                <Container maxWidth={false}>
                    <Outlet />
                </Container>
            </Box>
        </Stack>
    );
}

export default MainLayout;
