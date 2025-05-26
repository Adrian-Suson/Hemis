/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo, useCallback } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import ProgramTables from "./ProgramTables";
import { useNavigate, useParams } from "react-router-dom";
import CurricularProgramSkeleton from "./CurricularProgramSkeleton";
import ExcelJS from "exceljs";
import { useLoading } from "../../../Context/LoadingContext";
import { decryptId } from "../../../utils/encryption";
import config from "../../../utils/config";
import AlertComponent from "../../../Components/AlertComponent";
import {
    Info,
    Upload as UploadIcon,
    Download,
    Upload,
    X,
    Search,
} from "lucide-react";
import CHEDButton from "../../../Components/CHEDButton";
import ProgramInputDialog from "./ProgramInputDialog";
import useActivityLog from "../../../Hooks/useActivityLog"; // Import the hook

const CurricularProgram = () => {
    const { createLog } = useActivityLog(); // Use the hook
    const { institutionId: encryptedInstitutionId } = useParams();
    const [programs, setPrograms] = useState([]);
    const [openReferenceDialog, setOpenReferenceDialog] = useState(false);
    const [mainTabValue, setMainTabValue] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openUploadDialog, setOpenUploadDialog] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const { showLoading, hideLoading, updateProgress } = useLoading();
    const navigate = useNavigate();
    const [openProgramDialog, setOpenProgramDialog] = useState(false);
    const [selectedProgram, setSelectedProgram] = useState(null);

       // Get the user's role from local storage
    const userRole = JSON.parse(localStorage.getItem("user"))?.role || "";


    const categories = useMemo(
        () => [
            "DOCTORATE",
            "MASTERS",
            "POST-BACCALAUREATE",
            "BACCALAUREATE",
            "PRE-BACCALAUREATE",
            "VOC-TECH",
            "BASIC EDUCATION",
        ],
        []
    );

    const fetchPrograms = useCallback(async () => {
        try {
            const institutionId = decryptId(encryptedInstitutionId);
            showLoading();
            setLoading(true);
            const token = localStorage.getItem("token");

            if (!institutionId) {
                console.error("No institution ID found");
                hideLoading();
                setPrograms([]);
                return;
            }

            const response = await axios.get(
                `${config.API_URL}/curricular_programs`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { institution_id: institutionId },
                }
            );
            console.log("Fetched programs:", response.data);
            if (Array.isArray(response.data)) {
                // Normalize program_type to uppercase for consistency
                const normalizedPrograms = response.data.map((program) => ({
                    ...program,
                    program_type: program.program_type?.toUpperCase().trim(),
                }));
                setPrograms(normalizedPrograms);
            } else {
                console.error("Invalid data format:", response.data);
                setPrograms([]);
            }

        } catch (error) {
            console.error("Error fetching programs:", error);
            AlertComponent.showAlert(
                "Failed to fetch programs. Please try again.",
                "error"
            );
            setPrograms([]);
        } finally {
            setLoading(false);
            hideLoading();
        }
    }, [encryptedInstitutionId]);

    useEffect(() => {
        fetchPrograms();
    }, [fetchPrograms]);

    const filteredPrograms = useMemo(() => {
        let filtered = programs.filter(
            (program) =>
                program.program_type?.toUpperCase() ===
                categories[mainTabValue].toUpperCase()
        );

        if (searchTerm) {
            filtered = filtered.filter((program) =>
                program.program_name
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase())
            );
        }

        console.log(
            `Filtered programs (Category: ${categories[mainTabValue]}, Search: ${searchTerm}):`,
            filtered.length
        );

        return filtered;
    }, [programs, mainTabValue, categories, searchTerm]);

    const totalRows = useMemo(() => {
        return programs.filter(
            (program) =>
                program.program_type?.toUpperCase() ===
                categories[mainTabValue].toUpperCase()
        ).length;
    }, [programs, mainTabValue, categories]);

    const handleCurricularUpload = async () => {
        if (!selectedFile) {
            AlertComponent.showAlert("No file selected for upload.", "warning");
            return;
        }

        const token = localStorage.getItem("token");
        const institutionId = decryptId(encryptedInstitutionId);

        if (!institutionId || !token) {
            AlertComponent.showAlert(
                !institutionId
                    ? "Please select an institution first."
                    : "Please log in first.",
                "warning"
            );
            setOpenUploadDialog(false);
            setSelectedFile(null);
            return;
        }

        updateProgress(10);
        setIsUploading(true);
        setLoading(true);

        try {
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
                setIsUploading(false);
                setLoading(false);
                hideLoading();
                return;
            }

            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: "array" });

                    let allParsedData = [];

                    for (let sheetIndex = 0; sheetIndex <= 6; sheetIndex++) {
                        if (!workbook.SheetNames[sheetIndex]) continue;

                        const sheetName = workbook.SheetNames[sheetIndex];
                        const sheet = workbook.Sheets[sheetName];

                        const sheetData = XLSX.utils.sheet_to_json(sheet, {
                            header: 1,
                            range: 10,
                        });

                        const parsedData = sheetData
                            .map((row,) => {
                                console.log(
                                    `Sheet ${sheetName}`, row)
                                const aopYearRaw = row[7];
                                const aopYear =
                                    aopYearRaw !== undefined &&
                                    aopYearRaw !== null &&
                                    !isNaN(aopYearRaw)
                                        ? String(aopYearRaw)
                                        : "N/A";

                                const labUnits = Number(row[12]) || 0;
                                const lectureUnits = Number(row[13]) || 0;
                                const maleTotal =
                                    Number(row[17] || 0) +
                                    Number(row[19] || 0) +
                                    Number(row[21] || 0) +
                                    Number(row[23] || 0) +
                                    Number(row[25] || 0) +
                                    Number(row[27] || 0) +
                                    Number(row[29] || 0) +
                                    Number(row[31] || 0);
                                const femaleTotal =
                                    Number(row[18] || 0) +
                                    Number(row[20] || 0) +
                                    Number(row[22] || 0) +
                                    Number(row[24] || 0) +
                                    Number(row[26] || 0) +
                                    Number(row[28] || 0) +
                                    Number(row[30] || 0) +
                                    Number(row[32] || 0);

                                return {
                                    institution_id: institutionId,
                                    program_name: row[1] || null,
                                    program_code: String(row[2] || ""),
                                    major_name: row[3] || null,
                                    major_code: String(row[4] || ""),
                                    aop_category: row[5] || null,
                                    aop_serial: String(row[6] || ""),
                                    aop_year: aopYear,
                                    is_thesis_dissertation_required:
                                        String(row[8]) || null,
                                    program_status: String(row[9] || ""),
                                    calendar_use_code: String(row[10] || ""),
                                    program_normal_length_in_years:
                                        Number(row[11]) || null,
                                    lab_units: labUnits,
                                    lecture_units: lectureUnits,
                                    total_units: labUnits + lectureUnits,
                                    tuition_per_unit: Number(row[15]) || null,
                                    program_fee: Number(row[16]) || null,
                                    program_type: categories[sheetIndex],
                                    new_students_freshmen_male:
                                        Number(row[17]) || null,
                                    new_students_freshmen_female:
                                        Number(row[18]) || null,
                                    "1st_year_male": Number(row[19]) || null,
                                    "1st_year_female": Number(row[20]) || null,
                                    "2nd_year_male": Number(row[21]) || null,
                                    "2nd_year_female": Number(row[22]) || null,
                                    "3rd_year_male": Number(row[23]) || null,
                                    "3rd_year_female": Number(row[24]) || null,
                                    "4th_year_male": Number(row[25]) || null,
                                    "4th_year_female": Number(row[26]) || null,
                                    "5th_year_male": Number(row[27]) || null,
                                    "5th_year_female": Number(row[28]) || null,
                                    "6th_year_male": Number(row[29]) || null,
                                    "6th_year_female": Number(row[30]) || null,
                                    "7th_year_male": Number(row[31]) || null,
                                    "7th_year_female": Number(row[32]) || null,
                                    subtotal_male: maleTotal,
                                    subtotal_female: femaleTotal,
                                    grand_total: maleTotal + femaleTotal,
                                    lecture_units_actual:
                                        Number(row[36]) || null,
                                    laboratory_units_actual:
                                        Number(row[37]) || null,
                                    total_units_actual:
                                        (Number(row[36]) || 0) +
                                        (Number(row[37]) || 0),
                                    graduates_males: Number(row[39]) || null,
                                    graduates_females: Number(row[40]) || null,
                                    graduates_total:
                                        (Number(row[39]) || 0) +
                                        (Number(row[40]) || 0),
                                    externally_funded_merit_scholars:
                                        Number(row[41]) || null,
                                    internally_funded_grantees:
                                        Number(row[42]) || null,
                                    suc_funded_grantees:
                                        Number(row[43]) || null,
                                    report_year: institutionReportYear,
                                };
                            })
                            .filter(
                                (data) =>
                                    !!data.program_name                            );

                        console.log(
                            `Sheet ${sheetName}: Total rows: ${sheetData.length}, Valid rows: ${parsedData.length}`
                        );

                        console.log(
                            `Sheet ${sheetName}: Total rows: ${sheetData.length}, Valid rows: ${parsedData.length}`
                        );
                        allParsedData = [...allParsedData, ...parsedData];
                    }

                    if (allParsedData.length === 0) {
                        AlertComponent.showAlert(
                            "No valid programs with a program name found in any sheet of the Excel file.",
                            "warning"
                        );
                        setOpenUploadDialog(false);
                        setIsUploading(false);
                        setSelectedFile(null);
                        setLoading(false);
                        hideLoading();
                        return;
                    }

                    try {
                        const createdPrograms = [];
                        const totalRows = allParsedData.length;
                        let processedRows = 0;

                        for (const data of allParsedData) {
                            console.log("Uploading program data:", data);
                            const programResponse = await axios.post(
                                `${config.API_URL}/curricular_programs`,
                                data,
                                {
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                    },
                                }
                            );
                            createdPrograms.push(programResponse.data);
                            processedRows += 1;
                            updateProgress(
                                50 +
                                    Math.round((50 * processedRows) / totalRows)
                            );
                        }

                        setPrograms(createdPrograms);
                        updateProgress(100);
                        fetchPrograms();
                        AlertComponent.showAlert(
                            "Curricular data imported successfully!",
                            "success"
                        );

                        // Log the upload action
                        await createLog({
                            action: "Upload Curricular Programs",
                            description: `Uploaded curricular programs for institution ID: ${institutionId}`,
                        });
                    } catch (error) {
                        console.error(
                            "Error importing curricular data:",
                            error.response?.data
                        );
                        AlertComponent.showAlert(
                            "Error importing curricular data. Check the console for details.",
                            "error"
                        );
                    } finally {
                        setOpenUploadDialog(false);
                        setIsUploading(false);
                        setSelectedFile(null);
                        setLoading(false);
                        hideLoading();
                    }
                } catch (error) {
                    console.error("Error processing file:", error.message);
                    AlertComponent.showAlert(
                        "Error processing file. Check the console for details.",
                        "error"
                    );
                    setIsUploading(false);
                    setOpenUploadDialog(false);
                    setSelectedFile(null);
                    setLoading(false);
                }
            };

            reader.readAsArrayBuffer(selectedFile);
        } catch (error) {
            console.error("Error fetching institution report year:", error);
            AlertComponent.showAlert(
                "Error fetching institution report year. Please try again.",
                "error"
            );
            setIsUploading(false);
            setLoading(false);
            hideLoading();
        }
    };

    const handleExportToExcel = async () => {
        console.log("Programs before export:", programs);
        setLoading(true);
        try {
            updateProgress(10);
            const response = await fetch("/templates/Form-B-Themeplate.xlsx");
            if (!response.ok) {
                throw new Error(
                    `Failed to load template file: HTTP ${response.status}`
                );
            }

            const arrayBuffer = await response.arrayBuffer();

            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(arrayBuffer);

            const dataStartRow = 11;

            const programsByCategory = categories.reduce((acc, category) => {
                acc[category] = programs.filter(
                    (program) =>
                        program.program_type?.toUpperCase() ===
                        category.toUpperCase()
                );
                return acc;
            }, {});

            for (
                let sheetIndex = 0;
                sheetIndex < categories.length;
                sheetIndex++
            ) {
                const sheetName = categories[sheetIndex];
                const worksheet = workbook.worksheets.find(
                    (ws) => ws.name.toUpperCase() === sheetName.toUpperCase()
                );
                if (!worksheet) {
                    continue;
                }
                updateProgress(25);
                const programsForSheet = programsByCategory[sheetName] || [];
                programsForSheet.forEach((program, i) => {
                    const row = worksheet.getRow(dataStartRow + i);
                    row.getCell(2).value = program.program_name || null;
                    row.getCell(3).value = program.program_code || null;
                    row.getCell(4).value = program.major_name || null;
                    row.getCell(5).value = program.major_code || null;
                    row.getCell(6).value = program.category || null;
                    row.getCell(7).value = program.serial || null;
                    row.getCell(8).value = program.Year || null;
                    row.getCell(9).value =
                        program.is_thesis_dissertation_required || null;
                    row.getCell(10).value = program.program_status || null;
                    row.getCell(11).value = program.calendar_use_code || null;
                    row.getCell(12).value =
                        program.program_normal_length_in_years || 0;
                    row.getCell(13).value = program.lab_units || 0;
                    row.getCell(14).value = program.lecture_units || 0;
                    row.getCell(15).value = program.total_units || 0;
                    row.getCell(16).value = program.tuition_per_unit || 0;
                    row.getCell(17).value = program.program_fee || 0;
                    row.getCell(18).value =
                        program.new_students_freshmen_male || 0;
                    row.getCell(19).value =
                        program.new_students_freshmen_female || 0;
                    row.getCell(20).value = program["1st_year_male"] || 0;
                    row.getCell(21).value = program["1st_year_female"] || 0;
                    row.getCell(22).value = program["2nd_year_male"] || 0;
                    row.getCell(23).value = program["2nd_year_female"] || 0;
                    row.getCell(24).value = program["3rd_year_male"] || 0;
                    row.getCell(25).value = program["3rd_year_female"] || 0;
                    row.getCell(26).value = program["4th_year_male"] || 0;
                    row.getCell(27).value = program["4th_year_female"] || 0;
                    row.getCell(28).value = program["5th_year_male"] || 0;
                    row.getCell(29).value = program["5th_year_female"] || 0;
                    row.getCell(30).value = program["6th_year_male"] || 0;
                    row.getCell(31).value = program["6th_year_female"] || 0;
                    row.getCell(32).value = program["7th_year_male"] || 0;
                    row.getCell(33).value = program["7th_year_female"] || 0;
                    row.getCell(34).value = program.subtotal_male || 0;
                    row.getCell(35).value = program.subtotal_female || 0;
                    row.getCell(36).value = program.grand_total || 0;
                    row.getCell(37).value = program.lecture_units_actual || 0;
                    row.getCell(38).value =
                        program.laboratory_units_actual || 0;
                    row.getCell(39).value = program.total_units_actual || 0;
                    row.getCell(40).value = program.graduates_males || 0;
                    row.getCell(41).value = program.graduates_females || 0;
                    row.getCell(42).value = program.graduates_total || 0;
                    row.getCell(43).value =
                        program.externally_funded_merit_scholars || 0;
                    row.getCell(44).value =
                        program.internally_funded_grantees || 0;
                    row.getCell(45).value = program.suc_funded_grantees || 0;
                    row.commit();
                });
            }
            updateProgress(50);
            const fileName = `Form_B_Curricular_Programs_${
                new Date().toISOString().split("T")[0]
            }.xlsx`;
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
            updateProgress(100);
            AlertComponent.showAlert("Data exported successfully!", "success");

            // Log the export action
            await createLog({
                action: "Export Curricular Programs",
                description: "Exported curricular programs to Excel.",
            });
        } catch (error) {
            console.error("Error exporting data:", error);
            AlertComponent.showAlert(
                "Error exporting data. Please try again.",
                "error"
            );
        } finally {
            setLoading(false);
            hideLoading();
        }
    };

    const referenceData = {
        authority: [
            { code: "GP", label: "Government Permit" },
            { code: "GR", label: "Government Recognition" },
            { code: "BR", label: "Board Resolution" },
        ],
        thesisDissertation: [
            { code: "1", label: "Required" },
            { code: "2", label: "Optional" },
            { code: "3", label: "Not Required" },
        ],
        programStatus: [
            { code: "1", label: "Active" },
            { code: "2", label: "Phased Out" },
            { code: "3", label: "Abolished" },
        ],
        calendar: [
            { code: "1", label: "Sem" },
            { code: "2", label: "Tri Sem" },
            { code: "3", label: "Quarter Sem" },
            { code: "4", label: "Distance Mode" },
        ],
    };

    const handleProgramSubmit = async (formData) => {
        try {
            const token = localStorage.getItem("token");
            const institutionId = decryptId(encryptedInstitutionId);

            if (!institutionId || !token) {
                AlertComponent.showAlert(
                    !institutionId
                        ? "Please select an institution first."
                        : "Please log in first.",
                    "warning"
                );
                return;
            }

            // Add institution_id and program_type to the form data
            const programData = {
                ...formData,
                institution_id: institutionId,
                program_type: categories[mainTabValue],
            };


            if (selectedProgram) {
                // Update existing program
                await axios.put(
                    `${config.API_URL}/curricular_programs/${selectedProgram.id}`,
                    programData,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                AlertComponent.showAlert(
                    "Program updated successfully!",
                    "success"
                );
            } else {
                // Create new program
                await axios.post(
                    `${config.API_URL}/curricular_programs`,
                    programData,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                AlertComponent.showAlert(
                    "Program added successfully!",
                    "success"
                );
            }

            setOpenProgramDialog(false);
            setSelectedProgram(null);
            fetchPrograms();
        } catch (error) {
            console.error("Error saving program:", error);
            AlertComponent.showAlert(
                error.response?.data?.message ||
                    "Failed to save program. Please try again.",
                "error"
            );
        }
    };

    if (loading) {
        return <CurricularProgramSkeleton />;
    }

    return (
        <div className="p-6 flex flex-col h-screen max-w-full sm:max-w-[95vw] md:max-w-[98vw] overflow-x-auto overflow-y-auto md:overflow-y-hidden">
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
                    <li className="text-gray-900">Curricular Program</li>
                </ol>
            </nav>

            {/* Header Section */}
            <div className="flex justify-between items-center mb-4 p-2 bg-gray-50 border border-gray-200 rounded-md">
                <h1 className="text-xl font-semibold text-gray-800">
                    Curricular Programs
                </h1>
                <div className="flex space-x-2">
                    {/* Add New Program Button */}
                    <CHEDButton
                        onClick={() => {
                            setSelectedProgram(null);
                            setOpenProgramDialog(true);
                        }}
                        icon={UploadIcon}
                        variant="primary"
                        size="md"
                    >
                        Add New Program
                    </CHEDButton>

                    {/* Import Button */}
                    <CHEDButton
                        onClick={() => setOpenUploadDialog(true)}
                        icon={UploadIcon}
                        variant="primary"
                        size="md"
                        disabled={isUploading}
                    >
                        {isUploading ? "Uploading..." : "Import Form B"}
                    </CHEDButton>

                    {/* Export Button */}
                    <CHEDButton
                        onClick={handleExportToExcel}
                        icon={Download}
                        variant="secondary"
                        size="md"
                        disabled={isUploading}
                    >
                        Export Data
                    </CHEDButton>
                </div>
            </div>

            {/* Search Box */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={16} className="text-gray-400" />
                </div>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
                    placeholder="Search by program name..."
                />
                {searchTerm && (
                    <button
                        onClick={() => setSearchTerm("")}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                        <X
                            size={16}
                            className="text-gray-400 hover:text-gray-600"
                        />
                    </button>
                )}
            </div>

            {/* Program Tables Component */}
            <ProgramTables
                programs={filteredPrograms}
                loading={loading}
                fetchPrograms={fetchPrograms}
                summary={{
                    currentCount: filteredPrograms.length,
                    totalCount: totalRows,
                    searchTerm,
                }}
                onSubmit={handleProgramSubmit}
            />

            {/* Tabs */}
            <div className="flex overflow-x-auto border-b border-gray-300 mb-4 hide-scrollbar">
                {categories.map((category, index) => (
                    <button
                        key={category}
                        onClick={() => setMainTabValue(index)}
                        title={`View programs for ${category}`}
                        className={`flex-1 min-w-[120px] py-3 px-4 text-sm font-medium text-center transition-all relative ${
                            mainTabValue === index
                                ? "text-blue-700 bg-blue-50/50"
                                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                        }`}
                        aria-selected={mainTabValue === index}
                        role="tab"
                        aria-controls={`tab-panel-${index}`}
                        id={`tab-${index}`}
                    >
                        {category}
                        {mainTabValue === index && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-700"></div>
                        )}
                    </button>
                ))}
            </div>

            {/* Info Button */}
            <button
                onClick={() => setOpenReferenceDialog(true)}
                className="fixed bottom-4 right-4 z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                aria-label="Show reference table"
            >
                <Info className="w-5 h-5" />
            </button>

            {/* Upload Dialog */}
            {openUploadDialog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg max-w-md w-full">
                        <div className="bg-blue-50 border-b border-gray-200 px-6 py-4">
                            <h2 className="text-lg font-semibold">
                                Upload Institution Form B
                            </h2>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-gray-500 mb-4">
                                Please upload the Form B Excel document.
                            </p>
                            <div
                                onDrop={(e) => {
                                    e.preventDefault();
                                    if (
                                        e.dataTransfer.files &&
                                        e.dataTransfer.files[0]
                                    ) {
                                        setSelectedFile(
                                            e.dataTransfer.files[0]
                                        );
                                    }
                                }}
                                onDragOver={(e) => e.preventDefault()}
                                onClick={() =>
                                    document
                                        .getElementById("upload-input")
                                        .click()
                                }
                                className="p-4 border-2 border-dashed border-blue-600 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer bg-white"
                            >
                                <Upload className="w-7 h-7 text-blue-600" />
                                <p className="text-sm">
                                    Drag & drop file or click to browse
                                </p>
                                <p className="text-xs text-gray-500">
                                    Supported formats: .xlsx, .xls
                                </p>
                                <input
                                    id="upload-input"
                                    type="file"
                                    hidden
                                    accept=".xlsx, .xls"
                                    onChange={(e) =>
                                        setSelectedFile(e.target.files[0])
                                    }
                                />
                            </div>
                            {selectedFile && (
                                <div className="mt-4 p-4 border border-gray-200 rounded-lg flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Download className="w-5 h-5 text-blue-600 mr-2" />
                                        <div>
                                            <p className="text-sm max-w-[200px] truncate">
                                                {selectedFile.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {(
                                                    selectedFile.size / 1024
                                                ).toFixed(2)}{" "}
                                                KB
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedFile(null)}
                                        className="text-red-600 hover:bg-red-100 rounded-full p-1"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
                            <button
                                onClick={() => setOpenUploadDialog(false)}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCurricularUpload}
                                disabled={!selectedFile || isUploading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                            >
                                Upload
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reference Dialog */}
            {openReferenceDialog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
                            <h2 className="text-lg font-semibold">
                                Reference Table
                            </h2>
                            <button
                                onClick={() => setOpenReferenceDialog(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-200">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="py-2 px-4 border-b border-r border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Authority to Offer Program
                                            </th>
                                            <th className="py-2 px-4 border-b border-r border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Is Thesis/Dissertation Required?
                                            </th>
                                            <th className="py-2 px-4 border-b border-r border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Program Status
                                            </th>
                                            <th className="py-2 px-4 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Program Calendar
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {referenceData.authority.map(
                                            (item, index) => (
                                                <tr key={`authority-${index}`}>
                                                    <td className="py-2 px-4 border-r border-gray-200 text-sm text-gray-900">
                                                        {`${item.code} - ${item.label}`}
                                                    </td>
                                                    <td className="py-2 px-4 border-r border-gray-200 text-sm text-gray-900">
                                                        {index <
                                                        referenceData
                                                            .thesisDissertation
                                                            .length
                                                            ? `${referenceData.thesisDissertation[index].code} - ${referenceData.thesisDissertation[index].label}`
                                                            : "-"}
                                                    </td>
                                                    <td className="py-2 px-4 border-r border-gray-200 text-sm text-gray-900">
                                                        {index <
                                                        referenceData
                                                            .programStatus
                                                            .length
                                                            ? `${referenceData.programStatus[index].code} - ${referenceData.programStatus[index].label}`
                                                            : "-"}
                                                    </td>
                                                    <td className="py-2 px-4 text-sm text-gray-900">
                                                        {index <
                                                        referenceData.calendar
                                                            .length
                                                            ? `${referenceData.calendar[index].code} - ${referenceData.calendar[index].label}`
                                                            : "-"}
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Program Input Dialog */}
            <ProgramInputDialog
                open={openProgramDialog}
                onClose={() => {
                    setOpenProgramDialog(false);
                    setSelectedProgram(null);
                }}
                onSubmit={handleProgramSubmit}
                program={selectedProgram}
            />

            {/* CSS */}
            <style>{`
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
};

export default CurricularProgram;
