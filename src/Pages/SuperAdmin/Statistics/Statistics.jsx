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
                console.log("programs.data", programs.data);
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

    // Chart Data
    const genderPieData = {
        labels: ["Male Students", "Female Students"],
        datasets: [
            {
                data: [genderBreakdown.male, genderBreakdown.female],
                backgroundColor: ["#36A2EB", "#FF6384"],
                borderColor: ["#36A2EB", "#FF6384"],
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
                backgroundColor: ["#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
                borderColor: ["#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
                borderWidth: 1,
            },
        ],
    };

    const enrollmentDoughnutData = {
        labels: ["Enrollments", "Graduates"],
        datasets: [
            {
                data: [totalEnrollments, totalGraduates],
                backgroundColor: ["#E91E63", "#C9CBDF"],
                borderColor: ["#E91E63", "#C9CBDF"],
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
                borderColor: "#36A2EB",
                tension: 0.1,
            },
        ],
    };

    // Chart Options with smaller font sizes
    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false, // Allows custom height
        plugins: {
            legend: {
                position: "top",
                labels: { font: { size: 10 } },
            },
            tooltip: {
                bodyFont: { size: 10 },
                callbacks: {
                    label: (context) =>
                        `${context.label}: ${context.raw.toLocaleString()}`,
                },
            },
        },
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                bodyFont: { size: 10 },
                callbacks: {
                    label: (context) => `${context.label}: ${context.raw}`,
                },
            },
        },
        scales: {
            y: { beginAtZero: true, ticks: { font: { size: 10 } } },
            x: { ticks: { font: { size: 10 } } },
        },
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top",
                labels: { font: { size: 10 } },
            },
            tooltip: {
                bodyFont: { size: 10 },
                callbacks: {
                    label: (context) =>
                        `${context.label}: ${context.raw.toLocaleString()}`,
                },
            },
        },
    };

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top",
                labels: { font: { size: 10 } },
            },
            tooltip: {
                bodyFont: { size: 10 },
                callbacks: {
                    label: (context) =>
                        `${
                            context.dataset.label
                        }: ${context.raw.toLocaleString()}`,
                },
            },
        },
        scales: {
            y: { beginAtZero: true, ticks: { font: { size: 10 } } },
            x: { ticks: { font: { size: 10 } } },
        },
    };

    if (stats.loading) return <Typography>Loading...</Typography>;
    if (stats.error)
        return <Typography color="error">{stats.error}</Typography>;

    return (
        <Box p={3}>
            <Typography variant="h5" gutterBottom>
                Statistics Overview
            </Typography>
            <Grid container spacing={2}>
                {/* Summary Cards */}
                {[
                    { label: "Total Users", value: totalUsers },
                    { label: "Total Faculty", value: totalFaculty },
                    { label: "Total Programs", value: totalPrograms },
                    { label: "Total Institutions", value: totalInstitutions },
                    {
                        label: "Total Enrollments",
                        value: totalEnrollments.toLocaleString(),
                    },
                    {
                        label: "Total Graduates",
                        value: totalGraduates.toLocaleString(),
                    },
                    {
                        label: "Avg Faculty Workload",
                        value: `${avgFacultyWorkload} units`,
                    },
                ].map((stat, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6">{stat.value}</Typography>
                            <Typography variant="body2">
                                {stat.label}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}

                {/* Smaller Charts */}
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 1, height: 200 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            Gender Breakdown
                        </Typography>
                        <Divider sx={{ mb: 1 }} />
                        <Pie data={genderPieData} options={pieOptions} />
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 1, height: 200 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            Totals by Category
                        </Typography>
                        <Divider sx={{ mb: 1 }} />
                        <Bar data={totalsBarData} options={barOptions} />
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 1, height: 200 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            Enrollments vs Graduates
                        </Typography>
                        <Divider sx={{ mb: 1 }} />
                        <Doughnut
                            data={enrollmentDoughnutData}
                            options={doughnutOptions}
                        />
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 1, height: 200 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            Enrollments by Year
                        </Typography>
                        <Divider sx={{ mb: 1 }} />
                        <Line data={enrollmentLineData} options={lineOptions} />
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Statistics;
