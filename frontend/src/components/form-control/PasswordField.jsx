import { useState } from 'react';
import { useController } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function PasswordField({ name, control, label, ...props }) {
    const [showPassword, setShowPassword] = useState(false);
    const { field, fieldState } = useController({ name, control });

    return (
        <TextField
            fullWidth
            label={label}
            size="small"
            variant="outlined"
            margin="dense"
            autoComplete="off"
            error={!!fieldState?.error}
            helperText={fieldState?.error?.message}
            type={showPassword ? 'text' : 'password'}
            slotProps={{
                input: {
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton size="small" color={!!fieldState?.error ? 'error' : 'default'} onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                },
            }}
            {...field}
            {...props}
        />
    );
}
