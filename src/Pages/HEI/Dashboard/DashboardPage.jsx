import { useState, useEffect, useMemo } from "react";
import axios from "axios";
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
    Box,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Alert,
    Grid,
    Divider,
    Button,
} from "@mui/material";
import config from "../../../utils/config";

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
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
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

    useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setStats((prev) => ({
                    ...prev,
                    error: "No authentication token",
                    loading: false,
                }));
                return;
            }

            // Get institution ID from localStorage
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

            // If no institutionId, fetch it from the /user endpoint
            if (!institutionId) {
                try {
                    const userResponse = await axios.get(
                        `${config.API_URL}/user`,
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );
                    institutionId = userResponse.data.institution_id || null;
                } catch (error) {
                    console.error("Failed to fetch user data from API:", error);
                }
            }

            // If still no institutionId, set error
            if (!institutionId) {
                setStats((prev) => ({
                    ...prev,
                    error: "No institution ID found",
                    loading: false,
                }));
                return;
            }

            try {
                const [users, faculty, programs, institutions] =
                    await Promise.all([
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
        };

        fetchStats();
    }, []);

    // Memoized aggregations
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

    // Memoized chart data
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

    // Loading state
    if (stats.loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "90vh",
                    bgcolor: "grey.100",
                    p: { xs: 2, sm: 4 },
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    // Error state
    if (stats.error) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "90vh",
                    bgcolor: "grey.100",
                    p: { xs: 2, sm: 4 },
                }}
            >
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Alert severity="error">{stats.error}</Alert>
                </motion.div>
            </Box>
        );
    }

    // Stat cards configuration
    const statCards = [
        {
            label: "Total Users",
            value: aggregations.totals.users,
            color: "warning.main",
        },
        {
            label: "Total Faculty",
            value: aggregations.totals.faculty,
            color: "success.main",
        },
        {
            label: "Total Programs",
            value: aggregations.totals.programs,
            color: "secondary.main",
        },
        {
            label: "Total Institutions",
            value: aggregations.totals.institutions,
            color: "text.secondary",
        },
        {
            label: "Total Enrollments",
            value: aggregations.totals.enrollments.toLocaleString(),
            color: "primary.main",
        },
        {
            label: "Total Graduates",
            value: aggregations.totals.graduates.toLocaleString(),
            color: "error.main",
        },
        {
            label: "Institution ID",
            value: stats.institutionId || "N/A",
            color: "info.main",
        },
    ];

    return (
        <Box
            sx={{
                bgcolor: "grey.100",
                overflowY: "auto",
                height: "90vh",
                width: "100%",
                p: { xs: 2, sm: 4 },
                boxSizing: "border-box",
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    p: { xs: 2, sm: 4 },
                    bgcolor: "linear-gradient(to right, #3B82F6, #8B5CF6)",
                    color: "white",
                    textAlign: "center",
                    boxShadow: 3,
                    mb: 4,
                    display: { xs: "block", sm: "none" },
                }}
            >
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Statistics Dashboard
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Insights into Users, Faculty, Programs, and More
                </Typography>
            </Box>

            {/* Upload Buttons Row */}
            <Box sx={{ mb: 4 }}>
                <Grid container spacing={2}>
                    <Grid item size={12} sm={3}>
                        <Button variant="contained" color="primary" fullWidth>
                            Upload CurricularProgram
                        </Button>
                    </Grid>
                    <Grid item size={12} sm={3}>
                        <Button variant="contained" color="primary" fullWidth>
                            Upload Faculty
                        </Button>
                    </Grid>
                    <Grid item size={12} sm={3}>
                        <Button variant="contained" color="primary" fullWidth>
                            Upload Graduates
                        </Button>
                    </Grid>
                    <Grid item size={12} sm={3}>
                        <Button variant="contained" color="primary" fullWidth>
                            Upload Campus
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
                {statCards.map((stat, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                        <motion.div
                            variants={CARD_VARIANTS}
                            initial="hidden"
                            animate="visible"
                            whileHover="hover"
                        >
                            <Card sx={{ border: 1, borderColor: "grey.200" }}>
                                <CardContent sx={{ p: 2 }}>
                                    <Typography
                                        variant="h5"
                                        color={stat.color}
                                        fontWeight="bold"
                                        gutterBottom
                                    >
                                        {stat.value}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {stat.label}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>

            {/* Charts */}
            <Grid container spacing={2}>
                {chartData.map((chart, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                        <motion.div
                            variants={CARD_VARIANTS}
                            initial="hidden"
                            animate="visible"
                            whileHover="hover"
                        >
                            <Card sx={{ border: 1, borderColor: "grey.200" }}>
                                <CardContent sx={{ p: 2 }}>
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight="medium"
                                        color="text.primary"
                                        gutterBottom
                                    >
                                        {chart.title}
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Box
                                        sx={{
                                            position: "relative",
                                            height: 200,
                                            width: "100%",
                                        }}
                                    >
                                        <Pie
                                            data={chart.data}
                                            options={CHART_OPTIONS}
                                        />
                                    </Box>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default DashboardPage;
