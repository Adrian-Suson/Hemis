import { GraduationCap, Phone, Mail, MoreHorizontal, Building2, BookOpen } from "lucide-react";
import PropTypes from "prop-types";
import { useState } from "react";
import Popper from "../../../../Components/Popper";
import { useNavigate } from "react-router-dom";
import SucDetailsView from "./SucDetailsView"; // Adjust path as needed

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

function SucDataTable({ data, onEdit, onDelete }) {
    const navigate = useNavigate();
    const [selectedSuc, setSelectedSuc] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    const handleViewCampuses = (suc) => {
        const SucDetailId = suc.id || suc.id;
        if (SucDetailId) {
            navigate(`/super-admin/institutions/suc/campuses/${SucDetailId}`, {
                state: { heiName: suc.hei_name || suc.institution_name },
            });
        } else {
            console.error("No SUC ID found for campuses:", suc);
        }
    };

    const handleViewPrograms = (suc) => {
        const SucDetailId = suc.id || suc.id;
        if (SucDetailId) {
            navigate(`/super-admin/institutions/suc/programs/${SucDetailId}`, {
                state: { heiName: suc.hei_name || suc.institution_name },
            });
        } else {
            console.error("No SUC ID found for programs:", suc);
        }
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

    return (
        <>
            <div className="overflow-x-auto overflow-y-visible">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Institution
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Location
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Leadership
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Contact
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Established
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((suc) => (
                            <tr key={suc.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {suc.institution_name ||
                                                    suc.hei_name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {suc.institution_uiid ||
                                                    suc.hei_uiid}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-900">
                                        {suc.municipality}, {suc.province}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {suc.region}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">
                                        {suc.head_name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {getHeadTitle(suc.head_title)}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-900 flex items-center">
                                        <Phone className="w-3 h-3 mr-1" />
                                        {suc.institutional_telephone}
                                    </div>
                                    <div className="text-sm text-gray-500 flex items-center">
                                        <Mail className="w-3 h-3 mr-1" />
                                        {suc.institutional_email}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
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
                                            <button
                                                onClick={() =>
                                                    handleViewCampuses(suc)
                                                }
                                                className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 focus:outline-none focus:bg-blue-50 transition-colors duration-150 group"
                                                role="menuitem"
                                            >
                                                <Building2 className="w-4 h-4 mr-3 text-blue-500 group-hover:text-blue-600" />
                                                View Campuses
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleViewPrograms(suc)
                                                }
                                                className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-purple-50 focus:outline-none focus:bg-purple-50 transition-colors duration-150 group"
                                                role="menuitem"
                                            >
                                                <BookOpen className="w-4 h-4 mr-3 text-purple-500 group-hover:text-purple-600" />
                                                View Programs
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleViewDetails(suc)
                                                }
                                                className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition-colors duration-150 group"
                                                role="menuitem"
                                            >
                                                <GraduationCap className="w-4 h-4 mr-3 text-gray-500 group-hover:text-gray-600" />
                                                View Details
                                            </button>
                                            <div className="border-t border-gray-100 my-1"></div>
                                            <button
                                                onClick={() => onEdit(suc)}
                                                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition-colors duration-150"
                                                role="menuitem"
                                            >
                                                Edit Institution
                                            </button>
                                            <button
                                                onClick={() => onDelete(suc.id)}
                                                className="block w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-100 focus:outline-none focus:bg-red-100 transition-colors duration-150"
                                                role="menuitem"
                                            >
                                                Delete Institution
                                            </button>
                                        </div>
                                    </Popper>
                                </td>
                            </tr>
                        ))}
                        {data.length === 0 && (
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
};

export default SucDataTable;
