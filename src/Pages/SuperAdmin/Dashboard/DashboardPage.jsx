import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { FaUser, FaUsers, FaBook, FaGraduationCap, FaBuilding } from "react-icons/fa";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useLoading } from "../../../Context/LoadingContext";
import {
    Box,
    Typography,
    Grid,
    Paper,
    Divider,
    Skeleton,
} from "@mui/material";
import { motion } from "framer-motion";

// Register Chart.js components and the datalabels plugin
ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    ChartDataLabels
);

const Dashboard = () => {
    const token = localStorage.getItem("token");
    const { showLoading, hideLoading } = useLoading();
    const [dashboardData, setDashboardData] = useState({
        users: [],
        facultyProfiles: [],
        programs: [],
        institutions: [],
        campuses: [],
        loading: true,
        error: null,
    });

    const fetchDashboardData = async () => {
        try {
            showLoading();
            const [
                usersResponse,
                facultyProfilesResponse,
                programsResponse,
                institutionsResponse,
                campusesResponse,
            ] = await Promise.all([
                axios.get("http://localhost:8000/api/users", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get(`http://localhost:8000/api/faculty-profiles`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get("http://localhost:8000/api/programs", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get("http://localhost:8000/api/institutions", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get("http://localhost:8000/api/campuses", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);

            setDashboardData({
                users: usersResponse.data,
                facultyProfiles: facultyProfilesResponse.data,
                programs: programsResponse.data,
                institutions: institutionsResponse.data,
                campuses: campusesResponse.data,
                loading: false,
                error: null,
            });
            console.log("programsResponse.data:", programsResponse.data);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            setDashboardData((prev) => ({
                ...prev,
                error: "Failed to load dashboard data. Please try again.",
                loading: false,
            }));
        } finally {
            hideLoading();
        }
    };

    useEffect(() => {
        fetchDashboardData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Calculate overview metrics
    const totalUsers = dashboardData.users.length;
    const totalFaculty = dashboardData.facultyProfiles.length;
    const totalPrograms = dashboardData.programs.length;
    const totalEnrollments = dashboardData.programs.reduce((sum, program) => {
        return (
            sum +
            (program.enrollments?.reduce(
                (subSum, enrollment) => subSum + (enrollment.grand_total || 0),
                0
            ) || 0)
        );
    }, 0);
    const totalInstitutions = dashboardData.institutions.length;

    // Aggregate institution types for the pie chart
    const institutionTypeCounts = useMemo(() => {
        return dashboardData.institutions.reduce((acc, institution) => {
            const type = institution.institution_type || "Unknown";
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {});
    }, [dashboardData.institutions]);

    // Prepare data for the institution types pie chart
    const institutionPieChartData = useMemo(() => ({
        labels: Object.keys(institutionTypeCounts),
        datasets: [
            {
                label: "Institutions by Type",
                data: Object.values(institutionTypeCounts),
                backgroundColor: [
                    "#FF6384", // Red
                    "#36A2EB", // Blue
                    "#FFCE56", // Yellow
                    "#4BC0C0", // Teal
                    "#9966FF", // Purple
                    "#FF9F40", // Orange
                    "#C9CBDF", // Gray
                ],
                borderColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#4BC0C0",
                    "#9966FF",
                    "#FF9F40",
                    "#C9CBDF",
                ],
                borderWidth: 1,
            },
        ],
    }), [institutionTypeCounts]);

    // Aggregate enrollments by institution type
    const enrollmentByInstitutionType = useMemo(() => {
        return dashboardData.institutions.reduce((acc, institution) => {
            const type = institution.institution_type || "Unknown";
            const institutionPrograms = dashboardData.programs.filter(
                (program) => program.institution_id === institution.id
            );
            const totalEnrollment = institutionPrograms.reduce(
                (sum, program) => sum + (program.grand_total || 0),
                0
            );
            acc[type] = (acc[type] || 0) + totalEnrollment;
            return acc;
        }, {});
    }, [dashboardData.institutions, dashboardData.programs]);

    // Prepare data for the enrollment by institution type pie chart
    const enrollmentPieChartData = useMemo(() => ({
        labels: Object.keys(enrollmentByInstitutionType),
        datasets: [
            {
                label: "Enrollments by Institution Type",
                data: Object.values(enrollmentByInstitutionType),
                backgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#4BC0C0",
                    "#9966FF",
                    "#FF9F40",
                    "#C9CBDF",
                ],
                borderColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#4BC0C0",
                    "#9966FF",
                    "#FF9F40",
                    "#C9CBDF",
                ],
                borderWidth: 1,
            },
        ],
    }), [enrollmentByInstitutionType]);

    // Pie chart options (used for both charts)
    const pieChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
                labels: {
                    font: { size: 14, family: "'Inter', sans-serif" },
                    color: "#1F2937",
                },
            },
            tooltip: {
                backgroundColor: "#1F2937",
                titleFont: { size: 14, family: "'Inter', sans-serif" },
                bodyFont: { size: 12, family: "'Inter', sans-serif" },
                callbacks: {
                    label: (context) => {
                        const label = context.label || "";
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce(
                            (sum, val) => sum + val,
                            0
                        );
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${label}: ${value} (${percentage}%)`;
                    },
                },
            },
            datalabels: {
                color: "#fff",
                formatter: (value) => value,
                font: {
                    weight: "bold",
                    size: 14,
                    family: "'Inter', sans-serif",
                },
                anchor: "center",
                align: "center",
                textAlign: "center",
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

    if (dashboardData.loading) {
        return (
            <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", p: { xs: 2, md: 5 } }}>
                {/* Skeleton Header */}
                <Box sx={{ mb: 4, justifyContent: "flex-start", textAlign: "left", mt: 0 }}>
                    <motion.div
                        variants={skeletonVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <Skeleton
                            variant="text"
                            width="25%"
                            height={50}
                            sx={{ bgcolor: "grey.300" }}
                        />
                        <Skeleton
                            variant="text"
                            width="20%"
                            height={30}
                            sx={{ mt: 1, bgcolor: "grey.300" }}
                        />
                    </motion.div>
                </Box>

                {/* Skeleton Cards */}
                <Grid container spacing={2} sx={{ mb: 4 }}>
                    {[...Array(5)].map((_, index) => (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            lg={2.4}
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
                                <Paper
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        height: "100%",
                                        bgcolor: "grey.200",
                                    }}
                                >
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                        <Skeleton
                                            variant="circular"
                                            width={40}
                                            height={40}
                                            sx={{ mr: 1 }}
                                        />
                                        <Skeleton variant="text" width="40%" height={20} />
                                    </Box>
                                    <Skeleton variant="text" width="30%" height={40} sx={{ mb: 1 }} />
                                    <Skeleton variant="text" width="60%" height={20} />
                                </Paper>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>

                {/* Skeleton Charts */}
                <Grid container spacing={2}>
                    {[...Array(2)].map((_, index) => (
                        <Grid item xs={12} md={6} key={index}>
                            <motion.div
                                variants={skeletonVariants}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: index * 0.2 }}
                            >
                                <Paper
                                    sx={{
                                        p: 3,
                                        borderRadius: 2,
                                        height: 400,
                                        bgcolor: "grey.200",
                                    }}
                                >
                                    <Skeleton variant="text" width="50%" height={30} sx={{ mb: 2 }} />
                                    <Skeleton variant="rectangular" height={2} sx={{ mb: 2 }} />
                                    <Skeleton
                                        variant="circular"
                                        width={300}
                                        height={300}
                                        sx={{ mx: "auto" }}
                                    />
                                </Paper>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    }

    if (dashboardData.error) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                    bgcolor: "#f5f5f5",
                    p: 3,
                }}
            >
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Typography variant="h6" color="error" align="center">
                        {dashboardData.error}
                    </Typography>
                </motion.div>
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", p: { xs: 2, md: 5 } }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                            color: "#1976d2",
                            fontFamily: "'Inter', sans-serif",
                            fontSize: { xs: "1.5rem", sm: "2rem" },
                        }}
                    >
                        Administration Dashboard
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: "#6b7280",
                            mt: 0.5,
                            fontFamily: "'Inter', sans-serif",
                            fontSize: { xs: "0.875rem", sm: "1rem" },
                        }}
                    >
                        Overview of all system data and statistics
                    </Typography>
                </motion.div>
            </Box>

            {/* Overview Metrics Cards */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
                {[
                    {
                        label: "Users",
                        value: totalUsers,
                        color: { light: "#bbdefb", main: "#1976d2" },
                        Icon: FaUser,
                    },
                    {
                        label: "Faculty",
                        value: totalFaculty,
                        color: { light: "#c8e6c9", main: "#388e3c" },
                        Icon: FaUsers,
                    },
                    {
                        label: "Programs",
                        value: totalPrograms,
                        color: { light: "#ffecb3", main: "#f57c00" },
                        Icon: FaBook,
                    },
                    {
                        label: "Enrollments",
                        value: totalEnrollments.toLocaleString(),
                        color: { light: "#b3e5fc", main: "#0288d1" },
                        Icon: FaGraduationCap,
                    },
                    {
                        label: "Institutions",
                        value: totalInstitutions,
                        color: { light: "#e1bee7", main: "#7b1fa2" },
                        Icon: FaBuilding,
                    },
                ].map(({ label, value, color, Icon }, index) => (
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={2.4}
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
                                sx={{
                                    p: { xs: 1.5, sm: 2 },
                                    bgcolor: color.light,
                                    borderRadius: 2,
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                    transition: "all 0.3s ease",
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        mb: 1,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: { xs: 32, sm: 40 },
                                            height: { xs: 32, sm: 40 },
                                            bgcolor: color.main,
                                            color: "#fff",
                                            borderRadius: "50%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            mr: 1,
                                            fontSize: { xs: 16, sm: 20 },
                                        }}
                                    >
                                        <Icon />
                                    </Box>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 500,
                                            fontFamily: "'Inter', sans-serif",
                                            fontSize: { xs: "1rem", sm: "1.25rem" },
                                        }}
                                    >
                                        {label}
                                    </Typography>
                                </Box>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontWeight: 700,
                                        mb: 1,
                                        fontFamily: "'Inter', sans-serif",
                                        fontSize: { xs: "1.75rem", sm: "2.25rem" },
                                    }}
                                >
                                    {value}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        opacity: 0.8,
                                        fontFamily: "'Inter', sans-serif",
                                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                                    }}
                                >
                                    {label === "Users"
                                        ? "Registered system users"
                                        : label === "Faculty"
                                        ? "Registered faculty members"
                                        : label === "Programs"
                                        ? "Total academic programs"
                                        : label === "Enrollments"
                                        ? "Total student enrollments"
                                        : "Educational institutions"}
                                </Typography>
                            </Paper>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>

            {/* Pie Charts Section */}
            <Grid container spacing={2}>
                {/* Pie Chart for Institution Types */}
                <Grid item xs={12} md={6}>
                    <motion.div
                        variants={chartVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <Paper
                            sx={{
                                p: { xs: 2, sm: 3 },
                                borderRadius: 2,
                                border: "1px solid",
                                borderColor: "grey.200",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 500,
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: { xs: "1rem", sm: "1.125rem" },
                                    mb: 1,
                                }}
                            >
                                Institution Types Distribution
                            </Typography>
                            <Divider sx={{ mb: 2, bgcolor: "grey.200" }} />
                            {Object.keys(institutionTypeCounts).length > 0 ? (
                                <Box sx={{ maxWidth: { xs: 250, sm: 300 }, mx: "auto", flex: 1 }}>
                                    <Pie data={institutionPieChartData} options={pieChartOptions} />
                                </Box>
                            ) : (
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "#6b7280",
                                        textAlign: "center",
                                        flex: 1,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontFamily: "'Inter', sans-serif",
                                        fontSize: { xs: "0.875rem", sm: "1rem" },
                                    }}
                                >
                                    No institution type data available.
                                </Typography>
                            )}
                        </Paper>
                    </motion.div>
                </Grid>

                {/* Pie Chart for Enrollments by Institution Type */}
                <Grid item xs={12} md={6}>
                    <motion.div
                        variants={chartVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <Paper
                            sx={{
                                p: { xs: 2, sm: 3 },
                                borderRadius: 2,
                                border: "1px solid",
                                borderColor: "grey.200",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 500,
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: { xs: "1rem", sm: "1.125rem" },
                                    mb: 1,
                                }}
                            >
                                Enrollments by Institution Type
                            </Typography>
                            <Divider sx={{ mb: 2, bgcolor: "grey.200" }} />
                            {Object.keys(enrollmentByInstitutionType).length > 0 &&
                            Object.values(enrollmentByInstitutionType).some((value) => value > 0) ? (
                                <Box sx={{ maxWidth: { xs: 250, sm: 300 }, mx: "auto", flex: 1 }}>
                                    <Pie data={enrollmentPieChartData} options={pieChartOptions} />
                                </Box>
                            ) : (
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "#6b7280",
                                        textAlign: "center",
                                        flex: 1,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontFamily: "'Inter', sans-serif",
                                        fontSize: { xs: "0.875rem", sm: "1rem" },
                                    }}
                                >
                                    No enrollment data available for institution types.
                                </Typography>
                            )}
                        </Paper>
                    </motion.div>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
