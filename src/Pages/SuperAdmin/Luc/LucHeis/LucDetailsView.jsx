import {
    School,
    MapPin,
    Phone,
    Mail,
    Calendar,
    User,
    Award,
    PhoneCall,
    Printer,
    Globe2,
    BookOpen,
    FileCheck,
    GraduationCap,
} from "lucide-react";
import PropTypes from "prop-types";
import Dialog from "../../../../Components/Dialog";
import { HEAD_TITLE_MAPPING, EDUCATIONAL_LEVEL_MAPPING } from '../../../../utils/LucFormAConstants';

function LucDetailsView({ isOpen, onClose, lucData }) {
    if (!lucData) return null;

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

    const getEducationLevel = (level) => {
        const numericLevel = Number(level);
        return EDUCATIONAL_LEVEL_MAPPING[numericLevel] || "Not specified";
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title={lucData.institution_name || lucData.hei?.name || "Institution Details"}
            subtitle={`${lucData.institution_uiid || lucData.hei_uiid || "ID not available"}`}
            icon={School}
            className="max-w-4xl mx-auto"
            variant="default"
            size="lg"
        >
            <div className="space-y-4 p-4">
                {/* Institution Overview */}
                <div className="bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-100 rounded-xl p-4 border border-blue-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-blue-500 rounded-lg shadow-sm">
                            <School className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">Institution Overview</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="bg-white/70 rounded-lg p-3 border border-blue-100">
                            <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">Institution Name</span>
                            <p className="text-gray-900 mt-1 font-medium">
                                {lucData.institution_name || lucData.hei?.name || "Not specified"}
                            </p>
                        </div>
                        <div className="bg-white/70 rounded-lg p-3 border border-blue-100">
                            <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">Institution Identifier</span>
                            <p className="text-gray-900 mt-1 font-mono text-xs bg-blue-100 px-2 py-1 rounded-md inline-block">
                                {lucData.institution_uiid || lucData.hei_uiid || "Not specified"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Location Information */}
                <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 rounded-xl p-4 border border-emerald-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-emerald-500 rounded-lg shadow-sm">
                            <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">Geographic Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="bg-white/70 rounded-lg p-3 border border-emerald-100">
                            <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">Administrative Region</span>
                            <p className="text-gray-900 mt-1 font-medium">{lucData.region || "Not specified"}</p>
                        </div>
                        <div className="bg-white/70 rounded-lg p-3 border border-emerald-100">
                            <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">Province</span>
                            <p className="text-gray-900 mt-1 font-medium">{lucData.province || "Not specified"}</p>
                        </div>
                        <div className="bg-white/70 rounded-lg p-3 border border-emerald-100">
                            <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">City/Municipality</span>
                            <p className="text-gray-900 mt-1 font-medium">{lucData.municipality || "Not specified"}</p>
                        </div>
                        <div className="bg-white/70 rounded-lg p-3 border border-emerald-100">
                            <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">Street Address</span>
                            <p className="text-gray-900 mt-1 font-medium">{lucData.address_street || "Not specified"}</p>
                        </div>
                        <div className="bg-white/70 rounded-lg p-3 border border-emerald-100">
                            <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">Postal Code</span>
                            <p className="text-gray-900 mt-1 font-medium">{lucData.postal_code || "Not specified"}</p>
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 rounded-xl p-4 border border-amber-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-amber-500 rounded-lg shadow-sm">
                            <Phone className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">Institutional Contact</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="bg-white/70 rounded-lg p-3 border border-amber-100">
                            <div className="flex items-center space-x-2">
                                <PhoneCall className="w-4 h-4 text-amber-600" />
                                <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">Main Telephone</span>
                            </div>
                            <p className="text-gray-900 mt-1 font-medium">{formatContact(lucData.institutional_telephone)}</p>
                        </div>
                        <div className="bg-white/70 rounded-lg p-3 border border-amber-100">
                            <div className="flex items-center space-x-2">
                                <Printer className="w-4 h-4 text-amber-600" />
                                <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">Facsimile Number</span>
                            </div>
                            <p className="text-gray-900 mt-1 font-medium">{formatContact(lucData.institutional_fax)}</p>
                        </div>
                        <div className="bg-white/70 rounded-lg p-3 border border-amber-100">
                            <div className="flex items-center space-x-2">
                                <Mail className="w-4 h-4 text-amber-600" />
                                <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">Electronic Mail</span>
                            </div>
                            <p className="text-gray-900 mt-1 font-medium">{formatContact(lucData.institutional_email)}</p>
                        </div>
                        <div className="bg-white/70 rounded-lg p-3 border border-amber-100">
                            <div className="flex items-center space-x-2">
                                <Globe2 className="w-4 h-4 text-amber-600" />
                                <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">Web Address</span>
                            </div>
                            <p className="text-gray-900 mt-1 font-medium">{formatContact(lucData.institutional_website)}</p>
                        </div>
                    </div>
                </div>

                {/* Leadership Information */}
                <div className="bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-100 rounded-xl p-4 border border-purple-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-purple-500 rounded-lg shadow-sm">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">Executive Leadership</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="bg-white/70 rounded-lg p-3 border border-purple-100">
                            <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">Chief Executive</span>
                            <p className="text-gray-900 mt-1 font-semibold text-base">{lucData.head_name || "Not specified"}</p>
                        </div>
                        <div className="bg-white/70 rounded-lg p-3 border border-purple-100">
                            <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">Executive Position</span>
                            <p className="text-gray-900 mt-1 font-medium">{getHeadTitle(lucData.head_title)}</p>
                        </div>
                        <div className="bg-white/70 rounded-lg p-3 border border-purple-100">
                            <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">Academic Qualifications</span>
                            <p className="text-gray-900 mt-1 font-medium">{getEducationLevel(lucData.head_education)}</p>
                        </div>
                        <div className="bg-white/70 rounded-lg p-3 border border-purple-100">
                            <div className="flex items-center space-x-2">
                                <PhoneCall className="w-4 h-4 text-purple-600" />
                                <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">Executive Contact</span>
                            </div>
                            <p className="text-gray-900 mt-1 font-medium">{formatContact(lucData.head_telephone)}</p>
                        </div>
                    </div>
                </div>

                {/* Historical Information */}
                <div className="bg-gradient-to-br from-rose-50 via-pink-50 to-red-100 rounded-xl p-4 border border-rose-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-rose-500 rounded-lg shadow-sm">
                            <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">Institutional History</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="bg-white/70 rounded-lg p-3 border border-rose-100">
                            <div className="flex items-center space-x-2">
                                <Award className="w-4 h-4 text-rose-600" />
                                <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">Year of Establishment</span>
                            </div>
                            <p className="text-gray-900 mt-1 font-semibold text-base">{formatYear(lucData.year_established)}</p>
                        </div>
                        <div className="bg-white/70 rounded-lg p-3 border border-rose-100">
                            <div className="flex items-center space-x-2">
                                <FileCheck className="w-4 h-4 text-rose-600" />
                                <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">SEC Registration Number</span>
                            </div>
                            <p className="text-gray-900 mt-1 font-medium">{lucData.sec_registration || "Not specified"}</p>
                        </div>
                        <div className="bg-white/70 rounded-lg p-3 border border-rose-100">
                            <div className="flex items-center space-x-2">
                                <BookOpen className="w-4 h-4 text-rose-600" />
                                <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">Year of Approval</span>
                            </div>
                            <p className="text-gray-900 mt-1 font-medium">{formatYear(lucData.year_granted_approved)}</p>
                        </div>
                        <div className="bg-white/70 rounded-lg p-3 border border-rose-100">
                            <div className="flex items-center space-x-2">
                                <School className="w-4 h-4 text-rose-600" />
                                <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">College Status Year</span>
                            </div>
                            <p className="text-gray-900 mt-1 font-medium">{formatYear(lucData.year_converted_college)}</p>
                        </div>
                        <div className="bg-white/70 rounded-lg p-3 border border-rose-100">
                            <div className="flex items-center space-x-2">
                                <GraduationCap className="w-4 h-4 text-rose-600" />
                                <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">University Status Year</span>
                            </div>
                            <p className="text-gray-900 mt-1 font-medium">{formatYear(lucData.year_converted_university)}</p>
                        </div>
                        <div className="bg-white/70 rounded-lg p-3 border border-rose-100">
                            <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-rose-600" />
                                <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">Reporting Period</span>
                            </div>
                            <p className="text-gray-900 mt-1 font-medium">{formatYear(lucData.report_year)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    );
}

LucDetailsView.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    lucData: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        institution_name: PropTypes.string,
        hei: PropTypes.object,
        institution_uiid: PropTypes.string,
        hei_uiid: PropTypes.string,
        region: PropTypes.string,
        province: PropTypes.string,
        municipality: PropTypes.string,
        address_street: PropTypes.string,
        postal_code: PropTypes.string,
        institutional_telephone: PropTypes.string,
        institutional_fax: PropTypes.string,
        head_telephone: PropTypes.string,
        institutional_email: PropTypes.string,
        institutional_website: PropTypes.string,
        year_established: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        report_year: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        head_name: PropTypes.string,
        head_title: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        head_education: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        sec_registration: PropTypes.string,
        year_granted_approved: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        year_converted_college: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        year_converted_university: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
    }),
};

export default LucDetailsView; 