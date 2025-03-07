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
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import config from "../utils/config";
import DP from "../assets/Profile.png";
import Logo from "../assets/ChedLogo.png";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"; // Import dropdown icon

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();

    const [anchorEl, setAnchorEl] = useState(null);
    const [adminMenuAnchorEl, setAdminMenuAnchorEl] = useState(null);
    const [user, setUser] = useState(null);
    const [value, setValue] = useState(0);

    const navItems = useMemo(
        () => [
            { text: "Dashboard", path: "/admin/dashboard" },
            { text: "Institutions", path: "/admin/institutions" },
            { text: "Program", path: "/admin/program" },
            { text: "Reports", path: "/admin/reports" },
            { text: "Admin", path: "/admin", isAdmin: true },
        ],
        []
    );

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const storedUser = JSON.parse(localStorage.getItem("user"));

                const response = await axios.get(
                    `${config.API_URL}/users/${storedUser.id}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setUser(response.data);
            } catch (error) {
                console.error("Failed to fetch user:", error);
            }
        };

        fetchUserProfile();
    }, []);

    const handleNavigation = (path) => {
        navigate(path);
    };

    const handleTabChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleMenuOpen = (event, type) => {
        if (type === "avatar") {
            setAnchorEl(event.currentTarget);
        } else if (type === "admin") {
            setAdminMenuAnchorEl(event.currentTarget);
        }
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setAdminMenuAnchorEl(null);
    };

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                `${config.API_URL}/auth/logout`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            localStorage.clear();
            navigate("/", { replace: true });
            window.location.reload(false);
        } catch (error) {
            console.error("Logout failed:", error);
            localStorage.clear();
            navigate("/", { replace: true });
            window.location.reload(false);
        }
    };

    useEffect(() => {
        const currentPath = location.pathname;
        const activeTabIndex = navItems.findIndex(
            (item) =>
                item.path === currentPath ||
                currentPath.startsWith(item.path + "/")
        );
        if (activeTabIndex >= 0) {
            setValue(activeTabIndex);
        }
    }, [location.pathname, navItems]);

    return (
        <AppBar
            position="static"
            sx={{
                background: "linear-gradient(90deg, #ffffff, #f5f5f5)",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                borderBottom: `1px solid ${theme.palette.divider}`,
                display: "flex",
                justifyContent: "flex-end",
            }}
        >
            <Toolbar
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    minHeight: "64px !important",
                    px: { xs: 2, md: 3 },
                }}
            >
                {/* Left section with Logo and "Hemis" name */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        marginRight: "auto",
                        cursor: "pointer",
                    }}
                    onClick={() => handleNavigation("/admin/dashboard")}
                >
                    <img
                        src={Logo}
                        alt="Hemis Logo"
                        style={{ width: 40, height: 40, marginRight: "8px" }}
                    />
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 600,
                            color: theme.palette.primary.main,
                        }}
                    >
                        Hemis
                    </Typography>
                </Box>

                {/* Avatar Dropdown And Tabs for navigation */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>

                    <Box sx={{ flexGrow: 1 }}>
                        <Tabs
                            value={value}
                            onChange={handleTabChange}
                            textColor="primary"
                            indicatorColor="primary"
                            sx={{ display: "flex", justifyContent: "flex-end" }}
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
                                    />
                                )
                            )}
                        </Tabs>
                    </Box>
                    {user && (
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
                                src={user.avatar || DP}
                            >
                                {(user.firstName && user.firstName[0]) || ""}
                            </Avatar>
                            <KeyboardArrowDownIcon
                                fontSize="small"
                                sx={{
                                    color: theme.palette.text.secondary,
                                    ml: 0.5,
                                }}
                            />
                        </Box>
                    )}

                    {/* Avatar Dropdown Menu */}
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        MenuListProps={{
                            "aria-labelledby": "profile-button",
                        }}
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
                            sx: {
                                mt: 1.5,
                                minWidth: 180,
                                borderRadius: 1,
                            },
                        }}
                    >
                        <MenuItem
                            onClick={() => {
                                handleMenuClose();
                                handleNavigation("/admin/profile");
                            }}
                        >
                            Profile
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>

                    {/* Admin Dropdown Menu */}
                    <Menu
                        anchorEl={adminMenuAnchorEl}
                        open={Boolean(adminMenuAnchorEl)}
                        onClose={handleMenuClose}
                        MenuListProps={{
                            "aria-labelledby": "admin-button",
                        }}
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
                            sx: {
                                mt: 1.5,
                                minWidth: 180,
                                borderRadius: 1,
                            },
                        }}
                    >
                        <MenuItem
                            onClick={() => {
                                handleMenuClose();
                                handleNavigation("/admin/settings");
                            }}
                        >
                            Settings
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                handleMenuClose();
                                handleNavigation("/admin/user-management");
                            }}
                        >
                            User Management
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
