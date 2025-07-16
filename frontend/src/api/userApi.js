import http from '@/http';

const prefix = '/users';

export const fetchUsers = async () => {
    return await http.get(prefix);
}

export const fetchUser = async (id) => {
    return await http.get(`${prefix}/${id}`);
}

export const createUser = async (payload) => {
    return await http.post(prefix, payload);
}

export const updateUser = async ({ id, ...payload }) => {
    return await http.put(`${prefix}/${id}`, payload);
}

export const deleteUser = async (id) => {
    console.log(`deleteUser: ${prefix}/${id}`)
    return await http.delete(`${prefix}/${id}`);
}