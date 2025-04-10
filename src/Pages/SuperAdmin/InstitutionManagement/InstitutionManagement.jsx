import { useState, useEffect } from "react";
import axios from "axios";
import {
    Box,
    Button,
    Typography,
    Breadcrumbs,
    Link,
    ButtonGroup,
    Skeleton,
} from "@mui/material";
import { UploadFile as UploadIcon } from "@mui/icons-material";
import InstitutionTable from "./InstitutionTable";
import { Link as RouterLink } from "react-router-dom";
import CustomSnackbar from "../../../Components/CustomSnackbar";

const InstitutionManagement = () => {
    const [institutions, setInstitutions] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Added loading state
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("info");

    const fetchInstitutions = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                "http://localhost:8000/api/institutions",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setInstitutions(response.data);
        } catch (error) {
            console.error("Error fetching institutions:", error);
            setSnackbarMessage("Failed to fetch institutions.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInstitutions();
    }, []);

    const handleEdit = (institution) => {
        console.log("Editing institution:", institution);
    };

    const handleUploadClick = () => {
        // Placeholder for upload logic
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Breadcrumbs with Skeleton */}
            {isLoading ? (
                <Breadcrumbs
                    separator="›"
                    aria-label="breadcrumb"
                    sx={{ mb: 2 }}
                >
                    <Skeleton variant="text" width={80} />
                    <Skeleton variant="text" width={120} />
                </Breadcrumbs>
            ) : (
                <Breadcrumbs
                    separator="›"
                    aria-label="breadcrumb"
                    sx={{ mb: 2 }}
                >
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
            )}

            {/* Button Group with Skeleton */}
            {isLoading ? (
                <Skeleton
                    variant="rectangular"
                    width={150}
                    height={36}
                    sx={{ mt: 3, ml: "auto" }}
                />
            ) : (
                <ButtonGroup
                    sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}
                >
                    <Button
                        variant="contained"
                        startIcon={<UploadIcon />}
                        sx={{ backgroundColor: "primary.main", color: "white" }}
                        onClick={handleUploadClick}
                    >
                        Upload Form A
                    </Button>
                </ButtonGroup>
            )}

            {/* InstitutionTable with Skeleton */}
            <InstitutionTable
                institutions={institutions}
                onEdit={handleEdit}
                setSnackbarMessage={setSnackbarMessage}
                setSnackbarSeverity={setSnackbarSeverity}
                setSnackbarOpen={setSnackbarOpen}
                isLoading={isLoading}
            />

            {/* Snackbar */}
            <CustomSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={() => setSnackbarOpen(false)}
                autoHideDuration={5000}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            />
        </Box>
    );
};

export default InstitutionManagement;
