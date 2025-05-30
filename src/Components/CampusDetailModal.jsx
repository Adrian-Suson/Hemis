import {
    Building2,
    MapPin,
    User,
    Calendar,
    Hash,
    Globe,
    ExternalLink
} from "lucide-react";
import Dialog from "./Dialog";

function CampusDetailModal({ isOpen, onClose, campus, onEdit }) {
    if (!campus) return null;

    const footer = (
        <>
            <button
                onClick={onClose}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
                Close
            </button>
            <button
                onClick={() => onEdit(campus)}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm hover:shadow-md transition-all duration-200"
            >
                Edit Campus
            </button>
        </>
    );

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title={campus.name}
            subtitle="Campus Details & Information"
            icon={Building2}
            footer={footer}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Left Column */}
                <div className="space-y-4 sm:space-y-6">
                    {/* Basic Information */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-5 rounded-xl border border-blue-100">
                        <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                            <Building2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                            Basic Information
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Campus Type</label>
                                    <span className={`inline-flex px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold rounded-full mt-1 ${
                                        campus.campus_type === 'MAIN'
                                        ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800'
                                        : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800'
                                    }`}>
                                        {campus.campus_type}
                                    </span>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Institutional Code</label>
                                    <p className="text-sm text-gray-900 font-mono bg-white/50 px-2 py-1 rounded mt-1 break-all">
                                        {campus.institutional_code || 'Not specified'}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Year Started</label>
                                    <p className="text-sm text-gray-900 flex items-center mt-1">
                                        <Calendar className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                                        <span className="truncate">{campus.year_first_operation || 'Not specified'}</span>
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Land Area</label>
                                    <p className="text-sm text-gray-900 mt-1 truncate">
                                        {campus.land_area_hectares ? `${campus.land_area_hectares} hectares` : 'Not specified'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Details */}
                    <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-4 sm:p-5 rounded-xl border border-gray-100">
                        <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                            <Hash className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-600" />
                            Additional Details
                        </h4>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Distance from Main</label>
                                    <p className="text-sm text-gray-900 mt-1 truncate">
                                        {campus.distance_from_main_km ? `${campus.distance_from_main_km} km` : 'Not specified'}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Autonomous Status</label>
                                    <p className="text-sm text-gray-900 mt-1 truncate">
                                        {campus.autonomous_status || 'Not specified'}
                                    </p>
                                </div>
                            </div>
                            {campus.former_campus_name && (
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Former Name</label>
                                    <p className="text-sm text-gray-900 italic mt-1 break-words">
                                        {campus.former_campus_name}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4 sm:space-y-6">
                    {/* Location */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 sm:p-5 rounded-xl border border-green-100">
                        <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" />
                            Location & Geography
                        </h4>
                        <div className="space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Municipality</label>
                                    <p className="text-sm text-gray-900 mt-1 break-words">{campus.municipality}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Province</label>
                                    <p className="text-sm text-gray-900 mt-1 break-words">{campus.province}</p>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Region</label>
                                <p className="text-sm text-gray-900 mt-1 break-words">{campus.region}</p>
                            </div>
                            {campus.latitude && campus.longitude && (
                                <div className="bg-white/60 p-3 rounded-lg">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Coordinates</label>
                                    <div className="grid grid-cols-2 gap-3 text-sm text-gray-900 mb-3">
                                        <div className="truncate font-mono text-xs">Lat: {campus.latitude.toFixed(6)}</div>
                                        <div className="truncate font-mono text-xs">Lng: {campus.longitude.toFixed(6)}</div>
                                    </div>
                                    <a
                                        href={`https://maps.google.com/?q=${campus.latitude},${campus.longitude}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium group transition-colors duration-200"
                                    >
                                        <Globe className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200 flex-shrink-0" />
                                        <span className="truncate">View on Google Maps</span>
                                        <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0" />
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Leadership */}
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 sm:p-5 rounded-xl border border-purple-100">
                        <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                            <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-600" />
                            Campus Leadership
                        </h4>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Campus Head</label>
                                <p className="text-sm font-semibold text-gray-900 mt-1 break-words">
                                    {campus.head_name || 'Not assigned'}
                                </p>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Position</label>
                                <p className="text-sm text-gray-900 mt-1 break-words">
                                    {campus.head_title || 'No title specified'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    );
}

export default CampusDetailModal;
