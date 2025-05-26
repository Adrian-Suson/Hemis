/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import FacultyProfileTable from "./FacultyProfileTable";
import { useNavigate, useParams } from "react-router-dom";
import FacultyProfileSkeleton from "./FacultyProfileSkeleton";
import ExcelJS from "exceljs";
import { useLoading } from "../../../Context/LoadingContext";
import { decryptId } from "../../../utils/encryption";
import config from "../../../utils/config";
import AlertComponent from "../../../Components/AlertComponent";
import { Download, Upload, X, Plus } from "lucide-react";
import CHEDButton from "../../../Components/CHEDButton";
import AddFacultyDialog from "./AddFacultyDialog";
import useActivityLog from "../../../Hooks/useActivityLog"; // Import the hook

const facultyGroups = [
    {
        label: "Group A1",
        sheetName: "GROUP A1",
        description:
            "FULL-TIME FACULTY MEMBERS WITH THEIR OWN FACULTY PLANTILLA ITEMS TEACHING AT ELEM, SECONDARY AND TECH/VOC",
    },
    {
        label: "Group A2",
        sheetName: "GROUP A2",
        description:
            "HALF-TIME FACULTY MEMBERS WITH THEIR OWN FACULTY PLANTILLA ITEMS",
    },
    {
        label: "Group A3",
        sheetName: "GROUP A3",
        description:
            "PERSONS OCCUPYING RESEARCH PLANTILLA ITEMS BUT CLASSIFIED AS REGULAR FACULTY",
    },
    {
        label: "Group B",
        sheetName: "GROUP B",
        description:
            "FULL-TIME FACULTY MEMBERS WITHOUT ITEMS BUT DRAWING SALARIES FROM THE PS ITEMS OF FACULTY ON LEAVE WITHOUT PAY",
    },
    {
        label: "Group C1",
        sheetName: "GROUP C1",
        description:
            "FULL-TIME FACULTY MEMBERS WITHOUT ITEMS DRAWING SALARIES FROM GAA PS LUMP SUMS",
    },
    {
        label: "Group C2",
        sheetName: "GROUP C2",
        description:
            "FULL-TIME FACULTY MEMBERS WITHOUT ITEMS PAID DRAWING SALARIES FROM SUC INCOME",
    },
    {
        label: "Group C3",
        sheetName: "GROUP C3",
        description:
            "FULL-TIME FACULTY MEMBERS WITH NO PS ITEMS DRAWING SALARIES FROM LGU FUNDS",
    },
    {
        label: "Group D",
        sheetName: "GROUP D",
        description:
            "TEACHING FELLOWS AND TEACHING ASSOCIATES (but not Graduate Assistants)",
    },
    {
        label: "Group E",
        sheetName: "GROUP E",
        description:
            "LECTURERS AND ALL OTHER PART-TIME FACULTY WITH NO ITEMS (e.g. PROFS EMERITI, ADJUNCT/AFFILIATE FACULTY, VISITING PROFS, etc.)",
    },
];

const FacultyProfileUpload = () => {
    const [selectedGroup, setSelectedGroup] = useState(
        facultyGroups[0].sheetName
    );
    const [facultyProfiles, setFacultyProfiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const { showLoading, hideLoading, updateProgress } = useLoading();
    const [error, setError] = useState(null);
    const { institutionId: encryptedInstitutionId } = useParams();
    const navigate = useNavigate();
    const [openUploadDialog, setOpenUploadDialog] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const { createLog } = useActivityLog(); // Use the hook

    // Fetch all faculty profiles on component mount
    useEffect(() => {
        fetchFacultyProfiles();
        console.log("selectedGroup:", selectedGroup);
    }, []);

    const fetchFacultyProfiles = async () => {
        setLoading(true);
        showLoading();
        setError(null);

        const institutionId = decryptId(
            decodeURIComponent(encryptedInstitutionId)
        );

        if (!institutionId || isNaN(institutionId)) {
            AlertComponent.showAlert("Invalid institution ID.", "error");
            setLoading(false);
            hideLoading();
            setFacultyProfiles([]);
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                AlertComponent.showAlert(
                    "Authentication token is missing.",
                    "error"
                );
                setLoading(false);
                hideLoading();
                return;
            }

            const url = `${config.API_URL}/faculty-profiles?institution_id=${institutionId}`;
            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setFacultyProfiles(
                Array.isArray(response.data) ? response.data : []
            );
        } catch (error) {
            console.error("Error fetching faculty profiles:", error);
            AlertComponent.showAlert(
                "Failed to load faculty profiles. Please try again.",
                "error"
            );
            setFacultyProfiles([]);
        } finally {
            setLoading(false);
            hideLoading();
        }
    };

    const handleTabChange = (newValue) => {
        setSelectedGroup(newValue);
    };

    const filteredFacultyProfiles = useMemo(() => {
        return facultyProfiles.filter(
            (profile) => profile.faculty_group === selectedGroup
        );
    }, [facultyProfiles, selectedGroup]);

    const handleExcelFileUpload = async () => {
        if (!selectedFile) {
            AlertComponent.showAlert("No file selected for upload.", "error");
            return;
        }

        AlertComponent.showConfirmation(
            "Do you want to upload the selected file?",
            async () => {
                setOpenUploadDialog(false);
                setIsUploading(true);
                updateProgress(5); // Initial progress update

                const token = localStorage.getItem("token");
                if (!token) {
                    AlertComponent.showAlert(
                        "Authentication token is missing.",
                        "error"
                    );
                    setIsUploading(false);
                    hideLoading();
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
                        setIsUploading(false);
                        setLoading(false);
                        hideLoading();
                        return;
                    }
                    const reader = new FileReader();
                    reader.readAsArrayBuffer(selectedFile); // Use readAsArrayBuffer

                    reader.onload = async (event) => {
                        const data = new Uint8Array(event.target.result); // Convert to Uint8Array
                        const workbook = XLSX.read(data, { type: "array" });

                        let allFacultyProfiles = [];
                        const seenProfiles = new Set();

                        for (let sheetIndex = 0; sheetIndex < 9; sheetIndex++) {
                            const sheetName = workbook.SheetNames[sheetIndex];
                            const sheet = workbook.Sheets[sheetName];

                            updateProgress(10 + sheetIndex * 10);

                            const jsonData = XLSX.utils.sheet_to_json(sheet, {
                                header: 1,
                                range: 6,
                            });

                            const validRows = jsonData.filter(
                                (row) =>
                                    row.some(
                                        (cell) =>
                                            cell !== undefined && cell !== null
                                    ) && row[1]
                            );

                            if (validRows.length === 0) {
                                console.log(
                                    `Skipping empty sheet: ${sheetName}`
                                );
                                continue;
                            }

                            const institutionId = decryptId(
                                decodeURIComponent(encryptedInstitutionId)
                            );

                            const processedFacultyProfiles = validRows.map(
                                (row) => ({
                                    institution_id: institutionId,
                                    faculty_group: sheetName,
                                    name: row[1] ? String(row[1]) : null,
                                    generic_faculty_rank: row[2]
                                        ? parseInt(row[2], 10)
                                        : null,
                                    home_college: row[3]
                                        ? String(row[3])
                                        : null,
                                    home_department: row[4]
                                        ? String(row[4])
                                        : null,
                                    is_tenured: row[5] ? String(row[5]) : null,
                                    ssl_salary_grade: row[6]
                                        ? parseInt(row[6], 10)
                                        : null,
                                    annual_basic_salary: row[7]
                                        ? parseInt(row[7], 10)
                                        : null,
                                    on_leave_without_pay: row[8]
                                        ? parseInt(row[8], 10)
                                        : null,
                                    full_time_equivalent: row[9]
                                        ? parseFloat(row[9])
                                        : null,
                                    gender: row[10]
                                        ? parseInt(row[10], 10)
                                        : null,
                                    highest_degree_attained: row[11]
                                        ? parseInt(row[11], 10)
                                        : null,
                                    pursuing_next_degree: row[12]
                                        ? parseInt(row[12], 10)
                                        : null,
                                    discipline_teaching_load_1: row[13]
                                        ? String(row[13])
                                        : null,
                                    discipline_teaching_load_2: row[14]
                                        ? String(row[14])
                                        : null,
                                    discipline_bachelors: row[15]
                                        ? String(row[15])
                                        : null,
                                    discipline_masters: row[16]
                                        ? String(row[16])
                                        : null,
                                    discipline_doctorate: row[17]
                                        ? String(row[17])
                                        : null,
                                    masters_with_thesis: row[18]
                                        ? parseInt(row[18], 10)
                                        : null,
                                    doctorate_with_dissertation: row[19]
                                        ? parseInt(row[19], 10)
                                        : null,
                                    undergrad_lab_credit_units: row[20]
                                        ? parseFloat(row[20])
                                        : null,
                                    undergrad_lecture_credit_units: row[21]
                                        ? parseFloat(row[21])
                                        : null,
                                    undergrad_total_credit_units: row[22]
                                        ? parseFloat(row[22])
                                        : null,
                                    undergrad_lab_hours_per_week: row[23]
                                        ? parseFloat(row[23])
                                        : null,
                                    undergrad_lecture_hours_per_week: row[24]
                                        ? parseFloat(row[24])
                                        : null,
                                    undergrad_total_hours_per_week: row[25]
                                        ? parseFloat(row[25])
                                        : null,
                                    undergrad_lab_contact_hours: row[26]
                                        ? parseFloat(row[26])
                                        : null,
                                    undergrad_lecture_contact_hours: row[27]
                                        ? parseFloat(row[27])
                                        : null,
                                    undergrad_total_contact_hours: row[28]
                                        ? parseFloat(row[28])
                                        : null,
                                    graduate_lab_credit_units: row[29]
                                        ? parseFloat(row[29])
                                        : null,
                                    graduate_lecture_credit_units: row[30]
                                        ? parseFloat(row[30])
                                        : null,
                                    graduate_total_credit_units: row[31]
                                        ? parseFloat(row[31])
                                        : null,
                                    graduate_lab_contact_hours: row[32]
                                        ? parseFloat(row[32])
                                        : null,
                                    graduate_lecture_contact_hours: row[33]
                                        ? parseFloat(row[33])
                                        : null,
                                    graduate_total_contact_hours: row[34]
                                        ? parseFloat(row[34])
                                        : null,
                                    research_load: row[35]
                                        ? parseFloat(row[35])
                                        : null,
                                    extension_services_load: row[36]
                                        ? parseFloat(row[36])
                                        : null,
                                    study_load: row[37]
                                        ? parseFloat(row[37])
                                        : null,
                                    production_load: row[38]
                                        ? parseFloat(row[38])
                                        : null,
                                    administrative_load: row[39]
                                        ? parseFloat(row[39])
                                        : null,
                                    other_load_credits: row[40]
                                        ? parseFloat(row[40])
                                        : null,
                                    total_work_load: row[41]
                                        ? parseFloat(row[41])
                                        : null,
                                    repor_year: institutionReportYear,
                                })
                            );

                            processedFacultyProfiles.forEach((profile) => {
                                const profileString = JSON.stringify(profile);
                                if (!seenProfiles.has(profileString)) {
                                    seenProfiles.add(profileString);
                                    allFacultyProfiles.push(profile);
                                }
                            });
                        }

                        console.log(
                            "Final Processed Faculty Data:",
                            allFacultyProfiles
                        );

                        if (allFacultyProfiles.length > 0) {
                            try {
                                await axios.post(
                                    `${config.API_URL}/faculty-profiles`,
                                    allFacultyProfiles,
                                    {
                                        headers: {
                                            Authorization: `Bearer ${token}`,
                                        },
                                    }
                                );
                                console.log(
                                    "Faculty profiles uploaded successfully!"
                                );
                                AlertComponent.showAlert(
                                    "Faculty profiles uploaded successfully!",
                                    "success"
                                );
                                await fetchFacultyProfiles();
                                // Only update to 100% after all operations are complete
                                updateProgress(100);

                                // Log the upload action
                                await createLog({
                                    action: "Upload Faculty Profiles",
                                    description:
                                        "Uploaded faculty profiles from Excel file.",
                                });
                            } catch (uploadError) {
                                console.error(
                                    "Error uploading profiles:",
                                    uploadError
                                );
                                AlertComponent.showAlert(
                                    "Error uploading faculty profiles. Please try again.",
                                    "error"
                                );
                                hideLoading();
                            }
                        } else {
                            AlertComponent.showAlert(
                                "No valid faculty data found in the uploaded file.",
                                "error"
                            );
                            hideLoading();
                        }
                        await fetchFacultyProfiles();
                        updateProgress(100);
                    };
                } catch (error) {
                    console.error("Error processing the file:", error);
                    AlertComponent.showAlert(
                        "Error uploading file. Please try again.",
                        "error"
                    );
                    hideLoading();
                } finally {
                    setIsUploading(false);
                    setSelectedFile(null);
                }
            },
            () => {
                AlertComponent.showAlert("File upload canceled.", "question");
            }
        );
    };

    const handleExportData = async () => {
        AlertComponent.showConfirmation(
            "Do you want to export the faculty data?",
            async () => {
                // Confirm callback
                try {
                    const response = await fetch(
                        "/templates/Form-E2-Themeplate.xlsx"
                    );
                    if (!response.ok) {
                        throw new Error(
                            `Failed to load template file: HTTP ${response.status}`
                        );
                    }
                    const arrayBuffer = await response.arrayBuffer();

                    const workbook = new ExcelJS.Workbook();
                    await workbook.xlsx.load(arrayBuffer);

                    const dataStartRow = 7;

                    const profilesByGroup = facultyGroups.reduce(
                        (acc, group) => {
                            acc[group.sheetName] = facultyProfiles.filter(
                                (profile) =>
                                    profile.faculty_group === group.sheetName
                            );
                            console.log(
                                `Sheet ${group.sheetName}: ${
                                    acc[group.sheetName].length
                                } profiles`
                            );
                            return acc;
                        },
                        {}
                    );

                    for (
                        let sheetIndex = 0;
                        sheetIndex < Math.min(9, workbook.worksheets.length);
                        sheetIndex++
                    ) {
                        const sheetName =
                            facultyGroups[sheetIndex]?.sheetName ||
                            `Sheet${sheetIndex + 1}`;
                        const worksheet = workbook.getWorksheet(sheetIndex + 1);
                        if (!worksheet) {
                            console.log(
                                `Worksheet ${sheetName} not found, skipping...`
                            );
                            continue;
                        }

                        const profilesForSheet =
                            profilesByGroup[sheetName] || [];
                        console.log(
                            `Processing sheet ${sheetName}: ${profilesForSheet.length} profiles`
                        );

                        profilesForSheet.forEach((profile, i) => {
                            const row = worksheet.getRow(dataStartRow + i);
                            row.getCell(2).value = profile.name || null;
                            row.getCell(3).value =
                                profile.generic_faculty_rank || 0;
                            row.getCell(4).value = profile.home_college || null;
                            row.getCell(5).value =
                                profile.home_department || null;
                            row.getCell(6).value = profile.is_tenured || null;
                            row.getCell(7).value =
                                profile.ssl_salary_grade || 0;
                            row.getCell(8).value =
                                profile.annual_basic_salary || 0;
                            row.getCell(9).value =
                                profile.on_leave_without_pay || 0;
                            row.getCell(10).value =
                                profile.full_time_equivalent || 0;
                            row.getCell(11).value = profile.gender || null;
                            row.getCell(12).value =
                                profile.highest_degree_attained || 0;
                            row.getCell(13).value =
                                profile.pursuing_next_degree || null;
                            row.getCell(14).value =
                                profile.discipline_teaching_load_1 || null;
                            row.getCell(15).value =
                                profile.discipline_teaching_load_2 || null;
                            row.getCell(16).value =
                                profile.discipline_bachelors || null;
                            row.getCell(17).value =
                                profile.discipline_masters || null;
                            row.getCell(18).value =
                                profile.discipline_doctorate || null;
                            row.getCell(19).value =
                                profile.masters_with_thesis || null;
                            row.getCell(20).value =
                                profile.doctorate_with_dissertation || null;
                            row.getCell(21).value =
                                profile.undergrad_lab_credit_units || 0;
                            row.getCell(22).value =
                                profile.undergrad_lecture_credit_units || 0;
                            row.getCell(23).value =
                                profile.undergrad_total_credit_units || 0;
                            row.getCell(24).value =
                                profile.undergrad_lab_hours_per_week || 0;
                            row.getCell(25).value =
                                profile.undergrad_lecture_hours_per_week || 0;
                            row.getCell(26).value =
                                profile.undergrad_total_hours_per_week || 0;
                            row.getCell(27).value =
                                profile.undergrad_lab_contact_hours || 0;
                            row.getCell(28).value =
                                profile.undergrad_lecture_contact_hours || 0;
                            row.getCell(29).value =
                                profile.undergrad_total_contact_hours || 0;
                            row.getCell(30).value =
                                profile.graduate_lab_credit_units || 0;
                            row.getCell(31).value =
                                profile.graduate_lecture_credit_units || 0;
                            row.getCell(32).value =
                                profile.graduate_total_credit_units || 0;
                            row.getCell(33).value =
                                profile.graduate_lab_contact_hours || 0;
                            row.getCell(34).value =
                                profile.graduate_lecture_contact_hours || 0;
                            row.getCell(35).value =
                                profile.graduate_total_contact_hours || 0;
                            row.getCell(36).value = profile.research_load || 0;
                            row.getCell(37).value =
                                profile.extension_services_load || 0;
                            row.getCell(38).value = profile.study_load || 0;
                            row.getCell(39).value =
                                profile.production_load || 0;
                            row.getCell(40).value =
                                profile.administrative_load || 0;
                            row.getCell(41).value =
                                profile.other_load_credits || 0;
                            row.getCell(42).value =
                                profile.total_work_load || 0;
                            row.commit();
                        });
                    }

                    const fileName = `Form_E2_Faculty_Profiles_${
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

                    AlertComponent.showAlert(
                        "Data exported successfully!",
                        "success"
                    );

                    // Log the export action
                    await createLog({
                        action: "Export Faculty Profiles",
                        description: "Exported faculty profiles to Excel.",
                    });
                } catch (error) {
                    console.error("Error exporting data:", error);
                    AlertComponent.showAlert(
                        "Error exporting data. Please try again.",
                        "error"
                    );
                }
            },
            () => {
                // Cancel callback
                AlertComponent.showAlert("Export canceled.", "info");
            }
        );
    };

    if (loading) {
        return <FacultyProfileSkeleton />;
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
                    <li className="text-gray-900">Faculties Management</li>
                </ol>
            </nav>

            {/* Toolbar */}
            <div className="flex justify-between items-center bg-white p-4 mb-2 border-b border-gray-200">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-medium">
                        Faculties Management
                    </h1>
                    <p className="text-sm text-gray-500 hidden md:block">
                        {facultyGroups.find(
                            (group) => group.sheetName === selectedGroup
                        )?.description || "No description available"}
                    </p>
                </div>
                {/* CHED-Styled Action Buttons */}
                <div className="flex gap-4 items-center">
                    {/* Add Faculty Button */}
                    <CHEDButton
                        onClick={() => setOpenAddDialog(true)}
                        icon={Plus}
                        variant="primary"
                        size="md"
                        disabled={isUploading}
                    >
                        Add Faculty
                    </CHEDButton>
                    {/* Import Button */}
                    <CHEDButton
                        onClick={() => setOpenUploadDialog(true)}
                        icon={Upload}
                        variant="primary"
                        size="md"
                        disabled={isUploading}
                    >
                        {isUploading ? "Uploading..." : "Import Form E2"}
                    </CHEDButton>
                    {/* Export Button */}
                    <CHEDButton
                        onClick={handleExportData}
                        icon={Download}
                        variant="secondary"
                        size="md"
                        disabled={isUploading || loading}
                    >
                        Export Data
                    </CHEDButton>
                </div>
            </div>

            {/* Add Faculty Dialog */}
            <AddFacultyDialog
                open={openAddDialog}
                onClose={() => setOpenAddDialog(false)}
                facultyGroups={facultyGroups}
                institutionId={decryptId(decodeURIComponent(encryptedInstitutionId))}
                onFacultyAdded={fetchFacultyProfiles}
            />

            {/* Upload Modal */}
            {openUploadDialog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg max-w-md w-full">
                        <div className="bg-indigo-50 border-b border-gray-200 px-6 py-4">
                            <h2 className="text-lg font-semibold">
                                Upload Institution Form E2
                            </h2>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-gray-500 mb-4">
                                Please upload the Form E2 Excel document.
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
                                className="p-4 border-2 border-dashed border-indigo-600 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer bg-white"
                            >
                                <Upload className="w-7 h-7 text-indigo-600" />
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
                                        <Download className="w-5 h-5 text-indigo-600 mr-2" />
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
                                onClick={handleExcelFileUpload}
                                disabled={!selectedFile || isUploading}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
                            >
                                Upload
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Alert */}
            {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded-md">
                    {error}
                </div>
            )}

            {/* Faculty Profile Table */}
            <FacultyProfileTable
                selectedGroup={selectedGroup}
                facultyProfiles={filteredFacultyProfiles}
            />

            {/* Tabs */}
            <div className="flex overflow-x-auto border-t border-gray-200">
                {facultyGroups.map((group) => (
                    <button
                        key={group.sheetName}
                        onClick={() => handleTabChange(group.sheetName)}
                        className={`px-4 py-2 text-sm font-medium border-b-2 ${
                            selectedGroup === group.sheetName
                                ? "border-indigo-600 text-indigo-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        {group.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FacultyProfileUpload;
