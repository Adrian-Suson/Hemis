import { useState } from "react";
import {
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
    Button,
    Autocomplete,
    FormHelperText,
} from "@mui/material";
import PropTypes from "prop-types";
import axios from "axios";
import { useLoading } from "../../../Context/LoadingContext";
import { useParams } from "react-router-dom";
import { decryptId } from "../../../utils/encryption";

const AddCampusDialog = ({
    open,
    onClose,
    onAddCampus,
    region9Options,
    initialRegion,
    setSnackbarOpen,
    setSnackbarMessage,
    setSnackbarSeverity,
}) => {
    const { updateProgress, hideLoading } = useLoading();
    const { institutionId: encryptedInstitutionId } = useParams();
    const decryptedInstitutionId = decryptId(encryptedInstitutionId);
    const [newCampus, setNewCampus] = useState({
        institution_id: decryptedInstitutionId || "",
        suc_name: "",
        campus_type: "",
        institutional_code: "",
        region: initialRegion || "",
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

    const currentYear = 2025;
    const years = Array.from(
        new Array(100),
        (val, index) => currentYear - index
    );

    const validateForm = () => {
        const newErrors = {};

        // Required fields
        if (!newCampus.institution_id) {
            newErrors.institution_id = "Institution ID is required.";
        } else if (isNaN(parseInt(newCampus.institution_id, 10))) {
            newErrors.institution_id = "Institution ID must be a valid number.";
        }

        if (!newCampus.suc_name.trim()) {
            newErrors.suc_name = "Campus name is required.";
        } else if (newCampus.suc_name.length > 255) {
            newErrors.suc_name = "Must be 255 characters or less.";
        }

        if (!newCampus.campus_type) {
            newErrors.campus_type = "Campus type is required.";
        } else if (!["MAIN", "Satellite"].includes(newCampus.campus_type)) {
            newErrors.campus_type = "Must be MAIN or Satellite.";
        }

        if (!newCampus.institutional_code.trim()) {
            newErrors.institutional_code = "Institutional code is required.";
        } else if (newCampus.institutional_code.length > 255) {
            newErrors.institutional_code = "Must be 255 characters or less.";
        }

        if (!newCampus.region.trim()) {
            newErrors.region = "Region is required.";
        } else if (newCampus.region.length > 255) {
            newErrors.region = "Must be 255 characters or less.";
        }

        if (!newCampus.municipality_city_province) {
            newErrors.municipality_city_province = "City/Province is required.";
        } else if (newCampus.municipality_city_province.length > 255) {
            newErrors.municipality_city_province =
                "Must be 255 characters or less.";
        }

        // Optional string fields
        const optionalStrings = [
            "former_name",
            "autonomous_code",
            "position_title",
            "head_full_name",
        ];
        optionalStrings.forEach((field) => {
            if (newCampus[field] && newCampus[field].length > 255) {
                newErrors[field] = "Must be 255 characters or less.";
            }
        });

        // Year validation
        if (newCampus.year_first_operation) {
            const year = parseInt(newCampus.year_first_operation, 10);
            if (isNaN(year)) {
                newErrors.year_first_operation = "Must be a valid year.";
            } else if (year < 1800) {
                newErrors.year_first_operation = "Year must be 1800 or later.";
            } else if (year > currentYear) {
                newErrors.year_first_operation =
                    "Year cannot be in the future.";
            }
        }

        // Numeric fields
        if (newCampus.land_area_hectares !== "") {
            const value = parseFloat(newCampus.land_area_hectares);
            if (isNaN(value)) {
                newErrors.land_area_hectares = "Must be a valid number.";
            } else if (value < 0) {
                newErrors.land_area_hectares = "Must be 0 or greater.";
            }
        }

        if (newCampus.distance_from_main !== "") {
            const value = parseFloat(newCampus.distance_from_main);
            if (isNaN(value)) {
                newErrors.distance_from_main = "Must be a valid number.";
            } else if (value < 0) {
                newErrors.distance_from_main = "Must be 0 or greater.";
            }
        }

        // Coordinates
        if (newCampus.latitude_coordinates !== "") {
            const value = parseFloat(newCampus.latitude_coordinates);
            if (isNaN(value)) {
                newErrors.latitude_coordinates = "Must be a valid number.";
            } else if (value < -90 || value > 90) {
                newErrors.latitude_coordinates = "Must be between -90 and 90.";
            }
        }

        if (newCampus.longitude_coordinates !== "") {
            const value = parseFloat(newCampus.longitude_coordinates);
            if (isNaN(value)) {
                newErrors.longitude_coordinates = "Must be a valid number.";
            } else if (value < -180 || value > 180) {
                newErrors.longitude_coordinates =
                    "Must be between -180 and 180.";
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

    const resetForm = () => {
        setNewCampus({
            institution_id: decryptedInstitutionId || "",
            suc_name: "",
            campus_type: "",
            institutional_code: "",
            region: initialRegion || "",
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

    const handleAddCampus = async () => {
        if (!validateForm()) {
            console.log("[Add Campus] Validation failed:", errors);
            setSnackbarMessage("Validation failed. Please check the form.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            return;
        }

        const token = localStorage.getItem("token");
        try {
            const payload = {
                institution_id: parseInt(newCampus.institution_id, 10),
                suc_name: newCampus.suc_name || null,
                campus_type: newCampus.campus_type || null,
                institutional_code: newCampus.institutional_code || null,
                region: newCampus.region || null,
                municipality_city_province:
                    newCampus.municipality_city_province || null,
                former_name: newCampus.former_name || null,
                year_first_operation: newCampus.year_first_operation
                    ? parseInt(newCampus.year_first_operation, 10)
                    : null,
                land_area_hectares: newCampus.land_area_hectares
                    ? parseFloat(newCampus.land_area_hectares)
                    : null,
                distance_from_main: newCampus.distance_from_main
                    ? parseFloat(newCampus.distance_from_main)
                    : null,
                autonomous_code: newCampus.autonomous_code || null,
                position_title: newCampus.position_title || null,
                head_full_name: newCampus.head_full_name || null,
                latitude_coordinates: newCampus.latitude_coordinates
                    ? parseFloat(newCampus.latitude_coordinates)
                    : null,
                longitude_coordinates: newCampus.longitude_coordinates
                    ? parseFloat(newCampus.longitude_coordinates)
                    : null,
            };

            console.log("[Add Campus] Sending data:", [payload]);
            updateProgress(50);

            const response = await axios.post(
                "http://localhost:8000/api/campuses",
                [payload], // Send as array
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("[Add Campus] Server response:", response.data);

            const newCampusData = response.data.data || { id: Date.now() }; // Fallback ID
            onAddCampus({ ...payload, id: newCampusData.id });
            setSnackbarMessage("Campus added successfully!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            updateProgress(100);
            resetForm(); // Reset the form after successful submission
            onClose();
        } catch (error) {
            console.error("[Add Campus] Error:", error);
            let errorMessage = "Failed to add campus. Please try again.";
            if (error.response && error.response.status === 422) {
                const validationErrors = error.response.data.errors;
                console.log(
                    "[Add Campus] Validation Errors:",
                    validationErrors
                );
                errorMessage =
                    "Validation failed: " +
                    Object.values(validationErrors).flat().join(", ");
            }
            setSnackbarMessage(errorMessage);
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            hideLoading();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Add New Campus</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            margin="dense"
                            name="suc_name"
                            label="Campus Name"
                            fullWidth
                            required
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
                            required
                            error={!!errors.campus_type}
                        >
                            <InputLabel id="campus-type-label">Type</InputLabel>
                            <Select
                                labelId="campus-type-label"
                                name="campus_type"
                                value={newCampus.campus_type}
                                label="Type"
                                onChange={handleInputChange}
                            >
                                <MenuItem value="">
                                    <em>Select Type</em>
                                </MenuItem>
                                <MenuItem value="MAIN">MAIN</MenuItem>
                                <MenuItem value="Satellite">Satellite</MenuItem>
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
                            required
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
                            required
                            value={newCampus.region}
                            onChange={handleInputChange}
                            error={!!errors.region}
                            helperText={errors.region}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Autocomplete
                            options={region9Options}
                            value={newCampus.municipality_city_province || ""}
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
                                    required
                                    error={!!errors.municipality_city_province}
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
                                <MenuItem value="">
                                    <em>Select Year</em>
                                </MenuItem>
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
                <Button onClick={() => { resetForm(); onClose(); }} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleAddCampus} color="primary">
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
};

AddCampusDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onAddCampus: PropTypes.func.isRequired,
    region9Options: PropTypes.arrayOf(PropTypes.string).isRequired,
    initialRegion: PropTypes.string,
    setSnackbarOpen: PropTypes.func.isRequired,
    setSnackbarMessage: PropTypes.func.isRequired,
    setSnackbarSeverity: PropTypes.func.isRequired,
};

export default AddCampusDialog;
