import http from '@/http.js';

export const createEntityApi = (basePath) => ({
    findAll: (params) => http.get(basePath, { params }),
    findById: (id) => http.get(`${basePath}/${id}`),
    create: (data) => http.post(basePath, data),
    update: ({ id, data }) => http.put(`${basePath}/${id}`, data),
    remove: (id) => http.delete(`${basePath}/${id}`),
});
