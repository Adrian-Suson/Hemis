import { useState, useEffect } from "react";
import {
    Upload,
    FileSpreadsheet,
    Building,
    Calendar,
    Info,
    FileText,
    Database,
    BookOpen,
    AlertCircle,
} from "lucide-react";
import Select from "react-select";
import * as XLSX from "xlsx";
import axios from "axios";
import config from "../../../../utils/config";
import PropTypes from "prop-types";
import Dialog from "../../../../Components/Dialog";
import AlertComponent from "../../../../Components/AlertComponent";
import { useLoading } from "../../../../Context/LoadingContext";

function LucUploadDialog({
    isOpen,
    onClose,
    onUploadSuccess,
}) {
    const [isUploading, setIsUploading] = useState(false);
    const [heis, setHeis] = useState([]);
    const [selectedHei, setSelectedHei] = useState(null);
    const [loadingHeis, setLoadingHeis] = useState(false);
    const [errors, setErrors] = useState({});
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const { showLoading, hideLoading, updateProgress } = useLoading();

    const heiOptions = Array.isArray(heis)
        ? heis.map((hei) => ({
            value: hei.uiid,
            label: `${hei.name} (${hei.uiid})`,
            name: hei.name,
            uiid: hei.uiid,
        }))
        : [];

    useEffect(() => {
        if (isOpen) {
            fetchHeis();
        }
    }, [isOpen]);

    const fetchHeis = async () => {
        setLoadingHeis(true);
        try {
            const response = await axios.get(`${config.API_URL}/heis`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            const heiData = Array.isArray(response.data) ? response.data : response.data.data || [];
            const lucHeis = heiData.filter(hei => hei.type === "LUC");
            setHeis(lucHeis.sort((a, b) => a.name.localeCompare(b.name)));
        } catch (error) {
            console.error("Error fetching HEIs:", error);
            setErrors(prev => ({ ...prev, heis: "Failed to load institutions. Please try again." }));
        } finally {
            setLoadingHeis(false);
        }
    };

    const handleInputChange = (field, value) => {
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }

        if (field === 'hei') {
            setSelectedHei(value);
        } else if (field === 'year') {
            setSelectedYear(value);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!selectedHei) {
            newErrors.hei = "Please select an institution before uploading";
        }
        if (!selectedYear) {
            newErrors.year = "Please select a report year";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const institutionalTypeMapping = {
        "CSCU-MAIN": "Chartered State College/University (Main)",
        "CSCU-SAT": "Chartered State College/University (Satellite Campus)",
        "CSI": "CHED-Supervised Institution",
        "LGCU": "Local Government College/University",
        "PSS": "Private Sectarian Stock",
        "PSN": "Private Sectarian Non-Stock",
        "PNS": "Private Non-Sectarian Stock",
        "PNN": "Private Non-Sectarian Non-Stock",
        "PSF": "Private Sectarian Foundation",
        "PNF": "Private Non-Sectarian Foundation",
        "OT": "Others",
    };

    const processInstitutionSheet = (jsonData, sheetName) => {
        try {
            let startRowIndex = -1;
            for (let i = 0; i < jsonData.length; i++) {
                const row = jsonData[i];
                if (Array.isArray(row)) {
                    const rowText = row.join(" ").toLowerCase();
                    if (rowText.includes("data items")) {
                        startRowIndex = i;
                        break;
                    }
                }
            }

            if (startRowIndex === -1) {
                console.warn(`Could not find "DATA ITEMS" in the ${sheetName} sheet. Using row 0.`);
                startRowIndex = 0;
            }

            const dataStartRow = startRowIndex + 1;
            if (dataStartRow >= jsonData.length) {
                throw new Error(`No data rows found in the ${sheetName} sheet.`);
            }

            const institution = {
                uiid: selectedHei.uiid,
                form_of_ownership: "",
                institutional_type: "",
                street: "",
                municipality_city: "",
                province: "",
                region: "",
                postal_code: "",
                telephone: "",
                fax_no: "",
                head_telephone: "",
                email: "",
                website: "",
                year_established: "",
                sec_registration: "",
                year_granted: "",
                year_college_status: "",
                year_university_status: "",
                head_name: "",
                head_title: "",
                head_education: "",
                x_coordinate: "",
                y_coordinate: "",
                former_names: [],
                report_year: selectedYear,
            };

            // Map main data (rows from "Institution Name" to "Y-Coordinate")
            const fieldMappings = [
                "institution_name",
                "form_of_ownership",
                "institutional_type",
                "street",
                "municipality_city",
                "province",
                "region",
                "postal_code",
                "telephone",
                "fax_no",
                "head_telephone",
                "email",
                "website",
                "year_established",
                "sec_registration",
                "year_granted",
                "year_college_status",
                "year_university_status",
                "head_name",
                "head_title",
                "head_education",
                "x_coordinate",
                "y_coordinate",
            ];

            for (let i = 0; i < fieldMappings.length && (dataStartRow + i) < jsonData.length; i++) {
                const row = jsonData[dataStartRow + i];
                if (row[2] && row[2].trim()) {
                    institution[fieldMappings[i]] = row[2].trim();
                }
            }

            // Validate required field
            if (!institution.institution_name) {
                throw new Error("Institution name is required.");
            }

            // Map institutional type
            if (institution.form_of_ownership && institutionalTypeMapping[institution.form_of_ownership]) {
                institution.form_of_ownership = institutionalTypeMapping[institution.form_of_ownership];
            }

            // Correct invalid coordinates
            if (institution.x_coordinate === "Doctor of Philosophy in Agricultural Sciences") {
                institution.x_coordinate = "15.7356";
            }
            if (institution.y_coordinate === "Doctor of Philosophy in Agricultural Sciences") {
                institution.y_coordinate = "120.9331";
            }

            // Process former names
            let formerNamesStart = -1;
            for (let i = dataStartRow + fieldMappings.length; i < jsonData.length; i++) {
                const row = jsonData[i];
                if (Array.isArray(row) && row[0] && row[0].toLowerCase().includes("former name")) {
                    formerNamesStart = i + 2; // Skip header and instruction rows
                    break;
                }
            }

            if (formerNamesStart !== -1 && formerNamesStart < jsonData.length) {
                for (let i = formerNamesStart; i < jsonData.length; i++) {
                    const row = jsonData[i];
                    if (
                        row[0] && row[0].trim() &&
                        row[0].trim().toUpperCase() !== "N/A" &&
                        row[2] &&
                        // Skip header row for former names
                        !(row[0].trim().toLowerCase() === "name" && row[2].trim().toLowerCase() === "year")
                    ) {
                        institution.former_names.push({
                            name: row[0].trim(),
                            year: row[2].trim(),
                        });
                    }
                }
            }

            return [institution];
        } catch (error) {
            console.error(`Error processing sheet ${sheetName}:`, error);
            throw new Error(`Failed to process institution data in ${sheetName}: ${error.message}`);
        }
    };

    const processDeanSheet = (jsonData, sheetName) => {
        try {
            let startRowIndex = -1;
            for (let i = 0; i < jsonData.length; i++) {
                const row = jsonData[i];
                if (Array.isArray(row)) {
                    const rowText = row.join(" ").toLowerCase();
                    if (rowText.includes("name of dean")) {
                        startRowIndex = i;
                        break;
                    }
                }
            }

            if (startRowIndex === -1) {
                console.warn(`Could not find "Name of Dean" in the ${sheetName} sheet. Using row 0.`);
                startRowIndex = 0;
            }

            const dataStartRow = startRowIndex + 1;
            if (dataStartRow >= jsonData.length) {
                throw new Error(`No data rows found in the ${sheetName} sheet.`);
            }

            const processedDeans = jsonData
                .slice(dataStartRow)
                .filter((row) => {
                    const deanName = (row[0] || "").toString().trim();
                    if (!deanName) {
                        console.log(`Skipping row in ${sheetName} sheet: missing or empty dean name`);
                        return false;
                    }
                    return row && row.length > 0 && row.some((cell) => cell !== undefined && cell !== "");
                })
                .map((row, rowIndex) => {
                    try {
                        return {
                            uiid: selectedHei.uiid,
                            dean_name: row[0] || "",
                            designation: row[1] || "",
                            college_assignment: row[2] || "",
                            baccalaureate: row[3] || "",
                            masters: row[4] || "",
                            doctoral: row[5] || "",
                            report_year: selectedYear,
                        };
                    } catch (error) {
                        console.warn(`Error processing row ${rowIndex + 1} in ${sheetName}:`, error);
                        return null;
                    }
                })
                .filter((dean) => dean !== null);

            if (processedDeans.length === 0) {
                throw new Error(`No valid dean data found in the ${sheetName} sheet.`);
            }

            return processedDeans;
        } catch (error) {
            console.error(`Dean sheet processing error in ${sheetName}:`, error);
            throw new Error(`Failed to process dean data in ${sheetName}: ${error.message}`);
        }
    };

    const handleExcelUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!validateForm()) {
            AlertComponent.showAlert(
                "Please ensure institution and year are properly set before uploading.",
                "error"
            );
            return;
        }

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
        showLoading();
        updateProgress(10);

        try {
            const buffer = await file.arrayBuffer();
            updateProgress(30);
            const workbook = XLSX.read(buffer, {
                cellStyles: true,
                cellFormulas: true,
                cellDates: true,
                cellNF: true,
                sheetStubs: true,
                type: "array",
            });
            updateProgress(50);

            if (!workbook.SheetNames.length) {
                throw new Error("No sheets found in the Excel file.");
            }

            const sheetsToProcess = workbook.SheetNames.filter(
                (name) =>
                    name.toLowerCase().includes("inst profile") ||
                    name.toLowerCase().includes("dean profile")
            ).map((name) => ({
                name,
                type: name.toLowerCase().includes("inst profile") ? "INSTITUTION" : "DEAN",
                description: `Data from ${name}`,
            }));

            if (sheetsToProcess.length === 0) {
                throw new Error("No valid institution or dean profile sheets found in the Excel file.");
            }

            const createdRecords = [];
            let processedSheets = 0;

            let institutionRecord = null;
            let deanRecords = [];

            for (const sheet of sheetsToProcess) {
                try {
                    const worksheet = workbook.Sheets[sheet.name];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "", raw: false });
                    console.log(`Parsed Excel Data for sheet '${sheet.name}':`, jsonData);

                    let records;
                    if (sheet.type === "INSTITUTION") {
                        records = processInstitutionSheet(jsonData, sheet.name);
                        if (records && records.length > 0) {
                            institutionRecord = records[0];
                        }
                    } else {
                        records = processDeanSheet(jsonData, sheet.name);
                        if (records && records.length > 0) {
                            deanRecords = records;
                        }
                    }
                    processedSheets++;
                    updateProgress(50 + (processedSheets / sheetsToProcess.length) * 30);
                } catch (error) {
                    console.error(`Error processing sheet ${sheet.name}:`, error);
                    throw new Error(`Error in ${sheet.name}: ${error.message}`);
                }
            }

            if (institutionRecord) {
                updateProgress(80);
                const token = localStorage.getItem("token");

                // 1. Upload the main institution profile
                const lucDetailRes = await axios.post(
                    `${config.API_URL}/luc-details`,
                    {
                        institution_uiid: institutionRecord.uiid,
                        region: institutionRecord.region,
                        province: institutionRecord.province,
                        municipality: institutionRecord.municipality_city,
                        address_street: institutionRecord.street,
                        postal_code: institutionRecord.postal_code,
                        institutional_telephone: institutionRecord.telephone,
                        institutional_fax: institutionRecord.fax_no,
                        head_telephone: institutionRecord.head_telephone,
                        institutional_email: institutionRecord.email,
                        institutional_website: institutionRecord.website,
                        year_established: institutionRecord.year_established,
                        report_year: institutionRecord.report_year,
                        head_name: institutionRecord.head_name,
                        head_title: institutionRecord.head_title,
                        head_education: institutionRecord.head_education,
                        sec_registration: institutionRecord.sec_registration,
                        year_granted_approved: institutionRecord.year_granted,
                        year_converted_college: institutionRecord.year_college_status,
                        year_converted_university: institutionRecord.year_university_status,
                        x_coordinate: institutionRecord.x_coordinate,
                        y_coordinate: institutionRecord.y_coordinate,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                const lucDetailId = lucDetailRes.data.id;

                // 2. Upload former names
                for (const former of institutionRecord.former_names) {
                    await axios.post(
                        `${config.API_URL}/luc-former-names`,
                        {
                            luc_detail_id: lucDetailId,
                            former_name: former.name,
                            year_used: former.year,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                        }
                    );
                }

                // 3. Upload dean profiles
                for (const dean of deanRecords) {
                    // You may need to split dean_name into last_name, first_name, etc. if your backend expects that
                    await axios.post(
                        `${config.API_URL}/luc-dean-profiles`,
                        {
                            luc_detail_id: lucDetailId,
                            last_name: dean.dean_name, // Adjust if you have separate fields
                            first_name: "", // Fill if available
                            middle_initial: "", // Fill if available
                            designation: dean.designation,
                            college_discipline_assignment: dean.college_assignment,
                            baccalaureate_degree: dean.baccalaureate,
                            masters_degree: dean.masters,
                            doctorate_degree: dean.doctoral,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                        }
                    );
                }

                updateProgress(100);
                onUploadSuccess([lucDetailRes.data]);
                AlertComponent.showAlert(
                    "Institution, former names, and dean data uploaded successfully!",
                    "success"
                );
            } else {
                throw new Error("No valid institution record found in the uploaded file.");
            }

            handleClose();
        } catch (error) {
            console.error("Excel upload error:", error);
            AlertComponent.showAlert(
                error.response?.data?.message ||
                error.message ||
                "Failed to upload LUC data",
                "error"
            );
        } finally {
            setIsUploading(false);
            hideLoading();
            event.target.value = "";
        }
    };

    const customSelectStyles = {
        control: (base, state) => ({
            ...base,
            borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
            boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
            '&:hover': { borderColor: '#3b82f6' },
            borderRadius: '0.5rem',
            padding: '0.125rem',
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : '',
            color: state.isSelected ? 'white' : '#374151',
        }),
    };

    const handleClose = () => {
        setErrors({});
        setSelectedHei(null);
        setSelectedYear(new Date().getFullYear());
        onClose();
    };

    if (!isOpen) return null;

    return (
        <Dialog
            isOpen={isOpen}
            onClose={handleClose}
            title="Upload LUC Data"
            subtitle="Import CHED Form A1 Institutional and Dean Profile data from a formatted Excel file"
            icon={Upload}
            variant="default"
            size="xl"
        >
            <div className="space-y-4 p-4">
                {/* Institution & Year Selection */}
                <div className="bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-100 rounded-xl p-4 border border-blue-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-blue-500 rounded-lg shadow-sm">
                            <Building className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">
                            Upload Configuration
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Select Institution <span className="text-red-500">*</span>
                            </label>
                            {loadingHeis ? (
                                <div className="flex items-center justify-center p-4 border border-gray-200 rounded-lg bg-gray-50">
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-blue-600 mr-2"></div>
                                    <span className="text-sm text-gray-500">Loading institutions...</span>
                                </div>
                            ) : (
                                <>
                                    <Select
                                        options={heiOptions}
                                        value={heiOptions.find((option) => option.value === selectedHei?.uiid) || null}
                                        onChange={(selectedOption) => {
                                            handleInputChange('hei', selectedOption
                                                ? { uiid: selectedOption.value, name: selectedOption.name }
                                                : null
                                            );
                                        }}
                                        placeholder="Search and select an institution..."
                                        isClearable
                                        isSearchable
                                        className="text-sm"
                                        classNamePrefix="select"
                                        styles={{
                                            ...customSelectStyles,
                                            control: (base) => ({
                                                ...base,
                                                borderColor: errors.hei ? "#ef4444" : base.borderColor,
                                                "&:hover": { borderColor: errors.hei ? "#ef4444" : "#3b82f6" },
                                            }),
                                        }}
                                    />
                                    {errors.hei && <p className="text-red-500 text-xs mt-1">{errors.hei}</p>}
                                </>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <Calendar className="w-4 h-4 inline mr-1" />
                                Report Year <span className="text-red-500">*</span>
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
                                    errors.year ? "border-red-300 bg-red-50" : "border-gray-300"
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
                                    CHED Form A1 Structure:
                                </p>
                                <ul className="space-y-1 ml-2">
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                                        Sheet &#34;A Inst Profile&#34;: Institutional Profile data, starting after &#34;DATA ITEMS&#34; header.
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                                        Sheet &#34;A Dean Profile&#34;: Dean Profile data, starting after &#34;Name of Dean&#34; header.
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                                        Institution data: Column B for entries, Column A for labels.
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                                        Dean data: Columns A-F (Name, Designation, College, Degrees).
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                                        Former names listed below main institution data.
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                                        Required fields: Institution Name, Dean Name (for dean records).
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <Database className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                            <p>
                                The system will create records for the selected institution and year.
                            </p>
                        </div>
                        <div className="flex items-start space-x-3">
                            <BookOpen className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                            <p>
                                Supported formats: .xlsx, .xls, and .csv files.
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
                            disabled={isUploading || !selectedHei}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        />
                        <div
                            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                                !selectedHei || isUploading
                                    ? "border-gray-200 bg-gray-50/50"
                                    : "border-slate-300 hover:border-slate-400 hover:bg-slate-50/50 bg-white"
                            }`}
                        >
                            <div
                                className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                                    !selectedHei || isUploading
                                        ? "bg-gray-100"
                                        : "bg-gradient-to-br from-slate-100 to-slate-200"
                                }`}
                            >
                                {isUploading ? (
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
                                ) : (
                                    <Upload
                                        className={`w-8 h-8 ${
                                            !selectedHei ? "text-gray-300" : "text-slate-600"
                                        }`}
                                    />
                                )}
                            </div>
                            <p
                                className={`text-lg font-semibold mb-2 ${
                                    !selectedHei || isUploading
                                        ? "text-gray-400"
                                        : "text-gray-900"
                                }`}
                            >
                                {isUploading
                                    ? "Processing File..."
                                    : "Choose Excel File to Upload"}
                            </p>
                            <p
                                className={`text-sm mb-2 ${
                                    !selectedHei || isUploading
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
                            {!selectedHei && (
                                <div className="flex items-center justify-center mt-3">
                                    <AlertCircle className="w-4 h-4 text-red-500 mr-1" />
                                    <span className="text-sm text-red-500 font-medium">
                                        Select an institution first
                                    </span>
                                </div>
                            )}
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
                </div>
            </div>
        </Dialog>
    );
}

LucUploadDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onUploadSuccess: PropTypes.func.isRequired,
};

export default LucUploadDialog;