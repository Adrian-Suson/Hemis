import { Award, Home, School, Building, RefreshCw } from "lucide-react";
import CHEDButton from "../../../Components/CHEDButton";

const CHED_COLORS = {
    blue: "#0038A8",
    yellow: "#FCD116",
};

const InstitutionManagementSkeleton = () => {
    // Pulse animation class for skeleton elements
    const pulseClass = "animate-pulse bg-gray-200";

    return (
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6">
            {/* Header - Static, no need for skeleton */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
                <div className="flex items-center mb-4 sm:mb-0">
                    <div
                        className="w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center mr-4"
                        style={{
                            backgroundColor: CHED_COLORS.blue,
                            borderColor: CHED_COLORS.yellow,
                            border: "3px solid",
                        }}
                    >
                        <Award size={24} color="white" strokeWidth={1.5} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">
                            Institution Management
                        </h1>
                        <nav className="text-sm">
                            <ol className="flex items-center text-gray-500">
                                <li className="flex items-center">
                                    <Home className="w-4 h-4 mr-2" />
                                    Dashboard
                                </li>
                                <li>
                                    <span className="mx-2">›</span>
                                </li>
                                <li className="text-gray-700 font-medium flex items-center">
                                    <School className="w-4 h-4 mr-2" />
                                    My Institution
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>
                <CHEDButton
                    icon={Building}
                    variant="primary"
                    size="md"
                    disabled={true}
                >
                    Edit Institution
                </CHEDButton>
            </div>

            {/* Institution Header and Filters Skeleton */}
            <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 border-b border-gray-200">
                    <div className="flex items-center mb-4 sm:mb-0">
                        <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${pulseClass}`}
                        ></div>
                        <div>
                            <div className="flex items-center flex-wrap">
                                <div className={`h-6 w-40 ${pulseClass} rounded-md mr-3`}></div>
                                <div className="flex space-x-2 mt-1 sm:mt-0">
                                    <div className={`h-5 w-16 ${pulseClass} rounded-full`}></div>
                                    <div className={`h-5 w-20 ${pulseClass} rounded-full`}></div>
                                </div>
                            </div>
                            <div className={`h-4 w-64 ${pulseClass} rounded-md mt-2`}></div>
                        </div>
                    </div>
                    <div className="flex items-center mt-4 sm:mt-0">
                        <div className={`h-8 w-36 ${pulseClass} rounded-md`}></div>
                    </div>
                </div>
            </div>

            {/* Main Content Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Left Column */}
                <div className="lg:col-span-7">
                    {/* Institution Details Skeleton */}
                    <div className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
                        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
                            <div className="flex items-center">
                                <Building className="w-4 h-4 mr-2 text-gray-500" />
                                <h3 className="text-base font-medium text-gray-700">Institution Details</h3>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Generate 6 skeleton fields */}
                                {[...Array(6)].map((_, index) => (
                                    <div key={`detail-${index}`} className="mb-3">
                                        <div className={`h-4 w-24 ${pulseClass} rounded mb-2`}></div>
                                        <div className={`h-5 w-full ${pulseClass} rounded`}></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Leadership Skeleton */}
                    <div className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
                        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
                            <div className="flex items-center">
                                <Award className="w-4 h-4 mr-2 text-gray-500" />
                                <h3 className="text-base font-medium text-gray-700">Leadership</h3>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="flex items-center mb-4">
                                <div className={`w-12 h-12 rounded-full ${pulseClass} mr-4`}></div>
                                <div>
                                    <div className={`h-5 w-48 ${pulseClass} rounded mb-2`}></div>
                                    <div className={`h-4 w-32 ${pulseClass} rounded`}></div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                {/* Generate 4 skeleton fields */}
                                {[...Array(4)].map((_, index) => (
                                    <div key={`leadership-${index}`} className="mb-3">
                                        <div className={`h-4 w-24 ${pulseClass} rounded mb-2`}></div>
                                        <div className={`h-5 w-full ${pulseClass} rounded`}></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-5">
                    {/* Quick Actions Skeleton */}
                    <div className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
                        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
                            <div className="flex items-center">
                                <RefreshCw className="w-4 h-4 mr-2 text-gray-500" />
                                <h3 className="text-base font-medium text-gray-700">Quick Actions</h3>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="grid grid-cols-1 gap-3">
                                {/* Generate 5 action buttons */}
                                {[...Array(1)].map((_, index) => (
                                    <div
                                        key={`action-${index}`}
                                        className={`h-10 w-full ${pulseClass} rounded-md`}
                                    ></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Additional Stats Skeleton */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
                            <div className="flex items-center">
                                <School className="w-4 h-4 mr-2 text-gray-500" />
                                <h3 className="text-base font-medium text-gray-700">Institution Stats</h3>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="grid grid-cols-2 gap-4">
                                {/* Generate 4 stat cards */}
                                {[...Array(4)].map((_, index) => (
                                    <div key={`stat-${index}`} className="border border-gray-100 rounded-md p-3">
                                        <div className={`h-4 w-16 ${pulseClass} rounded mb-2`}></div>
                                        <div className={`h-6 w-12 ${pulseClass} rounded`}></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default InstitutionManagementSkeleton;
