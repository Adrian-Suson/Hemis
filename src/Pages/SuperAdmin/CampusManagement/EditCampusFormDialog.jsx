/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useParams } from "react-router-dom";
import { decryptId } from "../../../utils/encryption";
import config from "../../../utils/config";
import useLocationData from "../../../utils/useLocationData";
import { useLoading } from "../../../Context/LoadingContext";
import FormInput from "../../../Components/FormInput";
import YearPicker from "../../../Components/YearPicker";
import AlertComponent from "../../../Components/AlertComponent"; // Import AlertComponent
import useActivityLog from "../../../Hooks/useActivityLog"; // Import the hook

const EditCampusFormDialog = ({
    open,
    onClose,
    campusData,
    campusId,
    fetchCampuses,
}) => {
    const { showLoading, hideLoading } = useLoading();
    const { createLog } = useActivityLog(); // Use the hook
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

    const [campus, setCampuses] = useState({
        institution_id: decryptedInstitutionId || "",
        suc_name: "",
        campus_type: "",
        institutional_code: "",
        region: "",
        province_municipality: "",
        former_name: "",
        year_first_operation: "",
        land_area_hectares: "",
        distance_from_main: "",
        autonomous_code: "",
        position_title: "",
        head_full_name: "",
        latitude_coordinates: "",
        longitude_coordinates: "",
    });
    const [errors, setErrors] = useState({});
    const [selectedProvince, setSelectedProvince] = useState("");
    const currentYear = 2025;

    // Initialize form with campusData
    useEffect(() => {
        if (campusData) {
            const provinceMunicipality =
                campusData.province && campusData.municipality
                    ? `${campusData.province}, ${campusData.municipality}`
                    : "";
            setCampuses({
                institution_id: campusData.institution_id
                    ? String(campusData.institution_id)
                    : decryptedInstitutionId || "",
                suc_name: campusData.suc_name || "",
                campus_type: campusData.campus_type || "",
                institutional_code: campusData.institutional_code || "",
                region: campusData.region || "",
                province_municipality: provinceMunicipality,
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
            });
            setSelectedProvince(campusData.province || "");
        }
    }, [campusData, decryptedInstitutionId]);

    // Fetch regions when dialog opens
    useEffect(() => {
        if (open) {
            fetchRegions();
        }
    }, [open]);

    // Fetch provinces when region is selected
    useEffect(() => {
        if (campus.region) {
            fetchProvinces(
                regions.find((r) => r.name === campus.region)?.id || ""
            );
        }
    }, [campus.region]);

    // Fetch municipalities when province is selected
    useEffect(() => {
        if (selectedProvince) {
            fetchMunicipalities(
                provinces.find((p) => p.name === selectedProvince)?.id || ""
            );
        }
    }, [selectedProvince]);

    const validateForm = () => {
        const newErrors = {};

        // Required fields
        if (!campus.institution_id) {
            newErrors.institution_id = "Institution ID is required.";
        }
        if (!campus.suc_name.trim()) {
            newErrors.suc_name = "Campus name is required.";
        }
        if (!campus.campus_type) {
            newErrors.campus_type = "Campus type is required.";
        }
        if (!campus.institutional_code.trim()) {
            newErrors.institutional_code = "Institutional code is required.";
        }

        // Optional fields (region, province, municipality can be nullable)
        if (campus.region && campus.region.length > 255) {
            newErrors.region = "Region must be 255 characters or less.";
        }
        if (
            campus.province_municipality &&
            campus.province_municipality.length > 255
        ) {
            newErrors.province_municipality =
                "Province and Municipality must be 255 characters or less.";
        }

        // Optional string fields
        const optionalStrings = [
            "former_name",
            "autonomous_code",
            "position_title",
            "head_full_name",
        ];
        optionalStrings.forEach((field) => {
            if (campus[field] && campus[field].length > 255) {
                newErrors[field] = "Must be 255 characters or less.";
            }
        });

        // Year validation
        if (campus.year_first_operation) {
            const year = parseInt(campus.year_first_operation, 10);
            if (isNaN(year)) {
                newErrors.year_first_operation = "Must be a valid year.";
            } else if (year < 1800) {
                newErrors.year_first_operation = "Year must be 1800 or later.";
            } else if (year > currentYear) {
                newErrors.year_first_operation =
                    "Year cannot be in the future.";
            }
        }

        // Numeric fields
        if (campus.land_area_hectares !== "") {
            const value = parseFloat(campus.land_area_hectares);
            if (isNaN(value)) {
                newErrors.land_area_hectares = "Must be a valid number.";
            } else if (value < 0) {
                newErrors.land_area_hectares = "Must be 0 or greater.";
            }
        }

        if (campus.distance_from_main !== "") {
            const value = parseFloat(campus.distance_from_main);
            if (isNaN(value)) {
                newErrors.distance_from_main = "Must be a valid number.";
            } else if (value < 0) {
                newErrors.distance_from_main = "Must be 0 or greater.";
            }
        }

        // Coordinates
        if (campus.latitude_coordinates !== "") {
            const value = parseFloat(campus.latitude_coordinates);
            if (isNaN(value)) {
                newErrors.latitude_coordinates = "Must be a valid number.";
            } else if (value < -90 || value > 90) {
                newErrors.latitude_coordinates = "Must be between -90 and 90.";
            }
        }

        if (campus.longitude_coordinates !== "") {
            const value = parseFloat(campus.longitude_coordinates);
            if (isNaN(value)) {
                newErrors.longitude_coordinates = "Must be a valid number.";
            } else if (value < -180 || value > 180) {
                newErrors.longitude_coordinates =
                    "Must be between -180 and 180.";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCampuses((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleYearChange = (e) => {
        const value = e.target.value;
        setCampuses((prev) => ({
            ...prev,
            year_first_operation: value,
        }));
        if (errors.year_first_operation) {
            setErrors((prev) => ({ ...prev, year_first_operation: undefined }));
        }
    };

    const resetForm = () => {
        setCampuses({
            institution_id: decryptedInstitutionId || "",
            suc_name: "",
            campus_type: "",
            institutional_code: "",
            region: "",
            province_municipality: "",
            former_name: "",
            year_first_operation: "",
            land_area_hectares: "",
            distance_from_main: "",
            autonomous_code: "",
            position_title: "",
            head_full_name: "",
            latitude_coordinates: "",
            longitude_coordinates: "",
        });
        setSelectedProvince("");
        setErrors({});
    };

    const handleEditCampus = async () => {
        if (!validateForm()) {
            console.log("[Edit Campus] Validation failed:", errors);
            AlertComponent.showAlert(
                "Please check the form for errors.",
                "error"
            );
            return;
        }
        showLoading();
        const token = localStorage.getItem("token");
        try {
            const yearValue = campus.year_first_operation
                ? parseInt(campus.year_first_operation, 10)
                : null;

            const payload = {
                institution_id: parseInt(campus.institution_id, 10),
                suc_name: campus.suc_name || null,
                campus_type: campus.campus_type || null,
                institutional_code: campus.institutional_code || null,
                region: campus.region || null, // Nullable
                province_municipality: campus.province_municipality || null, // Nullable
                former_name: campus.former_name || null,
                year_first_operation: yearValue,
                land_area_hectares: campus.land_area_hectares
                    ? parseFloat(campus.land_area_hectares)
                    : null,
                distance_from_main: campus.distance_from_main
                    ? parseFloat(campus.distance_from_main)
                    : null,
                autonomous_code: campus.autonomous_code || null,
                position_title: campus.position_title || null,
                head_full_name: campus.head_full_name || null,
                latitude_coordinates: campus.latitude_coordinates
                    ? parseFloat(campus.latitude_coordinates)
                    : null,
                longitude_coordinates: campus.longitude_coordinates
                    ? parseFloat(campus.longitude_coordinates)
                    : null,
            };

            console.log("[Edit Campus] Sending data:", payload);
            hideLoading();
            const response = await axios.put(
                `${config.API_URL}/campuses/${campusId}`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("[Edit Campus] Server response:", response.data);
            AlertComponent.showAlert("Campus updated successfully!", "success");

            // Log the activity
            await createLog({
                action: "Edit Campus",
                description: `Edited campus: ${campus.suc_name}`,
            });

            fetchCampuses();
            resetForm();
            onClose();
        } catch (error) {
            console.error("[Edit Campus] Error:", error);
            let errorMessage = "Failed to update campus. Please try again.";
            if (error.response && error.response.status === 422) {
                const validationErrors = error.response.data.errors;
                console.log(
                    "[Edit Campus] Validation Errors:",
                    validationErrors
                );
                errorMessage =
                    "Validation failed: " +
                    Object.values(validationErrors).flat().join(", ");
            }
            AlertComponent.showAlert(errorMessage, "error");
            hideLoading();
        }
    };

    return (
        <div
            className={`fixed inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300 z-50 ${
                open ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
        >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
                {/* Dialog Header */}
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Edit Campus
                    </h2>
                </div>

                {/* Dialog Content */}
                <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1">
                        {/* Campus Name */}
                        <div className="col-span-1 sm:col-span-2 md:col-span-4">
                            <FormInput
                                id="suc_name"
                                name="suc_name"
                                label="Campus Name"
                                type="text"
                                value={campus.suc_name}
                                onChange={handleInputChange}
                                errorMessage={errors.suc_name}
                                required
                            />
                        </div>

                        {/* Institutional Code */}
                        <div className="col-span-2">
                            <FormInput
                                id="institutional_code"
                                name="institutional_code"
                                label="Code"
                                type="text"
                                value={campus.institutional_code}
                                onChange={handleInputChange}
                                errorMessage={errors.institutional_code}
                                required
                            />
                        </div>

                        {/* Campus Type */}
                        <div className="col-span-2">
                            <FormInput
                                id="campus_type"
                                name="campus_type"
                                label="Type"
                                type="select"
                                value={campus.campus_type}
                                onChange={handleInputChange}
                                errorMessage={errors.campus_type}
                                required
                                options={[
                                    { value: "MAIN", label: "MAIN" },
                                    { value: "Satellite", label: "Satellite" },
                                ]}
                            />
                        </div>

                        {/* Former Name */}
                        <div className="col-span-1 sm:col-span-2 md:col-span-4">
                            <FormInput
                                id="former_name"
                                name="former_name"
                                label="Former Name"
                                type="text"
                                value={campus.former_name}
                                onChange={handleInputChange}
                                errorMessage={errors.former_name}
                            />
                        </div>

                        {/* Region Selection */}
                        <div className="max-w-md">
                            <FormInput
                                id="region"
                                name="region"
                                label="Region"
                                type="select"
                                value={campus.region}
                                onChange={(e) => {
                                    setCampuses((prev) => ({
                                        ...prev,
                                        region: e.target.value,
                                        province_municipality: "",
                                    }));
                                    setSelectedProvince("");
                                    if (errors.region) {
                                        setErrors((prev) => ({
                                            ...prev,
                                            region: undefined,
                                        }));
                                    }
                                }}
                                errorMessage={errors.region}
                                options={[
                                    ...regions.map((region) => ({
                                        value: region.name,
                                        label: region.name,
                                        key: region.id,
                                    })),
                                ]}
                            />
                        </div>

                        {/* Province Selection */}
                        <div className="max-w-md">
                            <FormInput
                                id="province"
                                name="province"
                                label="Province"
                                type="select"
                                value={selectedProvince}
                                onChange={(e) => {
                                    setSelectedProvince(e.target.value);
                                    setCampuses((prev) => ({
                                        ...prev,
                                        province_municipality: "",
                                    }));
                                    if (errors.province_municipality) {
                                        setErrors((prev) => ({
                                            ...prev,
                                            province_municipality: undefined,
                                        }));
                                    }
                                }}
                                errorMessage={errors.province_municipality}
                                disabled={!campus.region}
                                options={[
                                    ...provinces.map((province) => ({
                                        value: province.name,
                                        label: province.name,
                                        key: province.id,
                                    })),
                                ]}
                            />
                        </div>

                        {/* Municipality Selection */}
                        <div className="max-w-md">
                            <FormInput
                                id="municipality"
                                name="municipality"
                                label="Municipality"
                                type="select"
                                value={
                                    campus.province_municipality
                                        ? campus.province_municipality.split(
                                              ", "
                                          )[1] || ""
                                        : ""
                                }
                                onChange={(e) => {
                                    const municipalityName = e.target.value;
                                    const provinceName = selectedProvince;
                                    const combined =
                                        provinceName && municipalityName
                                            ? `${provinceName}, ${municipalityName}`
                                            : "";
                                    setCampuses((prev) => ({
                                        ...prev,
                                        province_municipality: combined,
                                    }));
                                    if (errors.province_municipality) {
                                        setErrors((prev) => ({
                                            ...prev,
                                            province_municipality: undefined,
                                        }));
                                    }
                                }}
                                errorMessage={errors.province_municipality}
                                disabled={!selectedProvince}
                                options={[
                                    ...municipalities.map((municipality) => ({
                                        value: municipality.name,
                                        label: municipality.name,
                                        key: municipality.id,
                                    })),
                                ]}
                            />
                        </div>

                        {/* Year Established */}
                        <div className="max-w-md">
                            <YearPicker
                                label="Established"
                                name="year_first_operation"
                                value={campus.year_first_operation}
                                onChange={handleYearChange}
                                error={errors.year_first_operation}
                                minYear={1800}
                                maxYear={currentYear}
                            />
                        </div>

                        {/* Head Name */}
                        <div className="col-span-1 sm:col-span-2 md:col-span-4">
                            <FormInput
                                id="head_full_name"
                                name="head_full_name"
                                label="Head"
                                type="text"
                                value={campus.head_full_name}
                                onChange={handleInputChange}
                                errorMessage={errors.head_full_name}
                            />
                        </div>

                        {/* Autonomous Code */}
                        <div className="col-span-2">
                            <FormInput
                                id="autonomous_code"
                                name="autonomous_code"
                                label="Auto Code"
                                type="text"
                                value={campus.autonomous_code}
                                onChange={handleInputChange}
                                errorMessage={errors.autonomous_code}
                            />
                        </div>

                        {/* Position Title */}
                        <div className="col-span-2">
                            <FormInput
                                id="position_title"
                                name="position_title"
                                label="Position"
                                type="text"
                                value={campus.position_title}
                                onChange={handleInputChange}
                                errorMessage={errors.position_title}
                            />
                        </div>
                        {/* Land Area */}
                        <div className="col-span-1">
                            <FormInput
                                id="land_area_hectares"
                                name="land_area_hectares"
                                label="Land Area (ha)"
                                type="number"
                                value={campus.land_area_hectares}
                                onChange={handleInputChange}
                                errorMessage={errors.land_area_hectares}
                                inputProps={{ min: 0, step: 0.01 }}
                            />
                        </div>

                        {/* Distance from Main */}
                        <div className="col-span-1">
                            <FormInput
                                id="distance_from_main"
                                name="distance_from_main"
                                label="Distance from Main (km)"
                                type="number"
                                value={campus.distance_from_main}
                                onChange={handleInputChange}
                                errorMessage={errors.distance_from_main}
                                inputProps={{ min: 0, step: 0.01 }}
                            />
                        </div>

                        {/* Latitude */}
                        <div className="col-span-1">
                            <FormInput
                                id="latitude_coordinates"
                                name="latitude_coordinates"
                                label="Latitude"
                                type="number"
                                value={campus.latitude_coordinates}
                                onChange={handleInputChange}
                                errorMessage={errors.latitude_coordinates}
                                inputProps={{
                                    min: -90,
                                    max: 90,
                                    step: 0.000001,
                                }}
                            />
                        </div>

                        {/* Longitude */}
                        <div className="col-span-1">
                            <FormInput
                                id="longitude_coordinates"
                                name="longitude_coordinates"
                                label="Longitude"
                                type="number"
                                value={campus.longitude_coordinates}
                                onChange={handleInputChange}
                                errorMessage={errors.longitude_coordinates}
                                inputProps={{
                                    min: -180,
                                    max: 180,
                                    step: 0.000001,
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Dialog Footer */}
                <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                    <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={handleEditCampus}
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

EditCampusFormDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    campusData: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        institution_id: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        suc_name: PropTypes.string,
        campus_type: PropTypes.string,
        institutional_code: PropTypes.string,
        region: PropTypes.string,
        province: PropTypes.string,
        municipality: PropTypes.string,
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
    }),
    campusId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    setSnackbarOpen: PropTypes.func.isRequired,
    setSnackbarMessage: PropTypes.func.isRequired,
    setSnackbarSeverity: PropTypes.func.isRequired,
    fetchCampuses: PropTypes.func, // Add refreshCampuses to prop types
};

export default EditCampusFormDialog;
