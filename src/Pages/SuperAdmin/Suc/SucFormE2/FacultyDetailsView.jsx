import {
    User,
    GraduationCap,
    Building,
    BookOpen,
    Clock,
    DollarSign,
    UserCheck,
    BarChart3,
    FileText,
    School,
    Eye,
} from "lucide-react";
import PropTypes from "prop-types";
import Dialog from "../../../../Components/Dialog";
import { useFacultyFormLogic } from "../../../../Hooks/useFacultyFormLogic";

const annualSalaryOptions = [
    { value: "1", label: "₱60,000 below" },
    { value: "2", label: "₱60,000 - ₱69,999" },
    { value: "3", label: "₱70,000 - ₱79,999" },
    { value: "4", label: "₱80,000 - ₱89,999" },
    { value: "5", label: "₱90,000 - ₱99,999" },
    { value: "6", label: "₱100,000 - ₱149,999" },
    { value: "7", label: "₱150,000 - ₱249,999" },
    { value: "8", label: "₱250,000 - ₱499,999" },
    { value: "9", label: "₱500,000 - UP" }
];

const getSalaryRangeLabel = (rangeCode) => {
    if (!rangeCode) return "No salary range specified";
    const range = annualSalaryOptions.find(option => option.value === String(rangeCode));
    return range ? range.label : "Invalid range";
};

const FacultyDetailsView = ({ isOpen, onClose, facultyData }) => {
    // Use the hook to get options and helper functions
    const { genderOptions, facultyTypeOptions } = useFacultyFormLogic(facultyData?.suc_details_id);

    if (!facultyData) return null;

    const getFacultyTypeColor = (type) => {
        switch (type?.toUpperCase()) {
            case "A1":
                return "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300";
            case "B":
                return "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300";
            case "C1":
                return "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300";
            case "C2":
                return "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-orange-300";
            case "C3":
                return "bg-gradient-to-r from-pink-100 to-pink-200 text-pink-800 border-pink-300";
            case "E":
                return "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300";
            default:
                return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300";
        }
    };

    const getFacultyTypeDescription = (type) => {
        const typeOption = facultyTypeOptions.find(option => option.value === type);
        return typeOption ? typeOption.label : 'Unknown Faculty Type';
    };

    const getDegreeColor = (degree) => {
        // Convert degree to string and handle null/undefined
        const degreeStr = String(degree || '').toLowerCase();

        switch (degreeStr) {
            case "doctorate":
            case "phd":
                return "text-purple-700 bg-purple-100";
            case "masters":
            case "master":
                return "text-blue-700 bg-blue-100";
            case "bachelor":
            case "bachelors":
                return "text-green-700 bg-green-100";
            default:
                return "text-gray-700 bg-gray-100";
        }
    };

    const getGenderDisplay = (genderValue) => {
        const genderOption = genderOptions.find(option => option.value === String(genderValue));
        return genderOption ? genderOption.label : 'Not specified';
    };

    const getGenderIcon = (genderValue) => {
        return genderValue === '1' ? '♂' : genderValue === '2' ? '♀' : '';
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

    // Helper function to get report year
    const getReportYear = (reportYear) => {
        if (!reportYear) return "Not specified";
        if (typeof reportYear === 'object' && reportYear.year) {
            return String(reportYear.year);
        }
        return String(reportYear);
    };

    // Safe number conversion function
    const safeNumber = (value, defaultValue = 0) => {
        const num = Number(value);
        return isNaN(num) ? defaultValue : num;
    };

    // Calculate total teaching load
    const getTotalTeachingUnits = () => {
        return safeNumber(facultyData.undergrad_total_credit_units) + safeNumber(facultyData.graduate_total_credit_units);
    };

    // Calculate total contact hours
    const getTotalContactHours = () => {
        return safeNumber(facultyData.undergrad_total_contact_hours) + safeNumber(facultyData.graduate_total_contact_hours);
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title={safeValue(facultyData.name, "Faculty Details")}
            subtitle="Faculty Member Information"
            icon={Eye}
            variant="view"
            size="xl"
        >
            <div className="space-y-4 max-h-[600px] overflow-y-auto p-4">
                {/* Basic Faculty Information */}
                <div className="bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-100 rounded-xl p-4 border border-blue-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-blue-500 rounded-lg shadow-sm">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">Personal Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <p className="text-sm text-gray-900 font-semibold">{safeValue(facultyData.name)}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Gender</label>
                            <p className="text-sm text-gray-900">{getGenderIcon(facultyData.gender)} {getGenderDisplay(facultyData.gender)}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Faculty Rank</label>
                            <p className="text-sm text-gray-900">{safeValue(facultyData.generic_faculty_rank)}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Salary Grade</label>
                            <p className="text-sm text-gray-900">{safeValue(facultyData.ssl_salary_grade, "Not assigned")}</p>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Faculty Status</label>
                            <div className="flex flex-wrap gap-2">
                                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getFacultyTypeColor(facultyData.faculty_type)}`}>
                                    {safeValue(facultyData.faculty_type, "Unknown Type")}
                                </span>
                                {facultyData.is_tenured === 'Yes' && (
                                    <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-300">
                                        <UserCheck className="w-3 h-3 mr-1" />
                                        Tenured
                                    </span>
                                )}
                                {facultyData.on_leave_without_pay === 1 && (
                                    <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800 border border-orange-300">
                                        <Clock className="w-3 h-3 mr-1" />
                                        On Leave
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-gray-600 mt-1">{getFacultyTypeDescription(facultyData.faculty_type)}</p>
                        </div>
                    </div>
                </div>

                {/* Department & Academic Details Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Department Information */}
                    <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 rounded-xl p-4 border border-emerald-200/60 shadow-sm">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-emerald-500 rounded-lg shadow-sm">
                                <Building className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">Department & Position</h3>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Home College</label>
                                <p className="text-sm text-gray-900">{safeValue(facultyData.home_college)}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Home Department</label>
                                <p className="text-sm text-gray-900">{safeValue(facultyData.home_department)}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    <Clock className="w-4 h-4 inline mr-1" />
                                    Full-Time Equivalent
                                </label>
                                <p className="text-sm text-gray-900">{safeNumber(facultyData.full_time_equivalent)} FTE</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Report Year</label>
                                <p className="text-sm text-gray-900">{getReportYear(facultyData.report_year)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Academic Qualifications */}
                    <div className="bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-100 rounded-xl p-4 border border-purple-200/60 shadow-sm">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-purple-500 rounded-lg shadow-sm">
                                <GraduationCap className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">Academic Qualifications</h3>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Highest Degree Attained</label>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getDegreeColor(facultyData.highest_degree_attained)}`}>
                                    <GraduationCap className="w-4 h-4 mr-1" />
                                    {safeValue(facultyData.highest_degree_attained)}
                                </span>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Pursuing Next Degree</label>
                                <p className="text-sm text-gray-900">{facultyData.pursuing_next_degree === 1 ? 'Yes' : 'No'}</p>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                <div className="flex items-center justify-between bg-white/60 rounded-lg p-2 border">
                                    <span className="text-sm text-gray-700">Masters with Thesis:</span>
                                    <span className={`text-sm font-medium ${facultyData.masters_with_thesis === 1 ? 'text-green-600' : 'text-gray-500'}`}>
                                        {facultyData.masters_with_thesis === 1 ? '✓ Yes' : '✗ No'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between bg-white/60 rounded-lg p-2 border">
                                    <span className="text-sm text-gray-700">Doctorate with Dissertation:</span>
                                    <span className={`text-sm font-medium ${facultyData.doctorate_with_dissertation === 1 ? 'text-green-600' : 'text-gray-500'}`}>
                                        {facultyData.doctorate_with_dissertation === 1 ? '✓ Yes' : '✗ No'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Salary & Financial Information */}
                <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 rounded-xl p-4 border border-amber-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-amber-500 rounded-lg shadow-sm">
                            <DollarSign className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">Salary Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Annual Basic Salary</label>
                            {facultyData.annual_basic_salary && (
                                <p className="text-2xl font-bold text-amber-900">
                                    {getSalaryRangeLabel(facultyData.annual_basic_salary)}
                                </p>
                            )}
                            <p className="text-xs text-gray-600">Salary Grade: {safeValue(facultyData.ssl_salary_grade, "Not assigned")}</p>
                        </div>
                        <div className="text-center">
                            <label className="block text-sm font-medium text-gray-700">Leave Status</label>
                            <div className={`inline-flex items-center px-3 py-2 rounded-lg font-semibold ${
                                facultyData.on_leave_without_pay === 1
                                    ? 'bg-red-100 text-red-800 border border-red-300'
                                    : 'bg-green-100 text-green-800 border border-green-300'
                            }`}>
                                {facultyData.on_leave_without_pay === 1 ? 'On Leave' : 'Active'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Teaching Disciplines */}
                <div className="bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 rounded-xl p-4 border border-slate-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-slate-600 rounded-lg shadow-sm">
                            <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">Teaching Disciplines</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Teaching Load Disciplines</label>
                            <div className="space-y-2">
                                <div>
                                    <span className="text-xs text-gray-600">Primary:</span>
                                    <p className="text-sm text-gray-900">{safeValue(facultyData.discipline_teaching_load_1)}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-600">Secondary:</span>
                                    <p className="text-sm text-gray-900">{safeValue(facultyData.discipline_teaching_load_2)}</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Degree Disciplines</label>
                            <div className="space-y-2">
                                <div>
                                    <span className="text-xs text-gray-600">Bachelors:</span>
                                    <p className="text-sm text-gray-900">{safeValue(facultyData.discipline_bachelors)}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-600">Masters:</span>
                                    <p className="text-sm text-gray-900">{safeValue(facultyData.discipline_masters)}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-600">Doctorate:</span>
                                    <p className="text-sm text-gray-900">{safeValue(facultyData.discipline_doctorate)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Teaching Load Details Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Undergraduate Teaching */}
                    <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-100 rounded-xl p-4 border border-indigo-200/60 shadow-sm">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-indigo-500 rounded-lg shadow-sm">
                                <School className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">Undergraduate Teaching</h3>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Credit Units</label>
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div className="bg-white/60 rounded-lg p-2 border">
                                        <div className="text-xs text-gray-600">Lecture</div>
                                        <div className="text-sm font-semibold text-gray-900">{safeNumber(facultyData.undergrad_lecture_credit_units)}</div>
                                    </div>
                                    <div className="bg-white/60 rounded-lg p-2 border">
                                        <div className="text-xs text-gray-600">Lab</div>
                                        <div className="text-sm font-semibold text-gray-900">{safeNumber(facultyData.undergrad_lab_credit_units)}</div>
                                    </div>
                                    <div className="bg-white/60 rounded-lg p-2 border border-indigo-300">
                                        <div className="text-xs text-indigo-600">Total</div>
                                        <div className="text-sm font-semibold text-indigo-900">{safeNumber(facultyData.undergrad_total_credit_units)}</div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Hours per Week</label>
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div className="bg-white/60 rounded-lg p-2 border">
                                        <div className="text-xs text-gray-600">Lecture</div>
                                        <div className="text-sm font-semibold text-gray-900">{safeNumber(facultyData.undergrad_lecture_hours_per_week)}</div>
                                    </div>
                                    <div className="bg-white/60 rounded-lg p-2 border">
                                        <div className="text-xs text-gray-600">Lab</div>
                                        <div className="text-sm font-semibold text-gray-900">{safeNumber(facultyData.undergrad_lab_hours_per_week)}</div>
                                    </div>
                                    <div className="bg-white/60 rounded-lg p-2 border border-indigo-300">
                                        <div className="text-xs text-indigo-600">Total</div>
                                        <div className="text-sm font-semibold text-indigo-900">{safeNumber(facultyData.undergrad_total_hours_per_week)}</div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Contact Hours</label>
                                <div className="bg-white/60 rounded-lg p-2 border border-indigo-300">
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-indigo-900">{safeNumber(facultyData.undergrad_total_contact_hours)}</div>
                                        <div className="text-xs text-indigo-600">Total Contact Hours</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Graduate Teaching */}
                    <div className="bg-gradient-to-br from-rose-50 via-pink-50 to-red-100 rounded-xl p-4 border border-rose-200/60 shadow-sm">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-rose-500 rounded-lg shadow-sm">
                                <GraduationCap className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">Graduate Teaching</h3>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Credit Units</label>
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div className="bg-white/60 rounded-lg p-2 border">
                                        <div className="text-xs text-gray-600">Lecture</div>
                                        <div className="text-sm font-semibold text-gray-900">{safeNumber(facultyData.graduate_lecture_credit_units)}</div>
                                    </div>
                                    <div className="bg-white/60 rounded-lg p-2 border">
                                        <div className="text-xs text-gray-600">Lab</div>
                                        <div className="text-sm font-semibold text-gray-900">{safeNumber(facultyData.graduate_lab_credit_units)}</div>
                                    </div>
                                    <div className="bg-white/60 rounded-lg p-2 border border-rose-300">
                                        <div className="text-xs text-rose-600">Total</div>
                                        <div className="text-sm font-semibold text-rose-900">{safeNumber(facultyData.graduate_total_credit_units)}</div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Contact Hours</label>
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div className="bg-white/60 rounded-lg p-2 border">
                                        <div className="text-xs text-gray-600">Lecture</div>
                                        <div className="text-sm font-semibold text-gray-900">{safeNumber(facultyData.graduate_lecture_contact_hours)}</div>
                                    </div>
                                    <div className="bg-white/60 rounded-lg p-2 border">
                                        <div className="text-xs text-gray-600">Lab</div>
                                        <div className="text-sm font-semibold text-gray-900">{safeNumber(facultyData.graduate_lab_contact_hours)}</div>
                                    </div>
                                    <div className="bg-white/60 rounded-lg p-2 border border-rose-300">
                                        <div className="text-xs text-rose-600">Total</div>
                                        <div className="text-sm font-semibold text-rose-900">{safeNumber(facultyData.graduate_total_contact_hours)}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-sm text-gray-600">Teaching Load Summary</div>
                                <div className="text-lg font-bold text-rose-900">
                                    {getTotalTeachingUnits()} Total Units
                                </div>
                                <div className="text-sm text-gray-600">
                                    {getTotalContactHours()} Contact Hours
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Workload */}
                <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-100 rounded-xl p-4 border border-teal-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-teal-500 rounded-lg shadow-sm">
                            <BarChart3 className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">Additional Workload</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                            {[
                                { label: "Research", value: facultyData.research_load, color: "bg-purple-100 text-purple-800 border-purple-300" },
                                { label: "Extension", value: facultyData.extension_services_load, color: "bg-green-100 text-green-800 border-green-300" },
                                { label: "Study", value: facultyData.study_load, color: "bg-blue-100 text-blue-800 border-blue-300" },
                                { label: "Production", value: facultyData.production_load, color: "bg-orange-100 text-orange-800 border-orange-300" },
                                { label: "Admin", value: facultyData.administrative_load, color: "bg-red-100 text-red-800 border-red-300" },
                                { label: "Other", value: facultyData.other_load_credits, color: "bg-gray-100 text-gray-800 border-gray-300" },
                            ].map((item, index) => (
                                <div key={index} className={`p-3 rounded-lg border text-center ${item.color}`}>
                                    <div className="text-lg font-bold">{safeNumber(item.value)}</div>
                                    <div className="text-xs font-medium">{item.label}</div>
                                </div>
                            ))}
                        </div>
                        <div className="text-center">
                            <div className="bg-white/80 rounded-lg p-4 border-2 border-teal-300">
                                <div className="text-3xl font-bold text-teal-900">{safeNumber(facultyData.total_work_load)}</div>
                                <div className="text-sm font-semibold text-teal-700">Total Workload</div>
                                <div className="text-xs text-gray-600 mt-1">
                                    Teaching: {getTotalTeachingUnits()} units | Other: {safeNumber(facultyData.total_work_load) - getTotalTeachingUnits()} units
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Information */}
                <div className="bg-gradient-to-br from-gray-50 via-gray-50 to-slate-100 rounded-xl p-4 border border-gray-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-gray-600 rounded-lg shadow-sm">
                            <FileText className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">Record Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Record ID</label>
                            <p className="text-sm text-gray-900">{safeValue(facultyData.id)}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Report Year</label>
                            <p className="text-sm text-gray-900">{getReportYear(facultyData.report_year)}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Faculty Type Code</label>
                            <p className="text-sm text-gray-900">{safeValue(facultyData.faculty_type)}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">SUC Details ID</label>
                            <p className="text-sm text-gray-900">{safeValue(facultyData.suc_details_id)}</p>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Summary</label>
                            <div className="grid grid-cols-3 gap-4 mt-2">
                                <div className="text-center bg-blue-50 p-3 rounded-lg border">
                                    <div className="text-lg font-bold text-blue-900">{getTotalTeachingUnits()}</div>
                                    <div className="text-xs text-blue-600">Teaching Units</div>
                                </div>
                                <div className="text-center bg-purple-50 p-3 rounded-lg border">
                                    <div className="text-lg font-bold text-purple-900">{safeNumber(facultyData.research_load) + safeNumber(facultyData.extension_services_load)}</div>
                                    <div className="text-xs text-purple-600">Research & Extension</div>
                                </div>
                                <div className="text-center bg-orange-50 p-3 rounded-lg border">
                                    <div className="text-lg font-bold text-orange-900">{safeNumber(facultyData.administrative_load)}</div>
                                    <div className="text-xs text-orange-600">Administrative Load</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

FacultyDetailsView.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
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
    }),
};

export default FacultyDetailsView;