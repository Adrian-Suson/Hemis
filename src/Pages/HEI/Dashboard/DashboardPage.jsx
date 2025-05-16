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
import { Pie } from "react-chartjs-2";
import { motion } from "framer-motion";
import {
    Users,
    FileUp,
    GraduationCap,
    BookOpen,
    Building2,
    BarChart2,
    TrendingUp,
    AlertCircle,
    Upload,
    LayoutDashboardIcon,
} from "lucide-react";
import config from "../../../utils/config";
import CurricularUploadDialog from "../../../Components/CurricularUploadDialog";
import FacultyUploadDialog from "../../../Components/FacultyUploadDialog";
import GraduatesUploadDialog from "../../../Components/GraduatesUploadDialog";
import InstitutionUploadDialog from "../../../Components/InstitutionUploadDialog";
import DashboardSkeleton from "./DashboardSkeleton";

// Register Chart.js components
ChartJS.register(ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

// Chart colors
const CHART_COLORS = {
    primary: "#3B82F6",
    secondary: "#EC4899",
    teal: "#14B8A6",
    purple: "#8B5CF6",
    orange: "#F59E0B",
    grey: "#6B7280",
    emerald: "#10B981",
    red: "#EF4444",
};

// Chart options
const CHART_OPTIONS = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: true,
            position: "top",
            labels: { font: { size: 12 } },
        },
        tooltip: { enabled: true, bodyFont: { size: 12 } },
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

    const { showLoading, hideLoading } = useLoading();
    const [openCurricularDialog, setOpenCurricularDialog] = useState(false);
    const [openInstitutionDialog, setOpenInstitutionDialog] = useState(false);
    const [openFacultyDialog, setOpenFacultyDialog] = useState(false);
    const [openGraduatesDialog, setOpenGraduatesDialog] = useState(false);

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

        try {
            const userData = localStorage.getItem("user");
            let institutionId = null;

            if (userData) {
                try {
                    const user = JSON.parse(userData);
                    institutionId = user.institution_id || null;
                } catch (error) {
                    console.error("Failed to parse user data:", error);
                }
            }

            if (!institutionId) {
                const userResponse = await axios.get(`${config.API_URL}/user`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                institutionId = userResponse.data.institution_id || null;
            }

            if (!institutionId) {
                setStats((prev) => ({
                    ...prev,
                    error: "No institution ID found",
                    loading: false,
                }));
                hideLoading();
                return;
            }

            // Always fetch fresh data from the API
            const response = await axios.get(
                `${config.API_URL}/dashboard-data?institution_id=${institutionId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const { users, facultyProfiles, programs, institutions } =
                response.data;

            const newStats = {
                users,
                facultyProfiles,
                programs,
                institutions,
                institutionId,
                loading: false,
                error: null,
            };

            setStats(newStats);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            setStats((prev) => ({
                ...prev,
                error: `Failed to load statistics: ${error.message}`,
                loading: false,
            }));
        } finally {
            hideLoading();
        }
    }, [showLoading, hideLoading]);

    useEffect(() => {
        fetchStats();
    }, []);

    const handleOpenDialog = (dialogType) => {
        switch (dialogType) {
            case "institution":
                setOpenInstitutionDialog(true);
                break;
            case "curricular":
                setOpenCurricularDialog(true);
                break;
            case "faculty":
                setOpenFacultyDialog(true);
                break;
            case "graduates":
                setOpenGraduatesDialog(true);
                break;

            default:
                break;
        }
    };

    const handleCloseDialog = (dialogType) => {
        switch (dialogType) {
            case "institution":
                setOpenInstitutionDialog(false);
                break;
            case "curricular":
                setOpenCurricularDialog(false);
                break;
            case "faculty":
                setOpenFacultyDialog(false);
                break;
            case "graduates":
                setOpenGraduatesDialog(false);
                break;

            default:
                break;
        }
        fetchStats();
    };

    const aggregations = useMemo(() => {
        const totals = {
            users: stats.users.length,
            faculty: stats.facultyProfiles.length,
            programs: stats.programs.length,
            institutions: stats.institutions.length,
            enrollments: stats.programs.reduce(
                (sum, program) => sum + (program.grand_total || 0),
                0
            ),
            graduates: stats.programs.reduce(
                (sum, program) => sum + (program.graduates_total || 0),
                0
            ),
        };

        const genderBreakdown = stats.programs.reduce(
            (acc, program) => ({
                male: acc.male + (program.subtotal_male || 0),
                female: acc.female + (program.subtotal_female || 0),
            }),
            { male: 0, female: 0 }
        );

        const enrollmentByYearLevel = stats.programs.reduce((acc, program) => {
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
        }, {});

        return { totals, genderBreakdown, enrollmentByYearLevel };
    }, [stats]);

    const chartData = useMemo(() => {
        const yearLevelKeys = Object.keys(aggregations.enrollmentByYearLevel);
        return [
            {
                title: "Gender Breakdown",
                data: {
                    labels: ["Male Students", "Female Students"],
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
                            borderColor: ["#fff", "#fff"],
                            borderWidth: 2,
                        },
                    ],
                },
            },
            {
                title: "Totals by Category",
                data: {
                    labels: ["Users", "Faculty", "Programs", "Institutions"],
                    datasets: [
                        {
                            data: [
                                aggregations.totals.users,
                                aggregations.totals.faculty,
                                aggregations.totals.programs,
                                aggregations.totals.institutions,
                            ],
                            backgroundColor: [
                                CHART_COLORS.teal,
                                CHART_COLORS.orange,
                                CHART_COLORS.purple,
                                CHART_COLORS.grey,
                            ],
                            borderColor: ["#fff", "#fff", "#fff", "#fff"],
                            borderWidth: 2,
                        },
                    ],
                },
            },
            {
                title: "Enrollments vs Graduates",
                data: {
                    labels: ["Enrollments", "Graduates"],
                    datasets: [
                        {
                            data: [
                                aggregations.totals.enrollments,
                                aggregations.totals.graduates,
                            ],
                            backgroundColor: [
                                CHART_COLORS.purple,
                                CHART_COLORS.grey,
                            ],
                            borderColor: ["#fff", "#fff"],
                            borderWidth: 2,
                        },
                    ],
                },
            },
            {
                title: "Enrollments by Year",
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
                                CHART_COLORS.grey,
                                CHART_COLORS.emerald,
                                CHART_COLORS.red,
                            ].slice(0, yearLevelKeys.length),
                            borderColor: Array(yearLevelKeys.length).fill(
                                "#fff"
                            ),
                            borderWidth: 2,
                        },
                    ],
                },
            },
        ];
    }, [aggregations]);

    const uploadButtons = [
        {
            label: "Upload Form A",
            color: "bg-emerald-600 hover:bg-emerald-700",
            type: "institution",
            icon: <Building2 className="w-5 h-5" />,
        },
        {
            label: "Upload Form B",
            color: "bg-blue-600 hover:bg-blue-700",
            type: "curricular",
            icon: <FileUp className="w-5 h-5" />,
        },
        {
            label: "Upload Form E2",
            color: "bg-pink-600 hover:bg-pink-700",
            type: "faculty",
            icon: <Users className="w-5 h-5" />,
        },
        {
            label: "Upload Form GH",
            color: "bg-emerald-600 hover:bg-emerald-700",
            type: "graduates",
            icon: <GraduationCap className="w-5 h-5" />,
        },
    ];

     if (stats.loading) {
        return <DashboardSkeleton />;
    }

    if (stats.error) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100 p-4 sm:p-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-md"
                >
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg flex items-start">
                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                            <h2 className="text-lg font-semibold text-red-700">
                                Error
                            </h2>
                            <p className="text-red-600">{stats.error}</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    const statCards = [
        {
            label: "Total Faculty",
            value: aggregations.totals.faculty,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50",
            borderColor: "border-emerald-500",
            icon: <GraduationCap className="w-5 h-5" />,
        },
        {
            label: "Total Programs",
            value: aggregations.totals.programs,
            color: "text-pink-600",
            bgColor: "bg-pink-50",
            borderColor: "border-pink-500",
            icon: <BookOpen className="w-5 h-5" />,
        },
        {
            label: "Total Institutions",
            value: aggregations.totals.institutions,
            color: "text-gray-600",
            bgColor: "bg-gray-50",
            borderColor: "border-gray-500",
            icon: <Building2 className="w-5 h-5" />,
        },
        {
            label: "Total Enrollments",
            value: aggregations.totals.enrollments.toLocaleString(),
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-500",
            icon: <Users className="w-5 h-5" />,
        },
    ];

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <div className="container mx-auto px-4 py-4">
                {/* Data Upload Section - Lighter and more minimal */}
                <div className="mb-5 bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                    <div className="bg-gray-50 border-b border-gray-100 px-4 py-2">
                        <div className="flex items-center">
                            <LayoutDashboardIcon className="w-4 h-4 mr-2 text-gray-500" />
                            <h2 className="text-base font-medium text-gray-700">
                                Dashboard
                            </h2>
                        </div>
                    </div>

                    <div className="p-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {uploadButtons.map((button, index) => {
                                // Light color palette
                                const bgColors = [
                                    "bg-blue-50",
                                    "bg-rose-50",
                                    "bg-amber-50",
                                    "bg-emerald-50",
                                ];
                                const textColors = [
                                    "text-blue-600",
                                    "text-rose-600",
                                    "text-amber-600",
                                    "text-emerald-600",
                                ];
                                const borderColors = [
                                    "border-blue-100",
                                    "border-rose-100",
                                    "border-amber-100",
                                    "border-emerald-100",
                                ];
                                const iconBgColors = [
                                    "bg-blue-100",
                                    "bg-rose-100",
                                    "bg-amber-100",
                                    "bg-emerald-100",
                                ];
                                const buttonBgColors = [
                                    "bg-blue-100",
                                    "bg-rose-100",
                                    "bg-amber-100",
                                    "bg-emerald-100",
                                ];
                                const buttonTextColors = [
                                    "text-blue-600",
                                    "text-rose-600",
                                    "text-amber-600",
                                    "text-emerald-600",
                                ];
                                const buttonHoverBgColors = [
                                    "hover:bg-blue-200",
                                    "hover:bg-rose-200",
                                    "hover:bg-amber-200",
                                    "hover:bg-emerald-200",
                                ];

                                return (
                                    <div
                                        key={index}
                                        className={`bg-white border ${borderColors[index]} rounded-md shadow-sm hover:shadow-md transition-all overflow-hidden`}
                                    >
                                        <div
                                            className={`${bgColors[index]} p-2 flex justify-between items-center`}
                                        >
                                            <span
                                                className={`${textColors[index]} text-sm font-medium`}
                                            >
                                                {button.label}
                                            </span>
                                            {button.icon && (
                                                <div
                                                    className={`${iconBgColors[index]} ${textColors[index]} p-1 rounded-full`}
                                                >
                                                    {button.icon}
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-3">
                                            <button
                                                onClick={() =>
                                                    handleOpenDialog(
                                                        button.type
                                                    )
                                                }
                                                className={`w-full flex items-center justify-center py-1.5 px-3 rounded ${buttonBgColors[index]} ${buttonTextColors[index]} ${buttonHoverBgColors[index]} transition-all focus:outline-none focus:ring-1 focus:ring-offset-1`}
                                            >
                                                <Upload className="w-3 h-3 mr-1" />
                                                <span className="text-xs">
                                                    Upload
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <p className="mt-2 text-xs text-gray-500 flex items-center">
                            <AlertCircle className="w-3 h-3 mr-1 text-gray-400" />
                            Supported formats: Excel (.xlsx, .xls)
                        </p>
                    </div>
                </div>

                {/* Dialogs - Keep as is */}
                <InstitutionUploadDialog
                    open={openInstitutionDialog}
                    onClose={() => handleCloseDialog("institution")}
                />
                <CurricularUploadDialog
                    open={openCurricularDialog}
                    onClose={() => handleCloseDialog("curricular")}
                />
                <FacultyUploadDialog
                    open={openFacultyDialog}
                    onClose={() => handleCloseDialog("faculty")}
                />
                <GraduatesUploadDialog
                    open={openGraduatesDialog}
                    onClose={() => handleCloseDialog("graduates")}
                />

                {/* Stats Cards - Lighter and more minimal */}
                <h2 className="text-base font-medium text-gray-700 mb-3 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1.5 text-gray-500" />
                    Key Statistics
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                    {statCards.map((stat, index) => {
                        // Light colors
                        const bgColors = [
                            "bg-blue-50",
                            "bg-rose-50",
                            "bg-emerald-50",
                            "bg-amber-50",
                        ];
                        const textColors = [
                            "text-blue-600",
                            "text-rose-600",
                            "text-emerald-600",
                            "text-amber-600",
                        ];

                        return (
                            <div
                                key={index}
                                className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
                            >
                                <div className="p-3">
                                    <div className="flex items-center">
                                        <div
                                            className={`p-2 rounded-md ${bgColors[index]} ${textColors[index]} mr-3`}
                                        >
                                            {stat.icon}
                                        </div>
                                        <div>
                                            <p
                                                className={`text-lg font-medium ${textColors[index]}`}
                                            >
                                                {stat.value}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {stat.label}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Charts - Lighter and more minimal */}
                <h2 className="text-base font-medium text-gray-700 mb-3 flex items-center">
                    <BarChart2 className="w-4 h-4 mr-1.5 text-gray-500" />
                    Visual Insights
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-5">
                    {chartData.map((chart, index) => {
                        // Update chart colors to lighter palette
                        chart.data.datasets[0].backgroundColor = [
                            "rgba(59, 130, 246, 0.7)", // blue
                            "rgba(236, 72, 153, 0.7)", // rose
                            "rgba(245, 158, 11, 0.7)", // amber
                            "rgba(16, 185, 129, 0.7)", // emerald
                            "rgba(139, 92, 246, 0.7)", // purple
                            "rgba(107, 114, 128, 0.7)", // gray
                            "rgba(239, 68, 68, 0.7)", // red
                            "rgba(14, 165, 233, 0.7)", // sky
                        ].slice(0, chart.data.labels.length);

                        chart.data.datasets[0].borderColor = Array(
                            chart.data.labels.length
                        ).fill("#fff");
                        chart.data.datasets[0].borderWidth = 1;

                        return (
                            <div
                                key={index}
                                className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
                            >
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-sm font-medium text-gray-700">
                                            {chart.title}
                                        </h3>
                                        <div className="p-1 bg-gray-50 rounded-full text-gray-400">
                                            <BarChart2 className="w-3 h-3" />
                                        </div>
                                    </div>
                                    <div className="h-56 relative">
                                        <Pie
                                            data={chart.data}
                                            options={{
                                                ...CHART_OPTIONS,
                                                plugins: {
                                                    ...CHART_OPTIONS.plugins,
                                                    legend: {
                                                        ...CHART_OPTIONS
                                                            .plugins.legend,
                                                        labels: {
                                                            ...CHART_OPTIONS
                                                                .plugins.legend
                                                                .labels,
                                                            color: "#6B7280",
                                                            boxWidth: 8,
                                                            padding: 4,
                                                            font: {
                                                                size: 10,
                                                            },
                                                        },
                                                    },
                                                    tooltip: {
                                                        ...CHART_OPTIONS
                                                            .plugins.tooltip,
                                                        backgroundColor:
                                                            "rgba(255, 255, 255, 0.9)",
                                                        titleColor: "#374151",
                                                        bodyColor: "#374151",
                                                        borderColor: "#E5E7EB",
                                                        borderWidth: 1,
                                                        padding: 8,
                                                        bodyFont: {
                                                            size: 11,
                                                        },
                                                        titleFont: {
                                                            size: 11,
                                                            weight: "normal",
                                                        },
                                                    },
                                                },
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

DashboardPage.propTypes = {
    openUploadDialog: PropTypes.bool,
    uploadType: PropTypes.string,
    uploadEndpoint: PropTypes.string,
    setOpenUploadDialog: PropTypes.func,
    setStats: PropTypes.func,
};

export default DashboardPage;
