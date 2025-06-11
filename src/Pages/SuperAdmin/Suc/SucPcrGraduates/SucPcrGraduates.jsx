/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
    GraduationCap,
    MoreHorizontal,
    ArrowLeft,
    X,
    Eye,
    User,
    Search,
    Filter,
    Download,
    Plus,
    TrendingUp,
    Edit,
    Calendar,
    Upload,
    Trash,
} from "lucide-react";
import Popper from "../../../../Components/Popper";
import GraduateDetailsView from "./GraduateDetailsView";
import AddGraduateForm from "./AddGraduateForm";
import EditGraduateForm from "./EditGraduateForm";
import GraduateUploadModal from "./GraduateUploadModal";
import Pagination from "../../../../Components/Pagination";
import config from "../../../../utils/config";
import axios from "axios";
import Swal from "sweetalert2";

function SucPcrGraduates() {
    const { SucDetailId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const heiName = location.state?.heiName || "Unknown Institution";

    const [graduates, setGraduates] = useState([]);
    const [filteredGraduates, setFilteredGraduates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedGraduate, setSelectedGraduate] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [addLoading, setAddLoading] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [exportLoading, setExportLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterYear, setFilterYear] = useState("ALL");

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Fetch graduates when component mounts
    useEffect(() => {
        fetchGraduates();
    }, []);

    // Filter graduates based on search and filters
    useEffect(() => {
        let filtered = graduates;

        if (searchTerm) {
            filtered = filtered.filter(
                (graduate) =>
                    graduate.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    graduate.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    graduate.student_id?.toString().includes(searchTerm.toLowerCase()) ||
                    graduate.program_name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterYear !== "ALL") {
            filtered = filtered.filter(
                (graduate) => graduate.report_year === parseInt(filterYear)
            );
        }

        setFilteredGraduates(filtered);
        setCurrentPage(1);
    }, [graduates, searchTerm, filterYear]);

    // Calculate paginated data
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return filteredGraduates.slice(startIndex, endIndex);
    }, [filteredGraduates, currentPage, pageSize]);

    // Calculate total pages
    const totalPages = Math.ceil(filteredGraduates.length / pageSize);

    const fetchGraduates = async () => {
        if (!SucDetailId) {
            console.error("SucDetailId is undefined. Cannot fetch graduates.");
            setError("Invalid institution ID. Please check the URL or try again.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError("");
        try {
            const response = await axios.get(`${config.API_URL}/suc-pcr-graduates`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    Accept: "application/json",
                },
                params: {
                    suc_details_id: SucDetailId
                }
            });

            const graduateData = Array.isArray(response.data)
                ? response.data
                : response.data.data || [];
            setGraduates(graduateData);
            setFilteredGraduates(graduateData);
            console.log("Fetched graduates:", graduateData);
        } catch (err) {
            console.error("Error fetching graduates:", err);
            setError("Failed to load graduates. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleExportToExcel = useCallback(async () => {
        try {
            setExportLoading(true);

            Swal.fire({
                title: "Confirm Export",
                text: `Do you want to export Graduates List for ${heiName}?`,
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Export",
                cancelButtonText: "Cancel",
                customClass: {
                    popup: "swal2-popup",
                    title: "text-lg font-semibold text-gray-900",
                    content: "text-gray-600",
                },
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        // TODO: Implement Excel export logic here
                        Swal.fire({
                            title: "Success!",
                            text: "Graduates list exported successfully.",
                            icon: "success",
                            timer: 4000,
                            showConfirmButton: false,
                        });
                    } catch (error) {
                        console.error("Error exporting graduates:", error);
                        Swal.fire({
                            title: "Error!",
                            text: "Failed to export graduates list. Please try again.",
                            icon: "error",
                            confirmButtonText: "OK",
                        });
                    }
                }
                setExportLoading(false);
            });
        } catch (error) {
            console.error("Error in export function:", error);
            setExportLoading(false);
        }
    }, [graduates, heiName]);

    const handleUploadGraduates = () => {
        setIsUploadModalOpen(true);
    };

    const handleViewDetails = (graduate) => {
        setSelectedGraduate(graduate);
        setIsDetailModalOpen(true);
    };

    const handleEdit = (graduate) => {
        setSelectedGraduate(graduate);
        setIsEditModalOpen(true);
    };

    const handleAddGraduate = () => {
        setIsAddModalOpen(true);
    };

    const handleSaveGraduate = async (graduateData) => {
        setAddLoading(true);
        try {
            const response = await axios.post(
                `${config.API_URL}/suc-pcr-graduates`,
                { ...graduateData, suc_details_id: SucDetailId },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 201) {
                const newGraduate = response.data;
                setGraduates((prev) => [...prev, newGraduate]);
                setIsAddModalOpen(false);
                console.log("Graduate created successfully:", newGraduate);
            }
        } catch (err) {
            console.error("Error creating graduate:", err);
            setError("Failed to create graduate. Please try again.");
        } finally {
            setAddLoading(false);
        }
    };

    const handleUpdateGraduate = async (updatedGraduateData) => {
        setEditLoading(true);
        try {
            const response = await axios.put(
                `${config.API_URL}/suc-pcr-graduates/${updatedGraduateData.id}`,
                updatedGraduateData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                const updatedGraduate = response.data;
                setGraduates((prev) =>
                    prev.map((graduate) =>
                        graduate.id === updatedGraduate.id
                            ? updatedGraduate
                            : graduate
                    )
                );
                setIsEditModalOpen(false);
                setSelectedGraduate(null);
                console.log("Graduate updated successfully:", updatedGraduate);
            }
        } catch (err) {
            console.error("Error updating graduate:", err);
            setError("Failed to update graduate. Please try again.");
        } finally {
            setEditLoading(false);
        }
    };

    const handleDelete = async (graduateId) => {
        try {
            const response = await axios.delete(
                `${config.API_URL}/suc-pcr-graduates/${graduateId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        Accept: "application/json",
                    },
                }
            );

            if (response.status === 200) {
                setGraduates((prev) =>
                    prev.filter((graduate) => graduate.id !== graduateId)
                );
                console.log("Graduate deleted successfully.");
            }
        } catch (err) {
            console.error("Error deleting graduate:", err);
            setError("Failed to delete graduate. Please try again.");
        }
    };

    const handleBack = () => {
        navigate("/super-admin/institutions/suc");
    };

    const closeDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedGraduate(null);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedGraduate(null);
    };

    const closeUploadModal = () => {
        setIsUploadModalOpen(false);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-PH", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // Pagination handlers
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (newPageSize) => {
        setPageSize(newPageSize);
        setCurrentPage(1);
    };

    // Calculate display range for current page
    const getDisplayRange = () => {
        const startIndex = (currentPage - 1) * pageSize + 1;
        const endIndex = Math.min(
            currentPage * pageSize,
            filteredGraduates.length
        );
        return { startIndex, endIndex };
    };

    const { startIndex, endIndex } = getDisplayRange();

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
                                Graduates Management
                            </h1>
                            <p className="text-gray-600 flex items-center">
                                <GraduationCap className="w-4 h-4 mr-2" />
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
                                            placeholder="Search graduates..."
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
                                            value={filterYear}
                                            onChange={(e) => {
                                                setFilterYear(e.target.value);
                                            }}
                                            className="pl-10 pr-8 py-2 w-full sm:w-auto border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm appearance-none cursor-pointer transition-all duration-200"
                                        >
                                            <option value="ALL">All Years</option>
                                            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                                                <option key={year} value={year}>
                                                    {year}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-2 w-full xl:w-auto">
                                    <button
                                        onClick={handleExportToExcel}
                                        disabled={exportLoading || graduates.length === 0}
                                        className="inline-flex items-center justify-center px-4 py-2 bg-white/50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-white hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        {exportLoading ? "Exporting..." : "Export Excel"}
                                    </button>
                                    <button
                                        onClick={handleUploadGraduates}
                                        className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg text-sm font-medium hover:from-green-700 hover:to-green-800 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <Upload className="w-4 h-4 mr-2" />
                                        Upload Excel
                                    </button>
                                    <button
                                        onClick={handleAddGraduate}
                                        className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Graduate
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm text-gray-500">
                                <div className="flex items-center">
                                    <TrendingUp className="w-4 h-4 mr-1" />
                                    Showing{" "}
                                    {filteredGraduates.length > 0
                                        ? startIndex
                                        : 0}{" "}
                                    to {endIndex} of {filteredGraduates.length}{" "}
                                    graduates
                                    {filteredGraduates.length !==
                                        graduates.length && (
                                        <span className="text-blue-600 ml-1">
                                            (filtered from {graduates.length}{" "}
                                            total)
                                        </span>
                                    )}
                                </div>
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
                                    Loading graduates...
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Graduates Table */}
                        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 overflow-hidden mb-6">
                            <div className="overflow-x-auto">
                                <div className="min-w-full">
                                    {/* Table Header */}
                                    <div className="bg-gradient-to-r from-gray-50/80 to-blue-50/50 border-b border-gray-200/50 sticky top-0 z-10">
                                        <table className="min-w-full table-fixed">
                                            <thead>
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        Student Information
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        Program Details
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        Graduation Details
                                                    </th>
                                                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                        </table>
                                    </div>

                                    {/* Table Body */}
                                    <div
                                        className="max-h-[400px] overflow-y-auto overflow-x-hidden relative"
                                        style={{
                                            scrollBehavior: "smooth",
                                            scrollbarWidth: "thin",
                                            scrollbarColor: "#CBD5E1 #F1F5F9",
                                        }}
                                    >
                                        <table className="min-w-full table-fixed">
                                            <tbody className="divide-y divide-gray-200/30">
                                                {paginatedData.map(
                                                    (graduate, index) => (
                                                        <tr
                                                            key={graduate.id}
                                                            className={`hover:bg-blue-50/30 transition-all duration-200 ${
                                                                index % 2 === 0
                                                                    ? "bg-white/30"
                                                                    : "bg-gray-50/30"
                                                            }`}
                                                        >
                                                            <td className="px-4 py-4" style={{ width: "320px" }}>
                                                                <div className="flex items-center">
                                                                    <div className="flex-shrink-0 h-10 w-10">
                                                                        <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-200 text-purple-700">
                                                                            <User className="w-5 h-5" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="ml-4 min-w-0 flex-1">
                                                                        <div className="text-sm font-semibold text-gray-900">
                                                                            {`${graduate.last_name}, ${graduate.first_name} ${graduate.middle_name || ''}`}
                                                                        </div>
                                                                        <div className="text-xs text-gray-500">
                                                                            ID: {graduate.student_id}
                                                                        </div>
                                                                        <div className="text-xs text-gray-500">
                                                                            DOB: {formatDate(graduate.date_of_birth)}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-4" style={{ width: "256px" }}>
                                                                <div className="space-y-2">
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {graduate.program_name || "N/A"}
                                                                    </div>
                                                                    {graduate.program_major && (
                                                                        <div className="text-xs text-blue-600">
                                                                            Major: {graduate.program_major}
                                                                        </div>
                                                                    )}
                                                                    <div className="text-xs text-gray-600">
                                                                        ATO: {graduate.program_authority_to_operate_graduate || "N/A"}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-4" style={{ width: "224px" }}>
                                                                <div className="space-y-1">
                                                                    <div className="text-sm font-medium text-gray-900 flex items-center">
                                                                        <Calendar className="w-3 h-3 mr-1 text-gray-400 flex-shrink-0" />
                                                                        <span>
                                                                            {formatDate(graduate.date_graduated)}
                                                                        </span>
                                                                    </div>
                                                                    <div className="text-xs text-gray-600">
                                                                        Year Granted: {graduate.year_granted || "N/A"}
                                                                    </div>
                                                                    <div className="text-xs text-gray-600">
                                                                        Report Year: {graduate.report_year}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-4 text-center" style={{ width: "128px" }}>
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
                                                                            onClick={() =>
                                                                                handleViewDetails(graduate)
                                                                            }
                                                                            className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 focus:outline-none focus:bg-blue-50 transition-colors duration-150 group"
                                                                            role="menuitem"
                                                                        >
                                                                            <Eye className="w-4 h-4 mr-3 text-blue-500 group-hover:text-blue-600" />
                                                                            View Details
                                                                        </button>
                                                                        <button
                                                                            onClick={() =>
                                                                                handleEdit(graduate)
                                                                            }
                                                                            className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-green-50 focus:outline-none focus:bg-green-50 transition-colors duration-150 group"
                                                                            role="menuitem"
                                                                        >
                                                                            <Edit className="w-4 h-4 mr-3 text-green-500 group-hover:text-green-600" />
                                                                            Edit Graduate
                                                                        </button>
                                                                        <button
                                                                            onClick={() =>
                                                                                handleDelete(graduate.id)
                                                                            }
                                                                            className="flex items-center w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50 focus:outline-none focus:bg-red-50 transition-colors duration-150"
                                                                            role="menuitem"
                                                                        >
                                                                            <Trash className="w-4 h-4 mr-3 text-red-700 group-hover:text-green-600" />
                                                                            Delete Graduate
                                                                        </button>
                                                                    </div>
                                                                </Popper>
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                                {paginatedData.length === 0 && (
                                                    <tr>
                                                        <td colSpan="4" className="px-6 py-12 text-center">
                                                            <div className="text-gray-500">
                                                                <div className="mx-auto h-20 w-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                                                                    <GraduationCap className="w-10 h-10 text-gray-400" />
                                                                </div>

                                                                <div className="mb-4">
                                                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                                        {searchTerm || filterYear !== "ALL"
                                                                            ? "No graduates found"
                                                                            : "No graduates available"}
                                                                    </h3>
                                                                    <p className="text-gray-600">
                                                                        {searchTerm || filterYear !== "ALL"
                                                                            ? "Try adjusting your search or filter criteria"
                                                                            : "Get started by adding your first graduate"}
                                                                    </p>
                                                                </div>

                                                                {!searchTerm && filterYear === "ALL" && (
                                                                    <div className="space-y-3">
                                                                        <button
                                                                            onClick={handleAddGraduate}
                                                                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 shadow-sm hover:shadow-md transition-all duration-200 mr-3"
                                                                        >
                                                                            <Plus className="w-4 h-4 mr-2" />
                                                                            Add Graduate
                                                                        </button>
                                                                        <button
                                                                            onClick={handleUploadGraduates}
                                                                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg text-sm font-medium hover:from-green-700 hover:to-green-800 shadow-sm hover:shadow-md transition-all duration-200"
                                                                        >
                                                                            <Upload className="w-4 h-4 mr-2" />
                                                                            Upload Excel
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pagination */}
                        {filteredGraduates.length > 0 && (
                            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-sm">
                                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                    <div className="text-sm text-gray-700">
                                        Showing {startIndex} to {endIndex} of{" "}
                                        {filteredGraduates.length} results
                                        {filteredGraduates.length !==
                                            graduates.length && (
                                            <span className="text-blue-600 ml-1">
                                                (filtered from {graduates.length}{" "}
                                                total)
                                            </span>
                                        )}
                                    </div>
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
                                        pageSize={pageSize}
                                        onPageSizeChange={handlePageSizeChange}
                                        pageSizeOptions={[5, 10, 20, 50]}
                                        showFirstLast={true}
                                        showPageSize={true}
                                        maxPageButtons={5}
                                        className="flex-shrink-0"
                                    />
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Graduate Detail Modal */}
                <GraduateDetailsView
                    isOpen={isDetailModalOpen}
                    onClose={closeDetailModal}
                    graduateData={selectedGraduate}
                />

                {/* Add Graduate Modal */}
                <AddGraduateForm
                    isOpen={isAddModalOpen}
                    onClose={closeAddModal}
                    onSave={handleSaveGraduate}
                    institutionId={SucDetailId}
                    loading={addLoading}
                />

                {/* Edit Graduate Modal */}
                <EditGraduateForm
                    isOpen={isEditModalOpen}
                    onClose={closeEditModal}
                    onSave={handleUpdateGraduate}
                    graduateData={selectedGraduate}
                    loading={editLoading}
                />

                {/* Upload Graduates Modal */}
                <GraduateUploadModal
                    isOpen={isUploadModalOpen}
                    onClose={closeUploadModal}
                    institutionId={SucDetailId}
                    onUploadSuccess={fetchGraduates}
                />
            </div>
        </div>
    );
}

export default SucPcrGraduates;
