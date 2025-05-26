/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from "react-router-dom";
import { useRef, useState, useCallback, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import ExcelJS from "exceljs";
import axios from "axios";
import Swal from "sweetalert2";
import DetailDialog from "./DetailDialog";
import config from "../../../utils/config";
import useActivityLog from "../../../Hooks/useActivityLog";
import {
    MoreHorizontal,
    Eye,
    Building2,
    Users,
    BookOpen,
    UserCheck,
    Download,
    Trash2,
    Loader2,
} from "lucide-react";
import PropTypes from "prop-types";
import { useLoading } from "../../../Context/LoadingContext";
import { encryptId } from "../../../utils/encryption";
import Pagination from "../../../Components/Pagination";
import AlertComponent from "../../../Components/AlertComponent";

// Custom hook to detect clicks outside an element
const useClickOutside = (ref, callback) => {
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                console.log("Click outside detected, closing menu");
                callback();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, callback]);
};

const InstitutionTable = ({
    institutions = [],
    fetchInstitutions,
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
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [loading, setLoading] = useState({
        viewCampuses: false,
        faculties: false,
        curricularPrograms: false,
        exportFormA: false,
        deleteInstitution: false,
    });
    const menuButtonRef = useRef(null);
    const menuRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);

    // Define handleMenuClose before useClickOutside
    const handleMenuClose = () => {
        setMenuAnchorEl(null);
        menuButtonRef.current?.focus();
    };

    // Attach click-outside handler to menu
    useClickOutside(menuRef, handleMenuClose);

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
        event.stopPropagation();
        console.log("handleMenuOpen triggered", institution.name);
        setMenuAnchorEl(event.currentTarget);
        setSelectedInstitution(institution);
        menuButtonRef.current = event.currentTarget;
    };

    const handleOpenConfirmDialog = (event, institution) => {
        event.stopPropagation();
        console.log("handleOpenConfirmDialog triggered for", institution.name);
        Swal.fire({
            title: "Confirm Deletion",
            text: `Are you sure you want to delete ${institution.name}? This action cannot be undone.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
            customClass: {
                popup: "swal2-popup",
                title: "text-lg font-semibold text-gray-900",
                content: "text-gray-600",
            },
        }).then((result) => {
            if (result.isConfirmed) {
                handleDeleteInstitution(institution.id);
            }
        });
        handleMenuClose();
    };

    const handleDeleteInstitution = async (institutionId) => {
        setLoading((prev) => ({ ...prev, deleteInstitution: true }));
        try {
            const token = localStorage.getItem("token");
            await axios.delete(
                `${config.API_URL}/institutions/${institutionId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const institution = institutions.find(
                (inst) => inst.id === institutionId
            );

            // Log the delete action
            await createLog({
                action: "Delete Institution",
                description: `Deleted institution: ${institution.name}`,
            });

            fetchInstitutions();


        } catch (error) {
            console.error("Error deleting institution:", error);
        } finally {
            setLoading((prev) => ({ ...prev, deleteInstitution: false }));
        }
    };

    const handleExportToFormA = useCallback(
        async (institution) => {
            console.log(
                "handleExportToFormA confirmation triggered for",
                institution.name
            );
            Swal.fire({
                title: "Confirm Export",
                text: `Do you want to export Form A for ${institution.name}?`,
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Export",
                cancelButtonText: "Cancel",
                customClass: {
                    popup: "swal2-popup",
                    title: "text-lg font-semibold text-gray-900",
                    content: "text-gray-600",
                },
            }).then(async (result) => {
                if (result.isConfirmed) {
                    setLoading((prev) => ({ ...prev, exportFormA: true }));
                    try {
                        updateProgress(10);
                        const response = await fetch(
                            "/templates/Form-A-Themeplate.xlsx"
                        );
                        if (!response.ok)
                            throw new Error(
                                `HTTP error! Status: ${response.status}`
                            );
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
                            {
                                row: 13,
                                cell: 3,
                                key: "institutional_telephone",
                            },
                            { row: 14, cell: 3, key: "institutional_fax" },
                            { row: 15, cell: 3, key: "head_telephone" },
                            { row: 16, cell: 3, key: "institutional_email" },
                            { row: 17, cell: 3, key: "institutional_website" },
                            { row: 18, cell: 3, key: "year_established" },
                            { row: 19, cell: 3, key: "sec_registration" },
                            { row: 20, cell: 3, key: "year_granted_approved" },
                            { row: 21, cell: 3, key: "year_converted_college" },
                            {
                                row: 22,
                                cell: 3,
                                key: "year_converted_university",
                            },
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
                        updateProgress(100);
                        const fileName = `${
                            institution.uuid || "0000"
                        }_${institution.name || "Unknown"}_${
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

                        // Log the export action
                        await createLog({
                            action: "Export Institution",
                            description: `Exported Form A for institution: ${institution.name}`,
                        });

                    } catch (error) {
                        console.error("Error exporting Form A:", error);

                    } finally {
                        setLoading((prev) => ({ ...prev, exportFormA: false }));
                    }
                }
            });
            handleMenuClose();
        },
        [
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

    const totalRows = filteredInstitutions.length;
    const totalPages = Math.ceil(totalRows / pageSize);
    const paginatedInstitutions = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return filteredInstitutions.slice(startIndex, endIndex);
    }, [filteredInstitutions, currentPage, pageSize]);

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
        fetchInstitutions();
        AlertComponent.showAlert(
            "Institution Added successfully!",
            "success"
        );
        await createLog({
            action: "edited_institution",
            description: `Edited institution: ${updatedInstitution.name}`,
        });
    };

    return (
        <div className="mb-4">
           {/* Custom Compact Table with Max Height */}
<div className="bg-white rounded-lg shadow-sm border border-gray-200">
<div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex justify-between items-center">
        <span>
            Showing {Math.min((currentPage - 1) * pageSize + 1, filteredInstitutions.length)} to{' '}
            {Math.min(currentPage * pageSize, filteredInstitutions.length)} of{' '}
            {filteredInstitutions.length} institutions
        </span>
        <span>
            {filteredInstitutions.length > pageSize && `Page ${currentPage} of ${totalPages}`}
        </span>
    </div>
    <div className="max-h-[500px] overflow-auto">
        <table className="w-full min-w-[800px] text-sm text-gray-900">
            <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                    <th className="py-2 px-3 text-center font-semibold border-r border-gray-200 text-xs uppercase tracking-wider">
                        UUID
                    </th>
                    <th className="py-2 px-3 text-left font-semibold border-r border-gray-200 text-xs uppercase tracking-wider">
                        Name
                    </th>
                    <th className="py-2 px-3 text-center font-semibold border-r border-gray-200 text-xs uppercase tracking-wider">
                        Region
                    </th>
                    <th className="py-2 px-3 text-center font-semibold border-r border-gray-200 text-xs uppercase tracking-wider">
                        Address
                    </th>
                    <th className="py-2 px-3 text-center font-semibold border-r border-gray-200 text-xs uppercase tracking-wider">
                        Municipality
                    </th>
                    <th className="py-2 px-3 text-center font-semibold border-r border-gray-200 text-xs uppercase tracking-wider">
                        Province
                    </th>
                    <th className="py-2 px-3 text-center font-semibold border-r border-gray-200 text-xs uppercase tracking-wider">
                        Type
                    </th>
                    <th className="py-2 px-3 text-center font-semibold text-xs uppercase tracking-wider">
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {paginatedInstitutions.length === 0 ? (
                    <tr>
                        <td
                            colSpan="8"
                            className="py-8 text-center text-gray-500 text-sm"
                        >
                            No institutions found.
                        </td>
                    </tr>
                ) : (
                    paginatedInstitutions.map((institution, index) => (
                        <tr
                            key={institution.id}
                            className={`hover:bg-gray-50 transition-colors duration-150 ${
                                index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                            }`}
                        >
                            <td className="py-2 px-3 text-center border-r border-gray-200 text-xs font-mono whitespace-nowrap">
                                <span className="bg-gray-100 px-2 py-1 rounded text-gray-700">
                                    {institution.uuid}
                                </span>
                            </td>
                            <td className="py-2 px-3 text-left border-r border-gray-200 font-medium whitespace-normal">
                                {institution.name}
                            </td>
                            <td className="py-2 px-3 text-center border-r border-gray-200 text-xs whitespace-nowrap">
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                    {institution.region}
                                </span>
                            </td>
                            <td className="py-2 px-3 text-center border-r border-gray-200 text-xs whitespace-normal">
                                {institution.address_street}
                            </td>
                            <td className="py-2 px-3 text-center border-r border-gray-200 text-xs whitespace-nowrap">
                                {institution.municipality}
                            </td>
                            <td className="py-2 px-3 text-center border-r border-gray-200 text-xs whitespace-nowrap">
                                {institution.province}
                            </td>
                            <td className="py-2 px-3 text-center border-r border-gray-200 text-xs whitespace-nowrap">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    institution.institution_type === 'State University'
                                        ? 'bg-green-100 text-green-800'
                                        : institution.institution_type === 'Private University'
                                        ? 'bg-purple-100 text-purple-800'
                                        : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {institution.institution_type}
                                </span>
                            </td>
                            <td className="py-2 px-3 text-center whitespace-nowrap">
                                <button
                                    onClick={(e) =>
                                        handleMenuOpen(e, institution)
                                    }
                                    disabled={Boolean(menuAnchorEl)}
                                    aria-label={`More options for ${institution.name}`}
                                    className="inline-flex items-center justify-center w-8 h-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                                >
                                    <MoreHorizontal className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    </div>



</div>

            {/* Pagination */}
            {filteredInstitutions.length > 0 && (
                <div className="mt-4">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        pageSize={pageSize}
                        onPageChange={(page) => setCurrentPage(page)}
                        onPageSizeChange={(size) => {
                            setPageSize(size);
                            setCurrentPage(1);
                        }}
                        showFirstLast={true}
                        showPageSize={true}
                        maxPageButtons={5}
                        className="flex justify-end items-center"
                    />
                </div>
            )}

            {/* Action Menu (Portal) */}
            {selectedInstitution &&
                menuAnchorEl &&
                createPortal(
                    <div
                        ref={menuRef}
                        className="fixed z-50 bg-white rounded-lg shadow-lg min-w-[180px]"
                        style={{
                            top:
                                menuAnchorEl.getBoundingClientRect().bottom + 4,
                            right:
                                window.innerWidth -
                                menuAnchorEl.getBoundingClientRect().right,
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ul className="py-1">
                            <li>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenDialog(selectedInstitution);
                                    }}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                                >
                                    <Eye className="w-5 h-5 mr-2 text-blue-600" />
                                    View Details
                                </button>
                            </li>
                            <li className="border-t border-gray-200 my-1"></li>
                            <li>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleNavigation(
                                            "/super-admin/institutions/campuses",
                                            "viewCampuses"
                                        );
                                    }}
                                    disabled={loading.viewCampuses}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 disabled:opacity-50"
                                >
                                    {loading.viewCampuses ? (
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin text-blue-600" />
                                    ) : (
                                        <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                                    )}
                                    Manage Campuses
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleNavigation(
                                            "/super-admin/institutions/faculties",
                                            "faculties"
                                        );
                                    }}
                                    disabled={loading.faculties}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 disabled:opacity-50"
                                >
                                    {loading.faculties ? (
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin text-blue-600" />
                                    ) : (
                                        <Users className="w-5 h-5 mr-2 text-blue-600" />
                                    )}
                                    Manage Faculties
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleNavigation(
                                            "/super-admin/institutions/curricular-programs",
                                            "curricularPrograms"
                                        );
                                    }}
                                    disabled={loading.curricularPrograms}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 disabled:opacity-50"
                                >
                                    {loading.curricularPrograms ? (
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin text-blue-600" />
                                    ) : (
                                        <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                                    )}
                                    Curricular Programs
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleNavigation(
                                            "/super-admin/institutions/graduates-list",
                                            "curricularPrograms"
                                        );
                                    }}
                                    disabled={loading.curricularPrograms}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 disabled:opacity-50"
                                >
                                    {loading.curricularPrograms ? (
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin text-blue-600" />
                                    ) : (
                                        <UserCheck className="w-5 h-5 mr-2 text-blue-600" />
                                    )}
                                    List of Graduates
                                </button>
                            </li>
                            <li className="border-t border-gray-200 my-1"></li>
                            <li>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleExportToFormA(
                                            selectedInstitution
                                        );
                                    }}
                                    disabled={loading.exportFormA}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 disabled:opacity-50"
                                >
                                    {loading.exportFormA ? (
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin text-blue-600" />
                                    ) : (
                                        <Download className="w-5 h-5 mr-2 text-blue-600" />
                                    )}
                                    Export to Excel
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={(e) =>
                                        handleOpenConfirmDialog(
                                            e,
                                            selectedInstitution
                                        )
                                    }
                                    disabled={loading.deleteInstitution}
                                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                                >
                                    {loading.deleteInstitution ? (
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin text-red-600" />
                                    ) : (
                                        <Trash2 className="w-5 h-5 mr-2 text-red-600" />
                                    )}
                                    Delete Institution
                                </button>
                            </li>
                        </ul>
                    </div>,
                    document.body
                )}

            {/* Detail Dialog */}
            {selectedInstitution && (
                <DetailDialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                    institution={selectedInstitution}
                    onEdit={handleEditInstitution}
                    fetchInstitutions={fetchInstitutions}
                />
            )}
        </div>
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
