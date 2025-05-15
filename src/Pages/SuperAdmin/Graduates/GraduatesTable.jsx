import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { ChevronDown } from "lucide-react";
import Pagination from "../../../Components/Pagination";

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

const GraduatesTable = ({ graduates }) => {
    const [page, setPage] = useState(1); // Change to 1-based index for Pagination component
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [visibleColumns, setVisibleColumns] = useState(null);
    const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);

    // Initialize visible columns on first render
    useEffect(() => {
        setVisibleColumns({
            student_id: true,
            last_name: true,
            first_name: true,
            middle_name: true,
            sex: true,
            date_of_birth: true,
            date_graduated: true,
            program_name: true,
            program_major: true,
            program_authority_to_operate_graduate: true,
            year_granted: true,
        });
    }, []);

    // Toggle column visibility
    const toggleColumnVisibility = (columnKey) => {
        setVisibleColumns((prev) => ({
            ...prev,
            [columnKey]: !prev[columnKey],
        }));
    };

    // Column definitions
    const columns = [
        {
            field: "student_id",
            headerName: "Student ID",
            minWidth: 120,
        },
        {
            field: "last_name",
            headerName: "Last Name",
            minWidth: 150,
        },
        {
            field: "first_name",
            headerName: "First Name",
            minWidth: 150,
        },
        {
            field: "middle_name",
            headerName: "Middle Name",
            minWidth: 150,
        },
        {
            field: "sex",
            headerName: "Sex",
            minWidth: 80,
        },
        {
            field: "date_of_birth",
            headerName: "Date of Birth",
            minWidth: 120,
        },
        {
            field: "date_graduated",
            headerName: "Date Graduated",
            minWidth: 120,
        },
        {
            field: "program_name",
            headerName: "Program Name",
            minWidth: 290,
        },
        {
            field: "program_major",
            headerName: "Program Major",
            minWidth: 230,
        },
        {
            field: "program_authority_to_operate_graduate",
            headerName: "Program Authority",
            minWidth: 200,
        },
        {
            field: "year_granted",
            headerName: "Year Granted",
            minWidth: 150,
            isNumeric: true,
        },
    ].filter((col) => visibleColumns?.[col.field]);

    // Calculate pagination
    const paginatedGraduates =
        rowsPerPage === -1
            ? graduates
            : graduates.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    const totalPages =
        rowsPerPage === -1 ? 1 : Math.ceil(graduates.length / rowsPerPage);

    // Skip if columns are not ready yet
    if (!visibleColumns) {
        return (
            <div className="animate-pulse h-[50vh] w-full bg-gray-100 rounded-md"></div>
        );
    }

    return (
        <div className="mb-4">
            <div className="bg-white rounded-md shadow-sm border border-gray-200 flex flex-col h-[50vh] w-full overflow-hidden">
                {/* Table Header with Column Management */}
                <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700">
                        Graduates
                    </h3>
                    <div className="relative">
                        <button
                            className="flex items-center gap-1 text-xs px-2 py-1 rounded border border-gray-300 hover:bg-gray-100"
                            onClick={() =>
                                setIsColumnMenuOpen(!isColumnMenuOpen)
                            }
                        >
                            Columns <ChevronDown size={14} />
                        </button>

                        {isColumnMenuOpen && (
                            <div className="absolute right-0 top-full mt-1 z-10 bg-white shadow-lg rounded-md border border-gray-200 p-2 w-48">
                                <div className="text-xs font-medium text-gray-700 mb-1 pb-1 border-b border-gray-200">
                                    Show/Hide Columns
                                </div>
                                {columns.map((column) => (
                                    <label
                                        key={column.field}
                                        className="flex items-center gap-2 py-1 text-xs cursor-pointer hover:bg-gray-50 px-1 rounded"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={
                                                visibleColumns[column.field]
                                            }
                                            onChange={() =>
                                                toggleColumnVisibility(
                                                    column.field
                                                )
                                            }
                                            className="rounded text-blue-600 focus:ring-blue-500"
                                        />
                                        {column.headerName}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Table Container */}
                <div className="flex-1 overflow-auto">
                    <table className="min-w-full divide-y divide-gray-200 table-fixed border-collapse">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                            <tr>
                                {columns.map((column) => (
                                    <th
                                        key={column.field}
                                        className={`px-2 py-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 bg-gray-50 whitespace-nowrap sticky top-0 ${
                                            column.isNumeric
                                                ? "text-right"
                                                : "text-left"
                                        }`}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="truncate">
                                                {column.headerName}
                                            </span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedGraduates.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        className="px-3 py-6 text-sm text-center text-gray-500"
                                    >
                                        No graduates found
                                    </td>
                                </tr>
                            ) : (
                                paginatedGraduates.map((graduate, index) => (
                                    <tr
                                        key={graduate.student_id || index}
                                        className={`${
                                            index % 2 === 0
                                                ? "bg-white"
                                                : "bg-gray-50"
                                        } hover:bg-blue-50/30`}
                                    >
                                        {columns.map((column) => (
                                            <td
                                                key={`${graduate.student_id}-${column.field}`}
                                                className={`px-2 py-1.5 text-xs border-r border-gray-200 ${
                                                    column.isNumeric
                                                        ? "text-right"
                                                        : "text-left"
                                                }`}
                                            >
                                                {graduate[column.field] !==
                                                    null &&
                                                graduate[column.field] !==
                                                    undefined
                                                    ? graduate[column.field]
                                                    : "-"}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="px-3 py-2 bg-gray-50 border-t border-gray-200 flex justify-end items-center sticky bottom-0 z-10">
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                        pageSize={rowsPerPage}
                        onPageSizeChange={(newSize) => {
                            setRowsPerPage(newSize);
                            setPage(1); // Reset to first page
                        }}
                        pageSizeOptions={[...ROWS_PER_PAGE_OPTIONS, -1]}
                        showFirstLast={true}
                        showPageSize={true}
                        className="flex justify-end"
                    />
                </div>
            </div>
        </div>
    );
};

GraduatesTable.propTypes = {
    graduates: PropTypes.arrayOf(
        PropTypes.shape({
            student_id: PropTypes.string,
            last_name: PropTypes.string,
            first_name: PropTypes.string,
            middle_name: PropTypes.string,
            sex: PropTypes.oneOf(["M", "F"]),
            date_of_birth: PropTypes.string,
            date_graduated: PropTypes.string,
            program_name: PropTypes.string,
            program_major: PropTypes.string,
            program_authority_to_operate_graduate: PropTypes.string,
            year_granted: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
        })
    ).isRequired,
};

export default GraduatesTable;
