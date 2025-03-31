import { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Grid,
    Avatar,
    Paper,
    Divider,
    Skeleton,
} from "@mui/material";
import axios from "axios";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import SchoolIcon from "@mui/icons-material/School";
import BusinessIcon from "@mui/icons-material/Business";
// Import Chart.js and react-chartjs-2 components
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
// Import chartjs-plugin-datalabels
import ChartDataLabels from "chartjs-plugin-datalabels";

// Register Chart.js components and the datalabels plugin
ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    ChartDataLabels // Register the datalabels plugin
);

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        users: [],
        facultyProfiles: [],
        programs: [],
        institutions: [],
        campuses: [],
        loading: true,
        error: null,
    });

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setDashboardData((prev) => ({
                ...prev,
                error: "Authentication token is missing.",
                loading: false,
            }));
            return;
        }

        const fetchDashboardData = async () => {
            try {
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
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                setDashboardData((prev) => ({
                    ...prev,
                    error: "Failed to load dashboard data. Please try again.",
                    loading: false,
                }));
            }
        };

        fetchDashboardData();
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
    const institutionTypeCounts = dashboardData.institutions.reduce(
        (acc, institution) => {
            const type = institution.institution_type || "Unknown";
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        },
        {}
    );

    // Prepare data for the institution types pie chart
    const institutionPieChartData = {
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
    };

    // Aggregate enrollments by institution type
    const enrollmentByInstitutionType = dashboardData.institutions.reduce(
        (acc, institution) => {
            const type = institution.institution_type || "Unknown";
            // Find all programs for this institution
            const institutionPrograms = dashboardData.programs.filter(
                (program) => program.institution_id === institution.id
            );
            // Sum the enrollments for these programs
            const enrollmentTotal = institutionPrograms.reduce(
                (sum, program) => {
                    return (
                        sum +
                        (program.enrollments?.reduce(
                            (subSum, enrollment) =>
                                subSum + (enrollment.grand_total || 0),
                            0
                        ) || 0)
                    );
                },
                0
            );
            acc[type] = (acc[type] || 0) + enrollmentTotal;
            return acc;
        },
        {}
    );

    // Prepare data for the enrollment by institution type pie chart
    const enrollmentPieChartData = {
        labels: Object.keys(enrollmentByInstitutionType),
        datasets: [
            {
                label: "Enrollments by Institution Type",
                data: Object.values(enrollmentByInstitutionType),
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
    };

    // Pie chart options (used for both charts)
    const pieChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            tooltip: {
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
                color: "#fff", // White text for better contrast on colored segments
                formatter: (value) => {
                    return value; // Display the raw value
                },
                font: {
                    weight: "bold",
                    size: 14,
                },
                anchor: "center", // Position the label in the center of the segment
                align: "center", // Align the label in the center
                textAlign: "center",
            },
        },
    };

    // Skeleton Loader Component
    const DashboardSkeleton = () => (
        <Box sx={{ my: 5, p: 4, height: "100vh", overflowY: "auto" }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Box>
                    <Skeleton
                        variant="text"
                        width={300}
                        height={40}
                        sx={{ mb: 1 }}
                    />
                    <Skeleton variant="text" width={200} height={20} />
                </Box>
            </Box>

            {/* Overview Metrics Cards Skeleton */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {Array.from({ length: 5 }).map((_, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 2,
                                height: "100%",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    mb: 2,
                                }}
                            >
                                <Skeleton
                                    variant="circular"
                                    width={40}
                                    height={40}
                                    sx={{ mr: 1 }}
                                />
                                <Skeleton variant="text" width={80} />
                            </Box>
                            <Skeleton variant="text" width={60} height={40} />
                            <Skeleton variant="text" width={120} height={20} />
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Pie Charts Skeleton (Side by Side) */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 2,
                            border: 1,
                            borderColor: "divider",
                            height: "100%",
                        }}
                    >
                        <Skeleton
                            variant="text"
                            width={200}
                            height={30}
                            sx={{ mb: 2 }}
                        />
                        <Divider sx={{ mb: 3 }} />
                        <Box sx={{ maxWidth: 400, mx: "auto" }}>
                            <Skeleton
                                variant="circular"
                                width={300}
                                height={300}
                            />
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 2,
                            border: 1,
                            borderColor: "divider",
                            height: "100%",
                        }}
                    >
                        <Skeleton
                            variant="text"
                            width={200}
                            height={30}
                            sx={{ mb: 2 }}
                        />
                        <Divider sx={{ mb: 3 }} />
                        <Box sx={{ maxWidth: 400, mx: "auto" }}>
                            <Skeleton
                                variant="circular"
                                width={300}
                                height={300}
                            />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );

    if (dashboardData.loading) {
        return <DashboardSkeleton />;
    }

    if (dashboardData.error) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography color="error">{dashboardData.error}</Typography>
            </Box>
        );
    }

    return (
        <Box
            p={5}
            sx={{
                height: "100vh",
                overflowY: "auto",
                "&::-webkit-scrollbar": {
                    width: "8px",
                },
                "&::-webkit-scrollbar-track": {
                    background: "#f1f1f1",
                },
                "&::-webkit-scrollbar-thumb": {
                    background: "#888",
                    borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                    background: "#555",
                },
            }}
        >
            <Box>
                {/* Header with refresh action */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 4,
                    }}
                >
                    <Box>
                        <Typography
                            variant="h4"
                            fontWeight="bold"
                            color="primary"
                        >
                            Administration Dashboard
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            Overview of all system data and statistics
                        </Typography>
                    </Box>
                </Box>
                <Grid container spacing={2} sx={{ mb: 4 }}>
                    {[
                        {
                            label: "Users",
                            value: totalUsers,
                            color: "primary",
                            Icon: PersonIcon,
                        },
                        {
                            label: "Faculty",
                            value: totalFaculty,
                            color: "success",
                            Icon: PeopleIcon,
                        },
                        {
                            label: "Programs",
                            value: totalPrograms,
                            color: "warning",
                            Icon: LibraryBooksIcon,
                        },
                        {
                            label: "Enrollments",
                            value: totalEnrollments.toLocaleString(),
                            color: "info",
                            Icon: SchoolIcon,
                        },
                        {
                            label: "Institutions",
                            value: totalInstitutions,
                            color: "secondary",
                            Icon: BusinessIcon,
                        },
                    ].map(({ label, value, color, Icon }, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
                            <Paper
                                sx={{
                                    p: 2,
                                    bgcolor: `${color}.light`,
                                    color: `${color}.contrastText`,
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        mb: 1,
                                    }}
                                >
                                    <Avatar
                                        sx={{ bgcolor: `${color}.main`, mr: 1 }}
                                    >
                                        <Icon />
                                    </Avatar>
                                    <Typography variant="h6">
                                        {label}
                                    </Typography>
                                </Box>
                                <Typography variant="h3" fontWeight="bold">
                                    {value}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ mt: 1, opacity: 0.8 }}
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
                        </Grid>
                    ))}
                </Grid>

                {/* Pie Charts Section (Side by Side) */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {/* Pie Chart for Institution Types */}
                    <Grid item xs={12} md={6}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 2,
                                border: 1,
                                borderColor: "divider",
                                height: "100%",
                            }}
                        >
                            <Typography variant="h5" fontWeight="medium" mb={2}>
                                Institution Types Distribution
                            </Typography>
                            <Divider sx={{ mb: 3 }} />
                            {Object.keys(institutionTypeCounts).length > 0 ? (
                                <Box sx={{ maxWidth: 400, mx: "auto" }}>
                                    <Pie
                                        data={institutionPieChartData}
                                        options={pieChartOptions}
                                    />
                                </Box>
                            ) : (
                                <Typography
                                    color="text.secondary"
                                    textAlign="center"
                                >
                                    No institution type data available.
                                </Typography>
                            )}
                        </Paper>
                    </Grid>

                    {/* Pie Chart for Enrollments by Institution Type */}
                    <Grid item xs={12} md={6}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 2,
                                border: 1,
                                borderColor: "divider",
                                height: "100%",
                            }}
                        >
                            <Typography variant="h5" fontWeight="medium" mb={2}>
                                Enrollments by Institution Type
                            </Typography>
                            <Divider sx={{ mb: 3 }} />
                            {Object.keys(enrollmentByInstitutionType).length >
                                0 &&
                            Object.values(enrollmentByInstitutionType).some(
                                (value) => value > 0
                            ) ? (
                                <Box sx={{ maxWidth: 400, mx: "auto" }}>
                                    <Pie
                                        data={enrollmentPieChartData}
                                        options={pieChartOptions}
                                    />
                                </Box>
                            ) : (
                                <Typography
                                    color="text.secondary"
                                    textAlign="center"
                                >
                                    No enrollment data available for institution
                                    types.
                                </Typography>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default Dashboard;
