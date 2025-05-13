/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { X, Upload } from "lucide-react";
import moment from "moment";
import config from "../../../utils/config";
import axios from "axios";

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
    const [fileError, setFileError] = useState("");
    const [typeError, setTypeError] = useState("");
    const [uuidError, setUuidError] = useState("");
    const [validationTriggered, setValidationTriggered] = useState(false);
    const [regions, setRegions] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [municipalities, setMunicipalities] = useState([]);
    const [selectedDate, setSelectedDate] = useState(moment());
    const [uuid, setUuid] = useState("");
    const [existingUuids, setExistingUuids] = useState([]);
    const [filteredUuids, setFilteredUuids] = useState([]);
    const [showUuidSuggestions, setShowUuidSuggestions] = useState(false);
    const uuidInputRef = useRef(null);

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const ACCEPTED_FILE_TYPES = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
    ];

    useEffect(() => {
        if (!selectedRegion) {
            setSelectedRegion("10");
        }
    }, []);

    useEffect(() => {
        const storedUuids = JSON.parse(localStorage.getItem("uuids")) || [];
        setExistingUuids(storedUuids);
        setFilteredUuids(storedUuids);
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
        setOpenUploadDialog(false);
        setSelectedFile(null);
        setSelectedInstitutionType("");
        setUuid("");
        setFileError("");
        setTypeError("");
        setUuidError("");
        setValidationTriggered(false);
        setShowUuidSuggestions(false);
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

    const handleUuidChange = (e) => {
        const value = e.target.value;
        setUuid(value);
        setShowUuidSuggestions(true);

        if (value.trim()) {
            const filtered = existingUuids.filter((item) =>
                item.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredUuids(filtered);
        } else {
            setFilteredUuids(existingUuids);
        }

        if (validationTriggered) setValidationTriggered(false);
    };

    const handleUuidSelect = (selectedUuid) => {
        setUuid(selectedUuid);
        setShowUuidSuggestions(false);
    };

    const handleClickOutside = (e) => {
        if (uuidInputRef.current && !uuidInputRef.current.contains(e.target)) {
            setShowUuidSuggestions(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const validateInputs = () => {
        const errors = [];

        if (!selectedInstitutionType) {
            setTypeError("Please select an institution type.");
            errors.push("Institution type is required.");
        } else {
            setTypeError("");
        }

        if (!uuid.trim()) {
            setUuidError("Please enter a UUID.");
            errors.push("UUID is required.");
        } else {
            setUuidError("");
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

    const handleUploadClick = () => {
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

        const isNewUuid = !existingUuids.includes(uuid);
        if (isNewUuid) {
            const updatedUuids = [...existingUuids, uuid];
            setExistingUuids(updatedUuids);
            setFilteredUuids(updatedUuids);
            localStorage.setItem("uuids", JSON.stringify(updatedUuids)); // Save to local storage
        }

        handleFileUpload(selectedDate.year(), uuid);
    };

    if (!openUploadDialog) return null;

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
                                id="institution-type"
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

                        {/* UUID Combo Box */}
                        <div ref={uuidInputRef}>
                            <label
                                htmlFor="uuid"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                UUID
                            </label>
                            <div className="relative">
                                <input
                                    id="uuid"
                                    type="text"
                                    value={uuid}
                                    onChange={handleUuidChange}
                                    onFocus={() => setShowUuidSuggestions(true)}
                                    placeholder="Enter or select UUID"
                                    className={`w-full px-3 py-2 border ${
                                        uuidError && validationTriggered
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    } rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white`}
                                />
                                {showUuidSuggestions &&
                                    filteredUuids.length > 0 && (
                                        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto shadow-lg">
                                            {filteredUuids.map(
                                                (item, index) => (
                                                    <li
                                                        key={index}
                                                        onClick={() =>
                                                            handleUuidSelect(
                                                                item
                                                            )
                                                        }
                                                        className="px-3 py-2 text-sm text-gray-700 hover:bg-blue-100 cursor-pointer"
                                                    >
                                                        {item}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    )}
                            </div>
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
