import { useState, useEffect } from "react";
import {
    MoreHorizontal,
    Eye,
    Search,
    Plus,
    Edit,
    Trash,
    Building2,
    MapPin,
} from "lucide-react";
import axios from "axios";
import config from "../../../utils/config";
import Popper from "../../../Components/Popper";
import HeiDetailsModal from "./HeiDetailsModal";
import AddHeiForm from "./AddHeiForm";
import EditHeiForm from "./EditHeiForm";

function HeiManagement() {
    const [heis, setHeis] = useState([]);
    const [clusters, setClusters] = useState([]);
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
    const [filterType, setFilterType] = useState("ALL");
    const [filterCluster, setFilterCluster] = useState("ALL");

    useEffect(() => {
        fetchHeis();
        fetchClusters();
    }, []);

    useEffect(() => {
        let filtered = heis;

        if (searchTerm) {
            filtered = filtered.filter(
                (hei) =>
                    hei.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    hei.uiid?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterType !== "ALL") {
            filtered = filtered.filter((hei) => hei.type === filterType);
        }

        if (filterCluster !== "ALL") {
            filtered = filtered.filter((hei) => hei.cluster_id === parseInt(filterCluster));
        }

        setFilteredHeis(filtered);
    }, [heis, searchTerm, filterType, filterCluster]);

    const fetchClusters = async () => {
        try {
            const response = await axios.get(`${config.API_URL}/clusters`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    Accept: "application/json",
                },
            });
            setClusters(response.data);
        } catch (err) {
            console.error("Error fetching clusters:", err);
            setError("Failed to load clusters. Please try again.");
        }
    };

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
                        <button
                            onClick={handleAddHei}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Add HEI
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search HEIs..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="ALL">All Types</option>
                                <option value="SUC">SUC</option>
                                <option value="LUC">LUC</option>
                                <option value="Private">Private</option>
                            </select>
                            <select
                                value={filterCluster}
                                onChange={(e) => setFilterCluster(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="ALL">All Clusters</option>
                                {clusters.map((cluster) => (
                                    <option key={cluster.id} value={cluster.id}>
                                        {cluster.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading HEIs...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-600">{error}</div>
                    ) : (
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                HEI Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                UIID
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Type
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Cluster
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredHeis.map((hei) => (
                                            <tr key={hei.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {hei.name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">
                                                        {hei.uiid}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(
                                                            hei.type
                                                        )}`}
                                                    >
                                                        {hei.type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <MapPin className="w-4 h-4 mr-1" />
                                                        {clusters.find(c => c.id === hei.cluster_id)?.name || 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <Popper
                                                        trigger={
                                                            <button
                                                                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded-lg p-2 transition-all duration-200"
                                                                title="More Actions"
                                                            >
                                                                <MoreHorizontal className="w-5 h-5" />
                                                            </button>
                                                        }
                                                        className="w-40 bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-lg right-0 top-full mt-1"
                                                    >
                                                        <div className="py-2">
                                                            <button
                                                                onClick={() => handleViewDetails(hei)}
                                                                className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 focus:outline-none focus:bg-blue-50 transition-colors duration-150 group"
                                                            >
                                                                <Eye className="w-4 h-4 mr-3 text-blue-500 group-hover:text-blue-600" />
                                                                View Details
                                                            </button>
                                                            <button
                                                                onClick={() => handleEdit(hei)}
                                                                className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-green-50 focus:outline-none focus:bg-green-50 transition-colors duration-150 group"
                                                            >
                                                                <Edit className="w-4 h-4 mr-3 text-green-500 group-hover:text-green-600" />
                                                                Edit HEI
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(hei.id)}
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
                </div>
            </div>

            <HeiDetailsModal
                isOpen={isDetailModalOpen}
                onClose={closeDetailModal}
                hei={selectedHei}
            />

            <AddHeiForm
                isOpen={isAddModalOpen}
                onClose={closeAddModal}
                onSave={handleSaveHei}
                loading={addLoading}
                clusters={clusters}
            />

            <EditHeiForm
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                onSave={handleUpdateHei}
                hei={selectedHei}
                loading={editLoading}
                clusters={clusters}
            />
        </div>
    );
}

export default HeiManagement;