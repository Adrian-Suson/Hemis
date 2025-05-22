import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import logoSrc from "../assets/ChedLogo.png";

const EnhancedLoadingScreen = ({
    progress = 0,
    mode = "spinner",
    theme = "ched",
    showPercentage = true,
    isVisible = true,
    onComplete = () => {},
}) => {
    const [animatedProgress, setAnimatedProgress] = useState(0);
    const [isCompleting, setIsCompleting] = useState(false);

    // Randomize inspirational messages

    // Progress animation with optimized rendering
    useEffect(() => {
        if (mode === "progress" && !isCompleting) {
            const animationDuration = 300;
            const interval = 30;
            const steps = animationDuration / interval;
            const increment = (progress - animatedProgress) / steps;

            if (Math.abs(progress - animatedProgress) < 0.5) {
                setAnimatedProgress(progress);
                return;
            }

            const timer = setTimeout(() => {
                setAnimatedProgress((prev) => {
                    const newValue = prev + increment;
                    // Trigger step changes for animation variety
                    return Math.round(newValue * 10) / 10;
                });
            }, interval);

            return () => clearTimeout(timer);
        }
    }, [progress, animatedProgress, mode, isCompleting]);

    // Completion handler
    useEffect(() => {
        if (progress >= 100 && !isCompleting) {
            setIsCompleting(true);
            const timer = setTimeout(() => {
                onComplete();
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [progress, onComplete, isCompleting]);

    if (!isVisible) return null;

    // Enhanced theme configurations
    const themes = {
        premium: {
            background: "from-gray-50 to-gray-100",
            progressBg: "bg-gray-200",
            progressFill: "from-blue-400 to-blue-600",
            textColor: "text-gray-600",
            headingColor: "text-gray-800",
            accentColor: "text-blue-600",
            circleColor: "border-blue-500",
            particles: "#4285F4",
            logoGlow: "0 0 15px rgba(66, 133, 244, 0.5)",
            secondaryColor: "from-blue-500 to-indigo-600",
        },
        executive: {
            background: "from-gray-50 to-gray-200",
            progressBg: "bg-gray-300",
            progressFill: "from-indigo-500 to-indigo-700",
            textColor: "text-gray-600",
            headingColor: "text-gray-800",
            accentColor: "text-indigo-700",
            circleColor: "border-indigo-600",
            particles: "#4B0082",
            logoGlow: "0 0 15px rgba(79, 70, 229, 0.5)",
            secondaryColor: "from-indigo-500 to-purple-600",
        },
        ched: {
            background: "from-blue-50 to-white",
            progressBg: "bg-gray-200",
            progressFill: "from-blue-600 to-blue-800",
            textColor: "text-gray-700",
            headingColor: "text-blue-800",
            accentColor: "text-blue-700",
            circleColor: "border-blue-700",
            particles: "#00274C",
            logoGlow: "0 0 20px rgba(30, 64, 175, 0.45)",
            secondaryColor: "from-blue-700 to-blue-900",
        },
        nightMode: {
            background: "from-gray-900 to-gray-800",
            progressBg: "bg-gray-700",
            progressFill: "from-blue-400 to-blue-600",
            textColor: "text-gray-300",
            headingColor: "text-white",
            accentColor: "text-blue-400",
            circleColor: "border-blue-500",
            particles: "#3B82F6",
            logoGlow: "0 0 20px rgba(59, 130, 246, 0.6)",
            secondaryColor: "from-blue-400 to-indigo-500",
        },
    };

    const currentTheme = themes[theme] || themes.ched;
    const showProgressBar = mode === "progress";
    const progressPercent = Math.round(animatedProgress);

    return (
        <div
            className={`fixed inset-0 w-screen h-screen flex flex-col justify-center items-center z-50 transition-all duration-300 overflow-hidden bg-gradient-to-b ${currentTheme.background}`}
        >
            <div className="flex flex-col items-center justify-center z-10 px-4 transition-all duration-700">
                {/* Enhanced logo container with dynamic effects */}
                <div className="relative mb-10 w-44 h-44">
                    {/* Dynamic glow based on progress */}
                    <div
                        className={`absolute inset-0 rounded-full bg-gradient-to-r ${
                            currentTheme.secondaryColor
                        } opacity-${
                            progressPercent < 30
                                ? "20"
                                : progressPercent < 60
                                ? "30"
                                : "40"
                        } blur-xl transition-all duration-700`}
                        style={{
                            transform: `scale(${1 + progressPercent / 200})`,
                        }}
                    ></div>

                    {/* Rotating circles with dynamic speed */}
                    <div
                        className={`absolute w-full h-full rounded-full border-2 ${currentTheme.circleColor} border-dashed opacity-40`}
                        style={{
                            animation: `spin ${
                                15 - progressPercent / 20
                            }s linear infinite`,
                        }}
                    ></div>

                    <div
                        className={`absolute w-full h-full rounded-full border-2 ${currentTheme.circleColor} border-dotted opacity-30`}
                        style={{
                            animation: `spin-reverse ${
                                12 - progressPercent / 20
                            }s linear infinite`,
                            transform: "scale(0.85)",
                        }}
                    ></div>



                    {/* The Logo Image with enhanced presentation */}
                    <div
                        className="absolute inset-6 flex items-center justify-center bg-gradient-to-b from-blue-800 to-blue-900 rounded-full shadow-lg overflow-hidden transition-all duration-500"
                        style={{
                            boxShadow: currentTheme.logoGlow,
                            transform: `scale(${isCompleting ? 1.05 : 1})`,
                        }}
                    >
                        <div className="relative overflow-hidden rounded-full w-full h-full flex items-center justify-center">
                            {/* Shine effect across logo */}
                            <div
                                className="absolute w-[200%] h-[200%] bg-white opacity-20 transform -rotate-45"
                                style={{
                                    top: "-150%",
                                    left: "-150%",
                                    animation: "shine 3s ease-in-out infinite",
                                    animationDelay: "1s",
                                }}
                            />
                            <img
                                src={logoSrc}
                                alt="CHED Logo"
                                className="w-32 h-32 object-contain filter drop-shadow-lg z-10 transition-transform duration-500"
                                style={{
                                    transform: `scale(${
                                        isCompleting ? 1.1 : 1
                                    })`,
                                }}
                                loading="eager"
                            />
                        </div>
                    </div>
                </div>

                {/* Enhanced messages with animated transitions */}
                <div className="text-center">
                    {mode === "progress" && (
                        <p
                            className={`text-sm mb-5 ${currentTheme.textColor} opacity-90`}
                        >
                            Please wait a moment
                            <span className="typing-dots">
                                <span className="dot"></span>
                                <span className="dot"></span>
                                <span className="dot"></span>
                            </span>
                        </p>
                    )}

                    {mode === "spinner" && (
                        <p
                            className={`text-sm mb-5 ${currentTheme.textColor} opacity-90`}
                        >
                            Please wait a moment
                            <span className="typing-dots">
                                <span className="dot"></span>
                                <span className="dot"></span>
                                <span className="dot"></span>
                            </span>
                        </p>
                    )}
                </div>

                {showProgressBar && (
                    <div className="flex flex-col items-center w-full mt-1">
                        {/* Progress track with dynamic segments */}
                        <div className="relative w-64 sm:w-96">
                            {/* Main progress bar */}
                            <div
                                className={`relative h-2 ${currentTheme.progressBg} rounded-full mb-3 overflow-hidden`}
                            >
                                {/* Filled progress with animated gradient */}
                                <div
                                    className={`absolute top-0 left-0 h-full rounded-full transition-all duration-300 ease-out bg-gradient-to-r ${currentTheme.progressFill}`}
                                    style={{ width: `${animatedProgress}%` }}
                                >
                                    {/* Animated shine effect */}
                                    <div
                                        className="absolute top-0 right-0 h-full w-24 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                        style={{
                                            animation:
                                                "sweep 2s ease-in-out infinite",
                                            animationPlayState:
                                                progress < 100
                                                    ? "running"
                                                    : "paused",
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Percentage display with pulse effect on milestone */}
                            {showPercentage && (
                                <div className="relative w-full flex justify-center">
                                    <p
                                        className={`${
                                            currentTheme.accentColor
                                        } text-lg font-bold transition-all duration-300 ${
                                            progressPercent % 25 === 0 &&
                                            progressPercent > 0
                                                ? "scale-110"
                                                : ""
                                        }`}
                                    >
                                        {progressPercent}%
                                    </p>

                                    {/* Milestone effect */}
                                    {progressPercent % 25 === 0 &&
                                        progressPercent > 0 && (
                                            <div className="absolute -top-1 w-full flex justify-center">
                                                <div className="absolute w-16 h-16 rounded-full bg-current opacity-0 animate-ping-once" />
                                            </div>
                                        )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Enhanced animations via CSS */}
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                @keyframes spin-reverse {
                    0% { transform: rotate(0deg) scale(0.85); }
                    100% { transform: rotate(-360deg) scale(0.85); }
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0) translateX(0); }
                    25% { transform: translateY(-20px) translateX(10px); }
                    50% { transform: translateY(-35px) translateX(-15px); }
                    75% { transform: translateY(-15px) translateX(5px); }
                }

                @keyframes sweep {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }

                @keyframes shine {
                    0% { transform: translateY(0%) translateX(0%) rotate(-45deg); }
                    15% { transform: translateY(100%) translateX(100%) rotate(-45deg); }
                    100% { transform: translateY(100%) translateX(100%) rotate(-45deg); }
                }

                @keyframes ping-once {
                    0% { transform: scale(0.2); opacity: 1; }
                    70%, 100% { transform: scale(2); opacity: 0; }
                }

                .animate-ping-once {
                    animation: ping-once 0.8s cubic-bezier(0, 0, 0.2, 1);
                }

                .typing-dots {
                    display: inline-flex;
                    align-items: center;
                    height: 1.5em;
                    margin-left: 4px;
                }

                .typing-dots .dot {
                    display: inline-block;
                    width: 4px;
                    height: 4px;
                    border-radius: 50%;
                    background-color: currentColor;
                    margin: 0 2px;
                    animation: dotPulse 1.5s infinite ease-in-out;
                }

                .typing-dots .dot:nth-child(2) {
                    animation-delay: 0.2s;
                }

                .typing-dots .dot:nth-child(3) {
                    animation-delay: 0.4s;
                }

                @keyframes dotPulse {
                    0%, 60%, 100% { transform: scale(0.7); opacity: 0.6; }
                    30% { transform: scale(1.2); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

EnhancedLoadingScreen.propTypes = {
    progress: PropTypes.number,
    mode: PropTypes.oneOf(["spinner", "progress"]),
    theme: PropTypes.oneOf(["premium", "executive", "ched", "nightMode"]),
    message: PropTypes.string,
    showPercentage: PropTypes.bool,
    isVisible: PropTypes.bool,
    onComplete: PropTypes.func,
};

export default EnhancedLoadingScreen;
