import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
// Import your LoginPage component
import LoginPage from "./Pages/Auth/LoginPage";
import DashboardPage from "./Pages/Dashboard/DashboardPage";
import ProtectedRoute from "./utils/ProtectedRoute"; // Your ProtectedRoute component
import Layout from "./Layout/Layout"; // Your Layout component
import NotFound from "./utils/NotFound";
import UserManagement from "./Pages/UserManagment/UserManagement ";
import InstitutionManagement from "./Pages/InstitutionManagement/InstitutionManagement";

function App() {
    return (
        <Router>
            <Routes>
                {/* Redirect from "/" to "/login" */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* Login page route */}
                <Route path="/login" element={<LoginPage />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<Layout />}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/admin/user-management" element={<UserManagement />} />
                        <Route path="/admin/institution-management" element={<InstitutionManagement />} />

                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
