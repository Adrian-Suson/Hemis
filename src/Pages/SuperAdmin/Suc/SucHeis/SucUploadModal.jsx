import { useState, useEffect } from "react";
import { X, Upload, FileSpreadsheet, AlertCircle, CheckCircle, Building2, MapPin } from "lucide-react";
import Select from "react-select";
import * as XLSX from "xlsx";
import axios from "axios";
import config from "../../../../utils/config";
import PropTypes from "prop-types";
import useLocationData from "../../../../Hooks/useLocationData";

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
        label: `${hei.name} (${hei.uiid})`,
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

    if (!jsonData || jsonData.length === 0) {
      throw new Error("Form A1 worksheet is empty or invalid");
    }

    console.log("Parsed JSON data from Form A1:", jsonData);

    // Dynamic field mapping - based on exact field labels from Form A1
    const fieldMappings = {
      institution_name: ["institution name", "institution name (no abbreviation please)"],
      address_street: ["street", "address of suc main campus", "main campus"],
      municipality_city: ["municipalitycity", "municipality", "city"],
      province: ["province"],
      region: ["region"],
      postal_code: ["postal or zip code", "postal code", "zip code"],
      institutional_telephone: ["institutional telephone", "institutional telephone (include area code)"],
      institutional_fax: ["institutional fax", "institutional fax no", "institutional fax no. (include area code)"],
      head_telephone: ["institutional head's telephone", "institutional head's telephone ( include area code)", "head telephone"],
      institutional_email: ["institutional e-mail address", "institutional email", "e-mail address"],
      institutional_website: ["institutional web site", "web site", "website"],
      year_established: ["year established"],
      sec_registration: ["latest sec registration", "latest sec registration/enabling law or charter", "sec registration", "enabling law", "charter"],
      year_granted_approved: ["year granted or approved", "year granted", "year approved"],
      year_converted_college: ["year converted to college status", "converted to college", "college status"],
      year_converted_university: ["year converted to university status", "converted to university", "university status"],
      head_name: ["name of institutional head", "institutional head", "head name"],
      head_title: ["title of head of institution", "head title", "title of head"],
      head_education: ["highest educational attainment of the head", "educational attainment", "head education"]
    };

    // Function to find cell value by searching for field labels
    const findFieldValue = (searchTerms, dataType = 'string') => {
      for (let rowIndex = 0; rowIndex < jsonData.length; rowIndex++) {
        const row = jsonData[rowIndex];
        if (!row || !Array.isArray(row)) continue;

        for (let colIndex = 0; colIndex < row.length; colIndex++) {
          const cell = String(row[colIndex] || "").toLowerCase().trim();

          // Check if any search term matches the cell content
          const matchFound = searchTerms.some(term =>
            cell.includes(term.toLowerCase()) ||
            cell === term.toLowerCase()
          );

          if (matchFound) {
            // Look for the value in adjacent cells (right, below, or next row same column)
            const possibleValueCells = [
              row[colIndex + 1], // Same row, next column
              row[colIndex + 2], // Same row, two columns right
              jsonData[rowIndex + 1]?.[colIndex], // Next row, same column
              jsonData[rowIndex + 1]?.[colIndex + 1], // Next row, next column
              jsonData[rowIndex]?.[colIndex + 3], // Same row, three columns right
            ];

            for (const valueCell of possibleValueCells) {
              if (valueCell !== undefined && valueCell !== null && String(valueCell).trim() !== "") {
                const cleanValue = String(valueCell).trim();
                console.log(`Found ${searchTerms[0]}: "${cleanValue}" at position [${rowIndex}][${colIndex}]`);

                // Return parsed value based on data type
                switch (dataType) {
                  case 'integer':
                    return toNullableInteger(cleanValue);
                  case 'string':
                  default:
                    return parseString(cleanValue);
                }
              }
            }
          }
        }
      }

      console.warn(`Field not found for search terms: ${searchTerms.join(', ')}`);
      return dataType === 'integer' ? null : null;
    };

    // Extract institution data using dynamic field mapping
    const extractedInstitution = {
      hei_uiid: selectedHei?.uiid || "",
      institution_name: findFieldValue(fieldMappings.institution_name),
      region: parseString(selectedRegion) || findFieldValue(fieldMappings.region),
      province: parseString(selectedProvince) || findFieldValue(fieldMappings.province),
      municipality: parseString(selectedMunicipality) || findFieldValue(fieldMappings.municipality_city),
      address_street: findFieldValue(fieldMappings.address_street),
      postal_code: findFieldValue(fieldMappings.postal_code),
      institutional_telephone: findFieldValue(fieldMappings.institutional_telephone),
      institutional_fax: findFieldValue(fieldMappings.institutional_fax),
      head_telephone: findFieldValue(fieldMappings.head_telephone),
      institutional_email: findFieldValue(fieldMappings.institutional_email),
      institutional_website: findFieldValue(fieldMappings.institutional_website),
      year_established: findFieldValue(fieldMappings.year_established, 'integer'),
      sec_registration: findFieldValue(fieldMappings.sec_registration),
      year_granted_approved: findFieldValue(fieldMappings.year_granted_approved, 'integer'),
      year_converted_college: findFieldValue(fieldMappings.year_converted_college, 'integer'),
      year_converted_university: findFieldValue(fieldMappings.year_converted_university, 'integer'),
      head_name: findFieldValue(fieldMappings.head_name),
      head_title: findFieldValue(fieldMappings.head_title),
      head_education: findFieldValue(fieldMappings.head_education),
      report_year: parseInteger(selectedYear),
    };

    console.log("Extracted institution data:", extractedInstitution);

    if (!extractedInstitution.hei_uiid) {
      throw new Error("Institution selection is required for Form A1.");
    }

    setUploadMessage("Saving Form A1 data to database (50%)...");

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

    // Log the upload action
    console.log({
      action: "uploaded_institution",
      description: `Uploaded institution data for ${selectedHei?.name}`,
    });

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
    console.log("Processing Form A2 worksheet:", worksheet);

    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: "",
      raw: false,
    });

    if (!jsonData || jsonData.length === 0) {
      throw new Error("Form A2 worksheet is empty or invalid");
    }

    console.log("Parsed JSON data from Form A2:", jsonData);

    // Dynamic header detection for Form A2 campus data - based on actual Excel headers
    const fieldMappings = {
      seq_no: ["seq. no.", "seq no", "sequence", "no."],
      suc_name: ["name of the suc campus", "suc campus", "campus name", "name of campus"],
      campus_type: ["main or satellite", "main or satellite?", "campus type", "type"],
      institutional_code: ["institutional code", "institutional code (use the one assigned by ched)", "ched code", "code"],
      region: ["region"],
      province_municipality: ["municipality/ city and province", "municipality/city and province", "municipality", "city and province", "location"],
      year_first_operation: ["year of first operation as a suc", "year of first operation", "first operation", "year established"],
      land_area_hectares: ["land area in hectares", "land area", "hectares", "area"],
      distance_from_main: ["distance from main campus", "distance from main campus ( kms)", "distance", "kms from main"],
      autonomous_code: ["autonomous from the main campus", "autonomous from the main campus? (use code)", "autonomous", "autonomy code"],
      position_title: ["position title of highest official", "position title of highest official in the campus", "position title", "official title"],
      head_full_name: ["full name of highest official", "full name of highest official in the campus", "full name", "official name"],
      former_name: ["former name of the campus", "former name of the campus ( if any)", "former name", "previous name"],
      latitude_coordinates: ["latitude coordinates", "latitude", "lat"],
      longitude_coordinates: ["longitude coordinates", "longitude", "long", "lng"]
    };

    // Function to find header row and column mappings
    const findHeaderMappings = () => {
      const columnMappings = {};
      let headerRowIndex = -1;

      // Search for header row (look for rows with multiple field matches)
      for (let rowIndex = 0; rowIndex < Math.min(15, jsonData.length); rowIndex++) {
        const row = jsonData[rowIndex];
        if (!row || !Array.isArray(row)) continue;

        let matchCount = 0;
        const tempMappings = {};

        for (let colIndex = 0; colIndex < row.length; colIndex++) {
          const cellValue = String(row[colIndex] || "").toLowerCase().trim();

          // Check each field mapping
          for (const [fieldKey, searchTerms] of Object.entries(fieldMappings)) {
            const matchFound = searchTerms.some(term =>
              cellValue.includes(term.toLowerCase()) ||
              cellValue === term.toLowerCase()
            );

            if (matchFound) {
              tempMappings[fieldKey] = colIndex;
              matchCount++;
              console.log(`Found header "${fieldKey}" at column ${colIndex}: "${cellValue}"`);
              break;
            }
          }
        }

        // If we found a good number of headers, this is likely the header row
        if (matchCount >= 5) {
          headerRowIndex = rowIndex;
          Object.assign(columnMappings, tempMappings);
          break;
        }
      }

      console.log("Header mappings:", columnMappings);
      console.log("Header row index:", headerRowIndex);
      return { columnMappings, headerRowIndex };
    };

    // (Removed unused findDataStartRow function)

    const { columnMappings, headerRowIndex } = findHeaderMappings();

    // If no header found, use the actual column positions from the Excel file
    const defaultMappings = {
      seq_no: 0,           // Column A - "Seq. No."
      suc_name: 1,         // Column B - "NAME OF THE SUC CAMPUS"
      campus_type: 2,      // Column C - "MAIN OR SATELLITE?"
      institutional_code: 3, // Column D - "INSTITUTIONAL CODE"
      region: 4,           // Column E - "REGION"
      province_municipality: 5, // Column F - "MUNICIPALITY/ CITY AND PROVINCE"
      year_first_operation: 6,  // Column G - "YEAR OF FIRST OPERATION AS A SUC"
      land_area_hectares: 7,    // Column H - "LAND AREA IN HECTARES"
      distance_from_main: 8,    // Column I - "DISTANCE FROM MAIN CAMPUS ( KMS)"
      autonomous_code: 9,       // Column J - "AUTONOMOUS FROM THE MAIN CAMPUS? (USE CODE)"
      position_title: 10,       // Column K - "POSITION TITLE OF HIGHEST OFFICIAL IN THE CAMPUS"
      head_full_name: 11,       // Column L - "FULL NAME OF HIGHEST OFFICIAL IN THE CAMPUS"
      former_name: 12,          // Column M - "FORMER NAME OF THE CAMPUS ( IF ANY)"
      latitude_coordinates: 13, // Column N - "LATITUDE COORDINATES"
      longitude_coordinates: 14 // Column O - "LONGITUDE COORDINATES"
    };

    const actualMappings = Object.keys(columnMappings).length > 0 ? columnMappings : defaultMappings;
    const startRow = headerRowIndex >= 0 ? headerRowIndex + 1 : 13; // Data starts at row 13 based on Excel analysis

    console.log("Using column mappings:", actualMappings);
    console.log("Starting data from row:", startRow);

    // Helper function to get cell value using dynamic mapping
    const getCellValue = (row, fieldKey) => {
      const colIndex = actualMappings[fieldKey];
      return colIndex !== undefined ? row[colIndex] : undefined;
    };

    const currentYear = new Date().getFullYear();

    const processedCampuses = jsonData
      .slice(startRow)
      .filter((row) => {
        if (!row || !row.some((cell) => cell !== undefined && cell !== "")) {
          return false;
        }

        // More flexible filtering - check if any field has meaningful data
        const campusName = getCellValue(row, 'suc_name');
        const institutionalCode = getCellValue(row, 'institutional_code');
        const region = getCellValue(row, 'region');

        return (campusName && String(campusName).trim().length > 2) ||
               (institutionalCode && String(institutionalCode).trim().length > 2) ||
               (region && String(region).trim().length > 1);
      })
      .map((row, index) => {
        const campus = {
          suc_details_id: Number.parseInt(institutionId, 10), // Required by backend
          name: parseString(getCellValue(row, 'suc_name')), // Matches 'name' in backend validation
          campus_type: parseString(getCellValue(row, 'campus_type')),
          institutional_code: parseString(getCellValue(row, 'institutional_code')),
          region: regionMapping?.[getCellValue(row, 'region')] || parseString(getCellValue(row, 'region')) || "",
          province_municipality: parseString(getCellValue(row, 'province_municipality')) || "",
          year_first_operation: parseInteger(getCellValue(row, 'year_first_operation'), 1800, currentYear),
          land_area_hectares: parseNumeric(getCellValue(row, 'land_area_hectares'), 0),
          distance_from_main: parseNumeric(getCellValue(row, 'distance_from_main'), 0),
          autonomous_code: autonomousMapping?.[getCellValue(row, 'autonomous_code')] || parseString(getCellValue(row, 'autonomous_code')),
          position_title: headTitleMapping?.[getCellValue(row, 'position_title')] || parseString(getCellValue(row, 'position_title')),
          head_full_name: parseString(getCellValue(row, 'head_full_name')),
          former_name: parseString(getCellValue(row, 'former_name')),
          latitude_coordinates: parseNumeric(getCellValue(row, 'latitude_coordinates'), -90, 90),
          longitude_coordinates: parseNumeric(getCellValue(row, 'longitude_coordinates'), -180, 180),
          report_year: parseInteger(selectedYear, 1800, currentYear), // Matches 'report_year' in backend validation
        };

        // Log each processed campus for debugging
        console.log(`Processed campus ${index + 1}:`, campus);
        return campus;
      })
      .filter((campus) => {
        // More flexible final filtering - keep campus if it has essential data
        return campus.suc_name || campus.institutional_code || campus.region;
      });

    if (processedCampuses.length === 0) {
      // Enhanced error message with debugging info
      console.error("Debugging info for Form A2:");
      console.error("Total rows in sheet:", jsonData.length);
      console.error("Start row:", startRow);
      console.error("Column mappings:", actualMappings);
      console.error("Sample rows around start position:");
      for (let i = Math.max(0, startRow - 2); i < Math.min(jsonData.length, startRow + 5); i++) {
        console.error(`Row ${i}:`, jsonData[i]);
      }

      throw new Error(`No valid campus data found in Form A2.
        Debug info:
        - Total rows: ${jsonData.length}
        - Data start row: ${startRow}
        - Header found at row: ${headerRowIndex}
        - Column mappings found: ${Object.keys(columnMappings).length}
        Please check if the worksheet contains campus data with names, codes, or regions.`);
    }

    console.log("Final processed campuses:", JSON.stringify(processedCampuses, null, 2));

    const token = localStorage.getItem("token");
    const response = await axios.post(`${config.API_URL}/suc-campus`, processedCampuses, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Campus data saved successfully:", response.data);

    // Log the upload action
    console.log({
      action: "uploaded_campuses",
      description: `Uploaded ${processedCampuses.length} campus records`,
    });

    return processedCampuses.map((campus) => ({ sucCampuses: campus }));

  } catch (error) {
    console.error("Form A2 processing error:", error);
    throw new Error(error.response?.data?.error || `Failed to process Form A2: ${error.message}`);
  }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center overflow-y-auto h-full w-full z-50">
      <div className="p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Upload className="w-5 h-5 mr-2" />
            Upload SUC Data
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

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
      </div>
    </div>
  );
}

SucUploadModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDataImported: PropTypes.func.isRequired,
};

export default SucUploadModal;
