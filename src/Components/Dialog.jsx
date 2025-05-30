import { X } from "lucide-react";
import PropTypes from 'prop-types';

function Dialog({
    isOpen,
    onClose,
    title,
    subtitle,
    icon: Icon,
    children,
    footer,
    showCloseButton = true,
    // Overlay styling
    overlayClassName = "fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center min-h-full w-full z-50 p-4 sm:p-6",
    // Container styling
    containerClassName = "relative w-full",
    // Modal styling
    modalClassName = "bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20",
    // Header styling
    headerClassName = "bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl p-4 sm:p-6 text-white",
    headerContentClassName = "flex justify-between items-center",
    // Icon styling
    iconContainerClassName = "h-10 w-10 sm:h-12 sm:w-12 bg-white/20 rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0",
    iconClassName = "w-5 h-5 sm:w-6 sm:h-6",
    // Title styling
    titleContainerClassName = "min-w-0 flex-1",
    titleClassName = "text-lg sm:text-xl font-bold truncate",
    subtitleClassName = "text-blue-100 text-sm hidden sm:block",
    // Close button styling
    closeButtonClassName = "text-white/80 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 rounded-lg p-1.5 sm:p-2 transition-all duration-200 flex-shrink-0",
    closeIconClassName = "w-5 h-5 sm:w-6 sm:h-6",
    // Content styling
    contentClassName = "p-4 sm:p-6",
    // Footer styling
    footerClassName = "mt-6 sm:mt-8 flex flex-col sm:flex-row justify-end gap-3 pt-4 sm:pt-6 border-t border-gray-200",
    // Style variants (predefined themes)
    variant = "default", // default, success, warning, danger, dark, minimal
    // Size variants
    size = "default" // xs, sm, default, lg, xl, full
}) {
    if (!isOpen) return null;

    // Predefined variants
    const variants = {
        default: {
            header: "bg-gradient-to-r from-blue-600 to-blue-700 text-white",
            modal: "bg-white/90 backdrop-blur-md",
            iconContainer: "bg-white/20",
            subtitle: "text-blue-100",
            closeButton: "text-white/80 hover:text-white hover:bg-white/10"
        },
        success: {
            header: "bg-gradient-to-r from-green-600 to-green-700 text-white",
            modal: "bg-white/90 backdrop-blur-md",
            iconContainer: "bg-white/20",
            subtitle: "text-green-100",
            closeButton: "text-white/80 hover:text-white hover:bg-white/10"
        },
        warning: {
            header: "bg-gradient-to-r from-amber-600 to-amber-700 text-white",
            modal: "bg-white/90 backdrop-blur-md",
            iconContainer: "bg-white/20",
            subtitle: "text-amber-100",
            closeButton: "text-white/80 hover:text-white hover:bg-white/10"
        },
        danger: {
            header: "bg-gradient-to-r from-red-600 to-red-700 text-white",
            modal: "bg-white/90 backdrop-blur-md",
            iconContainer: "bg-white/20",
            subtitle: "text-red-100",
            closeButton: "text-white/80 hover:text-white hover:bg-white/10"
        },
        dark: {
            header: "bg-gradient-to-r from-gray-800 to-gray-900 text-white",
            modal: "bg-gray-900/95 backdrop-blur-md text-white",
            iconContainer: "bg-white/10",
            subtitle: "text-gray-300",
            closeButton: "text-gray-300 hover:text-white hover:bg-white/10"
        },
        minimal: {
            header: "bg-white border-b border-gray-200 text-gray-900",
            modal: "bg-white",
            iconContainer: "bg-gray-100",
            subtitle: "text-gray-600",
            closeButton: "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
        }
    };

    // Size variants
    const sizes = {
        xs: "max-w-sm",
        sm: "max-w-md",
        default: "max-w-2xl",
        lg: "max-w-4xl",
        xl: "max-w-6xl",
        full: "max-w-full mx-4"
    };

    // Get variant styles
    const variantStyles = variants[variant] || variants.default;
    const sizeClass = sizes[size] || sizes.default;

    // Helper function to merge classes
    const mergeClasses = (defaultClasses, customClasses, variantClass = "") => {
        if (customClasses !== defaultClasses) {
            // Custom classes provided, use them
            return customClasses;
        }
        // Use default with variant override
        return variantClass ? `${defaultClasses.replace(/bg-gradient-to-r from-\w+-\d+ to-\w+-\d+|bg-\w+\/\d+|text-\w+|bg-\w+-\d+/, '')} ${variantClass}`.trim() : defaultClasses;
    };

    return (
        <div className={overlayClassName}>
            <div className={`${containerClassName} ${sizeClass}`}>
                <div className={mergeClasses(modalClassName, modalClassName, variantStyles.modal)} style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                    {/* Modal Header */}
                    <div className={mergeClasses(headerClassName, headerClassName, variantStyles.header)}>
                        <div className={headerContentClassName}>
                            <div className="flex items-center min-w-0 flex-1 mr-4">
                                {Icon && (
                                    <div className={mergeClasses(iconContainerClassName, iconContainerClassName, variantStyles.iconContainer)}>
                                        <Icon className={iconClassName} />
                                    </div>
                                )}
                                <div className={titleContainerClassName}>
                                    <h3 className={titleClassName}>{title}</h3>
                                    {subtitle && (
                                        <p className={mergeClasses(subtitleClassName, subtitleClassName, variantStyles.subtitle)}>{subtitle}</p>
                                    )}
                                </div>
                            </div>
                            {showCloseButton && (
                                <button
                                    onClick={onClose}
                                    className={mergeClasses(closeButtonClassName, closeButtonClassName, variantStyles.closeButton)}
                                >
                                    <X className={closeIconClassName} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Modal Content */}
                    <div className={contentClassName}>
                        {children}
                    </div>

                    {/* Modal Footer */}
                    {footer && (
                        <div className={footerClassName}>
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

Dialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    icon: PropTypes.elementType,
    children: PropTypes.node,
    footer: PropTypes.node,
    maxWidth: PropTypes.string,
    showCloseButton: PropTypes.bool,
    overlayClassName: PropTypes.string,
    containerClassName: PropTypes.string,
    modalClassName: PropTypes.string,
    headerClassName: PropTypes.string,
    headerContentClassName: PropTypes.string,
    iconContainerClassName: PropTypes.string,
    iconClassName: PropTypes.string,
    titleContainerClassName: PropTypes.string,
    titleClassName: PropTypes.string,
    subtitleClassName: PropTypes.string,
    closeButtonClassName: PropTypes.string,
    closeIconClassName: PropTypes.string,
    contentClassName: PropTypes.string,
    footerClassName: PropTypes.string,
    variant: PropTypes.oneOf(['default', 'success', 'warning', 'danger', 'dark', 'minimal']),
    size: PropTypes.oneOf(['xs', 'sm', 'default', 'lg', 'xl', 'full'])
};

Dialog.defaultProps = {
    maxWidth: "max-w-5xl",
    showCloseButton: true,
    overlayClassName: "fixed inset-0 bg-black/20 backdrop-blur-sm overflow-y-auto h-full w-full z-50 p-4 sm:p-6",
    containerClassName: "relative mx-auto w-full",
    modalClassName: "bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20",
    headerClassName: "bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl p-4 sm:p-6 text-white",
    headerContentClassName: "flex justify-between items-center",
    iconContainerClassName: "h-10 w-10 sm:h-12 sm:w-12 bg-white/20 rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0",
    iconClassName: "w-5 h-5 sm:w-6 sm:h-6",
    titleContainerClassName: "min-w-0 flex-1",
    titleClassName: "text-lg sm:text-xl font-bold truncate",
    subtitleClassName: "text-blue-100 text-sm hidden sm:block",
    closeButtonClassName: "text-white/80 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 rounded-lg p-1.5 sm:p-2 transition-all duration-200 flex-shrink-0",
    closeIconClassName: "w-5 h-5 sm:w-6 sm:h-6",
    contentClassName: "p-4 sm:p-6",
    footerClassName: "mt-6 sm:mt-8 flex flex-col sm:flex-row justify-end gap-3 pt-4 sm:pt-6 border-t border-gray-200",
    variant: "default",
    size: "default"
};

export default Dialog;