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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Paper,
    Box, // Added Box for layout
} from "@mui/material";

// Register all Handsontable modules
registerAllModules();

const CampusHandsontable = ({ campuses: initialCampuses }) => {
    const [campuses, setCampuses] = useState(initialCampuses);
    const [tabValue, setTabValue] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [newCampus, setNewCampus] = useState({
        suc_name: "",
        campus_type: "",
        institutional_code: "",
        region: "",
        municipality_city_province: "",
        former_name: "",
        year_first_operation: "",
        land_area_hectares: 0.0,
        distance_from_main: 0.0,
        autonomous_code: "",
        position_title: "",
        head_full_name: "",
        latitude_coordinates: 0.0,
        longitude_coordinates: 0.0,
    });

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
            basic: allColumns.slice(0, 7),
            metrics: allColumns.slice(7, 10),
            leadership: allColumns.slice(10, 12),
            coordinates: allColumns.slice(12, 14),
        }),
        [allColumns]
    );

    const data = useMemo(() => {
        const mappedData = campuses.map((campus) => ({
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
        }));
        return mappedData;
    }, [campuses]);

    const handleChanges = useCallback(
        async (changes, source) => {
            if (!changes || source === "loadData") return;

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
                            campus,
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                        campus.id = response.data.id;
                    }
                } catch (error) {
                    console.error("Error saving campus:", error);
                }
            }

            setCampuses(updatedCampuses);
        },
        [campuses]
    );

    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setNewCampus({
            suc_name: "",
            campus_type: "",
            institutional_code: "",
            region: "",
            municipality_city_province: "",
            former_name: "",
            year_first_operation: "",
            land_area_hectares: 0.0,
            distance_from_main: 0.0,
            autonomous_code: "",
            position_title: "",
            head_full_name: "",
            latitude_coordinates: 0.0,
            longitude_coordinates: 0.0,
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCampus((prev) => ({
            ...prev,
            [name]: [
                "land_area_hectares",
                "distance_from_main",
                "latitude_coordinates",
                "longitude_coordinates",
            ].includes(name)
                ? parseFloat(value) || 0.0
                : value,
        }));
    };

    const handleAddCampus = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.post(
                "http://localhost:8000/api/campuses",
                newCampus,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCampuses((prev) => [
                ...prev,
                { ...newCampus, id: response.data.id },
            ]);
            handleCloseDialog();
        } catch (error) {
            console.error("Error adding campus:", error);
        }
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
            {/* Container for Button and Tabs */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpenDialog}
                >
                    Add Campus
                </Button>
            </Box>
            <Paper sx={{ borderRadius: 1, mb: 2 }}>
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
            </Paper>
            <HotTable
                data={data}
                columns={currentColumns}
                colHeaders={true}
                rowHeaders={true}
                stretchH="all"
                height="65vh"
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
                    No campuses found. Click "Add Campus" to start.
                </div>
            )}

            {/* Dialog for adding a new campus */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Add New Campus</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin="dense"
                                name="suc_name"
                                label="Campus Name"
                                fullWidth
                                value={newCampus.suc_name}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="dense">
                                <InputLabel id="campus-type-label">
                                    Type
                                </InputLabel>
                                <Select
                                    labelId="campus-type-label"
                                    name="campus_type"
                                    value={newCampus.campus_type}
                                    label="Type"
                                    onChange={handleInputChange}
                                >
                                    <MenuItem value="MAIN">MAIN</MenuItem>
                                    <MenuItem value="Satellite">
                                        Satellite
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin="dense"
                                name="institutional_code"
                                label="Code"
                                fullWidth
                                value={newCampus.institutional_code}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin="dense"
                                name="region"
                                label="Region"
                                fullWidth
                                value={newCampus.region}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin="dense"
                                name="municipality_city_province"
                                label="City/Province"
                                fullWidth
                                value={newCampus.municipality_city_province}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin="dense"
                                name="former_name"
                                label="Former Name"
                                fullWidth
                                value={newCampus.former_name}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin="dense"
                                name="year_first_operation"
                                label="Established"
                                fullWidth
                                value={newCampus.year_first_operation}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin="dense"
                                name="land_area_hectares"
                                label="Land Area (ha)"
                                type="number"
                                fullWidth
                                value={newCampus.land_area_hectares}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin="dense"
                                name="distance_from_main"
                                label="Distance (km)"
                                type="number"
                                fullWidth
                                value={newCampus.distance_from_main}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin="dense"
                                name="autonomous_code"
                                label="Auto Code"
                                fullWidth
                                value={newCampus.autonomous_code}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin="dense"
                                name="position_title"
                                label="Position"
                                fullWidth
                                value={newCampus.position_title}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin="dense"
                                name="head_full_name"
                                label="Head"
                                fullWidth
                                value={newCampus.head_full_name}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin="dense"
                                name="latitude_coordinates"
                                label="Latitude"
                                type="number"
                                fullWidth
                                value={newCampus.latitude_coordinates}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin="dense"
                                name="longitude_coordinates"
                                label="Longitude"
                                type="number"
                                fullWidth
                                value={newCampus.longitude_coordinates}
                                onChange={handleInputChange}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddCampus} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
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
        })
    ).isRequired,
};

export default CampusHandsontable;
