import { useState } from "react";
import {
    User,
    Award,
    BookOpen,
    Plus,
} from "lucide-react";
import PropTypes from "prop-types";
import Dialog from "../../../../Components/Dialog";

function AddGraduateForm({ isOpen, onClose, onSave, institutionId, loading = false }) {
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
        authority_number: "",
        year_granted: "",
        report_year: new Date().getFullYear(),
    });

    const [errors, setErrors] = useState({});

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ""
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
        if (!formData.program_major.trim()) {
            newErrors.program_major = "Program major is required";
        }
        if (!formData.report_year) {
            newErrors.report_year = "Report year is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            const graduateData = {
                ...formData,
                suc_details_id: parseInt(institutionId),
                report_year: parseInt(formData.report_year),
                year_granted: formData.year_granted ? parseInt(formData.year_granted) : null,
            };
            onSave(graduateData);
        }
    };

    const handleClose = () => {
        setFormData({
            student_id: "",
            last_name: "",
            first_name: "",
            middle_name: "",
            date_of_birth: "",
            sex: "",
            date_graduated: "",
            program_name: "",
            program_major: "",
            authority_number: "",
            year_granted: "",
            report_year: new Date().getFullYear(),
        });
        setErrors({});
        onClose();
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={handleClose}
            title="Add New Graduate"
            subtitle="Create a new graduate record for the institution"
            icon={Plus}
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
                        <h3 className="text-base font-semibold text-gray-900">Student Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            {errors.student_id && <p className="text-red-500 text-xs mt-1">{errors.student_id}</p>}
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
                            {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
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
                            {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
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
                                Date of Birth <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={formData.date_of_birth}
                                onChange={(e) => handleInputChange("date_of_birth", e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                                    errors.date_of_birth ? "border-red-300 bg-red-50" : "border-gray-300"
                                }`}
                            />
                            {errors.date_of_birth && <p className="text-red-500 text-xs mt-1">{errors.date_of_birth}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Sex <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.sex}
                                onChange={(e) => handleInputChange("sex", e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                                    errors.sex ? "border-red-300 bg-red-50" : "border-gray-300"
                                }`}
                            >
                                <option value="">Select Sex</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                            {errors.sex && <p className="text-red-500 text-xs mt-1">{errors.sex}</p>}
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
                            {errors.program_name && <p className="text-red-500 text-xs mt-1">{errors.program_name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Program Major <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.program_major}
                                onChange={(e) => handleInputChange("program_major", e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 ${
                                    errors.program_major ? "border-red-300 bg-red-50" : "border-gray-300"
                                }`}
                            />
                            {errors.program_major && <p className="text-red-500 text-xs mt-1">{errors.program_major}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Authority Number
                            </label>
                            <input
                                type="text"
                                value={formData.authority_number}
                                onChange={(e) => handleInputChange("authority_number", e.target.value)}
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
                        <h3 className="text-base font-semibold text-gray-900">Graduation Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date Graduated
                            </label>
                            <input
                                type="date"
                                value={formData.date_graduated}
                                onChange={(e) => handleInputChange("date_graduated", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Year Granted
                            </label>
                            <input
                                type="number"
                                value={formData.year_granted}
                                onChange={(e) => handleInputChange("year_granted", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                                min="1900"
                                max={new Date().getFullYear()}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Report Year <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={formData.report_year}
                                onChange={(e) => handleInputChange("report_year", e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 ${
                                    errors.report_year ? "border-red-300 bg-red-50" : "border-gray-300"
                                }`}
                                min="1900"
                                max={new Date().getFullYear()}
                            />
                            {errors.report_year && <p className="text-red-500 text-xs mt-1">{errors.report_year}</p>}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end space-x-3 p-4 border-t">
                <button
                    onClick={handleClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Saving..." : "Save Graduate"}
                </button>
            </div>
        </Dialog>
    );
}

AddGraduateForm.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    institutionId: PropTypes.string.isRequired,
    loading: PropTypes.bool,
};

export default AddGraduateForm;
