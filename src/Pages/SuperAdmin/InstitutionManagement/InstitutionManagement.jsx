/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import {
    Box,
    Button,
    Typography,
    Breadcrumbs,
    Link,
    ButtonGroup,
} from "@mui/material";
import { UploadFile as UploadIcon } from "@mui/icons-material";
import InstitutionTable from "./InstitutionTable";
import { Link as RouterLink } from "react-router-dom";
import config from "../../../utils/config";
import { useProgress } from "../../../Context/ProgressContext";
import CustomSnackbar from "../../../Components/CustomSnackbar";
import ManualInstitutionDialog from "./ManualInstitutionDialog";
import InstitutionManagementSkeleton from "./InstitutionManagementSkeleton";
import UploadDialog from "./UploadDialog";

const InstitutionManagement = () => {
    const [institutions, setInstitutions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showProgress, hideProgress } = useProgress();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("info");
    const [openManualDialog, setOpenManualDialog] = useState(false);
    const [openUploadDialog, setOpenUploadDialog] = useState(false);
    const [selectedInstitutionType, setSelectedInstitutionType] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const fetchInstitutions = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.get(`${config.API_URL}/institutions`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setInstitutions(response.data);
        } catch (error) {
            console.error("Error fetching institutions:", error);
            setSnackbarMessage("Failed to fetch institutions.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
            hideProgress();
        }
    };

    useEffect(() => {
        fetchInstitutions();
    }, []);

    const handleEdit = (institution) => {
        console.log("Editing institution:", institution);
    };

    const handleUploadClick = () => {
        setOpenUploadDialog(true);
    };

    const handleFileUpload = async () => {
        if (!selectedFile || !selectedInstitutionType) return;

        showProgress(10);

        const reader = new FileReader();
        reader.onload = async (e) => {
            showProgress(30);

            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array" });

                showProgress(40);

                const sheetA1 = workbook.Sheets[workbook.SheetNames[0]];
                const jsonDataA1 = XLSX.utils.sheet_to_json(sheetA1, {
                    header: 1,
                });

                const extractedInstitution = {
                    name: String(jsonDataA1[4]?.[2] || "Unknown"),
                    address_street: String(jsonDataA1[7]?.[2] || "Unknown"),
                    municipality_city: String(jsonDataA1[8]?.[2] || "Unknown"),
                    province: String(jsonDataA1[9]?.[2] || "Unknown"),
                    region: String(jsonDataA1[10]?.[2] || "Unknown"),
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
                    institution_type: selectedInstitutionType,
                };

                showProgress(50);
                console.log("extractedInstitution:", extractedInstitution);

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
                setSnackbarMessage("Institution data uploaded successfully!");
                setSnackbarSeverity("success");
                setSnackbarOpen(true);
                const institutionId = institutionResponse.data.id;

                const sheetA2 = workbook.Sheets[workbook.SheetNames[1]];
                const jsonDataA2 = XLSX.utils.sheet_to_json(sheetA2, {
                    header: 1,
                });

                const startRow = 10;
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

                showProgress(70);
                await axios.post(
                    "http://localhost:8000/api/campuses",
                    processedCampuses,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                console.log("Campuses data sent successfully!");
                showProgress(100);
            } catch (error) {
                console.error("Error sending data to backend:", error);
                setSnackbarMessage("Error uploading institution data.");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
            } finally {
                hideProgress();
                setSelectedFile(null);
                setSelectedInstitutionType("");
            }
        };

        reader.readAsArrayBuffer(selectedFile);
        setOpenUploadDialog(false);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 2 }}>
                <Link
                    underline="hover"
                    color="inherit"
                    component={RouterLink}
                    to="/super-admin/dashboard"
                >
                    Dashboard
                </Link>
                <Typography color="text.primary">
                    Institution Management
                </Typography>
            </Breadcrumbs>

            <ButtonGroup
                sx={{
                    mt: 3,
                    display: "flex",
                    justifyContent: "flex-end", // Align to the right
                }}
            >
                <Button
                    variant="contained"
                    startIcon={<UploadIcon />}
                    sx={{
                        backgroundColor: "primary.main",
                        color: "white",
                        "&:hover": { backgroundColor: "primary.dark" },
                    }}
                    onClick={handleUploadClick}
                >
                    Upload Form A
                </Button>
            </ButtonGroup>

            <InstitutionTable
                institutions={institutions}
                onEdit={handleEdit}
                count={fetchInstitutions.length || 5}
            />

            {/* Upload Dialog */}
            <UploadDialog
                openUploadDialog={openUploadDialog}
                setOpenUploadDialog={setOpenUploadDialog}
                selectedInstitutionType={selectedInstitutionType}
                setSelectedInstitutionType={setSelectedInstitutionType}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                handleFileUpload={handleFileUpload}
            />

            <ManualInstitutionDialog
                open={openManualDialog}
                onClose={() => setOpenManualDialog(false)}
                getInstitutionType={() => selectedInstitutionType} // Pass selected type if needed
                fetchInstitutions={fetchInstitutions}
                showProgress={showProgress}
                hideProgress={hideProgress}
                setSnackbarOpen={setSnackbarOpen}
                setSnackbarMessage={setSnackbarMessage}
                setSnackbarSeverity={setSnackbarSeverity}
            />
            <CustomSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={handleCloseSnackbar}
                autoHideDuration={5000}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            />
        </Box>
    );
};

export default InstitutionManagement;
