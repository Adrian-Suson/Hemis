/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CampusHandsontable from "./CampusHandsontable";
import CampusManagementSkeleton from "./CampusManagementSkeleton";
import { useLoading } from "../../../Context/LoadingContext";
import { decryptId } from "../../../utils/encryption";
import config from "../../../utils/config";

const CampusManagement = () => {
    const { institutionId: encryptedInstitutionId } = useParams();
    const [campuses, setCampuses] = useState([]);
    const navigate = useNavigate();
    const { showLoading, hideLoading } = useLoading();
    const [loading, setLoading] = useState(true);

    // Get the user's role from local storage
    const userRole = JSON.parse(localStorage.getItem("user"))?.role || "";

    const fetchCampuses = async () => {
        try {
            const institutionId = decryptId(encryptedInstitutionId);
            setLoading(true);
            showLoading();
            console.log("Institution ID:", institutionId);
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
        return Loading...;
    }

    return (
        <div className="px-4 sm:px-8 md:px-16 py-4 sm:py-6 w-full max-w-full overflow-x-hidden">
            {/* Breadcrumbs */}
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="flex space-x-2 text-gray-600">
                    <li>
                        <a
                            href="#"
                            onClick={() => navigate(`/${userRole}/dashboard`)}
                            className="hover:underline"
                        >
                            Dashboard
                        </a>
                    </li>
                    <li className="text-gray-400">›</li>
                    <li className="text-gray-400">›</li>
                    <li>
                        <a
                            href="#"
                            onClick={() => navigate(`/${userRole}/institutions`)}
                            className="hover:underline"
                        >
                            Institution Management
                        </a>
                    </li>
                    <li className="text-gray-400">›</li>
                    <li className="text-gray-900">Faculties Management</li>
                </ol>
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
