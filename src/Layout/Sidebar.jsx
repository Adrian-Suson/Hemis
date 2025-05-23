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
import GroupIcon from "@mui/icons-material/Group";
import PropTypes from "prop-types";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/ChedLogo.png";
import DP from "../assets/Profile.png";
import axios from "axios";
import config from "../utils/config";
import { MdAdminPanelSettings } from "react-icons/md";
import BarChartIcon from "@mui/icons-material/BarChart";

// Define navigation items based on user role
const getNavItems = (role) => {
    const items = {
        "super-admin": [
            {
                text: "Dashboard",
                icon: <HomeIcon />,
                path: "/super-admin/dashboard",
            },
            {
                text: "Institutions",
                icon: <StorageIcon />,
                path: "/super-admin/institutions",
            },
            {
                text: "Statistics",
                icon: <BarChartIcon />,
                path: "/super-admin/statistics",
            },
        ],
        "hei-admin": [
            {
                text: "Dashboard",
                icon: <HomeIcon />,
                path: "/hei-admin/dashboard",
            },
            {
                text: "Institutions",
                icon: <StorageIcon />,
                path: "/hei-admin/institutions",
            },
        ],
        "hei-staff": [
            {
                text: "Dashboard",
                icon: <HomeIcon />,
                path: "/hei-staff/dashboard",
            },
            {
                text: "Institutions",
                icon: <StorageIcon />,
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
                icon: <GroupIcon />,
                path: "/super-admin/user-management",
            },
        ],
        "hei-admin": [
            {
                text: "Staff Management",
                icon: <GroupIcon />,
                path: "/hei-admin/staff-management",
            },
        ],
        "hei-staff": [], // No admin menu for HEI Staff
    };
    return items[role] || [];
};

const Sidebar = ({
    drawerWidth = "240px",
    isSidebarOpen,
    setIsSidebarOpen,
    isNonMobile = true,
    isMinimized,
}) => {
    const [active, setActive] = useState("");
    const [openManagement, setOpenManagement] = useState(false);
    const navigate = useNavigate();
    const theme = useTheme();
    const [user, setUser] = useState(null);

    const navItems = getNavItems(user?.role);
    const adminMenuItems = getAdminMenuItems(user?.role);

    const handleNavigation = (path) => {
        navigate(path);
        setActive(path);
        if (!isNonMobile) setIsSidebarOpen(false); // Close sidebar on mobile after navigation
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
        } catch (error) {
            console.error("Failed to fetch user:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

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

    const renderNavItem = ({ text, icon, path }) => {
        return (
            <ListItem key={text} disablePadding>
                <ListItemButton
                    onClick={() => handleNavigation(path)}
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
        <Drawer
            open={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            variant={isNonMobile ? "persistent" : "temporary"}
            anchor="left"
            sx={{
                width: isMinimized ? "64px" : drawerWidth,
                "& .MuiDrawer-paper": {
                    color: theme.palette.text.primary,
                    backgroundColor: theme.palette.background.default,
                    boxSizing: "border-box",
                    width: isMinimized ? "64px" : drawerWidth,
                    transition: "width 0.3s",
                    overflowX: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                },
            }}
        >
            <Box>
                <Box p={isMinimized ? 1.5 : 4}>
                    <Box
                        display="flex"
                        alignItems="center"
                        gap="0.5rem"
                        justifyContent="space-between"
                    >
                        <Box display="flex" alignItems="center" gap="0.5rem">
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
                            <IconButton onClick={() => setIsSidebarOpen(false)}>
                                <ChevronLeftIcon />
                            </IconButton>
                        )}
                    </Box>
                </Box>

                <Box
                    sx={{
                        flexGrow: 1,
                        overflowY: "auto",
                        maxHeight: "calc(90vh - 160px)",
                    }}
                >
                    <Divider sx={{ my: 2 }} />
                    <List>{navItems.map(renderNavItem)}</List>

                    {adminMenuItems.length > 0 && (
                        <>
                            <Divider sx={{ my: 2 }} />
                            <ListItem disablePadding>
                                <ListItemButton
                                    onClick={() =>
                                        setOpenManagement(!openManagement)
                                    }
                                    sx={{
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
                                    {adminMenuItems.map(renderNavItem)}
                                </List>
                            </Collapse>
                        </>
                    )}
                </Box>
            </Box>

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
                        justifyContent={isMinimized ? "center" : "flex-start"}
                        alignItems="center"
                    >
                        <Avatar
                            src={user?.profile_image || DP}
                            sx={{
                                width: isMinimized ? 40 : 40,
                                height: isMinimized ? 40 : 40,
                            }}
                        >
                            {user?.email?.charAt(0)}
                        </Avatar>
                        {!isMinimized && user && (
                            <Box display="flex" flexDirection="column">
                                <Typography variant="body1" fontWeight="600">
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
                                padding: isMinimized ? "8px" : "8px 16px",
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
    );
};

Sidebar.propTypes = {
    drawerWidth: PropTypes.string,
    isSidebarOpen: PropTypes.bool.isRequired,
    setIsSidebarOpen: PropTypes.func.isRequired,
    isNonMobile: PropTypes.bool,
    isMinimized: PropTypes.bool.isRequired,
    userRole: PropTypes.oneOf(["super-admin", "hei-admin", "hei-staff"]),
};

Sidebar.defaultProps = {
    drawerWidth: "240px",
    isNonMobile: true,
    userRole: "hei-staff",
};

export default Sidebar;
