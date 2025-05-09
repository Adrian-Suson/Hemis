/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
    Box,
    Button,
    Typography,
    Breadcrumbs,
    Link,
    Grid,
    Paper,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    alpha,
    FormControl,
    Select,
    MenuItem,
    Avatar,
    Chip,
    Card,
    useTheme,
    Container,
} from "@mui/material";
import {
    Download as DownloadIcon,
    Business as BusinessIcon,
    LibraryBooks as LibraryBooksIcon,
    School as SchoolIcon,
    People as PeopleIcon,
    MenuBook as MenuBookIcon,
    Info as InfoIcon,
    Home as HomeIcon,
    CalendarMonth as CalendarIcon,
    LocationOn as LocationIcon,
    Badge as BadgeIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    Language as WebIcon,
    History as HistoryIcon,
    Person as PersonIcon,
} from "@mui/icons-material";
import { RiResetLeftLine } from "react-icons/ri";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import config from "../../../utils/config";
import CustomSnackbar from "../../../Components/CustomSnackbar";
import ManualInstitutionDialog from "./ManualInstitutionDialog";
import ExcelJS from "exceljs";
import { encryptId } from "../../../utils/encryption";
import { useLoading } from "../../../Context/LoadingContext";
import PropTypes from "prop-types";

// Custom InfoCard component
const InfoCard = ({ title, icon, children }) => (
    <Paper elevation={1} sx={{ p: 2, borderRadius: 1, mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            {icon}
            <Typography variant="subtitle1" sx={{ ml: 0.5, fontWeight: 600 }}>
                {title}
            </Typography>
        </Box>
        {children}
    </Paper>
);

InfoCard.propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired,
};

// Custom InfoItem component
const InfoItem = ({ icon, label, value }) => (
    <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
        {icon}
        <Typography variant="body2" sx={{ ml: 0.5, fontSize: "0.9rem" }}>
            <strong>{label}:</strong> {value}
        </Typography>
    </Box>
);

InfoItem.propTypes = {
    icon: PropTypes.node.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.node.isRequired,
};

const ActionButton = ({ icon, label, onClick, loading, disabled }) => (
    <Button
        variant="outlined"
        size="small"
        fullWidth
        startIcon={icon}
        onClick={onClick}
        disabled={disabled || loading}
        sx={{
            mb: 1,
            textTransform: "none",
            fontSize: "0.85rem",
            display: "flex",
            justifyContent: "flex-start",
            width: "100%",
        }}
    >
        {loading ? (
            <>
                <CircularProgress size={16} sx={{ mr: 0.5 }} />
                Loading...
            </>
        ) : (
            label
        )}
    </Button>
);

ActionButton.propTypes = {
    icon: PropTypes.node.isRequired,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
};

ActionButton.defaultProps = {
    loading: false,
    disabled: false,
};

const InstitutionManagement = () => {
    const theme = useTheme();
    const [institutions, setInstitutions] = useState([]);
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
    const [searchTerm, setSearchTerm] = useState(
        localStorage.getItem("searchTerm") || ""
    );
    const [typeFilter, setTypeFilter] = useState(
        localStorage.getItem("typeFilter") || ""
    );
    const [municipalityFilter, setMunicipalityFilter] = useState(
        localStorage.getItem("municipalityFilter") || ""
    );
    const [provinceFilter, setProvinceFilter] = useState(
        localStorage.getItem("provinceFilter") || ""
    );
    const [reportYearFilter, setReportYearFilter] = useState(
        localStorage.getItem("reportYearFilter") ||
            String(new Date().getFullYear())
    );
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
            const storedInstitution = JSON.parse(
                localStorage.getItem("institution")
            );

            console.log("Stored institution for filtering:", storedInstitution);

            if (!user?.institution_id) {
                setSnackbar({
                    open: true,
                    message: "No institution associated with this user.",
                    severity: "warning",
                });
                return;
            }

            const url = `${config.API_URL}/institutions`;
            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            let institutionsData = Array.isArray(response.data)
                ? response.data
                : [response.data];

            console.log("Fetched institutions:", institutionsData);

            // Filter based on institution.name matching the stored institution name
            const filteredInstitutions = institutionsData.filter(
                (inst) => inst.name === storedInstitution.name
            );
            console.log("Filtered institutions:", filteredInstitutions);

            setInstitutions(filteredInstitutions);
            setInstitution(filteredInstitutions[0] || null);
            console.log("Selected institution:", filteredInstitutions[0].id);
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

    useEffect(() => {
        localStorage.setItem("searchTerm", searchTerm);
        localStorage.setItem("typeFilter", typeFilter);
        localStorage.setItem("municipalityFilter", municipalityFilter);
        localStorage.setItem("provinceFilter", provinceFilter);
        localStorage.setItem("reportYearFilter", reportYearFilter);
    }, [
        searchTerm,
        typeFilter,
        municipalityFilter,
        provinceFilter,
        reportYearFilter,
    ]);

    const filteredInstitutions = useMemo(() => {
        return institutions.filter((institution) => {
            const matchesSearch = institution.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            const matchesType = typeFilter
                ? institution.institution_type === typeFilter
                : true;
            const matchesMunicipality = municipalityFilter
                ? institution.municipality === municipalityFilter
                : true;
            const matchesProvince = provinceFilter
                ? institution.province === provinceFilter
                : true;
            const matchesReportYear = reportYearFilter
                ? String(institution.report_year) === reportYearFilter
                : true;
            return (
                matchesSearch &&
                matchesType &&
                matchesMunicipality &&
                matchesProvince &&
                matchesReportYear
            );
        });
    }, [
        institutions,
        searchTerm,
        typeFilter,
        municipalityFilter,
        provinceFilter,
        reportYearFilter,
    ]);

    useEffect(() => {
        // Update the institution detail when the filtered institutions change (i.e. affected by year filter)
        if (filteredInstitutions.length > 0) {
            setInstitution(filteredInstitutions[0]);
        } else {
            setInstitution(null);
        }
    }, [filteredInstitutions]);

    const getUniqueValues = (arr, key) => {
        if (!Array.isArray(arr) || arr.length === 0) {
            return [];
        }
        return [
            ...new Set(arr.map((item) => item?.[key]).filter(Boolean)),
        ].sort();
    };

    const filterOptions = {
        types: getUniqueValues(institutions, "institution_type"),
        municipalities: getUniqueValues(institutions, "municipality"),
        provinces: getUniqueValues(institutions, "province"),
        reportYears: getUniqueValues(institutions, "report_year"),
    };

    const clearFilters = () => {
        setSearchTerm("");
        setTypeFilter("");
        setMunicipalityFilter("");
        setProvinceFilter("");
        setReportYearFilter("");
        localStorage.setItem("searchTerm", "");
        localStorage.setItem("typeFilter", "");
        localStorage.setItem("municipalityFilter", "");
        localStorage.setItem("provinceFilter", "");
        localStorage.setItem("reportYearFilter", "");
    };

    const handleExportToFormA = async () => {
        if (!institution) {
            setSnackbar({
                open: true,
                message: "No data available to export.",
                severity: "warning",
            });
            return;
        }
        updateProgress(10);
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
            updateProgress(50);
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
            updateProgress(100);
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

    return (
        <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
            {/* Header Section with Breadcrumbs */}
            <Box
                sx={{
                    bgcolor: "background.paper",
                    p: { xs: 1, sm: 1.5 },
                    borderRadius: 1,
                    boxShadow: 1,
                    mb: 2,
                }}
            >
                <Breadcrumbs
                    separator="›"
                    aria-label="breadcrumb"
                    sx={{ mb: 0.5 }}
                >
                    <Link
                        underline="hover"
                        color="inherit"
                        component={RouterLink}
                        to="/hei-admin/dashboard"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            fontSize: { xs: "0.8rem", sm: "0.9rem" },
                            "&:hover": { color: "primary.main" },
                        }}
                    >
                        <HomeIcon sx={{ mr: 0.3, fontSize: "0.8rem" }} />
                        Dashboard
                    </Link>
                    <Typography
                        color="text.primary"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            fontSize: { xs: "0.8rem", sm: "0.9rem" },
                        }}
                    >
                        <SchoolIcon sx={{ mr: 0.3, fontSize: "0.8rem" }} />
                        My Institution
                    </Typography>
                </Breadcrumbs>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: { xs: "flex-start", sm: "center" },
                        flexDirection: { xs: "column", sm: "row" },
                        gap: { xs: 1, sm: 0 },
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                            sx={{
                                bgcolor: "primary.main",
                                width: { xs: 32, sm: 36 },
                                height: { xs: 32, sm: 36 },
                                mr: 1,
                                display: { xs: "none", sm: "flex" },
                            }}
                        >
                            <SchoolIcon sx={{ fontSize: "1rem" }} />
                        </Avatar>
                        <Box>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    color: "text.primary",
                                    fontSize: { xs: "1rem", sm: "1.25rem" },
                                }}
                            >
                                {institution
                                    ? institution.name
                                    : "Institution Details"}
                            </Typography>
                            {institution && (
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        mt: 0.25,
                                        gap: 0.5,
                                    }}
                                >
                                    <Chip
                                        size="small"
                                        label={
                                            institution.institution_type ||
                                            "SUC"
                                        }
                                        color="primary"
                                        variant="outlined"
                                        sx={{ fontSize: "0.75rem" }}
                                    />
                                    <Chip
                                        size="small"
                                        label={`Est. ${
                                            institution.year_established ||
                                            "N/A"
                                        }`}
                                        color="secondary"
                                        variant="outlined"
                                        sx={{ fontSize: "0.75rem" }}
                                    />
                                </Box>
                            )}
                        </Box>
                    </Box>

                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<DownloadIcon sx={{ fontSize: "1rem" }} />}
                        onClick={handleExportToFormA}
                        disabled={!institution || loading.exportFormA}
                        sx={{
                            bgcolor: institution ? "primary.main" : "grey.400",
                            "&:hover": {
                                bgcolor: institution
                                    ? "primary.dark"
                                    : "grey.500",
                            },
                            textTransform: "none",
                            px: 2,
                            py: 0.5,
                            mt: { xs: 1, sm: 0 },
                            fontSize: "0.85rem",
                            boxShadow: 1,
                        }}
                    >
                        {loading.exportFormA ? (
                            <>
                                <CircularProgress
                                    size={16}
                                    sx={{ mr: 0.5, color: "white" }}
                                />
                                Exporting...
                            </>
                        ) : (
                            "Export"
                        )}
                    </Button>
                </Box>
            </Box>

            {/* Report Year Filter */}
            <Paper
                elevation={1}
                sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "stretch", sm: "center" },
                    justifyContent: "space-between",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        width: { xs: "100%", sm: "auto" },
                        mb: { xs: 2, sm: 0 },
                    }}
                >
                    <CalendarIcon sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="subtitle2" sx={{ mr: 2 }}>
                        Report Year:
                    </Typography>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                            value={reportYearFilter}
                            onChange={(e) =>
                                setReportYearFilter(e.target.value)
                            }
                            displayEmpty
                            sx={{
                                "& .MuiSelect-select": {
                                    py: 0.7,
                                    fontWeight: 500,
                                },
                            }}
                        >
                            <MenuItem value="" sx={{ fontWeight: 500 }}>
                                All Years
                            </MenuItem>
                            {filterOptions.reportYears.map((year) => (
                                <MenuItem
                                    key={year}
                                    value={String(year)}
                                    sx={{ fontWeight: 500 }}
                                >
                                    {year}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <Button
                    variant="text"
                    startIcon={<RiResetLeftLine size={18} />}
                    onClick={clearFilters}
                    sx={{
                        textTransform: "none",
                        fontWeight: 500,
                        color: "error.main",
                        "&:hover": {
                            bgcolor: alpha(theme.palette.error.main, 0.08),
                        },
                    }}
                >
                    Clear Filters
                </Button>
            </Paper>

            {/* Main Content */}
            {institution ? (
                <Grid container spacing={3}>
                    {/* Contact Info Card */}
                    <Grid size={12}>
                        <InfoCard
                            title="Contact Information"
                            icon={<InfoIcon />}
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <InfoItem
                                        icon={<LocationIcon />}
                                        label="Location"
                                        value={
                                            institution.municipality_city &&
                                            institution.province
                                                ? `${institution.municipality_city}, ${institution.province}`
                                                : "Not Available"
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InfoItem
                                        icon={<BadgeIcon />}
                                        label="Postal Code"
                                        value={
                                            institution.postal_code ||
                                            "Not Available"
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InfoItem
                                        icon={<PhoneIcon />}
                                        label="Institutional Telephone"
                                        value={
                                            institution.institutional_telephone ||
                                            "Not Available"
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InfoItem
                                        icon={<PhoneIcon />}
                                        label="Head Telephone"
                                        value={
                                            institution.head_telephone ||
                                            "Not Available"
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InfoItem
                                        icon={<EmailIcon />}
                                        label="Email"
                                        value={
                                            institution.institutional_email ||
                                            "Not Available"
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InfoItem
                                        icon={<WebIcon />}
                                        label="Website"
                                        value={
                                            institution.institutional_website ||
                                            "Not Available"
                                        }
                                    />
                                </Grid>
                            </Grid>
                        </InfoCard>

                        {/* Institutional Details Card */}
                        <InfoCard
                            title="Institutional Details"
                            icon={<SchoolIcon />}
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <InfoItem
                                        icon={<CalendarIcon />}
                                        label="Year Established"
                                        value={
                                            institution.year_established ||
                                            "Not Available"
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InfoItem
                                        icon={<HistoryIcon />}
                                        label="Year Granted/Approved"
                                        value={
                                            institution.year_granted_approved ||
                                            "Not Available"
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InfoItem
                                        icon={<SchoolIcon />}
                                        label="Year Converted to College"
                                        value={
                                            institution.year_converted_college ||
                                            "Not Available"
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InfoItem
                                        icon={<SchoolIcon />}
                                        label="Year Converted to University"
                                        value={
                                            institution.year_converted_university ||
                                            "Not Available"
                                        }
                                    />
                                </Grid>
                            </Grid>
                        </InfoCard>

                        {/* Leadership Card */}
                        <InfoCard title="Leadership" icon={<PersonIcon />}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <InfoItem
                                        icon={<PersonIcon />}
                                        label="Head Name"
                                        value={
                                            institution.head_name ||
                                            "Not Available"
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InfoItem
                                        icon={<BadgeIcon />}
                                        label="Head Title"
                                        value={
                                            institution.head_title ||
                                            "Not Available"
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <InfoItem
                                        icon={<SchoolIcon />}
                                        label="Head Education"
                                        value={
                                            institution.head_education ||
                                            "Not Available"
                                        }
                                    />
                                </Grid>
                            </Grid>
                        </InfoCard>
                    </Grid>

                    {/* Management Options Card */}
                    <Grid size={12}>
                        <Card
                            elevation={1}
                            sx={{
                                p: 2,
                                height: "100%",
                                borderRadius: 1,
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    mb: 1,
                                    pb: 1,
                                    borderBottom: "1px solid",
                                    borderColor: "divider",
                                }}
                            >
                                <Avatar
                                    sx={{
                                        bgcolor: alpha(
                                            theme.palette.primary.main,
                                            0.1
                                        ),
                                        color: "primary.main",
                                        width: 32,
                                        height: 32,
                                        mr: 1,
                                    }}
                                >
                                    <MenuBookIcon sx={{ fontSize: "1rem" }} />
                                </Avatar>
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontWeight: 600,
                                        color: "primary.main",
                                    }}
                                >
                                    Management Options
                                </Typography>
                            </Box>
                            <Grid container spacing={1} columns={12}>
                                <Grid sx={{ gridColumn: { xs: "span 12", md: "span 6" } }}>
                                    <ActionButton
                                        icon={
                                            <BusinessIcon
                                                sx={{ color: theme.palette.primary.main, fontSize: "1rem" }}
                                            />
                                        }
                                        label="Campuses"
                                        onClick={() =>
                                            handleNavigation(
                                                `/hei-admin/institutions/campuses/${encryptId(
                                                    reportYearFilter
                                                        ? `${institution.id}`
                                                        : institution.id
                                                )}`,
                                                "viewCampuses"
                                            )
                                        }
                                        loading={loading.viewCampuses}
                                        disabled={!institution?.id}
                                    />
                                </Grid>
                                <Grid sx={{ gridColumn: { xs: "span 12", md: "span 6" } }}>
                                    <ActionButton
                                        icon={
                                            <PeopleIcon
                                                sx={{ color: theme.palette.primary.main, fontSize: "1rem" }}
                                            />
                                        }
                                        label="Faculties"
                                        onClick={() =>
                                            handleNavigation(
                                                `/hei-admin/institutions/faculties/${encryptId(
                                                    reportYearFilter
                                                        ? `${institution.id}`
                                                        : institution.id
                                                )}`,
                                                "faculties"
                                            )
                                        }
                                        loading={loading.faculties}
                                        disabled={!institution?.id}
                                    />
                                </Grid>
                                <Grid sx={{ gridColumn: { xs: "span 12", md: "span 6" } }}>
                                    <ActionButton
                                        icon={
                                            <LibraryBooksIcon
                                                sx={{ color: theme.palette.primary.main, fontSize: "1rem" }}
                                            />
                                        }
                                        label="Programs"
                                        onClick={() =>
                                            handleNavigation(
                                                `/hei-admin/institutions/curricular-programs/${encryptId(
                                                    reportYearFilter
                                                        ? `${institution.id}`
                                                        : institution.id
                                                )}`,
                                                "curricularPrograms"
                                            )
                                        }
                                        loading={loading.curricularPrograms}
                                        disabled={!institution?.id}
                                    />
                                </Grid>
                                <Grid sx={{ gridColumn: { xs: "span 12", md: "span 6" } }}>
                                    <ActionButton
                                        icon={
                                            <SchoolIcon
                                                sx={{ color: theme.palette.primary.main, fontSize: "1rem" }}
                                            />
                                        }
                                        label="Graduates"
                                        onClick={() =>
                                            handleNavigation(
                                                `/hei-admin/institutions/graduates-list/${encryptId(
                                                    reportYearFilter
                                                        ? `${institution.id}`
                                                        : institution.id
                                                )}`,
                                                "graduates"
                                            )
                                        }
                                        loading={loading.graduates}
                                        disabled={!institution?.id}
                                    />
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                </Grid>
            ) : (
                <Paper
                    elevation={1}
                    sx={{
                        p: 4,
                        textAlign: "center",
                        borderRadius: 2,
                        borderStyle: "dashed",
                        borderWidth: 1,
                        borderColor: "divider",
                    }}
                >
                    <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                    >
                        No institution data available
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Please check your filters or try again later
                    </Typography>
                </Paper>
            )}

            {/* Existing dialogs */}
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
        </Container>
    );
};

export default InstitutionManagement;
