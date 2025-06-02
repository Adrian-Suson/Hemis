import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
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
    Building2
} from "lucide-react";

// Mock data - replace with actual API calls
const mockUsers = [
    {
        id: 1,
        profile_image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        name: "John Doe",
        email: "john.doe@example.com",
        role: "admin",
        status: "active",
        hei_uiid: "HEI001",
        hei_name: "University of Technology",
        created_at: "2024-01-15"
    },
    {
        id: 2,
        profile_image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        role: "user",
        status: "active",
        hei_uiid: "HEI002",
        hei_name: "State College",
        created_at: "2024-02-10"
    },
    {
        id: 3,
        profile_image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        name: "Mike Johnson",
        email: "mike.johnson@example.com",
        role: "moderator",
        status: "inactive",
        hei_uiid: "HEI001",
        hei_name: "University of Technology",
        created_at: "2024-01-20"
    },
    {
        id: 4,
        profile_image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        name: "Sarah Wilson",
        email: "sarah.wilson@example.com",
        role: "user",
        status: "active",
        hei_uiid: "HEI003",
        hei_name: "Technical Institute",
        created_at: "2024-03-05"
    },
    {
        id: 5,
        profile_image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
        name: "Robert Brown",
        email: "robert.brown@example.com",
        role: "admin",
        status: "active",
        hei_uiid: "HEI002",
        hei_name: "State College",
        created_at: "2024-02-28"
    }
];

function UserManagement() {
    const [users, setUsers] = useState(mockUsers);
    const [filteredUsers, setFilteredUsers] = useState(mockUsers);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("ALL");
    const [filterStatus, setFilterStatus] = useState("ALL");

    // Filter users based on search and filters
    useEffect(() => {
        let filtered = users;

        if (searchTerm) {
            filtered = filtered.filter(
                (user) =>
                    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.hei_name?.toLowerCase().includes(searchTerm.toLowerCase())
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

    const handleViewDetails = (user) => {
        setSelectedUser(user);
        setIsDetailModalOpen(true);
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const handleDelete = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?"))
            return;

        try {
            // Replace with actual API call
            setUsers(users.filter((user) => user.id !== userId));
            console.log("User deleted:", userId);
        } catch (err) {
            console.error("Error deleting user:", err);
            setError("Failed to delete user. Please try again.");
        }
    };

    const handleAddUser = () => {
        setIsAddModalOpen(true);
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
            case "admin":
                return "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300";
            case "moderator":
                return "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300";
            case "user":
                return "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300";
            default:
                return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300";
        }
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case "admin":
                return <Shield className="w-3 h-3" />;
            case "moderator":
                return <UserCheck className="w-3 h-3" />;
            case "user":
                return <User className="w-3 h-3" />;
            default:
                return <User className="w-3 h-3" />;
        }
    };

    // Popper Component (simplified version)
    const Popper = ({ trigger, children, className }) => {
        const [isOpen, setIsOpen] = useState(false);

        return (
            <div className="relative">
                <div onClick={() => setIsOpen(!isOpen)}>
                    {trigger}
                </div>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsOpen(false)}
                        />
                        <div className={`absolute z-20 ${className}`}>
                            {children}
                        </div>
                    </>
                )}
            </div>
        );
    };

    Popper.propTypes = {
        trigger: PropTypes.node.isRequired,
        children: PropTypes.node.isRequired,
        className: PropTypes.string
    };

    // User Details Modal
    const UserDetailsModal = ({ isOpen, onClose, userData }) => {
        if (!isOpen || !userData) return null;

        return (
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

                    <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">User Details</h3>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center space-x-4">
                                <img
                                    src={userData.profile_image}
                                    alt={userData.name}
                                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                                />
                                <div>
                                    <h4 className="text-xl font-semibold text-gray-900">{userData.name}</h4>
                                    <p className="text-gray-600">{userData.email}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                    <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${getRoleColor(userData.role)}`}>
                                        {getRoleIcon(userData.role)}
                                        <span className="ml-1 capitalize">{userData.role}</span>
                                    </span>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${
                                        userData.status === 'active'
                                            ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300'
                                            : 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300'
                                    }`}>
                                        {userData.status === 'active' ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                                        <span className="ml-1 capitalize">{userData.status}</span>
                                    </span>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                                    <p className="text-gray-900">{userData.hei_name}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">HEI ID</label>
                                    <p className="text-gray-900 font-mono text-sm">{userData.hei_uiid}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Created Date</label>
                                    <p className="text-gray-900">{new Date(userData.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    UserDetailsModal.propTypes = {
        isOpen: PropTypes.bool.isRequired,
        onClose: PropTypes.func.isRequired,
        userData: PropTypes.shape({
            profile_image: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            email: PropTypes.string.isRequired,
            role: PropTypes.string.isRequired,
            status: PropTypes.string.isRequired,
            hei_name: PropTypes.string.isRequired,
            hei_uiid: PropTypes.string.isRequired,
            created_at: PropTypes.string.isRequired
        })
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
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 pr-4 py-2 w-full sm:w-60 lg:w-80 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-200"
                                        />
                                    </div>

                                    <div className="relative w-full sm:w-auto">
                                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <select
                                            value={filterRole}
                                            onChange={(e) => setFilterRole(e.target.value)}
                                            className="pl-10 pr-8 py-2 w-full sm:w-auto border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm appearance-none cursor-pointer transition-all duration-200"
                                        >
                                            <option value="ALL">All Roles</option>
                                            <option value="admin">Admin</option>
                                            <option value="moderator">Moderator</option>
                                            <option value="user">User</option>
                                        </select>
                                    </div>

                                    <div className="relative w-full sm:w-auto">
                                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <select
                                            value={filterStatus}
                                            onChange={(e) => setFilterStatus(e.target.value)}
                                            className="pl-10 pr-8 py-2 w-full sm:w-auto border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm appearance-none cursor-pointer transition-all duration-200"
                                        >
                                            <option value="ALL">All Status</option>
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
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
                                Showing {filteredUsers.length} of {users.length} users
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
                                <span className="text-gray-600 font-medium">Loading users...</span>
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
                                            key={user.id}
                                            className={`hover:bg-blue-50/30 transition-all duration-200 ${
                                                index % 2 === 0 ? "bg-white/30" : "bg-gray-50/30"
                                            }`}
                                        >
                                            <td className="w-[300px] px-4 py-4">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <img
                                                            className="h-10 w-10 rounded-full object-cover border-2 border-gray-200"
                                                            src={user.profile_image}
                                                            alt={user.name}
                                                        />
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
                                                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full shadow-sm ${getRoleColor(user.role)}`}>
                                                        {getRoleIcon(user.role)}
                                                        <span className="ml-1 capitalize">{user.role}</span>
                                                    </span>
                                                    <div>
                                                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full shadow-sm ${
                                                            user.status === 'active'
                                                                ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300'
                                                                : 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300'
                                                        }`}>
                                                            {user.status === 'active' ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                                                            <span className="ml-1 capitalize">{user.status}</span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="w-[250px] px-4 py-4">
                                                <div className="space-y-1">
                                                    <div className="text-xs font-medium text-gray-900 flex items-start">
                                                        <Building2 className="w-3 h-3 mr-1 text-gray-400 flex-shrink-0 mt-0.5" />
                                                        <span className="break-words leading-tight">
                                                            {user.hei_name}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs text-gray-600 break-words leading-tight ml-4">
                                                        HEI ID: {user.hei_uiid}
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
                                                        Joined: {new Date(user.created_at).toLocaleDateString()}
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
                                                            onClick={() => handleViewDetails(user)}
                                                            className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 focus:outline-none focus:bg-blue-50 transition-colors duration-150 group"
                                                        >
                                                            <Eye className="w-4 h-4 mr-3 text-blue-500 group-hover:text-blue-600" />
                                                            View Details
                                                        </button>
                                                        <button
                                                            onClick={() => handleEdit(user)}
                                                            className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-green-50 focus:outline-none focus:bg-green-50 transition-colors duration-150 group"
                                                        >
                                                            <Edit className="w-4 h-4 mr-3 text-green-500 group-hover:text-green-600" />
                                                            Edit User
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(user.id)}
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
                                    {filteredUsers.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center">
                                                <div className="text-gray-500">
                                                    <div className="mx-auto h-20 w-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                                                        <Users className="w-10 h-10 text-gray-400" />
                                                    </div>
                                                    <p className="text-lg font-semibold text-gray-900 mb-2">
                                                        {searchTerm || filterRole !== "ALL" || filterStatus !== "ALL"
                                                            ? "No matching users found"
                                                            : "No Users Found"}
                                                    </p>
                                                    <p className="text-sm text-gray-600 mb-4">
                                                        {searchTerm || filterRole !== "ALL" || filterStatus !== "ALL"
                                                            ? "Try adjusting your search terms or filters."
                                                            : "No users have been registered yet."}
                                                    </p>
                                                    {!searchTerm && filterRole === "ALL" && filterStatus === "ALL" && (
                                                        <button
                                                            onClick={handleAddUser}
                                                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 shadow-sm hover:shadow-md transition-all duration-200"
                                                        >
                                                            <Plus className="w-4 h-4 mr-2" />
                                                            Add First User
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
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

                {/* Add/Edit Modals would go here - similar structure to your campus forms */}
            </div>
        </div>
    );
}

export default UserManagement;
