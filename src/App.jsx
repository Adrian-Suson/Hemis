import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import PropTypes from "prop-types";

// Import pages
import LoginPage from "./Pages/Auth/LoginPage";

//Super Admin
import DashboardPage from "./Pages/SuperAdmin/Dashboard/DashboardPage";
import UserManagement from "./Pages/SuperAdmin/UserManagment/UserManagement";
import InstitutionManagement from "./Pages/SuperAdmin/InstitutionManagement/InstitutionManagement";
import CampusManagement from "./Pages/SuperAdmin/CampusManagement/CampusManagement";
import CurricularProgram from "./Pages/SuperAdmin/CurricularPrograms/CurricularProgram";
import FacultyProfile from "./Pages/SuperAdmin/FacultyProfile/FacultyProfile";
import Graduates from "./Pages/SuperAdmin/Graduates/Graduates";

//HEI Admin
import HEIDashboardPage from "./Pages/HEI/Dashboard/DashboardPage";
import HEIUserManagement from "./Pages/HEI/UserManagment/UserManagement";
import HEIInstitutionManagement from "./Pages/HEI/InstitutionManagement/InstitutionManagement";
import HEICampusManagement from "./Pages/HEI/CampusManagement/CampusManagement";
import HEICurricularProgram from "./Pages/HEI/CurricularPrograms/CurricularProgram";
import HEIFacultyProfile from "./Pages/HEI/FacultyProfile/FacultyProfile";
import HEiGraduates from "./Pages/HEI/Graduates/Graduates";

//HEI Staff

// Utility Components
import ProtectedRoute from "./utils/ProtectedRoute";
import Layout from "./Layout/Layout";
import NotFound from "./utils/NotFound";
import Statistics from "./Pages/SuperAdmin/Statistics/Statistics";

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
                        <Route
                            path="/super-admin/institutions/graduates-list/:institutionId"
                            element={<Graduates />}
                        />

                        <Route
                            path="/super-admin/statistics"
                            element={<Statistics />}
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
                            path="/hei-admin/institutions/graduates-list/:institutionId"
                            element={<HEiGraduates />}
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
                            element={<HEIDashboardPage />}
                        />
                        <Route
                            path="/hei-staff/institutions"
                            element={<HEIInstitutionManagement />}
                        />
                        <Route
                            path="/hei-staff/institutions/campuses/:institutionId"
                            element={<HEICampusManagement />}
                        />
                        <Route
                            path="/hei-staff/institutions/curricular-programs/:institutionId"
                            element={<HEICurricularProgram />}
                        />
                        <Route
                            path="/hei-staff/institutions/faculties/:institutionId"
                            element={<HEIFacultyProfile />}
                        />
                        <Route
                            path="/hei-staff/institutions/graduates-list/:institutionId"
                            element={<HEiGraduates />}
                        />
                        <Route
                            path="/hei-staff/staff-management"
                            element={<HEIUserManagement />}
                        />
                    </Route>



                    {/* Catch all route for 404 */}

                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;
