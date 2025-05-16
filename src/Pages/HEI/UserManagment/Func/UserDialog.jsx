import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import AlertComponent from "../../../../Components/AlertComponent";
import config from "../../../../utils/config";
import axios from "axios";

const UserDialog = ({ openDialog, onClose, editingUser, onUserUpdated }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("HEI Staff");
    const [status, setStatus] = useState("Active");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const currentUser = JSON.parse(localStorage.getItem("user")) || {};
    const heiAdminInstitutionId = currentUser.institution_id;

    useEffect(() => {
        if (editingUser) {
            setName(editingUser.name || "");
            setEmail(editingUser.email || "");
            setRole(editingUser.role || "HEI Staff");
            setStatus(editingUser.status || "Active");
            setPassword("");
        } else {
            setName("");
            setEmail("");
            setRole("HEI Staff");
            setStatus("Active");
            setPassword("");
        }
    }, [editingUser]);

    const handleSave = async () => {
        setLoading(true);
        setError("");

        if (!editingUser && (!password || password.length < 8)) {
            AlertComponent.showAlert(
                "Password is required and must be at least 8 characters.",
                "error"
            );
            setLoading(false);
            return;
        }

        const userData = {
            name,
            email,
            role,
            status,
            institution_id: heiAdminInstitutionId,
            ...(password && !editingUser ? { password } : {}),
        };

        try {
            const token = localStorage.getItem("token");
            if (editingUser) {
                await axios.put(
                    `${config.API_URL}/users/${editingUser.id}`,
                    userData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                AlertComponent.showAlert("User updated successfully!", "success");
            } else {
                await axios.post(`${config.API_URL}/users`, userData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                AlertComponent.showAlert("User created successfully!", "success");
            }
            onUserUpdated();
            onClose();
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
        setName("");
        setEmail("");
        setRole("HEI Staff");
        setStatus("Active");
        setPassword("");
        setError("");
        onClose();
    };

    return (
        <>
            {openDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                        {/* Header */}
                        <div className="bg-blue-100 px-4 py-3 flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900">
                                {editingUser ? "Edit User" : "Add New User"}
                            </h3>
                            <button
                                type="button"
                                className="text-gray-500 hover:text-gray-700 focus:outline-none rounded-md"
                                onClick={handleClose}
                                aria-label="Close"
                            >
                                <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-4">
                            {error && (
                                <div className="text-red-500 text-sm">
                                    {error}
                                </div>
                            )}
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                            {!editingUser && (
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                            )}

                           
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                            <button
                                type="button"
                                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                onClick={handleClose}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                onClick={handleSave}
                                disabled={loading}
                            >
                                {loading ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
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
    }),
};

export default UserDialog;
