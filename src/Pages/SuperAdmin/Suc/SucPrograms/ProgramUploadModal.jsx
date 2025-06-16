import { useState } from "react";
import {
    Upload,
    FileSpreadsheet,
    AlertCircle,
    GraduationCap,
    Calendar,
    Info,
    FileText,
    Database,
    BookOpen,
} from "lucide-react";
import * as XLSX from "xlsx";
import axios from "axios";
import config from "../../../../utils/config";
import PropTypes from "prop-types";
import Dialog from "../../../../Components/Dialog";
import AlertComponent from "../../../../Components/AlertComponent";
import { useLoading } from "../../../../Context/LoadingContext";

function ProgramUploadModal({
    isOpen,
    onClose,
    onUploadSuccess,
    institutionId,
}) {
    const { showLoading, hideLoading, updateProgress } = useLoading();
    const [isUploading, setIsUploading] = useState(false);
    const [errors, setErrors] = useState({});
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const handleInputChange = (field, value) => {
        // Clear error when user makes a selection
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: "",
            }));
        }

        if (field === "year") {
            setSelectedYear(value);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!institutionId) {
            newErrors.institution = "Institution ID is required";
        }

        if (!selectedYear) {
            newErrors.year = "Please select a report year";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Parsing helper functions
    const toNullableInteger = (value) => {
        if (
            !value ||
            value === "N/A" ||
            value === "" ||
            value === null ||
            value === undefined
        )
            return null;
        const parsed = Number.parseInt(value, 10);
        return isNaN(parsed) ? null : parsed;
    };

    const parseNumeric = (value, min, max) => {
        if (
            value === undefined ||
            value === "" ||
            value === null ||
            isNaN(value)
        )
            return null;
        const num = Number.parseFloat(value);
        if (min !== undefined && num < min) return null;
        if (max !== undefined && num > max) return null;
        return num;
    };

    const parseString = (value) => {
        if (value === undefined || value === "" || value === null) return null;
        const str = String(value).trim();
        return str.length > 255 ? str.substring(0, 255) : str;
    };

    const parseBoolean = (value) => {
        if (value === undefined || value === "" || value === null) return false;
        const str = String(value).toLowerCase().trim();
        return str === "true" || str === "1" || str === "yes" || str === "y";
    };

    // Program status mapping
    const statusMapping = {
        1: "ACTIVE",
        2: "INACTIVE",
        3: "SUSPENDED",
        4: "PHASED_OUT",
        ACTIVE: "ACTIVE",
        INACTIVE: "INACTIVE",
        SUSPENDED: "SUSPENDED",
        PHASED_OUT: "PHASED_OUT",
    };

    // Calendar system mapping
    const calendarMapping = {
        1: "SEM",
        2: "TRI",
        3: "QTR",
        4: "ANN",
        5: "MOD",
        SEM: "SEM",
        TRI: "TRI",
        QTR: "QTR",
        ANN: "ANN",
        MOD: "MOD",
    };

    // Program type mapping based on sheet names
    const programTypeMapping = {
        Doctoral: "Doctoral",
        Masters: "Masters",
        "Post-Baccalaureate": "Post-Baccalaureate",
        Baccalaureate: "Baccalaureate",
        "Pre-Baccalaureate": "Pre-Baccalaureate",
        VocTech: "VocTech",
        Basic: "Basic",
    };

    const handleExcelUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate form before processing
        if (!validateForm()) {
            AlertComponent.showAlert(
                "Please ensure institution and year are properly set before uploading.",
                "error"
            );
            return;
        }

        // Validate file type
        const validTypes = [
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-excel",
            "text/csv",
        ];
        if (
            !validTypes.includes(file.type) &&
            !file.name.match(/\.(xlsx|xls|csv)$/i)
        ) {
            AlertComponent.showAlert(
                "Please upload a valid Excel file (.xlsx, .xls) or CSV file.",
                "error"
            );
            return;
        }

        setIsUploading(true);
        showLoading();
        updateProgress(10); // Start progress

        try {
            const buffer = await file.arrayBuffer();
            updateProgress(30); // File read progress

            const workbook = XLSX.read(buffer, {
                cellStyles: true,
                cellFormulas: true,
                cellDates: true,
                cellNF: true,
                sheetStubs: true,
                type: "array",
            });
            updateProgress(50); // File parsing progress

            // Use actual sheet names from the Excel file
            const programSheets = workbook.SheetNames.filter((name) =>
                [
                    "Doctoral",
                    "Masters",
                    "Post-Baccalaureate",
                    "Baccalaureate",
                    "Pre-Baccalaureate",
                    "VocTech",
                    "Basic",
                ].includes(name)
            ).map((name) => ({
                name,
                type: "PROGRAM",
                description: `${name} Programs Data`,
            }));

            if (programSheets.length === 0) {
                // If no specific sheets found, use the first sheet
                if (workbook.SheetNames.length > 0) {
                    programSheets.push({
                        name: workbook.SheetNames[0],
                        type: "PROGRAM",
                        description: "Academic Programs Data (Default Sheet)",
                    });
                } else {
                    throw new Error("No valid sheets found in the Excel file.");
                }
            }

            updateProgress(70); // Sheet processing progress
            await processAllProgramSheets(workbook, programSheets);
            updateProgress(100); // Complete
        } catch (error) {
            console.error("Excel upload error:", error);
            AlertComponent.showAlert(
                error.message || "Failed to process Excel file. Please try again.",
                "error"
            );
        } finally {
            setIsUploading(false);
            hideLoading();
            event.target.value = "";
        }
    };

    const processAllProgramSheets = async (workbook, programSheets) => {
        const createdRecords = [];
        const errors = [];
        const totalSheets = programSheets.length;
        let processedSheets = 0;

        for (const sheet of programSheets) {
            try {
                const worksheet = workbook.Sheets[sheet.name];
                const programRecords = await processProgramSheet(
                    worksheet,
                    sheet.name
                );
                createdRecords.push(...programRecords);

                // Update progress based on sheets processed
                processedSheets++;
                const progress = 70 + (processedSheets / totalSheets) * 20; // 70-90% range for sheet processing
                updateProgress(Math.floor(progress));
            } catch (error) {
                console.error(`Error processing sheet ${sheet.name}:`, error);
                errors.push(
                    `Error in ${sheet.name}: ${
                        error.response?.data?.error || error.message
                    }`
                );
            }
        }

        if (createdRecords.length > 0) {
            onUploadSuccess();
            setErrors({});
        }
    };

    const processProgramSheet = async (worksheet, sheetName) => {
        try {
            const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                header: 1,
                defval: "",
                raw: false,
            });

            console.log(`Parsed JSON data from ${sheetName} sheet:`, jsonData);

            // Find the row with "START BELOW THIS ROW"
            let startRowIndex = -1;
            for (let i = 0; i < jsonData.length; i++) {
                const row = jsonData[i];
                if (Array.isArray(row)) {
                    const rowText = row.join(" ").toLowerCase();
                    if (rowText.includes("start below this row")) {
                        startRowIndex = i;
                        break;
                    }
                }
            }

            // Log the startRowIndex for debugging
            console.log(`Start row index fetched: ${startRowIndex}`);

            if (startRowIndex === -1) {
                throw new Error(
                    `Could not find "START BELOW THIS ROW" in the ${sheetName} sheet.`
                );
            }

            const dataStartRow = startRowIndex + 1; // Start extracting data from the row after "START BELOW THIS ROW"

            if (dataStartRow >= jsonData.length) {
                throw new Error(
                    `No data rows found in the ${sheetName} sheet after "START BELOW THIS ROW".`
                );
            }

            const processedPrograms = jsonData
                .slice(dataStartRow)
                .filter((row) => {
                    // Check for valid program name early
                    const programName = parseString(row[0] || row[1]);
                    if (!programName || !programName.trim()) {
                        console.log(
                            `Skipping row in ${sheetName} sheet: missing or empty program name`
                        );
                        return false;
                    }
                    return (
                        row &&
                        row.length > 0 &&
                        row.some((cell) => cell !== undefined && cell !== "")
                    );
                })
                .map((row, rowIndex) => {
                    try {
                        // Map columns to program fields
                        const program = {
                            suc_details_id: parseInt(institutionId),
                            program_name: parseString(row[1] || null),
                            program_code: toNullableInteger(row[2] || null),
                            program_type:
                                programTypeMapping[sheetName] ||
                                parseString(sheetName) ||
                                "Unknown",
                            major_name: parseString(row[3]),
                            major_code: toNullableInteger(row[4]),
                            aop_category: parseString(row[5]),
                            aop_serial: parseString(row[6]),
                            aop_year: toNullableInteger(row[7]),
                            is_thesis_dissertation_required: parseBoolean(
                                row[8]
                            ),
                            program_status:
                                statusMapping[row[9]] ||
                                parseString(row[9]) ||
                                "ACTIVE",
                            calendar_use_code:
                                calendarMapping[row[10]] ||
                                parseString(row[10]) ||
                                "SEM",
                            program_normal_length_in_years: toNullableInteger(
                                row[11]
                            ),
                            lab_units: toNullableInteger(row[12]),
                            lecture_units: toNullableInteger(row[13]),
                            total_units: toNullableInteger(row[14]),
                            tuition_per_unit: parseNumeric(row[15], 0),
                            program_fee: parseNumeric(row[16], 0),

                            // Enrollment data
                            new_students_freshmen_male: toNullableInteger(
                                row[17]
                            ),
                            new_students_freshmen_female: toNullableInteger(
                                row[18]
                            ),
                            "1st_year_male": toNullableInteger(row[19]),
                            "1st_year_female": toNullableInteger(row[20]),
                            "2nd_year_male": toNullableInteger(row[21]),
                            "2nd_year_female": toNullableInteger(row[22]),
                            "3rd_year_male": toNullableInteger(row[23]),
                            "3rd_year_female": toNullableInteger(row[24]),
                            "4th_year_male": toNullableInteger(row[25]),
                            "4th_year_female": toNullableInteger(row[26]),
                            "5th_year_male": toNullableInteger(row[27]),
                            "5th_year_female": toNullableInteger(row[28]),
                            "6th_year_male": toNullableInteger(row[29]),
                            "6th_year_female": toNullableInteger(row[30]),
                            "7th_year_male": toNullableInteger(row[31]),
                            "7th_year_female": toNullableInteger(row[32]),

                            // Calculated totals
                            subtotal_male: toNullableInteger(row[33]),
                            subtotal_female: toNullableInteger(row[34]),
                            grand_total: toNullableInteger(row[35]),

                            // Actual units
                            lecture_units_actual: toNullableInteger(row[36]),
                            laboratory_units_actual: toNullableInteger(row[37]),
                            total_units_actual: toNullableInteger(row[38]),

                            // Graduates
                            graduates_males: toNullableInteger(row[39]),
                            graduates_females: toNullableInteger(row[40]),
                            graduates_total: toNullableInteger(row[41]),

                            // Scholarships
                            externally_funded_merit_scholars: toNullableInteger(
                                row[42]
                            ),
                            internally_funded_grantees: toNullableInteger(
                                row[43]
                            ),
                            funded_grantees: toNullableInteger(row[44]),

                            report_year: parseInt(selectedYear),
                        };

                        return program;
                    } catch (error) {
                        console.warn(
                            `Error processing row ${
                                rowIndex + 1
                            } in ${sheetName}:`,
                            error
                        );
                        return null;
                    }
                })
                .filter((program) => program !== null);

            if (processedPrograms.length === 0) {
                throw new Error(
                    `No valid program data found in the ${sheetName} sheet.`
                );
            }

            console.log(
                `Processed programs from ${sheetName}:`,
                processedPrograms
            );

            // Send to API
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${config.API_URL}/suc-form-b/bulk`,
                {
                    programs: processedPrograms,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log(
                `Programs upload response from ${sheetName}:`,
                response.data
            );
            onClose();
            return processedPrograms.map((program) => ({ program }));
        } catch (error) {
            console.error(
                `Program sheet processing error in ${sheetName}:`,
                error
            );
            throw new Error(
                error.response?.data?.error ||
                    `Failed to process programs in ${sheetName}: ${error.message}`
            );
        }
    };

    const handleClose = () => {
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <Dialog
            isOpen={isOpen}
            onClose={handleClose}
            title="Upload Academic Programs"
            subtitle="Import HEMIS Form B or academic program Excel files"
            icon={Upload}
            variant="default"
            size="xl"
        >
            <div className="space-y-4 p-4">
                {/* Institution & Year Selection */}
                <div className="bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-100 rounded-xl p-4 border border-blue-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-blue-500 rounded-lg shadow-sm">
                            <GraduationCap className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">
                            Upload Configuration
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Institution ID{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={institutionId || ""}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                                placeholder="Institution ID will be auto-filled"
                            />
                            {errors.institution && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.institution}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <Calendar className="w-4 h-4 inline mr-1" />
                                Report Year{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={selectedYear}
                                onChange={(e) =>
                                    handleInputChange(
                                        "year",
                                        parseInt(e.target.value)
                                    )
                                }
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                                    errors.year
                                        ? "border-red-300 bg-red-50"
                                        : "border-gray-300"
                                }`}
                            >
                                {Array.from({ length: 10 }, (_, i) => {
                                    const year = new Date().getFullYear() - i;
                                    return (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    );
                                })}
                            </select>
                            {errors.year && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.year}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Upload Instructions */}
                <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 rounded-xl p-4 border border-amber-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-amber-500 rounded-lg shadow-sm">
                            <Info className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">
                            Excel Format Guidelines
                        </h3>
                    </div>
                    <div className="space-y-3 text-sm text-gray-700">
                        <div className="flex items-start space-x-3">
                            <FileText className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-medium mb-1">
                                    HEMIS Form B Structure:
                                </p>
                                <ul className="space-y-1 ml-2">
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                                        Data starts after &#34;START BELOW THIS
                                        ROW&#34;
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                                        Only rows with a valid Program Name are
                                        processed
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                                        Column A: Program Name (Required)
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                                        Column B: Program Code
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                                        Column C: Program Type (Doctoral,
                                        Masters, Post-Baccalaureate,
                                        Baccalaureate, Pre-Baccalaureate,
                                        VocTech, Basic)
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                                        Columns D-R: Academic details (major,
                                        AOP, units, fees)
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                                        Columns S-AR: Enrollment data by year
                                        and gender
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                                        Columns AS-AU: Graduate statistics and
                                        scholarships
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <Database className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                            <p>
                                The system will automatically detect program
                                data and map it to the appropriate database
                                fields.
                            </p>
                        </div>
                        <div className="flex items-start space-x-3">
                            <BookOpen className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                            <p>
                                Supported formats: .xlsx, .xls, and .csv files
                                with program information
                            </p>
                        </div>
                    </div>
                </div>

                {/* File Upload Section */}
                <div className="bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 rounded-xl p-4 border border-slate-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-slate-600 rounded-lg shadow-sm">
                            <FileSpreadsheet className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">
                            File Upload
                        </h3>
                    </div>
                    <div className="relative">
                        <input
                            type="file"
                            id="excel-upload"
                            accept=".xlsx,.xls,.csv"
                            onChange={handleExcelUpload}
                            disabled={isUploading || !institutionId}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        />
                        <div
                            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                                !institutionId || isUploading
                                    ? "border-gray-200 bg-gray-50/50"
                                    : "border-slate-300 hover:border-slate-400 hover:bg-slate-50/50 bg-white"
                            }`}
                        >
                            <div
                                className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                                    !institutionId || isUploading
                                        ? "bg-gray-100"
                                        : "bg-gradient-to-br from-slate-100 to-slate-200"
                                }`}
                            >
                                {isUploading ? (
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
                                ) : (
                                    <Upload
                                        className={`w-8 h-8 ${
                                            !institutionId
                                                ? "text-gray-300"
                                                : "text-slate-600"
                                        }`}
                                    />
                                )}
                            </div>
                            <p
                                className={`text-lg font-semibold mb-2 ${
                                    !institutionId || isUploading
                                        ? "text-gray-400"
                                        : "text-gray-900"
                                }`}
                            >
                                {isUploading
                                    ? "Processing File..."
                                    : "Choose Excel File to Upload"}
                            </p>
                            <p
                                className={`text-sm mb-2 ${
                                    !institutionId || isUploading
                                        ? "text-gray-400"
                                        : "text-gray-600"
                                }`}
                            >
                                Drag and drop or click to browse
                            </p>
                            <div className="flex flex-wrap justify-center gap-2 mb-2">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    .xlsx
                                </span>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    .xls
                                </span>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                    .csv
                                </span>
                            </div>
                            {!institutionId && (
                                <div className="flex items-center justify-center mt-3">
                                    <AlertCircle className="w-4 h-4 text-red-500 mr-1" />
                                    <span className="text-sm text-red-500 font-medium">
                                        Institution ID is required
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                        onClick={handleClose}
                        disabled={isUploading}
                        className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                        {isUploading ? "Processing..." : "Close"}
                    </button>
                </div>
            </div>
        </Dialog>
    );
}

ProgramUploadModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onUploadSuccess: PropTypes.func.isRequired,
    institutionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
};

export default ProgramUploadModal;
