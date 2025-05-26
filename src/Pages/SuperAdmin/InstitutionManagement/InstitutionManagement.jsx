/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { Search, Upload, Plus, Filter } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import config from "../../../utils/config";
import AlertComponent from "../../../Components/AlertComponent";
import ManualInstitutionDialog from "./ManualInstitutionDialog";
import { useLoading } from "../../../Context/LoadingContext";
import UploadDialog from "./UploadDialog";
import InstitutionTable from "./InstitutionTable";
import FilterPopover from "../../../Components/FilterPopover";
import CHEDButton from "../../../Components/CHEDButton";

const InstitutionManagement = () => {
    const [institutions, setInstitutions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showLoading, hideLoading, updateProgress } = useLoading();
    const [openManualDialog, setOpenManualDialog] = useState(false);
    const [openUploadDialog, setOpenUploadDialog] = useState(false);
    const [selectedInstitutionType, setSelectedInstitutionType] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedMunicipality, setSelectedMunicipality] = useState("");
    const [openFilterPopover, setOpenFilterPopover] = useState(false);

    // Filter states
    const [searchTerm, setSearchTerm] = useState(
        localStorage.getItem("searchTerm") || ""
    );
    const [typeFilter, setTypeFilter] = useState(
        localStorage.getItem("typeFilter") || ""
    );
    const [municipalityFilter, setMunicipalityFilter] = useState(
        localStorage.getItem("municipalityFilter") || ""
    );
    const [provinceFilter, setProvinceFilter] = useState(
        localStorage.getItem("provinceFilter") || ""
    );
    const [reportYearFilter, setReportYearFilter] = useState(
        localStorage.getItem("reportYearFilter") || ""
    );

    // Get unique values for filter options
    const getUniqueValues = (arr, key) => {
        if (!Array.isArray(arr) || arr.length === 0) {
            return [];
        }
        return [
            ...new Set(
                arr
                    .map((item) => item?.[key])
                    .filter((value) => value !== null && value !== undefined)
            ),
        ].sort((a, b) => b - a); // Sort years in descending order (newest first)
    };

    // Filter options for dropdowns
    const filterOptions = useMemo(() => {
        const filteredInstitutions = institutions.filter(
            (institution) =>
                !reportYearFilter ||
                String(institution.report_year) === reportYearFilter
        );

        const reportYears = getUniqueValues(institutions, "report_year");

        // Set reportYearFilter to the newest year if not set
        if (!reportYearFilter && reportYears.length > 0) {
            setReportYearFilter(String(reportYears[0]));
            localStorage.setItem("reportYearFilter", String(reportYears[0]));
        }

        return {
            types: getUniqueValues(filteredInstitutions, "institution_type"),
            municipalities: getUniqueValues(filteredInstitutions, "municipality"),
            provinces: getUniqueValues(filteredInstitutions, "province"),
            reportYears,
        };
    }, [institutions, reportYearFilter]);

    // Persist filters to localStorage
    useEffect(() => {
        localStorage.setItem("searchTerm", searchTerm);
        localStorage.setItem("typeFilter", typeFilter);
        localStorage.setItem("municipalityFilter", municipalityFilter);
        localStorage.setItem("provinceFilter", provinceFilter);
        localStorage.setItem("reportYearFilter", reportYearFilter);
    }, [
        searchTerm,
        typeFilter,
        municipalityFilter,
        provinceFilter,
        reportYearFilter,
    ]);

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm("");
        setTypeFilter("");
        setMunicipalityFilter("");
        setProvinceFilter("");
        // Set to the newest year from filterOptions
        const newestYear =
            filterOptions.reportYears.length > 0
                ? String(filterOptions.reportYears[0])
                : "";
        setReportYearFilter(newestYear);
        localStorage.setItem("searchTerm", "");
        localStorage.setItem("typeFilter", "");
        localStorage.setItem("municipalityFilter", "");
        localStorage.setItem("provinceFilter", "");
        localStorage.setItem("reportYearFilter", newestYear);
    };

    // Get institution type from user
    const getInstitutionType = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        return user?.institution_type || "Unknown";
    };

    // Fetch institutions from API
    const fetchInstitutions = async () => {
        setLoading(true);
        try {
            showLoading();
            const token = localStorage.getItem("token");
            const user = JSON.parse(localStorage.getItem("user"));

            const response = await axios.get(`${config.API_URL}/institutions`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            let institutionsData = [];
            if (user?.role !== "super-admin") {
                institutionsData = response.data.filter(
                    (institution) => institution.id === user?.institution_id
                );
            } else {
                institutionsData = response.data;
            }
            setInstitutions(institutionsData);
        } catch (error) {
            console.error("Error fetching institutions:", error);
            AlertComponent.showAlert(
                "Failed to load institution data.",
                "error"
            );
            hideLoading();
        } finally {
            setLoading(false);
            hideLoading();
        }
    };

    // Fetch institutions on mount
    useEffect(() => {
        fetchInstitutions();
    }, []);

    // Handle file upload for Form A
    const handleFileUpload = async (reportYear, uuid) => {
        if (!selectedFile || !selectedInstitutionType) {
            AlertComponent.showAlert(
                "Please select both an institution type and a file.",
                "warning"
            );
            return;
        }
        setOpenUploadDialog(false);
        updateProgress(10);

        const reader = new FileReader();
        reader.onload = async (e) => {
            updateProgress(30);
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                updateProgress(40);

                const sheetA1 = workbook.Sheets[workbook.SheetNames[0]];
                const jsonDataA1 = XLSX.utils.sheet_to_json(sheetA1, {
                    header: 1,
                });

                const toNullableInteger = (value) => {
                    if (!value || value === "N/A" || value === "") return null;
                    const parsed = Number.parseInt(value, 10);
                    return isNaN(parsed) ? null : parsed;
                };

                const extractedInstitution = {
                    uuid: String(uuid || ""),
                    name: String(jsonDataA1[4]?.[2] || "Unknown"),
                    region_id: Number.parseInt(selectedRegion, 10) || null,
                    address_street: String(jsonDataA1[7]?.[2] || ""),
                    municipality_id:
                        Number.parseInt(selectedMunicipality, 10) || null,
                    province_id: Number.parseInt(selectedProvince, 10) || null,
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
                    report_year: reportYear,
                };

                updateProgress(50);
                const token = localStorage.getItem("token");
                const institutionResponse = await axios.post(
                    `${config.API_URL}/institutions`,
                    extractedInstitution,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                console.log("Institution response:", institutionResponse.data);

                const institutionId = institutionResponse.data.id;
                if (!institutionId || isNaN(Number(institutionId))) {
                    throw new Error(
                        "Invalid institution ID received from server."
                    );
                }
                console.log("Institution ID:", institutionId);

                const sheetA2 = workbook.Sheets[workbook.SheetNames[1]];
                const jsonDataA2 = XLSX.utils.sheet_to_json(sheetA2, {
                    header: 1,
                });

                const startRow = 10;
                const currentYear = new Date().getFullYear();

                const processedCampuses = jsonDataA2
                    .slice(startRow)
                    .filter((row) =>
                        row.some((cell) => cell !== undefined && cell !== "")
                    )
                    .map((row) => {
                        const parseNumeric = (value, min, max) => {
                            if (
                                value === undefined ||
                                value === "" ||
                                isNaN(value)
                            )
                                return null;
                            const num = Number.parseFloat(value);
                            if (min !== undefined && num < min) return null;
                            if (max !== undefined && num > max) return null;
                            return num;
                        };

                        const parseInteger = (value, min, max) => {
                            if (
                                value === undefined ||
                                value === "" ||
                                isNaN(value)
                            )
                                return null;
                            const int = Number.parseInt(value, 10);
                            if (min !== undefined && int < min) return null;
                            if (max !== undefined && int > max) return null;
                            return int;
                        };

                        const parseString = (value) => {
                            if (value === undefined || value === "")
                                return null;
                            const str = String(value).trim();
                            return str.length > 255
                                ? str.substring(0, 255)
                                : str;
                        };

                        return {
                            suc_name: parseString(row[1]),
                            campus_type: parseString(row[2]),
                            institutional_code: parseString(row[3]),
                            region: parseString(row[4]) || "",
                            province_municipality: parseString(row[5]) || "",
                            year_first_operation: parseInteger(
                                row[6],
                                1800,
                                currentYear
                            ),
                            land_area_hectares: parseNumeric(row[7], 0),
                            distance_from_main: parseNumeric(row[8], 0),
                            autonomous_code: parseString(row[9]),
                            position_title: parseString(row[10]),
                            head_full_name: parseString(row[11]),
                            former_name: parseString(row[12]),
                            latitude_coordinates: parseNumeric(
                                row[13],
                                -90,
                                90
                            ),
                            longitude_coordinates: parseNumeric(
                                row[14],
                                -180,
                                180
                            ),
                            institution_id: Number.parseInt(institutionId, 10),
                            report_year: Number.parseInt(reportYear, 10),
                        };
                    });

                updateProgress(70);
                console.log(
                    "Processed campuses:",
                    JSON.stringify(processedCampuses, null, 2)
                );
                await axios.post(
                    `${config.API_URL}/campuses`,
                    processedCampuses,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );


                AlertComponent.showAlert(
                    "Institution and Campuses uploaded successfully!",
                    "success"
                );

                fetchInstitutions();
                updateProgress(100);
            } catch (error) {
                console.error("Error sending data to backend:", error.response.data.error);
                const errorMessage = error.response?.data?.error || "An error occurred";
                AlertComponent.showAlert(
                    `${errorMessage}`,
                    "error"
                );
            } finally {
                hideLoading();
                setOpenUploadDialog(false);
                setSelectedFile(null);
                setSelectedInstitutionType("");
                setSelectedRegion("");
                setSelectedProvince("");
                setSelectedMunicipality("");
            }
        };

        reader.readAsArrayBuffer(selectedFile);
    };

    // Handle manual institution addition
    const handleManualAdd = () => {
        setOpenManualDialog(true);
    };

    // Memoized filtered institutions
    const filteredInstitutions = useMemo(() => {
        // Ensure institutions is an array before filtering
        if (!Array.isArray(institutions)) {
            console.error(
                "Expected institutions to be an array, but got:",
                institutions
            );
            return [];
        }

        return institutions.filter((institution) => {
            const matchesSearch = institution.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            const matchesType = typeFilter
                ? institution.institution_type === typeFilter
                : true;
            const matchesMunicipality = municipalityFilter
                ? institution.municipality === municipalityFilter
                : true;
            const matchesProvince = provinceFilter
                ? institution.province === provinceFilter
                : true;
            const matchesReportYear = reportYearFilter
                ? String(institution.report_year) === reportYearFilter
                : true;
            return (
                matchesSearch &&
                matchesType &&
                matchesMunicipality &&
                matchesProvince &&
                matchesReportYear
            );
        });
    }, [
        institutions,
        searchTerm,
        typeFilter,
        municipalityFilter,
        provinceFilter,
        reportYearFilter,
    ]);

    // Determine dashboard link based on user role
    const user = JSON.parse(localStorage.getItem("user"));
    const dashboardLink =
        user?.role === "super-admin"
            ? "/super-admin/dashboard"
            : user?.role === "hei-admin"
            ? "/hei-admin/dashboard"
            : "/hei-staff/dashboard";

    const filters = {
        typeFilter,
        municipalityFilter,
        provinceFilter,
        reportYearFilter,
    };

    const handleFilterChange = (key, value) => {
        switch (key) {
            case "typeFilter":
                setTypeFilter(value);
                break;
            case "municipalityFilter":
                setMunicipalityFilter(value);
                break;
            case "provinceFilter":
                setProvinceFilter(value);
                break;
            case "reportYearFilter":
                setReportYearFilter(value);
                // Reset dependent filters when the report year changes
                setTypeFilter("");
                setMunicipalityFilter("");
                setProvinceFilter("");
                break;
            default:
                break;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 overflow-x-auto">
            {loading ? (
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center mb-4">
                        <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                        <span className="mx-2 text-gray-500">›</span>
                        <div className="h-5 w-40 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-end gap-2 mb-4">
                        <div className="h-9 w-full sm:w-36 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-9 w-full sm:w-36 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="h-96 w-full bg-gray-200 rounded animate-pulse"></div>
                </div>
            ) : (
                <div className="max-w-8xl mx-auto">
                    {/* Breadcrumbs */}
                    <nav aria-label="breadcrumb" className="mb-4">
                        <ol className="flex items-center space-x-2 text-sm text-gray-600">
                            <li>
                                <RouterLink
                                    to={dashboardLink}
                                    className="hover:text-blue-600 transition-colors"
                                >
                                    Dashboard
                                </RouterLink>
                            </li>
                            <li className="text-gray-500">›</li>
                            <li className="text-gray-900" aria-current="page">
                                Institution Management
                            </li>
                        </ol>
                    </nav>

                    {/* Search, Filters, and Actions */}
                    <div className="bg-gray-100 rounded-lg p-4 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Search Field */}
                            <div className="md:col-span-1">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search institutions..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        aria-label="Search institutions"
                                    />
                                    <Search className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                </div>
                            </div>

                            {/* Filters and Actions */}
                            <div className="md:col-span-2 flex flex-col md:flex-row justify-between gap-4">
                                {/* Filter Button */}
                                <div className="relative flex items-center">
                                    <button
                                        onClick={() =>
                                            setOpenFilterPopover(
                                                (prev) => !prev
                                            )
                                        }
                                        className="px-3 py-2 flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-md text-sm text-gray-700"
                                    >
                                        <Filter size={16} />
                                        Filters
                                    </button>
                                    <FilterPopover
                                        open={openFilterPopover}
                                        onClose={() => setOpenFilterPopover(false)}
                                        filters={filters}
                                        onFilterChange={handleFilterChange}
                                        onClearFilters={clearFilters}
                                        filterOptions={{
                                            typeFilter: filterOptions.types,
                                            municipalityFilter:
                                                filterOptions.municipalities,
                                            provinceFilter:
                                                filterOptions.provinces,
                                            reportYearFilter:
                                                filterOptions.reportYears,
                                        }}
                                    />
                                </div>

                                {/* CHED-Inspired Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-2">
                                    {/* Add Button */}
                                    <CHEDButton
                                        onClick={handleManualAdd}
                                        icon={Plus}
                                        variant="secondary"
                                        size="md"
                                        className="w-full sm:w-auto"
                                    >
                                        Add Institution
                                    </CHEDButton>

                                    {/* Upload Button */}
                                    <CHEDButton
                                        onClick={() =>
                                            setOpenUploadDialog(true)
                                        }
                                        icon={Upload}
                                        variant="primary"
                                        size="md"
                                        className="w-full sm:w-auto"
                                    >
                                        Upload Form A
                                    </CHEDButton>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Institution Table */}
                    <div>
                        <InstitutionTable
                            institutions={filteredInstitutions}
                            fetchInstitutions={fetchInstitutions}
                            searchTerm={searchTerm}
                            typeFilter={typeFilter}
                            municipalityFilter={municipalityFilter}
                            provinceFilter={provinceFilter}
                            reportYearFilter={reportYearFilter}
                            onEdit={(updatedInstitution) => {
                                setInstitutions((prev) =>
                                    prev.map((inst) =>
                                        inst.id === updatedInstitution.id
                                            ? { ...inst, ...updatedInstitution }
                                            : inst
                                    )
                                );
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Upload Dialog */}
            <UploadDialog
                openUploadDialog={openUploadDialog}
                setOpenUploadDialog={setOpenUploadDialog}
                selectedInstitutionType={selectedInstitutionType}
                setSelectedInstitutionType={setSelectedInstitutionType}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                handleFileUpload={handleFileUpload}
                selectedRegion={selectedRegion}
                setSelectedRegion={setSelectedRegion}
                selectedProvince={selectedProvince}
                setSelectedProvince={setSelectedProvince}
                selectedMunicipality={selectedMunicipality}
                setSelectedMunicipality={setSelectedMunicipality}
            />

            {/* Manual Institution Dialog */}
            <ManualInstitutionDialog
                open={openManualDialog}
                onClose={() => setOpenManualDialog(false)}
                getInstitutionType={getInstitutionType}
                fetchInstitutions={fetchInstitutions}
            />
        </div>
    );
};

export default InstitutionManagement;
