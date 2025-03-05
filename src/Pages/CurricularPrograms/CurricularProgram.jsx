import { useState, useEffect, useMemo } from "react";
import {
    Container,
    Typography,
    Button,
    Tabs,
    Tab,
    LinearProgress,
    Box,
    Snackbar,
    Alert,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import * as XLSX from "xlsx";
import axios from "axios";
import config from "../../utils/config";
import ProgramTables from "./ProgramTables";

const CurricularProgram = () => {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mainTabValue, setMainTabValue] = useState(0);
    const [subTabValue, setSubTabValue] = useState(0);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success", // 'success', 'error', 'warning', 'info'
    });

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
        if (!institutionId) {
            console.error("No institution ID found in localStorage");
            setSnackbar({
                open: true,
                message: "Please select an institution first.",
                severity: "warning",
            });
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found in localStorage");
            setSnackbar({
                open: true,
                message: "Please log in first.",
                severity: "warning",
            });
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        const reader = new FileReader();
        reader.onload = async (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[mainTabValue];
            console.log("Selected Sheet:", sheetName);
            const sheet = workbook.Sheets[sheetName];

            setUploadProgress(10);

            const allData = XLSX.utils.sheet_to_json(sheet, {
                header: 1,
                range: 11,
            });

            setUploadProgress(20);

            const parsedData = allData
                .map((row) => {
                    const programCode =
                        row[2] !== undefined && row[2] !== 0
                            ? row[2]
                            : 0;
                    const majorCode =
                        row[4] !== undefined && row[4] !== 0
                            ? row[4]
                            : 0;

                    console.log("Raw Row Data:", row);

                    return {
                        program: {
                            institution_id: institutionId,
                            program_name: row[1] || null,
                            program_code: programCode,
                            major_name: row[3] || null,
                            major_code: majorCode,
                            category: row[5] || null,
                            serial: row[6] || null,
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
                            program_type: categories[mainTabValue],
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
                    };
                })
                .filter((data) => {
                    if (!data.program.program_name) {
                        console.log(
                            "Skipping row due to missing program_name:",
                            data.program
                        );
                        return false;
                    }

                    const hasValidCode =
                        (data.program.program_code &&
                            data.program.program_code !== 0) ||
                        (data.program.major_code &&
                            data.program.major_code !== 0);

                    if (!hasValidCode) {
                        console.log(
                            "Skipping row due to invalid program_code or major_code:",
                            data.program
                        );
                        return false;
                    }

                    return true;
                });

            setUploadProgress(30);
            console.log("Parsed Data (after filtering):", parsedData);

            if (parsedData.length === 0) {
                setSnackbar({
                    open: true,
                    message:
                        "No valid data found in the Excel sheet to import.",
                    severity: "warning",
                });
                setIsUploading(false);
                return;
            }

            try {
                const createdPrograms = [];
                const totalRows = parsedData.length;
                let processedRows = 0;

                for (const data of parsedData) {
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

                    const progress =
                        30 + Math.round((60 * processedRows) / totalRows);
                    setUploadProgress(progress);
                }

                setPrograms(createdPrograms);
                setUploadProgress(100);
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
                        "Error importing data. Please check the console for details.",
                    severity: "error",
                });
            } finally {
                setIsUploading(false);
            }
        };

        reader.readAsArrayBuffer(file);
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom>
                Curricular Programs
            </Typography>

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
                    sx={{ mb: 2 }}
                    disabled={isUploading}
                >
                    {isUploading ? "Uploading..." : "Import Excel"}
                </Button>
            </label>

            {isUploading && (
                <Box sx={{ width: "100%", mb: 2 }}>
                    <LinearProgress
                        variant="determinate"
                        value={uploadProgress}
                    />
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        align="center"
                    >
                        {uploadProgress}% Complete
                    </Typography>
                </Box>
            )}

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

            {/* Custom Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000} // Auto-close after 6 seconds
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }} // Position at bottom center
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbar.severity}
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default CurricularProgram;
