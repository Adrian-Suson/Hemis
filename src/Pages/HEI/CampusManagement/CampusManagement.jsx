import { useState, useEffect } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import axios from "axios";
import {
    Box,
    Breadcrumbs,
    Link,
    Typography,
    Fab,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Grid,
} from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
import CampusHandsontable from "./CampusHandsontable";

const CampusManagement = () => {
    const { institutionId } = useParams();
    const [campuses, setCampuses] = useState([]);
    const [institutionName, setInstitutionName] = useState("");
    const [openReferenceDialog, setOpenReferenceDialog] = useState(false);

    useEffect(() => {
        const fetchCampuses = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `http://localhost:8000/api/campuses?institution_id=${institutionId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                console.log("Fetched Campuses Data:", response.data);
                setCampuses(response.data.campuses || []);
                setInstitutionName(
                    response.data.institution_name || "Unknown Institution"
                );
            } catch (error) {
                console.error("Error fetching campuses:", error);
                setCampuses([]);
            }
        };

        fetchCampuses();
    }, [institutionId]);

    // Reference data
    const regions = [
        { code: "1", name: "Ilocos Region (Region I)" },
        { code: "2", name: "Cagayan Valley (Region II)" },
        { code: "3", name: "Central Luzon (Region III)" },
        { code: "4", name: "CALABARZON (Region IV-A)" },
        { code: "5", name: "Bicol Region (Region V)" },
        { code: "6", name: "Western Visayas (Region VI)" },
        { code: "7", name: "Central Visayas (Region VII)" },
        { code: "8", name: "Eastern Visayas (Region VIII)" },
        { code: "9", name: "Zamboanga Peninsula (Region IX)" },
        { code: "10", name: "Northern Mindanao (Region X)" },
        { code: "11", name: "Davao Region (Region XI)" },
        { code: "12", name: "SOCCSKSARGEN (Region XII)" },
        { code: "13", name: "National Capital Region (NCR)" },
        { code: "14", name: "Cordillera Administrative Region (CAR)" },
        { code: "15", name: "Autonomous Region in Muslim Mindanao (ARMM)" },
        { code: "16", name: "Caraga (Region XIII)" },
        { code: "17", name: "MIMAROPA (Region IV-B)" },
    ];

    const positions = [
        { code: "01", name: "President" },
        { code: "02", name: "Chancellor" },
        { code: "03", name: "Executive Director" },
        { code: "04", name: "Dean" },
        { code: "05", name: "Rector" },
        { code: "06", name: "Head" },
        { code: "07", name: "Administrator" },
        { code: "08", name: "Principal" },
        { code: "09", name: "Managing Director" },
        { code: "10", name: "Director" },
        { code: "11", name: "Chair" },
        { code: "12", name: "Others" },
        { code: "99", name: "Not Known or Not Indicated" },
    ];

    const autonomousCodes = [
        { code: "1", name: "The SUC is Autonomous from the Main Campus" },
        { code: "2", name: "The SUC is Not Autonomous from the Main Campus" },
        { code: "3", name: "No Information on the Matter" },
    ];

    // Handlers for dialog
    const handleOpenReferenceDialog = () => setOpenReferenceDialog(true);
    const handleCloseReferenceDialog = () => setOpenReferenceDialog(false);

    return (
        <Box sx={{ p: 2, position: "relative" }}>
            {/* Breadcrumbs */}
            <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 2 }}>
                <Link
                    underline="hover"
                    color="inherit"
                    component={RouterLink}
                    to="/hei-admin/dashboard"
                >
                    Dashboard
                </Link>
                <Link
                    underline="hover"
                    color="inherit"
                    component={RouterLink}
                    to="/hei-admin/institutions"
                >
                    Institution Management
                </Link>
                <Typography color="text.primary">
                    {institutionName
                        ? `${institutionName} Campuses`
                        : "Campuses"}
                </Typography>
            </Breadcrumbs>

            {/* Handsontable Component */}
            <CampusHandsontable campuses={campuses} />

            {/* Floating Action Button for Reference */}
            <Tooltip title="Reference Guide" placement="right">
                <Fab
                    color="primary"
                    aria-label="reference"
                    onClick={handleOpenReferenceDialog}
                    sx={{
                        position: "fixed",
                        bottom: 100,
                        right: 16,
                    }}
                >
                    <HelpIcon />
                </Fab>
            </Tooltip>

            {/* Reference Dialog */}
            <Dialog
                open={openReferenceDialog}
                onClose={handleCloseReferenceDialog}
                maxWidth="lg" // Increased width to accommodate side-by-side tables
                fullWidth
            >
                <DialogTitle>Reference Guide</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        {/* Regions Table */}
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" gutterBottom>
                                Regions
                            </Typography>
                            <TableContainer
                                component={Paper}
                                sx={{ maxHeight: 400, overflowY: "auto" }}
                            >
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Code</TableCell>
                                            <TableCell>Name</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {regions.map((region) => (
                                            <TableRow key={region.code}>
                                                <TableCell>
                                                    {region.code}
                                                </TableCell>
                                                <TableCell>
                                                    {region.name}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>

                        {/* Positions Table */}
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" gutterBottom>
                                Positions
                            </Typography>
                            <TableContainer
                                component={Paper}
                                sx={{ maxHeight: 400, overflowY: "auto" }}
                            >
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Code</TableCell>
                                            <TableCell>Name</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {positions.map((position) => (
                                            <TableRow key={position.code}>
                                                <TableCell>
                                                    {position.code}
                                                </TableCell>
                                                <TableCell>
                                                    {position.name}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>

                        {/* Autonomous Codes Table */}
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" gutterBottom>
                                Autonomous Codes
                            </Typography>
                            <TableContainer
                                component={Paper}
                                sx={{ maxHeight: 400, overflowY: "auto" }}
                            >
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Code</TableCell>
                                            <TableCell>Description</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {autonomousCodes.map((code) => (
                                            <TableRow key={code.code}>
                                                <TableCell>
                                                    {code.code}
                                                </TableCell>
                                                <TableCell>
                                                    {code.name}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default CampusManagement;
