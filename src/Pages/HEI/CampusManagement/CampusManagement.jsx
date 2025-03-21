import { useState, useEffect } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import axios from "axios";
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Breadcrumbs,
    Link,
} from "@mui/material";

const CampusManagement = () => {
    const { institutionId } = useParams();
    const [campuses, setCampuses] = useState([]);
    const [institutionName, setInstitutionName] = useState("");

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

    return (
        <Box sx={{ p: 2 }}>
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

            <TableContainer component={Paper} sx={{ mt: 2, maxHeight: "65vh" }}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow>
                            {[
                                "Campus Name",
                                "Type",
                                "Code",
                                "Region",
                                "City/Province",
                                "Former Name",
                                "Established",
                                "Land Area (ha)",
                                "Distance (km)",
                                "Auto Code",
                                "Position",
                                "Head",
                                "Latitude",
                                "Longitude",
                            ].map((header, index) => (
                                <TableCell
                                    key={index}
                                    sx={{ fontWeight: "bold", p: 1 }}
                                >
                                    {header}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {campuses.length > 0 ? (
                            campuses.map((campus, index) => (
                                <TableRow key={index} hover>
                                    <TableCell sx={{ p: 1 }}>
                                        {campus.suc_name || "N/A"}
                                    </TableCell>
                                    <TableCell sx={{ p: 1 }}>
                                        {campus.campus_type || "N/A"}
                                    </TableCell>
                                    <TableCell sx={{ p: 1 }}>
                                        {campus.institutional_code || "N/A"}
                                    </TableCell>
                                    <TableCell sx={{ p: 1 }}>
                                        {campus.region || "N/A"}
                                    </TableCell>
                                    <TableCell sx={{ p: 1 }}>
                                        {campus.municipality_city_province ||
                                            "N/A"}
                                    </TableCell>
                                    <TableCell sx={{ p: 1 }}>
                                        {campus.former_name || "N/A"}
                                    </TableCell>
                                    <TableCell sx={{ p: 1 }}>
                                        {campus.year_first_operation || "N/A"}
                                    </TableCell>
                                    <TableCell sx={{ p: 1 }}>
                                        {campus.land_area_hectares || "0.0"}
                                    </TableCell>
                                    <TableCell sx={{ p: 1 }}>
                                        {campus.distance_from_main || "0.0"}
                                    </TableCell>
                                    <TableCell sx={{ p: 1 }}>
                                        {campus.autonomous_code || "N/A"}
                                    </TableCell>
                                    <TableCell sx={{ p: 1 }}>
                                        {campus.position_title || "N/A"}
                                    </TableCell>
                                    <TableCell sx={{ p: 1 }}>
                                        {campus.head_full_name || "N/A"}
                                    </TableCell>
                                    <TableCell sx={{ p: 1 }}>
                                        {campus.latitude_coordinates || "0.0"}
                                    </TableCell>
                                    <TableCell sx={{ p: 1 }}>
                                        {campus.longitude_coordinates || "0.0"}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={14}
                                    align="center"
                                    sx={{ p: 2 }}
                                >
                                    No campuses found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default CampusManagement;
