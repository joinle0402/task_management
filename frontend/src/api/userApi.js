import http from '@/http';

const prefix = '/users';

export const fetchUsers = async (params) => {
    return http.get(prefix, { params });
};

export const fetchUser = async (id) => {
    return http.get(`${prefix}/${id}`);
};

export const createUser = async (payload) => {
    return http.post(prefix, payload);
};

export const updateUser = async ({ id, ...payload }) => {
    return http.put(`${prefix}/${id}`, payload);
};

export const deleteUser = async (id) => {
    return http.delete(`${prefix}/${id}`);
};
