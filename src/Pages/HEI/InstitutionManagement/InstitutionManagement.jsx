// src/components/InstitutionManagement/InstitutionManagement.jsx
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Award, Home, School, Building, RefreshCw } from "lucide-react";
import config from "../../../utils/config";
import ExcelJS from "exceljs";
import { useLoading } from "../../../Context/LoadingContext";
import AlertComponent from "../../../Components/AlertComponent";
import useLocationData from "../../../utils/useLocationData";
import EditDialog from "./EditDialog";
import CHEDButton from "../../../Components/CHEDButton";
import InstitutionDetails from "./components/InstitutionDetails";
import Leadership from "./components/Leadership";
import QuickActions from "./components/QuickActions";
import Filters from "./components/Filters";
import Badge from "./components/Badge";
import InstitutionManagementSkeleton from "./InstitutionManagementSkeleton";
import useActivityLog from "../../../Hooks/useActivityLog";

const CHED_COLORS = {
    blue: "#0038A8",
    yellow: "#FCD116",
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
    const [isLoading, setIsLoading] = useState(true); // Add this state to track initial loading
    const [loading, setLoading] = useState({
        viewCampuses: false,
        faculties: false,
        curricularPrograms: false,
        graduates: false,
        exportFormA: false,
        deleteInstitution: false,
    });
    const { createLog } = useActivityLog();

    const [reportYearFilter, setReportYearFilter] = useState(
        localStorage.getItem("reportYearFilter") ||
            String(new Date().getFullYear())
    );
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const userRole = user?.role || "";

    const getInstitutionType = () => {
        const user = JSON.parse(localStorage.getItem("user")) || {};
        return user.institution_type || "SUC";
    };

    const fetchInstitution = async () => {
        try {
            setIsLoading(true); // Set loading state to true
            showLoading();

            const token = localStorage.getItem("token");
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            const storedInstitution = JSON.parse(
                localStorage.getItem("institution") || "{}"
            );

            if (!user?.institution_id || !storedInstitution?.uuid) {
                throw new Error("No institution associated with this user.", {
                    cause: "warning",
                });
            }

            // Fetch all institution data without filtering by UUID or report year
            const response = await axios.get(
                `${config.API_URL}/institution-management-data`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const { institutions } = response.data;

            if (!institutions || institutions.length === 0) {
                throw new Error("No institutions found.", { cause: "error" });
            }

            setInstitutions(institutions); // Store all institutions for frontend filtering
        } catch (error) {
            console.error("Error fetching institution data:", error);
            AlertComponent.showAlert(
                error.cause === 401
                    ? "Unauthorized access. Please log in again."
                    : error.message || "Failed to load institution data.",
                error.cause || "error"
            );
        } finally {
            setIsLoading(false);
            hideLoading();
        }
    };

    useEffect(() => {
        fetchInstitution();
    }, []); // Fetch data only once on component mount

    // Apply frontend filtering based on institution UUID and report year
    useEffect(() => {
        const storedInstitution = JSON.parse(
            localStorage.getItem("institution") || "{}"
        );

        if (!institutions || institutions.length === 0) return;

        const filtered = institutions.filter((inst) => {
            const matchesUuid = inst.uuid === storedInstitution.uuid;
            const matchesReportYear = reportYearFilter
                ? String(inst.report_year) === reportYearFilter
                : true;
            return matchesUuid && matchesReportYear;
        });

        if (filtered.length > 0) {
            setInstitution(filtered[0]);
            getLocationById(
                filtered[0].region_id,
                filtered[0].province_id,
                filtered[0].municipality_id
            )
                .then((locationData) => {
                    setLocation(locationData);
                })
                .catch((error) => {
                    console.error("Error fetching location data:", error);
                    AlertComponent.showAlert(
                        "Failed to load location data.",
                        "error"
                    );
                });
        } else {
            setInstitution(null);
            setLocation({ region: null, province: null, municipality: null });
        }
    }, [institutions, reportYearFilter, getLocationById]);

    useEffect(() => {
        localStorage.setItem("reportYearFilter", reportYearFilter);
    }, [reportYearFilter]);

    const filteredInstitutions = useMemo(() => {
        return institutions.filter((institution) => {
            const matchesReportYear = reportYearFilter
                ? String(institution.report_year) === reportYearFilter
                : true;
            return matchesReportYear;
        });
    }, [institutions, reportYearFilter]);

    useEffect(() => {
        if (filteredInstitutions.length > 0) {
            setInstitution(filteredInstitutions[0]);
        } else {
            setInstitution(null);
        }
    }, [filteredInstitutions]);

    const getUniqueValues = (arr, key) => {
        if (!Array.isArray(arr) || !arr.length) return [];
        return [
            ...new Set(
                arr.map((item) => item?.[key]).filter((value) => value != null)
            ),
        ].sort();
    };

    const filterOptions = {
        types: getUniqueValues(institutions, "institution_type"),
        municipalities: getUniqueValues(institutions, "municipality"),
        provinces: getUniqueValues(institutions, "province"),
        reportYears: getUniqueValues(institutions, "report_year"),
    };

    const clearFilters = () => {
        setReportYearFilter("");
        localStorage.setItem("reportYearFilter", "");
    };

    const handleExportToFormA = async () => {
        if (!institution) {
            AlertComponent.showAlert("No data available to export.", "warning");
            return;
        }

        AlertComponent.showConfirmation(
            "Are you sure you want to export Form A data?",
            async () => {
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

                    // Add activity log
                    await createLog({
                        action: "Export Form A",
                        description: `Exported Form A data for institution: ${institution.name}`,
                    });

                    AlertComponent.showAlert("Data exported successfully!", "success");
                    updateProgress(100);
                } catch (error) {
                    console.error("Error exporting data:", error);
                    AlertComponent.showAlert(
                        error.message.includes("HTTP")
                            ? "Failed to load export template."
                            : "Error exporting data.",
                        "error"
                    );
                } finally {
                    setLoading((prev) => ({ ...prev, exportFormA: false }));
                    updateProgress(0);
                }
            },
            () => {
                console.log("Export cancelled");
            }
        );
    };

    const handleNavigation = async (path, key) => {
        setLoading((prev) => ({ ...prev, [key]: true }));
        try {
            navigate(path);
        } finally {
            setLoading((prev) => ({ ...prev, [key]: false }));
        }
    };

    if (isLoading) {
        return <InstitutionManagementSkeleton />;
    }


    const handleEdit = (updatedInstitution) => {
        setInstitution(updatedInstitution);
        const updatedInstitutions = institutions.map((inst) =>
            inst.id === updatedInstitution.id ? updatedInstitution : inst
        );
        setInstitutions(updatedInstitutions);
    };

    return (
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6">
            {/* Header */}
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
                                        onClick={() => navigate(`/${userRole}/dashboard`)}
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
                    disabled={!institution}
                >
                    Edit Institution
                </CHEDButton>
            </div>

            {/* Institution Header and Filters */}
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
                                        {location.municipality?.name || "N/A"},{" "}
                                        {location.province?.name || "N/A"},{" "}
                                        {location.region?.name || "N/A"}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <p className="text-base text-gray-500">
                                No institution data available
                            </p>
                        )}
                    </div>
                    <Filters
                        reportYearFilter={reportYearFilter}
                        setReportYearFilter={setReportYearFilter}
                        filterOptions={filterOptions}
                        clearFilters={clearFilters}
                    />
                </div>
            </div>

            {/* Main Content */}
            {institution ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    <div className="lg:col-span-7">
                        <InstitutionDetails
                            institution={institution}
                            location={location}
                        />
                        <Leadership institution={institution} />
                    </div>
                    <div className="lg:col-span-5">
                        <QuickActions
                            institution={institution}
                            loading={loading}
                            handleExportToFormA={handleExportToFormA}
                            handleNavigation={handleNavigation}
                            reportYearFilter={reportYearFilter}
                        />
                    </div>
                </div>
            ) : (
                <div className="bg-white p-6 text-center rounded-lg shadow-sm border border-dashed border-gray-300">
                    <div
                        className="w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center animate-pulse"
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
                    <CHEDButton
                        onClick={fetchInstitution}
                        icon={RefreshCw}
                        variant="primary"
                        size="md"
                    >
                        Refresh Data
                    </CHEDButton>
                </div>
            )}

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

InstitutionManagement.propTypes = {};

export default InstitutionManagement;
