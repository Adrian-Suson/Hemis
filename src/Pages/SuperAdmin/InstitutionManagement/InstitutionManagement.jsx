import { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import {
    Box,
    Button,
    Typography,
    Breadcrumbs,
    Link,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Skeleton,
    Paper,
    IconButton,
    useTheme,
    alpha,
    TextField,
    useMediaQuery,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
    UploadFile as UploadIcon,
    Add as AddIcon,
    FileDownload as DownloadIcon,
} from "@mui/icons-material";
import InstitutionTable from "./InstitutionTable";
import { Link as RouterLink } from "react-router-dom";
import config from "../../../utils/config";
import CustomSnackbar from "../../../Components/CustomSnackbar";
import ManualInstitutionDialog from "./ManualInstitutionDialog";
import { useLoading } from "../../../Context/LoadingContext";
import useActivityLog from "../../../Hooks/useActivityLog";

const InstitutionManagement = () => {
    const theme = useTheme();
    const isXsScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const [institutions, setInstitutions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showLoading, hideLoading, updateProgress } = useLoading();
    const { createLog } = useActivityLog();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("info");
    const [openManualDialog, setOpenManualDialog] = useState(false);
    const [openUploadDialog, setOpenUploadDialog] = useState(false);
    const [selectedInstitutionType, setSelectedInstitutionType] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);

    // Add filter states here
    const [searchTerm, setSearchTerm] = useState(
        localStorage.getItem("searchTerm") || ""
    );
    const [typeFilter, setTypeFilter] = useState(
        localStorage.getItem("typeFilter") || ""
    );
    const [cityFilter, setCityFilter] = useState(
        localStorage.getItem("cityFilter") || ""
    );
    const [provinceFilter, setProvinceFilter] = useState(
        localStorage.getItem("provinceFilter") || ""
    );

    // Compute filter options
    const getUniqueValues = (arr, key) =>
        [...new Set(arr.map((item) => item[key]).filter(Boolean))].sort();
    const filterOptions = {
        types: getUniqueValues(institutions, "institution_type"),
        cities: getUniqueValues(institutions, "municipality_city"),
        provinces: getUniqueValues(institutions, "province"),
    };

    // Persist filters to localStorage
    useEffect(() => {
        localStorage.setItem("searchTerm", searchTerm);
        localStorage.setItem("typeFilter", typeFilter);
        localStorage.setItem("cityFilter", cityFilter);
        localStorage.setItem("provinceFilter", provinceFilter);
    }, [searchTerm, typeFilter, cityFilter, provinceFilter]);

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const getInstitutionType = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        return user?.institution_type || "Unknown";
    };

    const fetchInstitutions = async () => {
        setLoading(true);
        try {
            showLoading();
            const token = localStorage.getItem("token");
            const user = JSON.parse(localStorage.getItem("user"));

            const response = await axios.get(`${config.API_URL}/institutions`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            let institutionsData = [];
            if (user?.role !== "Super Admin") {
                institutionsData = response.data.filter(
                    (institution) => institution.id === user?.institution_id
                );
            } else {
                institutionsData = response.data;
            }

            setInstitutions(institutionsData);
        } catch (error) {
            console.error("Error fetching institutions:", error);
            setSnackbarMessage("Failed to load institution data.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
            hideLoading();
        }
    };

    useEffect(() => {
        fetchInstitutions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleFileUpload = async () => {
        if (!selectedFile || !selectedInstitutionType) {
            setSnackbarMessage(
                "Please select both an institution type and a file."
            );
            setSnackbarSeverity("warning");
            setSnackbarOpen(true);
            return;
        }
        setOpenUploadDialog(false);
        updateProgress(10);

        const reader = new FileReader();
        reader.onload = async (e) => {
            updateProgress(30);
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                updateProgress(40);

                const sheetA1 = workbook.Sheets[workbook.SheetNames[0]];
                const jsonDataA1 = XLSX.utils.sheet_to_json(sheetA1, {
                    header: 1,
                });

                const toNullableInteger = (value) => {
                    if (!value || value === "N/A" || value === "") return null;
                    const parsed = parseInt(value, 10);
                    return isNaN(parsed) ? null : parsed;
                };

                const extractedInstitution = {
                    name: String(jsonDataA1[4]?.[2] || "Unknown"),
                    region: String(jsonDataA1[10]?.[2] || "Unknown"),
                    address_street: String(jsonDataA1[7]?.[2] || ""),
                    municipality_city: String(jsonDataA1[8]?.[2] || ""),
                    province: String(jsonDataA1[9]?.[2] || ""),
                    postal_code: String(jsonDataA1[11]?.[2] || ""),
                    institutional_telephone: String(jsonDataA1[12]?.[2] || ""),
                    institutional_fax: String(jsonDataA1[13]?.[2] || ""),
                    head_telephone: String(jsonDataA1[14]?.[2] || ""),
                    institutional_email: String(jsonDataA1[15]?.[2] || ""),
                    institutional_website: String(jsonDataA1[16]?.[2] || ""),
                    year_established: toNullableInteger(jsonDataA1[17]?.[2]),
                    sec_registration: String(jsonDataA1[18]?.[2] || ""),
                    year_granted_approved: toNullableInteger(
                        jsonDataA1[19]?.[2]
                    ),
                    year_converted_college: toNullableInteger(
                        jsonDataA1[20]?.[2]
                    ),
                    year_converted_university: toNullableInteger(
                        jsonDataA1[21]?.[2]
                    ),
                    head_name: String(jsonDataA1[22]?.[2] || ""),
                    head_title: String(jsonDataA1[23]?.[2] || ""),
                    head_education: String(jsonDataA1[24]?.[2] || ""),
                    institution_type: selectedInstitutionType,
                };

                updateProgress(50);
                const token = localStorage.getItem("token");
                const institutionResponse = await axios.post(
                    `${config.API_URL}/institutions`,
                    extractedInstitution,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                // Log the upload action
                await createLog({
                    action: "uploaded_institution",
                    description: `Uploaded institution: ${extractedInstitution.name}`,
                    modelType: "App\\Models\\Institution",
                    modelId: institutionResponse.data.id,
                    properties: extractedInstitution,
                });

                setSnackbarMessage("Institution data uploaded successfully!");
                setSnackbarSeverity("success");
                setSnackbarOpen(true);

                const institutionId = institutionResponse.data.id;

                const sheetA2 = workbook.Sheets[workbook.SheetNames[1]];
                const jsonDataA2 = XLSX.utils.sheet_to_json(sheetA2, {
                    header: 1,
                });

                const startRow = 10;
                const currentYear = new Date().getFullYear();

                const processedCampuses = jsonDataA2
                    .slice(startRow)
                    .filter((row) =>
                        row.some((cell) => cell !== undefined && cell !== "")
                    )
                    .map((row) => {
                        const parseNumeric = (value, min, max) => {
                            if (
                                value === undefined ||
                                value === "" ||
                                isNaN(value)
                            )
                                return null;
                            const num = parseFloat(value);
                            if (min !== undefined && num < min) return null;
                            if (max !== undefined && num > max) return null;
                            return num;
                        };

                        const parseInteger = (value, min, max) => {
                            if (
                                value === undefined ||
                                value === "" ||
                                isNaN(value)
                            )
                                return null;
                            const int = parseInt(value, 10);
                            if (min !== undefined && int < min) return null;
                            if (max !== undefined && int > max) return null;
                            return int;
                        };

                        const parseString = (value) => {
                            if (value === undefined || value === "")
                                return null;
                            const str = String(value).trim();
                            return str.length > 255
                                ? str.substring(0, 255)
                                : str;
                        };

                        return {
                            suc_name: parseString(row[1]),
                            campus_type: parseString(row[2]),
                            institutional_code: parseString(row[3]),
                            region: parseString(row[4]),
                            municipality_city_province: parseString(row[5]),
                            year_first_operation: parseInteger(
                                row[6],
                                1800,
                                currentYear
                            ),
                            land_area_hectares: parseNumeric(row[7], 0),
                            distance_from_main: parseNumeric(row[8], 0),
                            autonomous_code: parseString(row[9]),
                            position_title: parseString(row[10]),
                            head_full_name: parseString(row[11]),
                            former_name: parseString(row[12]),
                            latitude_coordinates: parseNumeric(
                                row[13],
                                -90,
                                90
                            ),
                            longitude_coordinates: parseNumeric(
                                row[14],
                                -180,
                                180
                            ),
                            institution_id: parseInt(institutionId, 10) || null,
                        };
                    });

                console.log("processedCampuses", processedCampuses);
                updateProgress(70);
                await axios.post(
                    `${config.API_URL}/campuses`,
                    processedCampuses,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                setSnackbarMessage("Campuses added successfully!");
                setSnackbarSeverity("success");
                setSnackbarOpen(true);
                updateProgress(100);
            } catch (error) {
                console.error("Error sending data to backend:", error);
                const errorMessage =
                    error.response?.data?.message ||
                    "Error uploading institution or campus data.";
                setSnackbarMessage(errorMessage);
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
            } finally {
                hideLoading();
                setOpenUploadDialog(false);
                setSelectedFile(null);
                setSelectedInstitutionType("");
                fetchInstitutions();
            }
        };

        reader.readAsArrayBuffer(selectedFile);
    };

    const handleManualAdd = () => {
        setOpenManualDialog(true);
    };

    return (
        <Box>
            {loading ? (
                <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
                    {/* Breadcrumbs Skeleton */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <Skeleton variant="text" width={80} height={20} />
                        <Typography sx={{ mx: 1 }}>›</Typography>
                        <Skeleton variant="text" width={150} height={20} />
                    </Box>
                    {/* Button Skeleton */}
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            justifyContent: "flex-end",
                            gap: 1,
                            mb: 2,
                        }}
                    >
                        <Skeleton
                            variant="rounded"
                            width={isXsScreen ? "100%" : 150}
                            height={36}
                        />
                        <Skeleton
                            variant="rounded"
                            width={isXsScreen ? "100%" : 150}
                            height={36}
                        />
                    </Box>

                    {/* Table Skeleton */}
                    <Skeleton variant="rounded" width="100%" height={400} />
                </Box>
            ) : (
                <Box sx={{ p: 2 }}>
                    {/* Header Section */}
                    <Box>
                        <Breadcrumbs
                            separator="›"
                            aria-label="breadcrumb"
                            sx={{ mb: 1 }}
                        >
                            <Link
                                underline="hover"
                                color="inherit"
                                component={RouterLink}
                                to={
                                    JSON.parse(localStorage.getItem("user"))
                                        ?.role === "Super Admin"
                                        ? "/super-admin/dashboard"
                                        : JSON.parse(
                                              localStorage.getItem("user")
                                          )?.role === "HEI Admin"
                                        ? "/hei-admin/dashboard"
                                        : "/hei-staff/dashboard"
                                }
                            >
                                Dashboard
                            </Link>
                            <Typography color="text.primary">
                                Institution Management
                            </Typography>
                        </Breadcrumbs>
                    </Box>

                    {/* Filter Controls and Actions */}
                    <Box
                        sx={{
                            p: { xs: 1, md: 2 },
                            borderBottom: 1,
                            borderColor: "divider",
                            bgcolor: "grey.50",
                            mb: 2,
                            borderRadius: 1,
                        }}
                    >
                        <Grid container spacing={2}>
                            {/* Filters */}
                            <Grid size={12}>
                                <Grid container spacing={1}>
                                    <Grid size={{ xs: 6, md: 3 }}>
                                        <TextField
                                            label="Search"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(e.target.value)
                                            }
                                            sx={{
                                                "& .MuiInputBase-root": {
                                                    height: 40,
                                                },
                                            }}
                                            InputProps={{
                                                sx: {
                                                    fontSize: "0.875rem",
                                                },
                                            }}
                                            InputLabelProps={{
                                                sx: { fontSize: "0.75rem" },
                                            }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 6, md: 1.5 }}>
                                        <FormControl
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                        >
                                            <InputLabel
                                                sx={{ fontSize: "0.75rem" }}
                                                size="small"
                                            >
                                                Type
                                            </InputLabel>
                                            <Select
                                                value={typeFilter}
                                                onChange={(e) =>
                                                    setTypeFilter(
                                                        e.target.value
                                                    )
                                                }
                                                label="Type"
                                                size="small"
                                                sx={{
                                                    height: 40,
                                                    fontSize: "0.875rem",
                                                }}
                                            >
                                                <MenuItem
                                                    value=""
                                                    sx={{
                                                        fontSize: "0.875rem",
                                                    }}
                                                >
                                                    All Types
                                                </MenuItem>
                                                {filterOptions.types.map(
                                                    (type) => (
                                                        <MenuItem
                                                            key={type}
                                                            value={type}
                                                            sx={{
                                                                fontSize:
                                                                    "0.875rem",
                                                            }}
                                                        >
                                                            {type}
                                                        </MenuItem>
                                                    )
                                                )}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid size={{ xs: 6, md: 2 }}>
                                        <FormControl
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                        >
                                            <InputLabel
                                                sx={{ fontSize: "0.75rem" }}
                                                size="small"
                                            >
                                                City
                                            </InputLabel>
                                            <Select
                                                value={cityFilter}
                                                onChange={(e) =>
                                                    setCityFilter(
                                                        e.target.value
                                                    )
                                                }
                                                label="City"
                                                size="small"
                                                sx={{
                                                    height: 40,
                                                    fontSize: "0.875rem",
                                                }}
                                            >
                                                <MenuItem
                                                    value=""
                                                    sx={{
                                                        fontSize: "0.875rem",
                                                    }}
                                                >
                                                    All Cities
                                                </MenuItem>
                                                {filterOptions.cities.map(
                                                    (city) => (
                                                        <MenuItem
                                                            key={city}
                                                            value={city}
                                                            sx={{
                                                                fontSize:
                                                                    "0.875rem",
                                                            }}
                                                        >
                                                            {city}
                                                        </MenuItem>
                                                    )
                                                )}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid size={{ xs: 6, md: 2 }}>
                                        <FormControl
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                        >
                                            <InputLabel
                                                sx={{ fontSize: "0.75rem" }}
                                            >
                                                Province
                                            </InputLabel>
                                            <Select
                                                value={provinceFilter}
                                                onChange={(e) =>
                                                    setProvinceFilter(
                                                        e.target.value
                                                    )
                                                }
                                                label="Province"
                                                sx={{
                                                    height: 40,
                                                    fontSize: "0.875rem",
                                                }}
                                            >
                                                <MenuItem
                                                    value=""
                                                    sx={{
                                                        fontSize: "0.875rem",
                                                    }}
                                                >
                                                    All Provinces
                                                </MenuItem>
                                                {filterOptions.provinces.map(
                                                    (province) => (
                                                        <MenuItem
                                                            key={province}
                                                            value={province}
                                                            sx={{
                                                                fontSize:
                                                                    "0.875rem",
                                                            }}
                                                        >
                                                            {province}
                                                        </MenuItem>
                                                    )
                                                )}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    {/* Actions */}
                                    <Grid size={{ xs: 6, md: 1.5 }}>
                                        <Button
                                            variant="outlined"
                                            startIcon={<AddIcon />}
                                            onClick={handleManualAdd}
                                            fullWidth
                                            sx={{
                                                borderRadius: 1.5,
                                                textTransform: "none",
                                                fontWeight: 500,
                                                py: 1,
                                            }}
                                        >
                                            Add Institution
                                        </Button>
                                    </Grid>
                                    <Grid size={{ xs: 6, md: 2 }}>
                                        <Button
                                            variant="contained"
                                            startIcon={<UploadIcon />}
                                            onClick={() =>
                                                setOpenUploadDialog(true)
                                            }
                                            fullWidth
                                            sx={{
                                                borderRadius: 1.5,
                                                bgcolor:
                                                    theme.palette.primary.main,
                                                color: "white",
                                                "&:hover": {
                                                    bgcolor:
                                                        theme.palette.primary
                                                            .dark,
                                                },
                                                textTransform: "none",
                                                fontWeight: 500,
                                                py: 1,
                                            }}
                                        >
                                            Upload Form A
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Table Section */}
                    <Box>
                        <InstitutionTable
                            institutions={institutions}
                            setSnackbarMessage={setSnackbarMessage}
                            fetchInstitutions={fetchInstitutions}
                            setSnackbarSeverity={setSnackbarSeverity}
                            setSnackbarOpen={setSnackbarOpen}
                            searchTerm={searchTerm}
                            typeFilter={typeFilter}
                            cityFilter={cityFilter}
                            provinceFilter={provinceFilter}
                            onEdit={(updatedInstitution) => {
                                // Update the institution in the local state
                                setInstitutions((prev) =>
                                    prev.map((inst) =>
                                        inst.id === updatedInstitution.id
                                            ? {
                                                  ...inst,
                                                  ...updatedInstitution,
                                              }
                                            : inst
                                    )
                                );
                            }}
                        />
                    </Box>
                </Box>
            )}

            {/* Upload Dialog */}
            <Dialog
                open={openUploadDialog}
                onClose={() => setOpenUploadDialog(false)}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        width: { xs: "95%", sm: "80%", md: "500px" },
                        maxWidth: "100%",
                        m: { xs: 1, sm: 2 },
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        px: 3,
                        py: 2,
                    }}
                >
                    <Typography fontWeight={600}>
                        Upload Institution Form A
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 3 }}
                    >
                        Please select an institution type and upload the Form A
                        Excel document.
                    </Typography>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="institution-type-label">
                            Institution Type
                        </InputLabel>
                        <Select
                            labelId="institution-type-label"
                            value={selectedInstitutionType}
                            label="Institution Type"
                            onChange={(e) =>
                                setSelectedInstitutionType(e.target.value)
                            }
                        >
                            <MenuItem value="SUC">SUC</MenuItem>
                            <MenuItem value="LUC">LUC</MenuItem>
                            <MenuItem value="Private">Private</MenuItem>
                        </Select>
                    </FormControl>

                    <Box
                        onDrop={(e) => {
                            e.preventDefault();
                            if (
                                e.dataTransfer.files &&
                                e.dataTransfer.files[0]
                            ) {
                                setSelectedFile(e.dataTransfer.files[0]);
                            }
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        sx={{
                            p: 1.5,
                            border: `1px dashed ${theme.palette.primary.main}`,
                            borderRadius: 1.5,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                            cursor: "pointer",
                            bgcolor: "background.paper",
                        }}
                        onClick={() =>
                            document.getElementById("upload-input").click()
                        }
                    >
                        <UploadIcon color="primary" sx={{ fontSize: 28 }} />
                        <Typography>
                            Drag & drop file or click to browse
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Supported formats: .xlsx, .xls
                        </Typography>
                        <input
                            id="upload-input"
                            type="file"
                            hidden
                            accept=".xlsx, .xls"
                            onChange={(e) => setSelectedFile(e.target.files[0])}
                        />
                    </Box>

                    {selectedFile && (
                        <Paper
                            variant="outlined"
                            sx={{
                                mt: 2,
                                p: 1.5,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                borderRadius: 1.5,
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <DownloadIcon color="primary" sx={{ mr: 1 }} />
                                <Box>
                                    <Typography
                                        variant="body2"
                                        noWrap
                                        sx={{ maxWidth: { xs: 120, sm: 200 } }}
                                    >
                                        {selectedFile.name}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        {(selectedFile.size / 1024).toFixed(2)}{" "}
                                        KB
                                    </Typography>
                                </Box>
                            </Box>
                            <IconButton
                                size="small"
                                onClick={() => setSelectedFile(null)}
                                sx={{
                                    color: theme.palette.error.main,
                                    "&:hover": {
                                        bgcolor: alpha(
                                            theme.palette.error.main,
                                            0.1
                                        ),
                                    },
                                }}
                            >
                                &times;
                            </IconButton>
                        </Paper>
                    )}
                </DialogContent>
                <DialogActions
                    sx={{
                        flexDirection: { xs: "column", sm: "row" },
                        gap: 1,
                        px: { xs: 2, sm: 3 },
                        py: { xs: 2, sm: 2 },
                        borderTop: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <Button
                        onClick={() => setOpenUploadDialog(false)}
                        fullWidth={isXsScreen}
                        sx={{
                            textTransform: "none",
                            fontWeight: 500,
                            color: theme.palette.text.primary,
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleFileUpload}
                        variant="contained"
                        disabled={!selectedFile || !selectedInstitutionType}
                        fullWidth={isXsScreen}
                        sx={{
                            textTransform: "none",
                            fontWeight: 500,
                            borderRadius: 1.5,
                            px: 3,
                        }}
                    >
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>

            <ManualInstitutionDialog
                open={openManualDialog}
                onClose={() => setOpenManualDialog(false)}
                getInstitutionType={getInstitutionType}
                fetchInstitutions={fetchInstitutions}
                setSnackbarOpen={setSnackbarOpen}
                setSnackbarMessage={setSnackbarMessage}
                setSnackbarSeverity={setSnackbarSeverity}
            />

            <CustomSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={handleCloseSnackbar}
                autoHideDuration={5000}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            />
        </Box>
    );
};

export default InstitutionManagement;
