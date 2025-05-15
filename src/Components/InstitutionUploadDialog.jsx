/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { X, Upload } from "lucide-react";
import moment from "moment";
import axios from "axios";
import * as XLSX from "xlsx";
import config from "../utils/config";

const InstitutionUploadDialog = ({ open, onClose }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileError, setFileError] = useState("");
    const [typeError, setTypeError] = useState("");
    const [validationTriggered, setValidationTriggered] = useState(false);
    const [selectedInstitutionType, setSelectedInstitutionType] = useState("");
    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedMunicipality, setSelectedMunicipality] = useState("");
    const [regions, setRegions] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [municipalities, setMunicipalities] = useState([]);
    const [selectedDate, setSelectedDate] = useState(moment());
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const ACCEPTED_FILE_TYPES = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
    ];

    // Fetch regions, provinces, municipalities
    useEffect(() => {
        if (!selectedRegion) {
            setSelectedRegion("10");
        }
    }, []);



    useEffect(() => {
        const fetchRegions = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`${config.API_URL}/regions`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRegions(res.data);
            } catch (error) {
                console.error("Error fetching regions:", error);
                setRegions([]);
            }
        };
        fetchRegions();
    }, []);

    useEffect(() => {
        if (selectedRegion) {
            const fetchProvinces = async (regionId) => {
                try {
                    const token = localStorage.getItem("token");
                    const res = await axios.get(
                        `${config.API_URL}/provinces?region_id=${regionId}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    setProvinces(res.data);
                } catch (error) {
                    console.error("Error fetching provinces:", error);
                    setProvinces([]);
                }
            };
            fetchProvinces(selectedRegion);
        } else {
            setProvinces([]);
            setMunicipalities([]);
            setSelectedProvince("");
            setSelectedMunicipality("");
        }
    }, [selectedRegion]);

    useEffect(() => {
        if (selectedProvince) {
            const fetchMunicipalities = async (provinceId) => {
                try {
                    const token = localStorage.getItem("token");
                    const res = await axios.get(
                        `${config.API_URL}/municipalities?province_id=${provinceId}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    setMunicipalities(res.data);
                } catch (error) {
                    console.error("Error fetching municipalities:", error);
                    setMunicipalities([]);
                }
            };
            fetchMunicipalities(selectedProvince);
        } else {
            setMunicipalities([]);
            setSelectedMunicipality("");
        }
    }, [selectedProvince]);

    const handleClose = () => {
        onClose();
        setSelectedFile(null);
        setSelectedInstitutionType("");
        setFileError("");
        setTypeError("");
        setValidationTriggered(false);
        setSelectedRegion("");
        setSelectedProvince("");
        setSelectedMunicipality("");
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

        if (!selectedInstitutionType) {
            setTypeError("Please select an institution type.");
            errors.pu;
            errors.push("Institution type is required.");
        } else {
            setTypeError("");
        }

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

        const hei = JSON.parse(localStorage.getItem("institution"));
        console.log("User:", hei.uuid);



        setIsUploading(true);

        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: "array" });

                    // Process Sheet A1 (Institution Data)
                    const sheetA1 = workbook.Sheets[workbook.SheetNames[0]];
                    const jsonDataA1 = XLSX.utils.sheet_to_json(sheetA1, {
                        header: 1,
                    });

                    const toNullableInteger = (value) => {
                        if (!value || value === "N/A" || value === "")
                            return null;
                        const parsed = Number.parseInt(value, 10);
                        return isNaN(parsed) ? null : parsed;
                    };

                    const reportYear = selectedDate.year().toString();

                    const extractedInstitution = {
                        uuid: String(hei.uuid || ""),
                        name: String(jsonDataA1[4]?.[2] || "Unknown"),
                        region_id: Number.parseInt(selectedRegion, 10) || null,
                        address_street: String(jsonDataA1[7]?.[2] || ""),
                        municipality_id:
                            Number.parseInt(selectedMunicipality, 10) || null,
                        province_id:
                            Number.parseInt(selectedProvince, 10) || null,
                        postal_code: String(jsonDataA1[11]?.[2] || ""),
                        institutional_telephone: String(
                            jsonDataA1[12]?.[2] || ""
                        ),
                        institutional_fax: String(jsonDataA1[13]?.[2] || ""),
                        head_telephone: String(jsonDataA1[14]?.[2] || ""),
                        institutional_email: String(jsonDataA1[15]?.[2] || ""),
                        institutional_website: String(
                            jsonDataA1[16]?.[2] || ""
                        ),
                        year_established: toNullableInteger(
                            jsonDataA1[17]?.[2]
                        ),
                        sec_registration: String(jsonDataA1[18]?.[2] || ""),
                        year_granted_approved: toNullableInteger(
                            jsonDataA1[19]?.[2]
                        ),
                        year_converted_college: toNullableInteger(
                            jsonDataA1[20]?.[2]
                        ),
                        year_converted_university: toNullableInteger(
                            jsonDataA1[21]?.[2]
                        ),
                        head_name: String(jsonDataA1[22]?.[2] || ""),
                        head_title: String(jsonDataA1[23]?.[2] || ""),
                        head_education: String(jsonDataA1[24]?.[2] || ""),
                        institution_type: selectedInstitutionType,
                        report_year: reportYear,
                    };

                    const token = localStorage.getItem("token");
                    const institutionResponse = await axios.post(
                        `${config.API_URL}/institutions`,
                        extractedInstitution,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                        }
                    );

                    Swal.fire({
                        title: "Success",
                        text: "Institution data uploaded successfully!",
                        icon: "success",
                        confirmButtonColor: "#3085d6",
                        confirmButtonText: "OK",
                    });

                    const institutionId = institutionResponse.data.id;
                    if (!institutionId || isNaN(Number(institutionId))) {
                        throw new Error(
                            "Invalid institution ID received from server."
                        );
                    }

                    // Process Sheet A2 (Campus Data)
                    const sheetA2 = workbook.Sheets[workbook.SheetNames[1]];
                    const jsonDataA2 = XLSX.utils.sheet_to_json(sheetA2, {
                        header: 1,
                    });

                    const startRow = 10;
                    const currentYear = new Date().getFullYear();

                    const processedCampuses = jsonDataA2
                        .slice(startRow)
                        .filter((row) =>
                            row.some(
                                (cell) => cell !== undefined && cell !== ""
                            )
                        )
                        .map((row) => {
                            const parseNumeric = (value, min, max) => {
                                if (
                                    value === undefined ||
                                    value === "" ||
                                    isNaN(value)
                                )
                                    return null;
                                const num = Number.parseFloat(value);
                                if (min !== undefined && num < min) return null;
                                if (max !== undefined && num > max) return null;
                                return num;
                            };

                            const parseInteger = (value, min, max) => {
                                if (
                                    value === undefined ||
                                    value === "" ||
                                    isNaN(value)
                                )
                                    return null;
                                const int = Number.parseInt(value, 10);
                                if (min !== undefined && int < min) return null;
                                if (max !== undefined && int > max) return null;
                                return int;
                            };

                            const parseString = (value) => {
                                if (value === undefined || value === "")
                                    return null;
                                const str = String(value).trim();
                                return str.length > 255
                                    ? str.substring(0, 255)
                                    : str;
                            };

                            return {
                                suc_name: parseString(row[1]),
                                campus_type: parseString(row[2]),
                                institutional_code: parseString(row[3]),
                                region: parseString(row[4]) || "",
                                province_municipality:
                                    parseString(row[5]) || "",
                                year_first_operation: parseInteger(
                                    row[6],
                                    1800,
                                    currentYear
                                ),
                                land_area_hectares: parseNumeric(row[7], 0),
                                distance_from_main: parseNumeric(row[8], 0),
                                autonomous_code: parseString(row[9]),
                                position_title: parseString(row[10]),
                                head_full_name: parseString(row[11]),
                                former_name: parseString(row[12]),
                                latitude_coordinates: parseNumeric(
                                    row[13],
                                    -90,
                                    90
                                ),
                                longitude_coordinates: parseNumeric(
                                    row[14],
                                    -180,
                                    180
                                ),
                                institution_id: Number.parseInt(
                                    institutionId,
                                    10
                                ),
                                report_year: Number.parseInt(reportYear, 10),
                            };
                        });

                    await axios.post(
                        `${config.API_URL}/campuses`,
                        processedCampuses,
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );

                    Swal.fire({
                        title: "Success",
                        text: "Campuses added successfully!",
                        icon: "success",
                        confirmButtonColor: "#3085d6",
                        confirmButtonText: "OK",
                    });

                    handleClose();
                } catch (error) {
                    console.error("Error sending data to backend:", error);
                    const errorMessage =
                        error.response?.data?.message ||
                        "Error uploading institution or campus data.";

                    if (
                        error.response?.status === 422 &&
                        errorMessage.includes("UUID and report year")
                    ) {
                        Swal.fire({
                            title: "Error",
                            text: "An institution with the same UUID and report year already exists.",
                            icon: "error",
                            confirmButtonColor: "#d33",
                            confirmButtonText: "OK",
                        });
                    } else {
                        Swal.fire({
                            title: "Error",
                            text: errorMessage,
                            icon: "error",
                            confirmButtonColor: "#d33",
                            confirmButtonText: "OK",
                        });
                    }
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
                        Upload Form A
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Institution Type */}
                        <div>
                            <label
                                htmlFor="institution-type"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Institution Type
                            </label>
                            <select
                                id="institution-type"
                                value={selectedInstitutionType}
                                onChange={(e) => {
                                    setSelectedInstitutionType(e.target.value);
                                    if (validationTriggered)
                                        setValidationTriggered(false);
                                }}
                                disabled={isUploading}
                                className={`w-full px-3 py-2 border ${
                                    typeError && validationTriggered
                                        ? "border-red-500"
                                        : "border-gray-300"
                                } rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white`}
                            >
                                <option value="">Select Type</option>
                                <option value="SUC">SUC</option>
                                <option value="LUC">LUC</option>
                                <option value="PHEI">PHEI</option>
                            </select>
                        </div>

                        {/* Year Picker */}
                        <div>
                            <label
                                htmlFor="year"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Select Year
                            </label>
                            <input
                                id="year"
                                type="number"
                                value={selectedDate.year()}
                                onChange={(e) =>
                                    setSelectedDate(
                                        moment().year(Number(e.target.value))
                                    )
                                }
                                min="1900"
                                max={new Date().getFullYear()}
                                disabled={isUploading}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            />
                        </div>

                        {/* Region */}
                        <div>
                            <label
                                htmlFor="region"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Region
                            </label>
                            <select
                                id="region"
                                value={selectedRegion}
                                onChange={(e) =>
                                    setSelectedRegion(e.target.value)
                                }
                                disabled={isUploading}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="">Select Region</option>
                                {regions.map((region) => (
                                    <option key={region.id} value={region.id}>
                                        {region.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Province */}
                        <div>
                            <label
                                htmlFor="province"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Province
                            </label>
                            <select
                                id="province"
                                value={selectedProvince}
                                onChange={(e) =>
                                    setSelectedProvince(e.target.value)
                                }
                                disabled={isUploading}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="">Select Province</option>
                                {provinces.map((province) => (
                                    <option
                                        key={province.id}
                                        value={province.id}
                                    >
                                        {province.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Municipality */}
                        <div>
                            <label
                                htmlFor="municipality"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Municipality
                            </label>
                            <select
                                id="municipality"
                                value={selectedMunicipality}
                                onChange={(e) =>
                                    setSelectedMunicipality(e.target.value)
                                }
                                disabled={isUploading}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="">Select Municipality</option>
                                {municipalities.map((municipality) => (
                                    <option
                                        key={municipality.id}
                                        value={municipality.id}
                                    >
                                        {municipality.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

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

InstitutionUploadDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default InstitutionUploadDialog;
