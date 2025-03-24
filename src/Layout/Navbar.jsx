import {
    AppBar,
    Toolbar,
    Box,
    Typography,
    useTheme,
    Avatar,
    Menu,
    MenuItem,
    Divider,
    Tabs,
    Tab,
    CircularProgress,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import config from "../utils/config";
import DP from "../assets/Profile.png";
import Logo from "../assets/ChedLogo.png";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ProfileDialog from "./ProfileDialog";
import CustomSnackbar from "../Components/CustomSnackbar";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();

    const [anchorEl, setAnchorEl] = useState(null);
    const [adminMenuAnchorEl, setAdminMenuAnchorEl] = useState(null);
    const [user, setUser] = useState(null);
    const [value, setValue] = useState(0);
    const [openProfileDialog, setOpenProfileDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("info");

    // Role-based navigation items
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
                { text: "Institutions", path: "/hei-admin/institutions" }, // Note: Using hei-admin path here, might need adjustment
            ];
        }
        return [];
    }, [user]);

    // Fetch user profile
    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const storedUser = JSON.parse(localStorage.getItem("user"));
            const response = await axios.get(
                `${config.API_URL}/users/${storedUser.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUser(response.data);
        } catch (err) {
            console.error("Failed to fetch user:", err);
            setSnackbarMessage("Failed to load user profile.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const handleNavigation = (path) => {
        navigate(path);
    };

    const handleTabChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleMenuOpen = (event, type) => {
        if (type === "avatar") setAnchorEl(event.currentTarget);
        else if (type === "admin") setAdminMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setAdminMenuAnchorEl(null);
    };

    const handleLogout = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            await axios.post(
                `${config.API_URL}/auth/logout`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            localStorage.clear();
            navigate("/", { replace: true });
            window.location.reload(false);
        } catch (err) {
            console.error("Logout failed:", err);
            setSnackbarMessage("Logout failed.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            localStorage.clear();
            navigate("/", { replace: true });
            window.location.reload(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const currentPath = location.pathname;
        const activeTabIndex = navItems.findIndex(
            (item) =>
                item.path === currentPath ||
                currentPath.startsWith(item.path + "/")
        );
        if (activeTabIndex >= 0) setValue(activeTabIndex);
    }, [location.pathname, navItems]);

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    // Admin menu items based on role
    const adminMenuItems = useMemo(() => {
        if (user?.role === "Super Admin") {
            return [
                {
                    text: "Settings",
                    path: "/super-admin/settings",
                },
                {
                    text: "User Management",
                    path: "/super-admin/user-management",
                },
            ];
        } else if (user?.role === "HEI Admin") {
            return [
                {
                    text: "Settings",
                    path: "/hei-admin/settings",
                },
                {
                    text: "Staff Management",
                    path: "/hei-admin/staff-management",
                },
            ];
        }
        return [];
    }, [user]);

    return (
        <>
            <AppBar
                position="static"
                sx={{
                    background: "linear-gradient(90deg, #ffffff, #f5f5f5)",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    borderBottom: `1px solid ${theme.palette.divider}`,
                }}
            >
                <Toolbar
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        minHeight: "64px !important",
                        px: { xs: 2, md: 3 },
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                        }}
                        onClick={() =>
                            handleNavigation(
                                user?.role === "Super Admin"
                                    ? "/super-admin/dashboard"
                                    : user?.role === "HEI Admin"
                                    ? "/hei-admin/dashboard"
                                    : "/hei-staff/dashboard"
                            )
                        }
                    >
                        <img
                            src={Logo}
                            alt="CHEDRO IX Logo"
                            style={{
                                width: 40,
                                height: 40,
                                marginRight: "8px",
                            }}
                        />
                        <Typography
                            variant="h6"
                            sx={{ fontWeight: 600, color: "black" }}
                        >
                            CHEDRO IX
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Tabs
                            value={value}
                            onChange={handleTabChange}
                            textColor="primary"
                            indicatorColor="primary"
                        >
                            {navItems.map(({ text, path, isAdmin }, index) =>
                                isAdmin ? (
                                    <Tab
                                        key={text}
                                        label={
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                }}
                                            >
                                                {text}
                                                <KeyboardArrowDownIcon fontSize="small" />
                                            </Box>
                                        }
                                        onClick={(e) =>
                                            handleMenuOpen(e, "admin")
                                        }
                                        sx={{
                                            fontWeight: 400,
                                            textTransform: "none",
                                            color:
                                                value === index
                                                    ? theme.palette.primary.main
                                                    : theme.palette.text
                                                          .primary,
                                        }}
                                        disabled={loading}
                                    />
                                ) : (
                                    <Tab
                                        key={text}
                                        label={text}
                                        onClick={() => handleNavigation(path)}
                                        sx={{
                                            fontWeight: 400,
                                            textTransform: "none",
                                            color:
                                                value === index
                                                    ? theme.palette.primary.main
                                                    : theme.palette.text
                                                          .primary,
                                        }}
                                        disabled={loading}
                                    />
                                )
                            )}
                        </Tabs>

                        {loading ? (
                            <CircularProgress size={24} sx={{ ml: 2 }} />
                        ) : user ? (
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    cursor: "pointer",
                                }}
                                onClick={(e) => handleMenuOpen(e, "avatar")}
                            >
                                <Avatar
                                    sx={{
                                        bgcolor: theme.palette.primary.main,
                                        width: 40,
                                        height: 40,
                                        marginLeft: "16px",
                                    }}
                                    src={user.profile_image || DP}
                                >
                                    {(user.name && user.name[0]) || ""}
                                </Avatar>
                                <KeyboardArrowDownIcon
                                    fontSize="small"
                                    sx={{
                                        color: theme.palette.text.secondary,
                                        ml: 0.5,
                                    }}
                                />
                            </Box>
                        ) : null}

                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "right",
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            PaperProps={{
                                elevation: 3,
                                sx: { mt: 1.5, minWidth: 180, borderRadius: 1 },
                            }}
                        >
                            <MenuItem
                                onClick={() => {
                                    handleMenuClose();
                                    setOpenProfileDialog(true);
                                }}
                                disabled={loading}
                            >
                                Profile
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={handleLogout} disabled={loading}>
                                Logout
                            </MenuItem>
                        </Menu>

                        <Menu
                            anchorEl={adminMenuAnchorEl}
                            open={Boolean(adminMenuAnchorEl)}
                            onClose={handleMenuClose}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "center",
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "center",
                            }}
                            PaperProps={{
                                elevation: 3,
                                sx: { mt: 1.5, minWidth: 180, borderRadius: 1 },
                            }}
                        >
                            {adminMenuItems.map((item) => (
                                <MenuItem
                                    key={item.text}
                                    onClick={() => {
                                        handleMenuClose();
                                        handleNavigation(item.path);
                                    }}
                                    disabled={loading}
                                >
                                    {item.text}
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>

            <ProfileDialog
                open={openProfileDialog}
                onClose={() => setOpenProfileDialog(false)}
                user={user}
                setUser={setUser}
                fetchUserProfile={fetchUserProfile}
            />

            <CustomSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={handleSnackbarClose}
                autoHideDuration={5000}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            />
        </>
    );
};

export default Navbar;
