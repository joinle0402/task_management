import { useNavigate, useParams } from 'react-router-dom';
import { useEntity } from '@/hooks/useEntity.js';
import { showSuccess } from '@/utilities/toast.jsx';
import { object, ref, string } from 'yup';
import UserForm from '@/components/UserForm.jsx';
import Loader from '@/components/Loader.jsx';

const schema = object({
    name: string().required('Name is required').default(''),
    email: string().required('Email is required').email('Invalid email').default(''),
    password: string().optional().default(''),
    password_confirmation: string()
        .optional()
        .oneOf([ref('password')], 'Passwords do not match')
        .default(''),
    phone: string()
        .matches(/^\d{10}$/, 'Phone must be exactly 10 digits')
        .default(''),
});

export default function UpdateUser() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { useFindById, useUpdate } = useEntity('users');
    const { data: response, isLoading } = useFindById(id);
    const { mutateAsync } = useUpdate();
    if (isLoading) {
        return <Loader isLoading={isLoading} />;
    }
    return (
        <UserForm
            mode="update"
            defaultValues={response.data}
            schema={schema}
            isLoading={false}
            onSubmit={async (data) => {
                await mutateAsync({ id: response.data.id, data });
                showSuccess('Update user successfully!');
                navigate('/admin/users');
            }}
        />
    );
}
