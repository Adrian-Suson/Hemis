import { useState } from "react";
import {
    Upload,
    FileSpreadsheet,
    AlertCircle,
    Users,
    Calendar,
    Info,
    FileText,
    Database,
    BookOpen,
    GraduationCap,
    UserCheck,
} from "lucide-react";
import * as XLSX from "xlsx";
import axios from "axios";
import config from "../../../../utils/config";
import PropTypes from "prop-types";
import Dialog from "../../../../Components/Dialog";
import AlertComponent from "../../../../Components/AlertComponent";
import { useLoading } from "../../../../Context/LoadingContext";

function FacultyUploadModal({
    isOpen,
    onClose,
    onUploadSuccess,
    institutionId,
}) {
    const [isUploading, setIsUploading] = useState(false);
    const [errors, setErrors] = useState({});
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const { showLoading, hideLoading, updateProgress } = useLoading();

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

    // Faculty type mapping
    const facultyTypeMapping = {
        A1: "A1",
        B: "B",
        C1: "C1",
        C2: "C2",
        C3: "C3",
        E: "E",
    };

    // Helper to calculate total workload
    function calculateTotalWorkLoad(faculty) {
        return (
            Number(faculty.undergrad_total_credit_units || 0) +
            Number(faculty.graduate_total_credit_units || 0) +
            Number(faculty.research_load || 0) +
            Number(faculty.extension_services_load || 0) +
            Number(faculty.study_load || 0) +
            Number(faculty.production_load || 0) +
            Number(faculty.administrative_load || 0) +
            Number(faculty.other_load_credits || 0)
        );
    }

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

        try {
            const buffer = await file.arrayBuffer();
            const workbook = XLSX.read(buffer, {
                cellStyles: true,
                cellFormulas: true,
                cellDates: true,
                cellNF: true,
                sheetStubs: true,
                type: "array",
            });

            // Process all sheets in the workbook except Reference
            const facultySheets = workbook.SheetNames.filter(
                (name) => !name.toLowerCase().includes("reference")
            ).map((name) => ({
                name,
                type: "FACULTY",
                description: `Faculty Data from ${name}`,
            }));

            console.log("Found sheets:", facultySheets);

            if (facultySheets.length === 0) {
                throw new Error(
                    "No valid faculty sheets found in the Excel file."
                );
            }

            await processAllFacultySheets(workbook, facultySheets);
            AlertComponent.showAlert(
                "Faculty data uploaded successfully!",
                "success"
            );
            onClose(); // Close modal after successful upload
        } catch (error) {
            console.error("Excel upload error:", error);
            AlertComponent.showAlert(
                error.response?.data?.message ||
                    error.message ||
                    "Failed to upload faculty data",
                "error"
            );
        } finally {
            setIsUploading(false);
            hideLoading();
            event.target.value = "";
        }
    };

    const processAllFacultySheets = async (workbook, facultySheets) => {
        const createdRecords = [];
        const errors = [];
        let processedSheets = 0;

        for (const sheet of facultySheets) {
            try {
                const worksheet = workbook.Sheets[sheet.name];
                const facultyRecords = await processFacultySheet(
                    worksheet,
                    sheet.name
                );
                if (facultyRecords && facultyRecords.length > 0) {
                    createdRecords.push(...facultyRecords);
                } else {
                    console.log(
                        `No valid faculty records found in sheet ${sheet.name}`
                    );
                }
                processedSheets++;
                // Update progress to 80% after all sheets are processed
                updateProgress((processedSheets / facultySheets.length) * 80);
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
            try {
                // Update progress to 90% before API request
                updateProgress(90);

                // Send to API
                const token = localStorage.getItem("token");
                const response = await axios.post(
                    `${config.API_URL}/suc-form-e2/bulk`,
                    {
                        operation: "create",
                        records: createdRecords,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                console.log(`Faculty upload response:`, response.data);

                // Update progress to 100% after successful API request
                updateProgress(100);
                onUploadSuccess();
                setErrors({});
            } catch (error) {
                console.error("API request error:", error);
                throw error;
            }
        }
    };

    const processFacultySheet = async (worksheet, sheetName) => {
        try {
            // Extract faculty type from sheet name
            const facultyType = sheetName.match(/[A-E][1-3]?/)?.[0] || "A1";
            if (!facultyTypeMapping[facultyType]) {
                throw new Error(
                    `Invalid faculty type in sheet name: ${facultyType}`
                );
            }

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

            // If no "START BELOW THIS ROW" found, look for header row
            if (startRowIndex === -1) {
                for (let i = 0; i < Math.min(20, jsonData.length); i++) {
                    const row = jsonData[i];
                    if (Array.isArray(row)) {
                        const rowText = row.join(" ").toLowerCase();
                        if (
                            rowText.includes("name") ||
                            rowText.includes("faculty") ||
                            rowText.includes("rank")
                        ) {
                            startRowIndex = i;
                            break;
                        }
                    }
                }
            }

            // Log the startRowIndex for debugging
            console.log(`Start row index fetched: ${startRowIndex}`);

            if (startRowIndex === -1) {
                console.warn(
                    `Could not find "START BELOW THIS ROW" or header in the ${sheetName} sheet. Using row 0.`
                );
                startRowIndex = 0;
            }

            const dataStartRow = startRowIndex + 1; // Start extracting data from the row after marker/header

            if (dataStartRow >= jsonData.length) {
                throw new Error(
                    `No data rows found in the ${sheetName} sheet.`
                );
            }

            const processedFaculty = jsonData
                .slice(dataStartRow)
                .filter((row) => {
                    // Check for valid faculty name early
                    const facultyName = (row[1] || row[0] || "")
                        .toString()
                        .trim();
                    if (!facultyName) {
                        console.log(
                            `Skipping row in ${sheetName} sheet: missing or empty faculty name`
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
                        // Map columns to faculty fields based on Form E2 structure
                        const faculty = {
                            suc_details_id: institutionId,
                            name: row[1],
                            generic_faculty_rank: row[2],
                            home_college: row[3],
                            home_department: row[4],
                            is_tenured: row[5],
                            ssl_salary_grade: row[6],
                            annual_basic_salary: row[7],
                            on_leave_without_pay: row[8],
                            full_time_equivalent: row[9],
                            gender: row[10],
                            highest_degree_attained: row[11],
                            pursuing_next_degree: row[12],
                            discipline_teaching_load_1: row[13],
                            discipline_teaching_load_2: row[14],
                            discipline_bachelors: row[15],
                            discipline_masters: row[16],
                            discipline_doctorate: row[17],
                            masters_with_thesis: row[18],
                            doctorate_with_dissertation: row[19],
                            undergrad_lab_credit_units: row[20],
                            undergrad_lecture_credit_units: row[21],
                            undergrad_total_credit_units: row[22],
                            undergrad_lab_hours_per_week: row[23],
                            undergrad_lecture_hours_per_week: row[24],
                            undergrad_total_hours_per_week: row[25],
                            undergrad_lab_contact_hours: row[26],
                            undergrad_lecture_contact_hours: row[27],
                            undergrad_total_contact_hours: row[28],
                            graduate_lab_credit_units: row[29],
                            graduate_lecture_credit_units: row[30],
                            graduate_total_credit_units: row[31],
                            graduate_lab_contact_hours: row[32],
                            graduate_lecture_contact_hours: row[33],
                            graduate_total_contact_hours: row[34],
                            research_load: row[35],
                            extension_services_load: row[36],
                            study_load: row[37],
                            production_load: row[38],
                            administrative_load: row[39],
                            other_load_credits: row[40],
                            total_work_load: row[41],
                            report_year: selectedYear,
                            faculty_type: facultyType,
                        };

                        // Auto-calculate totals if not provided
                        if (!faculty.undergrad_total_credit_units) {
                            faculty.undergrad_total_credit_units =
                                (faculty.undergrad_lab_credit_units || 0) +
                                (faculty.undergrad_lecture_credit_units || 0);
                        }

                        if (!faculty.undergrad_total_hours_per_week) {
                            faculty.undergrad_total_hours_per_week =
                                (faculty.undergrad_lab_hours_per_week || 0) +
                                (faculty.undergrad_lecture_hours_per_week || 0);
                        }

                        if (!faculty.undergrad_total_contact_hours) {
                            faculty.undergrad_total_contact_hours =
                                (faculty.undergrad_lab_contact_hours || 0) +
                                (faculty.undergrad_lecture_contact_hours || 0);
                        }

                        if (!faculty.graduate_total_credit_units) {
                            faculty.graduate_total_credit_units =
                                (faculty.graduate_lab_credit_units || 0) +
                                (faculty.graduate_lecture_credit_units || 0);
                        }

                        if (!faculty.graduate_total_contact_hours) {
                            faculty.graduate_total_contact_hours =
                                (faculty.graduate_lab_contact_hours || 0) +
                                (faculty.graduate_lecture_contact_hours || 0);
                        }

                        // Always calculate total_work_load if not provided or falsy
                        if (!faculty.total_work_load) {
                            faculty.total_work_load = calculateTotalWorkLoad(faculty);
                        }

                        return faculty;
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
                .filter((faculty) => faculty !== null);

            if (processedFaculty.length === 0) {
                throw new Error(
                    `No valid faculty data found in the ${sheetName} sheet.`
                );
            }

            console.log(
                `Processed faculty from ${sheetName}:`,
                processedFaculty
            );

            return processedFaculty;
        } catch (error) {
            console.error(
                `Faculty sheet processing error in ${sheetName}:`,
                error
            );

            // Extract validation errors if they exist
            const validationErrors = error.response?.data?.errors;
            if (validationErrors) {
                const errorMessages = Object.entries(validationErrors)
                    .map(
                        ([field, messages]) =>
                            `${field}: ${messages.join(", ")}`
                    )
                    .join("\n");
                throw new Error(`Validation failed:\n${errorMessages}`);
            }

            throw new Error(
                error.response?.data?.message ||
                    `Failed to process faculty in ${sheetName}: ${error.message}`
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
            title="Upload Faculty Data"
            subtitle="Import HEMIS Form E2 or faculty Excel files"
            icon={Upload}
            variant="default"
            size="xl"
        >
            <div className="space-y-4 p-4">
                {/* Institution & Year Selection */}
                <div className="bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-100 rounded-xl p-4 border border-blue-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-blue-500 rounded-lg shadow-sm">
                            <Users className="w-5 h-5 text-white" />
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
                                    HEMIS Form E2 Structure:
                                </p>
                                <ul className="space-y-1 ml-2">
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                                        Data starts after &#34;START BELOW THIS
                                        ROW&#34; or header row
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                                        Only rows with a valid Faculty Name are
                                        processed
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                                        Column A/B: Faculty Name (Required)
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                                        Column C: Faculty Rank
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                                        Columns D-E: College & Department
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                                        Columns F-K: Employment details (tenure,
                                        salary, gender)
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                                        Columns L-S: Academic qualifications
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                                        Columns T-AO: Teaching load
                                        (undergraduate & graduate)
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                                        Columns AP-AV: Additional workload
                                        (research, extension, admin)
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <UserCheck className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-medium mb-1">
                                    Faculty Type Mapping:
                                </p>
                                <ul className="space-y-1 ml-2 text-xs">
                                    <li>A1: Full-time with Plantilla Items</li>
                                    <li>B: Full-time from PS Items on Leave</li>
                                    <li>C1: Full-time from GAA PS Lump Sums</li>
                                    <li>C2: Full-time from SUC Income</li>
                                    <li>C3: Full-time from LGU Funds</li>
                                    <li>E: Part-time Lecturers</li>
                                </ul>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <Database className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                            <p>
                                The system will automatically calculate totals
                                for teaching loads and workload if not provided
                                in the Excel file.
                            </p>
                        </div>
                        <div className="flex items-start space-x-3">
                            <BookOpen className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                            <p>
                                Supported formats: .xlsx, .xls, and .csv files
                                with faculty information
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

                {/* Faculty Type Reference */}
                <div className="bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-100 rounded-xl p-4 border border-purple-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-purple-500 rounded-lg shadow-sm">
                            <GraduationCap className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">
                            Faculty Classification Reference
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                            <div className="bg-white/60 rounded-lg p-3 border">
                                <div className="font-semibold text-blue-800 mb-1">
                                    Group A1
                                </div>
                                <p className="text-gray-700 text-xs">
                                    Full-time faculty with their own plantilla
                                    items
                                </p>
                            </div>
                            <div className="bg-white/60 rounded-lg p-3 border">
                                <div className="font-semibold text-green-800 mb-1">
                                    Group B
                                </div>
                                <p className="text-gray-700 text-xs">
                                    Full-time faculty drawing from PS items of
                                    those on leave
                                </p>
                            </div>
                            <div className="bg-white/60 rounded-lg p-3 border">
                                <div className="font-semibold text-purple-800 mb-1">
                                    Group C1
                                </div>
                                <p className="text-gray-700 text-xs">
                                    Full-time faculty from GAA PS lump sums
                                </p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="bg-white/60 rounded-lg p-3 border">
                                <div className="font-semibold text-orange-800 mb-1">
                                    Group C2
                                </div>
                                <p className="text-gray-700 text-xs">
                                    Full-time faculty from SUC income
                                </p>
                            </div>
                            <div className="bg-white/60 rounded-lg p-3 border">
                                <div className="font-semibold text-pink-800 mb-1">
                                    Group C3
                                </div>
                                <p className="text-gray-700 text-xs">
                                    Full-time faculty from LGU funds
                                </p>
                            </div>
                            <div className="bg-white/60 rounded-lg p-3 border">
                                <div className="font-semibold text-yellow-800 mb-1">
                                    Group E
                                </div>
                                <p className="text-gray-700 text-xs">
                                    Part-time lecturers and faculty
                                </p>
                            </div>
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

FacultyUploadModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onUploadSuccess: PropTypes.func.isRequired,
    institutionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
};

export default FacultyUploadModal;
