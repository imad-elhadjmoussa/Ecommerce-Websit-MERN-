import { useUser } from "../context/UserContext";
import { Navigate, useLocation } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";

const PrivateRoute = ({ children }) => {
    const { user, loading } = useUser();
    const location = useLocation();

    if (loading) {
        return <LoadingScreen />;
    }

    if (!user) {
        // Save the attempted URL for redirecting after login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default PrivateRoute;
