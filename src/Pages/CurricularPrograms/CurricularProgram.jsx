import { useState, useEffect, useMemo } from "react";
import {
    Typography,
    Button,
    Tabs,
    Tab,
    Box,
    Breadcrumbs,
    Link,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DownloadIcon from "@mui/icons-material/Download";
import * as XLSX from "xlsx";
import XlsxPopulate from "xlsx-populate";
import axios from "axios";
import config from "../../utils/config";
import ProgramTables from "./ProgramTables";
import CustomSnackbar from "../../Components/CustomSnackbar";
import { useProgress } from "../../Context/ProgressContext";
import { useNavigate } from "react-router-dom";

const CurricularProgram = () => {
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
                const institutionId = localStorage.getItem("institutionId");

                if (!institutionId) {
                    console.error("No institution ID found in localStorage");
                    setPrograms([]);
                    setLoading(false);
                    return;
                }

                const response = await axios.get(`${config.API_URL}/programs`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: {
                        institution_id: institutionId,
                        program_type: categories[mainTabValue],
                    },
                });
                console.log("API Response:", response.data);

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
    }, [mainTabValue, categories]);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const institutionId = localStorage.getItem("institutionId");
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
                    .map((row) => ({
                        program: {
                            institution_id: institutionId,
                            program_name: row[1] || null,
                            program_code: String(row[2] || "0"),
                            major_name: row[3] || null,
                            major_code: String(row[4] || "0"),
                            category: row[5] || null,
                            serial: String(row[6]) || "0",
                            year: row[7] || null,
                            is_thesis_dissertation_required: row[8] || null,
                            program_status: row[9] || null,
                            calendar_use_code: row[10] || null,
                            program_normal_length_in_years: row[11] || null,
                            lab_units: row[12] || 0,
                            lecture_units: row[13] || 0,
                            total_units: row[14] || 0,
                            tuition_per_unit: row[15] || 0,
                            program_fee: row[16] || 0,
                            program_type: categories[sheetIndex],
                        },
                        enrollment: {
                            new_students_freshmen_male: row[17] || 0,
                            new_students_freshmen_female: row[18] || 0,
                            first_year_old_male: row[19] || 0,
                            first_year_old_female: row[20] || 0,
                            second_year_male: row[21] || 0,
                            second_year_female: row[22] || 0,
                            third_year_male: row[23] || 0,
                            third_year_female: row[24] || 0,
                            fourth_year_male: row[25] || 0,
                            fourth_year_female: row[26] || 0,
                            fifth_year_male: row[27] || 0,
                            fifth_year_female: row[28] || 0,
                            sixth_year_male: row[29] || 0,
                            sixth_year_female: row[30] || 0,
                            seventh_year_male: row[31] || 0,
                            seventh_year_female: row[32] || 0,
                            subtotal_male: row[33] || 0,
                            subtotal_female: row[34] || 0,
                            grand_total: row[35] || 0,
                        },
                        statistics: {
                            lecture_units_actual: row[36] || 0,
                            laboratory_units_actual: row[37] || 0,
                            total_units_actual: row[38] || 0,
                            graduates_males: row[39] || 0,
                            graduates_females: row[40] || 0,
                            graduates_total: row[41] || 0,
                            externally_funded_merit_scholars: row[42] || 0,
                            internally_funded_grantees: row[43] || 0,
                            suc_funded_grantees: row[44] || 0,
                        },
                    }))
                    .filter(
                        (data) =>
                            data.program.program_name &&
                            (data.program.program_code !== "0" ||
                                data.program.major_code !== "0")
                    );

                allParsedData = [...allParsedData, ...parsedData];
            }

            showProgress(50);

            if (allParsedData.length === 0) {
                setSnackbar({
                    open: true,
                    message:
                        "No valid data found in the Excel sheet to import.",
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
        // Load the template file from the public folder (omit "/public")
        const response = await fetch("/templates/Form-B-Themeplate.xlsx");
        if (!response.ok) {
            throw new Error(
                `Failed to load template file: HTTP ${response.status} - ${response.statusText}`
            );
        }
        const arrayBuffer = await response.arrayBuffer();

        // Load the workbook using xlsx-populate
        const workbook = await XlsxPopulate.fromDataAsync(arrayBuffer);

        // Select the worksheet based on mainTabValue (or fallback to the first sheet)
        let sheet;
        if (workbook.sheets().length > mainTabValue) {
            sheet = workbook.sheets()[mainTabValue];
        } else {
            sheet = workbook.sheets()[0];
        }

        // Define the starting row for data insertion (1-indexed).
        // For example, if rows 1-12 are reserved for title and header, start at row 13.
        const dataStartRow = 13;

        // Loop through programs and insert data row-by-row.
        programs.forEach((program, i) => {
            // Calculate the row number for each record
            const rowIndex = dataStartRow + i;

            // Insert your data into the proper columns. For example:
            // Adjust the cell addresses as per your template's column mapping.
            sheet.cell(`A${rowIndex}`).value(program.id || "0");
            sheet.cell(`B${rowIndex}`).value(program.program_name || "N/A");
            sheet.cell(`C${rowIndex}`).value(program.program_code || "0");
            sheet.cell(`D${rowIndex}`).value(program.major_name || "N/A");
            sheet.cell(`E${rowIndex}`).value(program.major_code || "0");
            sheet.cell(`F${rowIndex}`).value(program.category || "N/A");
            sheet.cell(`G${rowIndex}`).value(program.serial || "N/A");
            sheet.cell(`H${rowIndex}`).value(program.year || "N/A");
            sheet.cell(`I${rowIndex}`).value("BR No."); // Placeholder
            sheet.cell(`J${rowIndex}`).value(program.is_thesis_dissertation_required || "N/A");
            sheet.cell(`K${rowIndex}`).value(program.program_status || "N/A");
            sheet.cell(`L${rowIndex}`).value(program.calendar_use_code || "2");
            sheet.cell(`M${rowIndex}`).value(program.program_normal_length_in_years || 0);
            sheet.cell(`N${rowIndex}`).value(program.total_units || 0);
            sheet.cell(`O${rowIndex}`).value(program.lab_units || 0);
            sheet.cell(`P${rowIndex}`).value(program.lecture_units || 0);
            sheet.cell(`Q${rowIndex}`).value(program.total_units || 0);
            sheet.cell(`R${rowIndex}`).value(program.tuition_per_unit || 0);
            sheet.cell(`S${rowIndex}`).value(program.program_fee || 0);

            // For enrollment data
            const enrollment = program.enrollments?.[0] || {};
            sheet.cell(`T${rowIndex}`).value((enrollment.new_students_freshmen_male || 0) + (enrollment.new_students_freshmen_female || 0));
            sheet.cell(`U${rowIndex}`).value(enrollment.first_year_old_male || 0);
            sheet.cell(`V${rowIndex}`).value(enrollment.first_year_old_female || 0);
            sheet.cell(`W${rowIndex}`).value(enrollment.second_year_male || 0);
            sheet.cell(`X${rowIndex}`).value(enrollment.second_year_female || 0);
            sheet.cell(`Y${rowIndex}`).value(enrollment.third_year_male || 0);
            sheet.cell(`Z${rowIndex}`).value(enrollment.third_year_female || 0);
            sheet.cell(`AA${rowIndex}`).value(enrollment.fourth_year_male || 0);
            sheet.cell(`AB${rowIndex}`).value(enrollment.fourth_year_female || 0);
            sheet.cell(`AC${rowIndex}`).value(enrollment.fifth_year_male || 0);
            sheet.cell(`AD${rowIndex}`).value(enrollment.fifth_year_female || 0);
            sheet.cell(`AE${rowIndex}`).value(enrollment.sixth_year_male || 0);
            sheet.cell(`AF${rowIndex}`).value(enrollment.sixth_year_female || 0);
            sheet.cell(`AG${rowIndex}`).value(enrollment.seventh_year_male || 0);
            sheet.cell(`AH${rowIndex}`).value(enrollment.seventh_year_female || 0);
            sheet.cell(`AI${rowIndex}`).value((enrollment.subtotal_male || 0) + (enrollment.subtotal_female || 0));
            sheet.cell(`AJ${rowIndex}`).value(enrollment.grand_total || 0);

            // For statistics data
            const stats = program.statistics || {};
            sheet.cell(`AK${rowIndex}`).value(stats.total_units_actual || 0);
            sheet.cell(`AL${rowIndex}`).value((stats.graduates_males || 0) + (stats.graduates_females || 0));
            sheet.cell(`AM${rowIndex}`).value(stats.externally_funded_merit_scholars || 0);
            sheet.cell(`AN${rowIndex}`).value(stats.internally_funded_grantees || 0);
            sheet.cell(`AO${rowIndex}`).value(stats.suc_funded_grantees || 0);
        });

        // (Optional) You can also adjust column widths if needed:
        workbook.sheets().forEach((s) => {
            s.usedRange().style("wrapText", true);
            // If you want to set column widths manually, you can do so with:
            // s.column("A").width(20);
        });

        // Generate a filename and output the workbook as a Blob
        const fileName = `Form_B_${categories[mainTabValue]}_${new Date()
            .toISOString()
            .split("T")[0]}.xlsx`;
        const blob = await workbook.outputAsync({ type: "blob" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);

        setSnackbar({
            open: true,
            message: "Data exported successfully using template!",
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

    return (
        <Box sx={{ p: 3 }}>
            {/* Breadcrumbs Navigation */}
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
                <Link
                    underline="hover"
                    color="inherit"
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate("/admin/dashboard")}
                >
                    Dashboard
                </Link>
                <Link
                    underline="hover"
                    color="inherit"
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate("/admin/institutions")}
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

            <Tabs
                value={subTabValue}
                onChange={(event, newValue) => setSubTabValue(newValue)}
                sx={{ mb: 2 }}
            >
                {subCategories.map((subCategory) => (
                    <Tab key={subCategory} label={subCategory} />
                ))}
            </Tabs>

            <ProgramTables
                programs={programs}
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
