import React from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // optional, needed if using cookies/sessions
    headers: {
        'Content-Type': 'application/json',
    }
});

export const addProduct = async (productData) => {
    try {
        const formData = new FormData();

        // Append scalar fields
        formData.append('name', productData.name);
        formData.append('description', productData.description);
        formData.append('price', productData.price);
        formData.append('category', productData.category);
        formData.append('subCategory', productData.subCategory);
        formData.append('bestSeller', productData.bestSeller);

        // Append array fields
        formData.append('sizes', JSON.stringify(productData.sizes)); // ['S', 'M', 'L']

        productData.images.forEach((file) => {
            formData.append('images', file);
        });

        const response = await api.post('/products', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error adding product:', error);
        throw new Error(error?.response?.data?.message || 'Failed to add product');
    }
};

export const getProducts = async () => {
    try {
        const response = await api.get('/products');
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw new Error(error?.response?.data?.message || 'Failed to fetch products');
    }
};

export const deleteProduct = async (productId) => {
    console.log(productId);
    try {
        const response = await api.delete(`/products/${productId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting product:', error);
        throw new Error(error?.response?.data?.message || 'Failed to delete product');
    }
};

// Order API functions
export const getAllOrders = async () => {
    try {
        const response = await api.get('/orders/admin/all');
        return response.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw new Error(error?.response?.data?.message || 'Failed to fetch orders');
    }
};

export const updateOrderStatus = async (orderId, status) => {
    try {
        console.log('Sending update order status request:', { orderId, status });
        
        const response = await api.patch(`/orders/admin/${orderId}/status`, { status });
        console.log('Update order status response:', response.data);
        
        return response.data;
    } catch (error) {
        console.error('Error updating order status:', {
            error: error.response?.data || error.message,
            status: error.response?.status,
            orderId,
            requestedStatus: status
        });
        throw new Error(
            error.response?.data?.message || 
            error.response?.data?.details || 
            'Failed to update order status'
        );
    }
};

