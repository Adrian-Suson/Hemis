// src/components/InstitutionManagement/QuickActions.jsx
import PropTypes from "prop-types";
import {
    FileSpreadsheet,
    Clipboard,
    Building,
    Users,
    BookOpen,
    Award,
} from "lucide-react";
import ActionButton from "./ActionButton";
import { encryptId } from "../../../../utils/encryption";

const CHED_COLORS = {
    yellow: "#FCD116",
    blue: "#0038A8",
};

const QuickActions = ({
    institution,
    loading,
    handleExportToFormA,
    handleNavigation,
}) => {
    const currentUser = JSON.parse(localStorage.getItem("user")); // Get the current logged-in user
    const isStaff = currentUser?.role === "hei-staff"; // Check if the role is HEI Staff
    const basePath = isStaff ? "/hei-staff/institutions" : "/hei-admin/institutions"; // Adjust base path based on role

    return (
        <>
            <div className="bg-white rounded-lg shadow-sm mb-4">
                <div className="px-4 py-2 border-b border-gray-200 flex items-center">
                    <div
                        className="rounded-full p-1.5 mr-2"
                        style={{ backgroundColor: `${CHED_COLORS.yellow}15` }}
                    >
                        <FileSpreadsheet
                            className="w-4 h-4"
                            style={{ color: CHED_COLORS.yellow }}
                        />
                    </div>
                    <h3 className="text-sm font-medium">Exports</h3>
                </div>
                <div className="p-3">
                    <ActionButton
                        icon={<FileSpreadsheet />}
                        label="Export to Form A"
                        onClick={handleExportToFormA}
                        loading={loading.exportFormA}
                        disabled={loading.exportFormA}
                        variant="secondary"
                    />
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-3">
                <h3 className="text-sm font-medium text-gray-800 flex items-center mb-2 pb-2 border-b border-gray-100">
                    <Clipboard className="w-4 h-4 mr-1.5" style={{ color: CHED_COLORS.blue }} />
                    Management Options
                </h3>
                <div className="grid grid-cols-2 gap-2">
                    <ActionButton
                        icon={<Building />}
                        label="Campuses"
                        onClick={() =>
                            handleNavigation(
                                `${basePath}/campuses/${encryptId(institution.id)}`,
                                "viewCampuses"
                            )
                        }
                        loading={loading.viewCampuses}
                        disabled={loading.viewCampuses}
                        variant="secondary"
                    />
                    <ActionButton
                        icon={<Users />}
                        label="Faculties"
                        onClick={() =>
                            handleNavigation(
                                `${basePath}/faculties/${encryptId(institution.id)}`,
                                "faculties"
                            )
                        }
                        loading={loading.faculties}
                        disabled={loading.faculties}
                        variant="secondary"
                    />
                    <ActionButton
                        icon={<BookOpen />}
                        label="Programs"
                        onClick={() =>
                            handleNavigation(
                                `${basePath}/curricular-programs/${encryptId(institution.id)}`,
                                "curricularPrograms"
                            )
                        }
                        loading={loading.curricularPrograms}
                        disabled={loading.curricularPrograms}
                        variant="secondary"
                    />
                    <ActionButton
                        icon={<Award />}
                        label="Graduates"
                        onClick={() =>
                            handleNavigation(
                                `${basePath}/graduates-list/${encryptId(institution.id)}`,
                                "graduates"
                            )
                        }
                        loading={loading.graduates}
                        disabled={loading.graduates}
                        variant="secondary"
                    />
                </div>
            </div>
        </>
    );
};

QuickActions.propTypes = {
    institution: PropTypes.object.isRequired,
    loading: PropTypes.object.isRequired,
    handleExportToFormA: PropTypes.func.isRequired,
    handleNavigation: PropTypes.func.isRequired,
    handleConfirmDelete: PropTypes.func.isRequired,
    reportYearFilter: PropTypes.string.isRequired,
};

export default QuickActions;
