import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

// Import pages
import LoginPage from "./Pages/Auth/LoginPage";

//Super Admin
import DashboardPage from "./Pages/SuperAdmin/Dashboard/DashboardPage";
import UserManagement from "./Pages/SuperAdmin/UserManagment/UserManagement";
import InstitutionManagement from "./Pages/SuperAdmin/InstitutionManagement/InstitutionManagement";
import CampusManagement from "./Pages/SuperAdmin/CampusManagement/CampusManagement";
import CurricularProgram from "./Pages/SuperAdmin/CurricularPrograms/CurricularProgram";
import FacultyProfile from "./Pages/SuperAdmin/FacultyProfile/FacultyProfile";

//HEI Admin
import HEIDashboardPage from "./Pages/HEI/Dashboard/DashboardPage";
import HEIUserManagement from "./Pages/HEI/UserManagment/UserManagement";
import HEIInstitutionManagement from "./Pages/HEI/InstitutionManagement/InstitutionManagement";
import HEICampusManagement from "./Pages/HEI/CampusManagement/CampusManagement";
import HEICurricularProgram from "./Pages/HEI/CurricularPrograms/CurricularProgram";
import HEIFacultyProfile from "./Pages/HEI/FacultyProfile/FacultyProfile";

//HEI Staff

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

                {/* Protected Routes with Layout */}
                <Route element={<Layout />}>
                    {/* Super Admin Routes under /super-admin/* */}
                    <Route
                        element={
                            <ProtectedRoute allowedRoles={["Super Admin"]} />
                        }
                    >
                        <Route
                            path="/super-admin/dashboard"
                            element={<DashboardPage />}
                        />
                        <Route
                            path="/super-admin/user-management"
                            element={<UserManagement />}
                        />
                        <Route
                            path="/super-admin/institutions"
                            element={<InstitutionManagement />}
                        />
                        <Route
                            path="/super-admin/institutions/campuses/:institutionId"
                            element={<CampusManagement />}
                        />
                        <Route
                            path="/super-admin/institutions/curricular-programs/:institutionId"
                            element={<CurricularProgram />}
                        />
                        <Route
                            path="/super-admin/institutions/faculties/:institutionId"
                            element={<FacultyProfile />}
                        />
                    </Route>

                    {/* HEI Admin Routes under /hei-admin/* */}
                    <Route
                        element={
                            <ProtectedRoute allowedRoles={["HEI Admin"]} />
                        }
                    >
                        <Route
                            path="/hei-admin/dashboard"
                            element={<HEIDashboardPage />}
                        />
                        <Route
                            path="/hei-admin/institutions"
                            element={<HEIInstitutionManagement />}
                        />
                        <Route
                            path="/hei-admin/institutions/campuses/:institutionId"
                            element={<HEICampusManagement />}
                        />
                        <Route
                            path="/hei-admin/institutions/curricular-programs/:institutionId"
                            element={<HEICurricularProgram />}
                        />
                        <Route
                            path="/hei-admin/institutions/faculties/:institutionId"
                            element={<HEIFacultyProfile />}
                        />
                         <Route
                            path="/hei-admin/staff-management"
                            element={<HEIUserManagement />}
                        />
                    </Route>

                    {/* HEI Staff Routes under /hei-staff/* */}
                    <Route
                        element={
                            <ProtectedRoute allowedRoles={["HEI Staff"]} />
                        }
                    >
                        <Route
                            path="/hei-staff/dashboard"
                            element={<DashboardPage />}
                        />
                    </Route>

                    {/* Viewer Routes under /hei-staff/* (assuming shared access) */}
                    <Route
                        element={<ProtectedRoute allowedRoles={["Viewer"]} />}
                    >
                        <Route
                            path="/hei-staff/dashboard"
                            element={<DashboardPage />}
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
