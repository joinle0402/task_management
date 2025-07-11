import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import GitHubIcon from '@mui/icons-material/GitHub';

import InputField from '../components/form-control/InputField';
import PasswordField from '../components/form-control/PasswordField';
import { useMutation } from '@tanstack/react-query';
import http from '../http.js';
import { handleApiError } from '../utilities/response.js';
import { use } from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { LoaderContext } from '../contexts/LoaderContext.jsx';

const schema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Invalid email format'),
    password: Yup.string().required('Password is required').min(4, 'Password must be at least 4 characters'),
});

export default function Login() {
    const { login } = use(AuthContext);
    const { showLoading, hideLoading } = use(LoaderContext);
    const { control, handleSubmit, setError } = useForm({
        defaultValues: { email: '', password: '' },
        resolver: yupResolver(schema),
    });

    const { mutate, isPending } = useMutation({
        mutationFn: async (formValues) => await http.post('/auth/login', formValues),
        onMutate: () => showLoading(),
        onSettled: () => hideLoading(),
        onSuccess: ({ access_token }) => {
            login(access_token);
        },
        onError: (error) => handleApiError(error, setError),
    });

    return (
        <Box display="flex" justifyContent="center">
            <Card sx={{ width: '400px' }}>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div" textAlign="center">
                        Login
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit(mutate)}>
                        <InputField control={control} name="email" label="Email" />
                        <PasswordField control={control} name="password" label="Password" />
                        <Box mt={1}>
                            <Button type="submit" variant="contained" fullWidth loading={isPending} loadingPosition="start">
                                Login
                            </Button>
                        </Box>
                    </Box>
                    <Divider sx={{ my: 1 }}>or sign in with</Divider>
                    <Stack direction="row" justifyContent="center" gap={1}>
                        <IconButton variant="outlined">
                            <GoogleIcon size={24} sx={{ color: '#DB4437', '&:hover': { color: '#a52714' } }} />
                        </IconButton>
                        <IconButton variant="outlined">
                            <FacebookIcon size={24} sx={{ color: '#1877F2', '&:hover': { color: '#0d47a1' } }} />
                        </IconButton>
                        <IconButton variant="outlined">
                            <GitHubIcon size={24} sx={{ color: '#333333', '&:hover': { color: '#000000' } }} />
                        </IconButton>
                    </Stack>
                    <Typography variant="body2" textAlign="center" sx={{ mt: 1 }}>
                        Don't have an account?{' '}
                        <Link
                            component={RouterLink}
                            to="/register"
                            sx={{ fontWeight: 600, color: 'text.primary', textDecoration: 'none', ':hover': { textDecoration: 'underline' } }}
                        >
                            Register
                        </Link>
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}
