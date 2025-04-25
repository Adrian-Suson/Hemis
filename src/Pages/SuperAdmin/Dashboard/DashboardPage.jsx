import { useState, useEffect } from "react";
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
    Grid,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Alert,
    Divider,
} from "@mui/material";

// Register Chart.js components for Pie charts
ChartJS.register(ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

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
        const token = localStorage.getItem("token");
        if (!token) {
            setStats((prev) => ({
                ...prev,
                error: "No authentication token",
                loading: false,
            }));
            return;
        }

        const fetchStats = async () => {
            try {
                const [users, faculty, programs, institutions] =
                    await Promise.all([
                        axios.get("http://localhost:8000/api/users", {
                            headers: { Authorization: `Bearer ${token}` },
                        }),
                        axios.get(
                            "http://localhost:8000/api/faculty-profiles",
                            {
                                headers: { Authorization: `Bearer ${token}` },
                            }
                        ),
                        axios.get("http://localhost:8000/api/programs", {
                            headers: { Authorization: `Bearer ${token}` },
                        }),
                        axios.get("http://localhost:8000/api/institutions", {
                            headers: { Authorization: `Bearer ${token}` },
                        }),
                    ]);
                setStats({
                    users: users.data,
                    facultyProfiles: faculty.data,
                    programs: programs.data,
                    institutions: institutions.data,
                    loading: false,
                    error: null,
                });
            } catch (error) {
                setStats((prev) => ({
                    ...prev,
                    error: "Failed to load statistics: " + error.message,
                    loading: false,
                }));
            }
        };

        fetchStats();
    }, []);

    // Aggregation logic
    const totalUsers = stats.users.length;
    const totalFaculty = stats.facultyProfiles.length;
    const totalPrograms = stats.programs.length;
    const totalInstitutions = stats.institutions.length;
    const totalEnrollments = stats.programs.reduce(
        (sum, program) => sum + (program.grand_total || 0),
        0
    );
    const totalGraduates = stats.programs.reduce(
        (sum, program) => sum + (program.graduates_total || 0),
        0
    );
    const genderBreakdown = stats.programs.reduce(
        (acc, program) => ({
            male: acc.male + (program.subtotal_male || 0),
            female: acc.female + (program.subtotal_female || 0),
        }),
        { male: 0, female: 0 }
    );

    const enrollmentByYearLevel = stats.programs.reduce((acc, program) => {
        acc["Freshmen"] =
            (acc["Freshmen"] || 0) +
            (program.new_students_freshmen_male || 0) +
            (program.new_students_freshmen_female || 0);
        acc["1st Year"] =
            (acc["1st Year"] || 0) +
            (program["1st_year_male"] || 0) +
            (program["1st_year_female"] || 0);
        acc["2nd Year"] =
            (acc["2nd Year"] || 0) +
            (program["2nd_year_male"] || 0) +
            (program["2nd_year_female"] || 0);
        acc["3rd Year"] =
            (acc["3rd Year"] || 0) +
            (program["3rd_year_male"] || 0) +
            (program["3rd_year_female"] || 0);
        acc["4th Year"] =
            (acc["4th Year"] || 0) +
            (program["4th_year_male"] || 0) +
            (program["4th_year_female"] || 0);
        acc["5th Year"] =
            (acc["5th Year"] || 0) +
            (program["5th_year_male"] || 0) +
            (program["5th_year_female"] || 0);
        acc["6th Year"] =
            (acc["6th Year"] || 0) +
            (program["6th_year_male"] || 0) +
            (program["6th_year_female"] || 0);
        acc["7th Year"] =
            (acc["7th Year"] || 0) +
            (program["7th_year_male"] || 0) +
            (program["7th_year_female"] || 0);
        return acc;
    }, {});

    const chartColors = {
        primary: "#3B82F6",
        secondary: "#EC4899",
        teal: "#14B8A6",
        purple: "#8B5CF6",
        orange: "#F59E0B",
        grey: "#6B7280",
    };

    // Pie chart data configurations
    const genderPieData = {
        labels: ["Male Students", "Female Students"],
        datasets: [
            {
                data: [genderBreakdown.male, genderBreakdown.female],
                backgroundColor: [chartColors.primary, chartColors.secondary],
                borderColor: ["#fff", "#fff"],
                borderWidth: 2,
            },
        ],
    };

    const totalsPieData = {
        labels: ["Users", "Faculty", "Programs", "Institutions"],
        datasets: [
            {
                data: [
                    totalUsers,
                    totalFaculty,
                    totalPrograms,
                    totalInstitutions,
                ],
                backgroundColor: [
                    chartColors.teal,
                    chartColors.orange,
                    chartColors.purple,
                    chartColors.grey,
                ],
                borderColor: ["#fff", "#fff", "#fff", "#fff"],
                borderWidth: 2,
            },
        ],
    };

    const enrollmentPieData = {
        labels: ["Enrollments", "Graduates"],
        datasets: [
            {
                data: [totalEnrollments, totalGraduates],
                backgroundColor: [chartColors.purple, chartColors.grey],
                borderColor: ["#fff", "#fff"],
                borderWidth: 2,
            },
        ],
    };

    const yearLevelPieData = {
        labels: Object.keys(enrollmentByYearLevel),
        datasets: [
            {
                data: Object.values(enrollmentByYearLevel),
                backgroundColor: [
                    chartColors.primary,
                    chartColors.secondary,
                    chartColors.teal,
                    chartColors.purple,
                    chartColors.orange,
                    chartColors.grey,
                    "#10B981", // emerald-500 for 6th Year
                    "#EF4444", // red-500 for 7th Year
                ].slice(0, Object.keys(enrollmentByYearLevel).length),
                borderColor: Array(
                    Object.keys(enrollmentByYearLevel).length
                ).fill("#fff"),
                borderWidth: 2,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false, // Allow custom height
        plugins: {
            legend: {
                display: true,
                position: "top",
                labels: {
                    font: {
                        size: 12, // Smaller legend font
                    },
                },
            },
            tooltip: {
                enabled: true,
                bodyFont: {
                    size: 12, // Smaller tooltip font
                },
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
        hover: { scale: 1.03, boxShadow: "0 12px 24px rgba(0,0,0,0.15)" },
    };

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

            {/* Stats Cards */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
                {[
                    {
                        label: "Total Users",
                        value: totalUsers,
                        color: "warning.main",
                    },
                    {
                        label: "Total Faculty",
                        value: totalFaculty,
                        color: "success.main",
                    },
                    {
                        label: "Total Programs",
                        value: totalPrograms,
                        color: "secondary.main",
                    },
                    {
                        label: "Total Institutions",
                        value: totalInstitutions,
                        color: "text.secondary",
                    },
                    {
                        label: "Total Enrollments",
                        value: totalEnrollments.toLocaleString(),
                        color: "primary.main",
                    },
                    {
                        label: "Total Graduates",
                        value: totalGraduates.toLocaleString(),
                        color: "error.main",
                    },
                ].map((stat, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <motion.div
                            variants={cardVariants}
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
                {[
                    {
                        title: "Gender Breakdown",
                        ChartComponent: Pie,
                        data: genderPieData,
                        options: chartOptions,
                    },
                    {
                        title: "Totals by Category",
                        ChartComponent: Pie,
                        data: totalsPieData,
                        options: chartOptions,
                    },
                    {
                        title: "Enrollments vs Graduates",
                        ChartComponent: Pie,
                        data: enrollmentPieData,
                        options: chartOptions,
                    },
                    {
                        title: "Enrollments by Year",
                        ChartComponent: Pie,
                        data: yearLevelPieData,
                        options: chartOptions,
                    },
                ].map((chart, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <motion.div
                            variants={cardVariants}
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
                                            height: 200, // Fixed height for smaller charts
                                            width: "100%",
                                        }}
                                    >
                                        <chart.ChartComponent
                                            data={chart.data}
                                            options={chart.options}
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
