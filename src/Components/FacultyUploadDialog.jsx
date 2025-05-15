// FacultyUploadDialog.js
import { useState, useRef } from "react";
import PropTypes from "prop-types";
import * as XLSX from "xlsx";
import axios from "axios";
import { useLoading } from "../Context/LoadingContext";
import config from "../utils/config";
import AlertComponent from "../Components/AlertComponent";

const FacultyUploadDialog = ({ open, onClose, fetchFacultyProfiles }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const { showLoading, hideLoading, updateProgress } = useLoading();
    const fileInputRef = useRef(null);

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
            } else {
                AlertComponent.showAlert("Please upload a valid Excel file (.xlsx or .xls)", "warning");
            }
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    // Format file size for display
    const formatFileSize = (bytes) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            AlertComponent.showAlert("Please select a file to upload.", "warning");
            return;
        }

        const user = JSON.parse(localStorage.getItem("user"));
        const institutionId = user.institution_id;

        setIsUploading(true);
        showLoading();
        updateProgress(5); // Start progress at 5%

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = e.target.result;
                const workbook = XLSX.read(data, { type: "binary" });

                let allFacultyProfiles = [];

                updateProgress(10); // Progress after reading the file

                for (
                    let sheetIndex = 0;
                    sheetIndex < workbook.SheetNames.length;
                    sheetIndex++
                ) {
                    const sheetName = workbook.SheetNames[sheetIndex];
                    const sheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(sheet, {
                        header: 1,
                        range: 6,
                    });

                    const validRows = jsonData.filter(
                        (row) => row[1] // Only require the `name` field (column 2)
                    );

                    const parseInteger = (value) => {
                        if (value === undefined || value === "" || isNaN(value)) {
                            return null;
                        }
                        return parseInt(value, 10);
                    };

                    updateProgress(20 + Math.round((50 * (sheetIndex + 1)) / workbook.SheetNames.length)); // Increment progress based on sheets processed

                    const processedFacultyProfiles = validRows.map((row) => ({
                        institution_id: institutionId,
                        faculty_group: sheetName,
                        name: row[1] || null, // Name is required
                        generic_faculty_rank: row[2] || null,
                        home_college: row[3] || null,
                        home_department: row[4] || null,
                        is_tenured: parseInteger(row[5]),
                        data_date: String(new Date().getFullYear()),
                        ssl_salary_grade: parseInteger(row[6]),
                        annual_basic_salary: parseInteger(row[7]),
                        on_leave_without_pay: parseInteger(row[8]),
                        full_time_equivalent: parseFloat(row[9]) || null,
                        gender: parseInteger(row[10]),
                        highest_degree_attained: parseInteger(row[11]),
                        pursuing_next_degree: parseInteger(row[12]),
                        discipline_teaching_load_1: String(row[13]) || null,
                        discipline_teaching_load_2: String(row[14]) || null,
                        discipline_bachelors: String(row[15]) || null,
                        discipline_masters: String(row[16]) || null,
                        discipline_doctorate: row[17] || null,
                        masters_with_thesis: parseInteger(row[18]),
                        doctorate_with_dissertation: parseInteger(row[19]),
                        undergrad_lab_credit_units: parseFloat(row[20]) || null,
                        undergrad_lecture_credit_units: parseFloat(row[21]) || null,
                        undergrad_total_credit_units: parseFloat(row[22]) || null,
                        graduate_lab_credit_units: parseFloat(row[29]) || null,
                        graduate_lecture_credit_units: parseFloat(row[30]) || null,
                        graduate_total_credit_units: parseFloat(row[31]) || null,
                        research_load: parseFloat(row[35]) || null,
                        extension_services_load: parseFloat(row[36]) || null,
                        study_load: parseFloat(row[37]) || null,
                        production_load: parseFloat(row[38]) || null,
                        administrative_load: parseFloat(row[39]) || null,
                        other_load_credits: parseFloat(row[40]) || null,
                        total_work_load: parseFloat(row[41]) || null,
                    }));

                    allFacultyProfiles = [
                        ...allFacultyProfiles,
                        ...processedFacultyProfiles,
                    ];
                }

                const token = localStorage.getItem("token");
                updateProgress(75); // Progress after processing all sheets

                await axios.post(
                    `${config.API_URL}/faculty-profiles`,
                    allFacultyProfiles,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                updateProgress(90); // Progress after sending data to the server

                AlertComponent.showAlert("Faculty data uploaded successfully!", "success");

                if (typeof fetchFacultyProfiles === "function") {
                    fetchFacultyProfiles(); // Refresh data after upload
                }

                updateProgress(100); // Final progress
                onClose();
            } catch (error) {
                console.error("Error uploading faculty data:", error);
                AlertComponent.showAlert("Failed to upload faculty data. Please try again.", "error");
            } finally {
                setIsUploading(false);
                hideLoading();
                setSelectedFile(null);
            }
        };

        reader.readAsBinaryString(selectedFile);
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
                                Upload Faculty Data
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
                                Upload your faculty data Excel file. The file
                                should contain information about faculty members
                                across different departments.
                                <span className="block mt-2 text-xs font-medium">
                                    Each sheet will be imported as a faculty
                                    group.
                                </span>
                            </p>

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
                                        Each sheet will be processed as a
                                        separate faculty group
                                    </li>
                                    <li>
                                        Data starts from row 7 (header row is
                                        ignored)
                                    </li>
                                    <li>Required field: Name</li>
                                    <li>
                                        Columns should match the standard
                                        faculty data template
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
                                onClick={handleUpload}
                                disabled={!selectedFile || isUploading}
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

FacultyUploadDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    fetchFacultyProfiles: PropTypes.func.isRequired, // Ensure this is passed as a valid function
};

export default FacultyUploadDialog;
