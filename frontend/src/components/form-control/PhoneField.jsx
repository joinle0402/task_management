import { TextField } from '@mui/material';
import { useController } from 'react-hook-form';
import InputMask from 'react-input-mask';

export default function PhoneField({ control, name, label, ...props }) {
    const { field, fieldState } = useController({ name, control });

    return (
        <InputMask mask="999-999-9999" value={field.value || ''} onChange={field.onChange} onBlur={field.onBlur}>
            {(inputProps) => (
                <TextField
                    {...inputProps}
                    inputRef={inputProps.ref}
                    fullWidth
                    label={label}
                    size="small"
                    variant="outlined"
                    margin="dense"
                    error={!!fieldState?.error}
                    helperText={fieldState?.error?.message}
                    {...props}
                />
            )}
        </InputMask>
    );
}
