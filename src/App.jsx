import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import PropTypes from "prop-types";

// Import pages
import LoginPage from "./Pages/Auth/LoginPage";
import Dashboard from "./Pages/SuperAdmin/Dashboard/Dashboard";


// Utility Components
import ProtectedRoute from "./utils/ProtectedRoute";
import Layout from "./Layout/Layout";
import NotFound from "./utils/NotFound";
import SucHeiManagement from "./Pages/SuperAdmin/Suc/SucHeis/SucHeiManagement";

function ExternalRedirect({ to }) {
    window.location.href = to;
    return null;
}

ExternalRedirect.propTypes = {
    to: PropTypes.string.isRequired,
};

function App() {
    return (
        <Router>
            <Routes>
                {/* Redirect from "/" to "/login" */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                <Route
                    path="/egg"
                    element={
                        <ExternalRedirect to="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
                    }
                />

                {/* Public Route: Login */}
                <Route path="/login" element={<LoginPage />} />

                {/* Protected Routes with Layout */}
                <Route element={<Layout />}>
                    {/* Super Admin Routes under /super-admin/* */}
                    <Route
                        element={
                            <ProtectedRoute allowedRoles={["super-admin"]} />
                        }
                    >
                        <Route path="super-admin/dashboard" element={<Dashboard />} />
                        <Route path="/super-admin/institutions/suc" element={<SucHeiManagement />} />


                    </Route>

                    {/* HEI Admin Routes under /hei-admin/* */}
                    <Route
                        element={
                            <ProtectedRoute allowedRoles={["hei-admin"]} />
                        }
                    >

                                {/* <Route path="/hei-admin/institutions/suc" element={<Heis />} /> */}


                    </Route>

                    {/* HEI Staff Routes under /hei-staff/* */}
                    <Route
                        element={
                            <ProtectedRoute allowedRoles={["hei-staff"]} />
                        }
                    >

                    {/* <Route path="/hei-staff/institutions/suc" element={<Heis />} /> */}
                    </Route>

                    {/* Catch all route for 404 */}
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;

