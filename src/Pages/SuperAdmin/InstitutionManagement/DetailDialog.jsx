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
    Button,
} from "@mui/material";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";
import EditDialog from "./EditDialog";

const DetailDialog = ({
    open,
    onClose,
    institution,
    onEdit,
    setSnackbarOpen,
    setSnackbarMessage,
    setSnackbarSeverity,
    fetchInstitutions,
}) => {
    const [isEditing, setIsEditing] = useState(false);

    if (!institution) return null;

    const formatField = (label, value) => {
        const displayValue = value || "N/A";
        return (
            <Grid size={{ xs: 12, sm: 6 }} key={label}>
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
            </Grid>
        );
    };

    return (
        <>
            <Dialog
                open={open && !isEditing}
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
                    {institution.name || "Institution Details"}
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
                                {formatField("Name", institution.name)}
                                {formatField("SEC Registration", institution.sec_registration)}
                                {formatField("Institution Type", institution.institution_type)}
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
                                {formatField("Street Address", institution.address_street)}
                                {formatField("Region", institution.region)}
                                {formatField("Province", institution.province)}
                                {formatField("Municipality/City", institution.municipality)}
                                {formatField("Postal Code", institution.postal_code)}
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
                                {formatField("Institutional Telephone", institution.institutional_telephone)}
                                {formatField("Institutional Fax", institution.institutional_fax)}
                                {formatField("Institutional Email", institution.institutional_email)}
                                {formatField("Institutional Website", institution.institutional_website)}
                                {formatField("Head Telephone", institution.head_telephone)}
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
                                {formatField("Head Name", institution.head_name)}
                                {formatField("Head Title", institution.head_title)}
                                {formatField("Head Education", institution.head_education)}
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
                                {formatField("Year Established", institution.year_established)}
                                {formatField("Year Approved", institution.year_granted_approved)}
                                {formatField("Year → College", institution.year_converted_college)}
                                {formatField("Year → University", institution.year_converted_university)}
                            </Grid>
                        </Box>
                    </Paper>
                </DialogContent>

                <DialogActions
                    sx={{
                        p: 2,
                        backgroundColor: "#f1f1f1",
                        borderTop: "1px solid #e0e0e0",
                        justifyContent: "flex-end",
                    }}
                >
                    <Button
                        onClick={() => setIsEditing(true)}
                        color="primary"
                        variant="contained"
                        sx={{ textTransform: "none" }}
                    >
                        Edit
                    </Button>
                </DialogActions>
            </Dialog>

            <EditDialog
                open={open && isEditing}
                onClose={() => {
                    setIsEditing(false);
                    onClose();
                }}
                institution={institution}
                onEdit={onEdit}
                setSnackbarOpen={setSnackbarOpen}
                setSnackbarMessage={setSnackbarMessage}
                setSnackbarSeverity={setSnackbarSeverity}
                fetchInstitutions={fetchInstitutions}
            />
        </>
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
        municipality: PropTypes.string,
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
    fetchInstitutions: PropTypes.func,
};

DetailDialog.defaultProps = {
    institution: null,
    fetchInstitutions: () => {},
};

export default DetailDialog;
