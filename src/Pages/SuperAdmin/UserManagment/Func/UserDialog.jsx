/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import config from "../../../../utils/config";
import PropTypes from "prop-types";
import axios from "axios";
import AlertComponent from "../../../../Components/AlertComponent"; // Import AlertComponent
import useActivityLog from "../../../../Hooks/useActivityLog"; // Import the hook

const UserDialog = ({ openDialog, onClose, editingUser, onUserUpdated, fetchUsers }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("Viewer");
    const [status, setStatus] = useState("Active");
    const [institutionId, setInstitutionId] = useState(""); // Stores uuid
    const [password, setPassword] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [loading, setLoading] = useState(false);
    const [institutions, setInstitutions] = useState([]);
    const [fetchingInstitutions, setFetchingInstitutions] = useState(false);
    const { createLog } = useActivityLog(); // Use the hook

    useEffect(() => {
        if (openDialog) {
            fetchInstitutions();
        }
    }, [openDialog]);

    useEffect(() => {
        if (editingUser) {
            setName(editingUser.name || "");
            setEmail(editingUser.email || "");
            setRole(editingUser.role || "hei-admin");
            setStatus(editingUser.status || "Active");
            setInstitutionId(editingUser.institution_id || ""); // Expects uuid
            setProfileImage(editingUser.profile_image || "");
            setPassword("");
        } else {
            setName("");
            setEmail("");
            setRole("hei-admin");
            setStatus("Active");
            setInstitutionId("");
            setPassword("");
            setProfileImage("");
        }
    }, [editingUser]);

    const fetchInstitutions = async () => {
        setFetchingInstitutions(true);
        const token = localStorage.getItem("token");

        try {
            const response = await axios.get(`${config.API_URL}/institutions`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const institutionsByUuid = new Map();
            for (const inst of response.data || []) {
                if (!institutionsByUuid.has(inst.uuid)) {
                    institutionsByUuid.set(inst.uuid, inst);
                }
            }
            const uniqueInstitutions = Array.from(institutionsByUuid.values());

            if (editingUser && editingUser.institution_id) {
                const matchingInstitution = uniqueInstitutions.find(
                    (inst) => inst.uuid === editingUser.institution_id
                );
                setInstitutions(
                    matchingInstitution ? [matchingInstitution] : []
                );
            } else {
                setInstitutions(uniqueInstitutions);
            }
        } catch (err) {
            AlertComponent.showAlert(
                err.response?.data?.message || "Failed to fetch institutions",
                "error"
            );
        } finally {
            setFetchingInstitutions(false);
        }
    };

    const handleSave = async () => {
        setLoading(true);

        if (!editingUser && (!password || password.length < 8)) {
            AlertComponent.showAlert(
                "Password is required and must be at least 8 characters.",
                "error"
            );
            setLoading(false);
            return;
        }

        const selectedInstitution = institutions.find(
            (inst) => inst.uuid === institutionId
        );

        const userData = {
            name,
            email,
            role,
            status,
            institution_id:
                role === "super-admin"
                    ? null
                    : selectedInstitution && selectedInstitution.id
                    ? parseInt(selectedInstitution.id, 10)
                    : null,
            ...(password && !editingUser ? { password } : {}),
            ...(profileImage ? { profile_image: profileImage } : {}),
        };

        try {
            console.log("User Data:", userData);
            const token = localStorage.getItem("token");
            if (editingUser) {
                await axios.put(
                    `${config.API_URL}/users/${editingUser.id}`,
                    userData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                // Log the edit action
                await fetchUsers();
                await createLog({
                    action: "Edit User",
                    description: `Edited user: ${editingUser.name}`,
                });
            } else {
                 await axios.post(
                    `${config.API_URL}/users`,
                    userData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                // Log the add action
                await fetchUsers();
                await createLog({
                    action: "Add User",
                    description: `Added new user: ${userData.name}`,
                });
            }

            await fetchUsers();
            AlertComponent.showAlert(
                editingUser
                    ? "User updated successfully!"
                    : "User created successfully!",
                "success"
            );
            onUserUpdated();
            onClose();
        } catch (err) {
            if (err.response?.status === 422 && err.response?.data?.errors) {
                const errorMessages = Object.values(err.response.data.errors)
                    .flat()
                    .join(", ");
                AlertComponent.showAlert(
                    errorMessages || "Validation failed",
                    "error"
                );
            } else {
                AlertComponent.showAlert(
                    err.response?.data?.message ||
                        err.message ||
                        "Error saving user data",
                    "error"
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setName("");
        setEmail("");
        setRole("");
        setStatus("");
        setInstitutionId("");
        setPassword("");
        setProfileImage("");
        setInstitutions([]);
        onClose();
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-opacity duration-200 ${
                openDialog ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            aria-hidden={!openDialog}
        >
            <div className={`bg-white rounded-lg w-full max-w-2xl mx-4 sm:mx-auto shadow-xl transition-transform duration-200 ${
                openDialog ? "scale-100" : "scale-95"
            }`}>

                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-200 bg-white rounded-t-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900">
                                {editingUser ? "Edit User" : "Add New User"}
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                {editingUser
                                    ? "Update user information and permissions"
                                    : "Create a new user account with appropriate access level"}
                            </p>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                            aria-label="Close dialog"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="px-8 py-6 max-h-[70vh] overflow-y-auto">

                    {/* Profile Image Section */}
                    <div className="mb-8">
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                                {profileImage ? (
                                    <img
                                        src={profileImage}
                                        alt="Profile"
                                        className="w-16 h-16 object-cover rounded-full border-2 border-gray-200"
                                    />
                                ) : (
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center border-2 border-gray-200">
                                        <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700 mb-2">
                                    Profile Image
                                </label>
                                <input
                                    id="profileImage"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                                />
                                <p className="mt-1 text-xs text-gray-500">PNG, JPG up to 2MB</p>
                            </div>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* Personal Information */}
                        <div className="lg:col-span-2">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-100">
                                Personal Information
                            </h3>
                        </div>

                        {/* Full Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Enter full name"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Enter email address"
                                required
                            />
                        </div>

                        {/* Password (new users only) */}
                        {!editingUser && (
                            <div className="lg:col-span-2">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="Minimum 8 characters"
                                    required
                                />
                                <p className="mt-1 text-xs text-gray-500">Password must be at least 8 characters long</p>
                            </div>
                        )}

                        {/* Access & Permissions */}
                        <div className="lg:col-span-2 mt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-100">
                                Access & Permissions
                            </h3>
                        </div>

                        {/* Role */}
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                                Role <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="role"
                                value={role}
                                onChange={(e) => {
                                    setRole(e.target.value);
                                    if (e.target.value === "super-admin")
                                        setInstitutionId("");
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                                required
                            >
                                <option value="super-admin">Super Admin</option>
                                <option value="hei-admin">HEI Admin</option>
                                <option value="hei-staff">HEI Staff</option>
                            </select>
                        </div>

                        {/* Status */}
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                                Account Status <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                                required
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>

                        {/* Institution */}
                        {role !== "super-admin" && (
                            <div className="lg:col-span-2">
                                <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-2">
                                    Institution <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="institution"
                                    value={institutionId}
                                    onChange={(e) => setInstitutionId(e.target.value)}
                                    disabled={fetchingInstitutions || (editingUser && institutions.length === 1)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white disabled:bg-gray-50 disabled:text-gray-500"
                                    required
                                >
                                    {!editingUser && (
                                        <option value="">Select an institution</option>
                                    )}
                                    {fetchingInstitutions ? (
                                        <option value="">Loading institutions...</option>
                                    ) : institutions.length === 0 ? (
                                        <option value="">No institutions available</option>
                                    ) : (
                                        institutions.map((inst) => (
                                            <option key={inst.uuid} value={inst.uuid}>
                                                {inst.name}
                                            </option>
                                        ))
                                    )}
                                </select>
                                {role !== "super-admin" && (
                                    <p className="mt-1 text-xs text-gray-500">
                                        User will have access to this institution only
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={
                                loading ||
                                (!editingUser && (!password || password.length < 8)) ||
                                (role !== "super-admin" && !institutionId) ||
                                !name.trim() ||
                                !email.trim()
                            }
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center"
                        >
                            {loading ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    {editingUser ? "Saving..." : "Creating..."}
                                </>
                            ) : (
                                editingUser ? "Save Changes" : "Create User"
                            )}
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
        institution_id: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        profile_image: PropTypes.string,
    }),
    fetchUsers: PropTypes.func,
};

export default UserDialog;
