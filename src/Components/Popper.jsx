import { useState, useEffect, useRef, useCallback } from "react";
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
    usePortal = true,
    smartPositioning = true // New prop for smart positioning
}) {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0, placement: placement });
    const triggerRef = useRef(null);
    const popperRef = useRef(null);
    const popperInstanceRef = useRef(null);

    const calculateSmartPosition = useCallback(() => {
        if (!triggerRef.current || !popperRef.current) return;

        const triggerRect = triggerRef.current.getBoundingClientRect();
        const popperRect = popperRef.current.getBoundingClientRect();
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight,
        };

        let top = triggerRect.bottom + offset[1];
        let left = triggerRect.right - popperRect.width;
        let newPlacement = placement;

        // Check if popper would overflow bottom of viewport
        if (top + popperRect.height > viewport.height - 10) {
            // Try placing above
            const topPlacement = triggerRect.top - popperRect.height - offset[1];
            if (topPlacement >= 10) {
                top = topPlacement;
                newPlacement = placement.replace('bottom', 'top');
            } else {
                // If neither top nor bottom works, center vertically within viewport
                top = Math.max(10, Math.min(viewport.height - popperRect.height - 10, triggerRect.top));
                newPlacement = 'middle-end';
            }
        }

        // Check if popper would overflow right side of viewport
        if (left + popperRect.width > viewport.width - 10) {
            // Align to left edge of trigger
            left = triggerRect.left;
            newPlacement = newPlacement.replace('end', 'start');
        }

        // Check if popper would overflow left side of viewport
        if (left < 10) {
            left = 10;
        }

        setPosition({ top, left, placement: newPlacement });
    }, [placement, offset]);

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

    // Initialize/destroy Popper.js instance or calculate smart position
    useEffect(() => {
        if (isVisible && triggerRef.current && popperRef.current) {
            if (smartPositioning) {
                calculateSmartPosition();
            } else {
                popperInstanceRef.current = createPopper(
                    triggerRef.current,
                    popperRef.current,
                    {
                        placement,
                        strategy: usePortal ? 'fixed' : 'absolute',
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
        }

        return () => {
            if (popperInstanceRef.current) {
                popperInstanceRef.current.destroy();
                popperInstanceRef.current = null;
            }
        };
    }, [isVisible, placement, offset, usePortal, smartPositioning, calculateSmartPosition]);

    // Handle window resize and scroll for smart positioning
    useEffect(() => {
        if (isVisible && smartPositioning) {
            const handleResize = () => calculateSmartPosition();
            const handleScroll = () => calculateSmartPosition();

            window.addEventListener('resize', handleResize);
            window.addEventListener('scroll', handleScroll, true);

            return () => {
                window.removeEventListener('resize', handleResize);
                window.removeEventListener('scroll', handleScroll, true);
            };
        }
    }, [isVisible, smartPositioning, calculateSmartPosition]);

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
            const clickedElement = event.target.closest('[data-no-close]');
            if (!clickedElement) {
                setIsVisible(false);
            }
        }
    };

    // Render popper content
    const popperContent = isVisible && (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-[9998]"
                onClick={closePopper}
            />

            {/* Popper content */}
            <div
                ref={popperRef}
                className={`z-[9999] transition-opacity duration-200 ease-in-out ${className}`}
                onClick={handlePopperClick}
                role="menu"
                aria-orientation="vertical"
                style={{
                    position: usePortal ? 'fixed' : 'absolute',
                    zIndex: 9999,
                    ...(smartPositioning && {
                        top: `${position.top}px`,
                        left: `${position.left}px`,
                    })
                }}
            >
                {typeof children === "function"
                    ? children({ isOpen: isVisible, toggle: togglePopper, close: closePopper })
                    : children
                }
            </div>
        </>
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
    smartPositioning: PropTypes.bool,
};

export default Popper;
