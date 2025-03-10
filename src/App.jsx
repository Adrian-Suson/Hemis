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
import FacultyProfile from "./Pages/FacultyProfile/FacultyProfile";

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
                        <Route
                            path="admin/institutions/faculties/:institutionId"
                            element={<FacultyProfile />}
                        />

                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
