import { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../lib/api';
import { toast } from 'sonner';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);    // null = not logged in
    const [loading, setLoading] = useState(true); // true = still checking

    const loginWithGoogleProvider = () => {
        window.open(`${import.meta.env.VITE_API_URL}/auth/google`, "_self");
    };

    useEffect(() => {
        const tryFetchUser = async () => {
            setLoading(true);
            console.log('Attempting to fetch user...');

            try {
                // Try Google auth first
                const response = await api.get('/auth/user');
                console.log('Google auth response:', response.data);
                
                if (response.data) {
                    setUser(response.data);
                    setLoading(false);
                    return;
                }
            } catch (err) {
                console.warn("Google auth failed, trying custom session...", err);
            }

            try {
                // Try custom session
                const response = await api.get('/users/check-auth');
                console.log('Custom session response:', response.data);
                
                if (response.data?.user) {
                    setUser(response.data.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('No authenticated user found:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        tryFetchUser();
    }, []);

    const logout = async () => {
        try {
            await api.get('/auth/logout');
            setUser(null);
            toast.success('Logged out successfully');
            window.location.reload();
        } catch (error) {
            console.error('Failed to log out:', error);
            toast.error('Failed to log out. Please try again.');
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser, loading, logout, loginWithGoogleProvider }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
