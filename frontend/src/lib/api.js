import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance with default config
export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
    // Important for cross-origin requests
    xsrfCookieName: 'connect.sid',
    xsrfHeaderName: 'X-CSRF-Token',
});

// Add request interceptor for logging
api.interceptors.request.use(
    (config) => {
        console.log('Making request to:', config.url, {
            method: config.method,
            withCredentials: config.withCredentials,
            headers: config.headers
        });
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for logging
api.interceptors.response.use(
    (response) => {
        console.log('Response received:', {
            url: response.config.url,
            status: response.status,
            headers: response.headers
        });
        return response;
    },
    (error) => {
        console.error('Response error:', {
            url: error.config?.url,
            status: error.response?.status,
            message: error.message
        });
        return Promise.reject(error);
    }
);

export const fetchProducts = async () => {
    try {
        const response = await api.get('/products');
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
};
