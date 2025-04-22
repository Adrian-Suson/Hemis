import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Typography,
    Grid,
    Divider,
    IconButton,
    Box,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import PropTypes from "prop-types";
import { useLoading } from "../../../Context/LoadingContext";
import useActivityLog from "../../../Hook/useActivityLog";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

function ManualInstitutionDialog({
    open,
    onClose,
    getInstitutionType,
    fetchInstitutions,
    setSnackbarOpen,
    setSnackbarMessage,
    setSnackbarSeverity,
}) {
    const { updateProgress } = useLoading();
    const { createLog } = useActivityLog();
    const [manualData, setManualData] = useState({
        name: "",
        region: "",
        address_street: "",
        municipality_city: "",
        province: "",
        postal_code: "",
        institutional_telephone: "",
        institutional_fax: "",
        head_telephone: "",
        institutional_email: "",
        institutional_website: "",
        year_established: null,
        sec_registration: "",
        year_granted_approved: null,
        year_converted_college: null,
        year_converted_university: null,
        head_name: "",
        head_title: "",
        institution_type: "",
        head_education: "",
    });

    const [formErrors, setFormErrors] = useState({});
    const currentYear = new Date().getFullYear(); // Get the current year

    const handleChange = (e) => {
        setManualData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleYearChange = (field, value) => {
        setManualData((prev) => ({
            ...prev,
            [field]: value ? value.getFullYear() : null,
        }));
    };

    const resetForm = () => {
        setManualData({
            name: "",
            region: "",
            address_street: "",
            municipality_city: "",
            province: "",
            postal_code: "",
            institutional_telephone: "",
            institutional_fax: "",
            head_telephone: "",
            institutional_email: "",
            institutional_website: "",
            year_established: null,
            sec_registration: "",
            year_granted_approved: null,
            year_converted_college: null,
            year_converted_university: null,
            head_name: "",
            head_title: "",
            institution_type: "",
            head_education: "",
        });
        setFormErrors({});
    };

    const handleClose = () => {
        onClose();
        resetForm();
    };

    const validateForm = () => {
        const errors = {};
        if (!manualData.name.trim()) {
            errors.name = "Name is required.";
        } else if (manualData.name.length > 255) {
            errors.name = "Name must not exceed 255 characters.";
        }
        if (!manualData.region.trim()) {
            errors.region = "Region is required.";
        } else if (manualData.region.length > 255) {
            errors.region = "Region must not exceed 255 characters.";
        }
        if (!manualData.institution_type) {
            errors.institution_type = "Institution type is required.";
        }
        return errors;
    };

    const handleSave = async () => {
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        updateProgress(10);
        try {
            const token = localStorage.getItem("token");
            const payload = {
                ...manualData,
                institution_type: manualData.institution_type || getInstitutionType(),
            };

            const response = await axios.post(
                "http://localhost:8000/api/institutions",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            await createLog({
                action: "added_institution",
                description: `Manually added institution: ${payload.name}`,
                modelType: "App\\Models\\Institution",
                modelId: response.data.id,
                properties: payload,
            });

            fetchInstitutions();
            setSnackbarMessage("Institution data successfully added!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            handleClose();
        } catch (error) {
            console.error("Error sending manual data to backend:", error);
            setSnackbarMessage("Error adding institution data");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        } finally {
            updateProgress(100);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
            PaperProps={{
                sx: { borderRadius: 2 },
            }}
        >
            <DialogTitle
                sx={{
                    borderBottom: 1,
                    borderColor: "divider",
                    p: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Typography variant="h6" component="div">
                    Add Institution Manually
                </Typography>
                <IconButton
                    edge="end"
                    color="inherit"
                    onClick={handleClose}
                    aria-label="close"
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ p: 3 }}>
                {/* Basic Information */}
                <Box sx={{ mb: 1 }}>
                    <Typography
                        variant="subtitle1"
                        gutterBottom
                        fontWeight="bold"
                        color="primary"
                    >
                        Basic Information
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                name="name"
                                size="small"
                                label="Institution Name"
                                value={manualData.name}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                required
                                error={!!formErrors.name}
                                helperText={formErrors.name}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                name="region"
                                size="small"
                                label="Region"
                                value={manualData.region}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                error={!!formErrors.region}
                                helperText={formErrors.region}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                name="sec_registration"
                                size="small"
                                label="SEC Registration"
                                value={manualData.sec_registration}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                error={!!formErrors.sec_registration}
                                helperText={formErrors.sec_registration}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FormControl
                                fullWidth
                                variant="outlined"
                                size="small"
                                required
                                error={!!formErrors.institution_type}
                            >
                                <InputLabel id="institution-type-label">
                                    Institution Type
                                </InputLabel>
                                <Select
                                    labelId="institution-type-label"
                                    name="institution_type"
                                    value={manualData.institution_type}
                                    onChange={handleChange}
                                    label="Institution Type"
                                    required
                                    error={!!formErrors.institution_type}
                                >
                                    <MenuItem value="">
                                        <em>Select Type</em>
                                    </MenuItem>
                                    <MenuItem value="SUC">SUC</MenuItem>
                                    <MenuItem value="LUC">LUC</MenuItem>
                                    <MenuItem value="Private">Private</MenuItem>
                                </Select>
                                {formErrors.institution_type && (
                                    <Typography variant="caption" color="error">
                                        {formErrors.institution_type}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box>

                <Divider sx={{ my: 1 }} />

                {/* Address Information */}
                <Box sx={{ mb: 1 }}>
                    <Typography
                        variant="subtitle1"
                        gutterBottom
                        fontWeight="bold"
                        color="primary"
                    >
                        Address Information
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                name="address_street"
                                size="small"
                                label="Street Address"
                                value={manualData.address_street}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                error={!!formErrors.address_street}
                                helperText={formErrors.address_street}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                name="municipality_city"
                                size="small"
                                label="Municipality/City"
                                value={manualData.municipality_city}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                error={!!formErrors.municipality_city}
                                helperText={formErrors.municipality_city}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                name="province"
                                size="small"
                                label="Province"
                                value={manualData.province}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                error={!!formErrors.province}
                                helperText={formErrors.province}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                name="postal_code"
                                size="small"
                                label="Postal Code"
                                value={manualData.postal_code}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                error={!!formErrors.postal_code}
                                helperText={formErrors.postal_code}
                            />
                        </Grid>
                    </Grid>
                </Box>

                <Divider sx={{ my: 1 }} />

                {/* Contact Information */}
                <Box sx={{ mb: 1 }}>
                    <Typography
                        variant="subtitle1"
                        gutterBottom
                        fontWeight="bold"
                        color="primary"
                    >
                        Contact Information
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="institutional_telephone"
                                size="small"
                                label="Institutional Telephone"
                                value={manualData.institutional_telephone}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                error={!!formErrors.institutional_telephone}
                                helperText={formErrors.institutional_telephone}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="institutional_fax"
                                size="small"
                                label="Institutional Fax"
                                value={manualData.institutional_fax}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                error={!!formErrors.institutional_fax}
                                helperText={formErrors.institutional_fax}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="institutional_email"
                                size="small"
                                label="Institutional Email"
                                value={manualData.institutional_email}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                error={!!formErrors.institutional_email}
                                helperText={formErrors.institutional_email}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="institutional_website"
                                size="small"
                                label="Institutional Website"
                                value={manualData.institutional_website}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                error={!!formErrors.institutional_website}
                                helperText={formErrors.institutional_website}
                            />
                        </Grid>
                    </Grid>
                </Box>

                <Divider sx={{ my: 1 }} />

                {/* Head of Institution */}
                <Box sx={{ mb: 1 }}>
                    <Typography
                        variant="subtitle1"
                        gutterBottom
                        fontWeight="bold"
                        color="primary"
                    >
                        Head of Institution
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="head_name"
                                size="small"
                                label="Head Name"
                                value={manualData.head_name}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                error={!!formErrors.head_name}
                                helperText={formErrors.head_name}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="head_telephone"
                                size="small"
                                label="Head Telephone"
                                value={manualData.head_telephone}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                error={!!formErrors.head_telephone}
                                helperText={formErrors.head_telephone}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="head_title"
                                size="small"
                                label="Head Title"
                                value={manualData.head_title}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                error={!!formErrors.head_title}
                                helperText={formErrors.head_title}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="head_education"
                                size="small"
                                label="Head Education"
                                value={manualData.head_education}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                error={!!formErrors.head_education}
                                helperText={formErrors.head_education}
                            />
                        </Grid>
                    </Grid>
                </Box>

                <Divider sx={{ my: 1 }} />

                {/* Historical Dates */}
                <Box>
                    <Typography
                        variant="subtitle1"
                        gutterBottom
                        fontWeight="bold"
                        color="primary"
                    >
                        Historical Dates
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={3}>
                                <DatePicker
                                    views={["year"]}
                                    label="Year Established"
                                    value={
                                        manualData.year_established
                                            ? new Date(
                                                  manualData.year_established,
                                                  0
                                              )
                                            : null
                                    }
                                    onChange={(value) =>
                                        handleYearChange(
                                            "year_established",
                                            value
                                        )
                                    }
                                    maxDate={new Date(currentYear, 11, 31)} // Restrict to current year or earlier
                                    slotProps={{
                                        textField: {
                                            size: "small",
                                            fullWidth: true,
                                            error: !!formErrors.year_established,
                                            helperText:
                                                formErrors.year_established,
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <DatePicker
                                    views={["year"]}
                                    label="Year Approved"
                                    value={
                                        manualData.year_granted_approved
                                            ? new Date(
                                                  manualData.year_granted_approved,
                                                  0
                                              )
                                            : null
                                    }
                                    onChange={(value) =>
                                        handleYearChange(
                                            "year_granted_approved",
                                            value
                                        )
                                    }
                                    maxDate={new Date(currentYear, 11, 31)} // Restrict to current year or earlier
                                    slotProps={{
                                        textField: {
                                            size: "small",
                                            fullWidth: true,
                                            error:
                                                !!formErrors.year_granted_approved,
                                            helperText:
                                                formErrors.year_granted_approved,
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <DatePicker
                                    views={["year"]}
                                    label="Year → College"
                                    value={
                                        manualData.year_converted_college
                                            ? new Date(
                                                  manualData.year_converted_college,
                                                  0
                                              )
                                            : null
                                    }
                                    onChange={(value) =>
                                        handleYearChange(
                                            "year_converted_college",
                                            value
                                        )
                                    }
                                    maxDate={new Date(currentYear, 11, 31)} // Restrict to current year or earlier
                                    slotProps={{
                                        textField: {
                                            size: "small",
                                            fullWidth: true,
                                            error:
                                                !!formErrors.year_converted_college,
                                            helperText:
                                                formErrors.year_converted_college,
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <DatePicker
                                    views={["year"]}
                                    label="Year → University"
                                    value={
                                        manualData.year_converted_university
                                            ? new Date(
                                                  manualData.year_converted_university,
                                                  0
                                              )
                                            : null
                                    }
                                    onChange={(value) =>
                                        handleYearChange(
                                            "year_converted_university",
                                            value
                                        )
                                    }
                                    maxDate={new Date(currentYear, 11, 31)} // Restrict to current year or earlier
                                    slotProps={{
                                        textField: {
                                            size: "small",
                                            fullWidth: true,
                                            error:
                                                !!formErrors.year_converted_university,
                                            helperText:
                                                formErrors.year_converted_university,
                                        },
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </LocalizationProvider>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
                <Button
                    onClick={handleClose}
                    variant="outlined"
                    color="inherit"
                    startIcon={<CloseIcon />}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                >
                    Save Institution
                </Button>
            </DialogActions>
        </Dialog>
    );
}

ManualInstitutionDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    getInstitutionType: PropTypes.func.isRequired,
    fetchInstitutions: PropTypes.func.isRequired,
    setSnackbarOpen: PropTypes.func.isRequired,
    setSnackbarMessage: PropTypes.func.isRequired,
    setSnackbarSeverity: PropTypes.func.isRequired,
};

export default ManualInstitutionDialog;
