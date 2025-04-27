/* eslint-disable react-hooks/exhaustive-deps */
// CampusManagement.jsx
import { useState, useEffect } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import axios from "axios";
import {
    Box,
    Breadcrumbs,
    Link,
    Typography,
} from "@mui/material";
import CampusHandsontable from "./CampusHandsontable";
import CampusManagementSkeleton from "./CampusManagementSkeleton";
import { useLoading } from "../../../Context/LoadingContext";
import { decryptId } from "../../../utils/encryption";
import config from "../../../utils/config";

const CampusManagement = () => {
    const { institutionId: encryptedInstitutionId } = useParams();
    const [campuses, setCampuses] = useState([]);
    const { showLoading, hideLoading } = useLoading();
    const [institutionName, setInstitutionName] = useState("");
    const [loading, setLoading] = useState(true);


    const fetchCampuses = async () => {
        try {
            const institutionId = decryptId(encryptedInstitutionId);
            setLoading(true);
            showLoading();
            const token = localStorage.getItem("token");

            const response = await axios.get(
                `${config.API_URL}/campuses?institution_id=${institutionId}`,
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
        } finally {
            setLoading(false);
            hideLoading();
        }
    };

    useEffect(() => {
        fetchCampuses();
    }, []);

    if (loading) {
        return <CampusManagementSkeleton />;
    }

    return (
        <Box
            sx={{
                px: { xs: 1, sm: 2, md: 4 },
                py: { xs: 2, sm: 3 },
                width: "100%",
                maxWidth: "100%",
                overflowX: "hidden",
            }}
        >
            {/* Breadcrumbs */}
            <Breadcrumbs
                separator="›"
                aria-label="breadcrumb"
                sx={{
                    mb: { xs: 1, sm: 2 },
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    flexWrap: "wrap",
                }}
            >
                <Link
                    underline="hover"
                    color="inherit"
                    component={RouterLink}
                    to="/Super-admin/dashboard"
                >
                    Dashboard
                </Link>
                <Link
                    underline="hover"
                    color="inherit"
                    component={RouterLink}
                    to="/Super-admin/institutions"
                >
                    Institution Management
                </Link>
                <Typography
                    color="text.primary"
                    fontSize={{ xs: "0.9rem", sm: "1rem" }}
                >
                    {institutionName
                        ? `${institutionName} Campuses`
                        : "Campuses"}
                </Typography>
            </Breadcrumbs>

            {/* Handsontable Component */}
            <Box
                sx={{
                    mt: 2,
                    overflowX: "auto",
                    maxWidth: "100%",
                }}
            >
                <CampusHandsontable campuses={campuses} />
            </Box>
        </Box>
    );
};

export default CampusManagement;
