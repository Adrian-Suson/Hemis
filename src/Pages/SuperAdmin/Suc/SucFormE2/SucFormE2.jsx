/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
    Users,
    MoreHorizontal,
    ArrowLeft,
    X,
    Eye,
    BookOpen,
    GraduationCap,
    Search,
    Filter,
    Download,
    Plus,
    TrendingUp,
    Edit,

    Upload,
    Trash,
    UserCheck,
    Clock,
} from "lucide-react";
import Popper from "../../../../Components/Popper";
import FacultyDetailsView from "./FacultyDetailsView";
import AddFacultyForm from "./AddFacultyForm";
import EditFacultyForm from "./EditFacultyForm";
import FacultyUploadModal from "./FacultyUploadModal";
import Pagination from "../../../../Components/Pagination";
import config from "../../../../utils/config";
import axios from "axios";
import ExcelJS from "exceljs";
import Swal from "sweetalert2";

function SucFormE2() {
    const { SucDetailId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const heiName = location.state?.heiName || "Unknown Institution";
    const heiUiid = location.state?.heiUiid || "Unknown Uiid";

    const [faculty, setFaculty] = useState([]);
    const [filteredFaculty, setFilteredFaculty] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [addLoading, setAddLoading] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [exportLoading, setExportLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("ALL");
    const [filterDegree, setFilterDegree] = useState("ALL");

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Fetch faculty when component mounts
    useEffect(() => {
        fetchFaculty();
    }, []);

    // Filter faculty based on search and filters
    useEffect(() => {
        let filtered = faculty;

        if (searchTerm) {
            filtered = filtered.filter(
                (member) =>
                    member.name
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    member.home_college
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    member.home_department
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    member.generic_faculty_rank
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    member.highest_degree_attained
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
        }

        // Filter by faculty type
        if (filterType !== "ALL") {
            filtered = filtered.filter(
                (member) => member.faculty_type === filterType
            );
        }

        // Filter by highest degree
        if (filterDegree !== "ALL") {
            filtered = filtered.filter(
                (member) => member.highest_degree_attained === filterDegree
            );
        }

        setFilteredFaculty(filtered);
        // Reset to first page when filters change
        setCurrentPage(1);
    }, [faculty, searchTerm, filterType, filterDegree]);

    // Calculate paginated data
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return filteredFaculty.slice(startIndex, endIndex);
    }, [filteredFaculty, currentPage, pageSize]);

    // Calculate total pages
    const totalPages = Math.ceil(filteredFaculty.length / pageSize);

    const fetchFaculty = async () => {
        if (!SucDetailId) {
            console.error("SucDetailId is undefined. Cannot fetch faculty.");
            setError(
                "Invalid institution ID. Please check the URL or try again."
            );
            setLoading(false);
            return;
        }

        setLoading(true);
        setError("");
        try {
            const response = await axios.get(
                `${config.API_URL}/suc-form-e2/suc-detail/${SucDetailId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        Accept: "application/json",
                    },
                }
            );

            const facultyData = Array.isArray(response.data)
                ? response.data
                : response.data.data || [];
            setFaculty(facultyData);
            setFilteredFaculty(facultyData);
            console.log("Fetched faculty:", facultyData);
        } catch (err) {
            console.error("Error fetching faculty:", err);
            setError("Failed to load faculty data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleExportToFormE2 = useCallback(async () => {
        try {
            setExportLoading(true);

            Swal.fire({
                title: "Confirm Export",
                text: `Do you want to export Form E2 for ${heiName}?`,
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
                        // Fetch the Form E2 template
                        const response = await fetch("/templates/Form-E2-Template.xlsx");
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }

                        const arrayBuffer = await response.arrayBuffer();
                        const workbook = new ExcelJS.Workbook();
                        await workbook.xlsx.load(arrayBuffer);

                        // Find the main worksheet
                        const worksheet = workbook.worksheets[0] || workbook.addWorksheet('Faculty Data');

                        // Find starting row for data
                        const findStartRow = (worksheet) => {
                            let startRow = -1;
                            worksheet.eachRow((row, rowNumber) => {
                                let foundMarker = false;
                                row.eachCell((cell) => {
                                    if (cell.value && String(cell.value).trim() === "START BELOW THIS ROW") {
                                        foundMarker = true;
                                        return false;
                                    }
                                });
                                if (foundMarker) {
                                    startRow = rowNumber + 1;
                                    return false;
                                }
                            });
                            return startRow !== -1 ? startRow : 11; // Fallback to row 11
                        };

                        const startRow = findStartRow(worksheet);

                        // Clear existing data
                        const maxRows = worksheet.rowCount;
                        for (let rowNum = startRow; rowNum <= maxRows; rowNum++) {
                            const row = worksheet.getRow(rowNum);
                            row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                                if (colNumber <= 50) {
                                    if (!cell.formula && !cell.isPartOfSharedFormula) {
                                        cell.value = null;
                                    }
                                }
                            });
                        }

                        // Populate with faculty data
                        faculty.forEach((member, index) => {
                            const rowNumber = startRow + index;
                            const row = worksheet.getRow(rowNumber);

                            // Helper function to set cell value only if not a formula
                            const setCellValue = (cell, value) => {
                                if (!cell.formula && !cell.isPartOfSharedFormula) {
                                    cell.value = value;
                                }
                            };

                            // Map faculty data to Excel columns
                            setCellValue(row.getCell(1), index + 1); // SEQ
                            setCellValue(row.getCell(2), member.name || ""); // NAME
                            setCellValue(row.getCell(3), member.generic_faculty_rank || ""); // RANK
                            setCellValue(row.getCell(4), member.home_college || ""); // COLLEGE
                            setCellValue(row.getCell(5), member.home_department || ""); // DEPARTMENT
                            setCellValue(row.getCell(6), member.is_tenured || ""); // TENURED
                            setCellValue(row.getCell(7), member.ssl_salary_grade || ""); // SALARY GRADE
                            setCellValue(row.getCell(8), member.annual_basic_salary || 0); // ANNUAL SALARY
                            setCellValue(row.getCell(9), member.on_leave_without_pay || 0); // ON LEAVE
                            setCellValue(row.getCell(10), member.full_time_equivalent || 0); // FTE
                            setCellValue(row.getCell(11), member.gender || ""); // GENDER
                            setCellValue(row.getCell(12), member.highest_degree_attained || ""); // HIGHEST DEGREE
                            setCellValue(row.getCell(13), member.pursuing_next_degree || 0); // PURSUING DEGREE
                            setCellValue(row.getCell(14), member.discipline_teaching_load_1 || ""); // DISCIPLINE 1
                            setCellValue(row.getCell(15), member.discipline_teaching_load_2 || ""); // DISCIPLINE 2
                            setCellValue(row.getCell(16), member.discipline_bachelors || ""); // BACHELORS DISCIPLINE
                            setCellValue(row.getCell(17), member.discipline_masters || ""); // MASTERS DISCIPLINE
                            setCellValue(row.getCell(18), member.discipline_doctorate || ""); // DOCTORATE DISCIPLINE
                            setCellValue(row.getCell(19), member.masters_with_thesis || 0); // MASTERS WITH THESIS
                            setCellValue(row.getCell(20), member.doctorate_with_dissertation || 0); // DOCTORATE WITH DISSERTATION
                            setCellValue(row.getCell(21), member.undergrad_lab_credit_units || 0); // UNDERGRAD LAB UNITS
                            setCellValue(row.getCell(22), member.undergrad_lecture_credit_units || 0); // UNDERGRAD LECTURE UNITS
                            setCellValue(row.getCell(23), member.undergrad_total_credit_units || 0); // UNDERGRAD TOTAL UNITS
                            setCellValue(row.getCell(24), member.undergrad_lab_hours_per_week || 0); // UNDERGRAD LAB HOURS
                            setCellValue(row.getCell(25), member.undergrad_lecture_hours_per_week || 0); // UNDERGRAD LECTURE HOURS
                            setCellValue(row.getCell(26), member.undergrad_total_hours_per_week || 0); // UNDERGRAD TOTAL HOURS
                            setCellValue(row.getCell(27), member.undergrad_lab_contact_hours || 0); // UNDERGRAD LAB CONTACT
                            setCellValue(row.getCell(28), member.undergrad_lecture_contact_hours || 0); // UNDERGRAD LECTURE CONTACT
                            setCellValue(row.getCell(29), member.undergrad_total_contact_hours || 0); // UNDERGRAD TOTAL CONTACT
                            setCellValue(row.getCell(30), member.graduate_lab_credit_units || 0); // GRADUATE LAB UNITS
                            setCellValue(row.getCell(31), member.graduate_lecture_credit_units || 0); // GRADUATE LECTURE UNITS
                            setCellValue(row.getCell(32), member.graduate_total_credit_units || 0); // GRADUATE TOTAL UNITS
                            setCellValue(row.getCell(33), member.graduate_lab_contact_hours || 0); // GRADUATE LAB CONTACT
                            setCellValue(row.getCell(34), member.graduate_lecture_contact_hours || 0); // GRADUATE LECTURE CONTACT
                            setCellValue(row.getCell(35), member.graduate_total_contact_hours || 0); // GRADUATE TOTAL CONTACT
                            setCellValue(row.getCell(36), member.research_load || 0); // RESEARCH LOAD
                            setCellValue(row.getCell(37), member.extension_services_load || 0); // EXTENSION LOAD
                            setCellValue(row.getCell(38), member.study_load || 0); // STUDY LOAD
                            setCellValue(row.getCell(39), member.production_load || 0); // PRODUCTION LOAD
                            setCellValue(row.getCell(40), member.administrative_load || 0); // ADMIN LOAD
                            setCellValue(row.getCell(41), member.other_load_credits || 0); // OTHER LOAD
                            setCellValue(row.getCell(42), member.total_work_load || 0); // TOTAL WORKLOAD
                            setCellValue(row.getCell(43), member.report_year || ""); // REPORT YEAR
                            setCellValue(row.getCell(44), member.faculty_type || ""); // FACULTY TYPE

                            row.commit();
                        });

                        // Generate filename
                        const fileName = `${heiUiid}_${heiName.replace(/[^a-zA-Z0-9]/g, '_')}_FormE2_${new Date().toISOString().split('T')[0]}.xlsx`;

                        // Save and download the file
                        const buffer = await workbook.xlsx.writeBuffer();
                        const blob = new Blob([buffer], {
                            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = fileName;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);

                        Swal.fire({
                            title: "Success!",
                            text: `Form E2 exported successfully with ${faculty.length} faculty members.`,
                            icon: "success",
                            timer: 4000,
                            showConfirmButton: false,
                        });

                    } catch (error) {
                        console.error("Error exporting Form E2:", error);
                        Swal.fire({
                            title: "Error!",
                            text: "Failed to export Form E2. Please try again.",
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
    }, [faculty, heiName, heiUiid]);

    const handleUploadFaculty = () => {
        setIsUploadModalOpen(true);
    };

    const handleViewDetails = (member) => {
        setSelectedFaculty(member);
        setIsDetailModalOpen(true);
    };

    const handleEdit = (member) => {
        setSelectedFaculty(member);
        setIsEditModalOpen(true);
    };

    const handleAddFaculty = () => {
        setIsAddModalOpen(true);
    };

    const handleSaveFaculty = async (facultyData) => {
        setAddLoading(true);
        try {
            const response = await axios.post(
                `${config.API_URL}/suc-form-e2`,
                facultyData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 201) {
                const newFaculty = response.data;
                setFaculty((prev) => [...prev, newFaculty]);
                setIsAddModalOpen(false);
                console.log("Faculty created successfully:", newFaculty);
            }
        } catch (err) {
            console.error("Error creating faculty:", err);
            setError("Failed to create faculty record. Please try again.");
        } finally {
            setAddLoading(false);
        }
    };

    const handleUpdateFaculty = async (updatedFacultyData) => {
        setEditLoading(true);
        try {
            const response = await axios.put(
                `${config.API_URL}/suc-form-e2/${updatedFacultyData.id}`,
                updatedFacultyData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                const updatedFaculty = response.data;
                setFaculty((prev) =>
                    prev.map((member) =>
                        member.id === updatedFaculty.id ? updatedFaculty : member
                    )
                );
                setIsEditModalOpen(false);
                setSelectedFaculty(null);
                console.log("Faculty updated successfully:", updatedFaculty);
            }
        } catch (err) {
            console.error("Error updating faculty:", err);
            setError("Failed to update faculty record. Please try again.");
        } finally {
            setEditLoading(false);
        }
    };

    const handleDelete = async (facultyId) => {
        try {
            const response = await axios.delete(
                `${config.API_URL}/suc-form-e2/${facultyId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        Accept: "application/json",
                    },
                }
            );

            if (response.status === 200) {
                setFaculty((prev) =>
                    prev.filter((member) => member.id !== facultyId)
                );
                console.log("Faculty deleted successfully.");
            }
        } catch (err) {
            console.error("Error deleting faculty:", err);
            setError("Failed to delete faculty record. Please try again.");
        }
    };

    const handleBack = () => {
        navigate("/super-admin/institutions/suc");
    };

    const closeDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedFaculty(null);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedFaculty(null);
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

    const getFacultyTypeColor = (type) => {
        switch (type?.toUpperCase()) {
            case "A1":
                return "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300";
            case "B":
                return "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300";
            case "C1":
                return "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300";
            case "C2":
                return "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-orange-300";
            case "C3":
                return "bg-gradient-to-r from-pink-100 to-pink-200 text-pink-800 border-pink-300";
            case "E":
                return "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300";
            default:
                return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300";
        }
    };

    const getDegreeText = (degree) => {
        // Map degree codes to their basic level
        if (!degree) return "unknown";

        const code = String(degree).padStart(3, '0');

        if (code.startsWith('9')) return "doctorate";
        if (code.startsWith('8')) return "master";
        if (code.startsWith('5') || code.startsWith('7')) return "bachelor";
        return "other";
    };

    const getDegreeColor = (degree) => {
        const degreeText = getDegreeText(degree);
        switch (degreeText) {
            case "doctorate":
                return "text-purple-700 bg-purple-100";
            case "master":
                return "text-blue-700 bg-blue-100";
            case "bachelor":
                return "text-green-700 bg-green-100";
            default:
                return "text-gray-700 bg-gray-100";
        }
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
        const endIndex = Math.min(currentPage * pageSize, filteredFaculty.length);
        return { startIndex, endIndex };
    };

    const { startIndex, endIndex } = getDisplayRange();

    // Get unique degree options for filter
    const degreeOptions = [...new Set(faculty.map(f => f.highest_degree_attained).filter(Boolean))];

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
                                Faculty Management
                            </h1>
                            <p className="text-gray-600 flex items-center">
                                <Users className="w-4 h-4 mr-2" />
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
                                            placeholder="Search faculty..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 pr-4 py-2 w-full sm:w-60 lg:w-80 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-200"
                                        />
                                    </div>

                                    <div className="relative w-full sm:w-auto">
                                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <select
                                            value={filterType}
                                            onChange={(e) => setFilterType(e.target.value)}
                                            className="pl-10 pr-8 py-2 w-full sm:w-auto border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm appearance-none cursor-pointer transition-all duration-200"
                                        >
                                            <option value="ALL">All Types</option>
                                            <option value="A1">Group A1</option>
                                            <option value="B">Group B</option>
                                            <option value="C1">Group C1</option>
                                            <option value="C2">Group C2</option>
                                            <option value="C3">Group C3</option>
                                            <option value="E">Group E</option>
                                        </select>
                                    </div>

                                    <div className="relative w-full sm:w-auto">
                                        <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <select
                                            value={filterDegree}
                                            onChange={(e) => setFilterDegree(e.target.value)}
                                            className="pl-10 pr-8 py-2 w-full sm:w-auto border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm appearance-none cursor-pointer transition-all duration-200"
                                        >
                                            <option value="ALL">All Degrees</option>
                                            {degreeOptions.map(degree => (
                                                <option key={degree} value={degree}>{degree}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-2 w-full xl:w-auto">
                                    <button
                                        onClick={handleExportToFormE2}
                                        disabled={exportLoading || faculty.length === 0}
                                        className="inline-flex items-center justify-center px-4 py-2 bg-white/50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-white hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        {exportLoading ? "Exporting..." : "Export Form E2"}
                                    </button>
                                    <button
                                        onClick={handleUploadFaculty}
                                        className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg text-sm font-medium hover:from-green-700 hover:to-green-800 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <Upload className="w-4 h-4 mr-2" />
                                        Upload Excel
                                    </button>
                                    <button
                                        onClick={handleAddFaculty}
                                        className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Faculty
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm text-gray-500">
                                <div className="flex items-center">
                                    <TrendingUp className="w-4 h-4 mr-1" />
                                    Showing {filteredFaculty.length > 0 ? startIndex : 0} to {endIndex} of {filteredFaculty.length} faculty members
                                    {filteredFaculty.length !== faculty.length && (
                                        <span className="text-blue-600 ml-1">
                                            (filtered from {faculty.length} total)
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
                                    Loading faculty...
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Faculty Table */}
                        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 overflow-hidden mb-6">
                            {/* Table Container with fixed layout */}
                            <div className="overflow-x-auto">
                                <div className="min-w-full">
                                    {/* Table Header - Fixed */}
                                    <div className="bg-gradient-to-r from-gray-50/80 to-blue-50/50 border-b border-gray-200/50 sticky top-0 z-10">
                                        <table className="min-w-full table-fixed">
                                            <thead>
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        Faculty Information
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        Position & Department
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        Academic Details
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        Workload & Status
                                                    </th>
                                                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                        </table>
                                    </div>

                                    {/* Table Body - Scrollable with max height */}
                                    <div
                                        className="max-h-[400px] overflow-y-auto overflow-x-hidden relative"
                                        style={{
                                            scrollBehavior: "smooth",
                                            scrollbarWidth: "thin",
                                            scrollbarColor: "#CBD5E1 #F1F5F9",
                                        }}
                                        key={`table-body-${filteredFaculty.length}-${filterType}-${filterDegree}-${searchTerm}`}
                                    >
                                        <table
                                            className="min-w-full table-fixed"
                                            style={{ width: "100%" }}
                                        >
                                            <tbody className="divide-y divide-gray-200/30">
                                                {paginatedData.map((member, index) => (
                                                    <tr
                                                        key={member.id}
                                                        className={`hover:bg-blue-50/30 transition-all duration-200 ${
                                                            index % 2 === 0
                                                                ? "bg-white/30"
                                                                : "bg-gray-50/30"
                                                        }`}
                                                    >
                                                        <td
                                                            className="px-4 py-4"
                                                            style={{ width: "320px" }}
                                                        >
                                                            <div className="flex items-center">
                                                                <div className="flex-shrink-0 h-10 w-10">
                                                                    <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700">
                                                                        <Users className="w-5 h-5" />
                                                                    </div>
                                                                </div>
                                                                <div className="ml-4 min-w-0 flex-1">
                                                                    <div
                                                                        className="text-sm font-semibold text-gray-900 text-wrap"
                                                                        title={member.name}
                                                                    >
                                                                        {member.name}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500 truncate">
                                                                        {member.gender && (
                                                                            <span className="mr-2">
                                                                                {member.gender}
                                                                            </span>
                                                                        )}
                                                                        {member.ssl_salary_grade && (
                                                                            <span className="text-blue-600">
                                                                                SG {member.ssl_salary_grade}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex items-center mt-1">
                                                                        {member.is_tenured === 'Yes' && (
                                                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mr-2">
                                                                                <UserCheck className="w-3 h-3 mr-1" />
                                                                                Tenured
                                                                            </span>
                                                                        )}
                                                                        {member.on_leave_without_pay === 1 && (
                                                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                                                                                <Clock className="w-3 h-3 mr-1" />
                                                                                On Leave
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td
                                                            className="px-4 py-4"
                                                            style={{ width: "256px" }}
                                                        >
                                                            <div className="space-y-2">
                                                                <span
                                                                    className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${getFacultyTypeColor(
                                                                        member.faculty_type
                                                                    )}`}
                                                                >
                                                                    {member.faculty_type || "Unknown"}
                                                                </span>
                                                                <div className="text-xs text-gray-600">
                                                                    <div
                                                                        className="font-medium text-gray-900 truncate"
                                                                        title={member.generic_faculty_rank}
                                                                    >
                                                                        {member.generic_faculty_rank || "No Rank"}
                                                                    </div>
                                                                    <div
                                                                        className="truncate"
                                                                        title={member.home_college}
                                                                    >
                                                                        {member.home_college || "No College"}
                                                                    </div>
                                                                    <div
                                                                        className="truncate text-blue-600"
                                                                        title={member.home_department}
                                                                    >
                                                                        {member.home_department || "No Department"}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td
                                                            className="px-4 py-4"
                                                            style={{ width: "224px" }}
                                                        >
                                                            <div className="space-y-1">
                                                                <div className="flex items-center">
                                                                    <span
                                                                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getDegreeColor(
                                                                            member.highest_degree_attained
                                                                        )}`}
                                                                    >
                                                                        <GraduationCap className="w-3 h-3 mr-1" />
                                                                        {member.highest_degree_attained || "N/A"}
                                                                    </span>
                                                                </div>
                                                                {member.pursuing_next_degree === 1 && (
                                                                    <div className="text-xs text-purple-600 flex items-center">
                                                                        <BookOpen className="w-3 h-3 mr-1" />
                                                                        Pursuing higher degree
                                                                    </div>
                                                                )}
                                                                <div className="text-xs text-gray-600">
                                                                    {member.masters_with_thesis === 1 && (
                                                                        <div>✓ Masters with thesis</div>
                                                                    )}
                                                                    {member.doctorate_with_dissertation === 1 && (
                                                                        <div>✓ Doctorate with dissertation</div>
                                                                    )}
                                                                </div>
                                                                <div className="text-xs text-gray-500 truncate">
                                                                    FTE: {member.full_time_equivalent || 0}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td
                                                            className="px-4 py-4"
                                                            style={{ width: "192px" }}
                                                        >
                                                            <div className="space-y-1">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {formatCurrency(member.annual_basic_salary)}
                                                                </div>
                                                                <div className="text-xs text-gray-600">
                                                                    <div>Total Load: {member.total_work_load || 0}</div>
                                                                    <div className="text-blue-600">
                                                                        Teaching: {(member.undergrad_total_credit_units || 0) + (member.graduate_total_credit_units || 0)} units
                                                                    </div>
                                                                    {member.research_load > 0 && (
                                                                        <div className="text-green-600">
                                                                            Research: {member.research_load}
                                                                        </div>
                                                                    )}
                                                                    {member.administrative_load > 0 && (
                                                                        <div className="text-purple-600">
                                                                            Admin: {member.administrative_load}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td
                                                            className="px-4 py-4 text-center"
                                                            style={{ width: "128px" }}
                                                        >
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
                                                                        onClick={() => handleViewDetails(member)}
                                                                        className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 focus:outline-none focus:bg-blue-50 transition-colors duration-150 group"
                                                                        role="menuitem"
                                                                    >
                                                                        <Eye className="w-4 h-4 mr-3 text-blue-500 group-hover:text-blue-600" />
                                                                        View Details
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleEdit(member)}
                                                                        className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-green-50 focus:outline-none focus:bg-green-50 transition-colors duration-150 group"
                                                                        role="menuitem"
                                                                    >
                                                                        <Edit className="w-4 h-4 mr-3 text-green-500 group-hover:text-green-600" />
                                                                        Edit Faculty
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDelete(member.id)}
                                                                        className="flex items-center w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50 focus:outline-none focus:bg-red-50 transition-colors duration-150"
                                                                        role="menuitem"
                                                                    >
                                                                        <Trash className="w-4 h-4 mr-3 text-red-700" />
                                                                        Delete Faculty
                                                                    </button>
                                                                </div>
                                                            </Popper>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {paginatedData.length === 0 && (
                                                    <tr>
                                                        <td colSpan="5" className="px-6 py-12 text-center">
                                                            <div className="text-gray-500">
                                                                <div className="mx-auto h-20 w-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                                                                    <Users className="w-10 h-10 text-gray-400" />
                                                                </div>

                                                                <div className="mb-4">
                                                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                                        {searchTerm || filterType !== "ALL" || filterDegree !== "ALL"
                                                                            ? "No faculty found"
                                                                            : "No faculty available"}
                                                                    </h3>
                                                                    <p className="text-gray-600">
                                                                        {searchTerm || filterType !== "ALL" || filterDegree !== "ALL"
                                                                            ? "Try adjusting your search or filter criteria"
                                                                            : "Get started by adding your first faculty member"}
                                                                    </p>
                                                                </div>

                                                                {!searchTerm && filterType === "ALL" && filterDegree === "ALL" && (
                                                                    <div className="space-y-3">
                                                                        <button
                                                                            onClick={handleAddFaculty}
                                                                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 shadow-sm hover:shadow-md transition-all duration-200 mr-3"
                                                                        >
                                                                            <Plus className="w-4 h-4 mr-2" />
                                                                            Add Faculty
                                                                        </button>
                                                                        <button
                                                                            onClick={handleUploadFaculty}
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
                        {filteredFaculty.length > 0 && (
                            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-sm">
                                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                    <div className="text-sm text-gray-700">
                                        Showing {startIndex} to {endIndex} of {filteredFaculty.length} results
                                        {filteredFaculty.length !== faculty.length && (
                                            <span className="text-blue-600 ml-1">
                                                (filtered from {faculty.length} total)
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

                {/* Faculty Detail Modal */}
                <FacultyDetailsView
                    isOpen={isDetailModalOpen}
                    onClose={closeDetailModal}
                    facultyData={selectedFaculty}
                />

                {/* Add Faculty Modal */}
                <AddFacultyForm
                    isOpen={isAddModalOpen}
                    onClose={closeAddModal}
                    onSave={handleSaveFaculty}
                    institutionId={SucDetailId}
                    loading={addLoading}
                />

                {/* Edit Faculty Modal */}
                <EditFacultyForm
                    isOpen={isEditModalOpen}
                    onClose={closeEditModal}
                    onSave={handleUpdateFaculty}
                    facultyData={selectedFaculty}
                    loading={editLoading}
                />

                {/* Upload Faculty Modal */}
                <FacultyUploadModal
                    isOpen={isUploadModalOpen}
                    onClose={closeUploadModal}
                    institutionId={SucDetailId}
                    onUploadSuccess={fetchFaculty}
                />
            </div>
        </div>
    );
}

export default SucFormE2;
