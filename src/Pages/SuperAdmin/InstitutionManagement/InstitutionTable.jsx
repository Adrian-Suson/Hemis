import { useNavigate } from "react-router-dom";
import { useRef, useState, useCallback, useMemo } from "react";
import ExcelJS from "exceljs";
import axios from "axios";
import DetailDialog from "./DetailDialog";
import config from "../../../utils/config";
import useActivityLog from "../../../Hooks/useActivityLog";
import {
    Paper,
    Menu,
    CircularProgress,
    Typography,
    Tooltip,
    IconButton,
    Divider,
    Box,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { CiSquareMore } from "react-icons/ci";
import { FaEye } from "react-icons/fa";
import { BiSolidBusiness } from "react-icons/bi";
import { HiMiniUserGroup } from "react-icons/hi2";
import { RiBookShelfFill } from "react-icons/ri";
import { FaUserGraduate } from "react-icons/fa6";
import { MdOutlineDownload, MdDelete } from "react-icons/md";
import PropTypes from "prop-types";
import { useLoading } from "../../../Context/LoadingContext";
import { encryptId } from "../../../utils/encryption";

const InstitutionTable = ({
    institutions = [],
    fetchInstitutions,
    setSnackbarMessage,
    setSnackbarSeverity,
    setSnackbarOpen,
    searchTerm = "",
    typeFilter = "",
    municipalityFilter = "",
    provinceFilter = "",
}) => {
    const navigate = useNavigate();
    const { updateProgress } = useLoading();
    const { createLog } = useActivityLog();
    const [selectedInstitution, setSelectedInstitution] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [loading, setLoading] = useState({
        viewCampuses: false,
        faculties: false,
        curricularPrograms: false,
        exportFormA: false,
        deleteInstitution: false,
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

    const handleOpenConfirmDialog = () => {
        setOpenConfirmDialog(true);
        handleMenuClose();
    };

    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
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
                    { row: 9, cell: 3, key: "municipality" },
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

    const handleDeleteInstitution = async () => {
        setOpenConfirmDialog(false);
        setLoading((prev) => ({ ...prev, deleteInstitution: true }));
        try {
            const token = localStorage.getItem("token");
            await axios.delete(
                `${config.API_URL}/institutions/${selectedInstitution.id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            await createLog({
                action: "deleted_institution",
                description: `Deleted institution: ${selectedInstitution.name}`,
                properties: {
                    name: selectedInstitution.name,
                    institution_type: selectedInstitution.institution_type,
                },
                modelType: "App\\Models\\Institution",
                modelId: selectedInstitution.id,
            });

            fetchInstitutions();

            setSnackbarMessage(
                `Institution ${selectedInstitution.name} deleted successfully!`
            );
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
        } catch (error) {
            console.error("Error deleting institution:", error);
            setSnackbarMessage(
                `Failed to delete institution: ${error.message}`
            );
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        } finally {
            setLoading((prev) => ({ ...prev, deleteInstitution: false }));
        }
    };

    const filteredInstitutions = useMemo(() => {
        return institutions.filter((institution) => {
            const matchesSearch = institution.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            const matchesType = typeFilter
                ? institution.institution_type === typeFilter
                : true;
            const matchesMunicipality = municipalityFilter
                ? institution.municipality === municipalityFilter
                : true;
            const matchesProvince = provinceFilter
                ? institution.province === provinceFilter
                : true;
            return (
                matchesSearch &&
                matchesType &&
                matchesMunicipality &&
                matchesProvince
            );
        });
    }, [
        institutions,
        searchTerm,
        typeFilter,
        municipalityFilter,
        provinceFilter,
    ]);

    const handleNavigation = (path, action) => {
        if (!selectedInstitution) return;
        setLoading((prev) => ({ ...prev, [action]: true }));
        const encryptedId = encryptId(selectedInstitution.id);
        navigate(`${path}/${encodeURIComponent(encryptedId)}`);
        setLoading((prev) => ({ ...prev, [action]: false }));
        handleMenuClose();
    };

    const handleEditInstitution = async (updatedInstitution) => {
        setSelectedInstitution((prev) => ({
            ...prev,
            ...updatedInstitution,
        }));

        await createLog({
            action: "edited_institution",
            description: `Edited institution: ${updatedInstitution.name}`,
            modelType: "App\\Models\\Institution",
            modelId: updatedInstitution.id,
            properties: updatedInstitution,
        });

        if (fetchInstitutions) {
            fetchInstitutions();
        }
    };

    const renderActionsCell = (params) => {
        return (
            <Tooltip title="More Options" arrow placement="top">
                <IconButton
                    onClick={(e) => handleMenuOpen(e, params.row)}
                    disabled={Boolean(menuAnchorEl)}
                    aria-label={`More options for ${params.row.name}`}
                    size="small"
                    sx={{
                        color: "primary.main",
                        "&:hover": {
                            backgroundColor: "rgba(25, 118, 210, 0.04)",
                        },
                    }}
                >
                    <CiSquareMore style={{ fontSize: "20px" }} />
                </IconButton>
            </Tooltip>
        );
    };

    const columns = [
        {
            field: "id",
            headerName: "ID",
            minwidth: 70,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "name",
            headerName: "Name",
            width: 400,
        },
        {
            field: "region",
            headerName: "Region",
            width: 250,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "address_street",
            headerName: "Address",
            width: 250,
            align: "center",

            headerAlign: "center",
        },
        {
            field: "municipality",
            headerName: "Municipality",
            width: 250,
            align: "center",

            headerAlign: "center",
        },
        {
            field: "province",
            headerName: "Province",
            width: 250,
            align: "center",

            headerAlign: "center",
        },
        {
            field: "institution_type",
            headerName: "Type",
            width: 193,
            align: "center",

            headerAlign: "center",
        },
        {
            field: "report_year",
            headerName: "Report Year",
            width: 120,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 150,
            sortable: false,
            filterable: false,
            renderCell: renderActionsCell,
            align: "center",
            headerAlign: "center",
        },
    ];

    return (
        <Box sx={{ mb: 2 }}>
            {/* DataGrid */}
            <Paper
                sx={{
                    borderRadius: 1,
                    display: "flex",
                    flexDirection: "column",
                    height: {
                        xs: "40vh",
                        sm: "50vh",
                        md: "55vh",
                    },
                    maxWidth: {
                        xs: "99vw",
                        sm: "95vw",
                        md: "99vw",
                    },
                    overflowX: "auto",
                    overflowY: "hidden",
                }}
            >
                <DataGrid
                    rows={filteredInstitutions}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 25, page: 0 },
                        },
                    }}
                    pageSizeOptions={[25, 50, 100]}
                    experimentalFeatures={{ columnGrouping: true }}
                    disableRowSelectionOnClick
                    disableColumnFilter
                    disableColumnMenu
                    disableColumnSorting
                    density="compact"
                    sx={{
                        border: 0,
                        "& .MuiDataGrid-root": {
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            minWidth: "fit-content",
                        },
                        "& .MuiDataGrid-main": {
                            flex: 1,
                            overflowX: "auto",
                            overflowY: "auto",
                            "&::-webkit-scrollbar": {
                                height: "8px",
                            },
                            "&::-webkit-scrollbar-thumb": {
                                backgroundColor: "rgba(0,0,0,0.2)",
                                borderRadius: "4px",
                            },
                        },
                        "& .MuiDataGrid-footerContainer": {
                            borderTop: 1,
                            borderColor: "divider",
                            position: "sticky",
                            bottom: 0,
                            backgroundColor: "background.paper",
                            zIndex: 1,
                            minWidth: "fit-content",
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                        },
                        "& .MuiDataGrid-columnSeparator": {
                            visibility: "hidden",
                        },
                        "& .MuiDataGrid-cell": {
                            borderRight: "1px solid",
                            borderColor: "divider",
                            whiteSpace: "normal",
                            wordWrap: "break-word",
                            padding: "4px 8px",
                        },
                        "& .MuiDataGrid-columnHeader": {
                            borderRight: "1px solid",
                            borderColor: "divider",
                            whiteSpace: "normal",
                            wordWrap: "break-word",
                            padding: "4px 8px",
                        },
                    }}
                />
            </Paper>

            {/* Action Menu */}
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
                        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                        "& .MuiList-root": {
                            padding: "4px 0",
                        },
                    },
                }}
            >
                <MenuItem
                    onClick={() => handleOpenDialog(selectedInstitution)}
                    sx={{
                        py: 1,
                        mx: 1,
                        borderRadius: 1,
                        "&:hover": {
                            backgroundColor: "rgba(25, 118, 210, 0.08)",
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
                    <Typography variant="body2">View Details</Typography>
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
                            backgroundColor: "rgba(25, 118, 210, 0.08)",
                        },
                    }}
                >
                    {loading.viewCampuses ? (
                        <CircularProgress size={18} sx={{ mr: 1.5 }} />
                    ) : (
                        <BiSolidBusiness
                            style={{
                                fontSize: "20px",
                                marginRight: "5px",
                                color: "#438FFF",
                            }}
                        />
                    )}
                    <Typography variant="body2">Manage Campuses</Typography>
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
                            backgroundColor: "rgba(25, 118, 210, 0.08)",
                        },
                    }}
                >
                    {loading.faculties ? (
                        <CircularProgress size={18} sx={{ mr: 1.5 }} />
                    ) : (
                        <HiMiniUserGroup
                            style={{
                                fontSize: "20px",
                                marginRight: "5px",
                                color: "#438FFF",
                            }}
                        />
                    )}
                    <Typography variant="body2">Manage Faculties</Typography>
                </MenuItem>

                <MenuItem
                    onClick={() =>
                        handleNavigation(
                            "/super-admin/institutions/curricular-programs",
                            "curricularPrograms"
                        )
                    }
                    disabled={loading.academicPrograms}
                    sx={{
                        py: 1,
                        mx: 1,
                        borderRadius: 1,
                        "&:hover": {
                            backgroundColor: "rgba(25, 118, 210, 0.08)",
                        },
                    }}
                >
                    {loading.curricularPrograms ? (
                        <CircularProgress size={18} sx={{ mr: 1.5 }} />
                    ) : (
                        <RiBookShelfFill
                            style={{
                                fontSize: "20px",
                                marginRight: "5px",
                                color: "#438FFF",
                            }}
                        />
                    )}
                    <Typography variant="body2">Curricular Programs</Typography>
                </MenuItem>

                <MenuItem
                    onClick={() =>
                        handleNavigation(
                            "/super-admin/institutions/graduates-list",
                            "curricularPrograms"
                        )
                    }
                    disabled={loading.curricularPrograms}
                    sx={{
                        py: 1,
                        mx: 1,
                        borderRadius: 1,
                        "&:hover": {
                            backgroundColor: "rgba(25, 118, 210, 0.08)",
                        },
                    }}
                >
                    {loading.curricularPrograms ? (
                        <CircularProgress size={18} sx={{ mr: 1.5 }} />
                    ) : (
                        <FaUserGraduate
                            style={{
                                fontSize: "20px",
                                marginRight: "5px",
                                color: "#438FFF",
                            }}
                        />
                    )}
                    <Typography variant="body2">List of Graduates</Typography>
                </MenuItem>

                <Divider sx={{ my: 0.5 }} />

                <MenuItem
                    onClick={() => handleExportToFormA(selectedInstitution)}
                    disabled={loading.exportFormA}
                    sx={{
                        py: 1,
                        mx: 1,
                        borderRadius: 1,
                        "&:hover": {
                            backgroundColor: "rgba(25, 118, 210, 0.08)",
                        },
                    }}
                >
                    {loading.exportFormA ? (
                        <CircularProgress size={18} sx={{ mr: 1.5 }} />
                    ) : (
                        <MdOutlineDownload
                            style={{
                                fontSize: "20px",
                                marginRight: "5px",
                                color: "#438FFF",
                            }}
                        />
                    )}
                    <Typography variant="body2">Export to Excel</Typography>
                </MenuItem>

                <MenuItem
                    onClick={handleOpenConfirmDialog}
                    disabled={loading.deleteInstitution}
                    sx={{
                        py: 1,
                        mx: 1,
                        borderRadius: 1,
                        "&:hover": {
                            backgroundColor: "rgba(255, 99, 71, 0.08)",
                        },
                    }}
                >
                    {loading.deleteInstitution ? (
                        <CircularProgress size={18} sx={{ mr: 1.5 }} />
                    ) : (
                        <MdDelete
                            style={{
                                fontSize: "20px",
                                marginRight: "5px",
                                color: "#FF6347",
                            }}
                        />
                    )}
                    <Typography variant="body2" color="error">
                        Delete Institution
                    </Typography>
                </MenuItem>
            </Menu>

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

            {/* Confirmation Dialog for Delete */}
            <Dialog
                open={openConfirmDialog}
                onClose={handleCloseConfirmDialog}
                aria-labelledby="confirm-delete-dialog"
            >
                <DialogTitle id="confirm-delete-dialog">
                    Confirm Deletion
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete{" "}
                        {selectedInstitution?.name}? This action cannot be
                        undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmDialog} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteInstitution}
                        color="error"
                        disabled={loading.deleteInstitution}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
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
    municipalityFilter: PropTypes.string,
    provinceFilter: PropTypes.string,
};

export default InstitutionTable;
