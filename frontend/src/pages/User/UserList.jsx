import { use, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Box, Button, IconButton, LinearProgress, Stack, Switch, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { deleteUser, fetchUsers } from '@/api/userApi';
import { ConfirmDialogContext } from '@/contexts/ConfirmDialogContext';
import { LoaderContext } from '@/contexts/LoaderContext';
import { AuthContext } from '@/contexts/AuthContext.jsx';

import { handleApiError } from '@/utilities/response';
import { showError } from '@/utilities/toast.jsx';
import { exportFile } from '@/utilities/downloadFile.js';
import Breadcrumbs from '@/components/Breadcrumbs';
import dayjs from 'dayjs';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import DeleteIcon from '@mui/icons-material/Delete';

export default function UserList() {
    const location = useLocation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { profileUser } = use(AuthContext);
    const { confirm } = use(ConfirmDialogContext);
    const { showLoading, hideLoading } = use(LoaderContext);

    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [sortModel, setSortModel] = useState([]);

    const { page, pageSize } = paginationModel;
    const sort = sortModel.map((s) => `${s.field}:${s.sort}`).join(',');

    const { data: paginate, isLoading } = useQuery({
        queryKey: ['users', page, pageSize, sort],
        queryFn: () => fetchUsers({ page: page + 1, pageSize, sort }),
        placeholderData: keepPreviousData,
    });

    const { mutate: remove } = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'], exact: false }).then(),
        onMutate: () => showLoading(),
        onSettled: () => hideLoading(),
        onError: (error) => handleApiError(error),
    });

    const columns = [
        {
            field: 'index',
            headerName: '#',
            width: 70,
            sortable: false,
        },
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 1 },
        { field: 'phone', headerName: 'Phone', flex: 1 },
        { field: 'created_at', headerName: 'Created At', valueFormatter: (params) => dayjs(params.value).format('DD/MM/YYYY'), flex: 1 },
        {
            field: 'is_active',
            headerName: 'Active',
            width: 100,
            renderCell: (params) => <Switch checked={params.value} color="primary" />,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            sortable: false,
            renderCell: ({ row }) => (
                <Stack direction="row" gap={1}>
                    <IconButton color="error" onClick={() => handleButtonDeleteClicked(row)}>
                        <DeleteIcon />
                    </IconButton>
                    <IconButton color="warning" onClick={() => handleButtonUpdateClicked(row.id)}>
                        <ModeEditOutlinedIcon />
                    </IconButton>
                </Stack>
            ),
        },
    ];

    async function handleButtonDeleteClicked(user) {
        if (profileUser.id === user.id) {
            showError('You cannot delete your own account');
            return;
        }
        if (await confirm({ title: 'Delete User', message: `Are you sure you want to delete "${user.name}"?` })) {
            remove(user.id);
        }
    }

    function handleButtonUpdateClicked(rowId) {
        navigate(location.pathname + `/${rowId}/edit`);
    }

    return (
        <Box flexGrow={1}>
            <Breadcrumbs />
            <Stack direction="row" gap={2} justifyContent="space-between" alignItems="center">
                <Typography variant="h5">User Management</Typography>
                <Stack direction="row" gap={1}>
                    <Button variant="contained" onClick={() => exportFile('/users/export', 'users.xlsx')}>
                        Export
                    </Button>
                    <Button variant="contained" onClick={() => navigate(location.pathname + '/create')}>
                        Create
                    </Button>
                </Stack>
            </Stack>
            <Box mt={1}>
                <DataGrid
                    checkboxSelection
                    showToolbar
                    rows={
                        paginate?.data?.map((item, i) => ({
                            ...item,
                            index: paginationModel.page * paginationModel.pageSize + i + 1,
                        })) ?? []
                    }
                    columns={columns}
                    rowCount={paginate?.meta?.total ?? 0}
                    paginationMode="server"
                    sortingMode="server"
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    sortModel={sortModel}
                    onSortModelChange={setSortModel}
                    disableMultipleColumnsSorting={false}
                    loading={isLoading}
                    pageSizeOptions={[5, 10, 20]}
                    slots={{ loadingOverlay: LinearProgress }}
                />
            </Box>
        </Box>
    );
}
