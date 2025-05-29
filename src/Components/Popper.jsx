import { useState, useEffect, useRef } from "react";
import { createPopper } from "@popperjs/core";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";

function Popper({
    trigger,
    children,
    placement = "bottom-end",
    offset = [0, 8],
    className = "",
    onToggle = null,
    closeOnItemClick = true,
    disabled = false,
    usePortal = true // New prop to control portal usage
}) {
    const [isVisible, setIsVisible] = useState(false);
    const triggerRef = useRef(null);
    const popperRef = useRef(null);
    const popperInstanceRef = useRef(null);

    // Handle click outside to close popper
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                isVisible &&
                popperRef.current &&
                !popperRef.current.contains(event.target) &&
                triggerRef.current &&
                !triggerRef.current.contains(event.target)
            ) {
                setIsVisible(false);
            }
        };

        const handleEscapeKey = (event) => {
            if (event.key === "Escape" && isVisible) {
                setIsVisible(false);
            }
        };

        if (isVisible) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleEscapeKey);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscapeKey);
        };
    }, [isVisible]);

    // Initialize/destroy Popper.js instance
    useEffect(() => {
        if (isVisible && triggerRef.current && popperRef.current) {
            popperInstanceRef.current = createPopper(
                triggerRef.current,
                popperRef.current,
                {
                    placement,
                    strategy: usePortal ? 'fixed' : 'absolute', // Use fixed strategy for portals
                    modifiers: [
                        {
                            name: "offset",
                            options: {
                                offset,
                            },
                        },
                        {
                            name: "preventOverflow",
                            options: {
                                boundary: "viewport",
                                padding: 8,
                            },
                        },
                        {
                            name: "flip",
                            options: {
                                fallbackPlacements: ["top-end", "bottom-start", "top-start"],
                            },
                        },
                    ],
                }
            );
        }

        return () => {
            if (popperInstanceRef.current) {
                popperInstanceRef.current.destroy();
                popperInstanceRef.current = null;
            }
        };
    }, [isVisible, placement, offset, usePortal]);

    // Call onToggle callback when visibility changes
    useEffect(() => {
        if (onToggle) {
            onToggle(isVisible);
        }
    }, [isVisible, onToggle]);

    const togglePopper = () => {
        if (!disabled) {
            setIsVisible(!isVisible);
        }
    };

    const closePopper = () => {
        setIsVisible(false);
    };

    // Handle clicks on popper content
    const handlePopperClick = (event) => {
        if (closeOnItemClick) {
            // Check if clicked element or its parent has data-no-close attribute
            const clickedElement = event.target.closest('[data-no-close]');
            if (!clickedElement) {
                setIsVisible(false);
            }
        }
    };

    // Render popper content
    const popperContent = isVisible && (
        <div
            ref={popperRef}
            className={`z-[9999] transition-opacity duration-200 ease-in-out ${className}`}
            onClick={handlePopperClick}
            role="menu"
            aria-orientation="vertical"
            style={{
                position: usePortal ? 'fixed' : 'absolute',
                zIndex: 9999
            }}
        >
            {typeof children === "function"
                ? children({ isOpen: isVisible, toggle: togglePopper, close: closePopper })
                : children
            }
        </div>
    );

    return (
        <div className="relative inline-block">
            {/* Trigger Element */}
            <div
                ref={triggerRef}
                onClick={togglePopper}
                className={disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
            >
                {typeof trigger === "function" ? trigger({ isOpen: isVisible, toggle: togglePopper, close: closePopper }) : trigger}
            </div>

            {/* Popper Content - Use portal for better positioning */}
            {usePortal ? (
                typeof document !== 'undefined' && createPortal(popperContent, document.body)
            ) : (
                popperContent
            )}
        </div>
    );
}

Popper.propTypes = {
    trigger: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
    placement: PropTypes.oneOf([
        "auto", "auto-start", "auto-end",
        "top", "top-start", "top-end",
        "bottom", "bottom-start", "bottom-end",
        "right", "right-start", "right-end",
        "left", "left-start", "left-end"
    ]),
    offset: PropTypes.arrayOf(PropTypes.number),
    className: PropTypes.string,
    onToggle: PropTypes.func,
    closeOnItemClick: PropTypes.bool,
    disabled: PropTypes.bool,
    usePortal: PropTypes.bool,
};

export default Popper;
