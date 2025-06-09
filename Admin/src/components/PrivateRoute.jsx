import { useUser } from "../context/UserContext";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const { user, loading } = useUser();

    if (loading) return <div>Loading...</div>;

    if (!user) return <Navigate to="/login" replace />;

    return children;
};

export default PrivateRoute;
