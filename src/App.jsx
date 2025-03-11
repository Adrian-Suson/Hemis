import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

// Import pages
import LoginPage from "./Pages/Auth/LoginPage";
import DashboardPage from "./Pages/Dashboard/DashboardPage";
import UserManagement from "./Pages/UserManagment/UserManagement";
import InstitutionManagement from "./Pages/InstitutionManagement/InstitutionManagement";
import CampusManagement from "./Pages/CampusManagement/CampusManagement";
import CurricularProgram from "./Pages/CurricularPrograms/CurricularProgram";
import FacultyProfile from "./Pages/FacultyProfile/FacultyProfile";

// Utility Components
import ProtectedRoute from "./utils/ProtectedRoute";
import Layout from "./Layout/Layout";
import NotFound from "./utils/NotFound";

function App() {
    return (
        <Router>
            <Routes>
                {/* Redirect from "/" to "/login" */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* Public Route: Login */}
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
                    </Route>

                    {/* For CHED Regional Admin & HEI Admin */}
                    <Route
                        element={
                            <ProtectedRoute
                                allowedRoles={[
                                    "Super Admin",
                                    "CHED Regional Admin",
                                    "HEI Admin",
                                ]}
                            />
                        }
                    >
                        <Route
                            path="/admin/institutions"
                            element={<InstitutionManagement />}
                        />
                        <Route
                            path="/admin/institutions/campuses/:institutionId"
                            element={<CampusManagement />}
                        />
                        <Route
                            path="/admin/institutions/curricular-programs/:institutionId"
                            element={<CurricularProgram />}
                        />
                        <Route
                            path="/admin/institutions/faculties/:institutionId"
                            element={<FacultyProfile />}
                        />
                    </Route>

                    {/* Catch all route for 404 */}
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
