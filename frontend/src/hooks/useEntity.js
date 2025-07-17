import { createEntityApi } from '@/api/baseApi.js';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useEntity(entity) {
    const { findAll, findById, create, update, remove } = createEntityApi(entity);
    const queryClient = useQueryClient();
    return {
        useFindAll: (params = {}) =>
            useQuery({
                queryKey: [entity, params],
                queryFn: findAll,
            }),
        useFindById: (id) =>
            useQuery({
                queryKey: [entity, id],
                queryFn: () => findById(id),
                enabled: !!id,
            }),
        useCreate: () =>
            useMutation({
                mutationFn: create,
                onSuccess: () => queryClient.invalidateQueries({ queryKey: [entity] }),
            }),
        useUpdate: () =>
            useMutation({
                mutationFn: update,
                onSuccess: (response, { id }) => {
                    queryClient.invalidateQueries({ queryKey: [entity] }).then();
                    queryClient.setQueryData([entity, id], response);
                },
            }),
        useDelete: () =>
            useMutation({
                mutationFn: remove,
                onSuccess: (_, id) => {
                    queryClient.invalidateQueries({ queryKey: [entity] }).then();
                    queryClient.removeQueries({ queryKey: [entity, id] });
                },
            }),
    };
}
