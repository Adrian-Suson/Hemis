/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { ChevronLeft, Home, Database, Users, BarChart3, ChevronDown, ChevronUp, LogOut, Shield } from "lucide-react";
import PropTypes from "prop-types"; // Import PropTypes at the top

// Define navigation items based on user role
const getNavItems = (role) => {
    const items = {
        "super-admin": [
            {
                text: "Dashboard",
                icon: Home,
                path: "/super-admin/dashboard",
            },
            {
                text: "Institutions",
                icon: Database,
                path: "/super-admin/institutions",
            },
            {
                text: "Statistics",
                icon: BarChart3,
                path: "/super-admin/statistics",
            },
        ],
        "hei-admin": [
            {
                text: "Dashboard",
                icon: Home,
                path: "/hei-admin/dashboard",
            },
            {
                text: "Institutions",
                icon: Database,
                path: "/hei-admin/institutions",
            },
        ],
        "hei-staff": [
            {
                text: "Dashboard",
                icon: Home,
                path: "/hei-staff/dashboard",
            },
            {
                text: "Institutions",
                icon: Database,
                path: "/hei-staff/institutions",
            },
        ],
    };
    return items[role] || [];
};

// Define admin menu items based on user role
const getAdminMenuItems = (role) => {
    const items = {
        "super-admin": [
            {
                text: "User Management",
                icon: Users,
                path: "/super-admin/user-management",
            },
        ],
        "hei-admin": [
            {
                text: "Staff Management",
                icon: Users,
                path: "/hei-admin/staff-management",
            },
        ],
        "hei-staff": [], // No admin menu for HEI Staff
    };
    return items[role] || [];
};

const Sidebar = ({
    isSidebarOpen,
    setIsSidebarOpen,
    isNonMobile = true,
    isMinimized,
    // Navigation and API functions as props to make component reusable
    onNavigate = (path) => console.log('Navigate to:', path),
    onLogout = () => console.log('Logout clicked'),
    onFetchUser = () => Promise.resolve({
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        role: "super-admin",
        profile_image: null
    }),
}) => {
    const [active, setActive] = useState("");
    const [openManagement, setOpenManagement] = useState(false);
    const [user, setUser] = useState(null);

    const navItems = getNavItems(user?.role);
    const adminMenuItems = getAdminMenuItems(user?.role);

    const handleNavigation = (path) => {
        onNavigate(path);
        setActive(path);
        if (!isNonMobile) setIsSidebarOpen(false); // Close sidebar on mobile after navigation
    };

    const fetchUsers = async () => {
        try {
            const userData = await onFetchUser();
            setUser(userData);
        } catch (error) {
            console.error("Failed to fetch user:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleLogout = async () => {
        try {
            await onLogout();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const renderNavItem = ({ text, icon: IconComponent, path }) => {
        const isActive = active === path;
        return (
            <li key={text} className="mb-1">
                <button
                    onClick={() => handleNavigation(path)}
                    className={`
                        w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200
                        ${isActive
                            ? 'bg-blue-500 text-white shadow-md'
                            : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                        }
                        ${isMinimized ? 'justify-center px-2' : 'justify-start'}
                    `}
                >
                    <div className={`flex items-center justify-center ${isMinimized ? '' : 'mr-3'}`}>
                        <IconComponent size={20} />
                    </div>
                    {!isMinimized && (
                        <span className="font-medium">{text}</span>
                    )}
                </button>
            </li>
        );
    };

    // Overlay for mobile
    const Overlay = () => (
        <div
            className={`
                fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden
                ${isSidebarOpen ? 'block' : 'hidden'}
            `}
            onClick={() => setIsSidebarOpen(false)}
        />
    );

    return (
        <>
            <Overlay />
            <div
                className={`
                    fixed left-0 top-0 h-full bg-white shadow-xl z-50 flex flex-col
                    transition-all duration-300 ease-in-out
                    ${isMinimized ? 'w-16' : 'w-60'}
                    ${isNonMobile
                        ? (isSidebarOpen ? 'translate-x-0' : '-translate-x-full')
                        : (isSidebarOpen ? 'translate-x-0' : '-translate-x-full')
                    }
                    md:${isNonMobile ? 'relative' : 'fixed'}
                `}
            >
                {/* Header */}
                <div className={`p-${isMinimized ? '3' : '6'} border-b border-gray-200`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className={`
                                rounded-full bg-blue-500 flex items-center justify-center text-white font-bold
                                ${isMinimized ? 'w-8 h-8 text-sm' : 'w-12 h-12 text-lg'}
                            `}>
                                C
                            </div>
                            {!isMinimized && (
                                <h1 className="text-lg font-semibold text-gray-800 leading-tight">
                                    Information Management
                                </h1>
                            )}
                        </div>
                        {!isNonMobile && (
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="p-1 rounded-md hover:bg-gray-100"
                            >
                                <ChevronLeft size={20} className="text-gray-600" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto py-4">
                    <div className="px-3">
                        <ul className="space-y-1">
                            {navItems.map(renderNavItem)}
                        </ul>
                    </div>

                    {/* Admin Menu */}
                    {adminMenuItems.length > 0 && (
                        <div className="mt-6 px-3">
                            <div className="border-t border-gray-200 pt-4">
                                <button
                                    onClick={() => setOpenManagement(!openManagement)}
                                    className={`
                                        w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200
                                        text-gray-700 hover:bg-gray-50
                                        ${isMinimized ? 'justify-center px-2' : 'justify-between'}
                                    `}
                                >
                                    <div className={`flex items-center ${isMinimized ? '' : 'space-x-3'}`}>
                                        <Shield size={20} />
                                        {!isMinimized && (
                                            <span className="font-medium">Admin</span>
                                        )}
                                    </div>
                                    {!isMinimized && (
                                        <div className="ml-auto">
                                            {openManagement ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                        </div>
                                    )}
                                </button>

                                <div className={`
                                    overflow-hidden transition-all duration-300 ease-in-out
                                    ${openManagement ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                                `}>
                                    <ul className={`mt-2 space-y-1 ${isMinimized ? '' : 'ml-4'}`}>
                                        {adminMenuItems.map(renderNavItem)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* User Profile & Logout */}
                <div className={`p-${isMinimized ? '2' : '4'} border-t border-gray-200`}>
                    <div className="mb-4">
                        <div className={`
                            flex items-center space-x-3
                            ${isMinimized ? 'justify-center' : 'justify-start'}
                        `}>
                            <div className="relative">
                                {user?.profile_image ? (
                                    <img
                                        src={user.profile_image}
                                        alt="Profile"
                                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-medium text-sm border-2 border-gray-200">
                                        {user?.email?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                )}
                            </div>
                            {!isMinimized && user && (
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                        {user.name}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate capitalize">
                                        {user.role?.replace('-', ' ')}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className={`
                            flex items-center justify-center w-full bg-red-500 hover:bg-red-600
                            text-white font-medium rounded-lg transition-colors duration-200
                            ${isMinimized ? 'p-2' : 'px-4 py-2 space-x-2'}
                        `}
                        title="Log Out"
                    >
                        <LogOut size={18} />
                        {!isMinimized && <span>Logout</span>}
                    </button>
                </div>
            </div>
        </>
    );
};

Sidebar.propTypes = {
    drawerWidth: PropTypes.string, // Width of the sidebar
    isSidebarOpen: PropTypes.bool.isRequired, // Whether the sidebar is open
    setIsSidebarOpen: PropTypes.func.isRequired, // Function to toggle sidebar state
    isNonMobile: PropTypes.bool, // Whether the view is non-mobile
    isMinimized: PropTypes.bool.isRequired, // Whether the sidebar is minimized
    onNavigate: PropTypes.func, // Function to handle navigation
    onLogout: PropTypes.func, // Function to handle logout
    onFetchUser: PropTypes.func, // Function to fetch user data
};

export default Sidebar;
