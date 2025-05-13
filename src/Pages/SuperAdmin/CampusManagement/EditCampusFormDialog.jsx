/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { decryptId } from "../../../utils/encryption";
import useLocationData from "../../../utils/useLocationData";
// Import icons from react-icons
import {
    FaSchool,
    FaMapMarkerAlt,
    FaUser,
    FaRulerCombined,
    FaCalendarAlt,
    FaBuilding,
    FaChartArea,
    FaClock,
} from "react-icons/fa";
import {
    MdClose,
    MdSave,
    MdLocationOn,
    MdMap,
    MdTitle,
    MdBusiness,
    MdLocationCity,
    MdCode,
} from "react-icons/md";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { BiCurrentLocation } from "react-icons/bi";

const EditCampusFormDialog = ({
    open,
    onClose,
    onSubmit,
    campusData,
    campusId,
    setSnackbarOpen,
    setSnackbarMessage,
    setSnackbarSeverity,
}) => {
    const { institutionId: encryptedInstitutionId } = useParams();
    const decryptedInstitutionId = decryptId(encryptedInstitutionId);
    const {
        regions,
        provinces,
        municipalities,
        fetchRegions,
        fetchProvinces,
        fetchMunicipalities,
    } = useLocationData();
    const currentYear = 2025;

    const [formData, setFormData] = useState({
        institution_id: decryptedInstitutionId || "",
        suc_name: "",
        campus_type: "",
        institutional_code: "",
        region_id: "",
        province_id: "",
        municipality_id: "",
        former_name: "",
        year_first_operation: "",
        land_area_hectares: "",
        distance_from_main: "",
        autonomous_code: "",
        position_title: "",
        head_full_name: "",
        latitude_coordinates: "",
        longitude_coordinates: "",
        report_year: "",
        region: "",
        province_municipality: "",
    });
    const [errors, setErrors] = useState({});
    const [activeTab, setActiveTab] = useState("basic"); // For tab navigation: "basic", "location", "details"

    // Initialize form with campusData
    useEffect(() => {
        if (campusData) {
            console.log(
                "[EditCampusFormDialog] Received campusData:",
                campusData
            );
            const newFormData = {
                institution_id: campusData.institution_id
                    ? String(campusData.institution_id)
                    : decryptedInstitutionId || "",
                suc_name: campusData.suc_name || "",
                campus_type: campusData.campus_type || "",
                institutional_code: campusData.institutional_code || "",
                region_id: campusData.region_id
                    ? String(campusData.region_id)
                    : "",
                province_id: campusData.province_id
                    ? String(campusData.province_id)
                    : "",
                municipality_id: campusData.municipality_id
                    ? String(campusData.municipality_id)
                    : "",
                former_name: campusData.former_name || "",
                year_first_operation: campusData.year_first_operation
                    ? String(campusData.year_first_operation)
                    : "",
                land_area_hectares:
                    campusData.land_area_hectares !== null &&
                    campusData.land_area_hectares !== undefined
                        ? String(campusData.land_area_hectares)
                        : "",
                distance_from_main:
                    campusData.distance_from_main !== null &&
                    campusData.distance_from_main !== undefined
                        ? String(campusData.distance_from_main)
                        : "",
                autonomous_code: campusData.autonomous_code || "",
                position_title: campusData.position_title || "",
                head_full_name: campusData.head_full_name || "",
                latitude_coordinates:
                    campusData.latitude_coordinates !== null &&
                    campusData.latitude_coordinates !== undefined
                        ? String(campusData.latitude_coordinates)
                        : "",
                longitude_coordinates:
                    campusData.longitude_coordinates !== null &&
                    campusData.longitude_coordinates !== undefined
                        ? String(campusData.longitude_coordinates)
                        : "",
                report_year: campusData.report_year
                    ? String(campusData.report_year)
                    : "",
                region: campusData.region || "",
                province_municipality: campusData.province_municipality || "",
            };
            setFormData(newFormData);
            console.log("[EditCampusFormDialog] Set formData:", newFormData);
        }
    }, [campusData, decryptedInstitutionId]);

    // Derive province_municipality when provinces and municipalities are fetched
    useEffect(() => {
        if (
            campusData &&
            campusData.province_id &&
            campusData.municipality_id &&
            provinces.length > 0 &&
            municipalities.length > 0
        ) {
            const provinceName =
                provinces.find((p) => p.id === parseInt(campusData.province_id))
                    ?.name || "";
            const municipalityName =
                municipalities.find(
                    (m) => m.id === parseInt(campusData.municipality_id)
                )?.name || "";
            const combined = municipalityName
                ? `${provinceName}, ${municipalityName}`
                : `${provinceName}, `;
            if (combined !== formData.province_municipality) {
                setFormData((prev) => ({
                    ...prev,
                    province_municipality: combined,
                }));
                console.log(
                    "[EditCampusFormDialog] Derived province_municipality:",
                    combined
                );
            }
        }
    }, [campusData, provinces, municipalities]);

    // Fetch regions when dialog opens
    useEffect(() => {
        if (open) {
            fetchRegions();
        }
    }, [open]);

    // Fetch provinces when region is selected
    useEffect(() => {
        if (formData.region_id) {
            fetchProvinces(formData.region_id);
        }
    }, [formData.region_id]);

    // Fetch municipalities when province is selected
    useEffect(() => {
        if (formData.province_id) {
            fetchMunicipalities(formData.province_id);
        }
    }, [formData.province_id]);

    const validateForm = () => {
        const newErrors = {};

        // Required fields
        if (!formData.institution_id) {
            newErrors.institution_id = "Institution ID is required.";
        }

        // Nullable string fields with max length
        const stringFields = [
            "suc_name",
            "campus_type",
            "institutional_code",
            "former_name",
            "autonomous_code",
            "position_title",
            "head_full_name",
            "region",
            "province_municipality",
        ];
        stringFields.forEach((field) => {
            if (formData[field] && formData[field].length > 255) {
                newErrors[field] = "Must be 255 characters or less.";
            }
        });

        // Year fields
        if (formData.year_first_operation) {
            const year = parseInt(formData.year_first_operation, 10);
            if (isNaN(year)) {
                newErrors.year_first_operation = "Must be a valid year.";
            } else if (year < 1800) {
                newErrors.year_first_operation = "Year must be 1800 or later.";
            } else if (year > currentYear) {
                newErrors.year_first_operation =
                    "Year cannot be in the future.";
            }
        }

        if (formData.report_year) {
            const year = parseInt(formData.report_year, 10);
            if (isNaN(year)) {
                newErrors.report_year = "Must be a valid year.";
            } else if (year < 1800) {
                newErrors.report_year = "Year must be 1800 or later.";
            } else if (year > currentYear) {
                newErrors.report_year = "Year cannot be in the future.";
            }
        }

        // Numeric fields
        if (formData.land_area_hectares !== "") {
            const value = parseFloat(formData.land_area_hectares);
            if (isNaN(value)) {
                newErrors.land_area_hectares = "Must be a valid number.";
            } else if (value < 0) {
                newErrors.land_area_hectares = "Must be 0 or greater.";
            }
        }

        if (formData.distance_from_main !== "") {
            const value = parseFloat(formData.distance_from_main);
            if (isNaN(value)) {
                newErrors.distance_from_main = "Must be a valid number.";
            } else if (value < 0) {
                newErrors.distance_from_main = "Must be 0 or greater.";
            }
        }

        // Coordinates
        if (formData.latitude_coordinates !== "") {
            const value = parseFloat(formData.latitude_coordinates);
            if (isNaN(value)) {
                newErrors.latitude_coordinates = "Must be a valid number.";
            } else if (value < -90 || value > 90) {
                newErrors.latitude_coordinates = "Must be between -90 and 90.";
            }
        }

        if (formData.longitude_coordinates !== "") {
            const value = parseFloat(formData.longitude_coordinates);
            if (isNaN(value)) {
                newErrors.longitude_coordinates = "Must be a valid number.";
            } else if (value < -180 || value > 180) {
                newErrors.longitude_coordinates =
                    "Must be between -180 and 180.";
            }
        }

        // Location ID fields (required for UI consistency)
        if (!formData.region_id) {
            newErrors.region_id = "Region is required.";
        }
        if (!formData.province_id) {
            newErrors.province_id = "Province is required.";
        }
        if (!formData.municipality_id) {
            newErrors.municipality_id = "Municipality is required.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const resetForm = () => {
        setFormData({
            institution_id: decryptedInstitutionId || "",
            suc_name: "",
            campus_type: "",
            institutional_code: "",
            region_id: "",
            province_id: "",
            municipality_id: "",
            former_name: "",
            year_first_operation: "",
            land_area_hectares: "",
            distance_from_main: "",
            autonomous_code: "",
            position_title: "",
            head_full_name: "",
            latitude_coordinates: "",
            longitude_coordinates: "",
            report_year: "",
            region: "",
            province_municipality: "",
        });
        setErrors({});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            console.log("[Edit Campus] Validation failed:", errors);
            setSnackbarMessage("Validation failed. Please check the form.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            return;
        }

        const payload = {
            institution_id: parseInt(formData.institution_id, 10),
            suc_name: formData.suc_name || null,
            campus_type: formData.campus_type || null,
            institutional_code: formData.institutional_code || null,
            region_id: formData.region_id
                ? parseInt(formData.region_id, 10)
                : null,
            province_id: formData.province_id
                ? parseInt(formData.province_id, 10)
                : null,
            municipality_id: formData.municipality_id
                ? parseInt(formData.municipality_id, 10)
                : null,
            former_name: formData.former_name || null,
            year_first_operation: formData.year_first_operation
                ? parseInt(formData.year_first_operation, 10)
                : null,
            land_area_hectares: formData.land_area_hectares
                ? parseFloat(formData.land_area_hectares)
                : null,
            distance_from_main: formData.distance_from_main
                ? parseFloat(formData.distance_from_main)
                : null,
            autonomous_code: formData.autonomous_code || null,
            position_title: formData.position_title || null,
            head_full_name: formData.head_full_name || null,
            latitude_coordinates: formData.latitude_coordinates
                ? parseFloat(formData.latitude_coordinates)
                : null,
            longitude_coordinates: formData.longitude_coordinates
                ? parseFloat(formData.longitude_coordinates)
                : null,
            report_year: formData.report_year
                ? parseInt(formData.report_year, 10)
                : null,
            region: formData.region || null,
            province_municipality: formData.province_municipality || null,
        };

        console.log("[Edit Campus] Submitting data:", payload);
        onSubmit(campusId, payload);
        resetForm();
        onClose();
    };

    if (!open) return null;

    // Helper function to check if there are errors in a specific tab
    const hasTabErrors = (tabName) => {
        const tabFields = {
            basic: [
                "suc_name",
                "institutional_code",
                "campus_type",
                "former_name",
                "autonomous_code",
                "year_first_operation",
                "report_year",
            ],
            location: [
                "region_id",
                "province_id",
                "municipality_id",
                "latitude_coordinates",
                "longitude_coordinates",
                "distance_from_main",
            ],
            details: ["position_title", "head_full_name", "land_area_hectares"],
        };

        return tabFields[tabName].some((field) => errors[field]);
    };

    // Input field component for consistency
    const InputField = ({
        label,
        name,
        type = "text",
        value,
        onChange,
        icon,
        error,
        required = false,
        min,
        max,
        step,
        disabled = false,
        options = [],
        placeholder = "",
    }) => {
        const isSelect = options.length > 0;

        return (
            <div className="mb-4">
                <label
                    htmlFor={name}
                    className="flex items-center text-sm font-medium text-gray-700 mb-1"
                >
                    {icon && <span className="mr-2 text-blue-500">{icon}</span>}
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <div className="relative">
                    {isSelect ? (
                        <select
                            id={name}
                            name={name}
                            value={value}
                            onChange={onChange}
                            disabled={disabled}
                            className={`w-full px-3 py-2 bg-white border ${
                                error ? "border-red-500" : "border-gray-300"
                            } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                disabled ? "bg-gray-100 opacity-70" : ""
                            }`}
                            required={required}
                        >
                            <option value="">
                                {placeholder || `Select ${label}`}
                            </option>
                            {options.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            id={name}
                            type={type}
                            name={name}
                            value={value}
                            onChange={onChange}
                            min={min}
                            max={max}
                            step={step}
                            disabled={disabled}
                            placeholder={placeholder}
                            className={`w-full px-3 py-2 border ${
                                error ? "border-red-500" : "border-gray-300"
                            } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                disabled ? "bg-gray-100 opacity-70" : ""
                            }`}
                            required={required}
                        />
                    )}
                </div>
                {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>
        );
    };
    InputField.propTypes = {
        label: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        type: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
        onChange: PropTypes.func.isRequired,
        icon: PropTypes.element,
        error: PropTypes.string,
        required: PropTypes.bool,
        min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        disabled: PropTypes.bool,
        options: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
                    .isRequired,
                name: PropTypes.string.isRequired,
            })
        ),
        placeholder: PropTypes.string,
    };

    // Tab navigation component
    const TabNavigation = () => (
        <div className="mb-6 border-b border-gray-200">
            <nav className="flex -mb-px space-x-4">
                <button
                    onClick={() => setActiveTab("basic")}
                    className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors flex items-center ${
                        activeTab === "basic"
                            ? "bg-blue-600 text-white"
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    } ${
                        hasTabErrors("basic")
                            ? "after:content-['!'] after:ml-1 after:text-red-500 after:font-bold"
                            : ""
                    }`}
                >
                    <FaSchool className="mr-2" /> Basic Information
                </button>
                <button
                    onClick={() => setActiveTab("location")}
                    className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors flex items-center ${
                        activeTab === "location"
                            ? "bg-blue-600 text-white"
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    } ${
                        hasTabErrors("location")
                            ? "after:content-['!'] after:ml-1 after:text-red-500 after:font-bold"
                            : ""
                    }`}
                >
                    <FaMapMarkerAlt className="mr-2" /> Location
                </button>
                <button
                    onClick={() => setActiveTab("details")}
                    className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors flex items-center ${
                        activeTab === "details"
                            ? "bg-blue-600 text-white"
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    } ${
                        hasTabErrors("details")
                            ? "after:content-['!'] after:ml-1 after:text-red-500 after:font-bold"
                            : ""
                    }`}
                >
                    <FaChartArea className="mr-2" /> Additional Details
                </button>
            </nav>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[85vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                        <FaBuilding className="mr-3 text-blue-600" /> Edit
                        Campus
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Close"
                    >
                        <MdClose size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <TabNavigation />

                    {/* Basic Information Tab */}
                    {activeTab === "basic" && (
                        <div className="space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField
                                    label="Campus Name"
                                    name="suc_name"
                                    value={formData.suc_name}
                                    onChange={handleInputChange}
                                    icon={<FaSchool />}
                                    error={errors.suc_name}
                                    required
                                />
                                <InputField
                                    label="Institutional Code"
                                    name="institutional_code"
                                    value={formData.institutional_code}
                                    onChange={handleInputChange}
                                    icon={<MdCode />}
                                    error={errors.institutional_code}
                                />
                                <InputField
                                    label="Campus Type"
                                    name="campus_type"
                                    value={formData.campus_type}
                                    onChange={handleInputChange}
                                    icon={<MdBusiness />}
                                    error={errors.campus_type}
                                    options={[
                                        { id: "MAIN", name: "MAIN" },
                                        { id: "Satellite", name: "Satellite" },
                                    ]}
                                />
                                <InputField
                                    label="Former Name"
                                    name="former_name"
                                    value={formData.former_name}
                                    onChange={handleInputChange}
                                    icon={<MdTitle />}
                                    error={errors.former_name}
                                />
                                <InputField
                                    label="Year Established"
                                    name="year_first_operation"
                                    type="number"
                                    value={formData.year_first_operation}
                                    onChange={handleInputChange}
                                    icon={<FaCalendarAlt />}
                                    error={errors.year_first_operation}
                                    min="1800"
                                    max={currentYear}
                                />
                                <InputField
                                    label="Report Year"
                                    name="report_year"
                                    type="number"
                                    value={formData.report_year}
                                    onChange={handleInputChange}
                                    icon={<FaClock />}
                                    error={errors.report_year}
                                    min="1800"
                                    max={currentYear}
                                />
                                <InputField
                                    label="Autonomous Code"
                                    name="autonomous_code"
                                    value={formData.autonomous_code}
                                    onChange={handleInputChange}
                                    icon={<MdCode />}
                                    error={errors.autonomous_code}
                                />
                            </div>
                        </div>
                    )}

                    {/* Location Tab */}
                    {activeTab === "location" && (
                        <div className="space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField
                                    label="Region"
                                    name="region_id"
                                    value={formData.region_id}
                                    onChange={(e) => {
                                        const regionName =
                                            regions.find(
                                                (r) =>
                                                    r.id ===
                                                    parseInt(e.target.value)
                                            )?.name || "";
                                        handleInputChange(e);
                                        setFormData((prev) => ({
                                            ...prev,
                                            province_id: "",
                                            municipality_id: "",
                                            region: regionName,
                                            province_municipality: "",
                                        }));
                                    }}
                                    icon={<MdLocationCity />}
                                    error={errors.region_id}
                                    required
                                    options={regions}
                                />
                                <InputField
                                    label="Province"
                                    name="province_id"
                                    value={formData.province_id}
                                    onChange={(e) => {
                                        const provinceName =
                                            provinces.find(
                                                (p) =>
                                                    p.id ===
                                                    parseInt(e.target.value)
                                            )?.name || "";
                                        handleInputChange(e);
                                        setFormData((prev) => ({
                                            ...prev,
                                            municipality_id: "",
                                            province_municipality: `${provinceName}, `,
                                        }));
                                    }}
                                    icon={<MdLocationOn />}
                                    error={errors.province_id}
                                    required
                                    disabled={!formData.region_id}
                                    options={provinces}
                                />
                                <InputField
                                    label="Municipality"
                                    name="municipality_id"
                                    value={formData.municipality_id}
                                    onChange={(e) => {
                                        const municipalityName =
                                            municipalities.find(
                                                (m) =>
                                                    m.id ===
                                                    parseInt(e.target.value)
                                            )?.name || "";
                                        const provinceName =
                                            provinces.find(
                                                (p) =>
                                                    p.id ===
                                                    parseInt(
                                                        formData.province_id
                                                    )
                                            )?.name || "";
                                        handleInputChange(e);
                                        setFormData((prev) => ({
                                            ...prev,
                                            province_municipality:
                                                municipalityName
                                                    ? `${provinceName}, ${municipalityName}`
                                                    : `${provinceName}, `,
                                        }));
                                    }}
                                    icon={<MdMap />}
                                    error={errors.municipality_id}
                                    required
                                    disabled={!formData.province_id}
                                    options={municipalities}
                                />
                                <InputField
                                    label="Distance from Main (km)"
                                    name="distance_from_main"
                                    type="number"
                                    value={formData.distance_from_main}
                                    onChange={handleInputChange}
                                    icon={<FaRulerCombined />}
                                    error={errors.distance_from_main}
                                    step="0.01"
                                    min="0"
                                />
                                <InputField
                                    label="Latitude"
                                    name="latitude_coordinates"
                                    type="number"
                                    value={formData.latitude_coordinates}
                                    onChange={handleInputChange}
                                    icon={<HiOutlineLocationMarker />}
                                    error={errors.latitude_coordinates}
                                    step="0.000001"
                                    min="-90"
                                    max="90"
                                />
                                <InputField
                                    label="Longitude"
                                    name="longitude_coordinates"
                                    type="number"
                                    value={formData.longitude_coordinates}
                                    onChange={handleInputChange}
                                    icon={<BiCurrentLocation />}
                                    error={errors.longitude_coordinates}
                                    step="0.000001"
                                    min="-180"
                                    max="180"
                                />
                            </div>

                            {/* Map integration suggestion */}
                            <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <div className="flex items-start">
                                    <div className="text-blue-500 mr-3 mt-1">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-blue-800">
                                            Tip: Use Map for Coordinates
                                        </h4>
                                        <p className="text-sm text-blue-600">
                                            For accurate coordinates, consider
                                            using a map selector to pinpoint the
                                            exact location.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Additional Details Tab */}
                    {activeTab === "details" && (
                        <div className="space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField
                                    label="Position Title"
                                    name="position_title"
                                    value={formData.position_title}
                                    onChange={handleInputChange}
                                    icon={<MdTitle />}
                                    error={errors.position_title}
                                />
                                <InputField
                                    label="Head Full Name"
                                    name="head_full_name"
                                    value={formData.head_full_name}
                                    onChange={handleInputChange}
                                    icon={<FaUser />}
                                    error={errors.head_full_name}
                                />
                                <InputField
                                    label="Land Area (hectares)"
                                    name="land_area_hectares"
                                    type="number"
                                    value={formData.land_area_hectares}
                                    onChange={handleInputChange}
                                    icon={<FaChartArea />}
                                    error={errors.land_area_hectares}
                                    step="0.01"
                                    min="0"
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-6 mt-6 border-t">
                        <button
                            type="button"
                            onClick={() => {
                                resetForm();
                                onClose();
                            }}
                            className="flex items-center bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
                        >
                            <MdClose className="mr-2" /> Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            <MdSave className="mr-2" /> Save Changes
                        </button>
                    </div>

                    {/* Error Summary */}
                    {Object.keys(errors).length > 0 && (
                        <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                            <h4 className="text-sm font-medium text-red-800 mb-1">
                                Please fix the following errors:
                            </h4>
                            <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
                                {Object.entries(errors).map(
                                    ([field, message]) => (
                                        <li key={field}>
                                            <button
                                                className="text-left hover:underline"
                                                onClick={() => {
                                                    // Determine which tab contains this field and switch to it
                                                    if (
                                                        [
                                                            "suc_name",
                                                            "institutional_code",
                                                            "campus_type",
                                                            "former_name",
                                                            "autonomous_code",
                                                            "year_first_operation",
                                                            "report_year",
                                                        ].includes(field)
                                                    ) {
                                                        setActiveTab("basic");
                                                    } else if (
                                                        [
                                                            "region_id",
                                                            "province_id",
                                                            "municipality_id",
                                                            "latitude_coordinates",
                                                            "longitude_coordinates",
                                                            "distance_from_main",
                                                        ].includes(field)
                                                    ) {
                                                        setActiveTab(
                                                            "location"
                                                        );
                                                    } else {
                                                        setActiveTab("details");
                                                    }

                                                    // Focus on the field (use setTimeout to ensure the tab switch is complete)
                                                    setTimeout(() => {
                                                        const element =
                                                            document.getElementById(
                                                                field
                                                            );
                                                        if (element)
                                                            element.focus();
                                                    }, 100);
                                                }}
                                            >
                                                {field
                                                    .replace(/_/g, " ")
                                                    .replace(/\b\w/g, (l) =>
                                                        l.toUpperCase()
                                                    )}
                                                : {message}
                                            </button>
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

EditCampusFormDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    campusData: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        institution_id: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        suc_name: PropTypes.string,
        campus_type: PropTypes.string,
        institutional_code: PropTypes.string,
        region_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        province_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        municipality_id: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        former_name: PropTypes.string,
        year_first_operation: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        land_area_hectares: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        distance_from_main: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        autonomous_code: PropTypes.string,
        position_title: PropTypes.string,
        head_full_name: PropTypes.string,
        latitude_coordinates: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        longitude_coordinates: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        report_year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        region: PropTypes.string,
        province_municipality: PropTypes.string,
    }),
    campusId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    setSnackbarOpen: PropTypes.func.isRequired,
    setSnackbarMessage: PropTypes.func.isRequired,
    setSnackbarSeverity: PropTypes.func.isRequired,

};

export default EditCampusFormDialog;
