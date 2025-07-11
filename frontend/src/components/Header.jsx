import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Link } from 'react-router-dom';
import { use, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { useLogout } from '../hooks/useLogout.js';

export default function Header() {
    const { isAuthenticated, isLoading } = use(AuthContext);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const { mutate: logout, isPending } = useLogout();

    const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
    const handleCloseUserMenu = () => setAnchorElUser(null);

    return (
        <AppBar position="static">
            <Toolbar>
                <Container maxWidth="xl">
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

                        {isAuthenticated && (
                            <Box sx={{ flexGrow: 0 }}>
                                <Tooltip title="Open settings">
                                    <IconButton size="large" color="inherit" onClick={handleOpenUserMenu}>
                                        <AccountCircle color="#fff" fontSize="large" />
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    <MenuItem onClick={handleCloseUserMenu}>
                                        <Typography sx={{ textAlign: 'center' }}>Profile</Typography>
                                    </MenuItem>
                                    <MenuItem onClick={handleCloseUserMenu}>
                                        <Typography sx={{ textAlign: 'center' }}>Account</Typography>
                                    </MenuItem>
                                    <MenuItem onClick={handleCloseUserMenu}>
                                        <Typography sx={{ textAlign: 'center' }}>Dashboard</Typography>
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => {
                                            logout();
                                            handleCloseUserMenu();
                                        }}
                                        disabled={isPending}
                                    >
                                        <Typography sx={{ textAlign: 'center' }}>Logout</Typography>
                                    </MenuItem>
                                </Menu>
                            </Box>
                        )}
                    </Stack>
                </Container>
            </Toolbar>
        </AppBar>
    );
}
