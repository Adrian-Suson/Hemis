import PropTypes from "prop-types";

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    pageSize,
    onPageSizeChange,
    pageSizeOptions = [10, 20, 50, 100],
    showFirstLast = true,
    showPageSize = true,
    maxPageButtons = 5,
    className = "",
}) => {
    const handlePageSizeChange = (e) => {
        const newSize = parseInt(e.target.value, 10);
        if (onPageSizeChange && !isNaN(newSize)) {
            onPageSizeChange(newSize);
        }
    };

    // Calculate which page buttons to show
    const getPageButtons = () => {
        const buttons = [];
        let startPage, endPage;

        if (totalPages <= maxPageButtons) {
            startPage = 1;
            endPage = totalPages;
        } else {
            const halfMax = Math.floor(maxPageButtons / 2);

            if (currentPage <= halfMax + 1) {
                startPage = 1;
                endPage = maxPageButtons;
            } else if (currentPage + halfMax >= totalPages) {
                startPage = totalPages - maxPageButtons + 1;
                endPage = totalPages;
            } else {
                startPage = currentPage - halfMax;
                endPage = currentPage + halfMax;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => onPageChange(i)}
                    className={`relative min-w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
                        currentPage === i
                            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-200 z-10"
                            : "bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-gray-200 hover:border-gray-300 hover:shadow-md"
                    }`}
                    aria-current={currentPage === i ? "page" : undefined}
                >
                    {i}
                    {currentPage === i && (
                        <div className="absolute inset-0 rounded-lg bg-blue-400 opacity-20 animate-pulse"></div>
                    )}
                </button>
            );
        }

        return buttons;
    };

    const renderPageNumbers = () => {
        const buttons = getPageButtons();
        const lastPageButton = totalPages;
        const result = [];

        if (
            showFirstLast &&
            buttons.length > 0 &&
            parseInt(buttons[0].key) > 1
        ) {
            result.push(
                <button
                    key="first"
                    onClick={() => onPageChange(1)}
                    className="min-w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                >
                    1
                </button>
            );

            if (parseInt(buttons[0].key) > 2) {
                result.push(
                    <span key="ellipsis1" className="px-2 text-gray-400 font-medium">
                        ···
                    </span>
                );
            }
        }

        result.push(...buttons);

        if (
            showFirstLast &&
            buttons.length > 0 &&
            parseInt(buttons[buttons.length - 1].key) < lastPageButton
        ) {
            if (
                parseInt(buttons[buttons.length - 1].key) <
                lastPageButton - 1
            ) {
                result.push(
                    <span key="ellipsis2" className="px-2 text-gray-400 font-medium">
                        ···
                    </span>
                );
            }

            result.push(
                <button
                    key="last"
                    onClick={() => onPageChange(lastPageButton)}
                    className="min-w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                >
                    {lastPageButton}
                </button>
            );
        }

        return result;
    };

    return (
        <div
            className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 ${className}`}
            role="navigation"
            aria-label="Pagination"
        >
            {/* Navigation Controls */}
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    className="p-2.5 rounded-lg text-sm border border-gray-200 disabled:bg-gray-50 disabled:text-gray-300 disabled:border-gray-100 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:cursor-not-allowed"
                    aria-label="Go to first page"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-transform duration-200 group-hover:-translate-x-0.5"
                    >
                        <polyline points="11 17 6 12 11 7"></polyline>
                        <polyline points="18 17 13 12 18 7"></polyline>
                    </svg>
                </button>

                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2.5 rounded-lg text-sm border border-gray-200 disabled:bg-gray-50 disabled:text-gray-300 disabled:border-gray-100 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:cursor-not-allowed"
                    aria-label="Go to previous page"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-transform duration-200 group-hover:-translate-x-0.5"
                    >
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1 mx-2">
                    {renderPageNumbers()}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2.5 rounded-lg text-sm border border-gray-200 disabled:bg-gray-50 disabled:text-gray-300 disabled:border-gray-100 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:cursor-not-allowed"
                    aria-label="Go to next page"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                    >
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>

                <button
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2.5 rounded-lg text-sm border border-gray-200 disabled:bg-gray-50 disabled:text-gray-300 disabled:border-gray-100 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:cursor-not-allowed"
                    aria-label="Go to last page"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                    >
                        <polyline points="13 17 18 12 13 7"></polyline>
                        <polyline points="6 17 11 12 6 7"></polyline>
                    </svg>
                </button>
            </div>

            {/* Page Info and Size Selector */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border">
                    <span className="font-medium text-gray-900">
                        Page {currentPage}
                    </span>
                    <span className="text-gray-400">of</span>
                    <span className="font-medium text-gray-900">
                        {totalPages}
                    </span>
                </div>

                {showPageSize && (
                    <div className="flex items-center gap-2">
                        <label
                            htmlFor="page-size"
                            className="text-gray-600 font-medium whitespace-nowrap"
                        >
                            Show:
                        </label>
                        <select
                            id="page-size"
                            value={pageSize}
                            onChange={handlePageSizeChange}
                            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 cursor-pointer"
                            aria-label="Items per page"
                        >
                            {pageSizeOptions.map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                        <span className="text-gray-600 whitespace-nowrap">
                            per page
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    pageSize: PropTypes.number,
    onPageSizeChange: PropTypes.func,
    pageSizeOptions: PropTypes.arrayOf(PropTypes.number),
    showFirstLast: PropTypes.bool,
    showPageSize: PropTypes.bool,
    maxPageButtons: PropTypes.number,
    className: PropTypes.string,
};

export default Pagination;