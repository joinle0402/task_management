import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';

import InputField from '@/components/form-control/InputField';
import PasswordField from '@/components/form-control/PasswordField';
import { useMutation } from '@tanstack/react-query';
import http from '@/http.js';
import { handleApiError } from '@/utilities/response.js';
import { use, useState } from 'react';
import { AuthContext } from '@/contexts/AuthContext.jsx';
import { LoaderContext } from '@/contexts/LoaderContext.jsx';

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
    const navigate = useNavigate();
    const { mutate: onSubmit, isPending } = useMutation({
        mutationFn: async (formValues) => await http.post('/auth/login', formValues),
        onMutate: () => showLoading(),
        onSettled: () => hideLoading(),
        onSuccess: ({ access_token, profile }) => {
            login(access_token, profile);
            navigate('/admin/dashboard');
        },
        onError: (error) => handleApiError(error, setError),
    });
    const [provider, setProvider] = useState('');
    const { mutate: socialLogin, isPending: socialLoginLoading } = useMutation({
        mutationFn: async (provider = '') => await http.get(`/auth/${provider}/redirect`),
        onSuccess: (data) => (window.location.href = data.url),
        onError: (error) => handleApiError(error),
    });

    return (
        <Box display="flex" justifyContent="center" mt={8}>
            <Card sx={{ width: '400px' }}>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div" textAlign="center">
                        Login
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                        <InputField type="email" control={control} name="email" label="Email" />
                        <PasswordField control={control} name="password" label="Password" />
                        <Box mt={1} mb={2} display="flex" justifyContent="flex-end">
                            <Link href="#" component={RouterLink} to="/forgot-password" variant="body2">
                                Forgot Password?
                            </Link>
                        </Box>
                        <Box mt={1}>
                            <Button type="submit" variant="contained" fullWidth loading={isPending} loadingPosition="start">
                                Login
                            </Button>
                        </Box>
                    </Box>
                    <Divider sx={{ my: 1 }}>or sign in with</Divider>
                    <Stack direction="row" justifyContent="center" gap={1}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                setProvider('google');
                                socialLogin('google');
                            }}
                            loading={socialLoginLoading && provider === 'google'}
                            loadingPosition="start"
                        >
                            Google
                        </Button>
                        <Button
                            fullWidth
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                                setProvider('github');
                                socialLogin('github');
                            }}
                            loading={socialLoginLoading && provider === 'github'}
                            loadingPosition="start"
                        >
                            Github
                        </Button>
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
