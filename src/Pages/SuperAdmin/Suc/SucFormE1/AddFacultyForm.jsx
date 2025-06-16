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
    { code: "10", label: "TEACHER, MASTER TEACHER" },
    { code: "20", label: "INSTRUCTOR" },
    { code: "30", label: "ASSISTANT PROFESSOR" },
    { code: "40", label: "ASSOCIATE PROFESSOR" },
    { code: "50", label: "FULL PROFESSOR (including UNIVERSITY PROFESSOR)" },
    { code: "09", label: "TEACHING FELLOW OR TEACHING ASSOCIATE" },
    { code: "11", label: "LECTURER, SENIOR LECTURER, PROFESSORIAL LECTURER" },
    { code: "12", label: "PROFESSOR EMERITUS" },
    { code: "13", label: "VISITING PROFESSOR (WHATEVER THE ACTUAL RANK)" },
    { code: "14", label: "ADJUNCT OR AFFILIATE FACULTY" },
    { code: "90", label: "OTHERS" },
];

const degreeOptions = [
    { code: "000", label: "No formal education at all" },
    { code: "101", label: "Partial elementary schooling but did not complete Grade 4" },
    { code: "102", label: "Completed Grade 4 but did not graduate from elementary school" },
    { code: "103", label: "Completed Elementary School" },
    { code: "201", label: "Partial completion of High School" },
    { code: "202", label: "Secondary school graduate or equivalent" },
    { code: "301", label: "Partial completion of High School" },
    { code: "302", label: "Completed Tech/Voc" },
    { code: "401", label: "Partial completion of pre-baccalaureate certificate, diploma or associateship" },
    { code: "402", label: "Completed pre-bacc certificate, diploma or associateship" },
    { code: "501", label: "Completed Year 1 of baccalaureate level or equivalent" },
    { code: "502", label: "Completed Year 2 of baccalaureate level or equivalent" },
    { code: "503", label: "Completed Year 3 of baccalaureate level or equivalent" },
    { code: "504", label: "Completed Year 4 of baccalaureate level or equivalent" },
    { code: "505", label: "Completed Year 5 of baccalaureate level or equivalent" },
    { code: "506", label: "Completed Year 6 of baccalaureate level or equivalent" },
    { code: "507", label: "Completed a baccalaureate degree (including DVM, DDM, D Opt)" },
    { code: "601", label: "Partial Completion of postgraduate certificate or diploma program" },
    { code: "602", label: "Completed post-grad certificate or diploma program" },
    { code: "701", label: "Completed Year 1 of MD or LLB (or equivalent)" },
    { code: "702", label: "Completed Year 2 of MD or LLB (or equivalent)" },
    { code: "703", label: "Completed Year 3 of MD or LLB (or equivalent)" },
    { code: "704", label: "Completed Year 4 of MD or LLB (or equivalent)" },
    { code: "705", label: "Completed MD or LLB (or equivalent)" },
    { code: "801", label: "Partial completion of masters degree" },
    { code: "802", label: "Completed all masters requirements except masters thesis" },
    { code: "803", label: "Completed masters degree or equivalent" },
    { code: "901", label: "Partial completion of doctorate degree" },
    { code: "902", label: "Completed all doctorate requirements except dissertation" },
    { code: "903", label: "Completed doctorate degree" },
    { code: "980", label: "NOT A FACULTY MEMBER" },
    { code: "999", label: "No record" },
];

const genderOptions = [
    { code: "1", label: "Male" },
    { code: "2", label: "Female" },
];

const tenureOptions = [
    { code: "1", label: "Faculty member is tenured" },
    { code: "2", label: "Faculty member has his own plantilla item but is NOT TENURED" },
    { code: "3", label: "Faculty member has no plantilla item" },
    { code: "4", label: "No information on the matter" },
];

const salaryGradeOptions = [
    { code: "1", label: "Salary Grade 1 - 33" },
    { code: "90", label: "No salary grade to speak of (part-time, lecturer, emeritus, adjunct)" },
    { code: "99", label: "No information on the matter" },
];

const salaryRangeOptions = [
    { code: "1", label: "60,000 below" },
    { code: "2", label: "60,000 - 69,999" },
    { code: "3", label: "70,000 - 79,999" },
    { code: "4", label: "80,000 - 89,999" },
    { code: "5", label: "90,000 - 99,999" },
    { code: "6", label: "100,000 - 149,999" },
    { code: "7", label: "150,000 - 249,999" },
    { code: "8", label: "250,000 - 499,999" },
    { code: "9", label: "500,000 - UP" },
];

const leaveStatusOptions = [
    { code: "1", label: "The faculty member is on OFFICIAL LEAVE WITHOUT PAY" },
    { code: "2", label: "The faculty member is in ACTIVE DUTY OR ON OFFICIAL LEAVE WITH PAY" },
    { code: "3", label: "No information on the matter" },
];

const fteOptions = [
    { code: "1", label: "FTEF = 1.00" },
    { code: "2", label: "FTEF = 0.50" },
    { code: "3", label: "FTEF = 0.250" },
];

const pursuingDegreeOptions = [
    { code: "1", label: "Faculty has already completed doctorate degree in the field where he is teaching" },
    { code: "2", label: "Masters degree holder with some PhD units actively pursuing doctorate degree" },
    { code: "3", label: "Masters degree holder with some PhD units but no longer actively pursuing PhD" },
    { code: "4", label: "Masters degree holder with no PhD units in the discipline where he is teaching" },
    { code: "5", label: "Bachelors degree holder with some masters units actively pursuing masters degree" },
    { code: "6", label: "Bachelors degree holder with some masters units but no longer in active pursuit" },
    { code: "7", label: "Bachelors degree holder with no masters units in the discipline where he is teaching" },
    { code: "8", label: "Not a faculty member" },
    { code: "9", label: "No information on the matter" },
];

const thesisOptions = [
    { code: "1", label: "YES. IN OBTAINING MASTERS DEGREE, THE FACULTY MEMBER WROTE A THESIS" },
    { code: "2", label: "NO. IN OBTAINING HIS MASTERS, FACULTY MEMBER DID NOT WRITE A THESIS" },
    { code: "3", label: "NO INFORMATION ON THE MATTER" },
];

const dissertationOptions = [
    { code: "1", label: "YES. IN OBTAINING DOCTORATE, THE FACULTY MEMBER WROTE A DISSERTATION" },
    { code: "2", label: "NO. IN OBTAINING DOCTORATE, FACULTY MEMBER DID NOT WRITE DISSERTATION" },
    { code: "3", label: "NO INFORMATION ON THE MATTER" },
];

const facultyTypeOptions = [
    { code: "A1", label: "GROUP A1: FULL-TIME FACULTY MEMBERS WITH THEIR OWN FACULTY PLANTILLA ITEMS TEACHING AT ELEM, SECONDARY AND TECH/VOC" },
    { code: "B", label: "GROUP B: FULL-TIME FACULTY MEMBERS WITH NO PS ITEMS BUT DRAWING SALARIES FROM THE PS ITEMS OF FACULTY ON LEAVE WITHOUT PAY" },
    { code: "C1", label: "GROUP C1: FULL-TIME FACULTY MEMBERS WITH NO PS ITEMS DRAWING SALARIES FROM GAA PS LUMP SUMS" },
    { code: "C2", label: "GROUP C2: FULL-TIME FACULTY MEMBERS WITH NO PS ITEMS DRAWING SALARIES FROM SUC INCOME" },
    { code: "C3", label: "GROUP C3: FULL-TIME FACULTY MEMBERS WITH NO PS ITEMS DRAWING SALARIES FROM LGU FUNDS" },
    { code: "E", label: "GROUP E: LECTURERS AND OTHER PART-TIME FACULTY WITH NO ITEMS TEACHING AT ELEMENTARY, SECONDARY OR TECH/VOC LEVELS" },
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
                        <h3 className="text-base font-semibold text-gray-900">Personal Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Faculty Name</label>
                            <input
                                type="text"
                                value={formData.faculty_name}
                                onChange={(e) => handleInputChange("faculty_name", e.target.value)}
                                placeholder="Enter faculty name"
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
                                <option value="">Select Faculty Type</option>
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
                        <h3 className="text-base font-semibold text-gray-900">Academic Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Faculty Rank</label>
                            <select
                                value={formData.generic_faculty_rank}
                                onChange={(e) => handleInputChange("generic_faculty_rank", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                                aria-label="Faculty Rank"
                            >
                                <option value="">Select Faculty Rank</option>
                                {facultyRankOptions.map((option) => (
                                    <option key={option.code} value={option.code}>
                                        {option.code} - {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Home College</label>
                            <input
                                type="text"
                                value={formData.home_college}
                                onChange={(e) => handleInputChange("home_college", e.target.value)}
                                placeholder="Enter home college"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                                aria-label="Home College"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Home Department</label>
                            <input
                                type="text"
                                value={formData.home_dept}
                                onChange={(e) => handleInputChange("home_dept", e.target.value)}
                                placeholder="Enter home department"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                                aria-label="Home Department"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tenure Status</label>
                            <select
                                value={formData.is_tenured}
                                onChange={(e) => handleInputChange("is_tenured", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                                aria-label="Tenure Status"
                            >
                                <option value="">Select Tenure Status</option>
                                {tenureOptions.map((option) => (
                                    <option key={option.code} value={option.code}>
                                        {option.code} - {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Highest Degree Attained</label>
                            <select
                                value={formData.highest_degree_attained}
                                onChange={(e) => handleInputChange("highest_degree_attained", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                                aria-label="Highest Degree Attained"
                            >
                                <option value="">Select Degree</option>
                                {degreeOptions.map((option) => (
                                    <option key={option.code} value={option.code}>
                                        {option.code} - {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Pursuing Next Degree</label>
                            <select
                                value={formData.actively_pursuing_next_degree}
                                onChange={(e) => handleInputChange("actively_pursuing_next_degree", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                                aria-label="Pursuing Next Degree"
                            >
                                <option value="">Select Status</option>
                                {pursuingDegreeOptions.map((option) => (
                                    <option key={option.code} value={option.code}>
                                        {option.code} - {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bachelor&#39;s Discipline</label>
                            <input
                                type="text"
                                value={formData.bachelors_discipline}
                                onChange={(e) => handleInputChange("bachelors_discipline", e.target.value)}
                                placeholder="Enter discipline"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                                aria-label="Bachelor's Discipline"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Master&#39;s Discipline</label>
                            <input
                                type="text"
                                value={formData.masters_discipline}
                                onChange={(e) => handleInputChange("masters_discipline", e.target.value)}
                                placeholder="Enter discipline"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                                aria-label="Master's Discipline"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Doctorate Discipline</label>
                            <input
                                type="text"
                                value={formData.doctorate_discipline}
                                onChange={(e) => handleInputChange("doctorate_discipline", e.target.value)}
                                placeholder="Enter discipline"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                                aria-label="Doctorate Discipline"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Masters Thesis Status</label>
                            <select
                                value={formData.masters_with_thesis}
                                onChange={(e) => handleInputChange("masters_with_thesis", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                                aria-label="Masters Thesis Status"
                            >
                                <option value="">Select Thesis Status</option>
                                {thesisOptions.map((option) => (
                                    <option key={option.code} value={option.code}>
                                        {option.code} - {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Doctorate Dissertation Status</label>
                            <select
                                value={formData.doctorate_with_dissertation}
                                onChange={(e) => handleInputChange("doctorate_with_dissertation", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2Adapter Pattern focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                                aria-label="Doctorate Dissertation Status"
                            >
                                <option value="">Select Dissertation Status</option>
                                {dissertationOptions.map((option) => (
                                    <option key={option.code} value={option.code}>
                                        {option.code} - {option.label}
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
                        <h3 className="text-base font-semibold text-gray-900">Employment Information</h3>
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
                                <option value="">Select Salary Grade</option>
                                {salaryGradeOptions.map((option) => (
                                    <option key={option.code} value={option.code}>
                                        {option.code} - {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Annual Basic Salary</label>
                            <select
                                value={formData.annual_basic_salary}
                                onChange={(e) => handleInputChange("annual_basic_salary", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                                aria-label="Annual Basic Salary"
                            >
                                <option value="">Select Salary Range</option>
                                {salaryRangeOptions.map((option) => (
                                    <option key={option.code} value={option.code}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {errors.annual_basic_salary && <p className="text-red-500 text-xs mt-1">{errors.annual_basic_salary}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Time Equivalent (FTE)</label>
                            <select
                                value={formData.full_time_equivalent}
                                onChange={(e) => handleInputChange("full_time_equivalent", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                                aria-label="Full Time Equivalent"
                            >
                                <option value="">Select FTE</option>
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
                                <option value="">Select Leave Status</option>
                                {leaveStatusOptions.map((option) => (
                                    <option key={option.code} value={option.code}>
                                        {option.code} - {option.label}
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
                        <h3 className="text-base font-semibold text-gray-900">Teaching Disciplines</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Teaching Load Discipline 1</label>
                            <input
                                type="text"
                                value={formData.primary_teaching_load_discipline_1}
                                onChange={(e) => handleInputChange("primary_teaching_load_discipline_1", e.target.value)}
                                placeholder="Enter discipline"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                aria-label="Primary Teaching Load Discipline 1"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Teaching Load Discipline 2</label>
                            <input
                                type="text"
                                value={formData.primary_teaching_load_discipline_2}
                                onChange={(e) => handleInputChange("primary_teaching_load_discipline_2", e.target.value)}
                                placeholder="Enter discipline"
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
                            <h3 className="text-base font-semibold text-gray-900">Elementary/Secondary Load</h3>
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
                                        <label className="text-xs text-gray-600">Lab Hours</label>
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
                                        <label className="text-xs text-gray-600">Lecture Hours</label>
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
                                        <label className="text-xs text-cyan-600">Total Hours</label>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Student Contact Hours</label>
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
                                        <label className="text-xs text-gray-600">Lab Contact</label>
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
                                        <label className="text-xs text-gray-600">Lecture Contact</label>
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
                                        <label className="text-xs text-cyan-600">Total Contact</label>
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
                            <h3 className="text-base font-semibold text-gray-900">Technical/Vocational Load</h3>
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
                                        <label className="text-xs text-gray-600">Lab Hours</label>
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
                                        <label className="text-xs text-gray-600">Lecture Hours</label>
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
                                        <label className="text-xs text-teal-600">Total Hours</label>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Student Contact Hours</label>
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
                                        <label className="text-xs text-gray-600">Lab Contact</label>
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
                                        <label className="text-xs text-gray-600">Lecture Contact</label>
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
                                        <label className="text-xs text-teal-600">Total Contact</label>
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
                        <h3 className="text-base font-semibold text-gray-900">Official Load Distribution</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Research Load</label>
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Extension Services</label>
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Study Load</label>
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Production Load</label>
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Administrative Load</label>
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Other Official Load</label>
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
                                <span className="text-sm font-medium text-gray-700">Total Work Load:</span>
                                <div className="text-lg font-bold text-slate-900">
                                    {formData.total_work_load || 0} hours
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