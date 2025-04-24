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

    const chartColors = {
        primary: "#3B82F6",
        secondary: "#EC4899",
        teal: "#14B8A6",
        purple: "#8B5CF6",
        orange: "#F59E0B",
        grey: "#6B7280",
    };

    // Pie chart data configurations
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
                    chartColors.teal,
                    chartColors.orange,
                    chartColors.purple,
                    chartColors.grey,
                ],
                borderColor: ["#fff", "#fff", "#fff", "#fff"],
                borderWidth: 2,
            },
        ],
    };

    const enrollmentPieData = {
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

    const yearLevelPieData = {
        labels: Object.keys(enrollmentByYearLevel),
        datasets: [
            {
                data: Object.values(enrollmentByYearLevel),
                backgroundColor: [
                    chartColors.primary,
                    chartColors.secondary,
                    chartColors.teal,
                    chartColors.purple,
                    chartColors.orange,
                    chartColors.grey,
                    "#10B981", // emerald-500 for 6th Year
                    "#EF4444", // red-500 for 7th Year
                ].slice(0, Object.keys(enrollmentByYearLevel).length),
                borderColor: Array(
                    Object.keys(enrollmentByYearLevel).length
                ).fill("#fff"),
                borderWidth: 2,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: "top",
            },
            tooltip: {
                enabled: true,
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
        hover: { scale: 1.03, boxShadow: "0 12px 24px rgba(0,0,0,0.15)" },
    };

    if (stats.loading) {
        return (
            <div className="bg-gray-100 overflow-y-auto h-[90vh] w-full max-w-full p-2 sm:p-4 box-border">
                <div className="p-2 sm:p-4 bg-gradient-to-r from-primary to-purple-500 text-white text-center shadow-lg mb-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="w-2/5 h-10 sm:h-16 mx-auto bg-white/20"></div>
                        <div className="w-1/5 h-5 sm:h-8 mx-auto bg-white/20 mt-2"></div>
                    </motion.div>
                </div>
                <div
                    className="p-2 sm:p-4

"
                >
                    <div className="flex flex-wrap justify-around">
                        {[...Array(6)].map((_, index) => (
                            <motion.div
                                key={index}
                                className="flex-1 m-2 min-w-[100%] sm:min-w-[12rem]"
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                whileHover="hover"
                            >
                                <div className="h-24 sm:h-32 bg-gray-200 rounded-lg"></div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (stats.error) {
        return (
            <div className="bg-gray-100 flex justify-center items-center h-[90vh]">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h5 className="text-red-500 text-lg sm:text-2xl">
                        {stats.error}
                    </h5>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 overflow-y-auto h-[90vh] w-full max-w-full p-2 sm:p-4 box-border">
            <div className="p-2 sm:p-4 bg-gradient-to-r from-primary to-purple-500 text-white text-center shadow-lg mb-4 sm:hidden">
                <h1 className="font-bold text-sm sm:text-2xl mb-2">
                    Statistics Dashboard
                </h1>
                <p className="text-xs sm:text-base opacity-90">
                    Insights into Users, Faculty, Programs, and More
                </p>
            </div>
            <div className="p-2 sm:p-4">
                <div className="flex flex-wrap justify-around">
                    {[
                        {
                            label: "Total Users",
                            value: totalUsers,
                            color: "text-orange",
                        },
                        {
                            label: "Total Faculty",
                            value: totalFaculty,
                            color: "text-teal",
                        },
                        {
                            label: "Total Programs",
                            value: totalPrograms,
                            color: "text-purple",
                        },
                        {
                            label: "Total Institutions",
                            value: totalInstitutions,
                            color: "text-grey",
                        },
                        {
                            label: "Total Enrollments",
                            value: totalEnrollments.toLocaleString(),
                            color: "text-primary",
                        },
                        {
                            label: "Total Graduates",
                            value: totalGraduates.toLocaleString(),
                            color: "text-secondary",
                        },
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            className="bg-white border border-gray-200/20 rounded-lg p-2 sm:p-4 m-2 flex-1 min-w-[100%] sm:min-w-[12rem] flex flex-col justify-between"
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            whileHover="hover"
                        >
                            <h4
                                className={`font-bold ${stat.color} text-lg sm:text-2xl mb-2`}
                            >
                                {stat.value}
                            </h4>
                            <p className="text-gray-500 text-sm sm:text-base">
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
                <div className="mt-4 flex flex-wrap justify-around">
                    {[
                        {
                            title: "Gender Breakdown",
                            ChartComponent: Pie,
                            data: genderPieData,
                            options: chartOptions,
                        },
                        {
                            title: "Totals by Category",
                            ChartComponent: Pie,
                            data: totalsPieData,
                            options: chartOptions,
                        },
                        {
                            title: "Enrollments vs Graduates",
                            ChartComponent: Pie,
                            data: enrollmentPieData,
                            options: chartOptions,
                        },
                        {
                            title: "Enrollments by Year",
                            ChartComponent: Pie,
                            data: yearLevelPieData,
                            options: chartOptions,
                        },
                    ].map((chart, index) => (
                        <motion.div
                            key={index}
                            className="flex-1 m-2 min-w-[100%] sm:min-w-[15rem]"
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: {
                                    opacity: 1,
                                    y: 0,
                                    transition: { duration: 0.5 },
                                },
                                hover: {
                                    scale: 1.03,
                                    boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
                                },
                            }}
                            initial="hidden"
                            animate="visible"
                        >
                            <div className="bg-white border border-gray-200/20 rounded-lg p-2 sm:p-4">
                                <h6 className="font-semibold text-sm sm:text-xl text-gray-800 mb-2">
                                    {chart.title}
                                </h6>
                                <hr className="border-t border-gray-200 mb-2" />
                                <div>
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
