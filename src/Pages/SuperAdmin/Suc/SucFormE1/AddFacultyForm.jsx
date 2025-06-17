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

const facultyRankOptions = [
    { code: "10", label: "Master Teacher" },
    { code: "20", label: "Instructor" },
    { code: "30", label: "Assistant Professor" },
    { code: "40", label: "Associate Professor" },
    { code: "50", label: "Full Professor" },
    { code: "09", label: "Teaching Fellow" },
    { code: "11", label: "Lecturer" },
    { code: "12", label: "Professor Emeritus" },
    { code: "13", label: "Visiting Professor" },
    { code: "14", label: "Adjunct Faculty" },
    { code: "90", label: "Others" },
];

const degreeOptions = [
    { code: "000", label: "No formal education" },
    { code: "101", label: "Partial elementary (Grade 1-3)" },
    { code: "102", label: "Completed Grade 4" },
    { code: "103", label: "Elementary Graduate" },
    { code: "201", label: "Partial High School" },
    { code: "202", label: "High School Graduate" },
    { code: "301", label: "Partial High School" },
    { code: "302", label: "Tech/Voc Graduate" },
    { code: "401", label: "Partial Pre-baccalaureate" },
    { code: "402", label: "Pre-baccalaureate Graduate" },
    { code: "501", label: "1st Year College" },
    { code: "502", label: "2nd Year College" },
    { code: "503", label: "3rd Year College" },
    { code: "504", label: "4th Year College" },
    { code: "505", label: "5th Year College" },
    { code: "506", label: "6th Year College" },
    { code: "507", label: "Bachelor's Degree" },
    { code: "601", label: "Partial Post-grad Certificate" },
    { code: "602", label: "Post-grad Certificate" },
    { code: "701", label: "1st Year MD/LLB" },
    { code: "702", label: "2nd Year MD/LLB" },
    { code: "703", label: "3rd Year MD/LLB" },
    { code: "704", label: "4th Year MD/LLB" },
    { code: "705", label: "MD/LLB Graduate" },
    { code: "801", label: "Partial Master's" },
    { code: "802", label: "Master's (No Thesis)" },
    { code: "803", label: "Master's Degree" },
    { code: "901", label: "Partial Doctorate" },
    { code: "902", label: "Doctorate (No Dissertation)" },
    { code: "903", label: "Doctorate Degree" },
    { code: "980", label: "Not a Faculty" },
    { code: "999", label: "No Record" },
];

const genderOptions = [
    { code: "1", label: "Male" },
    { code: "2", label: "Female" },
];

const tenureOptions = [
    { code: "1", label: "Tenured" },
    { code: "2", label: "Not Tenured (Has Plantilla)" },
    { code: "3", label: "No Plantilla Item" },
    { code: "4", label: "No Information" },
];

const salaryGradeOptions = [
    { code: "1", label: "Salary Grade 1-33" },
    { code: "90", label: "No Salary Grade" },
    { code: "99", label: "No Information" },
];

const salaryRangeOptions = [
    { code: "1", label: "Below ₱60,000" },
    { code: "2", label: "₱60,000 - ₱69,999" },
    { code: "3", label: "₱70,000 - ₱79,999" },
    { code: "4", label: "₱80,000 - ₱89,999" },
    { code: "5", label: "₱90,000 - ₱99,999" },
    { code: "6", label: "₱100,000 - ₱149,999" },
    { code: "7", label: "₱150,000 - ₱249,999" },
    { code: "8", label: "₱250,000 - ₱499,999" },
    { code: "9", label: "₱500,000 and above" },
];

const leaveStatusOptions = [
    { code: "1", label: "On Leave Without Pay" },
    { code: "2", label: "Active Duty/Leave With Pay" },
    { code: "3", label: "No Information" },
];

const fteOptions = [
    { code: "1", label: "Full Time (1.00)" },
    { code: "2", label: "Half Time (0.50)" },
    { code: "3", label: "Quarter Time (0.25)" },
];

const pursuingDegreeOptions = [
    { code: "1", label: "Completed Doctorate" },
    { code: "2", label: "Pursuing Doctorate" },
    { code: "3", label: "Stopped Pursuing Doctorate" },
    { code: "4", label: "Master's Only" },
    { code: "5", label: "Pursuing Master's" },
    { code: "6", label: "Stopped Pursuing Master's" },
    { code: "7", label: "Bachelor's Only" },
    { code: "8", label: "Not a Faculty" },
    { code: "9", label: "No Information" },
];

const thesisOptions = [
    { code: "1", label: "With Thesis" },
    { code: "2", label: "Without Thesis" },
    { code: "3", label: "No Information" },
];

const dissertationOptions = [
    { code: "1", label: "With Dissertation" },
    { code: "2", label: "Without Dissertation" },
    { code: "3", label: "No Information" },
];

const facultyTypeOptions = [
    { code: "A1", label: "Full-time with Plantilla (Elem/Sec/Tech)" },
    { code: "B", label: "Full-time (Salary from Leave)" },
    { code: "C1", label: "Full-time (GAA PS Lump Sum)" },
    { code: "C2", label: "Full-time (SUC Income)" },
    { code: "C3", label: "Full-time (LGU Funds)" },
    { code: "E", label: "Part-time Lecturer" },
];

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

// Add mapping constants
const genderMapping = {
    M: "1",
    F: "2",
    Male: "1",
    Female: "2",
    MALE: "1",
    FEMALE: "2",
    "1": "1",
    "2": "2",
};

const degreeMapping = {
    "Bachelor": "507",
    "Bachelors": "507",
    "Bachelor's": "507",
    "Masters": "803",
    "Master's": "803",
    "Master": "803",
    "Doctorate": "903",
    "PhD": "903",
    "Ph.D.": "903",
    "Doctoral": "903",
};

const tenureMapping = {
    "Tenured": "1",
    "Not Tenured": "2",
    "No Plantilla": "3",
    "No Info": "4",
    "1": "1",
    "2": "2",
    "3": "3",
    "4": "4",
};

const fteMapping = {
    "Full Time": "1",
    "Half Time": "2",
    "Quarter Time": "3",
    "1": "1",
    "2": "2",
    "3": "3",
};

function AddFacultyForm({ isOpen, onClose, onSave, institutionId, loading = false }) {
    const [formData, setFormData] = useState({
        suc_details_id: institutionId || '',
        faculty_name: "",
        generic_faculty_rank: "",
        home_college: "",
        home_dept: "",
        is_tenured: false,
        ssl_salary_grade: "",
        annual_basic_salary: "",
        on_leave_without_pay: false,
        full_time_equivalent: "",
        gender: "",
        highest_degree_attained: "",
        actively_pursuing_next_degree: false,
        primary_teaching_load_discipline_1: "",
        primary_teaching_load_discipline_2: "",
        bachelors_discipline: "",
        masters_discipline: "",
        doctorate_discipline: "",
        masters_with_thesis: false,
        doctorate_with_dissertation: false,
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
        let processedValue = value;

        // Apply mappings based on field type
        switch (field) {
            case "gender":
                processedValue = genderMapping[value] || value;
                break;
            case "highest_degree_attained":
                processedValue = degreeMapping[value] || value;
                break;
            case "is_tenured":
                processedValue = tenureMapping[value] || value;
                break;
            case "full_time_equivalent":
                processedValue = fteMapping[value] || value;
                break;
            default:
                processedValue = value;
        }

        setFormData(prev => ({
            ...prev,
            [field]: processedValue
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
                suc_details_id: parseInt(institutionId),
                is_tenured: String(formData.is_tenured),
                on_leave_without_pay: String(formData.on_leave_without_pay),
                actively_pursuing_next_degree: String(formData.actively_pursuing_next_degree),
                masters_with_thesis: String(formData.masters_with_thesis),
                doctorate_with_dissertation: String(formData.doctorate_with_dissertation),
                annual_basic_salary: formData.annual_basic_salary ? parseFloat(formData.annual_basic_salary) : null,
                full_time_equivalent: formData.full_time_equivalent ? parseFloat(formData.full_time_equivalent) : null,
                ...Object.fromEntries(
                    hourFields.map(field => [
                        field,
                        formData[field] ? parseFloat(formData[field]) : null
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
            is_tenured: false,
            ssl_salary_grade: "",
            annual_basic_salary: "",
            on_leave_without_pay: false,
            full_time_equivalent: "",
            gender: "",
            highest_degree_attained: "",
            actively_pursuing_next_degree: false,
            primary_teaching_load_discipline_1: "",
            primary_teaching_load_discipline_2: "",
            bachelors_discipline: "",
            masters_discipline: "",
            doctorate_discipline: "",
            masters_with_thesis: false,
            doctorate_with_dissertation: false,
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
            <div className="space-y-4 max-h-[600px] overflow-y-auto p-4">
                {/* Personal Information */}
                <div className="bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-100 rounded-xl p-4 border border-blue-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-blue-500 rounded-lg shadow-sm">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">Basic Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                value={formData.faculty_name}
                                onChange={(e) => handleInputChange("faculty_name", e.target.value)}
                                placeholder="Enter name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                                aria-label="Faculty Name"
                            />
                            {errors.faculty_name && <p className="text-red-500 text-xs mt-1">{errors.faculty_name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                            <select
                                value={formData.gender}
                                onChange={(e) => handleInputChange("gender", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Faculty Type</label>
                            <select
                                value={formData.faculty_type}
                                onChange={(e) => handleInputChange("faculty_type", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
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
                <div className="bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-100 rounded-xl p-4 border border-blue-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-blue-500 rounded-lg shadow-sm">
                            <GraduationCap className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">Academic Details</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rank</label>
                            <select
                                value={formData.generic_faculty_rank}
                                onChange={(e) => handleInputChange("generic_faculty_rank", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">College</label>
                            <input
                                type="text"
                                value={formData.home_college}
                                onChange={(e) => handleInputChange("home_college", e.target.value)}
                                placeholder="Enter college"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                                aria-label="Home College"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                            <input
                                type="text"
                                value={formData.home_dept}
                                onChange={(e) => handleInputChange("home_dept", e.target.value)}
                                placeholder="Enter department"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                                aria-label="Home Department"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tenure</label>
                            <select
                                value={formData.is_tenured}
                                onChange={(e) => handleInputChange("is_tenured", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Highest Degree</label>
                            <select
                                value={formData.highest_degree_attained}
                                onChange={(e) => handleInputChange("highest_degree_attained", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Degree Progress</label>
                            <select
                                value={formData.actively_pursuing_next_degree}
                                onChange={(e) => handleInputChange("actively_pursuing_next_degree", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bachelor&apos;s Field</label>
                            <input
                                type="text"
                                value={formData.bachelors_discipline}
                                onChange={(e) => handleInputChange("bachelors_discipline", e.target.value)}
                                placeholder="Enter field"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                                aria-label="Bachelor's Discipline"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Master&apos;s Field</label>
                            <input
                                type="text"
                                value={formData.masters_discipline}
                                onChange={(e) => handleInputChange("masters_discipline", e.target.value)}
                                placeholder="Enter field"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                                aria-label="Master's Discipline"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Doctorate Field</label>
                            <input
                                type="text"
                                value={formData.doctorate_discipline}
                                onChange={(e) => handleInputChange("doctorate_discipline", e.target.value)}
                                placeholder="Enter field"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                                aria-label="Doctorate Discipline"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Master&apos;s Thesis</label>
                            <select
                                value={formData.masters_with_thesis}
                                onChange={(e) => handleInputChange("masters_with_thesis", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Doctorate Dissertation</label>
                            <select
                                value={formData.doctorate_with_dissertation}
                                onChange={(e) => handleInputChange("doctorate_with_dissertation", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
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
                <div className="bg-gradient-to-br from-green-50 via-green-50 to-emerald-100 rounded-xl p-4 border border-green-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-green-500 rounded-lg shadow-sm">
                            <DollarSign className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">Employment Details</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Salary Grade</label>
                            <select
                                value={formData.ssl_salary_grade}
                                onChange={(e) => handleInputChange("ssl_salary_grade", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
                            <select
                                value={formData.annual_basic_salary}
                                onChange={(e) => handleInputChange("annual_basic_salary", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                                aria-label="Annual Basic Salary"
                            >
                                <option value="">Select Range</option>
                                {salaryRangeOptions.map((option) => (
                                    <option key={option.code} value={option.code}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {errors.annual_basic_salary && <p className="text-red-500 text-xs mt-1">{errors.annual_basic_salary}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Work Status</label>
                            <select
                                value={formData.full_time_equivalent}
                                onChange={(e) => handleInputChange("full_time_equivalent", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                                aria-label="Full Time Equivalent"
                            >
                                <option value="">Select Status</option>
                                {fteOptions.map((option) => (
                                    <option key={option.code} value={option.code}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {errors.full_time_equivalent && <p className="text-red-500 text-xs mt-1">{errors.full_time_equivalent}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Leave Status</label>
                            <select
                                value={formData.on_leave_without_pay}
                                onChange={(e) => handleInputChange("on_leave_without_pay", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
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
                <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-100 rounded-xl p-4 border border-indigo-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-indigo-500 rounded-lg shadow-sm">
                            <Target className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">Teaching Fields</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Field 1</label>
                            <input
                                type="text"
                                value={formData.primary_teaching_load_discipline_1}
                                onChange={(e) => handleInputChange("primary_teaching_load_discipline_1", e.target.value)}
                                placeholder="Enter field"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                aria-label="Primary Teaching Load Discipline 1"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Field 2</label>
                            <input
                                type="text"
                                value={formData.primary_teaching_load_discipline_2}
                                onChange={(e) => handleInputChange("primary_teaching_load_discipline_2", e.target.value)}
                                placeholder="Enter field"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                aria-label="Primary Teaching Load Discipline 2"
                            />
                        </div>
                    </div>
                </div>

                {/* Teaching Load Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Elementary/Secondary Teaching Load */}
                    <div className="bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-100 rounded-xl p-4 border border-cyan-200/60 shadow-sm">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-cyan-500 rounded-lg shadow-sm">
                                <Users className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">Elementary/Secondary</h3>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Teaching Hours</label>
                                <div className="grid grid-cols-3 gap-2">
                                    <div>
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            value={formData.lab_hours_elem_sec}
                                            onChange={(e) => handleInputChange("lab_hours_elem_sec", e.target.value)}
                                            placeholder="Lab"
                                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200 text-sm"
                                            aria-label="Lab Hours Elementary/Secondary"
                                        />
                                        <label className="text-xs text-gray-600">Lab</label>
                                        {errors.lab_hours_elem_sec && <p className="text-red-500 text-xs mt-1">{errors.lab_hours_elem_sec}</p>}
                                    </div>
                                    <div>
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            value={formData.lecture_hours_elem_sec}
                                            onChange={(e) => handleInputChange("lecture_hours_elem_sec", e.target.value)}
                                            placeholder="Lecture"
                                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200 text-sm"
                                            aria-label="Lecture Hours Elementary/Secondary"
                                        />
                                        <label className="text-xs text-gray-600">Lecture</label>
                                        {errors.lecture_hours_elem_sec && <p className="text-red-500 text-xs mt-1">{errors.lecture_hours_elem_sec}</p>}
                                    </div>
                                    <div>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={formData.total_teaching_hours_elem_sec}
                                            className="w-full px-2 py-1 border border-cyan-300 rounded bg-cyan-50 text-sm"
                                            readOnly
                                            aria-label="Total Teaching Hours Elementary/Secondary"
                                        />
                                        <label className="text-xs text-cyan-600">Total</label>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Hours</label>
                                <div className="grid grid-cols-3 gap-2">
                                    <div>
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            value={formData.student_lab_contact_hours_elem_sec}
                                            onChange={(e) => handleInputChange("student_lab_contact_hours_elem_sec", e.target.value)}
                                            placeholder="Lab"
                                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200 text-sm"
                                            aria-label="Student Lab Contact Hours Elementary/Secondary"
                                        />
                                        <label className="text-xs text-gray-600">Lab</label>
                                        {errors.student_lab_contact_hours_elem_sec && <p className="text-red-500 text-xs mt-1">{errors.student_lab_contact_hours_elem_sec}</p>}
                                    </div>
                                    <div>
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            value={formData.student_lecture_contact_hours_elem_sec}
                                            onChange={(e) => handleInputChange("student_lecture_contact_hours_elem_sec", e.target.value)}
                                            placeholder="Lecture"
                                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200 text-sm"
                                            aria-label="Student Lecture Contact Hours Elementary/Secondary"
                                        />
                                        <label className="text-xs text-gray-600">Lecture</label>
                                        {errors.student_lecture_contact_hours_elem_sec && <p className="text-red-500 text-xs mt-1">{errors.student_lecture_contact_hours_elem_sec}</p>}
                                    </div>
                                    <div>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={formData.total_student_contact_hours_elem_sec}
                                            className="w-full px-2 py-1 border border-cyan-300 rounded bg-cyan-50 text-sm"
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
                    <div className="bg-gradient-to-br from-teal-50 via-emerald-50 to-green-100 rounded-xl p-4 border border-teal-200/60 shadow-sm">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-teal-500 rounded-lg shadow-sm">
                                <Target className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">Technical/Vocational</h3>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Teaching Hours</label>
                                <div className="grid grid-cols-3 gap-2">
                                    <div>
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            value={formData.lab_hours_tech_voc}
                                            onChange={(e) => handleInputChange("lab_hours_tech_voc", e.target.value)}
                                            placeholder="Lab"
                                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200 text-sm"
                                            aria-label="Lab Hours Technical/Vocational"
                                        />
                                        <label className="text-xs text-gray-600">Lab</label>
                                        {errors.lab_hours_tech_voc && <p className="text-red-500 text-xs mt-1">{errors.lab_hours_tech_voc}</p>}
                                    </div>
                                    <div>
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            value={formData.lecture_hours_tech_voc}
                                            onChange={(e) => handleInputChange("lecture_hours_tech_voc", e.target.value)}
                                            placeholder="Lecture"
                                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200 text-sm"
                                            aria-label="Lecture Hours Technical/Vocational"
                                        />
                                        <label className="text-xs text-gray-600">Lecture</label>
                                        {errors.lecture_hours_tech_voc && <p className="text-red-500 text-xs mt-1">{errors.lecture_hours_tech_voc}</p>}
                                    </div>
                                    <div>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={formData.total_teaching_hours_tech_voc}
                                            className="w-full px-2 py-1 border border-teal-300 rounded bg-teal-50 text-sm"
                                            readOnly
                                            aria-label="Total Teaching Hours Technical/Vocational"
                                        />
                                        <label className="text-xs text-teal-600">Total</label>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Hours</label>
                                <div className="grid grid-cols-3 gap-2">
                                    <div>
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            value={formData.student_lab_contact_hours_tech_voc}
                                            onChange={(e) => handleInputChange("student_lab_contact_hours_tech_voc", e.target.value)}
                                            placeholder="Lab"
                                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200 text-sm"
                                            aria-label="Student Lab Contact Hours Technical/Vocational"
                                        />
                                        <label className="text-xs text-gray-600">Lab</label>
                                        {errors.student_lab_contact_hours_tech_voc && <p className="text-red-500 text-xs mt-1">{errors.student_lab_contact_hours_tech_voc}</p>}
                                    </div>
                                    <div>
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            value={formData.student_lecture_contact_hours_tech_voc}
                                            onChange={(e) => handleInputChange("student_lecture_contact_hours_tech_voc", e.target.value)}
                                            placeholder="Lecture"
                                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200 text-sm"
                                            aria-label="Student Lecture Contact Hours Technical/Vocational"
                                        />
                                        <label className="text-xs text-gray-600">Lecture</label>
                                        {errors.student_lecture_contact_hours_tech_voc && <p className="text-red-500 text-xs mt-1">{errors.student_lecture_contact_hours_tech_voc}</p>}
                                    </div>
                                    <div>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={formData.total_student_contact_hours_tech_voc}
                                            className="w-full px-2 py-1 border border-teal-300 rounded bg-teal-50 text-sm"
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
                <div className="bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 rounded-xl p-4 border border-slate-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-slate-600 rounded-lg shadow-sm">
                            <Clock className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">Work Load</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Research</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    value={formData.official_research_load}
                                    onChange={(e) => handleInputChange("official_research_load", e.target.value)}
                                    placeholder="0.0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors duration-200"
                                    aria-label="Research Load"
                                />
                                {errors.official_research_load && <p className="text-red-500 text-xs mt-1">{errors.official_research_load}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Extension</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    value={formData.official_extension_services_load}
                                    onChange={(e) => handleInputChange("official_extension_services_load", e.target.value)}
                                    placeholder="0.0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors duration-200"
                                    aria-label="Extension Services Load"
                                />
                                {errors.official_extension_services_load && <p className="text-red-500 text-xs mt-1">{errors.official_extension_services_load}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Study</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    value={formData.official_study_load}
                                    onChange={(e) => handleInputChange("official_study_load", e.target.value)}
                                    placeholder="0.0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors duration-200"
                                    aria-label="Study Load"
                                />
                                {errors.official_study_load && <p className="text-red-500 text-xs mt-1">{errors.official_study_load}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Production</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    value={formData.official_load_for_production}
                                    onChange={(e) => handleInputChange("official_load_for_production", e.target.value)}
                                    placeholder="0.0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors duration-200"
                                    aria-label="Production Load"
                                />
                                {errors.official_load_for_production && <p className="text-red-500 text-xs mt-1">{errors.official_load_for_production}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Administrative</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    value={formData.official_administrative_load}
                                    onChange={(e) => handleInputChange("official_administrative_load", e.target.value)}
                                    placeholder="0.0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors duration-200"
                                    aria-label="Administrative Load"
                                />
                                {errors.official_administrative_load && <p className="text-red-500 text-xs mt-1">{errors.official_administrative_load}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Other</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    value={formData.other_official_load_credits}
                                    onChange={(e) => handleInputChange("other_official_load_credits", e.target.value)}
                                    placeholder="0.0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors duration-200"
                                    aria-label="Other Official Load"
                                />
                                {errors.other_official_load_credits && <p className="text-red-500 text-xs mt-1">{errors.other_official_load_credits}</p>}
                            </div>
                        </div>

                        {/* Total Work Load Display */}
                        <div className="bg-white/60 rounded-lg p-3 border border-slate-300">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">Total Hours:</span>
                                <div className="text-lg font-bold text-slate-900">
                                    {formData.total_work_load || 0}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                        onClick={handleClose}
                        disabled={loading}
                        className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        aria-label="Cancel"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center"
                        aria-label="Create Faculty"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Creating...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
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
