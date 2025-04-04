import { useState, useEffect } from "react";
import { Box, Typography, Grid, Paper, Divider } from "@mui/material";
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
    const avgFacultyWorkload = stats.facultyProfiles.length
        ? (
              stats.facultyProfiles.reduce(
                  (sum, f) => sum + (f.total_work_load || 0),
                  0
              ) / stats.facultyProfiles.length
          ).toFixed(2)
        : 0;
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

    // Chart Data with a cohesive color scheme
    const chartColors = {
        blue: "#2196F3",
        pink: "#F06292",
        teal: "#26A69A",
        purple: "#AB47BC",
        orange: "#FF9800",
        grey: "#B0BEC5",
    };

    const genderPieData = {
        labels: ["Male Students", "Female Students"],
        datasets: [
            {
                data: [genderBreakdown.male, genderBreakdown.female],
                backgroundColor: [chartColors.blue, chartColors.pink],
                borderColor: [chartColors.blue, chartColors.pink],
                borderWidth: 1,
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
                backgroundColor: [
                    chartColors.orange,
                    chartColors.teal,
                    chartColors.purple,
                    chartColors.grey,
                ],
                borderColor: [
                    chartColors.orange,
                    chartColors.teal,
                    chartColors.purple,
                    chartColors.grey,
                ],
                borderWidth: 1,
            },
        ],
    };

    const enrollmentDoughnutData = {
        labels: ["Enrollments", "Graduates"],
        datasets: [
            {
                data: [totalEnrollments, totalGraduates],
                backgroundColor: [chartColors.blue, chartColors.grey],
                borderColor: [chartColors.blue, chartColors.grey],
                borderWidth: 1,
            },
        ],
    };

    const enrollmentLineData = {
        labels: Object.keys(enrollmentByYearLevel),
        datasets: [
            {
                label: "Enrollments by Year",
                data: Object.values(enrollmentByYearLevel),
                fill: false,
                borderColor: chartColors.teal,
                backgroundColor: chartColors.teal,
                tension: 0.3,
            },
        ],
    };

    // Chart Options with improved styling
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top",
                labels: { font: { size: 12, weight: "bold" }, color: "#333" },
            },
            tooltip: {
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                titleFont: { size: 12 },
                bodyFont: { size: 12 },
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
                ticks: { font: { size: 12 }, color: "#666" },
            },
            x: { ticks: { font: { size: 12 }, color: "#666" } },
        },
    };

    const lineOptions = {
        ...chartOptions,
        scales: {
            y: {
                beginAtZero: true,
                ticks: { font: { size: 12 }, color: "#666" },
            },
            x: { ticks: { font: { size: 12 }, color: "#666" } },
        },
    };

    if (stats.loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="50vh"
            >
                <Typography variant="h6" color="textSecondary">
                    Loading...
                </Typography>
            </Box>
        );
    }
    if (stats.error) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="50vh"
            >
                <Typography variant="h6" color="error">
                    {stats.error}
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{ p: { xs: 2, md: 4 }, bgcolor: "#f5f5f5", minHeight: "100vh" }}
        >
            <Typography
                variant="h4"
                gutterBottom
                sx={{ fontWeight: "bold", color: "#333", mb: 4 }}
            >
                Statistics Dashboard
            </Typography>

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
                        color: chartColors.blue,
                    },
                    {
                        label: "Total Graduates",
                        value: totalGraduates.toLocaleString(),
                        color: chartColors.pink,
                    },
                    {
                        label: "Avg Faculty Workload",
                        value: `${avgFacultyWorkload} units`,
                        color: chartColors.purple,
                    },
                ].map((stat, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 3,
                                borderRadius: 2,
                                bgcolor: "#fff",
                                transition: "transform 0.2s, box-shadow 0.2s",
                                "&:hover": {
                                    transform: "translateY(-4px)",
                                    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                                },
                            }}
                        >
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: "bold",
                                    color: stat.color,
                                    mb: 1,
                                }}
                            >
                                {stat.value}
                            </Typography>
                            <Typography variant="body1" sx={{ color: "#666" }}>
                                {stat.label}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}

                {/* Charts */}
                <Grid item xs={12} sm={6} md={6} lg={3}>
                    <Paper
                        elevation={2}
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: "#fff",
                            height: 300,
                        }}
                    >
                        <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: "bold", color: "#333", mb: 1 }}
                        >
                            Gender Breakdown
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Pie data={genderPieData} options={chartOptions} />
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={6} lg={3}>
                    <Paper
                        elevation={2}
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: "#fff",
                            height: 300,
                        }}
                    >
                        <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: "bold", color: "#333", mb: 1 }}
                        >
                            Totals by Category
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Bar data={totalsBarData} options={barOptions} />
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={6} lg={3}>
                    <Paper
                        elevation={2}
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: "#fff",
                            height: 300,
                        }}
                    >
                        <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: "bold", color: "#333", mb: 1 }}
                        >
                            Enrollments vs Graduates
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Doughnut
                            data={enrollmentDoughnutData}
                            options={chartOptions}
                        />
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={6} lg={3}>
                    <Paper
                        elevation={2}
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: "#fff",
                            height: 300,
                        }}
                    >
                        <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: "bold", color: "#333", mb: 1 }}
                        >
                            Enrollments by Year
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Line data={enrollmentLineData} options={lineOptions} />
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Statistics;
