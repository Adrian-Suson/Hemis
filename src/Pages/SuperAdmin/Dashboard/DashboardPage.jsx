"use client";

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
    CardContent,
    Typography,
    Alert,
    Grid,
    Divider,
    Paper,
    Chip,
    Avatar,
    useTheme,
    Container,
    Skeleton,
} from "@mui/material";
import {
    People as PeopleIcon,
    School as SchoolIcon,
    MenuBook as MenuBookIcon,
    Business as BusinessIcon,
    BarChart as BarChartIcon,
    TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import config from "../../../utils/config";

// Register Chart.js components for Pie charts
ChartJS.register(ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

const DashboardPage = () => {
    const theme = useTheme();
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
                        axios.get(`${config.API_URL}/users`, {
                            headers: { Authorization: `Bearer ${token}` },
                        }),
                        axios.get(`${config.API_URL}/faculty-profiles`, {
                            headers: { Authorization: `Bearer ${token}` },
                        }),
                        axios.get(`${config.API_URL}/programs`, {
                            headers: { Authorization: `Bearer ${token}` },
                        }),
                        axios.get(`${config.API_URL}/institutions`, {
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

    // Define chart colors using MUI theme
    const chartColors = {
        primary: theme.palette.primary.main,
        secondary: theme.palette.secondary.main,
        success: theme.palette.success.main,
        warning: theme.palette.warning.main,
        info: theme.palette.info.main,
        error: theme.palette.error.main,
        grey: theme.palette.grey[500],
        purple: "#8b5cf6",
    };

    // Pie chart data configurations
    const genderPieData = {
        labels: ["Male Students", "Female Students"],
        datasets: [
            {
                data: [genderBreakdown.male, genderBreakdown.female],
                backgroundColor: [chartColors.primary, chartColors.secondary],
                borderColor: [
                    theme.palette.background.paper,
                    theme.palette.background.paper,
                ],
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
                    chartColors.info,
                    chartColors.warning,
                    chartColors.success,
                    chartColors.grey,
                ],
                borderColor: Array(4).fill(theme.palette.background.paper),
                borderWidth: 2,
            },
        ],
    };

    const enrollmentPieData = {
        labels: ["Enrollments", "Graduates"],
        datasets: [
            {
                data: [totalEnrollments, totalGraduates],
                backgroundColor: [chartColors.purple, chartColors.error],
                borderColor: [
                    theme.palette.background.paper,
                    theme.palette.background.paper,
                ],
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
                    chartColors.success,
                    chartColors.warning,
                    chartColors.info,
                    chartColors.error,
                    chartColors.grey,
                    chartColors.purple,
                ].slice(0, Object.keys(enrollmentByYearLevel).length),
                borderColor: Array(
                    Object.keys(enrollmentByYearLevel).length
                ).fill(theme.palette.background.paper),
                borderWidth: 2,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: "top",
                labels: {
                    font: {
                        size: 12,
                        family: theme.typography.fontFamily,
                    },
                    usePointStyle: true,
                    padding: 15,
                    color: theme.palette.text.primary,
                },
            },
            tooltip: {
                enabled: true,
                backgroundColor:
                    theme.palette.mode === "dark"
                        ? "rgba(0, 0, 0, 0.8)"
                        : "rgba(255, 255, 255, 0.9)",
                titleColor: theme.palette.text.primary,
                bodyColor: theme.palette.text.secondary,
                titleFont: {
                    size: 13,
                    family: theme.typography.fontFamily,
                    weight: "600",
                },
                bodyFont: {
                    size: 12,
                    family: theme.typography.fontFamily,
                },
                padding: 12,
                cornerRadius: 8,
                displayColors: true,
                borderColor: theme.palette.divider,
                borderWidth: 1,
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.5,
            },
        }),
        hover: {
            scale: 1.02,
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            transition: { duration: 0.2 },
        },
    };

    const statCards = [
        {
            label: "Total Users",
            value: totalUsers,
            icon: <PeopleIcon />,
            color: theme.palette.warning.main,
            bgColor: theme.palette.warning.light,
        },
        {
            label: "Total Faculty",
            value: totalFaculty,
            icon: <SchoolIcon />,
            color: theme.palette.success.main,
            bgColor: theme.palette.success.light,
        },
        {
            label: "Total Programs",
            value: totalPrograms,
            icon: <MenuBookIcon />,
            color: theme.palette.secondary.main,
            bgColor: theme.palette.secondary.light,
        },
        {
            label: "Total Institutions",
            value: totalInstitutions,
            icon: <BusinessIcon />,
            color: theme.palette.grey[700],
            bgColor: theme.palette.grey[200],
        },
        {
            label: "Total Enrollments",
            value: totalEnrollments.toLocaleString(),
            icon: <PeopleIcon />,
            color: theme.palette.primary.main,
            bgColor: theme.palette.primary.light,
        },
        {
            label: "Total Graduates",
            value: totalGraduates.toLocaleString(),
            icon: <SchoolIcon />,
            color: theme.palette.error.main,
            bgColor: theme.palette.error.light,
        },
    ];

    const chartCards = [
        {
            title: "Gender Breakdown",
            description: "Distribution of male and female students",
            ChartComponent: Pie,
            data: genderPieData,
            options: chartOptions,
            icon: <BarChartIcon />,
        },
        {
            title: "Totals by Category",
            description:
                "Comparison of users, faculty, programs, and institutions",
            ChartComponent: Pie,
            data: totalsPieData,
            options: chartOptions,
            icon: <BarChartIcon />,
        },
        {
            title: "Enrollments vs Graduates",
            description: "Comparison of total enrollments and graduates",
            ChartComponent: Pie,
            data: enrollmentPieData,
            options: chartOptions,
            icon: <BarChartIcon />,
        },
        {
            title: "Enrollments by Year",
            description:
                "Distribution of students across different year levels",
            ChartComponent: Pie,
            data: yearLevelPieData,
            options: chartOptions,
            icon: <BarChartIcon />,
        },
    ];

    if (stats.loading) {
        return (
            <Box
                sx={{
                    p: { xs: 2, sm: 4, md: 6 },
                    bgcolor: "background.default",
                    minHeight: "100vh",
                }}
            >
                <Container maxWidth="xl">
                    <Box sx={{ mb: 4 }}>
                        <Skeleton
                            variant="rectangular"
                            width={300}
                            height={40}
                            sx={{ mb: 2 }}
                        />
                        <Skeleton
                            variant="rectangular"
                            width="60%"
                            height={24}
                        />
                    </Box>

                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        {[...Array(6)].map((_, i) => (
                            <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                                <Skeleton
                                    variant="rectangular"
                                    height={120}
                                    sx={{ borderRadius: 2 }}
                                />
                            </Grid>
                        ))}
                    </Grid>

                    <Grid container spacing={3}>
                        {[...Array(4)].map((_, i) => (
                            <Grid item size={{ xs: 12, sm: 6, lg: 3 }} key={i}>
                                <Skeleton
                                    variant="rectangular"
                                    height={300}
                                    sx={{ borderRadius: 2 }}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>
        );
    }

    if (stats.error) {
        return (
            <Box
                sx={{
                    p: { xs: 2, sm: 4, md: 6 },
                    bgcolor: "background.default",
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    style={{ width: "100%", maxWidth: "600px" }}
                >
                    <Alert
                        severity="error"
                        sx={{ boxShadow: 3, borderRadius: 2 }}
                    >
                        <Typography variant="h6" component="div">
                            Error
                        </Typography>
                        <Typography variant="body2">{stats.error}</Typography>
                    </Alert>
                </motion.div>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                p: { xs: 2, sm: 4, md: 6 },
                bgcolor: "background.default",
                minHeight: "100vh",
            }}
        >
            <Container maxWidth="xl">
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: { xs: "column", md: "row" },
                            alignItems: { xs: "flex-start", md: "center" },
                            justifyContent: "space-between",
                        }}
                    >
                        <Box>
                            <Typography
                                variant="h4"
                                component="h1"
                                fontWeight="bold"
                                gutterBottom
                                color="text.primary"
                            >
                                Statistics Dashboard
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                color="text.secondary"
                            >
                                Comprehensive insights into educational data and
                                metrics
                            </Typography>
                        </Box>
                        <Box sx={{ mt: { xs: 2, md: 0 } }}>
                            <Chip
                                icon={<TrendingUpIcon />}
                                label="Last updated: Today"
                                color="primary"
                                variant="outlined"
                                sx={{
                                    borderRadius: 4,
                                    px: 1,
                                    "& .MuiChip-label": { px: 1 },
                                }}
                            />
                        </Box>
                    </Box>
                </Box>

                {/* Stats Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {statCards.map((stat, index) => (
                        <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                            <motion.div
                                custom={index}
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                whileHover="hover"
                                style={{ height: "100%" }}
                            >
                                <Paper
                                    elevation={2}
                                    sx={{
                                        height: "100%",
                                        borderRadius: 2,
                                        overflow: "hidden",
                                        transition:
                                            "box-shadow 0.3s ease-in-out",
                                        "&:hover": {
                                            boxShadow: 6,
                                        },
                                    }}
                                >
                                    <CardContent sx={{ p: 3, height: "100%" }}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                mb: 2,
                                            }}
                                        >
                                            <Avatar
                                                sx={{
                                                    bgcolor: stat.bgColor,
                                                    color: stat.color,
                                                    width: 48,
                                                    height: 48,
                                                }}
                                            >
                                                {stat.icon}
                                            </Avatar>
                                            <Typography
                                                variant="overline"
                                                sx={{
                                                    color: "text.secondary",
                                                    fontWeight: 500,
                                                    letterSpacing: 1,
                                                }}
                                            >
                                                {stat.label}
                                            </Typography>
                                        </Box>
                                        <Typography
                                            variant="h4"
                                            component="div"
                                            sx={{
                                                fontWeight: 700,
                                                color: "text.primary",
                                            }}
                                        >
                                            {stat.value}
                                        </Typography>
                                    </CardContent>
                                </Paper>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>

                {/* Charts */}
                <Grid container spacing={3}>
                    {chartCards.map((chart, index) => (
                        <Grid item size={{ xs: 12, sm: 6, lg: 3 }} key={index}>
                            <motion.div
                                custom={index + 6} // Continue the sequence from stat cards
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                whileHover="hover"
                                style={{ height: "100%" }}
                            >
                                <Paper
                                    elevation={2}
                                    sx={{
                                        height: "100%",
                                        borderRadius: 2,
                                        overflow: "hidden",
                                        transition:
                                            "box-shadow 0.3s ease-in-out",
                                        "&:hover": {
                                            boxShadow: 6,
                                        },
                                    }}
                                >
                                    <Box sx={{ p: 3, pb: 2 }}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                mb: 1,
                                            }}
                                        >
                                            <Typography
                                                variant="h6"
                                                component="h2"
                                                sx={{ fontWeight: 600 }}
                                            >
                                                {chart.title}
                                            </Typography>
                                            <Avatar
                                                sx={{
                                                    bgcolor:
                                                        theme.palette.grey[100],
                                                    color: theme.palette
                                                        .grey[700],
                                                    width: 32,
                                                    height: 32,
                                                }}
                                            >
                                                {chart.icon}
                                            </Avatar>
                                        </Box>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ mb: 2 }}
                                        >
                                            {chart.description}
                                        </Typography>
                                        <Divider sx={{ mb: 2 }} />
                                        <Box
                                            sx={{
                                                height: 240,
                                                position: "relative",
                                            }}
                                        >
                                            <chart.ChartComponent
                                                data={chart.data}
                                                options={chart.options}
                                            />
                                        </Box>
                                    </Box>
                                </Paper>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default DashboardPage;
