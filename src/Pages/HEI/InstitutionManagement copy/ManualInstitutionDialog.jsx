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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import PropTypes from "prop-types";

function ManualInstitutionDialog({
    open,
    onClose,
    getInstitutionType,
    fetchInstitutions,
    showProgress,
    hideProgress,
    setSnackbarOpen,
    setSnackbarMessage,
    setSnackbarSeverity,
}) {
    // Local state for the form fields
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
        year_established: "",
        sec_registration: "",
        year_granted_approved: "",
        year_converted_college: "",
        year_converted_university: "",
        head_name: "",
        head_title: "",
        head_education: "",
    });

    // Local state for form errors
    const [formErrors, setFormErrors] = useState({});

    // Update state as user types
    const handleChange = (e) => {
        setManualData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // Reset the form
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
            year_established: "",
            sec_registration: "",
            year_granted_approved: "",
            year_converted_college: "",
            year_converted_university: "",
            head_name: "",
            head_title: "",
            head_education: "",
        });
        setFormErrors({});
    };

    // Close the dialog and reset form
    const handleClose = () => {
        onClose();
        resetForm();
    };

    // 1. Validate fields to mirror your backend rules
    //    Return an object of errors. If empty, form is valid.
    const validateForm = () => {
        const errors = {};

        // name: required|string|max:255
        if (!manualData.name.trim()) {
            errors.name = "Name is required.";
        } else if (manualData.name.length > 255) {
            errors.name = "Name must not exceed 255 characters.";
        }

        // region: required|string|max:255
        if (!manualData.region.trim()) {
            errors.region = "Region is required.";
        } else if (manualData.region.length > 255) {
            errors.region = "Region must not exceed 255 characters.";
        }

        // address_street: nullable|string|max:255
        if (
            manualData.address_street &&
            manualData.address_street.length > 255
        ) {
            errors.address_street = "Street must not exceed 255 characters.";
        }

        // municipality_city: nullable|string|max:255
        if (
            manualData.municipality_city &&
            manualData.municipality_city.length > 255
        ) {
            errors.municipality_city =
                "Municipality/City must not exceed 255 characters.";
        }

        // province: nullable|string|max:255
        if (manualData.province && manualData.province.length > 255) {
            errors.province = "Province must not exceed 255 characters.";
        }

        // postal_code: nullable|string|max:10
        if (manualData.postal_code && manualData.postal_code.length > 10) {
            errors.postal_code = "Postal code must not exceed 10 characters.";
        }

        // institutional_telephone: nullable|string|max:20
        if (
            manualData.institutional_telephone &&
            manualData.institutional_telephone.length > 20
        ) {
            errors.institutional_telephone = "Max 20 characters.";
        }

        // institutional_fax: nullable|string|max:20
        if (
            manualData.institutional_fax &&
            manualData.institutional_fax.length > 20
        ) {
            errors.institutional_fax = "Max 20 characters.";
        }

        // head_telephone: nullable|string|max:20
        if (
            manualData.head_telephone &&
            manualData.head_telephone.length > 20
        ) {
            errors.head_telephone = "Max 20 characters.";
        }

        // institutional_email: nullable|email|max:255
        if (manualData.institutional_email) {
            if (manualData.institutional_email.length > 255) {
                errors.institutional_email =
                    "Email must not exceed 255 characters.";
            } else {
                // Basic email regex check
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(manualData.institutional_email)) {
                    errors.institutional_email = "Invalid email format.";
                }
            }
        }

        // institutional_website: nullable|string|max:255
        if (
            manualData.institutional_website &&
            manualData.institutional_website.length > 255
        ) {
            errors.institutional_website =
                "Website must not exceed 255 characters.";
        }

        // year_established: nullable|integer
        if (
            manualData.year_established &&
            !/^\d+$/.test(manualData.year_established)
        ) {
            errors.year_established = "Must be an integer.";
        }

        // sec_registration: nullable|string|max:255
        if (
            manualData.sec_registration &&
            manualData.sec_registration.length > 255
        ) {
            errors.sec_registration =
                "SEC Registration must not exceed 255 characters.";
        }

        // year_granted_approved: nullable|integer
        if (
            manualData.year_granted_approved &&
            !/^\d+$/.test(manualData.year_granted_approved)
        ) {
            errors.year_granted_approved = "Must be an integer.";
        }

        // year_converted_college: nullable|integer
        if (
            manualData.year_converted_college &&
            !/^\d+$/.test(manualData.year_converted_college)
        ) {
            errors.year_converted_college = "Must be an integer.";
        }

        // year_converted_university: nullable|integer
        if (
            manualData.year_converted_university &&
            !/^\d+$/.test(manualData.year_converted_university)
        ) {
            errors.year_converted_university = "Must be an integer.";
        }

        // head_name: nullable|string|max:255
        if (manualData.head_name && manualData.head_name.length > 255) {
            errors.head_name = "Head name must not exceed 255 characters.";
        }

        // head_title: nullable|string|max:255
        if (manualData.head_title && manualData.head_title.length > 255) {
            errors.head_title = "Head title must not exceed 255 characters.";
        }

        // head_education: nullable|string|max:255
        if (
            manualData.head_education &&
            manualData.head_education.length > 255
        ) {
            errors.head_education =
                "Head education must not exceed 255 characters.";
        }

        return errors;
    };

    // Submit form data to server
    const handleSave = async () => {
        // 2. Run client-side validation
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            // If there are errors, set them and don't submit
            setFormErrors(errors);
            return;
        }

        showProgress(10);
        try {
            const token = localStorage.getItem("token");

            // Merge form data with the institution type from parent
            const payload = {
                ...manualData,
                institution_type: getInstitutionType(),
            };

            await axios.post(
                "http://localhost:8000/api/institutions",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            // Refresh the list in parent
            fetchInstitutions();

            // Show success in Snackbar
            setSnackbarMessage("Institution data successfully added!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);

            // Close dialog
            handleClose();
        } catch (error) {
            console.error("Error sending manual data to backend:", error);
            setSnackbarMessage("Error adding institution data");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        } finally {
            hideProgress();
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
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="region"
                                size="small"
                                label="Region"
                                value={manualData.region}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                required
                                error={!!formErrors.region}
                                helperText={formErrors.region}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
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
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                name="year_established"
                                size="small"
                                label="Year Established"
                                value={manualData.year_established}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                error={!!formErrors.year_established}
                                helperText={formErrors.year_established}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                name="year_granted_approved"
                                size="small"
                                label="Year Approved"
                                value={manualData.year_granted_approved}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                error={!!formErrors.year_granted_approved}
                                helperText={formErrors.year_granted_approved}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                name="year_converted_college"
                                size="small"
                                label="Year → College"
                                value={manualData.year_converted_college}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                error={!!formErrors.year_converted_college}
                                helperText={formErrors.year_converted_college}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                name="year_converted_university"
                                size="small"
                                label="Year → University"
                                value={manualData.year_converted_university}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                error={!!formErrors.year_converted_university}
                                helperText={
                                    formErrors.year_converted_university
                                }
                            />
                        </Grid>
                    </Grid>
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

// Define PropTypes for the component
ManualInstitutionDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    getInstitutionType: PropTypes.func.isRequired,
    fetchInstitutions: PropTypes.func.isRequired,
    showProgress: PropTypes.func.isRequired,
    hideProgress: PropTypes.func.isRequired,
    setSnackbarOpen: PropTypes.func.isRequired,
    setSnackbarMessage: PropTypes.func.isRequired,
    setSnackbarSeverity: PropTypes.func.isRequired,
};

export default ManualInstitutionDialog;
