import { useState, useEffect } from "react";
import {
    User,
    Award,
    BookOpen,
    Save,
    Edit,
} from "lucide-react";
import PropTypes from "prop-types";
import Dialog from "../../../../Components/Dialog";

function EditGraduateForm({ isOpen, onClose, onSave, graduateData, loading = false }) {
    const [formData, setFormData] = useState({
        student_id: "",
        last_name: "",
        first_name: "",
        middle_name: "",
        date_of_birth: "",
        sex: "",
        date_graduated: "",
        program_name: "",
        program_major: "",
        program_authority_to_operate_graduate: "",
        year_granted: "",
        report_year: new Date().getFullYear(),
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (graduateData) {
            setFormData({
                id: graduateData.id,
                student_id: graduateData.student_id || "",
                last_name: graduateData.last_name || "",
                first_name: graduateData.first_name || "",
                middle_name: graduateData.middle_name || "",
                date_of_birth: graduateData.date_of_birth || "",
                sex: graduateData.sex || "",
                date_graduated: graduateData.date_graduated || "",
                program_name: graduateData.program_name || "",
                program_major: graduateData.program_major || "",
                program_authority_to_operate_graduate: graduateData.program_authority_to_operate_graduate || "",
                year_granted: graduateData.year_granted || "",
                report_year: graduateData.report_year || new Date().getFullYear(),
            });
        }
    }, [graduateData]);

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: "",
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Required fields
        if (!formData.student_id.trim()) {
            newErrors.student_id = "Student ID is required";
        }
        if (!formData.last_name.trim()) {
            newErrors.last_name = "Last name is required";
        }
        if (!formData.first_name.trim()) {
            newErrors.first_name = "First name is required";
        }
        if (!formData.program_name.trim()) {
            newErrors.program_name = "Program name is required";
        }
        if (!formData.report_year) {
            newErrors.report_year = "Report year is required";
        }

        // Date validations
        if (formData.date_of_birth && new Date(formData.date_of_birth) > new Date()) {
            newErrors.date_of_birth = "Date of birth cannot be in the future";
        }
        if (formData.date_graduated && new Date(formData.date_graduated) > new Date()) {
            newErrors.date_graduated = "Graduation date cannot be in the future";
        }

        // Year validations
        if (formData.year_granted && (isNaN(formData.year_granted) || formData.year_granted < 1900 || formData.year_granted > new Date().getFullYear())) {
            newErrors.year_granted = "Invalid year granted";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onSave(formData);
        }
    };

    const handleClose = () => {
        setErrors({});
        onClose();
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={handleClose}
            title={`Edit ${graduateData?.first_name || "Graduate"}'s Information`}
            subtitle="Update graduate information and details"
            icon={Edit}
            variant="default"
            size="xl"
        >
            <div className="space-y-4 max-h-[600px] overflow-y-auto p-4">
                {/* Student Information */}
                <div className="bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-100 rounded-xl p-4 border border-blue-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-blue-500 rounded-lg shadow-sm">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">
                            Student Information
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Student ID <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.student_id}
                                onChange={(e) => handleInputChange("student_id", e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                                    errors.student_id ? "border-red-300 bg-red-50" : "border-gray-300"
                                }`}
                            />
                            {errors.student_id && (
                                <p className="text-red-500 text-xs mt-1">{errors.student_id}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Last Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.last_name}
                                onChange={(e) => handleInputChange("last_name", e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                                    errors.last_name ? "border-red-300 bg-red-50" : "border-gray-300"
                                }`}
                            />
                            {errors.last_name && (
                                <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                First Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.first_name}
                                onChange={(e) => handleInputChange("first_name", e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                                    errors.first_name ? "border-red-300 bg-red-50" : "border-gray-300"
                                }`}
                            />
                            {errors.first_name && (
                                <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Middle Name
                            </label>
                            <input
                                type="text"
                                value={formData.middle_name}
                                onChange={(e) => handleInputChange("middle_name", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date of Birth
                            </label>
                            <input
                                type="date"
                                value={formData.date_of_birth}
                                onChange={(e) => handleInputChange("date_of_birth", e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                                    errors.date_of_birth ? "border-red-300 bg-red-50" : "border-gray-300"
                                }`}
                            />
                            {errors.date_of_birth && (
                                <p className="text-red-500 text-xs mt-1">{errors.date_of_birth}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Sex
                            </label>
                            <select
                                value={formData.sex}
                                onChange={(e) => handleInputChange("sex", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                            >
                                <option value="">Select Sex</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Program Information */}
                <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 rounded-xl p-4 border border-emerald-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-emerald-500 rounded-lg shadow-sm">
                            <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">
                            Program Information
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Program Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.program_name}
                                onChange={(e) => handleInputChange("program_name", e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 ${
                                    errors.program_name ? "border-red-300 bg-red-50" : "border-gray-300"
                                }`}
                            />
                            {errors.program_name && (
                                <p className="text-red-500 text-xs mt-1">{errors.program_name}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Program Major
                            </label>
                            <input
                                type="text"
                                value={formData.program_major}
                                onChange={(e) => handleInputChange("program_major", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Authority to Operate
                            </label>
                            <input
                                type="text"
                                value={formData.program_authority_to_operate_graduate}
                                onChange={(e) => handleInputChange("program_authority_to_operate_graduate", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                            />
                        </div>
                    </div>
                </div>

                {/* Graduation Information */}
                <div className="bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-100 rounded-xl p-4 border border-purple-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-purple-500 rounded-lg shadow-sm">
                            <Award className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">
                            Graduation Information
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date Graduated
                            </label>
                            <input
                                type="date"
                                value={formData.date_graduated}
                                onChange={(e) => handleInputChange("date_graduated", e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 ${
                                    errors.date_graduated ? "border-red-300 bg-red-50" : "border-gray-300"
                                }`}
                            />
                            {errors.date_graduated && (
                                <p className="text-red-500 text-xs mt-1">{errors.date_graduated}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Year Granted
                            </label>
                            <input
                                type="number"
                                value={formData.year_granted}
                                onChange={(e) => handleInputChange("year_granted", e.target.value)}
                                min="1900"
                                max={new Date().getFullYear()}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 ${
                                    errors.year_granted ? "border-red-300 bg-red-50" : "border-gray-300"
                                }`}
                            />
                            {errors.year_granted && (
                                <p className="text-red-500 text-xs mt-1">{errors.year_granted}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Report Year <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.report_year}
                                onChange={(e) => handleInputChange("report_year", e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 ${
                                    errors.report_year ? "border-red-300 bg-red-50" : "border-gray-300"
                                }`}
                            >
                                {Array.from({ length: 10 }, (_, i) => {
                                    const year = new Date().getFullYear() - i;
                                    return (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    );
                                })}
                            </select>
                            {errors.report_year && (
                                <p className="text-red-500 text-xs mt-1">{errors.report_year}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                        onClick={handleClose}
                        disabled={loading}
                        className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Updating...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Update Graduate
                            </>
                        )}
                    </button>
                </div>
            </div>
        </Dialog>
    );
}

EditGraduateForm.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
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
    loading: PropTypes.bool,
};

export default EditGraduateForm;
