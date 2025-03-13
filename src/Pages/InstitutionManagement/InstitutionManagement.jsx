    import { useState, useEffect, useCallback } from "react";
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
    } from "@mui/material";
    import { UploadFile as UploadIcon } from "@mui/icons-material";
    import InstitutionTable from "./InstitutionTable"; // Import the table component
    import { Link as RouterLink } from "react-router-dom";
    import config from "../../utils/config";

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

        useEffect(() => {
            fetchInstitutions();
        }, [activeTab, fetchInstitutions]);

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
                    region_id: regionId, // Updated to region_id
                    address_street: String(jsonDataA1[7]?.[2] || "Unknown"),
                    municipality_city: String(jsonDataA1[8]?.[2] || "Unknown"),
                    province: String(jsonDataA1[9]?.[2] || "Unknown"),
                    postal_code: String(jsonDataA1[11]?.[2] || "N/A"),
                    institutional_telephone: String(jsonDataA1[12]?.[2] || "N/A"),
                    institutional_fax: String(jsonDataA1[13]?.[2] || "N/A"),
                    head_telephone: String(jsonDataA1[14]?.[2] || "N/A"),
                    institutional_email: String(jsonDataA1[15]?.[2] || "N/A"),
                    institutional_website: String(jsonDataA1[16]?.[2] || "N/A"),
                    year_established: jsonDataA1[17]?.[2]
                        ? String(jsonDataA1[17]?.[2])
                        : null,
                    sec_registration: jsonDataA1[18]?.[2]
                        ? String(jsonDataA1[18]?.[2])
                        : null,
                    year_granted_approved: jsonDataA1[19]?.[2]
                        ? String(jsonDataA1[19]?.[2])
                        : null,
                    year_converted_college: jsonDataA1[20]?.[2]
                        ? String(jsonDataA1[20]?.[2])
                        : null,
                    year_converted_university: jsonDataA1[21]?.[2]
                        ? String(jsonDataA1[21]?.[2])
                        : null,
                    head_name: String(jsonDataA1[22]?.[2] || "Unknown"),
                    head_title: String(jsonDataA1[23]?.[2] || "N/A"),
                    head_education: String(jsonDataA1[24]?.[2] || "N/A"),
                    institution_type: getInstitutionType(), // Assign dynamically
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

            <ButtonGroup sx={{ mt: 3, display: "flex",}}>
                <Button
                    variant="contained"
                    component="label"
                    startIcon={<UploadIcon />}
                    sx={{
                        backgroundColor: "primary.main",
                        color: "white",
                        "&:hover": { backgroundColor: "primary.dark" },
                    }}
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

                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<DownloadIcon />}
                    onClick={handleExportData}
                    disabled={!institutions.length} // Disable if no data
                    sx={{
                        backgroundColor: institutions.length
                            ? "secondary.main"
                            : "grey.400",
                        "&:hover": {
                            backgroundColor: institutions.length
                                ? "secondary.dark"
                                : "grey.500",
                        },
                    }}
                >
                    {institutions.length
                        ? "Export Form A"
                        : "No Data to Export"}
                </Button>
            </ButtonGroup>

            <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                    "& .MuiTab-root": {
                        fontWeight: "bold",
                        textTransform: "none",
                    },
                }}
            >
                <Tab label="SUCs" />
                <Tab label="LUCs" />
                <Tab label="PHEIs" />
            </Tabs>

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
