import { useState, useEffect } from "react";
import {
    MoreHorizontal,
    X,
    Eye,
    Search,
    Filter,
    Plus,
    TrendingUp,
    Edit,
    Trash,
    Building2,
} from "lucide-react";
import axios from "axios";
import config from "../../../utils/config";
import Popper from "../../../Components/Popper";
import HeiDetailsModal from "./HeiDetailsModal"; // New component
import AddHeiForm from "./AddHeiForm"; // New component
import EditHeiForm from "./EditHeiForm"; // New component


function HeiManagement() {
    const [heis, setHeis] = useState([]);
    const [filteredHeis, setFilteredHeis] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedHei, setSelectedHei] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [addLoading, setAddLoading] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("ALL"); // For HEI type filter

    useEffect(() => {
        fetchHeis();
    }, []);

    useEffect(() => {
        let filtered = heis;

        if (searchTerm) {
            filtered = filtered.filter(
                (hei) =>
                    hei.name
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    hei.uiid
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
        }

        if (filterType !== "ALL") {
            filtered = filtered.filter((hei) => hei.type === filterType);
        }

        setFilteredHeis(filtered);
    }, [heis, searchTerm, filterType]);

    const fetchHeis = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await axios.get(`${config.API_URL}/admin/heis`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    Accept: "application/json",
                },
            });

            const heiData = Array.isArray(response.data)
                ? response.data
                : response.data.data || [];
            setHeis(heiData);
            setFilteredHeis(heiData);
            console.log("Fetched HEIs:", heiData);
        } catch (err) {
            console.error("Error fetching HEIs:", err);
            setError("Failed to load HEIs. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (hei) => {
        setSelectedHei(hei);
        setIsDetailModalOpen(true);
    };

    const handleEdit = (hei) => {
        setSelectedHei(hei);
        setIsEditModalOpen(true);
    };

    const handleUpdateHei = async (updatedHeiData) => {
        setEditLoading(true);
        try {
            const response = await axios.put(
                `${config.API_URL}/admin/heis/${updatedHeiData.id}`,
                updatedHeiData,
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
                const updatedHei = response.data;
                setHeis((prev) =>
                    prev.map((hei) =>
                        hei.id === updatedHei.id ? updatedHei : hei
                    )
                );
                setFilteredHeis((prev) =>
                    prev.map((hei) =>
                        hei.id === updatedHei.id ? updatedHei : hei
                    )
                );

                setIsEditModalOpen(false);
                setSelectedHei(null);
                console.log("Hei updated successfully:", updatedHei);
            }
        } catch (err) {
            console.error("Error updating HEI:", err);
            setError("Failed to update HEI. Please try again.");
        } finally {
            setEditLoading(false);
        }
    };

    const handleDelete = async (heiId) => {
        if (!window.confirm("Are you sure you want to delete this HEI?"))
            return;

        try {
            const response = await axios.delete(
                `${config.API_URL}/admin/heis/${heiId}`,
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
                setHeis(heis.filter((hei) => hei.id !== heiId));
                setFilteredHeis(
                    filteredHeis.filter((hei) => hei.id !== heiId)
                );
                console.log("Hei deleted successfully:", heiId);
            } else {
                throw new Error("Failed to delete HEI");
            }
        } catch (err) {
            console.error("Error deleting HEI:", err);
            setError("Failed to delete HEI. Please try again.");
        }
    };

    const handleAddHei = () => {
        setIsAddModalOpen(true);
    };

    const handleSaveHei = async (heiData) => {
        setAddLoading(true);
        try {
            const response = await axios.post(
                `${config.API_URL}/admin/heis`, // Assuming this is the correct endpoint for adding HEIs
                heiData,
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
                const newHei = response.data;
                setHeis((prev) => [...prev, newHei]);
                setFilteredHeis((prev) => [...prev, newHei]);

                setIsAddModalOpen(false);
                console.log("Hei created successfully:", newHei);
                fetchHeis();
            }
        } catch (err) {
            console.error("Error creating HEI:", err);
            setError("Failed to create HEI. Please try again.");
        } finally {
            setAddLoading(false);
        }
    };

    const closeDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedHei(null);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedHei(null);
    };

    const getTypeColor = (type) => {
        switch (type) {
            case "SUC":
                return "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300";
            case "LUC":
                return "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300";
            case "Private":
                return "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300";
            default:
                return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300";
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
            <div className="p-6 max-w-7xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center mb-4">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                HEI Management
                            </h1>
                            <p className="text-gray-600 flex items-center">
                                <Building2 className="w-4 h-4 mr-2" />
                                Manage Higher Education Institutions
                            </p>
                        </div>
                    </div>

                    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-sm mb-6">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center">
                                <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full xl:w-auto">
                                    <div className="relative flex-1 sm:flex-initial">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="Search HEIs..."
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
                                            value={filterType}
                                            onChange={(e) =>
                                                setFilterType(e.target.value)
                                            }
                                            className="pl-10 pr-8 py-2 w-full sm:w-auto border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm appearance-none cursor-pointer transition-all duration-200"
                                        >
                                            <option value="ALL">All Types</option>
                                            <option value="SUC">SUC</option>
                                            <option value="LUC">LUC</option>
                                            <option value="Private">Private</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-2 w-full xl:w-auto">
                                    <button
                                        onClick={handleAddHei}
                                        className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add HEI
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center text-sm text-gray-500">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                Showing {filteredHeis.length} of {heis.length}{" "}
                                HEIs
                            </div>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-800 rounded-xl shadow-sm">
                        <div className="flex items-center">
                            <X className="w-5 h-5 mr-2" />
                            {error}
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="flex items-center justify-center p-12">
                        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 shadow-sm">
                            <div className="flex flex-col items-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                                <span className="text-gray-600 font-medium">
                                    Loading HEIs...
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-fixed">
                                <thead className="bg-gradient-to-r from-gray-50/80 to-blue-50/50 border-b border-gray-200/50 sticky top-0 z-10">
                                    <tr>
                                        <th className="w-[300px] px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            HEI Information
                                        </th>
                                        <th className="w-[200px] px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="w-[250px] px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Contact
                                        </th>
                                        <th className="w-[120px] px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                            </table>
                        </div>

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
                                    {filteredHeis.map((hei, index) => (
                                        <tr
                                            key={`hei-${hei.id}-${index}`}
                                            className={`hover:bg-blue-50/30 transition-all duration-200 ${
                                                index % 2 === 0
                                                    ? "bg-white/30"
                                                    : "bg-gray-50/30"
                                            }`}
                                        >
                                            <td className="w-[300px] px-4 py-4">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                                                                <Building2 className="w-5 h-5 text-blue-600" />
                                                            </div>
                                                    </div>
                                                    <div className="ml-3 min-w-0 flex-1">
                                                        <div className="text-sm font-semibold text-gray-900 leading-tight break-words">
                                                            {hei.name}
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            UIID: {hei.uiid}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="w-[200px] px-4 py-4">
                                                <div className="space-y-2">
                                                    <span
                                                        className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full shadow-sm ${getTypeColor(
                                                            hei.type
                                                        )}`}
                                                    >
                                                        <span className="ml-1 capitalize">
                                                            {hei.type}
                                                        </span>
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="w-[250px] px-4 py-4">
                                                <div className="space-y-1">
                                                    <div className="text-xs font-medium text-gray-900 flex items-start">
                                                        {hei.email && (
                                                            <>
                                                                <Building2 className="w-3 h-3 mr-1 text-gray-400 flex-shrink-0 mt-0.5" />
                                                                <span className="break-words leading-tight">
                                                                    {hei.email}
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-gray-600 break-words leading-tight ml-4">
                                                        Created:{" "}
                                                        {hei.created_at
                                                            ? new Date(
                                                                  hei.created_at
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
                                                                    hei
                                                                )
                                                            }
                                                            className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 focus:outline-none focus:bg-blue-50 transition-colors duration-150 group"
                                                        >
                                                            <Eye className="w-4 h-4 mr-3 text-blue-500 group-hover:text-blue-600" />
                                                            View Details
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleEdit(hei)
                                                            }
                                                            className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-green-50 focus:outline-none focus:bg-green-50 transition-colors duration-150 group"
                                                        >
                                                            <Edit className="w-4 h-4 mr-3 text-green-500 group-hover:text-green-600" />
                                                            Edit HEI
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    hei.id
                                                                )
                                                            }
                                                            className="flex items-center w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50 focus:outline-none focus:bg-red-50 transition-colors duration-150"
                                                        >
                                                            <Trash className="w-4 h-4 mr-3 text-red-700 group-hover:text-red-600" />
                                                            Delete HEI
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

                <HeiDetailsModal
                    isOpen={isDetailModalOpen}
                    onClose={closeDetailModal}
                    heiData={selectedHei}
                />

                <AddHeiForm
                    isOpen={isAddModalOpen}
                    onClose={closeAddModal}
                    onSave={handleSaveHei}
                    loading={addLoading}
                />

                <EditHeiForm
                    isOpen={isEditModalOpen}
                    onClose={closeEditModal}
                    onSave={handleUpdateHei}
                    heiData={selectedHei}
                    loading={editLoading}
                />
            </div>
        </div>
    );
}

HeiManagement.propTypes = {
    // Since this is a page component that doesn't receive any props,
    // we don't need to define any prop types
};

export default HeiManagement;