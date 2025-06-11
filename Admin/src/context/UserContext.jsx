// src/contexts/UserContext.js
import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);  // null = not logged in

    // Optionally fetch the user from backend session on app load
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/check-auth`, { withCredentials: true });
            setUser(response.data.user);
            console.log(response.data.user);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const logout = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/users/logout`, { withCredentials: true });
            setUser(null); // Clear user state on logout
        } catch (error) {
            console.error('Failed to log out:', error);
        }
    }

    return (
        <UserContext.Provider value={{ user, setUser, logout, loading }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook
export const useUser = () => useContext(UserContext);
