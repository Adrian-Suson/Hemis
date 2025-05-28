import { Edit, Trash2, GraduationCap, Phone, Mail } from "lucide-react";
import PropTypes from "prop-types";

function SucDataTable({ data, onEdit, onDelete }) {
    return (
        <div className="overflow-x-auto">
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
                                            {suc.institution_name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {suc.institution_uiid}
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
                                    {suc.head_title}
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
                                        Univ: {suc.year_converted_university}
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={() => onEdit(suc)}
                                    className="text-blue-600 hover:text-blue-900 mr-3"
                                    title="Edit SUC"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => onDelete(suc.id)}
                                    className="text-red-600 hover:text-red-900"
                                    title="Delete SUC"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    {data.length === 0 && (
                        <tr>
                            <td colSpan="6" className="px-6 py-12 text-center">
                                <div className="text-gray-500">
                                    <GraduationCap className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                    <p className="text-lg font-medium">
                                        No SUCs found
                                    </p>
                                    <p className="text-sm">
                                        Try adjusting your search terms or add a
                                        new SUC.
                                    </p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

SucDataTable.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
                .isRequired,
            institution_uiid: PropTypes.string,
            institution_name: PropTypes.string,
            region: PropTypes.string,
            province: PropTypes.string,
            municipality: PropTypes.string,
            address_street: PropTypes.string,
            postal_code: PropTypes.string,
            institutional_telephone: PropTypes.string,
            institutional_fax: PropTypes.string,
            head_telephone: PropTypes.string,
            institutional_email: PropTypes.string,
            institutional_website: PropTypes.string,
            year_established: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
            report_year: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
            head_name: PropTypes.string,
            head_title: PropTypes.string,
            head_education: PropTypes.string,
            sec_registration: PropTypes.string,
            year_granted_approved: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
            year_converted_college: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
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
