/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import AddCampusDialog from "./AddCampusDialog";
import EditCampusFormDialog from "./EditCampusFormDialog";
import config from "../../../utils/config";
import { useLoading } from "../../../Context/LoadingContext";
import { FilePenLine, Plus, Trash2 } from "lucide-react";
import AlertComponent from "../../../Components/AlertComponent";
import useActivityLog from "../../../Hooks/useActivityLog"; // Import the hook

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];

const CampusDataGrid = ({ campuses: initialCampuses, fetchCampuses }) => {
    const { createLog } = useActivityLog(); // Use the hook
    const [campuses, setCampuses] = useState(initialCampuses);
    const { showLoading, hideLoading } = useLoading();
    const [tabValue, setTabValue] = useState(0);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editCampusData, setEditCampusData] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);

    // Initialize campuses
    useEffect(() => {
        console.log("initialCampuses:", initialCampuses);
        setCampuses((prevCampuses) => {
            if (
                prevCampuses.length === 0 ||
                initialCampuses.length > prevCampuses.length
            ) {
                return initialCampuses;
            }
            return prevCampuses;
        });
    }, [initialCampuses]);

    const allColumns = useMemo(
        () => [
            {
                field: "suc_name",
                headerName: "Campus Name",
                minWidth: 200,
                flex: 2,
                renderCell: (params) =>
                    params.value !== null && params.value !== ""
                        ? params.value
                        : "-",
            },
            {
                field: "campus_type",
                headerName: "Type",
                minWidth: 120,
                flex: 1,
                renderCell: (params) =>
                    params.value !== null && params.value !== ""
                        ? params.value
                        : "-",
            },
            {
                field: "institutional_code",
                headerName: "Code",
                minWidth: 120,
                flex: 1,
                renderCell: (params) =>
                    params.value !== null && params.value !== ""
                        ? params.value
                        : "-",
            },
            {
                field: "region",
                headerName: "Region",
                minWidth: 150,
                flex: 1,
                renderCell: (params) =>
                    params.value !== null && params.value !== ""
                        ? params.value
                        : "-",
            },
            {
                field: "province_municipality",
                headerName: "Municipal/City and Province",
                minWidth: 200,
                flex: 1,
                renderCell: (params) =>
                    params.value !== null && params.value !== ""
                        ? params.value
                        : "-",
            },
            {
                field: "former_name",
                headerName: "Former Name",
                minWidth: 200,
                flex: 1,
                renderCell: (params) =>
                    params.value !== null && params.value !== ""
                        ? params.value
                        : "-",
            },
            {
                field: "year_first_operation",
                headerName: "Established",
                minWidth: 120,
                flex: 1,
                align: "center",
                headerAlign: "center",
                renderCell: (params) =>
                    params.value !== null && params.value !== ""
                        ? params.value
                        : "-",
            },
            {
                field: "land_area_hectares",
                headerName: "Land Area (ha)",
                minWidth: 150,
                flex: 1,
                align: "center",
                headerAlign: "center",
                renderCell: (params) =>
                    params.value !== null ? params.value : "-",
            },
            {
                field: "distance_from_main",
                headerName: "Distance (km)",
                minWidth: 150,
                flex: 1,
                align: "center",
                headerAlign: "center",
                renderCell: (params) =>
                    params.value !== null && params.value !== ""
                        ? params.value
                        : "-",
            },
            {
                field: "autonomous_code",
                headerName: "Auto Code",
                minWidth: 120,
                flex: 1,
                renderCell: (params) =>
                    params.value !== null && params.value !== ""
                        ? params.value
                        : "-",
            },
            {
                field: "position_title",
                headerName: "Position",
                minWidth: 150,
                flex: 1,
                renderCell: (params) =>
                    params.value !== null && params.value !== ""
                        ? params.value
                        : "-",
            },
            {
                field: "head_full_name",
                headerName: "Head",
                minWidth: 200,
                flex: 1,
                renderCell: (params) =>
                    params.value !== null && params.value !== ""
                        ? params.value
                        : "-",
            },
            {
                field: "latitude_coordinates",
                headerName: "Latitude",
                minWidth: 150,
                flex: 1,
                align: "center",
                headerAlign: "center",
                renderCell: (params) =>
                    params.value !== null && params.value !== ""
                        ? params.value
                        : "-",
            },
            {
                field: "longitude_coordinates",
                headerName: "Longitude",
                minWidth: 150,
                flex: 1,
                align: "center",
                headerAlign: "center",
                renderCell: (params) =>
                    params.value !== null && params.value !== ""
                        ? params.value
                        : "-",
            },
            {
                field: "actions",
                headerName: "Actions",
                minWidth: 150,
                flex: 1,
                align: "center",
                headerAlign: "center",
                renderCell: (params) => (
                    /* More modern, accessible action buttons */
                    <div className="flex items-center justify-center gap-2">
                        <button
                            onClick={() => handleEditClick(params.row)}
                            className="p-1.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors shadow-sm border border-blue-200"
                            title="Edit record"
                            aria-label="Edit"
                        >
                            <FilePenLine className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => handleDeleteClick(params.row.id)}
                            className="p-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors shadow-sm border border-red-200"
                            title="Delete record"
                            aria-label="Delete"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ),
            },
        ],
        []
    );

    const tabbedColumns = useMemo(
        () => ({
            basic: [allColumns[0], ...allColumns.slice(1, 7), allColumns[14]],
            metrics: [
                allColumns[0],
                ...allColumns.slice(7, 10),
                allColumns[14],
            ],
            leadership: [
                allColumns[0],
                ...allColumns.slice(10, 12),
                allColumns[14],
            ],
            coordinates: [
                allColumns[0],
                ...allColumns.slice(12, 14),
                allColumns[14],
            ],
        }),
        [allColumns]
    );

    const data = useMemo(() => {
        const rows = campuses.map((campus, index) => ({
            id: campus.id ? String(campus.id) : `temp-${index}`,
            suc_name: campus.suc_name || "",
            campus_type: campus.campus_type || "",
            institutional_code: campus.institutional_code || "",
            region: campus.region || "",
            province_municipality: campus.province_municipality || "",
            former_name: campus.former_name || "",
            year_first_operation: campus.year_first_operation || "",
            land_area_hectares: campus.land_area_hectares || 0.0,
            distance_from_main: campus.distance_from_main || 0.0,
            autonomous_code: campus.autonomous_code || "",
            position_title: campus.position_title || "",
            head_full_name: campus.head_full_name || "",
            latitude_coordinates: campus.latitude_coordinates || 0.0,
            longitude_coordinates: campus.longitude_coordinates || 0.0,
            institution_id: campus.institution_id || "",
        }));
        console.log("Table rows:", rows);
        return rows;
    }, [campuses]);

    const handleEditClick = useCallback(async (row) => {
        try {
            console.log("Edit clicked:", row);
            setEditCampusData(row);
            setOpenEditDialog(true);
            await createLog({
                action: "Edit Campus",
                description: `Opened edit dialog for campus: ${row.suc_name}`,
            });
        } catch (error) {
            console.error("Error logging activity:", error);
        }
    }, []);

    const handleDeleteClick = useCallback(
        async (campusId) => {
            try {
                console.log("Delete clicked:", campusId);
                AlertComponent.showConfirmation(
                    "Do you really want to delete this campus? This action cannot be undone.",
                    async () => {
                        showLoading();
                        const token = localStorage.getItem("token");
                        if (!token) {
                            AlertComponent.showAlert(
                                "Authentication token is missing.",
                                "error"
                            );
                            hideLoading();
                            return;
                        }

                        try {
                            if (!campusId.startsWith("temp-")) {
                                await axios.delete(
                                    `${config.API_URL}/campuses/${campusId}`,
                                    {
                                        headers: {
                                            Authorization: `Bearer ${token}`,
                                        },
                                    }
                                );
                            }

                            const updatedCampuses = campuses.filter(
                                (campus) =>
                                    String(campus.id) !== campusId &&
                                    `temp-${campuses.indexOf(campus)}` !==
                                        campusId
                            );
                            setCampuses(updatedCampuses);

                            await createLog({
                                action: "Delete Campus",
                                description: `Deleted campus with ID: ${campusId}`,
                            });

                            AlertComponent.showAlert(
                                "Campus deleted successfully!",
                                "success"
                            );
                        } catch (error) {
                            console.error("Error deleting campus:", error);
                            let errorMessage = "Failed to delete campus.";
                            if (error.response) {
                                errorMessage = `Error: ${
                                    error.response.data.message ||
                                    error.response.data.errors?.join("; ") ||
                                    error.message
                                }`;
                            }
                            AlertComponent.showAlert(errorMessage, "error");
                        } finally {
                            hideLoading();
                        }
                    },
                    () => {
                        console.log("Deletion cancelled");
                    }
                );
            } catch (error) {
                console.error("Error logging activity:", error);
                AlertComponent.showAlert("Failed to log activity.", "error");
            }
        },
        [campuses]
    );

    const handleOpenAddDialog = () => setOpenAddDialog(true);
    const handleCloseAddDialog = () => setOpenAddDialog(false);
    const handleCloseEditDialog = () => setOpenEditDialog(false);

    const handleAddCampus = async (newCampusData) => {
        try {
            setCampuses((prev) => [...prev, newCampusData]);
            AlertComponent.showAlert("Campus added successfully!", "success");
        } catch (error) {
            console.error("Error logging activity:", error);
            AlertComponent.showAlert("Failed to log activity.", "error");
        }
        handleCloseAddDialog();
    };

    const handleTabChange = (newValue) => {
        setTabValue(newValue);
        setPage(0); // Reset to first page on tab change
    };

    const currentColumns = useMemo(() => {
        switch (tabValue) {
            case 0:
                return tabbedColumns.basic;
            case 1:
                return tabbedColumns.metrics;
            case 2:
                return tabbedColumns.leadership;
            case 3:
                return tabbedColumns.coordinates;
            default:
                return tabbedColumns.basic;
        }
    }, [tabValue, tabbedColumns]);

    const paginatedRows = useMemo(() => {
        const start = page * rowsPerPage;
        return data.slice(start, start + rowsPerPage);
    }, [data, page, rowsPerPage]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <div className="my-4 flex flex-col h-full">
            {/* Toolbar */}
            <div className="flex justify-between items-center bg-gray-100 border-b border-gray-300 mb-4 sm:pl-4 px-2 py-2">
                <h1 className="text-2xl font-medium">Campus Management</h1>
                <button
                    onClick={handleOpenAddDialog}
                    className="group relative flex items-center justify-center px-5 py-3 bg-[#0038A8] text-white rounded-md font-medium shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#0038A8] focus:ring-offset-2 transition-all duration-200 overflow-hidden w-full sm:w-auto"
                >
                    {/* Animated ray inspired by sun rays */}
                    <div className="absolute inset-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="h-full w-16 bg-gradient-to-b from-[#FCD116]/40 via-transparent to-transparent rotate-12 transform translate-x-6 group-hover:translate-x-32 transition-transform duration-1000"></div>
                        <div className="h-full w-8 bg-gradient-to-b from-[#FCD116]/30 via-transparent to-transparent -rotate-12 transform -translate-x-6 group-hover:translate-x-32 transition-transform duration-700 delay-100"></div>
                    </div>

                    {/* Red triangle accent */}
                    <div className="absolute bottom-0 left-0 h-1.5 w-full bg-[#CD0000] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>

                    <div className="bg-[#FCD116] rounded-full p-1 mr-2 flex items-center justify-center relative z-10">
                        <Plus className="w-3.5 h-3.5 text-[#0038A8]" />
                    </div>
                    <span className="relative z-10 text-sm">Add Campus</span>
                </button>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-lg mb-4 flex flex-col xs:h-[70vh] sm:h-[65vh] md:h-[60vh] xs:max-w-[99vw] sm:max-w-[95vw] md:max-w-[95vw] overflow-x-auto overflow-y-hidden shadow-md">
                {/* Tabs */}
                <div className="flex border-b border-gray-300 overflow-x-auto hide-scrollbar shrink-0 mb-3">
                    {["Basic Info", "Metrics", "Leadership", "Coordinates"].map(
                        (label, index) => (
                            <button
                                key={label}
                                onClick={() => handleTabChange(index)}
                                className={`flex-1 min-w-[120px] py-3 px-4 text-sm font-medium text-center transition-all relative ${
                                    tabValue === index
                                        ? "text-blue-700 bg-blue-50/50"
                                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                                }`}
                                aria-selected={tabValue === index}
                                role="tab"
                                aria-controls={`tab-panel-${index}`}
                                id={`tab-${index}`}
                            >
                                {label}
                                {tabValue === index && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-700"></div>
                                )}
                            </button>
                        )
                    )}
                </div>

                {/* Table */}
                <div className="flex-1 overflow-auto">
                    <table className="w-full min-w-[800px] border-collapse">
                        <thead className="sticky top-0 bg-gray-100 z-10 border-b border-gray-300">
                            <tr>
                                {currentColumns.map((column) => (
                                    <th
                                        key={column.field}
                                        className={`px-4 py-3 text-sm font-semibold text-gray-800 border-r border-gray-300 text-${
                                            column.align || "left"
                                        } whitespace-normal break-words`}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.headerName}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedRows.map((row, index) => (
                                <tr
                                    key={row.id}
                                    className={`border-b border-gray-300 ${
                                        index % 2 === 0
                                            ? "bg-white"
                                            : "bg-gray-50"
                                    } hover:bg-gray-100 transition-colors`}
                                >
                                    {currentColumns.map((column) => (
                                        <td
                                            key={column.field}
                                            className={`px-4 py-3 text-sm text-gray-800 border-r border-gray-300 text-${
                                                column.align || "left"
                                            } whitespace-normal break-words`}
                                        >
                                            {column.renderCell({
                                                value: row[column.field],
                                                row,
                                            })}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-end items-center p-4 border-t border-gray-300 bg-white sticky bottom-0 z-10">
                    <div className="flex items-center space-x-4 text-sm">
                        <span>Rows per page:</span>
                        <select
                            value={rowsPerPage}
                            onChange={handleRowsPerPageChange}
                            className="border border-gray-300 rounded px-2 py-1"
                        >
                            {ROWS_PER_PAGE_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        <span className="text-gray-600">
                            {page * rowsPerPage + 1}-
                            {Math.min((page + 1) * rowsPerPage, data.length)} of{" "}
                            {data.length}
                        </span>
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 0}
                            className="px-2 py-1 rounded bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-50 transition-colors"
                        >
                            ←
                        </button>
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={(page + 1) * rowsPerPage >= data.length}
                            className="px-2 py-1 rounded bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-50 transition-colors"
                        >
                            →
                        </button>
                    </div>
                </div>
            </div>

            {/* Dialogs */}
            <AddCampusDialog
                open={openAddDialog}
                onClose={handleCloseAddDialog}
                onAddCampus={handleAddCampus}
                initialRegion={campuses[0]?.region || ""}
                alertComponent={AlertComponent} // Pass AlertComponent
            />
            <EditCampusFormDialog
                open={openEditDialog}
                onClose={handleCloseEditDialog}
                campusData={editCampusData}
                setCampuses={setCampuses}
                fetchCampuses={fetchCampuses}
                campusId={editCampusData?.id || null}
                alertComponent={AlertComponent} // Pass AlertComponent
            />
        </div>
    );
};

CampusDataGrid.propTypes = {
    campuses: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            suc_name: PropTypes.string,
            campus_type: PropTypes.string,
            institutional_code: PropTypes.string,
            region: PropTypes.string,
            province_municipality: PropTypes.string,
            former_name: PropTypes.string,
            year_first_operation: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
            land_area_hectares: PropTypes.number,
            distance_from_main: PropTypes.number,
            autonomous_code: PropTypes.string,
            position_title: PropTypes.string,
            head_full_name: PropTypes.string,
            latitude_coordinates: PropTypes.number,
            longitude_coordinates: PropTypes.number,
            institution_id: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
        })
    ).isRequired,
    fetchCampuses: PropTypes.func,
};

export default CampusDataGrid;
