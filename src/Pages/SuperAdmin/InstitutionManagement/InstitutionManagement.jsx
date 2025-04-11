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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Skeleton,
} from "@mui/material";
import { UploadFile as UploadIcon } from "@mui/icons-material";
import InstitutionTable from "./InstitutionTable";
import { Link as RouterLink } from "react-router-dom";
import config from "../../../utils/config";
import { useProgress } from "../../../Context/ProgressContext";
import CustomSnackbar from "../../../Components/CustomSnackbar";
import ManualInstitutionDialog from "./ManualInstitutionDialog";

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

    const getInstitutionType = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        return user?.institution_type || "Unknown";
    };

    const fetchInstitutions = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const user = JSON.parse(localStorage.getItem("user"));

            const response = await axios.get(`${config.API_URL}/institutions`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (user?.role !== "Super Admin") {
                const filteredInstitutions = response.data.filter(
                    (institution) => institution.id === user?.institution_id
                );
                setInstitutions(filteredInstitutions);
            } else {
                setInstitutions(response.data);
            }
        } catch (error) {
            console.error("Error fetching institutions:", error);
            setSnackbarMessage("Failed to load institution data.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInstitutions();
    }, []);

    const handleFileUpload = async () => {
        if (!selectedFile || !selectedInstitutionType) {
            setSnackbarMessage(
                "Please select both an institution type and a file."
            );
            setSnackbarSeverity("warning");
            setSnackbarOpen(true);
            return;
        }

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

                const toNullableInteger = (value) => {
                    if (!value || value === "N/A" || value === "") return null;
                    const parsed = parseInt(value, 10);
                    return isNaN(parsed) ? null : parsed;
                };

                const extractedInstitution = {
                    name: String(jsonDataA1[4]?.[2] || "Unknown"),
                    region: String(jsonDataA1[10]?.[2] || "Unknown"),
                    address_street: String(jsonDataA1[7]?.[2] || ""),
                    municipality_city: String(jsonDataA1[8]?.[2] || ""),
                    province: String(jsonDataA1[9]?.[2] || ""),
                    postal_code: String(jsonDataA1[11]?.[2] || ""),
                    institutional_telephone: String(jsonDataA1[12]?.[2] || ""),
                    institutional_fax: String(jsonDataA1[13]?.[2] || ""),
                    head_telephone: String(jsonDataA1[14]?.[2] || ""),
                    institutional_email: String(jsonDataA1[15]?.[2] || ""),
                    institutional_website: String(jsonDataA1[16]?.[2] || ""),
                    year_established: toNullableInteger(jsonDataA1[17]?.[2]),
                    sec_registration: String(jsonDataA1[18]?.[2] || ""),
                    year_granted_approved: toNullableInteger(
                        jsonDataA1[19]?.[2]
                    ),
                    year_converted_college: toNullableInteger(
                        jsonDataA1[20]?.[2]
                    ),
                    year_converted_university: toNullableInteger(
                        jsonDataA1[21]?.[2]
                    ),
                    head_name: String(jsonDataA1[22]?.[2] || ""),
                    head_title: String(jsonDataA1[23]?.[2] || ""),
                    head_education: String(jsonDataA1[24]?.[2] || ""),
                    institution_type: selectedInstitutionType,
                };

                showProgress(50);
                const token = localStorage.getItem("token");
                console.log(
                    "Extracted Institution Data:",
                    extractedInstitution
                );
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

                const startRow = 13;
                const processedCampuses = jsonDataA2
                    .slice(startRow)
                    .filter((row) =>
                        row.some((cell) => cell !== undefined && cell !== "")
                    )
                    .map((row) => ({
                        suc_name: String(row[1] || ""),
                        campus_type: String(row[2] || ""),
                        institutional_code: String(row[3] || ""),
                        region: String(row[4] || ""),
                        municipality_city_province: String(row[5] || ""),
                        year_first_operation: row[6]
                            ? String(parseInt(row[6], 10))
                            : "",
                        land_area_hectares: row[7]
                            ? String(parseFloat(row[7]))
                            : "0.0",
                        distance_from_main: row[8]
                            ? String(parseFloat(row[8]))
                            : "0.0",
                        autonomous_code: String(row[9] || ""),
                        position_title: String(row[10] || ""),
                        head_full_name: String(row[11] || ""),
                        former_name: String(row[12] || ""),
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
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                showProgress(100);
            } catch (error) {
                console.error("Error sending data to backend:", error);
                setSnackbarMessage("Error uploading institution data.");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
            } finally {
                hideProgress();
                setOpenUploadDialog(false);
                setSelectedFile(null);
                setSelectedInstitutionType("");
            }
        };
        reader.readAsArrayBuffer(selectedFile);
    };

    return (
        <Box sx={{ p: 3 }}>
            {loading ? (
                <>
                    {/* Breadcrumbs Skeleton */}
                    <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                        <Skeleton variant="text" width={80} height={20} />
                        <Typography sx={{ mx: 1 }}>›</Typography>
                        <Skeleton variant="text" width={150} height={20} />
                    </Box>

                    {/* Button Skeleton */}
                    <Skeleton
                        variant="rounded"
                        width={150}
                        height={36}
                        sx={{ mt: 3 }}
                    />

                    {/* Table Skeleton */}
                    <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                            <Skeleton
                                variant="rounded"
                                width="25%"
                                height={32}
                            />
                            <Skeleton
                                variant="rounded"
                                width="15%"
                                height={32}
                            />
                            <Skeleton
                                variant="rounded"
                                width="15%"
                                height={32}
                            />
                            <Skeleton
                                variant="rounded"
                                width="15%"
                                height={32}
                            />
                        </Box>
                        <Skeleton variant="rounded" width="100%" height={30} />
                        {[...Array(5)].map((_, index) => (
                            <Skeleton
                                key={index}
                                variant="rounded"
                                width="100%"
                                height={24}
                                sx={{ mt: 0.5 }}
                            />
                        ))}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                mt: 1,
                            }}
                        >
                            <Skeleton
                                variant="rounded"
                                width={80}
                                height={32}
                                sx={{ mr: 1 }}
                            />
                            <Skeleton
                                variant="text"
                                width={100}
                                height={20}
                                sx={{ mr: 1 }}
                            />
                            <Skeleton
                                variant="rounded"
                                width={120}
                                height={32}
                            />
                        </Box>
                    </Box>
                </>
            ) : (
                <>
                    <Breadcrumbs
                        separator="›"
                        aria-label="breadcrumb"
                        sx={{ mb: 2 }}
                    >
                        <Link
                            underline="hover"
                            color="inherit"
                            component={RouterLink}
                            to={
                                JSON.parse(localStorage.getItem("user"))
                                    ?.role === "Super Admin"
                                    ? "/super-admin/dashboard"
                                    : JSON.parse(localStorage.getItem("user"))
                                          ?.role === "HEI Admin"
                                    ? "/hei-admin/dashboard"
                                    : "/hei-staff/dashboard"
                            }
                        >
                            Dashboard
                        </Link>
                        <Typography color="text.primary">
                            Institution Management
                        </Typography>
                    </Breadcrumbs>

                    <ButtonGroup sx={{ mt: 3, display: "flex" }}>
                        <Button
                            variant="contained"
                            startIcon={<UploadIcon />}
                            sx={{
                                backgroundColor: "primary.main",
                                color: "white",
                                "&:hover": { backgroundColor: "primary.dark" },
                            }}
                            onClick={() => setOpenUploadDialog(true)}
                        >
                            Upload Form A
                        </Button>
                    </ButtonGroup>

                    <InstitutionTable
                        institutions={institutions}
                        setSnackbarMessage={setSnackbarMessage}
                        setSnackbarSeverity={setSnackbarSeverity}
                        setSnackbarOpen={setSnackbarOpen}
                    />
                </>
            )}

            {/* Upload Dialog */}
            <Dialog
                open={openUploadDialog}
                onClose={() => setOpenUploadDialog(false)}
            >
                <DialogTitle>Upload Institution Form A</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel id="institution-type-label">
                            Institution Type
                        </InputLabel>
                        <Select
                            labelId="institution-type-label"
                            value={selectedInstitutionType}
                            label="Institution Type"
                            onChange={(e) =>
                                setSelectedInstitutionType(e.target.value)
                            }
                        >
                            <MenuItem value="SUC">SUC</MenuItem>
                            <MenuItem value="LUC">LUC</MenuItem>
                            <MenuItem value="Private">Private</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Select File
                        <input
                            type="file"
                            hidden
                            accept=".xlsx, .xls"
                            onChange={(e) => setSelectedFile(e.target.files[0])}
                        />
                    </Button>
                    {selectedFile && (
                        <Typography sx={{ mt: 1, color: "text.secondary" }}>
                            Selected: {selectedFile.name}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenUploadDialog(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleFileUpload}
                        variant="contained"
                        disabled={!selectedFile || !selectedInstitutionType}
                    >
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>

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
