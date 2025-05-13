/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import AddCampusDialog from "./AddCampusDialog";
import EditCampusFormDialog from "./EditCampusFormDialog";
import config from "../../../utils/config";
import { useLoading } from "../../../Context/LoadingContext";

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];

const CampusDataGrid = ({ campuses: initialCampuses }) => {
    const [campuses, setCampuses] = useState(initialCampuses);
    const { showLoading, hideLoading } = useLoading();
    const [tabValue, setTabValue] = useState(0);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editCampusData, setEditCampusData] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
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
                    <div className="flex justify-center space-x-2">
                        <button
                            onClick={() => handleEditClick(params.row)}
                            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                            title="Edit"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDeleteClick(params.row.id)}
                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                            title="Delete"
                        >
                            Delete
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

    const handleEditClick = useCallback((row) => {
        console.log("Edit clicked:", row);
        setEditCampusData(row);
        setOpenEditDialog(true);
    }, []);

    const handleDeleteClick = useCallback(
        async (campusId) => {
            console.log("Delete clicked:", campusId);
            showLoading();

            const token = localStorage.getItem("token");
            if (!token) {
                setSnackbarMessage("Authentication token is missing.");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
                hideLoading();
                return;
            }

            try {
                if (!campusId.startsWith("temp-")) {
                    await axios.delete(
                        `${config.API_URL}/campuses/${campusId}`,
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );
                }

                const updatedCampuses = campuses.filter(
                    (campus) =>
                        String(campus.id) !== campusId &&
                        `temp-${campuses.indexOf(campus)}` !== campusId
                );
                setCampuses(updatedCampuses);

                setSnackbarMessage("Campus deleted successfully!");
                setSnackbarSeverity("success");
                setSnackbarOpen(true);
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
                setSnackbarMessage(errorMessage);
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
            } finally {
                hideLoading();
            }
        },
        [campuses]
    );

    const handleEditSubmit = useCallback(
        async (campusId, updatedData) => {
            console.log("Edit submit:", { campusId, updatedData });
            showLoading();

            const campusIndex = campuses.findIndex(
                (c) =>
                    String(c.id) === campusId ||
                    `temp-${campuses.indexOf(c)}` === campusId
            );
            if (campusIndex === -1) {
                setSnackbarMessage("Campus not found.");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
                hideLoading();
                return;
            }

            const originalCampus = campuses[campusIndex];
            const updatedCampus = { ...originalCampus, ...updatedData };
            const token = localStorage.getItem("token");
            if (!token) {
                setSnackbarMessage("Authentication token is missing.");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
                hideLoading();
                return;
            }

            try {
                let response;
                const campusIdStr = updatedCampus.id
                    ? String(updatedCampus.id)
                    : "";
                if (campusIdStr && !campusIdStr.startsWith("temp-")) {
                    const payload = {
                        ...updatedData,
                        institution_id: updatedCampus.institution_id,
                    };
                    response = await axios.put(
                        `${config.API_URL}/campuses/${updatedCampus.id}`,
                        payload,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                } else {
                    response = await axios.post(
                        `${config.API_URL}/campuses`,
                        [updatedCampus], // Wrap in array to match backend expectation
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    updatedCampus.id =
                        response.data.data?.id || response.data.id;
                }

                const updatedCampuses = [...campuses];
                updatedCampuses[campusIndex] = {
                    ...updatedCampus,
                    ...response.data.data,
                };
                setCampuses(updatedCampuses);

                setSnackbarMessage("Campus updated successfully!");
                setSnackbarSeverity("success");
                setSnackbarOpen(true);
            } catch (error) {
                console.error("Error saving campus:", error);
                let errorMessage = "Failed to save campus changes.";
                if (error.response) {
                    errorMessage = `Error: ${
                        error.response.data.message ||
                        error.response.data.errors?.join("; ") ||
                        error.message
                    }`;
                }
                setSnackbarMessage(errorMessage);
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
            } finally {
                hideLoading();
            }
        },
        [campuses]
    );

    const handleOpenAddDialog = () => setOpenAddDialog(true);
    const handleCloseAddDialog = () => setOpenAddDialog(false);
    const handleCloseEditDialog = () => setOpenEditDialog(false);

    const handleAddCampus = (newCampusData) => {
        setCampuses((prev) => [...prev, newCampusData]);
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
            <div className="flex justify-between items-center bg-white border-b border-gray-200 mb-4 sm:pl-4 px-2 py-2">
                <span className="text-lg font-medium text-gray-900">
                    Campus Management
                </span>
                <button
                    onClick={handleOpenAddDialog}
                    className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                    Add Campus
                </button>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-lg mb-4 flex flex-col xs:h-[70vh] sm:h-[65vh] md:h-[60vh] xs:max-w-[99vw] sm:max-w-[95vw] md:max-w-[95vw] overflow-x-auto overflow-y-hidden shadow-sm">
                {/* Tabs */}
                <div className="flex border-b border-gray-200 shrink-0">
                    {["Basic Info", "Metrics", "Leadership", "Coordinates"].map(
                        (label, index) => (
                            <button
                                key={label}
                                onClick={() => handleTabChange(index)}
                                className={`flex-1 py-2 px-4 text-sm font-medium text-center transition-colors ${
                                    tabValue === index
                                        ? "border-b-2 border-blue-600 text-blue-600"
                                        : "text-gray-600 hover:text-gray-800"
                                }`}
                                aria-selected={tabValue === index}
                                role="tab"
                            >
                                {label}
                            </button>
                        )
                    )}
                </div>

                {/* Table */}
                <div className="flex-1 overflow-auto">
                    <table className="w-full min-w-[800px] border-collapse">
                        <thead className="sticky top-0 bg-white z-10 border-b border-gray-200">
                            <tr>
                                {currentColumns.map((column) => (
                                    <th
                                        key={column.field}
                                        className={`px-2 py-2 text-sm font-medium text-gray-700 border-r border-gray-200 text-${
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
                            {paginatedRows.map((row) => (
                                <tr
                                    key={row.id}
                                    className="border-b border-gray-200 hover:bg-gray-50"
                                >
                                    {currentColumns.map((column) => (
                                        <td
                                            key={column.field}
                                            className={`px-2 py-2 text-sm text-gray-900 border-r border-gray-200 text-${
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
                <div className="flex justify-end items-center p-2 border-t border-gray-200 bg-white sticky bottom-0 z-10">
                    <div className="flex items-center space-x-2 text-sm">
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
                        <span>
                            {page * rowsPerPage + 1}-
                            {Math.min((page + 1) * rowsPerPage, data.length)} of{" "}
                            {data.length}
                        </span>
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 0}
                            className="px-2 py-1 disabled:opacity-50"
                        >
                            ←
                        </button>
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={(page + 1) * rowsPerPage >= data.length}
                            className="px-2 py-1 disabled:opacity-50"
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
                setSnackbarOpen={setSnackbarOpen}
                setSnackbarMessage={setSnackbarMessage}
                setSnackbarSeverity={setSnackbarSeverity}
            />
            <EditCampusFormDialog
                open={openEditDialog}
                onClose={handleCloseEditDialog}
                onSubmit={handleEditSubmit}
                campusData={editCampusData}
                campusId={editCampusData?.id || null}
                setSnackbarOpen={setSnackbarOpen}
                setSnackbarMessage={setSnackbarMessage}
                setSnackbarSeverity={setSnackbarSeverity}
            />

            {/* Snackbar */}
            {snackbarOpen && (
                <div className="fixed top-4 right-4 z-50 max-w-xs">
                    <div
                        className={`p-4 rounded-lg shadow-lg flex items-center ${
                            snackbarSeverity === "success"
                                ? "bg-green-600 text-white"
                                : snackbarSeverity === "error"
                                ? "bg-red-600 text-white"
                                : "bg-blue-600 text-white"
                        }`}
                    >
                        <span className="flex-1 text-sm">
                            {snackbarMessage}
                        </span>
                        <button
                            onClick={() => setSnackbarOpen(false)}
                            className="ml-4 text-white hover:text-gray-200"
                            aria-label="Close notification"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
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
};

export default CampusDataGrid;
