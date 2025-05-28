import { useState, useEffect } from "react";
import { Plus, Search, GraduationCap, X } from "lucide-react";
import SucDataTable from "./SucDataTable";
import SucForm from "./SucForm";

function SucHeiManagement() {
    const [sucData, setSucData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState(""); // 'add' or 'edit'
    const [currentRecord, setCurrentRecord] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Mock data - replace with API calls
    useEffect(() => {
        setSucData([
            {
                id: 1,
                institution_uiid: "SUC-001",
                institution_name: "University of the Philippines",
                region: "NCR",
                province: "Metro Manila",
                municipality: "Quezon City",
                address_street: "Diliman",
                postal_code: "1101",
                institutional_telephone: "+63-2-8981-8500",
                institutional_fax: "+63-2-8981-8501",
                institutional_email: "info@up.edu.ph",
                institutional_website: "https://up.edu.ph",
                year_established: 1908,
                report_year: 2024,
                head_name: "Angelo A. Jimenez",
                head_title: "President",
                head_education: "PhD in Economics",
                head_telephone: "+63-2-8981-8502",
                sec_registration: "SEC-UP-001",
                year_granted_approved: 1908,
                year_converted_college: null,
                year_converted_university: 1908,
            },
            {
                id: 2,
                institution_uiid: "SUC-002",
                institution_name: "Polytechnic University of the Philippines",
                region: "NCR",
                province: "Metro Manila",
                municipality: "Manila",
                address_street: "Sta. Mesa",
                postal_code: "1016",
                institutional_telephone: "+63-2-5335-1PUP",
                institutional_email: "info@pup.edu.ph",
                institutional_website: "https://pup.edu.ph",
                year_established: 1904,
                report_year: 2024,
                head_name: "Dr. Manuel M. Muhi",
                head_title: "President",
                head_education: "PhD in Engineering",
                head_telephone: "+63-2-5335-1900",
                sec_registration: "SEC-PUP-001",
                year_granted_approved: 1904,
                year_converted_college: 1978,
                year_converted_university: 1978,
            },
        ]);
    }, []);

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

    const handleSave = (formData) => {
        if (modalType === "add") {
            const newSuc = { ...formData, id: Date.now() };
            setSucData([...sucData, newSuc]);
        } else {
            setSucData(
                sucData.map((item) =>
                    item.id === currentRecord.id
                        ? { ...item, ...formData }
                        : item
                )
            );
        }
        closeModal();
    };

    const handleEdit = (record) => {
        openModal("edit", record);
    };

    const handleDelete = (id) => {
        if (
            window.confirm("Are you sure you want to delete this SUC record?")
        ) {
            setSucData(sucData.filter((item) => item.id !== id));
        }
    };

    const filteredData = sucData.filter(
        (item) =>
            item.institution_name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            item.head_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.region?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.municipality?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                                <div className="text-sm text-gray-500 flex items-center">
                                    Total SUCs:{" "}
                                    <span className="font-semibold ml-1">
                                        {filteredData.length}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => openModal("add")}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add New SUC
                            </button>
                        </div>
                    </div>

                    {/* Data Table */}
                    <SucDataTable
                        data={filteredData}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-5xl shadow-lg rounded-md bg-white">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                <GraduationCap className="w-5 h-5 mr-2" />
                                {modalType === "add" ? "Add New" : "Edit"} State
                                University/College
                            </h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <SucForm
                            initialData={currentRecord}
                            onSave={handleSave}
                            onCancel={closeModal}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default SucHeiManagement;
