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
    Users,
    GraduationCap,
    BookOpen,
    Building2,
    BarChart2,
    TrendingUp,
} from "lucide-react";
import config from "../../../utils/config";

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

    // Chart colors
    const chartColors = {
        primary: "#3b82f6",
        secondary: "#ec4899",
        success: "#22c55e",
        warning: "#f59e0b",
        info: "#06b6d4",
        error: "#ef4444",
        grey: "#6b7280",
        purple: "#8b5cf6",
    };

    // Pie chart data configurations
    const genderPieData = {
        labels: ["Male Students", "Female Students"],
        datasets: [
            {
                data: [genderBreakdown.male, genderBreakdown.female],
                backgroundColor: [chartColors.primary, chartColors.secondary],
                borderColor: ["#ffffff", "#ffffff"],
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
                borderColor: Array(4).fill("#ffffff"),
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
                borderColor: ["#ffffff", "#ffffff"],
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
                ).fill("#ffffff"),
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
                        family: "Inter, sans-serif",
                    },
                    usePointStyle: true,
                    padding: 15,
                    color: "#1f2937",
                },
            },
            tooltip: {
                enabled: true,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                titleColor: "#1f2937",
                bodyColor: "#4b5563",
                titleFont: {
                    size: 13,
                    family: "Inter, sans-serif",
                    weight: "600",
                },
                bodyFont: {
                    size: 12,
                    family: "Inter, sans-serif",
                },
                padding: 12,
                cornerRadius: 8,
                displayColors: true,
                borderColor: "#e5e7eb",
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
            scale: 1.03,
            boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
            transition: { duration: 0.2 },
        },
    };

    const statCards = [
        {
            label: "Total Users",
            value: totalUsers,
            icon: <Users className="w-6 h-6" />,
            color: "text-amber-600",
            bgColor: "bg-amber-100",
        },
        {
            label: "Total Faculty",
            value: totalFaculty,
            icon: <GraduationCap className="w-6 h-6" />,
            color: "text-green-600",
            bgColor: "bg-green-100",
        },
        {
            label: "Total Programs",
            value: totalPrograms,
            icon: <BookOpen className="w-6 h-6" />,
            color: "text-pink-600",
            bgColor: "bg-pink-100",
        },
        {
            label: "Total Institutions",
            value: totalInstitutions,
            icon: <Building2 className="w-6 h-6" />,
            color: "text-gray-600",
            bgColor: "bg-gray-100",
        },
        {
            label: "Total Enrollments",
            value: totalEnrollments.toLocaleString(),
            icon: <Users className="w-6 h-6" />,
            color: "text-blue-600",
            bgColor: "bg-blue-100",
        },
        {
            label: "Total Graduates",
            value: totalGraduates.toLocaleString(),
            icon: <GraduationCap className="w-6 h-6" />,
            color: "text-red-600",
            bgColor: "bg-red-100",
        },
    ];

    const chartCards = [
        {
            title: "Gender Breakdown",
            description: "Distribution of male and female students",
            ChartComponent: Pie,
            data: genderPieData,
            options: chartOptions,
            icon: <BarChart2 className="w-5 h-5" />,
        },
        {
            title: "Totals by Category",
            description:
                "Comparison of users, faculty, programs, and institutions",
            ChartComponent: Pie,
            data: totalsPieData,
            options: chartOptions,
            icon: <BarChart2 className="w-5 h-5" />,
        },
        {
            title: "Enrollments vs Graduates",
            description: "Comparison of total enrollments and graduates",
            ChartComponent: Pie,
            data: enrollmentPieData,
            options: chartOptions,
            icon: <BarChart2 className="w-5 h-5" />,
        },
        {
            title: "Enrollments by Year",
            description:
                "Distribution of students across different year levels",
            ChartComponent: Pie,
            data: yearLevelPieData,
            options: chartOptions,
            icon: <BarChart2 className="w-5 h-5" />,
        },
    ];

    if (stats.loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-6">
                        <div className="h-10 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="h-6 w-96 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="h-32 bg-gray-200 rounded-lg animate-pulse"
                            ></div>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                className="h-80 bg-gray-200 rounded-lg animate-pulse"
                            ></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (stats.error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
                        <h2 className="text-lg font-semibold text-red-700">
                            Error
                        </h2>
                        <p className="text-red-600">{stats.error}</p>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Statistics Dashboard
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Comprehensive insights into educational data and
                            metrics
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            Last updated: Today
                        </span>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {statCards.map((stat, index) => (
                        <motion.div
                            key={index}
                            custom={index}
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            whileHover="hover"
                            className="bg-white rounded-lg shadow-sm overflow-hidden"
                        >
                            <div className="p-4 flex items-center justify-between">
                                <div
                                    className={`p-3 rounded-full ${stat.bgColor} ${stat.color}`}
                                >
                                    {stat.icon}
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500 uppercase tracking-wide">
                                        {stat.label}
                                    </p>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {stat.value}
                                    </h2>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {chartCards.map((chart, index) => (
                        <motion.div
                            key={index}
                            custom={index + 6}
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            whileHover="hover"
                            className="bg-white rounded-lg shadow-sm overflow-hidden"
                        >
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        {chart.title}
                                    </h2>
                                    <div className="p-2 bg-gray-100 rounded-full text-gray-600">
                                        {chart.icon}
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-4">
                                    {chart.description}
                                </p>
                                <hr className="border-gray-200 mb-4" />
                                <div className="h-60 relative">
                                    <chart.ChartComponent
                                        data={chart.data}
                                        options={chart.options}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
