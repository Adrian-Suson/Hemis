/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
    GraduationCap,
    MoreHorizontal,
    ArrowLeft,
    X,
    Eye,
    BookOpen,
    Users,
    Award,
    Search,
    Filter,
    Download,
    Plus,
    TrendingUp,
    Edit,
    Calendar,
    DollarSign,
    Upload,
} from "lucide-react";
import Popper from "../../../../Components/Popper";
import ProgramDetailsView from "./ProgramDetailsView";
import AddProgramForm from "./AddProgramForm";
import EditProgramForm from "./EditProgramForm";
import ProgramUploadModal from "./ProgramUploadModal"; // Import ProgramUploadModal
import config from "../../../../utils/config";
import axios from "axios";

function SucPrograms() {
    const { SucDetailId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const heiName = location.state?.heiName || "Unknown Institution";

    const [programs, setPrograms] = useState([]);
    const [filteredPrograms, setFilteredPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [addLoading, setAddLoading] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("ALL");

    // Fetch programs when component mounts
    useEffect(() => {
        fetchPrograms();
    }, []);

    // Filter programs based on search and filters
    useEffect(() => {
        let filtered = programs;

        if (searchTerm) {
            filtered = filtered.filter(
                (program) =>
                    program.program_name
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    program.program_code
                        ?.toString()
                        .includes(searchTerm.toLowerCase()) ||
                    program.major_name
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    program.aop_category
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
        }

        // Filter by program type based on the specified list
        if (filterType !== "ALL") {
            filtered = filtered.filter(
                (program) => program.program_type === filterType
            );
        }

        setFilteredPrograms(filtered);
    }, [programs, searchTerm, filterType]);

    const fetchPrograms = async () => {
        if (!SucDetailId) {
            console.error("SucDetailId is undefined. Cannot fetch programs.");
            setError(
                "Invalid institution ID. Please check the URL or try again."
            );
            setLoading(false);
            return;
        }

        setLoading(true);
        setError("");
        try {
            const response = await axios.get(`${config.API_URL}/suc-form-b`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    Accept: "application/json",
                },
                params: {
                    suc_details_id: SucDetailId,
                },
            });

            const programData = Array.isArray(response.data)
                ? response.data
                : response.data.data || [];
            setPrograms(programData);
            setFilteredPrograms(programData);
            console.log("Fetched programs:", programData);
        } catch (err) {
            console.error("Error fetching programs:", err);
            setError("Failed to load academic programs. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleUploadPrograms = () => {
        setIsUploadModalOpen(true);
    };

    const handleViewDetails = (program) => {
        setSelectedProgram(program);
        setIsDetailModalOpen(true);
    };

    const handleEdit = (program) => {
        setSelectedProgram(program);
        setIsEditModalOpen(true);
    };

    const handleAddProgram = () => {
        setIsAddModalOpen(true);
    };

    const handleSaveProgram = async (programData) => {
        setAddLoading(true);
        try {
            const response = await axios.post(
                `${config.API_URL}/suc-form-b`,
                programData,
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
                const newProgram = response.data;
                setPrograms((prev) => [...prev, newProgram]);
                setFilteredPrograms((prev) => [...prev, newProgram]);

                setIsAddModalOpen(false);
                console.log("Program created successfully:", newProgram);
            }
        } catch (err) {
            console.error("Error creating program:", err);
            setError("Failed to create program. Please try again.");
        } finally {
            setAddLoading(false);
        }
    };

    const handleUpdateProgram = async (updatedProgramData) => {
        setEditLoading(true);
        try {
            const response = await axios.put(
                `${config.API_URL}/suc-form-b/${updatedProgramData.id}`,
                updatedProgramData,
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
                const updatedProgram = response.data;
                setPrograms((prev) =>
                    prev.map((program) =>
                        program.id === updatedProgram.id
                            ? updatedProgram
                            : program
                    )
                );
                setFilteredPrograms((prev) =>
                    prev.map((program) =>
                        program.id === updatedProgram.id
                            ? updatedProgram
                            : program
                    )
                );

                setIsEditModalOpen(false);
                setSelectedProgram(null);
                console.log("Program updated successfully:", updatedProgram);
            }
        } catch (err) {
            console.error("Error updating program:", err);
            setError("Failed to update program. Please try again.");
        } finally {
            setEditLoading(false);
        }
    };

    const handleDelete = async (programId) => {
        try {
            const response = await axios.delete(
                `${config.API_URL}/suc-form-b/${programId}`,
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
                setPrograms((prev) =>
                    prev.filter((program) => program.id !== programId)
                );
                setFilteredPrograms((prev) =>
                    prev.filter((program) => program.id !== programId)
                );
                console.log("Program deleted successfully.");
            }
        } catch (err) {
            console.error("Error deleting program:", err);
            setError("Failed to delete program. Please try again.");
        }
    };

    const handleBack = () => {
        navigate("/super-admin/institutions/suc");
    };

    const closeDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedProgram(null);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedProgram(null);
    };

    const closeUploadModal = () => {
        setIsUploadModalOpen(false);
    };

    const formatCurrency = (amount) => {
        if (!amount) return "₱0.00";
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
        }).format(amount);
    };

    const getTotalEnrollment = (program) => {
        const fields = [
            "1st_year_male",
            "1st_year_female",
            "2nd_year_male",
            "2nd_year_female",
            "3rd_year_male",
            "3rd_year_female",
            "4th_year_male",
            "4th_year_female",
            "5th_year_male",
            "5th_year_female",
            "6th_year_male",
            "6th_year_female",
            "7th_year_male",
            "7th_year_female",
        ];
        return fields.reduce(
            (total, field) => total + (program[field] || 0),
            0
        );
    };

    const getProgramTypeColor = (type) => {
        switch (type?.toLowerCase()) {
            case "undergraduate":
                return "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300";
            case "graduate":
                return "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300";
            case "doctoral":
                return "bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border-emerald-300";
            default:
                return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300";
        }
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
                                Academic Programs Management
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
                                            placeholder="Search programs..."
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
                                            onChange={(e) => {
                                                const selectedType = e.target.value;
                                                if (selectedType === "ALL") {
                                                    setFilterType(programs); // Show all programs
                                                } else {
                                                    setFilterType(
                                                        programs.filter(
                                                            (program) =>
                                                                program.program_type ===
                                                                selectedType
                                                        )
                                                    ); // Filter by selected type
                                                }
                                            }}
                                            className="pl-10 pr-8 py-2 w-full sm:w-auto border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm appearance-none cursor-pointer transition-all duration-200"
                                        >
                                            <option value="ALL">All Types</option>
                                            <option value="Doctorate">Doctorate</option>
                                            <option value="Masters">Masters</option>
                                            <option value="Post-Baccalaureate">
                                                Post-Baccalaureate
                                            </option>
                                            <option value="Baccalaureate">
                                                Baccalaureate
                                            </option>
                                            <option value="Pre-Baccalaureate">
                                                Pre-Baccalaureate
                                            </option>
                                            <option value="VocTech">VocTech</option>
                                            <option value="Basic">Basic</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-2 w-full xl:w-auto">
                                    <button className="inline-flex items-center justify-center px-4 py-2 bg-white/50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-white hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <Download className="w-4 h-4 mr-2" />
                                        Export
                                    </button>
                                    <button
                                        onClick={handleUploadPrograms}
                                        className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg text-sm font-medium hover:from-green-700 hover:to-green-800 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <Upload className="w-4 h-4 mr-2" />
                                        Upload Excel
                                    </button>
                                    <button
                                        onClick={handleAddProgram}
                                        className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Program
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center text-sm text-gray-500">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                Showing {filteredPrograms.length} of{" "}
                                {programs.length} programs
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
                                    Loading programs...
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Programs Table */
                    <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 overflow-hidden">
                        {/* Table Header - Fixed */}
                        <div className="bg-gradient-to-r from-gray-50/80 to-blue-50/50 border-b border-gray-200/50">
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Program Information
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Details & Category
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Enrollment & Units
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Financials
                                            </th>
                                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                </table>
                            </div>
                        </div>

                        {/* Table Body - Scrollable */}
                        <div className="max-h-96 overflow-y-auto">
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <tbody className="divide-y divide-gray-200/30">
                                        {filteredPrograms.map(
                                            (program, index) => (
                                                <tr
                                                    key={program.id}
                                                    className={`hover:bg-blue-50/30 transition-all duration-200 ${
                                                        index % 2 === 0
                                                            ? "bg-white/30"
                                                            : "bg-gray-50/30"
                                                    }`}
                                                >
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10">
                                                                <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-200 text-purple-700">
                                                                    <GraduationCap className="w-5 h-5" />
                                                                </div>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-semibold text-gray-900">
                                                                    {
                                                                        program.program_name
                                                                    }
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    Code:{" "}
                                                                    {program.program_code ||
                                                                        "N/A"}
                                                                </div>
                                                                {program.major_name && (
                                                                    <div className="text-xs text-blue-600 font-medium">
                                                                        Major:{" "}
                                                                        {
                                                                            program.major_name
                                                                        }
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="space-y-2">
                                                            <span
                                                                className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${getProgramTypeColor(
                                                                    program.program_type
                                                                )}`}
                                                            >
                                                                {program.program_type ||
                                                                    "Unknown"}
                                                            </span>
                                                            <div className="text-xs text-gray-600">
                                                                <div className="flex items-center">
                                                                    <BookOpen className="w-3 h-3 mr-1 text-gray-400" />
                                                                    {program.aop_category ||
                                                                        "No Category"}
                                                                </div>
                                                                <div className="flex items-center mt-1">
                                                                    <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                                                                    {program.program_normal_length_in_years ||
                                                                        "N/A"}{" "}
                                                                    years
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="space-y-1">
                                                            <div className="text-sm font-medium text-gray-900 flex items-center">
                                                                <Users className="w-3 h-3 mr-1 text-gray-400" />
                                                                {getTotalEnrollment(
                                                                    program
                                                                )}{" "}
                                                                Students
                                                            </div>
                                                            <div className="text-xs text-gray-600">
                                                                Total Units:{" "}
                                                                {program.total_units ||
                                                                    0}
                                                            </div>
                                                            <div className="text-xs text-gray-600">
                                                                Lab:{" "}
                                                                {program.lab_units ||
                                                                    0}{" "}
                                                                | Lecture:{" "}
                                                                {program.lecture_units ||
                                                                    0}
                                                            </div>
                                                            {program.graduates_total >
                                                                0 && (
                                                                <div className="text-xs text-green-600 flex items-center">
                                                                    <Award className="w-3 h-3 mr-1" />
                                                                    {
                                                                        program.graduates_total
                                                                    }{" "}
                                                                    Graduates
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="space-y-1">
                                                            <div className="text-sm font-medium text-gray-900 flex items-center">
                                                                <DollarSign className="w-3 h-3 mr-1 text-gray-400" />
                                                                {formatCurrency(
                                                                    program.tuition_per_unit
                                                                )}
                                                                /unit
                                                            </div>
                                                            <div className="text-xs text-gray-600">
                                                                Program Fee:{" "}
                                                                {formatCurrency(
                                                                    program.program_fee
                                                                )}
                                                            </div>
                                                            {(program.externally_funded_merit_scholars >
                                                                0 ||
                                                                program.internally_funded_grantees >
                                                                    0) && (
                                                                <div className="text-xs text-blue-600">
                                                                    Scholars:{" "}
                                                                    {(program.externally_funded_merit_scholars ||
                                                                        0) +
                                                                        (program.internally_funded_grantees ||
                                                                            0)}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 text-center">
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
                                                                        handleViewDetails(
                                                                            program
                                                                        )
                                                                    }
                                                                    className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 focus:outline-none focus:bg-blue-50 transition-colors duration-150 group"
                                                                    role="menuitem"
                                                                >
                                                                    <Eye className="w-4 h-4 mr-3 text-blue-500 group-hover:text-blue-600" />
                                                                    View Details
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        handleEdit(
                                                                            program
                                                                        )
                                                                    }
                                                                    className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-green-50 focus:outline-none focus:bg-green-50 transition-colors duration-150 group"
                                                                    role="menuitem"
                                                                >
                                                                    <Edit className="w-4 h-4 mr-3 text-green-500 group-hover:text-green-600" />
                                                                    Edit Program
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            program.id
                                                                        )
                                                                    }
                                                                    className="flex items-center w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50 focus:outline-none focus:bg-red-50 transition-colors duration-150"
                                                                    role="menuitem"
                                                                >
                                                                    Delete
                                                                    Program
                                                                </button>
                                                            </div>
                                                        </Popper>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                        {filteredPrograms.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan="5"
                                                    className="px-6 py-12 text-center"
                                                >
                                                    <div className="text-gray-500">
                                                        <div className="mx-auto h-20 w-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                                                            <GraduationCap className="w-10 h-10 text-gray-400" />
                                                        </div>

                                                        {
                                                            !searchTerm(
                                                                <button
                                                                    onClick={
                                                                        handleUploadPrograms
                                                                    }
                                                                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg text-sm font-medium hover:from-green-700 hover:to-green-800 shadow-sm hover:shadow-md transition-all duration-200"
                                                                >
                                                                    <Upload className="w-4 h-4 mr-2" />
                                                                    Upload Excel
                                                                </button>
                                                            )
                                                        }
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Program Detail Modal */}
                <ProgramDetailsView
                    isOpen={isDetailModalOpen}
                    onClose={closeDetailModal}
                    programData={selectedProgram}
                />

                {/* Add Program Modal */}
                <AddProgramForm
                    isOpen={isAddModalOpen}
                    onClose={closeAddModal}
                    onSave={handleSaveProgram}
                    institutionId={SucDetailId}
                    loading={addLoading}
                />

                {/* Edit Program Modal */}
                <EditProgramForm
                    isOpen={isEditModalOpen}
                    onClose={closeEditModal}
                    onSave={handleUpdateProgram}
                    programData={selectedProgram}
                    loading={editLoading}
                />

                {/* Upload Programs Modal */}
                <ProgramUploadModal
                    isOpen={isUploadModalOpen}
                    onClose={closeUploadModal}
                    institutionId={SucDetailId}
                    onUploadSuccess={fetchPrograms}
                />
            </div>
        </div>
    );
}

export default SucPrograms;
