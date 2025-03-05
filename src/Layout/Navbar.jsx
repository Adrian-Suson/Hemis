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
    Tooltip,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import config from "../utils/config";
import DP from "../assets/Profile.png";
import Logo from "../assets/ChedLogo.png"; // Assuming you have a logo image in this path

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();

    const [anchorEl, setAnchorEl] = useState(null); // Manage the avatar dropdown state
    const [adminMenuAnchorEl, setAdminMenuAnchorEl] = useState(null); // Manage the Admin dropdown state
    const [user, setUser] = useState(null); // Store user profile data
    const [value, setValue] = useState(0); // Store the active tab index

    const navItems = useMemo(
        () => [
            { text: "Dashboard", path: "/admin/dashboard" },
            { text: "Institutions", path: "/admin/institutions" },
            { text: "Program", path: "/admin/program" },
            { text: "Reports", path: "/admin/reports" },
            { text: "Admin", path: "/admin", isAdmin: true }, // Added Admin button with special handling
        ],
        []
    );

    useEffect(() => {
        // Fetch the user's profile on component mount
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
        setValue(newValue); // Update the active tab index
    };

    const handleMenuOpen = (event, type) => {
        if (type === "avatar") {
            setAnchorEl(event.currentTarget); // Open the avatar menu on click
        } else if (type === "admin") {
            setAdminMenuAnchorEl(event.currentTarget); // Open the admin menu on click
        }
    };

    const handleMenuClose = () => {
        setAnchorEl(null); // Close avatar menu
        setAdminMenuAnchorEl(null); // Close admin menu
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

    // Handle the active tab based on location.pathname
    useEffect(() => {
        const currentPath = location.pathname;
        const activeTabIndex = navItems.findIndex(
            (item) => item.path === currentPath
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
                justifyContent: "flex-end", // Align everything to the right
            }}
        >
            <Toolbar
                sx={{
                    display: "flex",
                    justifyContent: "flex-end", // Align everything to the right
                    minHeight: "64px !important",
                    px: { xs: 2, md: 3 }, // Responsive padding
                }}
            >
                {/* Left section with Logo and "Hemis" name */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        marginRight: "auto",
                    }}
                >
                    <img
                        src={Logo} // Your logo image source
                        alt="Hemis Logo"
                        style={{ width: 40, height: 40, marginRight: "8px" }} // Adjust the size as necessary
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

                {/* Tabs for navigation */}
                <Box sx={{ flexGrow: 1 }}>
                    <Tabs
                        value={value}
                        onChange={handleTabChange}
                        textColor="primary"
                        indicatorColor="primary"
                        sx={{ display: "flex", justifyContent: "flex-end" }}
                    >
                        {navItems.map(({ text, path, isAdmin }) =>
                            isAdmin ? (
                                <Tab
                                    key={text}
                                    label={text}
                                    onClick={(e) => handleMenuOpen(e, "admin")} // Admin tab click triggers dropdown
                                    sx={{
                                        fontWeight: 600,
                                        textTransform: "none",
                                        color:
                                            location.pathname === path
                                                ? theme.palette.primary.main
                                                : theme.palette.text.primary,
                                    }}
                                />
                            ) : (
                                <Tab
                                    key={text}
                                    label={text}
                                    onClick={() => handleNavigation(path)}
                                    sx={{
                                        fontWeight: 600,
                                        textTransform: "none",
                                        color:
                                            location.pathname === path
                                                ? theme.palette.primary.main
                                                : theme.palette.text.primary,
                                    }}
                                />
                            )
                        )}
                    </Tabs>
                </Box>

                {/* Avatar and Dropdown */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {user && (
                        <Tooltip title="User Menu">
                            <Avatar
                                sx={{
                                    cursor: "pointer",
                                    bgcolor: theme.palette.primary.main,
                                    width: 40,
                                    height: 40,
                                    marginLeft: "16px",
                                }}
                                src={user.initials || DP}
                                onClick={(e) => handleMenuOpen(e, "avatar")} // Open avatar menu on click
                            >
                                {user.initials || DP}
                            </Avatar>
                        </Tooltip>
                    )}

                    {/* Avatar Dropdown Menu */}
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        MenuListProps={{
                            "aria-labelledby": "basic-button",
                        }}
                    >
                        <MenuItem>Profile</MenuItem>
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
                    >
                        <MenuItem
                            onClick={() => handleNavigation("/admin/settings")}
                        >
                            Settings
                        </MenuItem>
                        <MenuItem
                            onClick={() =>
                                handleNavigation("/admin/user-management")
                            }
                        >
                            User Management
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

Navbar.propTypes = {};

export default Navbar;
