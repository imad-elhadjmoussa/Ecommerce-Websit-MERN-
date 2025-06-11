// src/contexts/UserContext.js
import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUser = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/users/check-auth`, 
                { withCredentials: true }
            );
            
            if (response.data.user) {
                setUser(response.data.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            setError(error.response?.data?.message || 'Failed to check authentication');
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const login = async (credentials) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/users/admin-login`,
                credentials,
                { withCredentials: true }
            );
            setUser(response.data.user);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            setError(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setLoading(true);
            await axios.post(
                `${import.meta.env.VITE_API_URL}/users/logout`,
                {},
                { withCredentials: true }
            );
            setUser(null);
            setError(null);
        } catch (error) {
            console.error('Logout failed:', error);
            toast.error('Failed to logout. Please try again.');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const value = {
        user,
        loading,
        error,
        login,
        logout,
        refreshUser: fetchUser
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
