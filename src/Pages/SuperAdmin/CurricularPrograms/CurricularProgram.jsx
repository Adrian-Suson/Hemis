import { useState, useEffect, useMemo } from "react";
import {
    Typography,
    Button,
    Tabs,
    Tab,
    Box,
    Breadcrumbs,
    Link,
    Paper,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DownloadIcon from "@mui/icons-material/Download";
import * as XLSX from "xlsx";
import axios from "axios";
import config from "../../../utils/config";
import ProgramTables from "./ProgramTables";
import CustomSnackbar from "../../../Components/CustomSnackbar";
import { useProgress } from "../../../Context/ProgressContext";
import ExcelJS from "exceljs";
import { useNavigate, useParams } from "react-router-dom";

const CurricularProgram = () => {
    const { institutionId } = useParams();
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mainTabValue, setMainTabValue] = useState(0);
    const [subTabValue, setSubTabValue] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });
    const navigate = useNavigate();
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

    const subCategories = ["Programs", "Enrollments", "Statistics"];

    useEffect(() => {
        const fetchPrograms = async () => {
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
                    params: { institution_id: institutionId.institutionId }, // No program_type filter
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
        };

        fetchPrograms();
    }, [institutionId]); // Fetch once on mount

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

                        // Enrollment fields from Excel
                        const newStudentsFreshmenMale = row[17] || 0;
                        const newStudentsFreshmenFemale = row[18] || 0;
                        const firstYearOldMale = row[19] || 0;
                        const firstYearOldFemale = row[20] || 0;
                        const secondYearMale = row[21] || 0;
                        const secondYearFemale = row[22] || 0;
                        const thirdYearMale = row[23] || 0;
                        const thirdYearFemale = row[24] || 0;
                        const fourthYearMale = row[25] || 0;
                        const fourthYearFemale = row[26] || 0;
                        const fifthYearMale = row[27] || 0;
                        const fifthYearFemale = row[28] || 0;
                        const sixthYearMale = row[29] || 0;
                        const sixthYearFemale = row[30] || 0;
                        const seventhYearMale = row[31] || 0;
                        const seventhYearFemale = row[32] || 0;

                        // Calculate subtotals and grand total
                        const subtotalMale =
                            newStudentsFreshmenMale +
                            firstYearOldMale +
                            secondYearMale +
                            thirdYearMale +
                            fourthYearMale +
                            fifthYearMale +
                            sixthYearMale +
                            seventhYearMale;
                        const subtotalFemale =
                            newStudentsFreshmenFemale +
                            firstYearOldFemale +
                            secondYearFemale +
                            thirdYearFemale +
                            fourthYearFemale +
                            fifthYearFemale +
                            sixthYearFemale +
                            seventhYearFemale;
                        const grandTotal = subtotalMale + subtotalFemale;

                        // Statistics fields from Excel
                        const lectureUnitsActual = row[36] || 0;
                        const laboratoryUnitsActual = row[37] || 0;
                        const graduatesMales = row[39] || 0;
                        const graduatesFemales = row[40] || 0;

                        // Calculate total_units_actual and graduates_total
                        const totalUnitsActual =
                            lectureUnitsActual + laboratoryUnitsActual;
                        const graduatesTotal =
                            graduatesMales + graduatesFemales;

                        return {
                            program: {
                                institution_id: institutionId.institutionId,
                                program_name: row[1] || null,
                                program_code: String(row[2] || "0"),
                                major_name: row[3] || null,
                                major_code: String(row[4] || "0"),
                                category: row[5] || null,
                                serial: String(row[6] || "0"),
                                year: row[7] || null,
                                is_thesis_dissertation_required: row[8] || null,
                                program_status: row[9] || null,
                                calendar_use_code: row[10] || null,
                                program_normal_length_in_years: row[11] || null,
                                lab_units: labUnits,
                                lecture_units: lectureUnits,
                                total_units: labUnits + lectureUnits,
                                tuition_per_unit: row[15] || 0,
                                program_fee: row[16] || 0,
                                program_type: categories[sheetIndex],
                            },
                            enrollment: {
                                new_students_freshmen_male:
                                    newStudentsFreshmenMale,
                                new_students_freshmen_female:
                                    newStudentsFreshmenFemale,
                                first_year_old_male: firstYearOldMale,
                                first_year_old_female: firstYearOldFemale,
                                second_year_male: secondYearMale,
                                second_year_female: secondYearFemale,
                                third_year_male: thirdYearMale,
                                third_year_female: thirdYearFemale,
                                fourth_year_male: fourthYearMale,
                                fourth_year_female: fourthYearFemale,
                                fifth_year_male: fifthYearMale,
                                fifth_year_female: fifthYearFemale,
                                sixth_year_male: sixthYearMale,
                                sixth_year_female: sixthYearFemale,
                                seventh_year_male: seventhYearMale,
                                seventh_year_female: seventhYearFemale,
                                subtotal_male: subtotalMale,
                                subtotal_female: subtotalFemale,
                                grand_total: grandTotal,
                            },
                            statistics: {
                                lecture_units_actual: lectureUnitsActual,
                                laboratory_units_actual: laboratoryUnitsActual,
                                total_units_actual: totalUnitsActual,
                                graduates_males: graduatesMales,
                                graduates_females: graduatesFemales,
                                graduates_total: graduatesTotal,
                                externally_funded_merit_scholars: row[42] || 0,
                                internally_funded_grantees: row[43] || 0,
                                suc_funded_grantees: row[44] || 0,
                            },
                        };
                    })
                    .filter((data) => data.program.program_name); // Only require program_name

                // Skip to the next sheet if parsedData is empty (no rows with program_name)
                if (parsedData.length === 0) {
                    console.log(
                        `Sheet ${sheetName} has no valid programs (missing program_name), skipping...`
                    );
                    continue; // Move to the next sheet
                }

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
                        data.program,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    const programId = programResponse.data.id;

                    data.enrollment.program_id = programId;
                    data.statistics.program_id = programId;

                    if (
                        Object.values(data.enrollment).some((val) => val !== 0)
                    ) {
                        const enrollmentResponse = await axios.post(
                            `${config.API_URL}/enrollments`,
                            data.enrollment,
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                        programResponse.data.enrollments = [
                            enrollmentResponse.data,
                        ];
                    }

                    if (
                        Object.values(data.statistics).some((val) => val !== 0)
                    ) {
                        const statisticsResponse = await axios.post(
                            `${config.API_URL}/program-statistics`,
                            data.statistics,
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                        programResponse.data.statistics =
                            statisticsResponse.data;
                    }

                    createdPrograms.push(programResponse.data);
                    processedRows += 1;
                    showProgress(
                        50 + Math.round((50 * processedRows) / totalRows)
                    );
                }

                setPrograms(createdPrograms);
                showProgress(100);
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

    const handleExportData = async () => {
        if (!programs.length) {
            setSnackbar({
                open: true,
                message: "No data available to export.",
                severity: "warning",
            });
            return;
        }

        try {
            // Load the Excel template file from your public folder
            const response = await fetch("/templates/Form-B-Themeplate.xlsx");
            if (!response.ok) {
                throw new Error(
                    `Failed to load template file: HTTP ${response.status} - ${response.statusText}`
                );
            }
            const arrayBuffer = await response.arrayBuffer();

            // Load the workbook using ExcelJS
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(arrayBuffer);

            // Define the starting row for data insertion
            const dataStartRow = 12;

            // Log the programs array to verify program_type distribution
            console.log("Programs to export:", programs);
            console.log("Program types present:", [
                ...new Set(programs.map((p) => p.program_type)),
            ]);

            // Group programs by program_type
            const programsByType = categories.reduce((acc, category, index) => {
                acc[index] = programs.filter(
                    (program) => program.program_type === category
                );
                console.log(
                    `Sheet ${index} (${category}): ${acc[index].length} programs`
                );
                return acc;
            }, {});

            // Iterate over sheets 0 to 6
            for (let sheetIndex = 0; sheetIndex <= 6; sheetIndex++) {
                if (!workbook.worksheets[sheetIndex]) {
                    console.log(
                        `Sheet ${sheetIndex} does not exist in the template, skipping...`
                    );
                    continue;
                }
                const worksheet = workbook.worksheets[sheetIndex];
                const programsForSheet = programsByType[sheetIndex] || [];

                console.log(
                    `Processing sheet ${sheetIndex} (${categories[sheetIndex]}): ${programsForSheet.length} programs`
                );

                // Insert data row-by-row for this sheet
                programsForSheet.forEach((program, i) => {
                    const row = worksheet.getRow(dataStartRow + i);
                    row.getCell(2).value = program.program_name || "N/A";
                    row.getCell(3).value = program.program_code || "0";
                    row.getCell(4).value = program.major_name || "N/A";
                    row.getCell(5).value = program.major_code || "0";
                    row.getCell(6).value = program.category || "N/A";
                    row.getCell(7).value = program.serial || "N/A";
                    row.getCell(8).value = program.year || "N/A";
                    row.getCell(9).value =
                        program.is_thesis_dissertation_required || "N/A";
                    row.getCell(10).value = program.program_status || "N/A";
                    row.getCell(11).value = program.calendar_use_code || "-";
                    row.getCell(12).value =
                        program.program_normal_length_in_years || 0;
                    row.getCell(13).value = program.lab_units || 0;
                    row.getCell(14).value = program.lecture_units || 0;
                    row.getCell(15).value = program.total_units || 0;
                    row.getCell(16).value = program.tuition_per_unit || 0;
                    row.getCell(17).value = program.program_fee || 0;

                    // For enrollment data
                    const enrollment = program.enrollments?.[0] || {};
                    row.getCell(18).value =
                        enrollment.new_students_freshmen_male || 0;
                    row.getCell(19).value =
                        enrollment.new_students_freshmen_female || 0;
                    row.getCell(20).value = enrollment.first_year_old_male || 0;
                    row.getCell(21).value =
                        enrollment.first_year_old_female || 0;
                    row.getCell(22).value = enrollment.second_year_male || 0;
                    row.getCell(23).value = enrollment.second_year_female || 0;
                    row.getCell(24).value = enrollment.third_year_male || 0;
                    row.getCell(25).value = enrollment.third_year_female || 0;
                    row.getCell(26).value = enrollment.fourth_year_male || 0;
                    row.getCell(27).value = enrollment.fourth_year_female || 0;
                    row.getCell(28).value = enrollment.fifth_year_male || 0;
                    row.getCell(29).value = enrollment.fifth_year_female || 0;
                    row.getCell(30).value = enrollment.sixth_year_male || 0;
                    row.getCell(31).value = enrollment.sixth_year_female || 0;
                    row.getCell(32).value = enrollment.seventh_year_male || 0;
                    row.getCell(33).value = enrollment.seventh_year_female || 0;
                    row.getCell(34).value = enrollment.subtotal_male || 0;
                    row.getCell(35).value = enrollment.subtotal_female || 0;
                    row.getCell(36).value = enrollment.grand_total || 0;

                    // For statistics data
                    const stats = program.statistics || {};
                    row.getCell(37).value = stats.lecture_units_actual || 0;
                    row.getCell(38).value = stats.laboratory_units_actual || 0;
                    row.getCell(39).value = stats.total_units_actual || 0;
                    row.getCell(40).value = stats.graduates_males || 0;
                    row.getCell(41).value = stats.graduates_females || 0;
                    row.getCell(42).value = stats.graduates_total || 0;
                    row.getCell(43).value =
                        stats.externally_funded_merit_scholars || 0;
                    row.getCell(44).value =
                        stats.internally_funded_grantees || 0;
                    row.getCell(45).value = stats.suc_funded_grantees || 0;

                    row.commit();
                });
            }

            // Generate a filename for the new file
            const fileName = `Form_B_All_Categories_${
                new Date().toISOString().split("T")[0]
            }.xlsx`;

            // Write the workbook to a buffer and trigger the download
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
                message:
                    "Data exported successfully across all sheets using ExcelJS!",
                severity: "success",
            });
        } catch (error) {
            console.error("Error exporting data:", error);
            setSnackbar({
                open: true,
                message: `Error exporting data: ${error.message}. Check the console for details.`,
                severity: "error",
            });
        }
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === "clickaway") return;
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    // Filter programs based on the selected category (mainTabValue)
    const filteredPrograms = useMemo(() => {
        return programs.filter(
            (program) => program.program_type === categories[mainTabValue]
        );
    }, [programs, mainTabValue, categories]);

    return (
        <Box sx={{ p: 3 }}>
            {/* Breadcrumbs Navigation */}
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

            <Tabs
                value={mainTabValue}
                onChange={(event, newValue) => setMainTabValue(newValue)}
                sx={{ mb: 2 }}
                variant="scrollable"
                scrollButtons="auto"
            >
                {categories.map((category) => (
                    <Tab key={category} label={category} />
                ))}
            </Tabs>

            <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
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

                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<DownloadIcon />}
                    onClick={handleExportData}
                    disabled={loading || !programs.length}
                >
                    Export Data
                </Button>
            </Box>

            <Paper sx={{ borderRadius: 1, mb: 2 }}>
                <Tabs
                    value={subTabValue}
                    onChange={(event, newValue) => setSubTabValue(newValue)}
                    variant="fullWidth"
                    sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                        "& .MuiTab-root": {
                            fontSize: "0.875rem",
                            fontWeight: "medium",
                        },
                    }}
                >
                    {subCategories.map((subCategory) => (
                        <Tab key={subCategory} label={subCategory} />
                    ))}
                </Tabs>
            </Paper>

            <ProgramTables
                programs={filteredPrograms} // Pass filtered programs instead of full programs
                loading={loading}
                subTabValue={subTabValue}
            />

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
