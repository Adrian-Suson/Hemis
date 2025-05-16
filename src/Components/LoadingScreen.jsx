import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import logoSrc from "../assets/ChedLogo.png"; // Placeholder image, replace with your actual logo

const ProfessionalLoadingScreen = ({
    progress = 0,
    mode = "spinner",
    theme = "ched",
    message = "Loading",
    showPercentage = true,
    isVisible = true,
    onComplete = () => {},
}) => {
    const [animatedProgress, setAnimatedProgress] = useState(0);
    const [isCompleting, setIsCompleting] = useState(false);

    // Optimize progress animation with fewer updates
    useEffect(() => {
        if (mode === "progress" && !isCompleting) {
            // Reduce animation frequency for better performance
            const animationDuration = 300; // ms - slightly faster
            const interval = 30; // ms - reduced update frequency (33fps instead of 60fps)
            const steps = animationDuration / interval;
            const increment = (progress - animatedProgress) / steps;

            // Skip tiny changes to reduce unnecessary renders
            if (Math.abs(progress - animatedProgress) < 0.5) {
                setAnimatedProgress(progress);
                return;
            }

            const timer = setTimeout(() => {
                setAnimatedProgress((prev) => {
                    const newValue = prev + increment;
                    // Round to single decimal to reduce state updates
                    return Math.round(newValue * 10) / 10;
                });
            }, interval);

            return () => clearTimeout(timer);
        }
    }, [progress, animatedProgress, mode, isCompleting]);

    // Call onComplete when progress reaches 100%
    useEffect(() => {
        if (progress >= 100 && !isCompleting) {
            setIsCompleting(true);
            const timer = setTimeout(() => {
                onComplete();
            }, 500); // Reduced from 700ms to 500ms
            return () => clearTimeout(timer);
        }
    }, [progress, onComplete, isCompleting]);

    if (!isVisible) return null;

    // Theme configurations
    const themes = {
        premium: {
            background: "bg-gray-50/50",
            progressBg: "bg-gray-200/50",
            progressFill: "bg-blue-500",
            textColor: "text-gray-600",
            headingColor: "text-gray-800",
            accentColor: "text-blue-600",
            circleColor: "border-blue-500",
        },
        executive: {
            background: "bg-gray-100/50",
            progressBg: "bg-gray-200/50",
            progressFill: "bg-indigo-600",
            textColor: "text-gray-600",
            headingColor: "text-gray-800",
            accentColor: "text-indigo-700",
            circleColor: "border-indigo-600",
        },
        ched: {
            background: "bg-white/50",
            progressBg: "bg-gray-200/50",
            progressFill: "bg-blue-700",
            textColor: "text-gray-700",
            headingColor: "text-blue-800",
            accentColor: "text-blue-700",
            circleColor: "border-blue-700",
        },
        nightMode: {
            background: "bg-gray-900/50",
            progressBg: "bg-gray-700/50",
            progressFill: "bg-blue-500",
            textColor: "text-gray-300",
            headingColor: "text-white",
            accentColor: "text-blue-400",
            circleColor: "border-blue-500",
        },
    };

    const currentTheme = themes[theme] || themes.ched;
    const showProgressBar = mode === "progress";

    return (
        <div
            className={`fixed inset-0 w-screen h-screen ${currentTheme.background} flex flex-col justify-center items-center z-50 transition-all duration-300`}
        >
            <div className="flex flex-col items-center justify-center z-10">
                {/* Logo with pulsing effect */}
                <div className="relative mb-8 w-40 h-40">
                    {/* Outer ring that pulses */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 to-red-500 opacity-30 animate-pulse-subtle"></div>

                    {/* Rotating circle around logo */}
                    <div
                        className="absolute w-full h-full rounded-full border-4 border-yellow-400 border-dashed opacity-60"
                        style={{ animation: "spin 10s linear infinite" }}
                    ></div>

                    {/* The Logo Image */}
                    <div className="absolute inset-4 flex items-center justify-center bg-blue-900 bg-opacity-50 rounded-full">
                        <img
                            src={logoSrc}
                            alt="CHED Logo"
                            className="w-32 h-32 object-contain filter drop-shadow-lg"
                            loading="eager"
                        />
                    </div>
                </div>

                {/* Message with text gradient */}
                <p className={`text-xl font-medium mb-6 text-transparent bg-clip-text bg-gradient-to-r ${currentTheme.progressFill}`}>
                    {message}
                    <span className="loading-dots">...</span>
                </p>

                {showProgressBar && (
                    <div className="flex flex-col items-center w-full mt-2">
                        {/* Enhanced progress bar with gradient and shine effect */}
                        <div
                            className={`relative w-64 sm:w-80 h-2.5 ${currentTheme.progressBg} rounded-full mb-2 overflow-hidden`}
                        >
                            <div
                                className={`absolute top-0 left-0 h-full bg-gradient-to-r ${currentTheme.progressFill} rounded-full transition-all duration-300 ease-out`}
                                style={{ width: `${animatedProgress}%` }}
                            >
                                {/* Enhanced shine effect */}
                                <div
                                    className="absolute top-0 right-0 h-full w-8 bg-white opacity-30"
                                    style={{
                                        transform: "skewX(-20deg) translateX(10px)",
                                        filter: "blur(5px)",
                                    }}
                                />
                                <div
                                    className="absolute top-0 right-0 h-full w-4 bg-white opacity-40"
                                    style={{
                                        transform: "skewX(-20deg) translateX(10px)",
                                    }}
                                />
                            </div>
                        </div>

                        {/* Percentage with subtle pulse animation */}
                        {showPercentage && (
                            <p
                                className={`${currentTheme.accentColor} text-lg font-bold animate-pulse-subtle`}
                            >
                                {Math.round(animatedProgress)}%
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Simplified CSS animations */}
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .loading-dots {
                    display: inline-block;
                    width: 24px;
                    text-align: left;
                    animation: loadingDots 1.5s infinite;
                }

                @keyframes loadingDots {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

ProfessionalLoadingScreen.propTypes = {
    progress: PropTypes.number,
    mode: PropTypes.oneOf(["spinner", "progress"]),
    theme: PropTypes.oneOf(["premium", "executive", "ched", "nightMode"]),
    message: PropTypes.string,
    showPercentage: PropTypes.bool,
    isVisible: PropTypes.bool,
    onComplete: PropTypes.func,
};

export default ProfessionalLoadingScreen;
