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
import SucPrograms from "./Pages/SuperAdmin/Suc/SucPrograms/SucPrograms";
import SucHeiManagement from "./Pages/SuperAdmin/Suc/SucHeis/SucHeiManagement";
import PrivateHeiManagement from "./Pages/SuperAdmin/Private/PrivateHeiManagement/PrivateHeiManagement";
import LucHeiManagement from "./Pages/SuperAdmin/Luc/LucHeis/LucHeisManagement";
import SucCampuses from "./Pages/SuperAdmin/Suc/SucCampuses/SucCampuses";
import SucFormE1 from "./Pages/SuperAdmin/Suc/SucFormE1/SucFormE1";
import SucFormE2 from "./Pages/SuperAdmin/Suc/SucFormE2/SucFormE2";
import SucFormGH from "./Pages/SuperAdmin/Suc/SucFormGH/SucFormGH";
import HeiManagement from "./Pages/SuperAdmin/HeisManagement/HeiManagement";
import ResearchManagement from "./Pages/SuperAdmin/Suc/Research/ResearchManagement";
import LucDeanProfiles from "./Pages/SuperAdmin/Luc/LucDeanProfiles/LucDeanProfiles";
import PublicDashboard from "./Pages/Public/PublicDashboard";

// Utility Components
import ProtectedRoute from "./utils/ProtectedRoute";
import Layout from "./Layout/Layout";
import NotFound from "./utils/NotFound";
import UserManagement from "./Pages/SuperAdmin/UserManagment/UserManagement";
import SucPcrGraduates from "./Pages/SuperAdmin/Suc/SucPcrGraduates/SucPcrGraduates";
import LucFormerNames from "./Pages/SuperAdmin/Luc/LucFormerNames/LucFormerNames";


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

                {/* Public Route: Dashboard */}
                <Route path="/dashboard" element={<PublicDashboard />} />

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
                        <Route path="/super-admin/institutions/luc" element={<LucHeiManagement />} />
                        <Route path="/super-admin/institutions/luc/former-names/:lucDetailId" element={<LucFormerNames />} />
                        <Route path="/super-admin/institutions/private" element={<PrivateHeiManagement />} />
                        <Route path="/super-admin/institutions/suc/campuses/:SucDetailId" element={<SucCampuses />} />
                        <Route path="/super-admin/institutions/suc/programs/:SucDetailId" element={<SucPrograms />} />
                        <Route path="/super-admin/institutions/suc/graduates/:SucDetailId" element={<SucPcrGraduates />} />
                        <Route path="/super-admin/institutions/suc/form-e1/:SucDetailId" element={<SucFormE1 />} />
                        <Route path="/super-admin/institutions/suc/form-e2/:SucDetailId" element={<SucFormE2 />} />
                        <Route path="/super-admin/institutions/suc/form-gh/:SucDetailId" element={<SucFormGH />} />
                        <Route path="/super-admin/institutions/suc/research/:heiId" element={<ResearchManagement />} />
                        <Route path="/super-admin/institutions/luc/campuses/:lucDetailId" element={<LucHeiManagement />} />
                        <Route path="/super-admin/institutions/private/campuses/:privateDetailId" element={<PrivateHeiManagement />} />
                        <Route path="/super-admin/user-management" element={<UserManagement />} />
                        <Route path="/super-admin/hei-management" element={<HeiManagement />} />
                        <Route path="/super-admin/institutions/luc/dean-profiles/:lucDetailId" element={<LucDeanProfiles />} />
                    </Route>

                    {/* HEI Admin Routes under /hei-admin/* */}
                    <Route
                        element={
                            <ProtectedRoute allowedRoles={["hei-admin"]} />
                        }
                    >
                        {/* Add HEI Admin routes here */}
                    </Route>

                    {/* HEI Staff Routes under /hei-staff/* */}
                    <Route
                        element={
                            <ProtectedRoute allowedRoles={["hei-staff"]} />
                        }
                    >
                        {/* Add HEI Staff routes here */}
                    </Route>

                    {/* Catch all route for 404 */}
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </Router>
    );
}

App.propTypes = {
    // Since this is the root component that doesn't receive any props,
    // we don't need to define any prop types
};

export default App;

