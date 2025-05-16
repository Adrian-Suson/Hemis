/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import PropTypes from "prop-types";
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
    Building2,
    BarChart2,
    TrendingUp,
    AlertCircle,
    ChevronUp,
    ChevronDown,
    RefreshCw,
    Filter,
    Grid,
    List,
    Calendar,
} from "lucide-react";
import config from "../../../utils/config";
import DashboardSkeleton from "./DashboardSkeleton";

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
                label: function(context) {
                    const label = context.label || '';
                    const value = context.raw || 0;
                    return `${label}: ${value.toLocaleString()}`;
                }
            }
        },
    },
    cutout: '70%',
    elements: {
        arc: {
            borderWidth: 0
        }
    },
    animation: {
        animateScale: true,
        animateRotate: true,
        duration: 800
    }
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

    const [refreshing, setRefreshing] = useState(false);
    const [viewMode, setViewMode] = useState("grid"); // "compact" or "grid"
    const [expandedSections, setExpandedSections] = useState({
        stats: true,
        charts: true,
    });
    const [selectedYear, setSelectedYear] = useState(""); // Selected report year

    const { showLoading, hideLoading } = useLoading();

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const fetchStats = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setStats((prev) => ({
                ...prev,
                error: "No authentication token",
                loading: false,
            }));
            return;
        }

        showLoading();
        if (!stats.loading) setRefreshing(true);

        try {
            console.log("Fetching dashboard data...");
            // Include report_year in the API call if selected
            const url = selectedYear
                ? `${config.API_URL}/dashboard-data?report_year=${selectedYear}`
                : `${config.API_URL}/dashboard-data`;
            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.headers["content-type"]?.includes("application/json")) {
                console.log("API Response:", response.data);

                let { users, facultyProfiles, programs, institutions } = response.data;

                // Client-side filtering to ensure related data matches institutions
                if (selectedYear) {
                    const validInstitutionIds = new Set(
                        institutions
                            .filter(inst => inst.report_year === parseInt(selectedYear))
                            .map(inst => inst.id)
                    );

                    users = users.filter(user => validInstitutionIds.has(user.institution_id));
                    facultyProfiles = facultyProfiles.filter(profile => validInstitutionIds.has(profile.institution_id));
                    programs = programs.filter(program => validInstitutionIds.has(program.institution_id));
                    institutions = institutions.filter(inst => inst.report_year === parseInt(selectedYear));
                }

                const newStats = {
                    users,
                    facultyProfiles,
                    programs,
                    institutions,
                    loading: false,
                    error: null,
                };

                setStats(newStats);
            } else {
                console.error("Unexpected response format:", response.data);
                setStats((prev) => ({
                    ...prev,
                    error: "Unexpected response format from the server.",
                    loading: false,
                }));
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            setStats((prev) => ({
                ...prev,
                error: `Failed to load statistics: ${error.message}`,
                loading: false,
            }));
        } finally {
            hideLoading();
            setRefreshing(false);
        }
    }, [showLoading, hideLoading, selectedYear]);

    useEffect(() => {
        fetchStats();
    }, [selectedYear]);

    // Get unique report years from institutions
    const availableYears = useMemo(() => {
        const years = new Set(stats.institutions.map(inst => inst.report_year));
        return ["", ...Array.from(years).sort((a, b) => b - a)]; // Include empty option for "All Years"
    }, [stats.institutions]);

    const aggregations = useMemo(() => {
        const totals = {
            users: stats.users?.length || 0,
            faculty: stats.facultyProfiles?.length || 0,
            programs: stats.programs?.length || 0,
            institutions: stats.institutions?.length || 0,
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

        const genderBreakdown =
            stats.programs?.reduce(
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
            male: totalStudents ? Math.round((genderBreakdown.male / totalStudents) * 100) : 0,
            female: totalStudents ? Math.round((genderBreakdown.female / totalStudents) * 100) : 0,
        };

        // Graduates vs Enrollments percentages
        const graduationRate = totals.enrollments ?
            Math.round((totals.graduates / totals.enrollments) * 100) : 0;

        return {
            totals,
            genderBreakdown,
            genderPercentage,
            enrollmentByYearLevel,
            graduationRate
        };
    }, [stats]);

    const chartData = useMemo(() => {
        const yearLevelKeys = Object.keys(aggregations.enrollmentByYearLevel);

        // Calculate percentage for each year level
        const totalEnrollments = Object.values(aggregations.enrollmentByYearLevel).reduce((a, b) => a + b, 0);
        const yearLevelPercentages = {};
        Object.entries(aggregations.enrollmentByYearLevel).forEach(([level, count]) => {
            yearLevelPercentages[level] = totalEnrollments ? Math.round((count / totalEnrollments) * 100) : 0;
        });

        // Find highest year level
        const maxYearLevel = Object.entries(aggregations.enrollmentByYearLevel).reduce(
            (max, [level, count]) => count > (max.count || 0) ? {level, count} : max,
            {}
        );

        return [
            {
                title: "Gender Distribution",
                type: "doughnut",
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
                        color: CHART_COLORS.primary
                    },
                    {
                        label: "Female",
                        value: aggregations.genderBreakdown.female.toLocaleString(),
                        percentage: aggregations.genderPercentage.female + "%",
                        color: CHART_COLORS.secondary
                    }
                ]
            },
            {
                title: "Institution Overview",
                type: "doughnut",
                data: {
                    labels: ["Programs", "Faculty", "Institutions"],
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
                        color: CHART_COLORS.teal
                    },
                    {
                        label: "Faculty",
                        value: aggregations.totals.faculty.toLocaleString(),
                        color: CHART_COLORS.purple
                    },
                    {
                        label: "Institutions",
                        value: aggregations.totals.institutions.toLocaleString(),
                        color: CHART_COLORS.orange
                    }
                ]
            },
            {
                title: "Student Status",
                type: "doughnut",
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
                        color: CHART_COLORS.blue
                    },
                    {
                        label: "Graduates",
                        value: aggregations.totals.graduates.toLocaleString(),
                        color: CHART_COLORS.green
                    },
                    {
                        label: "Graduation Rate",
                        value: aggregations.graduationRate + "%",
                        color: CHART_COLORS.green
                    }
                ]
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
                        color: CHART_COLORS.grey
                    },
                    {
                        label: "Largest Year",
                        value: maxYearLevel.level,
                        percentage: maxYearLevel.count ? maxYearLevel.count.toLocaleString() + " students" : "0 students",
                        color: CHART_COLORS.primary
                    },
                    {
                        label: "Average per Year",
                        value: yearLevelKeys.length ? Math.round(totalEnrollments / yearLevelKeys.length).toLocaleString() : "0",
                        color: CHART_COLORS.purple
                    }
                ]
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
                            <p className="text-sm text-gray-600 mb-2">{stats.error}</p>
                            <button
                                onClick={fetchStats}
                                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded text-xs font-medium transition-colors flex items-center"
                            >
                                <RefreshCw className="w-3 h-3 mr-1.5" /> Try Again
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
            label: "Institutions",
            value: aggregations.totals.institutions.toLocaleString(),
            color: "text-amber-600",
            bgColor: "bg-amber-50",
            icon: <Building2 className="w-4 h-4" />,
            iconBg: "bg-amber-500",
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
                        <h1 className="text-lg font-bold text-gray-800">Educational Dashboard</h1>
                        <span className="ml-2 text-xs text-gray-500">Overview</span>
                    </div>

                    <div className="flex items-center space-x-2">
                        {/* Year Filter Dropdown */}
                        <div className="relative">
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="appearance-none bg-white border border-gray-200 rounded-md pl-8 pr-6 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            >
                                <option value="">All Years</option>
                                {availableYears.filter(year => year).map((year) => (
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
                                className={`p-1.5 ${viewMode === "grid" ? "bg-indigo-500 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                            >
                                <Grid className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => setViewMode("compact")}
                                className={`p-1.5 ${viewMode === "compact" ? "bg-indigo-500 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                            >
                                <List className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        <button
                            onClick={fetchStats}
                            disabled={refreshing}
                            className={`p-1.5 rounded-md border shadow-sm ${refreshing
                                ? "bg-gray-100 text-gray-400 border-gray-200"
                                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                            }`}
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
                        </button>

                        <button className="p-1.5 rounded-md border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-50">
                            <Filter className="w-3.5 h-3.5" />
                        </button>
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
                            onClick={() => toggleSection('stats')}
                            className="p-1 rounded-md hover:bg-gray-100"
                        >
                            {expandedSections.stats ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
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
                                        <div className="grid grid-cols-4 gap-3">
                                            {statCards.map((stat, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ duration: 0.2, delay: index * 0.05 }}
                                                    className={`${stat.bgColor} rounded-lg p-2 text-center`}
                                                >
                                                    <div className={`${stat.iconBg} text-white p-1.5 rounded-full mx-auto mb-1.5 w-7 h-7 flex items-center justify-center`}>
                                                        {stat.icon}
                                                    </div>
                                                    <p className={`text-base font-bold ${stat.color}`}>
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
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {statCards.map((stat, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.2, delay: index * 0.05 }}
                                                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                                            >
                                                <div className="p-3">
                                                    <div className="flex items-center">
                                                        <div className={`${stat.iconBg} text-white p-2 rounded-lg mr-3`}>
                                                            {stat.icon}
                                                        </div>
                                                        <div>
                                                            <p className={`text-lg font-bold ${stat.color}`}>
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
                            onClick={() => toggleSection('charts')}
                            className="p-1 rounded-md hover:bg-gray-100"
                        >
                            {expandedSections.charts ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
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
                                                    transition={{ duration: 0.2, delay: index * 0.05 }}
                                                    className="bg-gray-50 rounded-lg p-2"
                                                >
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h3 className="text-xs font-medium text-gray-700">
                                                            {chart.title}
                                                        </h3>
                                                    </div>
                                                    <div className="h-32 relative">
                                                        {chart.type === "doughnut" ? (
                                                            <Doughnut
                                                                data={chart.data}
                                                                options={{
                                                                    ...CHART_OPTIONS,
                                                                    plugins: {
                                                                        ...CHART_OPTIONS.plugins,
                                                                        legend: {
                                                                            display: false
                                                                        }
                                                                    }
                                                                }}
                                                            />
                                                        ) : (
                                                            <Pie
                                                                data={chart.data}
                                                                options={{
                                                                    ...CHART_OPTIONS,
                                                                    cutout: '0%',
                                                                    plugins: {
                                                                        ...CHART_OPTIONS.plugins,
                                                                        legend: {
                                                                            display: false
                                                                        }
                                                                    }
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
                                                transition={{ duration: 0.2, delay: index * 0.05 }}
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
                                                            {chart.type === "doughnut" ? (
                                                                <Doughnut
                                                                    data={chart.data}
                                                                    options={CHART_OPTIONS}
                                                                />
                                                            ) : (
                                                                <Pie
                                                                    data={chart.data}
                                                                    options={{
                                                                        ...CHART_OPTIONS,
                                                                        cutout: '0%',
                                                                    }}
                                                                />
                                                            )}
                                                        </div>

                                                        <div className="mt-3 sm:mt-0 sm:ml-4 sm:w-1/2 flex flex-col justify-center">
                                                            {chart.info.map((item, i) => (
                                                                <div key={i} className="mb-2">
                                                                    <div className="flex items-center">
                                                                        <div
                                                                            className="w-2.5 h-2.5 rounded-full mr-2"
                                                                            style={{ backgroundColor: item.color }}
                                                                        ></div>
                                                                        <span className="text-xs font-medium text-gray-700">
                                                                            {item.label}
                                                                        </span>
                                                                    </div>
                                                                    <div className="ml-4.5 mt-0.5">
                                                                        <div className="text-base font-bold text-gray-800">
                                                                            {item.value}
                                                                        </div>
                                                                        {item.percentage && (
                                                                            <div className="text-xs text-gray-500">
                                                                                {item.percentage}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
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
        </div>
    );
};

DashboardPage.propTypes = {
    setStats: PropTypes.func,
};

export default DashboardPage;
