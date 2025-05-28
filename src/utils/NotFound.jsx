/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import logo from "../assets/ChedLogo.png"; // Placeholder image, replace with your actual logo

const NotFound = () => {
    const [counter, setCounter] = useState(10);
    const [isRedirecting, setIsRedirecting] = useState(false);
        const [isLoggedIn, setIsLoggedIn] = useState(false);

     useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        setIsLoggedIn(!!user);
    }, []);
    const navigate = useNavigate();

    const handleGoBack = () => {
        setIsRedirecting(true);
        const user = JSON.parse(localStorage.getItem("user"));

        if (user) {
            // User is logged in, redirect to dashboard based on role
            const destination =
                user.role === "super-admin"
                    ? "/super-admin/dashboard"
                    : user.role === "hei-admin"
                    ? "/hei-admin/dashboard"
                    : "/hei-staff/dashboard";
            navigate(destination);
        } else {
            // User is not logged in, redirect to home page
            navigate("/");
        }
    };

    // Countdown effect
    useEffect(() => {
        if (!isRedirecting && counter > 0) {
            const timer = setTimeout(() => setCounter(counter - 1), 1000);
            return () => clearTimeout(timer);
        }
        if (counter === 0) {
            handleGoBack();
        }
    }, [counter, isRedirecting]);

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 text-white overflow-hidden">
            {/* Rotating background sunburst rays - inspired by CHED logo */}
            <div className="absolute inset-0 z-0 opacity-10 animate-spin-slow">
                {[...Array(18)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute origin-center left-1/2 top-1/2 bg-yellow-400 -translate-x-1/2 -translate-y-1/2"
                        style={{
                            height: '150vh',
                            width: '12px',
                            transform: `translate(-50%, -50%) rotate(${i * 20}deg)`
                        }}
                    />
                ))}
            </div>




            {/* CHED logo image */}
            <div className="relative z-10 mb-8">
                <div className="flex items-center justify-center">
                    <div className="w-32 h-32 flex items-center justify-center mb-4">
                        <img
                            src={logo}
                            alt="CHED Logo"
                            className="w-full h-full object-contain filter drop-shadow-lg"
                        />
                    </div>
                </div>
                <p className="text-xs font-semibold text-white text-center mt-2">COMMISSION ON HIGHER EDUCATION</p>
            </div>

            <div className="relative z-10 max-w-md text-center px-6">
                {/* Glitching 404 text */}
                <div className="relative mb-4">
                    <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500 filter drop-shadow-lg">
                        404
                    </h1>
                    <div className="absolute -inset-0.5 text-9xl font-extrabold text-blue-300 opacity-20 animate-pulse">
                        404
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-4">
                    Page not found
                </h2>

                <p className="text-gray-200 mb-8">
                    The page you are looking for might have been removed, had its name changed,
                    or is temporarily unavailable.
                </p>

                 {/* Interactive elements */}
                <div className="space-y-6">
                    <div className="w-full bg-blue-200 bg-opacity-30 rounded-full h-2.5">
                        <div
                            className="bg-yellow-400 h-2.5 rounded-full transition-all duration-1000 ease-linear"
                            style={{ width: `${counter * 10}%` }}
                        />
                    </div>

                    <p className="text-sm text-gray-200">
                        Redirecting {isLoggedIn ? "to dashboard" : "to home"} in <span className="font-bold text-yellow-400">{counter}</span> seconds
                    </p>

                    <button
                        onClick={handleGoBack}
                        className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-red-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
                    >
                        {isRedirecting ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Redirecting...
                            </span>
                        ) : (
                            isLoggedIn ? "Back to Dashboard" : "Back to Home"
                        )}
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-4 text-center text-xs text-gray-300 opacity-70">
                © {new Date().getFullYear()} Commission on Higher Education
            </div>

            {/* Add some CSS animations */}
            <style>{`
                @keyframes float {
                    0% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(180deg); }
                    100% { transform: translateY(0) rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default NotFound;
