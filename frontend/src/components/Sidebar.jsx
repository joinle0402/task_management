import { use } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '@/contexts/AuthContext.jsx';
import { Drawer, Avatar, ListItemButton, Toolbar, Box, Typography, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';

import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupsIcon from '@mui/icons-material/Groups';
import LogoutIcon from '@mui/icons-material/Logout';
import { useLogout } from '@/hooks/useLogout.js';

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { profileUser } = use(AuthContext);
    const { mutate: logout, isPending } = useLogout();

    const navItems = [
        { label: 'Home', icon: <DashboardIcon />, path: '/admin/dashboard' },
        { label: 'Task Management', icon: <AssignmentIcon />, path: '/admin/tasks' },
        { label: 'User Management', icon: <GroupsIcon />, path: '/admin/users' },
    ];

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: 240,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: 240,
                    boxSizing: 'border-box',
                    backgroundColor: '#f7f7f7',
                },
            }}
        >
            <Toolbar />
            <Box sx={{ overflow: 'auto' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mb: 2, py: 2 }}>
                    <Avatar alt={profileUser?.name} src={profileUser?.avatar || undefined} />
                    <Box textAlign="center">
                        <Typography variant="subtitle1">{profileUser?.name || 'Guest'}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            {profileUser?.email}
                        </Typography>
                    </Box>
                </Box>
                <Divider />
                <List>
                    {navItems.map((item) => (
                        <ListItem key={item.label} disablePadding>
                            <ListItemButton onClick={() => navigate(item.path)} selected={location.pathname === item.path}>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.label} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                    <ListItem disablePadding>
                        <ListItemButton onClick={logout} disabled={isPending}>
                            <ListItemIcon>
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText primary="Logout" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Drawer>
    );
}
