import {
    User,
    GraduationCap,
    BookOpen,
    Clock,
    DollarSign,
    Award,
    Users,
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

function FacultyDetailsView({ isOpen, onClose, facultyData }) {
    if (!facultyData) return null;

    const formatValue = (value) => {
        return value || "Not specified";
    };

    const getLabelFromOptions = (value, options) => {
        if (!value) return "Not specified";
        const option = options.find(opt => opt.code === value);
        return option ? option.label : value;
    };

    const getDegreeColor = (degree) => {
        switch (degree?.toLowerCase()) {
            case 'doctorate':
            case 'phd':
                return "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800";
            case 'masters':
            case 'master':
                return "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800";
            case 'bachelors':
            case 'bachelor':
                return "bg-gradient-to-r from-green-100 to-green-200 text-green-800";
            default:
                return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800";
        }
    };

    const formatHours = (hours) => {
        if (!hours) return "Not specified";
        return `${hours} hours`;
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title={facultyData.faculty_name}
            subtitle="Faculty Details & Information"
            icon={User}
            variant="default"
            size="xl"
        >
            <div className="space-y-4 p-4">
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                            <div className="bg-white/70 rounded-lg p-3 border border-blue-100">
                                <p className="text-gray-900 font-medium">
                                    {getLabelFromOptions(facultyData.gender, genderOptions)}
                                </p>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tenure Status</label>
                            <div className="bg-white/70 rounded-lg p-3 border border-blue-100">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    facultyData.is_tenured === "1"
                                        ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800"
                                        : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800"
                                }`}>
                                    {getLabelFromOptions(facultyData.is_tenured, tenureOptions)}
                                </span>
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Faculty Type</label>
                            <div className="bg-white/70 rounded-lg p-3 border border-blue-100">
                                <p className="text-gray-900 font-medium">
                                    {getLabelFromOptions(facultyData.faculty_type, facultyTypeOptions)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Position & Academic Home Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Position Information */}
                    <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 rounded-xl p-4 border border-emerald-200/60 shadow-sm">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-emerald-500 rounded-lg shadow-sm">
                                <Award className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">Position & Rank</h3>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Faculty Rank</label>
                                <div className="bg-white/70 rounded-lg p-3 border border-emerald-100">
                                    <p className="text-gray-900 font-medium">
                                        {getLabelFromOptions(facultyData.generic_faculty_rank, facultyRankOptions)}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Salary Grade</label>
                                <div className="bg-white/70 rounded-lg p-3 border border-emerald-100">
                                    <p className="text-gray-900 font-medium">
                                        {getLabelFromOptions(facultyData.ssl_salary_grade, salaryGradeOptions)}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full-Time Equivalent</label>
                                <div className="bg-white/70 rounded-lg p-3 border border-emerald-100">
                                    <p className="text-gray-900 font-medium">
                                        {getLabelFromOptions(facultyData.full_time_equivalent, fteOptions)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Academic Home */}
                    <div className="bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-100 rounded-xl p-4 border border-purple-200/60 shadow-sm">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-purple-500 rounded-lg shadow-sm">
                                <BookOpen className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">Academic Home</h3>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Home College</label>
                                <div className="bg-white/70 rounded-lg p-3 border border-purple-100">
                                    <p className="text-gray-900 font-medium break-words">
                                        {formatValue(facultyData.home_college)}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Home Department</label>
                                <div className="bg-white/70 rounded-lg p-3 border border-purple-100">
                                    <p className="text-gray-900 font-medium break-words">
                                        {formatValue(facultyData.home_dept)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Educational Background */}
                <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 rounded-xl p-4 border border-amber-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-amber-500 rounded-lg shadow-sm">
                            <GraduationCap className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">Educational Background</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Highest Degree</label>
                            <div className="bg-white/70 rounded-lg p-3 border border-amber-100">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDegreeColor(facultyData.highest_degree_attained)}`}>
                                    {getLabelFromOptions(facultyData.highest_degree_attained, degreeOptions)}
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Pursuing Next Degree</label>
                            <div className="bg-white/70 rounded-lg p-3 border border-amber-100">
                                <p className="text-gray-900 font-medium">
                                    {getLabelFromOptions(facultyData.actively_pursuing_next_degree, pursuingDegreeOptions)}
                                </p>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Masters Thesis Status</label>
                            <div className="bg-white/70 rounded-lg p-3 border border-amber-100">
                                <p className="text-gray-900 font-medium">
                                    {getLabelFromOptions(facultyData.masters_with_thesis, thesisOptions)}
                                </p>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Doctorate Dissertation Status</label>
                            <div className="bg-white/70 rounded-lg p-3 border border-amber-100">
                                <p className="text-gray-900 font-medium">
                                    {getLabelFromOptions(facultyData.doctorate_with_dissertation, dissertationOptions)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Teaching Load */}
                <div className="bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-100 rounded-xl p-4 border border-cyan-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-cyan-500 rounded-lg shadow-sm">
                            <Users className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">Teaching Load</h3>
                    </div>
                    <div className="space-y-6">
                        {/* Elementary/Secondary Teaching Load */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-3">Elementary/Secondary Teaching Load</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Lab Hours</label>
                                    <div className="bg-white/70 rounded-lg p-3 border border-cyan-100">
                                        <p className="text-gray-900 font-medium">
                                            {formatHours(facultyData.lab_hours_elem_sec)}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Lecture Hours</label>
                                    <div className="bg-white/70 rounded-lg p-3 border border-cyan-100">
                                        <p className="text-gray-900 font-medium">
                                            {formatHours(facultyData.lecture_hours_elem_sec)}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Teaching Hours</label>
                                    <div className="bg-white/70 rounded-lg p-3 border border-cyan-100">
                                        <p className="text-gray-900 font-medium">
                                            {formatHours(facultyData.total_teaching_hours_elem_sec)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Technical/Vocational Teaching Load */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-3">Technical/Vocational Teaching Load</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Lab Hours</label>
                                    <div className="bg-white/70 rounded-lg p-3 border border-cyan-100">
                                        <p className="text-gray-900 font-medium">
                                            {formatHours(facultyData.lab_hours_tech_voc)}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Lecture Hours</label>
                                    <div className="bg-white/70 rounded-lg p-3 border border-cyan-100">
                                        <p className="text-gray-900 font-medium">
                                            {formatHours(facultyData.lecture_hours_tech_voc)}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Teaching Hours</label>
                                    <div className="bg-white/70 rounded-lg p-3 border border-cyan-100">
                                        <p className="text-gray-900 font-medium">
                                            {formatHours(facultyData.total_teaching_hours_tech_voc)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Official Load */}
                <div className="bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 rounded-xl p-4 border border-slate-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-slate-600 rounded-lg shadow-sm">
                            <Clock className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">Official Load Distribution</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Research Load</label>
                            <div className="bg-white/70 rounded-lg p-3 border border-slate-100">
                                <p className="text-gray-900 font-medium">
                                    {formatHours(facultyData.official_research_load)}
                                </p>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Extension Services</label>
                            <div className="bg-white/70 rounded-lg p-3 border border-slate-100">
                                <p className="text-gray-900 font-medium">
                                    {formatHours(facultyData.official_extension_services_load)}
                                </p>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Study Load</label>
                            <div className="bg-white/70 rounded-lg p-3 border border-slate-100">
                                <p className="text-gray-900 font-medium">
                                    {formatHours(facultyData.official_study_load)}
                                </p>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Production Load</label>
                            <div className="bg-white/70 rounded-lg p-3 border border-slate-100">
                                <p className="text-gray-900 font-medium">
                                    {formatHours(facultyData.official_load_for_production)}
                                </p>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Administrative Load</label>
                            <div className="bg-white/70 rounded-lg p-3 border border-slate-100">
                                <p className="text-gray-900 font-medium">
                                    {formatHours(facultyData.official_administrative_load)}
                                </p>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Other Official Load</label>
                            <div className="bg-white/70 rounded-lg p-3 border border-slate-100">
                                <p className="text-gray-900 font-medium">
                                    {formatHours(facultyData.other_official_load_credits)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Total Work Load */}
                <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 rounded-xl p-4 border border-green-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-green-500 rounded-lg shadow-sm">
                            <DollarSign className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">Total Work Load</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Total Work Load (Hours)</label>
                            <div className="bg-white/70 rounded-lg p-3 border border-green-100">
                                <p className="text-gray-900 font-medium">
                                    {formatHours(facultyData.total_work_load)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    );
}

FacultyDetailsView.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    facultyData: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        faculty_name: PropTypes.string,
        generic_faculty_rank: PropTypes.string,
        home_college: PropTypes.string,
        home_dept: PropTypes.string,
        is_tenured: PropTypes.string,
        ssl_salary_grade: PropTypes.string,
        annual_basic_salary: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        on_leave_without_pay: PropTypes.string,
        full_time_equivalent: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        gender: PropTypes.string,
        highest_degree_attained: PropTypes.string,
        actively_pursuing_next_degree: PropTypes.string,
        primary_teaching_load_discipline_1: PropTypes.string,
        primary_teaching_load_discipline_2: PropTypes.string,
        bachelors_discipline: PropTypes.string,
        masters_discipline: PropTypes.string,
        doctorate_discipline: PropTypes.string,
        masters_with_thesis: PropTypes.string,
        doctorate_with_dissertation: PropTypes.string,
        lab_hours_elem_sec: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        lecture_hours_elem_sec: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        total_teaching_hours_elem_sec: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        student_lab_contact_hours_elem_sec: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        student_lecture_contact_hours_elem_sec: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        total_student_contact_hours_elem_sec: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        lab_hours_tech_voc: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        lecture_hours_tech_voc: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        total_teaching_hours_tech_voc: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        student_lab_contact_hours_tech_voc: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        student_lecture_contact_hours_tech_voc: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        total_student_contact_hours_tech_voc: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        official_research_load: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        official_extension_services_load: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        official_study_load: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        official_load_for_production: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        official_administrative_load: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        other_official_load_credits: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        total_work_load: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        faculty_type: PropTypes.string,
    })
};

export default FacultyDetailsView;
