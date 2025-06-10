import {
    FileText,
    Users,
    Calendar,
    Award,
    BookOpen,
    Search,
    Info,
} from "lucide-react";
import PropTypes from "prop-types";
import Dialog from "../../../../Components/Dialog";

function ResearchDetailModal({ isOpen, onClose, researchData }) {
    if (!researchData) return null;

    // Safe value conversion function
    const safeValue = (value, defaultValue = "Not specified") => {
        if (value === null || value === undefined || value === '') {
            return defaultValue;
        }
        if (typeof value === 'object') {
            return String(value) || defaultValue;
        }
        return String(value);
    };

    // Get research type color
    const getResearchTypeColor = (type) => {
        switch (type?.toLowerCase()) {
            case 'publications':
                return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300';
            case 'conferences':
                return 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300';
            case 'other_outputs':
                return 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border-emerald-300';
            case 'citations':
                return 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border-amber-300';
            case 'awards':
                return 'bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-800 border-indigo-300';
            case 'extension':
                return 'bg-gradient-to-r from-rose-100 to-rose-200 text-rose-800 border-rose-300';
            default:
                return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300';
        }
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title="Research Details"
            subtitle="Research Information and Statistics"
            icon={FileText}
            variant="view"
            size="xl"
        >
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {/* Basic Research Information */}
                <div className="bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-100 rounded-xl p-4 border border-blue-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-blue-500 rounded-lg shadow-sm">
                            <FileText className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">Research Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <p className="text-sm text-gray-900 font-semibold">
                                {safeValue(researchData.title_of_article || researchData.title_of_research_paper || researchData.inventions || researchData.title)}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Type</label>
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getResearchTypeColor(researchData.type)}`}>
                                {safeValue(researchData.type)}
                            </span>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Authors/Researchers</label>
                            <p className="text-sm text-gray-900">
                                {safeValue(researchData.authors || researchData.researchers || researchData.citing_authors || researchData.name_of_researcher)}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Year</label>
                            <p className="text-sm text-gray-900">
                                {safeValue(researchData.year_of_publication || researchData.conference_date || researchData.date_of_issue || researchData.year_published_accepted_presented_received || researchData.citation_year_received)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Publication Details */}
                {(researchData.title_of_article || researchData.name_of_book_journal) && (
                    <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 rounded-xl p-4 border border-emerald-200/60 shadow-sm">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-emerald-500 rounded-lg shadow-sm">
                                <BookOpen className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">Publication Details</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Journal/Book</label>
                                <p className="text-sm text-gray-900">{safeValue(researchData.name_of_book_journal)}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Volume/Issue</label>
                                <p className="text-sm text-gray-900">{safeValue(researchData.vol_no_issue_no)}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Pages</label>
                                <p className="text-sm text-gray-900">{safeValue(researchData.no_of_pages)}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Editors</label>
                                <p className="text-sm text-gray-900">{safeValue(researchData.editors)}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Conference Details */}
                {(researchData.conference_title || researchData.conference_venue) && (
                    <div className="bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-100 rounded-xl p-4 border border-purple-200/60 shadow-sm">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-purple-500 rounded-lg shadow-sm">
                                <Calendar className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">Conference Details</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Conference Title</label>
                                <p className="text-sm text-gray-900">{safeValue(researchData.conference_title)}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Venue</label>
                                <p className="text-sm text-gray-900">{safeValue(researchData.conference_venue)}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date</label>
                                <p className="text-sm text-gray-900">{safeValue(researchData.conference_date)}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Organizer</label>
                                <p className="text-sm text-gray-900">{safeValue(researchData.conference_organizer)}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Other Research Outputs */}
                {(researchData.inventions || researchData.patent_number) && (
                    <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 rounded-xl p-4 border border-amber-200/60 shadow-sm">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-amber-500 rounded-lg shadow-sm">
                                <Award className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">Other Research Outputs</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Invention</label>
                                <p className="text-sm text-gray-900">{safeValue(researchData.inventions)}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Patent Number</label>
                                <p className="text-sm text-gray-900">{safeValue(researchData.patent_number)}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date of Issue</label>
                                <p className="text-sm text-gray-900">{safeValue(researchData.date_of_issue)}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Commercial Product</label>
                                <p className="text-sm text-gray-900">{safeValue(researchData.name_of_commercial_product)}</p>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Utilization</label>
                                <div className="flex flex-wrap gap-2">
                                    {researchData.utilization_development && (
                                        <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-300">
                                            Development
                                        </span>
                                    )}
                                    {researchData.utilization_service && (
                                        <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-300">
                                            Service
                                        </span>
                                    )}
                                    {researchData.utilization_end_product && (
                                        <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 border border-purple-300">
                                            End Product
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Citations */}
                {(researchData.citing_authors || researchData.citing_article_title) && (
                    <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-100 rounded-xl p-4 border border-indigo-200/60 shadow-sm">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-indigo-500 rounded-lg shadow-sm">
                                <Search className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">Citation Details</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Citing Authors</label>
                                <p className="text-sm text-gray-900">{safeValue(researchData.citing_authors)}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Article Title</label>
                                <p className="text-sm text-gray-900">{safeValue(researchData.citing_article_title)}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Journal Title</label>
                                <p className="text-sm text-gray-900">{safeValue(researchData.journal_title)}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Volume/Issue/Page</label>
                                <p className="text-sm text-gray-900">{safeValue(researchData.vol_issue_page_no)}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Extension Activities */}
                {(researchData.title || researchData.duration_number_of_hours) && (
                    <div className="bg-gradient-to-br from-rose-50 via-pink-50 to-red-100 rounded-xl p-4 border border-rose-200/60 shadow-sm">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-rose-500 rounded-lg shadow-sm">
                                <Users className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">Extension Activities</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <p className="text-sm text-gray-900">{safeValue(researchData.title)}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Duration</label>
                                <p className="text-sm text-gray-900">{safeValue(researchData.duration_number_of_hours)} hours</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Number of Beneficiaries</label>
                                <p className="text-sm text-gray-900">{safeValue(researchData.number_of_trainees_beneficiaries)}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Agency/Body</label>
                                <p className="text-sm text-gray-900">{safeValue(researchData.citation_confering_agency_body)}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Additional Information */}
                <div className="bg-gradient-to-br from-gray-50 via-gray-50 to-slate-100 rounded-xl p-4 border border-gray-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-gray-600 rounded-lg shadow-sm">
                            <Info className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">Additional Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Keywords</label>
                            <p className="text-sm text-gray-900">{safeValue(researchData.keywords)}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Points</label>
                            <p className="text-sm text-gray-900">{safeValue(researchData.points || researchData.points_invention || researchData.points_commercial)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    );
}

ResearchDetailModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    researchData: PropTypes.shape({
        // Common fields
        type: PropTypes.string,
        keywords: PropTypes.string,
        points: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

        // Publication fields
        title_of_article: PropTypes.string,
        authors: PropTypes.string,
        name_of_book_journal: PropTypes.string,
        editors: PropTypes.string,
        vol_no_issue_no: PropTypes.string,
        no_of_pages: PropTypes.string,
        year_of_publication: PropTypes.string,

        // Conference fields
        title_of_research_paper: PropTypes.string,
        researchers: PropTypes.string,
        conference_title: PropTypes.string,
        conference_venue: PropTypes.string,
        conference_date: PropTypes.string,
        conference_organizer: PropTypes.string,
        type_of_conference: PropTypes.string,

        // Other outputs fields
        inventions: PropTypes.string,
        patent_number: PropTypes.string,
        date_of_issue: PropTypes.string,
        utilization_development: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
        utilization_service: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
        utilization_end_product: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
        name_of_commercial_product: PropTypes.string,
        points_invention: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        points_commercial: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

        // Citation fields
        citing_authors: PropTypes.string,
        citing_article_title: PropTypes.string,
        journal_title: PropTypes.string,
        vol_issue_page_no: PropTypes.string,
        city_year_published: PropTypes.string,
        publisher_name: PropTypes.string,

        // Extension fields
        title: PropTypes.string,
        duration_number_of_hours: PropTypes.string,
        number_of_trainees_beneficiaries: PropTypes.string,
        citation_title: PropTypes.string,
        citation_confering_agency_body: PropTypes.string,
        citation_year_received: PropTypes.string,

        // Additional fields
        name_of_researcher: PropTypes.string,
        year_published_accepted_presented_received: PropTypes.string
    })
};

export default ResearchDetailModal;
