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
import config from "../../../utils/config";
import AddCampusDialog from "./AddCampusDialog";

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];

const CampusDataGrid = ({ campuses: initialCampuses }) => {
    const [campuses, setCampuses] = useState(initialCampuses);
    const { showLoading, hideLoading } = useLoading();
    const [tabValue, setTabValue] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    useEffect(() => {
        setCampuses(initialCampuses);
    }, [initialCampuses]);

    const allColumns = useMemo(
        () => [
            {
                field: "suc_name",
                headerName: "Campus Name",
                minWidth: 200,
                flex: 2,
                editable: true,
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
                editable: true,
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
                editable: true,
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
                editable: true,
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
                editable: true,
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
                editable: true,
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
                editable: true,
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
                editable: true,
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
                editable: true,
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
                editable: true,
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
                editable: true,
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
                editable: true,
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
                editable: true,
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
                editable: true,
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
        return campuses.map((campus, index) => ({
            id: campus.id || `temp-${index}`,
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
    }, [campuses]);

    const handleCellEditStop = useCallback(
        async (params) => {
            const { id, field, value } = params;
            showLoading();
            const updatedCampuses = [...campuses];
            const campusIndex = updatedCampuses.findIndex(
                (c) =>
                    c.id === id || `temp-${updatedCampuses.indexOf(c)}` === id
            );
            if (campusIndex === -1) return;

            const campus = { ...updatedCampuses[campusIndex], [field]: value };
            updatedCampuses[campusIndex] = campus;
            const token = localStorage.getItem("token");

            try {
                if (campus.id && campus.id !== `temp-${campusIndex}`) {
                    await axios.put(
                        `${config.API_URL}/campuses/${campus.id}`,
                        campus,
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );
                } else {
                    const response = await axios.post(
                        `${config.API_URL}/campuses`,
                        [campus],
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    campus.id = response.data.data[0].id;
                }
                setSnackbarMessage("Campus updated successfully!");
                setSnackbarSeverity("success");
                setSnackbarOpen(true);
            } catch (error) {
                console.error("Error saving campus:", error);
                setSnackbarMessage("Failed to save campus changes.");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
            } finally {
                hideLoading();
            }

            setCampuses(updatedCampuses);
        },
        [campuses]
    );

    const handleOpenDialog = () => setOpenDialog(true);

    const handleCloseDialog = () => setOpenDialog(false);

    const handleAddCampus = (newCampusData) => {
        setCampuses((prev) => [...prev, newCampusData]);
        handleCloseDialog();
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
                    onClick={handleOpenDialog}
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
                        xs: "99 vw",
                        sm: "99vw",
                        md: "99vw",
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
                        editMode="cell"
                        onCellEditStop={handleCellEditStop}
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
                open={openDialog}
                onClose={handleCloseDialog}
                onAddCampus={handleAddCampus}
                initialRegion={campuses[0]?.region || ""}
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
