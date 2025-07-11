import axios from 'axios';

const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

http.interceptors.response.use(
    (response) => {
        if (response.data) {
            return response.data;
        }
        return response;
    },
    (error) => Promise.reject(error),
);

http.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    async (error) => Promise.reject(error),
);

let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(callback) {
    refreshSubscribers.push(callback);
}

function onRefreshed(newToken) {
    refreshSubscribers.forEach((callback) => callback(newToken));
    refreshSubscribers = [];
}

http.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If not a 401 or no config, reject
        if (error.response?.status !== 401 || !originalRequest) {
            return Promise.reject(error);
        }

        // If we are already refreshing, just queue this request
        if (isRefreshing) {
            return new Promise((resolve) => {
                subscribeTokenRefresh((newToken) => {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    resolve(http(originalRequest));
                });
            });
        }

        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            return Promise.reject(error);
        }

        // If already retried once, reject to avoid infinite loop
        if (originalRequest._retry) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh-token`, {}, { withCredentials: true });

            const newToken = data.access_token;
            localStorage.setItem('access_token', newToken);
            http.defaults.headers.Authorization = `Bearer ${newToken}`;

            // Notify all queued subscribers
            onRefreshed(newToken);

            return http(originalRequest);
        } catch (refreshError) {
            localStorage.removeItem('access_token');
            window.location.href = '/login';
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    },
);

export default http;
