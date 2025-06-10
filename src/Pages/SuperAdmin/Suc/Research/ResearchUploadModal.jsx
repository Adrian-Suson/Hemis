import { useState } from "react";
import {
    X,
    Upload,
    FileSpreadsheet,
    AlertCircle,
    CheckCircle,
    BookOpen,
    Calendar,
    Info,
    FileText,
    Database,
    Search,
} from "lucide-react";
import * as XLSX from "xlsx";
import axios from "axios";
import config from "../../../../utils/config";
import PropTypes from "prop-types";
import Dialog from "../../../../Components/Dialog";
import AlertComponent from "../../../../Components/AlertComponent";

function ResearchUploadModal({
    isOpen,
    onClose,
    onUploadSuccess,
    institutionId,
}) {
    const [uploadStatus, setUploadStatus] = useState(null); // null, 'loading', 'success', 'error'
    const [uploadMessage, setUploadMessage] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [errors, setErrors] = useState({});
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const handleInputChange = (field, value) => {
        // Clear error when user makes a selection
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: "",
            }));
        }

        if (field === "year") {
            setSelectedYear(value);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!institutionId) {
            newErrors.institution = "Institution ID is required";
        }

        if (!selectedYear) {
            newErrors.year = "Please select a report year";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Function to clear upload status
    const clearUploadStatus = () => {
        setUploadStatus(null);
        setUploadMessage("");
    };

    // Parsing helper functions
    const toNullableInteger = (value) => {
        if (
            !value ||
            value === "N/A" ||
            value === "" ||
            value === null ||
            value === undefined
        )
            return null;
        const parsed = Number.parseInt(value, 10);
        return isNaN(parsed) ? null : parsed;
    };

    const parseString = (value) => {
        if (value === undefined || value === "" || value === null) return null;
        const str = String(value).trim();
        return str.length > 0 ? str : null;
    };

    // Research sheet mapping and types
    const researchSheetMapping = {
        "Research T-B1": {
            type: "PUBLICATIONS",
            description: "Referred Publications",
            fields: [
                "title_of_article",
                "keywords",
                "authors",
                "name_of_book_journal",
                "editors",
                "vol_issue_no",
                "no_of_pages",
                "year_of_publication",
                "type_of_publication",
                "points"
            ]
        },
        "Research T-B2": {
            type: "CONFERENCES",
            description: "Research Papers Presented in Conferences",
            fields: [
                "title_of_research_paper",
                "keywords",
                "researchers",
                "conference_title",
                "venue",
                "date",
                "organizer",
                "type_of_conference",
                "points"
            ]
        },
        "Research T-B3": {
            type: "OTHER_OUTPUTS",
            description: "Other Research Outputs",
            fields: [] // Will be determined dynamically
        },
        "Research T-B4": {
            type: "CITATIONS",
            description: "Citations of Research Outputs",
            fields: [
                "title_of_research_output",
                "keywords",
                "researchers",
                "citing_authors",
                "citing_article_title",
                "journal_title",
                "vol_issue_page",
                "city_year_published",
                "publisher",
                "points"
            ]
        },
        "Research T-B5": {
            type: "AWARDS",
            description: "Research Awards and Recognition",
            fields: [
                "researcher_name",
                "title_of_output_award",
                "year_published_received",
                "publisher_organizer_body",
                "points"
            ]
        },
        "Extension T-C": {
            type: "EXTENSION",
            description: "Extension Activities",
            fields: [] // Will be determined dynamically
        }
    };

    const handleExcelUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate form before processing
        if (!validateForm()) {
            AlertComponent.showAlert(
                "Please ensure institution and year are properly set before uploading.",
                "error"
            );
            return;
        }

        // Validate file type
        const validTypes = [
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-excel",
            "text/csv",
        ];
        if (
            !validTypes.includes(file.type) &&
            !file.name.match(/\.(xlsx|xls|csv)$/i)
        ) {
            AlertComponent.showAlert(
                "Please upload a valid Excel file (.xlsx, .xls) or CSV file.",
                "error"
            );
            return;
        }

        setIsUploading(true);
        setUploadStatus("loading");
        setUploadMessage("Processing Excel file...");

        try {
            const buffer = await file.arrayBuffer();
            const workbook = XLSX.read(buffer, {
                cellStyles: true,
                cellFormulas: true,
                cellDates: true,
                cellNF: true,
                sheetStubs: true,
                type: "array",
            });

            // Filter for research and extension sheets
            const researchSheets = workbook.SheetNames.filter((name) =>
                Object.keys(researchSheetMapping).includes(name)
            ).map((name) => ({
                name,
                ...researchSheetMapping[name],
            }));

            if (researchSheets.length === 0) {
                // If no specific sheets found, use the first sheet
                if (workbook.SheetNames.length > 0) {
                    researchSheets.push({
                        name: workbook.SheetNames[0],
                        type: "RESEARCH_DATA",
                        description: "Research Data (Default Sheet)",
                        fields: []
                    });
                } else {
                    throw new Error("No valid sheets found in the Excel file.");
                }
            }

            await processAllResearchSheets(workbook, researchSheets);
        } catch (error) {
            console.error("Excel upload error:", error);
            setUploadStatus("error");
            setUploadMessage(`Error processing Excel file: ${error.message}`);
        } finally {
            setIsUploading(false);
            event.target.value = "";
        }
    };

    const processAllResearchSheets = async (workbook, researchSheets) => {
        const createdRecords = [];
        const errors = [];
        let successMessage = "";

        for (const sheet of researchSheets) {
            try {
                setUploadMessage(
                    `Processing ${sheet.description} from ${sheet.name}...`
                );
                const worksheet = workbook.Sheets[sheet.name];
                const researchRecords = await processResearchSheet(
                    worksheet,
                    sheet
                );
                createdRecords.push(...researchRecords);
                successMessage += `Imported ${researchRecords.length} records from ${sheet.name}. `;
            } catch (error) {
                console.error(`Error processing sheet ${sheet.name}:`, error);
                errors.push(
                    `Error in ${sheet.name}: ${
                        error.response?.data?.error || error.message
                    }`
                );
            }
        }

        if (createdRecords.length > 0) {
            onUploadSuccess();
            setUploadStatus("success");
            setUploadMessage(successMessage.trim());
            setErrors({});
        } else {
            setUploadStatus("error");
            setUploadMessage(
                `No valid data imported. Errors: ${errors.join("; ")}`
            );
        }
    };

    const processResearchSheet = async (worksheet, sheetInfo) => {
        try {
            setUploadMessage(
                `Processing ${sheetInfo.description} and saving to database...`
            );

            const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                header: 1,
                defval: "",
                raw: false,
            });

            console.log(`Parsed JSON data from ${sheetInfo.name} sheet:`, jsonData);

            // Find the header row (usually contains column names like "Title")
            let headerRowIndex = -1;
            for (let i = 0; i < Math.min(jsonData.length, 15); i++) {
                const row = jsonData[i];
                if (row && row.length > 2 && row.some(cell =>
                    cell && cell.toString().toLowerCase().includes("title")
                )) {
                    headerRowIndex = i;
                    break;
                }
            }

            console.log(`Header row index for ${sheetInfo.name}: ${headerRowIndex}`);

            if (headerRowIndex === -1) {
                throw new Error(
                    `Could not find header row in the ${sheetInfo.name} sheet.`
                );
            }

            const dataStartRow = headerRowIndex + 1;

            if (dataStartRow >= jsonData.length) {
                throw new Error(
                    `No data rows found in the ${sheetInfo.name} sheet after header.`
                );
            }

            const headers = jsonData[headerRowIndex];
            console.log(`Headers for ${sheetInfo.name}:`, headers);

            const processedRecords = jsonData
                .slice(dataStartRow)
                .filter((row) => {
                    // First check if row has any data
                    if (!row || row.length === 0) return false;

                    // Check for two required fields based on sheet type
                    switch (sheetInfo.type) {
                        case "PUBLICATIONS":
                            return row[0] && row[2]; // title_of_article and authors
                        case "CONFERENCES":
                            return row[0] && row[2]; // title_of_research_paper and researchers
                        case "OTHER_OUTPUTS":
                            return row[0] && row[1]; // inventions and patent_number
                        case "CITATIONS":
                            return row[2] && row[3]; // citing_authors and citing_article_title
                        case "AWARDS":
                            return row[0] && row[1]; // name_of_researcher and title_of_research_output_award
                        case "EXTENSION":
                            return row[0] && row[2]; // title and duration_number_of_hours
                        default:
                            return false;
                    }
                })
                .map((row, rowIndex) => {
                    try {
                        // Create base record structure
                        const record = {
                            hei_uiid: institutionId,
                        };

                        // Map each column to the record based on sheet type
                        headers.forEach((header, colIndex) => {
                            if (header && row[colIndex] !== undefined) {
                                const fieldName = header.toString().toLowerCase()
                                    .replace(/[^a-z0-9]/g, '_')
                                    .replace(/_+/g, '_')
                                    .replace(/^_|_$/g, '');

                                record[fieldName] = parseString(row[colIndex]);
                            }
                        });

                        // Add specific fields based on sheet type
                        switch (sheetInfo.type) {
                            case "PUBLICATIONS": // ResearchTb1
                                record.title_of_article = parseString(row[0]);
                                record.keywords = parseString(row[1]);
                                record.authors = parseString(row[2]);
                                record.name_of_book_journal = parseString(row[3]);
                                record.editors = parseString(row[4]);
                                record.vol_no_issue_no = parseString(row[5]);
                                record.no_of_pages = toNullableInteger(row[6]);
                                record.year_of_publication = toNullableInteger(row[7]);
                                break;

                            case "CONFERENCES": // ResearchTb2
                                record.title_of_research_paper = parseString(row[0]);
                                record.keywords = parseString(row[1]);
                                record.researchers = parseString(row[2]);
                                record.conference_title = parseString(row[3]);
                                record.conference_venue = parseString(row[4]);
                                record.conference_date = parseString(row[5]);
                                record.conference_organizer = parseString(row[6]);
                                record.type_of_conference = parseString(row[7]);
                                break;

                            case "OTHER_OUTPUTS": // ResearchTb3
                                record.inventions = parseString(row[0]);
                                record.patent_number = parseString(row[1]);
                                record.date_of_issue = parseString(row[2]);
                                record.utilization_development = row[3]?.toString().toLowerCase() === 'true';
                                record.utilization_service = row[4]?.toString().toLowerCase() === 'true';
                                record.name_of_commercial_product = parseString(row[5]);
                                record.points = toNullableInteger(row[6]);
                                break;

                            case "CITATIONS": // ResearchTb4
                                record.keywords = parseString(row[0]);
                                record.researchers = parseString(row[1]);
                                record.citing_authors = parseString(row[2]);
                                record.citing_article_title = parseString(row[3]);
                                record.journal_title = parseString(row[4]);
                                record.vol_issue_page_no = parseString(row[5]);
                                record.city_year_published = parseString(row[6]);
                                record.publisher_name = parseString(row[7]);
                                break;

                            case "AWARDS": // ResearchTb5
                                record.name_of_researcher = parseString(row[0]);
                                record.title_of_research_output_award = parseString(row[1]);
                                record.year_published_accepted_presented_received = toNullableInteger(row[2]);
                                record.publisher_conference_organizer_confering_body = parseString(row[3]);
                                break;

                            case "EXTENSION": // ResearchTbc
                                record.title = parseString(row[0]);
                                record.keywords = parseString(row[1]);
                                record.duration_number_of_hours = parseString(row[2]);
                                record.number_of_trainees_beneficiaries = toNullableInteger(row[3]);
                                record.citation_title = parseString(row[4]);
                                record.citation_confering_agency_body = parseString(row[5]);
                                record.citation_year_received = parseString(row[6]);
                                break;

                            default:
                                throw new Error(`Unknown sheet type: ${sheetInfo.type}`);
                        }

                        // Additional validation after mapping - only check the two required fields
                        switch (sheetInfo.type) {
                            case "PUBLICATIONS":
                                if (!record.title_of_article || !record.authors) return null;
                                break;
                            case "CONFERENCES":
                                if (!record.title_of_research_paper || !record.researchers) return null;
                                break;
                            case "OTHER_OUTPUTS":
                                if (!record.inventions || !record.patent_number) return null;
                                break;
                            case "CITATIONS":
                                if (!record.citing_authors || !record.citing_article_title) return null;
                                break;
                            case "AWARDS":
                                if (!record.name_of_researcher || !record.title_of_research_output_award) return null;
                                break;
                            case "EXTENSION":
                                if (!record.title || !record.duration_number_of_hours) return null;
                                break;
                        }

                        return record;
                    } catch (error) {
                        console.warn(
                            `Error processing row ${rowIndex + 1} in ${sheetInfo.name}:`,
                            error
                        );
                        return null;
                    }
                })
                .filter(record => record !== null);

            if (processedRecords.length === 0) {
                throw new Error(
                    `No valid research data found in the ${sheetInfo.name} sheet.`
                );
            }

            console.log(
                `Processed records from ${sheetInfo.name}:`,
                processedRecords
            );

            // Determine the appropriate endpoint based on sheet type
            let endpoint = '';
            switch (sheetInfo.type) {
                case "PUBLICATIONS":
                    endpoint = '/research-tb1/bulk';
                    break;
                case "CONFERENCES":
                    endpoint = '/research-tb2/bulk';
                    break;
                case "OTHER_OUTPUTS":
                    endpoint = '/research-tb3/bulk';
                    break;
                case "CITATIONS":
                    endpoint = '/research-tb4/bulk';
                    break;
                case "AWARDS":
                    endpoint = '/research-tb5/bulk';
                    break;
                case "EXTENSION":
                    endpoint = '/research-tbc/bulk';
                    break;
                default:
                    throw new Error(`Unknown sheet type: ${sheetInfo.type}`);
            }

            // Send to API
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${config.API_URL}${endpoint}`,
                {
                    records: processedRecords,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log(
                `Research upload response from ${sheetInfo.name}:`,
                response.data
            );

            return processedRecords;
        } catch (error) {
            console.error(
                `Research sheet processing error in ${sheetInfo.name}:`,
                error
            );
            throw new Error(
                error.response?.data?.error ||
                    `Failed to process research data in ${sheetInfo.name}: ${error.message}`
            );
        }
    };

    const handleClose = () => {
        setErrors({});
        setUploadStatus(null);
        setUploadMessage("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <Dialog
            isOpen={isOpen}
            onClose={handleClose}
            title="Upload Research & Extension Data"
            subtitle="Import research publications, conferences, citations, awards, and extension activities"
            icon={Upload}
            variant="default"
            size="xl"
        >
            <div className="space-y-4">
                {/* Upload Status Alert */}
                {uploadStatus && (
                    <div
                        className={`p-4 rounded-xl border shadow-sm ${
                            uploadStatus === "success"
                                ? "bg-green-50/80 border-green-200 text-green-800"
                                : uploadStatus === "error"
                                ? "bg-red-50/80 border-red-200 text-red-800"
                                : "bg-blue-50/80 border-blue-200 text-blue-800"
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                {uploadStatus === "success" && (
                                    <CheckCircle className="w-5 h-5 mr-2" />
                                )}
                                {uploadStatus === "error" && (
                                    <AlertCircle className="w-5 h-5 mr-2" />
                                )}
                                {uploadStatus === "loading" && (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-800 mr-2"></div>
                                )}
                                <span className="font-medium">
                                    {uploadMessage}
                                </span>
                            </div>
                            {uploadStatus !== "loading" && (
                                <button
                                    onClick={clearUploadStatus}
                                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Institution & Year Selection */}
                <div className="bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-100 rounded-xl p-4 border border-blue-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-blue-500 rounded-lg shadow-sm">
                            <Search className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">
                            Upload Configuration
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Institution ID{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={institutionId || ""}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                                placeholder="Institution ID will be auto-filled"
                            />
                            {errors.institution && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.institution}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <Calendar className="w-4 h-4 inline mr-1" />
                                Report Year{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={selectedYear}
                                onChange={(e) =>
                                    handleInputChange(
                                        "year",
                                        parseInt(e.target.value)
                                    )
                                }
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                                    errors.year
                                        ? "border-red-300 bg-red-50"
                                        : "border-gray-300"
                                }`}
                            >
                                {Array.from({ length: 10 }, (_, i) => {
                                    const year = new Date().getFullYear() - i;
                                    return (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    );
                                })}
                            </select>
                            {errors.year && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.year}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Upload Instructions */}
                <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 rounded-xl p-4 border border-amber-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-amber-500 rounded-lg shadow-sm">
                            <Info className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">
                            Excel Format Guidelines
                        </h3>
                    </div>
                    <div className="space-y-3 text-sm text-gray-700">
                        <div className="flex items-start space-x-3">
                            <FileText className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-medium mb-1">
                                    Research & Extension Forms Structure:
                                </p>
                                <ul className="space-y-1 ml-2">
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                                        <strong>Research T-B1:</strong> Referred Publications
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                                        <strong>Research T-B2:</strong> Conference Papers
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                                        <strong>Research T-B3:</strong> Other Research Outputs
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                                        <strong>Research T-B4:</strong> Research Citations
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                                        <strong>Research T-B5:</strong> Awards & Recognition
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                                        <strong>Extension T-C:</strong> Extension Activities
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <Database className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                            <p>
                                The system will automatically detect research and extension data
                                from each sheet and map columns to appropriate database fields.
                            </p>
                        </div>
                        <div className="flex items-start space-x-3">
                            <BookOpen className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                            <p>
                                Supported formats: .xlsx, .xls, and .csv files with research
                                and extension information
                            </p>
                        </div>
                    </div>
                </div>

                {/* File Upload Section */}
                <div className="bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 rounded-xl p-4 border border-slate-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-slate-600 rounded-lg shadow-sm">
                            <FileSpreadsheet className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">
                            File Upload
                        </h3>
                    </div>
                    <div className="relative">
                        <input
                            type="file"
                            id="excel-upload"
                            accept=".xlsx,.xls,.csv"
                            onChange={handleExcelUpload}
                            disabled={isUploading || !institutionId}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        />
                        <div
                            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                                !institutionId || isUploading
                                    ? "border-gray-200 bg-gray-50/50"
                                    : "border-slate-300 hover:border-slate-400 hover:bg-slate-50/50 bg-white"
                            }`}
                        >
                            <div
                                className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                                    !institutionId || isUploading
                                        ? "bg-gray-100"
                                        : "bg-gradient-to-br from-slate-100 to-slate-200"
                                }`}
                            >
                                {isUploading ? (
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
                                ) : (
                                    <Upload
                                        className={`w-8 h-8 ${
                                            !institutionId
                                                ? "text-gray-300"
                                                : "text-slate-600"
                                        }`}
                                    />
                                )}
                            </div>
                            <p
                                className={`text-lg font-semibold mb-2 ${
                                    !institutionId || isUploading
                                        ? "text-gray-400"
                                        : "text-gray-900"
                                }`}
                            >
                                {isUploading
                                    ? "Processing File..."
                                    : "Choose Research Excel File to Upload"}
                            </p>
                            <p
                                className={`text-sm mb-2 ${
                                    !institutionId || isUploading
                                        ? "text-gray-400"
                                        : "text-gray-600"
                                }`}
                            >
                                Drag and drop or click to browse
                            </p>
                            <div className="flex flex-wrap justify-center gap-2 mb-2">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    .xlsx
                                </span>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    .xls
                                </span>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                    .csv
                                </span>
                            </div>
                            {!institutionId && (
                                <div className="flex items-center justify-center mt-3">
                                    <AlertCircle className="w-4 h-4 text-red-500 mr-1" />
                                    <span className="text-sm text-red-500 font-medium">
                                        Institution ID is required
                                    </span>
                                </div>
                            )}
                            {uploadStatus === "loading" && (
                                <div className="mt-4">
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full animate-pulse"
                                            style={{ width: "60%" }}
                                        ></div>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-2">
                                        {uploadMessage}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Supported Sheet Types */}
                <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 rounded-xl p-4 border border-emerald-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-emerald-500 rounded-lg shadow-sm">
                            <FileSpreadsheet className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">
                            Supported Sheet Types
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-emerald-400 rounded-full mr-2"></div>
                                <span className="font-medium">Research T-B1:</span>
                                <span className="ml-1 text-gray-600">Publications</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-emerald-400 rounded-full mr-2"></div>
                                <span className="font-medium">Research T-B2:</span>
                                <span className="ml-1 text-gray-600">Conferences</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-emerald-400 rounded-full mr-2"></div>
                                <span className="font-medium">Research T-B3:</span>
                                <span className="ml-1 text-gray-600">Other Outputs</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-emerald-400 rounded-full mr-2"></div>
                                <span className="font-medium">Research T-B4:</span>
                                <span className="ml-1 text-gray-600">Citations</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-emerald-400 rounded-full mr-2"></div>
                                <span className="font-medium">Research T-B5:</span>
                                <span className="ml-1 text-gray-600">Awards</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-emerald-400 rounded-full mr-2"></div>
                                <span className="font-medium">Extension T-C:</span>
                                <span className="ml-1 text-gray-600">Extension Activities</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                        onClick={handleClose}
                        disabled={isUploading}
                        className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                        {isUploading ? "Processing..." : "Close"}
                    </button>
                    {uploadStatus === "success" && (
                        <button
                            onClick={() => {
                                setUploadStatus(null);
                                setUploadMessage("");
                            }}
                            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm hover:shadow-md transition-all duration-200 font-medium flex items-center justify-center"
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Another File
                        </button>
                    )}
                </div>
            </div>
        </Dialog>
    );
}

ResearchUploadModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onUploadSuccess: PropTypes.func.isRequired,
    institutionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
};

export default ResearchUploadModal;
