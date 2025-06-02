import { useState, useEffect } from "react";
import {
    Users,
    MoreHorizontal,
    X,
    Eye,
    User,
    Mail,
    Search,
    Filter,
    Plus,
    TrendingUp,
    Edit,
    Trash,
    Shield,
    UserCheck,
    UserX,
    Building2,
} from "lucide-react";
import axios from "axios";
import config from "../../../utils/config";
import Popper from "../../../Components/Popper";
import UserDetailsModal from "./UserDetailsModal";
import AddUserForm from "./AddUserForm";
import EditUserForm from "./EditUserForm";

// You'll need to import your config file or define the API URL
// import config from "../../../utils/config";


function UserManagement() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [addLoading, setAddLoading] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("ALL");
    const [filterStatus, setFilterStatus] = useState("ALL");

    // Fetch users when component mounts
    useEffect(() => {
        fetchUsers();
    }, []);

    // Filter users based on search and filters
    useEffect(() => {
        let filtered = users;

        if (searchTerm) {
            filtered = filtered.filter(
                (user) =>
                    user.name
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    user.email
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    user.hei?.name
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
        }

        if (filterRole !== "ALL") {
            filtered = filtered.filter((user) => user.role === filterRole);
        }

        if (filterStatus !== "ALL") {
            filtered = filtered.filter((user) => user.status === filterStatus);
        }

        setFilteredUsers(filtered);
    }, [users, searchTerm, filterRole, filterStatus]);

    const fetchUsers = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await axios.get(`${config.API_URL}/admin/users`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    Accept: "application/json",
                },
            });

            const userData = Array.isArray(response.data)
                ? response.data
                : response.data.data || [];
            setUsers(userData);
            setFilteredUsers(userData);
            console.log("Fetched users:", userData);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError("Failed to load users. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (user) => {
        setSelectedUser(user);
        setIsDetailModalOpen(true);
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const handleUpdateUser = async (updatedUserData) => {
        setEditLoading(true);
        try {
            const response = await axios.put(
                `${config.API_URL}/admin/users/${updatedUserData.id}`,
                updatedUserData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                // Update the user in the list
                const updatedUser = response.data;
                setUsers((prev) =>
                    prev.map((user) =>
                        user.id === updatedUser.id ? updatedUser : user
                    )
                );
                setFilteredUsers((prev) =>
                    prev.map((user) =>
                        user.id === updatedUser.id ? updatedUser : user
                    )
                );

                // Close the modal and show success message
                setIsEditModalOpen(false);
                setSelectedUser(null);
                console.log("User updated successfully:", updatedUser);

                // You can add a toast notification here if you have one
                // toast.success("User updated successfully!");
            }
        } catch (err) {
            console.error("Error updating user:", err);
            setError("Failed to update user. Please try again.");

            // You can add a toast notification here if you have one
            // toast.error("Failed to update user. Please try again.");
        } finally {
            setEditLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?"))
            return;

        try {
            const response = await axios.delete(
                `${config.API_URL}/admin/users/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                        Accept: "application/json",
                    },
                }
            );

            if (response.status === 200) {
                setUsers(users.filter((user) => user.id !== userId));
                setFilteredUsers(
                    filteredUsers.filter((user) => user.id !== userId)
                );
                console.log("User deleted successfully:", userId);
            } else {
                throw new Error("Failed to delete user");
            }
        } catch (err) {
            console.error("Error deleting user:", err);
            setError("Failed to delete user. Please try again.");
        }
    };

    const handleAddUser = () => {
        setIsAddModalOpen(true);
    };

    const handleSaveUser = async (userData) => {
        setAddLoading(true);
        try {
            const response = await axios.post(
                `${config.API_URL}/auth/register`,
                userData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 201) {
                // Add the new user to the list
                const newUser = response.data;
                setUsers((prev) => [...prev, newUser]);
                setFilteredUsers((prev) => [...prev, newUser]);

                // Close the modal and show success message
                setIsAddModalOpen(false);
                console.log("User created successfully:", newUser);
                fetchUsers();
                // You can add a toast notification here if you have one
                // toast.success("User created successfully!");
            }
        } catch (err) {
            console.error("Error creating user:", err);
            setError("Failed to create user. Please try again.");

            // You can add a toast notification here if you have one
            // toast.error("Failed to create user. Please try again.");
        } finally {
            setAddLoading(false);
        }
    };

    const closeDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedUser(null);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedUser(null);
    };

    const getRoleColor = (role) => {
        switch (role) {
            case "super-admin":
                return "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300";
            case "hei-admin":
                return "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300";
            case "hei-staff":
                return "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300";
            default:
                return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300";
        }
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case "super-admin":
                return <Shield className="w-3 h-3" />;
            case "hei-admin":
                return <UserCheck className="w-3 h-3" />;
            case "hei-staff":
                return <User className="w-3 h-3" />;
            default:
                return <User className="w-3 h-3" />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
            <div className="p-6 max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center mb-4">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                User Management
                            </h1>
                            <p className="text-gray-600 flex items-center">
                                <Users className="w-4 h-4 mr-2" />
                                Manage system users and their permissions
                            </p>
                        </div>
                    </div>

                    {/* Controls Section */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-sm mb-6">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center">
                                <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full xl:w-auto">
                                    <div className="relative flex-1 sm:flex-initial">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="Search users..."
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(e.target.value)
                                            }
                                            className="pl-10 pr-4 py-2 w-full sm:w-60 lg:w-80 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-200"
                                        />
                                    </div>

                                    <div className="relative w-full sm:w-auto">
                                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <select
                                            value={filterRole}
                                            onChange={(e) =>
                                                setFilterRole(e.target.value)
                                            }
                                            className="pl-10 pr-8 py-2 w-full sm:w-auto border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm appearance-none cursor-pointer transition-all duration-200"
                                        >
                                            <option value="ALL">
                                                All Roles
                                            </option>
                                            <option value="super-admin">Super Admin</option>
                                            <option value="hei-admin">HEI Admin</option>
                                            <option value="hei-staff">HEI Staff</option>
                                        </select>
                                    </div>

                                    <div className="relative w-full sm:w-auto">
                                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <select
                                            value={filterStatus}
                                            onChange={(e) =>
                                                setFilterStatus(e.target.value)
                                            }
                                            className="pl-10 pr-8 py-2 w-full sm:w-auto border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm appearance-none cursor-pointer transition-all duration-200"
                                        >
                                            <option value="ALL">
                                                All Status
                                            </option>
                                            <option value="active">
                                                Active
                                            </option>
                                            <option value="inactive">
                                                Inactive
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-2 w-full xl:w-auto">
                                    <button
                                        onClick={handleAddUser}
                                        className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add User
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center text-sm text-gray-500">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                Showing {filteredUsers.length} of {users.length}{" "}
                                users
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-800 rounded-xl shadow-sm">
                        <div className="flex items-center">
                            <X className="w-5 h-5 mr-2" />
                            {error}
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="flex items-center justify-center p-12">
                        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 shadow-sm">
                            <div className="flex flex-col items-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                                <span className="text-gray-600 font-medium">
                                    Loading users...
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* User Table with Fixed Height and Aligned Columns */
                    <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 overflow-hidden">
                        {/* Single Table with Fixed Layout */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-fixed">
                                {/* Table Header */}
                                <thead className="bg-gradient-to-r from-gray-50/80 to-blue-50/50 border-b border-gray-200/50 sticky top-0 z-10">
                                    <tr>
                                        <th className="w-[300px] px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            User Information
                                        </th>
                                        <th className="w-[200px] px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Role & Status
                                        </th>
                                        <th className="w-[250px] px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Institution
                                        </th>
                                        <th className="w-[200px] px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Contact
                                        </th>
                                        <th className="w-[120px] px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                            </table>
                        </div>

                        {/* Scrollable Table Body */}
                        <div
                            className="max-h-[400px] overflow-y-auto overflow-x-hidden"
                            style={{
                                scrollBehavior: "smooth",
                                scrollbarWidth: "thin",
                                scrollbarColor: "#CBD5E1 #F1F5F9",
                            }}
                        >
                            <table className="min-w-full table-fixed">
                                <tbody className="divide-y divide-gray-200/30">
                                    {filteredUsers.map((user, index) => (
                                        <tr
                                            key={`user-${user.id}-${index}`}
                                            className={`hover:bg-blue-50/30 transition-all duration-200 ${
                                                index % 2 === 0
                                                    ? "bg-white/30"
                                                    : "bg-gray-50/30"
                                            }`}
                                        >
                                            <td className="w-[300px] px-4 py-4">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        {user.profile_image ? (
                                                            <img
                                                                className="h-10 w-10 rounded-full object-cover border-2 border-gray-200"
                                                                src={
                                                                    user.profile_image
                                                                }
                                                                alt={user.name}
                                                            />
                                                        ) : (
                                                            <div className="h-10 w-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                                                                <User className="w-5 h-5 text-blue-600" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="ml-3 min-w-0 flex-1">
                                                        <div className="text-sm font-semibold text-gray-900 leading-tight break-words">
                                                            {user.name}
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            ID: {user.id}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="w-[200px] px-4 py-4">
                                                <div className="space-y-2">
                                                    <span
                                                        className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full shadow-sm ${getRoleColor(
                                                            user.role
                                                        )}`}
                                                    >
                                                        {getRoleIcon(user.role)}
                                                        <span className="ml-1 capitalize">
                                                            {user.role}
                                                        </span>
                                                    </span>
                                                    <div>
                                                        <span
                                                            className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full shadow-sm ${
                                                                user.status ===
                                                                "active"
                                                                    ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300"
                                                                    : "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300"
                                                            }`}
                                                        >
                                                            {user.status ===
                                                            "active" ? (
                                                                <UserCheck className="w-3 h-3" />
                                                            ) : (
                                                                <UserX className="w-3 h-3" />
                                                            )}
                                                            <span className="ml-1 capitalize">
                                                                {user.status}
                                                            </span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="w-[250px] px-4 py-4">
                                                <div className="space-y-1">
                                                    <div className="text-xs font-medium text-gray-900 flex items-start">
                                                        <Building2 className="w-3 h-3 mr-1 text-gray-400 flex-shrink-0 mt-0.5" />
                                                        <span className="break-words leading-tight">
                                                            {user.hei?.name ||
                                                                "No institution assigned"}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs text-gray-600 break-words leading-tight ml-4">
                                                        HEI ID:{" "}
                                                        {user.hei_uiid || "N/A"}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="w-[200px] px-4 py-4">
                                                <div className="space-y-1">
                                                    <div className="text-xs font-medium text-gray-900 flex items-start">
                                                        <Mail className="w-3 h-3 mr-1 text-gray-400 flex-shrink-0 mt-0.5" />
                                                        <span className="break-words leading-tight">
                                                            {user.email}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs text-gray-600 break-words leading-tight ml-4">
                                                        Joined:{" "}
                                                        {user.created_at
                                                            ? new Date(
                                                                  user.created_at
                                                              ).toLocaleDateString()
                                                            : "N/A"}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="w-[120px] px-4 py-4 text-center">
                                                <Popper
                                                    trigger={
                                                        <button
                                                            className="text-gray-600 hover:text-gray-900 hover:bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded-lg p-2 transition-all duration-200"
                                                            title="More Actions"
                                                        >
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </button>
                                                    }
                                                    className="w-40 bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-lg right-0 top-full mt-1"
                                                >
                                                    <div className="py-2">
                                                        <button
                                                            onClick={() =>
                                                                handleViewDetails(
                                                                    user
                                                                )
                                                            }
                                                            className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 focus:outline-none focus:bg-blue-50 transition-colors duration-150 group"
                                                        >
                                                            <Eye className="w-4 h-4 mr-3 text-blue-500 group-hover:text-blue-600" />
                                                            View Details
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleEdit(user)
                                                            }
                                                            className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-green-50 focus:outline-none focus:bg-green-50 transition-colors duration-150 group"
                                                        >
                                                            <Edit className="w-4 h-4 mr-3 text-green-500 group-hover:text-green-600" />
                                                            Edit User
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    user.id
                                                                )
                                                            }
                                                            className="flex items-center w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50 focus:outline-none focus:bg-red-50 transition-colors duration-150"
                                                        >
                                                            <Trash className="w-4 h-4 mr-3 text-red-700 group-hover:text-red-600" />
                                                            Delete User
                                                        </button>
                                                    </div>
                                                </Popper>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* User Detail Modal */}
                <UserDetailsModal
                    isOpen={isDetailModalOpen}
                    onClose={closeDetailModal}
                    userData={selectedUser}
                />

                {/* Add User Form Modal */}
                <AddUserForm
                    isOpen={isAddModalOpen}
                    onClose={closeAddModal}
                    onSave={handleSaveUser}
                    loading={addLoading}
                />

                {/* Edit User Form Modal */}
                <EditUserForm
                    isOpen={isEditModalOpen}
                    onClose={closeEditModal}
                    onSave={handleUpdateUser}
                    userData={selectedUser}
                    loading={editLoading}
                />
            </div>
        </div>
    );
}

export default UserManagement;
