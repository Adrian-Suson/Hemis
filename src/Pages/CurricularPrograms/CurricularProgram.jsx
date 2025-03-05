import { useState, useEffect, useMemo } from "react";
import { Container, Typography, Button, Tabs, Tab } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import * as XLSX from "xlsx";
import axios from "axios";
import config from "../../utils/config";
import ProgramTables from "./ProgramTables";

const CurricularProgram = () => {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mainTabValue, setMainTabValue] = useState(0); // Main tab for program_type
    const [subTabValue, setSubTabValue] = useState(0); // Subtab for Programs/Enrollments/Statistics

    // Main tab categories for program_type
    const categories = useMemo(() => [
        "DOCTORATE",
        "MASTERS",
        "POST-BACCALAUREATE",
        "BACCALAUREATE",
        "PRE-BACCALAUREATE",
        "VOC/TECH",
        "BASIC EDUCATION",
    ], []);

    // Subtab categories
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
                        program_type: categories[mainTabValue], // Fetch by selected program_type
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
    }, [mainTabValue, categories]); // Re-fetch when mainTabValue changes

    // Handle file upload and Excel parsing
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const institutionId = localStorage.getItem("institutionId");
        if (!institutionId) {
            console.error("No institution ID found in localStorage");
            alert("Please select an institution first.");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found in localStorage");
            alert("Please log in first.");
            return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[mainTabValue];
            const sheet = workbook.Sheets[sheetName];

            const allData = XLSX.utils.sheet_to_json(sheet, {
                header: 1,
                range: 11,
            });

            const parsedData = allData
                .map((row) => ({
                    program: {
                        institution_id: institutionId,
                        program_name: row[1] || "N/A",
                        program_code: (row[2]) || 0,
                        major_name: row[3] || "N/A",
                        major_code: (row[4]) || 0,
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
                }))
                .filter((data) => {
                    return data.program.program_name && data.program.major_name;
                });

            console.log("Parsed Data:", parsedData);

            try {
                const createdPrograms = [];
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
                }

                setPrograms(createdPrograms);
                alert("Data imported successfully!");
            } catch (error) {
                console.error(
                    "Error importing data:",
                    error.response?.data || error.message
                );
                alert(
                    "Error importing data. Please check the console for details."
                );
            }
        };

        reader.readAsArrayBuffer(file);
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
            />
            <label htmlFor="file-upload">
                <Button
                    variant="contained"
                    color="secondary"
                    component="span"
                    startIcon={<UploadFileIcon />}
                    sx={{ mb: 2 }}
                >
                    Import Excel
                </Button>
            </label>

            {/* Main Tabs based on program_type */}
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

            {/* Subtabs for Programs, Enrollments, Statistics */}
            <Tabs
                value={subTabValue}
                onChange={(event, newValue) => setSubTabValue(newValue)}
                sx={{ mb: 2 }}
            >
                {subCategories.map((subCategory) => (
                    <Tab key={subCategory} label={subCategory} />
                ))}
            </Tabs>

            {/* ProgramTables with both tab values */}
            <ProgramTables
                programs={programs}
                loading={loading}
                subTabValue={subTabValue}
            />
        </Container>
    );
};

export default CurricularProgram;
