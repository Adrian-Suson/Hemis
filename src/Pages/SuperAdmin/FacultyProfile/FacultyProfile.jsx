import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import {
    Box,
    Typography,
    LinearProgress,
    Tabs,
    Tab,
    Breadcrumbs,
    Link,
    Button,
    CircularProgress,
    Alert,
    ButtonGroup,
} from "@mui/material";
import FacultyProfileTable from "./FacultyProfileTable";
import { useNavigate, useParams } from "react-router-dom";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import ExcelJS from "exceljs";
import DownloadIcon from '@mui/icons-material/Download';

const facultyGroups = [
    {
        label: "Group A1",
        value: "A1",
        sheetName: "GROUP A1",
        description:
            "FULL-TIME FACULTY MEMBERS WITH THEIR OWN FACULTY PLANTILLA ITEMS TEACHING AT ELEM, SECONDARY AND TECH/VOC",
    },
    {
        label: "Group A2",
        value: "A2",
        sheetName: "GROUP A2",
        description:
            "HALF-TIME FACULTY MEMBERS WITH THEIR OWN FACULTY PLANTILLA ITEMS",
    },
    {
        label: "Group A3",
        value: "A3",
        sheetName: "GROUP A3",
        description:
            "PERSONS OCCUPYING RESEARCH PLANTILLA ITEMS BUT CLASSIFIED AS REGULAR FACULTY",
    },
    {
        label: "Group B",
        value: "B",
        sheetName: "GROUP B",
        description:
            "FULL-TIME FACULTY MEMBERS WITHOUT ITEMS BUT DRAWING SALARIES FROM THE PS ITEMS OF FACULTY ON LEAVE WITHOUT PAY",
    },
    {
        label: "Group C1",
        value: "C1",
        sheetName: "GROUP C1",
        description:
            "FULL-TIME FACULTY MEMBERS WITHOUT ITEMS DRAWING SALARIES FROM GAA PS LUMP SUMS",
    },
    {
        label: "Group C2",
        value: "C2",
        sheetName: "GROUP C2",
        description:
            "FULL-TIME FACULTY MEMBERS WITHOUT ITEMS PAID DRAWING SALARIES FROM SUC INCOME",
    },
    {
        label: "Group C3",
        value: "C3",
        sheetName: "GROUP C3",
        description:
            "FULL-TIME FACULTY MEMBERS WITH NO PS ITEMS DRAWING SALARIES FROM LGU FUNDS",
    },
    {
        label: "Group D",
        value: "D",
        sheetName: "GROUP D",
        description:
            "TEACHING FELLOWS AND TEACHING ASSOCIATES (but not Graduate Assistants)",
    },
    {
        label: "Group E",
        value: "E",
        sheetName: "GROUP E",
        description:
            "LECTURERS AND ALL OTHER PART-TIME FACULTY WITH NO ITEMS (e.g. PROFS EMERITI, ADJUNCT/AFFILIATE FACULTY, VISITING PROFS, etc.)",
    },
];

const FacultyProfileUpload = () => {
    const [selectedGroup, setSelectedGroup] = useState(facultyGroups[0].value);
    const [facultyProfiles, setFacultyProfiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const institutionId = useParams();
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "info",
    });
    const navigate = useNavigate();

    // Fetch all faculty profiles on component mount
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setError("Authentication token is missing.");
            return;
        }

        const fetchFacultyProfiles = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(
                    `http://localhost:8000/api/faculty-profiles?institution_id=${institutionId.institutionId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                console.log("API Response:", response.data); // Debug log
                setFacultyProfiles(response.data);
            } catch (error) {
                console.error("Error fetching faculty profiles:", error);
                setError("Failed to load faculty profiles. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchFacultyProfiles();
    }, [institutionId]);

    const handleTabChange = (_, newValue) => {
        setSelectedGroup(newValue);
    };

    const processExcelFile = async (file) => {
        if (!file) return;

        setIsUploading(true);
        setUploadProgress(5);

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Authentication token is missing.");
            setIsUploading(false);
            return;
        }

        try {
            const reader = new FileReader();
            reader.readAsBinaryString(file);

            reader.onload = async (event) => {
                const data = event.target.result;
                const workbook = XLSX.read(data, { type: "binary" });

                let allFacultyProfiles = [];
                const seenProfiles = new Set(); // To track unique profiles

                for (let sheetIndex = 0; sheetIndex < 9; sheetIndex++) {
                    const sheetName = workbook.SheetNames[sheetIndex];
                    const sheet = workbook.Sheets[sheetName];

                    setUploadProgress(10 + sheetIndex * 10);

                    const jsonData = XLSX.utils.sheet_to_json(sheet, {
                        header: 1,
                        range: 9,
                    });

                    const validRows = jsonData.filter(
                        (row) =>
                            row.some(
                                (cell) => cell !== undefined && cell !== null
                            ) && row[1]
                    );

                    if (validRows.length === 0) {
                        console.log(`Skipping empty sheet: ${sheetName}`);
                        continue;
                    }

                    const processedFacultyProfiles = validRows.map((row) => ({
                        institution_id: institutionId.institutionId,
                        faculty_group: sheetName,
                        name: row[1] ? String(row[1]) : null,
                        generic_faculty_rank: row[2] ? parseInt(row[2], 10) : null,
                        home_college: row[3] ? String(row[3]) : null,
                        home_department: row[4] ? String(row[4]) : null,
                        is_tenured: row[5] ? Boolean(parseInt(row[5])) : false,
                        ssl_salary_grade: row[6] ? parseInt(row[6], 10) : null,
                        annual_basic_salary: row[7] ? parseInt(row[7], 10) : null,
                        on_leave_without_pay: row[8] ? parseInt(row[8], 10) : null,
                        full_time_equivalent: row[9] ? parseFloat(row[9]) : null,
                        gender: row[10] ? parseInt(row[10], 10) : null,
                        highest_degree_attained: row[11] ? parseInt(row[11], 10) : null,
                        pursuing_next_degree: row[12] ? parseInt(row[12], 10) : null,
                        discipline_teaching_load_1: row[13] ? String(row[13]) : null,
                        discipline_teaching_load_2: row[14] ? String(row[14]) : null,
                        discipline_bachelors: row[15] ? String(row[15]) : null,
                        discipline_masters: row[16] ? String(row[16]) : null,
                        discipline_doctorate: row[17] ? String(row[17]) : null,
                        masters_with_thesis: row[18] ? parseInt(row[18], 10) : null,
                        doctorate_with_dissertation: row[19] ? parseInt(row[19], 10) : null,
                        undergrad_lab_credit_units: row[20] ? parseFloat(row[20]) : null,
                        undergrad_lecture_credit_units: row[21] ? parseFloat(row[21]) : null,
                        undergrad_total_credit_units: row[22] ? parseFloat(row[22]) : null,
                        undergrad_lab_hours_per_week: row[23] ? parseFloat(row[23]) : null,
                        undergrad_lecture_hours_per_week: row[24] ? parseFloat(row[24]) : null,
                        undergrad_total_hours_per_week: row[25] ? parseFloat(row[25]) : null,
                        undergrad_lab_contact_hours: row[26] ? parseFloat(row[26]) : null,
                        undergrad_lecture_contact_hours: row[27] ? parseFloat(row[27]) : null,
                        undergrad_total_contact_hours: row[28] ? parseFloat(row[28]) : null,
                        graduate_lab_credit_units: row[29] ? parseFloat(row[29]) : null,
                        graduate_lecture_credit_units: row[30] ? parseFloat(row[30]) : null,
                        graduate_total_credit_units: row[31] ? parseFloat(row[31]) : null,
                        graduate_lab_contact_hours: row[32] ? parseFloat(row[32]) : null,
                        graduate_lecture_contact_hours: row[33] ? parseFloat(row[33]) : null,
                        graduate_total_contact_hours: row[34] ? parseFloat(row[34]) : null,
                        research_load: row[35] ? parseFloat(row[35]) : null,
                        extension_services_load: row[36] ? parseFloat(row[36]) : null,
                        study_load: row[37] ? parseFloat(row[37]) : null,
                        production_load: row[38] ? parseFloat(row[38]) : null,
                        administrative_load: row[39] ? parseFloat(row[39]) : null,
                        other_load_credits: row[40] ? parseFloat(row[40]) : null,
                        total_work_load: row[41] ? parseFloat(row[41]) : null,
                    }));

                    // Filter out duplicates
                    processedFacultyProfiles.forEach((profile) => {
                        const profileString = JSON.stringify(profile);
                        if (!seenProfiles.has(profileString)) {
                            seenProfiles.add(profileString);
                            allFacultyProfiles.push(profile);
                        }
                    });
                }

                console.log("Final Processed Faculty Data:", allFacultyProfiles);
                setUploadProgress(80);

                if (allFacultyProfiles.length > 0) {
                    await axios.post(
                        "http://localhost:8000/api/faculty-profiles",
                        allFacultyProfiles,
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );

                    console.log("Faculty profiles uploaded successfully!");
                    setFacultyProfiles((prevProfiles) => [
                        ...prevProfiles,
                        ...allFacultyProfiles,
                    ]);
                } else {
                    alert("No valid faculty data found in the uploaded file.");
                }

                setUploadProgress(100);
                setTimeout(() => setUploadProgress(0), 2000);
            };
        } catch (error) {
            console.error("Error processing the file:", error);
            setUploadProgress(0);
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            processExcelFile(file);
        }
    };

    // Filter faculty profiles based on selected group
    const filteredFacultyProfiles = facultyProfiles.filter(
        (profile) =>
            profile.faculty_group ===
            facultyGroups.find((group) => group.value === selectedGroup)
                .sheetName
    );

    console.log("Filtered Faculty Profiles:", filteredFacultyProfiles); // Debug log

    const handleExportData = async () => {
        if (!facultyProfiles.length) {
            setSnackbar({
                open: true,
                message: "No data available to export.",
                severity: "warning",
            });
            return;
        }

        // Debug: Log the facultyProfiles to check if 'name' exists
        console.log("Faculty Profiles before export:", facultyProfiles);
        console.log(
            "Sample profile names:",
            facultyProfiles.map((profile) => profile.name)
        );

        try {
            // Load the Excel template file from your public folder
            const response = await fetch("/templates/Form-E2-Themeplate.xlsx");
            if (!response.ok) {
                throw new Error(
                    `Failed to load template file: HTTP ${response.status} - ${response.statusText}`
                );
            }
            const arrayBuffer = await response.arrayBuffer();

            // Load the workbook using ExcelJS
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(arrayBuffer);

            // Define the starting row for data insertion (adjust based on template)
            const dataStartRow = 10; // Assuming data starts at row 10 (adjust if different)

            // Group faculty profiles by faculty_group
            const profilesByGroup = facultyGroups.reduce((acc, group) => {
                acc[group.sheetName] = facultyProfiles.filter(
                    (profile) => profile.faculty_group === group.sheetName
                );
                console.log(
                    `Sheet ${group.sheetName}: ${
                        acc[group.sheetName].length
                    } profiles`
                );
                return acc;
            }, {});

            // Iterate over sheets in the workbook (up to 9 sheets based on facultyGroups)
            for (
                let sheetIndex = 0;
                sheetIndex < Math.min(9, workbook.worksheets.length);
                sheetIndex++
            ) {
                const sheetName =
                    facultyGroups[sheetIndex]?.sheetName ||
                    `Sheet${sheetIndex + 1}`;
                const worksheet = workbook.getWorksheet(sheetIndex + 1); // ExcelJS uses 1-based indexing
                if (!worksheet) {
                    console.log(
                        `Worksheet ${sheetName} not found, skipping...`
                    );
                    continue;
                }

                const profilesForSheet = profilesByGroup[sheetName] || [];
                console.log(
                    `Processing sheet ${sheetName}: ${profilesForSheet.length} profiles`
                );

                // Debug: Log the names for this sheet
                console.log(
                    `Names in sheet ${sheetName}:`,
                    profilesForSheet.map((profile) => profile.name)
                );

                // Insert data row-by-row for this sheet
                profilesForSheet.forEach((profile, i) => {
                    const row = worksheet.getRow(dataStartRow + i);
                    row.getCell(2).value = profile.name || null; // Column B
                    row.getCell(3).value = profile.generic_faculty_rank || 0; // Column C
                    row.getCell(4).value = profile.home_college || null; // Column D
                    row.getCell(5).value = profile.home_department || null; // Column E
                    row.getCell(6).value = profile.is_tenured; // Column F
                    row.getCell(7).value = profile.ssl_salary_grade || 0; // Column G
                    row.getCell(8).value = profile.annual_basic_salary || 0; // Column H
                    row.getCell(9).value = profile.on_leave_without_pay || 0; // Column I
                    row.getCell(10).value = profile.full_time_equivalent || 0; // Column J
                    row.getCell(11).value = profile.gender || null; // Column K
                    row.getCell(12).value =
                        profile.highest_degree_attained || 0; // Column L
                    row.getCell(13).value = profile.pursuing_next_degree; // Column M
                    row.getCell(14).value =
                        profile.discipline_teaching_load_1 || null; // Column N
                    row.getCell(15).value =
                        profile.discipline_teaching_load_2 || null; // Column O
                    row.getCell(16).value =
                        profile.discipline_bachelors || null; // Column P
                    row.getCell(17).value = profile.discipline_masters || null; // Column Q
                    row.getCell(18).value =
                        profile.discipline_doctorate || null; // Column R
                    row.getCell(19).value = profile.masters_with_thesis || null; // Column S
                    row.getCell(20).value =
                        profile.doctorate_with_dissertation || null; // Column T
                    row.getCell(21).value =
                        profile.undergrad_lab_credit_units || 0; // Column U
                    row.getCell(22).value =
                        profile.undergrad_lecture_credit_units || 0; // Column V
                    row.getCell(23).value =
                        profile.undergrad_total_credit_units || 0; // Column W
                    row.getCell(24).value =
                        profile.undergrad_lab_hours_per_week || 0; // Column X
                    row.getCell(25).value =
                        profile.undergrad_lecture_hours_per_week || 0; // Column Y
                    row.getCell(26).value =
                        profile.undergrad_total_hours_per_week || 0; // Column Z
                    row.getCell(27).value =
                        profile.undergrad_lab_contact_hours || 0; // Column AA
                    row.getCell(28).value =
                        profile.undergrad_lecture_contact_hours || 0; // Column AB
                    row.getCell(29).value =
                        profile.undergrad_total_contact_hours || 0; // Column AC
                    row.getCell(30).value =
                        profile.graduate_lab_credit_units || 0; // Column AD
                    row.getCell(31).value =
                        profile.graduate_lecture_credit_units || 0; // Column AE
                    row.getCell(32).value =
                        profile.graduate_total_credit_units || 0; // Column AF
                    row.getCell(33).value =
                        profile.graduate_lab_contact_hours || 0; // Column AG
                    row.getCell(34).value =
                        profile.graduate_lecture_contact_hours || 0; // Column AH
                    row.getCell(35).value =
                        profile.graduate_total_contact_hours || 0; // Column AI
                    row.getCell(36).value = profile.research_load || 0; // Column AJ
                    row.getCell(37).value =
                        profile.extension_services_load || 0; // Column AK
                    row.getCell(38).value = profile.study_load || 0; // Column AL
                    row.getCell(39).value = profile.production_load || 0; // Column AM
                    row.getCell(40).value = profile.administrative_load || 0; // Column AN
                    row.getCell(41).value = profile.other_load_credits || 0; // Column AO
                    row.getCell(42).value = profile.total_work_load || 0; // Column AP

                    row.commit();
                });
            }

            // Generate a filename for the new file
            const fileName = `Form_E2_Faculty_Profiles_${
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
                message: "Data exported successfully across all sheets!",
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

    const handleSnackbarClose = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    console.log("Filtered Faculty Profiles:", filteredFacultyProfiles); // Debug log

    return (
        <Box sx={{ p: 3 }}>
            <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 2 }}>
                <Link
                    underline="hover"
                    color="inherit"
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate("/Super-admin/dashboard")}
                >
                    Dashboard
                </Link>
                <Link
                    underline="hover"
                    color="inherit"
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate("/Super-admin/institutions")}
                >
                    Institution Management
                </Link>
                <Typography color="textPrimary">Faculties</Typography>
            </Breadcrumbs>

            {/* File Upload and Export Buttons */}
            <ButtonGroup sx={{ mb: 2, display: "flex" }}>
                <input
                    type="file"
                    accept=".xlsx, .xls"
                    style={{ display: "none" }}
                    id="file-upload"
                    onChange={handleFileChange}
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
                        {isUploading ? "Uploading..." : "Import Form E2"}
                    </Button>
                </label>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<DownloadIcon/>  }
                    onClick={handleExportData}
                    disabled={isUploading || loading}
                >
                    Export Data
                </Button>
            </ButtonGroup>

            {/* Tabs for faculty groups */}
            <Tabs
                value={selectedGroup}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ mb: 2 }}
            >
                {facultyGroups.map((group) => (
                    <Tab
                        key={group.value}
                        label={group.label}
                        value={group.value}
                    />
                ))}
            </Tabs>

            {/* Group description */}
            <Typography variant="body2" sx={{ mb: 2, fontStyle: "italic" }}>
                {
                    facultyGroups.find((group) => group.value === selectedGroup)
                        ?.description
                }
            </Typography>

            {/* Progress Bar */}
            {uploadProgress > 0 && (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body2">
                        Uploading... {uploadProgress}%
                    </Typography>
                    <LinearProgress
                        variant="determinate"
                        value={uploadProgress}
                    />
                </Box>
            )}

            {/* Loading and Error States */}
            {loading && (
                <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                    <CircularProgress size={40} />
                </Box>
            )}
            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}

            {!loading && !error && (
                <FacultyProfileTable
                    selectedGroup={selectedGroup}
                    facultyProfiles={filteredFacultyProfiles}
                />
            )}

            {/* Snackbar for feedback */}
            <Alert
                open={snackbar.open}
                onClose={handleSnackbarClose}
                severity={snackbar.severity}
                sx={{ position: "fixed", bottom: 16, right: 16 }}
            >
                {snackbar.message}
            </Alert>
        </Box>
    );
};

export default FacultyProfileUpload;
