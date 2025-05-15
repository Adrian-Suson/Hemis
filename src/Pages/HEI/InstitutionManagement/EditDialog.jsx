import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { X, Save, Calendar } from "lucide-react";
import axios from "axios";
import useActivityLog from "../../../Hooks/useActivityLog";
import useLocationData from "../../../utils/useLocationData";
import config from "../../../utils/config";
import AlertComponent from "../../../Components/AlertComponent";

const EditDialog = ({
    open,
    onClose,
    institution,
    onEdit,
    fetchInstitutions,
}) => {
    const { createLog } = useActivityLog();
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [openDatePicker, setOpenDatePicker] = useState(null);
    const {
        regions,
        provinces,
        municipalities,
        fetchRegions,
        fetchProvinces,
        fetchMunicipalities,
    } = useLocationData();

    useEffect(() => {
        if (open && institution) {
            setFormData({
                id: institution.id || null,
                uuid: institution.uuid || "",
                name: institution.name || "",
                region: institution.region || "",
                address_street: institution.address_street || "",
                municipality: institution.municipality || "",
                province: institution.province || "",
                postal_code: institution.postal_code || "",
                institutional_telephone:
                    institution.institutional_telephone || "",
                institutional_fax: institution.institutional_fax || "",
                head_telephone: institution.head_telephone || "",
                institutional_email: institution.institutional_email || "",
                institutional_website: institution.institutional_website || "",
                year_established: institution.year_established || null,
                sec_registration: institution.sec_registration || "",
                year_granted_approved:
                    institution.year_granted_approved || null,
                year_converted_college:
                    institution.year_converted_college || null,
                year_converted_university:
                    institution.year_converted_university || null,
                head_name: institution.head_name || "",
                head_title: institution.head_title || "",
                head_education: institution.head_education || "",
                institution_type: institution.institution_type || "",
            });
            setErrors({});
        }
    }, [open, institution]);

    useEffect(() => {
        if (open && institution) {
            fetchRegions(); // Fetch regions only when the dialog opens
        }
    }, [open, institution, fetchRegions]);

    useEffect(() => {
        if (formData.region && regions.length > 0) {
            const regionObj = regions.find((r) => r.name === formData.region);
            if (regionObj) {
                fetchProvinces(regionObj.id); // Fetch provinces only when region changes
            }
        }
    }, [formData.region, regions, fetchProvinces]);

    useEffect(() => {
        if (formData.province && provinces.length > 0) {
            const provinceObj = provinces.find(
                (p) => p.name === formData.province
            );
            if (provinceObj) {
                fetchMunicipalities(provinceObj.id); // Fetch municipalities only when province changes
            }
        }
    }, [formData.province, provinces, fetchMunicipalities]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                openDatePicker &&
                !event.target.closest(".year-picker-container")
            ) {
                setOpenDatePicker(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openDatePicker]);


    const validateForm = () => {
        const newErrors = {};

        if (!formData.name?.trim()) {
            newErrors.name = "Institution name is required";
        }

        if (!formData.region?.trim()) {
            newErrors.region = "Region is required";
        }

        if (!formData.province?.trim()) {
            newErrors.province = "Province is required";
        }

        if (!formData.municipality?.trim()) {
            newErrors.municipality = "Municipality is required";
        }

        if (
            formData.institutional_email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.institutional_email)
        ) {
            newErrors.institutional_email = "Must be a valid email";
        }

        if (
            formData.institutional_website &&
            !/^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/.test(
                formData.institutional_website
            )
        ) {
            newErrors.institutional_website = "Must be a valid URL";
        }

        const currentYear = new Date().getFullYear();
        const yearFields = [
            "year_established",
            "year_granted_approved",
            "year_converted_college",
            "year_converted_university",
        ];

        yearFields.forEach((field) => {
            if (formData[field]) {
                const year = parseInt(formData[field], 10);
                if (isNaN(year) || year < 1800 || year > currentYear) {
                    newErrors[
                        field
                    ] = `Must be between 1800 and ${currentYear}`;
                }
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSelectChange = (
        name,
        value,
        options,
        idKey = "id",
        nameKey = "name"
    ) => {
        if (!value) {
            if (name === "region") {
                setFormData((prev) => ({
                    ...prev,
                    region: "",
                    province: "",
                    municipality: "",
                }));
            } else if (name === "province") {
                setFormData((prev) => ({
                    ...prev,
                    province: "",
                    municipality: "",
                }));
            } else if (name === "municipality") {
                setFormData((prev) => ({
                    ...prev,
                    municipality: "",
                }));
            }

            if (errors[name]) {
                setErrors((prev) => ({ ...prev, [name]: undefined }));
            }
            return;
        }

        const selectedOption = options.find(
            (opt) => opt[idKey].toString() === value.toString()
        );
        if (!selectedOption) {
            console.warn(
                `Option with ID ${value} not found in options for ${name}`
            );
            return;
        }

        if (name === "region") {
            setFormData((prev) => ({
                ...prev,
                region: selectedOption[nameKey],
                province: "",
                municipality: "",
            }));
            fetchProvinces(selectedOption[idKey]);
        } else if (name === "province") {
            setFormData((prev) => ({
                ...prev,
                province: selectedOption[nameKey],
                municipality: "",
            }));
            fetchMunicipalities(selectedOption[idKey]);
        } else if (name === "municipality") {
            setFormData((prev) => ({
                ...prev,
                municipality: selectedOption[nameKey],
            }));
        }

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleYearChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value || null,
        }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
        setOpenDatePicker(null);
    };

    const toggleYearPicker = (field) => {
        if (openDatePicker === field) {
            setOpenDatePicker(null);
        } else {
            setOpenDatePicker(field);
        }
    };

    const generateYearOptions = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let year = currentYear; year >= 1800; year--) {
            years.push(year);
        }
        return years;
    };

    const handleUpdate = async () => {
        if (!validateForm()) {
            AlertComponent.showAlert(
                "Please fix the validation errors",
                "error"
            );
            return;
        }

        if (!formData.uuid) {
            AlertComponent.showAlert("Institution UUID is missing", "error");
            return;
        }

        const token = localStorage.getItem("token");
        try {
            const payload = {
                uuid: formData.uuid,
                name: formData.name,
                region_id:
                    regions.find((r) => r.name === formData.region)?.id || null,
                province_id:
                    provinces.find((p) => p.name === formData.province)?.id ||
                    null,
                municipality_id:
                    municipalities.find((m) => m.name === formData.municipality)
                        ?.id || null,
                address_street: formData.address_street || null,
                postal_code: formData.postal_code || null,
                institutional_telephone:
                    formData.institutional_telephone || null,
                institutional_fax: formData.institutional_fax || null,
                head_telephone: formData.head_telephone || null,
                institutional_email: formData.institutional_email || null,
                institutional_website: formData.institutional_website || null,
                year_established: formData.year_established
                    ? parseInt(formData.year_established, 10)
                    : null,
                sec_registration: formData.sec_registration || null,
                year_granted_approved: formData.year_granted_approved
                    ? parseInt(formData.year_granted_approved, 10)
                    : null,
                year_converted_college: formData.year_converted_college
                    ? parseInt(formData.year_converted_college, 10)
                    : null,
                year_converted_university: formData.year_converted_university
                    ? parseInt(formData.year_converted_university, 10)
                    : null,
                head_name: formData.head_name || null,
                head_title: formData.head_title || null,
                head_education: formData.head_education || null,
                institution_type: formData.institution_type || null,
            };

            console.log("Payload to update:", JSON.stringify(payload, null, 2));

            const response = await axios.put(
                `${config.API_URL}/institutions/${formData.id}`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            await createLog({
                action: "updated_institution",
                description: `Updated institution: ${formData.name}`,
                modelType: "App\\Models\\Institution",
                modelId: formData.id,
                properties: {
                    name: formData.name,
                    institution_type: formData.institution_type,
                },
            });

            onEdit(response.data || payload);
            AlertComponent.showAlert(
                "Institution updated successfully",
                "success"
            );
            fetchInstitutions();
            onClose();
        } catch (error) {
            let errorMessage = "Failed to update institution";

            if (error.response?.status === 422) {
                const validationErrors = error.response.data.errors;
                const mappedErrors = {};

                Object.keys(validationErrors).forEach((key) => {
                    const field = key.split(".").pop();
                    mappedErrors[field] = validationErrors[key][0];
                });

                setErrors(mappedErrors);
                errorMessage =
                    "Validation failed: " +
                    Object.values(validationErrors).flat().join(", ");
            } else {
                console.error(
                    "Update error:",
                    error.response?.data || error.message
                );
            }

            AlertComponent.showAlert(errorMessage, "error");
        }
    };

    if (!open || !institution) return null;

    const getLocationId = (name, collection) => {
        if (!name || !collection || !collection.length) return "";
        const item = collection.find((i) => i.name === name);
        return item ? item.id.toString() : "";
    };

    const formattedField = (label, field, type = "text", options = []) => {
        const error = errors[field];

        return (
            <div className="mb-3">
                <label
                    htmlFor={field}
                    className="block text-xs font-medium text-gray-700 mb-1"
                >
                    {label}
                </label>
                {type === "text" && (
                    <input
                        type="text"
                        id={field}
                        name={field}
                        value={formData[field] || ""}
                        onChange={handleInputChange}
                        className={`w-full px-2 py-1 text-sm border ${
                            error ? "border-red-500" : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    />
                )}
                {type === "select" && (
                    <select
                        id={field}
                        name={field}
                        value={
                            field === "region"
                                ? getLocationId(formData.region, regions)
                                : field === "province"
                                ? getLocationId(formData.province, provinces)
                                : field === "municipality"
                                ? getLocationId(
                                      formData.municipality,
                                      municipalities
                                  )
                                : formData[field] || ""
                        }
                        onChange={(e) => {
                            if (
                                ["region", "province", "municipality"].includes(
                                    field
                                )
                            ) {
                                handleSelectChange(
                                    field,
                                    e.target.value,
                                    field === "region"
                                        ? regions
                                        : field === "province"
                                        ? provinces
                                        : municipalities
                                );
                            } else {
                                handleInputChange(e);
                            }
                        }}
                        disabled={
                            (field === "province" && !formData.region) ||
                            (field === "municipality" && !formData.province)
                        }
                        className={`w-full px-2 py-1 text-sm border ${
                            error ? "border-red-500" : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    >
                        <option value="">Select {label}</option>
                        {options.map((option) => (
                            <option
                                key={option.id || option.value}
                                value={option.id || option.value}
                            >
                                {option.name || option.label}
                            </option>
                        ))}
                    </select>
                )}
                {type === "year" && (
                    <div className="relative year-picker-container">
                        <div
                            className={`w-full px-2 py-1 text-sm border ${
                                error ? "border-red-500" : "border-gray-300"
                            } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 flex justify-between items-center cursor-pointer`}
                            onClick={() => toggleYearPicker(field)}
                        >
                            <span>{formData[field] || "Select year"}</span>
                            <Calendar className="w-4 h-4 text-gray-500" />
                        </div>
                        {openDatePicker === field && (
                            <div className="absolute z-10 bottom-full mb-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                                <div className="p-1">
                                    <button
                                        className="w-full text-left p-1 text-xs text-gray-500 hover:bg-gray-100 rounded"
                                        onClick={() =>
                                            handleYearChange(field, "")
                                        }
                                    >
                                        Clear
                                    </button>
                                    {generateYearOptions().map((year) => (
                                        <button
                                            key={year}
                                            className={`w-full text-left p-1 text-sm hover:bg-gray-100 rounded ${
                                                parseInt(
                                                    formData[field],
                                                    10
                                                ) === year
                                                    ? "bg-blue-100"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                handleYearChange(
                                                    field,
                                                    year.toString()
                                                )
                                            }
                                        >
                                            {year}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {error && (
                            <p className="mt-1 text-xs text-red-500">{error}</p>
                        )}
                    </div>
                )}
                {error && type !== "year" && (
                    <p className="mt-1 text-xs text-red-500">{error}</p>
                )}
            </div>
        );
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => {
                setOpenDatePicker(null);
                onClose();
            }}
        >
            <div
                className="w-full max-w-4xl bg-white rounded-lg shadow-xl"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-labelledby="edit-institution-dialog"
            >
                <div className="flex justify-between items-center bg-blue-600 text-white p-2 rounded-t-lg">
                    <h2
                        id="edit-institution-dialog"
                        className="text-lg font-semibold pl-2"
                    >
                        Edit Institution: {institution.name}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-white hover:bg-white/10 rounded-full"
                        aria-label="Close dialog"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <div className="p-4 bg-gray-50 max-h-[70vh] overflow-y-auto">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="mb-4">
                            <h3 className="text-sm font-semibold text-blue-600 mb-2">
                                Basic Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-1">
                                    {formattedField("Institution Name", "name")}
                                </div>
                                <div className="md:col-span-1">
                                    {formattedField(
                                        "SEC Registration",
                                        "sec_registration"
                                    )}
                                </div>
                                <div className="md:col-span-1">
                                    {formattedField(
                                        "Institution Type",
                                        "institution_type",
                                        "select",
                                        [
                                            { id: "SUC", name: "SUC" },
                                            { id: "LUC", name: "LUC" },
                                            { id: "Private", name: "Private" },
                                        ]
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-gray-200 my-3"></div>
                        <div className="mb-4">
                            <h3 className="text-sm font-semibold text-blue-600 mb-2">
                                Address Information
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="col-span-1">
                                    {formattedField(
                                        "Street Address",
                                        "address_street"
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div>
                                        {formattedField(
                                            "Region",
                                            "region",
                                            "select",
                                            regions
                                        )}
                                    </div>
                                    <div>
                                        {formattedField(
                                            "Province",
                                            "province",
                                            "select",
                                            provinces
                                        )}
                                    </div>
                                    <div>
                                        {formattedField(
                                            "Municipality/City",
                                            "municipality",
                                            "select",
                                            municipalities
                                        )}
                                    </div>
                                    <div>
                                        {formattedField(
                                            "Postal Code",
                                            "postal_code"
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-gray-200 my-3"></div>
                        <div className="mb-4">
                            <h3 className="text-sm font-semibold text-blue-600 mb-2">
                                Contact Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    {formattedField(
                                        "Institutional Telephone",
                                        "institutional_telephone"
                                    )}
                                </div>
                                <div>
                                    {formattedField(
                                        "Institutional Fax",
                                        "institutional_fax"
                                    )}
                                </div>
                                <div>
                                    {formattedField(
                                        "Institutional Email",
                                        "institutional_email"
                                    )}
                                </div>
                                <div>
                                    {formattedField(
                                        "Institutional Website",
                                        "institutional_website"
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-gray-200 my-3"></div>
                        <div className="mb-4">
                            <h3 className="text-sm font-semibold text-blue-600 mb-2">
                                Head of Institution
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    {formattedField("Head Name", "head_name")}
                                </div>
                                <div>
                                    {formattedField(
                                        "Head Telephone",
                                        "head_telephone"
                                    )}
                                </div>
                                <div>
                                    {formattedField("Head Title", "head_title")}
                                </div>
                                <div>
                                    {formattedField(
                                        "Head Education",
                                        "head_education"
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-gray-200 my-3"></div>
                        <div>
                            <h3 className="text-sm font-semibold text-blue-600 mb-2">
                                Historical Dates
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    {formattedField(
                                        "Year Established",
                                        "year_established",
                                        "year"
                                    )}
                                </div>
                                <div>
                                    {formattedField(
                                        "Year Approved",
                                        "year_granted_approved",
                                        "year"
                                    )}
                                </div>
                                <div>
                                    {formattedField(
                                        "Year → College",
                                        "year_converted_college",
                                        "year"
                                    )}
                                </div>
                                <div>
                                    {formattedField(
                                        "Year → University",
                                        "year_converted_university",
                                        "year"
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end p-3 bg-gray-100 border-t border-gray-200 rounded-b-lg">
                    <button
                        onClick={onClose}
                        className="px-3 py-1 mr-2 bg-gray-200 text-gray-800 rounded-md text-xs font-medium hover:bg-gray-300 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpdate}
                        className="px-3 py-1 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700 transition-colors flex items-center"
                        disabled={!formData.name || !formData.region}
                    >
                        <Save className="w-3 h-3 mr-1" /> Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

EditDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    institution: PropTypes.shape({
        id: PropTypes.number.isRequired,
        uuid: PropTypes.string,
        name: PropTypes.string,
        region: PropTypes.string,
        address_street: PropTypes.string,
        municipality: PropTypes.string,
        province: PropTypes.string,
        postal_code: PropTypes.string,
        institutional_telephone: PropTypes.string,
        institutional_fax: PropTypes.string,
        head_telephone: PropTypes.string,
        institutional_email: PropTypes.string,
        institutional_website: PropTypes.string,
        year_established: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        sec_registration: PropTypes.string,
        year_granted_approved: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        year_converted_college: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        year_converted_university: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        head_name: PropTypes.string,
        head_title: PropTypes.string,
        head_education: PropTypes.string,
        institution_type: PropTypes.string,
    }),
    onEdit: PropTypes.func.isRequired,
    setSnackbarOpen: PropTypes.func,
    setSnackbarMessage: PropTypes.func,
    setSnackbarSeverity: PropTypes.func,
    fetchInstitutions: PropTypes.func,
};

EditDialog.defaultProps = {
    institution: null,
    fetchInstitutions: () => {},
};

export default EditDialog;
