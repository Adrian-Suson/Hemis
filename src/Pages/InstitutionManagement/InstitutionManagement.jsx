// InstitutionManagement.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import {
    Box,
    Button,
    Typography,
    Tabs,
    Tab,
    Breadcrumbs,
    Link,
    ButtonGroup,
} from "@mui/material";
import { UploadFile as UploadIcon } from "@mui/icons-material";
import InstitutionTable from "./InstitutionTable";
import { Link as RouterLink } from "react-router-dom";
import config from "../../utils/config";
import { useProgress } from "../../Context/ProgressContext";
import CustomSnackbar from "../../Components/CustomSnackbar";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import ManualInstitutionDialog from "./ManualInstitutionDialog";
import DownloadIcon from '@mui/icons-material/Download';
import ExcelJS from "exceljs";

const InstitutionManagement = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [institutions, setInstitutions] = useState([]);
    const { showProgress, hideProgress } = useProgress();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("info");
    const [openManualDialog, setOpenManualDialog] = useState(false);

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const getInstitutionType = () => {
        switch (activeTab) {
            case 0:
                return "SUC";
            case 1:
                return "LUC";
            case 2:
                return "PHEI";
            default:
                return "Unknown";
        }
    };

    const fetchInstitutions = async () => {
        try {
            showProgress(90); // Show some progress at the start
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${config.API_URL}/institutions?type=${getInstitutionType()}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setInstitutions(response.data);
        } catch (error) {
            console.error("Error fetching institutions:", error);
        } finally {
            hideProgress(); // Hide progress
        }
    };

    // Fetch institutions whenever activeTab changes
    useEffect(() => {
        fetchInstitutions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleEdit = (institution) => {
        console.log("Editing institution:", institution);
        // Open a modal or redirect to an edit form
    };

    const handleFileUpload = (event) => {
        const fileInput = event.target;
        const file = fileInput.files[0];
        if (!file) return;

        showProgress(10); // Some initial progress

        const reader = new FileReader();
        reader.onload = async (e) => {
            showProgress(30); // After reading

            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array" });

                showProgress(40); // After parsing

                const sheetA1 = workbook.Sheets[workbook.SheetNames[0]];
                const jsonDataA1 = XLSX.utils.sheet_to_json(sheetA1, {
                    header: 1,
                });

                const extractedInstitution = {
                    name: String(jsonDataA1[4]?.[2] || "Unknown"),
                    region: String(jsonDataA1[10]?.[2] || "Unknown"),
                    address_street: String(jsonDataA1[7]?.[2] || "Unknown"),
                    municipality_city: String(jsonDataA1[8]?.[2] || "Unknown"),
                    province: String(jsonDataA1[9]?.[2] || "Unknown"),
                    postal_code: String(jsonDataA1[11]?.[2] || "N/A"),
                    institutional_telephone: String(
                        jsonDataA1[12]?.[2] || "N/A"
                    ),
                    institutional_fax: String(jsonDataA1[13]?.[2] || "N/A"),
                    head_telephone: String(jsonDataA1[14]?.[2] || "N/A"),
                    institutional_email: String(jsonDataA1[15]?.[2] || "N/A"),
                    institutional_website: String(jsonDataA1[16]?.[2] || "N/A"),
                    year_established: jsonDataA1[17]?.[2]
                        ? String(jsonDataA1[17]?.[2])
                        : "N/A",
                    sec_registration: jsonDataA1[18]?.[2]
                        ? String(jsonDataA1[18]?.[2])
                        : "N/A",
                    year_granted_approved: jsonDataA1[19]?.[2]
                        ? String(jsonDataA1[19]?.[2])
                        : "N/A",
                    year_converted_college: jsonDataA1[20]?.[2]
                        ? String(jsonDataA1[20]?.[2])
                        : "N/A",
                    year_converted_university: jsonDataA1[21]?.[2]
                        ? String(jsonDataA1[21]?.[2])
                        : "N/A",
                    head_name: String(jsonDataA1[22]?.[2] || "Unknown"),
                    head_title: String(jsonDataA1[23]?.[2] || "N/A"),
                    head_education: String(jsonDataA1[24]?.[2] || "N/A"),
                    institution_type: getInstitutionType(),
                };

                showProgress(50); // Before sending to server

                const token = localStorage.getItem("token");
                const institutionResponse = await axios.post(
                    "http://localhost:8000/api/institutions",
                    extractedInstitution,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                fetchInstitutions();
                setSnackbarMessage("Institution data Uploaded successfully!");
                setSnackbarSeverity("success");
                setSnackbarOpen(true);
                console.log(
                    "Institution data sent successfully:",
                    institutionResponse.data
                );
                const institutionId = institutionResponse.data.id;

                // Process campus data
                const sheetA2 = workbook.Sheets[workbook.SheetNames[1]];
                const jsonDataA2 = XLSX.utils.sheet_to_json(sheetA2, {
                    header: 1,
                });

                const startRow = 13;
                const processedCampuses = jsonDataA2
                    .slice(startRow)
                    .filter((row) =>
                        row.some((cell) => cell !== undefined && cell !== "")
                    )
                    .map((row) => ({
                        suc_name: String(row[1] || "N/A"),
                        campus_type: String(row[2] || "N/A"),
                        institutional_code: String(row[3] || "N/A"),
                        region: String(row[4] || "N/A"),
                        municipality_city_province: String(row[5] || "N/A"),
                        year_first_operation: row[6]
                            ? String(parseInt(row[6], 10))
                            : "N/A",
                        land_area_hectares: row[7]
                            ? String(parseFloat(row[7]))
                            : "0.0",
                        distance_from_main: row[8]
                            ? String(parseFloat(row[8]))
                            : "0.0",
                        autonomous_code: String(row[9] || "N/A"),
                        position_title: String(row[10] || "N/A"),
                        head_full_name: String(row[11] || "N/A"),
                        former_name: String(row[12] || "N/A"),
                        latitude_coordinates: row[13]
                            ? String(parseFloat(row[13]))
                            : "0.0",
                        longitude_coordinates: row[14]
                            ? String(parseFloat(row[14]))
                            : "0.0",
                        institution_id: String(institutionId),
                    }));

                showProgress(70); // Before sending campuses
                await axios.post(
                    "http://localhost:8000/api/campuses",
                    processedCampuses,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                console.log("Campuses data sent successfully!");
                showProgress(100); // Done
            } catch (error) {
                console.error("Error sending data to backend:", error);
            } finally {
                hideProgress();
                fileInput.value = "";
            }
        };

        reader.readAsArrayBuffer(file);
    };

    const handleExportData = async () => {
        if (!institutions.length) {
            setSnackbarMessage("No data available to export.");
            setSnackbarSeverity("warning");
            setSnackbarOpen(true);
            return;
        }

        try {
            const response = await fetch(
                "/public/templates/Form-A-Themeplate.xlsx"
            );
            if (!response.ok) {
                throw new Error(
                    `Failed to load template file: HTTP ${response.status} - ${response.statusText}`
                );
            }
            const arrayBuffer = await response.arrayBuffer();

            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(arrayBuffer);

            const sheetA1 = workbook.getWorksheet("FORM A1");
            const sheetA2 = workbook.getWorksheet("FORM A2");

            if (!sheetA1 || !sheetA2) {
                throw new Error(
                    "Template is missing required sheets: FORM A1 or FORM A2"
                );
            }

            // Rest of your existing code remains unchanged
            const institution = institutions[0];
            const a1StartRow = 5;
            const a1Data = [
                institution.name || "N/A",
                "", // ADDRESS header
                "",
                institution.address_street || "N/A",
                institution.municipality_city || "N/A",
                institution.province || "N/A",
                institution.region || "N/A",
                institution.postal_code || "N/A",
                institution.institutional_telephone || "N/A",
                institution.institutional_fax || "N/A",
                institution.head_telephone || "N/A",
                institution.institutional_email || "N/A",
                institution.institutional_website || "N/A",
                institution.year_established || "N/A",
                institution.sec_registration || "N/A",
                institution.year_granted_approved || "N/A",
                institution.year_converted_college || "N/A",
                institution.year_converted_university || "N/A",
                institution.head_name || "N/A",
                institution.head_title || "N/A",
                institution.head_education || "N/A",
            ];

            a1Data.forEach((value, index) => {
                const row = sheetA1.getRow(a1StartRow + index);
                row.getCell(3).value = value;
                row.commit();
            });

            const token = localStorage.getItem("token");
            const campusResponse = await axios.get(
                `http://localhost:8000/api/campuses?institution_id=${institution.id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            let campuses = campusResponse.data.campuses || [];
            if (!Array.isArray(campuses)) {
                console.warn(
                    "Campuses is not an array, normalizing to empty array:",
                    campuses
                );
                campuses = [];
            }

            const a2StartRow = 14;
            if (campuses.length === 0) {
                console.log(
                    "No campuses to export for institution:",
                    institution.id
                );
            } else {
                campuses.forEach((campus, index) => {
                    const row = sheetA2.getRow(a2StartRow + index);
                    console.log(
                        `Populating row ${a2StartRow + index} with campus:`,
                        campus
                    );
                    row.values = [
                        index + 1,
                        campus.suc_name || "N/A",
                        campus.campus_type || "N/A",
                        campus.institutional_code || "N/A",
                        campus.region || "N/A",
                        campus.municipality_city_province || "N/A",
                        campus.year_first_operation || "N/A",
                        campus.land_area_hectares || "0.0",
                        campus.distance_from_main || "0.0",
                        campus.autonomous_code || "N/A",
                        campus.position_title || "N/A",
                        campus.head_full_name || "N/A",
                        campus.former_name || "N/A",
                        campus.latitude_coordinates || "0.0",
                        campus.longitude_coordinates || "0.0",
                    ];
                    row.commit();
                });
            }

            const fileName = `Form_A_${getInstitutionType()}_${
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

            setSnackbarMessage("Data exported successfully using template!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
        } catch (error) {
            console.error("Error exporting data:", error);
            setSnackbarMessage(`Error exporting data: ${error.message}`);
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Breadcrumbs */}
            <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 2 }}>
                <Link
                    underline="hover"
                    color="inherit"
                    component={RouterLink}
                    to="/dashboard"
                >
                    Dashboard
                </Link>
                <Typography color="text.primary">
                    Institution Management
                </Typography>
            </Breadcrumbs>

            <Tabs value={activeTab} onChange={handleTabChange}>
                <Tab label="SUCs" />
                <Tab label="LUCs" />
                <Tab label="PHEIs" />
            </Tabs>

            <ButtonGroup sx={{ mt: 3, display: "flex" }}>
                <Button
                    variant="contained"
                    component="label"
                    startIcon={<UploadIcon />}
                >
                    Upload Form A
                    <input
                        type="file"
                        hidden
                        accept=".xlsx, .xls"
                        onClick={() => {}}
                        onChange={handleFileUpload}
                    />
                </Button>

                {/* Button to open the separate ManualInstitutionDialog */}
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<NoteAddIcon />}
                    onClick={() => setOpenManualDialog(true)}
                >
                    Add Institution Manually
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<DownloadIcon/>}
                    onClick={handleExportData}
                >
                    Export Form A
                </Button>
            </ButtonGroup>
            <ManualInstitutionDialog
                open={openManualDialog}
                onClose={() => setOpenManualDialog(false)}
                getInstitutionType={getInstitutionType}
                fetchInstitutions={fetchInstitutions}
                showProgress={showProgress}
                hideProgress={hideProgress}
                setSnackbarOpen={setSnackbarOpen}
                setSnackbarMessage={setSnackbarMessage}
                setSnackbarSeverity={setSnackbarSeverity}
            />
            <InstitutionTable institutions={institutions} onEdit={handleEdit} />
            <CustomSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={handleCloseSnackbar}
                autoHideDuration={5000} // 5 seconds, for example
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            />
        </Box>
    );
};

export default InstitutionManagement;
