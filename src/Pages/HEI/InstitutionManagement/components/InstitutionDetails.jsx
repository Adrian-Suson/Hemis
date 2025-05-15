// src/components/InstitutionManagement/InstitutionDetails.jsx
import PropTypes from "prop-types";
import { Phone, Mail, Globe, Calendar, School } from "lucide-react";
import InfoCard from "./InfoCard";
import InfoItem from "./InfoItem";

const CHED_COLORS = {
    blue: "#0038A8",
};

const InstitutionDetails = ({ institution, }) => (
    <InfoCard title="Institution Information" icon={<School />} borderColor={CHED_COLORS.blue}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">
                    Contact Information
                </h4>
                <div className="space-y-2">
                    <InfoItem
                        icon={<Phone className="w-3.5 h-3.5 text-gray-400" />}
                        label="Telephone"
                        value={institution.institutional_telephone || "Not Available"}
                    />
                    <InfoItem
                        icon={<Mail className="w-3.5 h-3.5 text-gray-400" />}
                        label="Email"
                        value={
                            institution.institutional_email ? (
                                <a
                                    href={`mailto:${institution.institutional_email}`}
                                    className="text-blue-600 hover:underline"
                                >
                                    {institution.institutional_email}
                                </a>
                            ) : (
                                "Not Available"
                            )
                        }
                    />
                    <InfoItem
                        icon={<Globe className="w-3.5 h-3.5 text-gray-400" />}
                        label="Website"
                        value={
                            institution.institutional_website ? (
                                <a
                                    href={
                                        institution.institutional_website.startsWith("http://") ||
                                        institution.institutional_website.startsWith("https://")
                                            ? institution.institutional_website
                                            : `http://${institution.institutional_website}`
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    {institution.institutional_website}
                                </a>
                            ) : (
                                "Not Available"
                            )
                        }
                    />
                </div>
            </div>
            <div>
                <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">
                    Institutional Details
                </h4>
                <div className="space-y-2">
                    <InfoItem
                        icon={<Calendar className="w-3.5 h-3.5 text-gray-400" />}
                        label="Year Established"
                        value={institution.year_established || "Not Available"}
                    />
                    <InfoItem
                        icon={<School className="w-3.5 h-3.5 text-gray-400" />}
                        label="College Conversion"
                        value={institution.year_converted_college || "Not Available"}
                    />
                    <InfoItem
                        icon={<School className="w-3.5 h-3.5 text-gray-400" />}
                        label="University Conversion"
                        value={institution.year_converted_university || "Not Available"}
                    />
                </div>
            </div>
        </div>
    </InfoCard>
);

InstitutionDetails.propTypes = {
    institution: PropTypes.object.isRequired,
    location: PropTypes.shape({
        region: PropTypes.object,
        province: PropTypes.object,
        municipality: PropTypes.object,
    }).isRequired,
};

export default InstitutionDetails;