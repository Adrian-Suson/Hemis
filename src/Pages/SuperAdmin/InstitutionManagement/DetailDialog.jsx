// src/components/DetailDialog.jsx
import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Box,
    Grid,
    Paper,
    Divider,
    IconButton,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import useActivityLog from "../../../Hooks/useActivityLog";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

const DetailDialog = ({
    open,
    onClose,
    institution,
    onEdit,
    setSnackbarOpen,
    setSnackbarMessage,
    setSnackbarSeverity,
    fetchInstitutions, // Added to refresh institution list
}) => {
    const { createLog } = useActivityLog();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        id: institution?.id || null,
        name: institution?.name || "",
        region: institution?.region || "",
        address_street: institution?.address_street || "",
        municipality_city: institution?.municipality_city || "",
        province: institution?.province || "",
        postal_code: institution?.postal_code || "",
        institutional_telephone: institution?.institutional_telephone || "",
        institutional_fax: institution?.institutional_fax || "",
        head_telephone: institution?.head_telephone || "",
        institutional_email: institution?.institutional_email || "",
        institutional_website: institution?.institutional_website || "",
        year_established: institution?.year_established || null,
        sec_registration: institution?.sec_registration || "",
        year_granted_approved: institution?.year_granted_approved || null,
        year_converted_college: institution?.year_converted_college || null,
        year_converted_university:
            institution?.year_converted_university || null,
        head_name: institution?.head_name || "",
        head_title: institution?.head_title || "",
        head_education: institution?.head_education || "",
        institution_type: institution?.institution_type || "",
    });
    const [errors, setErrors] = useState({});
    const currentYear = new Date().getFullYear(); // Get the current year

    if (!institution) return null;

    const showSnackbar = (message, severity) => {
        if (setSnackbarMessage && setSnackbarOpen && setSnackbarSeverity) {
            setSnackbarMessage(message);
            setSnackbarSeverity(severity);
            setSnackbarOpen(true);
        } else {
            console.log(`[Snackbar] ${severity}: ${message}`);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name?.trim()) {
            newErrors.name = "Institution name is required.";
        } else if (formData.name.length > 255) {
            newErrors.name = "Must be 255 characters or less.";
        }

        if (!formData.region?.trim()) {
            newErrors.region = "Region is required.";
        } else if (formData.region.length > 255) {
            newErrors.region = "Must be 255 characters or less.";
        }

        if (!formData.id || isNaN(parseInt(formData.id, 10))) {
            newErrors.id = "Valid institution ID is required.";
        }

        if (formData.address_street && formData.address_street.length > 255) {
            newErrors.address_street = "Must be 255 characters or less.";
        }

        if (
            formData.municipality_city &&
            formData.municipality_city.length > 255
        ) {
            newErrors.municipality_city = "Must be 255 characters or less.";
        }

        if (formData.province && formData.province.length > 255) {
            newErrors.province = "Must be 255 characters or less.";
        }

        if (formData.postal_code && formData.postal_code.length > 10) {
            newErrors.postal_code = "Must be 10 characters or less.";
        }

        if (
            formData.institutional_email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.institutional_email)
        ) {
            newErrors.institutional_email = "Must be a valid email address.";
        }

        if (
            formData.institutional_website &&
            !/^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/.test(
                formData.institutional_website
            )
        ) {
            newErrors.institutional_website = "Must be a valid URL.";
        }

        const yearFields = [
            "year_established",
            "year_granted_approved",
            "year_converted_college",
            "year_converted_university",
        ];
        yearFields.forEach((field) => {
            if (formData[field]) {
                const year = parseInt(formData[field], 10);
                if (isNaN(year)) {
                    newErrors[field] = "Must be a valid year.";
                } else if (year < 1800 || year > new Date().getFullYear()) {
                    newErrors[
                        field
                    ] = `Must be between 1800 and ${new Date().getFullYear()}.`;
                }
            }
        });

        if (
            formData.institutional_telephone &&
            formData.institutional_telephone.length > 20
        ) {
            newErrors.institutional_telephone =
                "Must be 20 characters or less.";
        }

        if (
            formData.institutional_fax &&
            formData.institutional_fax.length > 20
        ) {
            newErrors.institutional_fax = "Must be 20 characters or less.";
        }

        if (formData.head_telephone && formData.head_telephone.length > 20) {
            newErrors.head_telephone = "Must be 20 characters or less.";
        }

        if (
            formData.sec_registration &&
            formData.sec_registration.length > 255
        ) {
            newErrors.sec_registration = "Must be 255 characters or less.";
        }

        if (formData.head_name && formData.head_name.length > 255) {
            newErrors.head_name = "Must be 255 characters or less.";
        }

        if (formData.head_title && formData.head_title.length > 255) {
            newErrors.head_title = "Must be 255 characters or less.";
        }

        if (formData.head_education && formData.head_education.length > 255) {
            newErrors.head_education = "Must be 255 characters or less.";
        }

        if (
            formData.institution_type &&
            !["SUC", "LUC", "Private"].includes(formData.institution_type)
        ) {
            newErrors.institution_type = "Must be SUC, LUC, or Private.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleYearChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value ? value.getFullYear() : null,
        }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        setErrors({});
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({
            id: institution.id,
            name: institution.name || "",
            region: institution.region || "",
            address_street: institution.address_street || "",
            municipality_city: institution.municipality_city || "",
            province: institution.province || "",
            postal_code: institution.postal_code || "",
            institutional_telephone: institution.institutional_telephone || "",
            institutional_fax: institution.institutional_fax || "",
            head_telephone: institution.head_telephone || "",
            institutional_email: institution.institutional_email || "",
            institutional_website: institution.institutional_website || "",
            year_established: institution.year_established || null,
            sec_registration: institution.sec_registration || "",
            year_granted_approved: institution.year_granted_approved || null,
            year_converted_college: institution.year_converted_college || null,
            year_converted_university:
                institution.year_converted_university || null,
            head_name: institution.head_name || "",
            head_title: institution.head_title || "",
            head_education: institution.head_education || "",
            institution_type: institution.institution_type || "",
        });
        setErrors({});
    };

    const handleUpdate = async () => {
        if (!validateForm()) {
            showSnackbar("Validation failed. Please check the form.", "error");
            return;
        }

        const token = localStorage.getItem("token");
        try {
            const payload = {
                name: formData.name || null,
                region: formData.region || null,
                address_street: formData.address_street || null,
                municipality_city: formData.municipality_city || null,
                province: formData.province || null,
                postal_code: formData.postal_code || null,
                institutional_telephone:
                    formData.institutional_telephone || null,
                institutional_fax: formData.institutional_fax || null,
                head_telephone: formData.head_telephone || null,
                institutional_email: formData.institutional_email || null,
                institutional_website: formData.institutional_website || null,
                year_established: formData.year_established
                    ? parseInt(formData.year_established, 10) || null
                    : null,
                sec_registration: formData.sec_registration || null,
                year_granted_approved: formData.year_granted_approved
                    ? parseInt(formData.year_granted_approved, 10) || null
                    : null,
                year_converted_college: formData.year_converted_college
                    ? parseInt(formData.year_converted_college, 10) || null
                    : null,
                year_converted_university: formData.year_converted_university
                    ? parseInt(formData.year_converted_university, 10) || null
                    : null,
                head_name: formData.head_name || null,
                head_title: formData.head_title || null,
                head_education: formData.head_education || null,
                institution_type: formData.institution_type || null,
            };

            console.log("[Update Institution] Sending data:", payload);

            const response = await axios.put(
                `http://localhost:8000/api/institutions/${formData.id}`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("[Update Institution] Server response:", response.data);

            // Log the update action
            await createLog({
                action: "updated_institution",
                description: `Updated institution: ${formData.name}`,
                modelType: "App\\Models\\Institution",
                modelId: formData.id,
                properties: {
                    name: formData.name,
                    institution_type: formData.institution_type,
                },
            });

            // Use payload as a fallback if response.data is undefined
            onEdit(response.data || payload);
            showSnackbar("Institution updated successfully!", "success");
            setIsEditing(false);
            fetchInstitutions(); // Refresh institution list
        } catch (error) {
            console.error(
                "[Update Institution] Error:",
                error.response?.data || error.message
            );
            let errorMessage =
                "Failed to update institution. Please try again.";
            if (error.response?.status === 422) {
                const validationErrors = error.response.data.errors;
                console.log(
                    "[Update Institution] Validation Errors:",
                    validationErrors
                );
                errorMessage =
                    "Validation failed: " +
                    Object.values(validationErrors).flat().join(", ");
                const mappedErrors = {};
                Object.keys(validationErrors).forEach((key) => {
                    const field = key.split(".").pop();
                    mappedErrors[field] = validationErrors[key][0];
                });
                setErrors(mappedErrors);
            }
            showSnackbar(errorMessage, "error");
        }
    };

    const formatField = (label, field, value) => {
        const displayValue = value || "N/A";
        return (
            <Grid item xs={12} sm={6} key={label}>
                {isEditing ? (
                    field === "institution_type" ? (
                        <FormControl
                            fullWidth
                            size="small"
                            sx={{ mt: 1 }}
                            error={!!errors[field]}
                        >
                            <InputLabel>{label}</InputLabel>
                            <Select
                                name={field}
                                value={formData[field] || ""}
                                onChange={handleInputChange}
                                label={label}
                            >
                                <MenuItem value="">
                                    <em>Select Type</em>
                                </MenuItem>
                                <MenuItem value="SUC">SUC</MenuItem>
                                <MenuItem value="LUC">LUC</MenuItem>
                                <MenuItem value="Private">Private</MenuItem>
                            </Select>
                            {errors[field] && (
                                <Typography
                                    variant="caption"
                                    color="error"
                                    sx={{ mt: 0.5 }}
                                >
                                    {errors[field]}
                                </Typography>
                            )}
                        </FormControl>
                    ) : field.includes("year") ? (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                                views={["year"]}
                                label={label}
                                value={
                                    formData[field]
                                        ? new Date(formData[field], 0)
                                        : null
                                }
                                onChange={(value) =>
                                    handleYearChange(field, value)
                                }
                                maxDate={new Date(currentYear, 11, 31)} // Restrict to current year or earlier
                                sx={{ mt: 1 }}
                                slotProps={{
                                    textField: {
                                        size: "small",
                                        fullWidth: true,
                                        error: !!errors[field],
                                        helperText: errors[field],
                                    },
                                }}
                            />
                        </LocalizationProvider>
                    ) : (
                        <TextField
                            fullWidth
                            label={label}
                            name={field}
                            value={formData[field] || ""}
                            onChange={handleInputChange}
                            error={!!errors[field]}
                            helperText={errors[field]}
                            size="small"
                            variant="outlined"
                            sx={{ mt: 1 }}
                            required={field === "name" || field === "region"}
                        />
                    )
                ) : (
                    <Typography
                        variant="body1"
                        sx={{
                            fontSize: "1rem",
                            color:
                                displayValue === "N/A"
                                    ? "text.secondary"
                                    : "text.primary",
                            lineHeight: 1.6,
                        }}
                    >
                        <strong>{label}:</strong>{" "}
                        {displayValue === "N/A" ? (
                            <span
                                style={{
                                    fontStyle: "italic",
                                    color: "#757575",
                                }}
                            >
                                Not Available
                            </span>
                        ) : (
                            displayValue
                        )}
                    </Typography>
                )}
            </Grid>
        );
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            aria-labelledby="institution-details-dialog"
            sx={{ "& .MuiDialog-paper": { borderRadius: 2, boxShadow: 3 } }}
        >
            <DialogTitle
                id="institution-details-dialog"
                sx={{
                    backgroundColor: "#1976d2",
                    color: "white",
                    p: 2.5,
                    fontSize: "1.5rem",
                    fontWeight: 600,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                {isEditing
                    ? "Edit Institution"
                    : institution.name || "Institution Details"}
                <IconButton
                    onClick={onClose}
                    sx={{
                        color: "white",
                        "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                        },
                    }}
                    aria-label="close"
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 4, backgroundColor: "#f9f9f9" }}>
                <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                    <Box sx={{ mb: 3 }}>
                        <Typography
                            variant="h6"
                            sx={{ mb: 1, color: "#424242" }}
                        >
                            General Information
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Grid container spacing={2}>
                            {formatField("Name", "name", institution.name)}
                            {formatField(
                                "Institution Type",
                                "institution_type",
                                institution.institution_type
                            )}
                            {formatField(
                                "Region",
                                "region",
                                institution.region
                            )}
                            {formatField(
                                "Street Address",
                                "address_street",
                                institution.address_street
                            )}
                            {formatField(
                                "Municipality/City",
                                "municipality_city",
                                institution.municipality_city
                            )}
                            {formatField(
                                "Province",
                                "province",
                                institution.province
                            )}
                            {formatField(
                                "Postal Code",
                                "postal_code",
                                institution.postal_code
                            )}
                        </Grid>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        <Typography
                            variant="h6"
                            sx={{ mb: 1, color: "#424242" }}
                        >
                            Contact Information
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Grid container spacing={2}>
                            {formatField(
                                "Institutional Telephone",
                                "institutional_telephone",
                                institution.institutional_telephone
                            )}
                            {formatField(
                                "Institutional Fax",
                                "institutional_fax",
                                institution.institutional_fax
                            )}
                            {formatField(
                                "Head Telephone",
                                "head_telephone",
                                institution.head_telephone
                            )}
                            {formatField(
                                "Email",
                                "institutional_email",
                                institution.institutional_email
                            )}
                            {formatField(
                                "Website",
                                "institutional_website",
                                institution.institutional_website
                            )}
                        </Grid>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        <Typography
                            variant="h6"
                            sx={{ mb: 1, color: "#424242" }}
                        >
                            Institutional Details
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Grid container spacing={2}>
                            {formatField(
                                "Year Established",
                                "year_established",
                                institution.year_established
                            )}
                            {formatField(
                                "SEC Registration",
                                "sec_registration",
                                institution.sec_registration
                            )}
                            {formatField(
                                "Year Granted/Approved",
                                "year_granted_approved",
                                institution.year_granted_approved
                            )}
                            {formatField(
                                "Year Converted to College",
                                "year_converted_college",
                                institution.year_converted_college
                            )}
                            {formatField(
                                "Year Converted to University",
                                "year_converted_university",
                                institution.year_converted_university
                            )}
                        </Grid>
                    </Box>

                    <Box>
                        <Typography
                            variant="h6"
                            sx={{ mb: 1, color: "#424242" }}
                        >
                            Leadership
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Grid container spacing={2}>
                            {formatField(
                                "Head Name",
                                "head_name",
                                institution.head_name
                            )}
                            {formatField(
                                "Head Title",
                                "head_title",
                                institution.head_title
                            )}
                            {formatField(
                                "Head Education",
                                "head_education",
                                institution.head_education
                            )}
                        </Grid>
                    </Box>
                </Paper>
            </DialogContent>

            <DialogActions
                sx={{
                    p: 2,
                    backgroundColor: "#f1f1f1",
                    borderTop: "1px solid #e0e0e0",
                    justifyContent: isEditing ? "space-between" : "flex-end",
                }}
            >
                {isEditing ? (
                    <>
                        <Button
                            onClick={handleCancel}
                            color="secondary"
                            variant="outlined"
                            sx={{ textTransform: "none" }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpdate}
                            color="primary"
                            variant="contained"
                            sx={{ textTransform: "none" }}
                            disabled={!formData.name || !formData.region}
                        >
                            Save
                        </Button>
                    </>
                ) : (
                    <Button
                        onClick={handleEdit}
                        color="primary"
                        variant="contained"
                        sx={{ textTransform: "none" }}
                    >
                        Edit
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

DetailDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    institution: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string,
        region: PropTypes.string,
        address_street: PropTypes.string,
        municipality_city: PropTypes.string,
        province: PropTypes.string,
        postal_code: PropTypes.string,
        institutional_telephone: PropTypes.string,
        institutional_fax: PropTypes.string,
        head_telephone: PropTypes.string,
        institutional_email: PropTypes.string,
        institutional_website: PropTypes.string,
        year_established: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        sec_registration: PropTypes.string,
        year_granted_approved: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        year_converted_college: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        year_converted_university: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        head_name: PropTypes.string,
        head_title: PropTypes.string,
        head_education: PropTypes.string,
        institution_type: PropTypes.string,
    }),
    onEdit: PropTypes.func.isRequired,
    setSnackbarOpen: PropTypes.func,
    setSnackbarMessage: PropTypes.func,
    setSnackbarSeverity: PropTypes.func,
    fetchInstitutions: PropTypes.func, // Added for refreshing
};

DetailDialog.defaultProps = {
    institution: null,
    fetchInstitutions: () => {},
};

export default DetailDialog;
