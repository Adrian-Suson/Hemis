import {
    GraduationCap,
    MapPin,
    Phone,
    Mail,
    Calendar,
    User,
    Building2,
    Globe,
    Award,
} from "lucide-react";
import PropTypes from "prop-types";
import Dialog from "../../../../Components/Dialog";

// Mapping for head titles
const HEAD_TITLE_MAPPING = {
    1: "President",
    2: "Chancellor",
    3: "Executive Director",
    4: "Dean",
    5: "Rector",
    6: "Head",
    7: "Administrator",
    8: "Principal",
    9: "Managing Director",
    10: "Director",
    11: "Chair",
    12: "Others",
    99: "Not known or not indicated",
};

function SucDetailsView({ isOpen, onClose, sucData }) {
    if (!sucData) return null;

    const formatYear = (year) => {
        if (!year) return "Not specified";
        return year.toString();
    };

    const formatContact = (contact) => {
        return contact || "Not provided";
    };

    const getHeadTitle = (title) => {
        const numericTitle = Number(title);
        return HEAD_TITLE_MAPPING[numericTitle] || "Unknown Title";
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title={sucData.institution_name || sucData.hei_name || "Institution Details"}
            subtitle={`${sucData.institution_uiid || sucData.hei_uiid || "ID not available"}`}
            icon={GraduationCap}
            className="max-w-3xl mx-auto"
            variant="default"
            size="lg"

        >
            <div className="space-y-4 p-4">
                {/* Institution Overview */}
                <div className="bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-100 rounded-xl p-4 border border-blue-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-blue-500 rounded-lg shadow-sm">
                            <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">Institution Overview</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="bg-white/70 rounded-lg p-3 border border-blue-100">
                            <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">Full Name</span>
                            <p className="text-gray-900 mt-1 font-medium">
                                {sucData.institution_name || sucData.hei_name || "Not specified"}
                            </p>
                        </div>
                        <div className="bg-white/70 rounded-lg p-3 border border-blue-100">
                            <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">Institution ID</span>
                            <p className="text-gray-900 mt-1 font-mono text-xs bg-blue-100 px-2 py-1 rounded-md inline-block">
                                {sucData.institution_uiid || sucData.hei_uiid || "Not specified"}
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
                                <span className="font-medium text-gray-600">Region:</span>
                                <span className="text-gray-900 font-medium">{sucData.region || "Not specified"}</span>
                            </div>
                            <div className="flex justify-between items-center bg-white/70 rounded-lg p-2 border border-emerald-100">
                                <span className="font-medium text-gray-600">Province:</span>
                                <span className="text-gray-900 font-medium">{sucData.province || "Not specified"}</span>
                            </div>
                            <div className="flex justify-between items-center bg-white/70 rounded-lg p-2 border border-emerald-100">
                                <span className="font-medium text-gray-600">Municipality:</span>
                                <span className="text-gray-900 font-medium">{sucData.municipality || "Not specified"}</span>
                            </div>
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
                                <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">Head of Institution</span>
                                <p className="text-gray-900 mt-1 font-semibold text-base">
                                    {sucData.head_name || "Not specified"}
                                </p>
                            </div>
                            <div className="bg-white/70 rounded-lg p-3 border border-purple-100">
                                <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">Position/Title</span>
                                <p className="text-gray-900 mt-1 font-medium">
                                    {getHeadTitle(sucData.head_title)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact & Historical Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Contact Information */}
                    <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 rounded-xl p-4 border border-amber-200/60 shadow-sm">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-amber-500 rounded-lg shadow-sm">
                                <Phone className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">Contact</h3>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center space-x-3 bg-white/70 rounded-lg p-3 border border-amber-100">
                                <Phone className="w-4 h-4 text-amber-600 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <span className="font-medium text-gray-600 text-xs uppercase tracking-wide block">Telephone</span>
                                    <p className="text-gray-900 font-medium truncate">
                                        {formatContact(sucData.institutional_telephone)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 bg-white/70 rounded-lg p-3 border border-amber-100">
                                <Mail className="w-4 h-4 text-amber-600 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <span className="font-medium text-gray-600 text-xs uppercase tracking-wide block">Email</span>
                                    <p className="text-gray-900 font-medium truncate text-xs">
                                        {formatContact(sucData.institutional_email)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Historical Information */}
                    <div className="bg-gradient-to-br from-rose-50 via-pink-50 to-red-100 rounded-xl p-4 border border-rose-200/60 shadow-sm">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-rose-500 rounded-lg shadow-sm">
                                <Calendar className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">Timeline</h3>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center space-x-3 bg-white/70 rounded-lg p-3 border border-rose-100">
                                <Award className="w-4 h-4 text-rose-600" />
                                <div>
                                    <span className="font-medium text-gray-600 text-xs uppercase tracking-wide block">Established</span>
                                    <p className="text-gray-900 font-semibold text-base">
                                        {formatYear(sucData.year_established)}
                                    </p>
                                </div>
                            </div>
                            {sucData.year_converted_university && (
                                <div className="flex items-center space-x-3 bg-white/70 rounded-lg p-3 border border-rose-100">
                                    <GraduationCap className="w-4 h-4 text-rose-600" />
                                    <div>
                                        <span className="font-medium text-gray-600 text-xs uppercase tracking-wide block">University Status</span>
                                        <p className="text-gray-900 font-semibold text-base">
                                            {formatYear(sucData.year_converted_university)}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Status & Completeness Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Institution Status */}
                    <div className="bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 rounded-xl p-4 border border-slate-200/60 shadow-sm">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-slate-600 rounded-lg shadow-sm">
                                <Globe className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">Status</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="bg-white/70 rounded-lg p-3 border border-slate-100 text-center">
                                <span className="font-medium text-gray-600 text-xs uppercase tracking-wide block mb-1">Type</span>
                                <p className="text-gray-900 font-semibold">SUC</p>
                            </div>
                            <div className="bg-white/70 rounded-lg p-3 border border-slate-100 text-center">
                                <span className="font-medium text-gray-600 text-xs uppercase tracking-wide block mb-1">Classification</span>
                                <p className="text-gray-900 font-semibold">
                                    {sucData.year_converted_university ? "University" : "College"}
                                </p>
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
                                    sucData.institution_name || sucData.hei_name,
                                    sucData.region,
                                    sucData.province,
                                    sucData.municipality,
                                    sucData.head_name,
                                    sucData.institutional_telephone,
                                    sucData.institutional_email,
                                    sucData.year_established
                                ].filter(Boolean).length}/8 Complete
                            </div>
                        </div>
                        <div className="bg-white/70 rounded-lg p-3 border border-cyan-100">
                            <div className="flex space-x-1">
                                {[
                                    sucData.institution_name || sucData.hei_name,
                                    sucData.region,
                                    sucData.province,
                                    sucData.municipality,
                                    sucData.head_name,
                                    sucData.institutional_telephone,
                                    sucData.institutional_email,
                                    sucData.year_established
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
            </div>
        </Dialog>
    );
}

SucDetailsView.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    sucData: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        institution_name: PropTypes.string,
        hei_name: PropTypes.string,
        institution_uiid: PropTypes.string,
        hei_uiid: PropTypes.string,
        region: PropTypes.string,
        province: PropTypes.string,
        municipality: PropTypes.string,
        institutional_telephone: PropTypes.string,
        institutional_email: PropTypes.string,
        year_established: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        head_name: PropTypes.string,
        head_title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        year_converted_university: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
};

export default SucDetailsView;
