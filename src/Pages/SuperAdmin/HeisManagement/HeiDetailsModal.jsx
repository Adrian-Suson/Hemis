import PropTypes from 'prop-types';
import { Building2, Mail, Info } from 'lucide-react';
import Dialog from '../../../Components/Dialog';

function HeiDetailsModal({ isOpen, onClose, heiData }) {
    if (!isOpen || !heiData) return null;

    const getTypeColor = (type) => {
        switch (type) {
            case 'SUC':
                return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300';
            case 'LUC':
                return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300';
            case 'Private':
                return 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300';
            default:
                return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300';
        }
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose} title="HEI Details">
            <div className="p-4">
                <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                        <Building2 className="w-6 h-6 text-blue-600" />
                        <h3 className="text-xl font-semibold text-gray-900">
                            {heiData.name}
                        </h3>
                    </div>
                    <p className="text-gray-600 text-sm">UIID: {heiData.uiid}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Type</p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getTypeColor(heiData.type)}`}>
                                {heiData.type}
                            </span>
                        </div>
                        {heiData.email && (
                            <div>
                                <p className="text-sm font-medium text-gray-500">Email</p>
                                <p className="text-sm text-gray-800 flex items-center"><Mail className="w-4 h-4 mr-1" /> {heiData.email}</p>
                            </div>
                        )}
                    </div>

                    {heiData.description && (
                        <div>
                            <p className="text-sm font-medium text-gray-500">Description</p>
                            <p className="text-sm text-gray-800">{heiData.description}</p>
                        </div>
                    )}

                    <div className="pt-4 border-t border-gray-200 mt-4">
                        <p className="text-xs text-gray-500 flex items-center">
                            <Info className="w-3 h-3 mr-1" />
                            Created At: {heiData.created_at ? new Date(heiData.created_at).toLocaleDateString() : 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center">
                            <Info className="w-3 h-3 mr-1" />
                            Last Updated: {heiData.updated_at ? new Date(heiData.updated_at).toLocaleDateString() : 'N/A'}
                        </p>
                    </div>
                </div>
            </div>
        </Dialog>
    );
}

HeiDetailsModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    heiData: PropTypes.shape({
        name: PropTypes.string.isRequired,
        uiid: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        email: PropTypes.string,
        description: PropTypes.string,
        created_at: PropTypes.string,
        updated_at: PropTypes.string
    }).isRequired
};

export default HeiDetailsModal;
