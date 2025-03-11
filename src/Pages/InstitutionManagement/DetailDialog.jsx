import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Tooltip,
    CircularProgress,
    Box,
    Grid,
    Paper,
    Divider,
    ButtonGroup,
} from "@mui/material";
import PropTypes from "prop-types";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import { useState } from "react";

const DetailDialog = ({ open, onClose, institution, navigate }) => {
    const [loading, setLoading] = useState({
        viewCampuses: false,
        edit: false,
        academicPrograms: false,
    });

    if (!institution) return null;

    const handleNavigation = async (path, key) => {
        setLoading((prev) => ({ ...prev, [key]: true }));
        try {
            navigate(path);
        } finally {
            setLoading((prev) => ({ ...prev, [key]: false }));
            onClose();
        }
    };

    const formatField = (label, value) => (
        <Grid item xs={12} sm={6} key={label}>
            <Typography
                variant="body1"
                sx={{
                    fontSize: "1rem",
                    color: value === "N/A" ? "text.secondary" : "text.primary",
                    lineHeight: 1.6,
                }}
            >
                <strong>{label}:</strong>{" "}
                {value === "N/A" ? (
                    <span style={{ fontStyle: "italic", color: "#757575" }}>
                        Not Available
                    </span>
                ) : (
                    value
                )}
            </Typography>
        </Grid>
    );

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            aria-labelledby="institution-details-dialog"
            sx={{ "& .MuiDialog-paper": { borderRadius: 2, boxShadow: 3 } }}
        >
            {/* Dialog Header */}
            <DialogTitle
                id="institution-details-dialog"
                sx={{
                    backgroundColor: "#1976d2", // Professional blue
                    color: "white",
                    p: 2.5,
                    fontSize: "1.5rem",
                    fontWeight: 600,
                }}
            >
                {institution.name || "Institution Details"}
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
                                institution.postal_code || "N/A"
                            )}
                            {formatField(
                                "Institutional Telephone",
                                institution.institutional_telephone || "N/A"
                            )}
                            {formatField(
                                "Institutional Fax",
                                institution.institutional_fax || "N/A"
                            )}
                            {formatField(
                                "Head Telephone",
                                institution.head_telephone || "N/A"
                            )}
                            {formatField(
                                "Email",
                                institution.institutional_email || "N/A"
                            )}
                            {formatField(
                                "Website",
                                institution.institutional_website || "N/A"
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
                                institution.year_established || "N/A"
                            )}
                            {formatField(
                                "SEC Registration",
                                institution.sec_registration || "N/A"
                            )}
                            {formatField(
                                "Year Granted/Approved",
                                institution.year_granted_approved || "N/A"
                            )}
                            {formatField(
                                "Year Converted to College",
                                institution.year_converted_college || "N/A"
                            )}
                            {formatField(
                                "Year Converted to University",
                                institution.year_converted_university || "N/A"
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
                                institution.head_name || "N/A"
                            )}
                            {formatField(
                                "Head Title",
                                institution.head_title || "N/A"
                            )}
                            {formatField(
                                "Head Education",
                                institution.head_education || "N/A"
                            )}
                        </Grid>
                    </Box>
                </Paper>
            </DialogContent>

            <DialogActions
                sx={{
                    p: 2,
                    backgroundColor: "#f1f1f1",
                    justifyContent: "space-between",
                    borderTop: "1px solid #e0e0e0",
                }}
            >
                {/* ButtonGroup for the first three actions */}
                <ButtonGroup variant="outlined" size="small">
                    {/* View Campuses */}
                    <Tooltip title="View Campuses">
                        <Button
                            onClick={() =>
                                handleNavigation(
                                    `/admin/institutions/campuses/${institution.id}`,
                                    "viewCampuses"
                                )
                            }
                            disabled={loading.viewCampuses}
                            startIcon={
                                loading.viewCampuses ? (
                                    <CircularProgress
                                        size={18}
                                        color="inherit"
                                    />
                                ) : (
                                    <VisibilityIcon />
                                )
                            }
                            sx={{
                                color: "#1976d2",
                                borderColor: "#1976d2",
                                "&:hover": {
                                    borderColor: "#115293",
                                    color: "#115293",
                                },
                                textTransform: "none",
                            }}
                        >
                            View Campuses
                        </Button>
                    </Tooltip>

                    {/* Faculties */}
                    <Tooltip title="View Faculties">
                        <Button
                            onClick={() =>
                                handleNavigation(
                                    `/admin/institutions/faculties/${institution.id}`,
                                    "faculties"
                                )
                            }
                            disabled={loading.faculties}
                            startIcon={
                                loading.faculties ? (
                                    <CircularProgress
                                        size={18}
                                        color="inherit"
                                    />
                                ) : (
                                    <LibraryBooksIcon />
                                )
                            }
                            sx={{
                                color: "#1976d2",
                                borderColor: "#1976d2",
                                "&:hover": {
                                    borderColor: "#115293",
                                    color: "#115293",
                                },
                                textTransform: "none",
                            }}
                        >
                            Faculties
                        </Button>
                    </Tooltip>

                    {/* Curricular Programs */}
                    <Tooltip title="View Academic Programs">
                        <Button
                            onClick={() =>
                                handleNavigation(
                                    `/admin/institutions/curricular-programs/${institution.id}`,
                                    "academicPrograms"
                                )
                            }
                            disabled={loading.academicPrograms}
                            startIcon={
                                loading.academicPrograms ? (
                                    <CircularProgress
                                        size={18}
                                        color="inherit"
                                    />
                                ) : (
                                    <LibraryBooksIcon />
                                )
                            }
                            sx={{
                                color: "#1976d2",
                                borderColor: "#1976d2",
                                "&:hover": {
                                    borderColor: "#115293",
                                    color: "#115293",
                                },
                                textTransform: "none",
                            }}
                        >
                            Curricular Programs
                        </Button>
                    </Tooltip>
                </ButtonGroup>

                {/* Close Button remains separate on the right */}
                <Button
                    onClick={onClose}
                    variant="outlined"
                    size="small"
                    sx={{
                        color: "#d32f2f",
                        borderColor: "#d32f2f",
                        "&:hover": { borderColor: "#b71c1c", color: "#b71c1c" },
                        textTransform: "none",
                    }}
                >
                    Close
                </Button>
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
        year_established: PropTypes.string,
        sec_registration: PropTypes.string,
        year_granted_approved: PropTypes.string,
        year_converted_college: PropTypes.string,
        year_converted_university: PropTypes.string,
        head_name: PropTypes.string,
        head_title: PropTypes.string,
        head_education: PropTypes.string,
    }),
    onEdit: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
};

DetailDialog.defaultProps = {
    institution: null,
};

export default DetailDialog;
