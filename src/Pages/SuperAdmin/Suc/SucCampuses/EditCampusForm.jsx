import { useState, useEffect } from "react";
import {
    Building2,
    MapPin,
    User,
    Calendar,
    Hash,
    Save,
    Edit,
} from "lucide-react";
import PropTypes from "prop-types";
import Dialog from "../../../../Components/Dialog";

const headTitleMapping = {
    "01": "President",
    "02": "Chancellor",
    "03": "Executive Director",
    "04": "Dean",
    "05": "Rector",
    "06": "Head",
    "07": "Administrator",
    "08": "Principal",
    "09": "Managing Director",
    "10": "Director",
    "11": "Chair",
    "12": "Others",
    "99": "Not known or not indicated",
};

const autonomousMapping = {
    "1": "CAMPUS IS AUTONOMOUS FROM THE SUC MAIN CAMPUS",
    "2": "CAMPUS IS NOT AUTONOMOUS FROM MAIN CAMPUS",
    "3": "NO INFORMATION ON THE MATTER",
};

function EditCampusForm({ isOpen, onClose, onSave, campusData, loading = false }) {
    const [formData, setFormData] = useState({
        name: "",
        campus_type: "SATELLITE",
        institutional_code: "",
        province_municipality: "",
        region: "",
        latitude: "",
        longitude: "",
        head_full_name: "",
        position_title: "",
        year_first_operation: "",
        land_area_hectares: "",
        distance_from_main: "",
        autonomous_code: "",
        former_campus_name: "",
    });

    const [errors, setErrors] = useState({});

    // Populate form when campusData changes
    useEffect(() => {
        if (campusData) {
            setFormData({
                name: campusData.name || "",
                campus_type: campusData.campus_type || "SATELLITE",
                institutional_code: campusData.institutional_code || "",
                province_municipality: campusData.province_municipality || "",
                region: campusData.region || "",
                latitude: campusData.latitude ? campusData.latitude.toString() : "",
                longitude: campusData.longitude ? campusData.longitude.toString() : "",
                head_full_name: campusData.head_full_name || "",
                position_title: campusData.position_title || "",
                year_first_operation: campusData.year_first_operation ? campusData.year_first_operation.toString() : "",
                land_area_hectares: campusData.land_area_hectares ? campusData.land_area_hectares.toString() : "",
                distance_from_main: campusData.distance_from_main ? campusData.distance_from_main.toString() : "",
                autonomous_code: campusData.autonomous_code || "",
                former_campus_name: campusData.former_campus_name || "",
            });
        }
    }, [campusData]);

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: "",
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Required fields
        if (!formData.name.trim()) {
            newErrors.name = "Campus name is required";
        }
        if (!formData.campus_type) {
            newErrors.campus_type = "Campus type is required";
        }
        if (!formData.province_municipality.trim()) {
            newErrors.province_municipality = "Province/Municipality is required";
        }
        if (!formData.region.trim()) {
            newErrors.region = "Region is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            const updatedCampusData = {
                ...formData,
                id: campusData.id,
                latitude: formData.latitude ? parseFloat(formData.latitude) : null,
                longitude: formData.longitude ? parseFloat(formData.longitude) : null,
                year_first_operation: formData.year_first_operation ? parseInt(formData.year_first_operation) : null,
                land_area_hectares: formData.land_area_hectares ? parseFloat(formData.land_area_hectares) : null,
                distance_from_main: formData.distance_from_main ? parseFloat(formData.distance_from_main) : null,
            };
            onSave(updatedCampusData);
        }
    };

    const handleClose = () => {
        setErrors({});
        onClose();
    };

    const sortedHeadTitleMapping = Object.entries(headTitleMapping)
        .sort(([keyB], [keyA]) => parseInt(keyB) - parseInt(keyA)); // Sort by key in descending order

    return (
        <Dialog
            isOpen={isOpen}
            onClose={handleClose}
            title={`Edit ${campusData?.name || "Campus"}`}
            subtitle="Update campus information and details"
            icon={Edit}
            variant="default"
            size="lg"
        >
            <div className="space-y-4 p-4">
                {/* Basic Information */}
                <div className="bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-100 rounded-xl p-4 border border-blue-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-blue-500 rounded-lg shadow-sm">
                            <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">Basic Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Campus Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                placeholder="Enter campus name"
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                                    errors.name ? "border-red-300 bg-red-50" : "border-gray-300"
                                }`}
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Campus Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.campus_type}
                                onChange={(e) => handleInputChange("campus_type", e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                                    errors.campus_type ? "border-red-300 bg-red-50" : "border-gray-300"
                                }`}
                            >
                                <option value="MAIN">Main Campus</option>
                                <option value="SATELLITE">Satellite Campus</option>
                            </select>
                            {errors.campus_type && <p className="text-red-500 text-xs mt-1">{errors.campus_type}</p>}
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Institutional Code
                            </label>
                            <input
                                type="text"
                                value={formData.institutional_code}
                                onChange={(e) => handleInputChange("institutional_code", e.target.value)}
                                placeholder="Enter institutional code"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                            />
                        </div>
                    </div>
                </div>

                {/* Location & Leadership Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Location Information */}
                    <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 rounded-xl p-4 border border-emerald-200/60 shadow-sm">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-emerald-500 rounded-lg shadow-sm">
                                <MapPin className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">Location</h3>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Province/Municipality <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.province_municipality}
                                    onChange={(e) => handleInputChange("province_municipality", e.target.value)}
                                    placeholder="Enter province/municipality"
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 ${
                                        errors.province_municipality ? "border-red-300 bg-red-50" : "border-gray-300"
                                    }`}
                                />
                                {errors.province_municipality && <p className="text-red-500 text-xs mt-1">{errors.province_municipality}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Region <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.region}
                                    onChange={(e) => handleInputChange("region", e.target.value)}
                                    placeholder="Enter region"
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 ${
                                        errors.region ? "border-red-300 bg-red-50" : "border-gray-300"
                                    }`}
                                />
                                {errors.region && <p className="text-red-500 text-xs mt-1">{errors.region}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Latitude
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={formData.latitude}
                                        onChange={(e) => handleInputChange("latitude", e.target.value)}
                                        placeholder="0.000000"
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 ${
                                            errors.latitude ? "border-red-300 bg-red-50" : "border-gray-300"
                                        }`}
                                    />
                                    {errors.latitude && <p className="text-red-500 text-xs mt-1">{errors.latitude}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Longitude
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={formData.longitude}
                                        onChange={(e) => handleInputChange("longitude", e.target.value)}
                                        placeholder="0.000000"
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 ${
                                            errors.longitude ? "border-red-300 bg-red-50" : "border-gray-300"
                                        }`}
                                    />
                                    {errors.longitude && <p className="text-red-500 text-xs mt-1">{errors.longitude}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Leadership Information */}
                    <div className="bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-100 rounded-xl p-4 border border-purple-200/60 shadow-sm">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-purple-500 rounded-lg shadow-sm">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">Leadership</h3>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Campus Head
                                </label>
                                <input
                                    type="text"
                                    value={formData.head_full_name}
                                    onChange={(e) => handleInputChange("head_full_name", e.target.value)}
                                    placeholder="Enter full name"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Position/Title
                                </label>
                                <select
                                    value={formData.position_title}
                                    onChange={(e) => handleInputChange("position_title", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                                >
                                    <option value="">Select Position</option>
                                    {sortedHeadTitleMapping.map(([key, value]) => (
                                        <option key={key} value={key}>
                                            {value}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Operations & Additional Info Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Operations Information */}
                    <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 rounded-xl p-4 border border-amber-200/60 shadow-sm">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-amber-500 rounded-lg shadow-sm">
                                <Calendar className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">Operations</h3>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Year First Operation
                                </label>
                                <input
                                    type="number"
                                    value={formData.year_first_operation}
                                    onChange={(e) => handleInputChange("year_first_operation", e.target.value)}
                                    placeholder="e.g. 2020"
                                    min="1800"
                                    max={new Date().getFullYear()}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200 ${
                                        errors.year_first_operation ? "border-red-300 bg-red-50" : "border-gray-300"
                                    }`}
                                />
                                {errors.year_first_operation && <p className="text-red-500 text-xs mt-1">{errors.year_first_operation}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Land Area (hectares)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.land_area_hectares}
                                    onChange={(e) => handleInputChange("land_area_hectares", e.target.value)}
                                    placeholder="e.g. 10.5"
                                    min="0"
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200 ${
                                        errors.land_area_hectares ? "border-red-300 bg-red-50" : "border-gray-300"
                                    }`}
                                />
                                {errors.land_area_hectares && <p className="text-red-500 text-xs mt-1">{errors.land_area_hectares}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Additional Details */}
                    <div className="bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 rounded-xl p-4 border border-slate-200/60 shadow-sm">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-slate-600 rounded-lg shadow-sm">
                                <Hash className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">Additional Info</h3>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Distance from Main (km)
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={formData.distance_from_main}
                                    onChange={(e) => handleInputChange("distance_from_main", e.target.value)}
                                    placeholder="e.g. 15.5"
                                    min="0"
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors duration-200 ${
                                        errors.distance_from_main ? "border-red-300 bg-red-50" : "border-gray-300"
                                    }`}
                                />
                                {errors.distance_from_main && <p className="text-red-500 text-xs mt-1">{errors.distance_from_main}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Autonomous Code
                                </label>
                                <select
                                    value={formData.autonomous_code}
                                    onChange={(e) => handleInputChange("autonomous_code", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors duration-200"
                                >
                                    <option value="">Select Autonomous Code</option>
                                    {Object.entries(autonomousMapping).map(([key, value]) => (
                                        <option key={key} value={key}>
                                            {value}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Former Campus Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.former_campus_name}
                                    onChange={(e) => handleInputChange("former_campus_name", e.target.value)}
                                    placeholder="Enter former name (if any)"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors duration-200"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                        onClick={handleClose}
                        disabled={loading}
                        className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Updating...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Update Campus
                            </>
                        )}
                    </button>
                </div>
            </div>
        </Dialog>
    );
}

EditCampusForm.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    campusData: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        name: PropTypes.string,
        campus_type: PropTypes.string,
        institutional_code: PropTypes.string,
        province_municipality: PropTypes.string,
        region: PropTypes.string,
        latitude: PropTypes.number,
        longitude: PropTypes.number,
        head_full_name: PropTypes.string,
        position_title: PropTypes.string,
        year_first_operation: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        land_area_hectares: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        distance_from_main: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        autonomous_code: PropTypes.string,
        former_campus_name: PropTypes.string,
    }),
    loading: PropTypes.bool,
};

export default EditCampusForm;
