import { useState, useEffect } from "react";
import {
    Container,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Tooltip,
    CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import axios from "axios";

const CurricularProgram = () => {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const response = await axios.get("/api/programs");
                console.log("API Response:", response.data);

                if (Array.isArray(response.data)) {
                    setPrograms(response.data);
                } else {
                    console.error("Invalid data format:", response.data);
                    setPrograms([]);
                }
            } catch (error) {
                console.error("Error fetching programs:", error);
                setPrograms([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPrograms();
    }, []);

    // Handle file upload and Excel parsing
    const handleFileUpload = (event) => {
        const file = event.target.files[0];

        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const parsedData = XLSX.utils.sheet_to_json(sheet);

            console.log("Excel Data:", parsedData);
            setPrograms(parsedData); // Temporarily setting programs from Excel for preview
        };

        reader.readAsArrayBuffer(file);
    };

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom>
                Curricular Programs (HEMIS 2024)
            </Typography>

            {/* Buttons for Adding New Program & Importing Excel */}
            <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => navigate("/admin/curricular-programs/new")}
                sx={{ mb: 2, mr: 2 }}
            >
                Add New Program
            </Button>

            <input
                type="file"
                accept=".xlsx, .xls"
                style={{ display: "none" }}
                id="file-upload"
                onChange={handleFileUpload}
            />
            <label htmlFor="file-upload">
                <Button
                    variant="contained"
                    color="secondary"
                    component="span"
                    startIcon={<UploadFileIcon />}
                    sx={{ mb: 2 }}
                >
                    Import Excel
                </Button>
            </label>

            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>
                                Program Name
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                                Program Code
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                                Status
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                                Total Enrollment
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                                Total Graduates
                            </TableCell>
                            <TableCell
                                sx={{ fontWeight: "bold", textAlign: "center" }}
                            >
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : programs.length > 0 ? (
                            programs.map((program, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        {program.program_name || "N/A"}
                                    </TableCell>
                                    <TableCell>
                                        {program.program_code || "N/A"}
                                    </TableCell>
                                    <TableCell>
                                        {program.program_status || "N/A"}
                                    </TableCell>
                                    <TableCell>
                                        {program.enrollments?.[0]
                                            ?.grand_total || 0}
                                    </TableCell>
                                    <TableCell>
                                        {program.statistics?.graduates_total ||
                                            0}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="View Details">
                                            <IconButton
                                                color="primary"
                                                onClick={() =>
                                                    navigate(
                                                        `/admin/curricular-programs/${program.id}`
                                                    )
                                                }
                                            >
                                                <VisibilityIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Edit Program">
                                            <IconButton
                                                color="warning"
                                                onClick={() =>
                                                    navigate(
                                                        `/admin/curricular-programs/edit/${program.id}`
                                                    )
                                                }
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No programs found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default CurricularProgram;
