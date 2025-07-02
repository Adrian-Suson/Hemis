import PropTypes from 'prop-types';
import { Building2, Info, MapPin } from 'lucide-react';
import Dialog from '../../../Components/Dialog';

function HeiDetailsModal({ isOpen, onClose, hei }) {
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

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString();
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid Date';
        }
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title="HEI Details"
            subtitle="View detailed information about the Higher Education Institution"
            icon={Building2}
            size="sm"
        >
            <div className="p-6">
                {!hei ? (
                    <div className="text-center text-gray-500 py-4">
                        No HEI data available
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center space-x-3">
                            <Building2 className="w-6 h-6 text-blue-600" />
                            <h3 className="text-xl font-semibold text-gray-900">
                                {hei.name || 'Unnamed Institution'}
                            </h3>
                        </div>
                        <p className="text-gray-600 text-sm">UIID: {hei.uiid || 'N/A'}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Type</p>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getTypeColor(hei.type)}`}>
                                    {hei.type || 'Unknown'}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Cluster</p>
                                <p className="text-sm text-gray-800 flex items-center">
                                    <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                                    {hei.cluster?.name || "Not assigned"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Status</p>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${hei.status === 'open' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
                                    {hei.status ? hei.status.charAt(0).toUpperCase() + hei.status.slice(1) : 'N/A'}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Campus Type</p>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-300">
                                    {hei.campus_type ? hei.campus_type : 'N/A'}
                                </span>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        Created At
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 flex items-center">
                                        <Info className="w-3 h-3 mr-1 text-gray-400" />
                                        {formatDate(hei.created_at)}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        Last Updated
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 flex items-center">
                                        <Info className="w-3 h-3 mr-1 text-gray-400" />
                                        {formatDate(hei.updated_at)}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                )}
            </div>
        </Dialog>
    );
}

HeiDetailsModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    hei: PropTypes.shape({
        name: PropTypes.string,
        uiid: PropTypes.string,
        type: PropTypes.string,
        created_at: PropTypes.string,
        updated_at: PropTypes.string,
        cluster: PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string,
            regionID: PropTypes.number
        }),
        status: PropTypes.string,
        campus_type: PropTypes.string
    })
};

export default HeiDetailsModal;
