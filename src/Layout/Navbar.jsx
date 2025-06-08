import { useNavigate, useLocation } from "react-router-dom";
import { useState, useMemo, useEffect, useCallback } from "react";
import axios from "axios";
import config from "../utils/config";
import DP from "../assets/Profile.png";
import Logo from "../assets/ChedLogo.png";
import ProfileDialog from "./ProfileDialog";
import {
    Menu,
    ChevronDown,
    User,
    LogOut,
    X,
    LayoutDashboard,
    Building,
    Settings,
    List,
    Users,
} from "lucide-react";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [activeDropdown, setActiveDropdown] = useState(null);
    const [user, setUser] = useState(null);
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const [openProfileDialog, setOpenProfileDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Navigation items based on user role
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
                        {
                            text: "SUC",
                            path: "/super-admin/institutions/suc",
                        },
                        {
                            text: "LUC",
                            path: "/super-admin/institutions/luc",
                        },
                        {
                            text: "PRIVATE",
                            path: "/super-admin/institutions/private",
                        },
                    ],
                },
                {
                    text: "Admin",
                    icon: Settings,
                    dropdown: [
                        {
                            text: "User Management",
                            path: "/super-admin/user-management",
                            icon: Users,
                        },
                        {
                            text: "System Management",
                            path: "/super-admin/system-management",
                            icon: Settings,
                        },
                        {
                            text: "HEI List",
                            path: "/super-admin/hei-management",
                            icon: List,
                        },
                    ],
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
                        {
                            text: "SUC",
                            path: "/hei-admin/institutions/suc",
                        },
                        {
                            text: "LUC",
                            path: "/hei-admin/institutions/luc",
                        },
                        {
                            text: "PRIVATE",
                            path: "/hei-admin/institutions/private",
                        },
                    ],
                },
                {
                    text: "Admin",
                    icon: Settings,
                    dropdown: [
                        {
                            text: "Staff Management",
                            path: "/hei-admin/staff-management",
                            icon: Users,
                        },
                        {
                            text: "System Management",
                            path: "/hei-admin/system-management",
                            icon: Settings,
                        },
                        {
                            text: "HEI List",
                            path: "/hei-admin/hei-list",
                            icon: List,
                        },
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
                        {
                            text: "SUC",
                            path: "/hei-staff/institutions/suc",
                        },
                        {
                            text: "LUC",
                            path: "/hei-staff/institutions/luc",
                        },
                        {
                            text: "PRIVATE",
                            path: "/hei-staff/institutions/private",
                        },
                    ],
                },
            ],
        };
        return items[role] || [];
    }, [user]);



    // Fetch user profile
    const fetchUserProfile = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const storedUser = JSON.parse(localStorage.getItem("user"));

            if (!token) throw new Error("Authentication token missing");
            if (!storedUser?.id) throw new Error("User data not found");

            const response = await axios.get(
                `${config.API_URL}/me`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUser(response.data);
        } catch (err) {
            console.error("Fetch user error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Handle navigation
    const handleNavigation = useCallback(
        (path) => {
            if (!loading) {
                setActiveDropdown(null);
                setMobileMenuOpen(false);
                navigate(path);
            }
        },
        [loading, navigate]
    );

    // Toggle dropdown menu
    const toggleDropdown = useCallback(
        (type) => {
            if (!loading) {
                setActiveDropdown((prev) => (prev === type ? null : type));
            }
        },
        [loading]
    );

    // Handle logout
    const handleLogout = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Authentication token missing");

            await axios.post(
                `${config.API_URL}/auth/logout`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 5000,
                }
            );

            localStorage.clear();
            setUser(null);
            navigate("/", { replace: true });
            window.location.reload();
        } catch (err) {
            console.error("Logout error:", err);
            localStorage.clear();
            setUser(null);
            navigate("/", { replace: true });
            window.location.reload();
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    // Update active tab based on location
    useEffect(() => {
        const currentPath = location.pathname;
        const index = navItems.findIndex((item) => {
            if (item.path) {
                return item.path === currentPath || currentPath.startsWith(item.path + "/");
            } else if (item.dropdown) {
                return item.dropdown.some(
                    (dropItem) =>
                        dropItem.path === currentPath ||
                        currentPath.startsWith(dropItem.path + "/")
                );
            }
            return false;
        });
        setActiveTabIndex(index >= 0 ? index : 0);
    }, [location.pathname, navItems]);

    // Fetch user profile on mount
    useEffect(() => {
        fetchUserProfile();
    }, [fetchUserProfile]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (activeDropdown && !event.target.closest("[data-dropdown]")) {
                setActiveDropdown(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [activeDropdown]);

    // Get dashboard path based on role
    const getDashboardPath = useCallback(() => {
        const paths = {
            "super-admin": "/super-admin/dashboard",
            "hei-admin": "/hei-admin/dashboard",
            "hei-staff": "/hei-staff/dashboard",
        };
        return paths[user?.role] || "/";
    }, [user]);

    // Check if current path matches any dropdown item
    const isDropdownItemActive = useCallback((dropdownItems) => {
        const currentPath = location.pathname;
        return dropdownItems.some(
            (item) =>
                item.path === currentPath ||
                currentPath.startsWith(item.path + "/")
        );
    }, [location.pathname]);

    return (
        <>
            {/* Main Navbar */}
            <nav className="sticky top-0 z-50 bg-[#0038A8] shadow-lg">
                <div className="max-w-[100vw] mx-auto flex justify-between items-center px-4 md:px-6">
                    {/* Logo & Title Section */}
                    <div
                        className="flex items-center gap-3 py-3 cursor-pointer group transition-transform duration-200 hover:scale-[1.01]"
                        onClick={() => handleNavigation(getDashboardPath())}
                    >
                        <div className="relative">
                            <img
                                src={Logo}
                                alt="CHEDRO IX Logo"
                                className="h-12 w-12 object-contain"
                            />
                            {/* Yellow sun-like glow inspired by CHED logo */}
                            <div className="absolute inset-0 bg-[#FCD116]/30 rounded-full filter blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>

                        <div className="flex flex-col">
                            <h1 className="text-xl font-bold text-white tracking-wide">
                                CHEDRO IX
                            </h1>
                            <p className="text-[0.65rem] text-white/80 tracking-wider hidden sm:block">
                                HIGHER EDUCATION MANAGEMENT INFORMATION SYSTEM
                            </p>
                        </div>
                    </div>

                    {/* Right Corner Section */}
                    <div className="flex items-center gap-2">
                        {/* Desktop Menu Links */}
                        <div className="hidden md:flex items-center space-x-1">
                            {navItems.map((item, index) => {
                                const { text, path, icon: Icon, dropdown } = item;
                                const hasDropdown = dropdown && dropdown.length > 0;
                                const isActive = path ?
                                    (activeTabIndex === index) :
                                    (activeTabIndex === index || isDropdownItemActive(dropdown));

                                return (
                                    <div
                                        key={text}
                                        className="relative"
                                        data-dropdown
                                    >
                                        <button
                                            onClick={() => {
                                                if (path) {
                                                    handleNavigation(path);
                                                } else if (hasDropdown) {
                                                    toggleDropdown(`nav-${index}`);
                                                }
                                            }}
                                            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all
                                                ${
                                                    isActive
                                                        ? "text-white bg-white/15"
                                                        : "text-white/85 hover:text-white hover:bg-white/10"
                                                }
                                                ${
                                                    loading
                                                        ? "cursor-not-allowed opacity-60"
                                                        : "hover:translate-y-[-1px]"
                                                }
                                            `}
                                            disabled={loading}
                                        >
                                            {Icon && (
                                                <Icon
                                                    size={16}
                                                    className="shrink-0"
                                                />
                                            )}
                                            <span>{text}</span>
                                            {hasDropdown && (
                                                <ChevronDown
                                                    size={14}
                                                    className={`transition-transform duration-200 ${
                                                        activeDropdown === `nav-${index}` ? "rotate-180" : ""
                                                    }`}
                                                />
                                            )}
                                        </button>

                                        {/* Navigation Dropdown */}
                                        {hasDropdown && activeDropdown === `nav-${index}` && (
                                            <div className="absolute top-full left-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-1 z-50 animate-fadeIn">
                                                {dropdown.map((dropItem) => (
                                                    <button
                                                        key={dropItem.text}
                                                        onClick={() => handleNavigation(dropItem.path)}
                                                        className="flex items-center w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                                                    >
                                                        {dropItem.icon && (
                                                            <dropItem.icon
                                                                size={16}
                                                                className="mr-2 text-[#0038A8]"
                                                            />
                                                        )}
                                                        {dropItem.text}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* User Menu & Mobile Toggle */}
                        <div className="flex items-center gap-2">
                            {/* User Menu */}
                            {loading ? (
                                <div className="h-8 w-8 rounded-full bg-white/20 animate-pulse"></div>
                            ) : user ? (
                                <div className="relative" data-dropdown>
                                    <button
                                        onClick={() => toggleDropdown("user")}
                                        className="flex items-center space-x-1 group"
                                        aria-expanded={
                                            activeDropdown === "user"
                                        }
                                        aria-haspopup="true"
                                    >
                                        <div className="relative w-9 h-9 overflow-hidden rounded-full border-2 border-[#FCD116] group-hover:border-white transition-colors">
                                            <img
                                                src={user.profile_image || DP}
                                                alt="User"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <ChevronDown
                                            size={16}
                                            className={`text-white transition-transform duration-200 ${
                                                activeDropdown === "user" ? "rotate-180" : ""
                                            }`}
                                        />
                                    </button>

                                    {/* User Dropdown */}
                                    {activeDropdown === "user" && (
                                        <div className="absolute right-0 mt-1 w-52 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-1 z-50 animate-fadeIn">
                                            <div className="px-4 py-2 border-b border-gray-100">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {user.email}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    setActiveDropdown(null);
                                                    setOpenProfileDialog(true);
                                                }}
                                                className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                                            >
                                                <User
                                                    size={16}
                                                    className="mr-2 text-[#0038A8]"
                                                />
                                                My Profile
                                            </button>

                                            <div className="border-t border-gray-100 mt-1 pt-1">
                                                <button
                                                    onClick={() => {
                                                        setActiveDropdown(null);
                                                        handleLogout();
                                                    }}
                                                    className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                                                    disabled={loading}
                                                >
                                                    <LogOut
                                                        size={16}
                                                        className="mr-2"
                                                    />
                                                    {loading
                                                        ? "Logging out..."
                                                        : "Logout"}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : null}

                            {/* Mobile Menu Button */}
                            <button
                                className="md:hidden p-2 rounded-md text-white hover:bg-white/10 focus:outline-none"
                                onClick={() =>
                                    setMobileMenuOpen(!mobileMenuOpen)
                                }
                            >
                                {mobileMenuOpen ? (
                                    <X size={20} aria-hidden="true" />
                                ) : (
                                    <Menu size={20} aria-hidden="true" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-[#0038A8] border-t border-white/10">
                        <div className="px-4 py-2 space-y-1">
                            {navItems.map((item, index) => {
                                const { text, path, icon: Icon, dropdown } = item;
                                const hasDropdown = dropdown && dropdown.length > 0;
                                const isActive = path ?
                                    (activeTabIndex === index) :
                                    (activeTabIndex === index || isDropdownItemActive(dropdown));

                                return (
                                    <div key={text} data-dropdown>
                                        <button
                                            onClick={() => {
                                                if (path) {
                                                    handleNavigation(path);
                                                } else if (hasDropdown) {
                                                    toggleDropdown(`mobile-nav-${index}`);
                                                }
                                            }}
                                            className={`flex items-center justify-between w-full px-3 py-2 rounded-md text-sm font-medium transition-colors
                                                ${
                                                    isActive
                                                        ? "text-white bg-white/15"
                                                        : "text-white/85 hover:text-white hover:bg-white/10"
                                                }
                                            `}
                                        >
                                            <div className="flex items-center gap-2">
                                                {Icon && <Icon size={16} />}
                                                <span>{text}</span>
                                            </div>
                                            {hasDropdown && (
                                                <ChevronDown
                                                    size={14}
                                                    className={`transition-transform duration-200 ${
                                                        activeDropdown === `mobile-nav-${index}` ? "rotate-180" : ""
                                                    }`}
                                                />
                                            )}
                                        </button>

                                        {/* Mobile Dropdown */}
                                        {hasDropdown && activeDropdown === `mobile-nav-${index}` && (
                                            <div className="ml-4 mt-1 space-y-1">
                                                {dropdown.map((dropItem) => (
                                                    <button
                                                        key={dropItem.text}
                                                        onClick={() => handleNavigation(dropItem.path)}
                                                        className="flex items-center w-full text-left px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                                                    >
                                                        {dropItem.icon && (
                                                            <dropItem.icon
                                                                size={14}
                                                                className="mr-2"
                                                            />
                                                        )}
                                                        {dropItem.text}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </nav>

            {/* Red strip beneath the navbar */}
            <div className="h-1 bg-[#CD0000] w-full shadow-sm"></div>

            {/* Animation Keyframes */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out forwards;
                }
            `}</style>

            {/* Profile Dialog and Snackbar */}
            <ProfileDialog
                open={openProfileDialog}
                onClose={() => setOpenProfileDialog(false)}
                user={user}
                setUser={setUser}
                fetchUserProfile={fetchUserProfile}
            />

        </>
    );
};

export default Navbar;
