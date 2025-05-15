// CampusManagementSkeleton.jsx
const GraduatesSkeleton = () => {
    return (
        <div className="p-6 flex flex-col h-screen max-w-full sm:max-w-[95vw] md:max-w-[98vw] overflow-x-auto overflow-y-auto md:overflow-y-hidden">
            {/* Breadcrumbs Skeleton */}
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="flex space-x-2 text-gray-600">
                    <div className="h-5 w-20 animate-pulse rounded bg-gray-200"></div>
                    <span className="text-gray-300">›</span>
                    <div className="h-5 w-36 animate-pulse rounded bg-gray-200"></div>
                    <span className="text-gray-300">›</span>
                    <div className="h-5 w-36 animate-pulse rounded bg-gray-200"></div>
                </ol>
            </nav>

            {/* Filters and Buttons Skeleton */}
            <div className="flex flex-col sm:flex-row gap-2 mb-2 items-center flex-wrap">
                <div className="flex flex-1 gap-2 flex-wrap w-full sm:w-auto">
                    <div className="flex-1 min-w-[150px] h-9 animate-pulse rounded bg-gray-200"></div>
                    <div className="min-w-[120px] h-9 animate-pulse rounded bg-gray-200"></div>
                    <div className="min-w-[120px] h-9 animate-pulse rounded bg-gray-200"></div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <div className="h-9 w-[130px] animate-pulse rounded bg-gray-200"></div>
                    <div className="h-9 w-[130px] animate-pulse rounded bg-gray-200"></div>
                </div>
            </div>

            {/* Table Skeleton */}
            <div className="bg-white rounded-md shadow-sm border border-gray-200 flex flex-col h-[70vh] w-full overflow-hidden">
                {/* Header Skeleton */}
                <div className="bg-gray-50 border-b border-gray-200 px-4 py-2.5 flex justify-between items-center">
                    <div className="h-5 w-24 animate-pulse rounded bg-gray-200"></div>
                    <div className="h-7 w-20 animate-pulse rounded bg-gray-200"></div>
                </div>

                {/* Table Header Skeleton */}
                <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200">
                    <div className="flex">
                        {[...Array(6)].map((_, index) => (
                            <div
                                key={index}
                                className="px-3 py-2 flex-1 border-r border-gray-200"
                            >
                                <div className="h-4 animate-pulse rounded bg-gray-200"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Table Body Skeleton */}
                <div className="flex-1 overflow-auto">
                    {[...Array(10)].map((_, rowIndex) => (
                        <div
                            key={rowIndex}
                            className={`flex border-b border-gray-200 ${
                                rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }`}
                        >
                            {[...Array(6)].map((_, colIndex) => (
                                <div
                                    key={colIndex}
                                    className="px-3 py-2 flex-1 border-r border-gray-200"
                                >
                                    <div
                                        className={`h-4 animate-pulse rounded bg-gray-200 ${
                                            Math.random() > 0.5
                                                ? "w-full"
                                                : "w-2/3"
                                        }`}
                                    ></div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Footer Skeleton */}
                <div className="bg-gray-50 border-t border-gray-200 px-4 py-2 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="h-8 w-32 animate-pulse rounded bg-gray-200"></div>
                        <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                    </div>
                    <div className="flex items-center space-x-1">
                        <div className="h-7 w-7 animate-pulse rounded bg-gray-200"></div>
                        <div className="h-7 w-7 animate-pulse rounded bg-gray-200"></div>
                        <div className="flex space-x-1 px-2">
                            {[...Array(3)].map((_, index) => (
                                <div
                                    key={index}
                                    className="h-6 w-6 animate-pulse rounded-full bg-gray-200"
                                ></div>
                            ))}
                        </div>
                        <div className="h-7 w-7 animate-pulse rounded bg-gray-200"></div>
                        <div className="h-7 w-7 animate-pulse rounded bg-gray-200"></div>
                    </div>
                </div>
            </div>

            {/* Snackbar Skeleton - Hidden by default */}
            <div className="hidden fixed top-4 right-4 max-w-xs w-64 h-16 animate-pulse rounded-md bg-gray-200 shadow-md"></div>
        </div>
    );
};

export default GraduatesSkeleton;
