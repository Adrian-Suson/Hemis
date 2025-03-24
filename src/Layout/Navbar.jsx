import { useNavigate, useLocation } from "react-router-dom";
import { useState, useMemo, useEffect, useCallback } from "react";
import axios from "axios";
import config from "../utils/config";
import DP from "../assets/Profile.png";
import Logo from "../assets/ChedLogo.png";
import ProfileDialog from "./ProfileDialog";
import CustomSnackbar from "../Components/CustomSnackbar";
// Import Skeleton from MUI
import { Skeleton } from "@mui/material";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [activeDropdown, setActiveDropdown] = useState(null); // Single state for active dropdown
    const [user, setUser] = useState(null);
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const [openProfileDialog, setOpenProfileDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "info",
    });

    const DownArrow = () => (
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
    );

    const navItems = useMemo(() => {
        const role = user?.role;
        if (role === "Super Admin") {
            return [
                { text: "Dashboard", path: "/super-admin/dashboard" },
                { text: "Institutions", path: "/super-admin/institutions" },
                { text: "Admin", path: "/super-admin", isAdmin: true },
            ];
        } else if (role === "HEI Admin") {
            return [
                { text: "Dashboard", path: "/hei-admin/dashboard" },
                { text: "Institutions", path: "/hei-admin/institutions" },
                { text: "Admin", path: "/hei-admin", isAdmin: true },
            ];
        } else if (role === "HEI Staff") {
            return [
                { text: "Dashboard", path: "/hei-staff/dashboard" },
                { text: "Institutions", path: "/hei-admin/institutions" },
            ];
        }
        return [];
    }, [user]);

    const adminMenuItems = useMemo(() => {
        if (user?.role === "Super Admin") {
            return [
                { text: "Settings", path: "/super-admin/settings" },
                {
                    text: "User Management",
                    path: "/super-admin/user-management",
                },
            ];
        } else if (user?.role === "HEI Admin") {
            return [
                { text: "Settings", path: "/hei-admin/settings" },
                {
                    text: "Staff Management",
                    path: "/hei-admin/staff-management",
                },
            ];
        }
        return [];
    }, [user]);

    const showSnackbar = useCallback((message, severity = "info") => {
        setSnackbar({ open: true, message, severity });
    }, []);

    const handleSnackbarClose = useCallback(() => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    }, []);

    const fetchUserProfile = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No authentication token found");

            const storedUser = JSON.parse(localStorage.getItem("user"));
            if (!storedUser?.id) throw new Error("No user data found");

            const response = await axios.get(
                `${config.API_URL}/users/${storedUser.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUser(response.data);
        } catch (err) {
            console.error("Failed to fetch user:", err);
            showSnackbar(
                err.message || "Failed to load user profile.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    }, [showSnackbar]);

    const handleNavigation = useCallback(
        (path) => {
            if (!loading) {
                setActiveDropdown(null); // Close any open dropdown on navigation
                navigate(path);
            }
        },
        [loading, navigate]
    );

    const handleMenuOpen = useCallback((event, type) => {
        setActiveDropdown(type); // Set only the clicked dropdown as active
    }, []);

    const handleMenuClose = useCallback(() => {
        setActiveDropdown(null); // Close all dropdowns
    }, []);

    const handleLogout = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No authentication token found");

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
            console.error("Logout failed:", err);
            localStorage.clear();
            setUser(null);
            navigate("/", { replace: true });
            window.location.reload();
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        const currentPath = location.pathname;
        const index = navItems.findIndex(
            (item) =>
                item.path === currentPath ||
                currentPath.startsWith(item.path + "/")
        );
        if (index >= 0) setActiveTabIndex(index);
    }, [location.pathname, navItems]);

    useEffect(() => {
        fetchUserProfile();
    }, [fetchUserProfile]);

    const getDashboardPath = useCallback(() => {
        if (user?.role === "Super Admin") return "/super-admin/dashboard";
        if (user?.role === "HEI Admin") return "/hei-admin/dashboard";
        return "/hei-staff/dashboard";
    }, [user]);

    return (
        <>
            <nav
                style={{
                    background: "linear-gradient(90deg, #ffffff, #f5f5f5)",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    borderBottom: "1px solid #e0e0e0",
                    position: "static",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        minHeight: "64px",
                        padding: "0 24px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                        }}
                        onClick={() => handleNavigation(getDashboardPath())}
                    >
                        <img
                            src={Logo}
                            alt="CHEDRO IX Logo"
                            style={{
                                width: "40px",
                                height: "40px",
                                marginRight: "8px",
                            }}
                        />
                        <span
                            style={{
                                fontSize: "1.5rem",
                                fontWeight: 600,
                                color: "black",
                            }}
                        >
                            CHEDRO IX
                        </span>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                        }}
                    >
                        <div style={{ display: "flex", gap: "16px" }}>
                            {navItems.map(({ text, path, isAdmin }, index) => (
                                <div
                                    key={text}
                                    style={{ position: "relative" }}
                                >
                                    <button
                                        onClick={(e) =>
                                            isAdmin
                                                ? handleMenuOpen(e, "admin")
                                                : handleNavigation(path)
                                        }
                                        onMouseEnter={(e) =>
                                            isAdmin &&
                                            handleMenuOpen(e, "admin")
                                        }
                                        disabled={loading}
                                        style={{
                                            padding: "8px 16px",
                                            background: "none",
                                            border: "none",
                                            cursor: loading
                                                ? "not-allowed"
                                                : "pointer",
                                            color:
                                                activeTabIndex === index
                                                    ? "#1976d2"
                                                    : "#000",
                                            fontWeight: 400,
                                            display: "flex",
                                            alignItems: "center",
                                            opacity: loading ? 0.6 : 1,
                                            transition: "color 0.3s ease",
                                        }}
                                    >
                                        {text}
                                        {isAdmin && <DownArrow />}
                                    </button>

                                    {isAdmin && activeDropdown === "admin" && (
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: "100%",
                                                left: "50%",
                                                transform: "translateX(-50%)",
                                                background: "white",
                                                boxShadow:
                                                    "0 2px 4px rgba(0,0,0,0.1)",
                                                borderRadius: "4px",
                                                minWidth: "180px",
                                                zIndex: 1000,
                                                border: "1px solid #e0e0e0",
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
                                                        padding: "8px 16px",
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
                                                    }}
                                                >
                                                    {item.text}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {loading ? (
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginLeft: "16px",
                                }}
                            >
                                {/* Skeleton for the avatar */}
                                <Skeleton
                                    variant="circular"
                                    width={40}
                                    height={40}
                                    sx={{ bgcolor: "grey.200" }}
                                />
                                {/* Skeleton for the down arrow */}
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
                                    onClick={(e) => handleMenuOpen(e, "avatar")}
                                    onMouseEnter={(e) =>
                                        handleMenuOpen(e, "avatar")
                                    }
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        cursor: "pointer",
                                        marginLeft: "16px",
                                    }}
                                >
                                    <img
                                        src={user.profile_image || DP}
                                        alt="Profile"
                                        style={{
                                            width: "40px",
                                            height: "40px",
                                            borderRadius: "50%",
                                            backgroundColor: "#1976d2",
                                            border: "2px solid #e0e0e0",
                                        }}
                                    />
                                    <DownArrow />
                                </div>

                                {activeDropdown === "avatar" && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: "100%",
                                            right: 0,
                                            background: "white",
                                            boxShadow:
                                                "0 2px 4px rgba(0,0,0,0.1)",
                                            borderRadius: "4px",
                                            minWidth: "180px",
                                            zIndex: 1000,
                                            border: "1px solid #e0e0e0",
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
                                                padding: "8px 16px",
                                                background: "none",
                                                border: "none",
                                                textAlign: "left",
                                                cursor: loading
                                                    ? "not-allowed"
                                                    : "pointer",
                                                opacity: loading ? 0.6 : 1,
                                                transition:
                                                    "background-color 0.2s ease",
                                            }}
                                        >
                                            Profile
                                        </button>
                                        <hr style={{ margin: "0" }} />
                                        <button
                                            onClick={handleLogout}
                                            disabled={loading}
                                            style={{
                                                width: "100%",
                                                padding: "8px 16px",
                                                background: "none",
                                                border: "none",
                                                textAlign: "left",
                                                cursor: loading
                                                    ? "not-allowed"
                                                    : "pointer",
                                                opacity: loading ? 0.6 : 1,
                                                transition:
                                                    "background-color 0.2s ease",
                                            }}
                                        >
                                            {loading
                                                ? "Logging out..."
                                                : "Logout"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : null}
                    </div>
                </div>
            </nav>

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
