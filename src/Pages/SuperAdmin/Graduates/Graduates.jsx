/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import axios from "axios";
import config from "../../../utils/config";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import GraduatesTable from "./GraduatesTable";
import { useLoading } from "../../../Context/LoadingContext";
import GraduatesSkeleton from "./GraduatesSkeleton";
import { decryptId } from "../../../utils/encryption";
import { Download, Filter, Upload, Plus } from "lucide-react";
import FilterPopover from "../../../Components/FilterPopover";
import CHEDButton from "../../../Components/CHEDButton";
import AlertComponent from "../../../Components/AlertComponent";
import ManualGraduateDialog from "./ManualGraduateDialog";

const Graduates = () => {
    const [graduates, setGraduates] = useState([]);
    const [loading, setLoading] = useState(false);
    const { showLoading, hideLoading, updateProgress } = useLoading();
    const [searchTerm, setSearchTerm] = useState("");
    const [sexFilter, setSexFilter] = useState("");
    const [yearFilter, setYearFilter] = useState("");
    const [openManualDialog, setOpenManualDialog] = useState(false);
    const [reportYear, setReportYear] = useState(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const { institutionId: encryptedInstitutionId } = useParams();
    const deinstitutionId = decryptId(
        decodeURIComponent(encryptedInstitutionId)
    );
    const [isFilterPopoverOpen, setIsFilterPopoverOpen] = useState(false);

    useEffect(() => {
        fetchGraduates();
        fetchInstitutionReportYear();
    }, []);

    const fetchGraduates = async () => {
        showLoading();
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${config.API_URL}/graduates`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const formattedData = (response.data.data || []).map(
                (graduate) => ({
                    ...graduate,
                    date_of_birth: formatDate(graduate.date_of_birth),
                    date_graduated: formatDate(graduate.date_graduated),
                })
            );
            setGraduates(formattedData);
        } catch (error) {
            console.error("Error fetching graduates:", error);
            AlertComponent.showAlert(
                `Failed to fetch graduates: ${error.message}`,
                "error"
            );
        } finally {
            hideLoading();
            setLoading(false);
        }
    };

    const fetchInstitutionReportYear = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${config.API_URL}/institutions/${deinstitutionId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setReportYear(response.data?.report_year || null);
        } catch (error) {
            console.error(
                "Error fetching institution report year:",
                error
            );
            AlertComponent.showAlert(
                "Failed to fetch institution report year.",
                "error"
            );
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        return `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date
            .getDate()
            .toString()
            .padStart(2, "0")}/${date.getFullYear()}`;
    };

    const handleFileUpload = (event) => {
        console.log("File upload event:", deinstitutionId);
        const file = event.target.files[0];
        if (!file) return;
        showLoading();
        setLoading(true);
        processExcelFile(file, deinstitutionId);
    };

    const processExcelFile = async (file, institutionId) => {
        if (!file) return;

        const token = localStorage.getItem("token");

        if (!token) {
            AlertComponent.showAlert(
                "Authentication token is missing.",
                "error"
            );
            hideLoading();
            setLoading(false);
            return;
        }

        if (!institutionId) {
            AlertComponent.showAlert("Institution ID is missing.", "error");
            hideLoading();
            setLoading(false);
            return;
        }

        try {
            const institutionId = decryptId(encryptedInstitutionId);

            // Fetch the institution's report year
            const institutionResponse = await axios.get(
                `${config.API_URL}/institutions/${institutionId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const institutionReportYear =
                institutionResponse.data?.report_year || null;

            if (!institutionReportYear) {
                AlertComponent.showAlert(
                    "Failed to fetch the institution's report year.",
                    "error"
                );
                setLoading(false);
                updateProgress(0);
                return;
            }

            updateProgress(0);
            const reader = new FileReader();
            reader.readAsBinaryString(file);

            reader.onload = async (event) => {
                const data = event.target.result;
                const workbook = XLSX.read(data, { type: "binary" });

                let allGraduates = [];
                const seenGraduates = new Set();

                for (
                    let sheetIndex = 0;
                    sheetIndex < workbook.SheetNames.length;
                    sheetIndex++
                ) {
                    const sheetName = workbook.SheetNames[sheetIndex];
                    const sheet = workbook.Sheets[sheetName];

                    const jsonData = XLSX.utils.sheet_to_json(sheet, {
                        header: 1,
                        range: 6,
                    });

                    console.log(
                        `Raw JSON data for sheet "${sheetName}":`,
                        jsonData
                    );

                    const validRows = jsonData.filter(
                        (row) =>
                            row.some(
                                (cell) => cell !== undefined && cell !== null
                            ) && row[0]
                    );

                    console.log(
                        `Valid rows for sheet "${sheetName}":`,
                        validRows
                    );

                    if (validRows.length === 0) {
                        console.log(`Skipping empty sheet: ${sheetName}`);
                        continue;
                    }
                    updateProgress(20);
                    const processedGraduates = validRows.map((row) => {
                        const formatDate = (date) => {
                            if (!date) return null;
                            try {
                                const parsedDate = new Date(date);
                                if (isNaN(parsedDate.getTime())) return null;
                                return parsedDate.toISOString().split("T")[0];
                            } catch {
                                return null;
                            }
                        };

                        const yearGranted = row[10]
                            ? parseInt(row[10], 10)
                            : null;

                        return {
                            institution_id: institutionId,
                            student_id: row[0] ? String(row[0]) : null,
                            date_of_birth: formatDate(row[1]),
                            last_name: row[2] ? String(row[2]) : null,
                            first_name: row[3] ? String(row[3]) : null,
                            middle_name: row[4] ? String(row[4]) : null,
                            sex: row[5] ? String(row[5]) : null,
                            date_graduated: formatDate(row[6]),
                            program_name: row[7] ? String(row[7]) : null,
                            program_major: row[8] ? String(row[8]) : null,
                            program_authority_to_operate_graduate: row[9]
                                ? String(row[9])
                                : null,
                            year_granted: isNaN(yearGranted)
                                ? null
                                : yearGranted,
                            report_year: institutionReportYear,
                        };
                    });

                    console.log(
                        `Processed graduates for sheet "${sheetName}":`,
                        processedGraduates
                    );

                    processedGraduates.forEach((graduate) => {
                        if (
                            graduate.student_id &&
                            graduate.last_name &&
                            graduate.first_name &&
                            graduate.sex &&
                            graduate.date_of_birth &&
                            graduate.program_name
                        ) {
                            const graduateString = JSON.stringify(graduate);
                            if (!seenGraduates.has(graduateString)) {
                                seenGraduates.add(graduateString);
                                allGraduates.push(graduate);
                            }
                        }
                    });
                }

                console.log("Final processed graduates:", allGraduates);

                if (allGraduates.length === 0) {
                    AlertComponent.showAlert(
                        "No valid graduate data found in the file.",
                        "error"
                    );
                    hideLoading();
                    setLoading(false);
                    return;
                }

                uploadToBackend(allGraduates);
            };

            reader.onerror = (error) => {
                console.error("Error reading Excel file:", error);
                AlertComponent.showAlert(
                    `Failed to read Excel file: ${error.message}`,
                    "error"
                );
                hideLoading();
                setLoading(false);
            };
            updateProgress(80);
        } catch (error) {
            console.error("Error processing Excel file:", error);
            AlertComponent.showAlert(
                `Failed to process Excel file: ${error.message}`,
                "error"
            );
            hideLoading();
            setLoading(false);
        }
    };

    const uploadToBackend = async (data) => {
        console.log("Uploading data to backend:", data);
        try {
            updateProgress(90);
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${config.API_URL}/graduates`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            AlertComponent.showAlert(
                response.data.message || "Graduates uploaded successfully!",
                "success"
            );
            updateProgress(100);
            fetchGraduates();
        } catch (error) {
            console.error("Error uploading graduates:", error);
            let errorMessage = "Failed to upload graduates.";
            if (
                error.response?.status === 422 &&
                error.response?.data?.errors
            ) {
                const errors = error.response.data.errors;
                const errorDetails = Object.values(errors).flat().join("; ");
                errorMessage = `Validation failed: ${errorDetails}`;
            } else {
                errorMessage = `Failed to upload graduates: ${
                    error.response?.data?.message || error.message
                }`;
            }
            AlertComponent.showAlert(errorMessage, "error");
            hideLoading();
            setLoading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Graduates");

        worksheet.columns = [
            { header: "Student ID", key: "student_id", width: 15 },
            { header: "Last Name", key: "last_name", width: 20 },
            { header: "First Name", key: "first_name", width: 20 },
            { header: "Middle Name", key: "middle_name", width: 20 },
            { header: "Sex", key: "sex", width: 10 },
            { header: "Date of Birth", key: "date_of_birth", width: 15 },
            { header: "Date Graduated", key: "date_graduated", width: 15 },
            { header: "Program Name", key: "program_name", width: 30 },
            { header: "Program Major", key: "program_major", width: 20 },
            {
                header: "Program Authority",
                key: "program_authority_to_operate_graduate",
                width: 25,
            },
            { header: "Year Granted", key: "year_granted", width: 15 },
        ];

        filteredGraduates.forEach((graduate) => {
            worksheet.addRow(graduate);
        });

        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
        headerRow.alignment = { vertical: "middle", horizontal: "center" };
        headerRow.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF000000" },
        };

        worksheet.columns.forEach((column) => {
            column.alignment = { vertical: "middle", wrapText: true };
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, "Graduates_List.xlsx");
    };

    const uniqueYears = [
        ...new Set(graduates.map((g) => g.year_granted).filter(Boolean)),
    ].sort();

    const filteredGraduates = graduates.filter((graduate) => {
        const term = searchTerm.toLowerCase();
        const matchesSearch =
            !searchTerm ||
            (graduate.student_id &&
                graduate.student_id.toLowerCase().includes(term)) ||
            (graduate.first_name &&
                graduate.first_name.toLowerCase().includes(term)) ||
            (graduate.last_name &&
                graduate.last_name.toLowerCase().includes(term)) ||
            (graduate.program_name &&
                graduate.program_name.toLowerCase().includes(term));

        const matchesSex = !sexFilter || graduate.sex === sexFilter;
        const matchesYear =
            !yearFilter || String(graduate.year_granted) === yearFilter;

        return matchesSearch && matchesSex && matchesYear;
    });

    const filterOptions = {
        sex: ["M", "F"],
        year: uniqueYears.map(String),
    };

    const filters = {
        sex: sexFilter,
        year: yearFilter,
    };

    const handleFilterChange = (key, value) => {
        if (key === "sex") setSexFilter(value);
        if (key === "year") setYearFilter(value);
    };

    const handleClearFilters = () => {
        setSexFilter("");
        setYearFilter("");
    };

    if (loading) {
        return <GraduatesSkeleton />;
    }

    return (
        <div className="p-6 flex flex-col h-screen max-w-full sm:max-w-[95vw] md:max-w-[98vw] overflow-x-auto overflow-y-auto md:overflow-y-hidden">
            {/* Breadcrumbs */}
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="flex space-x-2 text-gray-600">
                    <li>
                        <a
                            href="#"
                            onClick={() => navigate("/super-admin/dashboard")}
                            className="hover:underline"
                        >
                            Dashboard
                        </a>
                    </li>
                    <li className="text-gray-400">›</li>
                    <li>
                        <a
                            href="#"
                            onClick={() =>
                                navigate("/super-admin/institutions")
                            }
                            className="hover:underline"
                        >
                            Institution Management
                        </a>
                    </li>
                    <li className="text-gray-400">›</li>
                    <li className="text-gray-900">List of Graduates</li>
                </ol>
            </nav>

            {/* Header */}
            <div className="flex justify-between items-center mb-4 p-2 bg-gray-50 border border-gray-200 rounded-md">
                <h1 className="text-xl font-semibold text-gray-800">
                    List of Graduates
                </h1>
                <div className="flex gap-2">
                    {/* Add Manual Graduate Button */}
                    <CHEDButton
                        onClick={() => setOpenManualDialog(true)}
                        icon={Plus}
                        variant="primary"
                        size="md"
                        disabled={loading || !reportYear}
                    >
                        Add Graduate
                    </CHEDButton>

                    {/* Upload Button */}
                    <CHEDButton
                        onClick={() => fileInputRef.current?.click()}
                        icon={Upload}
                        variant="primary"
                        size="md"
                        disabled={loading}
                    >
                        {loading ? "Uploading..." : "Upload Excel File"}
                    </CHEDButton>
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleFileUpload}
                        ref={fileInputRef}
                        className="hidden"
                        id="upload-excel"
                    />

                    {/* Export Button */}
                    <CHEDButton
                        onClick={exportToExcel}
                        icon={Download}
                        variant="secondary"
                        size="md"
                        disabled={loading || graduates.length === 0}
                    >
                        Export to Excel
                    </CHEDButton>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-2 mb-2 items-center flex-wrap">
                <div className="flex flex-1 gap-2 flex-wrap w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="min-w-[30vw] px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="relative">
                        <button
                            onClick={() =>
                                setIsFilterPopoverOpen(!isFilterPopoverOpen)
                            }
                            className="px-3 py-2 flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-md text-sm text-gray-700"
                        >
                            <Filter size={16} />
                            Filters
                        </button>
                        <FilterPopover
                            open={isFilterPopoverOpen}
                            onClose={() => setIsFilterPopoverOpen(false)}
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            onClearFilters={handleClearFilters}
                            filterOptions={filterOptions}
                        />
                    </div>
                </div>
            </div>

            {/* Graduates Table */}
            <GraduatesTable graduates={filteredGraduates} institutionId={deinstitutionId}
                reportYear={reportYear} onSuccess={fetchGraduates} />

            {/* Manual Graduate Dialog */}
            <ManualGraduateDialog
                open={openManualDialog}
                onClose={() => setOpenManualDialog(false)}
                institutionId={deinstitutionId}
                reportYear={reportYear}
                onSuccess={fetchGraduates}
            />
        </div>
    );
};

export default Graduates;
