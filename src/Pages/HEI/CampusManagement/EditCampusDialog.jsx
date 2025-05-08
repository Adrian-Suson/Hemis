import { useState } from "react";
import PropTypes from "prop-types";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Autocomplete,
} from "@mui/material";

// Predefined lists for regions and cities/provinces
const PHILIPPINE_REGIONS = [
    "Region 1",
    "Region 2",
    "Region 3",
    "Region 4-A",
    "Region 4-B",
    "Region 5",
    "Region 6",
    "Region 7",
    "Region 8",
    "Region 9",
    "Region 10",
    "Region 11",
    "Region 12",
    "Region 13",
    "NCR",
    "CAR",
    "BARMM",
];

// Sample cities/provinces list (expand as needed)
const PHILIPPINE_CITIES_PROVINCES = [
    "Metro Manila",
    "Quezon City",
    "Manila",
    "Davao City",
    "Cebu City",
    "Zamboanga City",
    "Taguig",
    "Pasig",
    "Cagayan de Oro",
    "Iloilo City",
    "Batangas",
    "Pangasinan",
    "Bulacan",
    "Cavite",
    "Laguna",
    "Rizal",
    "Nueva Ecija",
    "Tarlac",
    "Pampanga",
    "La Union",
    // Add more cities/provinces as needed
];

const EditCampusDialog = ({
    open,
    onClose,
    onSubmit,
    field,
    value,
    campusId,
    setSnackbarOpen,
    setSnackbarMessage,
    setSnackbarSeverity,
}) => {
    const [newValue, setNewValue] = useState(value || "");

    const handleSubmit = () => {
        if (!newValue && field === "suc_name") {
            setSnackbarMessage("Campus name is required.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            return;
        }
        onSubmit(campusId, field, newValue);
        setNewValue("");
        onClose();
    };

    const fieldLabels = {
        suc_name: "Campus Name",
        campus_type: "Campus Type",
        institutional_code: "Institutional Code",
        region: "Region",
        municipality_city_province: "Municipality/City/Province",
        former_name: "Former Name",
        year_first_operation: "Year First Operation",
        land_area_hectares: "Land Area (ha)",
        distance_from_main: "Distance from Main (km)",
        autonomous_code: "Autonomous Code",
        position_title: "Position Title",
        head_full_name: "Head Full Name",
        latitude_coordinates: "Latitude Coordinates",
        longitude_coordinates: "Longitude Coordinates",
    };

    const isNumericField = [
        "year_first_operation",
        "land_area_hectares",
        "distance_from_main",
        "latitude_coordinates",
        "longitude_coordinates",
    ].includes(field);

    const isCampusTypeField = field === "campus_type";
    const isRegionField = field === "region";
    const isCityProvinceField = field === "municipality_city_province";

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Edit {fieldLabels[field] || field}</DialogTitle>
            <DialogContent>
                {isCampusTypeField ? (
                    <FormControl fullWidth margin="dense">
                        <InputLabel id="campus-type-label">
                            {fieldLabels[field]}
                        </InputLabel>
                        <Select
                            labelId="campus-type-label"
                            value={newValue}
                            onChange={(e) => setNewValue(e.target.value)}
                            label={fieldLabels[field]}
                            variant="outlined"
                        >
                            <MenuItem value="Main">Main</MenuItem>
                            <MenuItem value="Satellite">Satellite</MenuItem>
                        </Select>
                    </FormControl>
                ) : isRegionField ? (
                    <Autocomplete
                        options={PHILIPPINE_REGIONS}
                        value={newValue}
                        onChange={(event, newInputValue) =>
                            setNewValue(newInputValue || "")
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                autoFocus
                                margin="dense"
                                label={fieldLabels[field]}
                                variant="outlined"
                                fullWidth
                            />
                        )}
                    />
                ) : isCityProvinceField ? (
                    <Autocomplete
                        options={PHILIPPINE_CITIES_PROVINCES}
                        value={newValue}
                        onChange={(event, newInputValue) =>
                            setNewValue(newInputValue || "")
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                autoFocus
                                margin="dense"
                                label={fieldLabels[field]}
                                variant="outlined"
                                fullWidth
                            />
                        )}
                    />
                ) : (
                    <TextField
                        autoFocus
                        margin="dense"
                        label={fieldLabels[field] || field}
                        type={isNumericField ? "number" : "text"}
                        fullWidth
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        variant="outlined"
                    />
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    color="primary"
                    variant="contained"
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

EditCampusDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    field: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    campusId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    setSnackbarOpen: PropTypes.func.isRequired,
    setSnackbarMessage: PropTypes.func.isRequired,
    setSnackbarSeverity: PropTypes.func.isRequired,
};

export default EditCampusDialog;
