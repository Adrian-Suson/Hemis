/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import {
    User,
    GraduationCap,
    Building,
    DollarSign,
    BarChart3,
    FileText,
    School,
    Edit,
    Save,
    X,
    AlertCircle,
} from "lucide-react";
import PropTypes from "prop-types";
import Dialog from "../../../../Components/Dialog";
import { useFacultyFormLogic } from "../../../../hooks/useFacultyFormLogic";
import { 
    facultyTypeOptions,
    GENDER,
    TENURED_STATUS,
    ANNUAL_SALARY,
    ON_LEAVE_PAY,
    FULL_TIME_EQUIVALENT,
    HIGHEST_DEGREE,
    PURSUING_NEXT_DEGREE,
    MASTERS_THESIS,
    DOCTORATE_DISSERTATION,
    GENERIC_FACULTY_RANK,
    SALARY_GRADE
} from "../../../../utils/SucFormE2Constants";

const EditFacultyForm = ({ isOpen, onClose, onSave, facultyData, loading }) => {
    const {
        formData,
        errors,
        handleInputChange,
        validateForm
    } = useFacultyFormLogic(facultyData?.suc_details_id);

    // Initialize form data when facultyData changes
    useEffect(() => {
        if (facultyData && isOpen) {
            Object.entries(facultyData).forEach(([key, value]) => {
                if (key === "report_year" && value && typeof value === "object" && value.year) {
                    handleInputChange(key, value.year);
                } else {
                    handleInputChange(key, value);
                }
            });
        }
    }, [facultyData, isOpen]);

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
            cleanedData[field] = parseFloat(cleanedData[field]) || 0;
        });

        onSave(cleanedData);
    };

    // Handle close with unsaved changes warning
    const handleClose = () => {
        if (window.confirm("You have unsaved changes. Are you sure you want to close?")) {
            onClose();
        }
    };

    // Input component
    const InputField = ({ label, field, type = "text", required = false, options = null, min, max, step }) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {options ? (
                <select
                    value={formData[field] || ""}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors ${
                        errors[field] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    required={required}
                >
                    <option value="">Select {label}</option>
                    {options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type={type}
                    value={formData[field] || ""}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors[field] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    required={required}
                    min={min}
                    max={max}
                    step={step}
                />
            )}
            {errors[field] && (
                <div className="flex items-center mt-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors[field]}
                </div>
            )}
        </div>
    );

    InputField.propTypes = {
        label: PropTypes.string.isRequired,
        field: PropTypes.string.isRequired,
        type: PropTypes.string,
        required: PropTypes.bool,
        options: PropTypes.arrayOf(
            PropTypes.shape({
                value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
                label: PropTypes.string.isRequired
            })
        ),
        min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        step: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    };

    InputField.defaultProps = {
        type: "text",
        required: false,
        options: null
    };

    if (!facultyData) return null;

    const genderOptions = Object.entries(GENDER).map(([value, label]) => ({ value, label }));
    const facultyTypeOpts = facultyTypeOptions.map(opt => ({ value: opt.code, label: opt.label }));
    const tenuredOptions = Object.entries(TENURED_STATUS).map(([value, label]) => ({ value, label }));
    const annualSalaryOptions = Object.entries(ANNUAL_SALARY).map(([value, label]) => ({ value, label }));
    const onLeavePayOptions = Object.entries(ON_LEAVE_PAY).map(([value, label]) => ({ value, label }));
    const fullTimeEquivalentOptions = Object.entries(FULL_TIME_EQUIVALENT).map(([value, label]) => ({ value, label }));
    const highestDegreeOptions = Object.entries(HIGHEST_DEGREE).map(([value, label]) => ({ value, label }));
    const pursuingNextDegreeOptions = Object.entries(PURSUING_NEXT_DEGREE).map(([value, label]) => ({ value, label }));
    const thesisOptions = Object.entries(MASTERS_THESIS).map(([value, label]) => ({ value, label }));
    const dissertationOptions = Object.entries(DOCTORATE_DISSERTATION).map(([value, label]) => ({ value, label }));
    const facultyRankOptions = Object.entries(GENERIC_FACULTY_RANK).map(([value, label]) => ({ value, label }));
    const salaryGradeOptions = Object.entries(SALARY_GRADE).map(([value, label]) => ({ value, label }));

    return (
        <Dialog
            isOpen={isOpen}
            onClose={handleClose}
            title={`Edit Faculty: ${facultyData.name || 'Faculty Member'}`}
            subtitle="Update faculty information"
            icon={Edit}
            variant="form"
            size="xl"
        >
            <form onSubmit={handleSubmit} className="space-y-6 max-h-[600px] overflow-y-auto">
                {/* Changes Indicator */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                    <div className="flex items-center">
                        <AlertCircle className="w-5 h-5 text-amber-600 mr-2" />
                        <span className="text-sm text-amber-800 font-medium">You have unsaved changes</span>
                    </div>
                </div>

                {/* Personal Information */}
                <div className="bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-100 rounded-xl p-4 border border-blue-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-blue-500 rounded-lg shadow-sm">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">Personal Information</h3>
                        <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                            ID: {facultyData.id}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField
                            label="Full Name"
                            field="name"
                            required={true}
                        />
                        <InputField
                            label="Gender"
                            field="gender"
                            required={true}
                            options={genderOptions}
                        />
                        <InputField
                            label="Faculty Rank"
                            field="generic_faculty_rank"
                            options={facultyRankOptions}
                        />
                        <InputField
                            label="Faculty Type"
                            field="faculty_type"
                            required={true}
                            options={facultyTypeOpts}
                        />
                        <InputField
                            label="Tenure Status"
                            field="is_tenured"
                            options={tenuredOptions}
                        />
                        <InputField
                            label="Salary Grade"
                            field="ssl_salary_grade"
                            options={salaryGradeOptions}
                        />
                    </div>
                </div>

                {/* Department & Salary Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Department Information */}
                    <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 rounded-xl p-4 border border-emerald-200/60 shadow-sm">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="p-2 bg-emerald-500 rounded-lg shadow-sm">
                                <Building className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">Department & Position</h3>
                        </div>
                        <div className="space-y-4">
                            <InputField
                                label="Home College"
                                field="home_college"
                            />
                            <InputField
                                label="Home Department"
                                field="home_department"
                            />
                            <InputField
                                label="Full-Time Equivalent"
                                field="full_time_equivalent"
                                options={fullTimeEquivalentOptions}
                            />
                            <InputField
                                label="On Leave Without Pay"
                                field="on_leave_without_pay"
                                options={onLeavePayOptions}
                            />
                        </div>
                    </div>

                    {/* Salary Information */}
                    <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 rounded-xl p-4 border border-amber-200/60 shadow-sm">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="p-2 bg-amber-500 rounded-lg shadow-sm">
                                <DollarSign className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">Salary Information</h3>
                        </div>
                        <div className="space-y-4">
                            <InputField
                                label="Annual Basic Salary"
                                field="annual_basic_salary"
                                options={annualSalaryOptions}
                            />
                            <InputField
                                label="Report Year"
                                field="report_year"
                                type="number"
                                min="2020"
                                max="2030"
                            />
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
                <div className="bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-100 rounded-xl p-4 border border-purple-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-purple-500 rounded-lg shadow-sm">
                            <GraduationCap className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">Academic Qualifications</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <InputField
                                label="Highest Degree Attained"
                                field="highest_degree_attained"
                                required={true}
                                options={highestDegreeOptions}
                            />
                            <InputField
                                label="Pursuing Next Degree"
                                field="pursuing_next_degree"
                                options={pursuingNextDegreeOptions}
                            />
                            <InputField
                                label="Masters with Thesis"
                                field="masters_with_thesis"
                                options={thesisOptions}
                            />
                            <InputField
                                label="Doctorate with Dissertation"
                                field="doctorate_with_dissertation"
                                options={dissertationOptions}
                            />
                        </div>
                        <div className="space-y-4">
                            <InputField
                                label="Primary Teaching Discipline"
                                field="discipline_teaching_load_1"
                            />
                            <InputField
                                label="Secondary Teaching Discipline"
                                field="discipline_teaching_load_2"
                            />
                            <InputField
                                label="Bachelor's Discipline"
                                field="discipline_bachelors"
                            />
                            <InputField
                                label="Master's Discipline"
                                field="discipline_masters"
                            />
                            <InputField
                                label="Doctorate Discipline"
                                field="discipline_doctorate"
                            />
                        </div>
                    </div>
                </div>

                {/* Teaching Load */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Undergraduate Teaching */}
                    <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-100 rounded-xl p-4 border border-indigo-200/60 shadow-sm">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="p-2 bg-indigo-500 rounded-lg shadow-sm">
                                <School className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">Undergraduate Teaching</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-3">
                                <InputField
                                    label="Lab Units"
                                    field="undergrad_lab_credit_units"
                                    type="number"
                                    min="0"
                                    step="0.5"
                                />
                                <InputField
                                    label="Lecture Units"
                                    field="undergrad_lecture_credit_units"
                                    type="number"
                                    min="0"
                                    step="0.5"
                                />
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Units</label>
                                    <input
                                        type="number"
                                        value={formData.undergrad_total_credit_units || 0}
                                        readOnly
                                        className="w-full px-3 py-2 border border-rose-300 rounded-lg bg-rose-50 text-rose-900 font-semibold"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <InputField
                                    label="Lab Contact Hours"
                                    field="undergrad_lab_contact_hours"
                                    type="number"
                                    min="0"
                                    step="0.5"
                                />
                                <InputField
                                    label="Lecture Contact Hours"
                                    field="undergrad_lecture_contact_hours"
                                    type="number"
                                    min="0"
                                    step="0.5"
                                />
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Contact Hours</label>
                                    <input
                                        type="number"
                                        value={formData.undergrad_total_contact_hours || 0}
                                        readOnly
                                        className="w-full px-3 py-2 border border-rose-300 rounded-lg bg-rose-50 text-rose-900 font-semibold"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Graduate Teaching */}
                    <div className="bg-gradient-to-br from-rose-50 via-pink-50 to-red-100 rounded-xl p-4 border border-rose-200/60 shadow-sm">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="p-2 bg-rose-500 rounded-lg shadow-sm">
                                <GraduationCap className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">Graduate Teaching</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-3">
                                <InputField
                                    label="Lab Units"
                                    field="graduate_lab_credit_units"
                                    type="number"
                                    min="0"
                                    step="0.5"
                                />
                                <InputField
                                    label="Lecture Units"
                                    field="graduate_lecture_credit_units"
                                    type="number"
                                    min="0"
                                    step="0.5"
                                />
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Units</label>
                                    <input
                                        type="number"
                                        value={formData.graduate_total_credit_units || 0}
                                        readOnly
                                        className="w-full px-3 py-2 border border-rose-300 rounded-lg bg-rose-50 text-rose-900 font-semibold"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <InputField
                                    label="Lab Contact Hours"
                                    field="graduate_lab_contact_hours"
                                    type="number"
                                    min="0"
                                    step="0.5"
                                />
                                <InputField
                                    label="Lecture Contact Hours"
                                    field="graduate_lecture_contact_hours"
                                    type="number"
                                    min="0"
                                    step="0.5"
                                />
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
                <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-100 rounded-xl p-4 border border-teal-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-teal-500 rounded-lg shadow-sm">
                            <BarChart3 className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">Additional Workload</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <InputField
                            label="Research Load"
                            field="research_load"
                            type="number"
                            min="0"
                            step="0.5"
                        />
                        <InputField
                            label="Extension Services"
                            field="extension_services_load"
                            type="number"
                            min="0"
                            step="0.5"
                        />
                        <InputField
                            label="Study Load"
                            field="study_load"
                            type="number"
                            min="0"
                            step="0.5"
                        />
                        <InputField
                            label="Production Load"
                            field="production_load"
                            type="number"
                            min="0"
                            step="0.5"
                        />
                        <InputField
                            label="Administrative Load"
                            field="administrative_load"
                            type="number"
                            min="0"
                            step="0.5"
                        />
                        <InputField
                            label="Other Load Credits"
                            field="other_load_credits"
                            type="number"
                            min="0"
                            step="0.5"
                        />
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

                {/* Form Actions */}
                <div className="bg-gradient-to-br from-gray-50 via-gray-50 to-slate-100 rounded-xl p-4 border border-gray-200/60 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <FileText className="w-4 h-4" />
                            <span>All required fields must be completed</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={loading}
                                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <X className="w-4 h-4 mr-2 inline" />
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transition-all duration-200"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2 inline" />
                                        Update Faculty
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Validation Summary */}
                {Object.keys(errors).length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <div className="flex items-center mb-2">
                            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                            <h4 className="text-sm font-semibold text-red-800">Please correct the following errors:</h4>
                        </div>
                        <ul className="text-sm text-red-700 space-y-1">
                            {Object.entries(errors).map(([field, error]) => (
                                <li key={field} className="flex items-center">
                                    <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                                    {error}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Record Information */}
                <div className="bg-gradient-to-br from-gray-50 via-gray-50 to-slate-100 rounded-xl p-4 border border-gray-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-gray-600 rounded-lg shadow-sm">
                            <FileText className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">Record Information</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Record ID</label>
                            <p className="text-sm text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">{facultyData.id}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">SUC Details ID</label>
                            <p className="text-sm text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">{facultyData.suc_details_id}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Created</label>
                            <p className="text-sm text-gray-900">{facultyData.created_at ? new Date(facultyData.created_at).toLocaleDateString() : 'N/A'}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                            <p className="text-sm text-gray-900">{facultyData.updated_at ? new Date(facultyData.updated_at).toLocaleDateString() : 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </form>
        </Dialog>
    );
};

EditFacultyForm.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    facultyData: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        suc_details_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        name: PropTypes.string,
        generic_faculty_rank: PropTypes.string,
        home_college: PropTypes.string,
        home_department: PropTypes.string,
        is_tenured: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        ssl_salary_grade: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        annual_basic_salary: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        on_leave_without_pay: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        full_time_equivalent: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        gender: PropTypes.string,
        highest_degree_attained: PropTypes.string,
        pursuing_next_degree: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        discipline_teaching_load_1: PropTypes.string,
        discipline_teaching_load_2: PropTypes.string,
        discipline_bachelors: PropTypes.string,
        discipline_masters: PropTypes.string,
        discipline_doctorate: PropTypes.string,
        masters_with_thesis: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        doctorate_with_dissertation: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        undergrad_lab_credit_units: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        undergrad_lecture_credit_units: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        undergrad_total_credit_units: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        undergrad_lab_hours_per_week: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        undergrad_lecture_hours_per_week: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        undergrad_total_hours_per_week: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        undergrad_lab_contact_hours: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        undergrad_lecture_contact_hours: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        undergrad_total_contact_hours: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        graduate_lab_credit_units: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        graduate_lecture_credit_units: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        graduate_total_credit_units: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        graduate_lab_contact_hours: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        graduate_lecture_contact_hours: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        graduate_total_contact_hours: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        research_load: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        extension_services_load: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        study_load: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        production_load: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        administrative_load: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        other_load_credits: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        total_work_load: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        report_year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        faculty_type: PropTypes.string,
        created_at: PropTypes.string,
        updated_at: PropTypes.string,
    }),
    loading: PropTypes.bool,
};

EditFacultyForm.defaultProps = {
    loading: false,
    facultyData: null,
};

export default EditFacultyForm;