import { useController } from 'react-hook-form';
import Stack from '@mui/material/Stack';
import FormHelperText from '@mui/material/FormHelperText';
import { MuiOtpInput } from 'mui-one-time-password-input';

export default function OtpField({ name, control, length = 6 }) {
    const { field, fieldState } = useController({ name, control });

    return (
        <Stack direction="column" gap={1}>
            <MuiOtpInput
                length={length}
                TextFieldsProps={{ size: 'small', error: !!fieldState.invalid }}
                validateChar={(character) => /^\d$/.test(character)}
                sx={{ gap: 1 }}
                {...field}
            />
            {!!fieldState.invalid && <FormHelperText error>{fieldState.error.message}</FormHelperText>}
        </Stack>
    );
}
