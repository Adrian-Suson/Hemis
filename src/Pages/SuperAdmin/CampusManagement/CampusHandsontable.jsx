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
    Box,
    FormHelperText,
    Autocomplete,
    Toolbar,
    Typography,
} from "@mui/material";
import { useLoading } from "../../../Context/LoadingContext";

// Register all Handsontable modules
registerAllModules();

const CampusHandsontable = ({ campuses: initialCampuses }) => {
    const [campuses, setCampuses] = useState(initialCampuses);
    const { updateProgress, hideLoading } = useLoading();
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
        land_area_hectares: "",
        distance_from_main: "",
        autonomous_code: "",
        position_title: "",
        head_full_name: "",
        latitude_coordinates: "",
        longitude_coordinates: "",
    });
    const [errors, setErrors] = useState({});

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
        }));
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
            land_area_hectares: "",
            distance_from_main: "",
            autonomous_code: "",
            position_title: "",
            head_full_name: "",
            latitude_coordinates: "",
            longitude_coordinates: "",
        });
        setErrors({});
    };

    const validateForm = () => {
        const newErrors = {};
        const currentYear = 2025;

        const stringFields = [
            "suc_name",
            "campus_type",
            "institutional_code",
            "region",
            "municipality_city_province",
            "former_name",
            "autonomous_code",
            "position_title",
            "head_full_name",
        ];
        stringFields.forEach((field) => {
            if (newCampus[field] && newCampus[field].length > 255) {
                newErrors[field] = "Must be 255 characters or less";
            }
        });

        if (newCampus.year_first_operation !== "") {
            const year = parseInt(newCampus.year_first_operation, 10);
            if (isNaN(year)) {
                newErrors.year_first_operation = "Must be a valid year";
            } else if (year < 1800) {
                newErrors.year_first_operation = "Year must be 1800 or later";
            } else if (year > currentYear) {
                newErrors.year_first_operation = "Year cannot be in the future";
            }
        }

        if (newCampus.land_area_hectares !== "") {
            const value = parseFloat(newCampus.land_area_hectares);
            if (isNaN(value)) {
                newErrors.land_area_hectares = "Must be a valid number";
            } else if (value < 0) {
                newErrors.land_area_hectares = "Must be 0 or greater";
            }
        }

        if (newCampus.distance_from_main !== "") {
            const value = parseFloat(newCampus.distance_from_main);
            if (isNaN(value)) {
                newErrors.distance_from_main = "Must be a valid number";
            } else if (value < 0) {
                newErrors.distance_from_main = "Must be 0 or greater";
            }
        }

        if (newCampus.latitude_coordinates !== "") {
            const value = parseFloat(newCampus.latitude_coordinates);
            if (isNaN(value)) {
                newErrors.latitude_coordinates = "Must be a valid number";
            } else if (value < -90 || value > 90) {
                newErrors.latitude_coordinates = "Must be between -90 and 90";
            }
        }

        if (newCampus.longitude_coordinates !== "") {
            const value = parseFloat(newCampus.longitude_coordinates);
            if (isNaN(value)) {
                newErrors.longitude_coordinates = "Must be a valid number";
            } else if (value < -180 || value > 180) {
                newErrors.longitude_coordinates =
                    "Must be between -180 and 180";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCampus((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleAddCampus = async () => {
        if (!validateForm()) {
            console.log("[Add Campus] Validation failed:", errors);
            return;
        }

        const token = localStorage.getItem("token");
        try {
            setOpenDialog(false);

            const payload = {
                suc_name: newCampus.suc_name || null,
                campus_type: newCampus.campus_type || null,
                institutional_code: newCampus.institutional_code || null,
                region: newCampus.region || null,
                municipality_city_province:
                    newCampus.municipality_city_province || null,
                former_name: newCampus.former_name || null,
                year_first_operation:
                    newCampus.year_first_operation !== ""
                        ? parseInt(newCampus.year_first_operation, 10)
                        : null,
                land_area_hectares:
                    newCampus.land_area_hectares !== ""
                        ? parseFloat(newCampus.land_area_hectares)
                        : null,
                distance_from_main:
                    newCampus.distance_from_main !== ""
                        ? parseFloat(newCampus.distance_from_main)
                        : null,
                autonomous_code: newCampus.autonomous_code || null,
                position_title: newCampus.position_title || null,
                head_full_name: newCampus.head_full_name || null,
                latitude_coordinates:
                    newCampus.latitude_coordinates !== ""
                        ? parseFloat(newCampus.latitude_coordinates)
                        : null,
                longitude_coordinates:
                    newCampus.longitude_coordinates !== ""
                        ? parseFloat(newCampus.longitude_coordinates)
                        : null,
            };

            console.log("[Add Campus] Sending data:", payload);
            updateProgress(50);

            const response = await axios.post(
                "http://localhost:8000/api/campuses",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("[Add Campus] Server response:", response.data);

            setCampuses((prev) => [
                ...prev,
                { ...payload, id: response.data.id },
            ]);

            updateProgress(100);
            handleCloseDialog();
        } catch (error) {
            console.error("[Add Campus] Error:", error);
            hideLoading();
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

    const currentYear = new Date().getFullYear();
    const years = Array.from(new Array(100), (val, index) => currentYear - index);

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
                        No campuses found. Click &#34;Add Campus&#34; to start.
                    </div>
                )}
            </Paper>

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
                                error={!!errors.suc_name}
                                helperText={errors.suc_name}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl
                                fullWidth
                                margin="dense"
                                error={!!errors.campus_type}
                            >
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
                                {errors.campus_type && (
                                    <FormHelperText>
                                        {errors.campus_type}
                                    </FormHelperText>
                                )}
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
                                error={!!errors.institutional_code}
                                helperText={errors.institutional_code}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin="dense"
                                name="region"
                                label="Region"
                                fullWidth
                                value={
                                    newCampus.region ||
                                    campuses[0]?.institution?.region ||
                                    ""
                                }
                                onChange={handleInputChange}
                                error={!!errors.region}
                                helperText={errors.region}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                options={region9Options}
                                value={
                                    newCampus.municipality_city_province || ""
                                }
                                onChange={(event, newValue) => {
                                    handleInputChange({
                                        target: {
                                            name: "municipality_city_province",
                                            value: newValue || "",
                                        },
                                    });
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        margin="dense"
                                        label="City/Province"
                                        fullWidth
                                        error={
                                            !!errors.municipality_city_province
                                        }
                                        helperText={
                                            errors.municipality_city_province
                                        }
                                    />
                                )}
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
                                error={!!errors.former_name}
                                helperText={errors.former_name}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl
                                fullWidth
                                margin="dense"
                                error={!!errors.year_first_operation}
                            >
                                <InputLabel id="year-first-operation-label">
                                    Established
                                </InputLabel>
                                <Select
                                    labelId="year-first-operation-label"
                                    name="year_first_operation"
                                    value={newCampus.year_first_operation}
                                    onChange={handleInputChange}
                                    label="Established"
                                >
                                    {years.map((year) => (
                                        <MenuItem key={year} value={year}>
                                            {year}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.year_first_operation && (
                                    <FormHelperText>
                                        {errors.year_first_operation}
                                    </FormHelperText>
                                )}
                            </FormControl>
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
                                error={!!errors.land_area_hectares}
                                helperText={errors.land_area_hectares}
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
                                error={!!errors.distance_from_main}
                                helperText={errors.distance_from_main}
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
                                error={!!errors.autonomous_code}
                                helperText={errors.autonomous_code}
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
                                error={!!errors.position_title}
                                helperText={errors.position_title}
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
                                error={!!errors.head_full_name}
                                helperText={errors.head_full_name}
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
                                error={!!errors.latitude_coordinates}
                                helperText={errors.latitude_coordinates}
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
                                error={!!errors.longitude_coordinates}
                                helperText={errors.longitude_coordinates}
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
