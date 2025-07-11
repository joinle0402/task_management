import * as Yup from 'yup';
import { use } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { handleApiError } from '../utilities/response.js';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import http from '../http.js';
import InputField from '../components/form-control/InputField';
import { showSuccess } from '../utilities/toast.jsx';

const schema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Invalid email format'),
});

export default function ForgotPassword() {
    const navigate = useNavigate();
    const { control, handleSubmit, setError } = useForm({ defaultValues: { email: '' }, resolver: yupResolver(schema) });
    const { mutate: onSubmit, isPending } = useMutation({
        mutationFn: (values) => http.post('/auth/forgot-password', values),
        onSuccess: (response, variables) => {
            showSuccess(response.message);
            localStorage.setItem('resetEmail', variables.email);
            localStorage.setItem('resetExpiresAt', response.data.expired_at);
            navigate('/forgot-password/verify');
        },
        onError: (error) => handleApiError(error, setError),
    });

    return (
        <Box display="flex" justifyContent="center">
            <Card sx={{ width: '400px' }}>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div" textAlign="center">
                        Forgot password?
                    </Typography>
                    <Typography gutterBottom variant="body2" component="div" textAlign="center">
                        No worries, we'll send your reset instruction
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit(onSubmit)} mt={2}>
                        <InputField type="email" control={control} name="email" label="Email" />
                        <Box mt={1}>
                            <Button type="submit" variant="contained" fullWidth loading={isPending} loadingPosition="start">
                                Reset Password
                            </Button>
                        </Box>
                    </Box>
                    <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
                        <Link component={RouterLink} to="/login">
                            Back to login
                        </Link>
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}
