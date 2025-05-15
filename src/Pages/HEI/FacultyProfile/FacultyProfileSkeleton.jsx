// FacultyProfileSkeleton.jsx
const FacultyProfileSkeleton = () => {
    return (
        <div className="p-6 flex flex-col h-screen max-w-full sm:max-w-[95vw] md:max-w-[98vw] overflow-x-auto overflow-y-auto md:overflow-y-hidden">
            {/* Breadcrumbs Skeleton */}
            <div className="mb-4 flex items-center space-x-2">
                <div className="h-5 w-20 animate-pulse rounded bg-gray-200"></div>
                <span className="text-gray-400">›</span>
                <div className="h-5 w-36 animate-pulse rounded bg-gray-200"></div>
                <span className="text-gray-400">›</span>
                <div className="h-5 w-36 animate-pulse rounded bg-gray-200"></div>
            </div>

            {/* Toolbar Skeleton */}
            <div className="flex justify-between items-center bg-white p-4 mb-2 border-b border-gray-200">
                <div className="flex flex-col gap-1">
                    <div className="h-8 w-48 animate-pulse rounded bg-gray-200"></div>
                    <div className="h-4 w-72 animate-pulse rounded bg-gray-200 hidden md:block"></div>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="h-10 w-36 animate-pulse rounded-md bg-gray-200"></div>
                    <div className="h-10 w-36 animate-pulse rounded-md bg-gray-200"></div>
                </div>
            </div>

            {/* Filter/Search Skeleton */}
            <div className="mt-2 mb-3 flex gap-2">
                <div className="h-10 w-64 animate-pulse rounded-md bg-gray-200"></div>
                <div className="h-10 w-28 animate-pulse rounded-md bg-gray-200"></div>
            </div>

            {/* Tabs Skeleton */}
            <div className="flex border-b border-gray-200 mb-3">
                {[1, 2, 3, 4].map((item) => (
                    <div
                        key={item}
                        className="h-10 w-28 mx-1 animate-pulse rounded-md bg-gray-200"
                    ></div>
                ))}
            </div>

            {/* Table Skeleton */}
            <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden mb-4 h-[40vh]">
                {/* Table Header */}
                <div className="bg-gray-50 border-b border-gray-200 p-2">
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map((item) => (
                            <div
                                key={item}
                                className="h-6 flex-1 mx-1 animate-pulse rounded bg-gray-200"
                            ></div>
                        ))}
                    </div>
                </div>

                {/* Table Rows */}
                {[1, 2, 3, 4, 5, 6].map((row) => (
                    <div
                        key={row}
                        className={`border-b border-gray-200 p-2 ${
                            row % 2 === 0 ? "bg-gray-50" : "bg-white"
                        }`}
                    >
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((cell) => (
                                <div
                                    key={cell}
                                    className="h-5 flex-1 mx-1 animate-pulse rounded bg-gray-200"
                                ></div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Skeleton */}
            <div className="bg-white rounded-md shadow-sm border border-gray-200 p-2">
                <div className="flex justify-end gap-2">
                    <div className="h-8 w-8 animate-pulse rounded bg-gray-200"></div>
                    <div className="h-8 w-8 animate-pulse rounded bg-gray-200"></div>
                    <div className="h-8 w-8 animate-pulse rounded bg-gray-200"></div>
                    <div className="h-8 w-24 animate-pulse rounded bg-gray-200 ml-4"></div>
                </div>
            </div>
        </div>
    );
};

export default FacultyProfileSkeleton;
