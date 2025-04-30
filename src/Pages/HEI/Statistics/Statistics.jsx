import { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Grid,
    Paper,
    Divider,
    Skeleton,
} from "@mui/material";
import axios from "axios";
import {
    Chart as ChartJS,
    ArcElement,
    BarElement,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
} from "chart.js";
import { Pie, Bar, Doughnut, Line } from "react-chartjs-2";
import { motion } from "framer-motion";

// Register Chart.js components
ChartJS.register(
    ArcElement,
    BarElement,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend
);

const Statistics = () => {
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

    // Aggregate statistics from programs data
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

    // Enrollment by year level (for Line chart)
    const enrollmentByYearLevel = stats.programs.reduce((acc, program) => {
        acc["Freshmen"] =
            (acc["Freshmen"] || 0) +
            (program.new_students_freshmen_male || 0) +
            (program.new_students_freshmen_female || 0);
        acc["1st Year"] =
            (acc["1st Year"] || 0) +
            (program.first_year_old_male || 0) +
            (program.first_year_old_female || 0);
        acc["2nd Year"] =
            (acc["2nd Year"] || 0) +
            (program.second_year_male || 0) +
            (program.second_year_female || 0);
        acc["3rd Year"] =
            (acc["3rd Year"] || 0) +
            (program.third_year_male || 0) +
            (program.third_year_female || 0);
        acc["4th Year"] =
            (acc["4th Year"] || 0) +
            (program.fourth_year_male || 0) +
            (program.fourth_year_female || 0);
        acc["5th Year"] =
            (acc["5th Year"] || 0) +
            (program.fifth_year_male || 0) +
            (program.fifth_year_female || 0);
        acc["6th Year"] =
            (acc["6th Year"] || 0) +
            (program.sixth_year_male || 0) +
            (program.sixth_year_female || 0);
        acc["7th Year"] =
            (acc["7th Year"] || 0) +
            (program.seventh_year_male || 0) +
            (program.seventh_year_female || 0);
        return acc;
    }, {});

    // Chart Data with a modern color scheme
    const chartColors = {
        primary: "#3B82F6", // Blue
        secondary: "#EC4899", // Pink
        teal: "#14B8A6", // Teal
        purple: "#8B5CF6", // Purple
        orange: "#F59E0B", // Orange
        grey: "#6B7280", // Grey
    };

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

    const totalsBarData = {
        labels: ["Users", "Faculty", "Programs", "Institutions"],
        datasets: [
            {
                label: "Counts",
                data: [
                    totalUsers,
                    totalFaculty,
                    totalPrograms,
                    totalInstitutions,
                ],
                backgroundColor: chartColors.teal,
                borderColor: chartColors.teal,
                borderWidth: 1,
                borderRadius: 4,
            },
        ],
    };

    const enrollmentDoughnutData = {
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

    const enrollmentLineData = {
        labels: Object.keys(enrollmentByYearLevel),
        datasets: [
            {
                label: "Enrollments by Year",
                data: Object.values(enrollmentByYearLevel),
                fill: true,
                backgroundColor: `${chartColors.primary}33`, // Semi-transparent fill
                borderColor: chartColors.primary,
                tension: 0.4,
                pointBackgroundColor: chartColors.primary,
                pointBorderColor: "#fff",
                pointBorderWidth: 2,
            },
        ],
    };

    // Chart Options with enhanced styling
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top",
                labels: {
                    font: { size: 14, family: "'Inter', sans-serif" },
                    color: "#1F2937",
                    padding: 15,
                },
            },
            tooltip: {
                backgroundColor: "#1F2937",
                titleFont: { size: 14, family: "'Inter', sans-serif" },
                bodyFont: { size: 12, family: "'Inter', sans-serif" },
                padding: 10,
                cornerRadius: 4,
                callbacks: {
                    label: (context) =>
                        `${context.label}: ${context.raw.toLocaleString()}`,
                },
            },
        },
    };

    const barOptions = {
        ...chartOptions,
        plugins: { ...chartOptions.plugins, legend: { display: false } },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    font: { size: 12, family: "'Inter', sans-serif" },
                    color: "#6B7280",
                },
                grid: { color: "#E5E7EB" },
            },
            x: {
                ticks: {
                    font: { size: 12, family: "'Inter', sans-serif" },
                    color: "#6B7280",
                },
                grid: { display: false },
            },
        },
    };

    const lineOptions = {
        ...chartOptions,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    font: { size: 12, family: "'Inter', sans-serif" },
                    color: "#6B7280",
                },
                grid: { color: "#E5E7EB" },
            },
            x: {
                ticks: {
                    font: { size: 12, family: "'Inter', sans-serif" },
                    color: "#6B7280",
                },
                grid: { display: false },
            },
        },
    };

    // Animation variants for framer-motion
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
        hover: { scale: 1.03, boxShadow: "0 12px 24px rgba(0,0,0,0.15)" },
    };

    const chartVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
    };

    const skeletonVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } },
    };

    if (stats.loading) {
        return (
            <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh" }}>
                {/* Skeleton Header */}
                <Box
                    sx={{
                        py: 4,
                        px: { xs: 2, md: 4 },
                        bgcolor: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
                        color: "#fff",
                        textAlign: "center",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                >
                    <motion.div
                        variants={skeletonVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <Skeleton
                            variant="text"
                            width="40%"
                            height={60}
                            sx={{ mx: "auto", bgcolor: "rgba(255,255,255,0.2)" }}
                        />
                        <Skeleton
                            variant="text"
                            width="20%"
                            height={30}
                            sx={{ mx: "auto", bgcolor: "rgba(255,255,255,0.2)" }}
                        />
                    </motion.div>
                </Box>

                {/* Skeleton Content */}
                <Box sx={{ p: { xs: 2, md: 4 } }}>
                    <Grid container spacing={3}>
                        {/* Skeleton Summary Cards */}
                        {[...Array(6)].map((_, index) => (
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                                lg={2}
                                key={index}
                                sx={{ display: "flex" }}
                            >
                                <motion.div
                                    variants={skeletonVariants}
                                    initial="hidden"
                                    animate="visible"
                                    transition={{ delay: index * 0.1 }}
                                    style={{ flex: 1 }}
                                >
                                    <Skeleton
                                        variant="rectangular"
                                        height={120}
                                        animation="wave"
                                        sx={{
                                            borderRadius: 3,
                                            bgcolor: "grey.200",
                                        }}
                                    />
                                </motion.div>
                            </Grid>
                        ))}

                        {/* Skeleton Charts */}
                        {[...Array(4)].map((_, index) => (
                            <Grid
                                item
                                xs={12}
                                md={6}
                                lg={3}
                                key={index}
                            >
                                <motion.div
                                    variants={skeletonVariants}
                                    initial="hidden"
                                    animate="visible"
                                    transition={{ delay: index * 0.2 }}
                                >
                                    <Skeleton
                                        variant="rectangular"
                                        height={350}
                                        animation="wave"
                                        sx={{
                                            borderRadius: 3,
                                            bgcolor: "grey.200",
                                        }}
                                    />
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Box>
        );
    }

    if (stats.error) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
                bgcolor="#f5f5f5"
            >
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Typography variant="h5" color="error" align="center">
                        {stats.error}
                    </Typography>
                </motion.div>
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh" }}>
            {/* Header */}
            <Box
                sx={{
                    py: 4,
                    px: { xs: 2, md: 4 },
                    bgcolor: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
                    color: "#fff",
                    textAlign: "center",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 700,
                            fontFamily: "'Inter', sans-serif",
                            mb: 1,
                        }}
                    >
                        Statistics Dashboard
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        sx={{ fontSize: "1.1rem", opacity: 0.9 }}
                    >
                        Insights into Users, Faculty, Programs, and More
                    </Typography>
                </motion.div>
            </Box>

            {/* Content */}
            <Box sx={{ p: { xs: 2, md: 4 } }}>
                <Grid container spacing={3}>
                    {/* Summary Cards */}
                    {[
                        {
                            label: "Total Users",
                            value: totalUsers,
                            color: chartColors.orange,
                        },
                        {
                            label: "Total Faculty",
                            value: totalFaculty,
                            color: chartColors.teal,
                        },
                        {
                            label: "Total Programs",
                            value: totalPrograms,
                            color: chartColors.purple,
                        },
                        {
                            label: "Total Institutions",
                            value: totalInstitutions,
                            color: chartColors.grey,
                        },
                        {
                            label: "Total Enrollments",
                            value: totalEnrollments.toLocaleString(),
                            color: chartColors.primary,
                        },
                        {
                            label: "Total Graduates",
                            value: totalGraduates.toLocaleString(),
                            color: chartColors.secondary,
                        },
                    ].map((stat, index) => (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            lg={2}
                            key={index}
                            sx={{ display: "flex" }}
                        >
                            <motion.div
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                whileHover="hover"
                                transition={{ delay: index * 0.1 }}
                                style={{ flex: 1 }}
                            >
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: 3,
                                        bgcolor: "#fff",
                                        border: `1px solid ${chartColors.grey}22`,
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                        transition: "all 0.3s ease",
                                    }}
                                >
                                    <Typography
                                        variant="h4"
                                        sx={{
                                            fontWeight: 700,
                                            color: stat.color,
                                            fontFamily:
                                                "'Inter', sans-serif",
                                        }}
                                    >
                                        {stat.value}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: "#6B7280",
                                            fontFamily:
                                                "'Inter', sans-serif",
                                        }}
                                    >
                                        {stat.label}
                                    </Typography>
                                </Paper>
                            </motion.div>
                        </Grid>
                    ))}

                    {/* Charts */}
                    <Grid item xs={12} md={6} lg={3}>
                        <motion.div
                            variants={chartVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: 3,
                                    bgcolor: "#fff",
                                    border: `1px solid ${chartColors.grey}22`,
                                    height: 350,
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 600,
                                        color: "#1F2937",
                                        fontFamily: "'Inter', sans-serif",
                                        mb: 1,
                                    }}
                                >
                                    Gender Breakdown
                                </Typography>
                                <Divider sx={{ mb: 2, bgcolor: "#E5E7EB" }} />
                                <Box sx={{ flex: 1 }}>
                                    <Pie
                                        data={genderPieData}
                                        options={chartOptions}
                                    />
                                </Box>
                            </Paper>
                        </motion.div>
                    </Grid>

                    <Grid item xs={12} md={6} lg={3}>
                        <motion.div
                            variants={chartVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: 3,
                                    bgcolor: "#fff",
                                    border: `1px solid ${chartColors.grey}22`,
                                    height: 350,
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 600,
                                        color: "#1F2937",
                                        fontFamily: "'Inter', sans-serif",
                                        mb: 1,
                                    }}
                                >
                                    Totals by Category
                                </Typography>
                                <Divider sx={{ mb: 2, bgcolor: "#E5E7EB" }} />
                                <Box sx={{ flex: 1 }}>
                                    <Bar
                                        data={totalsBarData}
                                        options={barOptions}
                                    />
                                </Box>
                            </Paper>
                        </motion.div>
                    </Grid>

                    <Grid item xs={12} md={6} lg={3}>
                        <motion.div
                            variants={chartVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: 3,
                                    bgcolor: "#fff",
                                    border: `1px solid ${chartColors.grey}22`,
                                    height: 350,
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 600,
                                        color: "#1F2937",
                                        fontFamily: "'Inter', sans-serif",
                                        mb: 1,
                                    }}
                                >
                                    Enrollments vs Graduates
                                </Typography>
                                <Divider sx={{ mb: 2, bgcolor: "#E5E7EB" }} />
                                <Box sx={{ flex: 1 }}>
                                    <Doughnut
                                        data={enrollmentDoughnutData}
                                        options={chartOptions}
                                    />
                                </Box>
                            </Paper>
                        </motion.div>
                    </Grid>

                    <Grid item xs={12} md={6} lg={3}>
                        <motion.div
                            variants={chartVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: 3,
                                    bgcolor: "#fff",
                                    border: `1px solid ${chartColors.grey}22`,
                                    height: 350,
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 600,
                                        color: "#1F2937",
                                        fontFamily: "'Inter', sans-serif",
                                        mb: 1,
                                    }}
                                >
                                    Enrollments by Year
                                </Typography>
                                <Divider sx={{ mb: 2, bgcolor: "#E5E7EB" }} />
                                <Box sx={{ flex: 1 }}>
                                    <Line
                                        data={enrollmentLineData}
                                        options={lineOptions}
                                    />
                                </Box>
                            </Paper>
                        </motion.div>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default Statistics;
