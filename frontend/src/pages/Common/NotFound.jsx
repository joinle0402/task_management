import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh" textAlign="center">
            <Typography variant="h1" color="error" gutterBottom>
                404
            </Typography>
            <Typography variant="h5" gutterBottom>
                Page Not Found
            </Typography>
            <Typography variant="body1" mb={4}>
                The page you’re looking for doesn’t exist or has been moved.
            </Typography>
            <Button component={Link} to="/" variant="contained" color="primary">
                Go Home
            </Button>
        </Box>
    );
}
