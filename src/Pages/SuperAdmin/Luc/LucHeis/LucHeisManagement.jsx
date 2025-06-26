/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Search, X, School, Upload, RefreshCw } from "lucide-react";
import config from "../../../../utils/config";
import LucDataTable from "./LucDataTable";
import LucUploadDialog from "./LucUploadDialog";
import AddLucForm from "./AddLucForm";
import EditLucForm from "./EditLucForm";

function LucHeiManagement() {
    const [lucData, setLucData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [modalType, setModalType] = useState(""); // 'add' or 'edit'
    const [currentRecord, setCurrentRecord] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedReportYear, setSelectedReportYear] = useState(null);
    const [selectedCluster, setSelectedCluster] = useState(null);
    const [clusters, setClusters] = useState([]);

    useEffect(() => {
        fetchLucData();
        fetchClusters();
    }, []);

    const transformLucData = (data) =>
        data.map((item) => ({
            ...item,
            institution_name: item.hei?.name || '',
            institution_uiid: item.hei_uiid || '',
            report_year:
                typeof item.report_year === 'object' && item.report_year !== null
                    ? item.report_year.year
                    : item.report_year,
        }));

    const fetchLucData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${config.API_URL}/luc-details`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    Accept: "application/json",
                },
            });
            setLucData(transformLucData(response.data));
            console.log("Data:", response.data)
        } catch {
            setError("Failed to load LUC data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fetchClusters = async () => {
        try {
            const response = await axios.get(`${config.API_URL}/clusters`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    Accept: "application/json",
                },
            });
            setClusters(response.data);
        } catch {
            setError("Failed to load clusters. Please try again.");
        }
    };

    const openModal = (type, record = null) => {
        setModalType(type);
        setCurrentRecord(record);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentRecord(null);
        setModalType("");
    };

    const openUploadModal = () => {
        setIsUploadModalOpen(true);
    };

    const closeUploadModal = () => {
        setIsUploadModalOpen(false);
    };

    const handleSave = async (formData) => {
        if (modalType === "add") {
            await createLucDetail(formData);
        } else {
            await updateLucDetail(currentRecord.id, formData);
        }
        closeModal();
        fetchLucData();
    };

    const handleDelete = async (id) => {
        if (
            window.confirm("Are you sure you want to delete this LUC record?")
        ) {
            await deleteLucDetail(id);
            fetchLucData();
        }
    };

    const handleDataImported = () => {
        setIsUploadModalOpen(false);
        setSearchTerm("");
        setSelectedReportYear(null);
        fetchLucData();
    };

    const handleRefresh = () => {
        fetchLucData();
    };

    const filteredData = lucData.filter(
        (item) =>
            (item.institution_name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
                item.head_name
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                item.region?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.municipality
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase())) &&
            (selectedReportYear === null ||
                String(item.report_year) === String(selectedReportYear)) &&
            (selectedCluster === null ||
                String(item.cluster_id) === String(selectedCluster))
    );

    // Implement API POST for LUC
    const createLucDetail = async (formData) => {
        try {
            await axios.post(`${config.API_URL}/luc-details`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });
        } catch (error) {
            setError("Failed to create LUC record.");
            throw error;
        }
    };

    // Implement API PUT for LUC
    const updateLucDetail = async (id, formData) => {
        try {
            await axios.put(`${config.API_URL}/luc-details/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });
        } catch (error) {
            setError("Failed to update LUC record.");
            throw error;
        }
    };

    // Implement API DELETE for LUC
    const deleteLucDetail = async (id) => {
        try {
            await axios.delete(`${config.API_URL}/luc-details/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    Accept: "application/json",
                },
            });
        } catch (error) {
            setError("Failed to delete LUC record.");
            throw error;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading LUC data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center mb-2 justify-between">
                        <div className="flex items-center">
                            <School className="w-8 h-8 text-green-600 mr-3" />
                            <h1 className="text-3xl font-bold text-gray-900">
                                Local Universities and Colleges Management
                            </h1>
                        </div>
                    </div>
                    <p className="text-gray-600">
                        Comprehensive management system for Local Universities
                        and Colleges (LUC) in the Philippines
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="mb-6 p-4 rounded-lg border bg-red-50 border-red-200 text-red-800">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <X className="w-5 h-5 mr-2" />
                                <span className="font-medium">{error}</span>
                            </div>
                            <button
                                onClick={() => setError(null)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <div className="bg-white rounded-lg shadow-sm mb-4">
                    {/* Filters and Actions */}
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex flex-wrap items-center gap-3 flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Search institutions..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-sm"
                                    />
                                </div>

                                {/* Report Year Filter */}
                                <div className="flex items-center gap-2">
                                    <label
                                        htmlFor="reportYear"
                                        className="text-sm text-gray-600"
                                    >
                                        Year:
                                    </label>
                                    <select
                                        id="reportYear"
                                        value={selectedReportYear || ""}
                                        onChange={(e) =>
                                            setSelectedReportYear(
                                                e.target.value === ""
                                                    ? null
                                                    : Number(e.target.value)
                                            )
                                        }
                                        className="px-2 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-sm"
                                    >
                                        <option value="">All</option>
                                        {Array.from(
                                            {
                                                length:
                                                    new Date().getFullYear() -
                                                    2000 +
                                                    1,
                                            },
                                            (_, i) => {
                                                const year =
                                                    new Date().getFullYear() -
                                                    i;
                                                return (
                                                    <option
                                                        key={year}
                                                        value={year}
                                                    >
                                                        {year}
                                                    </option>
                                                );
                                            }
                                        )}
                                    </select>
                                </div>

                                {/* Cluster Filter */}
                                <div className="flex items-center gap-2">
                                    <label
                                        htmlFor="cluster"
                                        className="text-sm text-gray-600"
                                    >
                                        Cluster:
                                    </label>
                                    <select
                                        id="cluster"
                                        value={selectedCluster || ""}
                                        onChange={(e) =>
                                            setSelectedCluster(
                                                e.target.value === ""
                                                    ? null
                                                    : e.target.value
                                            )
                                        }
                                        className="px-2 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-sm"
                                    >
                                        <option value="">All</option>
                                        {clusters.map((cluster) => (
                                            <option
                                                key={cluster.id}
                                                value={cluster.id}
                                            >
                                                {cluster.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="text-sm text-gray-500">
                                    Total:{" "}
                                    <span className="font-semibold">
                                        {filteredData.length}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                {/* Refresh Button */}
                                <button
                                    onClick={handleRefresh}
                                    disabled={loading}
                                    className="p-2 border border-gray-300 text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <RefreshCw
                                        className={`w-4 h-4 ${
                                            loading ? "animate-spin" : ""
                                        }`}
                                    />
                                </button>

                                {/* Upload Excel Button */}
                                <button
                                    onClick={openUploadModal}
                                    className="flex items-center px-3 py-2 border border-gray-300 text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    <Upload className="w-4 h-4 mr-1" />
                                    Upload
                                </button>

                                <button
                                    onClick={() => openModal("add")}
                                    className="flex items-center px-3 py-2 border border-transparent text-sm rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Add LUC
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Data Table */}
                    <LucDataTable
                        data={filteredData}
                        onEdit={(record) => openModal("edit", record)}
                        onDelete={handleDelete}
                    />
                </div>
            </div>

            {/* Upload Modal */}
            <LucUploadDialog
                isOpen={isUploadModalOpen}
                onClose={closeUploadModal}
                onUploadSuccess={handleDataImported}
            />
            {/* Add/Edit Modal */}
            {isModalOpen && (
                <>
                    {modalType === "add" ? (
                        <AddLucForm
                            isOpen={isModalOpen}
                            onSave={handleSave}
                            onCancel={closeModal}
                            loading={loading}
                        />
                    ) : (
                        <EditLucForm
                            initialData={currentRecord}
                            onSave={handleSave}
                            onCancel={closeModal}
                            loading={loading}
                        />
                    )}
                </>
            )}
        </div>
    );
}

export default LucHeiManagement;
