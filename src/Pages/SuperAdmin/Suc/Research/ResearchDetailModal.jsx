import { X } from "lucide-react";
import PropTypes from "prop-types";

function ResearchDetailModal({ isOpen, onClose, researchData }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Research Details</h3>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="mt-2">
                            {researchData && (
                                <div className="space-y-4">
                                    {/* Add your research details here */}
                                    <pre className="text-sm text-gray-500">
                                        {JSON.stringify(researchData, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

ResearchDetailModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    researchData: PropTypes.shape({
        title: PropTypes.string,
        authors: PropTypes.string,
        year: PropTypes.number,
        type: PropTypes.string,
        status: PropTypes.string,
        doi: PropTypes.string,
        journal: PropTypes.string,
        volume: PropTypes.string,
        issue: PropTypes.string,
        pages: PropTypes.string,
        publisher: PropTypes.string,
        abstract: PropTypes.string,
        keywords: PropTypes.string,
        url: PropTypes.string
    })
};

export default ResearchDetailModal;
