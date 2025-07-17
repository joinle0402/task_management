import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function NotFound() {
    const navigate = useNavigate();
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
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(window.history.length > 1 ? -1 : '/')} variant="contained" color="primary">
                Go Back
            </Button>
        </Box>
    );
}
