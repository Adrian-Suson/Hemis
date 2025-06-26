/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
    Users,
    MoreHorizontal,
    ArrowLeft,
    X,
    Eye,
    User,
    GraduationCap,
    Search,
    Filter,
    Download,
    Plus,
    TrendingUp,
    Edit,
    Trash,
    BookOpen,
    Clock,
    Award,
    PhilippinePeso,
    Upload,
} from "lucide-react";
import Popper from "../../../../Components/Popper";
import FacultyDetailsView from "./FacultyDetailsView"; // Import the separate component
import AddFacultyForm from "./AddFacultyForm"; // Import the add faculty form
import EditFacultyForm from "./EditFacultyForm"; // Import the edit faculty form
import FacultyUploadModal from "./FacultyUploadModal";
import Pagination from "../../../../Components/Pagination";
import config from "../../../../utils/config";
import axios from "axios"; // Ensure axios is imported
import ExcelJS from "exceljs";
import Swal from "sweetalert2";
import {
    facultyTypeOptions,
    GENERIC_FACULTY_RANK,
    HIGHEST_DEGREE,
    TENURED_STATUS,
    SALARY_GRADE,
    ANNUAL_SALARY,
    ON_LEAVE_PAY,
    GENDER
} from "../../../../utils/SucFormE1Constants.jsx";

function SucFormE1() {
    const { SucDetailId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const heiUiid = location.state?.heiUiid || "Unknown Institution";
    const heiName = location.state?.heiName || "Unknown Institution";

    const [faculties, setFaculties] = useState([]);
    const [filteredFaculties, setFilteredFaculties] = useState([]);
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

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Fetch faculties when component mounts
    useEffect(() => {
        fetchFaculties();
    }, []);

    // Filter faculties based on search and type
    useEffect(() => {
        let filtered = faculties;

        if (searchTerm) {
            filtered = filtered.filter(
                (faculty) =>
                    faculty.faculty_name_ln
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    faculty.faculty_name_fn
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    faculty.home_college
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    faculty.home_dept
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    faculty.generic_faculty_rank
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
        }

        if (filterType !== "ALL") {
            filtered = filtered.filter(
                (faculty) => faculty.faculty_type === filterType
            );
        }

        setFilteredFaculties(filtered);
        // Reset to first page when filters change
        setCurrentPage(1);
    }, [faculties, searchTerm, filterType]);

    // Calculate paginated data
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return filteredFaculties.slice(startIndex, endIndex);
    }, [filteredFaculties, currentPage, pageSize]);

    // Calculate total pages
    const totalPages = Math.ceil(filteredFaculties.length / pageSize);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (newPageSize) => {
        setPageSize(newPageSize);
        setCurrentPage(1);
    };

    const getDisplayRange = () => {
        const start = (currentPage - 1) * pageSize + 1;
        const end = Math.min(start + pageSize - 1, filteredFaculties.length);
        return `${start}-${end}`;
    };

    const handleExportToFormE1 = useCallback(async () => {
        try {
            setExportLoading(true);

            Swal.fire({
                title: "Confirm Export",
                text: `Do you want to export Form E-1 for ${heiName}?`,
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
                        // Fetch the Form E-1 template
                        const response = await fetch("/templates/Form-E1-Themeplate.xlsx");
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }

                        const arrayBuffer = await response.arrayBuffer();
                        const workbook = new ExcelJS.Workbook();
                        await workbook.xlsx.load(arrayBuffer);

                        // Helper to get or create a sheet by name (case-insensitive)
                        const getOrCreateSheet = (workbook, sheetName) => {
                            let sheet = workbook.getWorksheet(sheetName);
                            if (!sheet) {
                                for (let i = 0; i < workbook.worksheets.length; i++) {
                                    const ws = workbook.worksheets[i];
                                    if (ws.name.toUpperCase() === sheetName.toUpperCase()) {
                                        sheet = ws;
                                        break;
                                    }
                                }
                            }
                            // Optionally create the sheet if not found
                            if (!sheet) {
                                sheet = workbook.addWorksheet(sheetName);
                            }
                            return sheet;
                        };

                        // Map faculty_type to sheet name
                        const facultyTypeToSheet = (type) => {
                            if (!type) return null;
                            const upper = String(type).toUpperCase();
                            if (upper === "A1") return "GROUP A1";
                            if (upper === "B") return "GROUP B";
                            if (upper === "C1") return "GROUP C1";
                            if (upper === "C2") return "GROUP C2";
                            if (upper === "C3") return "GROUP C3";
                            if (upper === "E") return "GROUP E";
                            return null;
                        };

                        // Track the next row for each sheet (start after the template header, e.g., row 11)
                        const sheetNextRow = {};
                        ["GROUP A1", "GROUP B", "GROUP C1", "GROUP C2", "GROUP C3", "GROUP E"].forEach(sheetName => {
                            const sheet = getOrCreateSheet(workbook, sheetName);
                            // Find the starting row for data dynamically by searching for 'START BELOW THIS ROW'
                            let dataStartRow = -1;
                            sheet.eachRow((row, rowNumber) => {
                                let foundMarker = false;
                                row.eachCell((cell) => {
                                    if (cell.value && String(cell.value).trim() === "START BELOW THIS ROW") {
                                        foundMarker = true;
                                        return false;
                                    }
                                });
                                if (foundMarker) {
                                    dataStartRow = rowNumber + 1;
                                    return false;
                                }
                            });
                            if (dataStartRow === -1) dataStartRow = 11; // fallback
                            sheetNextRow[sheetName] = dataStartRow;
                        });

                        // Now, for each faculty, write to the correct sheet
                        faculties.forEach((faculty, index) => {
                            const sheetName = facultyTypeToSheet(faculty.faculty_type);
                            if (!sheetName) return; // skip if no valid type

                            const sheet = getOrCreateSheet(workbook, sheetName);
                            const rowNumber = sheetNextRow[sheetName]++;
                            const row = sheet.getRow(rowNumber);

                            row.getCell(1).value = index + 1; // Index column

                            row.getCell(2).value = faculty.faculty_name || "";
                            row.getCell(3).value = faculty.generic_faculty_rank || "";
                            row.getCell(4).value = faculty.home_college || "";
                            row.getCell(5).value = faculty.home_dept || "";
                            row.getCell(6).value = faculty.is_tenured || "";
                            row.getCell(7).value = faculty.ssl_salary_grade || "";
                            row.getCell(8).value = faculty.annual_basic_salary || "";
                            row.getCell(9).value = faculty.on_leave_without_pay || "";
                            row.getCell(10).value = faculty.full_time_equivalent || "";
                            row.getCell(11).value = faculty.gender || "";
                            row.getCell(12).value = faculty.highest_degree_attained || "";
                            row.getCell(13).value = faculty.actively_pursuing_next_degree || "";
                            row.getCell(14).value = faculty.primary_teaching_load_discipline_1 || "";
                            row.getCell(15).value = faculty.primary_teaching_load_discipline_2 || "";
                            row.getCell(16).value = faculty.bachelors_discipline || "";
                            row.getCell(17).value = faculty.masters_discipline || "";
                            row.getCell(18).value = faculty.doctorate_discipline || "";
                            row.getCell(19).value = faculty.masters_with_thesis || "";
                            row.getCell(20).value = faculty.doctorate_with_dissertation || "";
                            row.getCell(21).value = faculty.lab_hours_elem_sec || "";
                            row.getCell(22).value = faculty.lecture_hours_elem_sec || "";
                            // row.getCell(23).value = faculty.total_teaching_hours_elem_sec || "";
                            row.getCell(24).value = faculty.student_lab_contact_hours_elem_sec || "";
                            row.getCell(25).value = faculty.student_lecture_contact_hours_elem_sec || "";
                            // row.getCell(26).value = faculty.total_student_contact_hours_elem_sec || "";
                            row.getCell(27).value = faculty.lab_hours_tech_voc || "";
                            row.getCell(28).value = faculty.lecture_hours_tech_voc || "";
                            // row.getCell(29).value = faculty.total_teaching_hours_tech_voc || "";
                            row.getCell(30).value = faculty.student_lab_contact_hours_tech_voc || "";
                            row.getCell(31).value = faculty.student_lecture_contact_hours_tech_voc || "";
                            // row.getCell(32).value = faculty.total_student_contact_hours_tech_voc || "";
                            row.getCell(33).value = faculty.official_research_load || "";
                            row.getCell(34).value = faculty.official_extension_services_load || "";
                            row.getCell(35).value = faculty.official_study_load || "";
                            row.getCell(36).value = faculty.official_load_for_production || "";
                            row.getCell(37).value = faculty.official_administrative_load || "";
                            row.getCell(38).value = faculty.other_official_load_credits || "";
                            // row.getCell(39).value = faculty.total_work_load || "";

                            row.commit();
                        });

                        console.log(`Export completed: ${faculties.length} faculty records exported`);

                        // Generate filename
                        const fileName = `${heiUiid}_${heiName.replace(/[^a-zA-Z0-9]/g, '_')}_FormE1_${new Date().toISOString().split('T')[0]}.xlsx`;

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
                            text: `Form E-1 exported successfully. ${faculties.length} faculty records exported.`,
                            icon: "success",
                            timer: 4000,
                            showConfirmButton: false,
                        });

                    } catch (error) {
                        console.error("Error exporting Form E-1:", error);
                        Swal.fire({
                            title: "Error!",
                            text: "Failed to export Form E-1. Please try again.",
                            icon: "error",
                            confirmButtonText: "OK",
                        });
                    } finally {
                        setExportLoading(false);
                    }
                } else {
                    setExportLoading(false);
                }
            });
        } catch (error) {
            console.error("Error in export function:", error);
            setExportLoading(false);
        }
    }, [faculties, heiName]);

    const fetchFaculties = async () => {
        if (!SucDetailId) {
            console.error("SucDetailId is undefined. Cannot fetch faculties.");
            setError(
                "Invalid institution ID. Please check the URL or try again."
            );
            setLoading(false);
            return;
        }

        setLoading(true);
        setError("");
        try {
            const response = await axios.get(`${config.API_URL}/suc-form-e1`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    Accept: "application/json",
                },
                params: {
                    suc_details_id: SucDetailId,
                },
            });

            const facultyData = Array.isArray(response.data)
                ? response.data.filter(faculty => faculty.suc_details_id == SucDetailId)
                : response.data.data?.filter(faculty => faculty.suc_details_id == SucDetailId) || [];
            setFaculties(facultyData);
            setFilteredFaculties(facultyData);
            console.log("Fetched faculties:", facultyData);

        } catch (err) {
            console.error("Error fetching faculties:", err);
            setError("Failed to load faculty records. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (faculty) => {
        setSelectedFaculty(faculty);
        setIsDetailModalOpen(true);
    };

    const handleEdit = (faculty) => {
        setSelectedFaculty(faculty);
        setIsEditModalOpen(true);
    };

    const handleUpdateFaculty = async (updatedFacultyData) => {
        setEditLoading(true);
        try {
            const response = await axios.put(`${config.API_URL}/suc-form-e1/${updatedFacultyData.id}`, updatedFacultyData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                // Update the faculty in the list
                const updatedFaculty = response.data;
                setFaculties(prev => prev.map(faculty =>
                    faculty.id === updatedFaculty.id ? updatedFaculty : faculty
                ));
                setFilteredFaculties(prev => prev.map(faculty =>
                    faculty.id === updatedFaculty.id ? updatedFaculty : faculty
                ));

                // Close the modal and show success message
                setIsEditModalOpen(false);
                setSelectedFaculty(null);
                console.log("Faculty updated successfully:", updatedFaculty);

                // You can add a toast notification here if you have one
                // toast.success("Faculty updated successfully!");
            }
        } catch (err) {
            console.error("Error updating faculty:", err);
            setError("Failed to update faculty. Please try again.");

            // You can add a toast notification here if you have one
            // toast.error("Failed to update faculty. Please try again.");
        } finally {
            setEditLoading(false);
        }
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedFaculty(null);
    };

    const handleAddFaculty = () => {
        setIsAddModalOpen(true);
    };

    const handleSaveFaculty = async (facultyData) => {
        setAddLoading(true);
        try {
            const response = await axios.post(`${config.API_URL}/suc-form-e1`, {
                ...facultyData,
                suc_details_id: SucDetailId
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 201) {
                // Add the new faculty to the list
                const newFaculty = response.data;
                setFaculties(prev => [...prev, newFaculty]);
                setFilteredFaculties(prev => [...prev, newFaculty]);

                // Close the modal and show success message
                setIsAddModalOpen(false);
                console.log("Faculty created successfully:", newFaculty);

                // You can add a toast notification here if you have one
                // toast.success("Faculty created successfully!");
            }
        } catch (err) {
            console.error("Error creating faculty:", err);
            setError("Failed to create faculty. Please try again.");

            // You can add a toast notification here if you have one
            // toast.error("Failed to create faculty. Please try again.");
        } finally {
            setAddLoading(false);
        }
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
    };

    const handleDelete = async (facultyId) => {
        if (!window.confirm("Are you sure you want to delete this faculty record?"))
            return;

        try {
            const response = await axios.delete(
                `${config.API_URL}/suc-form-e1/${facultyId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        Accept: "application/json",
                    },
                }
            );

            if (response.status === 200) {
                setFaculties(faculties.filter((faculty) => faculty.id !== facultyId));
                setFilteredFaculties(filteredFaculties.filter((faculty) => faculty.id !== facultyId));
            } else {
                throw new Error("Failed to delete faculty");
            }
        } catch (err) {
            console.error("Error deleting faculty:", err);
            setError("Failed to delete faculty. Please try again.");
        }
    };

    const handleBack = () => {
        navigate("/super-admin/institutions/suc");
    };

    const closeDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedFaculty(null);
    };

    const getDegreeColor = (degree) => {
        switch (degree?.toLowerCase()) {
            case 'doctorate':
            case 'phd':
                return "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300";
            case 'masters':
            case 'master':
                return "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300";
            case 'bachelors':
            case 'bachelor':
                return "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300";
            default:
                return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300";
        }
    };

    useEffect(() => {
        console.log("Institution Name:", heiName);
    }, [heiName]);

    // Helper to get label from object constant
    const getLabelFromConstant = (value, constant) => {
        if (!value && value !== 0) return "Not specified";
        if (Array.isArray(constant)) {
            const found = constant.find(opt => String(opt.code) === String(value));
            return found ? found.label : value;
        }
        return constant[String(value)] || value;
    };

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
                                Faculty Management (Form E-1)
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
                                            {facultyTypeOptions.map((opt) => (
                                                <option key={opt.code} value={opt.code}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-2 w-full xl:w-auto">
                                    <button
                                        onClick={handleExportToFormE1}
                                        disabled={exportLoading}
                                        className="inline-flex items-center justify-center px-4 py-2 bg-white/50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-white hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        {exportLoading ? "Exporting..." : "Export"}
                                    </button>
                                    <button
                                        onClick={() => setIsUploadModalOpen(true)}
                                        className="inline-flex items-center justify-center px-4 py-2 bg-white/50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-white hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <Upload className="w-4 h-4 mr-2" />
                                        Upload
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
                                    Showing {getDisplayRange()} of {filteredFaculties.length} faculty members
                                </div>
                                <div className="flex items-center gap-2">
                                    <select
                                        value={pageSize}
                                        onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                                        className="px-2 py-1 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm"
                                    >
                                        <option value={5}>5 per page</option>
                                        <option value={10}>10 per page</option>
                                        <option value={20}>20 per page</option>
                                        <option value={50}>50 per page</option>
                                    </select>
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
                                    Loading faculty records...
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Faculty Table with Fixed Height */
                    <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 overflow-hidden">
                        {/* Table Header - Fixed */}
                        <div className="bg-gradient-to-r from-gray-50/80 to-blue-50/50 border-b border-gray-200/50">
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Faculty Information
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Position & College
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Education & Status
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Work Load & Salary
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
                                        {paginatedData.map(
                                            (faculty, index) => (
                                                <tr
                                                    key={faculty.id}
                                                    className={`hover:bg-blue-50/30 transition-all duration-200 ${
                                                        index % 2 === 0
                                                            ? "bg-white/30"
                                                            : "bg-gray-50/30"
                                                    }`}
                                                >
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10">
                                                                <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-700">
                                                                    <User className="w-5 h-5" />
                                                                </div>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-semibold text-gray-900">
                                                                    {(faculty.faculty_name)}
                                                                </div>
                                                                <div className="text-xs text-gray-500 flex items-center">
                                                                    <User className="w-3 h-3 mr-1" />
                                                                    {getLabelFromConstant(faculty.gender, GENDER)}
                                                                </div>
                                                                <div className="text-xs text-gray-500 flex items-center mt-1">
                                                                    <Award className="w-3 h-3 mr-1" />
                                                                    {getLabelFromConstant(faculty.faculty_type, facultyTypeOptions)}
                                                                </div>
                                                                <div className="text-xs text-gray-400 flex items-center mt-1">
                                                                    <span className="font-mono">ID: {faculty.id}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="space-y-2">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {getLabelFromConstant(faculty.generic_faculty_rank, GENERIC_FACULTY_RANK) || "Not assigned"}
                                                            </div>
                                                            <div className="text-xs text-gray-600">
                                                                <div className="flex items-center">
                                                                    <BookOpen className="w-3 h-3 mr-1 text-blue-500" />
                                                                    {faculty.home_college || "No college"}
                                                                </div>
                                                                <div className="flex items-center mt-1">
                                                                    <Award className="w-3 h-3 mr-1 text-green-500" />
                                                                    {faculty.home_dept || "No department"}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="space-y-2">
                                                            <span
                                                                className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${getDegreeColor(faculty.highest_degree_attained)}`}
                                                            >
                                                                {getLabelFromConstant(faculty.highest_degree_attained, HIGHEST_DEGREE) || "Not specified"}
                                                            </span>
                                                            <div className="space-y-1">
                                                                {faculty.is_tenured && (
                                                                    <div className="text-xs text-green-600 flex items-center">
                                                                        <Award className="w-3 h-3 mr-1" />
                                                                        {getLabelFromConstant(faculty.is_tenured, TENURED_STATUS)}
                                                                    </div>
                                                                )}
                                                                {faculty.actively_pursuing_next_degree && (
                                                                    <div className="text-xs text-blue-600 flex items-center">
                                                                        <GraduationCap className="w-3 h-3 mr-1" />
                                                                        {getLabelFromConstant(faculty.actively_pursuing_next_degree, HIGHEST_DEGREE)}
                                                                    </div>
                                                                )}
                                                                {faculty.on_leave_without_pay && (
                                                                    <div className="text-xs text-orange-600 flex items-center">
                                                                        <Clock className="w-3 h-3 mr-1" />
                                                                        {getLabelFromConstant(faculty.on_leave_without_pay, ON_LEAVE_PAY)}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="space-y-1">
                                                            <div className="text-sm font-medium text-gray-900 flex items-center">
                                                                <Clock className="w-3 h-3 mr-1 text-blue-500" />
                                                                {faculty.total_work_load ? `${faculty.total_work_load} hrs` : "Not set"}
                                                            </div>
                                                            <div className="text-xs text-gray-600">
                                                                {faculty.annual_basic_salary && (
                                                                    <div className="flex items-center">
                                                                        <PhilippinePeso className="w-3 h-3 mr-1 text-green-500" />
                                                                        {getLabelFromConstant(faculty.annual_basic_salary, ANNUAL_SALARY)}
                                                                    </div>
                                                                )}
                                                                <div className="text-xs text-gray-500 mt-1">
                                                                    Grade: {getLabelFromConstant(faculty.ssl_salary_grade, SALARY_GRADE) || "Not specified"}
                                                                </div>
                                                            </div>
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
                                                                            faculty
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
                                                                            faculty
                                                                        )
                                                                    }
                                                                    className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-green-50 focus:outline-none focus:bg-green-50 transition-colors duration-150 group"
                                                                    role="menuitem"
                                                                >
                                                                    <Edit className="w-4 h-4 mr-3 text-green-500 group-hover:text-green-600" />
                                                                    Edit Faculty
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            faculty.id
                                                                        )
                                                                    }
                                                                    className="flex items-center w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50 focus:outline-none focus:bg-red-50 transition-colors duration-150 group"
                                                                    role="menuitem"
                                                                >
                                                                    <Trash className="w-4 h-4 mr-3 text-red-700 group-hover:text-red-800" />
                                                                    Delete Faculty
                                                                </button>
                                                            </div>
                                                        </Popper>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                        {filteredFaculties.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan="5"
                                                    className="px-6 py-12 text-center"
                                                >
                                                    <div className="text-gray-500">
                                                        <div className="mx-auto h-20 w-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                                                            <Users className="w-10 h-10 text-gray-400" />
                                                        </div>
                                                        <p className="text-lg font-semibold text-gray-900 mb-2">
                                                            {searchTerm ||
                                                            filterType !== "ALL"
                                                                ? "No matching faculty found"
                                                                : "No Faculty Records Found"}
                                                        </p>
                                                        <p className="text-sm text-gray-600 mb-4">
                                                            {searchTerm ||
                                                            filterType !== "ALL"
                                                                ? "Try adjusting your search terms or filters."
                                                                : "This institution has no faculty records yet."}
                                                        </p>
                                                        {!searchTerm &&
                                                            filterType === "ALL" && (
                                                                <button
                                                                    onClick={handleAddFaculty}
                                                                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 shadow-sm hover:shadow-md transition-all duration-200"
                                                                >
                                                                    <Plus className="w-4 h-4 mr-2" />
                                                                    Add First Faculty
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
                    </div>
                )}

                {/* Pagination */}
                {filteredFaculties.length > 0 && (
                    <div className="mt-4 flex justify-center">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            pageSize={pageSize}
                            onPageSizeChange={handlePageSizeChange}
                        />
                    </div>
                )}

                {/* Faculty Detail Modal using separate component */}
                <FacultyDetailsView
                    isOpen={isDetailModalOpen}
                    onClose={closeDetailModal}
                    facultyData={selectedFaculty}
                />

                {/* Add Faculty Modal using separate component */}
                <AddFacultyForm
                    isOpen={isAddModalOpen}
                    onClose={closeAddModal}
                    onSave={handleSaveFaculty}
                    institutionId={SucDetailId}
                    loading={addLoading}
                />

                {/* Edit Faculty Modal using separate component */}
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
                    onClose={() => setIsUploadModalOpen(false)}
                    onUploadSuccess={fetchFaculties}
                    institutionId={SucDetailId}
                />
            </div>
        </div>
    );
}

SucFormE1.propTypes = {
    // No props required since data is fetched internally
};

export default SucFormE1;
