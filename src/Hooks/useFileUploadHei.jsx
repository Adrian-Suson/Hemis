import { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import useActivityLog from "../../../Hooks/useActivityLog";
import { useLoading } from "../../../Context/LoadingContext";
import AlertComponent from "../Components/AlertComponent";

const useFileUploadHei = ({
  fetchInstitutions,
  setOpenUploadDialog,
  setSelectedFile,
  setSelectedInstitutionType,
  setSelectedRegion,
  setSelectedProvince,
  setSelectedMunicipality,
}) => {
  const [uploading, setUploading] = useState(false);
  const { createLog } = useActivityLog();
  const { showLoading, hideLoading, updateProgress } = useLoading();

  const handleFileUpload = async (
    selectedFile,
    selectedInstitutionType,
    selectedRegion,
    selectedProvince,
    selectedMunicipality,
    reportYear,
    uuid
  ) => {
    if (!selectedFile || !selectedInstitutionType) {
      AlertComponent.showAlert(
        "Please select both an institution type and a file.",
        "warning"
      );
      return;
    }

    setUploading(true);
    setOpenUploadDialog(false);
    showLoading();
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
          municipality_id: Number.parseInt(selectedMunicipality, 10) || null,
          province_id: Number.parseInt(selectedProvince, 10) || null,
          postal_code: String(jsonDataA1[11]?.[2] || ""),
          institutional_telephone: String(jsonDataA1[12]?.[2] || ""),
          institutional_fax: String(jsonDataA1[13]?.[2] || ""),
          head_telephone: String(jsonDataA1[14]?.[2] || ""),
          institutional_email: String(jsonDataA1[15]?.[2] || ""),
          institutional_website: String(jsonDataA1[16]?.[2] || ""),
          year_established: toNullableInteger(jsonDataA1[17]?.[2]),
          sec_registration: String(jsonDataA1[18]?.[2] || ""),
          year_granted_approved: toNullableInteger(jsonDataA1[19]?.[2]),
          year_converted_college: toNullableInteger(jsonDataA1[20]?.[2]),
          year_converted_university: toNullableInteger(jsonDataA1[21]?.[2]),
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
        await createLog({
          action: "uploaded_institution",
          description: `Uploaded institution: ${extractedInstitution.name}`,
          modelType: "App\\Models\\Institution",
          modelId: institutionResponse.data.id,
          properties: extractedInstitution,
        });

        AlertComponent.showAlert(
          "Institution data uploaded successfully!",
          "success"
        );

        const institutionId = institutionResponse.data.id;
        if (!institutionId || isNaN(Number(institutionId))) {
          throw new Error("Invalid institution ID received from server.");
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
          .filter((row) => row.some((cell) => cell !== undefined && cell !== ""))
          .map((row) => {
            const parseNumeric = (value, min, max) => {
              if (value === undefined || value === "" || isNaN(value))
                return null;
              const num = Number.parseFloat(value);
              if (min !== undefined && num < min) return null;
              if (max !== undefined && num > max) return null;
              return num;
            };

            const parseInteger = (value, min, max) => {
              if (value === undefined || value === "" || isNaN(value))
                return null;
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

            return {
              suc_name: parseString(row[1]),
              campus_type: parseString(row[2]),
              institutional_code: parseString(row[3]),
              region: parseString(row[4]) || "",
              province_municipality: parseString(row[5]) || "",
              year_first_operation: parseInteger(row[6], 1800, currentYear),
              land_area_hectares: parseNumeric(row[7], 0),
              distance_from_main: parseNumeric(row[8], 0),
              autonomous_code: parseString(row[9]),
              position_title: parseString(row[10]),
              head_full_name: parseString(row[11]),
              former_name: parseString(row[12]),
              latitude_coordinates: parseNumeric(row[13], -90, 90),
              longitude_coordinates: parseNumeric(row[14], -180, 180),
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

        AlertComponent.showAlert("Campuses added successfully!", "success");
        updateProgress(100);
      } catch (error) {
        console.error("Error sending data to backend:", error);
        const errorMessage =
          error.response?.data?.message ||
          "Error uploading institution or campus data.";
        const validationErrors = error.response?.data?.errors || {};
        console.log("Validation errors:", validationErrors);

        if (
          error.response?.status === 422 &&
          errorMessage.includes("UUID and report year")
        ) {
          AlertComponent.showAlert(
            "An institution with the same UUID and report year already exists.",
            "error"
          );
        } else {
          AlertComponent.showAlert(`${errorMessage}`, "error");
        }
      } finally {
        setUploading(false);
        hideLoading();
        setOpenUploadDialog(false);
        setSelectedFile(null);
        setSelectedInstitutionType("");
        setSelectedRegion("");
        setSelectedProvince("");
        setSelectedMunicipality("");
        fetchInstitutions();
      }
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  return { handleFileUpload, uploading };
};

export default useFileUploadHei;