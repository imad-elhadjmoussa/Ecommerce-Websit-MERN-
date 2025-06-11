import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import LoadingScreen from "./LoadingScreen";

const PublicRoute = ({ children }) => {
    const { user, loading } = useUser();

    if (loading) return <LoadingScreen />;

    // If user is logged in, redirect them away from login page
    if (user) {
        return <Navigate to="/" replace />;
    }

    return children; 
};

export default PublicRoute;
