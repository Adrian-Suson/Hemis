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
            // Show all pages
            startPage = 1;
            endPage = totalPages;
        } else {
            // Calculate start and end pages
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

        // Create page buttons
        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => onPageChange(i)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm ${
                        currentPage === i
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                    }`}
                    aria-current={currentPage === i ? "page" : undefined}
                >
                    {i}
                </button>
            );
        }

        return buttons;
    };

    // Show ellipses when necessary
    const renderPageNumbers = () => {
        const buttons = getPageButtons();
        const lastPageButton = totalPages;
        const result = [];

        // First page button and ellipsis if necessary
        if (
            showFirstLast &&
            buttons.length > 0 &&
            parseInt(buttons[0].key) > 1
        ) {
            result.push(
                <button
                    key="first"
                    onClick={() => onPageChange(1)}
                    className="w-8 h-8 flex items-center justify-center rounded-md text-sm bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                >
                    1
                </button>
            );

            if (parseInt(buttons[0].key) > 2) {
                result.push(
                    <span key="ellipsis1" className="px-2 text-gray-500">
                        ...
                    </span>
                );
            }
        }

        // Add page buttons
        result.push(...buttons);

        // Last page button and ellipsis if necessary
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
                    <span key="ellipsis2" className="px-2 text-gray-500">
                        ...
                    </span>
                );
            }

            result.push(
                <button
                    key="last"
                    onClick={() => onPageChange(lastPageButton)}
                    className="w-8 h-8 flex items-center justify-center rounded-md text-sm bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                >
                    {lastPageButton}
                </button>
            );
        }

        return result;
    };

    return (
        <div
            className={`flex flex-row items-center flex-wrap gap-2 ${className}`}
            role="navigation"
            aria-label="Pagination"
        >
            <button
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
                className="p-2 rounded-md text-sm border border-gray-300 disabled:bg-gray-100 disabled:text-gray-400 flex items-center justify-center"
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
                >
                    <polyline points="11 17 6 12 11 7"></polyline>
                    <polyline points="18 17 13 12 18 7"></polyline>
                </svg>
            </button>

            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-md text-sm border border-gray-300 disabled:bg-gray-100 disabled:text-gray-400 flex items-center justify-center"
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
                >
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
            </button>

            <div className="flex items-center">{renderPageNumbers()}</div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md text-sm border border-gray-300 disabled:bg-gray-100 disabled:text-gray-400 flex items-center justify-center"
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
                >
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </button>

            <button
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md text-sm border border-gray-300 disabled:bg-gray-100 disabled:text-gray-400 flex items-center justify-center"
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
                >
                    <polyline points="13 17 18 12 13 7"></polyline>
                    <polyline points="6 17 11 12 6 7"></polyline>
                </svg>
            </button>

            <div className="text-sm text-gray-700 mx-2">
                Page {currentPage} of {totalPages}
            </div>

            {showPageSize && (
                <div className="flex items-center gap-2 ml-2">
                    <label
                        htmlFor="page-size"
                        className="text-sm text-gray-700"
                    >
                        Show:
                    </label>
                    <select
                        id="page-size"
                        value={pageSize}
                        onChange={handlePageSizeChange}
                        className="px-2 py-1 text-sm border border-gray-300 rounded-md bg-white"
                        aria-label="Items per page"
                    >
                        {pageSizeOptions.map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                    <span className="text-sm text-gray-700">per page</span>
                </div>
            )}
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
