import { Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";

const ProtectedRoute = ({ allowedRoles }) => {
    // Get user data from localStorage (you can also use a global state like Redux or Context API)
    const user = JSON.parse(localStorage.getItem("user"));

    // If no user, redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Check if the user has the correct role
    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return <Outlet />;
};

ProtectedRoute.propTypes = {
    allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ProtectedRoute;
