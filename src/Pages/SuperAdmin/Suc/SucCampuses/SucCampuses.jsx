/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
    Building2,
    MoreHorizontal,
    ArrowLeft,
    X,
    Eye,
    MapPin,
    User,
    Globe,
    Search,
    Filter,
    Plus,
    TrendingUp,
    Edit,
    Trash,
} from "lucide-react";
import Popper from "../../../../Components/Popper";
import CampusDetailsView from "./CampusDetailsView"; // Import the separate component
import AddCampusForm from "./AddCampusForm"; // Import the add campus form
import EditCampusForm from "./EditCampusForm"; // Import the edit campus form
import config from "../../../../utils/config";
import axios from "axios"; // Ensure axios is imported

function SucCampuses() {
    const { SucDetailId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const heiName = location.state?.heiName || "Unknown Institution";

    const [campuses, setCampuses] = useState([]);
    const [filteredCampuses, setFilteredCampuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedCampus, setSelectedCampus] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [addLoading, setAddLoading] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("ALL");

    // Fetch campuses when component mounts
    useEffect(() => {
        fetchCampuses();
    }, []);

    // Filter campuses based on search and type
    useEffect(() => {
        let filtered = campuses;

        if (searchTerm) {
            filtered = filtered.filter(
                (campus) =>
                    campus.name
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    campus.municipality
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    campus.head_name
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
        }

        if (filterType !== "ALL") {
            filtered = filtered.filter(
                (campus) => campus.campus_type === filterType
            );
        }

        setFilteredCampuses(filtered);
    }, [campuses, searchTerm, filterType]);

    const fetchCampuses = async () => {
        if (!SucDetailId) {
            console.error("SucDetailId is undefined. Cannot fetch campuses.");
            setError(
                "Invalid institution ID. Please check the URL or try again."
            );
            setLoading(false);
            return;
        }

        setLoading(true);
        setError("");
        try {
            const response = await axios.get(`${config.API_URL}/suc-campuses`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    Accept: "application/json",
                },
                params: {
                    suc_details_id: SucDetailId,
                },
            });

            const campusData = Array.isArray(response.data)
                ? response.data
                : response.data.data || [];
            setCampuses(campusData);
            setFilteredCampuses(campusData);
            console.log("Fetched campuses:", campusData);

        } catch (err) {
            console.error("Error fetching campuses:", err);
            setError("Failed to load campuses. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (campus) => {
        setSelectedCampus(campus);
        setIsDetailModalOpen(true);
    };

    const handleEdit = (campus) => {
        setSelectedCampus(campus);
        setIsEditModalOpen(true);
    };

    const handleUpdateCampus = async (updatedCampusData) => {
        setEditLoading(true);
        try {
            const response = await axios.put(`${config.API_URL}/suc-campuses/${updatedCampusData.id}`, updatedCampusData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                // Update the campus in the list
                const updatedCampus = response.data;
                setCampuses(prev => prev.map(campus =>
                    campus.id === updatedCampus.id ? updatedCampus : campus
                ));
                setFilteredCampuses(prev => prev.map(campus =>
                    campus.id === updatedCampus.id ? updatedCampus : campus
                ));

                // Close the modal and show success message
                setIsEditModalOpen(false);
                setSelectedCampus(null);
                console.log("Campus updated successfully:", updatedCampus);

                // You can add a toast notification here if you have one
                // toast.success("Campus updated successfully!");
            }
        } catch (err) {
            console.error("Error updating campus:", err);
            setError("Failed to update campus. Please try again.");

            // You can add a toast notification here if you have one
            // toast.error("Failed to update campus. Please try again.");
        } finally {
            setEditLoading(false);
        }
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedCampus(null);
    };

    const handleAddCampus = () => {
        setIsAddModalOpen(true);
    };

    const handleSaveCampus = async (campusData) => {
        setAddLoading(true);
        try {
            const response = await axios.post(`${config.API_URL}/suc-campuses`, campusData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 201) {
                // Add the new campus to the list
                const newCampus = response.data;
                setCampuses(prev => [...prev, newCampus]);
                setFilteredCampuses(prev => [...prev, newCampus]);

                // Close the modal and show success message
                setIsAddModalOpen(false);
                console.log("Campus created successfully:", newCampus);

                // You can add a toast notification here if you have one
                // toast.success("Campus created successfully!");
            }
        } catch (err) {
            console.error("Error creating campus:", err);
            setError("Failed to create campus. Please try again.");

            // You can add a toast notification here if you have one
            // toast.error("Failed to create campus. Please try again.");
        } finally {
            setAddLoading(false);
        }
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
    };

    const handleDelete = async (campusId) => {
        if (!window.confirm("Are you sure you want to delete this campus?"))
            return;

        try {
            const response = await axios.delete(
                `${config.API_URL}/suc-campus/${campusId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        Accept: "application/json",
                    },
                }
            );

            if (response.status === 200) {
                setCampuses(campuses.filter((campus) => campus.id !== campusId));
            } else {
                throw new Error("Failed to delete campus");
            }
        } catch (err) {
            console.error("Error deleting campus:", err);
            setError("Failed to delete campus. Please try again.");
        }
    };

    const handleBack = () => {
        navigate("/super-admin/institutions/suc");
    };

    const closeDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedCampus(null);
    };

    useEffect(() => {
        console.log("Institution Name:", heiName);
    }, [heiName]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
            <div className="p-6 max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center mb-4">
                        <button
                            onClick={handleBack}
                            className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            title="Back to SUC List"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Campus Management
                            </h1>
                            <p className="text-gray-600 flex items-center">
                                <Building2 className="w-4 h-4 mr-2" />
                                {heiName}
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
                                            placeholder="Search campuses..."
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
                                            <option value="ALL">
                                                All Types
                                            </option>
                                            <option value="MAIN">
                                                Main Campus
                                            </option>
                                            <option value="SATELLITE">
                                                Satellite Campus
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-2 w-full xl:w-auto">
                                    <button
                                        onClick={handleAddCampus}
                                        className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Campus
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center text-sm text-gray-500">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                Showing {filteredCampuses.length} of{" "}
                                {campuses.length} campuses
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
                                    Loading campuses...
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Campus Table with Fixed Height and Aligned Columns */
                    <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 overflow-hidden">
                        {/* Single Table with Fixed Layout */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-fixed">
                                {/* Table Header */}
                                <thead className="bg-gradient-to-r from-gray-50/80 to-blue-50/50 border-b border-gray-200/50 sticky top-0 z-10">
                                    <tr>
                                        <th className="w-[300px] px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Campus Information
                                        </th>
                                        <th className="w-[200px] px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Type & Code
                                        </th>
                                        <th className="w-[250px] px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Location
                                        </th>
                                        <th className="w-[200px] px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Leadership
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
                                    {filteredCampuses.map((campus, index) => (
                                        <tr
                                            key={campus.id}
                                            className={`hover:bg-blue-50/30 transition-all duration-200 ${
                                                index % 2 === 0
                                                    ? "bg-white/30"
                                                    : "bg-gray-50/30"
                                            }`}
                                        >
                                            <td className="w-[300px] px-4 py-4">
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 h-8 w-8 mt-1">
                                                        <div
                                                            className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                                                                campus.campus_type === "MAIN"
                                                                    ? "bg-gradient-to-br from-green-100 to-green-200 text-green-700"
                                                                    : "bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700"
                                                            }`}
                                                        >
                                                            <Building2 className="w-4 h-4" />
                                                        </div>
                                                    </div>
                                                    <div className="ml-3 min-w-0 flex-1">
                                                        <div className="text-xs font-semibold text-gray-900 leading-tight break-words">
                                                            {campus.name}
                                                        </div>
                                                        <div className="text-[10px] text-gray-500 mt-1">
                                                            Campus ID: {campus.id}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="w-[200px] px-4 py-4">
                                                <div className="space-y-2">
                                                    <span
                                                        className={`inline-flex px-2 py-1 text-[10px] font-semibold rounded-full shadow-sm ${
                                                            campus.campus_type === "MAIN"
                                                                ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300"
                                                                : "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300"
                                                        }`}
                                                    >
                                                        {campus.campus_type}
                                                    </span>
                                                    <div className="text-[10px] text-gray-600 font-mono break-words leading-tight">
                                                        {campus.institutional_code || "No Code"}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="w-[250px] px-4 py-4">
                                                <div className="space-y-1">
                                                    <div className="text-xs font-medium text-gray-900 flex items-start">
                                                        <MapPin className="w-3 h-3 mr-1 text-gray-400 flex-shrink-0 mt-0.5" />
                                                        <span className="break-words leading-tight">
                                                            {campus.province_municipality}
                                                        </span>
                                                    </div>
                                                    <div className="text-[10px] text-gray-600 break-words leading-tight ml-4">
                                                        {campus.region}
                                                    </div>
                                                    {campus.latitude && campus.longitude && (
                                                        <div className="text-[10px] text-green-600 flex items-center ml-4">
                                                            <Globe className="w-2.5 h-2.5 mr-1 flex-shrink-0" />
                                                            <span>Geo-located</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="w-[200px] px-4 py-4">
                                                <div className="space-y-1">
                                                    <div className="text-xs font-medium text-gray-900 flex items-start">
                                                        <User className="w-3 h-3 mr-1 text-gray-400 flex-shrink-0 mt-0.5" />
                                                        <span className="break-words leading-tight">
                                                            {campus.head_full_name || "Not assigned"}
                                                        </span>
                                                    </div>
                                                    <div className="text-[10px] text-gray-600 break-words leading-tight ml-4">
                                                        {campus.position_title || "No title"}
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
                                                    placement="bottom-end"
                                                    className="w-40 bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-lg"
                                                    offset={[0, 4]}
                                                    usePortal={true}
                                                >
                                                    <div className="py-2">
                                                        <button
                                                            onClick={() => handleViewDetails(campus)}
                                                            className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 focus:outline-none focus:bg-blue-50 transition-colors duration-150 group"
                                                            role="menuitem"
                                                        >
                                                            <Eye className="w-4 h-4 mr-3 text-blue-500 group-hover:text-blue-600" />
                                                            View Details
                                                        </button>
                                                        <button
                                                            onClick={() => handleEdit(campus)}
                                                            className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-green-50 focus:outline-none focus:bg-green-50 transition-colors duration-150 group"
                                                            role="menuitem"
                                                        >
                                                            <Edit className="w-4 h-4 mr-3 text-green-500 group-hover:text-green-600" />
                                                            Edit Campus
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(campus.id)}
                                                            className="flex items-center w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50 focus:outline-none focus:bg-red-50 transition-colors duration-150"
                                                            role="menuitem"
                                                        >
                                                            <Trash className="w-4 h-4 mr-3 text-red-700 group-hover:text-red-600" />
                                                            Delete Campus
                                                        </button>
                                                    </div>
                                                </Popper>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredCampuses.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center">
                                                <div className="text-gray-500">
                                                    <div className="mx-auto h-20 w-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                                                        <Building2 className="w-10 h-10 text-gray-400" />
                                                    </div>
                                                    <p className="text-lg font-semibold text-gray-900 mb-2">
                                                        {searchTerm || filterType !== "ALL"
                                                            ? "No matching campuses found"
                                                            : "No Campuses Found"}
                                                    </p>
                                                    <p className="text-sm text-gray-600 mb-4">
                                                        {searchTerm || filterType !== "ALL"
                                                            ? "Try adjusting your search terms or filters."
                                                            : "This institution has no campuses registered yet."}
                                                    </p>
                                                    {!searchTerm && filterType === "ALL" && (
                                                        <button
                                                            onClick={handleAddCampus}
                                                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 shadow-sm hover:shadow-md transition-all duration-200"
                                                        >
                                                            <Plus className="w-4 h-4 mr-2" />
                                                            Add First Campus
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

                {/* Campus Detail Modal using separate component */}
                <CampusDetailsView
                    isOpen={isDetailModalOpen}
                    onClose={closeDetailModal}
                    campusData={selectedCampus}
                />

                {/* Add Campus Modal using separate component */}
                <AddCampusForm
                    isOpen={isAddModalOpen}
                    onClose={closeAddModal}
                    onSave={handleSaveCampus}
                    institutionId={SucDetailId}
                    loading={addLoading}
                />

                {/* Edit Campus Modal using separate component */}
                <EditCampusForm
                    isOpen={isEditModalOpen}
                    onClose={closeEditModal}
                    onSave={handleUpdateCampus}
                    campusData={selectedCampus}
                    loading={editLoading}
                />
            </div>
        </div>
    );
}

export default SucCampuses;