import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { isEmpty } from 'lodash';
import { Box, Button, Paper, Typography } from '@mui/material';
import { handleApiError } from '@/utilities/response.js';
import Breadcrumbs from '@/components/Breadcrumbs.jsx';
import InputField from '@/components/form-control/InputField.jsx';
import PasswordField from '@/components/form-control/PasswordField.jsx';

export default function UserForm({ mode, defaultValues = {}, schema, onSubmit, isLoading = false }) {
    const isView = mode === 'view';
    const { control, handleSubmit, setError } = useForm({
        resolver: yupResolver(schema),
        defaultValues: isEmpty(defaultValues) && !isEmpty(schema) ? schema.getDefault() : defaultValues,
    });

    const handleInternalSubmit = async (data) => onSubmit(data).catch((error) => handleApiError(error, setError));

    return (
        <Box flexGrow={1}>
            {!isView && <Breadcrumbs />}
            <Paper sx={{ maxWidth: 400, p: 2 }}>
                <Typography variant="h6">{mode === 'create' ? 'Create User' : mode === 'edit' ? 'Edit User' : 'User Detail'}</Typography>

                <Box component="form" onSubmit={handleSubmit(handleInternalSubmit)} mt={1} noValidate>
                    <InputField control={control} name="name" label="Name" disabled={isView} />
                    <InputField control={control} name="email" label="Email" disabled={isView} />
                    <PasswordField control={control} name="password" label="Password" disabled={isView} />
                    <PasswordField control={control} name="password_confirmation" label="Password Confirm" disabled={isView} />
                    <InputField control={control} name="phone" label="Phone" disabled={isView} />
                    {!isView && (
                        <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }} loading={isLoading}>
                            Submit
                        </Button>
                    )}
                </Box>
            </Paper>
        </Box>
    );
}
