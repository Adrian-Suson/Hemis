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
import CampusManagement from "./Pages/CampusManagement/CampusManagement";
import CurricularProgram from "./Pages/CurricularPrograms/CurricularProgram";

function App() {
    return (
        <Router>
            <Routes>
                {/* Redirect from "/" to "/login" */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* Login page route */}
                <Route path="/login" element={<LoginPage />} />

                {/* Protected Routes for Specific Roles */}
                <Route element={<Layout />}>
                    {/* Open to all authenticated users */}
                    <Route
                        element={
                            <ProtectedRoute
                                allowedRoles={[
                                    "Super Admin",
                                    "CHED Regional Admin",
                                    "HEI Admin",
                                    "HEI Staff",
                                    "Viewer",
                                ]}
                            />
                        }
                    >
                        <Route
                            path="/admin/dashboard"
                            element={<DashboardPage />}
                        />
                    </Route>

                    {/* Only for Super Admin & CHED Regional Admin */}
                    <Route
                        element={
                            <ProtectedRoute
                                allowedRoles={[
                                    "Super Admin",
                                    "CHED Regional Admin",
                                ]}
                            />
                        }
                    >
                        <Route
                            path="/admin/user-management"
                            element={<UserManagement />}
                        />
                        <Route
                            path="/admin/institutions"
                            element={<InstitutionManagement />}
                        />
                        {/* Route for Campus Management */}
                        <Route
                            path="/admin/institutions/campuses/:institutionId"
                            element={<CampusManagement />}
                        />
                        <Route
                            path="/admin/institutions/curricular-programs/:institutionId"
                            element={<CurricularProgram />}
                        />

                        <Route path="*" element={<NotFound />} />
                    </Route>

                    {/* Catch all route for 404 */}
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
