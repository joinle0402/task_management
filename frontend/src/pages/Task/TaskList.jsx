import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export default function TaskList() {
    return (
        <Box flexGrow={1}>
            <Stack direction="row" gap={2} justifyContent="space-between" alignItems="center">
                <Typography variant="h5">My Tasks</Typography>

                <Stack>
                    <Button variant="contained">Create</Button>
                </Stack>
            </Stack>
        </Box>
    );
}
