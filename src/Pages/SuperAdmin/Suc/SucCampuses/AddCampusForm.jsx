import { useState } from "react";
import {
    Building2,
    MapPin,
    User,
    Calendar,
    Hash,
    Save,
    Plus,
} from "lucide-react";
import PropTypes from "prop-types";
import Dialog from "../../../../Components/Dialog";

function AddCampusForm({ isOpen, onClose, onSave, institutionId, loading = false }) {
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

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ""
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

        // Validate numeric fields
        if (formData.latitude && (isNaN(formData.latitude) || formData.latitude < -90 || formData.latitude > 90)) {
            newErrors.latitude = "Latitude must be between -90 and 90";
        }
        if (formData.longitude && (isNaN(formData.longitude) || formData.longitude < -180 || formData.longitude > 180)) {
            newErrors.longitude = "Longitude must be between -180 and 180";
        }
        if (formData.year_first_operation && (isNaN(formData.year_first_operation) || formData.year_first_operation < 1800 || formData.year_first_operation > new Date().getFullYear())) {
            newErrors.year_first_operation = "Please enter a valid year";
        }
        if (formData.land_area_hectares && (isNaN(formData.land_area_hectares) || formData.land_area_hectares < 0)) {
            newErrors.land_area_hectares = "Land area must be a positive number";
        }
        if (formData.distance_from_main && (isNaN(formData.distance_from_main) || formData.distance_from_main < 0)) {
            newErrors.distance_from_main = "Distance must be a positive number";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            const campusData = {
                ...formData,
                suc_details_id: institutionId,
                // Convert numeric fields
                latitude: formData.latitude ? parseFloat(formData.latitude) : null,
                longitude: formData.longitude ? parseFloat(formData.longitude) : null,
                year_first_operation: formData.year_first_operation ? parseInt(formData.year_first_operation) : null,
                land_area_hectares: formData.land_area_hectares ? parseFloat(formData.land_area_hectares) : null,
                distance_from_main: formData.distance_from_main ? parseFloat(formData.distance_from_main) : null,
            };
            onSave(campusData);
        }
    };

    const handleClose = () => {
        setFormData({
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
        setErrors({});
        onClose();
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={handleClose}
            title="Add New Campus"
            subtitle="Create a new campus for the institution"
            icon={Plus}
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
                                <input
                                    type="text"
                                    value={formData.position_title}
                                    onChange={(e) => handleInputChange("position_title", e.target.value)}
                                    placeholder="Enter position/title"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                                />
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
                                <input
                                    type="text"
                                    value={formData.autonomous_code}
                                    onChange={(e) => handleInputChange("autonomous_code", e.target.value)}
                                    placeholder="Enter autonomous code"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors duration-200"
                                />
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
                        className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Creating...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Create Campus
                            </>
                        )}
                    </button>
                </div>
            </div>
        </Dialog>
    );
}

AddCampusForm.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    institutionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    loading: PropTypes.bool,
};

export default AddCampusForm;
