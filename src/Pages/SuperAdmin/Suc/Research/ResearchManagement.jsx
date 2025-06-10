/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Search, FileUp, FileDown, ArrowLeft, GraduationCap, X, Plus } from "lucide-react";
import axios from "axios";
import config from "../../../../utils/config";
import ResearchTb1Table from "./Tables/ResearchTb1Table";
import ResearchTb2Table from "./Tables/ResearchTb2Table";
import ResearchTb3Table from "./Tables/ResearchTb3Table";
import ResearchTb4Table from "./Tables/ResearchTb4Table";
import ResearchTb5Table from "./Tables/ResearchTb5Table";
import ResearchTbcTable from "./Tables/ResearchTbcTable";
import ResearchDetailModal from "./ResearchDetailModal";
import ResearchUploadModal from "./ResearchUploadModal";
import ResearchAddModal from "./ResearchAddModal";
import Swal from "sweetalert2";

function ResearchManagement() {
    const location = useLocation();
    const navigate = useNavigate();
    const { heiId } = useParams();
    const heiUiid = location.state?.heiUiid || heiId;
    const heiName = location.state?.heiName || "Unknown Institution";

    const [researchData, setResearchData] = useState({
        research_tb1: [],
        research_tb2: [],
        research_tb3: [],
        research_tb4: [],
        research_tb5: [],
        research_tbc: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("ALL");
    const [exportLoading, setExportLoading] = useState(false);
    const [selectedResearch, setSelectedResearch] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useEffect(() => {
        fetchResearchData();
    }, [heiUiid]);

    const fetchResearchData = async () => {
        try {
            setLoading(true);
            setError(null);

            if (!heiUiid) {
                throw new Error("HEI ID is required");
            }

            const response = await axios.get(
                `${config.API_URL}/research/all/${heiUiid}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            setResearchData(response.data);
        } catch (err) {
            setError(err.message || "Failed to fetch research data");
        } finally {
            setLoading(false);
        }
    };

    const handleView = (research) => {
        setSelectedResearch(research);
        setIsDetailModalOpen(true);
    };

    const handleDelete = async (researchId) => {
        try {
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!",
            });

            if (result.isConfirmed) {
                await axios.delete(`${config.API_URL}/research/${researchId}`);
                await fetchResearchData();
                Swal.fire("Deleted!", "Research has been deleted.", "success");
            }
        } catch (error) {
            console.error("Error deleting research:", error);
            Swal.fire("Error!", "Failed to delete research.", "error");
        }
    };

    const handleExport = async () => {
        try {
            setExportLoading(true);
            const response = await axios.get(
                `${config.API_URL}/research/export/${heiUiid}`,
                {
                    responseType: "blob",
                }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `research_data_${heiUiid}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error exporting research:", error);
            Swal.fire("Error!", "Failed to export research data.", "error");
        } finally {
            setExportLoading(false);
        }
    };

    const handleUpload = () => {
        setIsUploadModalOpen(true);
    };

    const handleAdd = () => {
        setIsAddModalOpen(true);
    };

    const handleBack = () => {
        navigate("/super-admin/institutions/suc");
    };

    const closeDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedResearch(null);
    };

    const closeUploadModal = () => {
        setIsUploadModalOpen(false);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
    };

    const getFilteredData = () => {
        const searchLower = searchTerm.toLowerCase();
        let filteredData = [];

        switch (activeTab) {
            case "ALL":
                filteredData = [
                    ...researchData.research_tb1,
                    ...researchData.research_tb2,
                    ...researchData.research_tb3,
                    ...researchData.research_tb4,
                    ...researchData.research_tb5,
                    ...researchData.research_tbc
                ];
                break;
            case "TB1":
                filteredData = researchData.research_tb1;
                break;
            case "TB2":
                filteredData = researchData.research_tb2;
                break;
            case "TB3":
                filteredData = researchData.research_tb3;
                break;
            case "TB4":
                filteredData = researchData.research_tb4;
                break;
            case "TB5":
                filteredData = researchData.research_tb5;
                break;
            case "TBC":
                filteredData = researchData.research_tbc;
                break;
            default:
                filteredData = [];
        }

        return filteredData.filter(item => {
            const searchableFields = Object.values(item).join(" ").toLowerCase();
            return searchableFields.includes(searchLower);
        });
    };

    const renderTable = () => {
        const filteredData = getFilteredData();

        switch (activeTab) {
            case "ALL":
                return (
                    <div className="space-y-8">
                        {researchData.research_tb1.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Articles/Books</h3>
                                <ResearchTb1Table
                                    data={researchData.research_tb1}
                                    onView={handleView}
                                    onDelete={handleDelete}
                                />
                            </div>
                        )}
                        {researchData.research_tb2.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Conference Papers</h3>
                                <ResearchTb2Table
                                    data={researchData.research_tb2}
                                    onView={handleView}
                                    onDelete={handleDelete}
                                />
                            </div>
                        )}
                        {researchData.research_tb3.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventions/Patents</h3>
                                <ResearchTb3Table
                                    data={researchData.research_tb3}
                                    onView={handleView}
                                    onDelete={handleDelete}
                                />
                            </div>
                        )}
                        {researchData.research_tb4.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Citations</h3>
                                <ResearchTb4Table
                                    data={researchData.research_tb4}
                                    onView={handleView}
                                    onDelete={handleDelete}
                                />
                            </div>
                        )}
                        {researchData.research_tb5.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Awards</h3>
                                <ResearchTb5Table
                                    data={researchData.research_tb5}
                                    onView={handleView}
                                    onDelete={handleDelete}
                                />
                            </div>
                        )}
                        {researchData.research_tbc.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Training Programs</h3>
                                <ResearchTbcTable
                                    data={researchData.research_tbc}
                                    onView={handleView}
                                    onDelete={handleDelete}
                                />
                            </div>
                        )}
                        {filteredData.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No research data found</p>
                            </div>
                        )}
                    </div>
                );
            case "TB1":
                return (
                    <ResearchTb1Table
                        data={filteredData}
                        onView={handleView}
                        onDelete={handleDelete}
                    />
                );
            case "TB2":
                return (
                    <ResearchTb2Table
                        data={filteredData}
                        onView={handleView}
                        onDelete={handleDelete}
                    />
                );
            case "TB3":
                return (
                    <ResearchTb3Table
                        data={filteredData}
                        onView={handleView}
                        onDelete={handleDelete}
                    />
                );
            case "TB4":
                return (
                    <ResearchTb4Table
                        data={filteredData}
                        onView={handleView}
                        onDelete={handleDelete}
                    />
                );
            case "TB5":
                return (
                    <ResearchTb5Table
                        data={filteredData}
                        onView={handleView}
                        onDelete={handleDelete}
                    />
                );
            case "TBC":
                return (
                    <ResearchTbcTable
                        data={filteredData}
                        onView={handleView}
                        onDelete={handleDelete}
                    />
                );
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

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
                                Research Management
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
                                            placeholder="Search research..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 pr-4 py-2 w-full sm:w-60 lg:w-80 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-200"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-2 w-full xl:w-auto">
                                    <button
                                        onClick={handleAdd}
                                        className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Research
                                    </button>
                                    <button
                                        onClick={handleExport}
                                        disabled={exportLoading}
                                        className="inline-flex items-center justify-center px-4 py-2 bg-white/50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-white hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <FileDown className="w-4 h-4 mr-2" />
                                        {exportLoading ? "Exporting..." : "Export"}
                                    </button>
                                    <button
                                        onClick={handleUpload}
                                        className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg text-sm font-medium hover:from-green-700 hover:to-green-800 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <FileUp className="w-4 h-4 mr-2" />
                                        Upload Excel
                                    </button>
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

                {/* Main Content */}
                <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 overflow-hidden">
                    <div className="border-b border-gray-200/50">
                        <nav className="flex overflow-x-auto">
                            {["ALL", "TB1", "TB2", "TB3", "TB4", "TB5", "TBC"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors duration-200 ${
                                        activeTab === tab
                                            ? "border-blue-500 text-blue-600"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    }`}
                                >
                                    {tab === "ALL" ? "All Research" : tab}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-6">
                        {renderTable()}
                    </div>
                </div>
            </div>

            {/* Research Detail Modal */}
            <ResearchDetailModal
                isOpen={isDetailModalOpen}
                onClose={closeDetailModal}
                researchData={selectedResearch}
            />

            {/* Research Upload Modal */}
            <ResearchUploadModal
                isOpen={isUploadModalOpen}
                onClose={closeUploadModal}
                institutionId={heiUiid}
                onUploadSuccess={fetchResearchData}
            />

            {/* Research Add Modal */}
            <ResearchAddModal
                isOpen={isAddModalOpen}
                onClose={closeAddModal}
                institutionId={heiUiid}
                onAddSuccess={fetchResearchData}
            />
        </div>
    );
}

export default ResearchManagement;
