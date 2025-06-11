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

        const formData = new FormData();
        formData.append("file", file);
        formData.append("suc_details_id", institutionId);
        formData.append("report_year", selectedYear);

        try {
            const response = await axios.post(
                `${config.API_URL}/suc-pcr-graduates/upload`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.status === 200) {
                setUploadStatus("success");
                setUploadMessage("Graduates uploaded successfully.");
                onUploadSuccess();
            }
        } catch (err) {
            console.error("Error uploading file:", err);
            setUploadStatus("error");
            setUploadMessage(
                err.response?.data?.message ||
                "Failed to upload file. Please try again."
            );
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
                                    Required Columns:
                                </p>
                                <ul className="space-y-1 ml-2">
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                                        Student ID (Required)
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
                                        Middle Name
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                                        Date of Birth (YYYY-MM-DD)
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                                        Sex (M/F)
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                                        Program Name
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                                        Date Graduated (YYYY-MM-DD)
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <Database className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                            <p>
                                The system will automatically validate and process the graduate data.
                            </p>
                        </div>
                        <div className="flex items-start space-x-3">
                            <BookOpen className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                            <p>
                                Supported formats: .xlsx, .xls, and .csv files with graduate information
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
