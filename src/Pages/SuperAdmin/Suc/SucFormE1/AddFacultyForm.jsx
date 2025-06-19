import { useState } from "react";
import {
    User,
    GraduationCap,
    Clock,
    DollarSign,
    Users,
    Target,
    Save,
    Plus,
} from "lucide-react";
import PropTypes from "prop-types";
import Dialog from "../../../../Components/Dialog";
import {
    facultyTypeOptions,
    GENERIC_FACULTY_RANK,
    HIGHEST_DEGREE,
    PURSUING_NEXT_DEGREE,
    MASTERS_THESIS,
    DOCTORATE_DISSERTATION,
    TENURED_STATUS,
    SALARY_GRADE,
    ANNUAL_SALARY,
    ON_LEAVE_PAY,
    FULL_TIME_EQUIVALENT,
    GENDER
} from "../../../../utils/SucFormE1Constants.jsx";

// Helper to convert object constants to array options
const objectToOptions = (obj) => Object.entries(obj).map(([code, label]) => ({ code: String(code), label }));

const facultyRankOptions = objectToOptions(GENERIC_FACULTY_RANK);
const degreeOptions = objectToOptions(HIGHEST_DEGREE);
const pursuingDegreeOptions = objectToOptions(PURSUING_NEXT_DEGREE);
const thesisOptions = objectToOptions(MASTERS_THESIS);
const dissertationOptions = objectToOptions(DOCTORATE_DISSERTATION);
const tenureOptions = objectToOptions(TENURED_STATUS);
const salaryGradeOptions = objectToOptions(SALARY_GRADE);
const salaryRangeOptions = objectToOptions(ANNUAL_SALARY);
const leaveStatusOptions = objectToOptions(ON_LEAVE_PAY);
const fteOptions = objectToOptions(FULL_TIME_EQUIVALENT);
const genderOptions = objectToOptions(GENDER);




// Define hourFields constant at the top level
const hourFields = [
    'lab_hours_elem_sec', 'lecture_hours_elem_sec', 'total_teaching_hours_elem_sec',
    'student_lab_contact_hours_elem_sec', 'student_lecture_contact_hours_elem_sec',
    'total_student_contact_hours_elem_sec', 'lab_hours_tech_voc', 'lecture_hours_tech_voc',
    'total_teaching_hours_tech_voc', 'student_lab_contact_hours_tech_voc',
    'student_lecture_contact_hours_tech_voc', 'total_student_contact_hours_tech_voc',
    'official_research_load', 'official_extension_services_load', 'official_study_load',
    'official_load_for_production', 'official_administrative_load', 'other_official_load_credits',
    'total_work_load'
];

function AddFacultyForm({ isOpen, onClose, onSave, institutionId, loading = false }) {
    const [formData, setFormData] = useState({
        suc_details_id: institutionId || '',
        faculty_name: "",
        generic_faculty_rank: "",
        home_college: "",
        home_dept: "",
        is_tenured: "",
        ssl_salary_grade: "",
        annual_basic_salary: "",
        on_leave_without_pay: "",
        full_time_equivalent: "",
        gender: "",
        highest_degree_attained: "",
        actively_pursuing_next_degree: "",
        primary_teaching_load_discipline_1: "",
        primary_teaching_load_discipline_2: "",
        bachelors_discipline: "",
        masters_discipline: "",
        doctorate_discipline: "",
        masters_with_thesis: "",
        doctorate_with_dissertation: "",
        lab_hours_elem_sec: "",
        lecture_hours_elem_sec: "",
        total_teaching_hours_elem_sec: "",
        student_lab_contact_hours_elem_sec: "",
        student_lecture_contact_hours_elem_sec: "",
        total_student_contact_hours_elem_sec: "",
        lab_hours_tech_voc: "",
        lecture_hours_tech_voc: "",
        total_teaching_hours_tech_voc: "",
        student_lab_contact_hours_tech_voc: "",
        student_lecture_contact_hours_tech_voc: "",
        total_student_contact_hours_tech_voc: "",
        official_research_load: "",
        official_extension_services_load: "",
        official_study_load: "",
        official_load_for_production: "",
        official_administrative_load: "",
        other_official_load_credits: "",
        total_work_load: "",
        faculty_type: "",
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

        // Auto-calculate total teaching hours for elem/sec
        if (field === 'lab_hours_elem_sec' || field === 'lecture_hours_elem_sec') {
            const labHours = field === 'lab_hours_elem_sec' ? parseFloat(value) || 0 : parseFloat(formData.lab_hours_elem_sec) || 0;
            const lectureHours = field === 'lecture_hours_elem_sec' ? parseFloat(value) || 0 : parseFloat(formData.lecture_hours_elem_sec) || 0;
            setFormData(prev => ({
                ...prev,
                [field]: value,
                total_teaching_hours_elem_sec: labHours + lectureHours
            }));
        }

        // Auto-calculate total student contact hours for elem/sec
        if (field === 'student_lab_contact_hours_elem_sec' || field === 'student_lecture_contact_hours_elem_sec') {
            const labContactHours = field === 'student_lab_contact_hours_elem_sec' ? parseFloat(value) || 0 : parseFloat(formData.student_lab_contact_hours_elem_sec) || 0;
            const lectureContactHours = field === 'student_lecture_contact_hours_elem_sec' ? parseFloat(value) || 0 : parseFloat(formData.student_lecture_contact_hours_elem_sec) || 0;
            setFormData(prev => ({
                ...prev,
                [field]: value,
                total_student_contact_hours_elem_sec: labContactHours + lectureContactHours
            }));
        }

        // Auto-calculate total teaching hours for tech/voc
        if (field === 'lab_hours_tech_voc' || field === 'lecture_hours_tech_voc') {
            const labHours = field === 'lab_hours_tech_voc' ? parseFloat(value) || 0 : parseFloat(formData.lab_hours_tech_voc) || 0;
            const lectureHours = field === 'lecture_hours_tech_voc' ? parseFloat(value) || 0 : parseFloat(formData.lecture_hours_tech_voc) || 0;
            setFormData(prev => ({
                ...prev,
                [field]: value,
                total_teaching_hours_tech_voc: labHours + lectureHours
            }));
        }

        // Auto-calculate total student contact hours for tech/voc
        if (field === 'student_lab_contact_hours_tech_voc' || field === 'student_lecture_contact_hours_tech_voc') {
            const labContactHours = field === 'student_lab_contact_hours_tech_voc' ? parseFloat(value) || 0 : parseFloat(formData.student_lab_contact_hours_tech_voc) || 0;
            const lectureContactHours = field === 'student_lecture_contact_hours_tech_voc' ? parseFloat(value) || 0 : parseFloat(formData.student_lecture_contact_hours_tech_voc) || 0;
            setFormData(prev => ({
                ...prev,
                [field]: value,
                total_student_contact_hours_tech_voc: labContactHours + lectureContactHours
            }));
        }

        // Auto-calculate total work load
        if (field.includes('official_') || field.includes('_load')) {
            calculateTotalWorkLoad({ ...formData, [field]: value });
        }
    };

    const calculateTotalWorkLoad = (data) => {
        const loadFields = [
            'official_research_load',
            'official_extension_services_load',
            'official_study_load',
            'official_load_for_production',
            'official_administrative_load',
            'other_official_load_credits'
        ];

        const totalLoad = loadFields.reduce((sum, field) => sum + (parseFloat(data[field]) || 0), 0);

        setFormData(prev => ({
            ...prev,
            total_work_load: totalLoad
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        // Required fields based on controller validation
        if (!formData.faculty_name.trim()) {
            newErrors.faculty_name = "Faculty name is required";
        }
        if (!formData.suc_details_id) {
            newErrors.suc_details_id = "Institution ID is required";
        }

        // Numeric validations
        if (formData.annual_basic_salary && (isNaN(formData.annual_basic_salary) || formData.annual_basic_salary < 0)) {
            newErrors.annual_basic_salary = "Annual salary must be a positive number";
        }
        if (formData.full_time_equivalent && (isNaN(formData.full_time_equivalent) || formData.full_time_equivalent < 0)) {
            newErrors.full_time_equivalent = "FTE must be a positive number";
        }

        // String length validations
        if (formData.faculty_name && formData.faculty_name.length > 255) {
            newErrors.faculty_name = "Faculty name must not exceed 255 characters";
        }
        if (formData.generic_faculty_rank && formData.generic_faculty_rank.length > 255) {
            newErrors.generic_faculty_rank = "Faculty rank must not exceed 255 characters";
        }
        if (formData.home_college && formData.home_college.length > 255) {
            newErrors.home_college = "Home college must not exceed 255 characters";
        }
        if (formData.home_dept && formData.home_dept.length > 255) {
            newErrors.home_dept = "Home department must not exceed 255 characters";
        }
        if (formData.gender && formData.gender.length > 10) {
            newErrors.gender = "Gender must not exceed 10 characters";
        }
        if (formData.highest_degree_attained && formData.highest_degree_attained.length > 255) {
            newErrors.highest_degree_attained = "Highest degree must not exceed 255 characters";
        }

        // Hour validations
        hourFields.forEach(field => {
            if (formData[field] && (isNaN(formData[field]) || formData[field] < 0)) {
                newErrors[field] = "Hours must be a positive number";
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            const facultyData = {
                ...formData,
                suc_details_id: institutionId ? String(institutionId) : '',
                annual_basic_salary: formData.annual_basic_salary ? String(formData.annual_basic_salary) : '',
                full_time_equivalent: formData.full_time_equivalent ? String(formData.full_time_equivalent) : '',
                ...Object.fromEntries(
                    hourFields.map(field => [
                        field,
                        formData[field] ? String(formData[field]) : ''
                    ])
                )
            };
            onSave(facultyData);
        }
    };

    const handleClose = () => {
        setFormData({
            suc_details_id: institutionId || '',
            faculty_name: "",
            generic_faculty_rank: "",
            home_college: "",
            home_dept: "",
            is_tenured: "",
            ssl_salary_grade: "",
            annual_basic_salary: "",
            on_leave_without_pay: "",
            full_time_equivalent: "",
            gender: "",
            highest_degree_attained: "",
            actively_pursuing_next_degree: "",
            primary_teaching_load_discipline_1: "",
            primary_teaching_load_discipline_2: "",
            bachelors_discipline: "",
            masters_discipline: "",
            doctorate_discipline: "",
            masters_with_thesis: "",
            doctorate_with_dissertation: "",
            lab_hours_elem_sec: "",
            lecture_hours_elem_sec: "",
            total_teaching_hours_elem_sec: "",
            student_lab_contact_hours_elem_sec: "",
            student_lecture_contact_hours_elem_sec: "",
            total_student_contact_hours_elem_sec: "",
            lab_hours_tech_voc: "",
            lecture_hours_tech_voc: "",
            total_teaching_hours_tech_voc: "",
            student_lab_contact_hours_tech_voc: "",
            student_lecture_contact_hours_tech_voc: "",
            total_student_contact_hours_tech_voc: "",
            official_research_load: "",
            official_extension_services_load: "",
            official_study_load: "",
            official_load_for_production: "",
            official_administrative_load: "",
            other_official_load_credits: "",
            total_work_load: "",
            faculty_type: "",
        });
        setErrors({});
        onClose();
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={handleClose}
            title="Add New Faculty Member"
            subtitle="Create a new faculty record for the institution"
            icon={Plus}
            variant="default"
            size="xl"
        >
            <div className="space-y-2 max-h-[600px] overflow-y-auto p-2">
                {/* Personal Information */}
                <div className="bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-100 rounded-lg p-2 border border-blue-200/60 shadow-sm">
                    <div className="flex items-center space-x-2 mb-2">
                        <div className="p-1.5 bg-blue-500 rounded-lg shadow-sm">
                            <User className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900">Basic Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-0.5">Name</label>
                            <input
                                type="text"
                                value={formData.faculty_name}
                                onChange={(e) => handleInputChange("faculty_name", e.target.value)}
                                placeholder="Enter name"
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                                aria-label="Faculty Name"
                            />
                            {errors.faculty_name && <p className="text-red-500 text-xs mt-0.5">{errors.faculty_name}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-0.5">Gender</label>
                            <select
                                value={formData.gender}
                                onChange={(e) => handleInputChange("gender", e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                                aria-label="Gender"
                            >
                                <option value="">Select Gender</option>
                                {genderOptions.map((option) => (
                                    <option key={option.code} value={option.code}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-700 mb-0.5">Faculty Type</label>
                            <select
                                value={formData.faculty_type}
                                onChange={(e) => handleInputChange("faculty_type", e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                                aria-label="Faculty Type"
                            >
                                <option value="">Select Type</option>
                                {facultyTypeOptions.map((option) => (
                                    <option key={option.code} value={option.code}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Academic Information */}
                <div className="bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-100 rounded-lg p-2 border border-blue-200/60 shadow-sm">
                    <div className="flex items-center space-x-2 mb-2">
                        <div className="p-1.5 bg-blue-500 rounded-lg shadow-sm">
                            <GraduationCap className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900">Academic Details</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-0.5">Rank</label>
                            <select
                                value={formData.generic_faculty_rank}
                                onChange={(e) => handleInputChange("generic_faculty_rank", e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                                aria-label="Faculty Rank"
                            >
                                <option value="">Select Rank</option>
                                {facultyRankOptions.map((option) => (
                                    <option key={option.code} value={option.code}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-0.5">College</label>
                            <input
                                type="text"
                                value={formData.home_college}
                                onChange={(e) => handleInputChange("home_college", e.target.value)}
                                placeholder="Enter college"
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                                aria-label="Home College"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-0.5">Department</label>
                            <input
                                type="text"
                                value={formData.home_dept}
                                onChange={(e) => handleInputChange("home_dept", e.target.value)}
                                placeholder="Enter department"
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                                aria-label="Home Department"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-0.5">Tenure</label>
                            <select
                                value={formData.is_tenured}
                                onChange={(e) => handleInputChange("is_tenured", e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                                aria-label="Tenure Status"
                            >
                                <option value="">Select Status</option>
                                {tenureOptions.map((option) => (
                                    <option key={option.code} value={option.code}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-0.5">Highest Degree</label>
                            <select
                                value={formData.highest_degree_attained}
                                onChange={(e) => handleInputChange("highest_degree_attained", e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                                aria-label="Highest Degree Attained"
                            >
                                <option value="">Select Degree</option>
                                {degreeOptions.map((option) => (
                                    <option key={option.code} value={option.code}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-0.5">Degree Progress</label>
                            <select
                                value={formData.actively_pursuing_next_degree}
                                onChange={(e) => handleInputChange("actively_pursuing_next_degree", e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                                aria-label="Pursuing Next Degree"
                            >
                                <option value="">Select Status</option>
                                {pursuingDegreeOptions.map((option) => (
                                    <option key={option.code} value={option.code}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-0.5">Bachelor&apos;s Discipline</label>
                            <input
                                type="text"
                                value={formData.bachelors_discipline}
                                onChange={e => handleInputChange("bachelors_discipline", e.target.value)}
                                placeholder="Enter discipline"
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                                aria-label="Bachelor's Discipline"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-0.5">Master&apos;s Discipline</label>
                            <input
                                type="text"
                                value={formData.masters_discipline}
                                onChange={e => handleInputChange("masters_discipline", e.target.value)}
                                placeholder="Enter discipline"
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                                aria-label="Master's Discipline"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-0.5">Doctorate Discipline</label>
                            <input
                                type="text"
                                value={formData.doctorate_discipline}
                                onChange={e => handleInputChange("doctorate_discipline", e.target.value)}
                                placeholder="Enter discipline"
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                                aria-label="Doctorate Discipline"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-0.5">Master&apos;s Thesis</label>
                            <select
                                value={formData.masters_with_thesis}
                                onChange={(e) => handleInputChange("masters_with_thesis", e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                                aria-label="Masters Thesis Status"
                            >
                                <option value="">Select Status</option>
                                {thesisOptions.map((option) => (
                                    <option key={option.code} value={option.code}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-0.5">Doctorate Dissertation</label>
                            <select
                                value={formData.doctorate_with_dissertation}
                                onChange={(e) => handleInputChange("doctorate_with_dissertation", e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                                aria-label="Doctorate Dissertation Status"
                            >
                                <option value="">Select Status</option>
                                {dissertationOptions.map((option) => (
                                    <option key={option.code} value={option.code}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Employment Information */}
                <div className="bg-gradient-to-br from-green-50 via-green-50 to-emerald-100 rounded-lg p-2 border border-green-200/60 shadow-sm">
                    <div className="flex items-center space-x-2 mb-2">
                        <div className="p-1.5 bg-green-500 rounded-lg shadow-sm">
                            <DollarSign className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900">Employment Details</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-0.5">Salary Grade</label>
                            <select
                                value={formData.ssl_salary_grade}
                                onChange={(e) => handleInputChange("ssl_salary_grade", e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                                aria-label="Salary Grade"
                            >
                                <option value="">Select Grade</option>
                                {salaryGradeOptions.map((option) => (
                                    <option key={option.code} value={option.code}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-0.5">Salary Range</label>
                            <select
                                value={formData.annual_basic_salary}
                                onChange={(e) => handleInputChange("annual_basic_salary", e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                                aria-label="Annual Basic Salary"
                            >
                                <option value="">Select Range</option>
                                {salaryRangeOptions.map((option) => (
                                    <option key={option.code} value={option.code}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {errors.annual_basic_salary && <p className="text-red-500 text-xs mt-0.5">{errors.annual_basic_salary}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-0.5">Work Status</label>
                            <select
                                value={formData.full_time_equivalent}
                                onChange={(e) => handleInputChange("full_time_equivalent", e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                                aria-label="Full Time Equivalent"
                            >
                                <option value="">Select Status</option>
                                {fteOptions.map((option) => (
                                    <option key={option.code} value={option.code}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {errors.full_time_equivalent && <p className="text-red-500 text-xs mt-0.5">{errors.full_time_equivalent}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-0.5">Leave Status</label>
                            <select
                                value={formData.on_leave_without_pay}
                                onChange={(e) => handleInputChange("on_leave_without_pay", e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                                aria-label="Leave Status"
                            >
                                <option value="">Select Status</option>
                                {leaveStatusOptions.map((option) => (
                                    <option key={option.code} value={option.code}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Teaching Disciplines */}
                <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-100 rounded-lg p-2 border border-indigo-200/60 shadow-sm">
                    <div className="flex items-center space-x-2 mb-2">
                        <div className="p-1.5 bg-indigo-500 rounded-lg shadow-sm">
                            <Target className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900">Teaching Fields</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-0.5">Primary Field 1</label>
                            <input
                                type="text"
                                value={formData.primary_teaching_load_discipline_1}
                                onChange={(e) => handleInputChange("primary_teaching_load_discipline_1", e.target.value)}
                                placeholder="Enter field"
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                aria-label="Primary Teaching Load Discipline 1"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-0.5">Primary Field 2</label>
                            <input
                                type="text"
                                value={formData.primary_teaching_load_discipline_2}
                                onChange={(e) => handleInputChange("primary_teaching_load_discipline_2", e.target.value)}
                                placeholder="Enter field"
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                aria-label="Primary Teaching Load Discipline 2"
                            />
                        </div>
                    </div>
                </div>

                {/* Teaching Load Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                    {/* Elementary/Secondary Teaching Load */}
                    <div className="bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-100 rounded-lg p-2 border border-cyan-200/60 shadow-sm">
                        <div className="flex items-center space-x-2 mb-2">
                            <div className="p-1.5 bg-cyan-500 rounded-lg shadow-sm">
                                <Users className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="text-sm font-semibold text-gray-900">Elementary/Secondary</h3>
                        </div>
                        <div className="space-y-2">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Teaching Hours</label>
                                <div className="grid grid-cols-3 gap-1">
                                    <div>
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            value={formData.lab_hours_elem_sec}
                                            onChange={(e) => handleInputChange("lab_hours_elem_sec", e.target.value)}
                                            placeholder="Lab"
                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200"
                                            aria-label="Lab Hours Elementary/Secondary"
                                        />
                                        <label className="text-xs text-gray-600">Lab</label>
                                        {errors.lab_hours_elem_sec && <p className="text-red-500 text-xs mt-0.5">{errors.lab_hours_elem_sec}</p>}
                                    </div>
                                    <div>
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            value={formData.lecture_hours_elem_sec}
                                            onChange={(e) => handleInputChange("lecture_hours_elem_sec", e.target.value)}
                                            placeholder="Lecture"
                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200"
                                            aria-label="Lecture Hours Elementary/Secondary"
                                        />
                                        <label className="text-xs text-gray-600">Lecture</label>
                                        {errors.lecture_hours_elem_sec && <p className="text-red-500 text-xs mt-0.5">{errors.lecture_hours_elem_sec}</p>}
                                    </div>
                                    <div>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={formData.total_teaching_hours_elem_sec}
                                            className="w-full px-2 py-1 text-sm border border-cyan-300 rounded bg-cyan-50"
                                            readOnly
                                            aria-label="Total Teaching Hours Elementary/Secondary"
                                        />
                                        <label className="text-xs text-cyan-600">Total</label>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Contact Hours</label>
                                <div className="grid grid-cols-3 gap-1">
                                    <div>
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            value={formData.student_lab_contact_hours_elem_sec}
                                            onChange={(e) => handleInputChange("student_lab_contact_hours_elem_sec", e.target.value)}
                                            placeholder="Lab"
                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200"
                                            aria-label="Student Lab Contact Hours Elementary/Secondary"
                                        />
                                        <label className="text-xs text-gray-600">Lab</label>
                                        {errors.student_lab_contact_hours_elem_sec && <p className="text-red-500 text-xs mt-0.5">{errors.student_lab_contact_hours_elem_sec}</p>}
                                    </div>
                                    <div>
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            value={formData.student_lecture_contact_hours_elem_sec}
                                            onChange={(e) => handleInputChange("student_lecture_contact_hours_elem_sec", e.target.value)}
                                            placeholder="Lecture"
                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200"
                                            aria-label="Student Lecture Contact Hours Elementary/Secondary"
                                        />
                                        <label className="text-xs text-gray-600">Lecture</label>
                                        {errors.student_lecture_contact_hours_elem_sec && <p className="text-red-500 text-xs mt-0.5">{errors.student_lecture_contact_hours_elem_sec}</p>}
                                    </div>
                                    <div>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={formData.total_student_contact_hours_elem_sec}
                                            className="w-full px-2 py-1 text-sm border border-cyan-300 rounded bg-cyan-50"
                                            readOnly
                                            aria-label="Total Student Contact Hours Elementary/Secondary"
                                        />
                                        <label className="text-xs text-cyan-600">Total</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Technical/Vocational Teaching Load */}
                    <div className="bg-gradient-to-br from-teal-50 via-emerald-50 to-green-100 rounded-lg p-2 border border-teal-200/60 shadow-sm">
                        <div className="flex items-center space-x-2 mb-2">
                            <div className="p-1.5 bg-teal-500 rounded-lg shadow-sm">
                                <Target className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="text-sm font-semibold text-gray-900">Technical/Vocational</h3>
                        </div>
                        <div className="space-y-2">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Teaching Hours</label>
                                <div className="grid grid-cols-3 gap-1">
                                    <div>
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            value={formData.lab_hours_tech_voc}
                                            onChange={(e) => handleInputChange("lab_hours_tech_voc", e.target.value)}
                                            placeholder="Lab"
                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200"
                                            aria-label="Lab Hours Technical/Vocational"
                                        />
                                        <label className="text-xs text-gray-600">Lab</label>
                                        {errors.lab_hours_tech_voc && <p className="text-red-500 text-xs mt-0.5">{errors.lab_hours_tech_voc}</p>}
                                    </div>
                                    <div>
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            value={formData.lecture_hours_tech_voc}
                                            onChange={(e) => handleInputChange("lecture_hours_tech_voc", e.target.value)}
                                            placeholder="Lecture"
                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200"
                                            aria-label="Lecture Hours Technical/Vocational"
                                        />
                                        <label className="text-xs text-gray-600">Lecture</label>
                                        {errors.lecture_hours_tech_voc && <p className="text-red-500 text-xs mt-0.5">{errors.lecture_hours_tech_voc}</p>}
                                    </div>
                                    <div>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={formData.total_teaching_hours_tech_voc}
                                            className="w-full px-2 py-1 text-sm border border-teal-300 rounded bg-teal-50"
                                            readOnly
                                            aria-label="Total Teaching Hours Technical/Vocational"
                                        />
                                        <label className="text-xs text-teal-600">Total</label>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Contact Hours</label>
                                <div className="grid grid-cols-3 gap-1">
                                    <div>
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            value={formData.student_lab_contact_hours_tech_voc}
                                            onChange={(e) => handleInputChange("student_lab_contact_hours_tech_voc", e.target.value)}
                                            placeholder="Lab"
                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200"
                                            aria-label="Student Lab Contact Hours Technical/Vocational"
                                        />
                                        <label className="text-xs text-gray-600">Lab</label>
                                        {errors.student_lab_contact_hours_tech_voc && <p className="text-red-500 text-xs mt-0.5">{errors.student_lab_contact_hours_tech_voc}</p>}
                                    </div>
                                    <div>
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            value={formData.student_lecture_contact_hours_tech_voc}
                                            onChange={(e) => handleInputChange("student_lecture_contact_hours_tech_voc", e.target.value)}
                                            placeholder="Lecture"
                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200"
                                            aria-label="Student Lecture Contact Hours Technical/Vocational"
                                        />
                                        <label className="text-xs text-gray-600">Lecture</label>
                                        {errors.student_lecture_contact_hours_tech_voc && <p className="text-red-500 text-xs mt-0.5">{errors.student_lecture_contact_hours_tech_voc}</p>}
                                    </div>
                                    <div>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={formData.total_student_contact_hours_tech_voc}
                                            className="w-full px-2 py-1 text-sm border border-teal-300 rounded bg-teal-50"
                                            readOnly
                                            aria-label="Total Student Contact Hours Technical/Vocational"
                                        />
                                        <label className="text-xs text-teal-600">Total</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Official Loads */}
                <div className="bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 rounded-lg p-2 border border-slate-200/60 shadow-sm">
                    <div className="flex items-center space-x-2 mb-2">
                        <div className="p-1.5 bg-slate-600 rounded-lg shadow-sm">
                            <Clock className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900">Work Load</h3>
                    </div>
                    <div className="space-y-2">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-0.5">Research</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    value={formData.official_research_load}
                                    onChange={(e) => handleInputChange("official_research_load", e.target.value)}
                                    placeholder="0.0"
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-slate-500 focus:border-slate-500 transition-colors duration-200"
                                    aria-label="Research Load"
                                />
                                {errors.official_research_load && <p className="text-red-500 text-xs mt-0.5">{errors.official_research_load}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-0.5">Extension</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    value={formData.official_extension_services_load}
                                    onChange={(e) => handleInputChange("official_extension_services_load", e.target.value)}
                                    placeholder="0.0"
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-slate-500 focus:border-slate-500 transition-colors duration-200"
                                    aria-label="Extension Services Load"
                                />
                                {errors.official_extension_services_load && <p className="text-red-500 text-xs mt-0.5">{errors.official_extension_services_load}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-0.5">Study</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    value={formData.official_study_load}
                                    onChange={(e) => handleInputChange("official_study_load", e.target.value)}
                                    placeholder="0.0"
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-slate-500 focus:border-slate-500 transition-colors duration-200"
                                    aria-label="Study Load"
                                />
                                {errors.official_study_load && <p className="text-red-500 text-xs mt-0.5">{errors.official_study_load}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-0.5">Production</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    value={formData.official_load_for_production}
                                    onChange={(e) => handleInputChange("official_load_for_production", e.target.value)}
                                    placeholder="0.0"
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-slate-500 focus:border-slate-500 transition-colors duration-200"
                                    aria-label="Production Load"
                                />
                                {errors.official_load_for_production && <p className="text-red-500 text-xs mt-0.5">{errors.official_load_for_production}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-0.5">Administrative</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    value={formData.official_administrative_load}
                                    onChange={(e) => handleInputChange("official_administrative_load", e.target.value)}
                                    placeholder="0.0"
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-slate-500 focus:border-slate-500 transition-colors duration-200"
                                    aria-label="Administrative Load"
                                />
                                {errors.official_administrative_load && <p className="text-red-500 text-xs mt-0.5">{errors.official_administrative_load}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-0.5">Other</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    value={formData.other_official_load_credits}
                                    onChange={(e) => handleInputChange("other_official_load_credits", e.target.value)}
                                    placeholder="0.0"
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-slate-500 focus:border-slate-500 transition-colors duration-200"
                                    aria-label="Other Official Load"
                                />
                                {errors.other_official_load_credits && <p className="text-red-500 text-xs mt-0.5">{errors.other_official_load_credits}</p>}
                            </div>
                        </div>

                        {/* Total Work Load Display */}
                        <div className="bg-white/60 rounded-md p-2 border border-slate-300">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-gray-700">Total Hours:</span>
                                <div className="text-sm font-bold text-slate-900">
                                    {formData.total_work_load || 0}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2 border-t border-gray-200">
                    <button
                        onClick={handleClose}
                        disabled={loading}
                        className="w-full sm:w-auto px-4 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-gray-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        aria-label="Cancel"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full sm:w-auto px-4 py-1.5 text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-500 shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center"
                        aria-label="Create Faculty"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1.5"></div>
                                Creating...
                            </>
                        ) : (
                            <>
                                <Save className="w-3 h-3 mr-1.5" />
                                Create Faculty
                            </>
                        )}
                    </button>
                </div>
            </div>
        </Dialog>
    );
}

AddFacultyForm.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    institutionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    loading: PropTypes.bool,
};

export default AddFacultyForm;
