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
import OtpField from '@/components/form-control/OtpField';
import CircularProgress from '@mui/material/CircularProgress';
import { useCountdown } from '@/hooks/useCountdown';
import { handleApiError } from '@/utilities/response';
import { showSuccess } from '@/utilities/toast';
import { useCooldown } from '@/hooks/useCooldown';
import { useState } from 'react';
import http from '@/http';

const schema = Yup.object().shape({
    otp: Yup.string().required('OTP is required').length(6, 'OTP must be 6 digits'),
});

export default function VerifyForgotPassword() {
    const navigate = useNavigate();
    const email = localStorage.getItem('resetEmail');
    const [expiresAt, setExpiresAt] = useState(localStorage.getItem('resetExpiresAt'));
    const { expired, formatted } = useCountdown(expiresAt);
    const { startCooldown, cooldown, cooldownActive } = useCooldown('VerifyForgotPasswordCooldown');
    const { control, handleSubmit, setError } = useForm({ defaultValues: { otp: '' }, resolver: yupResolver(schema) });
    const { mutate: onSubmit, isPending } = useMutation({
        mutationFn: (formValues) => http.post('/auth/forgot-password/verify', { ...formValues, email }),
        onSuccess: ({ message, data: { token: resetToken } }) => {
            showSuccess(message);
            localStorage.removeItem('resetExpiresAt');
            localStorage.removeItem('VerifyForgotPasswordCooldown');
            localStorage.setItem('resetToken', resetToken);
            navigate('/reset-password');
        },
        onError: (error) => handleApiError(error, setError),
    });
    const { mutate: resend, isPending: isResending } = useMutation({
        mutationFn: () => http.post('/auth/forgot-password/resend', { email }),
        onSuccess: ({ message, data }) => {
            showSuccess(message);
            startCooldown();
            localStorage.setItem('resetExpiresAt', data.expired_at);
            setExpiresAt(data.expired_at);
        },
        onError: handleApiError,
    });

    if (!email) {
        navigate('/forgot-password');
        return null;
    }

    return (
        <Box display="flex" justifyContent="center">
            <Card sx={{ width: '400px' }}>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div" textAlign="center">
                        Password Reset
                    </Typography>
                    <Typography gutterBottom variant="body2" component="div" textAlign="center">
                        We sent a code to {email}
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit(onSubmit)} mt={2}>
                        <OtpField control={control} name="otp" />
                        <Box mt={2}>
                            <Typography variant="body2" textAlign="center" gutterBottom>
                                Your reset code {expired ? `is expired` : `expires in ${formatted}`}
                            </Typography>
                        </Box>
                        <Box mt={1}>
                            <Button type="submit" variant="contained" fullWidth loading={isPending} loadingPosition="start">
                                Continue
                            </Button>
                        </Box>
                    </Box>
                    <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
                        Didn't receive the email?{' '}
                        {cooldownActive ? (
                            `Resend available in ${cooldown}`
                        ) : (
                            <Link component="button" onClick={resend} disabled={isResending}>
                                {isResending ? <CircularProgress size={16} /> : 'Click to resend'}
                            </Link>
                        )}
                    </Typography>
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
