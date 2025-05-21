import { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import AlertComponent from "../../../Components/AlertComponent";
import Pagination from "../../../Components/Pagination";

const ProgramTables = ({ programs, loading, summary }) => {
    const { totalCount } = summary || {};
    const [subTabValue, setSubTabValue] = useState(0);
    const [error, setError] = useState(null);
    const [pageSize, setPageSize] = useState(25);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const savedTab = localStorage.getItem("selectedSubTab");
        if (savedTab !== null) {
            setSubTabValue(Number(savedTab));
        }
    }, []);

    const columnConfigs = useMemo(
        () => ({
            0: {
                // Program details columns
                columns: [
                    {
                        field: "program_name",
                        headerName: "Program Name",
                        minWidth: 300,
                        editable: false,
                    },
                    {
                        field: "program_code",
                        headerName: "Program Code",
                        minWidth: 150,
                        editable: false,
                    },
                    {
                        field: "major_name",
                        headerName: "Major Name",
                        minWidth: 300,
                        editable: false,
                    },
                    {
                        field: "major_code",
                        headerName: "Major Code",
                        minWidth: 150,
                        editable: false,
                    },
                    {
                        field: "category",
                        headerName: "Category",
                        minWidth: 150,
                        editable: false,
                    },
                    {
                        field: "serial",
                        headerName: "Serial",
                        minWidth: 120,
                        editable: false,
                    },
                    {
                        field: "Year",
                        headerName: "Year",
                        minWidth: 120,
                        editable: false,
                    },
                    {
                        field: "is_thesis_dissertation_required",
                        headerName: "Thesis/Dissertation Required",
                        minWidth: 220,
                        editable: false,
                    },
                    {
                        field: "program_status",
                        headerName: "Program Status",
                        minWidth: 150,
                        editable: false,
                    },
                    {
                        field: "calendar_use_code",
                        headerName: "Calendar Use Code",
                        minWidth: 160,
                        editable: false,
                    },
                    {
                        field: "program_normal_length_in_years",
                        headerName: "Program Length (Years)",
                        minWidth: 180,
                        editable: false,
                        type: "number",
                    },
                    {
                        field: "lab_units",
                        headerName: "Laboratory Units",
                        minWidth: 150,
                        editable: false,
                        type: "number",
                    },
                    {
                        field: "lecture_units",
                        headerName: "Lecture Units",
                        minWidth: 150,
                        editable: false,
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
                        editable: false,
                        type: "number",
                    },
                    {
                        field: "program_fee",
                        headerName: "Program Fee",
                        minWidth: 150,
                        editable: false,
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
                        editable: false,
                        type: "number",
                    },
                    {
                        field: "new_students_freshmen_female",
                        headerName: "Freshmen Female",
                        minWidth: 150,
                        editable: false,
                        type: "number",
                    },
                    {
                        field: "1st_year_male",
                        headerName: "1st Year Male",
                        minWidth: 150,
                        editable: false,
                        type: "number",
                    },
                    {
                        field: "1st_year_female",
                        headerName: "1st Year Female",
                        minWidth: 150,
                        editable: false,
                        type: "number",
                    },
                    {
                        field: "2nd_year_male",
                        headerName: "2nd Year Male",
                        minWidth: 150,
                        editable: false,
                        type: "number",
                    },
                    {
                        field: "2nd_year_female",
                        headerName: "2nd Year Female",
                        minWidth: 150,
                        editable: false,
                        type: "number",
                    },
                    {
                        field: "3rd_year_male",
                        headerName: "3rd Year Male",
                        minWidth: 150,
                        editable: false,
                        type: "number",
                    },
                    {
                        field: "3rd_year_female",
                        headerName: "3rd Year Female",
                        minWidth: 150,
                        editable: false,
                        type: "number",
                    },
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
                ],
                columnGroups: [
                    {
                        id: "program",
                        headerName: "Program",
                        columns: ["program_name"],
                    },
                    {
                        id: "freshmen",
                        headerName: "Freshmen",
                        columns: ["new_students_freshmen_male", "new_students_freshmen_female"],
                    },
                    {
                        id: "first_year",
                        headerName: "First Year",
                        columns: ["1st_year_male", "1st_year_female"],
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
                    {
                        id: "subtotal",
                        headerName: "Subtotal",
                        columns: ["subtotal_male", "subtotal_female"],
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

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setCurrentPage(1);
    };

    const renderCell = (row, column) => {
        const value = row[column.field];
        return (
            <div className="px-4 py-2">
                {column.type === "number" ? (
                    <span className="text-right block">{value}</span>
                ) : (
                    <span>{value}</span>
                )}
            </div>
        );
    };

    const renderTable = () => {
        const config = columnConfigs[subTabValue];
        if (!config) return null;

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {config.columns.map((column) => (
                                <th
                                    key={column.field}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.headerName}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {programs.map((row, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-gray-50">
                                {config.columns.map((column) => (
                                    <td
                                        key={column.field}
                                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                    >
                                        {renderCell(row, column)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow">
            {error && (
                <AlertComponent
                    type="error"
                    message={error}
                    onClose={() => setError(null)}
                />
            )}
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-4">
                        <select
                            value={pageSize}
                            onChange={handlePageSizeChange}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={10}>10 per page</option>
                            <option value={25}>25 per page</option>
                            <option value={50}>50 per page</option>
                            <option value={100}>100 per page</option>
                        </select>
                    </div>
                </div>
                {renderTable()}
                <div className="mt-4">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(totalCount / pageSize)}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </div>
    );
};

ProgramTables.propTypes = {
    programs: PropTypes.arrayOf(PropTypes.object).isRequired,
    loading: PropTypes.bool,
    summary: PropTypes.shape({
        totalCount: PropTypes.number,
    }),
};

export default ProgramTables;
