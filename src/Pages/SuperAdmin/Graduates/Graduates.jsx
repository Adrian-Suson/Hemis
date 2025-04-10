import React, { useState, useEffect, useRef } from "react";
import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.min.css";
import * as XLSX from "xlsx";
import axios from "axios";
import {
    Box,
    Button,
    CircularProgress,
    Typography,
    Snackbar,
    Alert,
    Breadcrumbs,
    Link,
    ButtonGroup,
    TextField, // <-- added
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import config from "../../../utils/config";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const Graduates = () => {
    const [graduates, setGraduates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [searchTerm, setSearchTerm] = useState(""); // <-- new state for filtering
    const hotRef = useRef(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchGraduates();
    }, []);

    const fetchGraduates = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${config.API_URL}/graduates`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const formattedData = (response.data.data || []).map(
                (graduate) => ({
                    ...graduate,
                    date_of_birth: formatDate(graduate.date_of_birth),
                    date_graduated: formatDate(graduate.date_graduated),
                })
            );
            setGraduates(formattedData);
        } catch (error) {
            console.error("Error fetching graduates:", error);
            setSnackbarMessage(`Failed to fetch graduates: ${error.message}`);
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        return `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date
            .getDate()
            .toString()
            .padStart(2, "0")}/${date.getFullYear()}`;
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setLoading(true);
        processExcelFile(file);
    };

    const processExcelFile = async (file) => {
        if (!file) return;

        const token = localStorage.getItem("token");
        if (!token) {
            setSnackbarMessage("Authentication token is missing.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            setLoading(false);
            return;
        }

        try {
            const reader = new FileReader();
            reader.readAsBinaryString(file);

            reader.onload = async (event) => {
                const data = event.target.result;
                const workbook = XLSX.read(data, { type: "binary" });

                let allGraduates = [];
                const seenGraduates = new Set();

                for (
                    let sheetIndex = 0;
                    sheetIndex < workbook.SheetNames.length;
                    sheetIndex++
                ) {
                    const sheetName = workbook.SheetNames[sheetIndex];
                    const sheet = workbook.Sheets[sheetName];

                    const jsonData = XLSX.utils.sheet_to_json(sheet, {
                        header: 1,
                        range: 0,
                    });

                    const validRows = jsonData.filter(
                        (row) =>
                            row.some(
                                (cell) => cell !== undefined && cell !== null
                            ) && row[0]
                    );

                    if (validRows.length === 0) {
                        console.log(`Skipping empty sheet: ${sheetName}`);
                        continue;
                    }

                    const processedGraduates = validRows.map((row) => ({
                        student_id: row[0] ? String(row[0]) : null,
                        date_of_birth: row[1] ? String(row[1]) : null,
                        last_name: row[2] ? String(row[2]) : null,
                        first_name: row[3] ? String(row[3]) : null,
                        middle_name: row[4] ? String(row[4]) : null,
                        sex: row[5] ? String(row[5]) : null,
                        date_graduated: row[6] ? String(row[6]) : null,
                        program_name: row[7] ? String(row[7]) : null,
                        program_major: row[8] ? String(row[8]) : null,
                        program_authority_to_operate_graduate: row[9]
                            ? String(row[9])
                            : null,
                        year_granted: row[10] ? parseInt(row[10], 10) : null,
                    }));

                    processedGraduates.forEach((graduate) => {
                        const graduateString = JSON.stringify(graduate);
                        if (!seenGraduates.has(graduateString)) {
                            seenGraduates.add(graduateString);
                            allGraduates.push(graduate);
                        }
                    });
                }

                uploadToBackend(allGraduates);
            };

            reader.onerror = (error) => {
                console.error("Error reading Excel file:", error);
                setSnackbarMessage(
                    `Failed to read Excel file: ${error.message}`
                );
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
                setLoading(false);
            };
        } catch (error) {
            console.error("Error processing Excel file:", error);
            setSnackbarMessage(
                `Failed to process Excel file: ${error.message}`
            );
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            setLoading(false);
        }
    };

    const uploadToBackend = async (data) => {
        try {
            const worksheet = XLSX.utils.json_to_sheet(data, {
                header: [
                    "student_id",
                    "date_of_birth",
                    "last_name",
                    "first_name",
                    "middle_name",
                    "sex",
                    "date_graduated",
                    "program_name",
                    "program_major",
                    "program_authority_to_operate_graduate",
                    "year_granted",
                ],
            });
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Graduates");

            const excelBuffer = XLSX.write(workbook, {
                bookType: "xlsx",
                type: "array",
            });
            const blob = new Blob([excelBuffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const formData = new FormData();
            formData.append("file", blob, "graduates.xlsx");

            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${config.API_URL}/graduates/bulk-upload`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setSnackbarMessage(
                response.data.message || "Graduates uploaded successfully!"
            );
            setSnackbarSeverity("success");
            setSnackbarOpen(true);

            fetchGraduates();
        } catch (error) {
            console.error("Error uploading graduates:", error);
            setSnackbarMessage(
                `Failed to upload graduates: ${
                    error.response?.data?.message || error.message
                }`
            );
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Graduates");

        worksheet.columns = [
            { header: "Student ID", key: "student_id", width: 15 },
            { header: "Last Name", key: "last_name", width: 20 },
            { header: "First Name", key: "first_name", width: 20 },
            { header: "Middle Name", key: "middle_name", width: 20 },
            { header: "Sex", key: "sex", width: 10 },
            { header: "Date of Birth", key: "date_of_birth", width: 15 },
            { header: "Date Graduated", key: "date_graduated", width: 15 },
            { header: "Program Name", key: "program_name", width: 30 },
            { header: "Program Major", key: "program_major", width: 20 },
            {
                header: "Program Authority",
                key: "program_authority_to_operate_graduate",
                width: 25,
            },
            { header: "Year Granted", key: "year_granted", width: 15 },
        ];

        graduates.forEach((graduate) => {
            worksheet.addRow(graduate);
        });

        // Style the header row
        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } }; // White text
        headerRow.alignment = { vertical: "middle", horizontal: "center" };
        headerRow.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF000000" }, // Black background
        };

        worksheet.columns.forEach((column) => {
            column.alignment = { vertical: "middle", wrapText: true };
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, "Graduates_List.xlsx");
    };

    // Handsontable settings remain unchanged but we'll override the data below in the render
    const hotSettings = {
        data: graduates,
        columns: [
            { data: "student_id", title: "Student ID" },
            { data: "last_name", title: "Last Name" },
            { data: "first_name", title: "First Name" },
            { data: "middle_name", title: "Middle Name" },
            { data: "sex", title: "Sex", type: "dropdown", source: ["M", "F"] },
            {
                data: "date_of_birth",
                title: "Date of Birth",
                type: "date",
                dateFormat: "MM/DD/YYYY",
                correctFormat: true,
            },
            {
                data: "date_graduated",
                title: "Date Graduated",
                type: "date",
                dateFormat: "MM/DD/YYYY",
                correctFormat: true,
            },
            { data: "program_name", title: "Program Name" },
            { data: "program_major", title: "Program Major" },
            {
                data: "program_authority_to_operate_graduate",
                title: "Program Authority",
            },
            { data: "year_granted", title: "Year Granted", type: "numeric" },
        ],
        colHeaders: true,
        rowHeaders: true,
        stretchH: "all",
        height: 400,
        licenseKey: "non-commercial-and-evaluation",
    };

    // Filter graduates based on search term. The search checks student_id, first name, last name, or program name.
    const filteredGraduates = graduates.filter((graduate) => {
        const term = searchTerm.toLowerCase();
        return (
            (graduate.student_id &&
                graduate.student_id.toLowerCase().includes(term)) ||
            (graduate.first_name &&
                graduate.first_name.toLowerCase().includes(term)) ||
            (graduate.last_name &&
                graduate.last_name.toLowerCase().includes(term)) ||
            (graduate.program_name &&
                graduate.program_name.toLowerCase().includes(term))
        );
    });

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
                <Typography color="textPrimary">List of Graduates</Typography>
            </Breadcrumbs>

            {/* Search Filter */}
            <TextField
                fullWidth
                placeholder="Search by Student ID, Name, or Program"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                variant="outlined"
                sx={{ mb: 3 }}
            />

            <ButtonGroup
                sx={{ mb: 3, display: "flex", justifyContent: "flex-end" }}
            >
                {/* Upload Button */}
                <Button
                    variant="contained"
                    component="span"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                    Upload Excel File
                </Button>

                {/* Export Button */}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={exportToExcel}
                    disabled={loading || graduates.length === 0}
                >
                    Export to Excel
                </Button>
            </ButtonGroup>

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
                    <CircularProgress />
                </Box>
            ) : filteredGraduates.length > 0 ? (
                <HotTable ref={hotRef} settings={{ ...hotSettings, data: filteredGraduates }} />
            ) : (
                <Typography>No data available</Typography>
            )}

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity={snackbarSeverity}
                    sx={{ width: "100%" }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Graduates;
