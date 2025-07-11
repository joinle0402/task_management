import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
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
import toast from 'react-hot-toast';
import http from '../http.js';
import { handleApiError } from '../utilities/response.js';

const schema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Invalid email address!'),
    password: Yup.string().required('Password is required').min(4, 'Password must be at least 4 characters'),
    password_confirmation: Yup.string()
        .required('Password confirm is required')
        .oneOf([Yup.ref('password')], 'Confirm Password not matches password!'),
});

export default function Register() {
    const { control, handleSubmit, setError } = useForm({
        defaultValues: { name: '', email: '', password: '', password_confirmation: '' },
        resolver: yupResolver(schema),
    });
    const navigate = useNavigate();

    const { mutate: onSubmit, isPending } = useMutation({
        mutationFn: (formValues) => http.post('/auth/register', formValues),
        onSuccess: (response) => {
            toast.success(response.message);
            localStorage.setItem('access_token', response.access_token);
            navigate('/verify-email');
        },
        onError: (error) => handleApiError(error, setError),
    });

    return (
        <Box display="flex" justifyContent="center">
            <Card sx={{ width: '400px' }}>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div" textAlign="center">
                        Register
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                        <InputField control={control} name="name" label="Name" />
                        <InputField control={control} name="email" label="Email" />
                        <PasswordField control={control} name="password" label="Password" />
                        <PasswordField control={control} name="password_confirmation" label="Password Confirm" />
                        <Box mt={1}>
                            <Button type="submit" variant="contained" fullWidth loading={isPending} loadingPosition="start">
                                {isPending ? 'Registering...' : 'Register'}
                            </Button>
                        </Box>
                    </Box>
                    <Divider sx={{ my: 1 }}>or sign up with</Divider>
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
                        Already have an account?{' '}
                        <Link
                            component={RouterLink}
                            to="/login"
                            sx={{ fontWeight: 600, color: 'text.primary', textDecoration: 'none', ':hover': { textDecoration: 'underline' } }}
                        >
                            Sign In
                        </Link>
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}
