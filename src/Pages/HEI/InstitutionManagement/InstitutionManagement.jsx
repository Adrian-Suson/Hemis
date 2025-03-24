/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import {
    Box,
    Button,
    Typography,
    Breadcrumbs,
    Link,
    ButtonGroup,
    Grid,
    Paper,
    Divider,
    Tooltip,
    CircularProgress,
} from "@mui/material";
import {
    UploadFile as UploadIcon,
    Download as DownloadIcon,
    Visibility as VisibilityIcon,
    LibraryBooks as LibraryBooksIcon,
} from "@mui/icons-material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import config from "../../../utils/config";
import { useProgress } from "../../../Context/ProgressContext";
import CustomSnackbar from "../../../Components/CustomSnackbar";
import ManualInstitutionDialog from "./ManualInstitutionDialog";
import ExcelJS from "exceljs";

const InstitutionManagement = () => {
    const [institution, setInstitution] = useState(null); // Single institution
    const { showProgress, hideProgress } = useProgress();
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "info",
    });
    const [openManualDialog, setOpenManualDialog] = useState(false);
    const [loading, setLoading] = useState({
        viewCampuses: false,
        faculties: false,
        academicPrograms: false,
    });
    const navigate = useNavigate();

    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    const getInstitutionType = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        return user?.institution_type || "HEI"; // Default to "HEI"
    };

    const getUserRole = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        return user?.role || "HEI Staff"; // Default role
    };

    const fetchInstitution = async () => {
        try {
            showProgress(10);
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
                    response.data.find((inst) => inst.institution_type === "HEI") || response.data[0];
                setInstitution(hei);
            } else {
                setInstitution(response.data);
            }
            showProgress(100);
        } catch (error) {
            console.error("Error fetching institution:", error);
            setSnackbar({
                open: true,
                message: "Failed to load institution data.",
                severity: "error",
            });
        } finally {
            hideProgress();
        }
    };

    useEffect(() => {
        fetchInstitution();
    }, []);

    const handleFileUpload = (event) => {
        const fileInput = event.target;
        const file = fileInput.files[0];
        if (!file) return;

        showProgress(10);

        const reader = new FileReader();
        reader.onload = async (e) => {
            showProgress(30);
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                showProgress(40);

                const sheetA1 = workbook.Sheets[workbook.SheetNames[0]];
                const jsonDataA1 = XLSX.utils.sheet_to_json(sheetA1, { header: 1 });

                const extractedInstitution = {
                    name: String(jsonDataA1[4]?.[2] || "Unknown"),
                    region: String(jsonDataA1[10]?.[2] || "Unknown"),
                    address_street: String(jsonDataA1[7]?.[2] || "Unknown"),
                    municipality_city: String(jsonDataA1[8]?.[2] || "Unknown"),
                    province: String(jsonDataA1[9]?.[2] || "Unknown"),
                    postal_code: String(jsonDataA1[11]?.[2] || "N/A"),
                    institutional_telephone: String(jsonDataA1[12]?.[2] || "N/A"),
                    institutional_fax: String(jsonDataA1[13]?.[2] || "N/A"),
                    head_telephone: String(jsonDataA1[14]?.[2] || "N/A"),
                    institutional_email: String(jsonDataA1[15]?.[2] || "N/A"),
                    institutional_website: String(jsonDataA1[16]?.[2] || "N/A"),
                    year_established: String(jsonDataA1[17]?.[2] || "N/A"),
                    sec_registration: String(jsonDataA1[18]?.[2] || "N/A"),
                    year_granted_approved: String(jsonDataA1[19]?.[2] || "N/A"),
                    year_converted_college: String(jsonDataA1[20]?.[2] || "N/A"),
                    year_converted_university: String(jsonDataA1[21]?.[2] || "N/A"),
                    head_name: String(jsonDataA1[22]?.[2] || "Unknown"),
                    head_title: String(jsonDataA1[23]?.[2] || "N/A"),
                    head_education: String(jsonDataA1[24]?.[2] || "N/A"),
                    institution_type: getInstitutionType(),
                };

                showProgress(50);
                const token = localStorage.getItem("token");
                const method = institution ? "put" : "post";
                const url = institution
                    ? `${config.API_URL}/institutions/${institution.id}`
                    : `${config.API_URL}/institutions`;

                await axios[method](url, extractedInstitution, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const sheetA2 = workbook.Sheets[workbook.SheetNames[1]];
                const jsonDataA2 = XLSX.utils.sheet_to_json(sheetA2, { header: 1 });
                const processedCampuses = jsonDataA2
                    .slice(13)
                    .filter((row) => row.some((cell) => cell !== undefined && cell !== ""))
                    .map((row) => ({
                        suc_name: String(row[1] || "N/A"),
                        campus_type: String(row[2] || "N/A"),
                        institutional_code: String(row[3] || "N/A"),
                        region: String(row[4] || "N/A"),
                        municipality_city_province: String(row[5] || "N/A"),
                        year_first_operation: String(parseInt(row[6], 10) || "N/A"),
                        land_area_hectares: String(parseFloat(row[7]) || "0.0"),
                        distance_from_main: String(parseFloat(row[8]) || "0.0"),
                        autonomous_code: String(row[9] || "N/A"),
                        position_title: String(row[10] || "N/A"),
                        head_full_name: String(row[11] || "N/A"),
                        former_name: String(row[12] || "N/A"),
                        latitude_coordinates: String(parseFloat(row[13]) || "0.0"),
                        longitude_coordinates: String(parseFloat(row[14]) || "0.0"),
                        institution_id: String(institution?.id || ""),
                    }));

                showProgress(70);
                await axios.post(`${config.API_URL}/campuses`, processedCampuses, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                fetchInstitution();
                setSnackbar({
                    open: true,
                    message: "Institution data uploaded successfully!",
                    severity: "success",
                });
                showProgress(100);
            } catch (error) {
                console.error("Error sending data:", error);
                setSnackbar({
                    open: true,
                    message: "Error uploading institution data.",
                    severity: "error",
                });
            } finally {
                hideProgress();
                fileInput.value = "";
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleExportData = async () => {
        if (!institution) {
            setSnackbar({
                open: true,
                message: "No data available to export.",
                severity: "warning",
            });
            return;
        }

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
            const campuses = Array.isArray(campusResponse.data.campuses) ? campusResponse.data.campuses : [];

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

            const fileName = `Form_A_${getInstitutionType()}_${new Date().toISOString().split("T")[0]}.xlsx`;
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
        }
    };

    const handleNavigation = async (pathKey, key) => {
        setLoading((prev) => ({ ...prev, [key]: true }));
        try {
            const role = getUserRole();
            const basePath =
                role === "Super Admin"
                    ? "/super-admin"
                    : role === "HEI Admin"
                    ? "/hei-admin"
                    : "/hei-staff";

            let path;
            switch (pathKey) {
                case "viewCampuses":
                    path = `${basePath}/institutions/campuses/${institution.id}`;
                    break;
                case "faculties":
                    path = `${basePath}/institutions/faculties/${institution.id}`;
                    break;
                case "academicPrograms":
                    path = `${basePath}/institutions/curricular-programs/${institution.id}`;
                    break;
                default:
                    return;
            }
            navigate(path);
        } finally {
            setLoading((prev) => ({ ...prev, [key]: false }));
        }
    };

    const formatField = (label, value) => (
        <Grid item xs={12} sm={6}>
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
        <Box sx={{ p: 3 }}>
            <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 2 }}>
                <Link
                    underline="hover"
                    color="inherit"
                    component={RouterLink}
                    to={
                        getUserRole() === "Super Admin"
                            ? "/super-admin/dashboard"
                            : getUserRole() === "HEI Admin"
                            ? "/hei-admin/dashboard"
                            : "/hei-staff/dashboard"
                    }
                >
                    Dashboard
                </Link>
                <Typography color="text.primary">My Institution</Typography>
            </Breadcrumbs>

            <Typography variant="h5" sx={{ mb: 2 }}>
                {institution ? institution.name : "Loading Institution..."}
            </Typography>

            <ButtonGroup sx={{ mb: 3 }}>
                <Button
                    variant="contained"
                    component="label"
                    startIcon={<UploadIcon />}
                    sx={{ bgcolor: "primary.main", "&:hover": { bgcolor: "primary.dark" } }}
                >
                    {institution ? "Update Form A" : "Upload Form A"}
                    <input
                        type="file"
                        hidden
                        accept=".xlsx, .xls"
                        onChange={handleFileUpload}
                    />
                </Button>
                <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={handleExportData}
                    disabled={!institution}
                    sx={{
                        bgcolor: institution ? "secondary.main" : "grey.400",
                        "&:hover": { bgcolor: institution ? "secondary.dark" : "grey.500" },
                    }}
                >
                    {institution ? "Export Form A" : "No Data to Export"}
                </Button>
            </ButtonGroup>

            {institution ? (
                <Paper elevation={2} sx={{ p: 3, borderRadius: 2, bgcolor: "#f9f9f9" }}>
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ mb: 1, color: "#424242" }}>
                            Contact Information
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Grid container spacing={2}>
                            {formatField("Postal Code", institution.postal_code || "N/A")}
                            {formatField("Institutional Telephone", institution.institutional_telephone || "N/A")}
                            {formatField("Institutional Fax", institution.institutional_fax || "N/A")}
                            {formatField("Head Telephone", institution.head_telephone || "N/A")}
                            {formatField("Email", institution.institutional_email || "N/A")}
                            {formatField("Website", institution.institutional_website || "N/A")}
                        </Grid>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ mb: 1, color: "#424242" }}>
                            Institutional Details
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Grid container spacing={2}>
                            {formatField("Year Established", institution.year_established || "N/A")}
                            {formatField("SEC Registration", institution.sec_registration || "N/A")}
                            {formatField("Year Granted/Approved", institution.year_granted_approved || "N/A")}
                            {formatField("Year Converted to College", institution.year_converted_college || "N/A")}
                            {formatField("Year Converted to University", institution.year_converted_university || "N/A")}
                        </Grid>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ mb: 1, color: "#424242" }}>
                            Leadership
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Grid container spacing={2}>
                            {formatField("Head Name", institution.head_name || "N/A")}
                            {formatField("Head Title", institution.head_title || "N/A")}
                            {formatField("Head Education", institution.head_education || "N/A")}
                        </Grid>
                    </Box>

                    <ButtonGroup variant="outlined" size="small" sx={{ mt: 2 }}>
                        <Tooltip title="View Campuses">
                            <Button
                                onClick={() => handleNavigation("viewCampuses", "viewCampuses")}
                                disabled={loading.viewCampuses}
                                startIcon={
                                    loading.viewCampuses ? (
                                        <CircularProgress size={18} color="inherit" />
                                    ) : (
                                        <VisibilityIcon />
                                    )
                                }
                                sx={{
                                    color: "#1976d2",
                                    borderColor: "#1976d2",
                                    "&:hover": { borderColor: "#115293", color: "#115293" },
                                    textTransform: "none",
                                }}
                            >
                                View Campuses
                            </Button>
                        </Tooltip>
                        <Tooltip title="View Faculties">
                            <Button
                                onClick={() => handleNavigation("faculties", "faculties")}
                                disabled={loading.faculties}
                                startIcon={
                                    loading.faculties ? (
                                        <CircularProgress size={18} color="inherit" />
                                    ) : (
                                        <LibraryBooksIcon />
                                    )
                                }
                                sx={{
                                    color: "#1976d2",
                                    borderColor: "#1976d2",
                                    "&:hover": { borderColor: "#115293", color: "#115293" },
                                    textTransform: "none",
                                }}
                            >
                                Faculties
                            </Button>
                        </Tooltip>
                        <Tooltip title="View Academic Programs">
                            <Button
                                onClick={() => handleNavigation("academicPrograms", "academicPrograms")}
                                disabled={loading.academicPrograms}
                                startIcon={
                                    loading.academicPrograms ? (
                                        <CircularProgress size={18} color="inherit" />
                                    ) : (
                                        <LibraryBooksIcon />
                                    )
                                }
                                sx={{
                                    color: "#1976d2",
                                    borderColor: "#1976d2",
                                    "&:hover": { borderColor: "#115293", color: "#115293" },
                                    textTransform: "none",
                                }}
                            >
                                Curricular Programs
                            </Button>
                        </Tooltip>
                    </ButtonGroup>
                </Paper>
            ) : (
                <Typography color="text.secondary">
                    No institution data available. Please upload Form A to get started.
                </Typography>
            )}

            <ManualInstitutionDialog
                open={openManualDialog}
                onClose={() => setOpenManualDialog(false)}
                getInstitutionType={getInstitutionType}
                fetchInstitutions={fetchInstitution}
                showProgress={showProgress}
                hideProgress={hideProgress}
                setSnackbarOpen={(open) => setSnackbar((prev) => ({ ...prev, open }))}
                setSnackbarMessage={(message) => setSnackbar((prev) => ({ ...prev, message }))}
                setSnackbarSeverity={(severity) => setSnackbar((prev) => ({ ...prev, severity }))}
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
