/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo } from "react";
import {
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    IconButton,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DownloadIcon from "@mui/icons-material/Download";
import * as XLSX from "xlsx";
import axios from "axios";
import config from "../../../utils/config";
import ProgramTables from "./ProgramTables";
import CloseIcon from "@mui/icons-material/Close";
import CustomSnackbar from "../../../Components/CustomSnackbar";
import { useNavigate, useParams } from "react-router-dom";
import { useLoading } from "../../../Context/LoadingContext";
import ExcelJS from "exceljs";

const CurricularProgram = () => {
    const { institutionId } = useParams();
    const [programs, setPrograms] = useState([]);
    const [openReferenceDialog, setOpenReferenceDialog] = useState(false);
    const [mainTabValue, setMainTabValue] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const { showLoading, hideLoading, updateProgress } = useLoading();
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
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
            showLoading();
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
            hideLoading();
        }
    };

    useEffect(() => {
        fetchPrograms();
    }, []);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            console.log("No file selected for upload");
            return;
        }

        const token = localStorage.getItem("token");

        if (!institutionId || !token) {
            setSnackbar({
                open: true,
                message: !institutionId
                    ? "Please select an institution first."
                    : "Please log in first.",
                severity: "warning",
            });
            return;
        }
        updateProgress(10);
        setIsUploading(true);

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
                        range: 8,
                    });

                    const parsedData = sheetData
                        .map((row) => {
                            const labUnits = row[12] || 0;
                            const lectureUnits = row[13] || 0;

                            return {
                                institution_id: institutionId,
                                program_name: row[1] || null,
                                program_code: String(row[2] || " "),
                                major_name: row[3] || null,
                                major_code: String(row[4] || " "),
                                category: row[5] || null,
                                serial: String(row[6] || " "),
                                year: String(row[7] || ""),
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
                                subtotal_male: row[33] || null,
                                subtotal_female: row[34] || null,
                                grand_total: row[35] || null,
                                lecture_units_actual: row[36] || null,
                                laboratory_units_actual: row[37] || null,
                                total_units_actual:
                                    (row[36] || null) + (row[37] || null),
                                graduates_males: row[39] || null,
                                graduates_females: row[40] || null,
                                graduates_total:
                                    (row[39] || null) + (row[40] || null),
                                externally_funded_merit_scholars: row[42] || null,
                                internally_funded_grantees: row[43] || null,
                                suc_funded_grantees: row[44] || null,
                            };
                        })
                        .filter((data) => !!data.program_name);

                    console.log(
                        `Sheet ${sheetName}: Total rows: ${sheetData.length}, Valid rows: ${parsedData.length}`
                    );
                    allParsedData = [...allParsedData, ...parsedData];
                }

                if (allParsedData.length === 0) {
                    setSnackbar({
                        open: true,
                        message:
                            "No valid programs with a program name found in any sheet of the Excel file.",
                        severity: "warning",
                    });
                    setIsUploading(false);
                    updateProgress();
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
                    console.error("Error importing data:", error.response?.data);
                    setSnackbar({
                        open: true,
                        message:
                            "Error importing data. Check the console for details.",
                        severity: "error",
                    });
                } finally {
                    setIsUploading(false);
                    updateProgress();
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
                updateProgress();
            }
        };

        reader.readAsArrayBuffer(file);
    };

    const handleExportToExcel = async () => {
        console.log("Programs before export:", programs);
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

            const dataStartRow = 9; // Matches import range: 8 (0-based index 8 = row 9 in Excel)

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
                    row.getCell(8).value = program.year || null;
                    row.getCell(9).value =
                        program.is_thesis_dissertation_required || null;
                    row.getCell(10).value = program.program_status || null;
                    row.getCell(11).value = program.calendar_use_code || null;
                    row.getCell(12).value =
                        program.program_normal_length_in_years || 0;
                    row.getCell(13).value = program.lab_units || 0;
                    row.getCell(14).value = program.lecture_units || 0;
                    row.getCell(15).value = program.total_units || 0;
                    row.getCell(16).value = program.tuition_per_unit || 0;
                    row.getCell(17).value = program.program_fee || 0;
                    row.getCell(18).value =
                        program.new_students_freshmen_male || 0;
                    row.getCell(19).value =
                        program.new_students_freshmen_female || 0;
                    row.getCell(20).value = program.first_year_old_male || 0;
                    row.getCell(21).value = program.first_year_old_female || 0;
                    row.getCell(22).value = program.second_year_male || 0;
                    row.getCell(23).value = program.second_year_female || 0;
                    row.getCell(24).value = program.third_year_male || 0;
                    row.getCell(25).value = program.third_year_female || 0;
                    row.getCell(26).value = program.fourth_year_male || 0;
                    row.getCell(27).value = program.fourth_year_female || 0;
                    row.getCell(28).value = program.fifth_year_male || 0;
                    row.getCell(29).value = program.fifth_year_female || 0;
                    row.getCell(30).value = program.sixth_year_male || 0;
                    row.getCell(31).value = program.sixth_year_female || 0;
                    row.getCell(32).value = program.seventh_year_male || 0;
                    row.getCell(33).value = program.seventh_year_female || 0;
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
        }
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === "clickaway") return;
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    const filteredPrograms = useMemo(() => {
        return programs.filter(
            (program) => program.program_type === categories[mainTabValue]
        );
    }, [programs, mainTabValue, categories]);

    const referenceData = {
        authority: [
            { code: "GP", label: "Government Permit" },
            { code: "GR", label: "Government Recognition" },
            { code: "BR", label: "Board Resolution" },
        ],
        thesisDissertation: [
            { code: 1, label: "Required" },
            { code: 2, label: "Optional" },
            { code: 3, label: "Not Required" },
        ],
        programStatus: [
            { code: 1, label: "Active" },
            { code: 2, label: "Phased Out" },
            { code: 3, label: "Abolished" },
        ],
        calendar: [
            { code: 1, label: "Sem" },
            { code: 2, label: "Tri Sem" },
            { code: 3, label: "Quarter Sem" },
            { code: 4, label: "Distance Mode" },
        ],
    };

    return (
        <Box sx={{ p: 3 }}>
            <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 2 }}>
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
                <Typography color="textPrimary">Curricular Program</Typography>
            </Breadcrumbs>

            <Box
                sx={{
                    mb: 2,
                    display: "flex",
                    gap: 2,
                    justifyContent: "flex-end",
                }}
            >
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<DownloadIcon />}
                    onClick={handleExportToExcel}
                    disabled={isUploading}
                >
                    Export to Excel
                </Button>
                <input
                    type="file"
                    accept=".xlsx, .xls"
                    style={{ display: "none" }}
                    id="file-upload"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                />
                <label htmlFor="file-upload">
                    <Button
                        variant="contained"
                        color="secondary"
                        component="span"
                        startIcon={<UploadFileIcon />}
                        disabled={isUploading}
                    >
                        {isUploading ? "Uploading..." : "Import Form B"}
                    </Button>
                </label>
            </Box>

            <ProgramTables programs={filteredPrograms} />
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
                                    referenceData.thesisDissertation.length ? (
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
                                    {index < referenceData.calendar.length ? (
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
    );
};

export default CurricularProgram;
