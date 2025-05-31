import {
    Building2,
    MapPin,
    User,
    Calendar,
    Hash,
    Globe,
    ExternalLink,
    Ruler,
    Award,
} from "lucide-react";
import PropTypes from "prop-types";
import Dialog from "../../../../Components/Dialog";

function CampusDetailsView({ isOpen, onClose, campusData }) {
    if (!campusData) return null;

    const formatValue = (value) => {
        return value || "Not specified";
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title={campusData.name || "Campus Details"}
            subtitle="Campus Details & Information"
            icon={Building2}
            variant="default"
            size="lg"
        >
            <div className="space-y-4 p-4">
                {/* Campus Overview */}
                <div className="bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-100 rounded-xl p-4 border border-blue-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-blue-500 rounded-lg shadow-sm">
                            <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">Campus Overview</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="bg-white/70 rounded-lg p-3 border border-blue-100">
                            <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">Campus Type</span>
                            <div className="mt-1">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    campusData.campus_type === "MAIN"
                                        ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800"
                                        : "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800"
                                }`}>
                                    {campusData.campus_type || "Not specified"}
                                </span>
                            </div>
                        </div>
                        <div className="bg-white/70 rounded-lg p-3 border border-blue-100">
                            <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">Institutional Code</span>
                            <p className="text-gray-900 mt-1 font-mono text-xs bg-blue-100 px-2 py-1 rounded-md inline-block">
                                {formatValue(campusData.institutional_code)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Location & Leadership Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Location Information */}
                    <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 rounded-xl p-4 border border-emerald-200/60 shadow-sm">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-emerald-500 rounded-lg shadow-sm">
                                <MapPin className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">Location</h3>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center bg-white/70 rounded-lg p-2 border border-emerald-100">
                                <span className="font-medium text-gray-600">Province/Municipality:</span>
                                <span className="text-gray-900 font-medium text-right ml-2 break-words">
                                    {formatValue(campusData.province_municipality)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center bg-white/70 rounded-lg p-2 border border-emerald-100">
                                <span className="font-medium text-gray-600">Region:</span>
                                <span className="text-gray-900 font-medium text-right ml-2 break-words">
                                    {formatValue(campusData.region)}
                                </span>
                            </div>
                            {campusData.latitude && campusData.longitude && (
                                <div className="bg-white/70 rounded-lg p-3 border border-emerald-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">Coordinates</span>
                                        <a
                                            href={`https://maps.google.com/?q=${campusData.latitude},${campusData.longitude}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center text-emerald-600 hover:text-emerald-800 text-xs font-medium transition-colors duration-200"
                                        >
                                            <Globe className="w-3 h-3 mr-1" />
                                            View Map
                                            <ExternalLink className="w-3 h-3 ml-1" />
                                        </a>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-900 font-mono">
                                        <div>Lat: {campusData.latitude.toFixed(6)}</div>
                                        <div>Lng: {campusData.longitude.toFixed(6)}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Leadership Information */}
                    <div className="bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-100 rounded-xl p-4 border border-purple-200/60 shadow-sm">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-purple-500 rounded-lg shadow-sm">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">Leadership</h3>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="bg-white/70 rounded-lg p-3 border border-purple-100">
                                <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">Campus Head</span>
                                <p className="text-gray-900 mt-1 font-semibold">
                                    {formatValue(campusData.head_full_name)}
                                </p>
                            </div>
                            <div className="bg-white/70 rounded-lg p-3 border border-purple-100">
                                <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">Position/Title</span>
                                <p className="text-gray-900 mt-1 font-medium">
                                    {formatValue(campusData.position_title)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Operations & Additional Info Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Operations Information */}
                    <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 rounded-xl p-4 border border-amber-200/60 shadow-sm">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-amber-500 rounded-lg shadow-sm">
                                <Calendar className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">Operations</h3>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center space-x-3 bg-white/70 rounded-lg p-3 border border-amber-100">
                                <Award className="w-4 h-4 text-amber-600" />
                                <div>
                                    <span className="font-medium text-gray-600 text-xs uppercase tracking-wide block">Year Started</span>
                                    <p className="text-gray-900 font-semibold">
                                        {formatValue(campusData.year_first_operation)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 bg-white/70 rounded-lg p-3 border border-amber-100">
                                <Ruler className="w-4 h-4 text-amber-600" />
                                <div>
                                    <span className="font-medium text-gray-600 text-xs uppercase tracking-wide block">Land Area</span>
                                    <p className="text-gray-900 font-semibold">
                                        {campusData.land_area_hectares
                                            ? `${campusData.land_area_hectares} hectares`
                                            : "Not specified"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Details */}
                    <div className="bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 rounded-xl p-4 border border-slate-200/60 shadow-sm">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-slate-600 rounded-lg shadow-sm">
                                <Hash className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">Additional Info</h3>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="bg-white/70 rounded-lg p-3 border border-slate-100">
                                <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">Distance from Main</span>
                                <p className="text-gray-900 mt-1 font-medium">
                                    {campusData.distance_from_main
                                        ? `${campusData.distance_from_main} km`
                                        : "Not specified"}
                                </p>
                            </div>
                            <div className="bg-white/70 rounded-lg p-3 border border-slate-100">
                                <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">Autonomous Status</span>
                                <p className="text-gray-900 mt-1 font-medium">
                                    {formatValue(campusData.autonomous_code)}
                                </p>
                            </div>
                            {campusData.former_campus_name && (
                                <div className="bg-white/70 rounded-lg p-3 border border-slate-100">
                                    <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">Former Name</span>
                                    <p className="text-gray-900 mt-1 font-medium italic break-words">
                                        {campusData.former_campus_name}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Data Completeness */}
                <div className="bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-100 rounded-xl p-4 border border-cyan-200/60 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-cyan-500 rounded-lg shadow-sm">
                                <Globe className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">Data Quality</h3>
                        </div>
                        <div className="text-xs font-medium text-cyan-700 bg-cyan-100 px-2 py-1 rounded-full">
                            {[
                                campusData.name,
                                campusData.campus_type,
                                campusData.province_municipality,
                                campusData.region,
                                campusData.head_full_name,
                                campusData.position_title,
                                campusData.year_first_operation,
                                campusData.institutional_code
                            ].filter(Boolean).length}/8 Complete
                        </div>
                    </div>
                    <div className="bg-white/70 rounded-lg p-3 border border-cyan-100">
                        <div className="flex space-x-1">
                            {[
                                campusData.name,
                                campusData.campus_type,
                                campusData.province_municipality,
                                campusData.region,
                                campusData.head_full_name,
                                campusData.position_title,
                                campusData.year_first_operation,
                                campusData.institutional_code
                            ].map((field, index) => (
                                <div
                                    key={index}
                                    className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                                        field ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-sm' : 'bg-gray-300'
                                    }`}
                                    title={field ? 'Complete' : 'Missing'}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    );
}

CampusDetailsView.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    campusData: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        name: PropTypes.string,
        campus_type: PropTypes.string,
        institutional_code: PropTypes.string,
        province_municipality: PropTypes.string,
        region: PropTypes.string,
        latitude: PropTypes.number,
        longitude: PropTypes.number,
        head_full_name: PropTypes.string,
        position_title: PropTypes.string,
        year_first_operation: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        land_area_hectares: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        distance_from_main: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        autonomous_code: PropTypes.string,
        former_campus_name: PropTypes.string,
    })
};

export default CampusDetailsView;
