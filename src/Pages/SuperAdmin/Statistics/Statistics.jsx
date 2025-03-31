import { useState, useEffect } from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import axios from "axios";

const Statistics = () => {
    const [stats, setStats] = useState({
        users: [],
        facultyProfiles: [],
        programs: [],
        institutions: [],
        enrollments: [],
        programStats: [],
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
                const [
                    users,
                    faculty,
                    programs,
                    institutions,
                    enrollments,
                    programStats,
                ] = await Promise.all([
                    axios.get("http://localhost:8000/api/users", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get("http://localhost:8000/api/faculty-profiles", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get("http://localhost:8000/api/programs", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get("http://localhost:8000/api/institutions", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get("http://localhost:8000/api/enrollments", {
                        headers: { Authorization: `Bearer ${token}` },
                    }), // Assuming an endpoint exists
                    axios.get("http://localhost:8000/api/program-statistics", {
                        headers: { Authorization: `Bearer ${token}` },
                    }), // Assuming an endpoint exists
                ]);
                setStats({
                    users: users.data,
                    facultyProfiles: faculty.data,
                    programs: programs.data,
                    institutions: institutions.data,
                    enrollments: enrollments.data,
                    programStats: programStats.data,
                    loading: false,
                });
            } catch (error) {
                setStats((prev) => ({
                    ...prev,
                    error: "Failed to load statistics" + error,
                    loading: false,
                }));
            }
        };

        fetchStats();
    }, []);

    // Aggregate statistics
    const totalUsers = stats.users.length;
    const totalFaculty = stats.facultyProfiles.length;
    const totalPrograms = stats.programs.length;
    const totalInstitutions = stats.institutions.length;
    const totalEnrollments = stats.enrollments.reduce(
        (sum, e) => sum + (e.grand_total || 0),
        0
    );
    const totalGraduates = stats.programStats.reduce(
        (sum, s) => sum + (s.graduates_total || 0),
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
    const genderBreakdown = stats.enrollments.reduce(
        (acc, e) => ({
            male: acc.male + (e.subtotal_male || 0),
            female: acc.female + (e.subtotal_female || 0),
        }),
        { male: 0, female: 0 }
    );

    if (stats.loading) return <Typography>Loading...</Typography>;
    if (stats.error)
        return <Typography color="error">{stats.error}</Typography>;

    return (
        <Box p={3}>
            <Typography variant="h5" gutterBottom>
                Statistics Overview
            </Typography>
            <Grid container spacing={2}>
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
                    {
                        label: "Male Students",
                        value: genderBreakdown.male.toLocaleString(),
                    },
                    {
                        label: "Female Students",
                        value: genderBreakdown.female.toLocaleString(),
                    },
                ].map((stat, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6">{stat.value}</Typography>
                            <Typography variant="body2">
                                {stat.label}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Statistics;
