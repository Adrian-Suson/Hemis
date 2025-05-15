// src/components/InstitutionManagement/InfoItem.jsx
import PropTypes from "prop-types";

const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-start mb-3">
        <div className="text-gray-500 mt-0.5 mr-3">{icon}</div>
        <div>
            <p className="text-sm text-gray-700">
                <span className="font-medium">{label}</span>
                <br />
                <span className="text-gray-900">{value}</span>
            </p>
        </div>
    </div>
);

InfoItem.propTypes = {
    icon: PropTypes.node.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.node.isRequired,
};

export default InfoItem;