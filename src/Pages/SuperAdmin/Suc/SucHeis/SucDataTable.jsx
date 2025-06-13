import { GraduationCap, Phone, Mail, MoreHorizontal, Building2, BookOpen, Users, Download, Edit, Trash, FileText } from "lucide-react";
import PropTypes from "prop-types";
import { useState, useCallback } from "react";
import Popper from "../../../../Components/Popper";
import { useNavigate } from "react-router-dom";
import SucDetailsView from "./SucDetailsView"; // Adjust path as needed
import ExcelJS from "exceljs";
import Swal from "sweetalert2";
import axios from "axios";
import config from "../../../../utils/config";
import Pagination from "../../../../Components/Pagination";

// Mapping for head titles
const HEAD_TITLE_MAPPING = {
    1: "President",
    2: "Chancellor",
    3: "Executive Director",
    4: "Dean",
    5: "Rector",
    6: "Head",
    7: "Administrator",
    8: "Principal",
    9: "Managing Director",
    10: "Director",
    11: "Chair",
    12: "Others",
    99: "Not known or not indicated",
};

function SucDataTable({ data, onEdit, onDelete, createLog, updateProgress }) {
    const navigate = useNavigate();
    const [selectedSuc, setSelectedSuc] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [loading, setLoading] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Calculate pagination
    const totalPages = Math.ceil(data.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentData = data.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (size) => {
        setPageSize(size);
        setCurrentPage(1); // Reset to first page when changing page size
    };

    const handleView = (suc, type) => {
        const SucDetailId = suc.id || suc.id;
        if (!SucDetailId) {
            console.error(`No SUC ID found for ${type}:`, suc);
            return;
        }

        const routes = {
            campuses: `/super-admin/institutions/suc/campuses/${SucDetailId}`,
            programs: `/super-admin/institutions/suc/programs/${SucDetailId}`,
            formE1: `/super-admin/institutions/suc/form-e1/${SucDetailId}`,
            formE2: `/super-admin/institutions/suc/form-e2/${SucDetailId}`,
            formGH: `/super-admin/institutions/suc/form-gh/${SucDetailId}`,
            research: `/super-admin/institutions/suc/research/${SucDetailId}`,
            graduates: `/super-admin/institutions/suc/graduates/${SucDetailId}`
        };

        navigate(routes[type], {
            state: { heiName: suc.hei_name || suc.institution_name, heiUiid: suc.hei_uiid },
        });
    };

    const handleViewDetails = (suc) => {
        setSelectedSuc(suc);
        setIsDetailsModalOpen(true);
    };

    const handleCloseDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setSelectedSuc(null);
    };

    const getHeadTitle = (title) => {
        const numericTitle = Number(title); // Convert to number
        return HEAD_TITLE_MAPPING[numericTitle] || "Unknown Title";
    };

    const handleExportToFormA = useCallback(
        async (institution) => {
            console.log(
                "handleExportToFormA confirmation triggered for",
                institution.institution_name || institution.hei_name
            );
            Swal.fire({
                title: "Confirm Export",
                text: `Do you want to export Form A for ${institution.institution_name || institution.hei_name}?`,
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
                        updateProgress && updateProgress(10);
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

                        // Map SUC data fields to Form A1 structure (based on the template image)
                        const a1Fields = [
                            { row: 4, cell: 3, key: "institution_name", altKey: "hei_name" }, // Institution Name
                            { row: 7, cell: 3, key: "address_street" }, // Street
                            { row: 8, cell: 3, key: "municipality" }, // Municipality/City
                            { row: 9, cell: 3, key: "province" }, // Province
                            { row: 10, cell: 3, key: "region" }, // Region
                            { row: 11, cell: 3, key: "postal_code" }, // Postal or Zip Code
                            { row: 12, cell: 3, key: "institutional_telephone" }, // Institutional Telephone
                            { row: 13, cell: 3, key: "institutional_fax" }, // Institutional Fax No.
                            { row: 14, cell: 3, key: "head_telephone" }, // Institutional Head's Telephone
                            { row: 15, cell: 3, key: "institutional_email" }, // Institutional E-mail Address
                            { row: 16, cell: 3, key: "institutional_website" }, // Institutional Web Site
                            { row: 17, cell: 3, key: "year_established" }, // Year Established
                            { row: 18, cell: 3, key: "sec_registration" }, // Latest SEC Registration/Enabling Law or Charter
                            { row: 19, cell: 3, key: "year_granted_approved" }, // Year Granted or Approved
                            { row: 20, cell: 3, key: "year_converted_college" }, // Year Converted to College Status
                            { row: 21, cell: 3, key: "year_converted_university" }, // Year Converted to University Status
                            { row: 22, cell: 3, key: "head_name" }, // Name of Institutional Head
                            { row: 23, cell: 3, key: "head_title", transform: getHeadTitle }, // Title of Head of Institution
                            { row: 24, cell: 3, key: "head_education" }, // Highest Educational Attainment of the Head
                        ];

                        a1Fields.forEach(({ row, cell, key, altKey, transform }) => {
                            let value = institution[key] || (altKey ? institution[altKey] : "") || "";
                            if (transform && value) {
                                value = transform(value);
                            }
                            sheetA1.getRow(row).getCell(cell).value = value;
                        });

                        updateProgress && updateProgress(20);
                        const token = localStorage.getItem("token");
                        const { data: campusData } = await axios.get(
                            `${config.API_URL}/suc-campuses?suc_details_id=${institution.id}`,
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                        console.log("campusData", campusData);

                        // Handle different possible response structures
                        let campuses = [];
                        if (Array.isArray(campusData)) {
                            campuses = campusData;
                        } else if (campusData.campuses && Array.isArray(campusData.campuses)) {
                            campuses = campusData.campuses;
                        } else if (campusData.data && Array.isArray(campusData.data)) {
                            campuses = campusData.data;
                        }

                        console.log("campuses", campuses);

                        // Find the starting row for Form A2 - Campus data dynamically by searching for 'START BELOW THIS ROW'
                        let a2StartRow = -1;
                        sheetA2.eachRow((row, rowNumber) => {
                            let foundMarker = false;
                            row.eachCell((cell) => {
                                if (cell.value && String(cell.value).trim() === "START BELOW THIS ROW") {
                                    foundMarker = true;
                                    return false; // Stop iterating cells in this row
                                }
                            });
                            if (foundMarker) {
                                a2StartRow = rowNumber + 1;
                                return false; // Stop iterating rows once marker found
                            }
                        });

                        if (a2StartRow === -1) {
                            console.error("Could not find 'START BELOW THIS ROW' marker in FORM A2. Campus data will not be exported.");
                            // Optionally throw an error or handle this case appropriately
                        } else {
                            // Form A2 - Campus data
                            campuses.forEach((campus, index) => {
                                const row = sheetA2.getRow(a2StartRow + index);

                                // Map the actual data structure from your API response
                                row.getCell(1).value = index + 1; // Seq No.
                                row.getCell(2).value = campus.name || ""; // NAME OF THE SUC CAMPUS
                                row.getCell(3).value = campus.campus_type || ""; // MAIN OR SATELLITE
                                row.getCell(4).value = campus.institutional_code || ""; // INSTITUTIONAL CODE
                                row.getCell(5).value = campus.region || ""; // REGION
                                row.getCell(6).value = campus.province_municipality || ""; // MUNICIPALITY/CITY AND PROVINCE
                                row.getCell(7).value = campus.year_first_operation || ""; // YEAR OF FIRST OPERATION
                                row.getCell(8).value = campus.land_area_hectares || "0.0"; // LAND AREA IN HECTARES
                                row.getCell(9).value = campus.distance_from_main || "0.0"; // DISTANCE FROM MAIN CAMPUS (KM)
                                row.getCell(10).value = campus.autonomous_code || ""; // AUTONOMOUS FROM THE MAIN CAMPUS
                                row.getCell(11).value = campus.position_title || ""; // POSITION TITLE OF HIGHEST OFFICIAL
                                row.getCell(12).value = campus.head_full_name || ""; // FULL NAME OF HIGHEST OFFICIAL
                                row.getCell(13).value = campus.former_name || ""; // FORMER NAME OF THE CAMPUS
                                row.getCell(14).value = campus.latitude_coordinates || "0.0"; // LATITUDE COORDINATES
                                row.getCell(15).value = campus.longitude_coordinates || "0.0"; // LONGITUDE COORDINATES

                                row.commit();
                            });
                        }

                        updateProgress && updateProgress(100);
                        const fileName = `${
                            institution.institution_uiid || institution.hei_uiid || "0000"
                        }_${institution.institution_name || institution.hei_name || "Unknown"}_SUC_${
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
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);

                        // Log the export action
                        if (createLog) {
                            await createLog({
                                action: "Export Institution",
                                description: `Exported Form A for institution: ${institution.institution_name || institution.hei_name}`,
                            });
                        }

                        Swal.fire({
                            title: "Success!",
                            text: "Form A exported successfully.",
                            icon: "success",
                            timer: 2000,
                            showConfirmButton: false,
                        });

                    } catch (error) {
                        console.error("Error exporting Form A:", error);
                        Swal.fire({
                            title: "Error!",
                            text: "Failed to export Form A. Please try again.",
                            icon: "error",
                            confirmButtonText: "OK",
                        });
                    } finally {
                        setLoading((prev) => ({ ...prev, exportFormA: false }));
                    }
                }
            });
        },
        [updateProgress, createLog]
    );

    return (
        <>
            <div className="relative w-full p-4">
                <div className="overflow-x-auto overflow-y-auto max-h-[55vh] rounded-lg border border-gray-200 shadow-sm">
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
                                <th className="w-[20%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
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
                            {currentData.map((suc) => (
                                <tr key={suc.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-start">
                                            <div className="min-w-0">
                                                <div className="text-sm font-medium text-gray-900 break-words">
                                                    {suc.institution_name ||
                                                        suc.hei_name}
                                                </div>
                                                <div className="text-sm text-gray-500 truncate">
                                                    {suc.institution_uiid ||
                                                        suc.hei_uiid}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 truncate">
                                            {suc.municipality}, {suc.province}
                                        </div>
                                        <div className="text-sm text-gray-500 truncate">
                                            {suc.region}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 truncate">
                                            {suc.head_name}
                                        </div>
                                        <div className="text-sm text-gray-500 truncate">
                                            {getHeadTitle(suc.head_title)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 flex items-center">
                                            <Phone className="w-3 h-3 mr-1 flex-shrink-0" />
                                            <span className="truncate">{suc.institutional_telephone}</span>
                                        </div>
                                        <div className="text-sm text-gray-500 flex items-center">
                                            <Mail className="w-3 h-3 mr-1 flex-shrink-0" />
                                            <span className="truncate">{suc.institutional_email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {suc.year_established}
                                        </div>
                                        {suc.year_converted_university && (
                                            <div className="text-sm text-gray-500">
                                                Univ:{" "}
                                                {suc.year_converted_university}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                                        <Popper
                                            trigger={
                                                <button
                                                    className="text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md p-1"
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


                                                <div className="border-t border-gray-100 my-1"></div>

                                                {/* Forms Section */}
                                                <div className="px-2 py-1 text-xs font-medium text-gray-500">Forms</div>
                                                <button
                                                    onClick={() => handleView(suc, 'campuses')}
                                                    className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 focus:outline-none focus:bg-blue-50 transition-colors duration-150 group"
                                                    role="menuitem"
                                                >
                                                    <Building2 className="w-4 h-4 mr-3 text-blue-500 group-hover:text-blue-600" />
                                                    Campuses (Form A2)
                                                </button>
                                                <button
                                                    onClick={() => handleView(suc, 'programs')}
                                                    className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-purple-50 focus:outline-none focus:bg-purple-50 transition-colors duration-150 group"
                                                    role="menuitem"
                                                >
                                                    <BookOpen className="w-4 h-4 mr-3 text-purple-500 group-hover:text-purple-600" />
                                                    Curricular Programs (Form B)
                                                </button>
                                                <button
                                                    onClick={() => handleView(suc, 'formE1')}
                                                    className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-indigo-50 focus:outline-none focus:bg-indigo-50 transition-colors duration-150 group"
                                                    role="menuitem"
                                                >
                                                    <Users className="w-4 h-4 mr-3 text-indigo-500 group-hover:text-indigo-600" />
                                                    Manage Faculty (Form E1)
                                                </button>
                                                <button
                                                    onClick={() => handleView(suc, 'formE2')}
                                                    className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-teal-50 focus:outline-none focus:bg-teal-50 transition-colors duration-150 group"
                                                    role="menuitem"
                                                >
                                                    <FileText className="w-4 h-4 mr-3 text-teal-500 group-hover:text-teal-600" />
                                                    Manage Faculty (Form E2)
                                                </button>
                                                <button
                                                    onClick={() => handleView(suc, 'formGH')}
                                                    className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-amber-50 focus:outline-none focus:bg-amber-50 transition-colors duration-150 group"
                                                    role="menuitem"
                                                >
                                                    <FileText className="w-4 h-4 mr-3 text-amber-500 group-hover:text-amber-600" />
                                                    Financial Data (Form G-H)
                                                </button>

                                                <div className="border-t border-gray-100 my-1"></div>

                                                {/* Additional Data Section */}
                                                <div className="px-2 py-1 text-xs font-medium text-gray-500">Additional Data</div>
                                                <button
                                                    onClick={() => handleView(suc, 'research')}
                                                    className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 focus:outline-none focus:bg-blue-50 transition-colors duration-150 group"
                                                    role="menuitem"
                                                >
                                                    <BookOpen className="w-4 h-4 mr-3 text-blue-500 group-hover:text-blue-600" />
                                                    Manage Research
                                                </button>
                                                <button
                                                    onClick={() => handleView(suc, 'graduates')}
                                                    className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-emerald-50 focus:outline-none focus:bg-emerald-50 transition-colors duration-150 group"
                                                    role="menuitem"
                                                >
                                                    <GraduationCap className="w-4 h-4 mr-3 text-emerald-500 group-hover:text-emerald-600" />
                                                    View Graduates
                                                </button>

                                                <div className="border-t border-gray-100 my-1"></div>

                                                {/* Actions Section */}
                                                <div className="px-2 py-1 text-xs font-medium text-gray-500">Actions</div>
                                                {/* View Details Section */}
                                                <button
                                                    onClick={() => handleViewDetails(suc)}
                                                    className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition-colors duration-150 group"
                                                    role="menuitem"
                                                >
                                                    <GraduationCap className="w-4 h-4 mr-3 text-gray-500 group-hover:text-gray-600" />
                                                    View Details
                                                </button>
                                                <button
                                                    onClick={() => onEdit(suc)}
                                                    className="flex items-center w-full px-4 py-2 text-left text-sm text-green-700 hover:bg-green-50 focus:outline-none focus:bg-green-50 transition-colors duration-150 group"
                                                    role="menuitem"
                                                >
                                                    <Edit className="w-4 h-4 mr-3 text-green-700 group-hover:text-green-600" />
                                                    Edit Institution
                                                </button>
                                                <button
                                                    onClick={() => handleExportToFormA(suc)}
                                                    disabled={loading.exportFormA}
                                                    className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors duration-150 group disabled:opacity-50 disabled:cursor-not-allowed"
                                                    role="menuitem"
                                                >
                                                    <Download className="w-4 h-4 mr-3 text-gray-500 group-hover:text-gray-600" />
                                                    {loading.exportFormA ? "Exporting..." : "Export to Excel"}
                                                </button>
                                                <button
                                                    onClick={() => onDelete(suc.id)}
                                                    className="flex items-center w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50 focus:outline-none focus:bg-red-50 transition-colors duration-150 group"
                                                    role="menuitem"
                                                >
                                                    <Trash className="w-4 h-4 mr-3 text-red-700 group-hover:text-red-600" />
                                                    Delete Institution
                                                </button>
                                            </div>
                                        </Popper>
                                    </td>
                                </tr>
                            ))}
                            {currentData.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="px-6 py-12 text-center"
                                    >
                                        <div className="text-gray-500">
                                            <GraduationCap className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                            <p className="text-lg font-medium">
                                                No SUCs found
                                            </p>
                                            <p className="text-sm">
                                                Try adjusting your search terms or
                                                add a new SUC.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="m-2 flex justify-end">
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

            {/* Details Modal */}
            <SucDetailsView
                isOpen={isDetailsModalOpen}
                onClose={handleCloseDetailsModal}
                sucData={selectedSuc}
            />
        </>
    );
}

SucDataTable.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
                .isRequired,
            institution_name: PropTypes.string,
            hei_name: PropTypes.string,
            institution_uiid: PropTypes.string,
            hei_uiid: PropTypes.string,
            region: PropTypes.string,
            province: PropTypes.string,
            municipality: PropTypes.string,
            institutional_telephone: PropTypes.string,
            institutional_email: PropTypes.string,
            year_established: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
            head_name: PropTypes.string,
            head_title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            year_converted_university: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
        })
    ).isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    createLog: PropTypes.func,
    updateProgress: PropTypes.func,
};

export default SucDataTable;
