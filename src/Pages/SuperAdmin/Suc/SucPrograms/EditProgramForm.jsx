import { useState, useEffect } from "react";
import {
    GraduationCap,
    BookOpen,
    Users,
    Calendar,
    DollarSign,
    Award,
    FileText,
    Clock,
    Calculator,
    Save,
    Edit,
} from "lucide-react";
import PropTypes from "prop-types";
import Dialog from "../../../../Components/Dialog";
import AlertComponent from "../../../../Components/AlertComponent";

function EditProgramForm({
    isOpen,
    onClose,
    onSave,
    programData,
    loading = false,
}) {
    const [formData, setFormData] = useState({
        suc_details_id: "",
        program_name: "",
        program_code: "",
        major_name: "",
        major_code: "",
        aop_category: "",
        aop_serial: "",
        aop_year: "",
        is_thesis_dissertation_required: false,
        program_status: "ACTIVE",
        calendar_use_code: "SEM",
        program_normal_length_in_years: "",
        lab_units: "",
        lecture_units: "",
        total_units: "",
        tuition_per_unit: "",
        program_fee: "",
        program_type: "undergraduate",
        new_students_freshmen_male: "",
        new_students_freshmen_female: "",
        "1st_year_male": "",
        "1st_year_female": "",
        "2nd_year_male": "",
        "2nd_year_female": "",
        "3rd_year_male": "",
        "3rd_year_female": "",
        "4th_year_male": "",
        "4th_year_female": "",
        "5th_year_male": "",
        "5th_year_female": "",
        "6th_year_male": "",
        "6th_year_female": "",
        "7th_year_male": "",
        "7th_year_female": "",
        subtotal_male: "",
        subtotal_female: "",
        grand_total: "",
        lecture_units_actual: "",
        laboratory_units_actual: "",
        total_units_actual: "",
        graduates_males: "",
        graduates_females: "",
        graduates_total: "",
        externally_funded_merit_scholars: "",
        internally_funded_grantees: "",
        funded_grantees: "",
        report_year: new Date().getFullYear(),
    });

    const [errors, setErrors] = useState({});

    // Populate form when programData changes
    useEffect(() => {
        if (programData) {
            // Helper function to safely extract report year
            const getReportYear = (reportYearData) => {
                // If it's an object with a year property
                if (
                    reportYearData &&
                    typeof reportYearData === "object" &&
                    reportYearData.year
                ) {
                    return reportYearData.year.toString();
                }
                // If it's already a number or string
                if (
                    reportYearData &&
                    (typeof reportYearData === "number" ||
                        typeof reportYearData === "string")
                ) {
                    return reportYearData.toString();
                }
                // Default to current year
                return new Date().getFullYear().toString();
            };

            setFormData({
                suc_details_id: programData.suc_details_id || "",
                program_name: programData.program_name || "",
                program_code: programData.program_code
                    ? programData.program_code.toString()
                    : "",
                major_name: programData.major_name || "",
                major_code: programData.major_code
                    ? programData.major_code.toString()
                    : "",
                aop_category: programData.aop_category || "",
                aop_serial: programData.aop_serial || "",
                aop_year: programData.aop_year
                    ? programData.aop_year.toString()
                    : "",
                is_thesis_dissertation_required:
                    programData.is_thesis_dissertation_required || false,
                program_status: programData.program_status || "ACTIVE",
                calendar_use_code: programData.calendar_use_code || "SEM",
                program_normal_length_in_years:
                    programData.program_normal_length_in_years
                        ? programData.program_normal_length_in_years.toString()
                        : "",
                lab_units: programData.lab_units
                    ? programData.lab_units.toString()
                    : "",
                lecture_units: programData.lecture_units
                    ? programData.lecture_units.toString()
                    : "",
                total_units: programData.total_units
                    ? programData.total_units.toString()
                    : "",
                tuition_per_unit: programData.tuition_per_unit
                    ? programData.tuition_per_unit.toString()
                    : "",
                program_fee: programData.program_fee
                    ? programData.program_fee.toString()
                    : "",
                program_type: programData.program_type || "undergraduate",
                new_students_freshmen_male:
                    programData.new_students_freshmen_male
                        ? programData.new_students_freshmen_male.toString()
                        : "",
                new_students_freshmen_female:
                    programData.new_students_freshmen_female
                        ? programData.new_students_freshmen_female.toString()
                        : "",
                "1st_year_male": programData["1st_year_male"]
                    ? programData["1st_year_male"].toString()
                    : "",
                "1st_year_female": programData["1st_year_female"]
                    ? programData["1st_year_female"].toString()
                    : "",
                "2nd_year_male": programData["2nd_year_male"]
                    ? programData["2nd_year_male"].toString()
                    : "",
                "2nd_year_female": programData["2nd_year_female"]
                    ? programData["2nd_year_female"].toString()
                    : "",
                "3rd_year_male": programData["3rd_year_male"]
                    ? programData["3rd_year_male"].toString()
                    : "",
                "3rd_year_female": programData["3rd_year_female"]
                    ? programData["3rd_year_female"].toString()
                    : "",
                "4th_year_male": programData["4th_year_male"]
                    ? programData["4th_year_male"].toString()
                    : "",
                "4th_year_female": programData["4th_year_female"]
                    ? programData["4th_year_female"].toString()
                    : "",
                "5th_year_male": programData["5th_year_male"]
                    ? programData["5th_year_male"].toString()
                    : "",
                "5th_year_female": programData["5th_year_female"]
                    ? programData["5th_year_female"].toString()
                    : "",
                "6th_year_male": programData["6th_year_male"]
                    ? programData["6th_year_male"].toString()
                    : "",
                "6th_year_female": programData["6th_year_female"]
                    ? programData["6th_year_female"].toString()
                    : "",
                "7th_year_male": programData["7th_year_male"]
                    ? programData["7th_year_male"].toString()
                    : "",
                "7th_year_female": programData["7th_year_female"]
                    ? programData["7th_year_female"].toString()
                    : "",
                subtotal_male: programData.subtotal_male
                    ? programData.subtotal_male.toString()
                    : "",
                subtotal_female: programData.subtotal_female
                    ? programData.subtotal_female.toString()
                    : "",
                grand_total: programData.grand_total
                    ? programData.grand_total.toString()
                    : "",
                lecture_units_actual: programData.lecture_units_actual
                    ? programData.lecture_units_actual.toString()
                    : "",
                laboratory_units_actual: programData.laboratory_units_actual
                    ? programData.laboratory_units_actual.toString()
                    : "",
                total_units_actual: programData.total_units_actual
                    ? programData.total_units_actual.toString()
                    : "",
                graduates_males: programData.graduates_males
                    ? programData.graduates_males.toString()
                    : "",
                graduates_females: programData.graduates_females
                    ? programData.graduates_females.toString()
                    : "",
                graduates_total: programData.graduates_total
                    ? programData.graduates_total.toString()
                    : "",
                externally_funded_merit_scholars:
                    programData.externally_funded_merit_scholars
                        ? programData.externally_funded_merit_scholars.toString()
                        : "",
                internally_funded_grantees:
                    programData.internally_funded_grantees
                        ? programData.internally_funded_grantees.toString()
                        : "",
                funded_grantees: programData.funded_grantees
                    ? programData.funded_grantees.toString()
                    : "",
                // Use the helper function for report_year
                report_year: getReportYear(programData.report_year),
            });
        }

        console.log("Program data loaded:", programData);
    }, [programData]);

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

        // Auto-calculate totals when enrollment numbers change
        if (field.includes("_male") || field.includes("_female")) {
            calculateTotals({ ...formData, [field]: value });
        }

        // Auto-calculate total units when lecture or lab units change
        if (field === "lecture_units" || field === "lab_units") {
            const lectureUnits =
                field === "lecture_units"
                    ? parseFloat(value) || 0
                    : parseFloat(formData.lecture_units) || 0;
            const labUnits =
                field === "lab_units"
                    ? parseFloat(value) || 0
                    : parseFloat(formData.lab_units) || 0;
            setFormData((prev) => ({
                ...prev,
                [field]: value,
                total_units: lectureUnits + labUnits,
            }));
        }

        // Auto-calculate graduate totals
        if (field === "graduates_males" || field === "graduates_females") {
            const males =
                field === "graduates_males"
                    ? parseInt(value) || 0
                    : parseInt(formData.graduates_males) || 0;
            const females =
                field === "graduates_females"
                    ? parseInt(value) || 0
                    : parseInt(formData.graduates_females) || 0;
            setFormData((prev) => ({
                ...prev,
                [field]: value,
                graduates_total: males + females,
            }));
        }
    };

    const calculateTotals = (data) => {
        const maleFields = [
            "1st_year_male",
            "2nd_year_male",
            "3rd_year_male",
            "4th_year_male",
            "5th_year_male",
            "6th_year_male",
            "7th_year_male",
        ];
        const femaleFields = [
            "1st_year_female",
            "2nd_year_female",
            "3rd_year_female",
            "4th_year_female",
            "5th_year_female",
            "6th_year_female",
            "7th_year_female",
        ];

        const totalMale = maleFields.reduce(
            (sum, field) => sum + (parseInt(data[field]) || 0),
            0
        );
        const totalFemale = femaleFields.reduce(
            (sum, field) => sum + (parseInt(data[field]) || 0),
            0
        );
        const grandTotal = totalMale + totalFemale;

        setFormData((prev) => ({
            ...prev,
            subtotal_male: totalMale,
            subtotal_female: totalFemale,
            grand_total: grandTotal,
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        // Required fields
        if (!formData.program_name.trim()) {
            newErrors.program_name = "Program name is required";
        }
        if (!formData.suc_details_id) {
            newErrors.suc_details_id = "Institution ID is required";
        }
        if (!formData.report_year) {
            newErrors.report_year = "Report year is required";
        }

        // Numeric validations
        if (
            formData.program_normal_length_in_years &&
            (isNaN(formData.program_normal_length_in_years) ||
                formData.program_normal_length_in_years < 1 ||
                formData.program_normal_length_in_years > 10)
        ) {
            newErrors.program_normal_length_in_years =
                "Program length must be between 1 and 10 years";
        }

        // Unit validations
        if (
            formData.lab_units &&
            (isNaN(formData.lab_units) || formData.lab_units < 0)
        ) {
            newErrors.lab_units = "Lab units must be a positive number";
        }
        if (
            formData.lecture_units &&
            (isNaN(formData.lecture_units) || formData.lecture_units < 0)
        ) {
            newErrors.lecture_units = "Lecture units must be a positive number";
        }

        // Financial validations
        if (
            formData.tuition_per_unit &&
            (isNaN(formData.tuition_per_unit) || formData.tuition_per_unit < 0)
        ) {
            newErrors.tuition_per_unit =
                "Tuition per unit must be a positive number";
        }
        if (
            formData.program_fee &&
            (isNaN(formData.program_fee) || formData.program_fee < 0)
        ) {
            newErrors.program_fee = "Program fee must be a positive number";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            // Helper function to safely convert to integer
            const toInt = (value) => {
                // Handle null, undefined, or empty string
                if (value === null || value === undefined || value === "") {
                    return null;
                }

                // Convert to string first, then parse
                const stringValue = String(value).trim();
                if (stringValue === "") {
                    return null;
                }

                const parsed = parseInt(stringValue, 10);
                return isNaN(parsed) ? null : parsed;
            };

            // Helper function to safely convert to float
            const toFloat = (value) => {
                // Handle null, undefined, or empty string
                if (value === null || value === undefined || value === "") {
                    return null;
                }

                // Convert to string first, then parse
                const stringValue = String(value).trim();
                if (stringValue === "") {
                    return null;
                }

                const parsed = parseFloat(stringValue);
                return isNaN(parsed) ? null : parsed;
            };

            const updatedProgramData = {
                ...formData,
                id: programData.id,
                suc_details_id: toInt(formData.suc_details_id),
                // Convert numeric fields with proper validation
                program_code: toInt(formData.program_code),
                major_code: toInt(formData.major_code),
                aop_year: toInt(formData.aop_year),
                program_normal_length_in_years: toInt(
                    formData.program_normal_length_in_years
                ),
                lab_units: toInt(formData.lab_units),
                lecture_units: toInt(formData.lecture_units),
                total_units: toInt(formData.total_units),
                tuition_per_unit: toFloat(formData.tuition_per_unit),
                program_fee: toFloat(formData.program_fee),
                // Convert enrollment fields
                new_students_freshmen_male: toInt(
                    formData.new_students_freshmen_male
                ),
                new_students_freshmen_female: toInt(
                    formData.new_students_freshmen_female
                ),
                "1st_year_male": toInt(formData["1st_year_male"]),
                "1st_year_female": toInt(formData["1st_year_female"]),
                "2nd_year_male": toInt(formData["2nd_year_male"]),
                "2nd_year_female": toInt(formData["2nd_year_female"]),
                "3rd_year_male": toInt(formData["3rd_year_male"]),
                "3rd_year_female": toInt(formData["3rd_year_female"]),
                "4th_year_male": toInt(formData["4th_year_male"]),
                "4th_year_female": toInt(formData["4th_year_female"]),
                "5th_year_male": toInt(formData["5th_year_male"]),
                "5th_year_female": toInt(formData["5th_year_female"]),
                "6th_year_male": toInt(formData["6th_year_male"]),
                "6th_year_female": toInt(formData["6th_year_female"]),
                "7th_year_male": toInt(formData["7th_year_male"]),
                "7th_year_female": toInt(formData["7th_year_female"]),
                subtotal_male: toInt(formData.subtotal_male),
                subtotal_female: toInt(formData.subtotal_female),
                grand_total: toInt(formData.grand_total),
                lecture_units_actual: toInt(formData.lecture_units_actual),
                laboratory_units_actual: toInt(
                    formData.laboratory_units_actual
                ),
                total_units_actual: toInt(formData.total_units_actual),
                graduates_males: toInt(formData.graduates_males),
                graduates_females: toInt(formData.graduates_females),
                graduates_total: toInt(formData.graduates_total),
                externally_funded_merit_scholars: toInt(
                    formData.externally_funded_merit_scholars
                ),
                internally_funded_grantees: toInt(
                    formData.internally_funded_grantees
                ),
                funded_grantees: toInt(formData.funded_grantees),
                report_year: toInt(formData.report_year),
            };

            AlertComponent.showConfirmation(
                "Are you sure you want to update this program?",
                () => {
                    onSave(updatedProgramData);
                }
            );
        } else {
            AlertComponent.showAlert(
                "Please fix the validation errors before submitting.",
                "error"
            );
        }
    };

    const handleClose = () => {
        if (Object.keys(errors).length > 0) {
            AlertComponent.showConfirmation(
                "You have unsaved changes. Are you sure you want to close?",
                () => {
                    setErrors({});
                    onClose();
                }
            );
        } else {
            setErrors({});
            onClose();
        }
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={handleClose}
            title={`Edit ${programData?.program_name || "Program"}`}
            subtitle="Update program information and details"
            icon={Edit}
            variant="default"
            size="xl"
        >
            <div className="space-y-4 max-h-[600px] overflow-y-auto p-4">
                {/* Basic Program Information */}
                <div className="bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-100 rounded-xl p-4 border border-blue-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-blue-500 rounded-lg shadow-sm">
                            <GraduationCap className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">
                            Program Information
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Program Name{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.program_name}
                                onChange={(e) =>
                                    handleInputChange(
                                        "program_name",
                                        e.target.value
                                    )
                                }
                                placeholder="e.g., Bachelor of Science in Computer Science"
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                                    errors.program_name
                                        ? "border-red-300 bg-red-50"
                                        : "border-gray-300"
                                }`}
                            />
                            {errors.program_name && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.program_name}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Program Code
                            </label>
                            <input
                                type="number"
                                value={formData.program_code}
                                onChange={(e) =>
                                    handleInputChange(
                                        "program_code",
                                        e.target.value
                                    )
                                }
                                placeholder="e.g., 101"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Program Type
                            </label>
                            <select
                                value={formData.program_type}
                                onChange={(e) =>
                                    handleInputChange(
                                        "program_type",
                                        e.target.value
                                    )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                            >
                                <option value="Baccalaureate">Baccalaureate</option>
                                <option value="Masters">Masters</option>
                                <option value="Doctoral">Doctoral</option>
                                <option value="Post-Baccalaureate">Post-Baccalaureate</option>
                                <option value="Pre-Baccalaureate">Pre-Baccalaureate</option>
                                <option value="VocTech">VocTech</option>
                                <option value="Basic">Basic</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Major/Specialization
                            </label>
                            <input
                                type="text"
                                value={formData.major_name}
                                onChange={(e) =>
                                    handleInputChange(
                                        "major_name",
                                        e.target.value
                                    )
                                }
                                placeholder="e.g., Software Engineering"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Major Code
                            </label>
                            <input
                                type="number"
                                value={formData.major_code}
                                onChange={(e) =>
                                    handleInputChange(
                                        "major_code",
                                        e.target.value
                                    )
                                }
                                placeholder="e.g., 201"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                            />
                        </div>
                    </div>
                </div>

                {/* Academic Details & Program Structure Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Academic Details */}
                    <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 rounded-xl p-4 border border-emerald-200/60 shadow-sm">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-emerald-500 rounded-lg shadow-sm">
                                <BookOpen className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">
                                Academic Details
                            </h3>
                        </div>
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        AOP Category
                                    </label>
                                    <select
                                        value={formData.aop_category}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "aop_category",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                                    >
                                        <option value="">
                                            Select Category
                                        </option>
                                        <option value="Bachelor">
                                            Bachelor
                                        </option>
                                        <option value="Master">Master</option>
                                        <option value="Doctoral">
                                            Doctoral
                                        </option>
                                        <option value="Certificate">
                                            Certificate
                                        </option>
                                        <option value="Diploma">Diploma</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        AOP Serial
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.aop_serial}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "aop_serial",
                                                e.target.value
                                            )
                                        }
                                        placeholder="e.g., AOP-001"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        AOP Year
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.aop_year}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "aop_year",
                                                e.target.value
                                            )
                                        }
                                        placeholder="e.g., 2024"
                                        min="2000"
                                        max={new Date().getFullYear()}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <Calendar className="w-4 h-4 inline mr-1" />
                                        Program Length (Years)
                                    </label>
                                    <input
                                        type="number"
                                        value={
                                            formData.program_normal_length_in_years
                                        }
                                        onChange={(e) =>
                                            handleInputChange(
                                                "program_normal_length_in_years",
                                                e.target.value
                                            )
                                        }
                                        placeholder="e.g., 4"
                                        min="1"
                                        max="10"
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 ${
                                            errors.program_normal_length_in_years
                                                ? "border-red-300 bg-red-50"
                                                : "border-gray-300"
                                        }`}
                                    />
                                    {errors.program_normal_length_in_years && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {
                                                errors.program_normal_length_in_years
                                            }
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Program Status
                                    </label>
                                    <select
                                        value={formData.program_status}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "program_status",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                                    >
                                        <option value="ACTIVE">Active</option>
                                        <option value="INACTIVE">
                                            Inactive
                                        </option>
                                        <option value="SUSPENDED">
                                            Suspended
                                        </option>
                                        <option value="PHASED_OUT">
                                            Phased Out
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <Clock className="w-4 h-4 inline mr-1" />
                                        Calendar System
                                    </label>
                                    <select
                                        value={formData.calendar_use_code}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "calendar_use_code",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                                    >
                                        <option value="SEM">Semester</option>
                                        <option value="TRI">Trimester</option>
                                        <option value="QTR">Quarter</option>
                                        <option value="ANN">Annual</option>
                                        <option value="MOD">Modular</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="thesis_required_edit"
                                    checked={
                                        formData.is_thesis_dissertation_required
                                    }
                                    onChange={(e) =>
                                        handleInputChange(
                                            "is_thesis_dissertation_required",
                                            e.target.checked
                                        )
                                    }
                                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                                />
                                <label
                                    htmlFor="thesis_required_edit"
                                    className="ml-2 text-sm text-gray-700"
                                >
                                    Thesis/Dissertation Required
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Units & Financial Information */}
                    <div className="bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-100 rounded-xl p-4 border border-purple-200/60 shadow-sm">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-purple-500 rounded-lg shadow-sm">
                                <Calculator className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">
                                Units & Finances
                            </h3>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Units Distribution
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    <div>
                                        <input
                                            type="number"
                                            value={formData.lecture_units}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "lecture_units",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Lecture"
                                            min="0"
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 ${
                                                errors.lecture_units
                                                    ? "border-red-300 bg-red-50"
                                                    : "border-gray-300"
                                            }`}
                                        />
                                        <label className="text-xs text-gray-600">
                                            Lecture Units
                                        </label>
                                        {errors.lecture_units && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.lecture_units}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <input
                                            type="number"
                                            value={formData.lab_units}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "lab_units",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Lab"
                                            min="0"
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 ${
                                                errors.lab_units
                                                    ? "border-red-300 bg-red-50"
                                                    : "border-gray-300"
                                            }`}
                                        />
                                        <label className="text-xs text-gray-600">
                                            Lab Units
                                        </label>
                                        {errors.lab_units && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.lab_units}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <input
                                            type="number"
                                            value={formData.total_units}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "total_units",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Total"
                                            min="0"
                                            className="w-full px-3 py-2 border border-purple-300 rounded-lg bg-purple-50 transition-colors duration-200"
                                            readOnly
                                        />
                                        <label className="text-xs text-purple-600">
                                            Total Units
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <DollarSign className="w-4 h-4 inline mr-1" />
                                    Tuition per Unit (₱)
                                </label>
                                <input
                                    type="number"
                                    value={formData.tuition_per_unit}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "tuition_per_unit",
                                            e.target.value
                                        )
                                    }
                                    placeholder="e.g., 500.00"
                                    min="0"
                                    step="0.01"
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 ${
                                        errors.tuition_per_unit
                                            ? "border-red-300 bg-red-50"
                                            : "border-gray-300"
                                    }`}
                                />
                                {errors.tuition_per_unit && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.tuition_per_unit}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Program Fee (₱)
                                </label>
                                <input
                                    type="number"
                                    value={formData.program_fee}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "program_fee",
                                            e.target.value
                                        )
                                    }
                                    placeholder="e.g., 5000.00"
                                    min="0"
                                    step="0.01"
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 ${
                                        errors.program_fee
                                            ? "border-red-300 bg-red-50"
                                            : "border-gray-300"
                                    }`}
                                />
                                {errors.program_fee && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.program_fee}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Report Year
                                </label>
                                <select
                                    value={formData.report_year}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "report_year",
                                            e.target.value
                                        )
                                    }
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 ${
                                        errors.report_year
                                            ? "border-red-300 bg-red-50"
                                            : "border-gray-300"
                                    }`}
                                >
                                    {Array.from({ length: 10 }, (_, i) => {
                                        const year =
                                            new Date().getFullYear() - i;
                                        return (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        );
                                    })}
                                </select>
                                {errors.report_year && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.report_year}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enrollment Data */}
                <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 rounded-xl p-4 border border-amber-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-amber-500 rounded-lg shadow-sm">
                            <Users className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">
                            Enrollment Data
                        </h3>
                    </div>
                    <div className="space-y-4">
                        {/* New Students */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                New Freshmen Students
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <input
                                        type="number"
                                        value={
                                            formData.new_students_freshmen_male
                                        }
                                        onChange={(e) =>
                                            handleInputChange(
                                                "new_students_freshmen_male",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Male freshmen"
                                        min="0"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                                    />
                                    <label className="text-xs text-gray-600">
                                        Male
                                    </label>
                                </div>
                                <div>
                                    <input
                                        type="number"
                                        value={
                                            formData.new_students_freshmen_female
                                        }
                                        onChange={(e) =>
                                            handleInputChange(
                                                "new_students_freshmen_female",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Female freshmen"
                                        min="0"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                                    />
                                    <label className="text-xs text-gray-600">
                                        Female
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Year Level Enrollment */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Current Enrollment by Year Level
                            </label>
                            <div className="space-y-2">
                                {[1, 2, 3, 4, 5, 6, 7].map((year) => (
                                    <div
                                        key={year}
                                        className="grid grid-cols-3 gap-2 items-center"
                                    >
                                        <label className="text-sm text-gray-700 font-medium">
                                            {year === 1
                                                ? "1st"
                                                : year === 2
                                                ? "2nd"
                                                : year === 3
                                                ? "3rd"
                                                : `${year}th`}{" "}
                                            Year
                                        </label>
                                        <input
                                            type="number"
                                            value={
                                                formData[
                                                    `${
                                                        year === 1
                                                            ? "1st"
                                                            : year === 2
                                                            ? "2nd"
                                                            : year === 3
                                                            ? "3rd"
                                                            : `${year}th`
                                                    }_year_male`
                                                ]
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    `${
                                                        year === 1
                                                            ? "1st"
                                                            : year === 2
                                                            ? "2nd"
                                                            : year === 3
                                                            ? "3rd"
                                                            : `${year}th`
                                                    }_year_male`,
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Male"
                                            min="0"
                                            className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200 text-sm"
                                        />
                                        <input
                                            type="number"
                                            value={
                                                formData[
                                                    `${
                                                        year === 1
                                                            ? "1st"
                                                            : year === 2
                                                            ? "2nd"
                                                            : year === 3
                                                            ? "3rd"
                                                            : `${year}th`
                                                    }_year_female`
                                                ]
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    `${
                                                        year === 1
                                                            ? "1st"
                                                            : year === 2
                                                            ? "2nd"
                                                            : year === 3
                                                            ? "3rd"
                                                            : `${year}th`
                                                    }_year_female`,
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Female"
                                            min="0"
                                            className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200 text-sm"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Totals Display */}
                        <div className="bg-white/60 rounded-lg p-3 border border-amber-300">
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <div className="text-lg font-semibold text-blue-600">
                                        {formData.subtotal_male || 0}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        Total Male
                                    </div>
                                </div>
                                <div>
                                    <div className="text-lg font-semibold text-pink-600">
                                        {formData.subtotal_female || 0}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        Total Female
                                    </div>
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-amber-900">
                                        {formData.grand_total || 0}
                                    </div>
                                    <div className="text-xs text-amber-600">
                                        Grand Total
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Graduates & Scholarships Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Graduates */}
                    <div className="bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 rounded-xl p-4 border border-slate-200/60 shadow-sm">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-slate-600 rounded-lg shadow-sm">
                                <Award className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">
                                Graduates
                            </h3>
                        </div>
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Male Graduates
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.graduates_males}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "graduates_males",
                                                e.target.value
                                            )
                                        }
                                        placeholder="0"
                                        min="0"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors duration-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Female Graduates
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.graduates_females}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "graduates_females",
                                                e.target.value
                                            )
                                        }
                                        placeholder="0"
                                        min="0"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors duration-200"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Total Graduates
                                </label>
                                <input
                                    type="number"
                                    value={formData.graduates_total}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 transition-colors duration-200"
                                    readOnly
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Actual Units Taken
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    <div>
                                        <input
                                            type="number"
                                            value={
                                                formData.lecture_units_actual
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "lecture_units_actual",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Lecture"
                                            min="0"
                                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors duration-200 text-sm"
                                        />
                                        <label className="text-xs text-gray-600">
                                            Lecture
                                        </label>
                                    </div>
                                    <div>
                                        <input
                                            type="number"
                                            value={
                                                formData.laboratory_units_actual
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "laboratory_units_actual",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Lab"
                                            min="0"
                                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors duration-200 text-sm"
                                        />
                                        <label className="text-xs text-gray-600">
                                            Lab
                                        </label>
                                    </div>
                                    <div>
                                        <input
                                            type="number"
                                            value={formData.total_units_actual}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "total_units_actual",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Total"
                                            min="0"
                                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors duration-200 text-sm"
                                        />
                                        <label className="text-xs text-gray-600">
                                            Total
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Scholarships */}
                    <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-100 rounded-xl p-4 border border-indigo-200/60 shadow-sm">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-indigo-500 rounded-lg shadow-sm">
                                <FileText className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">
                                Scholarships & Aid
                            </h3>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    External Merit Scholars
                                </label>
                                <input
                                    type="number"
                                    value={
                                        formData.externally_funded_merit_scholars
                                    }
                                    onChange={(e) =>
                                        handleInputChange(
                                            "externally_funded_merit_scholars",
                                            e.target.value
                                        )
                                    }
                                    placeholder="0"
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Internal Grantees
                                </label>
                                <input
                                    type="number"
                                    value={formData.internally_funded_grantees}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "internally_funded_grantees",
                                            e.target.value
                                        )
                                    }
                                    placeholder="0"
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Total Funded Students
                                </label>
                                <input
                                    type="number"
                                    value={formData.funded_grantees}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "funded_grantees",
                                            e.target.value
                                        )
                                    }
                                    placeholder="0"
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                />
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
                                Update Program
                            </>
                        )}
                    </button>
                </div>
            </div>
        </Dialog>
    );
}

EditProgramForm.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    programData: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        suc_details_id: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
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
        program_normal_length_in_years: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        lab_units: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        lecture_units: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        total_units: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        tuition_per_unit: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        program_fee: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        program_type: PropTypes.string,
        new_students_freshmen_male: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        new_students_freshmen_female: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        "1st_year_male": PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        "1st_year_female": PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        "2nd_year_male": PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        "2nd_year_female": PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        "3rd_year_male": PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        "3rd_year_female": PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        "4th_year_male": PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        "4th_year_female": PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        "5th_year_male": PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        "5th_year_female": PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        "6th_year_male": PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        "6th_year_female": PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        "7th_year_male": PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        "7th_year_female": PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        subtotal_male: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        subtotal_female: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        grand_total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        lecture_units_actual: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        laboratory_units_actual: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        total_units_actual: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        graduates_males: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        graduates_females: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        graduates_total: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        externally_funded_merit_scholars: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        internally_funded_grantees: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        funded_grantees: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        report_year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
    loading: PropTypes.bool,
};

export default EditProgramForm;
