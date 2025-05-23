import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import AlertComponent from "../../../../Components/AlertComponent";
import config from "../../../../utils/config";
import axios from "axios";

const UserDialog = ({ openDialog, onClose, editingUser, onUserUpdated }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "HEI Staff",
        status: "Active",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const currentUser = JSON.parse(localStorage.getItem("user")) || {};
    const heiAdminInstitutionId = currentUser.institution_id;
    const [imagePreview, setImagePreview] = useState(null);

    const statusOptions = [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
        { value: "Pending", label: "Pending" }
    ];

    useEffect(() => {
        if (editingUser) {
            setFormData({
                name: editingUser.name || "",
                email: editingUser.email || "",
                role: "hei-staff",
                status: editingUser.status || "Active",
                password: "",
                profile_image: null
            });
            // Set existing profile image preview if available
            if (editingUser.profile_image) {
                setImagePreview(editingUser.profile_image);
            } else {
                setImagePreview(null);
            }
        } else {
            setFormData({
                name: "",
                email: "",
                role: "hei-staff",
                status: "Active",
                password: "",
                profile_image: null
            });
            setImagePreview(null);
        }
        setErrors({});
    }, [editingUser, openDialog]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!editingUser) {
            if (!formData.password) {
                newErrors.password = "Password is required for new users";
            } else if (formData.password.length < 8) {
                newErrors.password = "Password must be at least 8 characters long";
            }
        }

        // Validate profile image
        if (formData.profile_image) {
            const file = formData.profile_image;
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
            const maxSize = 5 * 1024 * 1024; // 5MB

            if (!validTypes.includes(file.type)) {
                newErrors.profile_image = "Please upload a valid image file (JPEG, PNG, GIF)";
            } else if (file.size > maxSize) {
                newErrors.profile_image = "Image size should be less than 5MB";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, profile_image: file }));

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setFormData(prev => ({ ...prev, profile_image: null }));
            setImagePreview(null);
        }

        if (errors.profile_image) {
            setErrors(prev => ({ ...prev, profile_image: "" }));
        }
    };

    const removeImage = () => {
        setFormData(prev => ({ ...prev, profile_image: null }));
        setImagePreview(null);
        // Reset the file input
        const fileInput = document.getElementById('profile_image');
        if (fileInput) fileInput.value = '';
    };

    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        // Create FormData for file upload
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name.trim());
        formDataToSend.append('email', formData.email.trim());
        formDataToSend.append('role', formData.role);
        formDataToSend.append('status', formData.status);
        formDataToSend.append('institution_id', heiAdminInstitutionId);

        if (formData.password && !editingUser) {
            formDataToSend.append('password', formData.password);
        }

        if (formData.profile_image) {
            formDataToSend.append('profile_image', formData.profile_image);
        }

        try {
            const token = localStorage.getItem("token");
            const headers = {
                Authorization: `Bearer ${token}`,
                // Don't set Content-Type, let browser set it with boundary for FormData
            };

            if (editingUser) {
                await axios.put(
                    `${config.API_URL}/users/${editingUser.id}`,
                    formDataToSend,
                    { headers }
                );
                AlertComponent.showAlert("User updated successfully!", "success");
            } else {
                await axios.post(`${config.API_URL}/users`, formDataToSend, {
                    headers,
                });
                AlertComponent.showAlert("HEI Staff user created successfully!", "success");
            }
            onUserUpdated();
            handleClose();
        } catch (err) {
            AlertComponent.showAlert(
                err.response?.data?.message || "Error saving user data",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            name: "",
            email: "",
            role: "hei-staff",
            status: "Active",
            password: "",
            profile_image: null
        });
        setErrors({});
        setImagePreview(null);
        onClose();
    };

    if (!openDialog) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-200 scale-100">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-xl">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold text-white">
                            {editingUser ? "Edit HEI Staff" : "Add New HEI Staff"}
                        </h3>
                        <button
                            type="button"
                            className="text-blue-100 hover:text-white transition-colors duration-200 p-1 rounded-lg hover:bg-blue-500/20"
                            onClick={handleClose}
                            aria-label="Close dialog"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5">
                    {/* Profile Image Upload */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Profile Image
                        </label>
                        <div className="flex flex-col items-center space-y-3">
                            {imagePreview ? (
                                <div className="relative">
                                    <img
                                        src={imagePreview}
                                        alt="Profile preview"
                                        className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200"
                                        aria-label="Remove image"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            )}
                            <div className="flex flex-col items-center space-y-2">
                                <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 border border-blue-200">
                                    <input
                                        id="profile_image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                    {imagePreview ? "Change Image" : "Upload Image"}
                                </label>
                                <p className="text-xs text-gray-500 text-center">
                                    PNG, JPG, GIF up to 5MB
                                </p>
                            </div>
                            {errors.profile_image && <p className="text-sm text-red-600">{errors.profile_image}</p>}
                        </div>
                    </div>

                    {/* Name Field */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                                errors.name ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
                            }`}
                            placeholder="Enter full name"
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                    </div>

                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                            Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                                errors.email ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
                            }`}
                            placeholder="Enter email address"
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>

                    {/* Status Field */}
                    <div>
                        <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
                            Status
                        </label>
                        <select
                            id="status"
                            value={formData.status}
                            onChange={(e) => handleInputChange("status", e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-400 bg-white"
                        >
                            {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Password Field (only for new users) */}
                    {!editingUser && (
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => handleInputChange("password", e.target.value)}
                                className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                                    errors.password ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
                                }`}
                                placeholder="Enter password (min. 8 characters)"
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                            <p className="mt-1 text-xs text-gray-500">Password must be at least 8 characters long</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 rounded-b-xl border-t border-gray-100">
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500/20 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="px-5 py-2.5 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                            onClick={handleSave}
                            disabled={loading}
                        >
                            {loading && (
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            <span>{loading ? "Saving..." : editingUser ? "Update HEI Staff" : "Create HEI Staff"}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

UserDialog.propTypes = {
    openDialog: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onUserUpdated: PropTypes.func.isRequired,
    editingUser: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        email: PropTypes.string,
        role: PropTypes.string,
        status: PropTypes.string,
        profile_image: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.object, // In case it's a File object
        ]),
    }),
};

export default UserDialog;
