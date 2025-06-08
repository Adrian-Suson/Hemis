import { useState, useEffect } from "react";
import {
  X,
  Upload,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
  Building2,
  MapPin,
  Calendar,
  Info,
  FileText,
  Database,
  Globe,
  Plus
} from "lucide-react";
import Select from "react-select";
import * as XLSX from "xlsx";
import axios from "axios";
import config from "../../../../utils/config";
import PropTypes from "prop-types";
import useLocationData from "../../../../Hooks/useLocationData";
import Dialog from "../../../../Components/Dialog";
import AlertComponent from "../../../../Components/AlertComponent";

function SucUploadModal({ isOpen, onClose, onDataImported }) {
  const [uploadStatus, setUploadStatus] = useState(null); // null, 'loading', 'success', 'error'
  const [uploadMessage, setUploadMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [heis, setHeis] = useState([]);
  const [selectedHei, setSelectedHei] = useState(null);
  const [loadingHeis, setLoadingHeis] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState(null);

  // Use the custom hook to fetch location data
  const { regions, provinces, municipalities, loading, error } = useLocationData();

  // Create heiOptions from heis state for react-select
  const heiOptions = Array.isArray(heis)
    ? heis.map((hei) => ({
        value: hei.uiid,
        label: `${hei.name} (${hei.uiid})`,
        name: hei.name,
        uiid: hei.uiid,
      }))
    : [];

  // Fetch HEIs when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchHeis();
    }
  }, [isOpen]);

  const fetchHeis = async () => {
    setLoadingHeis(true);
    try {
      const response = await axios.get(`${config.API_URL}/admin/heis?type=SUC`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setHeis(response.data);
    } catch (error) {
      console.error("Error fetching HEIs:", error);
      setErrors(prev => ({ ...prev, heis: "Failed to load institutions. Please try again." }));
    } finally {
      setLoadingHeis(false);
    }
  };

  const handleInputChange = (field, value) => {
    // Clear error when user makes a selection
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }

    if (field === 'hei') {
      setSelectedHei(value);
    } else if (field === 'year') {
      setSelectedYear(value);
    }
  };

  // Format regions for react-select
  const regionOptions = Array.isArray(regions)
    ? regions.map((region) => ({
        value: region.name,
        label: region.name,
        id: region.id,
      }))
    : [];

  // Format provinces for react-select based on selected region
  const provinceOptions = Array.isArray(provinces)
    ? provinces
        .filter((province) => province.region.name === selectedRegion)
        .map((province) => ({
          value: province.name,
          label: province.name,
          id: province.id,
        }))
    : [];

  // Format municipalities for react-select based on selected province
  const municipalityOptions = Array.isArray(municipalities)
    ? municipalities
        .filter((municipality) => municipality.province.name === selectedProvince)
        .map((municipality) => ({
          value: municipality.name,
          label: municipality.name,
        }))
    : [];

  const handleRegionChange = (selectedOption) => {
    setSelectedRegion(selectedOption ? selectedOption.value : null);
    setSelectedProvince(null);
    setSelectedMunicipality(null);
  };

  const handleProvinceChange = (selectedOption) => {
    setSelectedProvince(selectedOption ? selectedOption.value : null);
    setSelectedMunicipality(null);
  };

  const handleMunicipalityChange = (selectedOption) => {
    setSelectedMunicipality(selectedOption ? selectedOption.value : null);
  };

  // Function to clear upload status
  const clearUploadStatus = () => {
    setUploadStatus(null);
    setUploadMessage("");
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

  // Custom select styles to match other forms
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

  // Reference mappings from the Excel file
  const regionMapping = {
    "1": "Ilocos Region (Region 1)",
    "2": "Cagayan Valley (Region II)",
    "3": "Central Luzon (Region III)",
    "4": "CALABARZON (Region IV-A)",
    "5": "Bicol Region (Region V)",
    "6": "Western Visayas (Region VI)",
    "7": "Central Visayas (Region VII)",
    "8": "Eastern Visayas (Region VIII)",
    "9": "Zamboanga Peninsula (Region IX)",
    "10": "Northern Mindanao (Region X)",
    "11": "Davao Region (Region XI)",
    "12": "SOCCSKSARGEN (Region XII)",
    "13": "National Capital Region (NCR)",
    "14": "Cordillera Administrative Region (CAR)",
    "15": "Autonomous Region in Muslim Mindanao (ARMM)",
    "16": "Caraga (Region XIII)",
    "17": "MIMAROPA (Region IV-B)",
  };

  const headTitleMapping = {
    "01": "President",
    "02": "Chancellor",
    "03": "Executive Director",
    "04": "Dean",
    "05": "Rector",
    "06": "Head",
    "07": "Administrator",
    "08": "Principal",
    "09": "Managing Director",
    "10": "Director",
    "11": "Chair",
    "12": "Others",
    "99": "Not known or not indicated",
  };



  // Parsing helper functions
  const toNullableInteger = (value) => {
    if (!value || value === "N/A" || value === "") return null;
    const parsed = Number.parseInt(value, 10);
    return isNaN(parsed) ? null : parsed;
  };

  const parseNumeric = (value, min, max) => {
    if (value === undefined || value === "" || isNaN(value)) return null;
    const num = Number.parseFloat(value);
    if (min !== undefined && num < min) return null;
    if (max !== undefined && num > max) return null;
    return num;
  };

  const parseInteger = (value, min, max) => {
    if (value === undefined || value === "" || isNaN(value)) return null;
    const int = Number.parseInt(value, 10);
    if (min !== undefined && int < min) return null;
    if (max !== undefined && int > max) return null;
    return int;
  };

  const parseString = (value) => {
    if (value === undefined || value === "") return null;
    const str = String(value).trim();
    return str.length > 255 ? str.substring(0, 255) : str;
  };

  const handleExcelUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate form before processing
    if (!validateForm()) {
      AlertComponent.showAlert("Please fill in all required fields before uploading.", "error");
      return;
    }

    // Validate file type
    const validTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        "text/csv",
    ];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/i)) {
        AlertComponent.showAlert("Please upload a valid Excel file (.xlsx, .xls) or CSV file.", "error");
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

        // Identify HEMIS sheets
        const hemisSheets = workbook.SheetNames.filter(
            (name) =>
                name.toUpperCase().includes("FORM A1") ||
                name.toUpperCase().includes("FORM A2") ||
                name.toUpperCase().includes("A1") ||
                name.toUpperCase().includes("A2")
        ).map((name) => ({
            name,
            type: name.toUpperCase().includes("A1") ? "A1" : "A2",
            description: name.toUpperCase().includes("A1") ? "SUC Institutional Profile" : "Campus Information",
        }));

        if (hemisSheets.length === 0) {
            throw new Error("No HEMIS forms (A1 or A2) found in the Excel file.");
        }

        await processAllHemisSheets(workbook, hemisSheets);
    } catch (error) {
        console.error("Excel upload error:", error);
        setUploadStatus("error");
        setUploadMessage(`Error processing Excel file: ${error.message}`);
    } finally {
        setIsUploading(false);
        event.target.value = "";
    }
  };

  const processAllHemisSheets = async (workbook, hemisSheets) => {
    const createdRecords = [];
    const errors = [];
    let successMessage = "";
    let institutionId = null;

    // Process Form A1 first to get institution_id
    const formA1Sheets = hemisSheets.filter((sheet) => sheet.type === "A1");
    for (const sheet of formA1Sheets) {
        try {
            setUploadMessage(`Processing ${sheet.description} from ${sheet.name}...`);
            const worksheet = workbook.Sheets[sheet.name];
            const a1Records = await processFormA1(worksheet);
            if (a1Records.length > 0) {
                institutionId = a1Records[0].institution.id;
                createdRecords.push(...a1Records);
                successMessage += `Imported SUC institutional profile from ${sheet.name}. `;
            }
        } catch (error) {
            console.error(`Error processing sheet ${sheet.name}:`, error);
            errors.push(`Error in ${sheet.name}: ${error.response?.data?.error || error.message}`);
        }
    }

    // Process Form A2 with the obtained institution_id
    const formA2Sheets = hemisSheets.filter((sheet) => sheet.type === "A2");
    for (const sheet of formA2Sheets) {
        try {
            setUploadMessage(`Processing ${sheet.description} from ${sheet.name}...`);
            const worksheet = workbook.Sheets[sheet.name];
            const a2Records = await processFormA2(worksheet, institutionId);
            createdRecords.push(...a2Records);
            successMessage += `Imported ${a2Records.length} campus records from ${sheet.name}. `;
        } catch (error) {
            console.error(`Error processing sheet ${sheet.name}:`, error);
            errors.push(`Error in ${sheet.name}: ${error.response?.data?.error || error.message}`);
        }
    }

    if (createdRecords.length > 0) {
        onDataImported(createdRecords);
        setUploadStatus("success");
        setUploadMessage(successMessage.trim());

        // Reset state
        setSelectedHei(null);
        setSelectedRegion(null);
        setSelectedProvince(null);
        setSelectedMunicipality(null);
        setErrors({});
    } else {
        setUploadStatus("error");
        setUploadMessage(`No valid data imported. Errors: ${errors.join("; ")}`);
    }
  };

  const processFormA1 = async (worksheet) => {
    try {
      setUploadMessage("Processing Form A1 data and saving to database...");

      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: "",
        raw: false,
      });

      const extractedInstitution = {
        hei_uiid: selectedHei?.uiid || "",
        region: parseString(selectedRegion) || null,
        province: parseString(selectedProvince) || null,
        municipality: parseString(selectedMunicipality) || null,
        address_street: parseString(jsonData[7]?.[2] || ""),
        postal_code: parseString(jsonData[11]?.[2] || ""),
        institutional_telephone: parseString(jsonData[12]?.[2] || ""),
        institutional_fax: parseString(jsonData[13]?.[2] || ""),
        head_telephone: parseString(jsonData[14]?.[2] || ""),
        institutional_email: parseString(jsonData[15]?.[2] || ""),
        institutional_website: parseString(jsonData[16]?.[2] || ""),
        year_established: toNullableInteger(jsonData[17]?.[2]),
        sec_registration: parseString(jsonData[18]?.[2] || ""),
        year_granted_approved: toNullableInteger(jsonData[19]?.[2]),
        year_converted_college: toNullableInteger(jsonData[20]?.[2]),
        year_converted_university: toNullableInteger(jsonData[21]?.[2]),
        head_name: parseString(jsonData[22]?.[2] || ""),
        head_title: parseString(jsonData[23]?.[2] || ""),
        head_education: parseString(jsonData[24]?.[2] || ""),
        institution_type: "SUC",
        report_year: parseInteger(selectedYear, 1800, new Date().getFullYear()),
      };

      const token = localStorage.getItem("token");
      const institutionResponse = await axios.post(
        `${config.API_URL}/suc-details`,
        extractedInstitution,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const institutionId = institutionResponse.data.id;
      if (!institutionId || isNaN(Number(institutionId))) {
        throw new Error("Invalid institution ID received from server.");
      }

      return [{ institution: { id: institutionId, ...extractedInstitution } }];
    } catch (error) {
      console.error("Form A1 processing error:", error);
      throw new Error(error.response?.data?.error || `Failed to process Form A1: ${error.message}`);
    }
  };

  const processFormA2 = async (worksheet, institutionId) => {
    try {
        setUploadMessage("Processing Form A2 data and saving to database...");

        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            defval: "",
            raw: false,
        });

        // Find the row where "START BELOW THIS ROW" is located
        const startRow = jsonData.findIndex((row) =>
            row.some((cell) => String(cell).toUpperCase().includes("START BELOW THIS ROW"))
        ) + 1;

        if (startRow <= 0) {
            throw new Error('Marker "START BELOW THIS ROW" not found in the sheet.');
        }

        const currentYear = new Date().getFullYear();

        const processedCampuses = jsonData
            .slice(startRow)
            .filter((row) => row.some((cell) => cell !== undefined && cell !== ""))
            .map((row) => ({
                suc_details_id: Number.parseInt(institutionId, 10) || null,
                name: parseString(row[1]) || "",
                campus_type: parseString(row[2]),
                institutional_code: parseString(row[3]),
                region: regionMapping[row[4]] || parseString(row[4]) || "",
                province_municipality: parseString(row[5]) || "",
                year_first_operation: parseInteger(row[6], 1800, currentYear),
                land_area_hectares: parseNumeric(row[7], 0),
                distance_from_main: parseNumeric(row[8], 0),
                autonomous_code: parseString[row[9]] || parseString(row[9]),
                position_title: headTitleMapping[row[10]] || parseString(row[10]),
                head_full_name: parseString(row[11]),
                former_name: parseString(row[12]),
                latitude_coordinates: parseNumeric(row[13], -90, 90),
                longitude_coordinates: parseNumeric(row[14], -180, 180),
                report_year: parseInteger(selectedYear, 1800, currentYear),
            }))
            .filter((campus) => campus.name);

        if (processedCampuses.length === 0) {
            throw new Error("No valid campus data found in Form A2.");
        }

        const token = localStorage.getItem("token");
        await axios.post(`${config.API_URL}/suc-campuses`, processedCampuses, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        return processedCampuses.map((campus) => ({ sucCampuses: campus }));
    } catch (error) {
        console.error("Form A2 processing error:", error);
        throw new Error(error.response?.data?.error || `Failed to process Form A2: ${error.message}`);
    }
  };

  const handleClose = () => {
    setErrors({});
    setUploadStatus(null);
    setUploadMessage("");
    setSelectedHei(null);
    setSelectedRegion(null);
    setSelectedProvince(null);
    setSelectedMunicipality(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title="Upload SUC Data"
      subtitle="Import HEMIS Form A Excel files with institutional and campus data"
      icon={Upload}
      variant="default"
      size="xl"
    >
      <div className="space-y-4 p-4">
        {/* Upload Status Alert */}
        {uploadStatus && (
          <div className={`p-4 rounded-xl border shadow-sm ${
            uploadStatus === "success"
              ? "bg-green-50/80 border-green-200 text-green-800"
              : uploadStatus === "error"
              ? "bg-red-50/80 border-red-200 text-red-800"
              : "bg-blue-50/80 border-blue-200 text-blue-800"
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {uploadStatus === "success" && <CheckCircle className="w-5 h-5 mr-2" />}
                {uploadStatus === "error" && <AlertCircle className="w-5 h-5 mr-2" />}
                {uploadStatus === "loading" && (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-800 mr-2"></div>
                )}
                <span className="font-medium">{uploadMessage}</span>
              </div>
              {uploadStatus !== "loading" && (
                <button onClick={clearUploadStatus} className="text-gray-500 hover:text-gray-700 transition-colors duration-200">
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
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-base font-semibold text-gray-900">Institution Selection</h3>
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
                onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
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
              {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year}</p>}
            </div>
          </div>
        </div>

        {/* Location Selection */}
        <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 rounded-xl p-4 border border-emerald-200/60 shadow-sm">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-emerald-500 rounded-lg shadow-sm">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-base font-semibold text-gray-900">Location (Optional)</h3>
          </div>
          {loading ? (
            <div className="flex items-center justify-center p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-emerald-600 mr-2"></div>
              <span className="text-sm text-gray-500">Loading location data...</span>
            </div>
          ) : error ? (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {error}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                <Select
                  options={regionOptions}
                  value={regionOptions.find((option) => option.value === selectedRegion) || null}
                  onChange={handleRegionChange}
                  placeholder="Select region..."
                  isClearable
                  isSearchable
                  className="text-sm"
                  classNamePrefix="select"
                  styles={customSelectStyles}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                <Select
                  options={provinceOptions}
                  value={provinceOptions.find((option) => option.value === selectedProvince) || null}
                  onChange={handleProvinceChange}
                  placeholder={selectedRegion ? "Select province..." : "Select region first"}
                  isClearable
                  isSearchable
                  isDisabled={!selectedRegion}
                  className="text-sm"
                  classNamePrefix="select"
                  styles={customSelectStyles}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Municipality</label>
                <Select
                  options={municipalityOptions}
                  value={municipalityOptions.find((option) => option.value === selectedMunicipality) || null}
                  onChange={handleMunicipalityChange}
                  placeholder={selectedProvince ? "Select municipality..." : "Select province first"}
                  isClearable
                  isSearchable
                  isDisabled={!selectedProvince}
                  className="text-sm"
                  classNamePrefix="select"
                  styles={customSelectStyles}
                />
              </div>
            </div>
          )}
        </div>

        {/* Upload Instructions */}
        <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 rounded-xl p-4 border border-amber-200/60 shadow-sm">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-amber-500 rounded-lg shadow-sm">
              <Info className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-base font-semibold text-gray-900">Upload Instructions</h3>
          </div>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start space-x-3">
              <FileText className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium mb-1">HEMIS Form A Excel Files:</p>
                <ul className="space-y-1 ml-2">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                    <strong>Form A1:</strong> SUC Institutional Profile (details, address, contact, leadership)
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                    <strong>Form A2:</strong> Campus Information (names, locations, officials, coordinates)
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Database className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <p>The system processes Form A1 first to create the institutional profile, then links Form A2 campus data to it.</p>
            </div>
            <div className="flex items-start space-x-3">
              <Globe className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <p>Supported formats: .xlsx, .xls, and .csv files</p>
            </div>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 rounded-xl p-4 border border-slate-200/60 shadow-sm">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-slate-600 rounded-lg shadow-sm">
              <FileSpreadsheet className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-base font-semibold text-gray-900">File Upload</h3>
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
            <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
              !selectedHei || isUploading
                ? "border-gray-200 bg-gray-50/50"
                : "border-slate-300 hover:border-slate-400 hover:bg-slate-50/50 bg-white"
            }`}>
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                !selectedHei || isUploading
                  ? "bg-gray-100"
                  : "bg-gradient-to-br from-slate-100 to-slate-200"
              }`}>
                {isUploading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
                ) : (
                  <Upload className={`w-8 h-8 ${!selectedHei ? "text-gray-300" : "text-slate-600"}`} />
                )}
              </div>
              <p className={`text-lg font-semibold mb-2 ${
                !selectedHei || isUploading ? "text-gray-400" : "text-gray-900"
              }`}>
                {isUploading ? "Processing File..." : "Choose Excel File to Upload"}
              </p>
              <p className={`text-sm mb-2 ${
                !selectedHei || isUploading ? "text-gray-400" : "text-gray-600"
              }`}>
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
                  <span className="text-sm text-red-500 font-medium">Select an institution first</span>
                </div>
              )}
              {uploadStatus === "loading" && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full animate-pulse" style={{width: "60%"}}></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{uploadMessage}</p>
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
          {uploadStatus === "success" && (
            <button
              onClick={() => {
                setUploadStatus(null);
                setUploadMessage("");
                setSelectedHei(null);
                setSelectedRegion(null);
                setSelectedProvince(null);
                setSelectedMunicipality(null);
              }}
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm hover:shadow-md transition-all duration-200 font-medium flex items-center justify-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Upload Another File
            </button>
          )}
        </div>
      </div>
    </Dialog>
  );
}

SucUploadModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDataImported: PropTypes.func.isRequired,
};

export default SucUploadModal;
