// src/components/InstitutionManagement/InfoCard.jsx
import React from "react";
import PropTypes from "prop-types";

const CHED_COLORS = {
    blue: "#0038A8",
    yellow: "#FCD116",
    red: "#CE1126",
};

const InfoCard = ({
    title,
    icon,
    children,
    borderColor = CHED_COLORS.blue,
}) => (
    <div
        className="bg-white shadow-md rounded-lg p-5 mb-4 border-t-4"
        style={{ borderColor }}
    >
        <div className="flex items-center mb-3">
            <div
                className="rounded-full p-2 mr-3"
                style={{ backgroundColor: `${borderColor}20` }}
            >
                {React.cloneElement(icon, { color: borderColor, size: 20 })}
            </div>
            <h3
                className="text-base font-semibold"
                style={{ color: borderColor }}
            >
                {title}
            </h3>
        </div>
        <div className="pl-2">{children}</div>
    </div>
);

InfoCard.propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired,
    borderColor: PropTypes.string,
};

export default InfoCard;
