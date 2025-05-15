/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../../../utils/config";
import ExcelJS from "exceljs";
import { encryptId } from "../../../utils/encryption";
import { useLoading } from "../../../Context/LoadingContext";
import PropTypes from "prop-types";
import AlertComponent from "../../../Components/AlertComponent";
import useLocationData from "../../../utils/useLocationData";
import EditDialog from "./EditDialog";
import CHEDButton from "../../../Components/CHEDButton";
import {
    BookOpen,
    Building,
    Calendar,
    Clipboard,
    Globe,
    Home,
    IdCard,
    Info,
    Mail,
    Phone,
    School,
    User,
    FileSpreadsheet,
    RefreshCw,
    Award,
    Users,
    ArrowDownToLine,
    Trash2,
} from "lucide-react";

// CHED Logo Colors
const CHED_COLORS = {
    blue: "#0038A8", // Deep blue from the logo
    yellow: "#FCD116", // Bright yellow from the sunrays
    red: "#CE1126", // Red from the triangle
    darkBlue: "#002776", // Darker blue for hover states
    lightYellow: "#FFED99", // Light yellow for backgrounds
    lightRed: "#FFD6D6", // Light red for warnings or highlights
    gray: "#6B7280", // Gray for neutral text
    lightGray: "#F3F4F6", // Light gray for backgrounds
};

// Custom InfoCard component with CHED styling
const InfoCard = ({
    title,
    icon,
    children,
    borderColor = CHED_COLORS.blue,
}) => (
    <div
        className="bg-white shadow-md rounded-lg p-5 mb-4 border-t-4"
        style={{ borderColor }}
    >
        <div className="flex items-center mb-3">
            <div
                className="rounded-full p-2 mr-3"
                style={{ backgroundColor: `${borderColor}20` }}
            >
                {React.cloneElement(icon, { color: borderColor, size: 20 })}
            </div>
            <h3
                className="text-base font-semibold"
                style={{ color: borderColor }}
            >
                {title}
            </h3>
        </div>
        <div className="pl-2">{children}</div>
    </div>
);

InfoCard.propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired,
    borderColor: PropTypes.string,
};

// Custom InfoItem component
const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-start mb-3">
        <div className="text-gray-500 mt-0.5 mr-3">{icon}</div>
        <div>
            <p className="text-sm text-gray-700">
                <span className="font-medium">{label}</span>
                <br />
                <span className="text-gray-900">{value}</span>
            </p>
        </div>
    </div>
);

InfoItem.propTypes = {
    icon: PropTypes.node.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.node.isRequired,
};

// Custom ActionButton component
const ActionButton = ({
    icon,
    label,
    onClick,
    loading,
    disabled,
    variant = "primary",
}) => {
    const getButtonStyle = () => {
        switch (variant) {
            case "primary":
                return {
                    bgColor: CHED_COLORS.blue,
                    hoverBgColor: CHED_COLORS.darkBlue,
                    textColor: "white",
                };
            case "secondary":
                return {
                    bgColor: "#FFF",
                    hoverBgColor: CHED_COLORS.lightYellow,
                    textColor: CHED_COLORS.blue,
                    borderColor: CHED_COLORS.blue,
                };
            case "warning":
                return {
                    bgColor: CHED_COLORS.red,
                    hoverBgColor: "#B10000",
                    textColor: "white",
                };
            default:
                return {
                    bgColor: CHED_COLORS.blue,
                    hoverBgColor: CHED_COLORS.darkBlue,
                    textColor: "white",
                };
        }
    };

    const style = getButtonStyle();

    return (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            className={`flex items-center justify-center w-full px-4 py-3 rounded-lg text-sm font-medium 
      transition-all duration-200 mb-3 border ${
          disabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-md"
      }`}
            style={{
                backgroundColor: style.bgColor,
                color: style.textColor,
                borderColor: style.borderColor || style.bgColor,
            }}
        >
            {loading ? (
                <>
                    <svg
                        className="animate-spin h-4 w-4 mr-2"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                        />
                    </svg>
                    Processing...
                </>
            ) : (
                <>
                    {React.cloneElement(icon, { size: 18 })}
                    <span className="ml-2">{label}</span>
                </>
            )}
        </button>
    );
};

ActionButton.propTypes = {
    icon: PropTypes.node.isRequired,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
    variant: PropTypes.oneOf(["primary", "secondary", "warning"]),
};

ActionButton.defaultProps = {
    loading: false,
    disabled: false,
    variant: "primary",
};

// Badge component for status indicators
const Badge = ({ children, color }) => (
    <span
        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
        style={{
            backgroundColor: `${color}20`,
            color: color,
            border: `1px solid ${color}`,
        }}
    >
        {children}
    </span>
);

Badge.propTypes = {
    children: PropTypes.node.isRequired,
    color: PropTypes.string.isRequired,
};

const InstitutionManagement = () => {
    const [institutions, setInstitutions] = useState([]);
    const [institution, setInstitution] = useState(null);
    const [location, setLocation] = useState({
        region: null,
        province: null,
        municipality: null,
    });
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const { showLoading, hideLoading, updateProgress } = useLoading();
    const { getLocationById } = useLocationData();
    const [loading, setLoading] = useState({
        viewCampuses: false,
        faculties: false,
        academicPrograms: false,
        curricularPrograms: false,
        graduates: false,
        exportFormA: false,
        deleteInstitution: false,
    });
    const [searchTerm, setSearchTerm] = useState(
        localStorage.getItem("searchTerm") || ""
    );
    const [typeFilter, setTypeFilter] = useState(
        localStorage.getItem("typeFilter") || ""
    );
    const [municipalityFilter, setMunicipalityFilter] = useState(
        localStorage.getItem("municipalityFilter") || ""
    );
    const [provinceFilter, setProvinceFilter] = useState(
        localStorage.getItem("provinceFilter") || ""
    );
    const [reportYearFilter, setReportYearFilter] = useState(
        localStorage.getItem("reportYearFilter") ||
            String(new Date().getFullYear())
    );
    const navigate = useNavigate();

    const getInstitutionType = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        return user?.institution_type || "SUC";
    };

    const fetchInstitution = async () => {
        try {
            showLoading();
            const token = localStorage.getItem("token");
            const user = JSON.parse(localStorage.getItem("user"));
            const storedInstitution = JSON.parse(
                localStorage.getItem("institution")
            );

            console.log("Stored institution for filtering:", storedInstitution);

            if (!user?.institution_id) {
                AlertComponent.showAlert(
                    "No institution associated with this user.",
                    "warning"
                );
                return;
            }

            const url = `${config.API_URL}/institutions`;
            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            let institutionsData = Array.isArray(response.data)
                ? response.data
                : [response.data];

            console.log("Fetched institutions:", institutionsData);

            const filteredInstitutions = institutionsData.filter(
                (inst) => inst.name === storedInstitution.name
            );
            console.log("Filtered institutions:", filteredInstitutions);

            setInstitutions(filteredInstitutions);
            const selectedInstitution = filteredInstitutions[0] || null;
            setInstitution(selectedInstitution);

            if (selectedInstitution) {
                const locationData = await getLocationById(
                    selectedInstitution.region_id,
                    selectedInstitution.province_id,
                    selectedInstitution.municipality_id
                );
                setLocation(locationData);
            }
        } catch (error) {
            console.error("Error fetching institution:", error);
            AlertComponent.showAlert(
                "Failed to load institution data.",
                "error"
            );
        } finally {
            hideLoading();
        }
    };

    useEffect(() => {
        fetchInstitution();
    }, []);

    useEffect(() => {
        localStorage.setItem("searchTerm", searchTerm);
        localStorage.setItem("typeFilter", typeFilter);
        localStorage.setItem("municipalityFilter", municipalityFilter);
        localStorage.setItem("provinceFilter", provinceFilter);
        localStorage.setItem("reportYearFilter", reportYearFilter);
    }, [
        searchTerm,
        typeFilter,
        municipalityFilter,
        provinceFilter,
        reportYearFilter,
    ]);

    const filteredInstitutions = useMemo(() => {
        return institutions.filter((institution) => {
            const matchesSearch = institution.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            const matchesType = typeFilter
                ? institution.institution_type === typeFilter
                : true;
            const matchesMunicipality = municipalityFilter
                ? institution.municipality === municipalityFilter
                : true;
            const matchesProvince = provinceFilter
                ? institution.province === provinceFilter
                : true;
            const matchesReportYear = reportYearFilter
                ? String(institution.report_year) === reportYearFilter
                : true;
            return (
                matchesSearch &&
                matchesType &&
                matchesMunicipality &&
                matchesProvince &&
                matchesReportYear
            );
        });
    }, [
        institutions,
        searchTerm,
        typeFilter,
        municipalityFilter,
        provinceFilter,
        reportYearFilter,
    ]);

    useEffect(() => {
        if (filteredInstitutions.length > 0) {
            setInstitution(filteredInstitutions[0]);
        } else {
            setInstitution(null);
        }
    }, [filteredInstitutions]);

    const getUniqueValues = (arr, key) => {
        if (!Array.isArray(arr) || arr.length === 0) {
            return [];
        }
        return [
            ...new Set(arr.map((item) => item?.[key]).filter(Boolean)),
        ].sort();
    };

    const filterOptions = {
        types: getUniqueValues(institutions, "institution_type"),
        municipalities: getUniqueValues(institutions, "municipality"),
        provinces: getUniqueValues(institutions, "province"),
        reportYears: getUniqueValues(institutions, "report_year"),
    };

    const clearFilters = () => {
        setSearchTerm("");
        setTypeFilter("");
        setMunicipalityFilter("");
        setProvinceFilter("");
        setReportYearFilter("");
        localStorage.setItem("searchTerm", "");
        localStorage.setItem("typeFilter", "");
        localStorage.setItem("municipalityFilter", "");
        localStorage.setItem("provinceFilter", "");
        localStorage.setItem("reportYearFilter", "");
    };

    const handleExportToFormA = async () => {
        if (!institution) {
            AlertComponent.showAlert("No data available to export.", "warning");
            return;
        }
        updateProgress(10);
        setLoading((prev) => ({ ...prev, exportFormA: true }));
        try {
            const response = await fetch("/templates/Form-A-Themeplate.xlsx");
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const arrayBuffer = await response.arrayBuffer();

            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(arrayBuffer);

            const sheetA1 = workbook.getWorksheet("FORM A1");
            const sheetA2 = workbook.getWorksheet("FORM A2");

            const a1Data = [
                institution.name || "N/A",
                "", // ADDRESS header
                "",
                institution.address_street || "N/A",
                institution.municipality_city || "N/A",
                institution.province || "N/A",
                institution.region || "N/A",
                institution.postal_code || "N/A",
                institution.institutional_telephone || "N/A",
                institution.institutional_fax || "N/A",
                institution.head_telephone || "N/A",
                institution.institutional_email || "N/A",
                institution.institutional_website || "N/A",
                institution.year_established || "N/A",
                institution.sec_registration || "N/A",
                institution.year_granted_approved || "N/A",
                institution.year_converted_college || "N/A",
                institution.year_converted_university || "N/A",
                institution.head_name || "N/A",
                institution.head_title || "N/A",
                institution.head_education || "N/A",
            ];
            a1Data.forEach((value, index) => {
                sheetA1.getRow(5 + index).getCell(3).value = value;
            });
            updateProgress(50);
            const token = localStorage.getItem("token");
            const campusResponse = await axios.get(
                `${config.API_URL}/campuses?institution_id=${institution.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const campuses = Array.isArray(campusResponse.data.campuses)
                ? campusResponse.data.campuses
                : [];

            campuses.forEach((campus, index) => {
                const row = sheetA2.getRow(14 + index);
                row.values = [
                    index + 1,
                    campus.suc_name || "N/A",
                    campus.campus_type || "N/A",
                    campus.institutional_code || "N/A",
                    campus.region || "N/A",
                    campus.municipality_city_province || "N/A",
                    campus.year_first_operation || "N/A",
                    campus.land_area_hectares || "0.0",
                    campus.distance_from_main || "0.0",
                    campus.autonomous_code || "N/A",
                    campus.position_title || "N/A",
                    campus.head_full_name || "N/A",
                    campus.former_name || "N/A",
                    campus.latitude_coordinates || "0.0",
                    campus.longitude_coordinates || "0.0",
                ];
            });

            const fileName = `Form_A_${getInstitutionType()}_${
                new Date().toISOString().split("T")[0]
            }.xlsx`;
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);

            AlertComponent.showAlert("Data exported successfully!", "success");
            updateProgress(100);
        } catch (error) {
            console.error("Error exporting data:", error);
            AlertComponent.showAlert("Error exporting data.", "error");
        } finally {
            setLoading((prev) => ({ ...prev, exportFormA: false }));
        }
    };

    const handleNavigation = async (path, key) => {
        setLoading((prev) => ({ ...prev, [key]: true }));
        try {
            navigate(path);
        } finally {
            setLoading((prev) => ({ ...prev, [key]: false }));
        }
    };

    const handleConfirmDelete = () => {
        AlertComponent.showConfirmation(
            "Are you sure you want to delete this institution? This action cannot be undone.",
            async () => {
                setLoading((prev) => ({ ...prev, deleteInstitution: true }));
                try {
                    const token = localStorage.getItem("token");
                    await axios.delete(
                        `${config.API_URL}/institutions/${institution.id}`,
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );
                    AlertComponent.showAlert(
                        "Institution deleted successfully.",
                        "success"
                    );
                    navigate("/hei-admin/dashboard");
                } catch (error) {
                    console.error("Error deleting institution:", error);
                    AlertComponent.showAlert(
                        "Failed to delete institution.",
                        "error"
                    );
                } finally {
                    setLoading((prev) => ({
                        ...prev,
                        deleteInstitution: false,
                    }));
                }
            },
            () => {
                console.log("Deletion cancelled");
            }
        );
    };

    const handleEdit = (updatedInstitution) => {
        setInstitution(updatedInstitution);
        const updatedInstitutions = institutions.map((inst) =>
            inst.id === updatedInstitution.id ? updatedInstitution : inst
        );
        setInstitutions(updatedInstitutions);
    };

    return (
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6">
            {/* Compact Header with CHED Branding and Breadcrumbs */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
                <div className="flex items-center mb-4 sm:mb-0">
                    <div
                        className="w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center mr-4"
                        style={{
                            backgroundColor: CHED_COLORS.blue,
                            borderColor: CHED_COLORS.yellow,
                            border: "3px solid",
                        }}
                    >
                        <Award size={24} color="white" strokeWidth={1.5} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">
                            Institution Management
                        </h1>
                        <nav className="text-sm">
                            <ol className="flex items-center text-gray-500">
                                <li>
                                    <a
                                        href="#"
                                        onClick={() =>
                                            navigate("/hei-admin/dashboard")
                                        }
                                        className="hover:text-blue-600 transition-colors flex items-center"
                                    >
                                        <Home className="w-4 h-4 mr-2" />
                                        Dashboard
                                    </a>
                                </li>
                                <li>
                                    <span className="mx-2">›</span>
                                </li>
                                <li className="text-gray-700 font-medium flex items-center">
                                    <School className="w-4 h-4 mr-2" />
                                    My Institution
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>
                <CHEDButton
                    onClick={() => setEditDialogOpen(true)}
                    icon={Building}
                    variant="primary"
                    size="md"
                >
                    Edit Institution
                </CHEDButton>
            </div>

            {/* Filter and Institution Header Combined */}
            <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 border-b border-gray-200">
                    <div className="flex items-center mb-4 sm:mb-0">
                        {institution ? (
                            <>
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                                    style={{
                                        backgroundColor: `${CHED_COLORS.yellow}20`,
                                        color: CHED_COLORS.yellow,
                                    }}
                                >
                                    <Building size={24} />
                                </div>
                                <div>
                                    <div className="flex items-center flex-wrap">
                                        <h2 className="text-lg font-bold text-gray-800 mr-3">
                                            {institution.name}
                                        </h2>
                                        <div className="flex space-x-2 mt-1 sm:mt-0">
                                            <Badge color={CHED_COLORS.blue}>
                                                {institution.institution_type ||
                                                    "SUC"}
                                            </Badge>
                                            <Badge color={CHED_COLORS.yellow}>
                                                Est.{" "}
                                                {institution.year_established ||
                                                    "N/A"}
                                            </Badge>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {institution.address_street && (
                                            <span>
                                                {institution.address_street},{" "}
                                            </span>
                                        )}
                                        {location.municipality?.name},{" "}
                                        {location.province?.name},{" "}
                                        {location.region?.name}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <p className="text-base text-gray-500">
                                No institution data available
                            </p>
                        )}
                    </div>

                    {/* Compact Filter */}
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <select
                                id="reportYear"
                                value={reportYearFilter}
                                onChange={(e) =>
                                    setReportYearFilter(e.target.value)
                                }
                                className="appearance-none pl-8 pr-10 py-2 text-base border border-gray-300 rounded-lg"
                            >
                                <option value="">All Years</option>
                                {filterOptions.reportYears.map((year) => (
                                    <option key={year} value={String(year)}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                        </div>
                        <button
                            onClick={clearFilters}
                            className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            {institution ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    {/* Left Column - Contact & Details */}
                    <div className="lg:col-span-7">
                        {/* Compact Info Tabs */}
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
                            <div className="flex border-b">
                                <button
                                    className="px-4 py-2 text-sm font-medium text-white flex-1 flex justify-center items-center"
                                    style={{
                                        backgroundColor: CHED_COLORS.blue,
                                    }}
                                >
                                    <Info className="w-4 h-4 mr-1.5" />
                                    Institution Information
                                </button>
                            </div>

                            <div className="p-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Contact Info */}
                                    <div>
                                        <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">
                                            Contact Information
                                        </h4>
                                        <div className="space-y-2">
                                            <div className="flex items-start">
                                                <Phone className="w-3.5 h-3.5 text-gray-400 mt-0.5 mr-2" />
                                                <div>
                                                    <span className="text-xs text-gray-500 block">
                                                        Telephone
                                                    </span>
                                                    <span className="text-sm">
                                                        {institution.institutional_telephone ||
                                                            "Not Available"}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <Mail className="w-3.5 h-3.5 text-gray-400 mt-0.5 mr-2" />
                                                <div>
                                                    <span className="text-xs text-gray-500 block">
                                                        Email
                                                    </span>
                                                    <a
                                                        href={`mailto:${institution.institutional_email}`}
                                                        className="text-sm text-blue-600 hover:underline"
                                                    >
                                                        {institution.institutional_email ||
                                                            "Not Available"}
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <Globe className="w-3.5 h-3.5 text-gray-400 mt-0.5 mr-2" />
                                                <div>
                                                    <span className="text-xs text-gray-500 block">
                                                        Website
                                                    </span>
                                                    {institution.institutional_website ? (
                                                        <a
                                                            href={
                                                                institution.institutional_website
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm text-blue-600 hover:underline"
                                                        >
                                                            {
                                                                institution.institutional_website
                                                            }
                                                        </a>
                                                    ) : (
                                                        <span className="text-sm">
                                                            Not Available
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Institutional Details */}
                                    <div>
                                        <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">
                                            Institutional Details
                                        </h4>
                                        <div className="space-y-2">
                                            <div className="flex items-start">
                                                <Calendar className="w-3.5 h-3.5 text-gray-400 mt-0.5 mr-2" />
                                                <div>
                                                    <span className="text-xs text-gray-500 block">
                                                        Year Established
                                                    </span>
                                                    <span className="text-sm">
                                                        {institution.year_established ||
                                                            "Not Available"}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <School className="w-3.5 h-3.5 text-gray-400 mt-0.5 mr-2" />
                                                <div>
                                                    <span className="text-xs text-gray-500 block">
                                                        College Conversion
                                                    </span>
                                                    <span className="text-sm">
                                                        {institution.year_converted_college ||
                                                            "Not Available"}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <School className="w-3.5 h-3.5 text-gray-400 mt-0.5 mr-2" />
                                                <div>
                                                    <span className="text-xs text-gray-500 block">
                                                        University Conversion
                                                    </span>
                                                    <span className="text-sm">
                                                        {institution.year_converted_university ||
                                                            "Not Available"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Leadership Card */}
                        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                            <h3 className="text-sm font-medium flex items-center mb-3">
                                <User
                                    className="w-4 h-4 mr-1.5"
                                    style={{ color: CHED_COLORS.red }}
                                />
                                Leadership
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-start">
                                    <User className="w-3.5 h-3.5 text-gray-400 mt-0.5 mr-2" />
                                    <div>
                                        <span className="text-xs text-gray-500 block">
                                            Head Name
                                        </span>
                                        <span className="text-sm font-medium">
                                            {institution.head_name ||
                                                "Not Available"}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <IdCard className="w-3.5 h-3.5 text-gray-400 mt-0.5 mr-2" />
                                    <div>
                                        <span className="text-xs text-gray-500 block">
                                            Head Title
                                        </span>
                                        <span className="text-sm">
                                            {institution.head_title ||
                                                "Not Available"}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <School className="w-3.5 h-3.5 text-gray-400 mt-0.5 mr-2" />
                                    <div>
                                        <span className="text-xs text-gray-500 block">
                                            Head Education
                                        </span>
                                        <span className="text-sm">
                                            {institution.head_education ||
                                                "Not Available"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Quick Actions */}
                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-lg shadow-sm mb-4">
                            <div className="px-4 py-2 border-b border-gray-200 flex items-center">
                                <div
                                    className="rounded-full p-1.5 mr-2"
                                    style={{
                                        backgroundColor: `${CHED_COLORS.yellow}15`,
                                    }}
                                >
                                    <FileSpreadsheet
                                        className="w-4 h-4"
                                        style={{ color: CHED_COLORS.yellow }}
                                    />
                                </div>
                                <h3 className="text-sm font-medium">Exports</h3>
                            </div>
                            <div className="p-3">
                                <button
                                    onClick={handleExportToFormA}
                                    disabled={loading.exportFormA}
                                    className="flex items-center justify-center w-full px-3 py-2 mb-2 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
                                >
                                    {loading.exportFormA ? (
                                        <svg
                                            className="animate-spin h-4 w-4 mr-2"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                                            ></path>
                                        </svg>
                                    ) : (
                                        <ArrowDownToLine className="w-4 h-4 mr-2" />
                                    )}
                                    Export to Form A
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-3">
                            <h3 className="text-sm font-medium text-gray-800 flex items-center mb-2 pb-2 border-b border-gray-100">
                                <Clipboard
                                    className="w-4 h-4 mr-1.5"
                                    style={{ color: CHED_COLORS.blue }}
                                />
                                Management Options
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() =>
                                        handleNavigation(
                                            `/hei-admin/institutions/campuses/${encryptId(
                                                reportYearFilter
                                                    ? `${institution.id}`
                                                    : institution.id
                                            )}`,
                                            "viewCampuses"
                                        )
                                    }
                                    disabled={loading.viewCampuses}
                                    className="flex flex-col items-center justify-center p-2 text-xs text-center border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                                    style={{ color: CHED_COLORS.blue }}
                                >
                                    {loading.viewCampuses ? (
                                        <svg
                                            className="animate-spin h-5 w-5 mb-1"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                                            ></path>
                                        </svg>
                                    ) : (
                                        <Building className="w-5 h-5 mb-1" />
                                    )}
                                    Campuses
                                </button>
                                <button
                                    onClick={() =>
                                        handleNavigation(
                                            `/hei-admin/institutions/faculties/${encryptId(
                                                reportYearFilter
                                                    ? `${institution.id}`
                                                    : institution.id
                                            )}`,
                                            "faculties"
                                        )
                                    }
                                    disabled={loading.faculties}
                                    className="flex flex-col items-center justify-center p-2 text-xs text-center border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                                    style={{ color: CHED_COLORS.blue }}
                                >
                                    {loading.faculties ? (
                                        <svg
                                            className="animate-spin h-5 w-5 mb-1"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                                            ></path>
                                        </svg>
                                    ) : (
                                        <Users className="w-5 h-5 mb-1" />
                                    )}
                                    Faculties
                                </button>
                                <button
                                    onClick={() =>
                                        handleNavigation(
                                            `/hei-admin/institutions/curricular-programs/${encryptId(
                                                reportYearFilter
                                                    ? `${institution.id}`
                                                    : institution.id
                                            )}`,
                                            "curricularPrograms"
                                        )
                                    }
                                    disabled={loading.curricularPrograms}
                                    className="flex flex-col items-center justify-center p-2 text-xs text-center border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                                    style={{ color: CHED_COLORS.blue }}
                                >
                                    {loading.curricularPrograms ? (
                                        <svg
                                            className="animate-spin h-5 w-5 mb-1"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                                            ></path>
                                        </svg>
                                    ) : (
                                        <BookOpen className="w-5 h-5 mb-1" />
                                    )}
                                    Programs
                                </button>
                                <button
                                    onClick={() =>
                                        handleNavigation(
                                            `/hei-admin/institutions/graduates-list/${encryptId(
                                                reportYearFilter
                                                    ? `${institution.id}`
                                                    : institution.id
                                            )}`,
                                            "graduates"
                                        )
                                    }
                                    disabled={loading.graduates}
                                    className="flex flex-col items-center justify-center p-2 text-xs text-center border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                                    style={{ color: CHED_COLORS.blue }}
                                >
                                    {loading.graduates ? (
                                        <svg
                                            className="animate-spin h-5 w-5 mb-1"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                                            ></path>
                                        </svg>
                                    ) : (
                                        <Award className="w-5 h-5 mb-1" />
                                    )}
                                    Graduates
                                </button>
                            </div>

                            {/* Delete Institution */}
                            <button
                                onClick={handleConfirmDelete}
                                disabled={loading.deleteInstitution}
                                className="flex items-center justify-center w-full px-3 py-1.5 mt-3 border border-red-200 text-red-600 text-xs font-medium rounded hover:bg-red-50 disabled:opacity-50"
                            >
                                {loading.deleteInstitution ? (
                                    <svg
                                        className="animate-spin h-3.5 w-3.5 mr-1.5"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                                        ></path>
                                    </svg>
                                ) : (
                                    <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                                )}
                                Delete Institution
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white p-6 text-center rounded-lg shadow-sm border border-dashed border-gray-300">
                    <div
                        className="w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${CHED_COLORS.blue}15` }}
                    >
                        <School
                            className="w-7 h-7"
                            style={{ color: CHED_COLORS.blue }}
                        />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        No institution data available
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                        Please check your filters or try again later
                    </p>
                    <button
                        onClick={fetchInstitution}
                        className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white"
                        style={{ backgroundColor: CHED_COLORS.blue }}
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh Data
                    </button>
                </div>
            )}

            {/* Edit Dialog */}
            <EditDialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                institution={institution}
                onEdit={handleEdit}
                fetchInstitutions={fetchInstitution}
            />
        </div>
    );
};

export default InstitutionManagement;
