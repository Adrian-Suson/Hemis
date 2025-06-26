/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useMemo, useCallback } from "react";
import { ChevronLeft, ChevronDown, ChevronUp, LogOut, LayoutDashboard, Building, Settings, List, Users, BarChart3 } from "lucide-react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const Sidebar = ({
    isSidebarOpen,
    setIsSidebarOpen,
    isNonMobile = true,
    isMinimized,
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
    const [openDropdown, setOpenDropdown] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Navigation items based on user role (copied from Navbar.jsx)
    const navItems = useMemo(() => {
        const role = user?.role;
        const items = {
            "super-admin": [
                {
                    text: "Dashboard",
                    path: "/super-admin/dashboard",
                    icon: LayoutDashboard,
                },
                {
                    text: "Institutions",
                    icon: Building,
                    dropdown: [
                        { text: "SUC", path: "/super-admin/institutions/suc" },
                        { text: "LUC", path: "/super-admin/institutions/luc" },
                        { text: "PRIVATE", path: "/super-admin/institutions/private" },
                    ],
                },
                {
                    text: "Admin",
                    icon: Settings,
                    dropdown: [
                        { text: "User Management", path: "/super-admin/user-management", icon: Users },
                        { text: "System Management", path: "/super-admin/system-management", icon: Settings },
                        { text: "HEI List", path: "/super-admin/hei-management", icon: List },
                    ],
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
                    path: "/hei-admin/dashboard",
                    icon: LayoutDashboard,
                },
                {
                    text: "Institutions",
                    icon: Building,
                    dropdown: [
                        { text: "SUC", path: "/hei-admin/institutions/suc" },
                        { text: "LUC", path: "/hei-admin/institutions/luc" },
                        { text: "PRIVATE", path: "/hei-admin/institutions/private" },
                    ],
                },
                {
                    text: "Admin",
                    icon: Settings,
                    dropdown: [
                        { text: "Staff Management", path: "/hei-admin/staff-management", icon: Users },
                        { text: "System Management", path: "/hei-admin/system-management", icon: Settings },
                        { text: "HEI List", path: "/hei-admin/hei-list", icon: List },
                    ],
                },
            ],
            "hei-staff": [
                {
                    text: "Dashboard",
                    path: "/hei-staff/dashboard",
                    icon: LayoutDashboard,
                },
                {
                    text: "Institutions",
                    icon: Building,
                    dropdown: [
                        { text: "SUC", path: "/hei-staff/institutions/suc" },
                        { text: "LUC", path: "/hei-staff/institutions/luc" },
                        { text: "PRIVATE", path: "/hei-staff/institutions/private" },
                    ],
                },
            ],
        };
        return items[role] || [];
    }, [user]);

    const handleNavigation = useCallback((path) => {
        navigate(path);
        setActive(path);
        if (!isNonMobile) setIsSidebarOpen(false);
    }, [navigate, isNonMobile, setIsSidebarOpen]);

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

    // Helper to check if a dropdown contains the active path
    const isDropdownActive = (dropdown) => {
        return dropdown?.some((item) => item.path === active);
    };

    // Render a single nav item or dropdown
    const renderNavItem = (item, index) => {
        const { text, icon: Icon, path, dropdown } = item;
        const hasDropdown = dropdown && dropdown.length > 0;
        const isActive = path ? active === path : isDropdownActive(dropdown);
        const isOpen = openDropdown === index;

        if (!hasDropdown) {
            return (
                <li key={text} className="mb-1">
                    <button
                        onClick={() => handleNavigation(path)}
                        className={`
                            w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200
                            ${isActive ? 'bg-blue-500 text-white shadow-md' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}
                            ${isMinimized ? 'justify-center px-2' : 'justify-start'}
                        `}
                    >
                        <div className={`flex items-center justify-center ${isMinimized ? '' : 'mr-3'}`}>
                            {Icon && <Icon size={20} />}
                        </div>
                        {!isMinimized && <span className="font-medium">{text}</span>}
                    </button>
                </li>
            );
        }
        // Dropdown item
        return (
            <li key={text} className="mb-1">
                <button
                    onClick={() => setOpenDropdown(isOpen ? null : index)}
                    className={`
                        w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200
                        text-gray-700 hover:bg-blue-50 hover:text-blue-600
                        ${isMinimized ? 'justify-center px-2' : 'justify-between'}
                        ${isActive ? 'bg-blue-100' : ''}
                    `}
                >
                    <div className={`flex items-center ${isMinimized ? '' : 'mr-3'}`}>
                        {Icon && <Icon size={20} />}
                        {!isMinimized && <span className="font-medium ml-2">{text}</span>}
                    </div>
                    {!isMinimized && (
                        <span className="ml-auto">
                            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </span>
                    )}
                </button>
                {/* Dropdown content */}
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <ul className={`mt-2 space-y-1 ${isMinimized ? '' : 'ml-4'}`}>
                        {dropdown.map((dropItem) => (
                            <li key={dropItem.text}>
                                <button
                                    onClick={() => handleNavigation(dropItem.path)}
                                    className={`
                                        w-full flex items-center px-4 py-2 rounded-lg transition-all duration-200
                                        ${active === dropItem.path ? 'bg-blue-500 text-white shadow-md' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}
                                        ${isMinimized ? 'justify-center px-2' : 'justify-start'}
                                    `}
                                >
                                    <div className={`flex items-center justify-center ${isMinimized ? '' : 'mr-3'}`}>
                                        {dropItem.icon ? <dropItem.icon size={18} /> : null}
                                    </div>
                                    {!isMinimized && <span className="font-medium">{dropItem.text}</span>}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
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
                            {navItems.map((item, idx) => renderNavItem(item, idx))}
                        </ul>
                    </div>
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
    onLogout: PropTypes.func, // Function to handle logout
    onFetchUser: PropTypes.func, // Function to fetch user data
};

export default Sidebar;
