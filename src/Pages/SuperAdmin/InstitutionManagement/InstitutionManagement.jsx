/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import {
    Box,
    Button,
    Typography,
    Breadcrumbs,
    Link,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Skeleton,
    IconButton,
    useTheme,
    alpha,
    TextField,
    useMediaQuery,
    Collapse,
    InputAdornment,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
    UploadFile as UploadIcon,
    Add as AddIcon,
    FilterList as FilterListIcon,
} from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import { RiResetLeftLine } from "react-icons/ri";

import InstitutionTable from "./InstitutionTable";
import { Link as RouterLink } from "react-router-dom";
import config from "../../../utils/config";
import CustomSnackbar from "../../../Components/CustomSnackbar";
import ManualInstitutionDialog from "./ManualInstitutionDialog";
import { useLoading } from "../../../Context/LoadingContext";
import useActivityLog from "../../../Hooks/useActivityLog";
import UploadDialog from "./UploadDialog";

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
    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedMunicipality, setSelectedMunicipality] = useState("");
    const [showFilters, setShowFilters] = useState(false);

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
        localStorage.getItem("reportYearFilter") || ""
    );

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

    useEffect(() => {
        localStorage.setItem("searchTerm", searchTerm);
        localStorage.setItem("typeFilter", typeFilter);
        localStorage.setItem("municipalityFilter", municipalityFilter);
        localStorage.setItem("provinceFilter", provinceFilter);
        localStorage.setItem("reportYearFilter", reportYearFilter);
    }, [searchTerm, typeFilter, municipalityFilter, provinceFilter, reportYearFilter]);

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
            console.log("institutionsData", institutionsData);
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
    }, []);

    const handleFileUpload = async (reportYear) => {
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
                    const parsed = Number.parseInt(value, 10);
                    return isNaN(parsed) ? null : parsed;
                };

                const extractedInstitution = {
                    name: String(jsonDataA1[4]?.[2] || "Unknown"),
                    region_id: Number.parseInt(selectedRegion, 10) || null,
                    address_street: String(jsonDataA1[7]?.[2] || ""),
                    municipality_id:
                        Number.parseInt(selectedMunicipality, 10) || null,
                    province_id: Number.parseInt(selectedProvince, 10) || null,
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
                    report_year: reportYear, // include the report year from the datepicker
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
                            const num = Number.parseFloat(value);
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
                            const int = Number.parseInt(value, 10);
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
                            region_id:
                                Number.parseInt(selectedRegion, 10) || null,
                            municipality_id:
                                Number.parseInt(selectedMunicipality, 10) ||
                                null,
                            province_id:
                                Number.parseInt(selectedProvince, 10) || null,
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
                            institution_id:
                                Number.parseInt(institutionId, 10) || null,
                            report_year: reportYear, // include the report year from the datepicker
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
                setSelectedRegion("");
                setSelectedProvince("");
                setSelectedMunicipality("");
                fetchInstitutions();
            }
        };

        reader.readAsArrayBuffer(selectedFile);
    };

    const handleManualAdd = () => {
        setOpenManualDialog(true);
    };

    const toggleFilters = () => {
        setShowFilters((prev) => !prev);
    };

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

    return (
        <Box>  
            {loading ? (
                <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Skeleton variant="text" width={80} height={20} />
                        <Typography sx={{ mx: 1 }}>›</Typography>
                        <Skeleton variant="text" width={150} height={20} />
                    </Box>
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
                    <Skeleton variant="rounded" width="100%" height={400} />
                </Box>
            ) : (
                <Box sx={{ p: 2 }}>
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
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                        sx: {
                                            fontSize: "0.875rem",
                                            height: 40,
                                        },
                                    }}
                                    InputLabelProps={{
                                        sx: {
                                            fontSize: "0.75rem",
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 6, md: 9 }}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 2,
                                        }}
                                    >
                                        <IconButton
                                            onClick={toggleFilters}
                                            sx={{
                                                color: theme.palette.primary
                                                    .main,
                                                "&:hover": {
                                                    bgcolor: alpha(
                                                        theme.palette.primary
                                                            .main,
                                                        0.1
                                                    ),
                                                },
                                            }}
                                            aria-label={
                                                showFilters
                                                    ? "Hide filters"
                                                    : "Show filters"
                                            }
                                        >
                                            <FilterListIcon />
                                        </IconButton>
                                        <Collapse in={showFilters}>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    gap: 2,
                                                    width: "100%",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        flex: "0 0 25%",
                                                    }}
                                                >
                                                    <FormControl
                                                        variant="outlined"
                                                        size="small"
                                                        fullWidth
                                                    >
                                                        <InputLabel
                                                            sx={{
                                                                fontSize:
                                                                    "0.75rem",
                                                            }}
                                                            size="small"
                                                        >
                                                            Type
                                                        </InputLabel>
                                                        <Select
                                                            value={typeFilter}
                                                            onChange={(e) =>
                                                                setTypeFilter(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            label="Type"
                                                            size="small"
                                                            sx={{
                                                                height: 40,
                                                                fontSize:
                                                                    "0.875rem",
                                                            }}
                                                        >
                                                            <MenuItem
                                                                value=""
                                                                sx={{
                                                                    fontSize:
                                                                        "0.875rem",
                                                                }}
                                                            >
                                                                All Types
                                                            </MenuItem>
                                                            {filterOptions.types.map(
                                                                (type) => (
                                                                    <MenuItem
                                                                        key={
                                                                            type
                                                                        }
                                                                        value={
                                                                            type
                                                                        }
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
                                                </Box>
                                                <Box
                                                    sx={{
                                                        flex: "0 0 40%",
                                                    }}
                                                >
                                                    <FormControl
                                                        variant="outlined"
                                                        size="small"
                                                        fullWidth
                                                    >
                                                        <InputLabel
                                                            sx={{
                                                                fontSize:
                                                                    "0.75rem",
                                                            }}
                                                            size="small"
                                                        >
                                                            Municipality
                                                        </InputLabel>
                                                        <Select
                                                            value={
                                                                municipalityFilter
                                                            }
                                                            onChange={(e) =>
                                                                setMunicipalityFilter(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            label="Municipality"
                                                            size="small"
                                                            sx={{
                                                                height: 40,
                                                                fontSize:
                                                                    "0.875rem",
                                                            }}
                                                        >
                                                            <MenuItem
                                                                value=""
                                                                sx={{
                                                                    fontSize:
                                                                        "0.875rem",
                                                                }}
                                                            >
                                                                All
                                                                Municipalities
                                                            </MenuItem>
                                                            {filterOptions.municipalities.map(
                                                                (
                                                                    municipality
                                                                ) => (
                                                                    <MenuItem
                                                                        key={
                                                                            municipality
                                                                        }
                                                                        value={
                                                                            municipality
                                                                        }
                                                                        sx={{
                                                                            fontSize:
                                                                                "0.875rem",
                                                                        }}
                                                                    >
                                                                        {
                                                                            municipality
                                                                        }
                                                                    </MenuItem>
                                                                )
                                                            )}
                                                        </Select>
                                                    </FormControl>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        flex: "0 0 40%",
                                                    }}
                                                >
                                                    <FormControl
                                                        variant="outlined"
                                                        size="small"
                                                        fullWidth
                                                    >
                                                        <InputLabel
                                                            sx={{
                                                                fontSize:
                                                                    "0.75rem",
                                                            }}
                                                        >
                                                            Province
                                                        </InputLabel>
                                                        <Select
                                                            value={
                                                                provinceFilter
                                                            }
                                                            onChange={(e) =>
                                                                setProvinceFilter(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            label="Province"
                                                            sx={{
                                                                height: 40,
                                                                fontSize:
                                                                    "0.875rem",
                                                            }}
                                                        >
                                                            <MenuItem
                                                                value=""
                                                                sx={{
                                                                    fontSize:
                                                                        "0.875rem",
                                                                }}
                                                            >
                                                                All Provinces
                                                            </MenuItem>
                                                            {filterOptions.provinces.map(
                                                                (province) => (
                                                                    <MenuItem
                                                                        key={
                                                                            province
                                                                        }
                                                                        value={
                                                                            province
                                                                        }
                                                                        sx={{
                                                                            fontSize:
                                                                                "0.875rem",
                                                                        }}
                                                                    >
                                                                        {
                                                                            province
                                                                        }
                                                                    </MenuItem>
                                                                )
                                                            )}
                                                        </Select>
                                                    </FormControl>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        flex: "0 0 35%",
                                                    }}
                                                >
                                                    <FormControl
                                                        variant="outlined"
                                                        size="small"
                                                        fullWidth
                                                    >
                                                        <InputLabel
                                                            sx={{
                                                                fontSize:
                                                                    "0.75rem",
                                                            }}
                                                            size="small"
                                                        >
                                                            Report Year
                                                        </InputLabel>
                                                        <Select
                                                            value={
                                                                reportYearFilter
                                                            }
                                                            onChange={(e) =>
                                                                setReportYearFilter(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            label="Report Year"
                                                            size="small"
                                                            sx={{
                                                                height: 40,
                                                                fontSize:
                                                                    "0.875rem",
                                                            }}
                                                        >
                                                            <MenuItem
                                                                value=""
                                                                sx={{
                                                                    fontSize:
                                                                        "0.875rem",
                                                                }}
                                                            >
                                                                All Years
                                                            </MenuItem>
                                                            {filterOptions.reportYears.map(
                                                                (year) => (
                                                                    <MenuItem
                                                                        key={
                                                                            year
                                                                        }
                                                                        value={String(
                                                                            year
                                                                        )}
                                                                        sx={{
                                                                            fontSize:
                                                                                "0.875rem",
                                                                        }}
                                                                    >
                                                                        {year}
                                                                    </MenuItem>
                                                                )
                                                            )}
                                                        </Select>
                                                    </FormControl>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        flex: "0 0 40%",
                                                        display: "flex",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <Button
                                                        variant="text"
                                                        startIcon={
                                                            <RiResetLeftLine />
                                                        }
                                                        onClick={clearFilters}
                                                        sx={{
                                                            textTransform:
                                                                "none",
                                                            fontWeight: 500,
                                                            color: theme.palette
                                                                .error.main,
                                                            "&:hover": {
                                                                bgcolor: alpha(
                                                                    theme
                                                                        .palette
                                                                        .error
                                                                        .main,
                                                                    0.1
                                                                ),
                                                            },
                                                        }}
                                                    />
                                                </Box>
                                            </Box>
                                        </Collapse>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: {
                                                xs: "column",
                                                sm: "row",
                                            },
                                            gap: 1,
                                        }}
                                    >
                                        <Button
                                            variant="outlined"
                                            startIcon={<AddIcon />}
                                            onClick={handleManualAdd}
                                            sx={{
                                                borderRadius: 1.5,
                                                textTransform: "none",
                                                fontWeight: 500,
                                                py: 1,
                                                width: {
                                                    xs: "100%",
                                                    sm: "auto",
                                                },
                                            }}
                                        >
                                            Add Institution
                                        </Button>
                                        <Button
                                            variant="contained"
                                            startIcon={<UploadIcon />}
                                            onClick={() =>
                                                setOpenUploadDialog(true)
                                            }
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
                                                width: {
                                                    xs: "100%",
                                                    sm: "auto",
                                                },
                                            }}
                                        >
                                            Upload Form A
                                        </Button>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>

                    <Box>
                        <InstitutionTable
                            institutions={filteredInstitutions}
                            setSnackbarMessage={setSnackbarMessage}
                            fetchInstitutions={fetchInstitutions}
                            setSnackbarSeverity={setSnackbarSeverity}
                            setSnackbarOpen={setSnackbarOpen}
                            searchTerm={searchTerm}
                            typeFilter={typeFilter}
                            municipalityFilter={municipalityFilter}
                            provinceFilter={provinceFilter}
                            onEdit={(updatedInstitution) => {
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

            <UploadDialog
                openUploadDialog={openUploadDialog}
                setOpenUploadDialog={setOpenUploadDialog}
                selectedInstitutionType={selectedInstitutionType}
                setSelectedInstitutionType={setSelectedInstitutionType}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                handleFileUpload={handleFileUpload}
                selectedRegion={selectedRegion}
                setSelectedRegion={setSelectedRegion}
                selectedProvince={selectedProvince}
                setSelectedProvince={setSelectedProvince}
                selectedMunicipality={selectedMunicipality}
                setSelectedMunicipality={setSelectedMunicipality}
            />

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
