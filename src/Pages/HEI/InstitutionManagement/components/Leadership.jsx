// src/components/InstitutionManagement/Leadership.jsx
import PropTypes from "prop-types";
import { User, IdCard, School } from "lucide-react";
import InfoCard from "./InfoCard";
import InfoItem from "./InfoItem";

const CHED_COLORS = {
    red: "#CE1126",
};

const Leadership = ({ institution }) => (
    <InfoCard title="Leadership" icon={<User />} borderColor={CHED_COLORS.red}>
        <div className="space-y-3">
            <InfoItem
                icon={<User className="w-3.5 h-3.5 text-gray-400" />}
                label="Head Name"
                value={institution.head_name || "Not Available"}
            />
            <InfoItem
                icon={<IdCard className="w-3.5 h-3.5 text-gray-400" />}
                label="Head Title"
                value={institution.head_title || "Not Available"}
            />
            <InfoItem
                icon={<School className="w-3.5 h-3.5 text-gray-400" />}
                label="Head Education"
                value={institution.head_education || "Not Available"}
            />
        </div>
    </InfoCard>
);

Leadership.propTypes = {
    institution: PropTypes.object.isRequired,
};

export default Leadership;