import { useState, useEffect } from "react";
import { X, Upload, FileSpreadsheet, AlertCircle, CheckCircle, Building2, MapPin } from "lucide-react";
import Select from "react-select";
import * as XLSX from "xlsx";
import axios from "axios";
import config from "../../../../utils/config";
import PropTypes from "prop-types";
import useLocationData from "../../../../Hooks/useLocationData";
import Dialog from "../../../../Components/Dialog";

function SucUploadModal({ isOpen, onClose, onDataImported }) {
  const [uploadStatus, setUploadStatus] = useState(null); // null, 'loading', 'success', 'error'
  const [uploadMessage, setUploadMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [heis, setHeis] = useState([]);
  const [selectedHei, setSelectedHei] = useState(null);
  const [loadingHeis, setLoadingHeis] = useState(false);
  const [heiError, setHeiError] = useState("");
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
        label: hei.name,
        name: hei.name,
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
      const response = await axios.get(`${config.API_URL}/heis?type=SUC`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setHeis(response.data);
    } catch (error) {
      console.error("Error fetching HEIs:", error);
      setUploadStatus("error");
      setUploadMessage("Failed to load institutions. Please try again.");
    } finally {
      setLoadingHeis(false);
    }
  };

  // Format regions for react-select
  const regionOptions = Array.isArray(regions)
    ? regions.map((region) => ({
        value: region.name,
        label: region.name,
      }))
    : [];

  // Format provinces for react-select based on selected region
  const provinceOptions = Array.isArray(provinces)
    ? provinces
        .filter((province) => province.region.name === selectedRegion)
        .map((province) => ({
          value: province.name,
          label: province.name,
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

  const autonomousMapping = {
    "1": "CAMPUS IS AUTONOMOUS FROM THE SUC MAIN CAMPUS",
    "2": "CAMPUS IS NOT AUTONOMOUS FROM MAIN CAMPUS",
    "3": "NO INFORMATION ON THE MATTER",
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

    // Check if HEI is selected
    if (!selectedHei) {
      setUploadStatus("error");
      setUploadMessage("Please select an institution first before uploading Excel file.");
      setHeiError("Please select an institution.");
      return;
    }
    setHeiError("");

    // Validate file type
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv",
    ];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/i)) {
      setUploadStatus("error");
      setUploadMessage("Please upload a valid Excel file (.xlsx, .xls) or CSV file.");
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
        setUploadMessage(`Processing ${sheet.description} from ${sheet.name} (30%)...`);
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
        setUploadMessage(`Processing ${sheet.description} from ${sheet.name} (70%)...`);
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
      setUploadMessage(successMessage.trim() + " (100%)");
      // Reset state
      setSelectedHei(null);
      setSelectedRegion(null);
      setSelectedProvince(null);
      setSelectedMunicipality(null);
    } else {
      setUploadStatus("error");
      setUploadMessage(`No valid data imported. Errors: ${errors.join("; ")}`);
    }
  };

  const processFormA1 = async (worksheet) => {
    try {
      setUploadMessage("Processing Form A1 data and saving to database (40%)...");

      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: "",
        raw: false,
      });
      console.log("Parsed JSON data from Form A1:", jsonData);

      const extractedInstitution = {
        hei_uiid: selectedHei?.uiid || "", // Required field
        region: parseString(selectedRegion) || null, // Optional
        province: parseString(selectedProvince) || null, // Optional
        municipality: parseString(selectedMunicipality) || null, // Optional
        address_street: parseString(jsonData[7]?.[2] || ""), // Optional
        postal_code: parseString(jsonData[11]?.[2] || ""), // Optional
        institutional_telephone: parseString(jsonData[12]?.[2] || ""), // Optional
        institutional_fax: parseString(jsonData[13]?.[2] || ""), // Optional
        head_telephone: parseString(jsonData[14]?.[2] || ""), // Optional
        institutional_email: parseString(jsonData[15]?.[2] || ""), // Optional
        institutional_website: parseString(jsonData[16]?.[2] || ""), // Optional
        year_established: toNullableInteger(jsonData[17]?.[2]), // Optional
        sec_registration: parseString(jsonData[18]?.[2] || ""), // Optional
        year_granted_approved: toNullableInteger(jsonData[19]?.[2]), // Optional
        year_converted_college: toNullableInteger(jsonData[20]?.[2]), // Optional
        year_converted_university: toNullableInteger(jsonData[21]?.[2]), // Optional
        head_name: parseString(jsonData[22]?.[2] || ""), // Optional
        head_title: parseString(jsonData[23]?.[2] || ""), // Optional
        head_education: parseString(jsonData[24]?.[2] || ""), // Optional
        institution_type: "SUC", // Hardcoded as SUC based on fetchHeis filter
        report_year: parseInteger(selectedYear, 1800, new Date().getFullYear()), // Required field
      };

      console.log("Extracted institution data from Form A1:", extractedInstitution);
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
      console.log("Institution response:", institutionResponse.data);


      const institutionId = institutionResponse.data.id;
      if (!institutionId || isNaN(Number(institutionId))) {
        throw new Error("Invalid institution ID received from server.");
      }
      console.log("Institution ID:", institutionId);

      return [{ institution: { id: institutionId, ...extractedInstitution } }];
    } catch (error) {
      console.error("Form A1 processing error:", error);
      throw new Error(error.response?.data?.error || `Failed to process Form A1: ${error.message}`);
    }
  };

  const processFormA2 = async (worksheet, institutionId) => {
    try {
        setUploadMessage("Processing Form A2 data and saving to database (80%)...");

        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            defval: "",
            raw: false,
        });
        console.log("Parsed JSON data from Form A2:", jsonData);

        // Find the row where "START BELOW THIS ROW" is located
        const startRow = jsonData.findIndex((row) =>
            row.some((cell) => String(cell).toUpperCase().includes("START BELOW THIS ROW"))
        ) + 1; // Add 1 to start processing from the next row

        if (startRow <= 0) {
            throw new Error('Marker "START BELOW THIS ROW" not found in the sheet.');
        }

        const currentYear = new Date().getFullYear();

        const processedCampuses = jsonData
            .slice(startRow)
            .filter((row) => row.some((cell) => cell !== undefined && cell !== ""))
            .map((row) => ({
                suc_details_id: Number.parseInt(institutionId, 10) || null, // Required field
                name: parseString(row[1]) || "", // Required field
                campus_type: parseString(row[2]), // Optional
                institutional_code: parseString(row[3]), // Optional
                region: regionMapping[row[4]] || parseString(row[4]) || "", // Optional
                province_municipality: parseString(row[5]) || "", // Optional
                year_first_operation: parseInteger(row[6], 1800, currentYear), // Optional
                land_area_hectares: parseNumeric(row[7], 0), // Optional
                distance_from_main: parseNumeric(row[8], 0), // Optional
                autonomous_code: autonomousMapping[row[9]] || parseString(row[9]), // Optional
                position_title: headTitleMapping[row[10]] || parseString(row[10]), // Optional
                head_full_name: parseString(row[11]), // Optional
                former_name: parseString(row[12]), // Optional
                latitude_coordinates: parseNumeric(row[13], -90, 90), // Optional
                longitude_coordinates: parseNumeric(row[14], -180, 180), // Optional
                report_year: parseInteger(selectedYear, 1800, currentYear), // Optional
            }))
            .filter((campus) => campus.name); // Skip rows without campus name

        if (processedCampuses.length === 0) {
            throw new Error("No valid campus data found in Form A2.");
        }

        console.log("Processed campuses from Form A2:", processedCampuses);
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

  if (!isOpen) return null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Upload SUC Data"
      subtitle="Upload HEMIS Form A Excel files with multiple sheets"
      icon={Upload}
      variant="default"
      size="xl"
    >
      {/* Upload Status Alert */}
      {uploadStatus && (
        <div
          className={`mb-6 p-4 rounded-lg border ${
            uploadStatus === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : uploadStatus === "error"
              ? "bg-red-50 border-red-200 text-red-800"
              : "bg-blue-50 border-blue-200 text-blue-800"
          }`}
        >
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
              <button onClick={clearUploadStatus} className="text-gray-500 hover:text-gray-700">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Upload Section */}
      <div>
        {/* HEI Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Building2 className="w-4 h-4 inline mr-1" />
            Select Institution (HEI) *
          </label>
          {loadingHeis ? (
            <div className="flex items-center justify-center p-4 border border-gray-300 rounded-md">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-gray-600">Loading institutions...</span>
            </div>
          ) : (
            <>
              <Select
                options={heiOptions}
                value={heiOptions.find((option) => option.value === selectedHei?.uiid) || null}
                onChange={(selectedOption) => {
                  setSelectedHei(
                    selectedOption
                      ? { uiid: selectedOption.value, name: selectedOption.name }
                      : null
                  );
                  setHeiError("");
                }}
                placeholder="Search and select an institution..."
                isClearable
                isSearchable
                className={`text-sm ${heiError ? "border-red-500" : ""}`}
                classNamePrefix="select"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: heiError ? "#ef4444" : base.borderColor,
                    "&:hover": { borderColor: heiError ? "#ef4444" : "#3b82f6" },
                  }),
                }}
              />
              {heiError && <p className="mt-1 text-sm text-red-600">{heiError}</p>}
            </>
          )}
        </div>

        {/* Location Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            Select Location
          </label>
          {loading ? (
            <div className="flex items-center justify-center p-4 border border-gray-300 rounded-md">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-gray-600">Loading location data...</span>
            </div>
          ) : error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                />
              </div>
            </div>
          )}
        </div>

        {/* Year Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Building2 className="w-4 h-4 inline mr-1" />
            Select Year *
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="block w-full border border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
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
        </div>

        {/* Upload Instructions */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
          <div className="flex items-start">
            <FileSpreadsheet className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-1">HEMIS Excel Upload Instructions:</p>
              <p className="mb-2">Upload HEMIS Form A Excel files with multiple sheets:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  <strong>Form A1:</strong> SUC Institutional Profile (institution details, address, contact info, head
                  information)
                </li>
                <li>
                  <strong>Form A2:</strong> Campus Information (campus names, locations, officials, coordinates)
                </li>
              </ul>
              <p className="mt-2">
                The system will process Form A1 (if present) to create or update the institutional profile, then link Form A2 campus data to it. If uploading only Form A2, ensure an institutional profile exists for the selected institution and year.
              </p>
            </div>
          </div>
        </div>

        {/* File Upload Button */}
        <div className="mb-6">
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
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                !selectedHei ? "border-gray-200 bg-gray-50" : "border-gray-300 hover:border-gray-400 bg-white"
              }`}
            >
              <Upload className={`w-12 h-12 mx-auto mb-4 ${!selectedHei ? "text-gray-300" : "text-gray-400"}`} />
              <p className={`text-lg font-medium mb-2 ${!selectedHei ? "text-gray-400" : "text-gray-900"}`}>
                {isUploading ? "Processing..." : "Choose Excel File to Upload"}
              </p>
              <p className={`text-sm ${!selectedHei ? "text-gray-400" : "text-gray-500"}`}>
                Supports .xlsx, .xls, and .csv files
              </p>
              {!selectedHei && <p className="text-sm text-red-500 mt-2">Select an institution first</p>}
              {isUploading && (
                <div className="mt-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Close
          </button>
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
