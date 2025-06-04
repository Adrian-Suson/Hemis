import {
    User,
    Building,
    DollarSign,
    AlertCircle,
    Plus,
} from "lucide-react";
import PropTypes from "prop-types";
import Dialog from "../../../../Components/Dialog";
import { useFacultyFormLogic } from "../../../../hooks/useFacultyFormLogic";

const AddFacultyForm = ({ isOpen, onClose, onSave, institutionId }) => {
    const {
        formData,
        errors,
        handleInputChange,
        validateForm,
        facultyRankOptions,
        tenuredOptions,
        annualSalaryOptions,
        onLeavePayOptions,
        fullTimeEquivalentOptions,
        genderOptions,
        highestDegreeOptions,
        pursuingNextDegreeOptions,
        thesisOptions,
        dissertationOptions,
        facultyTypeOptions,
        resetForm,
    } = useFacultyFormLogic(institutionId);

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Clean data before submission
        const cleanedData = { ...formData };

        // Convert numeric fields
        const numericFields = [
            'annual_basic_salary', 'ssl_salary_grade', 'full_time_equivalent',
            'on_leave_without_pay', 'pursuing_next_degree', 'masters_with_thesis', 'doctorate_with_dissertation',
            'undergrad_lab_credit_units', 'undergrad_lecture_credit_units', 'undergrad_total_credit_units',
            'undergrad_lab_hours_per_week', 'undergrad_lecture_hours_per_week', 'undergrad_total_hours_per_week',
            'undergrad_lab_contact_hours', 'undergrad_lecture_contact_hours', 'undergrad_total_contact_hours',
            'graduate_lab_credit_units', 'graduate_lecture_credit_units', 'graduate_total_credit_units',
            'graduate_lab_contact_hours', 'graduate_lecture_contact_hours', 'graduate_total_contact_hours',
            'research_load', 'extension_services_load', 'study_load', 'production_load',
            'administrative_load', 'other_load_credits', 'total_work_load', 'report_year'
        ];

        numericFields.forEach(field => {
             // Convert to number only if the value is not an empty string, otherwise keep as empty string
            cleanedData[field] = cleanedData[field] === "" ? "" : parseFloat(cleanedData[field]) || 0;
        });

        onSave(cleanedData);
    };

    // Handle close
    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={handleClose}
            title="Add Faculty Member"
            subtitle="Create a new faculty record"
            icon={Plus}
            variant="form"
            size="xl"
        >
            <div className="space-y-6 max-h-[600px] overflow-y-auto p-4 ">
                <form onSubmit={handleSubmit}>
                    {/* Personal Information */}
                    <div className="bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-100 rounded-xl m-2 p-4 border border-blue-200/60 shadow-sm">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="p-2 bg-blue-500 rounded-lg shadow-sm">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">Personal Information</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                        errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                    required
                                />
                                {errors.name && (
                                    <div className="flex items-center mt-1 text-red-600 text-sm">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.name}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Gender <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.gender}
                                    onChange={(e) => handleInputChange("gender", e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors ${
                                        errors.gender ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                    required
                                >
                                    <option value="">Select Gender</option>
                                    {genderOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.gender && (
                                    <div className="flex items-center mt-1 text-red-600 text-sm">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.gender}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Faculty Rank
                                </label>
                                <select
                                    value={formData.generic_faculty_rank}
                                    onChange={(e) => handleInputChange("generic_faculty_rank", e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors ${
                                        errors.generic_faculty_rank ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">Select Faculty Rank</option>
                                     {facultyRankOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                 {errors.generic_faculty_rank && (
                                    <div className="flex items-center mt-1 text-red-600 text-sm">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.generic_faculty_rank}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Faculty Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.faculty_type}
                                    onChange={(e) => handleInputChange("faculty_type", e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors ${
                                        errors.faculty_type ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                    required
                                >
                                    <option value="">Select Faculty Type</option>
                                    {facultyTypeOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.faculty_type && (
                                    <div className="flex items-center mt-1 text-red-600 text-sm">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.faculty_type}
                                    </div>
                                )}
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tenure Status
                                </label>
                                <select
                                    value={formData.is_tenured}
                                    onChange={(e) => handleInputChange("is_tenured", e.target.value)}
                                     className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors ${
                                        errors.is_tenured ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">Select Tenure Status</option>
                                    {tenuredOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                 {errors.is_tenured && (
                                    <div className="flex items-center mt-1 text-red-600 text-sm">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.is_tenured}
                                    </div>
                                )}
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Salary Grade
                                </label>
                                <input
                                    type="number"
                                    value={formData.ssl_salary_grade}
                                    onChange={(e) => handleInputChange("ssl_salary_grade", e.target.value)}
                                     className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                        errors.ssl_salary_grade ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                    min="1"
                                    max="33"
                                />
                                {errors.ssl_salary_grade && (
                                    <div className="flex items-center mt-1 text-red-600 text-sm">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.ssl_salary_grade}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Department & Salary Information */}
                    <div className="grid m-2 grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Department Information */}
                        <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 rounded-xl p-4 border border-emerald-200/60 shadow-sm">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-2 bg-emerald-500 rounded-lg shadow-sm">
                                    <Building className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-base font-semibold text-gray-900">Department & Position</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Home College
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.home_college}
                                        onChange={(e) => handleInputChange("home_college", e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                            errors.home_college ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                    />
                                     {errors.home_college && (
                                        <div className="flex items-center mt-1 text-red-600 text-sm">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {errors.home_college}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Home Department
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.home_department}
                                        onChange={(e) => handleInputChange("home_department", e.target.value)}
                                         className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                            errors.home_department ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                    />
                                     {errors.home_department && (
                                        <div className="flex items-center mt-1 text-red-600 text-sm">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {errors.home_department}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Full-Time Equivalent
                                    </label>
                                    <select
                                        value={formData.full_time_equivalent}
                                        onChange={(e) => handleInputChange("full_time_equivalent", e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors ${
                                            errors.full_time_equivalent ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">Select FTE</option>
                                         {fullTimeEquivalentOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                     {errors.full_time_equivalent && (
                                        <div className="flex items-center mt-1 text-red-600 text-sm">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {errors.full_time_equivalent}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        On Leave Without Pay
                                    </label>
                                    <select
                                        value={formData.on_leave_without_pay}
                                        onChange={(e) => handleInputChange("on_leave_without_pay", e.target.value)}
                                         className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors ${
                                            errors.on_leave_without_pay ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">Select Leave Status</option>
                                        {onLeavePayOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                     {errors.on_leave_without_pay && (
                                        <div className="flex items-center mt-1 text-red-600 text-sm">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {errors.on_leave_without_pay}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Salary Information */}
                        <div className="bg-gradient-to-br m-2 from-amber-50 via-orange-50 to-yellow-100 rounded-xl p-4 border border-amber-200/60 shadow-sm">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-2 bg-amber-500 rounded-lg shadow-sm">
                                    <DollarSign className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-base font-semibold text-gray-900">Salary Information</h3>
                            </div>
                            <div className="space-y-4">
                                 <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Annual Basic Salary
                                    </label>
                                    <select
                                        value={formData.annual_basic_salary}
                                        onChange={(e) => handleInputChange("annual_basic_salary", e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors ${
                                            errors.annual_basic_salary ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">Select Annual Basic Salary</option>
                                         {annualSalaryOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                     {errors.annual_basic_salary && (
                                        <div className="flex items-center mt-1 text-red-600 text-sm">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {errors.annual_basic_salary}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Report Year
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.report_year}
                                        onChange={(e) => handleInputChange("report_year", e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                            errors.report_year ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                        min="2020"
                                        max="2030"
                                    />
                                     {errors.report_year && (
                                        <div className="flex items-center mt-1 text-red-600 text-sm">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {errors.report_year}
                                        </div>
                                    )}
                                </div>
                                <div className="bg-white/60 rounded-lg p-3 border">
                                    <div className="text-sm text-gray-600 mb-1">Current Total Workload:</div>
                                    <div className="text-lg font-bold text-amber-900">
                                        {formData.total_work_load || 0} units
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Academic Qualifications */}
                    <div className="bg-gradient-to-br m-2 from-purple-50 via-violet-50 to-indigo-100 rounded-xl p-4 border border-purple-200/60 shadow-sm">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="p-2 bg-purple-500 rounded-lg shadow-sm">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">Academic Qualifications</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Highest Degree Attained <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.highest_degree_attained}
                                        onChange={(e) => handleInputChange("highest_degree_attained", e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors ${
                                            errors.highest_degree_attained ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                        required
                                    >
                                        <option value="">Select Highest Degree</option>
                                        {highestDegreeOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.highest_degree_attained && (
                                        <div className="flex items-center mt-1 text-red-600 text-sm">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {errors.highest_degree_attained}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Pursuing Next Degree
                                    </label>
                                    <select
                                        value={formData.pursuing_next_degree}
                                        onChange={(e) => handleInputChange("pursuing_next_degree", e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors ${
                                            errors.pursuing_next_degree ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">Select Status</option>
                                        {pursuingNextDegreeOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                     {errors.pursuing_next_degree && (
                                        <div className="flex items-center mt-1 text-red-600 text-sm">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {errors.pursuing_next_degree}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Masters with Thesis
                                    </label>
                                    <select
                                        value={formData.masters_with_thesis}
                                        onChange={(e) => handleInputChange("masters_with_thesis", e.target.value)}
                                         className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors ${
                                            errors.masters_with_thesis ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">Select Option</option>
                                        {thesisOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                     {errors.masters_with_thesis && (
                                        <div className="flex items-center mt-1 text-red-600 text-sm">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {errors.masters_with_thesis}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Doctorate with Dissertation
                                    </label>
                                    <select
                                        value={formData.doctorate_with_dissertation}
                                        onChange={(e) => handleInputChange("doctorate_with_dissertation", e.target.value)}
                                         className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors ${
                                            errors.doctorate_with_dissertation ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">Select Option</option>
                                        {dissertationOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                     {errors.doctorate_with_dissertation && (
                                        <div className="flex items-center mt-1 text-red-600 text-sm">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {errors.doctorate_with_dissertation}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Primary Teaching Discipline
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.discipline_teaching_load_1}
                                        onChange={(e) => handleInputChange("discipline_teaching_load_1", e.target.value)}
                                         className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                            errors.discipline_teaching_load_1 ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                    />
                                     {errors.discipline_teaching_load_1 && (
                                        <div className="flex items-center mt-1 text-red-600 text-sm">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {errors.discipline_teaching_load_1}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Secondary Teaching Discipline
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.discipline_teaching_load_2}
                                        onChange={(e) => handleInputChange("discipline_teaching_load_2", e.target.value)}
                                         className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                            errors.discipline_teaching_load_2 ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                    />
                                     {errors.discipline_teaching_load_2 && (
                                        <div className="flex items-center mt-1 text-red-600 text-sm">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {errors.discipline_teaching_load_2}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Bachelor&#39;s Discipline
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.discipline_bachelors}
                                        onChange={(e) => handleInputChange("discipline_bachelors", e.target.value)}
                                         className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                            errors.discipline_bachelors ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                    />
                                     {errors.discipline_bachelors && (
                                        <div className="flex items-center mt-1 text-red-600 text-sm">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {errors.discipline_bachelors}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Master&#39;s Discipline
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.discipline_masters}
                                        onChange={(e) => handleInputChange("discipline_masters", e.target.value)}
                                         className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                            errors.discipline_masters ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                    />
                                     {errors.discipline_masters && (
                                        <div className="flex items-center mt-1 text-red-600 text-sm">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {errors.discipline_masters}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Doctorate Discipline
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.discipline_doctorate}
                                        onChange={(e) => handleInputChange("discipline_doctorate", e.target.value)}
                                         className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                            errors.discipline_doctorate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                    />
                                     {errors.discipline_doctorate && (
                                        <div className="flex items-center mt-1 text-red-600 text-sm">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {errors.discipline_doctorate}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Teaching Load */}
                    <div className="grid m-2 grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Undergraduate Teaching */}
                        <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-100 rounded-xl p-4 border border-indigo-200/60 shadow-sm">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-2 bg-indigo-500 rounded-lg shadow-sm">
                                    <Plus className="w-5 h-5 text-white" /> {/* Replaced with Plus or appropriate icon */}
                                </div>
                                <h3 className="text-base font-semibold text-gray-900">Undergraduate Teaching</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Lab Units
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.undergrad_lab_credit_units}
                                            onChange={(e) => handleInputChange("undergrad_lab_credit_units", e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                                errors.undergrad_lab_credit_units ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                            }`}
                                            min="0"
                                            step="0.5"
                                        />
                                         {errors.undergrad_lab_credit_units && (
                                            <div className="flex items-center mt-1 text-red-600 text-sm">
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                {errors.undergrad_lab_credit_units}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Lecture Units
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.undergrad_lecture_credit_units}
                                            onChange={(e) => handleInputChange("undergrad_lecture_credit_units", e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                                errors.undergrad_lecture_credit_units ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                            }`}
                                            min="0"
                                            step="0.5"
                                        />
                                         {errors.undergrad_lecture_credit_units && (
                                            <div className="flex items-center mt-1 text-red-600 text-sm">
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                {errors.undergrad_lecture_credit_units}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Total Units
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.undergrad_total_credit_units || 0}
                                            readOnly
                                            className="w-full px-3 py-2 border border-indigo-300 rounded-lg bg-indigo-50 text-indigo-900 font-semibold"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Lab Hours/Week
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.undergrad_lab_hours_per_week}
                                            onChange={(e) => handleInputChange("undergrad_lab_hours_per_week", e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                                errors.undergrad_lab_hours_per_week ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                            }`}
                                            min="0"
                                            step="0.5"
                                        />
                                         {errors.undergrad_lab_hours_per_week && (
                                            <div className="flex items-center mt-1 text-red-600 text-sm">
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                {errors.undergrad_lab_hours_per_week}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Lecture Hours/Week
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.undergrad_lecture_hours_per_week}
                                            onChange={(e) => handleInputChange("undergrad_lecture_hours_per_week", e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                                errors.undergrad_lecture_hours_per_week ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                            }`}
                                            min="0"
                                            step="0.5"
                                        />
                                         {errors.undergrad_lecture_hours_per_week && (
                                            <div className="flex items-center mt-1 text-red-600 text-sm">
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                {errors.undergrad_lecture_hours_per_week}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Total Hours/Week
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.undergrad_total_hours_per_week || 0}
                                            readOnly
                                            className="w-full px-3 py-2 border border-indigo-300 rounded-lg bg-indigo-50 text-indigo-900 font-semibold"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Lab Contact Hours
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.undergrad_lab_contact_hours}
                                            onChange={(e) => handleInputChange("undergrad_lab_contact_hours", e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                                errors.undergrad_lab_contact_hours ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                            }`}
                                            min="0"
                                            step="0.5"
                                        />
                                         {errors.undergrad_lab_contact_hours && (
                                            <div className="flex items-center mt-1 text-red-600 text-sm">
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                {errors.undergrad_lab_contact_hours}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Lecture Contact Hours
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.undergrad_lecture_contact_hours}
                                            onChange={(e) => handleInputChange("undergrad_lecture_contact_hours", e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                                errors.undergrad_lecture_contact_hours ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                            }`}
                                            min="0"
                                            step="0.5"
                                        />
                                         {errors.undergrad_lecture_contact_hours && (
                                            <div className="flex items-center mt-1 text-red-600 text-sm">
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                {errors.undergrad_lecture_contact_hours}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Total Contact Hours
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.undergrad_total_contact_hours || 0}
                                            readOnly
                                            className="w-full px-3 py-2 border border-indigo-300 rounded-lg bg-indigo-50 text-indigo-900 font-semibold"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Graduate Teaching */}
                        <div className="bg-gradient-to-br m-2 from-rose-50 via-pink-50 to-red-100 rounded-xl p-4 border border-rose-200/60 shadow-sm">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-2 bg-rose-500 rounded-lg shadow-sm">
                                    <Plus className="w-5 h-5 text-white" /> {/* Replaced with Plus or appropriate icon */}
                                </div>
                                <h3 className="text-base font-semibold text-gray-900">Graduate Teaching</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Lab Units
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.graduate_lab_credit_units}
                                            onChange={(e) => handleInputChange("graduate_lab_credit_units", e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                                errors.graduate_lab_credit_units ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                            }`}
                                            min="0"
                                            step="0.5"
                                        />
                                         {errors.graduate_lab_credit_units && (
                                            <div className="flex items-center mt-1 text-red-600 text-sm">
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                {errors.graduate_lab_credit_units}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Lecture Units
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.graduate_lecture_credit_units}
                                            onChange={(e) => handleInputChange("graduate_lecture_credit_units", e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                                errors.graduate_lecture_credit_units ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                            }`}
                                            min="0"
                                            step="0.5"
                                        />
                                         {errors.graduate_lecture_credit_units && (
                                            <div className="flex items-center mt-1 text-red-600 text-sm">
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                {errors.graduate_lecture_credit_units}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Total Units
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.graduate_total_credit_units || 0}
                                            readOnly
                                            className="w-full px-3 py-2 border border-rose-300 rounded-lg bg-rose-50 text-rose-900 font-semibold"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Lab Contact Hours
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.graduate_lab_contact_hours}
                                            onChange={(e) => handleInputChange("graduate_lab_contact_hours", e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                                errors.graduate_lab_contact_hours ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                            }`}
                                            min="0"
                                            step="0.5"
                                        />
                                         {errors.graduate_lab_contact_hours && (
                                            <div className="flex items-center mt-1 text-red-600 text-sm">
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                {errors.graduate_lab_contact_hours}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Lecture Contact Hours
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.graduate_lecture_contact_hours}
                                            onChange={(e) => handleInputChange("graduate_lecture_contact_hours", e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                                errors.graduate_lecture_contact_hours ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                            }`}
                                            min="0"
                                            step="0.5"
                                        />
                                         {errors.graduate_lecture_contact_hours && (
                                            <div className="flex items-center mt-1 text-red-600 text-sm">
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                {errors.graduate_lecture_contact_hours}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Total Contact Hours</label>
                                        <input
                                            type="number"
                                            value={formData.graduate_total_contact_hours || 0}
                                            readOnly
                                            className="w-full px-3 py-2 border border-rose-300 rounded-lg bg-rose-50 text-rose-900 font-semibold"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Workload */}
                    <div className="bg-gradient-to-br m-2 from-teal-50 via-cyan-50 to-blue-100 rounded-xl p-4 border border-teal-200/60 shadow-sm">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="p-2 bg-teal-500 rounded-lg shadow-sm">
                                <Plus className="w-5 h-5 text-white" /> {/* Replaced with Plus or appropriate icon */}
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">Additional Workload</h3>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Research Load
                                </label>
                                <input
                                    type="number"
                                    value={formData.research_load}
                                    onChange={(e) => handleInputChange("research_load", e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                        errors.research_load ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                    min="0"
                                    step="0.5"
                                />
                                 {errors.research_load && (
                                    <div className="flex items-center mt-1 text-red-600 text-sm">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.research_load}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Extension Services
                                </label>
                                <input
                                    type="number"
                                    value={formData.extension_services_load}
                                    onChange={(e) => handleInputChange("extension_services_load", e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                        errors.extension_services_load ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                    min="0"
                                    step="0.5"
                                />
                                 {errors.extension_services_load && (
                                    <div className="flex items-center mt-1 text-red-600 text-sm">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.extension_services_load}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Study Load
                                </label>
                                <input
                                    type="number"
                                    value={formData.study_load}
                                    onChange={(e) => handleInputChange("study_load", e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                        errors.study_load ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                    min="0"
                                    step="0.5"
                                />
                                 {errors.study_load && (
                                    <div className="flex items-center mt-1 text-red-600 text-sm">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.study_load}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Production Load
                                </label>
                                <input
                                    type="number"
                                    value={formData.production_load}
                                    onChange={(e) => handleInputChange("production_load", e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                        errors.production_load ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                    min="0"
                                    step="0.5"
                                />
                                 {errors.production_load && (
                                    <div className="flex items-center mt-1 text-red-600 text-sm">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.production_load}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Administrative Load
                                </label>
                                <input
                                    type="number"
                                    value={formData.administrative_load}
                                    onChange={(e) => handleInputChange("administrative_load", e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                        errors.administrative_load ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                    min="0"
                                    step="0.5"
                                />
                                 {errors.administrative_load && (
                                    <div className="flex items-center mt-1 text-red-600 text-sm">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.administrative_load}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Other Load Credits
                                </label>
                                <input
                                    type="number"
                                    value={formData.other_load_credits}
                                    onChange={(e) => handleInputChange("other_load_credits", e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                        errors.other_load_credits ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                    min="0"
                                    step="0.5"
                                />
                                 {errors.other_load_credits && (
                                    <div className="flex items-center mt-1 text-red-600 text-sm">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.other_load_credits}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="bg-white/80 rounded-lg p-4 border-2 border-teal-300">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-teal-900">{formData.total_work_load || 0}</div>
                                    <div className="text-sm font-semibold text-teal-700">Total Workload</div>
                                    <div className="text-xs text-gray-600 mt-1">
                                        Teaching: {(formData.undergrad_total_credit_units || 0) + (formData.graduate_total_credit_units || 0)} units |
                                        Other: {(formData.total_work_load || 0) - ((formData.undergrad_total_credit_units || 0) + (formData.graduate_total_credit_units || 0))} units
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Validation Summary */}
                    {Object.keys(errors).length > 0 && ( Object.keys(errors).filter(key => errors[key] !== null).length > 0 ) && (
                        <div className="bg-red-50 border m-2 border-red-200 rounded-xl p-4">
                            <div className="flex items-center mb-2">
                                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                                <h4 className="text-sm font-semibold text-red-800">Please correct the following errors:</h4>
                            </div>
                            <ul className="text-sm text-red-700 space-y-1">
                                {Object.entries(errors).map(([field, error]) => error && (
                                    <li key={field} className="flex items-center">
                                        <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                                        {error}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-3  m-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </Dialog>
    );
};

AddFacultyForm.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    institutionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default AddFacultyForm;
