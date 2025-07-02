import {
    School,
    Phone,
    Mail,
    MoreHorizontal,
    Edit,
    Trash,
    User,
} from "lucide-react";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import Popper from "../../../../Components/Popper";
import Pagination from "../../../../Components/Pagination";
import LucDetailsView from './LucDetailsView';
import { useNavigate } from "react-router-dom";
import { HEAD_TITLE_MAPPING } from '../../../../utils/LucFormAConstants';
import ExcelJS from "exceljs";
import axios from "axios";
import config from "../../../../utils/config";
import AlertComponent from "../../../../Components/AlertComponent";

function LucDataTable({ data, onEdit, onDelete }) {
    const [selectedLuc, setSelectedLuc] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const navigate = useNavigate();
    const [loading, setLoading] = useState({ exportFormA: false });

    useEffect(() => {
        setCurrentPage(1);
        console.log(data);
    }, [data]);

    // Sort data alphabetically by institution name
    const sortedData = [...data].sort((a, b) => {
        const nameA = a.institution_name || "";
        const nameB = b.institution_name || "";
        return nameA.localeCompare(nameB);
    });

    // Calculate pagination
    const totalPages = Math.ceil(sortedData.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentData = sortedData.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (size) => {
        setPageSize(size);
        setCurrentPage(1);
    };

    const handleViewDetails = (luc) => {
        setSelectedLuc(luc);
        setIsDetailsModalOpen(true);
    };

    const handleCloseDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setSelectedLuc(null);
    };

    const handleView = (luc, type) => {
        const LucDetailId = luc.id;
        if (!LucDetailId) {
            console.error(`No LUC ID found for ${type}:`, luc);
            return;
        }
        const routes = {
            formerNames: `/super-admin/institutions/luc/former-names/${LucDetailId}`,
            deanProfiles: `/super-admin/institutions/luc/dean-profiles/${LucDetailId}`,
        };
        navigate(routes[type], {
            state: {
                heiName: luc.hei?.name || luc.institution_name,
                heiUiid: luc.hei?.uiid || luc.institution_uiid,
            },
        });
    };

    // Helper for head title
    const getHeadTitle = (value) => {
        return HEAD_TITLE_MAPPING[String(value)] || value || "";
    };

    // Export to Form A handler
    const handleExportToFormA = async (luc) => {
        AlertComponent.showConfirmation(
            `Do you want to export Form A for ${luc.institution_name}?`,
            async () => {
                setLoading((prev) => ({ ...prev, exportFormA: true }));
                try {
                    // Download the LUC Form A template
                    const response = await fetch("/templates/Luc-Form-A-Themeplate.xlsx");
                    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                    const arrayBuffer = await response.arrayBuffer();

                    const workbook = new ExcelJS.Workbook();
                    await workbook.xlsx.load(arrayBuffer);

                    // Access the worksheets using exact names from the template
                    const sheetAInstProfile = workbook.getWorksheet("A Inst Profile");
                    const sheetADeanProfile = workbook.getWorksheet("A Dean Profile");

                    // --- A Inst Profile: Map all required fields ---
                    const aInstFields = [
                        { row: 4, cell: 3, key: "institution_name" },
                        { row: 5, cell: 3, key: "form_of_ownership" },
                        { row: 6, cell: 3, key: "institutional_type" },
                        { row: 7, cell: 3, key: "address_street" },
                        { row: 8, cell: 3, key: "municipality_city" },
                        { row: 9, cell: 3, key: "province" },
                        { row: 10, cell: 3, key: "region" },
                        { row: 11, cell: 3, key: "postal_code" },
                        { row: 12, cell: 3, key: "institutional_telephone" },
                        { row: 13, cell: 3, key: "institutional_fax" },
                        { row: 14, cell: 3, key: "head_telephone" },
                        { row: 15, cell: 3, key: "institutional_email" },
                        { row: 16, cell: 3, key: "institutional_website" },
                        { row: 17, cell: 3, key: "year_established" },
                        { row: 18, cell: 3, key: "sec_registration" },
                        { row: 19, cell: 3, key: "year_granted_approved" },
                        { row: 20, cell: 3, key: "year_converted_college" },
                        { row: 21, cell: 3, key: "year_converted_university" },
                        { row: 22, cell: 3, key: "head_name" },
                        { row: 23, cell: 3, key: "head_title", transform: getHeadTitle },
                        { row: 24, cell: 3, key: "head_education" },
                        { row: 25, cell: 3, key: "x_coordinate" },
                        { row: 26, cell: 3, key: "y_coordinate" },
                    ];

                    aInstFields.forEach(({ row, cell, key, transform }) => {
                        let value = luc[key] || luc[key.replace("address_", "")]; // Fallback for street/address_street
                        if (!value && key === "municipality_city") value = luc["municipality"];
                        if (transform && value) value = transform(value);
                        sheetAInstProfile.getRow(row).getCell(cell).value = value || "";
                    });

                    // --- A Inst Profile: Former Names Table ---
                    const token = localStorage.getItem("token");
                    let formerNames = [];
                    try {
                        const { data: formerNamesResp } = await axios.get(
                            `${config.API_URL}/luc-former-names?luc_detail_id=${luc.id}`,
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                        formerNames = Array.isArray(formerNamesResp) ? formerNamesResp : formerNamesResp.data || [];
                    } catch {
                        formerNames = [];
                    }

                    // Write former names starting at row 30 (as per template: Name, Year)
                    let formerStartRow = 31;
                    if (formerNames.length === 0) {
                        sheetAInstProfile.getRow(formerStartRow).getCell(1).value = "N/A";
                        sheetAInstProfile.getRow(formerStartRow).getCell(3).value = "N/A";
                    } else {
                        formerNames.forEach((item, idx) => {
                            const row = sheetAInstProfile.getRow(formerStartRow + idx);
                            row.getCell(1).value = item.former_name || "N/A";
                            row.getCell(3).value = item.year_used || "N/A";
                        });
                    }

                    // --- A Dean Profile: Dean Profile Table ---
                    let deanProfiles = [];
                    try {
                        const { data: deanResp } = await axios.get(
                            `${config.API_URL}/luc-dean-profiles?luc_detail_id=${luc.id}`,
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                        deanProfiles = Array.isArray(deanResp) ? deanResp : deanResp.data || [];
                    } catch {
                        deanProfiles = [];
                    }

                    // Write Dean Profile table starting at row 3 (as per template)
                    let deanStartRow = 3;
                    const deanHeader = [
                        "Name of Dean (Last Name, First Name Middle Initial)",
                        "Designation (e.g. Program Dean, College Head)",
                        "College/Discipline Assignment (e.g. College of Liberal Arts)",
                        "Baccalaureate",
                        "Masters",
                        "Doctoral",
                    ];
                    deanHeader.forEach((header, idx) => {
                        sheetADeanProfile.getRow(deanStartRow).getCell(idx + 1).value = header;
                    });

                    if (deanProfiles.length === 0) {
                        const row = sheetADeanProfile.getRow(deanStartRow + 1);
                        row.getCell(1).value = "N/A";
                        row.getCell(2).value = "N/A";
                        row.getCell(3).value = "N/A";
                        row.getCell(4).value = "N/A";
                        row.getCell(5).value = "N/A";
                        row.getCell(6).value = "N/A";
                        row.commit();
                    } else {
                        deanProfiles.forEach((dean, idx) => {
                            const row = sheetADeanProfile.getRow(deanStartRow + 1 + idx);
                            row.getCell(1).value = dean.name || dean.last_name || "N/A";
                            row.getCell(2).value = dean.designation || "N/A";
                            row.getCell(3).value = dean.college_discipline_assignment || "N/A";
                            row.getCell(4).value = dean.baccalaureate_degree || "N/A";
                            row.getCell(5).value = dean.masters_degree || "N/A";
                            row.getCell(6).value = dean.doctorate_degree || "N/A";
                            row.commit();
                        });
                    }

                    // --- Download the filled Excel file ---
                    const fileName = `${luc.institution_uiid || "0000"}_${luc.institution_name || "Unknown"}_LUC_${new Date().toISOString().split("T")[0]}.xlsx`;
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

                    AlertComponent.showAlert("Form A exported successfully.", "success");
                } catch (error) {
                    console.error("Error exporting Form A:", error);
                    AlertComponent.showAlert("Failed to export Form A. Please try again.", "error");
                } finally {
                    setLoading((prev) => ({ ...prev, exportFormA: false }));
                }
            }
        );
    };

    return (
        <>
            <div className="relative w-full px-4 py-2">
                <div className="overflow-x-auto overflow-y-auto max-h-[50vh] rounded-lg border border-gray-200 shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200 table-fixed">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                            <tr>
                                <th className="w-[25%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                    Institution
                                </th>
                                <th className="w-[15%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                    Location
                                </th>
                                <th className="w-[20%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                    Leadership
                                </th>
                                <th className="w-[20%] px-6(py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                    Contact
                                </th>
                                <th className="w-[10%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                    Established
                                </th>
                                <th className="w-[10%] px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentData.map((luc) => (
                                <tr key={luc.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-start">
                                            <div className="min-w-0">
                                                <div className="text-sm font-medium text-gray-900 break-words">
                                                    {luc.institution_name}
                                                </div>
                                                <div className="text-sm text-gray-500 truncate">
                                                    {luc.institution_uiid}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 truncate">
                                            {luc.municipality}, {luc.province}
                                        </div>
                                        <div className="text-sm text-gray-500 truncate">
                                            {luc.region}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 truncate">
                                            {luc.head_name}
                                        </div>
                                        <div className="text-sm text-gray-500 truncate">
                                            {HEAD_TITLE_MAPPING[String(luc.head_title)] || luc.head_title}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 flexrape items-center">
                                            <Phone className="w-3 h-3 mr-1 flex-shrink-0" />
                                            <span className="truncate">
                                                {luc.institutional_telephone}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-500 flex items-center">
                                            <Mail className="w-3 h-3 mr-1 flex-shrink-0" />
                                            <span className="truncate">
                                                {luc.institutional_email}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {luc.year_established}
                                        </div>
                                        {luc.year_converted_university && (
                                            <div className="text-sm text-gray-500">
                                                Univ: {luc.year_converted_university}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                                        <Popper
                                            trigger={
                                                <button
                                                    className="text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded-md p-1"
                                                    title="More Actions"
                                                >
                                                    <MoreHorizontal className="w-5 h-5" />
                                                </button>
                                            }
                                            placement="bottom-end"
                                            className="w-48 bg-white border border-gray-200 rounded-md shadow-lg z-[9999]"
                                            offset={[0, 4]}
                                        >
                                            <div className="py-1">
                                                <div className="px-2 py-1 text-xs font-medium text-gray-500">
                                                    Actions
                                                </div>
                                                <button
                                                    onClick={() => handleViewDetails(luc)}
                                                    className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition-colors duration-150 group"
                                                    role="menuitem"
                                                >
                                                    <School className="w-4 h-4 mr-3 text-gray-500 group-hover:text-gray-600" />
                                                    View Details
                                                </button>
                                                <button
                                                    onClick={() => onEdit(luc)}
                                                    className="flex items-center w-full px-4 py-2 text-left text-sm text-green-700 hover:bg-green-50 focus:outline-none focus:bg-green-50 transition-colors duration-150 group"
                                                    role="menuitem"
                                                >
                                                    <Edit className="w-4 h-4 mr-3 text-green-700 group-hover:text-green-600" />
                                                    Edit LUC
                                                </button>
                                                <button
                                                    onClick={() => handleView(luc, 'formerNames')}
                                                    className="flex items-center w-full px-4 py-2 text-left text-sm text-blue-700 hover:bg-blue-50 focus:outline-none focus:bg-blue-50 transition-colors duration-150 group"
                                                    role="menuitem"
                                                >
                                                    <School className="w-4 h-4 mr-3 text-blue-700 group-hover:text-blue-800" />
                                                    View Former Names
                                                </button>
                                                <button
                                                    onClick={() => handleView(luc, 'deanProfiles')}
                                                    className="flex items-center w-full px-4 py-2 text-left text-sm text-indigo-700 hover:bg-indigo-50 focus:outline-none focus:bg-indigo-50 transition-colors duration-150 group"
                                                    role="menuitem"
                                                >
                                                    <User className="w-4 h-4 mr-3 text-indigo-700 group-hover:text-indigo-800" />
                                                    View Dean Profiles
                                                </button>
                                                <button
                                                    onClick={() => onDelete(luc.id)}
                                                    className="flex items-center w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50 focus:outline-none focus:bg-red-50 transition-colors duration-150 group"
                                                    role="menuitem"
                                                >
                                                    <Trash className="w-4 h-4 mr-3 text-red-700 group-hover:text-red-600" />
                                                    Delete LUC
                                                </button>
                                                <button
                                                    onClick={() => handleExportToFormA(luc)}
                                                    className="flex items-center w-full px-4 py-2 text-left text-sm text-orange-700 hover:bg-orange-50 focus:outline-none focus:bg-orange-50 transition-colors duration-150 group"
                                                    role="menuitem"
                                                    disabled={loading.exportFormA}
                                                >
                                                    <School className="w-4 h-4 mr-3 text-orange-700 group-hover:text-orange-800" />
                                                    Export to Form A
                                                </button>

                                                <div className="border-t border-gray-100 my-1"></div>
                                            </div>
                                        </Popper>
                                    </td>
                                </tr>
                            ))}
                            {currentData.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <div className="text-gray-500">
                                            <School className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                            <p className="text-lg font-medium">No LUCs found</p>
                                            <p className="text-sm">Try adjusting your search terms or add a new LUC.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="mt-2 flex justify-end">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        pageSize={pageSize}
                        onPageSizeChange={handlePageSizeChange}
                        pageSizeOptions={[10, 20, 50, 100]}
                        showFirstLast={true}
                        showPageSize={true}
                        maxPageButtons={5}
                    />
                </div>
            </div>
            <LucDetailsView
                isOpen={isDetailsModalOpen}
                onClose={handleCloseDetailsModal}
                lucData={selectedLuc}
            />
        </>
    );
}

LucDataTable.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            institution_name: PropTypes.string,
            institution_uiid: PropTypes.string,
            region: PropTypes.string,
            province: PropTypes.string,
            municipality: PropTypes.string,
            institutional_telephone: PropTypes.string,
            institutional_email: PropTypes.string,
            year_established: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            head_name: PropTypes.string,
            head_title: PropTypes.string,
            year_converted_university: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        })
    ).isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default LucDataTable;