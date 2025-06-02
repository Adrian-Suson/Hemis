import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import config from "../../../utils/config";
import Dialog from "../../../Components/Dialog";
import {
    User,
    Mail,
    Lock,
    Shield,
    Building,
    UserCheck,
    Save,
    Plus,
    Search,
    X,
} from "lucide-react";

const AddUserForm = ({ isOpen, onClose, onSave, loading }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "hei-staff",
        status: "active",
        hei_uiid: "",
    });
    const [errors, setErrors] = useState({});
    const [heiOptions, setHeiOptions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showHeiDropdown, setShowHeiDropdown] = useState(false);
    const heiDropdownRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            fetchHeiOptions();
        }
    }, [isOpen]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (heiDropdownRef.current && !heiDropdownRef.current.contains(event.target)) {
                setShowHeiDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const fetchHeiOptions = async () => {
        try {
            const response = await axios.get(`${config.API_URL}/heis`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    Accept: "application/json",
                },
            });
            const options = response.data?.data || response.data || [];
            setHeiOptions(Array.isArray(options) ? options : []);
        } catch (err) {
            console.error("Error fetching HEI options:", err);
            setHeiOptions([]);
        }
    };

    const handleHeiSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setShowHeiDropdown(true);
    };

    const handleHeiSelect = (hei) => {
        setFormData(prev => ({
            ...prev,
            hei_uiid: hei.uiid
        }));
        setSearchTerm(hei.name);
        setShowHeiDropdown(false);
    };

    const clearHeiSelection = () => {
        setFormData(prev => ({
            ...prev,
            hei_uiid: ""
        }));
        setSearchTerm("");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email format is invalid";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }

        if (formData.password !== formData.password_confirmation) {
            newErrors.password_confirmation = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        await onSave(formData);

        // Reset form
        setFormData({
            name: "",
            email: "",
            password: "",
            password_confirmation: "",
            role: "hei-staff",
            status: "active",
            hei_uiid: "",
        });
        setErrors({});
    };

    const handleClose = () => {
        setFormData({
            name: "",
            email: "",
            password: "",
            password_confirmation: "",
            role: "hei-staff",
            status: "active",
            hei_uiid: "",
        });
        setErrors({});
        onClose();
    };

    // Replace the HEI select element with this new autocomplete component
    const renderHeiAutocomplete = () => {
        const filteredHeis = heiOptions.filter(hei => 
            hei.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            hei.type?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    
        return (
            <div className="relative" ref={heiDropdownRef}>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                    Associated Institution (Optional)
                </label>
                <div className="relative">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleHeiSearch}
                            onFocus={() => setShowHeiDropdown(true)}
                            placeholder="Search for an institution..."
                            className="w-full pl-9 pr-9 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                        />
                        {formData.hei_uiid && (
                            <button
                                type="button"
                                onClick={clearHeiSelection}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                    {showHeiDropdown && (
                        <>
                            {/* Backdrop */}
                            <div 
                                className="fixed inset-0 z-40" 
                                onClick={() => setShowHeiDropdown(false)} 
                            />
                            {/* Dropdown with smart positioning */}
                            <div 
                                className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-xl"
                                style={{
                                    top: '100%',
                                    marginTop: '4px',
                                    maxHeight: '200px',
                                    overflowY: 'auto'
                                }}
                            >
                                {filteredHeis.length > 0 ? (
                                    <div className="py-1">
                                        {filteredHeis.map(hei => (
                                            <button
                                                key={hei.uiid}
                                                type="button"
                                                onClick={() => handleHeiSelect(hei)}
                                                className="w-full px-4 py-2 text-left hover:bg-amber-50 focus:bg-amber-50 focus:outline-none transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                                            >
                                                <div className="font-medium text-sm text-gray-900 truncate">
                                                    {hei.name}
                                                </div>
                                                {hei.type && (
                                                    <div className="text-xs text-gray-500 truncate">
                                                        {hei.type}
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                        {searchTerm ? 'No institutions found' : 'Start typing to search...'}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
                <p className="text-xs text-gray-600 mt-1">
                    Leave blank if the user is not associated with any specific institution
                </p>
            </div>
        );
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={handleClose}
            title="Add New User"
            subtitle="Create a new user account with appropriate permissions"
            icon={Plus}
            variant="default"
            size="lg"
        >
            <form
                onSubmit={handleSubmit}
                className="space-y-3 max-h-[600px] overflow-y-auto p-4"
            >
                {/* Personal Information */}
                <div className="bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-100 rounded-xl p-3 border border-blue-200/60 shadow-sm">
                    <div className="flex items-center space-x-2 mb-2">
                        <div className="p-1.5 bg-blue-500 rounded-lg shadow-sm">
                            <User className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900">
                            Personal Information
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Full Name{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter full name"
                                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                                    errors.name
                                        ? "border-red-300 bg-red-50"
                                        : "border-gray-300"
                                }`}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                <Mail className="w-3 h-3 inline mr-1" />
                                Email Address{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email address"
                                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                                    errors.email
                                        ? "border-red-300 bg-red-50"
                                        : "border-gray-300"
                                }`}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.email}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Security Information */}
                <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 rounded-xl p-3 border border-emerald-200/60 shadow-sm">
                    <div className="flex items-center space-x-2 mb-2">
                        <div className="p-1.5 bg-emerald-500 rounded-lg shadow-sm">
                            <Lock className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900">
                            Security Information
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter password (min. 8 characters)"
                                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 ${
                                    errors.password
                                        ? "border-red-300 bg-red-50"
                                        : "border-gray-300"
                                }`}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Confirm Password{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                name="password_confirmation"
                                value={formData.password_confirmation}
                                onChange={handleChange}
                                placeholder="Confirm password"
                                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 ${
                                    errors.password_confirmation
                                        ? "border-red-300 bg-red-50"
                                        : "border-gray-300"
                                }`}
                            />
                            {errors.password_confirmation && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.password_confirmation}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Account Settings & Institution */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Account Settings */}
                    <div className="bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-100 rounded-xl p-4 border border-purple-200/60 shadow-sm">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-purple-500 rounded-lg shadow-sm">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">
                                Account Settings
                            </h3>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Role
                                </label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                                >
                                    <option value="super-admin">Super Admin</option>
                                    <option value="hei-admin">HEI Admin</option>
                                    <option value="hei-staff">HEI Staff</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <UserCheck className="w-4 h-4 inline mr-1" />
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Institution */}
                    <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 rounded-xl p-3 border border-amber-200/60 shadow-sm">
                        <div className="flex items-center space-x-2 mb-2">
                            <div className="p-1.5 bg-amber-500 rounded-lg shadow-sm">
                                <Building className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="text-sm font-semibold text-gray-900">
                                Institution
                            </h3>
                        </div>
                        {renderHeiAutocomplete()}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={loading}
                        className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
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
                                Create User
                            </>
                        )}
                    </button>
                </div>
            </form>
        </Dialog>
    );
};

AddUserForm.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    loading: PropTypes.bool,
};

export default AddUserForm;
