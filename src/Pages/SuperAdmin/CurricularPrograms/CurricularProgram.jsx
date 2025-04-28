/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo } from "react";
import {
    Container,
    Typography,
    Button,
    Tabs,
    Tab,
    Box,
    Breadcrumbs,
    Link,
    Tooltip,
    useTheme,
    Fab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    IconButton,
    ButtonGroup,
    Paper,
    alpha,
    TextField,
    Grid,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DownloadIcon from "@mui/icons-material/Download";
import UploadIcon from "@mui/icons-material/Upload";
import CloseIcon from "@mui/icons-material/Close";
import * as XLSX from "xlsx";
import axios from "axios";
import config from "../../../utils/config";
import ProgramTables from "./ProgramTables";
import CustomSnackbar from "../../../Components/CustomSnackbar";
import { useNavigate, useParams } from "react-router-dom";
import { useLoading } from "../../../Context/LoadingContext";
import ExcelJS from "exceljs";
import { decryptId } from "../../../utils/encryption";
import CurricularProgramSkeleton from "./CurricularProgramSkeleton";

const CurricularProgram = () => {
    const { institutionId: encryptedInstitutionId } = useParams();
    const [programs, setPrograms] = useState([]);
    const [openReferenceDialog, setOpenReferenceDialog] = useState(false);
    const [openFilterDialog, setOpenFilterDialog] = useState(false);
    const [mainTabValue, setMainTabValue] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openUploadDialog, setOpenUploadDialog] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const { showLoading, hideLoading, updateProgress } = useLoading();
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        data_date: "",
        category: "",
    });
    const navigate = useNavigate();
    const theme = useTheme();

    const categories = useMemo(
        () => [
            "DOCTORATE",
            "MASTERS",
            "POST-BACCALAUREATE",
            "BACCALAUREATE",
            "PRE-BACCALAUREATE",
            "VOC-TECH",
            "BASIC EDUCATION",
        ],
        []
    );

    const fetchPrograms = async () => {
        try {
            const institutionId = decryptId(encryptedInstitutionId);
            showLoading();
            setLoading(true);
            const token = localStorage.getItem("token");
            if (!institutionId) {
                console.error("No institution ID found in localStorage");
                hideLoading();
                setPrograms([]);
                return;
            }

            const response = await axios.get(`${config.API_URL}/programs`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { institution_id: institutionId },
            });
            console.log("Fetched programs:", response.data);
            if (Array.isArray(response.data)) {
                setPrograms(response.data);
            } else {
                console.error("Invalid data format:", response.data);
                setPrograms([]);
            }
        } catch (error) {
            if (error.response) {
                console.error("Response error:", error.response.data);
            } else if (error.request) {
                console.error("Request error:", error.request);
            } else {
                console.error("General error:", error.message);
            }
            setPrograms([]);
        } finally {
            setLoading(false);
            hideLoading();
        }
    };

    useEffect(() => {
        fetchPrograms();
    }, []);

    const filteredPrograms = useMemo(() => {
        let filtered = programs.filter(
            (program) => program.program_type === categories[mainTabValue]
        );

        // Apply filters
        if (filters.data_date) {
            filtered = filtered.filter(
                (program) => program.data_date === filters.data_date
            );
        }
        if (filters.category) {
            filtered = filtered.filter(
                (program) => program.category === filters.category
            );
        }

        // Apply search query
        if (searchQuery) {
            filtered = filtered.filter((program) =>
                Object.values(program).some((value) =>
                    String(value)
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                )
            );
        }

        return filtered;
    }, [programs, mainTabValue, categories, searchQuery, filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleClearFilters = () => {
        setFilters({
            data_date: "",
            category: "",
        });
        setOpenFilterDialog(false);
    };

    const handleFileUpload = async () => {
        if (!selectedFile) {
            console.log("No file selected for upload");
            return;
        }

        const token = localStorage.getItem("token");
        const institutionId = decryptId(encryptedInstitutionId);

        if (!institutionId || !token) {
            setSnackbar({
                open: true,
                message: !institutionId
                    ? "Please select an institution first."
                    : "Please log in first.",
                severity: "warning",
            });
            setOpenUploadDialog(false);
            setSelectedFile(null);
            return;
        }
        updateProgress(10);
        setIsUploading(true);
        setLoading(true);

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array" });

                let allParsedData = [];
                const currentDate = new Date().toLocaleDateString("en-CA", {
                    timeZone: "Asia/Manila",
                });

                for (let sheetIndex = 0; sheetIndex <= 6; sheetIndex++) {
                    if (!workbook.SheetNames[sheetIndex]) continue;

                    const sheetName = workbook.SheetNames[sheetIndex];
                    const sheet = workbook.Sheets[sheetName];

                    const sheetData = XLSX.utils.sheet_to_json(sheet, {
                        header: 1,
                        range: 11,
                    });

                    const parsedData = sheetData
                        .map((row) => {
                            const labUnits = row[12] || 0;
                            const lectureUnits = row[13] || 0;
                            const maleTotal =
                                Number(row[17] || 0) +
                                Number(row[19] || 0) +
                                Number(row[21] || 0) +
                                Number(row[23] || 0) +
                                Number(row[25] || 0) +
                                Number(row[27] || 0) +
                                Number(row[29] || 0) +
                                Number(row[31] || 0);
                            const femaleTotal =
                                Number(row[18] || 0) +
                                Number(row[20] || 0) +
                                Number(row[22] || 0) +
                                Number(row[24] || 0) +
                                Number(row[26] || 0) +
                                Number(row[28] || 0) +
                                Number(row[30] || 0) +
                                Number(row[32] || 0);
                            return {
                                institution_id: institutionId,
                                program_name: row[1] || null,
                                program_code: row[2] || null,
                                major_name: row[3] || null,
                                major_code: row[4] || null,
                                category: row[5] || null,
                                serial: String(row[6] || " "),
                                Year: String(row[7] || ""),
                                is_thesis_dissertation_required: row[8] || null,
                                program_status: row[9] || null,
                                calendar_use_code: row[10] || null,
                                program_normal_length_in_years: row[11] || null,
                                lab_units: labUnits,
                                lecture_unt: lectureUnits,
                                total_units: labUnits + lectureUnits,
                                tuition_per_unit: row[15] || null,
                                program_fee: row[16] || null,
                                program_type: categories[sheetIndex],
                                data_date: currentDate,
                                new_students_freshmen_male: row[17] || null,
                                new_students_freshmen_female: row[18] || null,
                                "1st_year_male": row[19] || null,
                                "1st_year_female": row[20] || null,
                                "2nd_year_male": row[21] || null,
                                "2nd_year_female": row[22] || null,
                                "3rd_year_male": row[23] || null,
                                "3rd_year_female": row[24] || null,
                                "4th_year_male": row[25] || null,
                                "4th_year_female": row[26] || null,
                                "5th_year_male": row[27] || null,
                                "5th_year_female": row[28] || null,
                                "6th_year_male": row[29] || null,
                                "6th_year_female": row[30] || null,
                                "7th_year_male": row[31] || null,
                                "7th_year_female": row[32] || null,
                                subtotal_male: maleTotal,
                                subtotal_female: femaleTotal,
                                grand_total: maleTotal + femaleTotal,
                                lecture_units_actual: row[36] || null,
                                laboratory_units_actual: row[37] || null,
                                total_units_actual:
                                    (row[36] || null) + (row[37] || null),
                                graduates_males: row[39] || null,
                                graduates_females: row[40] || null,
                                graduates_total:
                                    (row[39] || null) + (row[40] || null),
                                externally_funded_merit_scholars:
                                    row[41] || null,
                                internally_funded_grantees: row[42] || null,
                                suc_funded_grantees: row[43] || null,
                            };
                        })
                        .filter((data) => !!data.program_name);

                    console.log(
                        `Sheet ${sheetName}: Total rows: ${sheetData.length}, Valid rows: ${parsedData.length}`
                    );
                    allParsedData = [...allParsedData, ...parsedData];
                    console.log(`Sheet ${sheetName}: Parsed data:`, parsedData);
                }

                if (allParsedData.length === 0) {
                    setSnackbar({
                        open: true,
                        message:
                            "No valid programs with a program name found in any sheet of the Excel file.",
                        severity: "warning",
                    });
                    setIsUploading(false);
                    setOpenUploadDialog(false);
                    setSelectedFile(null);
                    updateProgress();
                    setLoading(false);
                    return;
                }

                try {
                    const createdPrograms = [];
                    const totalRows = allParsedData.length;
                    let processedRows = 0;

                    for (const data of allParsedData) {
                        const programResponse = await axios.post(
                            `${config.API_URL}/programs`,
                            data,
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                        createdPrograms.push(programResponse.data);
                        processedRows += 1;
                        updateProgress(
                            50 + Math.round((50 * processedRows) / totalRows)
                        );
                    }

                    setPrograms(createdPrograms);
                    updateProgress(100);
                    fetchPrograms();
                    setSnackbar({
                        open: true,
                        message: "Data imported successfully!",
                        severity: "success",
                    });
                } catch (error) {
                    console.error(
                        "Error importing data:",
                        error.response?.data
                    );
                    hideLoading();
                    setSnackbar({
                        open: true,
                        message:
                            "Error importing data. Check the console for details.",
                        severity: "error",
                    });
                } finally {
                    setIsUploading(false);
                    setOpenUploadDialog(false);
                    setSelectedFile(null);
                    updateProgress();
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error processing file:", error.message);
                setSnackbar({
                    open: true,
                    message:
                        "Error processing file. Check the console for details.",
                    severity: "error",
                });
                setIsUploading(false);
                setOpenUploadDialog(false);
                setSelectedFile(null);
                updateProgress();
                setLoading(false);
            }
        };

        reader.readAsArrayBuffer(selectedFile);
    };

    const handleExportToExcel = async () => {
        console.log("Programs before export:", programs);
        setLoading(true);
        try {
            updateProgress(10);
            const response = await fetch("/templates/Form-B-Themeplate.xlsx");
            if (!response.ok) {
                throw new Error(
                    `Failed to load template file: HTTP ${response.status}`
                );
            }

            const arrayBuffer = await response.arrayBuffer();

            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(arrayBuffer);

            const dataStartRow = 11;

            const programsByCategory = categories.reduce((acc, category) => {
                acc[category] = programs.filter(
                    (program) => program.program_type === category
                );
                return acc;
            }, {});

            for (
                let sheetIndex = 0;
                sheetIndex < categories.length;
                sheetIndex++
            ) {
                const sheetName = categories[sheetIndex];
                const worksheet = workbook.worksheets.find(
                    (ws) => ws.name.toUpperCase() === sheetName.toUpperCase()
                );
                if (!worksheet) {
                    continue;
                }
                updateProgress(25);
                const programsForSheet = programsByCategory[sheetName] || [];
                programsForSheet.forEach((program, i) => {
                    const row = worksheet.getRow(dataStartRow + i);
                    row.getCell(2).value = program.program_name || null;
                    row.getCell(3).value = program.program_code || null;
                    row.getCell(4).value = program.major_name || null;
                    row.getCell(5).value = program.major_code || null;
                    row.getCell(6).value = program.category || null;
                    row.getCell(7).value = program.serial || null;
                    row.getCell(8).value = program.Year || null;
                    row.getCell(9).value =
                        program.is_thesis_dissertation_required || null;
                    row.getCell(10).value = program.program_status || null;
                    row.getCell(11).value = program.calendar_use_code || null;
                    row.getCell(12).value =
                        program.program_normal_length_in_years || 0;
                    row.getCell(13).value = program.lab_units || 0;
                    row.getCell(14).value = program.lecture_unt || 0;
                    row.getCell(15).value = program.total_units || 0;
                    row.getCell(16).value = program.tuition_per_unit || 0;
                    row.getCell(17).value = program.program_fee || 0;
                    row.getCell(18).value =
                        program.new_students_freshmen_male || 0;
                    row.getCell(19).value =
                        program.new_students_freshmen_female || 0;
                    row.getCell(20).value = program["1st_year_male"] || 0;
                    row.getCell(21).value = program["1st_year_female"] || 0;
                    row.getCell(22).value = program["2nd_year_male"] || 0;
                    row.getCell(23).value = program["2nd_year_female"] || 0;
                    row.getCell(24).value = program["3rd_year_male"] || 0;
                    row.getCell(25).value = program["3rd_year_female"] || 0;
                    row.getCell(26).value = program["4th_year_male"] || 0;
                    row.getCell(27).value = program["4th_year_female"] || 0;
                    row.getCell(28).value = program["5th_year_male"] || 0;
                    row.getCell(29).value = program["5th_year_female"] || 0;
                    row.getCell(30).value = program["6th_year_male"] || 0;
                    row.getCell(31).value = program["6th_year_female"] || 0;
                    row.getCell(32).value = program["7th_year_male"] || 0;
                    row.getCell(33).value = program["7th_year_female"] || 0;
                    row.getCell(34).value = program.subtotal_male || 0;
                    row.getCell(35).value = program.subtotal_female || 0;
                    row.getCell(36).value = program.grand_total || 0;
                    row.getCell(37).value = program.lecture_units_actual || 0;
                    row.getCell(38).value =
                        program.laboratory_units_actual || 0;
                    row.getCell(39).value = program.total_units_actual || 0;
                    row.getCell(40).value = program.graduates_males || 0;
                    row.getCell(41).value = program.graduates_females || 0;
                    row.getCell(42).value = program.graduates_total || 0;
                    row.getCell(43).value =
                        program.externally_funded_merit_scholars || 0;
                    row.getCell(44).value =
                        program.internally_funded_grantees || 0;
                    row.getCell(45).value = program.suc_funded_grantees || 0;
                    row.commit();
                });
            }
            updateProgress(50);
            const fileName = `Curricular_Programs_${
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
            updateProgress(100);
        } catch (error) {
            console.error("Error exporting data:", error);
            alert("Error exporting data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === "clickaway") return;
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    const referenceData = {
        authority: [
            { code: "GP", label: "Government Permit" },
            { code: "GR", label: "Government Recognition" },
            { code: "BR", label: "Board Resolution" },
        ],
        thesisDissertation: [
            { code: "1", label: "Required" },
            { code: "2", label: "Optional" },
            { code: "3", label: "Not Required" },
        ],
        programStatus: [
            { code: "1", label: "Active" },
            { code: "2", label: "Phased Out" },
            { code: "3", label: "Abolished" },
        ],
        calendar: [
            { code: "1", label: "Sem" },
            { code: "2", label: "Tri Sem" },
            { code: "3", label: "Quarter Sem" },
            { code: "4", label: "Distance Mode" },
        ],
    };

    if (loading) {
        return <CurricularProgramSkeleton />;
    }

    return (
        <Container maxWidth={false} sx={{ height: "100vh", p: 0 }}>
            <Box sx={{ p: 3, my: 2 }}>
                <Breadcrumbs
                    separator="›"
                    aria-label="breadcrumb"
                    sx={{ mb: 2 }}
                >
                    <Link
                        underline="hover"
                        color="inherit"
                        sx={{ cursor: "pointer" }}
                        onClick={() => navigate("/super-admin/dashboard")}
                    >
                        Dashboard
                    </Link>
                    <Link
                        underline="hover"
                        color="inherit"
                        sx={{ cursor: "pointer" }}
                        onClick={() => navigate("/super-admin/institutions")}
                    >
                        Institution Management
                    </Link>
                    <Typography color="textPrimary">
                        Curricular Program
                    </Typography>
                </Breadcrumbs>

                <Box
                    sx={{
                        mb: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        flexWrap: "wrap",
                    }}
                >
                    <TextField
                        fullWidth
                        size="small"
                        label="Search"
                        variant="outlined"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        sx={{
                            "& .MuiInputBase-root": {
                                fontSize: "0.75rem",
                                height: "32px",
                            },
                            "& .MuiInputLabel-root": {
                                fontSize: "0.75rem",
                                transform: "translate(14px, 8px) scale(1)",
                            },
                            "& .MuiInputLabel-shrink": {
                                transform: "translate(14px, -6px) scale(0.75)",
                            },
                            maxWidth: "300px",
                        }}
                    />
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item size={6}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Data Date</InputLabel>
                                <Select
                                    name="data_date"
                                    value={filters.data_date}
                                    onChange={handleFilterChange}
                                    label="Data Date"
                                >
                                    <MenuItem value="">
                                        <em>All</em>
                                    </MenuItem>
                                    {[
                                        ...new Set(
                                            programs.map((p) => p.data_date)
                                        ),
                                    ]
                                        .filter((date) => date)
                                        .sort()
                                        .map((date) => (
                                            <MenuItem key={date} value={date}>
                                                {date}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item size={6}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Category</InputLabel>
                                <Select
                                    name="category"
                                    value={filters.category}
                                    onChange={handleFilterChange}
                                    label="Category"
                                >
                                    <MenuItem value="">
                                        <em>All</em>
                                    </MenuItem>
                                    {[
                                        ...new Set(
                                            programs.map((p) => p.category)
                                        ),
                                    ]
                                        .filter((category) => category)
                                        .sort()
                                        .map((category) => (
                                            <MenuItem
                                                key={category}
                                                value={category}
                                            >
                                                {category}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                    <ButtonGroup sx={{ flexShrink: 0, ml: "auto" }}>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<UploadFileIcon />}
                            onClick={() => setOpenUploadDialog(true)}
                            disabled={isUploading}
                        >
                            {isUploading ? "Uploading..." : "Import Form B"}
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<DownloadIcon />}
                            onClick={handleExportToExcel}
                            disabled={isUploading}
                        >
                            Export to Excel
                        </Button>
                    </ButtonGroup>
                </Box>

                <Dialog
                    open={openFilterDialog}
                    onClose={() => setOpenFilterDialog(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>Filter Programs</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>Data Date</InputLabel>
                                    <Select
                                        name="data_date"
                                        value={filters.data_date}
                                        onChange={handleFilterChange}
                                        label="Data Date"
                                    >
                                        <MenuItem value="">
                                            <em>All</em>
                                        </MenuItem>
                                        {[
                                            ...new Set(
                                                programs.map((p) => p.data_date)
                                            ),
                                        ]
                                            .filter((date) => date)
                                            .sort()
                                            .map((date) => (
                                                <MenuItem
                                                    key={date}
                                                    value={date}
                                                >
                                                    {date}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>Category</InputLabel>
                                    <Select
                                        name="category"
                                        value={filters.category}
                                        onChange={handleFilterChange}
                                        label="Category"
                                    >
                                        <MenuItem value="">
                                            <em>All</em>
                                        </MenuItem>
                                        {[
                                            ...new Set(
                                                programs.map((p) => p.category)
                                            ),
                                        ]
                                            .filter((category) => category)
                                            .sort()
                                            .map((category) => (
                                                <MenuItem
                                                    key={category}
                                                    value={category}
                                                >
                                                    {category}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClearFilters} color="secondary">
                            Clear
                        </Button>
                        <Button
                            onClick={() => setOpenFilterDialog(false)}
                            color="primary"
                        >
                            Apply
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={openUploadDialog}
                    onClose={() => setOpenUploadDialog(false)}
                    PaperProps={{
                        sx: {
                            borderRadius: 2,
                            maxWidth: 500,
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
                            Upload Institution Form B
                        </Typography>
                    </DialogTitle>
                    <DialogContent sx={{ p: 3 }}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 3 }}
                        >
                            Please upload the Form B Excel document.
                        </Typography>

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
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Supported formats: .xlsx, .xls
                            </Typography>
                            <input
                                id="upload-input"
                                type="file"
                                hidden
                                accept=".xlsx, .xls"
                                onChange={(e) =>
                                    setSelectedFile(e.target.files[0])
                                }
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
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <DownloadIcon
                                        color="primary"
                                        sx={{ mr: 1 }}
                                    />
                                    <Box>
                                        <Typography
                                            variant="body2"
                                            noWrap
                                            sx={{ maxWidth: 200 }}
                                        >
                                            {selectedFile.name}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            {(selectedFile.size / 1024).toFixed(
                                                2
                                            )}{" "}
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
                                    ×
                                </IconButton>
                            </Paper>
                        )}
                    </DialogContent>
                    <DialogActions
                        sx={{
                            px: 3,
                            py: 2,
                            borderTop: `1px solid ${theme.palette.divider}`,
                        }}
                    >
                        <Button
                            onClick={() => {
                                setOpenUploadDialog(false);
                                setSelectedFile(null);
                            }}
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
                            disabled={!selectedFile || isUploading}
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

                <ProgramTables
                    programs={filteredPrograms}
                    loading={loading}
                    fetchPrograms={fetchPrograms}
                />
                <Tabs
                    value={mainTabValue}
                    onChange={(event, newValue) => setMainTabValue(newValue)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        "& .MuiTab-root": {
                            textTransform: "none",
                            fontWeight: 500,
                            fontSize: "0.85rem",
                            padding: "8px 12px",
                            minWidth: "auto",
                            color: theme.palette.text.secondary,
                            transition: "all 0.2s ease",
                            "&:hover": {
                                color: theme.palette.primary.main,
                                backgroundColor: "rgba(0, 0, 0, 0.04)",
                            },
                        },
                        "& .Mui-selected": {
                            color: `${theme.palette.primary.main} !important`,
                            fontWeight: 600,
                        },
                        "& .MuiTabs-indicator": {
                            backgroundColor: theme.palette.primary.main,
                            height: 3,
                        },
                        "& .MuiTabs-scrollButtons": {
                            color: theme.palette.text.secondary,
                            "&.Mui-disabled": {
                                opacity: 0.3,
                            },
                        },
                    }}
                >
                    {categories.map((category) => (
                        <Tooltip
                            key={category}
                            title={`View programs for ${category}`}
                            arrow
                        >
                            <Tab label={category} />
                        </Tooltip>
                    ))}
                </Tabs>

                <Fab
                    color="primary"
                    aria-label="show reference"
                    size="small"
                    onClick={() => setOpenReferenceDialog(true)}
                    sx={{
                        position: "absolute",
                        bottom: 60,
                        right: 16,
                    }}
                >
                    <InfoIcon />
                </Fab>

                <Dialog
                    open={openReferenceDialog}
                    onClose={() => setOpenReferenceDialog(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        Reference Table
                        <IconButton
                            aria-label="close"
                            onClick={() => setOpenReferenceDialog(false)}
                            sx={{
                                position: "absolute",
                                right: 8,
                                top: 8,
                                color: (theme) => theme.palette.grey[500],
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        Authority to Offer Program
                                    </TableCell>
                                    <TableCell>
                                        Is Thesis/Dissertation Required?
                                    </TableCell>
                                    <TableCell>Program Status</TableCell>
                                    <TableCell>Program Calendar</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {referenceData.authority.map((item, index) => (
                                    <TableRow key={`authority-${index}`}>
                                        <TableCell>{`${item.code} - ${item.label}`}</TableCell>
                                        {index <
                                        referenceData.thesisDissertation
                                            .length ? (
                                            <TableCell>
                                                {`${referenceData.thesisDissertation[index].code} - ${referenceData.thesisDissertation[index].label}`}
                                            </TableCell>
                                        ) : (
                                            <TableCell>-</TableCell>
                                        )}
                                        {index <
                                        referenceData.programStatus.length ? (
                                            <TableCell>
                                                {`${referenceData.programStatus[index].code} - ${referenceData.programStatus[index].label}`}
                                            </TableCell>
                                        ) : (
                                            <TableCell>-</TableCell>
                                        )}
                                        {index <
                                        referenceData.calendar.length ? (
                                            <TableCell>
                                                {`${referenceData.calendar[index].code} - ${referenceData.calendar[index].label}`}
                                            </TableCell>
                                        ) : (
                                            <TableCell>-</TableCell>
                                        )}
                                    </TableRow>
                                ))}
                                {referenceData.calendar.length >
                                    referenceData.authority.length &&
                                    referenceData.calendar
                                        .slice(referenceData.authority.length)
                                        .map((item, index) => (
                                            <TableRow
                                                key={`calendar-extra-${index}`}
                                            >
                                                <TableCell>-</TableCell>
                                                <TableCell>-</TableCell>
                                                <TableCell>-</TableCell>
                                                <TableCell>{`${item.code} - ${item.label}`}</TableCell>
                                            </TableRow>
                                        ))}
                            </TableBody>
                        </Table>
                    </DialogContent>
                </Dialog>
                <CustomSnackbar
                    open={snackbar.open}
                    message={snackbar.message}
                    severity={snackbar.severity}
                    onClose={handleSnackbarClose}
                />
            </Box>
        </Container>
    );
};

export default CurricularProgram;
