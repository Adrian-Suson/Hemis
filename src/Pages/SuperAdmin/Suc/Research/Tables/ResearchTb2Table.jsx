import { Presentation, MoreHorizontal, Eye, Edit, Trash } from "lucide-react";
import Popper from "../../../../../Components/Popper";
import PropTypes from "prop-types";

function ResearchTb2Table({ data, onView, onEdit, onDelete }) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200/30">
                <thead className="bg-gradient-to-r from-gray-50/80 to-blue-50/50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Research Paper
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Researchers & Keywords
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Conference Details
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/30">
                    {data.map((research, index) => (
                        <tr
                            key={research.id}
                            className={`hover:bg-blue-50/30 transition-all duration-200 ${
                                index % 2 === 0 ? "bg-white/30" : "bg-gray-50/30"
                            }`}
                        >
                            <td className="px-6 py-4">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                        <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700">
                                            <Presentation className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {research.title_of_research_paper}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {research.type_of_conference}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-sm text-gray-900">
                                    {research.researchers}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {research.keywords}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-sm text-gray-900">
                                    {research.conference_title}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {research.conference_venue} • {research.conference_date}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {research.conference_organizer}
                                </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                                <Popper
                                    trigger={
                                        <button
                                            className="text-gray-600 hover:text-gray-900 hover:bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded-lg p-2 transition-all duration-200"
                                            title="More Actions"
                                        >
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                    }
                                    placement="bottom-end"
                                    className="w-40 bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-lg"
                                >
                                    <div className="py-2">
                                        <button
                                            onClick={() => onView(research)}
                                            className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 focus:outline-none focus:bg-blue-50 transition-colors duration-150"
                                        >
                                            <Eye className="w-4 h-4 mr-3 text-blue-500" />
                                            View Details
                                        </button>
                                        <button
                                            onClick={() => onEdit(research)}
                                            className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-green-50 focus:outline-none focus:bg-green-50 transition-colors duration-150"
                                        >
                                            <Edit className="w-4 h-4 mr-3 text-green-500" />
                                            Edit Research
                                        </button>
                                        <button
                                            onClick={() => onDelete(research.id)}
                                            className="flex items-center w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50 focus:outline-none focus:bg-red-50 transition-colors duration-150"
                                        >
                                            <Trash className="w-4 h-4 mr-3 text-red-500" />
                                            Delete Research
                                        </button>
                                    </div>
                                </Popper>
                            </td>
                        </tr>
                    ))}
                    {data.length === 0 && (
                        <tr>
                            <td colSpan="4" className="px-6 py-12 text-center">
                                <div className="text-gray-500">
                                    <div className="mx-auto h-20 w-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                                        <Presentation className="w-10 h-10 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        No conference papers found
                                    </h3>
                                    <p className="text-gray-600">
                                        Get started by adding your first conference paper
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

ResearchTb2Table.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            title_of_research_paper: PropTypes.string.isRequired,
            type_of_conference: PropTypes.string.isRequired,
            researchers: PropTypes.string.isRequired,
            keywords: PropTypes.string,
            conference_title: PropTypes.string.isRequired,
            conference_venue: PropTypes.string.isRequired,
            conference_date: PropTypes.string.isRequired,
            conference_organizer: PropTypes.string.isRequired
        })
    ).isRequired,
    onView: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
};

export default ResearchTb2Table;