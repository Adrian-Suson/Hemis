import { useState, useEffect } from "react";
import axios from "axios";
import config from "../../../utils/config";
import UserDialog from "./Func/UserDialog";
import {
    FaEdit,
    FaUserPlus,
    FaSync,
    FaUser,
    FaUserSlash,
} from "react-icons/fa";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [openDialog, setOpenDialog] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const currentUser = JSON.parse(localStorage.getItem("user")); // Get the current logged-in user

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.get(`${config.API_URL}/users`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(response.data);
        } catch {
            setError("Failed to fetch users. Please login again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSearch = (e) => setSearchTerm(e.target.value);
    const handleFilterChange = (e) => setStatusFilter(e.target.value);

    const filteredUsers = users.filter(
        (user) =>
            (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (statusFilter === "All" || user.status === statusFilter)
    );

    const handleEditUser = (user) => {
        setEditingUser(user);
        setOpenDialog(true);
    };

    const handleUserUpdated = () => {
        fetchUsers();
    };

    const handleChangePage = (newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDeactivateUser = async (id) => {
        const token = localStorage.getItem("token");
        try {
            await axios.delete(`${config.API_URL}/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchUsers();
        } catch {
            setError("Failed to delete user.");
        }
    };

    const handleReactivateUser = async (id) => {
        const token = localStorage.getItem("token");
        try {
            await axios.post(
                `${config.API_URL}/users/${id}/reactivate`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchUsers();
        } catch {
            setError("Failed to reactivate user.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {error && (
                <div
                    className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                    role="alert"
                >
                    <span className="block sm:inline">{error}</span>
                    <span
                        className="absolute top-0 bottom-0 right-0 px-4 py-3"
                        onClick={() => setError("")}
                    >
                        <svg
                            className="fill-current h-6 w-6 text-red-500"
                            role="button"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                        >
                            <title>Close</title>
                            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                        </svg>
                    </span>
                </div>
            )}

            {/* Actions Bar */}
            <div className="mb-4 bg-white shadow-md rounded-lg p-4">
                <div className="flex flex-wrap gap-4 items-center">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="flex-grow min-w-64 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                        value={statusFilter}
                        onChange={handleFilterChange}
                        className="min-w-36 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="All">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                    <div className="flex-grow"></div>
                    <button
                        onClick={fetchUsers}
                        className="p-2 rounded-full bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        title="Refresh list"
                    >
                        <FaSync />
                    </button>
                    <button
                        onClick={() => setOpenDialog(true)}
                        className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <FaUserPlus className="mr-2 inline-block" />
                        Add User
                    </button>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Name
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Role
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Email
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Institution
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Status
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers
                            .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                            )
                            .map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {user.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                user.role === "Super Admin"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-gray-100 text-gray-800"
                                            }`}
                                        >
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {user.institution
                                            ? user.institution.name
                                            : "N/A"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                user.status === "Active"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <button
                                            onClick={() => handleEditUser(user)}
                                            className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
                                            title="Edit user"
                                        >
                                            <FaEdit />
                                        </button>
                                        {user.status === "Active" && currentUser.id !== user.id && (
                                            <button
                                                onClick={() => handleDeactivateUser(user.id)}
                                                className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                title="Deactivate user"
                                            >
                                                <FaUserSlash />
                                            </button>
                                        )}
                                        {user.status === "Inactive" && (
                                            <button
                                                onClick={() => handleReactivateUser(user.id)}
                                                className="p-2 rounded-full bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                                title="Reactivate user"
                                            >
                                                <FaUser />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>

                {filteredUsers.length === 0 && !loading && (
                    <div className="p-4 text-center text-gray-500">
                        No users found
                    </div>
                )}

                {/* Pagination */}
                <div className="px-4 py-3 bg-gray-50 flex items-center justify-between border-t border-gray-200">
                    <div className="flex-1 flex justify-between">
                        <button
                            onClick={() => handleChangePage(page - 1)}
                            disabled={page === 0}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => handleChangePage(page + 1)}
                            disabled={
                                page >=
                                Math.ceil(filteredUsers.length / rowsPerPage) -
                                    1
                            }
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                    <div className="flex items-center">
                        <span className="text-sm text-gray-700 mr-2">
                            Page <span className="font-medium">{page + 1}</span>{" "}
                            of{" "}
                            <span className="font-medium">
                                {Math.ceil(filteredUsers.length / rowsPerPage)}
                            </span>
                        </span>
                        <select
                            value={rowsPerPage}
                            onChange={handleChangeRowsPerPage}
                            className="ml-2 pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading && (
                <div className="flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            )}

            <UserDialog
                openDialog={openDialog}
                onClose={() => {
                    setOpenDialog(false);
                    setEditingUser(null);
                }}
                editingUser={editingUser}
                onUserUpdated={handleUserUpdated}
            />
        </div>
    );
};

export default UserManagement;
