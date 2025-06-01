import {
    GraduationCap,
    BookOpen,
    Users,
    Calendar,
    DollarSign,
    Award,
    FileText,
    Clock,
    TrendingUp,
    Eye,
} from "lucide-react";
import PropTypes from "prop-types";
import Dialog from "../../../../Components/Dialog";

function ProgramDetailsView({ isOpen, onClose, programData }) {
    if (!programData) return null;

    const formatCurrency = (amount) => {
        if (!amount) return "₱0.00";
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP'
        }).format(amount);
    };

    const getTotalEnrollment = () => {
        const fields = [
            '1st_year_male', '1st_year_female',
            '2nd_year_male', '2nd_year_female',
            '3rd_year_male', '3rd_year_female',
            '4th_year_male', '4th_year_female',
            '5th_year_male', '5th_year_female',
            '6th_year_male', '6th_year_female',
            '7th_year_male', '7th_year_female'
        ];
        return fields.reduce((total, field) => total + (Number(programData[field]) || 0), 0);
    };

    const getTotalMale = () => {
        const fields = [
            '1st_year_male', '2nd_year_male', '3rd_year_male',
            '4th_year_male', '5th_year_male', '6th_year_male', '7th_year_male'
        ];
        return fields.reduce((total, field) => total + (Number(programData[field]) || 0), 0);
    };

    const getTotalFemale = () => {
        const fields = [
            '1st_year_female', '2nd_year_female', '3rd_year_female',
            '4th_year_female', '5th_year_female', '6th_year_female', '7th_year_female'
        ];
        return fields.reduce((total, field) => total + (Number(programData[field]) || 0), 0);
    };

    const getEnrollmentByYear = () => {
        const years = [
            { year: '1st Year', male: Number(programData['1st_year_male']) || 0, female: Number(programData['1st_year_female']) || 0 },
            { year: '2nd Year', male: Number(programData['2nd_year_male']) || 0, female: Number(programData['2nd_year_female']) || 0 },
            { year: '3rd Year', male: Number(programData['3rd_year_male']) || 0, female: Number(programData['3rd_year_female']) || 0 },
            { year: '4th Year', male: Number(programData['4th_year_male']) || 0, female: Number(programData['4th_year_female']) || 0 },
            { year: '5th Year', male: Number(programData['5th_year_male']) || 0, female: Number(programData['5th_year_female']) || 0 },
            { year: '6th Year', male: Number(programData['6th_year_male']) || 0, female: Number(programData['6th_year_female']) || 0 },
            { year: '7th Year', male: Number(programData['7th_year_male']) || 0, female: Number(programData['7th_year_female']) || 0 },
        ].filter(year => year.male > 0 || year.female > 0);

        return years;
    };

    const getProgramTypeColor = (type) => {
        switch (type?.toLowerCase()) {
            case 'undergraduate':
                return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300';
            case 'graduate':
                return 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300';
            case 'doctoral':
                return 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border-emerald-300';
            default:
                return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300';
        }
    };

    const getCalendarCode = (code) => {
        const calendarTypes = {
            'SEM': 'Semester',
            'TRI': 'Trimester',
            'QTR': 'Quarter',
            'ANN': 'Annual',
            'MOD': 'Modular'
        };
        return calendarTypes[code] || String(code) || 'Not specified';
    };

    const getProgramStatus = (status) => {
        const statusTypes = {
            'ACTIVE': { label: 'Active', color: 'bg-green-100 text-green-800 border-green-300' },
            'INACTIVE': { label: 'Inactive', color: 'bg-red-100 text-red-800 border-red-300' },
            'SUSPENDED': { label: 'Suspended', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
            'PHASED_OUT': { label: 'Phased Out', color: 'bg-gray-100 text-gray-800 border-gray-300' }
        };
        return statusTypes[status] || { label: String(status) || 'Unknown', color: 'bg-gray-100 text-gray-800 border-gray-300' };
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

    // Safe number conversion function
    const safeNumber = (value, defaultValue = 0) => {
        const num = Number(value);
        return isNaN(num) ? defaultValue : num;
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title={safeValue(programData.program_name, "Program Details")}
            subtitle="Academic Program Information"
            icon={Eye}
            variant="view"
            size="xl"
        >
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {/* Basic Program Information */}
                <div className="bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-100 rounded-xl p-4 border border-blue-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-blue-500 rounded-lg shadow-sm">
                            <GraduationCap className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">Program Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Program Name</label>
                            <p className="text-sm text-gray-900 font-semibold">{safeValue(programData.program_name)}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Program Code</label>
                            <p className="text-sm text-gray-900">{safeValue(programData.program_code, "Not assigned")}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Major/Specialization</label>
                            <p className="text-sm text-gray-900">{safeValue(programData.major_name, "No major specified")}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Major Code</label>
                            <p className="text-sm text-gray-900">{safeValue(programData.major_code, "Not assigned")}</p>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Program Type & Status</label>
                            <div className="flex flex-wrap gap-2">
                                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getProgramTypeColor(programData.program_type)}`}>
                                    {safeValue(programData.program_type, "Unknown Type")}
                                </span>
                                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getProgramStatus(programData.program_status).color}`}>
                                    {getProgramStatus(programData.program_status).label}
                                </span>
                                {programData.is_thesis_dissertation_required && (
                                    <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 border border-purple-300">
                                        Thesis Required
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Academic Details & Financial Info Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Academic Details */}
                    <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 rounded-xl p-4 border border-emerald-200/60 shadow-sm">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-emerald-500 rounded-lg shadow-sm">
                                <BookOpen className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">Academic Details</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">AOP Category</label>
                                    <p className="text-sm text-gray-900">{safeValue(programData.aop_category)}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">AOP Serial</label>
                                    <p className="text-sm text-gray-900">{safeValue(programData.aop_serial, "Not assigned")}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        <Calendar className="w-4 h-4 inline mr-1" />
                                        Program Length
                                    </label>
                                    <p className="text-sm text-gray-900">{safeNumber(programData.program_normal_length_in_years)} years</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        <Clock className="w-4 h-4 inline mr-1" />
                                        Calendar System
                                    </label>
                                    <p className="text-sm text-gray-900">{getCalendarCode(programData.calendar_use_code)}</p>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Units Distribution</label>
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div className="bg-white/60 rounded-lg p-2 border">
                                        <div className="text-xs text-gray-600">Lecture</div>
                                        <div className="text-sm font-semibold text-gray-900">{safeNumber(programData.lecture_units)}</div>
                                    </div>
                                    <div className="bg-white/60 rounded-lg p-2 border">
                                        <div className="text-xs text-gray-600">Lab</div>
                                        <div className="text-sm font-semibold text-gray-900">{safeNumber(programData.lab_units)}</div>
                                    </div>
                                    <div className="bg-white/60 rounded-lg p-2 border border-emerald-300">
                                        <div className="text-xs text-emerald-600">Total</div>
                                        <div className="text-sm font-semibold text-emerald-900">{safeNumber(programData.total_units)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Financial Information */}
                    <div className="bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-100 rounded-xl p-4 border border-purple-200/60 shadow-sm">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-purple-500 rounded-lg shadow-sm">
                                <DollarSign className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">Financial Information</h3>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tuition per Unit</label>
                                <p className="text-lg font-semibold text-purple-900">{formatCurrency(programData.tuition_per_unit)}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Program Fee</label>
                                <p className="text-lg font-semibold text-purple-900">{formatCurrency(programData.program_fee)}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Estimated Total Cost</label>
                                <p className="text-sm text-gray-600">
                                    ({safeNumber(programData.total_units)} units × {formatCurrency(programData.tuition_per_unit)} + {formatCurrency(programData.program_fee)})
                                </p>
                                <p className="text-xl font-bold text-purple-900">
                                    {formatCurrency((safeNumber(programData.total_units) * safeNumber(programData.tuition_per_unit)) + safeNumber(programData.program_fee))}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enrollment Statistics */}
                <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 rounded-xl p-4 border border-amber-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-amber-500 rounded-lg shadow-sm">
                            <Users className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">Enrollment Statistics</h3>
                    </div>
                    <div className="space-y-4">
                        {/* Total Enrollment Summary */}
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="bg-white/60 rounded-lg p-3 border">
                                <div className="text-xs text-gray-600">Total Male</div>
                                <div className="text-xl font-bold text-blue-600">{getTotalMale()}</div>
                            </div>
                            <div className="bg-white/60 rounded-lg p-3 border">
                                <div className="text-xs text-gray-600">Total Female</div>
                                <div className="text-xl font-bold text-pink-600">{getTotalFemale()}</div>
                            </div>
                            <div className="bg-white/60 rounded-lg p-3 border border-amber-300">
                                <div className="text-xs text-amber-600">Total Enrollment</div>
                                <div className="text-xl font-bold text-amber-900">{getTotalEnrollment()}</div>
                            </div>
                        </div>

                        {/* Year-wise Breakdown */}
                        {getEnrollmentByYear().length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Year-wise Distribution</label>
                                <div className="space-y-2">
                                    {getEnrollmentByYear().map((year, index) => (
                                        <div key={index} className="flex items-center justify-between bg-white/60 rounded-lg p-2 border">
                                            <span className="text-sm font-medium text-gray-900">{year.year}</span>
                                            <div className="flex items-center space-x-4 text-sm">
                                                <span className="text-blue-600">M: {year.male}</span>
                                                <span className="text-pink-600">F: {year.female}</span>
                                                <span className="font-semibold text-gray-900">Total: {year.male + year.female}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* New Students */}
                        {(safeNumber(programData.new_students_freshmen_male) > 0 || safeNumber(programData.new_students_freshmen_female) > 0) && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Freshmen Students</label>
                                <div className="flex justify-between bg-white/60 rounded-lg p-2 border border-green-300">
                                    <span className="text-sm text-green-600">Male: {safeNumber(programData.new_students_freshmen_male)}</span>
                                    <span className="text-sm text-green-600">Female: {safeNumber(programData.new_students_freshmen_female)}</span>
                                    <span className="text-sm font-semibold text-green-900">
                                        Total: {safeNumber(programData.new_students_freshmen_male) + safeNumber(programData.new_students_freshmen_female)}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Graduates & Scholarships Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Graduates Information */}
                    <div className="bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 rounded-xl p-4 border border-slate-200/60 shadow-sm">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-slate-600 rounded-lg shadow-sm">
                                <Award className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">Graduates</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="grid grid-cols-3 gap-3 text-center">
                                <div className="bg-white/60 rounded-lg p-3 border">
                                    <div className="text-xs text-gray-600">Male</div>
                                    <div className="text-lg font-semibold text-slate-900">{safeNumber(programData.graduates_males)}</div>
                                </div>
                                <div className="bg-white/60 rounded-lg p-3 border">
                                    <div className="text-xs text-gray-600">Female</div>
                                    <div className="text-lg font-semibold text-slate-900">{safeNumber(programData.graduates_females)}</div>
                                </div>
                                <div className="bg-white/60 rounded-lg p-3 border border-slate-300">
                                    <div className="text-xs text-slate-600">Total</div>
                                    <div className="text-lg font-bold text-slate-900">{safeNumber(programData.graduates_total)}</div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Actual Units Taken</label>
                                <div className="grid grid-cols-3 gap-2 text-center mt-1">
                                    <div className="bg-white/60 rounded p-2 border">
                                        <div className="text-xs text-gray-600">Lecture</div>
                                        <div className="text-sm font-semibold">{safeNumber(programData.lecture_units_actual)}</div>
                                    </div>
                                    <div className="bg-white/60 rounded p-2 border">
                                        <div className="text-xs text-gray-600">Lab</div>
                                        <div className="text-sm font-semibold">{safeNumber(programData.laboratory_units_actual)}</div>
                                    </div>
                                    <div className="bg-white/60 rounded p-2 border border-slate-300">
                                        <div className="text-xs text-slate-600">Total</div>
                                        <div className="text-sm font-semibold">{safeNumber(programData.total_units_actual)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Scholarships & Financial Aid */}
                    <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-100 rounded-xl p-4 border border-indigo-200/60 shadow-sm">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-indigo-500 rounded-lg shadow-sm">
                                <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">Scholarships & Aid</h3>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">External Merit Scholars</label>
                                <div className="bg-white/60 rounded-lg p-3 border">
                                    <div className="text-2xl font-bold text-indigo-900">{safeNumber(programData.externally_funded_merit_scholars)}</div>
                                    <div className="text-xs text-gray-600">Students with external scholarships</div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Internal Grantees</label>
                                <div className="bg-white/60 rounded-lg p-3 border">
                                    <div className="text-2xl font-bold text-indigo-900">{safeNumber(programData.internally_funded_grantees)}</div>
                                    <div className="text-xs text-gray-600">Students with institutional aid</div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Total Funded Students</label>
                                <div className="bg-white/60 rounded-lg p-3 border border-indigo-300">
                                    <div className="text-2xl font-bold text-indigo-900">{safeNumber(programData.funded_grantees)}</div>
                                    <div className="text-xs text-indigo-600">All scholarship recipients</div>
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
                        <h3 className="text-base font-semibold text-gray-900">Additional Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">AOP Year</label>
                            <p className="text-sm text-gray-900">{safeValue(programData.aop_year)}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Report Year</label>
                            <p className="text-sm text-gray-900">{safeValue(programData.report_year.year)}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Subtotal Male Students</label>
                            <p className="text-sm text-gray-900">{safeValue(programData.subtotal_male, "Auto-calculated")}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Subtotal Female Students</label>
                            <p className="text-sm text-gray-900">{safeValue(programData.subtotal_female, "Auto-calculated")}</p>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Grand Total Enrollment</label>
                            <p className="text-lg font-semibold text-gray-900">{safeValue(programData.grand_total, getTotalEnrollment().toString())}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    );
}

ProgramDetailsView.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    programData: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        program_name: PropTypes.string,
        program_code: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        major_name: PropTypes.string,
        major_code: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        aop_category: PropTypes.string,
        aop_serial: PropTypes.string,
        aop_year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        is_thesis_dissertation_required: PropTypes.bool,
        program_status: PropTypes.string,
        calendar_use_code: PropTypes.string,
        program_normal_length_in_years: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        lab_units: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        lecture_units: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        total_units: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        tuition_per_unit: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        program_fee: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        program_type: PropTypes.string,
        new_students_freshmen_male: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        new_students_freshmen_female: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        '1st_year_male': PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        '1st_year_female': PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        '2nd_year_male': PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        '2nd_year_female': PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        '3rd_year_male': PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        '3rd_year_female': PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        '4th_year_male': PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        '4th_year_female': PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        '5th_year_male': PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        '5th_year_female': PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        '6th_year_male': PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        '6th_year_female': PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        '7th_year_male': PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        '7th_year_female': PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        subtotal_male: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        subtotal_female: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        grand_total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        lecture_units_actual: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        laboratory_units_actual: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        total_units_actual: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        graduates_males: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        graduates_females: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        graduates_total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        externally_funded_merit_scholars: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        internally_funded_grantees: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        funded_grantees: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        report_year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
};

export default ProgramDetailsView;
