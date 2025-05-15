// src/components/InstitutionManagement/ActionButton.jsx
import React from "react";
import PropTypes from "prop-types";

const CHED_COLORS = {
    blue: "#0038A8",
    darkBlue: "#002776",
    yellow: "#FCD116",
    lightYellow: "#FFED99",
    red: "#CE1126",
};

const ActionButton = ({
    icon,
    label,
    onClick,
    loading,
    disabled,
    variant = "primary",
}) => {
    const getButtonStyle = () => {
        switch (variant) {
            case "primary":
                return {
                    bgColor: CHED_COLORS.blue,
                    hoverBgColor: CHED_COLORS.darkBlue,
                    textColor: "white",
                };
            case "secondary":
                return {
                    bgColor: "#FFF",
                    hoverBgColor: CHED_COLORS.lightYellow,
                    textColor: CHED_COLORS.blue,
                    borderColor: CHED_COLORS.blue,
                };
            case "warning":
                return {
                    bgColor: CHED_COLORS.red,
                    hoverBgColor: "#B10000",
                    textColor: "white",
                };
            default:
                return {
                    bgColor: CHED_COLORS.blue,
                    hoverBgColor: CHED_COLORS.darkBlue,
                    textColor: "white",
                };
        }
    };

    const style = getButtonStyle();

    return (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            className={`flex items-center justify-center w-full px-4 py-3 rounded-lg text-sm font-medium 
                transition-all duration-200 mb-3 border ${
                    disabled
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:shadow-md"
                }`}
            style={{
                backgroundColor: style.bgColor,
                color: style.textColor,
                borderColor: style.borderColor || style.bgColor,
            }}
        >
            {loading ? (
                <>
                    <svg
                        className="animate-spin h-4 w-4 mr-2"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                        />
                    </svg>
                    Processing...
                </>
            ) : (
                <>
                    {React.cloneElement(icon, { size: 18 })}
                    <span className="ml-2">{label}</span>
                </>
            )}
        </button>
    );
};

ActionButton.propTypes = {
    icon: PropTypes.node.isRequired,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
    variant: PropTypes.oneOf(["primary", "secondary", "warning"]),
};

ActionButton.defaultProps = {
    loading: false,
    disabled: false,
    variant: "primary",
};

export default ActionButton;
