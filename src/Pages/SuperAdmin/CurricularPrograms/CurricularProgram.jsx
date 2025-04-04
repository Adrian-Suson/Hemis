import { useState, useEffect, useMemo, useCallback } from "react";
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
import InfoIcon from '@mui/icons-material/Info';
import UploadFileIcon from "@mui/icons-material/UploadFile";
import * as XLSX from "xlsx";
import axios from "axios";
import config from "../../../utils/config";
import ProgramTables from "./ProgramTables";
import CloseIcon from '@mui/icons-material/Close';
import CustomSnackbar from "../../../Components/CustomSnackbar";
import { useProgress } from "../../../Context/ProgressContext";
import { useNavigate, useParams } from "react-router-dom";

const CurricularProgram = () => {
    const { institutionId } = useParams();
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openReferenceDialog, setOpenReferenceDialog] = useState(false);
    const [mainTabValue, setMainTabValue] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });
    const navigate = useNavigate();
    const theme = useTheme();
    const { showProgress, hideProgress } = useProgress();

    const categories = useMemo(
        () => [
            "DOCTORATE",
            "MASTERS",
            "POST-BACCALAUREATE",
            "BACCALAUREATE",
            "PRE-BACCALAUREATE",
            "VOC/TECH",
            "BASIC EDUCATION",
        ],
        []
    );
    const fetchPrograms = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");

            if (!institutionId) {
                console.error("No institution ID found in localStorage");
                setPrograms([]);
                setLoading(false);
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
            console.error("Error fetching programs:", error);
            setPrograms([]);
        } finally {
            setLoading(false);
        }
    }, [institutionId]);

    useEffect(() => {
        fetchPrograms();
    }, [fetchPrograms]);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

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

        setIsUploading(true);
        showProgress(0);

        const reader = new FileReader();
        reader.onload = async (e) => {
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

                showProgress(10 + sheetIndex * 10);
                const sheetData = XLSX.utils.sheet_to_json(sheet, {
                    header: 1,
                    range: 11,
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
                            lecture_units: lectureUnits,
                            total_units: labUnits + lectureUnits,
                            tuition_per_unit: row[15] || null,
                            program_fee: row[16] || null,
                            program_type: categories[sheetIndex],
                            data_date: currentDate,
                            new_students_freshmen_male: row[17] || null,
                            new_students_freshmen_female: row[18] || null,
                            first_year_old_male: row[19] || null,
                            first_year_old_female: row[20] || null,
                            second_year_male: row[21] || null,
                            second_year_female: row[22] || null,
                            third_year_male: row[23] || null,
                            third_year_female: row[24] || null,
                            fourth_year_male: row[25] || null,
                            fourth_year_female: row[26] || null,
                            fifth_year_male: row[27] || null,
                            fifth_year_female: row[28] || null,
                            sixth_year_male: row[29] || null,
                            sixth_year_female: row[30] || null,
                            seventh_year_male: row[31] || null,
                            seventh_year_female: row[32] || null,
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
                    .filter((data) => data.program_name);

                allParsedData = [...allParsedData, ...parsedData];
            }

            showProgress(50);

            if (allParsedData.length === 0) {
                setSnackbar({
                    open: true,
                    message:
                        "No valid programs with a program name found in any sheet of the Excel file.",
                    severity: "warning",
                });
                setIsUploading(false);
                hideProgress();
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
                    showProgress(
                        50 + Math.round((50 * processedRows) / totalRows)
                    );
                }

                setPrograms(createdPrograms);
                showProgress(100);
                fetchPrograms();
                setSnackbar({
                    open: true,
                    message: "Data imported successfully!",
                    severity: "success",
                });
            } catch (error) {
                console.error(
                    "Error importing data:",
                    error.response?.data || error.message
                );
                setSnackbar({
                    open: true,
                    message:
                        "Error importing data. Check the console for details.",
                    severity: "error",
                });
            } finally {
                setIsUploading(false);
                hideProgress();
            }
        };

        reader.readAsArrayBuffer(file);
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

    // Reference data for the dialog
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

            <ProgramTables programs={filteredPrograms} loading={loading} />
            <Tabs
                value={mainTabValue}
                onChange={(event, newValue) => setMainTabValue(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                    "& .MuiTab-root": {
                        textTransform: "none",
                        fontWeight: 500,
                        fontSize: "0.85rem", // Reduced font size
                        padding: "8px 12px", // Reduced padding
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

            {/* Reference Dialog */}
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
