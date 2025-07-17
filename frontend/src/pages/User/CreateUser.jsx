import { useEntity } from '@/hooks/useEntity.js';
import UserForm from '@/components/UserForm.jsx';
import { object, ref, string } from 'yup';
import { showSuccess } from '@/utilities/toast.jsx';
import { useNavigate } from 'react-router-dom';

const schema = object({
    name: string().required('Name is required').default(''),
    email: string().required('Email is required').email('Invalid email').default(''),
    password: string().required('Password is required').default(''),
    password_confirmation: string()
        .required('Confirm Password is required')
        .oneOf([ref('password')], 'Passwords do not match')
        .default(''),
    phone: string()
        .matches(/^\d{10}$/, 'Phone must be exactly 10 digits')
        .default(''),
});

export default function CreateUser() {
    const navigate = useNavigate();
    const { useCreate } = useEntity('users');
    const { mutateAsync, isPending } = useCreate();
    return (
        <UserForm
            mode="create"
            schema={schema}
            isLoading={isPending}
            onSubmit={async (data) => {
                await mutateAsync(data);
                showSuccess('Create user successfully!');
                navigate('/admin/users');
            }}
        />
    );
}
