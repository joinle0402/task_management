import { showError } from './toast';

export function handleApiError(error, setError = null) {
    const statusCode = error.response?.status;
    if (statusCode === 422 && typeof setError === 'function') {
        if (!!error.response.data.errors) {
            Object.entries(error.response.data.errors).forEach(([field, messages]) => {
                setError(field.toString(), { type: 'server', message: messages[0] });
            });
        } else {
            showError(error.response.data.message || 'Something went wrong.');
        }
    } else if (statusCode !== 500) {
        showError(error.response?.data?.message || 'Something went wrong.');
    } else {
        showError('Something went wrong.');
        throw error;
    }
}
