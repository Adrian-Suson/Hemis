import { useState } from "react";
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
} from "@mui/material";
import FacultyProfileTable from "./FacultyProfileTable";
import { useNavigate } from "react-router-dom";
import UploadFileIcon from "@mui/icons-material/UploadFile";

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
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const navigate = useNavigate();

    const handleTabChange = (_, newValue) => {
        setSelectedGroup(newValue);
    };

    const processExcelFile = async (file) => {
        if (!file) return;

        setIsUploading(true); // Disable input during upload
        setUploadProgress(5);

        const token = localStorage.getItem("token");
        const institutionId = localStorage.getItem("institutionId");

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

                let allFacultyProfiles = []; // To store data from all sheets

                for (
                    let sheetIndex = 0;
                    sheetIndex < workbook.SheetNames.length;
                    sheetIndex++
                ) {
                    const sheetName = workbook.SheetNames[sheetIndex];
                    const sheet = workbook.Sheets[sheetName];

                    setUploadProgress(10 + sheetIndex * 10);

                    const jsonData = XLSX.utils.sheet_to_json(sheet, {
                        header: 1,
                        range: 9,
                    });

                    // Filter out empty rows and check if any valid name exists
                    const validRows = jsonData.filter(
                        (row) =>
                            row.some(
                                (cell) => cell !== undefined && cell !== ""
                            ) && row[1]
                    );

                    if (validRows.length === 0) {
                        console.log(`Skipping empty sheet: ${sheetName}`);
                        continue; // Skip this sheet
                    }

                    const processedFacultyProfiles = validRows.map((row) => ({
                        institution_id: institutionId,
                        faculty_group: selectedGroup,
                        name: String(row[1] || "N/A"),
                        generic_faculty_rank: row[2]
                            ? parseInt(row[2], 10)
                            : null,
                        home_college: String(row[3] || "N/A"),
                        home_department: String(row[4] || "N/A"),
                        is_tenured: row[5] ? parseInt(row[5]) : 0,
                        ssl_salary_grade: row[6] ? parseInt(row[6], 10) : null,
                        annual_basic_salary: row[7]
                            ? parseInt(row[7], 10)
                            : null,
                        on_leave_without_pay: row[8]
                            ? parseInt(row[8], 10)
                            : null,
                        full_time_equivalent: row[9] ? parseFloat(row[9]) : 0.0,
                        gender: row[10] ? parseInt(row[10], 10) : null,
                        highest_degree_attained: row[11]
                            ? parseInt(row[11], 10)
                            : null,
                        pursuing_next_degree: row[12]
                            ? parseInt(row[12], 10)
                            : null,
                        discipline_teaching_load_1: String(row[13] || "N/A"),
                        discipline_teaching_load_2: String(row[14] || "N/A"),
                        discipline_bachelors: String(row[15] || "N/A"),
                        discipline_masters: String(row[16] || "N/A"),
                        discipline_doctorate: String(row[17] || "N/A"),
                        masters_with_thesis: row[18]
                            ? parseInt(row[18], 10)
                            : null,
                        doctorate_with_dissertation: row[19]
                            ? parseInt(row[19], 10)
                            : null,
                        undergrad_lab_credit_units: row[20]
                            ? parseFloat(row[20])
                            : 0.0,
                        undergrad_lecture_credit_units: row[21]
                            ? parseFloat(row[21])
                            : 0.0,
                        undergrad_total_credit_units: row[22]
                            ? parseFloat(row[22])
                            : 0.0,
                        undergrad_lab_hours_per_week: row[23]
                            ? parseFloat(row[23])
                            : 0.0,
                        undergrad_lecture_hours_per_week: row[24]
                            ? parseFloat(row[24])
                            : 0.0,
                        undergrad_total_hours_per_week: row[25]
                            ? parseFloat(row[25])
                            : 0.0,
                        undergrad_lab_contact_hours: row[26]
                            ? parseFloat(row[26])
                            : 0.0,
                        undergrad_lecture_contact_hours: row[27]
                            ? parseFloat(row[27])
                            : 0.0,
                        undergrad_total_contact_hours: row[28]
                            ? parseFloat(row[28])
                            : 0.0,
                        graduate_lab_credit_units: row[29]
                            ? parseFloat(row[29])
                            : 0.0,
                        graduate_lecture_credit_units: row[30]
                            ? parseFloat(row[30])
                            : 0.0,
                        graduate_total_credit_units: row[31]
                            ? parseFloat(row[31])
                            : 0.0,
                        graduate_lab_contact_hours: row[32]
                            ? parseFloat(row[32])
                            : 0.0,
                        graduate_lecture_contact_hours: row[33]
                            ? parseFloat(row[33])
                            : 0.0,
                        graduate_total_contact_hours: row[34]
                            ? parseFloat(row[34])
                            : 0.0,
                        research_load: row[35] ? parseFloat(row[35]) : 0.0,
                        extension_services_load: row[36]
                            ? parseFloat(row[36])
                            : 0.0,
                        study_load: row[37] ? parseFloat(row[37]) : 0.0,
                        production_load: row[38] ? parseFloat(row[38]) : 0.0,
                        administrative_load: row[39]
                            ? parseFloat(row[39])
                            : 0.0,
                        other_load_credits: row[40] ? parseFloat(row[40]) : 0.0,
                        total_work_load: row[41] ? parseFloat(row[41]) : 0.0,
                    }));

                    allFacultyProfiles = [
                        ...allFacultyProfiles,
                        ...processedFacultyProfiles,
                    ];
                }

                console.log(
                    "Final Processed Faculty Data:",
                    allFacultyProfiles
                );
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
                } else {
                    alert("No valid faculty data found in the uploaded file.");
                }

                setUploadProgress(100);
                setTimeout(() => setUploadProgress(0), 2000); // Hide progress after upload
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

    return (
        <Box sx={{ p: 3 }}>
            <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 2 }}>
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
                <Typography color="textPrimary">Faculties</Typography>
            </Breadcrumbs>

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

            {/* File Upload */}
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
                    {isUploading ? "Uploading..." : "Import Form B"}
                </Button>
            </label>

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

            <FacultyProfileTable selectedGroup={selectedGroup} />
        </Box>
    );
};

export default FacultyProfileUpload;
