import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { X, Upload } from "lucide-react";
import axios from "axios";
import * as XLSX from "xlsx";
import config from "../utils/config";

const GraduatesUploadDialog = ({ open, onClose }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileError, setFileError] = useState("");
    const [validationTriggered, setValidationTriggered] = useState(false);
    const [institutionId, setInstitutionId] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const ACCEPTED_FILE_TYPES = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
    ];

    useEffect(() => {
        // Get institution ID from local storage
        const institution = JSON.parse(localStorage.getItem("institution"));
        if (institution?.id) {
            setInstitutionId(institution.id);
        }
    }, []);

    const handleClose = () => {
        onClose();
        setSelectedFile(null);
        setFileError("");
        setValidationTriggered(false);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file || null);
        setFileError("");
        if (validationTriggered) setValidationTriggered(false);
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setFileError("");
        if (validationTriggered) setValidationTriggered(false);
    };

    const validateInputs = () => {
        const errors = [];

        if (!selectedFile) {
            setFileError("Please choose a file.");
            errors.push("A file is required.");
        } else if (!ACCEPTED_FILE_TYPES.includes(selectedFile.type)) {
            setFileError("Please upload a valid Excel file (.xlsx or .xls).");
            errors.push("File must be a valid Excel file (.xlsx or .xls).");
        } else if (selectedFile.size > MAX_FILE_SIZE) {
            setFileError("File size exceeds 10MB limit.");
            errors.push("File size exceeds 10MB limit.");
        } else {
            setFileError("");
        }

        return errors;
    };

    const handleUpload = async () => {
        setValidationTriggered(true);
        const errors = validateInputs();
        if (errors.length > 0) {
            Swal.fire({
                title: "Validation Error",
                html: `<ul class="list-disc pl-5 text-left">${errors
                    .map((error) => `<li>${error}</li>`)
                    .join("")}</ul>`,
                icon: "error",
                confirmButtonColor: "#d33",
                confirmButtonText: "OK",
                customClass: {
                    popup: "swal2-popup",
                    title: "text-lg font-semibold text-gray-900",
                    content: "text-gray-600",
                },
            });
            return;
        }

        if (!institutionId) {
            Swal.fire({
                title: "Error",
                text: "Institution ID is missing.",
                icon: "error",
                confirmButtonColor: "#d33",
                confirmButtonText: "OK",
            });
            return;
        }

        setIsUploading(true);

        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: "array" });

                    let allGraduates = [];
                    const seenGraduates = new Set();

                    // Process each sheet in the workbook
                    for (const sheetName of workbook.SheetNames) {
                        const sheet = workbook.Sheets[sheetName];
                        const jsonData = XLSX.utils.sheet_to_json(sheet, {
                            header: 1,
                            range: 1,
                        });

                        // Filter out empty rows
                        const validRows = jsonData.filter(
                            (row) =>
                                row.some(
                                    (cell) =>
                                        cell !== undefined && cell !== null
                                ) && row[0]
                        );

                        if (validRows.length === 0) {
                            continue;
                        }

                        // Process each row to create graduate objects
                        const processedGraduates = validRows.map((row) => {
                            const formatDate = (date) => {
                                if (!date) return null;
                                try {
                                    const parsedDate = new Date(date);
                                    if (isNaN(parsedDate.getTime()))
                                        return null;
                                    return parsedDate
                                        .toISOString()
                                        .split("T")[0];
                                } catch {
                                    return null;
                                }
                            };

                            const yearGranted = row[10]
                                ? parseInt(row[10], 10)
                                : null;
                            const sex = row[4]
                                ? String(row[4]).toUpperCase()
                                : null;

                            return {
                                institution_id: parseInt(institutionId, 10),
                                student_id: row[0] ? String(row[0]) : null,
                                last_name: row[1] ? String(row[1]) : null,
                                first_name: row[2] ? String(row[2]) : null,
                                middle_name: row[3] ? String(row[3]) : null,
                                sex: sex === "M" || sex === "F" ? sex : null,
                                date_of_birth: formatDate(row[5]),
                                date_graduated: formatDate(row[6]),
                                program_name: row[7] ? String(row[7]) : null,
                                program_major: row[8] ? String(row[8]) : null,
                                program_authority_to_operate_graduate: row[9]
                                    ? String(row[9])
                                    : null,
                                year_granted: isNaN(yearGranted)
                                    ? null
                                    : yearGranted,
                            };
                        });

                        // Add unique graduates to the collection
                        processedGraduates.forEach((graduate) => {
                            if (
                                graduate.student_id &&
                                graduate.last_name &&
                                graduate.first_name &&
                                graduate.sex &&
                                graduate.date_of_birth &&
                                graduate.program_name
                            ) {
                                const graduateString = JSON.stringify(graduate);
                                if (!seenGraduates.has(graduateString)) {
                                    seenGraduates.add(graduateString);
                                    allGraduates.push(graduate);
                                }
                            }
                        });
                    }

                    if (allGraduates.length === 0) {
                        throw new Error(
                            "No valid graduate data found in the file."
                        );
                    }

                    // Submit data to backend
                    const token = localStorage.getItem("token");
                    const response = await axios.post(
                        `${config.API_URL}/graduates`,
                        allGraduates,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                        }
                    );

                    Swal.fire({
                        title: "Success",
                        text:
                            response.data.message ||
                            "Graduates uploaded successfully!",
                        icon: "success",
                        confirmButtonColor: "#3085d6",
                        confirmButtonText: "OK",
                    });

                    handleClose();
                } catch (error) {
                    console.error("Error processing or sending data:", error);
                    const errorMessage =
                        error.response?.data?.message || error.message;

                    Swal.fire({
                        title: "Error",
                        text: errorMessage,
                        icon: "error",
                        confirmButtonColor: "#d33",
                        confirmButtonText: "OK",
                    });
                } finally {
                    setIsUploading(false);
                }
            };

            reader.readAsArrayBuffer(selectedFile);
        } catch (error) {
            console.error("Unexpected error during upload:", error);
            Swal.fire({
                title: "Error",
                text: "An unexpected error occurred. Please try again.",
                icon: "error",
                confirmButtonColor: "#d33",
                confirmButtonText: "OK",
            });
            setIsUploading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 shadow-amber-900 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                {/* Dialog Header */}
                <div className="flex items-center justify-between p-4 bg-gray-100 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Upload Graduates Data
                    </h2>
                    {!isUploading && (
                        <button
                            onClick={handleClose}
                            className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-full"
                            aria-label="Close dialog"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Dialog Content */}
                <div className="p-4 space-y-4">


                    {/* File Upload */}
                    <div>
                        <div
                            onDrop={(e) => {
                                e.preventDefault();
                                if (
                                    !isUploading &&
                                    e.dataTransfer.files &&
                                    e.dataTransfer.files[0]
                                ) {
                                    setSelectedFile(e.dataTransfer.files[0]);
                                    setFileError("");
                                    if (validationTriggered)
                                        setValidationTriggered(false);
                                }
                            }}
                            onDragOver={(e) => e.preventDefault()}
                            onClick={() =>
                                !isUploading && fileInputRef.current.click()
                            }
                            className={`p-4 border-2 border-dashed ${
                                fileError && validationTriggered
                                    ? "border-red-500"
                                    : "border-blue-500"
                            } rounded-lg flex flex-col items-center justify-center ${
                                isUploading
                                    ? "cursor-default"
                                    : "cursor-pointer"
                            } bg-white hover:bg-gray-50 transition-colors`}
                        >
                            <Upload className="w-7 h-7 text-blue-500" />
                            <p className="mt-2 text-sm text-gray-600">
                                {isUploading
                                    ? "Uploading..."
                                    : "Drag & drop file or click to browse"}
                            </p>
                            <p className="text-xs text-gray-500">
                                Supported formats: .xlsx, .xls
                            </p>
                            <input
                                id="upload-input"
                                type="file"
                                accept=".xlsx, .xls"
                                onChange={handleFileChange}
                                disabled={isUploading}
                                className="hidden"
                                ref={fileInputRef}
                            />
                        </div>
                    </div>

                    {/* Selected File Preview */}
                    {selectedFile && !isUploading && (
                        <div className="flex items-center justify-between p-2 bg-gray-100 border border-gray-200 rounded-md">
                            <span className="text-sm text-gray-700 truncate">
                                {selectedFile.name}
                            </span>
                            <button
                                onClick={handleRemoveFile}
                                className="p-1 text-gray-600 hover:text-red-600 hover:bg-gray-200 rounded-full"
                                aria-label="Remove selected file"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* Expected File Format Information */}
                    <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Upload Guidelines:
                        </h4>
                        <ul className="list-disc pl-5 text-xs text-gray-600 space-y-1">
                            <li>
                                File must be in Excel format (.xlsx, .xls)
                            </li>
                            <li>
                                Ensure the file contains valid graduate data
                                with no empty rows.
                            </li>
                            <li>
                                Required columns (in order): Student ID, Last
                                Name, First Name, Middle Name, Sex (M/F), Date
                                of Birth, Date Graduated, Program Name, Program
                                Major, Program Authority, Year Granted.
                            </li>
                            <li>
                                File size must not exceed 10MB.
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Dialog Footer */}
                <div className="flex justify-end space-x-2 p-4 border-t border-gray-200">
                    <button
                        onClick={handleClose}
                        disabled={isUploading}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpload}
                        disabled={isUploading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
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
    );
};

GraduatesUploadDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default GraduatesUploadDialog;
