// src/components/InstitutionManagement/Badge.jsx
import PropTypes from "prop-types";

const Badge = ({ children, color }) => (
    <span
        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
        style={{
            backgroundColor: `${color}20`,
            color: color,
            border: `1px solid ${color}`,
        }}
    >
        {children}
    </span>
);

Badge.propTypes = {
    children: PropTypes.node.isRequired,
    color: PropTypes.string.isRequired,
};

export default Badge;
