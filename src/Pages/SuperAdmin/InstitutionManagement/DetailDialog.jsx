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
} from "@mui/material";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

const DetailDialog = ({
    open,
    onClose,
    institution,
    onEdit,
    setSnackbarOpen,
    setSnackbarMessage,
    setSnackbarSeverity,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(institution || {});
    const [errors, setErrors] = useState({});

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

        if (!formData.id || isNaN(parseInt(formData.id, 10))) {
            newErrors.id = "Valid institution ID is required.";
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

    const handleEdit = () => {
        setIsEditing(true);
        setFormData(institution); // Reset to original data
        setErrors({});
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData(institution); // Reset to original data
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

            onEdit(response.data.data || payload); // Notify parent of update
            showSnackbar("Institution updated successfully!", "success");
            setIsEditing(false);
            // Optionally navigate, e.g., to institution list
            // navigate("/institutions");
        } catch (error) {
            console.error("[Update Institution] Error:", error);
            let errorMessage =
                "Failed to update institution. Please try again.";
            if (error.response?.status === 422) {
                const validationErrors = error.response.data.errors;
                console.log(
                    "[Update Institution] Full Error Response:",
                    error.response.data
                );
                console.log(
                    "[Update Institution] Validation Errors:",
                    validationErrors
                );
                errorMessage =
                    "Validation failed: " +
                    Object.values(validationErrors).flat().join(", ");
                // Map backend errors to form fields
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
                        type={field.includes("year") ? "number" : "text"}
                        required={field === "name"}
                    />
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
            {/* Dialog Header with Close Icon */}
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

            {/* Dialog Content */}
            <DialogContent sx={{ p: 4, backgroundColor: "#f9f9f9" }}>
                <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
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
                                "Postal Code",
                                "postal_code",
                                institution.postal_code
                            )}
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
                            {formatField("Name", "name", institution.name)}
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

            {/* Dialog Actions */}
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
    }),
    onEdit: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
    setSnackbarOpen: PropTypes.func,
    setSnackbarMessage: PropTypes.func,
    setSnackbarSeverity: PropTypes.func,
};

DetailDialog.defaultProps = {
    institution: null,
};

export default DetailDialog;
