import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import PropTypes from "prop-types";
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
} from "lucide-react";
import config from "../../../utils/config";
import CurricularUploadDialog from "../../../Components/CurricularUploadDialog";
import FacultyUploadDialog from "../../../Components/FacultyUploadDialog";
import GraduatesUploadDialog from "../../../Components/GraduatesUploadDialog";

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

// Card animation variants
const CARD_VARIANTS = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            delay: i * 0.1,
        },
    }),
    hover: { scale: 1.03, boxShadow: "0 12px 24px rgba(0,0,0,0.15)" },
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

    const [openCurricularDialog, setOpenCurricularDialog] = useState(false);
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

        let institutionId = null;
        const userData = localStorage.getItem("user");
        if (userData) {
            try {
                const user = JSON.parse(userData);
                institutionId = user.institution_id || null;
            } catch (error) {
                console.error(
                    "Failed to parse user data from localStorage:",
                    error
                );
            }
        }

        if (!institutionId) {
            try {
                const userResponse = await axios.get(`${config.API_URL}/user`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                institutionId = userResponse.data.institution_id || null;
            } catch (error) {
                console.error("Failed to fetch user data from API:", error);
            }
        }

        if (!institutionId) {
            setStats((prev) => ({
                ...prev,
                error: "No institution ID found",
                loading: false,
            }));
            return;
        }

        try {
            const [users, faculty, programs, institutions] = await Promise.all([
                axios.get(
                    `${config.API_URL}/users?institution_id=${institutionId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                ),
                axios.get(
                    `${config.API_URL}/faculty-profiles?institution_id=${institutionId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                ),
                axios.get(
                    `${config.API_URL}/programs?institution_id=${institutionId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                ),
                axios.get(
                    `${config.API_URL}/institutions?institution_id=${institutionId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                ),
            ]);

            setStats({
                users: users.data,
                facultyProfiles: faculty.data,
                programs: programs.data,
                institutions: institutions.data,
                institutionId,
                loading: false,
                error: null,
            });
        } catch (error) {
            setStats((prev) => ({
                ...prev,
                error: `Failed to load statistics: ${error.message}`,
                loading: false,
            }));
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const handleOpenDialog = (dialogType) => {
        switch (dialogType) {
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
            type: "graduates",
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
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100 p-4 sm:p-6">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
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
        <div className="bg-gray-100 overflow-y-auto h-screen w-full p-4 sm:p-6 box-border">
            {/* Header for Mobile */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center shadow-lg mb-6 p-4 sm:p-6 rounded-lg sm:hidden">
                <h1 className="text-xl font-bold mb-1">Statistics Dashboard</h1>
                <p className="text-sm opacity-90">
                    Insights into Users, Faculty, Programs, and More
                </p>
            </div>

            {/* Upload Buttons Section */}
            <div className="mb-6 py-5 px-4 bg-white rounded-lg shadow border border-gray-200">
                <h2 className="text-lg font-medium text-gray-800 mb-4">
                    Data Upload
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {uploadButtons.map((button, index) => (
                        <button
                            key={index}
                            className={`flex items-center justify-center py-3 px-4 rounded-md text-white shadow-md transition-all ${button.color} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                            onClick={() => handleOpenDialog(button.type)}
                        >
                            {button.icon}
                            <span className="ml-2 font-medium">
                                {button.label}
                            </span>
                        </button>
                    ))}
                </div>
                <p className="mt-3 text-xs text-gray-500">
                    Supported formats: Excel (.xlsx, .xls)
                </p>
            </div>

            {/* Dialogs */}
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

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={index}
                        custom={index}
                        variants={CARD_VARIANTS}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        className={`bg-white rounded-lg shadow border ${stat.borderColor} border-l-4 border-t-0 border-r-0 border-b-0 hover:shadow-lg transition-shadow`}
                    >
                        <div className="p-4 flex items-center">
                            <div
                                className={`p-2 rounded-full ${stat.bgColor} ${stat.color} mr-4`}
                            >
                                {stat.icon}
                            </div>
                            <div>
                                <p
                                    className={`text-xl font-semibold ${stat.color}`}
                                >
                                    {stat.value}
                                </p>
                                <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">
                                    {stat.label}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {chartData.map((chart, index) => (
                    <motion.div
                        key={index}
                        custom={index + 4}
                        variants={CARD_VARIANTS}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden"
                    >
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-base font-medium text-gray-800">
                                    {chart.title}
                                </h3>
                                <div className="p-2 bg-gray-100 rounded-full text-gray-600">
                                    <BarChart2 className="w-4 h-4" />
                                </div>
                            </div>
                            <hr className="border-gray-200 mb-4" />
                            <div className="h-48 relative">
                                <Pie
                                    data={chart.data}
                                    options={CHART_OPTIONS}
                                />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Last updated indicator */}
            <div className="mt-6 flex justify-center">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Last updated: {new Date().toLocaleDateString()}
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
