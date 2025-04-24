/* eslint-disable react-hooks/exhaustive-deps */
import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.min.css";
import { useMemo, useState, useCallback, useEffect } from "react";
import { registerAllModules } from "handsontable/registry";
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
import { useLoading } from "../../../Context/LoadingContext";
import AddCampusDialog from "./AddCampusDialog";

// Register all Handsontable modules
registerAllModules();

const CampusHandsontable = ({ campuses: initialCampuses }) => {
    const [campuses, setCampuses] = useState(initialCampuses);
    const { showLoading, hideLoading } = useLoading();
    const [tabValue, setTabValue] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    const region9Options = [
        "Baliguian",
        "Godod",
        "Gutalac",
        "Jose Dalman",
        "Kalawit",
        "Katipunan",
        "La Libertad",
        "Labason",
        "Leon B. Postigo",
        "Liloy",
        "Manukan",
        "Mutia",
        "Piñan",
        "Polanco",
        "Pres. Manuel A. Roxas",
        "Rizal",
        "Salug",
        "Sergio Osmeña Sr.",
        "Siayan",
        "Sibuco",
        "Sibutad",
        "Sindangan",
        "Siocon",
        "Sirawai",
        "Tampilisan",
        "Dapitan City",
        "Dipolog City",
        "Aurora",
        "Bayog",
        "Dimataling",
        "Dinas",
        "Dumalinao",
        "Dumingag",
        "Guipos",
        "Josefina",
        "Kumalarang",
        "Labangan",
        "Lakewood",
        "Lapuyan",
        "Mahayag",
        "Margosatubig",
        "Midsalip",
        "Molave",
        "Pitogo",
        "Ramon Magsaysay",
        "San Miguel",
        "San Pablo",
        "Sominot",
        "Tabina",
        "Tambulig",
        "Tigbao",
        "Tukuran",
        "Vincenzo A. Sagun",
        "Pagadian City",
        "Alicia",
        "Buug",
        "Diplahan",
        "Imelda",
        "Ipil",
        "Kabasalan",
        "Mabuhay",
        "Malangas",
        "Naga",
        "Olutanga",
        "Payao",
        "Roseller T. Lim",
        "Siay",
        "Talusan",
        "Titay",
        "Tungawan",
        "Zamboanga City",
        "Isabela City",
    ];

    useEffect(() => {
        setCampuses(initialCampuses);
    }, [initialCampuses]);

    const allColumns = useMemo(
        () => [
            { data: "suc_name", title: "Campus Name" },
            { data: "campus_type", title: "Type" },
            { data: "institutional_code", title: "Code" },
            { data: "region", title: "Region" },
            { data: "municipality_city_province", title: "City/Province" },
            { data: "former_name", title: "Former Name" },
            { data: "year_first_operation", title: "Established" },
            {
                data: "land_area_hectares",
                title: "Land Area (ha)",
                type: "numeric",
            },
            {
                data: "distance_from_main",
                title: "Distance (km)",
                type: "numeric",
            },
            { data: "autonomous_code", title: "Auto Code" },
            { data: "position_title", title: "Position" },
            { data: "head_full_name", title: "Head" },
            {
                data: "latitude_coordinates",
                title: "Latitude",
                type: "numeric",
            },
            {
                data: "longitude_coordinates",
                title: "Longitude",
                type: "numeric",
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
        return campuses.map((campus) => ({
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

    const handleChanges = useCallback(
        async (changes, source) => {
            if (!changes || source === "loadData") return;
            showLoading();
            const updatedCampuses = [...campuses];
            const token = localStorage.getItem("token");

            for (const [row, prop, , newValue] of changes) {
                const campus = updatedCampuses[row];
                campus[prop] = newValue;

                try {
                    if (campus.id) {
                        await axios.put(
                            `http://localhost:8000/api/campuses/${campus.id}`,
                            campus,
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                    } else {
                        const response = await axios.post(
                            "http://localhost:8000/api/campuses",
                            [campus], // Send as array
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
                } finally{
                    hideLoading();
                }
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
        <Box sx={{ mt: 2 }}>
            {/* Toolbar for the button and title */}
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

            <Paper sx={{ borderRadius: 1, mb: 2, maxHeight: "80vh" }}>
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
                    }}
                >
                    <Tab label="Basic Info" />
                    <Tab label="Metrics" />
                    <Tab label="Leadership" />
                    <Tab label="Coordinates" />
                </Tabs>

                <HotTable
                    data={data}
                    columns={currentColumns}
                    colHeaders={true}
                    rowHeaders={true}
                    stretchH="all"
                    height="auto"
                    licenseKey="non-commercial-and-evaluation"
                    settings={{
                        manualColumnResize: true,
                        columnSorting: true,
                        contextMenu: true,
                        afterChange: handleChanges,
                    }}
                />
                {data.length === 0 && (
                    <div
                        style={{
                            textAlign: "center",
                            padding: "20px",
                            color: "#666",
                        }}
                    >
                        No campuses found. Click &#34;Add Campus&#34; to start.
                    </div>
                )}
            </Paper>

            <AddCampusDialog
                open={openDialog}
                onClose={handleCloseDialog}
                onAddCampus={handleAddCampus}
                region9Options={region9Options}
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

CampusHandsontable.propTypes = {
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

export default CampusHandsontable;
