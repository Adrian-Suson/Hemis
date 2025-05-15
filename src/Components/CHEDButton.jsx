// Refined secondary variant without the red corner accent
import PropTypes from "prop-types";

/**
 * A button component inspired by the Commission on Higher Education (CHED) logo colors.
 * Features animations and styling based on the CHED color palette.
 */
const CHEDButton = ({
    children,
    onClick,
    icon: Icon,
    variant = "primary",
    size = "md",
    disabled = false,
    fullWidth = false,
    className = "",
    ...props
}) => {
    // Base styles for all variants
    const baseStyles = {
        container:
            "relative group flex items-center justify-center font-medium rounded-md focus:outline-none transition-all duration-200 overflow-hidden",
        icon: "flex items-center justify-center relative z-10",
        text: "relative z-10",
    };

    // Size variations
    const sizeStyles = {
        sm: "px-3 py-1.5 text-xs space-x-1.5",
        md: "px-4 py-2 text-sm space-x-2",
        lg: "px-5 py-3 text-base space-x-3",
    };

    // Icon size based on button size
    const iconSizes = {
        sm: "w-2.5 h-2.5",
        md: "w-3.5 h-3.5",
        lg: "w-4 h-4",
    };

    // Icon container size based on button size
    const iconContainerSizes = {
        sm: "p-0.5",
        md: "p-1",
        lg: "p-1.5",
    };

    // Variant styles (primary and secondary inspired by CHED logo)
    const variants = {
        // Sunburst animation variant (blue background with animated rays)
        primary: {
            base: "bg-[#0038A8] text-white shadow-sm hover:shadow-md focus:ring-2 focus:ring-[#0038A8] focus:ring-offset-2",
            disabled: "bg-gray-400 text-white shadow-none",
            iconContainer: "bg-[#FCD116] rounded-full text-[#0038A8]",
            effects: true,
        },
        // Sunshine burst variant - like sun rays bursting from inside
        secondary: {
            base: "bg-white border-2 border-[#0038A8] text-[#0038A8] hover:border-[#002d85] focus:ring-2 focus:ring-[#0038A8] focus:ring-offset-1",
            disabled: "bg-gray-100 border-gray-300 text-gray-400",
            iconContainer: "bg-[#FCD116] rounded-full text-[#0038A8]",
            effects: true,
        },
    };

    // Combine classes based on props
    const containerClasses = [
        baseStyles.container,
        sizeStyles[size],
        disabled ? variants[variant].disabled : variants[variant].base,
        fullWidth ? "w-full" : "w-auto",
        className,
    ].join(" ");

    // Icon container classes
    const iconContainerClasses = [
        variants[variant].iconContainer,
        iconContainerSizes[size],
    ].join(" ");

    // Icon classes
    const iconClasses = iconSizes[size];

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={containerClasses}
            {...props}
        >
            {/* Sunburst Animation Effect (Primary Variant) */}
            {variant === "primary" && !disabled && (
                <>
                    {/* Animated sun rays */}
                    <div className="absolute inset-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="h-full w-16 bg-gradient-to-b from-[#FCD116]/40 via-transparent to-transparent rotate-12 transform translate-x-6 group-hover:translate-x-32 transition-transform duration-1000"></div>
                        <div className="h-full w-8 bg-gradient-to-b from-[#FCD116]/30 via-transparent to-transparent -rotate-12 transform -translate-x-6 group-hover:translate-x-32 transition-transform duration-700 delay-100"></div>
                    </div>

                    {/* Red accent line */}
                    <div className="absolute bottom-0 left-0 h-1.5 w-full bg-[#CD0000] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </>
            )}

            {/* Sunshine Burst Animation (Secondary Variant) - Without Red Corner */}
            {variant === "secondary" && !disabled && (
                <>
                    {/* Yellow dot that expands */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-0 h-0 rounded-full bg-[#FCD116]/20 transform scale-0 group-hover:scale-100 group-hover:w-full group-hover:h-full transition-all duration-500 ease-out"></div>
                    </div>

                    {/* Animated sun rays */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {/* Generate 8 rays around the button */}
                        {[...Array(8)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-1 bg-[#FCD116]/30 transform origin-bottom transition-all duration-700"
                                style={{
                                    height: "0%",
                                    rotate: `${i * 45}deg`,
                                    transitionDelay: `${i * 50}ms`,
                                }}
                            ></div>
                        ))}

                        {/* Use CSS to extend the rays on hover */}
                        <style>{`
                            .group:hover div[style*="rotate"] {
                                height: 150%;
                            }
                        `}</style>
                    </div>

                    {/* Subtle red glow at the bottom - alternative to the corner triangle */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#CD0000]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                </>
            )}

            {/* Icon with special effect for secondary */}
            {Icon && (
                <div
                    className={`${iconContainerClasses} ${
                        variant === "secondary" && !disabled
                            ? "relative transition-transform duration-300 group-hover:scale-110 group-hover:shadow-[0_0_10px_rgba(252,209,22,0.6)]"
                            : ""
                    }`}
                >
                    <Icon className={iconClasses} />

                    {/* Pulse ring for secondary */}
                    {variant === "secondary" && !disabled && (
                        <div className="absolute inset-0 rounded-full border-2 border-[#FCD116]/0 group-hover:border-[#FCD116]/40 transform scale-100 group-hover:scale-150 opacity-0 group-hover:opacity-100 transition-all duration-1000"></div>
                    )}
                </div>
            )}

            {/* Button Text */}
            <span className={baseStyles.text}>{children}</span>
        </button>
    );
};

CHEDButton.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    icon: PropTypes.elementType,
    variant: PropTypes.oneOf(["primary", "secondary"]),
    size: PropTypes.oneOf(["sm", "md", "lg"]),
    disabled: PropTypes.bool,
    fullWidth: PropTypes.bool,
    className: PropTypes.string,
};

export default CHEDButton;
