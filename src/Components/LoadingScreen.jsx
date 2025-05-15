import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import logoSrc from "../assets/ChedLogo.png"; // Placeholder image, replace with your actual logo

const ProfessionalLoadingScreen = ({
    progress = 0,
    mode = "spinner",
    theme = "ched",
    message = "Loading...",
    showPercentage = true,
    isVisible = true,
    onComplete = () => {},
}) => {
    const [animatedProgress, setAnimatedProgress] = useState(0);
    const [isCompleting, setIsCompleting] = useState(false);

    // Animate progress value smoothly
    useEffect(() => {
        if (mode === "progress" && !isCompleting) {
            const animationDuration = 350; // ms
            const interval = 16; // ms - 60fps
            const steps = animationDuration / interval;
            const increment = (progress - animatedProgress) / steps;

            if (Math.abs(progress - animatedProgress) < 0.1) {
                setAnimatedProgress(progress);
                return;
            }

            const timer = setTimeout(() => {
                setAnimatedProgress((prev) => {
                    const newValue = prev + increment;
                    return Number(newValue.toFixed(1));
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
            }, 700);
            return () => clearTimeout(timer);
        }
    }, [progress, onComplete, isCompleting]);

    if (!isVisible) return null;

    // Theme configurations
    const themes = {
        premium: {
            background: "bg-gray-50",
            progressBg: "bg-gray-200",
            progressFill: "bg-blue-500",
            progressTrail: "bg-blue-200",
            textColor: "text-gray-600",
            headingColor: "text-gray-800",
            accentColor: "text-blue-600",
            circleColor: "border-blue-500",
            shadowColor: "rgba(37, 99, 235, 0.1)",
        },
        executive: {
            background: "bg-gray-100",
            progressBg: "bg-gray-200",
            progressFill: "bg-indigo-600",
            progressTrail: "bg-indigo-200",
            textColor: "text-gray-600",
            headingColor: "text-gray-800",
            accentColor: "text-indigo-700",
            circleColor: "border-indigo-600",
            shadowColor: "rgba(79, 70, 229, 0.1)",
        },
        ched: {
            background: "bg-white",
            progressBg: "bg-gray-200",
            progressFill: "bg-blue-700",
            progressTrail: "bg-blue-100",
            textColor: "text-gray-700",
            headingColor: "text-blue-800",
            accentColor: "text-blue-700",
            circleColor: "border-blue-700",
            shadowColor: "rgba(29, 78, 216, 0.15)",
        },
        nightMode: {
            background: "bg-gray-900",
            progressBg: "bg-gray-700",
            progressFill: "bg-blue-500",
            progressTrail: "bg-blue-900",
            textColor: "text-gray-300",
            headingColor: "text-white",
            accentColor: "text-blue-400",
            circleColor: "border-blue-500",
            shadowColor: "rgba(29, 78, 216, 0.2)",
        },
    };

    const currentTheme = themes[theme] || themes.ched;
    const showProgressBar = mode === "progress";

    return (
        <div
            className={`fixed inset-0 w-screen h-screen ${currentTheme.background} flex flex-col justify-center items-center z-50 transition-all duration-300`}
        >
            <div className="flex flex-col items-center justify-center">
                {/* Logo with circling animation */}
                <div className="relative mb-8 w-40 h-40">
                    {/* Circling elements */}
                    <div
                        className={`absolute w-full h-full rounded-full border-4 ${currentTheme.circleColor} border-dashed animate-spin-slow opacity-60`}
                    ></div>
                    <div
                        className={`absolute w-full h-full rounded-full border-4 ${currentTheme.circleColor} border-dotted animate-spin-reverse opacity-40`}
                        style={{ animationDuration: "8s" }}
                    ></div>

                    {/* The Logo Image */}
                    <div className="absolute inset-4 flex items-center justify-center">
                        <img
                            src={logoSrc}
                            alt="Logo"
                            className="rounded-full w-32 h-32 object-contain"
                        />
                    </div>
                </div>

                {/* Message */}
                <p
                    className={`${currentTheme.headingColor} text-xl font-medium mb-6`}
                >
                    {message}
                    <span className="inline-block animate-pulse-dot ml-1">
                        .
                    </span>
                    <span
                        className="inline-block animate-pulse-dot ml-0.5"
                        style={{ animationDelay: "0.2s" }}
                    >
                        .
                    </span>
                    <span
                        className="inline-block animate-pulse-dot ml-0.5"
                        style={{ animationDelay: "0.4s" }}
                    >
                        .
                    </span>
                </p>

                {showProgressBar && (
                    <div className="flex flex-col items-center w-full mt-2">
                        {/* Progress bar */}
                        <div
                            className={`relative w-64 sm:w-80 h-2.5 ${currentTheme.progressBg} rounded-full mb-2 overflow-hidden`}
                        >
                            {/* Progress trail */}
                            <div
                                className={`absolute top-0 left-0 h-full ${currentTheme.progressTrail} rounded-full transition-all duration-500 ease-out`}
                                style={{
                                    width: `${Math.min(
                                        100,
                                        animatedProgress + 5
                                    )}%`,
                                }}
                            />

                            {/* Main progress fill */}
                            <div
                                className={`absolute top-0 left-0 h-full ${currentTheme.progressFill} rounded-full transition-all duration-300 ease-out`}
                                style={{ width: `${animatedProgress}%` }}
                            >
                                {/* Shine effect */}
                                <div
                                    className="absolute top-0 right-0 h-full w-5 bg-white opacity-30"
                                    style={{
                                        transform:
                                            "skewX(-20deg) translateX(50%)",
                                        filter: "blur(2px)",
                                    }}
                                />
                            </div>
                        </div>

                        {/* Percentage */}
                        {showPercentage && (
                            <p
                                className={`${currentTheme.accentColor} text-base font-bold`}
                            >
                                {Math.round(animatedProgress)}%
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Custom CSS animations */}
            <style>{`
        .animate-spin-slow {
          animation: spin 6s linear infinite;
        }

        .animate-spin-reverse {
          animation: spin 10s linear infinite reverse;
        }

        .animate-pulse-dot {
          animation: pulseDot 1.5s infinite;
          opacity: 0.7;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulseDot {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }

        @keyframes orbit {
          0% { transform: rotate(0deg) translateY(-70px) rotate(0deg); }
          100% { transform: rotate(360deg) translateY(-70px) rotate(-360deg); }
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
    animationStyle: PropTypes.oneOf(["dynamic", "gradient", "pulse"]),
    isVisible: PropTypes.bool,
    logoSrc: PropTypes.string,
    onComplete: PropTypes.func,
};

export default ProfessionalLoadingScreen;
