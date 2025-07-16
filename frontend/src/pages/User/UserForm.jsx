import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { Box, Button, Paper, Typography } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import Breadcrumbs from '@/components/Breadcrumbs';
import InputField from '@/components/form-control/InputField';
import PasswordField from '@/components/form-control/PasswordField';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser } from '@/api/userApi';
import { useNavigate } from 'react-router-dom';
import { showSuccess } from '@/utilities/toast';
import { handleApiError } from '@/utilities/response';

const schema = yup.object({
    name: yup.string().required('Name is required').default(''),
    email: yup.string().email('Invalid email').required('Email is required').default(''),
    password: yup.string().required('Password is required').min(4, 'Minimum 4 characters').default(''),
    password_confirmation: yup
        .string()
        .oneOf([yup.ref('password')], 'Passwords do not match')
        .required('Confirm password is required')
        .default(''),
    phone: yup
        .string()
        .nullable()
        .notRequired()
        .matches(/^\d{10}$/, 'Phone must be exactly 10 digits')
        .transform((value) => (value === '' ? null : value.replaceAll('-', ''))),
});

export default function UserForm() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { control, handleSubmit, setError } = useForm({ resolver: yupResolver(schema), defaultValues: schema.getDefault() });
    const { mutate: onSubmit, isPending } = useMutation({
        mutationFn: createUser,
        onSuccess: () => {
            showSuccess('Create new user successfully!');
            queryClient.invalidateQueries(['users']);
            navigate('/admin/users');
        },
        onError: (error) => handleApiError(error, setError),
    });

    return (
        <Box flexGrow={1}>
            <Breadcrumbs />

            <Paper sx={{ maxWidth: 400, p: 2 }}>
                <Typography variant="h5">Create User</Typography>

                <Box component="form" noValidate mt={1} onSubmit={handleSubmit(onSubmit)}>
                    <InputField control={control} name="name" label="Name" />
                    <InputField control={control} name="email" label="Email" />
                    <PasswordField control={control} name="password" label="Password" />
                    <PasswordField control={control} name="password_confirmation" label="Password Confirm" />
                    <InputField control={control} name="phone" label="Phone" />
                    <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }} loading={isPending}>
                        Submit
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}
