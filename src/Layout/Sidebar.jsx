import { useEffect, useState } from "react";
import {
    Box,
    Collapse,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    useTheme,
    Avatar,
    Divider,
    Tooltip,
    Button,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import HomeIcon from "@mui/icons-material/Home";
import StorageIcon from "@mui/icons-material/Storage";
import HistoryIcon from "@mui/icons-material/History";
import AssignmentIcon from "@mui/icons-material/Assignment";
import GroupIcon from "@mui/icons-material/Group";
import PropTypes from "prop-types";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { GrSystem } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/ChedLogo.png";
import DP from "../assets/Profile.png";
import axios from "axios";
import config from "../utils/config";
import { MdAdminPanelSettings } from "react-icons/md";

// Admin and New Sections in the Sidebar
const adminNavItems = [
    { text: "Dashboard", icon: <HomeIcon /> },
    { text: "Institutions", icon: <StorageIcon /> },
    { text: "Program", icon: <AssignmentIcon /> },
    { text: "Reports and Analytics", icon: <HistoryIcon /> },
];

const managementItems = [
    { text: "System Configuration", icon: <GrSystem /> },
    { text: "User Management", icon: <GroupIcon /> },
];

const Sidebar = ({
    drawerWidth = "240px",
    isSidebarOpen,
    setIsSidebarOpen,
    isNonMobile = true,
    isMinimized,
}) => {
    const [active, setActive] = useState("");
    const [openManagement, setOpenManagement] = useState(false); // System Management dropdown state
    const navigate = useNavigate();
    const theme = useTheme();
    const [user, setUser] = useState(null); // Store the dynamic user data

    const handleNavigation = (path) => {
        navigate(path);
        setActive(path);
    };

    const fetchUsers = async () => {
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
        } catch {
            alert("Failed to fetch users. Please login again.");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("token");

            // Make API call to logout endpoint
            await axios.post(
                `${config.API_URL}/auth/logout`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Clear local storage and redirect after successful logout
            localStorage.removeItem("token");
            localStorage.removeItem("user"); // Remove user data as well if stored
            localStorage.clear();
            navigate("/", { replace: true });
            window.location.reload(false);
        } catch (error) {
            console.error("Logout failed:", error);
            // Optional: Handle error (e.g., show a notification)
            // For now, we'll still clear local storage and redirect
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/", { replace: true });
            window.location.reload(false);
        }
    };

    const renderNavItem = ({ text, icon }) => {
        const lcText = text.toLowerCase().replace(/\s+/g, "-");
        const path = `/admin/${lcText}`;

        return (
            <ListItem key={text} disablePadding>
                <ListItemButton
                    onClick={() => handleNavigation(path, text)}
                    sx={{
                        backgroundColor:
                            active === path
                                ? theme.palette.primary.light
                                : "transparent",
                        color:
                            active === path
                                ? theme.palette.primary.contrastText
                                : theme.palette.text.primary,
                        "&:hover": {
                            backgroundColor: theme.palette.primary.light,
                            color: theme.palette.primary.contrastText,
                        },
                        px: 2,
                        display: "flex",
                        justifyContent: isMinimized ? "center" : "flex-start",
                    }}
                >
                    <ListItemIcon
                        sx={{
                            color:
                                active === path
                                    ? theme.palette.primary.contrastText
                                    : theme.palette.text.primary,
                            minWidth: isMinimized ? "auto" : "56px",
                            justifyContent: "center",
                        }}
                    >
                        {icon}
                    </ListItemIcon>
                    {!isMinimized && <ListItemText primary={text} />}
                </ListItemButton>
            </ListItem>
        );
    };

    return (
        <Box component="nav">
            {isSidebarOpen && (
                <Drawer
                    open={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    variant="persistent"
                    anchor="left"
                    sx={{
                        width: isMinimized ? "70px" : drawerWidth,
                        "& .MuiDrawer-paper": {
                            color: theme.palette.text.primary,
                            backgroundColor: theme.palette.background.default,
                            boxSizing: "border-box",
                            width: isMinimized ? "64px" : drawerWidth,
                            transition: "width 0.3s",
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                        },
                    }}
                >
                    <Box>
                        {/* Sidebar Header */}
                        <Box p={isMinimized ? 1.5 : 4}>
                            <Box
                                justifyContent={"space-between"}
                                color={theme.palette.primary.main}
                            >
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    gap="0.5rem"
                                >
                                    <Box
                                        component="img"
                                        alt="logo"
                                        src={Logo}
                                        height={isMinimized ? "35px" : "50px"}
                                        width={isMinimized ? "35px" : "50px"}
                                        borderRadius="50%"
                                        sx={{ objectFit: "cover" }}
                                    />
                                    {!isMinimized && (
                                        <Typography
                                            variant="h6"
                                            fontWeight={600}
                                            color={theme.palette.text.primary}
                                        >
                                            Information Management
                                        </Typography>
                                    )}
                                </Box>
                                {!isNonMobile && (
                                    <IconButton
                                        onClick={() =>
                                            setIsSidebarOpen(!isSidebarOpen)
                                        }
                                    >
                                        <ChevronLeftIcon />
                                    </IconButton>
                                )}
                            </Box>
                        </Box>

                        {/* Scrollable Nav Content */}
                        <Box
                            sx={{
                                flexGrow: 1,
                                overflowY: "auto",
                                maxHeight: "calc(90vh - 160px)",
                            }}
                        >
                            <Divider sx={{ my: 2 }} />
                            <List>{adminNavItems.map(renderNavItem)}</List>

                            {/* System Management - Dropdown */}
                            <Divider sx={{ my: 2 }} />
                            <ListItem disablePadding>
                                <ListItemButton
                                    onClick={() =>
                                        setOpenManagement(!openManagement)
                                    }
                                    sx={{
                                        display: "flex",
                                        justifyContent: isMinimized
                                            ? "center"
                                            : "flex-start",
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: isMinimized
                                                ? "auto"
                                                : "56px",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <MdAdminPanelSettings
                                            fontSize={25}
                                            color="black"
                                        />
                                    </ListItemIcon>
                                    {!isMinimized && (
                                        <ListItemText primary="Admin" />
                                    )}
                                    {!isMinimized &&
                                        (openManagement ? (
                                            <ExpandLess />
                                        ) : (
                                            <ExpandMore />
                                        ))}
                                </ListItemButton>
                            </ListItem>
                            <Collapse
                                in={openManagement}
                                timeout="auto"
                                unmountOnExit
                            >
                                <List sx={{ ml: isMinimized ? 0 : 4 }}>
                                    {managementItems.map(renderNavItem)}
                                </List>
                            </Collapse>
                        </Box>
                    </Box>

                    {/* Profile & Logout Section */}
                    <Box px={isMinimized ? "0.5rem" : "2rem"} mb={2}>
                        <Divider sx={{ my: 2 }} />
                        <Box
                            mt="10px"
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            gap="0.5rem"
                        >
                            <Box
                                display="flex"
                                width="100%"
                                gap="0.75rem"
                                justifyContent={
                                    isMinimized ? "center" : "flex-start"
                                }
                                alignItems="center"
                            >
                                {/* Avatar */}
                                <Avatar
                                    src={user?.profile_image || DP}
                                    sx={{
                                        width: isMinimized ? 40 : 40,
                                        height: isMinimized ? 40 : 40,
                                        transition: "width 0.3s, height 0.3s",
                                    }}
                                >
                                    {user?.email}
                                </Avatar>

                                {/* User Info */}
                                {!isMinimized && user && (
                                    <Box
                                        display="flex"
                                        flexDirection="column"
                                        alignItems={
                                            isMinimized
                                                ? "center"
                                                : "flex-start"
                                        }
                                    >
                                        <Typography
                                            variant="body1"
                                            fontWeight="600"
                                        >
                                            {user.name}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                        >
                                            {user.role}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>

                            {/* Logout Button */}
                            <Tooltip title="Log Out" arrow>
                                <Button
                                    onClick={handleLogout}
                                    variant="contained"
                                    color="error"
                                    sx={{
                                        width: isMinimized ? "40px" : "100%",
                                        borderRadius: "8px",
                                        textTransform: "none",
                                        fontWeight: 600,
                                        padding: isMinimized
                                            ? "8px"
                                            : "8px 16px",
                                        minWidth: 0,
                                        justifyContent: "center",
                                    }}
                                >
                                    <ExitToAppIcon />
                                    {!isMinimized && "Logout"}
                                </Button>
                            </Tooltip>
                        </Box>
                    </Box>
                </Drawer>
            )}
        </Box>
    );
};

Sidebar.propTypes = {
    drawerWidth: PropTypes.string,
    isSidebarOpen: PropTypes.bool.isRequired,
    setIsSidebarOpen: PropTypes.func.isRequired,
    isNonMobile: PropTypes.bool,
    setNavTitle: PropTypes.func.isRequired,
    isMinimized: PropTypes.bool.isRequired,
    userRole: PropTypes.oneOf(["admin", "user"]),
};

Sidebar.defaultProps = {
    drawerWidth: "240px",
    isNonMobile: true,
    userRole: "user",
};

export default Sidebar;
