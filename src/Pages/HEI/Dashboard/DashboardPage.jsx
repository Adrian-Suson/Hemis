// Initial data loading
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import axios from "axios";
import { useLoading } from "../../../Context/LoadingContext";
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from "chart.js";
import { Pie, Doughnut } from "react-chartjs-2";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users,
    GraduationCap,
    BookOpen,
    BarChart2,
    TrendingUp,
    AlertCircle,
    ChevronUp,
    ChevronDown,
    RefreshCw,
    Grid,
    List,
    Calendar,
    Upload,
} from "lucide-react";
import config from "../../../utils/config";
import DashboardSkeleton from "./DashboardSkeleton";
import FacultyUploadDialog from "../../../Components/FacultyUploadDialog";
import GraduatesUploadDialog from "../../../Components/GraduatesUploadDialog";
import InstitutionUploadDialog from "../../../Components/InstitutionUploadDialog";
import CurricularUploadDialog from "../../../Components/CurricularUploadDialog";
import CHEDButton from "../../../Components/CHEDButton";

// Register Chart.js components
ChartJS.register(ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

// Chart colors
const CHART_COLORS = {
    primary: "#4F46E5", // Indigo
    secondary: "#F43F5E", // Rose
    teal: "#06B6D4", // Cyan
    purple: "#8B5CF6", // Violet
    orange: "#F59E0B", // Amber
    grey: "#64748B", // Slate
    emerald: "#10B981", // Emerald
    red: "#EF4444", // Red
    blue: "#3B82F6", // Blue
    green: "#22C55E", // Green
};

// Chart options
const CHART_OPTIONS = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: true,
            position: "bottom",
            labels: {
                font: { size: 10, family: "'Inter', sans-serif" },
                usePointStyle: true,
                padding: 10,
                boxWidth: 6,
            },
        },
        tooltip: {
            enabled: true,
            bodyFont: { size: 11, family: "'Inter', sans-serif" },
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            titleColor: "#1F2937",
            bodyColor: "#4B5563",
            borderColor: "#E5E7EB",
            borderWidth: 1,
            padding: 8,
            boxPadding: 4,
            usePointStyle: true,
            callbacks: {
                label: function (context) {
                    const label = context.label || "";
                    const value = context.raw || 0;
                    return `${label}: ${value.toLocaleString()}`;
                },
            },
        },
    },
    cutout: "70%",
    elements: {
        arc: {
            borderWidth: 0,
        },
    },
    animation: {
        animateScale: true,
        animateRotate: true,
        duration: 800,
    },
};

const DashboardPage = () => {
    const [stats, setStats] = useState({
        users: [],
        facultyProfiles: [],
        programs: [],
        institutions: [],
        loading: true,
        error: null,
    });

    const [originalStats, setOriginalStats] = useState({
        users: [],
        facultyProfiles: [],
        programs: [],
        institutions: [],
    });

    // Safely get UUID from localStorage with error handling
    const [uuid] = useState(() => {
        try {
            const institutionData = localStorage.getItem("institution");
            if (institutionData) {
                const parsed = JSON.parse(institutionData);
                return parsed?.uuid || null;
            }
            return null;
        } catch (error) {
            console.error("Error parsing institution data:", error);
            return null;
        }
    });

    const [refreshing, setRefreshing] = useState(false);
    const [viewMode, setViewMode] = useState("grid"); // "compact" or "grid"
    const [expandedSections, setExpandedSections] = useState({
        stats: true,
        charts: true,
    });
    const [selectedYear, setSelectedYear] = useState(""); // Selected report year
    const [openFacultyDialog, setOpenFacultyDialog] = useState(false);
    const [openGraduatesDialog, setOpenGraduatesDialog] = useState(false);
    const [openInstitutionDialog, setOpenInstitutionDialog] = useState(false);
    const [openCurricularDialog, setOpenCurricularDialog] = useState(false);

    const { showLoading, hideLoading } = useLoading();
    const isMounted = useRef(true);

    const toggleSection = (section) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const fetchStats = useCallback(
        async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                if (isMounted.current) {
                    setStats((prev) => ({
                        ...prev,
                        error: "No authentication token",
                        loading: false,
                    }));
                }
                return;
            }

            if (!uuid) {
                if (isMounted.current) {
                    setStats((prev) => ({
                        ...prev,
                        error: "No institution UUID found. Please log out and log in again.",
                        loading: false,
                    }));
                }
                return;
            }

            showLoading();
            if (!stats.loading) setRefreshing(true);

            try {
                console.log(`Fetching dashboard data for UUID: ${uuid}...`);
                const url = `${config.API_URL}/dashboard-data?uuid=${uuid}`;
                const response = await axios.get(url, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                // Match super admin dashboard validation
                if (response.headers["content-type"]?.includes("application/json")) {
                    console.log("API Response:", response.data);

                    const { users, facultyProfiles, programs, institutions } = response.data;

                    // Filter data for this specific institution UUID
                    const filteredInstitutions = institutions.filter(
                        (inst) => inst.uuid === uuid
                    );

                    if (filteredInstitutions.length === 0) {
                        if (isMounted.current) {
                            setStats((prev) => ({
                                ...prev,
                                error: `No institutions found with UUID: ${uuid}`,
                                loading: false,
                            }));
                        }
                        return;
                    }

                    const validInstitutionIds = new Set(
                        filteredInstitutions.map((inst) => inst.id)
                    );

                    const filteredStats = {
                        users: users.filter((user) =>
                            validInstitutionIds.has(user.institution_id)
                        ),
                        facultyProfiles: facultyProfiles.filter((profile) =>
                            validInstitutionIds.has(profile.institution_id)
                        ),
                        programs: programs.filter((program) =>
                            validInstitutionIds.has(program.institution_id)
                        ),
                        institutions: filteredInstitutions,
                    };

                    if (isMounted.current) {
                        // Store original filtered stats (matching super admin approach)
                        setOriginalStats(filteredStats);

                        // Set current stats
                        setStats({
                            ...filteredStats,
                            loading: false,
                            error: null,
                        });

                        console.log("Filtered Stats:", filteredStats);
                    }
                } else {
                    console.error("Unexpected response format:", response.data);
                    if (isMounted.current) {
                        setStats((prev) => ({
                            ...prev,
                            error: "Unexpected response format from the server.",
                            loading: false,
                        }));
                    }
                }
            } catch (error) {
                console.error(
                    "Error fetching dashboard data:",
                    error.response || error
                );

                // More detailed error message based on error type
                const errorMessage = error.response?.data?.message ||
                                    error.message ||
                                    "Unknown error occurred";

                if (isMounted.current) {
                    setStats((prev) => ({
                        ...prev,
                        error: `Failed to load statistics: ${errorMessage}`,
                        loading: false,
                    }));
                }
            } finally {
                if (isMounted.current) {
                    hideLoading();
                    setRefreshing(false);
                }
            }
        },
        [uuid, showLoading, hideLoading]
    );

    useEffect(() => {
        isMounted.current = true;
        fetchStats();

        return () => {
            isMounted.current = false;
        };
    }, []);

    // Implement the year filtering effect similar to super admin dashboard
    useEffect(() => {
        if (selectedYear && originalStats.institutions.length > 0) {
            const filteredInstitutions = originalStats.institutions.filter(
                (inst) => inst.report_year === parseInt(selectedYear)
            );

            const validInstitutionIds = new Set(
                filteredInstitutions.map((inst) => inst.id)
            );

            const filteredStats = {
                users: originalStats.users.filter((user) =>
                    validInstitutionIds.has(user.institution_id)
                ),
                facultyProfiles: originalStats.facultyProfiles.filter(
                    (profile) => validInstitutionIds.has(profile.institution_id)
                ),
                programs: originalStats.programs.filter((program) =>
                    validInstitutionIds.has(program.institution_id)
                ),
                institutions: filteredInstitutions,
            };

            setStats((prev) => ({
                ...prev,
                ...filteredStats,
                error: filteredInstitutions.length === 0 ? `No data found for year ${selectedYear}` : null,
                loading: false,
            }));
        } else if (originalStats.institutions.length > 0) {
            setStats((prev) => ({
                ...prev,
                ...originalStats,
                loading: false,
            }));
        }
    }, [selectedYear, originalStats]);

    // Get unique report years from institutions for the specific UUID
    const availableYears = useMemo(() => {
        if (!originalStats.institutions || originalStats.institutions.length === 0) {
            return [""];
        }

        const years = new Set(
            originalStats.institutions
                .filter((inst) => inst.uuid === uuid)
                .map((inst) => inst.report_year)
                .filter(year => year !== null && year !== undefined)
        );

        const sortedYears = ["", ...Array.from(years).sort((a, b) => b - a)];

        if (sortedYears.length === 1 && isMounted.current) {
            // Only empty string, meaning no years available
            setStats((prev) => ({
                ...prev,
                error: prev.error || `No report years available for UUID ${uuid}`,
                loading: false,
            }));
        }
        return sortedYears;
    }, [originalStats.institutions, uuid]);

    const aggregations = useMemo(() => {
        // Get unique institutions by UUID
        const uniqueInstitutions = stats.institutions?.reduce((acc, inst) => {
            if (!acc.has(inst.uuid)) {
                acc.set(inst.uuid, inst);
            }
            return acc;
        }, new Map());

        const totals = {
            users: stats.users?.length || 0,
            faculty: stats.facultyProfiles?.length || 0,
            programs: stats.programs?.length || 0,
            // Count unique institutions by UUID
            institutions: uniqueInstitutions?.size || 0,
            enrollments:
                stats.programs?.reduce(
                    (sum, program) => sum + (program.grand_total || 0),
                    0
                ) || 0,
            graduates:
                stats.programs?.reduce(
                    (sum, program) => sum + (program.graduates_total || 0),
                    0
                ) || 0,
        };

        const genderBreakdown = stats.programs?.reduce(
            (acc, program) => ({
                male: acc.male + (program.subtotal_male || 0),
                female: acc.female + (program.subtotal_female || 0),
            }),
            { male: 0, female: 0 }
        ) || { male: 0, female: 0 };

        const enrollmentByYearLevel =
            stats.programs?.reduce((acc, program) => {
                const levels = [
                    "Freshmen",
                    "1st Year",
                    "2nd Year",
                    "3rd Year",
                    "4th Year",
                    "5th Year",
                    "6th Year",
                    "7th Year",
                ];
                levels.forEach((level) => {
                    const key = level.toLowerCase().replace(" ", "_");
                    acc[level] =
                        (acc[level] || 0) +
                        (program[`${key}_male`] || 0) +
                        (program[`${key}_female`] || 0);
                });
                return acc;
            }, {}) || {};

        // Calculate gender percentages
        const totalStudents = genderBreakdown.male + genderBreakdown.female;
        const genderPercentage = {
            male: totalStudents
                ? Math.round((genderBreakdown.male / totalStudents) * 100)
                : 0,
            female: totalStudents
                ? Math.round((genderBreakdown.female / totalStudents) * 100)
                : 0,
        };

        // Graduates vs Enrollments percentages
        const graduationRate = totals.enrollments
            ? Math.round((totals.graduates / totals.enrollments) * 100)
            : 0;

        return {
            totals,
            genderBreakdown,
            genderPercentage,
            enrollmentByYearLevel,
            graduationRate,
        };
    }, [stats, uuid]);

    const chartData = useMemo(() => {
        const yearLevelKeys = Object.keys(aggregations.enrollmentByYearLevel);

        // Calculate percentage for each year level
        const totalEnrollments = Object.values(
            aggregations.enrollmentByYearLevel
        ).reduce((a, b) => a + b, 0);
        const yearLevelPercentages = {};
        Object.entries(aggregations.enrollmentByYearLevel).forEach(
            ([level, count]) => {
                yearLevelPercentages[level] = totalEnrollments
                    ? Math.round((count / totalEnrollments) * 100)
                    : 0;
            }
        );

        // Find highest year level
        const maxYearLevel = Object.entries(
            aggregations.enrollmentByYearLevel
        ).reduce(
            (max, [level, count]) =>
                count > (max.count || 0) ? { level, count } : max,
            {}
        );

        return [
            {
                title: "Gender Distribution",
                type: "pie",
                data: {
                    labels: ["Male", "Female"],
                    datasets: [
                        {
                            data: [
                                aggregations.genderBreakdown.male,
                                aggregations.genderBreakdown.female,
                            ],
                            backgroundColor: [
                                CHART_COLORS.primary,
                                CHART_COLORS.secondary,
                            ],
                            borderWidth: 0,
                            hoverOffset: 5,
                        },
                    ],
                },
                info: [
                    {
                        label: "Male",
                        value: aggregations.genderBreakdown.male.toLocaleString(),
                        percentage: aggregations.genderPercentage.male + "%",
                        color: CHART_COLORS.primary,
                    },
                    {
                        label: "Female",
                        value: aggregations.genderBreakdown.female.toLocaleString(),
                        percentage: aggregations.genderPercentage.female + "%",
                        color: CHART_COLORS.secondary,
                    },
                ],
            },
            {
                title: "Institution Overview",
                type: "pie",
                data: {
                    labels: ["Programs", "Faculty", "Unique Institutions"],
                    datasets: [
                        {
                            data: [
                                aggregations.totals.programs,
                                aggregations.totals.faculty,
                                aggregations.totals.institutions,
                            ],
                            backgroundColor: [
                                CHART_COLORS.teal,
                                CHART_COLORS.purple,
                                CHART_COLORS.orange,
                            ],
                            borderWidth: 0,
                            hoverOffset: 5,
                        },
                    ],
                },
                info: [
                    {
                        label: "Programs",
                        value: aggregations.totals.programs.toLocaleString(),
                        color: CHART_COLORS.teal,
                    },
                    {
                        label: "Faculty",
                        value: aggregations.totals.faculty.toLocaleString(),
                        color: CHART_COLORS.purple,
                    },
                    {
                        label: "Unique Institutions",
                        value: aggregations.totals.institutions.toLocaleString(),
                        color: CHART_COLORS.orange,
                    },
                ],
            },
            {
                title: "Student Status",
                type: "pie",
                data: {
                    labels: ["Enrolled", "Graduates"],
                    datasets: [
                        {
                            data: [
                                aggregations.totals.enrollments,
                                aggregations.totals.graduates,
                            ],
                            backgroundColor: [
                                CHART_COLORS.blue,
                                CHART_COLORS.green,
                            ],
                            borderWidth: 0,
                            hoverOffset: 5,
                        },
                    ],
                },
                info: [
                    {
                        label: "Enrolled",
                        value: aggregations.totals.enrollments.toLocaleString(),
                        color: CHART_COLORS.blue,
                    },
                    {
                        label: "Graduates",
                        value: aggregations.totals.graduates.toLocaleString(),
                        color: CHART_COLORS.green,
                    },
                    {
                        label: "Graduation Rate",
                        value: aggregations.graduationRate + "%",
                        color: CHART_COLORS.green,
                    },
                ],
            },
            {
                title: "Year Level Distribution",
                type: "pie",
                data: {
                    labels: yearLevelKeys,
                    datasets: [
                        {
                            data: Object.values(
                                aggregations.enrollmentByYearLevel
                            ),
                            backgroundColor: [
                                CHART_COLORS.primary,
                                CHART_COLORS.secondary,
                                CHART_COLORS.teal,
                                CHART_COLORS.purple,
                                CHART_COLORS.orange,
                                CHART_COLORS.emerald,
                                CHART_COLORS.blue,
                                CHART_COLORS.red,
                            ].slice(0, yearLevelKeys.length),
                            borderWidth: 0,
                            hoverOffset: 5,
                        },
                    ],
                },
                info: [
                    {
                        label: "Total Students",
                        value: totalEnrollments.toLocaleString(),
                        color: CHART_COLORS.grey,
                    },
                    {
                        label: "Largest Year",
                        value: maxYearLevel.level,
                        percentage: maxYearLevel.count
                            ? maxYearLevel.count.toLocaleString() + " students"
                            : "0 students",
                        color: CHART_COLORS.primary,
                    },
                    {
                        label: "Average per Year",
                        value: yearLevelKeys.length
                            ? Math.round(
                                  totalEnrollments / yearLevelKeys.length
                              ).toLocaleString()
                            : "0",
                        color: CHART_COLORS.purple,
                    },
                ],
            },
        ];
    }, [aggregations]);

    if (stats.loading) {
        return <DashboardSkeleton />;
    }

    if (stats.error) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50 p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-md w-full"
                >
                    <div className="bg-white border border-red-100 rounded-lg p-4 shadow flex items-start">
                        <div className="bg-red-50 p-2 rounded-full text-red-500 mr-3">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-gray-800 mb-1">
                                Error Loading Dashboard
                            </h2>
                            <p className="text-sm text-gray-600 mb-2">
                                {stats.error}
                            </p>
                            <button
                                onClick={() => fetchStats()}
                                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded text-xs font-medium transition-colors flex items-center"
                            >
                                <RefreshCw className="w-3 h-3 mr-1.5" /> Try
                                Again
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    const statCards = [
        {
            label: "Faculty",
            value: aggregations.totals.faculty.toLocaleString(),
            color: "text-emerald-600",
            bgColor: "bg-emerald-50",
            icon: <GraduationCap className="w-4 h-4" />,
            iconBg: "bg-emerald-500",
        },
        {
            label: "Programs",
            value: aggregations.totals.programs.toLocaleString(),
            color: "text-violet-600",
            bgColor: "bg-violet-50",
            icon: <BookOpen className="w-4 h-4" />,
            iconBg: "bg-violet-500",
        },
        {
            label: "Enrollments",
            value: aggregations.totals.enrollments.toLocaleString(),
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            icon: <Users className="w-4 h-4" />,
            iconBg: "bg-blue-500",
        },
    ];

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
                {/* Header */}
                <div className="mb-3 flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-baseline">
                        <h1 className="text-lg font-bold text-gray-800">
                            HEI Dashboard
                        </h1>
                        <span className="ml-2 text-xs text-gray-500">
                            UUID: {uuid || "Loading..."}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Year Filter Dropdown */}
                        <div className="relative">
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="appearance-none bg-white border border-gray-200 rounded-md pl-8 pr-6 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                disabled={availableYears.length <= 1}
                            >
                                <option value="">All Years</option>
                                {availableYears
                                    .filter((year) => year)
                                    .map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                            </select>
                            <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                        </div>

                        <div className="flex items-center bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-1.5 ${
                                    viewMode === "grid"
                                        ? "bg-indigo-500 text-white"
                                        : "bg-white text-gray-600 hover:bg-gray-50"
                                }`}
                            >
                                <Grid className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => setViewMode("compact")}
                                className={`p-1.5 ${
                                    viewMode === "compact"
                                        ? "bg-indigo-500 text-white"
                                        : "bg-white text-gray-600 hover:bg-gray-50"
                                }`}
                            >
                                <List className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        <button
                            onClick={() => fetchStats(localStorage.getItem("token"))}
                            disabled={refreshing || !uuid}
                            className={`p-1.5 rounded-md border shadow-sm ${
                                refreshing || !uuid
                                    ? "bg-gray-100 text-gray-400 border-gray-200"
                                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                            }`}
                        >
                            <RefreshCw
                                className={`w-3.5 h-3.5 ${
                                    refreshing ? "animate-spin" : ""
                                }`}
                            />
                        </button>

                        {/* Upload Buttons */}
                        <div className="flex items-center gap-2">
                            <CHEDButton
                                onClick={() => setOpenFacultyDialog(true)}
                                icon={Upload}
                                variant="primary"
                                size="sm"
                            >
                                Faculty
                            </CHEDButton>
                            <CHEDButton
                                onClick={() => setOpenGraduatesDialog(true)}
                                icon={Upload}
                                variant="primary"
                                size="sm"
                            >
                                Graduates
                            </CHEDButton>
                            <CHEDButton
                                onClick={() => setOpenInstitutionDialog(true)}
                                icon={Upload}
                                variant="primary"
                                size="sm"
                            >
                                Institution
                            </CHEDButton>
                            <CHEDButton
                                onClick={() => setOpenCurricularDialog(true)}
                                icon={Upload}
                                variant="primary"
                                size="sm"
                            >
                                Curricular
                            </CHEDButton>
                        </div>
                    </div>
                </div>

                {/* Stats Cards Section */}
                <div className="mb-3">
                    <div className="flex items-center justify-between mb-1.5">
                        <h2 className="text-sm font-medium text-gray-700 flex items-center">
                            <TrendingUp className="w-3.5 h-3.5 mr-1.5 text-indigo-500" />
                            Key Statistics
                        </h2>
                        <button
                            onClick={() => toggleSection("stats")}
                            className="p-1 rounded-md hover:bg-gray-100"
                        >
                            {expandedSections.stats ? (
                                <ChevronUp size={14} />
                            ) : (
                                <ChevronDown size={14} />
                            )}
                        </button>
                    </div>

                    <AnimatePresence>
                        {expandedSections.stats && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {viewMode === "compact" ? (
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
                                        <div className="grid grid-cols-3 gap-2">
                                            {statCards.map((stat, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{
                                                        duration: 0.2,
                                                        delay: index * 0.05,
                                                    }}
                                                    className={`${stat.bgColor} rounded-lg p-2 text-center`}
                                                >
                                                    <div
                                                        className={`${stat.iconBg} text-white p-1.5 rounded-full mx-auto mb-1.5 w-7 h-7 flex items-center justify-center`}
                                                    >
                                                        {stat.icon}
                                                    </div>
                                                    <p
                                                        className={`text-base font-bold ${stat.color}`}
                                                    >
                                                        {stat.value}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        {stat.label}
                                                    </p>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {statCards.map((stat, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{
                                                    duration: 0.2,
                                                    delay: index * 0.05,
                                                }}
                                                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                                            >
                                                <div className="p-3">
                                                    <div className="flex items-center">
                                                        <div
                                                            className={`${stat.iconBg} text-white p-2 rounded-lg mr-3`}
                                                        >
                                                            {stat.icon}
                                                        </div>
                                                        <div>
                                                            <p
                                                                className={`text-lg font-bold ${stat.color}`}
                                                            >
                                                                {stat.value}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {stat.label}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Charts Section */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <h2 className="text-sm font-medium text-gray-700 flex items-center">
                            <BarChart2 className="w-3.5 h-3.5 mr-1.5 text-indigo-500" />
                            Visual Insights
                        </h2>
                        <button
                            onClick={() => toggleSection("charts")}
                            className="p-1 rounded-md hover:bg-gray-100"
                        >
                            {expandedSections.charts ? (
                                <ChevronUp size={14} />
                            ) : (
                                <ChevronDown size={14} />
                            )}
                        </button>
                    </div>

                    <AnimatePresence>
                        {expandedSections.charts && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {viewMode === "compact" ? (
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                                            {chartData.map((chart, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{
                                                        duration: 0.2,
                                                        delay: index * 0.05,
                                                    }}
                                                    className="bg-gray-50 rounded-lg p-2"
                                                >
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h3 className="text-xs font-medium text-gray-700">
                                                            {chart.title}
                                                        </h3>
                                                    </div>
                                                    <div className="h-32 relative">
                                                        {chart.type ===
                                                        "doughnut" ? (
                                                            <Doughnut
                                                                data={
                                                                    chart.data
                                                                }
                                                                options={{
                                                                    ...CHART_OPTIONS,
                                                                    plugins: {
                                                                        ...CHART_OPTIONS.plugins,
                                                                        legend: {
                                                                            display: false,
                                                                        },
                                                                    },
                                                                }}
                                                            />
                                                        ) : (
                                                            <Pie
                                                                data={
                                                                    chart.data
                                                                }
                                                                options={{
                                                                    ...CHART_OPTIONS,
                                                                    cutout: "0%",
                                                                    plugins: {
                                                                        ...CHART_OPTIONS.plugins,
                                                                        legend: {
                                                                            display: false,
                                                                        },
                                                                    },
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {chartData.map((chart, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{
                                                    duration: 0.2,
                                                    delay: index * 0.05,
                                                }}
                                                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                                            >
                                                <div className="p-4">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h3 className="text-sm font-semibold text-gray-800">
                                                            {chart.title}
                                                        </h3>
                                                    </div>

                                                    <div className="flex flex-col sm:flex-row">
                                                        <div className="h-48 sm:h-52 w-full sm:w-1/2 relative">
                                                            {chart.type ===
                                                            "doughnut" ? (
                                                                <Doughnut
                                                                    data={
                                                                        chart.data
                                                                    }
                                                                    options={
                                                                        CHART_OPTIONS
                                                                    }
                                                                />
                                                            ) : (
                                                                <Pie
                                                                    data={
                                                                        chart.data
                                                                    }
                                                                    options={{
                                                                        ...CHART_OPTIONS,
                                                                        cutout: "0%",
                                                                    }}
                                                                />
                                                            )}
                                                        </div>

                                                        <div className="mt-3 sm:mt-0 sm:ml-4 sm:w-1/2 flex flex-col justify-center">
                                                            {chart.info.map(
                                                                (item, i) => (
                                                                    <div
                                                                        key={i}
                                                                        className="mb-2"
                                                                    >
                                                                        <div className="flex items-center">
                                                                            <div
                                                                                className="w-2.5 h-2.5 rounded-full mr-2"
                                                                                style={{
                                                                                    backgroundColor:
                                                                                        item.color,
                                                                                }}
                                                                            ></div>
                                                                            <span className="text-xs font-medium text-gray-700">
                                                                                {
                                                                                    item.label
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                        <div className="ml-4.5 mt-0.5">
                                                                            <div className="text-base font-bold text-gray-800">
                                                                                {
                                                                                    item.value
                                                                                }
                                                                            </div>
                                                                            {item.percentage && (
                                                                                <div className="text-xs text-gray-500">
                                                                                    {
                                                                                        item.percentage
                                                                                    }
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Dialog Components */}
            <FacultyUploadDialog
                open={openFacultyDialog}
                onClose={() => setOpenFacultyDialog(false)}
                fetchFacultyProfiles={fetchStats}
            />
            <GraduatesUploadDialog
                open={openGraduatesDialog}
                onClose={() => setOpenGraduatesDialog(false)}
            />
            <InstitutionUploadDialog
                open={openInstitutionDialog}
                onClose={() => setOpenInstitutionDialog(false)}
            />
            <CurricularUploadDialog
                open={openCurricularDialog}
                onClose={() => setOpenCurricularDialog(false)}
            />
        </div>
    );
};

export default DashboardPage;
