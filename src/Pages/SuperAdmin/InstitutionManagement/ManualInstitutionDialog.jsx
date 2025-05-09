import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import config from "../../../utils/config";
import { X, Save } from "lucide-react";
import { useLoading } from "../../../Context/LoadingContext";
import useActivityLog from "../../../Hooks/useActivityLog";

function ManualInstitutionDialog({
    open,
    onClose,
    getInstitutionType,
    fetchInstitutions,
    setSnackbarOpen,
    setSnackbarMessage,
    setSnackbarSeverity,
}) {
    const { updateProgress } = useLoading();
    const { createLog } = useActivityLog();
    const [manualData, setManualData] = useState({
        institution_code: null, // required|integer|unique
        name: "", // required|string|max:255
        region: null, // required|integer|exists:regions,id
        address_street: "", // nullable|string|max:255
        municipality_city: null, // nullable|integer|exists:municipalities,id
        province: null, // nullable|integer|exists:provinces,id
        postal_code: "", // nullable|string|max:10
        institutional_telephone: "", // nullable|string|max:20
        institutional_fax: "", // nullable|string|max:20
        head_telephone: "", // nullable|string|max:20
        institutional_email: "", // nullable|string|max:255
        institutional_website: "", // nullable|string|max:255
        year_established: null, // nullable|integer
        sec_registration: "", // nullable|string|max:255
        year_granted_approved: null, // nullable|integer
        year_converted_college: null, // nullable|integer
        year_converted_university: null, // nullable|integer
        head_name: "", // nullable|string|max:255
        head_title: "", // nullable|string|max:255
        head_education: "", // nullable|string|max:255
        institution_type: "", // nullable|string|max:255
        report_year: null, // nullable|integer
    });
    const [formErrors, setFormErrors] = useState({});
    const [regions, setRegions] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [municipalities, setMunicipalities] = useState([]);

    useEffect(() => {
        if (open) fetchRegions();
    }, [open]);

    useEffect(() => {
        if (manualData.region) fetchProvinces(manualData.region);
        else {
            setProvinces([]);
            setMunicipalities([]);
            setManualData((prev) => ({
                ...prev,
                province: "",
                municipality_city: "",
            }));
        }
    }, [manualData.region]);

    useEffect(() => {
        if (manualData.province) fetchMunicipalities(manualData.province);
        else {
            setMunicipalities([]);
            setManualData((prev) => ({ ...prev, municipality_city: "" }));
        }
    }, [manualData.province]);

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

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "region") {
            setManualData((prev) => ({
                ...prev,
                region: value, // Store region id
                province: "",
                municipality_city: "",
            }));
            fetchProvinces(value);
        } else if (name === "province") {
            setManualData((prev) => ({
                ...prev,
                province: value, // Store province id
                municipality_city: "",
            }));
            fetchMunicipalities(value);
        } else if (name === "municipality_city") {
            setManualData((prev) => ({
                ...prev,
                municipality_city: value, // Store municipality id
            }));
        } else {
            setManualData((prev) => ({ ...prev, [name]: value }));
        }

        setFormErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleYearChange = (field, value) => {
        setManualData((prev) => ({
            ...prev,
            [field]: value ? Number(value) : null,
        }));
        setFormErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const resetForm = () => {
        setManualData({
            institution_code: null, // required|integer|unique
            name: "", // required|string|max:255
            region: null, // required|integer|exists:regions,id
            address_street: "", // nullable|string|max:255
            municipality_city: null, // nullable|integer|exists:municipalities,id
            province: null, // nullable|integer|exists:provinces,id
            postal_code: "", // nullable|string|max:10
            institutional_telephone: "", // nullable|string|max:20
            institutional_fax: "", // nullable|string|max:20
            head_telephone: "", // nullable|string|max:20
            institutional_email: "", // nullable|string|max:255
            institutional_website: "", // nullable|string|max:255
            year_established: null, // nullable|integer
            sec_registration: "", // nullable|string|max:255
            year_granted_approved: null, // nullable|integer
            year_converted_college: null, // nullable|integer
            year_converted_university: null, // nullable|integer
            head_name: "", // nullable|string|max:255
            head_title: "", // nullable|string|max:255
            head_education: "", // nullable|string|max:255
            institution_type: "", // nullable|string|max:255
            report_year: null, // nullable|integer
        });
        setFormErrors({});
        setProvinces([]);
        setMunicipalities([]);
    };

    const handleClose = () => {
        onClose();
        resetForm();
    };

    const validateForm = () => {
        const errors = [];
        const errorObj = {};

        if (!manualData.institution_code) {
            errorObj.institution_code = "Institution code is required.";
            errors.push("Institution code is required.");
        } else if (!Number.isInteger(Number(manualData.institution_code))) {
            errorObj.institution_code = "Institution code must be an integer.";
            errors.push("Institution code must be an integer.");
        }

        if (!manualData.name.trim()) {
            errorObj.name = "Name is required.";
            errors.push("Institution name is required.");
        } else if (manualData.name.length > 255) {
            errorObj.name = "Name must not exceed 255 characters.";
            errors.push("Institution name must not exceed 255 characters.");
        }

        if (!manualData.region) {
            errorObj.region = "Region is required.";
            errors.push("Region is required.");
        }

        if (manualData.postal_code && manualData.postal_code.length > 10) {
            errorObj.postal_code = "Postal code must not exceed 10 characters.";
            errors.push("Postal code must not exceed 10 characters.");
        }

        if (
            manualData.institutional_telephone &&
            manualData.institutional_telephone.length > 20
        ) {
            errorObj.institutional_telephone =
                "Institutional telephone must not exceed 20 characters.";
            errors.push(
                "Institutional telephone must not exceed 20 characters."
            );
        }

        if (
            manualData.institutional_fax &&
            manualData.institutional_fax.length > 20
        ) {
            errorObj.institutional_fax =
                "Institutional fax must not exceed 20 characters.";
            errors.push("Institutional fax must not exceed 20 characters.");
        }

        if (
            manualData.head_telephone &&
            manualData.head_telephone.length > 20
        ) {
            errorObj.head_telephone =
                "Head telephone must not exceed 20 characters.";
            errors.push("Head telephone must not exceed 20 characters.");
        }

        if (
            manualData.institutional_email &&
            manualData.institutional_email.length > 255
        ) {
            errorObj.institutional_email =
                "Institutional email must not exceed 255 characters.";
            errors.push("Institutional email must not exceed 255 characters.");
        }

        if (
            manualData.institutional_website &&
            manualData.institutional_website.length > 255
        ) {
            errorObj.institutional_website =
                "Institutional website must not exceed 255 characters.";
            errors.push(
                "Institutional website must not exceed 255 characters."
            );
        }

        if (
            manualData.sec_registration &&
            manualData.sec_registration.length > 255
        ) {
            errorObj.sec_registration =
                "SEC registration must not exceed 255 characters.";
            errors.push("SEC registration must not exceed 255 characters.");
        }

        if (manualData.head_name && manualData.head_name.length > 255) {
            errorObj.head_name = "Head name must not exceed 255 characters.";
            errors.push("Head name must not exceed 255 characters.");
        }

        if (manualData.head_title && manualData.head_title.length > 255) {
            errorObj.head_title = "Head title must not exceed 255 characters.";
            errors.push("Head title must not exceed 255 characters.");
        }

        if (
            manualData.head_education &&
            manualData.head_education.length > 255
        ) {
            errorObj.head_education =
                "Head education must not exceed 255 characters.";
            errors.push("Head education must not exceed 255 characters.");
        }

        if (
            manualData.institution_type &&
            manualData.institution_type.length > 255
        ) {
            errorObj.institution_type =
                "Institution type must not exceed 255 characters.";
            errors.push("Institution type must not exceed 255 characters.");
        }

        console.log("Validation errors:", errors);
        return { errors, errorObj };
    };

    const handleSave = async () => {
        const { errors, errorObj } = validateForm();
        if (errors.length > 0) {
            setFormErrors(errorObj);
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

        updateProgress(10);
        try {
            const token = localStorage.getItem("token");
            const payload = {
                ...manualData,
                institution_type:
                    manualData.institution_type || getInstitutionType(),
            };
            console.log("Saving institution with payload:", payload);

            const response = await axios.post(
                `${config.API_URL}/institutions`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            await createLog({
                action: "added_institution",
                description: `Manually added institution: ${payload.name}`,
                modelType: "App\\Models\\Institution",
                modelId: response.data.id,
                properties: payload,
            });

            fetchInstitutions();
            setSnackbarMessage("Institution added successfully!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            handleClose();
        } catch (error) {
            console.error("Error sending manual data to backend:", error);
            setSnackbarMessage("Error adding institution");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        } finally {
            updateProgress(100);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl">
                {/* Dialog Header */}
                <div className="flex items-center justify-between p-2 bg-gray-100 border-b border-gray-200">
                    <h2 className="text-base font-semibold text-gray-900">
                        Add Institution
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-full"
                        aria-label="Close dialog"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Dialog Content */}
                <div className="p-3 space-y-3">
                    {/* Basic Information */}
                    <div>
                        <h3 className="text-sm font-semibold text-blue-600 mb-2">
                            Basic Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div className="col-span-2">
                                <label
                                    htmlFor="name"
                                    className="block text-xs font-medium text-gray-700 mb-0.5"
                                >
                                    Institution Name *
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={manualData.name}
                                    onChange={handleChange}
                                    className={`w-full px-2 py-1 border ${
                                        formErrors.name
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    } rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <div>
                                <label
                                    htmlFor="institution_code"
                                    className="block text-xs font-medium text-gray-700 mb-0.5"
                                >
                                    Institution Code *
                                </label>
                                <input
                                    id="institution_code"
                                    name="institution_code"
                                    type="number"
                                    value={manualData.institution_code || ""}
                                    onChange={handleChange}
                                    className={`w-full px-2 py-1 border ${
                                        formErrors.institution_code
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    } rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="sec_registration"
                                    className="block text-xs font-medium text-gray-700 mb-0.5"
                                >
                                    SEC Registration
                                </label>
                                <input
                                    id="sec_registration"
                                    name="sec_registration"
                                    type="text"
                                    value={manualData.sec_registration}
                                    onChange={handleChange}
                                    className={`w-full px-2 py-1 border ${
                                        formErrors.sec_registration
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    } rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="institution_type"
                                    className="block text-xs font-medium text-gray-700 mb-0.5"
                                >
                                    Institution Type *
                                </label>
                                <select
                                    id="institution_type"
                                    name="institution_type"
                                    value={manualData.institution_type}
                                    onChange={handleChange}
                                    className={`w-full px-2 py-1 border ${
                                        formErrors.institution_type
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    } rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                >
                                    <option value="">Select Type</option>
                                    <option value="SUC">SUC</option>
                                    <option value="LUC">LUC</option>
                                    <option value="Private">Private</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-200" />

                    {/* Address Information */}
                    <div>
                        <h3 className="text-sm font-semibold text-blue-600 mb-2">
                            Address Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                            <div className="col-span-2 lg:col-span-4">
                                <label
                                    htmlFor="address_street"
                                    className="block text-xs font-medium text-gray-700 mb-0.5"
                                >
                                    Street Address
                                </label>
                                <input
                                    id="address_street"
                                    name="address_street"
                                    type="text"
                                    value={manualData.address_street}
                                    onChange={handleChange}
                                    className={`w-full px-2 py-1 border ${
                                        formErrors.address_street
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    } rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                            </div>
                            {/* Region Select */}
                            <div>
                                <label
                                    htmlFor="region"
                                    className="block text-xs font-medium text-gray-700 mb-0.5"
                                >
                                    Region *
                                </label>
                                <select
                                    id="region"
                                    name="region"
                                    value={manualData.region} // Bind to region id
                                    onChange={handleChange}
                                    className={`w-full px-2 py-1 border ${
                                        formErrors.region
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    } rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                >
                                    <option value="">Select Region</option>
                                    {regions.map((region) => (
                                        <option
                                            key={region.id}
                                            value={region.id}
                                        >
                                            {region.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* Province Select */}
                            <div>
                                <label
                                    htmlFor="province"
                                    className="block text-xs font-medium text-gray-700 mb-0.5"
                                >
                                    Province *
                                </label>
                                <select
                                    id="province"
                                    name="province"
                                    value={manualData.province} // Bind to province id
                                    onChange={handleChange}
                                    disabled={!manualData.region}
                                    className={`w-full px-2 py-1 border ${
                                        formErrors.province
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    } rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100`}
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

                            {/* Municipality/City Select */}
                            <div>
                                <label
                                    htmlFor="municipality_city"
                                    className="block text-xs font-medium text-gray-700 mb-0.5"
                                >
                                    Municipality/City *
                                </label>
                                <select
                                    id="municipality_city"
                                    name="municipality_city"
                                    value={manualData.municipality_city} // Bind to municipality id
                                    onChange={handleChange}
                                    disabled={!manualData.province}
                                    className={`w-full px-2 py-1 border ${
                                        formErrors.municipality_city
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    } rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100`}
                                >
                                    <option value="">
                                        Select Municipality/City
                                    </option>
                                    {municipalities.map((m) => (
                                        <option key={m.id} value={m.id}>
                                            {m.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label
                                    htmlFor="postal_code"
                                    className="block text-xs font-medium text-gray-700 mb-0.5"
                                >
                                    Postal Code
                                </label>
                                <input
                                    id="postal_code"
                                    name="postal_code"
                                    type="text"
                                    value={manualData.postal_code}
                                    onChange={handleChange}
                                    className={`w-full px-2 py-1 border ${
                                        formErrors.postal_code
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    } rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-200" />

                    {/* Contact Information */}
                    <div>
                        <h3 className="text-sm font-semibold text-blue-600 mb-2">
                            Contact Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                                <label
                                    htmlFor="institutional_telephone"
                                    className="block text-xs font-medium text-gray-700 mb-0.5"
                                >
                                    Institutional Telephone
                                </label>
                                <input
                                    id="institutional_telephone"
                                    name="institutional_telephone"
                                    type="text"
                                    value={manualData.institutional_telephone}
                                    onChange={handleChange}
                                    className={`w-full px-2 py-1 border ${
                                        formErrors.institutional_telephone
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    } rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="institutional_fax"
                                    className="block text-xs font-medium text-gray-700 mb-0.5"
                                >
                                    Institutional Fax
                                </label>
                                <input
                                    id="institutional_fax"
                                    name="institutional_fax"
                                    type="text"
                                    value={manualData.institutional_fax}
                                    onChange={handleChange}
                                    className={`w-full px-2 py-1 border ${
                                        formErrors.institutional_fax
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    } rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="institutional_email"
                                    className="block text-xs font-medium text-gray-700 mb-0.5"
                                >
                                    Institutional Email
                                </label>
                                <input
                                    id="institutional_email"
                                    name="institutional_email"
                                    type="email"
                                    value={manualData.institutional_email}
                                    onChange={handleChange}
                                    className={`w-full px-2 py-1 border ${
                                        formErrors.institutional_email
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    } rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="institutional_website"
                                    className="block text-xs font-medium text-gray-700 mb-0.5"
                                >
                                    Institutional Website
                                </label>
                                <input
                                    id="institutional_website"
                                    name="institutional_website"
                                    type="text"
                                    value={manualData.institutional_website}
                                    onChange={handleChange}
                                    className={`w-full px-2 py-1 border ${
                                        formErrors.institutional_website
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    } rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-200" />

                    {/* Head of Institution */}
                    <div>
                        <h3 className="text-sm font-semibold text-blue-600 mb-2">
                            Head of Institution
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                                <label
                                    htmlFor="head_name"
                                    className="block text-xs font-medium text-gray-700 mb-0.5"
                                >
                                    Head Name
                                </label>
                                <input
                                    id="head_name"
                                    name="head_name"
                                    type="text"
                                    value={manualData.head_name}
                                    onChange={handleChange}
                                    className={`w-full px-2 py-1 border ${
                                        formErrors.head_name
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    } rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="head_telephone"
                                    className="block text-xs font-medium text-gray-700 mb-0.5"
                                >
                                    Head Telephone
                                </label>
                                <input
                                    id="head_telephone"
                                    name="head_telephone"
                                    type="text"
                                    value={manualData.head_telephone}
                                    onChange={handleChange}
                                    className={`w-full px-2 py-1 border ${
                                        formErrors.head_telephone
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    } rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="head_title"
                                    className="block text-xs font-medium text-gray-700 mb-0.5"
                                >
                                    Head Title
                                </label>
                                <input
                                    id="head_title"
                                    name="head_title"
                                    type="text"
                                    value={manualData.head_title}
                                    onChange={handleChange}
                                    className={`w-full px-2 py-1 border ${
                                        formErrors.head_title
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    } rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="head_education"
                                    className="block text-xs font-medium text-gray-700 mb-0.5"
                                >
                                    Head Education
                                </label>
                                <input
                                    id="head_education"
                                    name="head_education"
                                    type="text"
                                    value={manualData.head_education}
                                    onChange={handleChange}
                                    className={`w-full px-2 py-1 border ${
                                        formErrors.head_education
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    } rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-200" />

                    {/* Historical Dates */}
                    <div>
                        <h3 className="text-sm font-semibold text-blue-600 mb-2">
                            Historical Dates
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                            <div>
                                <label
                                    htmlFor="year_established"
                                    className="block text-xs font-medium text-gray-700 mb-0.5"
                                >
                                    Year Established
                                </label>
                                <input
                                    id="year_established"
                                    name="year_established"
                                    type="number"
                                    value={manualData.year_established || ""}
                                    onChange={(e) =>
                                        handleYearChange(
                                            "year_established",
                                            e.target.value
                                        )
                                    }
                                    min="1900"
                                    max={new Date().getFullYear()}
                                    className={`w-full px-2 py-1 border ${
                                        formErrors.year_established
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    } rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="year_granted_approved"
                                    className="block text-xs font-medium text-gray-700 mb-0.5"
                                >
                                    Year Approved
                                </label>
                                <input
                                    id="year_granted_approved"
                                    name="year_granted_approved"
                                    type="number"
                                    value={
                                        manualData.year_granted_approved || ""
                                    }
                                    onChange={(e) =>
                                        handleYearChange(
                                            "year_granted_approved",
                                            e.target.value
                                        )
                                    }
                                    min="1900"
                                    max={new Date().getFullYear()}
                                    className={`w-full px-2 py-1 border ${
                                        formErrors.year_granted_approved
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    } rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="year_converted_college"
                                    className="block text-xs font-medium text-gray-700 mb-0.5"
                                >
                                    Year → College
                                </label>
                                <input
                                    id="year_converted_college"
                                    name="year_converted_college"
                                    type="number"
                                    value={
                                        manualData.year_converted_college || ""
                                    }
                                    onChange={(e) =>
                                        handleYearChange(
                                            "year_converted_college",
                                            e.target.value
                                        )
                                    }
                                    min="1900"
                                    max={new Date().getFullYear()}
                                    className={`w-full px-2 py-1 border ${
                                        formErrors.year_converted_college
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    } rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="year_converted_university"
                                    className="block text-xs font-medium text-gray-700 mb-0.5"
                                >
                                    Year → University
                                </label>
                                <input
                                    id="year_converted_university"
                                    name="year_converted_university"
                                    type="number"
                                    value={
                                        manualData.year_converted_university ||
                                        ""
                                    }
                                    onChange={(e) =>
                                        handleYearChange(
                                            "year_converted_university",
                                            e.target.value
                                        )
                                    }
                                    min="1900"
                                    max={new Date().getFullYear()}
                                    className={`w-full px-2 py-1 border ${
                                        formErrors.year_converted_university
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    } rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dialog Footer */}
                <div className="flex justify-end space-x-1 p-2 border-t border-gray-200">
                    <button
                        onClick={handleClose}
                        className="px-3 py-1 border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-50 flex items-center"
                    >
                        <X className="w-3 h-3 mr-1" />
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-600 flex items-center"
                    >
                        <Save className="w-3 h-3 mr-1" />
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

ManualInstitutionDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    getInstitutionType: PropTypes.func.isRequired,
    fetchInstitutions: PropTypes.func.isRequired,
    setSnackbarOpen: PropTypes.func.isRequired,
    setSnackbarMessage: PropTypes.func.isRequired,
    setSnackbarSeverity: PropTypes.func.isRequired,
};

export default ManualInstitutionDialog;
