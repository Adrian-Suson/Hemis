/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import config from "../../../../utils/config";
import PropTypes from "prop-types";
import axios from "axios";
import AlertComponent from "../../../../Components/AlertComponent"; // Import AlertComponent

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

    useEffect(() => {
        if (openDialog) {
            fetchInstitutions();
        }
    }, [openDialog]);

    useEffect(() => {
        if (editingUser) {
            setName(editingUser.name || "");
            setEmail(editingUser.email || "");
            setRole(editingUser.role || "Viewer");
            setStatus(editingUser.status || "Active");
            setInstitutionId(editingUser.institution_id || ""); // Expects uuid
            setProfileImage(editingUser.profile_image || "");
            setPassword("");
        } else {
            setName("");
            setEmail("");
            setRole("Viewer");
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
                role === "Super Admin"
                    ? null
                    : selectedInstitution && selectedInstitution.id
                    ? parseInt(selectedInstitution.id, 10)
                    : null,
            ...(password && !editingUser ? { password } : {}),
            ...(profileImage ? { profile_image: profileImage } : {}),
        };

        try {
            const token = localStorage.getItem("token");
            if (editingUser) {
                await axios.put(
                    `${config.API_URL}/users/${editingUser.id}`,
                    userData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                await axios.post(`${config.API_URL}/users`, userData, {
                    headers: { Authorization: `Bearer ${token}` },
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
        setRole("Viewer");
        setStatus("Active");
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
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity ${
                openDialog ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            aria-hidden={!openDialog}
        >
            <div className="bg-white rounded-lg w-full max-w-md mx-4 sm:mx-auto">
                {/* Dialog Title */}
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {editingUser ? "Edit User" : "Add New User"}
                    </h2>
                    <p className="text-sm text-gray-500">
                        {editingUser
                            ? "Modify user details"
                            : "Create a new user account"}
                    </p>
                </div>

                {/* Dialog Content */}
                <div className="p-4">
                    {/* Name Input */}
                    <div className="mb-4">
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Email Input */}
                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Password Input (for new users) */}
                    {!editingUser && (
                        <div className="mb-4">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    )}

                    {/* Role Select */}
                    <div className="mb-4">
                        <label
                            htmlFor="role"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Role
                        </label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => {
                                setRole(e.target.value);
                                if (e.target.value === "Super Admin")
                                    setInstitutionId("");
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="HEI Admin">HEI Admin</option>
                            <option value="HEI Staff">HEI Staff</option>
                            <option value="Viewer">Viewer</option>
                        </select>
                    </div>

                    {/* Institution Select (hidden for Super Admin) */}
                    {role !== "Super Admin" && (
                        <div className="mb-4">
                            <label
                                htmlFor="institution"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Institution
                            </label>
                            <select
                                id="institution"
                                value={institutionId}
                                onChange={(e) =>
                                    setInstitutionId(e.target.value)
                                }
                                disabled={
                                    fetchingInstitutions ||
                                    (editingUser && institutions.length === 1)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                                {!editingUser && (
                                    <option value="">Select Institution</option>
                                )}
                                {institutions.length === 0 ? (
                                    <option value="">
                                        No Institution Available
                                    </option>
                                ) : (
                                    institutions.map((inst) => (
                                        <option
                                            key={inst.uuid}
                                            value={inst.uuid}
                                        >
                                            {inst.name}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>
                    )}

                    {/* Status Select */}
                    <div className="mb-4">
                        <label
                            htmlFor="status"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Status
                        </label>
                        <select
                            id="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Suspended">Suspended</option>
                        </select>
                    </div>

                    {/* Profile Image Upload */}
                    <div className="mb-4">
                        <label
                            htmlFor="profileImage"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Profile Image
                        </label>
                        <input
                            id="profileImage"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Profile Image Preview */}
                    {profileImage && (
                        <div className="mt-4 flex justify-center">
                            <img
                                src={profileImage}
                                alt="Profile"
                                className="w-24 h-24 object-cover rounded-full"
                            />
                        </div>
                    )}
                </div>

                {/* Dialog Actions */}
                <div className="p-4 border-t border-gray-200 flex justify-end space-x-2">
                    <button
                        onClick={handleClose}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={
                            loading ||
                            (!editingUser &&
                                (!password || password.length < 8)) ||
                            (role !== "Super Admin" && !institutionId)
                        }
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        {loading ? (
                            <svg
                                className="animate-spin h-5 w-5 mr-2 text-white"
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
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                                ></path>
                            </svg>
                        ) : editingUser ? (
                            "Save Changes"
                        ) : (
                            "Create User"
                        )}
                    </button>
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
