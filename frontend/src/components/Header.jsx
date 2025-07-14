import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                <Container maxWidth={false}>
                    <Stack direction="row" justifyContent="space-between" gap={1} width="100%">
                        <Typography
                            variant="h6"
                            noWrap
                            component={Link}
                            to="/"
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                color: 'inherit',
                                textDecoration: 'none',
                                alignItems: 'center',
                            }}
                        >
                            Task Management
                        </Typography>
                    </Stack>
                </Container>
            </Toolbar>
        </AppBar>
    );
}
