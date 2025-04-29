/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {
    Button,
    Tabs,
    Tab,
    Paper,
    Box,
    Toolbar,
    Typography,
    Snackbar,
    Alert,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useLoading } from "../../../Context/LoadingContext";
import AddCampusDialog from "./AddCampusDialog";
import EditCampusDialog from "./EditCampusDialog";
import config from "../../../utils/config";

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];

const CampusDataGrid = ({ campuses: initialCampuses }) => {
    const [campuses, setCampuses] = useState(initialCampuses);
    const { showLoading, hideLoading } = useLoading();
    const [tabValue, setTabValue] = useState(0);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editField, setEditField] = useState("");
    const [editValue, setEditValue] = useState("");
    const [editCampusId, setEditCampusId] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    // Initialize campuses and update only if local changes are not present
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
                    params.value !== null && params.value !== undefined
                        ? params.value
                        : "-",
            },
            {
                field: "campus_type",
                headerName: "Type",
                minWidth: 120,
                flex: 1,
                renderCell: (params) =>
                    params.value !== null && params.value !== undefined
                        ? params.value
                        : "-",
            },
            {
                field: "institutional_code",
                headerName: "Code",
                minWidth: 120,
                flex: 1,
                renderCell: (params) =>
                    params.value !== null && params.value !== undefined
                        ? params.value
                        : "-",
            },
            {
                field: "region",
                headerName: "Region",
                minWidth: 150,
                flex: 1,
                renderCell: (params) =>
                    params.value !== null && params.value !== undefined
                        ? params.value
                        : "-",
            },
            {
                field: "municipality_city_province",
                headerName: "City/Province",
                minWidth: 200,
                flex: 1,
                renderCell: (params) =>
                    params.value !== null && params.value !== undefined
                        ? params.value
                        : "-",
            },
            {
                field: "former_name",
                headerName: "Former Name",
                minWidth: 200,
                flex: 1,
                renderCell: (params) =>
                    params.value !== null && params.value !== undefined
                        ? params.value
                        : "-",
            },
            {
                field: "year_first_operation",
                headerName: "Established",
                minWidth: 120,
                flex: 1,
                type: "number",
                align: "center",
                headerAlign: "center",
                renderCell: (params) =>
                    params.value !== null && params.value !== undefined
                        ? params.value
                        : "-",
            },
            {
                field: "land_area_hectares",
                headerName: "Land Area (ha)",
                minWidth: 150,
                flex: 1,
                type: "number",
                align: "center",
                headerAlign: "center",
                renderCell: (params) =>
                    params.value !== null && params.value !== undefined
                        ? params.value
                        : "-",
            },
            {
                field: "distance_from_main",
                headerName: "Distance (km)",
                minWidth: 150,
                flex: 1,
                type: "number",
                align: "center",
                headerAlign: "center",
                renderCell: (params) =>
                    params.value !== null && params.value !== undefined
                        ? params.value
                        : "-",
            },
            {
                field: "autonomous_code",
                headerName: "Auto Code",
                minWidth: 120,
                flex: 1,
                renderCell: (params) =>
                    params.value !== null && params.value !== undefined
                        ? params.value
                        : "-",
            },
            {
                field: "position_title",
                headerName: "Position",
                minWidth: 150,
                flex: 1,
                renderCell: (params) =>
                    params.value !== null && params.value !== undefined
                        ? params.value
                        : "-",
            },
            {
                field: "head_full_name",
                headerName: "Head",
                minWidth: 200,
                flex: 1,
                renderCell: (params) =>
                    params.value !== null && params.value !== undefined
                        ? params.value
                        : "-",
            },
            {
                field: "latitude_coordinates",
                headerName: "Latitude",
                minWidth: 150,
                flex: 1,
                type: "number",
                align: "center",
                headerAlign: "center",
                renderCell: (params) =>
                    params.value !== null && params.value !== undefined
                        ? params.value
                        : "-",
            },
            {
                field: "longitude_coordinates",
                headerName: "Longitude",
                minWidth: 150,
                flex: 1,
                type: "number",
                align: "center",
                headerAlign: "center",
                renderCell: (params) =>
                    params.value !== null && params.value !== undefined
                        ? params.value
                        : "-",
            },
        ],
        []
    );

    const tabbedColumns = useMemo(
        () => ({
            basic: [allColumns[0], ...allColumns.slice(1, 7)],
            metrics: [allColumns[0], ...allColumns.slice(7, 10)],
            leadership: [allColumns[0], ...allColumns.slice(10, 12)],
            coordinates: [allColumns[0], ...allColumns.slice(12, 14)],
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
            municipality_city_province: campus.municipality_city_province || "",
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
        console.log("DataGrid rows:", rows);
        return rows;
    }, [campuses]);

    const handleCellClick = useCallback((params) => {
        console.log("Cell clicked:", {
            id: params.id,
            field: params.field,
            value: params.value,
        });
        setEditCampusId(params.id);
        setEditField(params.field);
        setEditValue(params.value);
        setOpenEditDialog(true);
    }, []);

    const handleEditSubmit = useCallback(
        async (campusId, field, value) => {
            console.log("Edit submit:", { campusId, field, value });
            showLoading();

            // Find the campus to update
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

            // Create updated campus object
            const originalCampus = campuses[campusIndex];
            console.log("Original campus:", originalCampus);

            // Check if the value has changed
            if (originalCampus[field] === value) {
                console.log(`No change in ${field}: ${value}`);
                setSnackbarMessage("No changes made.");
                setSnackbarSeverity("info");
                setSnackbarOpen(true);
                hideLoading();
                return;
            }

            const updatedCampus = { ...originalCampus, [field]: value };
            console.log("Updated campus before API:", updatedCampus);

            // Validate required fields
            if (!updatedCampus.suc_name || !updatedCampus.institution_id) {
                setSnackbarMessage(
                    "Campus name and institution ID are required."
                );
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
                hideLoading();
                return;
            }

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
                console.log("campusId:", campusIdStr);
                if (campusIdStr && !campusIdStr.startsWith("temp-")) {
                    // Update existing campus with partial payload
                    const payload = {
                        [field]: value,
                        institution_id: updatedCampus.institution_id,
                    };
                    console.log("PUT payload:", payload);
                    response = await axios.put(
                        `${config.API_URL}/campuses/${updatedCampus.id}`,
                        payload,
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );
                    console.log("PUT response:", response.data);
                } else {
                    // Create new campus
                    console.log("POST payload:", updatedCampus);
                    response = await axios.post(
                        `${config.API_URL}/campuses`,
                        updatedCampus,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    console.log("POST response:", response.data);
                    updatedCampus.id = response.data.data.id;
                }

                // Update state with response data
                const updatedCampuses = [...campuses];
                updatedCampuses[campusIndex] = {
                    ...updatedCampus,
                    ...response.data.data,
                };
                console.log("New campuses state:", updatedCampuses);
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
                    console.log("Error response:", error.response.data);
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

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
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

    return (
        <Box
            sx={{
                my: 2,
                display: "flex",
                flexDirection: "column",
                height: "100%",
            }}
        >
            <Toolbar
                sx={{
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 },
                    mb: 2,
                    backgroundColor: "background.paper",
                    borderBottom: 1,
                    borderColor: "divider",
                }}
            >
                <Typography
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1, fontWeight: "medium" }}
                >
                    Campus Management
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpenAddDialog}
                    sx={{
                        borderRadius: "8px",
                        textTransform: "none",
                        fontWeight: "medium",
                        px: 3,
                        py: 1,
                    }}
                >
                    Add Campus
                </Button>
            </Toolbar>

            <Paper
                sx={{
                    borderRadius: 1,
                    mb: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: {
                        xs: "70vh",
                        sm: "65vh",
                        md: "60vh",
                    },
                    maxWidth: {
                        xs: "99vw",
                        sm: "95vw",
                        md: "95vw",
                    },
                    overflowX: "auto",
                    overflowY: "hidden",
                }}
            >
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    aria-label="campus data tabs"
                    variant="fullWidth"
                    sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                        "& .MuiTab-root": {
                            fontSize: "0.875rem",
                            fontWeight: "medium",
                        },
                        flexShrink: 0,
                    }}
                >
                    <Tab label="Basic Info" />
                    <Tab label="Metrics" />
                    <Tab label="Leadership" />
                    <Tab label="Coordinates" />
                </Tabs>

                <Box
                    sx={{
                        flex: 1,
                        position: "relative",
                    }}
                >
                    <DataGrid
                        rows={data}
                        columns={currentColumns}
                        onCellClick={handleCellClick}
                        density="compact"
                        disableVirtualization
                        sx={{
                            border: 0,
                            "& .MuiDataGrid-root": {
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                minWidth: "fit-content",
                            },
                            "& .MuiDataGrid-main": {
                                flex: 1,
                                overflowX: "auto",
                                overflowY: "auto",
                                "&::-webkit-scrollbar": {
                                    height: "8px",
                                },
                                "&::-webkit-scrollbar-thumb": {
                                    backgroundColor: "rgba(0,0,0,0.2)",
                                    borderRadius: "4px",
                                },
                            },
                            "& .MuiDataGrid-footerContainer": {
                                borderTop: 1,
                                borderColor: "divider",
                                position: "sticky",
                                bottom: 0,
                                backgroundColor: "background.paper",
                                zIndex: 1,
                                minWidth: "fit-content",
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                            },
                            "& .MuiDataGrid-columnSeparator": {
                                visibility: "hidden",
                            },
                            "& .MuiDataGrid-cell": {
                                borderRight: "1px solid",
                                borderColor: "divider",
                                whiteSpace: "normal",
                                wordWrap: "break-word",
                                padding: "4px 8px",
                                cursor: "pointer",
                            },
                            "& .MuiDataGrid-columnHeader": {
                                borderRight: "1px solid",
                                borderColor: "divider",
                                whiteSpace: "normal",
                                wordWrap: "break-word",
                                padding: "4px 8px",
                            },
                        }}
                        disableRowSelectionOnClick
                        disableColumnFilter
                        disableColumnMenu
                        disableColumnSorting
                        initialState={{
                            pagination: { paginationModel: { pageSize: 10 } },
                        }}
                        pageSizeOptions={ROWS_PER_PAGE_OPTIONS}
                    />
                </Box>
            </Paper>

            <AddCampusDialog
                open={openAddDialog}
                onClose={handleCloseAddDialog}
                onAddCampus={handleAddCampus}
                initialRegion={campuses[0]?.region || ""}
                setSnackbarOpen={setSnackbarOpen}
                setSnackbarMessage={setSnackbarMessage}
                setSnackbarSeverity={setSnackbarSeverity}
            />

            <EditCampusDialog
                open={openEditDialog}
                onClose={handleCloseEditDialog}
                onSubmit={handleEditSubmit}
                field={editField}
                value={editValue}
                campusId={editCampusId}
                setSnackbarOpen={setSnackbarOpen}
                setSnackbarMessage={setSnackbarMessage}
                setSnackbarSeverity={setSnackbarSeverity}
            />

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity={snackbarSeverity}
                    sx={{ width: "100%" }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
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
            municipality_city_province: PropTypes.string,
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
