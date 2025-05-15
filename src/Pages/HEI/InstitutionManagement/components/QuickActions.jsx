// src/components/InstitutionManagement/QuickActions.jsx
import PropTypes from "prop-types";
import {
    FileSpreadsheet,
    Clipboard,
    Building,
    Users,
    BookOpen,
    Award,
    Trash2,
} from "lucide-react";
import ActionButton from "./ActionButton";

const CHED_COLORS = {
    yellow: "#FCD116",
    blue: "#0038A8",
};

const QuickActions = ({
    institution,
    loading,
    handleExportToFormA,
    handleNavigation,
    handleConfirmDelete,
    reportYearFilter,
}) => (
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
                            `/hei-admin/institutions/campuses/${institution.id}/${reportYearFilter}`,
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
                            `/hei-admin/institutions/faculties/${institution.id}/${reportYearFilter}`,
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
                            `/hei-admin/institutions/curricular-programs/${institution.id}/${reportYearFilter}`,
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
                            `/hei-admin/institutions/graduates-list/${institution.id}/${reportYearFilter}`,
                            "graduates"
                        )
                    }
                    loading={loading.graduates}
                    disabled={loading.graduates}
                    variant="secondary"
                />
            </div>
            <ActionButton
                icon={<Trash2 />}
                label="Delete Institution"
                onClick={handleConfirmDelete}
                loading={loading.deleteInstitution}
                disabled={loading.deleteInstitution}
                variant="warning"
            />
        </div>
    </>
);

QuickActions.propTypes = {
    institution: PropTypes.object.isRequired,
    loading: PropTypes.object.isRequired,
    handleExportToFormA: PropTypes.func.isRequired,
    handleNavigation: PropTypes.func.isRequired,
    handleConfirmDelete: PropTypes.func.isRequired,
    reportYearFilter: PropTypes.string.isRequired,
};

export default QuickActions;