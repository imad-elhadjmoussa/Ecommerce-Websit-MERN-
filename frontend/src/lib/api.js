import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // optional, needed if using cookies/sessions
});

export const fetchProducts = async () => {
    try {
        const response = await api.get('/products'); // Adjust the endpoint as needed
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}
