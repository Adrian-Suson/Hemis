/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import AlertComponent from "../../../Components/AlertComponent"; // Import AlertComponent
import { useLoading } from "../../../Context/LoadingContext";
import { useParams } from "react-router-dom";
import { decryptId } from "../../../utils/encryption";
import config from "../../../utils/config";
import useLocationData from "../../../utils/useLocationData";
import FormInput from "../../../Components/FormInput";
import YearPicker from "../../../Components/YearPicker";
import useActivityLog from "../../../Hooks/useActivityLog"; // Import the hook

const AddCampusDialog = ({ open, onClose, onAddCampus }) => {
    const { updateProgress, hideLoading } = useLoading();
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
    const { createLog } = useActivityLog(); // Use the hook

    const [newCampus, setNewCampus] = useState({
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
    const [selectedProvince, setSelectedProvince] = useState(""); // Track province for municipality dropdown

    const currentYear = new Date().getFullYear();

    // Fetch regions when dialog opens
    useEffect(() => {
        if (open) {
            fetchRegions();
        }
    }, [open]);

    // Fetch provinces when region is selected
    useEffect(() => {
        if (newCampus.region) {
            fetchProvinces(
                regions.find((r) => r.name === newCampus.region)?.id || ""
            );
        }
    }, [newCampus.region]);

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
        if (!newCampus.institution_id) {
            newErrors.institution_id = "Institution ID is required.";
        }
        if (!newCampus.suc_name.trim()) {
            newErrors.suc_name = "Campus name is required.";
        }
        if (!newCampus.campus_type) {
            newErrors.campus_type = "Campus type is required.";
        }
        if (!newCampus.institutional_code.trim()) {
            newErrors.institutional_code = "Institutional code is required.";
        }

        // Optional fields (region, province, municipality can be nullable)
        if (newCampus.region && newCampus.region.length > 255) {
            newErrors.region = "Region must be 255 characters or less.";
        }
        if (
            newCampus.province_municipality &&
            newCampus.province_municipality.length > 255
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
            if (newCampus[field] && newCampus[field].length > 255) {
                newErrors[field] = "Must be 255 characters or less.";
            }
        });

        // Year validation
        if (newCampus.year_first_operation) {
            const year = parseInt(newCampus.year_first_operation, 10);
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
        if (newCampus.land_area_hectares !== "") {
            const value = parseFloat(newCampus.land_area_hectares);
            if (isNaN(value)) {
                newErrors.land_area_hectares = "Must be a valid number.";
            } else if (value < 0) {
                newErrors.land_area_hectares = "Must be 0 or greater.";
            }
        }

        if (newCampus.distance_from_main !== "") {
            const value = parseFloat(newCampus.distance_from_main);
            if (isNaN(value)) {
                newErrors.distance_from_main = "Must be a valid number.";
            } else if (value < 0) {
                newErrors.distance_from_main = "Must be 0 or greater.";
            }
        }

        // Coordinates
        if (newCampus.latitude_coordinates !== "") {
            const value = parseFloat(newCampus.latitude_coordinates);
            if (isNaN(value)) {
                newErrors.latitude_coordinates = "Must be a valid number.";
            } else if (value < -90 || value > 90) {
                newErrors.latitude_coordinates = "Must be between -90 and 90.";
            }
        }

        if (newCampus.longitude_coordinates !== "") {
            const value = parseFloat(newCampus.longitude_coordinates);
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
        setNewCampus((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleYearChange = (e) => {
        const value = e.target.value;
        setNewCampus((prev) => ({
            ...prev,
            year_first_operation: value,
        }));
        if (errors.year_first_operation) {
            setErrors((prev) => ({ ...prev, year_first_operation: undefined }));
        }
    };

    const resetForm = () => {
        setNewCampus({
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

    const handleAddCampus = async () => {
        if (!validateForm()) {
            console.log("[Add Campus] Validation failed:", errors);
            AlertComponent.showAlert(
                "Please check the form for errors.",
                "error"
            );
            return;
        }
        updateProgress(30);
        const token = localStorage.getItem("token");
        try {
            const yearValue = newCampus.year_first_operation
                ? parseInt(newCampus.year_first_operation, 10)
                : null;

            const payload = {
                institution_id: parseInt(newCampus.institution_id, 10),
                suc_name: newCampus.suc_name || null,
                campus_type: newCampus.campus_type || null,
                institutional_code: newCampus.institutional_code || null,
                region: newCampus.region || null, // Nullable
                province_municipality: newCampus.province_municipality || null, // Nullable
                former_name: newCampus.former_name || null,
                year_first_operation: yearValue,
                land_area_hectares: newCampus.land_area_hectares
                    ? parseFloat(newCampus.land_area_hectares)
                    : null,
                distance_from_main: newCampus.distance_from_main
                    ? parseFloat(newCampus.distance_from_main)
                    : null,
                autonomous_code: newCampus.autonomous_code || null,
                position_title: newCampus.position_title || null,
                head_full_name: newCampus.head_full_name || null,
                latitude_coordinates: newCampus.latitude_coordinates
                    ? parseFloat(newCampus.latitude_coordinates)
                    : null,
                longitude_coordinates: newCampus.longitude_coordinates
                    ? parseFloat(newCampus.longitude_coordinates)
                    : null,
            };
            updateProgress(50);
            console.log("[Add Campus] Sending data:", [payload]);

            const response = await axios.post(
                `${config.API_URL}/campuses`,
                [payload],
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("[Add Campus] Server response:", response.data);

            const newCampusData = response.data.data || { id: Date.now() };
            onAddCampus({ ...payload, id: newCampusData.id });

            await createLog({
                action: "Add Campus",
                description: `Added a new campus: ${payload.suc_name}`,
            });

            updateProgress(100);
            hideLoading();
            AlertComponent.showAlert("Campus added successfully!", "success");

            resetForm();
            onClose();
        } catch (error) {
            console.error("[Add Campus] Error:", error);
            let errorMessage = "Failed to add campus. Please try again.";
            if (error.response && error.response.status === 422) {
                const validationErrors = error.response.data.errors;
                console.log(
                    "[Add Campus] Validation Errors:",
                    validationErrors
                );
                errorMessage =
                    "Validation failed: " +
                    Object.values(validationErrors).flat().join(", ");
            }

            AlertComponent.showAlert(errorMessage, "error");
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
                        Add New Campus
                    </h2>
                </div>

                {/* Dialog Content */}
                <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {/* Campus Name */}
                        <div className="col-span-1 sm:col-span-2 md:col-span-4">
                            <FormInput
                                id="suc_name"
                                name="suc_name"
                                label="Campus Name"
                                type="text"
                                value={newCampus.suc_name}
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
                                value={newCampus.institutional_code}
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
                                value={newCampus.campus_type}
                                onChange={handleInputChange}
                                errorMessage={errors.campus_type}
                                required
                                options={[
                                    { value: "", label: "Select Type" },
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
                                value={newCampus.former_name}
                                onChange={handleInputChange}
                                errorMessage={errors.former_name}
                            />
                        </div>

                        {/* Region Selection */}
                        <div className="col-span-1">
                            <FormInput
                                id="region"
                                name="region"
                                label="Region"
                                type="autocomplete"
                                value={newCampus.region}
                                onChange={(e) => {
                                    setNewCampus((prev) => ({
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
                                    { value: "", label: "Select Region" },
                                    ...regions.map((region) => ({
                                        value: region.name,
                                        label: region.name,
                                        key: region.id,
                                    })),
                                ]}
                            />
                        </div>

                        {/* Province Selection */}
                        <div className="col-span-1">
                            <FormInput
                                id="province"
                                name="province"
                                label="Province"
                                type="autocomplete"
                                value={selectedProvince}
                                onChange={(e) => {
                                    setSelectedProvince(e.target.value);
                                    setNewCampus((prev) => ({
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
                                disabled={!newCampus.region}
                                options={[
                                    { value: "", label: "Select Province" },
                                    ...provinces.map((province) => ({
                                        value: province.name,
                                        label: province.name,
                                        key: province.id,
                                    })),
                                ]}
                            />
                        </div>

                        {/* Municipality Selection */}
                        <div className="col-span-1">
                            <FormInput
                                id="municipality"
                                name="municipality"
                                label="Municipality"
                                type="autocomplete"
                                value={
                                    newCampus.province_municipality
                                        ? newCampus.province_municipality.split(
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
                                    setNewCampus((prev) => ({
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
                                    { value: "", label: "Select Municipality" },
                                    ...municipalities.map((municipality) => ({
                                        value: municipality.name,
                                        label: municipality.name,
                                        key: municipality.id,
                                    })),
                                ]}
                            />
                        </div>

                        {/* Year Established */}
                        <div className="col-span-1">
                            <YearPicker
                                label="Established"
                                name="year_first_operation"
                                value={newCampus.year_first_operation}
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
                                value={newCampus.head_full_name}
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
                                value={newCampus.autonomous_code}
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
                                value={newCampus.position_title}
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
                                value={newCampus.land_area_hectares}
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
                                value={newCampus.distance_from_main}
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
                                value={newCampus.latitude_coordinates}
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
                                value={newCampus.longitude_coordinates}
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
                        onClick={handleAddCampus}
                    >
                        Add Campus
                    </button>
                </div>
            </div>
        </div>
    );
};

AddCampusDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onAddCampus: PropTypes.func.isRequired,
    initialRegion: PropTypes.string,
};

export default AddCampusDialog;
