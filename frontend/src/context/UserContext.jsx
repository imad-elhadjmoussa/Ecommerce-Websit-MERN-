import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loginWithGoogleProvider = () => {
        try {
            window.open(`${import.meta.env.VITE_API_URL}/auth/google`, "_self");
        } catch (err) {
            setError(err);
            console.error('Google auth failed:', err);
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/check`, {
                    withCredentials: true
                });
                setUser(response.data.user || null);
            } catch (err) {
                setError(err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const logout = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_API_URL}/auth/logout`, {
                withCredentials: true
            });
            setUser(null);
            // Redirect to home without full reload
            window.location.pathname = '/';
        } catch (err) {
            setError(err);
            console.error('Logout failed:', err);
        }
    };

    return (
        <UserContext.Provider value={{
            user,
            setUser,
            loading,
            error,
            logout,
            loginWithGoogleProvider
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);