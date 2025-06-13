import { useState } from "react";
import {
    X,
    Upload,
    FileSpreadsheet,
    AlertCircle,
    CheckCircle,
    User,
    Calendar,
    Info,
    FileText,
    Database,
    BookOpen,
} from "lucide-react";
import axios from "axios";
import config from "../../../../utils/config";
import PropTypes from "prop-types";
import Dialog from "../../../../Components/Dialog";
import AlertComponent from "../../../../Components/AlertComponent";
import * as XLSX from 'xlsx';

function GraduateUploadModal({ isOpen, onClose, institutionId, onUploadSuccess }) {

    const [uploadStatus, setUploadStatus] = useState(null); // null, 'loading', 'success', 'error'
    const [uploadMessage, setUploadMessage] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [errors, setErrors] = useState({});
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const handleInputChange = (field, value) => {
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

    const clearUploadStatus = () => {
        setUploadStatus(null);
        setUploadMessage("");
    };

    const parseExcelFile = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                    const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

                    console.log('Total rows in Excel:', jsonData.length);

                    // Find the header row (row with Student ID)
                    const headerRowIndex = jsonData.findIndex(row =>
                        row && row.some(cell => cell && cell.toString().toLowerCase().includes('student id'))
                    );

                    if (headerRowIndex === -1) {
                        throw new Error('Could not find header row with "Student ID" in Excel file');
                    }

                    console.log('Header row found at index:', headerRowIndex);

                    // Get the headers
                    const headers = jsonData[headerRowIndex];
                    console.log('Headers:', headers);

                    // Get the data rows (skip header and any format rows)
                    const dataRows = jsonData.slice(headerRowIndex + 1).filter(row => {
                        // Skip empty rows and format description rows
                        if (!row || row.length === 0) return false;
                        if (!row[0] || row[0].toString().includes('(mm/dd/yyyy)')) return false;
                        if (row[0].toString().includes('HEMIS DATA COLLECTION')) return false;
                        // Check if first cell looks like a student ID (has some alphanumeric content)
                        const firstCell = row[0].toString().trim();
                        return firstCell.length > 0 && /[A-Za-z0-9]/.test(firstCell);
                    });

                    console.log('Filtered data rows:', dataRows.length);

                    // Find column indices for required fields
                    const getColumnIndex = (searchTerms) => {
                        for (const term of searchTerms) {
                            const index = headers.findIndex(h =>
                                h && h.toString().toLowerCase().includes(term.toLowerCase())
                            );
                            if (index !== -1) return index;
                        }
                        return -1;
                    };

                    const columnIndices = {
                        studentId: getColumnIndex(['Student ID', 'student id']),
                        dob: getColumnIndex(['Date of Birth', 'date of birth', 'birth date']),
                        lastName: getColumnIndex(['Last Name', 'last name', 'surname']),
                        firstName: getColumnIndex(['First Name', 'first name', 'given name']),
                        middleName: getColumnIndex(['Middle Name', 'middle name']),
                        sex: getColumnIndex(['Sex', 'gender']),
                        dateGraduated: getColumnIndex(['Date Graduated', 'date graduated', 'graduation date'])
                    };

                    console.log('Column indices:', columnIndices);

                    // Validate that we found all required columns
                    const requiredColumns = ['studentId', 'dob', 'lastName', 'firstName', 'sex', 'dateGraduated'];
                    const missingColumns = requiredColumns.filter(col => columnIndices[col] === -1);

                    if (missingColumns.length > 0) {
                        throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
                    }

                    // Convert Excel date numbers to proper date format
                    const convertExcelDate = (value) => {
                        if (!value) return null;

                        try {
                            let date;
                            if (typeof value === 'number') {
                                // Convert Excel date number to JavaScript date
                                date = new Date((value - 25569) * 86400 * 1000);
                            } else if (typeof value === 'string') {
                                // If it's already a string, try to parse it
                                date = new Date(value);
                            } else {
                                return null;
                            }

                            // Check if date is valid
                            if (isNaN(date.getTime())) {
                                console.warn('Invalid date value:', value);
                                return null;
                            }

                            // Format as YYYY-MM-DD
                            const year = date.getFullYear();
                            const month = String(date.getMonth() + 1).padStart(2, '0');
                            const day = String(date.getDate()).padStart(2, '0');
                            return `${year}-${month}-${day}`;
                        } catch (error) {
                            console.warn('Error converting date:', value, error);
                            return null;
                        }
                    };

                    // Log raw data for debugging
                    console.log("Raw Excel Data (first 5 rows):", dataRows.slice(0, 5).map(row => ({
                        student_id: row[columnIndices.studentId],
                        last_name: row[columnIndices.lastName],
                        first_name: row[columnIndices.firstName],
                        middle_name: row[columnIndices.middleName],
                        sex: row[columnIndices.sex],
                        date_of_birth: row[columnIndices.dob],
                        date_graduated: row[columnIndices.dateGraduated],
                        program_name: row[7],
                        program_major: row[8],
                        authority_number: row[9],
                        year_granted: row[10]
                    })));

                    // Process each data row
                    const graduates = dataRows.map((row, index) => {
                        try {
                            // For each graduate, we'll extract the program name from the same row
                            // Based on the Excel structure, program name appears to be in column 7 (index 7)
                            const programNameIndex = 7; // Adjust this based on your Excel structure
                            const programName = row[programNameIndex] ? row[programNameIndex].toString().trim() : '';
                            const programMajorIndex = 8; // Add program major index
                            const programMajor = row[programMajorIndex] ? row[programMajorIndex].toString().trim() : '';
                            const authorityNumberIndex = 9; // Add authority number index
                            const authorityNumber = row[authorityNumberIndex] ? row[authorityNumberIndex].toString().trim() : '';
                            const yearGrantedIndex = 10; // Add year granted index

                            // Handle year_granted - ensure it's a number
                            let yearGranted = null;
                            if (row[yearGrantedIndex]) {
                                const yearValue = row[yearGrantedIndex];
                                if (typeof yearValue === 'number') {
                                    yearGranted = Math.floor(yearValue); // Ensure it's a whole number
                                } else if (typeof yearValue === 'string') {
                                    // Try to extract year from date string or parse as number
                                    const yearMatch = yearValue.match(/\d{4}/);
                                    if (yearMatch) {
                                        yearGranted = parseInt(yearMatch[0], 10);
                                    } else {
                                        const parsedYear = parseInt(yearValue, 10);
                                        if (!isNaN(parsedYear)) {
                                            yearGranted = parsedYear;
                                        }
                                    }
                                }
                            }

                            const graduate = {
                                student_id: row[columnIndices.studentId] ? row[columnIndices.studentId].toString().trim() : '',
                                last_name: row[columnIndices.lastName] ? row[columnIndices.lastName].toString().trim() : '',
                                first_name: row[columnIndices.firstName] ? row[columnIndices.firstName].toString().trim() : '',
                                middle_name: row[columnIndices.middleName] ? row[columnIndices.middleName].toString().trim() : '',
                                date_of_birth: convertExcelDate(row[columnIndices.dob]),
                                sex: row[columnIndices.sex] ? row[columnIndices.sex].toString().trim().toUpperCase() : '',
                                program_name: programName,
                                program_major: programMajor || 'Not Specified', // Ensure program_major is never null
                                authority_number: authorityNumber,
                                date_graduated: convertExcelDate(row[columnIndices.dateGraduated]),
                                year_granted: yearGranted, // Now properly handled as a number
                                suc_details_id: institutionId,
                                report_year: selectedYear
                            };

                            // Log each processed graduate for debugging
                            console.log(`Processed graduate ${index + 1}:`, graduate);

                            // Validate required fields
                            const requiredFields = [
                                'student_id',
                                'last_name',
                                'first_name',
                                'date_of_birth',
                                'sex',
                                'date_graduated',
                                'program_name',
                                'program_major'
                            ];
                            const missingFields = requiredFields.filter(field => !graduate[field]);

                            if (missingFields.length > 0) {
                                console.warn(`Row ${index + headerRowIndex + 2}: Missing required fields: ${missingFields.join(', ')}`, graduate);
                                return null;
                            }

                            // Validate sex field
                            if (!['M', 'F', 'MALE', 'FEMALE'].includes(graduate.sex.toUpperCase())) {
                                console.warn(`Row ${index + headerRowIndex + 2}: Invalid sex value: ${graduate.sex}`);
                                graduate.sex = graduate.sex.charAt(0).toUpperCase(); // Take first character
                            }

                            // Normalize sex to M/F
                            if (graduate.sex.toUpperCase().startsWith('M')) {
                                graduate.sex = 'M';
                            } else if (graduate.sex.toUpperCase().startsWith('F')) {
                                graduate.sex = 'F';
                            }

                            return graduate;
                        } catch (error) {
                            console.error(`Error processing row ${index + headerRowIndex + 2}:`, error, row);
                            return null;
                        }
                    }).filter(graduate => graduate !== null);

                    console.log(`Successfully processed ${graduates.length} graduates out of ${dataRows.length} data rows`);

                    if (graduates.length === 0) {
                        throw new Error('No valid graduate records found in the Excel file');
                    }

                    // Log first few graduates for verification
                    console.log('Sample processed graduates:', graduates.slice(0, 3));

                    resolve(graduates);
                } catch (error) {
                    console.error('Error parsing Excel file:', error);
                    reject(error);
                }
            };
            reader.onerror = (error) => {
                console.error('Error reading file:', error);
                reject(new Error('Failed to read the Excel file'));
            };
            reader.readAsArrayBuffer(file);
        });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
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
        setUploadStatus("loading");
        setUploadMessage("Processing file...");

        try {
            // Parse the Excel file
            const graduates = await parseExcelFile(file);

            setUploadMessage(`Parsed ${graduates.length} graduates. Uploading to server...`);

            // Prepare the request data
            const requestData = {
                graduates: graduates
            };

            const response = await axios.post(
                `${config.API_URL}/suc-pcr-graduate-list/bulk`,
                requestData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 201) {
                setUploadStatus("success");
                setUploadMessage(`Successfully uploaded ${graduates.length} graduates.`);
                onUploadSuccess();
                onClose();
            }
        } catch (err) {
            console.error("Error uploading file:", err);
            setUploadStatus("error");

            let errorMessage = "Failed to upload file. Please try again.";
            if (err.message) {
                errorMessage = err.message;
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            }

            setUploadMessage(errorMessage);
        } finally {
            setIsUploading(false);
            e.target.value = "";
        }
    };

    const handleClose = () => {
        setErrors({});
        setUploadStatus(null);
        setUploadMessage("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <Dialog
            isOpen={isOpen}
            onClose={handleClose}
            title="Upload Graduates"
            subtitle="Import graduate data from Excel files"
            icon={Upload}
            variant="default"
            size="xl"
        >
            <div className="space-y-4">
                {/* Upload Status Alert */}
                {uploadStatus && (
                    <div
                        className={`p-4 rounded-xl border shadow-sm ${
                            uploadStatus === "success"
                                ? "bg-green-50/80 border-green-200 text-green-800"
                                : uploadStatus === "error"
                                ? "bg-red-50/80 border-red-200 text-red-800"
                                : "bg-blue-50/80 border-blue-200 text-blue-800"
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                {uploadStatus === "success" && (
                                    <CheckCircle className="w-5 h-5 mr-2" />
                                )}
                                {uploadStatus === "error" && (
                                    <AlertCircle className="w-5 h-5 mr-2" />
                                )}
                                {uploadStatus === "loading" && (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-800 mr-2"></div>
                                )}
                                <span className="font-medium">
                                    {uploadMessage}
                                </span>
                            </div>
                            {uploadStatus !== "loading" && (
                                <button
                                    onClick={clearUploadStatus}
                                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Institution & Year Selection */}
                <div className="bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-100 rounded-xl p-4 border border-blue-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-blue-500 rounded-lg shadow-sm">
                            <User className="w-5 h-5 text-white" />
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
                                    Required Columns (must be exact matches):
                                </p>
                                <ul className="space-y-1 ml-2">
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                                        Student ID (Required)
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                                        Date of Birth (Required - Excel date format)
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                                        Last Name (Required)
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                                        First Name (Required)
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                                        Middle Name (Optional)
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                                        Sex (Required - M/F)
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                                        Date Graduated (Required - Excel date format)
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                                        Program Name (Usually in column H)
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <Database className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                            <p>
                                The system will automatically validate and process the graduate data.
                                Dates should be in Excel date format (numbers).
                            </p>
                        </div>
                        <div className="flex items-start space-x-3">
                            <BookOpen className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                            <p>
                                Supported formats: .xlsx, .xls, and .csv files.
                                Rows with missing required data will be skipped.
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
                            onChange={handleFileChange}
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
                            {uploadStatus === "loading" && (
                                <div className="mt-4">
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full animate-pulse"
                                            style={{ width: "60%" }}
                                        ></div>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-2">
                                        {uploadMessage}
                                    </p>
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
                    {uploadStatus === "success" && (
                        <button
                            onClick={() => {
                                setUploadStatus(null);
                                setUploadMessage("");
                            }}
                            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm hover:shadow-md transition-all duration-200 font-medium flex items-center justify-center"
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Another File
                        </button>
                    )}
                </div>
            </div>
        </Dialog>
    );
}

GraduateUploadModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onUploadSuccess: PropTypes.func.isRequired,
    institutionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
};

export default GraduateUploadModal;
