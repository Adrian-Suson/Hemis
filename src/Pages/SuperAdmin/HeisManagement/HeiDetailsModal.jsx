import PropTypes from 'prop-types';
import { Building2, Mail, Info, MapPin } from 'lucide-react';
import Dialog from '../../../Components/Dialog';

function HeiDetailsModal({ isOpen, onClose, hei, clusters }) {
    if (!isOpen || !hei) return null;

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

    const cluster = clusters.find(c => c.id === hei.cluster_id);

    return (
        <Dialog isOpen={isOpen} onClose={onClose} title="HEI Details">
            <div className="p-4">
                <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                        <Building2 className="w-6 h-6 text-blue-600" />
                        <h3 className="text-xl font-semibold text-gray-900">
                            {hei.name}
                        </h3>
                    </div>
                    <p className="text-gray-600 text-sm">UIID: {hei.uiid}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Type</p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getTypeColor(hei.type)}`}>
                                {hei.type}
                            </span>
                        </div>
                        {hei.email && (
                            <div>
                                <p className="text-sm font-medium text-gray-500">Email</p>
                                <p className="text-sm text-gray-800 flex items-center"><Mail className="w-4 h-4 mr-1" /> {hei.email}</p>
                            </div>
                        )}
                    </div>

                    {hei.description && (
                        <div>
                            <p className="text-sm font-medium text-gray-500">Description</p>
                            <p className="text-sm text-gray-800">{hei.description}</p>
                        </div>
                    )}

                    <div className="pt-4 border-t border-gray-200 mt-4">
                        <p className="text-xs text-gray-500 flex items-center">
                            <Info className="w-3 h-3 mr-1" />
                            Created At: {hei.created_at ? new Date(hei.created_at).toLocaleDateString() : 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center">
                            <Info className="w-3 h-3 mr-1" />
                            Last Updated: {hei.updated_at ? new Date(hei.updated_at).toLocaleDateString() : 'N/A'}
                        </p>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                            <div>
                                <dt className="text-sm font-medium text-gray-500">
                                    Cluster
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 flex items-center">
                                    <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                                    {cluster ? cluster.name : "Not assigned"}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm font-medium text-gray-500">
                                    Created At
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {new Date(hei.created_at).toLocaleDateString()}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm font-medium text-gray-500">
                                    Last Updated
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {new Date(hei.updated_at).toLocaleDateString()}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </Dialog>
    );
}

HeiDetailsModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    hei: PropTypes.shape({
        name: PropTypes.string.isRequired,
        uiid: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        email: PropTypes.string,
        description: PropTypes.string,
        created_at: PropTypes.string,
        updated_at: PropTypes.string,
        cluster_id: PropTypes.string
    }).isRequired,
    clusters: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    })).isRequired
};

export default HeiDetailsModal;
