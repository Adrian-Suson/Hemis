import { BookOpen, MoreHorizontal, Eye, Edit, Trash } from "lucide-react";
import Popper from "../../../../../Components/Popper";
import PropTypes from "prop-types";

function ResearchTb1Table({ data, onView, onEdit, onDelete }) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200/30">
                <thead className="bg-gradient-to-r from-gray-50/80 to-blue-50/50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Article Information
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Authors & Keywords
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Publication Details
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
                                        <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-200 text-purple-700">
                                            <BookOpen className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {research.title_of_article}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {research.year_of_publication}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-sm text-gray-900">
                                    {research.authors}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {research.keywords}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-sm text-gray-900">
                                    {research.name_of_book_journal}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {research.vol_no_issue_no && `Vol. ${research.vol_no_issue_no}`}
                                    {research.no_of_pages && ` • ${research.no_of_pages} pages`}
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
                                        <BookOpen className="w-10 h-10 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        No research articles found
                                    </h3>
                                    <p className="text-gray-600">
                                        Get started by adding your first research article
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

ResearchTb1Table.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            title_of_article: PropTypes.string.isRequired,
            year_of_publication: PropTypes.number,
            authors: PropTypes.string.isRequired,
            keywords: PropTypes.string,
            name_of_book_journal: PropTypes.string.isRequired,
            vol_no_issue_no: PropTypes.string,
            no_of_pages: PropTypes.number
        })
    ).isRequired,
    onView: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
};

export default ResearchTb1Table;
