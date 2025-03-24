import { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Grid,
    Button,
    Avatar,
    Chip,
    Paper,
    Divider,
    Skeleton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
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
    const navigate = useNavigate();

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

            {/* Institutions Section Skeleton */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    borderRadius: 2,
                    border: 1,
                    borderColor: "divider",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        my: 5,
                    }}
                >
                    <Skeleton variant="text" width={150} height={30} />
                    <Skeleton variant="rectangular" width={120} height={36} />
                </Box>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                    {Array.from({ length: 3 }).map((_, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2,
                                    height: "100%",
                                    borderRadius: 2,
                                    border: 1,
                                    borderColor: "divider",
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Box>
                                        <Skeleton
                                            variant="text"
                                            width={150}
                                            height={30}
                                            sx={{ mb: 1 }}
                                        />
                                        <Skeleton
                                            variant="rectangular"
                                            width={80}
                                            height={24}
                                            sx={{ mb: 1 }}
                                        />
                                    </Box>
                                    <Skeleton
                                        variant="circular"
                                        width={40}
                                        height={40}
                                    />
                                </Box>
                                <Skeleton
                                    variant="text"
                                    width="80%"
                                    height={20}
                                    sx={{ mb: 2 }}
                                />
                                <Skeleton
                                    variant="rectangular"
                                    width="100%"
                                    height={36}
                                />
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Paper>
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
            mt={5}
            sx={{
                height: "87vh", // Set height to viewport height
                overflowY: "auto", // Enable vertical scrolling
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
                {/* Overview Metrics Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={4} lg={2.4}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 2,
                                bgcolor: "primary.light",
                                color: "primary.contrastText",
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
                                <Avatar sx={{ bgcolor: "primary.main", mr: 1 }}>
                                    <PersonIcon />
                                </Avatar>
                                <Typography variant="h6">Users</Typography>
                            </Box>
                            <Typography variant="h3" fontWeight="bold">
                                {totalUsers}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ mt: 1, opacity: 0.8 }}
                            >
                                Registered system users
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={2.4}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 2,
                                bgcolor: "success.light",
                                color: "success.contrastText",
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
                                <Avatar sx={{ bgcolor: "success.main", mr: 1 }}>
                                    <PeopleIcon />
                                </Avatar>
                                <Typography variant="h6">Faculty</Typography>
                            </Box>
                            <Typography variant="h3" fontWeight="bold">
                                {totalFaculty}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ mt: 1, opacity: 0.8 }}
                            >
                                Registered faculty members
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={2.4}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 2,
                                bgcolor: "warning.light",
                                color: "warning.contrastText",
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
                                <Avatar sx={{ bgcolor: "warning.main", mr: 1 }}>
                                    <LibraryBooksIcon />
                                </Avatar>
                                <Typography variant="h6">Programs</Typography>
                            </Box>
                            <Typography variant="h3" fontWeight="bold">
                                {totalPrograms}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ mt: 1, opacity: 0.8 }}
                            >
                                Total academic programs
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={2.4}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 2,
                                bgcolor: "info.light",
                                color: "info.contrastText",
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
                                <Avatar sx={{ bgcolor: "info.main", mr: 1 }}>
                                    <SchoolIcon />
                                </Avatar>
                                <Typography variant="h6">
                                    Enrollments
                                </Typography>
                            </Box>
                            <Typography variant="h3" fontWeight="bold">
                                {totalEnrollments.toLocaleString()}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ mt: 1, opacity: 0.8 }}
                            >
                                Total student enrollments
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={2.4}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 2,
                                bgcolor: "secondary.light",
                                color: "secondary.contrastText",
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
                                <Avatar
                                    sx={{ bgcolor: "secondary.main", mr: 1 }}
                                >
                                    <BusinessIcon />
                                </Avatar>
                                <Typography variant="h6">
                                    Institutions
                                </Typography>
                            </Box>
                            <Typography variant="h3" fontWeight="bold">
                                {totalInstitutions}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ mt: 1, opacity: 0.8 }}
                            >
                                Educational institutions
                            </Typography>
                        </Paper>
                    </Grid>
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

                {/* Institutions Section */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        borderRadius: 2,
                        border: 1,
                        borderColor: "divider",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2,
                        }}
                    >
                        <Typography variant="h5" fontWeight="medium">
                            Institutions
                        </Typography>
                        <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            onClick={() => navigate("/admin/institutions")}
                        >
                            Manage Institutions
                        </Button>
                    </Box>
                    <Divider sx={{ mb: 3 }} />
                    <Grid container spacing={3}>
                        {dashboardData.institutions.map((institution) => (
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                                key={institution.id}
                            >
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2,
                                        height: "100%",
                                        borderRadius: 2,
                                        border: 1,
                                        borderColor: "divider",
                                        transition: "all 0.3s",
                                        "&:hover": {
                                            boxShadow: 3,
                                            borderColor: "primary.main",
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Box>
                                            <Typography
                                                variant="h6"
                                                fontWeight="medium"
                                                gutterBottom
                                            >
                                                {institution.name}
                                            </Typography>
                                            <Chip
                                                label={institution.region}
                                                size="small"
                                                sx={{ mb: 1 }}
                                                color="primary"
                                                variant="outlined"
                                            />
                                        </Box>
                                        <Avatar
                                            sx={{
                                                bgcolor: "primary.light",
                                                color: "primary.main",
                                            }}
                                        >
                                            {institution.name.charAt(0)}
                                        </Avatar>
                                    </Box>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mb: 2 }}
                                    >
                                        {institution.address_street},{" "}
                                        {institution.municipality_city},{" "}
                                        {institution.province}
                                    </Typography>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        color="primary"
                                        size="small"
                                        onClick={() =>
                                            navigate(
                                                `/admin/institutions/${institution.id}`
                                            )
                                        }
                                    >
                                        View Details
                                    </Button>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            </Box>
        </Box>
    );
};

export default Dashboard;
