/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import {
    Box,
    Button,
    Typography,
    Breadcrumbs,
    Link,
    Grid,
    Paper,
    Divider,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    alpha,
} from "@mui/material";
import {
    Download as DownloadIcon,
    Business as BusinessIcon,
    LibraryBooks as LibraryBooksIcon,
    Delete as DeleteIcon,
    School as SchoolIcon,
    People as PeopleIcon,
    MenuBook as MenuBookIcon,
    Info as InfoIcon,
} from "@mui/icons-material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import config from "../../../utils/config";
import CustomSnackbar from "../../../Components/CustomSnackbar";
import ManualInstitutionDialog from "./ManualInstitutionDialog";
import ExcelJS from "exceljs";
import { encryptId } from "../../../utils/encryption";
import { useLoading } from "../../../Context/LoadingContext";

const InstitutionManagement = () => {
    const [institution, setInstitution] = useState(null);
    const { showLoading, hideLoading, updateProgress } = useLoading();
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "info",
    });
    const [openManualDialog, setOpenManualDialog] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [loading, setLoading] = useState({
        viewCampuses: false,
        faculties: false,
        academicPrograms: false,
        curricularPrograms: false,
        graduates: false,
        exportFormA: false,
        deleteInstitution: false,
    });
    const navigate = useNavigate();

    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    const getInstitutionType = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        return user?.institution_type || "SUC";
    };

    const fetchInstitution = async () => {
        try {
            showLoading();
            const token = localStorage.getItem("token");
            const user = JSON.parse(localStorage.getItem("user"));

            if (!user?.institution_id && user?.role !== "Super Admin") {
                setSnackbar({
                    open: true,
                    message: "No institution associated with this user.",
                    severity: "warning",
                });
                return;
            }

            const url =
                user.role === "Super Admin"
                    ? `${config.API_URL}/institutions`
                    : `${config.API_URL}/institutions/${user.institution_id}`;

            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (user.role === "Super Admin") {
                const hei =
                    response.data.find(
                        (inst) => inst.institution_type === "HEI"
                    ) || response.data[0];
                setInstitution(hei);
            } else {
                setInstitution(response.data);
            }
            showLoading();
        } catch (error) {
            console.error("Error fetching institution:", error);
            setSnackbar({
                open: true,
                message: "Failed to load institution data.",
                severity: "error",
            });
        } finally {
            hideLoading();
        }
    };

    useEffect(() => {
        fetchInstitution();
    }, []);

    const handleExportToFormA = async () => {
        if (!institution) {
            setSnackbar({
                open: true,
                message: "No data available to export.",
                severity: "warning",
            });
            return;
        }

        setLoading((prev) => ({ ...prev, exportFormA: true }));
        try {
            const response = await fetch("/templates/Form-A-Themeplate.xlsx");
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const arrayBuffer = await response.arrayBuffer();

            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(arrayBuffer);

            const sheetA1 = workbook.getWorksheet("FORM A1");
            const sheetA2 = workbook.getWorksheet("FORM A2");

            const a1Data = [
                institution.name || "N/A",
                "", // ADDRESS header
                "",
                institution.address_street || "N/A",
                institution.municipality_city || "N/A",
                institution.province || "N/A",
                institution.region || "N/A",
                institution.postal_code || "N/A",
                institution.institutional_telephone || "N/A",
                institution.institutional_fax || "N/A",
                institution.head_telephone || "N/A",
                institution.institutional_email || "N/A",
                institution.institutional_website || "N/A",
                institution.year_established || "N/A",
                institution.sec_registration || "N/A",
                institution.year_granted_approved || "N/A",
                institution.year_converted_college || "N/A",
                institution.year_converted_university || "N/A",
                institution.head_name || "N/A",
                institution.head_title || "N/A",
                institution.head_education || "N/A",
            ];
            a1Data.forEach((value, index) => {
                sheetA1.getRow(5 + index).getCell(3).value = value;
            });

            const token = localStorage.getItem("token");
            const campusResponse = await axios.get(
                `${config.API_URL}/campuses?institution_id=${institution.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const campuses = Array.isArray(campusResponse.data.campuses)
                ? campusResponse.data.campuses
                : [];

            campuses.forEach((campus, index) => {
                const row = sheetA2.getRow(14 + index);
                row.values = [
                    index + 1,
                    campus.suc_name || "N/A",
                    campus.campus_type || "N/A",
                    campus.institutional_code || "N/A",
                    campus.region || "N/A",
                    campus.municipality_city_province || "N/A",
                    campus.year_first_operation || "N/A",
                    campus.land_area_hectares || "0.0",
                    campus.distance_from_main || "0.0",
                    campus.autonomous_code || "N/A",
                    campus.position_title || "N/A",
                    campus.head_full_name || "N/A",
                    campus.former_name || "N/A",
                    campus.latitude_coordinates || "0.0",
                    campus.longitude_coordinates || "0.0",
                ];
            });

            const fileName = `Form_A_${getInstitutionType()}_${
                new Date().toISOString().split("T")[0]
            }.xlsx`;
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);

            setSnackbar({
                open: true,
                message: "Data exported successfully!",
                severity: "success",
            });
        } catch (error) {
            console.error("Error exporting data:", error);
            setSnackbar({
                open: true,
                message: "Error exporting data.",
                severity: "error",
            });
        } finally {
            setLoading((prev) => ({ ...prev, exportFormA: false }));
        }
    };

    const handleNavigation = async (path, key) => {
        setLoading((prev) => ({ ...prev, [key]: true }));
        try {
            navigate(path);
        } finally {
            setLoading((prev) => ({ ...prev, [key]: false }));
        }
    };

    const handleDeleteInstitution = () => {
        setConfirmDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        setLoading((prev) => ({ ...prev, deleteInstitution: true }));
        try {
            const token = localStorage.getItem("token");
            await axios.delete(
                `${config.API_URL}/institutions/${institution.id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setSnackbar({
                open: true,
                message: "Institution deleted successfully.",
                severity: "success",
            });
            navigate("/hei-admin/dashboard");
        } catch (error) {
            console.error("Error deleting institution:", error);
            setSnackbar({
                open: true,
                message: "Failed to delete institution.",
                severity: "error",
            });
        } finally {
            setLoading((prev) => ({ ...prev, deleteInstitution: false }));
            setConfirmDialogOpen(false);
        }
    };

    const formatField = (label, value) => (
        <Grid item xs={12} sm={6}>
            <Typography
                variant="body2"
                sx={{
                    fontSize: "0.95rem",
                    color: value === "N/A" ? "text.secondary" : "text.primary",
                    lineHeight: 1.8,
                }}
            >
                <strong style={{ color: "#424242" }}>{label}:</strong>{" "}
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
        <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: "1200px", mx: "auto" }}>
            <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 3 }}>
                <Link
                    underline="hover"
                    color="inherit"
                    component={RouterLink}
                    to="/hei-admin/dashboard"
                >
                    Dashboard
                </Link>
                <Typography color="text.primary">My Institution</Typography>
            </Breadcrumbs>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                    flexDirection: { xs: "column", sm: "row" },
                    mb: 3,
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: "medium",
                        color: "#1976d2",
                        mb: { xs: 2, sm: 0 },
                    }}
                >
                    {institution ? institution.name : "Institution Details"}
                </Typography>

                <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={handleExportToFormA}
                    disabled={!institution || loading.exportFormA}
                    sx={{
                        bgcolor: institution ? "primary.main" : "grey.400",
                        "&:hover": {
                            bgcolor: institution ? "primary.dark" : "grey.500",
                        },
                        textTransform: "none",
                        px: 3,
                        py: 1,
                    }}
                    aria-label="Export to Excel"
                >
                    {loading.exportFormA ? (
                        <>
                            <CircularProgress size={18} sx={{ mr: 1 }} />
                            Exporting...
                        </>
                    ) : (
                        "Export to Excel"
                    )}
                </Button>
            </Box>

            {institution ? (
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    {/* Details Section */}
                    <Grid item xs={12} md={6}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: { xs: 2, sm: 3 },
                                borderRadius: 2,
                                bgcolor: "background.paper",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                                width: "100%",
                            }}
                        >
                            <Box sx={{ mb: 3 }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        mb: 1,
                                        fontWeight: "medium",
                                        color: "#1976d2",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <InfoIcon sx={{ mr: 1, fontSize: 20 }} />
                                    Contact Information
                                </Typography>
                                <Divider
                                    sx={{ mb: 2, borderColor: "#e0e0e0" }}
                                />
                                <Grid container spacing={2}>
                                    {formatField(
                                        "Postal Code",
                                        institution.postal_code || "N/A"
                                    )}
                                    {formatField(
                                        "Institutional Telephone",
                                        institution.institutional_telephone ||
                                            "N/A"
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
                                        institution.institutional_website ||
                                            "N/A"
                                    )}
                                </Grid>
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        mb: 1,
                                        fontWeight: "medium",
                                        color: "#1976d2",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <SchoolIcon sx={{ mr: 1, fontSize: 20 }} />
                                    Institutional Details
                                </Typography>
                                <Divider
                                    sx={{ mb: 2, borderColor: "#e0e0e0" }}
                                />
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
                                        institution.year_granted_approved ||
                                            "N/A"
                                    )}
                                    {formatField(
                                        "Year Converted to College",
                                        institution.year_converted_college ||
                                            "N/A"
                                    )}
                                    {formatField(
                                        "Year Converted to University",
                                        institution.year_converted_university ||
                                            "N/A"
                                    )}
                                </Grid>
                            </Box>

                            <Box>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        mb: 1,
                                        fontWeight: "medium",
                                        color: "#1976d2",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <PeopleIcon sx={{ mr: 1, fontSize: 20 }} />
                                    Leadership
                                </Typography>
                                <Divider
                                    sx={{ mb: 2, borderColor: "#e0e0e0" }}
                                />
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
                    </Grid>

                    {/* Management Options Section */}
                    <Grid item xs={12} md={6}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: { xs: 2, sm: 3 },
                                borderRadius: 2,
                                bgcolor: "background.paper",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                                width: "100%",
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    mb: 1,
                                    fontWeight: "medium",
                                    color: "#1976d2",
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <MenuBookIcon sx={{ mr: 1, fontSize: 20 }} />
                                Management Options
                            </Typography>
                            <Divider sx={{ mb: 2, borderColor: "#e0e0e0" }} />
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        startIcon={
                                            loading.viewCampuses ? (
                                                <CircularProgress size={16} />
                                            ) : (
                                                <BusinessIcon
                                                    sx={{ color: "#438FFF" }}
                                                />
                                            )
                                        }
                                        onClick={() =>
                                            handleNavigation(
                                                `/hei-admin/institutions/campuses/${
                                                    institution?.id
                                                        ? encryptId(
                                                              institution.id
                                                          )
                                                        : ""
                                                }`,
                                                "viewCampuses"
                                            )
                                        }
                                        disabled={
                                            loading.viewCampuses ||
                                            !institution?.id
                                        }
                                        sx={{
                                            py: 1,
                                            justifyContent: "flex-start",
                                            borderColor: alpha("#438FFF", 0.5),
                                            color: "text.primary",
                                            textTransform: "none",
                                            "&:hover": {
                                                backgroundColor: alpha(
                                                    "#438FFF",
                                                    0.08
                                                ),
                                                borderColor: "#438FFF",
                                            },
                                        }}
                                        aria-label="Manage Campuses"
                                    >
                                        Manage Campuses
                                    </Button>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        startIcon={
                                            loading.faculties ? (
                                                <CircularProgress size={16} />
                                            ) : (
                                                <PeopleIcon
                                                    sx={{ color: "#438FFF" }}
                                                />
                                            )
                                        }
                                        onClick={() =>
                                            handleNavigation(
                                                `/hei-admin/institutions/faculties/${
                                                    institution?.id
                                                        ? encryptId(
                                                              institution.id
                                                          )
                                                        : ""
                                                }`,
                                                "faculties"
                                            )
                                        }
                                        disabled={
                                            loading.faculties ||
                                            !institution?.id
                                        }
                                        sx={{
                                            py: 1,
                                            justifyContent: "flex-start",
                                            borderColor: alpha("#438FFF", 0.5),
                                            color: "text.primary",
                                            textTransform: "none",
                                            "&:hover": {
                                                backgroundColor: alpha(
                                                    "#438FFF",
                                                    0.08
                                                ),
                                                borderColor: "#438FFF",
                                            },
                                        }}
                                        aria-label="Manage Faculties"
                                    >
                                        Manage Faculties
                                    </Button>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        startIcon={
                                            loading.curricularPrograms ? (
                                                <CircularProgress size={16} />
                                            ) : (
                                                <LibraryBooksIcon
                                                    sx={{ color: "#438FFF" }}
                                                />
                                            )
                                        }
                                        onClick={() =>
                                            handleNavigation(
                                                `/hei-admin/institutions/curricular-programs/${
                                                    institution?.id
                                                        ? encryptId(
                                                              institution.id
                                                          )
                                                        : ""
                                                }`,
                                                "curricularPrograms"
                                            )
                                        }
                                        disabled={
                                            loading.curricularPrograms ||
                                            !institution?.id
                                        }
                                        sx={{
                                            py: 1,
                                            justifyContent: "flex-start",
                                            borderColor: alpha("#438FFF", 0.5),
                                            color: "text.primary",
                                            textTransform: "none",
                                            "&:hover": {
                                                backgroundColor: alpha(
                                                    "#438FFF",
                                                    0.08
                                                ),
                                                borderColor: "#438FFF",
                                            },
                                        }}
                                        aria-label="Curricular Programs"
                                    >
                                        Curricular Programs
                                    </Button>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        startIcon={
                                            loading.graduates ? (
                                                <CircularProgress size={16} />
                                            ) : (
                                                <SchoolIcon
                                                    sx={{ color: "#438FFF" }}
                                                />
                                            )
                                        }
                                        onClick={() =>
                                            handleNavigation(
                                                `/hei-admin/institutions/graduates-list/${
                                                    institution?.id
                                                        ? encryptId(
                                                              institution.id
                                                          )
                                                        : ""
                                                }`,
                                                "graduates"
                                            )
                                        }
                                        disabled={
                                            loading.graduates ||
                                            !institution?.id
                                        }
                                        sx={{
                                            py: 1,
                                            justifyContent: "flex-start",
                                            borderColor: alpha("#438FFF", 0.5),
                                            color: "text.primary",
                                            textTransform: "none",
                                            "&:hover": {
                                                backgroundColor: alpha(
                                                    "#438FFF",
                                                    0.08
                                                ),
                                                borderColor: "#438FFF",
                                            },
                                        }}
                                        aria-label="List of Graduates"
                                    >
                                        List of Graduates
                                    </Button>
                                </Grid>
                                <Grid item xs={12}>
                                    <Divider
                                        sx={{ my: 2, borderColor: "#e0e0e0" }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        color="error"
                                        startIcon={
                                            loading.deleteInstitution ? (
                                                <CircularProgress size={16} />
                                            ) : (
                                                <DeleteIcon />
                                            )
                                        }
                                        onClick={handleDeleteInstitution}
                                        disabled={
                                            loading.deleteInstitution ||
                                            !institution?.id
                                        }
                                        sx={{
                                            py: 1,
                                            justifyContent: "flex-start",
                                            borderColor: alpha("#FF6347", 0.5),
                                            color: "error.main",
                                            textTransform: "none",
                                            "&:hover": {
                                                backgroundColor: alpha(
                                                    "#FF6347",
                                                    0.08
                                                ),
                                                borderColor: "#FF6347",
                                            },
                                        }}
                                        aria-label="Delete Institution"
                                    >
                                        Delete Institution
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            ) : null}

            <Dialog
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirm Deletion"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this institution? This
                        action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setConfirmDialogOpen(false)}
                        color="primary"
                        disabled={loading.deleteInstitution}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        color="error"
                        variant="contained"
                        disabled={loading.deleteInstitution}
                        autoFocus
                    >
                        {loading.deleteInstitution ? (
                            <>
                                <CircularProgress
                                    size={18}
                                    sx={{ mr: 1, color: "white" }}
                                />
                                Deleting...
                            </>
                        ) : (
                            "Delete"
                        )}
                    </Button>
                </DialogActions>
            </Dialog>

            <ManualInstitutionDialog
                open={openManualDialog}
                onClose={() => setOpenManualDialog(false)}
                getInstitutionType={getInstitutionType}
                fetchInstitutions={fetchInstitution}
                setSnackbarOpen={(open) =>
                    setSnackbar((prev) => ({ ...prev, open }))
                }
                setSnackbarMessage={(message) =>
                    setSnackbar((prev) => ({ ...prev, message }))
                }
                setSnackbarSeverity={(severity) =>
                    setSnackbar((prev) => ({ ...prev, severity }))
                }
            />

            <CustomSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={handleCloseSnackbar}
                autoHideDuration={5000}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            />
        </Box>
    );
};

export default InstitutionManagement;
