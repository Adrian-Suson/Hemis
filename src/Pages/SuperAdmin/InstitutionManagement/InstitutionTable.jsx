import { useNavigate } from "react-router-dom";
import { useRef, useState, useCallback, useMemo } from "react";
import ExcelJS from "exceljs";
import axios from "axios";
import DetailDialog from "./DetailDialog";
import config from "../../../utils/config";
import useActivityLog from "../../../Hooks/useActivityLog";
import useResponsive from "../../../Hooks/useResponsive";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Menu,
    CircularProgress,
    Pagination,
    Typography,
    Tooltip,
    IconButton,
    Divider,
    Box,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
} from "@mui/material";
import { CiSquareMore } from "react-icons/ci";
import { FaEye } from "react-icons/fa";
import { BiSolidBusiness } from "react-icons/bi";
import { HiMiniUserGroup } from "react-icons/hi2";
import { RiBookShelfFill } from "react-icons/ri";
import { FaUserGraduate } from "react-icons/fa6";
import { MdOutlineDownload } from "react-icons/md";
import PropTypes from "prop-types";
import { useLoading } from "../../../Context/LoadingContext";
import { encryptId } from "../../../utils/encryption";

const ROWS_PER_PAGE_OPTIONS = [
    { label: "25", value: 25 },
    { label: "50", value: 50 },
    { label: "100", value: 100 },
    { label: "All", value: -1 },
];

const InstitutionTable = ({
    institutions = [],
    fetchInstitutions,
    setSnackbarMessage,
    setSnackbarSeverity,
    setSnackbarOpen,
    searchTerm = "",
    typeFilter = "",
    cityFilter = "",
    provinceFilter = "",
}) => {
    const { isExtraSmall, isSmall, isMedium, isLarge } = useResponsive(); // Use the custom hook
    const navigate = useNavigate();
    const { updateProgress } = useLoading();
    const { createLog } = useActivityLog();
    const [selectedInstitution, setSelectedInstitution] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [loading, setLoading] = useState({
        viewCampuses: false,
        faculties: false,
        academicPrograms: false,
        exportFormA: false,
    });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const menuButtonRef = useRef(null);

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
        setMenuAnchorEl(event.currentTarget);
        setSelectedInstitution(institution);
        menuButtonRef.current = event.currentTarget;
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
        menuButtonRef.current?.focus();
    };

    const handleExportToFormA = useCallback(
        async (institution) => {
            console.log("Exporting Form A for institution:", institution);
            setLoading((prev) => ({ ...prev, exportFormA: true }));
            try {
                updateProgress(10);
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
                        institution[key] || "";
                });
                updateProgress(20);
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
                        campus.suc_name || "",
                        campus.campus_type || "",
                        campus.institutional_code || "",
                        campus.region || "",
                        campus.municipality_city_province || "",
                        campus.year_first_operation || "",
                        campus.land_area_hectares || "0.0",
                        campus.distance_from_main || "0.0",
                        campus.autonomous_code || "",
                        campus.position_title || "",
                        campus.head_full_name || "",
                        campus.former_name || "",
                        campus.latitude_coordinates || "0.0",
                        campus.longitude_coordinates || "0.0",
                    ];
                    row.commit();
                });
                updateProgress(50);
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
                updateProgress(100);
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
        [
            setSnackbarMessage,
            setSnackbarSeverity,
            setSnackbarOpen,
            updateProgress,
        ]
    );

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

    const handleChangePage = (event, newPage) => {
        setPage(newPage - 1); // MUI Pagination is 1-based
    };

    const handleChangeRowsPerPage = (event) => {
        const value =
            event.target.value === "-1"
                ? filteredInstitutions.length
                : parseInt(event.target.value, 10);
        setRowsPerPage(value);
        setPage(0);
    };

    const paginatedInstitutions = useMemo(() => {
        const start = page * rowsPerPage;
        const end =
            rowsPerPage === filteredInstitutions.length
                ? filteredInstitutions.length
                : start + rowsPerPage;
        return filteredInstitutions.slice(start, end);
    }, [filteredInstitutions, page, rowsPerPage]);

    const handleNavigation = (path, action) => {
        if (!selectedInstitution) return;
        setLoading((prev) => ({ ...prev, [action]: true }));
        const encryptedId = encryptId(selectedInstitution.id);
        navigate(`${path}/${encodeURIComponent(encryptedId)}`);
        setLoading((prev) => ({ ...prev, [action]: false }));
        handleMenuClose();
    };

    const handleEditInstitution = async (updatedInstitution) => {
        // Update the institution in the local state
        setSelectedInstitution((prev) => ({
            ...prev,
            ...updatedInstitution,
        }));

        // Log the edit action
        await createLog({
            action: "edited_institution",
            description: `Edited institution: ${updatedInstitution.name}`,
            modelType: "App\\Models\\Institution",
            modelId: updatedInstitution.id,
            properties: updatedInstitution,
        });

        // Optionally refresh the institution list
        if (fetchInstitutions) {
            fetchInstitutions();
        }
    };

    return (
        <Box
            sx={{
                mt: 1,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                bgcolor: "background.paper",
                borderRadius: 1,
                boxShadow: 2,
                overflow: "hidden",
                height: "auto",
                maxHeight: isExtraSmall
                    ? "50vh"
                    : isSmall
                    ? "60vh"
                    : isMedium
                    ? "70vh"
                    : isLarge
                    ? "75vh"
                    : "80vh", // Adjust max height based on screen size
            }}
        >
            {/* Table */}
            <TableContainer
                component={Paper}
                sx={{
                    flex: "1 1 auto",
                    maxHeight: isExtraSmall
                        ? "25vh"
                        : isSmall
                        ? "35vh"
                        : isMedium
                        ? "45vh"
                        : isLarge
                        ? "55vh"
                        : "65vh", // Adjust table height based on screen size
                    overflowY: "auto",
                    borderRadius: 0,
                }}
            >
                <Table
                    stickyHeader
                    size={isExtraSmall || isSmall ? "medium" : "small"} // Adjust table size for smaller screens
                    aria-label="Responsive Institution Table"
                >
                    <TableHead>
                        <TableRow>
                            {[
                                {
                                    label: "ID",
                                    width: isExtraSmall
                                        ? "10%"
                                        : isSmall
                                        ? "5%"
                                        : "3%",
                                },
                                {
                                    label: "Name",
                                    width: isExtraSmall
                                        ? "40%"
                                        : isSmall
                                        ? "30%"
                                        : "25%",
                                },
                                {
                                    label: "Region",
                                    width: isExtraSmall
                                        ? "20%"
                                        : isSmall
                                        ? "15%"
                                        : "10%",
                                },
                                {
                                    label: "Address",
                                    width: isExtraSmall
                                        ? "30%"
                                        : isSmall
                                        ? "25%"
                                        : "20%",
                                },
                                {
                                    label: "City",
                                    width: isExtraSmall
                                        ? "20%"
                                        : isSmall
                                        ? "15%"
                                        : "15%",
                                },
                                {
                                    label: "Province",
                                    width: isExtraSmall
                                        ? "20%"
                                        : isSmall
                                        ? "15%"
                                        : "15%",
                                },
                                {
                                    label: "Type",
                                    width: isExtraSmall
                                        ? "10%"
                                        : isSmall
                                        ? "10%"
                                        : "10%",
                                },
                                {
                                    label: "Actions",
                                    width: isExtraSmall
                                        ? "10%"
                                        : isSmall
                                        ? "5%"
                                        : "5%",
                                },
                            ].map((col) => (
                                <TableCell
                                    key={col.label}
                                    sx={{
                                        bgcolor: "grey.100",
                                        fontWeight: "medium",
                                        width: col.width,
                                        whiteSpace:
                                            isExtraSmall || isSmall
                                                ? "normal"
                                                : "nowrap", // Adjust text wrapping
                                        py: 0.5,
                                        px: 1,
                                        fontSize: isExtraSmall
                                            ? "1rem"
                                            : isSmall
                                            ? "0.875rem"
                                            : "0.75rem", // Adjust font size
                                    }}
                                >
                                    {col.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedInstitutions.length > 0 ? (
                            paginatedInstitutions.map((institution, index) => (
                                <TableRow
                                    key={institution.id}
                                    hover
                                    sx={{
                                        "&:hover": { bgcolor: "grey.50" },
                                        bgcolor:
                                            index % 2 === 0
                                                ? "white"
                                                : "grey.25",
                                    }}
                                >
                                    <TableCell
                                        sx={{
                                            width: "3%",
                                            py: 0.5,
                                            px: 1,
                                            fontSize: "0.75rem",
                                        }}
                                    >
                                        {institution.id}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            width: "25%",
                                            py: 0.5,
                                            px: 1,
                                            fontSize: "0.75rem",
                                        }}
                                    >
                                        {institution.name}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            width: "10%",
                                            py: 0.5,
                                            px: 1,
                                            fontSize: "0.75rem",
                                        }}
                                    >
                                        {institution.region}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            width: "20%",
                                            py: 0.5,
                                            px: 1,
                                            fontSize: "0.75rem",
                                        }}
                                    >
                                        {institution.address_street || ""}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            width: "15%",
                                            py: 0.5,
                                            px: 1,
                                            fontSize: "0.75rem",
                                        }}
                                    >
                                        {institution.municipality_city || ""}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            width: "15%",
                                            py: 0.5,
                                            px: 1,
                                            fontSize: "0.75rem",
                                        }}
                                    >
                                        {institution.province || ""}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            width: "10%",
                                            py: 0.5,
                                            px: 1,
                                            fontSize: "0.75rem",
                                        }}
                                    >
                                        {institution.institution_type}
                                    </TableCell>
                                    <TableCell
                                        sx={{ width: "5%", py: 0.5, px: 1 }}
                                    >
                                        <Tooltip
                                            title="More Options"
                                            arrow
                                            placement="top"
                                        >
                                            <IconButton
                                                onClick={(e) =>
                                                    handleMenuOpen(
                                                        e,
                                                        institution
                                                    )
                                                }
                                                disabled={Boolean(menuAnchorEl)}
                                                aria-label={`More options for ${institution.name}`}
                                                size="small"
                                                sx={{
                                                    color: "primary.main",
                                                    "&:hover": {
                                                        backgroundColor:
                                                            "rgba(25, 118, 210, 0.04)",
                                                    },
                                                }}
                                            >
                                                <CiSquareMore
                                                    style={{ fontSize: "20px" }}
                                                />
                                            </IconButton>
                                        </Tooltip>

                                        <Menu
                                            anchorEl={menuAnchorEl}
                                            open={Boolean(menuAnchorEl)}
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
                                                elevation: 3,
                                                sx: {
                                                    mt: 0.5,
                                                    minWidth: 180,
                                                    borderRadius: 1,
                                                    boxShadow:
                                                        "0 4px 20px rgba(0,0,0,0.15)",
                                                    "& .MuiList-root": {
                                                        padding: "4px 0",
                                                    },
                                                },
                                            }}
                                        >
                                            <MenuItem
                                                onClick={() =>
                                                    handleOpenDialog(
                                                        selectedInstitution
                                                    )
                                                }
                                                sx={{
                                                    py: 1,
                                                    mx: 1,
                                                    borderRadius: 1,
                                                    "&:hover": {
                                                        backgroundColor:
                                                            "rgba(25, 118, 210, 0.08)",
                                                    },
                                                }}
                                            >
                                                <FaEye
                                                    style={{
                                                        fontSize: "20px",
                                                        marginRight: "5px",
                                                        color: "#438FFF",
                                                    }}
                                                />
                                                <Typography variant="body2">
                                                    View Details
                                                </Typography>
                                            </MenuItem>

                                            <Divider sx={{ my: 0.5 }} />

                                            <MenuItem
                                                onClick={() =>
                                                    handleNavigation(
                                                        "/super-admin/institutions/campuses",
                                                        "viewCampuses"
                                                    )
                                                }
                                                disabled={loading.viewCampuses}
                                                sx={{
                                                    py: 1,
                                                    mx: 1,
                                                    borderRadius: 1,
                                                    "&:hover": {
                                                        backgroundColor:
                                                            "rgba(25, 118, 210, 0.08)",
                                                    },
                                                }}
                                            >
                                                {loading.viewCampuses ? (
                                                    <CircularProgress
                                                        size={18}
                                                        sx={{ mr: 1.5 }}
                                                    />
                                                ) : (
                                                    <BiSolidBusiness
                                                        style={{
                                                            fontSize: "20px",
                                                            marginRight: "5px",
                                                            color: "#438FFF",
                                                        }}
                                                    />
                                                )}
                                                <Typography variant="body2">
                                                    Manage Campuses
                                                </Typography>
                                            </MenuItem>

                                            <MenuItem
                                                onClick={() =>
                                                    handleNavigation(
                                                        "/super-admin/institutions/faculties",
                                                        "faculties"
                                                    )
                                                }
                                                disabled={loading.faculties}
                                                sx={{
                                                    py: 1,
                                                    mx: 1,
                                                    borderRadius: 1,
                                                    "&:hover": {
                                                        backgroundColor:
                                                            "rgba(25, 118, 210, 0.08)",
                                                    },
                                                }}
                                            >
                                                {loading.faculties ? (
                                                    <CircularProgress
                                                        size={18}
                                                        sx={{ mr: 1.5 }}
                                                    />
                                                ) : (
                                                    <HiMiniUserGroup
                                                        style={{
                                                            fontSize: "20px",
                                                            marginRight: "5px",
                                                            color: "#438FFF",
                                                        }}
                                                    />
                                                )}
                                                <Typography variant="body2">
                                                    Manage Faculties
                                                </Typography>
                                            </MenuItem>

                                            <MenuItem
                                                onClick={() =>
                                                    handleNavigation(
                                                        "/super-admin/institutions/curricular-programs",
                                                        "academicPrograms"
                                                    )
                                                }
                                                disabled={
                                                    loading.academicPrograms
                                                }
                                                sx={{
                                                    py: 1,
                                                    mx: 1,
                                                    borderRadius: 1,
                                                    "&:hover": {
                                                        backgroundColor:
                                                            "rgba(25, 118, 210, 0.08)",
                                                    },
                                                }}
                                            >
                                                {loading.academicPrograms ? (
                                                    <CircularProgress
                                                        size={18}
                                                        sx={{ mr: 1.5 }}
                                                    />
                                                ) : (
                                                    <RiBookShelfFill
                                                        style={{
                                                            fontSize: "20px",
                                                            marginRight: "5px",
                                                            color: "#438FFF",
                                                        }}
                                                    />
                                                )}
                                                <Typography variant="body2">
                                                    Academic Programs
                                                </Typography>
                                            </MenuItem>

                                            <MenuItem
                                                onClick={() =>
                                                    handleNavigation(
                                                        "/super-admin/institutions/graduates-list",
                                                        "academicPrograms"
                                                    )
                                                }
                                                disabled={
                                                    loading.academicPrograms
                                                }
                                                sx={{
                                                    py: 1,
                                                    mx: 1,
                                                    borderRadius: 1,
                                                    "&:hover": {
                                                        backgroundColor:
                                                            "rgba(25, 118, 210, 0.08)",
                                                    },
                                                }}
                                            >
                                                {loading.academicPrograms ? (
                                                    <CircularProgress
                                                        size={18}
                                                        sx={{ mr: 1.5 }}
                                                    />
                                                ) : (
                                                    <FaUserGraduate
                                                        style={{
                                                            fontSize: "20px",
                                                            marginRight: "5px",
                                                            color: "#438FFF",
                                                        }}
                                                    />
                                                )}
                                                <Typography variant="body2">
                                                    List of Graduates
                                                </Typography>
                                            </MenuItem>

                                            <Divider sx={{ my: 0.5 }} />

                                            <MenuItem
                                                onClick={() =>
                                                    handleExportToFormA(
                                                        selectedInstitution
                                                    )
                                                }
                                                disabled={loading.exportFormA}
                                                sx={{
                                                    py: 1,
                                                    mx: 1,
                                                    borderRadius: 1,
                                                    "&:hover": {
                                                        backgroundColor:
                                                            "rgba(25, 118, 210, 0.08)",
                                                    },
                                                }}
                                            >
                                                {loading.exportFormA ? (
                                                    <CircularProgress
                                                        size={18}
                                                        sx={{ mr: 1.5 }}
                                                    />
                                                ) : (
                                                    <MdOutlineDownload
                                                        style={{
                                                            fontSize: "20px",
                                                            marginRight: "5px",
                                                            color: "#438FFF",
                                                        }}
                                                    />
                                                )}
                                                <Typography variant="body2">
                                                    Export to Excel
                                                </Typography>
                                            </MenuItem>
                                        </Menu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={8}
                                    align="center"
                                    sx={{ py: 2, fontSize: "0.75rem" }}
                                >
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        No institutions found
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: isExtraSmall || isSmall ? "column" : "row", // Stack pagination controls on smaller screens
                    justifyContent: "flex-end",
                    alignItems: "center",
                    p: 1,
                    borderTop: 1,
                    borderColor: "divider",
                    bgcolor: "grey.50",
                }}
            >
                <FormControl size="small" sx={{ minWidth: 80, mr: 1 }}>
                    <InputLabel sx={{ fontSize: "0.75rem" }}>Rows</InputLabel>
                    <Select
                        value={
                            rowsPerPage === filteredInstitutions.length
                                ? -1
                                : rowsPerPage
                        }
                        onChange={handleChangeRowsPerPage}
                        label="Rows"
                        sx={{ height: 32, fontSize: "0.875rem" }}
                    >
                        {ROWS_PER_PAGE_OPTIONS.map((option) => (
                            <MenuItem
                                key={option.value}
                                value={option.value}
                                sx={{ fontSize: "0.875rem" }}
                            >
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mr: 1, fontSize: "0.75rem" }}
                >
                    {page * rowsPerPage + 1}-
                    {Math.min(
                        (page + 1) * rowsPerPage,
                        filteredInstitutions.length
                    )}{" "}
                    of {filteredInstitutions.length}
                </Typography>
                <Pagination
                    count={Math.ceil(filteredInstitutions.length / rowsPerPage)}
                    page={page + 1}
                    onChange={handleChangePage}
                    size="small"
                    color="primary"
                    showFirstButton
                    showLastButton
                    sx={{
                        "& .MuiPaginationItem-root": { fontSize: "0.75rem" },
                    }}
                />
            </Box>

            {/* Detail Dialog */}
            {selectedInstitution && (
                <DetailDialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                    institution={selectedInstitution}
                    onEdit={handleEditInstitution}
                    fetchInstitutions={fetchInstitutions}
                    setSnackbarOpen={setSnackbarOpen}
                    setSnackbarMessage={setSnackbarMessage}
                    setSnackbarSeverity={setSnackbarSeverity}
                />
            )}
        </Box>
    );
};

InstitutionTable.propTypes = {
    institutions: PropTypes.array.isRequired,
    onEdit: PropTypes.func,
    setSnackbarMessage: PropTypes.func.isRequired,
    fetchInstitutions: PropTypes.func.isRequired,
    setSnackbarSeverity: PropTypes.func.isRequired,
    setSnackbarOpen: PropTypes.func.isRequired,
    searchTerm: PropTypes.string,
    typeFilter: PropTypes.string,
    cityFilter: PropTypes.string,
    provinceFilter: PropTypes.string,
};

export default InstitutionTable;
