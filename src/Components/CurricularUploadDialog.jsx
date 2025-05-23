// CurricularUploadDialog.js
import { useState, useMemo, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import * as XLSX from "xlsx";
import axios from "axios";
import AlertComponent from "../Components/AlertComponent";
import { useLoading } from "../Context/LoadingContext";
import config from "../utils/config";
import useActivityLog from "../Hooks/useActivityLog";

const CurricularUploadDialog = ({ open, onClose }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [validationResults, setValidationResults] = useState(null);
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(false);
    const { updateProgress, showLoading, hideLoading } = useLoading();
    const fileInputRef = useRef(null);
    const { createLog } = useActivityLog();

    const categories = useMemo(
        () => [
            "DOCTORATE",
            "MASTERS",
            "POST-BACCALAUREATE",
            "BACCALAUREATE",
            "PRE-BACCALAUREATE",
            "VOC-TECH",
            "BASIC EDUCATION",
        ],
        []
    );

    // Fetch programs function integrated into the component
    const fetchPrograms = useCallback(async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const institutionId = user.institution_id;
            showLoading();
            setLoading(true);
            const token = localStorage.getItem("token");

            if (!institutionId) {
                console.error("No institution ID found");
                hideLoading();
                setPrograms([]);
                return;
            }

            const response = await axios.get(`${config.API_URL}/programs`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { institution_id: institutionId },
            });

            console.log("Fetched programs:", response.data);

            if (Array.isArray(response.data)) {
                // Normalize program_type to uppercase for consistency
                const normalizedPrograms = response.data.map((program) => ({
                    ...program,
                    program_type: program.program_type?.toUpperCase().trim(),
                }));
                setPrograms(normalizedPrograms);
            } else {
                console.error("Invalid data format:", response.data);
                setPrograms([]);
            }
        } catch (error) {
            console.error("Error fetching programs:", error);
            AlertComponent.showAlert(
                "Failed to fetch programs. Please try again.",
                "error"
            );
            setPrograms([]);
        } finally {
            setLoading(false);
            hideLoading();
        }
    }, [showLoading, hideLoading]);

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.add("border-blue-600", "bg-blue-50");
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove("border-blue-600", "bg-blue-50");
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove("border-blue-600", "bg-blue-50");

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const file = files[0];
            if (
                file.type.includes("excel") ||
                file.name.endsWith(".xlsx") ||
                file.name.endsWith(".xls")
            ) {
                setSelectedFile(file);
                setValidationResults(null);
            } else {
                AlertComponent.showAlert(
                    "Please upload a valid Excel file (.xlsx or .xls)",
                    "warning"
                );
            }
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setValidationResults(null);
        }
    };

    const validateData = async (allParsedData) => {
        // Simple validation example - you can expand this
        const validationIssues = {
            missingProgramName: [],
            invalidCategory: [],
            negativeValues: [],
        };

        allParsedData.forEach((item, index) => {
            if (!item.program_name) {
                validationIssues.missingProgramName.push(index);
            }

            if (!categories.includes(item.program_type)) {
                validationIssues.invalidCategory.push(index);
            }

            // Check for negative numerical values
            const numericFields = [
                "lab_units",
                "lecture_units",
                "total_units",
                "tuition_per_unit",
                "program_fee",
                "subtotal_male",
                "subtotal_female",
            ];

            for (const field of numericFields) {
                if (item[field] < 0) {
                    validationIssues.negativeValues.push({ index, field });
                    break; // Only report once per row
                }
            }
        });

        const hasIssues = Object.values(validationIssues).some(
            (arr) => arr.length > 0
        );

        return {
            isValid: !hasIssues,
            issues: validationIssues,
        };
    };

    const handleCurricularUpload = async () => {
        if (!selectedFile) {
            AlertComponent.showAlert("No file selected for upload.", "warning");
            return;
        }

        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        const institutionId = user.institution_id;

        if (!institutionId || !token) {
            AlertComponent.showAlert(
                !institutionId
                    ? "Please select an institution first."
                    : "Please log in first.",
                "warning"
            );
            onClose();
            setSelectedFile(null);
            return;
        }

        setIsUploading(true);
        showLoading();
        updateProgress(10);

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array" });

                let allParsedData = [];
                const currentDate = new Date().toLocaleDateString("en-CA", {
                    timeZone: "Asia/Manila",
                });

                updateProgress(30);

                // Process each sheet
                for (let sheetIndex = 0; sheetIndex <= 6; sheetIndex++) {
                    if (!workbook.SheetNames[sheetIndex]) continue;

                    const sheetName = workbook.SheetNames[sheetIndex];
                    const sheet = workbook.Sheets[sheetName];

                    const sheetData = XLSX.utils.sheet_to_json(sheet, {
                        header: 1,
                        range: 10,
                    });

                    const parsedData = sheetData
                        .map((row) => {
                            if (!row[1]) return null; // Skip rows without program name

                            const labUnits = Number(row[12]) || 0;
                            const lectureUnits = Number(row[13]) || 0;
                            const maleTotal =
                                Number(row[17] || 0) +
                                Number(row[19] || 0) +
                                Number(row[21] || 0) +
                                Number(row[23] || 0) +
                                Number(row[25] || 0) +
                                Number(row[27] || 0) +
                                Number(row[29] || 0) +
                                Number(row[31] || 0);
                            const femaleTotal =
                                Number(row[18] || 0) +
                                Number(row[20] || 0) +
                                Number(row[22] || 0) +
                                Number(row[24] || 0) +
                                Number(row[26] || 0) +
                                Number(row[28] || 0) +
                                Number(row[30] || 0) +
                                Number(row[32] || 0);
                            return {
                                institution_id: institutionId,
                                program_name: row[1] || null,
                                program_code: row[2] || null,
                                major_name: row[3] || null,
                                major_code: row[4] || null,
                                category: row[5] || null,
                                serial: String(row[6] || ""),
                                Year: String(row[7] || ""),
                                is_thesis_dissertation_required: row[8] || null,
                                program_status: String(row[9] || ""),
                                calendar_use_code: String(row[10] || ""),
                                program_normal_length_in_years:
                                    Number(row[11]) || null,
                                lab_units: labUnits,
                                lecture_units: lectureUnits,
                                total_units: labUnits + lectureUnits,
                                tuition_per_unit: Number(row[15]) || null,
                                program_fee: Number(row[16]) || null,
                                program_type: categories[sheetIndex],
                                data_date: currentDate,
                                new_students_freshmen_male:
                                    Number(row[17]) || null,
                                new_students_freshmen_female:
                                    Number(row[18]) || null,
                                "1st_year_male": Number(row[19]) || null,
                                "1st_year_female": Number(row[20]) || null,
                                "2nd_year_male": Number(row[21]) || null,
                                "2nd_year_female": Number(row[22]) || null,
                                "3rd_year_male": Number(row[23]) || null,
                                "3rd_year_female": Number(row[24]) || null,
                                "4th_year_male": Number(row[25]) || null,
                                "4th_year_female": Number(row[26]) || null,
                                "5th_year_male": Number(row[27]) || null,
                                "5th_year_female": Number(row[28]) || null,
                                "6th_year_male": Number(row[29]) || null,
                                "6th_year_female": Number(row[30]) || null,
                                "7th_year_male": Number(row[31]) || null,
                                "7th_year_female": Number(row[32]) || null,
                                subtotal_male: maleTotal,
                                subtotal_female: femaleTotal,
                                grand_total: maleTotal + femaleTotal,
                                lecture_units_actual: Number(row[36]) || null,
                                laboratory_units_actual:
                                    Number(row[37]) || null,
                                total_units_actual:
                                    (Number(row[36]) || 0) +
                                    (Number(row[37]) || 0),
                                graduates_males: Number(row[39]) || null,
                                graduates_females: Number(row[40]) || null,
                                graduates_total:
                                    (Number(row[39]) || 0) +
                                    (Number(row[40]) || 0),
                                externally_funded_merit_scholars:
                                    Number(row[41]) || null,
                                internally_funded_grantees:
                                    Number(row[42]) || null,
                                suc_funded_grantees: Number(row[43]) || null,
                            };
                        })
                        .filter(Boolean); // Remove null values

                    console.log(
                        `Sheet ${sheetName}: Total rows: ${sheetData.length}, Valid rows: ${parsedData.length}`
                    );
                    allParsedData = [...allParsedData, ...parsedData];
                }

                updateProgress(50);

                if (allParsedData.length === 0) {
                    AlertComponent.showAlert(
                        "No valid programs with a program name found in any sheet of the Excel file.",
                        "warning"
                    );
                    setIsUploading(false);
                    setSelectedFile(null);
                    updateProgress(0);
                    hideLoading();
                    return;
                }

                // Validate data before sending to API
                const validation = await validateData(allParsedData);

                if (!validation.isValid) {
                    setValidationResults(validation);
                    setIsUploading(false);
                    updateProgress(0);
                    hideLoading();
                    return;
                }

                try {
                    const createdPrograms = [];
                    const totalRows = allParsedData.length;
                    let processedRows = 0;

                    for (const data of allParsedData) {
                        const programResponse = await axios.post(
                            `${config.API_URL}/programs`,
                            data,
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                        createdPrograms.push(programResponse.data);
                        processedRows += 1;

                        const progressPercentage =
                            50 + Math.round((50 * processedRows) / totalRows);
                        updateProgress(progressPercentage);
                    }

                    updateProgress(100);

                    // Refresh the programs list after successful upload
                    fetchPrograms();

                    // After successful upload, add this before the success alert
                    await createLog({
                        action: "Upload Curricular Data",
                        description: `Uploaded curricular data for ${allParsedData.length} programs`,
                    });

                    AlertComponent.showAlert(
                        "Curricular data imported successfully!",
                        "success"
                    );
                } catch (error) {
                    console.error(
                        "Error importing curricular data:",
                        error.response?.data
                    );
                    AlertComponent.showAlert(
                        `Error importing curricular data: ${
                            error.response?.data?.message || error.message
                        }`,
                        "error"
                    );
                } finally {
                    setIsUploading(false);
                    onClose();
                    setSelectedFile(null);
                    updateProgress(0);
                    hideLoading();
                }
            } catch (error) {
                console.error("Error processing file:", error.message);
                AlertComponent.showAlert(
                    `Error processing file: ${error.message}`,
                    "error"
                );
                setIsUploading(false);
                onClose();
                setSelectedFile(null);
                updateProgress(0);
                hideLoading();
            }
        };

        reader.readAsArrayBuffer(selectedFile);
    };

    // Format file size for display
    const formatFileSize = (bytes) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    if (!open) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50 transition-opacity z-40"></div>

            {/* Dialog */}
            <div
                className="fixed inset-0 z-50 overflow-y-auto"
                role="dialog"
                aria-modal="true"
            >
                <div className="flex min-h-full items-center justify-center p-4">
                    <div className="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all w-full max-w-lg">
                        {/* Header */}
                        <div className="bg-blue-100 px-4 py-3 flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900">
                                Upload Curricular Data
                            </h3>
                            {!isUploading && (
                                <button
                                    type="button"
                                    className="text-gray-500 hover:text-gray-700 focus:outline-none rounded-md"
                                    onClick={onClose}
                                    aria-label="Close"
                                >
                                    <svg
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            )}
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <p className="text-sm text-gray-500 mb-6">
                                Upload your curricular data Excel file. The file
                                should contain sheets for different program
                                categories.
                                <span className="block mt-2 text-xs font-medium">
                                    Supported categories:{" "}
                                    {categories.join(", ")}
                                </span>
                            </p>

                            {/* Validation results */}
                            {validationResults &&
                                !validationResults.isValid && (
                                    <div className="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md">
                                        <h4 className="font-medium mb-2">
                                            Please fix the following issues:
                                        </h4>
                                        <ul className="list-disc pl-5 text-sm">
                                            {validationResults.issues
                                                .missingProgramName.length >
                                                0 && (
                                                <li>
                                                    Missing program names in{" "}
                                                    {
                                                        validationResults.issues
                                                            .missingProgramName
                                                            .length
                                                    }{" "}
                                                    rows
                                                </li>
                                            )}
                                            {validationResults.issues
                                                .invalidCategory.length > 0 && (
                                                <li>
                                                    Invalid program categories
                                                    in{" "}
                                                    {
                                                        validationResults.issues
                                                            .invalidCategory
                                                            .length
                                                    }{" "}
                                                    rows
                                                </li>
                                            )}
                                            {validationResults.issues
                                                .negativeValues.length > 0 && (
                                                <li>
                                                    Negative values found in{" "}
                                                    {
                                                        validationResults.issues
                                                            .negativeValues
                                                            .length
                                                    }{" "}
                                                    rows
                                                </li>
                                            )}
                                        </ul>
                                        <div className="flex justify-end mt-2">
                                            <button
                                                onClick={() =>
                                                    setValidationResults(null)
                                                }
                                                className="text-xs text-blue-600 hover:text-blue-800"
                                            >
                                                Dismiss
                                            </button>
                                        </div>
                                    </div>
                                )}

                            {/* Upload area */}
                            <div
                                className="p-6 border-2 border-dashed border-blue-400 rounded-lg flex flex-col items-center gap-2 cursor-pointer hover:bg-gray-50 transition-all"
                                onClick={() =>
                                    !isUploading &&
                                    fileInputRef.current?.click()
                                }
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-10 w-10 text-blue-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                    />
                                </svg>
                                <p className="text-sm text-center">
                                    {isUploading
                                        ? "Uploading..."
                                        : "Drag & drop Excel file or click to browse"}
                                </p>
                                <p className="text-xs text-gray-500 text-center">
                                    Supported formats: .xlsx, .xls
                                </p>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="hidden"
                                    accept=".xlsx, .xls"
                                    onChange={handleFileChange}
                                    disabled={isUploading}
                                />
                            </div>

                            {/* Selected file */}
                            {selectedFile && !isUploading && (
                                <div className="mt-4 p-3 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-between">
                                    <div className="flex items-center w-[calc(100%-2rem)]">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 text-green-600 flex-shrink-0 mr-2"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
                                        </svg>
                                        <div className="min-w-0 flex-1">
                                            <p
                                                className="text-sm truncate"
                                                title={selectedFile.name}
                                            >
                                                {selectedFile.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {formatFileSize(
                                                    selectedFile.size
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedFile(null);
                                        }}
                                        className="text-red-500 hover:text-red-700 focus:outline-none p-1"
                                        aria-label="Remove file"
                                    >
                                        <svg
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            )}

                            {/* Existing Programs Stats (if any) */}
                            {programs.length > 0 && !isUploading && (
                                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                    <h4 className="text-sm font-medium text-blue-800 mb-1">
                                        Existing Programs:
                                    </h4>
                                    <p className="text-xs text-blue-700">
                                        {programs.length} programs already exist
                                        for this institution.
                                    </p>
                                </div>
                            )}

                            {/* Guidelines */}
                            <div className="mt-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">
                                    Upload Guidelines:
                                </h4>
                                <ul className="list-disc pl-5 text-xs text-gray-600 space-y-1">
                                    <li>
                                        File must be in Excel format (.xlsx,
                                        .xls)
                                    </li>
                                    <li>
                                        Each sheet should represent a different
                                        program category
                                    </li>
                                    <li>
                                        Each row should contain a single program
                                    </li>
                                    <li>
                                        Required fields: Program Name, Program
                                        Code
                                    </li>
                                    <li>
                                        Data will be validated before upload
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
                            <button
                                type="button"
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                onClick={onClose}
                                disabled={isUploading}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 min-w-[100px]"
                                onClick={handleCurricularUpload}
                                disabled={
                                    !selectedFile || isUploading || loading
                                }
                            >
                                {isUploading ? (
                                    <svg
                                        className="animate-spin h-5 w-5 text-white mx-auto"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                ) : (
                                    "Upload"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

CurricularUploadDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    encryptedInstitutionId: PropTypes.string.isRequired,
};

export default CurricularUploadDialog;
