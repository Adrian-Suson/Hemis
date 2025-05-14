import { useState, useMemo, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import config from "../../../utils/config";
import { X } from "lucide-react";
import AlertComponent from "../../../Components/AlertComponent";
import Pagination from "../../../Components/Pagination";

const ProgramTables = ({ programs, loading, fetchPrograms, summary }) => {
    const { currentCount, totalCount, searchTerm } = summary || {};
    const [subTabValue, setSubTabValue] = useState(0);
    const [error, setError] = useState(null);
    const [pageSize, setPageSize] = useState(25);
    const [currentPage, setCurrentPage] = useState(1);
    const [editingCell, setEditingCell] = useState(null);
    const [editValue, setEditValue] = useState("");

    useEffect(() => {
        const savedTab = localStorage.getItem("selectedSubTab");
        if (savedTab !== null) {
            setSubTabValue(Number(savedTab));
        }
    }, []);

    // Data validation function aligned with backend

    const columnConfigs = useMemo(
        () => ({
            0: {
                // Program details columns
                columns: [
                    {
                        field: "program_name",
                        headerName: "Program Name",
                        minWidth: 300,
                        editable: true,
                    },
                    {
                        field: "program_code",
                        headerName: "Program Code",
                        minWidth: 150,
                        editable: true,
                    },
                    {
                        field: "major_name",
                        headerName: "Major Name",
                        minWidth: 300,
                        editable: true,
                    },
                    {
                        field: "major_code",
                        headerName: "Major Code",
                        minWidth: 150,
                        editable: true,
                    },
                    {
                        field: "category",
                        headerName: "Category",
                        minWidth: 150,
                        editable: true,
                    },
                    {
                        field: "serial",
                        headerName: "Serial",
                        minWidth: 120,
                        editable: true,
                    },
                    {
                        field: "Year",
                        headerName: "Year",
                        minWidth: 120,
                        editable: true,
                    },
                    {
                        field: "is_thesis_dissertation_required",
                        headerName: "Thesis/Dissertation Required",
                        minWidth: 220,
                        editable: true,
                    },
                    {
                        field: "program_status",
                        headerName: "Program Status",
                        minWidth: 150,
                        editable: true,
                    },
                    {
                        field: "calendar_use_code",
                        headerName: "Calendar Use Code",
                        minWidth: 160,
                        editable: true,
                    },
                    {
                        field: "program_normal_length_in_years",
                        headerName: "Program Length (Years)",
                        minWidth: 180,
                        editable: true,
                        type: "number",
                    },
                    {
                        field: "lab_units",
                        headerName: "Laboratory Units",
                        minWidth: 150,
                        editable: true,
                        type: "number",
                    },
                    {
                        field: "lecture_units",
                        headerName: "Lecture Units",
                        minWidth: 150,
                        editable: true,
                        type: "number",
                    },
                    {
                        field: "total_units",
                        headerName: "Total Units",
                        minWidth: 150,
                        editable: false,
                        type: "number",
                    },
                    {
                        field: "tuition_per_unit",
                        headerName: "Tuition Per Unit",
                        minWidth: 150,
                        editable: true,
                        type: "number",
                    },
                    {
                        field: "program_fee",
                        headerName: "Program Fee",
                        minWidth: 150,
                        editable: true,
                        type: "number",
                    },
                ],
                // Column groupings for visual organization
                columnGroups: [
                    {
                        id: "program",
                        headerName: "Curricular Program",
                        columns: ["program_name", "program_code"],
                    },
                    {
                        id: "major",
                        headerName: "Major",
                        columns: ["major_name", "major_code"],
                    },
                    {
                        id: "authority",
                        headerName: "Authority to Offer Program",
                        columns: ["category", "serial", "Year"],
                    },
                    {
                        id: "status",
                        headerName: "",
                        columns: [
                            "is_thesis_dissertation_required",
                            "program_status",
                            "calendar_use_code",
                            "program_normal_length_in_years",
                        ],
                    },
                    {
                        id: "units",
                        headerName: "Program Units Excluding Thesis",
                        columns: ["lab_units", "lecture_units", "total_units"],
                    },
                    {
                        id: "financial",
                        headerName: "Financial Information",
                        columns: ["tuition_per_unit", "program_fee"],
                    },
                ],
            },
            1: {
                // Enrollment columns
                columns: [
                    {
                        field: "program_name",
                        headerName: "Program Name",
                        minWidth: 300,
                        editable: false,
                    },
                    {
                        field: "new_students_freshmen_male",
                        headerName: "Freshmen Male",
                        minWidth: 150,
                        editable: true,
                        type: "number",
                    },
                    {
                        field: "new_students_freshmen_female",
                        headerName: "Freshmen Female",
                        minWidth: 150,
                        editable: true,
                        type: "number",
                    },
                    {
                        field: "1st_year_male",
                        headerName: "1st Year Male",
                        minWidth: 150,
                        editable: true,
                        type: "number",
                    },
                    {
                        field: "1st_year_female",
                        headerName: "1st Year Female",
                        minWidth: 150,
                        editable: true,
                        type: "number",
                    },
                    {
                        field: "2nd_year_male",
                        headerName: "2nd Year Male",
                        minWidth: 150,
                        editable: true,
                        type: "number",
                    },
                    {
                        field: "2nd_year_female",
                        headerName: "2nd Year Female",
                        minWidth: 150,
                        editable: true,
                        type: "number",
                    },
                    {
                        field: "3rd_year_male",
                        headerName: "3rd Year Male",
                        minWidth: 150,
                        editable: true,
                        type: "number",
                    },
                    {
                        field: "3rd_year_female",
                        headerName: "3rd Year Female",
                        minWidth: 150,
                        editable: true,
                        type: "number",
                    },
                    // Additional enrollment columns would be included here
                    {
                        field: "subtotal_male",
                        headerName: "Subtotal Male",
                        minWidth: 150,
                        editable: false,
                        type: "number",
                    },
                    {
                        field: "subtotal_female",
                        headerName: "Subtotal Female",
                        minWidth: 150,
                        editable: false,
                        type: "number",
                    },
                    {
                        field: "grand_total",
                        headerName: "Grand Total",
                        minWidth: 150,
                        editable: false,
                        type: "number",
                    },
                ],
                // Column groupings
                columnGroups: [
                    {
                        id: "name",
                        headerName: "Program Name",
                        columns: ["program_name"],
                    },
                    {
                        id: "first_year",
                        headerName: "First Year",
                        columns: [
                            "new_students_freshmen_male",
                            "new_students_freshmen_female",
                            "1st_year_male",
                            "1st_year_female",
                        ],
                    },
                    {
                        id: "second_year",
                        headerName: "Second Year",
                        columns: ["2nd_year_male", "2nd_year_female"],
                    },
                    {
                        id: "third_year",
                        headerName: "Third Year",
                        columns: ["3rd_year_male", "3rd_year_female"],
                    },
                    // Additional groupings would be included here
                    {
                        id: "totals",
                        headerName: "Totals",
                        columns: [
                            "subtotal_male",
                            "subtotal_female",
                            "grand_total",
                        ],
                    },
                ],
            },
            2: {
                // Statistics columns
                columns: [
                    {
                        field: "program_name",
                        headerName: "Program Name",
                        minWidth: 300,
                        editable: false,
                    },
                    {
                        field: "lecture_units_actual",
                        headerName: "Lecture Units Actual",
                        minWidth: 180,
                        editable: true,
                        type: "number",
                    },
                    {
                        field: "laboratory_units_actual",
                        headerName: "Laboratory Units Actual",
                        minWidth: 180,
                        editable: true,
                        type: "number",
                    },
                    {
                        field: "total_units_actual",
                        headerName: "Total Units Actual",
                        minWidth: 180,
                        editable: false,
                        type: "number",
                    },
                    {
                        field: "graduates_males",
                        headerName: "Graduates Male",
                        minWidth: 150,
                        editable: true,
                        type: "number",
                    },
                    {
                        field: "graduates_females",
                        headerName: "Graduates Female",
                        minWidth: 150,
                        editable: true,
                        type: "number",
                    },
                    {
                        field: "graduates_total",
                        headerName: "Graduates Total",
                        minWidth: 150,
                        editable: false,
                        type: "number",
                    },
                    {
                        field: "externally_funded_merit_scholars",
                        headerName: "Externally Funded Scholars",
                        minWidth: 220,
                        editable: true,
                        type: "number",
                    },
                    {
                        field: "internally_funded_grantees",
                        headerName: "Internally Funded Grantees",
                        minWidth: 220,
                        editable: true,
                        type: "number",
                    },
                    {
                        field: "suc_funded_grantees",
                        headerName: "SUC Funded Grantees",
                        minWidth: 220,
                        editable: true,
                        type: "number",
                    },
                ],
                // Column groupings
                columnGroups: [
                    {
                        id: "name",
                        headerName: "Program Name",
                        columns: ["program_name"],
                    },
                    {
                        id: "units",
                        headerName: "Units",
                        columns: [
                            "lecture_units_actual",
                            "laboratory_units_actual",
                            "total_units_actual",
                        ],
                    },
                    {
                        id: "graduates",
                        headerName: "Graduates",
                        columns: [
                            "graduates_males",
                            "graduates_females",
                            "graduates_total",
                        ],
                    },
                    {
                        id: "scholars",
                        headerName: "Scholars & Grantees",
                        columns: [
                            "externally_funded_merit_scholars",
                            "internally_funded_grantees",
                            "suc_funded_grantees",
                        ],
                    },
                ],
            },
        }),
        []
    );

    const handleCellEdit = useCallback(
        async (id, field, value) => {
            if (!editingCell) return;
            setEditingCell(null);

            const token = localStorage.getItem("token");
            if (!token) {
                AlertComponent.showAlert(
                    "Authentication token is missing. Please log in again.",
                    "error"
                );
                return;
            }

            const updatedPrograms = [...programs];
            const programIndex = updatedPrograms.findIndex((p) => p.id === id);
            if (programIndex === -1) {
                AlertComponent.showAlert(
                    `Program with id ${id} not found.`,
                    "error"
                );
                return;
            }

            updatedPrograms[programIndex][field] = value;

            try {
                await axios.put(
                    `${config.API_URL}/programs/${id}`,
                    updatedPrograms[programIndex],
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                fetchPrograms();
                AlertComponent.showAlert(
                    "Program updated successfully",
                    "success"
                );
            } catch (error) {
                console.error("Error updating program:", error);
                AlertComponent.showAlert(
                    error.response?.data?.error ||
                        "Failed to update program. Changes have been reverted.",
                    "error"
                );
            }
        },
        [programs, fetchPrograms, editingCell]
    );

    // Get current page of data
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return programs.slice(startIndex, endIndex);
    }, [programs, currentPage, pageSize]);

    // Total pages calculation
    const totalPages = Math.ceil(programs.length / pageSize);

    // Get current columns and groups based on active tab
    const currentConfig = columnConfigs[subTabValue] || columnConfigs[0];

    // Get all column fields from current column groups
    const getColumnFieldsFromGroups = () => {
        const fields = [];
        currentConfig.columnGroups.forEach((group) => {
            fields.push(...group.columns);
        });
        return fields;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="mt-4 relative">
            {/* Error Alert */}
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md flex justify-between items-center">
                    <p className="text-red-700 text-sm">{error}</p>
                    <button
                        onClick={() => setError(null)}
                        className="text-red-500 hover:text-red-700"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
            )}

            {/* Tabs */}
            <div className="flex border-b border-gray-300 mb-4 bg-white rounded-t-md overflow-hidden">
                {["Programs", "Enrollments", "Statistics"].map((tab, index) => (
                    <button
                        key={tab}
                        onClick={() => {
                            setSubTabValue(index);
                            localStorage.setItem("selectedSubTab", index);
                        }}
                        className={`flex-1 py-3 px-4 text-sm font-medium text-center transition-colors ${
                            subTabValue === index
                                ? "border-b-2 border-blue-600 text-blue-600 bg-blue-50/50"
                                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                        }`}
                        aria-selected={subTabValue === index}
                        role="tab"
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Summary */}
            <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                <p className="text-xs text-gray-600">
                    <span className="font-medium">{currentCount}</span> of{" "}
                    <span className="font-medium">{totalCount}</span> programs
                    {searchTerm && (
                        <span className="hidden sm:inline">
                            {" matching "}
                            <strong>&#34;{searchTerm}&#34;</strong>
                        </span>
                    )}
                </p>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden mb-3 max-h-[45vh] overflow-y-auto">
                <div className="overflow-x-auto max-h-[40vh] h-[40vh] relative">
                    {/* Column Group Headers */}
                    <div className="sticky top-0 z-20 bg-white shadow-sm">
                        <div className="flex border-b border-gray-200">
                            {currentConfig.columnGroups.map((group) => {
                                const groupWidth = group.columns.reduce(
                                    (acc, field) => {
                                        const col = currentConfig.columns.find(
                                            (c) => c.field === field
                                        );
                                        return acc + (col?.minWidth || 100);
                                    },
                                    0
                                );

                                return (
                                    <div
                                        key={group.id}
                                        className="px-3 py-2 text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 bg-gray-100/80 text-center flex items-center justify-center"
                                        style={{
                                            minWidth: groupWidth,
                                            width: groupWidth,
                                        }}
                                        title={group.headerName}
                                        role="columnheader"
                                    >
                                        <span className="truncate">
                                            {group.headerName}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Column Headers */}
                        <div className="flex bg-gray-50 border-b border-gray-200 shadow-sm">
                            {getColumnFieldsFromGroups().map((field) => {
                                const column = currentConfig.columns.find(
                                    (col) => col.field === field
                                );
                                const isNumeric = column?.type === "number";

                                return (
                                    <div
                                        key={field}
                                        className={`px-3 py-2 text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200 bg-gray-50 ${
                                            isNumeric
                                                ? "text-right"
                                                : "text-left"
                                        }`}
                                        style={{
                                            width: column?.minWidth || 100,
                                            minWidth: column?.minWidth || 100,
                                        }}
                                        title={column?.headerName || field}
                                        role="columnheader"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="truncate">
                                                {column?.headerName || field}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Table Body */}
                    <div className="bg-white" role="rowgroup">
                        {paginatedData.length === 0 ? (
                            <div className="text-center py-12 text-gray-500 bg-gray-50/50 max-h-[46vh] h-[46vh] italic">
                                No programs found matching your criteria
                            </div>
                        ) : (
                            paginatedData.map((row, rowIndex) => (
                                <div
                                    key={row.id}
                                    className={`flex border-b border-gray-200 ${
                                        rowIndex % 2 === 0
                                            ? "bg-white"
                                            : "bg-gray-50/50"
                                    } hover:bg-blue-50/40 transition-colors duration-150`}
                                    role="row"
                                >
                                    {getColumnFieldsFromGroups().map(
                                        (field) => {
                                            const column =
                                                currentConfig.columns.find(
                                                    (col) => col.field === field
                                                );
                                            const isEditing =
                                                editingCell?.id === row.id &&
                                                editingCell?.field === field;
                                            const cellValue =
                                                row[field] !== undefined &&
                                                row[field] !== null
                                                    ? row[field]
                                                    : "-";
                                            const isNumeric =
                                                column?.type === "number";
                                            const isEditable = column?.editable;

                                            return (
                                                <div
                                                    key={`${row.id}-${field}`}
                                                    className={`px-3 py-2 text-sm border-r border-gray-200 ${
                                                        isNumeric
                                                            ? "text-right"
                                                            : "text-left"
                                                    } ${
                                                        isEditable
                                                            ? "cursor-pointer group relative"
                                                            : ""
                                                    }`}
                                                    style={{
                                                        width:
                                                            column?.minWidth ||
                                                            100,
                                                        minWidth:
                                                            column?.minWidth ||
                                                            100,
                                                    }}
                                                    onClick={() => {
                                                        if (isEditable) {
                                                            setEditingCell({
                                                                id: row.id,
                                                                field,
                                                            });
                                                            setEditValue(
                                                                row[field] !==
                                                                    null
                                                                    ? String(
                                                                          row[
                                                                              field
                                                                          ]
                                                                      )
                                                                    : ""
                                                            );
                                                        }
                                                    }}
                                                    role="cell"
                                                    aria-colindex={
                                                        getColumnFieldsFromGroups().indexOf(
                                                            field
                                                        ) + 1
                                                    }
                                                    title={
                                                        isEditable
                                                            ? `Click to edit ${column?.headerName}`
                                                            : undefined
                                                    }
                                                >
                                                    {isEditing ? (
                                                        <div className="flex items-center">
                                                            <input
                                                                type={
                                                                    isNumeric
                                                                        ? "number"
                                                                        : "text"
                                                                }
                                                                value={
                                                                    editValue
                                                                }
                                                                onChange={(e) =>
                                                                    setEditValue(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                onBlur={() =>
                                                                    handleCellEdit(
                                                                        row.id,
                                                                        field,
                                                                        isNumeric
                                                                            ? Number(
                                                                                  editValue
                                                                              )
                                                                            : editValue
                                                                    )
                                                                }
                                                                onKeyDown={(
                                                                    e
                                                                ) => {
                                                                    if (
                                                                        e.key ===
                                                                        "Enter"
                                                                    ) {
                                                                        handleCellEdit(
                                                                            row.id,
                                                                            field,
                                                                            isNumeric
                                                                                ? Number(
                                                                                      editValue
                                                                                  )
                                                                                : editValue
                                                                        );
                                                                    } else if (
                                                                        e.key ===
                                                                        "Escape"
                                                                    ) {
                                                                        setEditingCell(
                                                                            null
                                                                        );
                                                                    }
                                                                }}
                                                                className="w-full px-2 py-1 text-sm border border-blue-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                autoFocus
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div
                                                            className={`truncate ${
                                                                isEditable
                                                                    ? "group-hover:bg-blue-100/60 group-hover:rounded px-1 py-0.5 transition-colors duration-150"
                                                                    : ""
                                                            }`}
                                                        >
                                                            {isNumeric &&
                                                            cellValue !== "-"
                                                                ? Number(
                                                                      cellValue
                                                                  ).toLocaleString()
                                                                : cellValue}

                                                            {isEditable && (
                                                                <span className="text-blue-500 opacity-0 group-hover:opacity-100 ml-1 inline-flex">
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="h-3.5 w-3.5"
                                                                        viewBox="0 0 20 20"
                                                                        fill="currentColor"
                                                                    >
                                                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                                    </svg>
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Add a shadow at the bottom if there's more content to scroll */}
                    <div className="sticky bottom-0 h-1 w-full bg-gradient-to-t from-gray-200/80 to-transparent pointer-events-none"></div>
                </div>
            </div>
            {/* Pagination Controls */}
            <div className="flex justify-end my-4">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    pageSize={pageSize}
                    onPageSizeChange={setPageSize}
                    pageSizeOptions={[10, 25, 50, 100]}
                    showFirstLast={true}
                    showPageSize={true}
                />
            </div>
        </div>
    );
};

ProgramTables.propTypes = {
    programs: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            program_name: PropTypes.string.isRequired,
            // Other prop types omitted for brevity
        })
    ).isRequired,
    loading: PropTypes.bool.isRequired,
    fetchPrograms: PropTypes.func,
    summary: PropTypes.shape({
        currentCount: PropTypes.number,
        totalCount: PropTypes.number,
        searchTerm: PropTypes.string,
    }),
};

export default ProgramTables;
