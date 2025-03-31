import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Menu,
    MenuItem,
    CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import DetailDialog from "./DetailDialog";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ApartmentIcon from "@mui/icons-material/Apartment";
import PeopleIcon from "@mui/icons-material/People";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import DescriptionIcon from "@mui/icons-material/Description";
import React, { useRef } from "react";
import ExcelJS from "exceljs";
import axios from "axios";

const InstitutionTable = ({ institutions, onEdit, setSnackbarMessage, setSnackbarSeverity, setSnackbarOpen }) => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role || "HEI Staff";
    const [selectedInstitution, setSelectedInstitution] = React.useState(null);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [loading, setLoading] = React.useState({
        viewCampuses: false,
        faculties: false,
        academicPrograms: false,
        exportFormA: false,
    });
    const menuButtonRef = useRef(null);

    const handleOpenDialog = (institution) => {
        localStorage.setItem("institutionId", institution.id);
        setSelectedInstitution(institution);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedInstitution(null);
        if (menuButtonRef.current) {
            menuButtonRef.current.focus();
        }
    };

    const handleMenuOpen = (event, institution) => {
        setAnchorEl(event.currentTarget);
        setSelectedInstitution(institution);
        menuButtonRef.current = event.currentTarget;
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        if (menuButtonRef.current) {
            menuButtonRef.current.focus();
        }
    };

    const handleNavigation = (path, type) => {
        setLoading((prev) => ({ ...prev, [type]: true }));
        setTimeout(() => {
            navigate(path);
            setLoading((prev) => ({ ...prev, [type]: false }));
        }, 500);
    };

    const handleExportToFormA = async (institution) => {
        setLoading((prev) => ({ ...prev, exportFormA: true }));

        try {
            const response = await fetch("/templates/Form-A-Themeplate.xlsx");
            if (!response.ok) {
                throw new Error(
                    `Failed to load template file: HTTP ${response.status} - ${response.statusText}`
                );
            }
            const arrayBuffer = await response.arrayBuffer();

            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(arrayBuffer);

            const sheetA1 = workbook.getWorksheet("FORM A1");
            const sheetA2 = workbook.getWorksheet("FORM A2");

            if (!sheetA1 || !sheetA2) {
                throw new Error(
                    "Template is missing required sheets: FORM A1 or FORM A2"
                );
            }

            const a1StartRow = 5;
            const a1Data = [
                institution.name || "N/A",
                "", // ADDRESS header
                "",
                institution.address_street || "N/A",
                institution.municipality_city || "N/A",
                institution.province || "N/A",
                institution.region || "N/A",
                institution.postal_code || "N/A",
                institution.institutional_telephone || "N/A",
                institution.institutional_fax || "N/A",
                institution.head_telephone || "N/A",
                institution.institutional_email || "N/A",
                institution.institutional_website || "N/A",
                institution.year_established || "N/A",
                institution.sec_registration || "N/A",
                institution.year_granted_approved || "N/A",
                institution.year_converted_college || "N/A",
                institution.year_converted_university || "N/A",
                institution.head_name || "N/A",
                institution.head_title || "N/A",
                institution.head_education || "N/A",
            ];

            a1Data.forEach((value, index) => {
                const row = sheetA1.getRow(a1StartRow + index);
                row.getCell(3).value = value;
                row.commit();
            });

            const token = localStorage.getItem("token");
            const campusResponse = await axios.get(
                `http://localhost:8000/api/campuses?institution_id=${institution.id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            let campuses = campusResponse.data.campuses || [];
            if (!Array.isArray(campuses)) {
                console.warn(
                    "Campuses is not an array, normalizing to empty array:",
                    campuses
                );
                campuses = [];
            }

            const a2StartRow = 14;
            if (campuses.length === 0) {
                console.log(
                    "No campuses to export for institution:",
                    institution.id
                );
            } else {
                campuses.forEach((campus, index) => {
                    const row = sheetA2.getRow(a2StartRow + index);
                    console.log(
                        `Populating row ${a2StartRow + index} with campus:`,
                        campus
                    );
                    row.values = [
                        index + 1,
                        campus.suc_name || "N/A",
                        campus.campus_type || "N/A",
                        campus.institutional_code || "N/A",
                        campus.region || "N/A",
                        campus.municipality_city_province || "N/A",
                        campus.year_first_operation || "N/A",
                        campus.land_area_hectares || "0.0",
                        campus.distance_from_main || "0.0",
                        campus.autonomous_code || "N/A",
                        campus.position_title || "N/A",
                        campus.head_full_name || "N/A",
                        campus.former_name || "N/A",
                        campus.latitude_coordinates || "0.0",
                        campus.longitude_coordinates || "0.0",
                    ];
                    row.commit();
                });
            }

            const fileName = `Form_A_${institution.institution_type || "Unknown"}_${
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

            setSnackbarMessage("Data exported successfully using template!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
        } catch (error) {
            console.error("Error exporting data:", error);
            setSnackbarMessage(`Error exporting data: ${error.message}`);
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        } finally {
            setLoading((prev) => ({ ...prev, exportFormA: false }));
            handleMenuClose();
        }
    };

    return (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table size="small" stickyHeader sx={{ borderCollapse: "collapse" }}>
                <TableHead>
                    <TableRow>
                        <TableCell
                            sx={{
                                fontWeight: "bold",
                                padding: "4px",
                                border: "1px solid rgba(224, 224, 224, 1)",
                                backgroundColor: "#f5f5f5",
                                fontSize: "0.75rem",
                            }}
                        >
                            Name
                        </TableCell>
                        <TableCell
                            sx={{
                                fontWeight: "bold",
                                padding: "4px",
                                border: "1px solid rgba(224, 224, 224, 1)",
                                backgroundColor: "#f5f5f5",
                                fontSize: "0.75rem",
                            }}
                        >
                            Region
                        </TableCell>
                        <TableCell
                            sx={{
                                fontWeight: "bold",
                                padding: "4px",
                                border: "1px solid rgba(224, 224, 224, 1)",
                                backgroundColor: "#f5f5f5",
                                fontSize: "0.75rem",
                            }}
                        >
                            Address
                        </TableCell>
                        <TableCell
                            sx={{
                                fontWeight: "bold",
                                padding: "4px",
                                border: "1px solid rgba(224, 224, 224, 1)",
                                backgroundColor: "#f5f5f5",
                                fontSize: "0.75rem",
                            }}
                        >
                            City
                        </TableCell>
                        <TableCell
                            sx={{
                                fontWeight: "bold",
                                padding: "4px",
                                border: "1px solid rgba(224, 224, 224, 1)",
                                backgroundColor: "#f5f5f5",
                                fontSize: "0.75rem",
                            }}
                        >
                            Province
                        </TableCell>
                        <TableCell
                            sx={{
                                fontWeight: "bold",
                                padding: "4px",
                                border: "1px solid rgba(224, 224, 224, 1)",
                                backgroundColor: "#f5f5f5",
                                fontSize: "0.75rem",
                            }}
                        >
                            Type
                        </TableCell>
                        <TableCell
                            sx={{
                                fontWeight: "bold",
                                padding: "4px",
                                border: "1px solid rgba(224, 224, 224, 1)",
                                backgroundColor: "#f5f5f5",
                                fontSize: "0.75rem",
                            }}
                        >
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {institutions.length > 0 ? (
                        institutions.map((institution, index) => (
                            <TableRow
                                key={index}
                                sx={{ "&:hover": { backgroundColor: "#fafafa" } }}
                            >
                                <TableCell
                                    sx={{
                                        padding: "4px",
                                        border: "1px solid rgba(224, 224, 224, 1)",
                                        fontSize: "0.75rem",
                                    }}
                                >
                                    {institution.name}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        padding: "4px",
                                        border: "1px solid rgba(224, 224, 224, 1)",
                                        fontSize: "0.75rem",
                                    }}
                                >
                                    {institution.region}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        padding: "4px",
                                        border: "1px solid rgba(224, 224, 224, 1)",
                                        fontSize: "0.75rem",
                                    }}
                                >
                                    {institution.address_street || "N/A"}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        padding: "4px",
                                        border: "1px solid rgba(224, 224, 224, 1)",
                                        fontSize: "0.75rem",
                                    }}
                                >
                                    {institution.municipality_city || "N/A"}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        padding: "4px",
                                        border: "1px solid rgba(224, 224, 224, 1)",
                                        fontSize: "0.75rem",
                                    }}
                                >
                                    {institution.province || "N/A"}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        padding: "4px",
                                        border: "1px solid rgba(224, 224, 224, 1)",
                                        fontSize: "0.75rem",
                                    }}
                                >
                                    {institution.institution_type}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        padding: "4px",
                                        border: "1px solid rgba(224, 224, 224, 1)",
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    <IconButton
                                        color="info"
                                        size="small"
                                        onClick={(e) => handleMenuOpen(e, institution)}
                                        sx={{ padding: 0 }}
                                        aria-label={`More options for ${institution.name}`}
                                        aria-controls={
                                            anchorEl ? `menu-${institution.id}` : undefined
                                        }
                                        aria-haspopup="true"
                                    >
                                        <MoreHorizIcon fontSize="small" />
                                    </IconButton>
                                    <Menu
                                        id={`menu-${institution.id}`}
                                        anchorEl={anchorEl}
                                        open={
                                            Boolean(anchorEl) &&
                                            selectedInstitution?.id === institution.id
                                        }
                                        onClose={handleMenuClose}
                                        anchorOrigin={{
                                            vertical: "bottom",
                                            horizontal: "right",
                                        }}
                                        transformOrigin={{
                                            vertical: "top",
                                            horizontal: "right",
                                        }}
                                        PaperProps={{
                                            sx: {
                                                minWidth: "180px",
                                                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                                            },
                                        }}
                                        disableAutoFocusItem
                                    >
                                        <MenuItem
                                            onClick={() => {
                                                handleOpenDialog(institution);
                                                handleMenuClose();
                                            }}
                                            sx={{ fontSize: "0.75rem", padding: "4px 8px" }}
                                        >
                                            <VisibilityIcon
                                                fontSize="small"
                                                sx={{ mr: 1, color: "#1976d2" }}
                                            />
                                            View Details
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                handleNavigation(
                                                    `/super-admin/institutions/campuses/${institution.id}`,
                                                    "viewCampuses"
                                                );
                                                handleMenuClose();
                                            }}
                                            disabled={loading.viewCampuses}
                                            sx={{ fontSize: "0.75rem", padding: "4px 8px" }}
                                        >
                                            {loading.viewCampuses ? (
                                                <CircularProgress size={14} sx={{ mr: 1 }} />
                                            ) : (
                                                <ApartmentIcon
                                                    fontSize="small"
                                                    sx={{ mr: 1, color: "#1976d2" }}
                                                />
                                            )}
                                            View Campuses
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                handleNavigation(
                                                    `/super-admin/institutions/faculties/${institution.id}`,
                                                    "faculties"
                                                );
                                                handleMenuClose();
                                            }}
                                            disabled={loading.faculties}
                                            sx={{ fontSize: "0.75rem", padding: "4px 8px" }}
                                        >
                                            {loading.faculties ? (
                                                <CircularProgress size={14} sx={{ mr: 1 }} />
                                            ) : (
                                                <PeopleIcon
                                                    fontSize="small"
                                                    sx={{ mr: 1, color: "#1976d2" }}
                                                />
                                            )}
                                            Faculties
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                handleNavigation(
                                                    `/super-admin/institutions/curricular-programs/${institution.id}`,
                                                    "academicPrograms"
                                                );
                                                handleMenuClose();
                                            }}
                                            disabled={loading.academicPrograms}
                                            sx={{ fontSize: "0.75rem", padding: "4px 8px" }}
                                        >
                                            {loading.academicPrograms ? (
                                                <CircularProgress size={14} sx={{ mr: 1 }} />
                                            ) : (
                                                <LibraryBooksIcon
                                                    fontSize="small"
                                                    sx={{ mr: 1, color: "#1976d2" }}
                                                />
                                            )}
                                            Curricular Programs
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => handleExportToFormA(institution)}
                                            disabled={loading.exportFormA}
                                            sx={{ fontSize: "0.75rem", padding: "4px 8px" }}
                                        >
                                            {loading.exportFormA ? (
                                                <CircularProgress size={14} sx={{ mr: 1 }} />
                                            ) : (
                                                <DescriptionIcon
                                                    fontSize="small"
                                                    sx={{ mr: 1, color: "#1976d2" }}
                                                />
                                            )}
                                            Export to Form A
                                        </MenuItem>
                                    </Menu>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={7}
                                align="center"
                                sx={{
                                    padding: "4px",
                                    border: "1px solid rgba(224, 224, 224, 1)",
                                    fontSize: "0.75rem",
                                }}
                            >
                                No data uploaded yet.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <DetailDialog
                open={openDialog}
                role={role}
                onClose={handleCloseDialog}
                institution={selectedInstitution}
                onEdit={onEdit}
                navigate={navigate}
            />
        </TableContainer>
    );
};

InstitutionTable.propTypes = {
    institutions: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            region: PropTypes.string.isRequired,
            address_street: PropTypes.string,
            municipality_city: PropTypes.string,
            province: PropTypes.string,
            postal_code: PropTypes.string,
            institutional_telephone: PropTypes.string,
            institutional_fax: PropTypes.string,
            head_telephone: PropTypes.string,
            institutional_email: PropTypes.string,
            institutional_website: PropTypes.string,
            year_established: PropTypes.string,
            sec_registration: PropTypes.string,
            year_granted_approved: PropTypes.string,
            year_converted_college: PropTypes.string,
            year_converted_university: PropTypes.string,
            head_name: PropTypes.string,
            head_title: PropTypes.string,
            head_education: PropTypes.string,
            institution_type: PropTypes.oneOf(["SUC", "LUC", "PHEI"]).isRequired,
        })
    ).isRequired,
    onEdit: PropTypes.func.isRequired,
    setSnackbarMessage: PropTypes.func.isRequired,
    setSnackbarSeverity: PropTypes.func.isRequired,
    setSnackbarOpen: PropTypes.func.isRequired,
};

InstitutionTable.defaultProps = {
    institutions: [],
};

export default InstitutionTable;
