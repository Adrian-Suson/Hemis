import { useState, useEffect, useRef } from "react";
import axios from "axios";
import config from "../utils/config";
import DP from "../assets/Profile.png";
import PropTypes from "prop-types";
import {
    XIcon,
    Mail,
    Briefcase,
    User,
    Lock,
    Camera,
    Edit,
    Save,
} from "lucide-react";

const ProfileDialog = ({ open, onClose, user, fetchUserProfile }) => {
    const [editMode, setEditMode] = useState(false);
    const [editUser, setEditUser] = useState({
        name: "",
        email: "",
        profile_image: "",
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    // Reset form when user changes
    useEffect(() => {
        if (user) {
            setEditUser({
                name: user.name || "",
                email: user.email || "",
                profile_image: user.profile_image || "",
                password: "",
                confirmPassword: "",
            });
        }
    }, [user]);

    const handleSaveProfile = async () => {
        try {
            if (
                editUser.password.trim() !== "" &&
                editUser.password !== editUser.confirmPassword
            ) {
                alert("Passwords do not match.");
                return;
            }
            setLoading(true);
            const token = localStorage.getItem("token");
            const payload = {
                name: editUser.name,
                email: editUser.email,
                profile_image: editUser.profile_image,
                ...(editUser.password.trim() !== ""
                    ? { password: editUser.password }
                    : {}),
            };
            await axios.patch(`${config.API_URL}/users/${user.id}`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            await fetchUserProfile();
            setEditMode(false);
        } catch (err) {
            console.error("Failed to update profile:", err);
            alert("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setEditUser((prev) => ({
                    ...prev,
                    profile_image: reader.result,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fadeIn">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-md mx-4 animate-scaleIn">
                {/* Dialog Header */}
                <div className="bg-[#0038A8] text-white px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-medium">
                        {editMode ? "Edit Profile" : "User Profile"}
                    </h2>
                    <button
                        onClick={() => {
                            onClose();
                            setEditMode(false);
                        }}
                        className="text-white hover:bg-white/10 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-white/30"
                        aria-label="Close"
                    >
                        <XIcon size={20} />
                    </button>
                </div>

                {/* Dialog Content */}
                <div className="w-full">
                    {!user ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0038A8]"></div>
                        </div>
                    ) : !editMode ? (
                        <div>
                            {/* Profile View */}
                            <div className="bg-[#0038A8]/10 py-6 px-4 flex flex-col items-center">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-full border-4 border-[#FCD116] overflow-hidden">
                                        <img
                                            src={user.profile_image || DP}
                                            alt={user.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    {/* Yellow sun rays inspired by CHED logo */}
                                    <div className="absolute -inset-2 -z-10 bg-[#FCD116]/20 rounded-full blur-md"></div>
                                </div>
                                <h3 className="mt-4 text-xl font-semibold text-gray-800">
                                    {user.name}
                                </h3>
                                <span
                                    className={`mt-1 px-2 py-0.5 text-xs rounded-full ${
                                        user.status?.toLowerCase() === "active"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-gray-100 text-gray-800"
                                    }`}
                                >
                                    {user.status || "N/A"}
                                </span>
                            </div>

                            <div className="p-6">
                                <ul className="space-y-4">
                                    <li className="flex items-start pb-4 border-b border-gray-200">
                                        <Mail
                                            size={18}
                                            className="mt-0.5 mr-3 text-gray-500"
                                        />
                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Email
                                            </p>
                                            <p className="text-gray-800 font-medium">
                                                {user.email}
                                            </p>
                                        </div>
                                    </li>
                                    <li className="flex items-start">
                                        <Briefcase
                                            size={18}
                                            className="mt-0.5 mr-3 text-gray-500"
                                        />
                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Role
                                            </p>
                                            <p className="text-gray-800 font-medium">
                                                {user.role || "N/A"}
                                            </p>
                                        </div>
                                    </li>

                                    {/* Red accent line - CHED branding */}
                                    <div className="h-1 bg-[#CD0000] w-16 rounded-full mt-4"></div>
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div className="p-6">
                            {/* Profile Edit */}
                            <div className="flex flex-col items-center mb-6">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-full border-4 border-[#0038A8] overflow-hidden">
                                        <img
                                            src={editUser.profile_image || DP}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <button
                                        className="absolute bottom-0 right-0 p-1 rounded-full bg-[#0038A8] text-white hover:bg-[#002d85] focus:outline-none focus:ring-2 focus:ring-[#0038A8] focus:ring-offset-2"
                                        onClick={() =>
                                            fileInputRef.current.click()
                                        }
                                        aria-label="Change profile picture"
                                    >
                                        <Camera size={16} />
                                    </button>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        className="hidden"
                                        onChange={handleImageUpload}
                                    />
                                </div>
                                <p className="mt-2 text-xs text-gray-500">
                                    Click the camera icon to change your profile
                                    picture
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="relative">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Full Name
                                    </label>
                                    <div className="flex">
                                        <div className="flex items-center justify-center min-w-[40px] bg-gray-100 border border-r-0 border-gray-300 rounded-l-md text-gray-500">
                                            <User size={16} />
                                        </div>
                                        <input
                                            type="text"
                                            value={editUser.name}
                                            onChange={(e) =>
                                                setEditUser({
                                                    ...editUser,
                                                    name: e.target.value,
                                                })
                                            }
                                            className="flex-1 py-2 px-3 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-[#0038A8] focus:border-[#0038A8]"
                                            placeholder="Your name"
                                        />
                                    </div>
                                </div>

                                <div className="relative">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Email Address
                                    </label>
                                    <div className="flex">
                                        <div className="flex items-center justify-center min-w-[40px] bg-gray-100 border border-r-0 border-gray-300 rounded-l-md text-gray-500">
                                            <Mail size={16} />
                                        </div>
                                        <input
                                            type="email"
                                            value={editUser.email}
                                            onChange={(e) =>
                                                setEditUser({
                                                    ...editUser,
                                                    email: e.target.value,
                                                })
                                            }
                                            className="flex-1 py-2 px-3 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-[#0038A8] focus:border-[#0038A8]"
                                            placeholder="your.email@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 mb-4">
                                    <h4 className="text-sm font-medium text-[#0038A8]">
                                        Change Password (Optional)
                                    </h4>

                                    <div className="h-0.5 w-12 bg-[#FCD116] rounded-full mt-1"></div>
                                    <p className="mt-2 text-xs text-gray-500">
                                        Leave blank to keep current password
                                    </p>
                                </div>

                                <div className=" gap-6">
                                    <div className="relative">
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            New Password
                                        </label>
                                        <div className="flex">
                                            <div className="flex items-center justify-center min-w-[40px] bg-gray-100 border border-r-0 border-gray-300 rounded-l-md text-gray-500">
                                                <Lock size={16} />
                                            </div>
                                            <input
                                                type="password"
                                                value={editUser.password}
                                                onChange={(e) =>
                                                    setEditUser({
                                                        ...editUser,
                                                        password:
                                                            e.target.value,
                                                    })
                                                }
                                                className="flex-1 py-2 px-3 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-[#0038A8] focus:border-[#0038A8]"
                                                placeholder="New password"
                                            />
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Confirm Password
                                        </label>
                                        <div className="flex">
                                            <div className="flex items-center justify-center min-w-[40px] bg-gray-100 border border-r-0 border-gray-300 rounded-l-md text-gray-500">
                                                <Lock size={16} />
                                            </div>
                                            <input
                                                type="password"
                                                value={editUser.confirmPassword}
                                                onChange={(e) =>
                                                    setEditUser({
                                                        ...editUser,
                                                        confirmPassword:
                                                            e.target.value,
                                                    })
                                                }
                                                className={`flex-1 py-2 px-3 border rounded-r-md focus:outline-none focus:ring-2 focus:ring-[#0038A8] focus:border-[#0038A8] ${
                                                    editUser.confirmPassword !==
                                                        "" &&
                                                    editUser.password !==
                                                        editUser.confirmPassword
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                }`}
                                                placeholder="Confirm password"
                                            />
                                        </div>
                                        {editUser.confirmPassword !== "" &&
                                            editUser.password !==
                                                editUser.confirmPassword && (
                                                <p className="mt-2 text-xs text-red-600">
                                                    Passwords do not match
                                                </p>
                                            )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Dialog Actions */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                    {editMode ? (
                        <>
                            <button
                                onClick={() => {
                                    setEditMode(false);
                                    setEditUser({
                                        name: user.name || "",
                                        email: user.email || "",
                                        profile_image: user.profile_image || "",
                                        password: "",
                                        confirmPassword: "",
                                    });
                                }}
                                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 mr-3"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveProfile}
                                disabled={loading}
                                className="inline-flex items-center px-4 py-2 text-white bg-[#0038A8] rounded-md hover:bg-[#002d85] focus:outline-none focus:ring-2 focus:ring-[#0038A8] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={16} className="mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 mr-3"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => setEditMode(true)}
                                className="inline-flex items-center px-4 py-2 text-white bg-[#0038A8] rounded-md hover:bg-[#002d85] focus:outline-none focus:ring-2 focus:ring-[#0038A8] focus:ring-offset-2"
                            >
                                <Edit size={16} className="mr-2" />
                                Edit Profile
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Animation Keyframes */}
            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                @keyframes scaleIn {
                    from {
                        transform: scale(0.95);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
                .animate-scaleIn {
                    animation: scaleIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

ProfileDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    user: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        email: PropTypes.string,
        profile_image: PropTypes.string,
        status: PropTypes.string,
        role: PropTypes.string,
    }),
    setUser: PropTypes.func,
    fetchUserProfile: PropTypes.func.isRequired,
};

export default ProfileDialog;
