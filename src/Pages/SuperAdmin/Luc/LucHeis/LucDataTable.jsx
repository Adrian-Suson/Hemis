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

function LucDataTable({ data, onEdit, onDelete }) {
    const [selectedLuc, setSelectedLuc] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const navigate = useNavigate();

    useEffect(() => {
        setCurrentPage(1);
        console.log(data)
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

    // Add handleView function similar to SucDataTable
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
                                        <div className="text-sm text-gray-900 flex items-center">
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

                                                <div className="border-t border-gray-100 my-1"></div>

                                                {/* Forms Section (commented out for now, add if LUC forms exist) */}
                                                {/* <div className="px-2 py-1 text-xs font-medium text-gray-500">
                                                    Forms
                                                </div>
                                                <button
                                                    onClick={() => {}}
                                                    className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 focus:outline-none focus:bg-blue-50 transition-colors duration-150 group"
                                                    role="menuitem"
                                                >
                                                    <Building2 className="w-4 h-4 mr-3 text-blue-500 group-hover:text-blue-600" />
                                                    Campuses (Form A2)
                                                </button> */}

                                                {/* <div className="border-t border-gray-100 my-1"></div> */}

                                                {/* Additional Data Section (commented out for now) */}
                                                {/* <div className="px-2 py-1 text-xs font-medium text-gray-500">
                                                    Additional Data
                                                </div>
                                                <button
                                                    onClick={() => {}}
                                                    className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 focus:outline-none focus:bg-blue-50 transition-colors duration-150 group"
                                                    role="menuitem"
                                                >
                                                    <BookOpen className="w-4 h-4 mr-3 text-blue-500 group-hover:text-blue-600" />
                                                    Manage Research
                                                </button> */}
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
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
                .isRequired,
            institution_name: PropTypes.string,
            institution_uiid: PropTypes.string,
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
            head_title: PropTypes.string,
            year_converted_university: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
        })
    ).isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default LucDataTable;
