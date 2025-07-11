import { useController } from 'react-hook-form';
import TextField from '@mui/material/TextField';

export default function InputField({ name, control, label, ...props }) {
    const { field, fieldState } = useController({ name, control });

    return (
        <TextField
            fullWidth
            label={label}
            size="small"
            variant="outlined"
            margin="dense"
            error={!!fieldState?.error}
            helperText={fieldState?.error?.message}
            {...field}
            {...props}
        />
    );
}
