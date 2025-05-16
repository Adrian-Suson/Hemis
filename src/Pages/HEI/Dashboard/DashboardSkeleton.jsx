import {
    LayoutDashboardIcon,
    TrendingUp,
    BarChart2,
    Upload,
    Users,
    FileUp,
    GraduationCap,
    Building2,
    BookOpen,
    AlertCircle
} from "lucide-react";

const DashboardSkeleton = () => {
    // Upload buttons skeleton config
    const uploadButtons = [
        {
            label: "Upload Form A",
            icon: <Building2 className="w-5 h-5" />,
            bgColor: "bg-blue-50",
            textColor: "text-blue-600",
            borderColor: "border-blue-100",
            iconBgColor: "bg-blue-100"
        },
        {
            label: "Upload Form B",
            icon: <FileUp className="w-5 h-5" />,
            bgColor: "bg-rose-50",
            textColor: "text-rose-600",
            borderColor: "border-rose-100",
            iconBgColor: "bg-rose-100"
        },
        {
            label: "Upload Form E2",
            icon: <Users className="w-5 h-5" />,
            bgColor: "bg-amber-50",
            textColor: "text-amber-600",
            borderColor: "border-amber-100",
            iconBgColor: "bg-amber-100"
        },
        {
            label: "Upload Form GH",
            icon: <GraduationCap className="w-5 h-5" />,
            bgColor: "bg-emerald-50",
            textColor: "text-emerald-600",
            borderColor: "border-emerald-100",
            iconBgColor: "bg-emerald-100"
        }
    ];

    // Stats cards skeleton config
    const statCards = [
        {
            label: "Total Faculty",
            icon: <GraduationCap className="w-5 h-5" />,
            bgColor: "bg-blue-50",
            textColor: "text-blue-600"
        },
        {
            label: "Total Programs",
            icon: <BookOpen className="w-5 h-5" />,
            bgColor: "bg-rose-50",
            textColor: "text-rose-600"
        },
        {
            label: "Total Institutions",
            icon: <Building2 className="w-5 h-5" />,
            bgColor: "bg-emerald-50",
            textColor: "text-emerald-600"
        },
        {
            label: "Total Enrollments",
            icon: <Users className="w-5 h-5" />,
            bgColor: "bg-amber-50",
            textColor: "text-amber-600"
        }
    ];

    // Chart skeleton configs
    const chartTypes = [
        "Gender Breakdown",
        "Totals by Category",
        "Enrollments vs Graduates",
        "Enrollments by Year"
    ];

    // Pulse animation for skeleton elements
    const pulseClass = "animate-pulse bg-gray-200";

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <div className="container mx-auto px-4 py-4">
                {/* Data Upload Section - Skeleton */}
                <div className="mb-5 bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                    <div className="bg-gray-50 border-b border-gray-100 px-4 py-2">
                        <div className="flex items-center">
                            <LayoutDashboardIcon className="w-4 h-4 mr-2 text-gray-500" />
                            <h2 className="text-base font-medium text-gray-700">
                                Dashboard
                            </h2>
                        </div>
                    </div>

                    <div className="p-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {uploadButtons.map((button, index) => (
                                <div
                                    key={index}
                                    className={`bg-white border ${button.borderColor} rounded-md shadow-sm overflow-hidden`}
                                >
                                    <div
                                        className={`${button.bgColor} p-2 flex justify-between items-center`}
                                    >
                                        <span
                                            className={`${button.textColor} text-sm font-medium`}
                                        >
                                            {button.label}
                                        </span>
                                        {button.icon && (
                                            <div
                                                className={`${button.iconBgColor} ${button.textColor} p-1 rounded-full`}
                                            >
                                                {button.icon}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3">
                                        <button
                                            disabled
                                            className={`w-full flex items-center justify-center py-1.5 px-3 rounded bg-gray-100 text-gray-400 cursor-not-allowed transition-all focus:outline-none`}
                                        >
                                            <Upload className="w-3 h-3 mr-1" />
                                            <span className="text-xs">
                                                Upload
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="mt-2 text-xs text-gray-500 flex items-center">
                            <AlertCircle className="w-3 h-3 mr-1 text-gray-400" />
                            Supported formats: Excel (.xlsx, .xls)
                        </p>
                    </div>
                </div>

                {/* Stats Cards - Skeleton */}
                <h2 className="text-base font-medium text-gray-700 mb-3 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1.5 text-gray-500" />
                    Key Statistics
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                    {statCards.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden"
                        >
                            <div className="p-3">
                                <div className="flex items-center">
                                    <div
                                        className={`p-2 rounded-md ${stat.bgColor} ${stat.textColor} mr-3`}
                                    >
                                        {stat.icon}
                                    </div>
                                    <div>
                                        <div className={`h-6 w-16 ${pulseClass} rounded-md mb-1`}></div>
                                        <p className="text-xs text-gray-500">
                                            {stat.label}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Charts - Skeleton */}
                <h2 className="text-base font-medium text-gray-700 mb-3 flex items-center">
                    <BarChart2 className="w-4 h-4 mr-1.5 text-gray-500" />
                    Visual Insights
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-5">
                    {chartTypes.map((chartTitle, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden"
                        >
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-sm font-medium text-gray-700">
                                        {chartTitle}
                                    </h3>
                                    <div className="p-1 bg-gray-50 rounded-full text-gray-400">
                                        <BarChart2 className="w-3 h-3" />
                                    </div>
                                </div>

                                {/* Circular placeholder for pie chart */}
                                <div className="flex items-center justify-center h-56">
                                    <div className="relative">
                                        {/* Outer circle */}
                                        <div className={`h-32 w-32 rounded-full ${pulseClass}`}></div>

                                        {/* Inner circle for donut effect */}
                                        <div className="h-16 w-16 rounded-full bg-white absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                                    </div>
                                </div>

                                {/* Legend placeholders */}
                                <div className="flex flex-wrap justify-center mt-2 gap-2">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="flex items-center">
                                            <div className={`h-3 w-3 ${pulseClass} rounded-full mr-1`}></div>
                                            <div className={`h-3 w-16 ${pulseClass} rounded-md`}></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Background animation - CHED-inspired */}
                <div className="fixed inset-0 z-0 pointer-events-none opacity-10">
                    {/* Static background sunburst rays - similar to 404 page */}
                    <div className="absolute inset-0 z-0 opacity-10">
                        {[...Array(18)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute origin-center left-1/2 top-1/2 bg-blue-700 -translate-x-1/2 -translate-y-1/2"
                                style={{
                                    height: '150vh',
                                    width: '8px',
                                    transform: `translate(-50%, -50%) rotate(${i * 20}deg)`
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardSkeleton;
