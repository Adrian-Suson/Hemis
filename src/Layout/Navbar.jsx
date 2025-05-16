import { useNavigate, useLocation } from "react-router-dom";
import { useState, useMemo, useEffect, useCallback } from "react";
import axios from "axios";
import config from "../utils/config";
import DP from "../assets/Profile.png";
import Logo from "../assets/ChedLogo.png";
import ProfileDialog from "./ProfileDialog";
import CustomSnackbar from "../Components/CustomSnackbar";
import {
    Menu,
    ChevronDown,
    User,
    LogOut,
    X,
    UserPlus,
    LayoutDashboard,
    Building,
} from "lucide-react";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [activeDropdown, setActiveDropdown] = useState(null);
    const [user, setUser] = useState(null);
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const [openProfileDialog, setOpenProfileDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "info",
    });
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Navigation items based on user role
    const navItems = useMemo(() => {
        const role = user?.role;
        const items = {
            "Super Admin": [
                {
                    text: "Dashboard",
                    path: "/super-admin/dashboard",
                    icon: LayoutDashboard,
                },
                {
                    text: "Institutions",
                    path: "/super-admin/institutions",
                    icon: Building,
                },
            ],
            "HEI Admin": [
                {
                    text: "Dashboard",
                    path: "/hei-admin/dashboard",
                    icon: LayoutDashboard,
                },
                {
                    text: "Institutions",
                    path: "/hei-admin/institutions",
                    icon: Building,
                },
            ],
            "HEI Staff": [
                {
                    text: "Dashboard",
                    path: "/hei-staff/dashboard",
                    icon: LayoutDashboard,
                },
                {
                    text: "Institutions",
                    path: "/hei-staff/institutions",
                    icon: Building,
                },
            ], // Added "Institutions" back for HEI Staff
        };
        return items[role] || [];
    }, [user]);

    // Show snackbar
    const showSnackbar = useCallback((message, severity = "info") => {
        setSnackbar({ open: true, message, severity });
    }, []);

    // Close snackbar
    const handleSnackbarClose = useCallback(() => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    }, []);

    // Fetch user profile
    const fetchUserProfile = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const storedUser = JSON.parse(localStorage.getItem("user"));

            if (!token) throw new Error("Authentication token missing");
            if (!storedUser?.id) throw new Error("User data not found");

            const response = await axios.get(
                `${config.API_URL}/users/${storedUser.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUser(response.data);
        } catch (err) {
            console.error("Fetch user error:", err);
            showSnackbar(err.message || "Unable to load user profile", "error");
        } finally {
            setLoading(false);
        }
    }, [showSnackbar]);

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
            showSnackbar("Logout failed, clearing session", "error");
            localStorage.clear();
            setUser(null);
            navigate("/", { replace: true });
            window.location.reload();
        } finally {
            setLoading(false);
        }
    }, [navigate, showSnackbar]);

    // Update active tab based on location
    useEffect(() => {
        const currentPath = location.pathname;
        const index = navItems.findIndex(
            (item) =>
                item.path === currentPath ||
                currentPath.startsWith(item.path + "/")
        );
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
            "Super Admin": "/super-admin/dashboard",
            "HEI Admin": "/hei-admin/dashboard",
            "HEI Staff": "/hei-staff/dashboard",
        };
        return paths[user?.role] || "/";
    }, [user]);

    return (
        <>
            {/* Main Navbar - CHED Color Scheme */}
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
                            {navItems.map(
                                ({ text, path, icon: Icon }, index) => (
                                    <div
                                        key={text}
                                        className="relative"
                                        data-dropdown
                                    >
                                        <button
                                            onClick={() =>
                                                handleNavigation(path)
                                            }
                                            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all
                                            ${
                                                activeTabIndex === index
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
                                        </button>
                                    </div>
                                )
                            )}
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
                                            className="text-white"
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

                                            {/* User Management or Staff Management */}
                                            {user.role !== "HEI Staff" && ( // Hide User Management for HEI Staff
                                                <button
                                                    onClick={() => {
                                                        setActiveDropdown(null);
                                                        handleNavigation(
                                                            user.role ===
                                                                "HEI Admin"
                                                                ? "/hei-admin/staff-management"
                                                                : "/super-admin/user-management"
                                                        );
                                                    }}
                                                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                                                >
                                                    <UserPlus
                                                        size={16}
                                                        className="mr-2 text-[#0038A8]"
                                                    />
                                                    {user.role === "HEI Admin"
                                                        ? "Staff Management"
                                                        : "User Management"}
                                                </button>
                                            )}

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
            </nav>

            {/* Red strip beneath the navbar - inspired by CHED logo */}
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

            <CustomSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={handleSnackbarClose}
                autoHideDuration={5000}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            />
        </>
    );
};

export default Navbar;
