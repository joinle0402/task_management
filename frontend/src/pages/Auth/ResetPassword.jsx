import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import * as Yup from 'yup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import { handleApiError } from '@/utilities/response';
import { showSuccess } from '@/utilities/toast';
import PasswordField from '@/components/form-control/PasswordField';
import http from '@/http';

const schema = Yup.object().shape({
    password: Yup.string().required('Password is required').min(4, 'Password must be at least 4 characters'),
    password_confirmation: Yup.string()
        .required('Password confirm is required')
        .oneOf([Yup.ref('password')], 'Confirm Password not matches password!'),
});

export default function ResetPassword() {
    const navigate = useNavigate();
    const email = localStorage.getItem('resetEmail');
    const token = localStorage.getItem('resetToken');
    const { control, handleSubmit, setError } = useForm({
        defaultValues: { password: '', password_confirmation: '' },
        resolver: yupResolver(schema),
    });
    const { mutate: onSubmit, isPending } = useMutation({
        mutationFn: async (formValues) => await http.post('/auth/reset-password', { ...formValues, email, token }),
        onSuccess: ({ message }) => {
            showSuccess(message);
            navigate('/login');
        },
        onError: (error) => handleApiError(error, setError),
    });
    if (!email || !token) {
        navigate('/forgot-password');
        return null;
    }

    return (
        <Box display="flex" justifyContent="center">
            <Card sx={{ width: '400px' }}>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div" textAlign="center">
                        Set new password
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit(onSubmit)} mt={2}>
                        <PasswordField control={control} name="password" label="Password" />
                        <PasswordField control={control} name="password_confirmation" label="Password Confirm" />
                        <Box mt={1}>
                            <Button type="submit" variant="contained" fullWidth loading={isPending} loadingPosition="start">
                                Reset Password
                            </Button>
                        </Box>
                    </Box>
                    <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
                        <Link component={RouterLink} to="/login" textAlign="center">
                            Back to login
                        </Link>
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}
