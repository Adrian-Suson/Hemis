import { useState, useEffect, useMemo, useCallback } from "react";
import {
    Building2,
    Database,
    Search,
    Users,
    MapPin,
    Loader2,
    RefreshCw,
    Filter,
    Grid3X3,
    List,
    Eye,
    ArrowUpRight,
    Calendar,
    Award,
} from "lucide-react";
import PropTypes from "prop-types";
import config from "../../utils/config";
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

// Map institution types to specific colors (move outside component for legend access)
const typeColorMap = {
    SUC: '#3b82f6',      // blue
    LUC: '#f59e0b',      // yellow (amber)
    Private: '#ef4444',  // red
};

// Custom hooks
const useHeiData = () => {
    const [heiData, setHeiData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchHeiData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${config.API_URL}/public/dashboard`);
            if (!response.ok) throw new Error("Failed to fetch HEI data");
            const data = await response.json();
            setHeiData(data.heis || []);
            console.log('data.heis:', data.heis)
            setLastUpdated(new Date());
        } catch (err) {
            setError("Failed to fetch HEI data. Please try again.");
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHeiData();
    }, [fetchHeiData]);

    return { heiData, loading, error, lastUpdated, refetch: fetchHeiData };
};

// Chart component using Chart.js
const ModernChart = ({ data }) => {
    if (!data || data.length === 0) return null;
    const chartData = {
        labels: data.map((item) => item.label),
        datasets: [
            {
                data: data.map((item) => item.value),
                backgroundColor: data.map((item) => typeColorMap[item.label] || '#a3a3a3'),
                borderWidth: 2,
                borderColor: '#fff',
                hoverOffset: 8,
            },
        ],
    };
    const options = {
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `${context.label}: ${context.parsed}`;
                    },
                },
            },
            datalabels: {
                color: '#fff',
                font: {
                    weight: 'bold',
                    size: 11,
                },
                formatter: (value, context) => {
                    const label = context.chart.data.labels[context.dataIndex];
                    const dataset = context.chart.data.datasets[0];
                    const total = dataset.data.reduce((sum, v) => sum + v, 0);
                    const val = dataset.data[context.dataIndex];
                    const percent = total ? ((val / total) * 100).toFixed(1) : 0;
                    return `${label}\n${val} (${percent}%)`;
                },
            },
        },
        responsive: true,
        maintainAspectRatio: false,
    };
    return (
        <div className="relative w-full h-64 max-w-xs mx-auto">
            <Pie data={chartData} options={options} />
        </div>
    );
};

ModernChart.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.number.isRequired,
        })
    ).isRequired,
};

// Loading component with modern design
const ModernLoader = ({ message = "Loading..." }) => (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-100 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
            <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse mx-auto mb-4"></div>
                <Loader2 className="h-6 w-6 animate-spin text-blue-600 absolute top-3 left-1/2 transform -translate-x-1/2" />
            </div>
            <p className="text-slate-600 font-medium text-sm">{message}</p>
            <div className="mt-2 flex space-x-1 justify-center">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            </div>
        </div>
    </div>
);

ModernLoader.propTypes = {
    message: PropTypes.string,
};

// Error component with modern design
const ModernError = ({ error, onRetry }) => (
    <div className="h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 flex items-center justify-center">
        <div className="text-center max-w-md bg-white rounded-xl shadow-lg p-6 border border-red-100">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Database className="h-6 w-6 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Connection Error</h3>
            <p className="text-gray-600 mb-4 text-sm">{error}</p>
            <button
                onClick={onRetry}
                className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-rose-700 transition-all duration-200 flex items-center gap-2 mx-auto font-medium shadow hover:shadow-lg text-sm"
            >
                <RefreshCw className="h-4 w-4" />
                Try Again
            </button>
        </div>
    </div>
);

ModernError.propTypes = {
    error: PropTypes.string,
    onRetry: PropTypes.func,
};

// Modern stat card
const ModernStatCard = ({
    icon: Icon,
    title,
    value,
    subtitle,
    trend,
    color = "blue",
}) => {
    const colorClasses = {
        blue: "from-blue-500 to-indigo-600",
        green: "from-emerald-500 to-teal-600",
        amber: "from-amber-500 to-orange-600",
        purple: "from-purple-500 to-violet-600",
        rose: "from-rose-500 to-pink-600",
    };

    return (
        <div className="group bg-white rounded-xl shadow border border-gray-200 hover:shadow-lg transition-all duration-200 p-4">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div
                        className={`w-9 h-9 rounded-lg bg-gradient-to-r ${colorClasses[color]} flex items-center justify-center mb-2 group-hover:scale-105 transition-transform duration-150`}
                    >
                        <Icon className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-xs font-medium text-gray-500 mb-0.5">
                        {title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mb-0.5">
                        {value}
                    </p>
                    {subtitle && (
                        <p className="text-xs text-gray-400">{subtitle}</p>
                    )}
                </div>
                {trend && (
                    <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-xs font-medium">
                        <ArrowUpRight className="h-3 w-3" />
                        <span>{trend}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

ModernStatCard.propTypes = {
    icon: PropTypes.elementType.isRequired,
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    subtitle: PropTypes.string,
    trend: PropTypes.string,
    color: PropTypes.string,
};

// Modern search and filter
const ModernSearchFilter = ({
    searchTerm,
    onSearchChange,
    filterType,
    onFilterChange,
}) => (
    <div className="bg-white rounded-xl shadow p-3 border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-2">
            <div className="flex-1">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Search institutions by name..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-150 bg-gray-50 focus:bg-white text-sm"
                    />
                </div>
            </div>
            <div className="lg:w-48">
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <select
                        value={filterType}
                        onChange={(e) => onFilterChange(e.target.value)}
                        className="w-full pl-9 pr-7 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-150 bg-gray-50 focus:bg-white appearance-none text-sm"
                    >
                        <option value="">All Institution Types</option>
                        <option value="SUC">State Universities</option>
                        <option value="LUC">Local Universities</option>
                        <option value="Private">Private Institutions</option>
                    </select>
                </div>
            </div>
        </div>
    </div>
);

ModernSearchFilter.propTypes = {
    searchTerm: PropTypes.string.isRequired,
    onSearchChange: PropTypes.func.isRequired,
    filterType: PropTypes.string.isRequired,
    onFilterChange: PropTypes.func.isRequired,
};

function ModernHEIDashboard() {
    const { heiData, loading, error, lastUpdated, refetch } = useHeiData();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("");
    const [viewMode, setViewMode] = useState("grid");

    // Memoized calculations
    const processedData = useMemo(() => {
        if (!heiData.length)
            return { chartData: [], stats: {}, filteredData: [], studentsByTypeData: [] };

        const filteredData = heiData.filter((hei) => {
            const matchesSearch = hei.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            const matchesType = !filterType || hei.type === filterType;
            return matchesSearch && matchesType;
        });

        const typeCounts = heiData.reduce((acc, hei) => {
            acc[hei.type] = (acc[hei.type] || 0) + 1;
            return acc;
        }, {});

        const chartData = Object.entries(typeCounts).map(([key, value]) => ({
            label: key,
            value: value,
        }));

        // NEW: Calculate total students by type
        const studentsByType = heiData.reduce((acc, hei) => {
            acc[hei.type] = (acc[hei.type] || 0) + (hei.students || 0);
            return acc;
        }, {});

        const studentsByTypeData = Object.entries(studentsByType).map(([key, value]) => ({
            label: key,
            value: value,
        }));

        const stats = {
            total: heiData.length,
            suc: heiData.filter((hei) => hei.type === "SUC").length,
            luc: heiData.filter((hei) => hei.type === "LUC").length,
            private: heiData.filter((hei) => hei.type === "Private").length,
            regions: [...new Set(heiData.map((hei) => hei.region))].length,
            totalStudents: heiData.reduce(
                (sum, hei) => sum + (hei.students || 0),
                0
            ),
        };

        return { chartData, stats, filteredData, studentsByTypeData };
    }, [heiData, searchTerm, filterType]);

    const { chartData, stats, filteredData, studentsByTypeData } = processedData;

    if (loading) return <ModernLoader message="Loading HEI Dashboard..." />;
    if (error) return <ModernError error={error} onRetry={refetch} />;

    return (
        <div
            className="min-h-screen w-full flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
            style={{ width: "100vw", minHeight: "100vh" }}
        >
            {/* Modern Header */}
            <div className="bg-white/90 backdrop-blur border-b border-white/30 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
                    <div className="py-3">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
                                    <Building2 className="h-7 w-7 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                        HEI Statistical Bulletin
                                    </h1>
                                    <p className="text-gray-600 mt-1">
                                        Real-time insights into {stats.total}{" "}
                                        Higher Education Institutions
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 lg:mt-0 flex items-center space-x-4">
                                {lastUpdated && (
                                    <div className="flex items-center space-x-2 text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">
                                        <Calendar className="h-4 w-4" />
                                        <span>
                                            Updated{" "}
                                            {lastUpdated.toLocaleTimeString()}
                                        </span>
                                    </div>
                                )}
                                <button
                                    onClick={refetch}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 flex items-center gap-2 font-medium shadow-lg hover:shadow-xl"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                    Refresh Data
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full w-full">
                <div className="max-w-7xl mx-auto px-1 sm:px-2 lg:px-4 py-2 space-y-2 h-full w-full">
                    {/* Modern Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                        <ModernStatCard
                            icon={Building2}
                            title="Total Institutions"
                            value={stats.total}
                            color="blue"
                        />
                        <ModernStatCard
                            icon={Award}
                            title="State Universities"
                            value={stats.suc}
                            subtitle="SUC"
                            color="green"
                        />
                        <ModernStatCard
                            icon={MapPin}
                            title="Local Universities"
                            value={stats.luc}
                            subtitle="LUC"
                            color="amber"
                        />
                        <ModernStatCard
                            icon={Building2}
                            title="Private Institutions"
                            value={stats.private}
                            color="purple"
                        />
                        <ModernStatCard
                            icon={Users}
                            title="Total Students"
                            value={stats.totalStudents.toLocaleString()}
                            color="rose"
                        />
                    </div>

                    {/* Search and Filter */}
                    <ModernSearchFilter
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        filterType={filterType}
                        onFilterChange={setFilterType}
                    />

                    {/* Charts and Analytics */}
                    <div className="flex flex-col h-full w-full">
                        {/* Pie charts row */}
                        <div className="flex flex-col md:flex-row gap-4 w-full">
                            {/* Institution Distribution Chart */}
                            <div className="flex-1 bg-white rounded-xl shadow p-4 border border-gray-200 flex flex-col h-full min-w-0">
                                <div className="text-center mb-3">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-1">Institution Distribution</h2>
                                    <p className="text-gray-500 text-xs">By institution type</p>
                                </div>
                                <ModernChart data={chartData} />
                                <div className="mt-3 space-y-2">
                                    {chartData.map((item) => (
                                        <div
                                            key={item.label}
                                            className="flex items-center justify-between"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{
                                                        backgroundColor: typeColorMap[item.label] || '#a3a3a3',
                                                    }}
                                                />
                                                <span className="text-sm text-gray-600">
                                                    {item.label}
                                                </span>
                                            </div>
                                            <span className="font-semibold text-gray-900">
                                                {item.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Student Distribution Chart */}
                            <div className="flex-1 bg-white rounded-xl shadow p-4 border border-gray-200 flex flex-col h-full min-w-0">
                                <div className="text-center mb-3">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-1">Student Distribution</h2>
                                    <p className="text-gray-500 text-xs">Total students by institution type</p>
                                </div>
                                <ModernChart data={studentsByTypeData} />
                                <div className="mt-3 space-y-2">
                                    {studentsByTypeData.map((item) => (
                                        <div
                                            key={item.label}
                                            className="flex items-center justify-between"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{
                                                        backgroundColor: typeColorMap[item.label] || '#a3a3a3',
                                                    }}
                                                />
                                                <span className="text-sm text-gray-600">
                                                    {item.label}
                                                </span>
                                            </div>
                                            <span className="font-semibold text-gray-900">
                                                {item.value.toLocaleString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Institution List below the charts */}
                        <div className="flex-1 mt-4 bg-white rounded-xl shadow border border-gray-200 flex flex-col min-h-0 overflow-hidden">
                            <div className="p-3 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            Institutions
                                        </h2>
                                        <p className="text-gray-500 text-sm mt-1">
                                            {searchTerm || filterType
                                                ? `${filteredData.length} filtered results`
                                                : `${stats.total} total institutions`}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                                        <button
                                            onClick={() => setViewMode("grid")}
                                            className={`p-2 rounded-md transition-colors ${
                                                viewMode === "grid"
                                                    ? "bg-white text-blue-600 shadow-sm"
                                                    : "text-gray-500 hover:text-gray-700"
                                            }`}
                                        >
                                            <Grid3X3 className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode("list")}
                                            className={`p-2 rounded-md transition-colors ${
                                                viewMode === "list"
                                                    ? "bg-white text-blue-600 shadow-sm"
                                                    : "text-gray-500 hover:text-gray-700"
                                            }`}
                                        >
                                            <List className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 flex-1 overflow-y-auto min-h-0">
                                <div
                                    className={
                                        viewMode === "grid"
                                            ? "grid grid-cols-1 md:grid-cols-2 gap-2"
                                            : "space-y-2"
                                    }
                                >
                                    {filteredData.map((hei) => (
                                        <div
                                            key={hei.uiid}
                                            className={`group p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 ${
                                                viewMode === "list"
                                                    ? "flex items-center justify-between"
                                                    : ""
                                            }`}
                                        >
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                                    {hei.name}
                                                </h3>
                                                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Eye className="h-3 w-3" />
                                                        ID: {hei.uiid}
                                                    </span>
                                                    {hei.region && (
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="h-3 w-3" />
                                                            {hei.region}
                                                        </span>
                                                    )}
                                                    {hei.students && (
                                                        <span className="flex items-center gap-1">
                                                            <Users className="h-3 w-3" />
                                                            {hei.students.toLocaleString()} students
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div
                                                className={
                                                    viewMode === "list"
                                                        ? "ml-4 flex-shrink-0"
                                                        : "mt-3"
                                                }
                                            >
                                                <span
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                        hei.type === "SUC"
                                                            ? "bg-blue-100 text-blue-800"
                                                            : hei.type === "LUC"
                                                            ? "bg-emerald-100 text-emerald-800"
                                                            : "bg-amber-100 text-amber-800"
                                                    }`}
                                                >
                                                    {hei.type}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModernHEIDashboard;
