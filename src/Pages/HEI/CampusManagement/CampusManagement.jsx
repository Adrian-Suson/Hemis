/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import axios from "axios";
import CampusHandsontable from "./CampusHandsontable";
import CampusManagementSkeleton from "./CampusManagementSkeleton";
import { useLoading } from "../../../Context/LoadingContext";
import { decryptId } from "../../../utils/encryption";
import config from "../../../utils/config";

const CampusManagement = () => {
    const { institutionId: encryptedInstitutionId } = useParams();
    const [campuses, setCampuses] = useState([]);
    const { showLoading, hideLoading } = useLoading();
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem("user"));

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
        <div className="px-4 sm:px-8 md:px-16 py-4 sm:py-6 w-full max-w-full overflow-x-hidden">
            {/* Breadcrumbs */}
            <nav
                aria-label="breadcrumb"
                className="mb-2 sm:mb-4 text-sm sm:text-base flex flex-wrap items-center"
            >
                <RouterLink
                    to={user?.role === "HEI Staff" ? "/hei-staff/dashboard" : "/hei-admin/dashboard"}
                    className="text-gray-600 hover:text-gray-800 hover:underline"
                >
                    Dashboard
                </RouterLink>
                <span className="mx-2 text-gray-500">›</span>
                <RouterLink
                    to={user?.role === "HEI Staff" ? "/hei-staff/institutions" : "/hei-admin/institutions"}
                    className="text-gray-600 hover:text-gray-800 hover:underline"
                >
                    Institution Management
                </RouterLink>
                <span className="mx-2 text-gray-500">›</span>
                <span className="text-gray-900 text-sm sm:text-base">
                    Campus Management
                </span>
            </nav>

            {/* Handsontable Component */}
            <div className="mt-4 overflow-x-auto max-w-full">
                <CampusHandsontable
                    campuses={campuses}
                    fetchCampuses={fetchCampuses}
                />
            </div>
        </div>
    );
};

export default CampusManagement;
