import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableContainer,
    Paper,
    IconButton,
    Menu,
    MenuItem,
    CircularProgress,
    TextField,
    FormControl,
    InputLabel,
    Select,
    Box,
    TablePagination,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import ExcelJS from "exceljs";
import axios from "axios";
import { FaClipboardList } from "react-icons/fa";
import { FaFileExcel } from "react-icons/fa";
import { CiCircleMore } from "react-icons/ci";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ApartmentIcon from "@mui/icons-material/Apartment";
import PeopleIcon from "@mui/icons-material/People";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import DescriptionIcon from "@mui/icons-material/Description";
import DetailDialog from "./DetailDialog";
import config from "../../../utils/config";

// Constants for configuration
const ROWS_PER_PAGE_OPTIONS = [10, 25, 50, { label: "All", value: -1 }];

// Utility function to get unique values from an array
const getUniqueValues = (arr, key) =>
    [...new Set(arr.map((item) => item[key]).filter(Boolean))].sort();

const InstitutionTable = ({
    institutions = [],
    onEdit,
    setSnackbarMessage,
    setSnackbarSeverity,
    setSnackbarOpen,
}) => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const role = user.role || "HEI Staff";

    // State management with initial values from localStorage
    const [selectedInstitution, setSelectedInstitution] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [loading, setLoading] = useState({
        viewCampuses: false,
        faculties: false,
        academicPrograms: false,
        exportFormA: false,
    });
    const [searchTerm, setSearchTerm] = useState(
        localStorage.getItem("searchTerm") || ""
    );
    const [typeFilter, setTypeFilter] = useState(
        localStorage.getItem("typeFilter") || ""
    );
    const [cityFilter, setCityFilter] = useState(
        localStorage.getItem("cityFilter") || ""
    );
    const [provinceFilter, setProvinceFilter] = useState(
        localStorage.getItem("provinceFilter") || ""
    );
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);

    const menuButtonRef = useRef(null);

    // Save all filters to localStorage when they change
    useEffect(() => {
        localStorage.setItem("searchTerm", searchTerm);
        localStorage.setItem("typeFilter", typeFilter);
        localStorage.setItem("cityFilter", cityFilter);
        localStorage.setItem("provinceFilter", provinceFilter);
        console.log("Saved to localStorage:", {
            searchTerm,
            typeFilter,
            cityFilter,
            provinceFilter,
        });
    }, [searchTerm, typeFilter, cityFilter, provinceFilter]);

    // Dialog and Menu handlers
    const handleOpenDialog = (institution) => {
        localStorage.setItem("institutionId", institution.id);
        setSelectedInstitution(institution);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedInstitution(null);
        menuButtonRef.current?.focus();
    };

    const handleMenuOpen = (event, institution) => {
        setAnchorEl(event.currentTarget);
        setSelectedInstitution(institution);
        menuButtonRef.current = event.currentTarget;
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        menuButtonRef.current?.focus();
    };

    // Navigation with loading state
    const handleNavigation = useCallback(
        (path, type) => {
            setLoading((prev) => ({ ...prev, [type]: true }));
            setTimeout(() => {
                navigate(path);
                setLoading((prev) => ({ ...prev, [type]: false }));
            }, 500);
        },
        [navigate]
    );

    // Export to Form A
    const handleExportToFormA = useCallback(
        async (institution) => {
            setLoading((prev) => ({ ...prev, exportFormA: true }));
            try {
                const response = await fetch(
                    "/templates/Form-A-Themeplate.xlsx"
                );
                if (!response.ok)
                    throw new Error(`HTTP error! Status: ${response.status}`);
                const arrayBuffer = await response.arrayBuffer();

                const workbook = new ExcelJS.Workbook();
                await workbook.xlsx.load(arrayBuffer);

                const sheetA1 = workbook.getWorksheet("FORM A1");
                const sheetA2 = workbook.getWorksheet("FORM A2");

                const a1Fields = [
                    { row: 5, cell: 3, key: "name" },
                    { row: 8, cell: 3, key: "address_street" },
                    { row: 9, cell: 3, key: "municipality_city" },
                    { row: 10, cell: 3, key: "province" },
                    { row: 11, cell: 3, key: "region" },
                    { row: 12, cell: 3, key: "postal_code" },
                    { row: 13, cell: 3, key: "institutional_telephone" },
                    { row: 14, cell: 3, key: "institutional_fax" },
                    { row: 15, cell: 3, key: "head_telephone" },
                    { row: 16, cell: 3, key: "institutional_email" },
                    { row: 17, cell: 3, key: "institutional_website" },
                    { row: 18, cell: 3, key: "year_established" },
                    { row: 19, cell: 3, key: "sec_registration" },
                    { row: 20, cell: 3, key: "year_granted_approved" },
                    { row: 21, cell: 3, key: "year_converted_college" },
                    { row: 22, cell: 3, key: "year_converted_university" },
                    { row: 23, cell: 3, key: "head_name" },
                    { row: 24, cell: 3, key: "head_title" },
                    { row: 25, cell: 3, key: "head_education" },
                ];
                a1Fields.forEach(({ row, cell, key }) => {
                    sheetA1.getRow(row).getCell(cell).value =
                        institution[key] || "N/A";
                });

                const token = localStorage.getItem("token");
                const { data } = await axios.get(
                    `${config.API_URL}/campuses?institution_id=${institution.id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const campuses = Array.isArray(data.campuses)
                    ? data.campuses
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
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);

                setSnackbarMessage(
                    `Form A exported successfully for ${institution.name}!`
                );
                setSnackbarSeverity("success");
                setSnackbarOpen(true);
            } catch (error) {
                console.error("Error exporting Form A:", error);
                setSnackbarMessage(`Failed to export Form A: ${error.message}`);
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
            } finally {
                setLoading((prev) => ({ ...prev, exportFormA: false }));
                handleMenuClose();
            }
        },
        [setSnackbarMessage, setSnackbarSeverity, setSnackbarOpen]
    );

    // Memoized filtered institutions
    const filteredInstitutions = useMemo(() => {
        return institutions.filter((institution) => {
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
            return (
                matchesSearch && matchesType && matchesCity && matchesProvince
            );
        });
    }, [institutions, searchTerm, typeFilter, cityFilter, provinceFilter]);

    // Memoized filter options
    const filterOptions = useMemo(
        () => ({
            types: getUniqueValues(institutions, "institution_type"),
            cities: getUniqueValues(institutions, "municipality_city"),
            provinces: getUniqueValues(institutions, "province"),
        }),
        [institutions]
    );

    // Pagination handlers
    const handleChangePage = (event, newPage) => setPage(newPage);

    const handleChangeRowsPerPage = (event) => {
        const value =
            event.target.value === -1
                ? filteredInstitutions.length
                : parseInt(event.target.value, 10);
        setRowsPerPage(value);
        setPage(0);
    };

    // Paginated data
    const paginatedInstitutions = useMemo(() => {
        const start = page * rowsPerPage;
        const end =
            rowsPerPage === filteredInstitutions.length
                ? filteredInstitutions.length
                : start + rowsPerPage;
        return filteredInstitutions.slice(start, end);
    }, [filteredInstitutions, page, rowsPerPage]);

    // Debugging: Log initial filter values on mount
    useEffect(() => {
        console.log("Initial filter values on mount:", {
            searchTerm: localStorage.getItem("searchTerm"),
            typeFilter: localStorage.getItem("typeFilter"),
            cityFilter: localStorage.getItem("cityFilter"),
            provinceFilter: localStorage.getItem("provinceFilter"),
        });
    }, []);

    return (
        <Box sx={{ mt: 1, width: "100%" }}>
            {/* Compact Filter Controls */}
            <Box sx={{ display: "flex", gap: 1, mb: 1, flexWrap: "wrap" }}>
                <FormControl sx={{ flex: 2, minWidth: 150 }} size="small">
                    <TextField
                        label="Search"
                        variant="outlined"
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputLabelProps={{ sx: { fontSize: "0.75rem" } }}
                        sx={{ "& .MuiInputBase-root": { height: 32 } }}
                    />
                </FormControl>
                <FormControl sx={{ flex: 1, width: 200 }} size="small">
                    <InputLabel size="small" sx={{ fontSize: "0.75rem" }}>
                        Type
                    </InputLabel>
                    <Select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        label="Type"
                        size="small"
                        sx={{ height: 32 }}
                    >
                        <MenuItem value="">All</MenuItem>
                        {filterOptions.types.map((type) => (
                            <MenuItem key={type} value={type}>
                                {type}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl sx={{ flex: 1, width: 120 }} size="small">
                    <InputLabel size="small" sx={{ fontSize: "0.75rem" }}>
                        City
                    </InputLabel>
                    <Select
                        value={cityFilter}
                        onChange={(e) => setCityFilter(e.target.value)}
                        label="City"
                        size="small"
                        sx={{ height: 32 }}
                    >
                        <MenuItem value="">All</MenuItem>
                        {filterOptions.cities.map((city) => (
                            <MenuItem key={city} value={city}>
                                {city}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl sx={{ flex: 1, width: 120 }} size="small">
                    <InputLabel size="small" sx={{ fontSize: "0.75rem" }}>
                        Province
                    </InputLabel>
                    <Select
                        value={provinceFilter}
                        onChange={(e) => setProvinceFilter(e.target.value)}
                        label="Province"
                        size="small"
                        sx={{ height: 32 }}
                    >
                        <MenuItem value="">All</MenuItem>
                        {filterOptions.provinces.map((province) => (
                            <MenuItem key={province} value={province}>
                                {province}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* TableContainer with Sticky Pagination */}
            <Paper sx={{ height: "600px", display: "flex", flexDirection: "column" }}>
                <TableContainer sx={{height: "600px", flex: "1 1 auto", overflowY: "auto" }}>
                    <Table size="small" stickyHeader sx={{ tableLayout: "fixed" }}>
                        <TableHead>
                            <TableRow>
                                {[
                                    { label: "ID", width: "3%" },
                                    { label: "Name", width: "25%" },
                                    { label: "Region", width: "10%" },
                                    { label: "Address", width: "20%" },
                                    { label: "City", width: "15%" },
                                    { label: "Province", width: "15%" },
                                    { label: "Type", width: "10%" },
                                    { label: "Actions", width: "5%" },
                                ].map((col) => (
                                    <TableCell
                                        key={col.label}
                                        sx={{
                                            fontWeight: "bold",
                                            padding: "4px 6px",
                                            backgroundColor: "#F5F5F5FF",
                                            fontSize: "0.75rem",
                                            width: col.width,
                                        }}
                                    >
                                        {col.label}
                                    </TableCell>
                                ))}
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
                                                padding: "4px 6px",
                                                fontSize: "0.75rem",
                                                whiteSpace: "normal",
                                                wordBreak: "break-word",
                                            }}
                                        >
                                            {institution.id}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                padding: "4px 6px",
                                                fontSize: "0.75rem",
                                                whiteSpace: "normal",
                                                wordBreak: "break-word",
                                            }}
                                        >
                                            {institution.name}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                padding: "4px 6px",
                                                fontSize: "0.75rem",
                                            }}
                                        >
                                            {institution.region}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                padding: "4px 6px",
                                                fontSize: "0.75rem",
                                            }}
                                        >
                                            {institution.address_street || "N/A"}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                padding: "4px 6px",
                                                fontSize: "0.75rem",
                                            }}
                                        >
                                            {institution.municipality_city || "N/A"}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                padding: "4px 6px",
                                                fontSize: "0.75rem",
                                            }}
                                        >
                                            {institution.province || "N/A"}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                padding: "4px 6px",
                                                fontSize: "0.75rem",
                                            }}
                                        >
                                            {institution.institution_type}
                                        </TableCell>
                                        <TableCell sx={{ padding: "4px 6px" }}>
                                            <IconButton
                                                color="info"
                                                size="small"
                                                onClick={(e) =>
                                                    handleMenuOpen(e, institution)
                                                }
                                                aria-label={`More options for ${institution.name}`}
                                                aria-controls={
                                                    anchorEl
                                                        ? `menu-${institution.id}`
                                                        : undefined
                                                }
                                                aria-haspopup="true"
                                                sx={{ padding: 0 }}
                                            >
                                                <CiCircleMore size={16} />
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
                                                        minWidth: "150px",
                                                        boxShadow:
                                                            "0px 2px 4px rgba(0, 0, 0, 0.1)",
                                                    },
                                                }}
                                            >
                                                <MenuItem
                                                    onClick={() => {
                                                        handleOpenDialog(institution);
                                                        handleMenuClose();
                                                    }}
                                                    sx={{
                                                        fontSize: "0.75rem",
                                                        padding: "4px 8px",
                                                    }}
                                                >
                                                    <VisibilityIcon
                                                        fontSize="small"
                                                        sx={{ mr: 1, color: "#1976d2" }}
                                                    />
                                                    Details
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
                                                            size={12}
                                                            sx={{ mr: 1 }}
                                                        />
                                                    ) : (
                                                        <ApartmentIcon
                                                            fontSize="small"
                                                            sx={{ mr: 1, color: "#1976d2" }}
                                                        />
                                                    )}
                                                    Campuses
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
                                                            size={12}
                                                            sx={{ mr: 1 }}
                                                        />
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
                                                    sx={{
                                                        fontSize: "0.75rem",
                                                        padding: "4px 8px",
                                                    }}
                                                >
                                                    {loading.academicPrograms ? (
                                                        <CircularProgress
                                                            size={12}
                                                            sx={{ mr: 1 }}
                                                        />
                                                    ) : (
                                                        <LibraryBooksIcon
                                                            fontSize="small"
                                                            sx={{ mr: 1, color: "#1976d2" }}
                                                        />
                                                    )}
                                                    Programs
                                                </MenuItem>
                                                <MenuItem
                                                    onClick={() => {
                                                        handleNavigation(
                                                            `/super-admin/institutions/graduates-list/${institution.id}`,
                                                            "academicPrograms"
                                                        );
                                                        handleMenuClose();
                                                    }}
                                                    disabled={loading.academicPrograms}
                                                    sx={{
                                                        fontSize: "0.75rem",
                                                        padding: "4px 8px",
                                                    }}
                                                >
                                                    {loading.academicPrograms ? (
                                                        <CircularProgress
                                                            size={12}
                                                            sx={{ mr: 1 }}
                                                        />
                                                    ) : (
                                                        <FaClipboardList
                                                        size={20} style={{ color: "#1976d2", marginRight: "4px" }}
                                                        />
                                                    )}
                                                    List of Graduates
                                                </MenuItem>
                                                <MenuItem
                                                    onClick={() =>
                                                        handleExportToFormA(institution)
                                                    }
                                                    disabled={loading.exportFormA}
                                                    sx={{
                                                        fontSize: "0.75rem",
                                                        padding: "4px 8px",
                                                    }}
                                                >
                                                    {loading.exportFormA ? (
                                                        <CircularProgress
                                                            size={12}
                                                            sx={{ mr: 1 }}
                                                        />
                                                    ) : (
                                                        <FaFileExcel
                                                            size={20}
                                                            style={{
                                                                color: "#1976d2",
                                                                marginRight: "4px",
                                                            }}
                                                        />
                                                    )}
                                                    Export to Excel
                                                </MenuItem>
                                            </Menu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={8} // Adjusted to match number of columns
                                        align="center"
                                        sx={{ padding: "8px", fontSize: "0.75rem" }}
                                    >
                                        No data found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Sticky Pagination at Bottom */}
                <TablePagination
                    rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
                    count={filteredInstitutions.length}
                    rowsPerPage={
                        rowsPerPage === -1
                            ? filteredInstitutions.length
                            : rowsPerPage
                    }
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Rows:"
                    sx={{
                        flexShrink: 0,
                        borderTop: "1px solid rgba(224, 224, 224, 1)",
                        "& .MuiTablePagination-selectLabel": {
                            fontSize: "0.75rem",
                        },
                        "& .MuiTablePagination-displayedRows": {
                            fontSize: "0.75rem",
                        },
                    }}
                />
            </Paper>

            {/* Detail Dialog */}
            {selectedInstitution && (
                <DetailDialog
                    open={openDialog}
                    role={role}
                    onClose={handleCloseDialog}
                    institution={selectedInstitution}
                    onEdit={onEdit}
                    navigate={navigate}
                />
            )}
        </Box>
    );
};

// PropTypes for type checking
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
    ),
    onEdit: PropTypes.func.isRequired,
    setSnackbarMessage: PropTypes.func.isRequired,
    setSnackbarSeverity: PropTypes.func.isRequired,
    setSnackbarOpen: PropTypes.func.isRequired,
};

export default InstitutionTable;
