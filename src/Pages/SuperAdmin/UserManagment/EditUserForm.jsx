import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import config from "../../../utils/config";
import Dialog from "../../../Components/Dialog";

const EditUserForm = ({ isOpen, onClose, onSave, userData, loading }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "user",
        status: "active",
        hei_uiid: "",
    });
    const [errors, setErrors] = useState({});
    const [heiOptions, setHeiOptions] = useState([]);

    useEffect(() => {
        if (isOpen && userData) {
            setFormData({
                name: userData.name || "",
                email: userData.email || "",
                role: userData.role || "user",
                status: userData.status || "active",
                hei_uiid: userData.hei_uiid || "",
            });
            fetchHeiOptions();
        }
    }, [isOpen, userData]);

    const fetchHeiOptions = async () => {
        try {
            const response = await axios.get(`${config.API_URL}/hei-options`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    Accept: "application/json",
                },
            });
            setHeiOptions(response.data.data || response.data || []);
        } catch (err) {
            console.error("Error fetching HEI options:", err);
        }
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

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        await onSave({
            ...formData,
            id: userData.id,
        });
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title="Edit User"
            variant="default"
            size="default"
        >
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.name
                                ? "border-red-300"
                                : "border-gray-300"
                        }`}
                        placeholder="Enter full name"
                    />
                    {errors.name && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.name}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.email
                                ? "border-red-300"
                                : "border-gray-300"
                        }`}
                        placeholder="Enter email address"
                    />
                    {errors.email && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.email}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Role
                        </label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="user">User</option>
                            <option value="moderator">Moderator</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Institution
                    </label>
                    <select
                        name="hei_uiid"
                        value={formData.hei_uiid}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Select Institution</option>
                        {heiOptions.map((hei) => (
                            <option key={hei.uiid} value={hei.uiid}>
                                {hei.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Updating..." : "Update User"}
                    </button>
                </div>
            </form>
        </Dialog>
    );
};

EditUserForm.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    userData: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
        name: PropTypes.string,
        email: PropTypes.string,
        role: PropTypes.oneOf(["admin", "moderator", "user"]),
        status: PropTypes.oneOf(["active", "inactive"]),
        hei_uiid: PropTypes.string,
    }).isRequired,
    loading: PropTypes.bool,
};

export default EditUserForm; 