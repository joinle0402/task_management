import toast from 'react-hot-toast';
import { Alert, Box } from '@mui/material';

export const showSuccess = (message) => {
    toast.custom((t) => (
        <Box sx={{ minWidth: 300, m: 1 }}>
            <Alert severity="success" variant="filled" onClose={() => toast.dismiss(t.id)}>
                {message}
            </Alert>
        </Box>
    ));
};

export const showError = (message) => {
    toast.custom((t) => (
        <Box sx={{ minWidth: 300, m: 1 }}>
            <Alert severity="error" variant="filled" onClose={() => toast.dismiss(t.id)}>
                {message}
            </Alert>
        </Box>
    ));
};
