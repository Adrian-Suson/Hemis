import { useState, useEffect } from "react";
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
            const institutionPrograms = dashboardData.programs.filter(
                (program) => program.institution_id === institution.id
            );
            const totalEnrollment = institutionPrograms.reduce(
                (sum, program) => sum + (program.grand_total || 0),
                0
            );
            acc[type] = (acc[type] || 0) + totalEnrollment;
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
                color: "#fff",
                formatter: (value) => value,
                font: {
                    weight: "bold",
                    size: 14,
                },
                anchor: "center",
                align: "center",
                textAlign: "center",
            },
        },
    };

    // Skeleton Loader Component
    const DashboardSkeleton = () => (
        <div style={{ margin: "40px 0", padding: "32px", height: "100vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <div
                        style={{
                            width: "300px",
                            height: "40px",
                            background: "#e0e0e0",
                            borderRadius: "4px",
                            marginBottom: "8px",
                        }}
                    ></div>
                    <div
                        style={{
                            width: "200px",
                            height: "20px",
                            background: "#e0e0e0",
                            borderRadius: "4px",
                        }}
                    ></div>
                </div>
            </div>

            {/* Overview Metrics Cards Skeleton */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "24px",
                    marginBottom: "32px",
                }}
            >
                {Array.from({ length: 5 }).map((_, index) => (
                    <div
                        key={index}
                        style={{
                            padding: "24px",
                            borderRadius: "8px",
                            background: "#fff",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            height: "100%",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                            <div
                                style={{
                                    width: "40px",
                                    height: "40px",
                                    background: "#e0e0e0",
                                    borderRadius: "50%",
                                    marginRight: "8px",
                                }}
                            ></div>
                            <div
                                style={{
                                    width: "80px",
                                    height: "20px",
                                    background: "#e0e0e0",
                                    borderRadius: "4px",
                                }}
                            ></div>
                        </div>
                        <div
                            style={{
                                width: "60px",
                                height: "40px",
                                background: "#e0e0e0",
                                borderRadius: "4px",
                                marginBottom: "8px",
                            }}
                        ></div>
                        <div
                            style={{
                                width: "120px",
                                height: "20px",
                                background: "#e0e0e0",
                                borderRadius: "4px",
                            }}
                        ></div>
                    </div>
                ))}
            </div>

            {/* Pie Charts Skeleton (Side by Side) */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "24px",
                    marginBottom: "32px",
                }}
            >
                {[1, 2].map((_, index) => (
                    <div
                        key={index}
                        style={{
                            padding: "24px",
                            borderRadius: "8px",
                            border: "1px solid #e0e0e0",
                            background: "#fff",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            height: "100%",
                        }}
                    >
                        <div
                            style={{
                                width: "200px",
                                height: "30px",
                                background: "#e0e0e0",
                                borderRadius: "4px",
                                marginBottom: "16px",
                            }}
                        ></div>
                        <hr style={{ margin: "0 0 24px 0", borderColor: "#e0e0e0" }} />
                        <div style={{ maxWidth: "400px", margin: "0 auto" }}>
                            <div
                                style={{
                                    width: "300px",
                                    height: "300px",
                                    background: "#e0e0e0",
                                    borderRadius: "50%",
                                }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    if (dashboardData.loading) {
        return <DashboardSkeleton />;
    }

    if (dashboardData.error) {
        return (
            <div style={{ padding: "24px" }}>
                <span style={{ color: "#d32f2f", fontSize: "16px" }}>{dashboardData.error}</span>
            </div>
        );
    }

    return (
        <>
            <div
                style={{
                    padding: "40px",
                    height: "100vh",
                    overflowY: "auto",
                    scrollbarWidth: "thin",
                    scrollbarColor: "#888 #f1f1f1",
                }}
            >
                <div>
                    {/* Header */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "32px",
                        }}
                    >
                        <div>
                            <h1
                                style={{
                                    fontSize: "32px",
                                    fontWeight: "bold",
                                    color: "#1976d2",
                                    margin: 0,
                                }}
                            >
                                Administration Dashboard
                            </h1>
                            <p
                                style={{
                                    fontSize: "16px",
                                    color: "#6b7280",
                                    margin: "4px 0 0 0",
                                }}
                            >
                                Overview of all system data and statistics
                            </p>
                        </div>
                    </div>

                    {/* Overview Metrics Cards */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                            gap: "16px",
                            marginBottom: "32px",
                        }}
                    >
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
                            <div
                                key={index}
                                style={{
                                    padding: "16px",
                                    background: color.light,
                                    color: "#000",
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        marginBottom: "8px",
                                    }}
                                >
                                    <span
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            width: "40px",
                                            height: "40px",
                                            background: color.main,
                                            color: "#fff",
                                            borderRadius: "50%",
                                            marginRight: "8px",
                                            fontSize: "20px",
                                        }}
                                    >
                                        <Icon />
                                    </span>
                                    <h2 style={{ fontSize: "20px", margin: 0 }}>{label}</h2>
                                </div>
                                <h3 style={{ fontSize: "36px", fontWeight: "bold", margin: "0 0 8px 0" }}>
                                    {value}
                                </h3>
                                <p
                                    style={{
                                        fontSize: "14px",
                                        opacity: 0.8,
                                        margin: 0,
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
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Pie Charts Section (Side by Side) */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                            gap: "24px",
                            marginBottom: "32px",
                        }}
                    >
                        {/* Pie Chart for Institution Types */}
                        <div
                            style={{
                                padding: "24px",
                                borderRadius: "8px",
                                border: "1px solid #e0e0e0",
                                background: "#fff",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                height: "100%",
                            }}
                        >
                            <h4
                                style={{
                                    fontSize: "18px",
                                    fontWeight: "500",
                                    margin: "0 0 16px 0",
                                }}
                            >
                                Institution Types Distribution
                            </h4>
                            <hr style={{ margin: "0 0 24px 0", borderColor: "#e0e0e0" }} />
                            {Object.keys(institutionTypeCounts).length > 0 ? (
                                <div style={{ maxWidth: "300px", margin: "0 auto" }}>
                                    <Pie data={institutionPieChartData} options={pieChartOptions} />
                                </div>
                            ) : (
                                <p style={{ color: "#6b7280", textAlign: "center", margin: 0 }}>
                                    No institution type data available.
                                </p>
                            )}
                        </div>

                        {/* Pie Chart for Enrollments by Institution Type */}
                        <div
                            style={{
                                padding: "18px",
                                borderRadius: "8px",
                                border: "1px solid #e0e0e0",
                                background: "#fff",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                height: "100%",
                            }}
                        >
                            <h4
                                style={{
                                    fontSize: "18px",
                                    fontWeight: "500",
                                    margin: "0 0 16px 0",
                                }}
                            >
                                Enrollments by Institution Type
                            </h4>
                            <hr style={{ margin: "0 0 24px 0", borderColor: "#e0e0e0" }} />
                            {Object.keys(enrollmentByInstitutionType).length > 0 &&
                                Object.values(enrollmentByInstitutionType).some((value) => value > 0) ? (
                                <div style={{ maxWidth: "300px", margin: "0 auto" }}>
                                    <Pie data={enrollmentPieChartData} options={pieChartOptions} />
                                </div>
                            ) : (
                                <p style={{ color: "#6b7280", textAlign: "center", margin: 0 }}>
                                    No enrollment data available for institution types.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Responsive Styles */}
            <style>
                {`
          @media (max-width: 600px) {
            .dashboard-container {
              padding: 16px;
            }
            .dashboard-grid {
              grid-template-columns: 1fr;
            }
            .dashboard-header h1 {
              font-size: 24px;
            }
            .dashboard-header p {
              font-size: 14px;
            }
            .metric-card {
              padding: 12px;
            }
            .metric-card h2 {
              font-size: 18px;
            }
            .metric-card h3 {
              font-size: 28px;
            }
            .metric-card p {
              font-size: 12px;
            }
            .pie-chart-container {
              padding: 16px;
            }
            .pie-chart-container h2 {
              font-size: 20px;
            }
          }
          @media (max-width: 960px) {
            .dashboard-grid {
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            }
          }
        `}
            </style>
        </>
    );
};

export default Dashboard;
