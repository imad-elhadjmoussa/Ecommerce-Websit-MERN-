import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);    // null = not logged in
    const [loading, setLoading] = useState(true); // true = still checking

    const loginWithGoogleProvider = () => {
        window.open(`${import.meta.env.VITE_API_URL}/auth/google`, "_self");
    };

    useEffect(() => {
        const tryFetchUser = async () => {
            setLoading(true); // Start loading

            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/user`, { withCredentials: true });
                if (response.data) {
                    setUser(response.data);
                    setLoading(false); // Stop loading if user found
                    return;
                }
            } catch (err) {
                console.warn("Google user not found, trying custom session...");
            }

            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/check-auth`, { withCredentials: true });
                setUser(response.data.user);
                setLoading(false); // Stop loading if user found
            } catch (error) {
                console.error('No authenticated user found');
                setUser(null);
            } finally {
                setLoading(false); // Stop loading in all cases
            }
        };

        tryFetchUser();
    }, []);

    const logout = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_API_URL}/auth/logout`, { withCredentials: true });
            setUser(null);
            window.location.reload();
        } catch (error) {
            console.error('Failed to log out:', error);
        }
    }

    return (
        <UserContext.Provider value={{ user, setUser, loading, logout, loginWithGoogleProvider }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
