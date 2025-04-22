import { useNavigate, useLocation } from "react-router-dom";
import { useState, useMemo, useEffect, useCallback } from "react";
import axios from "axios";
import config from "../utils/config";
import DP from "../assets/Profile.png";
import Logo from "../assets/ChedLogo.png";
import ProfileDialog from "./ProfileDialog";
import CustomSnackbar from "../Components/CustomSnackbar";
import { Skeleton, Paper, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { FaAngleDown } from "react-icons/fa6";
import CloseIcon from "@mui/icons-material/Close";

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

    // Memoized DownArrow component
    const DownArrow = useMemo(
        () => (
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ marginLeft: "4px" }}
            >
                <path d="M6 9l6 6 6-6" />
            </svg>
        ),
        []
    );

    // Navigation items based on user role
    const navItems = useMemo(() => {
        const role = user?.role;
        const items = {
            "Super Admin": [
                { text: "Dashboard", path: "/super-admin/dashboard" },
                { text: "Institutions", path: "/super-admin/institutions" },
               // { text: "Admin", path: "/super-admin", isAdmin: true },
               /* {
                    text: "User Management",
                    path: "/super-admin/user-management",
                },*/
            ],
            "HEI Admin": [
                { text: "Dashboard", path: "/hei-admin/dashboard" },
                { text: "Institutions", path: "/hei-admin/institutions" },
                { text: "Admin", path: "/hei-admin", isAdmin: true },
            ],
            "HEI Staff": [
                { text: "Dashboard", path: "/hei-staff/dashboard" },
                { text: "Institutions", path: "/hei-admin/institutions" },
            ],
        };
        return items[role] || [];
    }, [user]);

    // Admin menu items based on role
    const adminMenuItems = useMemo(() => {
        const items = {
            "Super Admin": [
                {
                    text: "User Management",
                    path: "/super-admin/user-management",
                },
            ],
            "HEI Admin": [
                {
                    text: "Staff Management",
                    path: "/hei-admin/staff-management",
                },
            ],
        };
        return items[user?.role] || [];
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

    // Open dropdown menu
    const handleMenuOpen = useCallback(
        (type) => {
            if (!loading) setActiveDropdown(type);
        },
        [loading]
    );

    // Close dropdown menu
    const handleMenuClose = useCallback(() => {
        setActiveDropdown(null);
    }, []);

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
            <nav
                style={{
                    background: "rgba(25, 118, 210, 0.95)",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
                    position: "sticky",
                    top: 0,
                    zIndex: 1000,
                    width: "100%",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        minHeight: "70px",
                        padding: "0 24px 0 0",
                    }}
                >
                    {/* Left Section: Logo and CHEDRO IX */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                            transition: "transform 0.2s ease",
                            marginLeft: "10px", // Ensure no extra margin
                        }}
                        onClick={() => handleNavigation(getDashboardPath())}
                        onMouseOver={(e) =>
                            (e.currentTarget.style.transform = "scale(1.02)")
                        }
                        onMouseOut={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                        }
                        aria-label="Navigate to dashboard"
                    >
                        <img
                            src={Logo}
                            alt="CHEDRO IX Logo"
                            style={{
                                width: "45px",
                                height: "45px",
                                marginRight: "12px",
                                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                            }}
                        />
                        <div
                            style={{ display: "flex", flexDirection: "column" }}
                        >
                            <span
                                style={{
                                    fontSize: "1.5rem",
                                    fontWeight: 800,
                                    color: "#fff",
                                    letterSpacing: "0.5px",
                                }}
                            >
                                CHEDRO IX
                            </span>
                            <span
                                style={{
                                    fontSize: "0.8rem",
                                    color: "rgba(255, 255, 255, 0.8)",
                                    letterSpacing: "1px",
                                }}
                            >
                                HIGHER EDUCATION MANAGEMENT INFORMATION SYSTEM
                            </span>
                        </div>
                    </div>

                    {/* Right Section: Nav Items, User Profile, Mobile Toggle */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "24px",
                        }}
                    >
                        {/* Desktop Nav Items */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "16px",
                            }}
                            className="desktop-nav"
                        >
                            {navItems.map(({ text, path, isAdmin }, index) => (
                                <div
                                    key={text}
                                    style={{ position: "relative" }}
                                >
                                    <button
                                        onClick={() =>
                                            isAdmin
                                                ? handleMenuOpen("admin")
                                                : handleNavigation(path)
                                        }
                                        onMouseEnter={() =>
                                            isAdmin && handleMenuOpen("admin")
                                        }
                                        disabled={loading}
                                        style={{
                                            padding: "8px 16px",
                                            background:
                                                activeTabIndex === index
                                                    ? "rgba(255,255,255,0.1)"
                                                    : "transparent",
                                            border: "none",
                                            borderRadius: "8px",
                                            cursor: loading
                                                ? "not-allowed"
                                                : "pointer",
                                            color:
                                                activeTabIndex === index
                                                    ? "#fff"
                                                    : "rgba(255,255,255,0.85)",
                                            fontWeight: 500,
                                            fontSize: "0.95rem",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "6px",
                                            transition: "all 0.2s ease",
                                        }}
                                        onMouseOver={(e) => {
                                            if (!loading) {
                                                e.currentTarget.style.background =
                                                    "rgba(255,255,255,0.15)";
                                                e.currentTarget.style.transform =
                                                    "translateY(-1px)";
                                            }
                                        }}
                                        onMouseOut={(e) => {
                                            if (!loading) {
                                                e.currentTarget.style.background =
                                                    activeTabIndex === index
                                                        ? "rgba(255,255,255,0.1)"
                                                        : "transparent";
                                                e.currentTarget.style.transform =
                                                    "translateY(0)";
                                            }
                                        }}
                                        aria-label={text}
                                    >
                                        {text}
                                        {isAdmin && DownArrow}
                                    </button>

                                    {isAdmin && activeDropdown === "admin" && (
                                        <Paper
                                            elevation={3}
                                            style={{
                                                position: "absolute",
                                                top: "calc(100% + 8px)",
                                                left: "50%",
                                                transform: "translateX(-50%)",
                                                background:
                                                    "rgba(255, 255, 255, 0.98)",
                                                borderRadius: "12px",
                                                minWidth: "220px",
                                                overflow: "hidden",
                                                animation:
                                                    "dropdownFade 0.2s ease",
                                            }}
                                            onMouseLeave={handleMenuClose}
                                        >
                                            {adminMenuItems.map((item) => (
                                                <button
                                                    key={item.text}
                                                    onClick={() => {
                                                        handleMenuClose();
                                                        handleNavigation(
                                                            item.path
                                                        );
                                                    }}
                                                    disabled={loading}
                                                    style={{
                                                        width: "100%",
                                                        padding: "12px 16px",
                                                        background: "none",
                                                        border: "none",
                                                        textAlign: "left",
                                                        cursor: loading
                                                            ? "not-allowed"
                                                            : "pointer",
                                                        opacity: loading
                                                            ? 0.6
                                                            : 1,
                                                        transition:
                                                            "background-color 0.2s ease",
                                                        fontSize: "0.9rem",
                                                        color: "#333",
                                                    }}
                                                    aria-label={item.text}
                                                >
                                                    {item.text}
                                                </button>
                                            ))}
                                        </Paper>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* User Profile */}
                        {loading ? (
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <Skeleton
                                    variant="circular"
                                    width={40}
                                    height={40}
                                    sx={{ bgcolor: "grey.200" }}
                                />
                                <Skeleton
                                    variant="rectangular"
                                    width={16}
                                    height={16}
                                    sx={{ ml: 1, bgcolor: "grey.200" }}
                                />
                            </div>
                        ) : user ? (
                            <div style={{ position: "relative" }}>
                                <div
                                    onClick={() => handleMenuOpen("avatar")}
                                    onMouseEnter={() =>
                                        handleMenuOpen("avatar")
                                    }
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        cursor: "pointer",
                                    }}
                                    aria-label="User profile"
                                >
                                    <img
                                        src={user.profile_image || DP}
                                        alt="Profile"
                                        style={{
                                            width: "40px",
                                            height: "40px",
                                            borderRadius: "50%",
                                            backgroundColor: "#ffffff",
                                            border: "2px solid #004ba0",
                                        }}
                                    />
                                    <FaAngleDown
                                        style={{
                                            color: "#fff",
                                            marginLeft: "2px",
                                        }}
                                    />
                                </div>

                                {activeDropdown === "avatar" && (
                                    <Paper
                                        elevation={3}
                                        style={{
                                            position: "absolute",
                                            top: "100%",
                                            right: 0,
                                            background: "#ffffff",
                                            boxShadow:
                                                "0 4px 8px rgba(0,0,0,0.2)",
                                            borderRadius: "8px",
                                            minWidth: "200px",
                                            zIndex: 1000,
                                            border: "1px solid #e0e0e0",
                                            overflow: "hidden",
                                        }}
                                        onMouseLeave={handleMenuClose}
                                    >
                                        <button
                                            onClick={() => {
                                                handleMenuClose();
                                                setOpenProfileDialog(true);
                                            }}
                                            disabled={loading}
                                            style={{
                                                width: "100%",
                                                padding: "12px 16px",
                                                background: "none",
                                                border: "none",
                                                textAlign: "left",
                                                cursor: loading
                                                    ? "not-allowed"
                                                    : "pointer",
                                                opacity: loading ? 0.6 : 1,
                                                fontSize: "0.9rem",
                                                color: "#333",
                                            }}
                                            aria-label="View profile"
                                        >
                                            Profile
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleMenuClose();
                                                handleNavigation(
                                                    "/super-admin/user-management"
                                                );
                                            }}
                                            disabled={loading}
                                            style={{
                                                width: "100%",
                                                padding: "12px 16px",
                                                background: "none",
                                                border: "none",
                                                textAlign: "left",
                                                cursor: loading
                                                    ? "not-allowed"
                                                    : "pointer",
                                                opacity: loading ? 0.6 : 1,
                                                fontSize: "0.9rem",
                                                color: "#333",
                                            }}
                                            aria-label="User Management"
                                        >
                                            User Management
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            disabled={loading}
                                            style={{
                                                width: "100%",
                                                padding: "12px 16px",
                                                background: "none",
                                                border: "none",
                                                textAlign: "left",
                                                cursor: loading
                                                    ? "not-allowed"
                                                    : "pointer",
                                                opacity: loading ? 0.6 : 1,
                                                fontSize: "0.9rem",
                                                color: "#333",
                                            }}
                                            aria-label="Logout"
                                        >
                                            {loading
                                                ? "Logging out..."
                                                : "Logout"}
                                        </button>
                                    </Paper>
                                )}
                            </div>
                        ) : null}

                        {/* Mobile Menu Toggle */}
                        <IconButton
                            className="mobile-toggle"
                            onClick={() => setMobileMenuOpen((prev) => !prev)}
                            style={{ display: "none", color: "#fff" }}
                            aria-label={
                                mobileMenuOpen ? "Close menu" : "Open menu"
                            }
                        >
                            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                        </IconButton>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div
                        style={{
                            background: "rgba(25, 118, 210, 0.95)",
                            padding: "16px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                        }}
                        className="mobile-nav"
                    >
                        {navItems.map(({ text, path, isAdmin }, index) => (
                            <div key={text} style={{ position: "relative" }}>
                                <button
                                    onClick={() =>
                                        isAdmin
                                            ? handleMenuOpen("admin")
                                            : handleNavigation(path)
                                    }
                                    disabled={loading}
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        background:
                                            activeTabIndex === index
                                                ? "rgba(255,255,255,0.1)"
                                                : "transparent",
                                        border: "none",
                                        borderRadius: "8px",
                                        cursor: loading
                                            ? "not-allowed"
                                            : "pointer",
                                        color:
                                            activeTabIndex === index
                                                ? "#fff"
                                                : "rgba(255,255,255,0.85)",
                                        fontWeight: 500,
                                        fontSize: "0.95rem",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                    aria-label={text}
                                >
                                    {text}
                                    {isAdmin && DownArrow}
                                </button>

                                {isAdmin && activeDropdown === "admin" && (
                                    <div
                                        style={{
                                            background: "#fff",
                                            borderRadius: "8px",
                                            marginTop: "4px",
                                            padding: "8px 0",
                                        }}
                                    >
                                        {adminMenuItems.map((item) => (
                                            <button
                                                key={item.text}
                                                onClick={() => {
                                                    handleMenuClose();
                                                    handleNavigation(item.path);
                                                }}
                                                disabled={loading}
                                                style={{
                                                    width: "100%",
                                                    padding: "12px 16px",
                                                    background: "none",
                                                    border: "none",
                                                    textAlign: "left",
                                                    cursor: loading
                                                        ? "not-allowed"
                                                        : "pointer",
                                                    fontSize: "0.9rem",
                                                    color: "#333",
                                                }}
                                                aria-label={item.text}
                                            >
                                                {item.text}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        {user && (
                            <>
                                <button
                                    onClick={() => {
                                        handleMenuClose();
                                        setOpenProfileDialog(true);
                                    }}
                                    disabled={loading}
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        background: "transparent",
                                        border: "none",
                                        borderRadius: "8px",
                                        cursor: loading
                                            ? "not-allowed"
                                            : "pointer",
                                        color: "rgba(255,255,255,0.85)",
                                        fontWeight: 500,
                                        fontSize: "0.95rem",
                                        textAlign: "left",
                                    }}
                                    aria-label="View profile"
                                >
                                    Profile
                                </button>
                                <button
                                    onClick={handleLogout}
                                    disabled={loading}
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        background: "transparent",
                                        border: "none",
                                        borderRadius: "8px",
                                        cursor: loading
                                            ? "not-allowed"
                                            : "pointer",
                                        color: "rgba(255,255,255,0.85)",
                                        fontWeight: 500,
                                        fontSize: "0.95rem",
                                        textAlign: "left",
                                    }}
                                    aria-label="Logout"
                                >
                                    {loading ? "Logging out..." : "Logout"}
                                </button>
                            </>
                        )}
                    </div>
                )}
            </nav>

            <style>
                {`
          @keyframes dropdownFade {
            from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
            to { opacity: 1; transform: translateX(-50%) translateY(0); }
          }

          nav button:hover:not(:disabled) {
            background: rgba(255,255,255,0.15) !important;
            transform: translateY(-1px);
          }

          .desktop-nav {
            display: flex;
          }

          .mobile-nav,
          .mobile-toggle {
            display: none;
          }

          @media (max-width: 768px) {
            .desktop-nav {
              display: none;
            }

            .mobile-toggle {
              display: block;
            }

            .mobile-nav {
              display: ${mobileMenuOpen ? "flex" : "none"};
            }
          }
        `}
            </style>

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
