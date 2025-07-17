import { Breadcrumbs as MUIBreadcrumbs, Link, Typography } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

export default function Breadcrumbs() {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter(Boolean);
    return (
        <MUIBreadcrumbs sx={{ mb: 2 }}>
            <Link component={RouterLink} to="/admin/dashboard">
                Home
            </Link>
            {pathnames.map((pathname, index) => {
                if (index === 0 || Number(pathname) > 0) return null;
                const to = '/' + pathnames.slice(0, index + 1).join('/');
                const label = pathname.replace(/-/g, ' ').replace(/\b\w/g, (label) => label.toUpperCase());
                const isLast = index === pathnames.length - 1;

                return isLast ? (
                    <Typography color="text.primary" key={to}>
                        {label}
                    </Typography>
                ) : (
                    <Link component={RouterLink} to={to} key={to}>
                        {label}
                    </Link>
                );
            })}
        </MUIBreadcrumbs>
    );
}
