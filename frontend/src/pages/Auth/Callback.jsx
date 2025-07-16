import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { use, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { AuthContext } from '@/contexts/AuthContext.jsx';

export default function Callback() {
    const { login } = use(AuthContext);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    useEffect(() => {
        const accessToken = searchParams.get('token');
        if (!accessToken) {
            navigate('/login', { replace: true });
        }
        login(accessToken, null);
    }, [searchParams, navigate, queryClient, login]);

    return (
        <Container maxWidth={false} sx={{ mt: 8, textAlign: 'center' }}>
            <Typography variant="h5">Processing...</Typography>
        </Container>
    );
}
