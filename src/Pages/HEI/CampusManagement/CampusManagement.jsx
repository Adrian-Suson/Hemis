import { useState, useEffect } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import axios from "axios";
import {
    Box,
    Breadcrumbs,
    Link,
    Typography,
} from "@mui/material";
import CampusHandsontable from "./CampusHandsontable"; // Import the new component

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

            {/* Handsontable Component */}
            <CampusHandsontable campuses={campuses} />
        </Box>
    );
};

export default CampusManagement;