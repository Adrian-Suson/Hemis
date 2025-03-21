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
    Container, // Added Container import
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PersonIcon from "@mui/icons-material/Person"; // Added PersonIcon import
import PeopleIcon from "@mui/icons-material/People"; // Added PeopleIcon import
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks"; // Added LibraryBooksIcon import
import SchoolIcon from "@mui/icons-material/School"; // Added SchoolIcon import
import BusinessIcon from "@mui/icons-material/Business"; // Added BusinessIcon import

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
        const institutionId = localStorage.getItem("institutionId");

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
                    axios.get(
                        `http://localhost:8000/api/faculty-profiles?institution_id=${institutionId}`,
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
    }, []
);

    if (dashboardData.loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Typography variant="h6">Loading dashboard data...</Typography>
            </Box>
        );
    }

    if (dashboardData.error) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography color="error">{dashboardData.error}</Typography>
            </Box>
        );
    }

    // Calculate some overview metrics
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

    return (
        <Container maxWidth="xl">
            <Box sx={{ py: 4 }}>
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
        </Container>
    );
};

export default Dashboard;
