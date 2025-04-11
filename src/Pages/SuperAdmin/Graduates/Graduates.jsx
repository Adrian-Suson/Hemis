import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import * as XLSX from "xlsx";
import axios from "axios";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Snackbar,
  Alert,
  Breadcrumbs,
  Link,
  ButtonGroup,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import config from "../../../utils/config";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import GraduatesTable from "./GraduatesTable";

const Graduates = () => {
  const [graduates, setGraduates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { institutionId } = useParams(); // Call useParams at top level

  useEffect(() => {
    fetchGraduates();
  }, []);

  const fetchGraduates = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${config.API_URL}/graduates`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const formattedData = (response.data.data || []).map((graduate) => ({
        ...graduate,
        date_of_birth: formatDate(graduate.date_of_birth),
        date_graduated: formatDate(graduate.date_graduated),
      }));
      setGraduates(formattedData);
    } catch (error) {
      console.error("Error fetching graduates:", error);
      setSnackbarMessage(`Failed to fetch graduates: ${error.message}`);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
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
    console.log("File upload event:", institutionId);
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    processExcelFile(file, institutionId);
  };

  const processExcelFile = async (file, institutionId) => {
    if (!file) return;

    const token = localStorage.getItem("token");

    if (!token) {
      setSnackbarMessage("Authentication token is missing.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }

    if (!institutionId) {
      setSnackbarMessage("Institution ID is missing from the URL.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }

    try {
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
            range: 1,
          });

          console.log(`Raw JSON data for sheet "${sheetName}":`, jsonData);

          const validRows = jsonData.filter(
            (row) =>
              row.some((cell) => cell !== undefined && cell !== null) && row[0]
          );

          console.log(`Valid rows for sheet "${sheetName}":`, validRows);

          if (validRows.length === 0) {
            console.log(`Skipping empty sheet: ${sheetName}`);
            continue;
          }

          const processedGraduates = validRows.map((row) => {
            const formatDate = (date) => {
              if (!date) return null;
              try {
                const parsedDate = new Date(date);
                if (isNaN(parsedDate.getTime())) return date;
                return parsedDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
              } catch {
                return date;
              }
            };

            return {
              institution_id: institutionId, // Use passed institutionId
              student_id: row[0] ? String(row[0]) : null,
              last_name: row[1] ? String(row[1]) : null,
              first_name: row[2] ? String(row[2]) : null,
              middle_name: row[3] ? String(row[3]) : null,
              sex: row[4] ? String(row[4]) : null,
              date_of_birth: row[5] ? formatDate(row[5]) : null,
              date_graduated: row[6] ? formatDate(row[6]) : null,
              program_name: row[7] ? String(row[7]) : null,
              program_major: row[8] ? String(row[8]) : null,
              program_authority_to_operate_graduate: row[9]
                ? String(row[9])
                : null,
              year_granted: row[10] ? parseInt(row[10], 10) : null,
            };
          });

          console.log(
            `Processed graduates for sheet "${sheetName}":`,
            processedGraduates
          );

          processedGraduates.forEach((graduate) => {
            const graduateString = JSON.stringify(graduate);
            if (!seenGraduates.has(graduateString)) {
              seenGraduates.add(graduateString);
              allGraduates.push(graduate);
            }
          });
        }

        console.log("Final processed graduates:", allGraduates);

        uploadToBackend(allGraduates);
      };

      reader.onerror = (error) => {
        console.error("Error reading Excel file:", error);
        setSnackbarMessage(`Failed to read Excel file: ${error.message}`);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        setLoading(false);
      };
    } catch (error) {
      console.error("Error processing Excel file:", error);
      setSnackbarMessage(`Failed to process Excel file: ${error.message}`);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setLoading(false);
    }
  };

  const uploadToBackend = async (data) => {
    console.log("Uploading data to backend:", data);
    try {
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

      setSnackbarMessage(
        response.data.message || "Graduates uploaded successfully!"
      );
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      fetchGraduates();
    } catch (error) {
      console.error("Error uploading graduates:", error);
      setSnackbarMessage(
        `Failed to upload graduates: ${
          error.response?.data?.message || error.message
        }`
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
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

    graduates.forEach((graduate) => {
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

  return (
    <Box sx={{ p: 3 }}>
      <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link
          underline="hover"
          color="inherit"
          sx={{ cursor: "pointer" }}
          onClick={() => navigate("/Super-admin/dashboard")}
        >
          Dashboard
        </Link>
        <Link
          underline="hover"
          color="inherit"
          sx={{ cursor: "pointer" }}
          onClick={() => navigate("/Super-admin/institutions")}
        >
          Institution Management
        </Link>
        <Typography color="textPrimary">List of Graduates</Typography>
      </Breadcrumbs>

      <ButtonGroup
        sx={{ mb: 3, display: "flex", justifyContent: "flex-end" }}
      >
        <Button
          variant="contained"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          Upload Excel File
        </Button>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          ref={fileInputRef}
          style={{ display: "none" }}
          id="upload-excel"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={exportToExcel}
          disabled={loading || graduates.length === 0}
        >
          Export to Excel
        </Button>
      </ButtonGroup>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
          <CircularProgress />
        </Box>
      ) : graduates.length > 0 ? (
        <GraduatesTable graduates={graduates} />
      ) : (
        <Typography>No data available</Typography>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Graduates;
