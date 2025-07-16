import { use } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
    IconButton,
    TableContainer,
    Paper,
    Skeleton,
    Box,
    Typography,
    Stack,
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import { deleteUser, fetchUsers } from '@/api/userApi';
import { ConfirmDialogContext } from '@/contexts/ConfirmDialogContext';
import { useLocation, useNavigate } from 'react-router-dom';
import Breadcrumbs from '@/components/Breadcrumbs';
import { handleApiError } from '@/utilities/response';
import { LoaderContext } from '@/contexts/LoaderContext';

export default function UserList() {
    const location = useLocation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { confirm } = use(ConfirmDialogContext);
    const { showLoading, hideLoading } = use(LoaderContext);
    const { data: users, isLoading: isUserLoading } = useQuery({
        queryKey: ['users'],
        queryFn: fetchUsers,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => queryClient.invalidateQueries(['users']),
        onMutate: () => showLoading(),
        onSettled: () => hideLoading(),
        onError: (error) => handleApiError(error),
    });

    async function handleButtonDeleteClicked(user) {
        if (await confirm({ title: 'Delete User', message: `Are you sure you want to delete "${user.name}"?` })) {
            deleteMutation.mutate(user.id);
        }
    }

    return (
        <Box flexGrow={1}>
            <Breadcrumbs />
            <Stack direction="row" gap={2} justifyContent="space-between" alignItems="center">
                <Typography variant="h5">User Management</Typography>
                <Stack>
                    <Button variant="contained" onClick={() => navigate(location.pathname + '/create')}>
                        Create
                    </Button>
                </Stack>
            </Stack>
            <Box mt={1}>
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ width: 150, minWidth: 150 }}>STT</TableCell>
                                <TableCell sx={{ width: 150, minWidth: 150 }}>Name</TableCell>
                                <TableCell sx={{ width: 150, minWidth: 150 }}>Email</TableCell>
                                <TableCell sx={{ width: 150, minWidth: 150 }}>Phone</TableCell>
                                <TableCell sx={{ width: 150, minWidth: 150 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isUserLoading
                                ? Array.from({ length: 5 }).map((_, index) => (
                                      <TableRow key={index}>
                                          <TableCell>
                                              <Skeleton sx={{ width: 150, minWidth: 150 }} />
                                          </TableCell>
                                          <TableCell>
                                              <Skeleton sx={{ width: 150, minWidth: 150 }} />
                                          </TableCell>
                                          <TableCell>
                                              <Skeleton sx={{ width: 150, minWidth: 150 }} />
                                          </TableCell>
                                          <TableCell>
                                              <Skeleton sx={{ width: 150, minWidth: 150 }} />
                                          </TableCell>
                                          <TableCell>
                                              <Skeleton sx={{ width: 150, minWidth: 150 }} />
                                          </TableCell>
                                      </TableRow>
                                  ))
                                : users?.data?.map((user, index) => (
                                      <TableRow key={user.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                          <TableCell>{index + 1}</TableCell>
                                          <TableCell>{user.name}</TableCell>
                                          <TableCell>{user.email}</TableCell>
                                          <TableCell>{user.phone}</TableCell>
                                          <TableCell>
                                              <IconButton onClick={() => handleButtonDeleteClicked(user)}>
                                                  <DeleteIcon />
                                              </IconButton>
                                          </TableCell>
                                      </TableRow>
                                  ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
}
