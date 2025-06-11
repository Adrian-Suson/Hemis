import { User, Calendar, Award, BookOpen } from "lucide-react";
import PropTypes from "prop-types";
import Dialog from "../../../../Components/Dialog";

function GraduateDetailsView({ isOpen, onClose, graduateData }) {
    if (!graduateData) return null;

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-PH", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // Safe value conversion function
    const safeValue = (value, defaultValue = "Not specified") => {
        if (value === null || value === undefined || value === '') {
            return defaultValue;
        }
        if (typeof value === 'object') {
            return String(value) || defaultValue;
        }
        return String(value);
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title={`${safeValue(graduateData.last_name)}, ${safeValue(graduateData.first_name)}`}
            subtitle="Graduate Information"
            icon={User}
            variant="view"
            size="lg"
        >
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {/* Student Information */}
                <div className="bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-100 rounded-xl p-4 border border-blue-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-blue-500 rounded-lg shadow-sm">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">Student Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <p className="text-sm text-gray-900 font-semibold">
                                {`${safeValue(graduateData.last_name)}, ${safeValue(graduateData.first_name)} ${
                                    safeValue(graduateData.middle_name, "")
                                }`}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Student ID</label>
                            <p className="text-sm text-gray-900">{safeValue(graduateData.student_id)}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                <Calendar className="w-4 h-4 inline mr-1" />
                                Date of Birth
                            </label>
                            <p className="text-sm text-gray-900">{formatDate(graduateData.date_of_birth)}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Sex</label>
                            <p className="text-sm text-gray-900">{safeValue(graduateData.sex)}</p>
                        </div>
                    </div>
                </div>

                {/* Program Information */}
                <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 rounded-xl p-4 border border-emerald-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-emerald-500 rounded-lg shadow-sm">
                            <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">Program Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Program Name</label>
                            <p className="text-sm text-gray-900">{safeValue(graduateData.program_name)}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Program Major</label>
                            <p className="text-sm text-gray-900">{safeValue(graduateData.program_major)}</p>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Authority to Operate</label>
                            <p className="text-sm text-gray-900">{safeValue(graduateData.program_authority_to_operate_graduate)}</p>
                        </div>
                    </div>
                </div>

                {/* Graduation Information */}
                <div className="bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-100 rounded-xl p-4 border border-purple-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-purple-500 rounded-lg shadow-sm">
                            <Award className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">Graduation Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                <Calendar className="w-4 h-4 inline mr-1" />
                                Date Graduated
                            </label>
                            <p className="text-sm text-gray-900">{formatDate(graduateData.date_graduated)}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Year Granted</label>
                            <p className="text-sm text-gray-900">{safeValue(graduateData.year_granted)}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Report Year</label>
                            <p className="text-sm text-gray-900">{safeValue(graduateData.report_year)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    );
}

GraduateDetailsView.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    graduateData: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        student_id: PropTypes.string,
        last_name: PropTypes.string,
        first_name: PropTypes.string,
        middle_name: PropTypes.string,
        date_of_birth: PropTypes.string,
        sex: PropTypes.string,
        date_graduated: PropTypes.string,
        program_name: PropTypes.string,
        program_major: PropTypes.string,
        program_authority_to_operate_graduate: PropTypes.string,
        year_granted: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        report_year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
};

export default GraduateDetailsView;
