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
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem as FilterMenuItem,
    Box,
    TablePagination,
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
import { useRef, useState } from "react";
import ExcelJS from "exceljs";
import axios from "axios";

const InstitutionTable = ({
    institutions,
    onEdit,
    setSnackbarMessage,
    setSnackbarSeverity,
    setSnackbarOpen,
}) => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role || "HEI Staff";
    const [selectedInstitution, setSelectedInstitution] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [loading, setLoading] = useState({
        viewCampuses: false,
        faculties: false,
        academicPrograms: false,
        exportFormA: false,
    });
    const [searchTerm, setSearchTerm] = useState(""); // Search state
    const [typeFilter, setTypeFilter] = useState(""); // Institution type filter state
    const [cityFilter, setCityFilter] = useState(""); // City filter state
    const [provinceFilter, setProvinceFilter] = useState(""); // Province filter state
    const [page, setPage] = useState(0); // Current page
    const [rowsPerPage, setRowsPerPage] = useState(15); // Rows per page
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
            if (!response.ok)
                throw new Error(`Failed to load template: ${response.status}`);
            const arrayBuffer = await response.arrayBuffer();

            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(arrayBuffer);

            const sheetA1 = workbook.getWorksheet("FORM A1");
            const sheetA2 = workbook.getWorksheet("FORM A2");

            sheetA1.getRow(2).getCell(3).value = institution.name || "N/A";
            sheetA1.getRow(5).getCell(3).value =
                institution.address_street || "N/A";
            sheetA1.getRow(6).getCell(3).value =
                institution.municipality_city || "N/A";
            sheetA1.getRow(7).getCell(3).value = institution.province || "N/A";
            sheetA1.getRow(8).getCell(3).value = institution.region || "N/A";
            sheetA1.getRow(9).getCell(3).value =
                institution.postal_code || "N/A";
            sheetA1.getRow(10).getCell(3).value =
                institution.institutional_telephone || "N/A";
            sheetA1.getRow(11).getCell(3).value =
                institution.institutional_fax || "N/A";
            sheetA1.getRow(12).getCell(3).value =
                institution.head_telephone || "N/A";
            sheetA1.getRow(13).getCell(3).value =
                institution.institutional_email || "N/A";
            sheetA1.getRow(14).getCell(3).value =
                institution.institutional_website || "N/A";
            sheetA1.getRow(15).getCell(3).value =
                institution.year_established || "N/A";
            sheetA1.getRow(16).getCell(3).value =
                institution.sec_registration || "N/A";
            sheetA1.getRow(17).getCell(3).value =
                institution.year_granted_approved || "N/A";
            sheetA1.getRow(18).getCell(3).value =
                institution.year_converted_college || "N/A";
            sheetA1.getRow(19).getCell(3).value =
                institution.year_converted_university || "N/A";
            sheetA1.getRow(20).getCell(3).value =
                institution.head_name || "N/A";
            sheetA1.getRow(21).getCell(3).value =
                institution.head_title || "N/A";
            sheetA1.getRow(22).getCell(3).value =
                institution.head_education || "N/A";

            const token = localStorage.getItem("token");
            const campusResponse = await axios.get(
                `http://localhost:8000/api/campuses?institution_id=${institution.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const campuses = Array.isArray(campusResponse.data.campuses)
                ? campusResponse.data.campuses
                : [];

            const a2StartRow = 11;
            campuses.forEach((campus, index) => {
                const row = sheetA2.getRow(a2StartRow + index);
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

            const fileName = `Form_A_${institution.name || "Unknown"}_${
                institution.institution_type || "Unknown"
            }_${new Date().toISOString().split("T")[0]}.xlsx`;
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

            setSnackbarMessage(
                `Form A exported successfully for ${institution.name}!`
            );
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
        } catch (error) {
            console.error("Error exporting Form A:", error);
            setSnackbarMessage(`Error exporting Form A: ${error.message}`);
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        } finally {
            setLoading((prev) => ({ ...prev, exportFormA: false }));
            handleMenuClose();
        }
    };

    // Filter institutions based on search and filters
    const filteredInstitutions = institutions.filter((institution) => {
        const matchesSearch = institution.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesType = typeFilter
            ? institution.institution_type === typeFilter
            : true;
        const matchesCity = cityFilter
            ? institution.municipality_city === cityFilter
            : true;
        const matchesProvince = provinceFilter
            ? institution.province === provinceFilter
            : true;
        return matchesSearch && matchesType && matchesCity && matchesProvince;
    });

    // Extract unique values for filter options
    const uniqueTypes = [
        ...new Set(institutions.map((inst) => inst.institution_type)),
    ].sort();
    const uniqueCities = [
        ...new Set(
            institutions.map((inst) => inst.municipality_city).filter(Boolean)
        ),
    ].sort();
    const uniqueProvinces = [
        ...new Set(institutions.map((inst) => inst.province).filter(Boolean)),
    ].sort();

    // Pagination handlers
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        const value = event.target.value;
        setRowsPerPage(
            value === "All" ? filteredInstitutions.length : parseInt(value, 10)
        );
        setPage(0); // Reset to first page when rows per page changes
    };

    // Calculate the rows to display based on pagination
    const paginatedInstitutions =
        rowsPerPage === filteredInstitutions.length
            ? filteredInstitutions
            : filteredInstitutions.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
              );

    // Determine if scrolling should be enabled (when "All" is selected)

    return (
        <Box sx={{ mt: 2 }}>
            {/* Search and Filter Controls */}
            <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
                <TextField
                    label="Search by Name"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ flex: 1, minWidth: 200 }}
                />
                <FormControl sx={{ width: 200 }} size="small">
                    <InputLabel>Type</InputLabel>
                    <Select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        label="Type"
                    >
                        <FilterMenuItem value="">All Types</FilterMenuItem>
                        {uniqueTypes.map((type) => (
                            <FilterMenuItem key={type} value={type}>
                                {type}
                            </FilterMenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl sx={{ width: 200 }} size="small">
                    <InputLabel>City</InputLabel>
                    <Select
                        value={cityFilter}
                        onChange={(e) => setCityFilter(e.target.value)}
                        label="City"
                    >
                        <FilterMenuItem value="">All Cities</FilterMenuItem>
                        {uniqueCities.map((city) => (
                            <FilterMenuItem key={city} value={city}>
                                {city}
                            </FilterMenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl sx={{ width: 200 }} size="small">
                    <InputLabel>Province</InputLabel>
                    <Select
                        value={provinceFilter}
                        onChange={(e) => setProvinceFilter(e.target.value)}
                        label="Province"
                    >
                        <FilterMenuItem value="">All Provinces</FilterMenuItem>
                        {uniqueProvinces.map((province) => (
                            <FilterMenuItem key={province} value={province}>
                                {province}
                            </FilterMenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <TableContainer
                component={Paper}
                sx={{
                    maxHeight: "65vh",
                    overflowY: "65vh",
                }}
            >
                <Table
                    size="small"
                    stickyHeader
                    sx={{
                        borderCollapse: "collapse",
                        tableLayout: "fixed", // Ensure consistent column widths
                        width: "100%",
                    }}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell
                                sx={{
                                    fontWeight: "bold",
                                    padding: "4px",
                                    border: "1px solid rgba(224, 224, 224, 1)",
                                    backgroundColor: "#f5f5f5",
                                    fontSize: "0.75rem",
                                    width: "20%", // Adjust column widths
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
                                    width: "10%",
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
                                    width: "20%",
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
                                    width: "15%",
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
                                    width: "15%",
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
                                    width: "10%",
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
                                    width: "10%",
                                }}
                            >
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedInstitutions.length > 0 ? (
                            paginatedInstitutions.map((institution) => (
                                <TableRow
                                    key={institution.id}
                                    sx={{
                                        "&:hover": {
                                            backgroundColor: "#fafafa",
                                        },
                                    }}
                                >
                                    <TableCell
                                        sx={{
                                            padding: "4px",
                                            border: "1px solid rgba(224, 224, 224, 1)",
                                            fontSize: "0.75rem",
                                            whiteSpace: "normal", // Allow text wrapping
                                            wordBreak: "break-word",
                                        }}
                                    >
                                        {institution.name}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            padding: "4px",
                                            border: "1px solid rgba(224, 224, 224, 1)",
                                            fontSize: "0.75rem",
                                            whiteSpace: "normal",
                                            wordBreak: "break-word",
                                        }}
                                    >
                                        {institution.region}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            padding: "4px",
                                            border: "1px solid rgba(224, 224, 224, 1)",
                                            fontSize: "0.75rem",
                                            whiteSpace: "normal",
                                            wordBreak: "break-word",
                                        }}
                                    >
                                        {institution.address_street || "N/A"}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            padding: "4px",
                                            border: "1px solid rgba(224, 224, 224, 1)",
                                            fontSize: "0.75rem",
                                            whiteSpace: "normal",
                                            wordBreak: "break-word",
                                        }}
                                    >
                                        {institution.municipality_city || "N/A"}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            padding: "4px",
                                            border: "1px solid rgba(224, 224, 224, 1)",
                                            fontSize: "0.75rem",
                                            whiteSpace: "normal",
                                            wordBreak: "break-word",
                                        }}
                                    >
                                        {institution.province || "N/A"}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            padding: "4px",
                                            border: "1px solid rgba(224, 224, 224, 1)",
                                            fontSize: "0.75rem",
                                            whiteSpace: "normal",
                                            wordBreak: "break-word",
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
                                            onClick={(e) =>
                                                handleMenuOpen(e, institution)
                                            }
                                            sx={{ padding: 0 }}
                                            aria-label={`More options for ${institution.name}`}
                                            aria-controls={
                                                anchorEl
                                                    ? `menu-${institution.id}`
                                                    : undefined
                                            }
                                            aria-haspopup="true"
                                        >
                                            <MoreHorizIcon
                                                sx={{ color: "#000000" }}
                                                fontSize="small"
                                            />
                                        </IconButton>
                                        <Menu
                                            id={`menu-${institution.id}`}
                                            anchorEl={anchorEl}
                                            open={
                                                Boolean(anchorEl) &&
                                                selectedInstitution?.id ===
                                                    institution.id
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
                                                    boxShadow:
                                                        "0px 2px 4px rgba(0, 0, 0, 0.1)",
                                                },
                                            }}
                                            disableAutoFocusItem
                                        >
                                            <MenuItem
                                                onClick={() => {
                                                    handleOpenDialog(
                                                        institution
                                                    );
                                                    handleMenuClose();
                                                }}
                                                sx={{
                                                    fontSize: "0.75rem",
                                                    padding: "4px 8px",
                                                }}
                                            >
                                                <VisibilityIcon
                                                    fontSize="small"
                                                    sx={{
                                                        mr: 1,
                                                        color: "#1976d2",
                                                    }}
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
                                                sx={{
                                                    fontSize: "0.75rem",
                                                    padding: "4px 8px",
                                                }}
                                            >
                                                {loading.viewCampuses ? (
                                                    <CircularProgress
                                                        size={14}
                                                        sx={{ mr: 1 }}
                                                    />
                                                ) : (
                                                    <ApartmentIcon
                                                        fontSize="small"
                                                        sx={{
                                                            mr: 1,
                                                            color: "#1976d2",
                                                        }}
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
                                                sx={{
                                                    fontSize: "0.75rem",
                                                    padding: "4px 8px",
                                                }}
                                            >
                                                {loading.faculties ? (
                                                    <CircularProgress
                                                        size={14}
                                                        sx={{ mr: 1 }}
                                                    />
                                                ) : (
                                                    <PeopleIcon
                                                        fontSize="small"
                                                        sx={{
                                                            mr: 1,
                                                            color: "#1976d2",
                                                        }}
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
                                                disabled={
                                                    loading.academicPrograms
                                                }
                                                sx={{
                                                    fontSize: "0.75rem",
                                                    padding: "4px 8px",
                                                }}
                                            >
                                                {loading.academicPrograms ? (
                                                    <CircularProgress
                                                        size={14}
                                                        sx={{ mr: 1 }}
                                                    />
                                                ) : (
                                                    <LibraryBooksIcon
                                                        fontSize="small"
                                                        sx={{
                                                            mr: 1,
                                                            color: "#1976d2",
                                                        }}
                                                    />
                                                )}
                                                Curricular Programs
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() =>
                                                    handleExportToFormA(
                                                        institution
                                                    )
                                                }
                                                disabled={loading.exportFormA}
                                                sx={{
                                                    fontSize: "0.75rem",
                                                    padding: "4px 8px",
                                                }}
                                            >
                                                {loading.exportFormA ? (
                                                    <CircularProgress
                                                        size={14}
                                                        sx={{ mr: 1 }}
                                                    />
                                                ) : (
                                                    <DescriptionIcon
                                                        fontSize="small"
                                                        sx={{
                                                            mr: 1,
                                                            color: "#1976d2",
                                                        }}
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
                                    No institutions found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* Pagination Component */}
            <TablePagination
                rowsPerPageOptions={[
                    15,
                    50,
                    100,
                    { label: "All", value: filteredInstitutions.length },
                ]}
                component="div"
                count={filteredInstitutions.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Rows per page:"
            />
            <DetailDialog
                open={openDialog}
                role={role}
                onClose={handleCloseDialog}
                institution={selectedInstitution}
                onEdit={onEdit}
                navigate={navigate}
            />
        </Box>
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
            institution_type: PropTypes.oneOf(["SUC", "LUC", "PHEI"])
                .isRequired,
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
