/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { X, Upload } from "lucide-react";
import Select from "react-select";
import config from "../../../utils/config";
import axios from "axios";
import useActivityLog from "../../../Hooks/useActivityLog";

const UploadDialog = ({
    openUploadDialog,
    setOpenUploadDialog,
    selectedInstitutionType,
    setSelectedInstitutionType,
    selectedFile,
    setSelectedFile,
    handleFileUpload,
    selectedRegion,
    setSelectedRegion,
    selectedProvince,
    setSelectedProvince,
    selectedMunicipality,
    setSelectedMunicipality,
}) => {
    const { createLog } = useActivityLog();
    const [fileError, setFileError] = useState("");
    const [typeError, setTypeError] = useState("");
    const [heiError, setHeiError] = useState("");
    const [validationTriggered, setValidationTriggered] = useState(false);
    const [regions, setRegions] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [municipalities, setMunicipalities] = useState([]);
    const [reportYears, setReportYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState("");
    const [heis, setHeis] = useState([]);
    const [selectedHei, setSelectedHei] = useState(null);

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const ACCEPTED_FILE_TYPES = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
    ];

    // Fetch HEIs
    useEffect(() => {
        const fetchHeis = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`${config.API_URL}/heis`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setHeis(res.data);
            } catch (error) {
                console.error("Error fetching HEIs:", error);
                setHeis([]);
                Swal.fire({
                    title: "Error",
                    text: "Failed to fetch HEIs.",
                    icon: "error",
                    confirmButtonColor: "#d33",
                });
            }
        };
        fetchHeis();
    }, []);

    // Fetch report years
    useEffect(() => {
        const fetchReportYears = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`${config.API_URL}/report-years`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const sortedYears = res.data.sort((a, b) => b.year - a.year);
                setReportYears(sortedYears);
                if (sortedYears.length > 0) {
                    setSelectedYear(sortedYears[0].year);
                }
            } catch (error) {
                console.error("Error fetching report years:", error);
                setReportYears([]);
                Swal.fire({
                    title: "Error",
                    text: "Failed to fetch report years.",
                    icon: "error",
                    confirmButtonColor: "#d33",
                });
            }
        };
        fetchReportYears();
    }, []);

    // Fetch regions
    useEffect(() => {
        const fetchRegions = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`${config.API_URL}/regions`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRegions(res.data);
                setSelectedRegion("10"); // Default to region 10
            } catch (error) {
                console.error("Error fetching regions:", error);
                setRegions([]);
            }
        };
        fetchRegions();
    }, []);

    // Fetch provinces
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

    // Fetch municipalities
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
        setOpenUploadDialog(false);
        setSelectedFile(null);
        setSelectedInstitutionType("");
        setSelectedHei(null);
        setFileError("");
        setTypeError("");
        setHeiError("");
        setValidationTriggered(false);
        setSelectedYear("");
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
            errors.push("Institution type is required.");
        } else {
            setTypeError("");
        }

        if (!selectedHei) {
            setHeiError("Please select an HEI.");
            errors.push("HEI is required.");
        } else {
            setHeiError("");
        }

        if (!selectedYear) {
            errors.push("Please select a year.");
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

    const handleUploadClick = async () => {
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

        try {
            await handleFileUpload(selectedYear, selectedHei.uiid);

            // Log the upload action
            await createLog({
                action: "Upload Institutions",
                description: `Uploaded details for HEI: ${selectedHei.name} from file: ${selectedFile.name}`,
            });
        } catch (error) {
            console.error("Error uploading institutions:", error);
            Swal.fire({
                title: "Error",
                text: "Failed to upload institution details.",
                icon: "error",
                confirmButtonColor: "#d33",
            });
        }
    };

    if (!openUploadDialog) return null;

    // Format HEIs for react-select
    const heiOptions = heis.map((hei) => ({
        value: hei.uiid,
        label: `${hei.name} (${hei.uiid})`,
    }));

    return (
        <div className="fixed inset-0 shadow-amber-900 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                {/* Dialog Header */}
                <div className="flex items-center justify-between p-4 bg-gray-100 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Upload Form A
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-full"
                        aria-label="Close dialog"
                    >
                        <X className="w-5 h-5" />
                    </button>
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
                                id="instituti
                                on-type"
                                value={selectedInstitutionType}
                                onChange={(e) => {
                                    setSelectedInstitutionType(e.target.value);
                                    if (validationTriggered)
                                        setValidationTriggered(false);
                                }}
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

                        {/* HEI Dropdown */}
                        <div>
                            <label
                                htmlFor="hei"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Select HEI
                            </label>
                            <Select
                                id="hei"
                                options={heiOptions}
                                value={heiOptions.find(
                                    (option) => option.value === selectedHei?.uiid
                                )}
                                onChange={(selectedOption) => {
                                    setSelectedHei(
                                        heis.find(
                                            (hei) => hei.uiid === selectedOption.value
                                        ) || null
                                    );
                                    if (validationTriggered)
                                        setValidationTriggered(false);
                                }}
                                placeholder="Search and select HEI..."
                                className={`text-sm ${
                                    heiError && validationTriggered
                                        ? "border-red-500"
                                        : ""
                                }`}
                                classNamePrefix="select"
                                isClearable
                                isSearchable
                            />
                            {heiError && validationTriggered && (
                                <p className="text-red-500 text-xs mt-1">
                                    {heiError}
                                </p>
                            )}
                        </div>

                        {/* Year Dropdown */}
                        <div>
                            <label
                                htmlFor="year"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Select Year
                            </label>
                            <select
                                id="year"
                                value={selectedYear}
                                onChange={(e) =>
                                    setSelectedYear(e.target.value)
                                }
                                className={`w-full px-3 py-2 border ${
                                    !selectedYear && validationTriggered
                                        ? "border-red-500"
                                        : "border-gray-300"
                                } rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white`}
                            >
                                <option value="">Select Year</option>
                                {reportYears.map((reportYear) => (
                                    <option
                                        key={reportYear.id}
                                        value={reportYear.year}
                                    >
                                        {reportYear.year}
                                    </option>
                                ))}
                            </select>
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
                                document.getElementById("upload-input").click()
                            }
                            className={`p-4 border-2 border-dashed ${
                                fileError && validationTriggered
                                    ? "border-red-500"
                                    : "border-blue-500"
                            } rounded-lg flex flex-col items-center justify-center cursor-pointer bg-white hover:bg-gray-50 transition-colors`}
                        >
                            <Upload className="w-7 h-7 text-blue-500" />
                            <p className="mt-2 text-sm text-gray-600">
                                Drag & drop file or click to browse
                            </p>
                            <p className="text-xs text-gray-500">
                                Supported formats: .xlsx, .xls
                            </p>
                            <input
                                id="upload-input"
                                type="file"
                                accept=".xlsx, .xls"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>
                    </div>

                    {/* Selected File Preview */}
                    {selectedFile && (
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
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUploadClick}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
                    >
                        Upload
                    </button>
                </div>
            </div>
        </div>
    );
};

UploadDialog.propTypes = {
    openUploadDialog: PropTypes.bool.isRequired,
    setOpenUploadDialog: PropTypes.func.isRequired,
    selectedInstitutionType: PropTypes.string.isRequired,
    setSelectedInstitutionType: PropTypes.func.isRequired,
    selectedFile: PropTypes.shape({
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        size: PropTypes.number.isRequired,
    }),
    setSelectedFile: PropTypes.func.isRequired,
    handleFileUpload: PropTypes.func.isRequired,
    selectedRegion: PropTypes.string.isRequired,
    setSelectedRegion: PropTypes.func.isRequired,
    selectedProvince: PropTypes.string.isRequired,
    setSelectedProvince: PropTypes.func.isRequired,
    selectedMunicipality: PropTypes.string.isRequired,
    setSelectedMunicipality: PropTypes.func.isRequired,
};

export default UploadDialog;
