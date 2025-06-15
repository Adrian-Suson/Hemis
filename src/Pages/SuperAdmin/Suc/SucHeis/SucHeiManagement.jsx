import { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import { Plus, Search, GraduationCap, X, Upload, RefreshCw } from "lucide-react";
import SucDataTable from "./SucDataTable";
import AddSucForm from "./AddSucForm"; // Import AddSucForm
import EditSucForm from "./EditSucForm"; // Import EditSucForm
import SucUploadModal from "./SucUploadModal";
import config from "../../../../utils/config";
import AlertComponent from "../../../../Components/AlertComponent"; // Import AlertComponent


function SucHeiManagement() {
    const [sucData, setSucData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [modalType, setModalType] = useState(""); // 'add' or 'edit'
    const [currentRecord, setCurrentRecord] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedReportYear, setSelectedReportYear] = useState(null); // Changed to null

    // Fetch SUC data from API
    useEffect(() => {
        fetchSucData();

    }, []);

    const fetchSucData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${config.API_URL}/suc-details`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Add token from localStorage
                    'Accept': 'application/json',
                },
            });

            setSucData(response.data);
            console.log('response.data after fetchSucData:', response.data)
        } catch (error) {
            console.error('Error fetching SUC data:', error);
            setError('Failed to load SUC data. Please try again.');
        } finally {
            setLoading(false);
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

    const createSucDetail = async (formData) => {
        try {
            const response = await axios.post(`${config.API_URL}/suc-details`, formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Add token from localStorage
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            return response.data;
        } catch (error) {
            console.error('Error creating SUC detail:', error);
            throw error;
        }
    };

    const updateSucDetail = async (id, formData) => {
        try {
            const response = await axios.put(`${config.API_URL}/suc-details/${id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Add token from localStorage
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            return response.data;
        } catch (error) {
            console.error('Error updating SUC detail:', error);
            throw error;
        }
    };

    const deleteSucDetail = async (id) => {
        try {
            await axios.delete(`${config.API_URL}/suc-details/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Add token from localStorage
                    'Accept': 'application/json',
                },
            });

            return true;
        } catch (error) {
            console.error('Error deleting SUC detail:', error);
            throw error;
        }
    };

    const handleSave = async (formData) => {
        try {
            // Construct the payload
            const sucDetailsPayload = {
                hei_uiid: formData.institution_uiid,
                region: formData.region || null,
                province: formData.province || null,
                municipality: formData.municipality || null,
                report_year: formData.report_year,
                address_street: formData.address_street || null,
                postal_code: formData.postal_code || null,
                institutional_telephone: formData.institutional_telephone || null,
                institutional_fax: formData.institutional_fax || null,
                head_telephone: formData.head_telephone || null,
                institutional_email: formData.institutional_email || null,
                institutional_website: formData.institutional_website || null,
                year_established: formData.year_established || null,
                head_name: formData.head_name || null,
                head_title: formData.head_title || null,
                head_education: formData.head_education || null,
                sec_registration: formData.sec_registration || null,
                year_granted_approved: formData.year_granted_approved || null,
                year_converted_college: formData.year_converted_college || null,
                year_converted_university: formData.year_converted_university || null,
                institution_name: formData.institution_name || null,
            };

            if (modalType === "add") {
                // Check if the record already exists
                const exists = sucData.some(item =>
                    item.institution_uiid === formData.institution_uiid &&
                    item.report_year === formData.report_year
                );

                if (exists) {
                    AlertComponent.showAlert('This SUC record for the selected year already exists.', 'error');
                    return;
                }

                await createSucDetail(sucDetailsPayload);
                AlertComponent.showAlert('SUC record created successfully!', 'success');
            } else {
                await updateSucDetail(currentRecord.id, sucDetailsPayload);
                AlertComponent.showAlert('SUC record updated successfully!', 'success');
            }
            closeModal();
            setSearchTerm(""); // Clear search term after save/update
            setSelectedReportYear(null); // Reset year filter after save/update
            fetchSucData(); // Re-fetch data to ensure table is updated
        } catch (error) {
            AlertComponent.showAlert(`Error ${modalType === 'add' ? 'creating' : 'updating'} SUC record: ${error.message}`, 'error');
        }
    };

    const handleEdit = (record) => {
        openModal("edit", record);
    };

    const handleDelete = async (id) => {
        AlertComponent.showConfirmation(
            "Are you sure you want to delete this SUC record?",
            async () => {
                try {
                    await deleteSucDetail(id);
                    setSucData(sucData.filter((item) => item.id !== id));
                    AlertComponent.showAlert('SUC record deleted successfully!', 'success');
                } catch (error) {
                    AlertComponent.showAlert(`Error deleting SUC record: ${error.message}`, 'error');
                }
            }
        );
    };

    const handleDataImported = () => {
        // Close the upload modal after successful import
        setIsUploadModalOpen(false);
        setSearchTerm(""); // Clear search term after import
        setSelectedReportYear(null); // Reset year filter after import
        fetchSucData(); // Re-fetch data to ensure table is updated
    };

    const handleRefresh = () => {
        fetchSucData();
    };

    const filteredData = sucData.filter(
        (item) =>
            // Filter by search term
            (item.institution_name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            item.head_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.region?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.municipality?.toLowerCase().includes(searchTerm.toLowerCase())) &&
            // Filter by report year
            (selectedReportYear === null || // If no year is selected, show all
             String(item.report_year) === String(selectedReportYear))
    );

    console.log("filteredData passed to DataTable:", filteredData);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading SUC data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center mb-2">
                        <GraduationCap className="w-8 h-8 text-blue-600 mr-3" />
                        <h1 className="text-3xl font-bold text-gray-900">
                            State Universities and Colleges Management
                        </h1>
                    </div>
                    <p className="text-gray-600">
                        Comprehensive management system for State Universities
                        and Colleges (SUC) in the Philippines
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
                <div className="bg-white rounded-lg shadow-sm mb-6">
                    {/* Filters and Actions */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Search by institution name, head, or location..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* Report Year Filter */}
                                <div className="relative flex items-center">
                                    <label htmlFor="reportYear" className="text-sm font-medium text-gray-700">Report Year:</label>
                                    <select
                                        id="reportYear"
                                        value={selectedReportYear || ""} // Use empty string for null to show placeholder
                                        onChange={(e) => setSelectedReportYear(e.target.value === "" ? null : Number(e.target.value))}
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                    >
                                        <option value="">All Years</option>
                                        {Array.from({ length: new Date().getFullYear() - 2000 + 1 }, (_, i) => {
                                            const year = new Date().getFullYear() - i;
                                            return (
                                                <option key={year} value={year}>
                                                    {year}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>

                                <div className="text-sm text-gray-500 flex items-center">
                                    Total SUCs:{" "}
                                    <span className="font-semibold ml-1">
                                        {filteredData.length}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {/* Refresh Button */}
                                <button
                                    onClick={handleRefresh}
                                    disabled={loading}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                                    Refresh
                                </button>

                                {/* Upload Excel Button */}
                                <button
                                    onClick={openUploadModal}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    Upload Excel
                                </button>

                                <button
                                    onClick={() => openModal("add")}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add New SUC
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Data Table */}
                    <SucDataTable
                        data={filteredData}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        loading={loading}
                    />
                </div>
            </div>

            {/* Upload Modal */}
            <SucUploadModal
                isOpen={isUploadModalOpen}
                onClose={closeUploadModal}
                onDataImported={handleDataImported}
            />

            {/* Form Modal */}
            {isModalOpen && (
                modalType === "add" ? (
                    <AddSucForm
                        onSave={handleSave}
                        onCancel={closeModal}
                        closeModal={closeModal}
                    />
                ) : (
                    <EditSucForm
                        initialData={currentRecord}
                        onSave={handleSave}
                        onCancel={closeModal}
                        closeModal={closeModal}
                    />
                )
            )}
        </div>
    );
}

export default SucHeiManagement;
