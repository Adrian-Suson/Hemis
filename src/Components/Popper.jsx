/* eslint-disable react-hooks/exhaustive-deps */
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
    smartPositioning = true,
    isOpen = false,
    onOpenChange = null
}) {
    const [isVisible, setIsVisible] = useState(isOpen);
    const [position, setPosition] = useState({ top: 0, left: 0, placement: placement });
    const triggerRef = useRef(null);
    const popperRef = useRef(null);
    const popperInstanceRef = useRef(null);

    // Update isVisible when isOpen prop changes
    useEffect(() => {
        setIsVisible(isOpen);
    }, [isOpen]);

    // Memoize the smart position calculation to prevent infinite renders
    const calculateSmartPosition = useCallback(() => {
        if (!triggerRef.current || !popperRef.current || !isVisible) return;

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

        // Only update position if it actually changed to prevent unnecessary re-renders
        setPosition(prev => {
            if (prev.top !== top || prev.left !== left || prev.placement !== newPlacement) {
                return { top, left, placement: newPlacement };
            }
            return prev;
        });
    }, [placement, offset, isVisible]); // Added isVisible to dependencies

    // Handle click outside to close popper - Fixed dependency array
    useEffect(() => {
        if (!isVisible) return;

        const handleClickOutside = (event) => {
            if (
                popperRef.current &&
                !popperRef.current.contains(event.target) &&
                triggerRef.current &&
                !triggerRef.current.contains(event.target)
            ) {
                setIsVisible(false);
                if (onOpenChange) {
                    onOpenChange(false);
                }
                if (onToggle) {
                    onToggle(false);
                }
            }
        };

        const handleEscapeKey = (event) => {
            if (event.key === "Escape") {
                setIsVisible(false);
                if (onOpenChange) {
                    onOpenChange(false);
                }
                if (onToggle) {
                    onToggle(false);
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscapeKey);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscapeKey);
        };
    }, [isVisible, onOpenChange, onToggle]); // Fixed dependencies

    // Initialize/destroy Popper.js instance or calculate smart position
    useEffect(() => {
        if (!isVisible || !triggerRef.current || !popperRef.current) {
            // Clean up popper instance if it exists
            if (popperInstanceRef.current) {
                popperInstanceRef.current.destroy();
                popperInstanceRef.current = null;
            }
            return;
        }

        if (smartPositioning) {
            // Use setTimeout to ensure DOM is ready
            const timeoutId = setTimeout(() => {
                calculateSmartPosition();
            }, 0);

            return () => clearTimeout(timeoutId);
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
                            options: { offset },
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

            return () => {
                if (popperInstanceRef.current) {
                    popperInstanceRef.current.destroy();
                    popperInstanceRef.current = null;
                }
            };
        }
    }, [isVisible, placement, usePortal, smartPositioning]); // Removed calculateSmartPosition from deps

    // Handle window resize and scroll for smart positioning - Throttled for performance
    useEffect(() => {
        if (!isVisible || !smartPositioning) return;

        let timeoutId = null;

        const throttledCalculate = () => {
            if (timeoutId) return;
            timeoutId = setTimeout(() => {
                calculateSmartPosition();
                timeoutId = null;
            }, 16); // ~60fps
        };

        window.addEventListener('resize', throttledCalculate);
        window.addEventListener('scroll', throttledCalculate, true);

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            window.removeEventListener('resize', throttledCalculate);
            window.removeEventListener('scroll', throttledCalculate, true);
        };
    }, [isVisible, smartPositioning, calculateSmartPosition]);

    // Memoized handlers to prevent unnecessary re-renders
    const handleToggle = useCallback(() => {
        if (disabled) return;
        const newIsVisible = !isVisible;
        setIsVisible(newIsVisible);
        if (onOpenChange) {
            onOpenChange(newIsVisible);
        }
        if (onToggle) {
            onToggle(newIsVisible);
        }
    }, [disabled, isVisible, onOpenChange, onToggle]);

    const handleClose = useCallback(() => {
        setIsVisible(false);
        if (onOpenChange) {
            onOpenChange(false);
        }
        if (onToggle) {
            onToggle(false);
        }
    }, [onOpenChange, onToggle]);

    // Handle clicks on popper content
    const handlePopperClick = useCallback((event) => {
        if (closeOnItemClick) {
            const clickedElement = event.target.closest('[data-no-close]');
            if (!clickedElement) {
                handleClose();
            }
        }
    }, [closeOnItemClick, handleClose]);

    return (
        <div className="relative inline-block">
            {/* Trigger Element */}
            <div
                ref={triggerRef}
                onClick={handleToggle}
                className={disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
            >
                {typeof trigger === "function" ? trigger({ isOpen: isVisible, toggle: handleToggle, close: handleClose }) : trigger}
            </div>

            {/* Popper Content - Conditionally render createPortal itself */}
            {isVisible && (
                usePortal ? (
                    typeof document !== 'undefined' && createPortal(
                        <>
                            {/* Backdrop */}
                            <div
                                className="fixed inset-0 z-[9998]"
                                onClick={handleClose}
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
                                    ? children({ isOpen: isVisible, toggle: handleToggle, close: handleClose })
                                    : children
                                }
                            </div>
                        </>,
                        document.body
                    )
                ) : (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-[9998]"
                            onClick={handleClose}
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
                                ? children({ isOpen: isVisible, toggle: handleToggle, close: handleClose })
                                : children
                            }
                        </div>
                    </>
                )
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
    isOpen: PropTypes.bool,
    onOpenChange: PropTypes.func
};

export default Popper;
