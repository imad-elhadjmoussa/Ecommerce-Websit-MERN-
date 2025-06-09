import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const PublicRoute = ({ children }) => {
    const { user, loading } = useUser();

    if (loading) return <div>Loading...</div>;

    // If user is logged in, redirect them away from login page
    if (user) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PublicRoute;
