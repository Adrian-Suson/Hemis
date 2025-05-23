import { Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";

const ProtectedRoute = ({ allowedRoles }) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard based on role
        const dashboardPaths = {
            "super-admin": "/super-admin/dashboard",
            "hei-admin": "/hei-admin/dashboard",
            "hei-staff": "/hei-staff/dashboard",
        };
        return <Navigate to={dashboardPaths[user.role] || "/login"} replace />;
    }

    return <Outlet />;
};

ProtectedRoute.propTypes = {
    allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ProtectedRoute;
