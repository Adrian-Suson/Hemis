import { useState } from "react";
import { Outlet } from "react-router-dom";
import PropTypes from "prop-types";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

// Hamburger Menu Icon Component
const MenuIcon = ({ className = "" }) => (
    <svg
        className={`w-6 h-6 ${className}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
        />
    </svg>
);

MenuIcon.propTypes = {
    className: PropTypes.string,
};

const Layout = ({ userRole }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar starts closed
    const [isMinimized, setIsMinimized] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="flex flex-col w-full h-full">
            {/* Mobile AppBar - only show on screens smaller than 600px */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-blue-600 shadow-md sm:hidden">
                <div className="flex items-center px-4 py-3">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="text-white hover:bg-blue-700 p-2 rounded-md transition-colors duration-200 mr-2"
                        aria-label="Toggle mobile menu"
                    >
                        <MenuIcon />
                    </button>
                    <h1 className="flex-1 text-center text-white text-xl font-bold">
                        CHEDRO IX
                    </h1>
                </div>
            </header>

            {/* Sidebar - only show on extra small screens */}
            {mobileMenuOpen && (
                <div className="sm:hidden">
                    <Sidebar
                        userRole={userRole}
                        isNonMobile={false}
                        drawerWidth="300px"
                        isSidebarOpen={mobileMenuOpen}
                        setIsSidebarOpen={setMobileMenuOpen}
                        isMinimized={isMinimized}
                        setIsMinimized={setIsMinimized}
                    />
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 mt-16 sm:mt-0">
                {/* Desktop Navbar - only show on screens 600px and larger */}
                <div className="hidden sm:block">
                    <Navbar
                        isNonMobile={true}
                        isSidebarOpen={isSidebarOpen}
                        setIsSidebarOpen={setIsSidebarOpen}
                        isMinimized={isMinimized}
                        setIsMinimized={setIsMinimized}
                    />
                </div>

                {/* Router Outlet */}
                <Outlet />
            </div>
        </div>
    );
};

Layout.propTypes = {
    userRole: PropTypes.string,
};

export default Layout;
