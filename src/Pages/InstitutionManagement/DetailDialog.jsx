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
} from "@mui/material";
import PropTypes from "prop-types";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import { useState } from "react";

const DetailDialog = ({ open, onClose, institution, onEdit, navigate }) => {
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

    // Format fields for better display
    const formatField = (label, value) => (
        <Grid item xs={12} sm={6} key={label}>
            <Typography
                variant="body2"
                sx={{
                    fontSize: "0.9rem",
                    color: value === "N/A" ? "text.secondary" : "text.primary",
                }}
            >
                <strong>{label}:</strong>{" "}
                {value === "N/A" ? (
                    <span style={{ fontStyle: "italic" }}>Not Available</span>
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
        >
            {/* Dialog Header */}
            <DialogTitle
                id="institution-details-dialog"
                sx={{
                    backgroundColor: "#f5f5f5",
                    p: 2,
                    fontWeight: "bold",
                }}
            >
                {institution.name || "Institution Details"}
            </DialogTitle>

            {/* Dialog Content */}
            <DialogContent sx={{ p: 3, backgroundColor: "#fafafa" }}>
                <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
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
                </Paper>
            </DialogContent>

            {/* Action Buttons */}
            <DialogActions
                sx={{
                    p: 2,
                    backgroundColor: "#f5f5f5",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                }}
            >
                {/* Left-side Actions */}
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <Tooltip title="View Campuses">
                        <Button
                            variant="contained"
                            color="primary"
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
                            sx={{ textTransform: "none", fontSize: "0.85rem" }}
                        >
                            View Campuses
                        </Button>
                    </Tooltip>

                    <Tooltip title="Edit Institution">
                        <Button
                            variant="contained"
                            color="warning"
                            onClick={() => {
                                setLoading((prev) => ({ ...prev, edit: true }));
                                onEdit(institution);
                                setLoading((prev) => ({
                                    ...prev,
                                    edit: false,
                                }));
                            }}
                            disabled={loading.edit}
                            startIcon={
                                loading.edit ? (
                                    <CircularProgress
                                        size={18}
                                        color="inherit"
                                    />
                                ) : (
                                    <EditIcon />
                                )
                            }
                            sx={{ textTransform: "none", fontSize: "0.85rem" }}
                        >
                            Edit Institution
                        </Button>
                    </Tooltip>

                    <Tooltip title="View Academic Programs">
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() =>
                                handleNavigation(
                                    `/admin/institutions/curricular-programs/${institution.id}`,
                                    "curricularPrograms"
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
                            sx={{ textTransform: "none", fontSize: "0.85rem" }}
                        >
                            Curricular Programs
                        </Button>
                    </Tooltip>
                </Box>

                {/* Close Button */}
                <Button
                    onClick={onClose}
                    color="error"
                    variant="contained"
                    startIcon={<Typography variant="body2">✖</Typography>}
                    sx={{ textTransform: "none", fontSize: "0.85rem" }}
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
