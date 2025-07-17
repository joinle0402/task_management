import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import CircularProgress from '@mui/material/CircularProgress';

import OtpField from '@/components/form-control/OtpField';
import { useMutation, useQuery } from '@tanstack/react-query';
import http from '@/http.js';
import { useCountdown } from '@/hooks/useCountdown.js';
import { handleApiError } from '@/utilities/response.js';
import { useCooldown } from '@/hooks/useCooldown.js';
import { showSuccess } from '@/utilities/toast.jsx';
import { use, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/contexts/AuthContext.jsx';

const schema = Yup.object().shape({
    otp: Yup.string().required('OTP is required!').length(6, 'OTP must be 6 digits!'),
});

export default function VerifyEmail() {
    const navigate = useNavigate();
    const { control, handleSubmit, setError } = useForm({
        defaultValues: { otp: '' },
        resolver: yupResolver(schema),
    });
    const { isVerified, profileUser } = use(AuthContext);
    useEffect(
        function () {
            if (isVerified) {
                navigate('/admin/dashboard');
            }
        },
        [isVerified, navigate],
    );

    const { data: verificationStatus } = useQuery({
        queryKey: ['verificationStatus'],
        queryFn: async () => {
            const responseData = await http.get('/auth/verification-status');
            setExpiresAt(responseData.expiresAt);
            if (responseData.isVerified) {
                navigate('/admin/tasks');
            }
            return responseData;
        },
        staleTime: 0,
    });
    const [expiresAt, setExpiresAt] = useState();
    const { expired, formatted } = useCountdown(expiresAt);
    const { startCooldown, cooldown, cooldownActive } = useCooldown('resendCooldown', 60_000);

    const { mutate: resendVerificationCode, isPending: isResendLoading } = useMutation({
        mutationFn: async () => await http.post('/auth/verify-email/resend', { email: profileUser.email }),
        onSuccess: (response) => {
            showSuccess(response.message);
            startCooldown();
            setExpiresAt(response.data.expired_at);
        },
        onError: (error) => handleApiError(error),
    });
    const { mutate: verifyEmail, isPending: isVerifyEmailLoading } = useMutation({
        mutationFn: (formValues) => {
            if (verificationStatus?.email) {
                return http.post('/auth/verify-email', { email: verificationStatus?.email, otp: formValues.otp });
            }
        },
        onSuccess: (response) => {
            showSuccess(response.message);
            navigate('/admin/tasks');
        },
        onError: (error) => handleApiError(error, setError),
    });

    const onSubmit = (formValues) => {
        verifyEmail(formValues);
    };

    return (
        <Box display="flex" justifyContent="center">
            <Card sx={{ width: '400px' }}>
                <CardContent>
                    <Typography variant="h5" component="div" textAlign="center" gutterBottom>
                        Verification code
                    </Typography>
                    <Typography variant="body2" textAlign="center" gutterBottom>
                        We have sent a code to {verificationStatus?.email}
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit(onSubmit)} mt={2}>
                        <OtpField control={control} name="otp" />
                        <Box mt={2}>
                            <Typography variant="body2" textAlign="center" gutterBottom>
                                Your verification code {expired ? `is expired` : `expires in ${formatted}`}
                            </Typography>
                        </Box>
                        <Box mt={1}>
                            <Button type="submit" variant="contained" loading={isVerifyEmailLoading} loadingPosition="start" fullWidth>
                                Verify
                            </Button>
                        </Box>
                    </Box>
                    <Divider sx={{ my: 2 }}></Divider>
                    <Typography variant="body2" display="flex" justifyContent="center" alignItems="center" textAlign="center" sx={{ mt: 1 }}>
                        Didn't receive the code?{' '}
                        {cooldownActive ? (
                            `Resend available in ${cooldown}`
                        ) : (
                            <Link
                                component="button"
                                variant="body2"
                                onClick={() => resendVerificationCode()}
                                disabled={isResendLoading}
                                sx={{
                                    fontWeight: 600,
                                    fontSize: 14,
                                    color: 'text.primary',
                                    textDecoration: 'none',
                                    ml: 1,
                                    ':hover': { textDecoration: 'underline' },
                                }}
                            >
                                {isResendLoading ? <CircularProgress size={16} /> : 'Resend'}
                            </Link>
                        )}
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}
