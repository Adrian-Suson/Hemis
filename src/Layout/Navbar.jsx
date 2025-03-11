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
        Dialog,
        DialogTitle,
        DialogContent,
        DialogActions,
        Button,
        TextField,
        CircularProgress,
        InputAdornment,
        Chip,
        List,
        ListItem,
        ListItemIcon,
        ListItemText,
        IconButton,
        Grid,
    } from "@mui/material";
    import { useNavigate, useLocation } from "react-router-dom";
    import { useState, useMemo, useEffect, useRef } from "react";
    import axios from "axios";
    import config from "../utils/config";
    import DP from "../assets/Profile.png";
    import Logo from "../assets/ChedLogo.png";
    import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
    import EmailIcon from "@mui/icons-material/Email";
    import WorkIcon from "@mui/icons-material/Work";
    import PersonIcon from "@mui/icons-material/Person";
    import LockIcon from "@mui/icons-material/Lock";
    import CameraAltIcon from "@mui/icons-material/CameraAlt";
    import EditIcon from "@mui/icons-material/Edit";
    import SaveIcon from "@mui/icons-material/Save";
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
        const [editMode, setEditMode] = useState(false);
        const [editUser, setEditUser] = useState({
            name: "",
            email: "",
            profile_image: "",
            password: "",
            confirmPassword: "",
        });
        const fileInputRef = useRef(null);
        const [loading, setLoading] = useState(false);
        const [snackbarOpen, setSnackbarOpen] = useState(false);
        const [snackbarMessage, setSnackbarMessage] = useState("");
        const [snackbarSeverity, setSnackbarSeverity] = useState("info");

        const navItems = useMemo(
            () => [
                { text: "Dashboard", path: "/admin/dashboard" },
                { text: "Institutions", path: "/admin/institutions" },
                { text: "Admin", path: "/admin", isAdmin: true },
            ],
            []
        );

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

        useEffect(() => {
            if (user) {
                setEditUser({
                    name: user.name || "",
                    email: user.email || "",
                    profile_image: user.profile_image || "",
                    password: "",
                    confirmPassword: "",
                });
            }
        }, [user]);

        const handleNavigation = (path) => navigate(path);
        const handleTabChange = (event, newValue) => setValue(newValue);
        const handleMenuOpen = (event, type) =>
            type === "avatar"
                ? setAnchorEl(event.currentTarget)
                : setAdminMenuAnchorEl(event.currentTarget);
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
            } catch (err) {
                console.error("Logout failed:", err);
                setSnackbarMessage("Logout failed.");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
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
            if (activeTabIndex >= 0) setValue(activeTabIndex);
        }, [location.pathname, navItems]);

        const handleSaveProfile = async () => {
            try {
                if (
                    editUser.password.trim() !== "" &&
                    editUser.password !== editUser.confirmPassword
                ) {
                    setSnackbarMessage("Passwords do not match.");
                    setSnackbarSeverity("error");
                    setSnackbarOpen(true);
                    return;
                }
                setLoading(true);
                const token = localStorage.getItem("token");
                const payload = {
                    name: editUser.name,
                    email: editUser.email,
                    profile_image: editUser.profile_image,
                    ...(editUser.password.trim() !== "" && {
                        password: editUser.password,
                    }),
                };
                await axios.patch(`${config.API_URL}/users/${user.id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                await fetchUserProfile();
                setEditMode(false);
                setSnackbarMessage("Profile updated successfully!");
                setSnackbarSeverity("success");
                setSnackbarOpen(true);
            } catch (err) {
                console.error("Failed to update profile:", err);
                setSnackbarMessage("Failed to update profile.");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
            } finally {
                setLoading(false);
            }
        };

        const handleImageUpload = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () =>
                    setEditUser((prev) => ({
                        ...prev,
                        profile_image: reader.result,
                    }));
                reader.readAsDataURL(file);
            }
        };

        const handleSnackbarClose = () => setSnackbarOpen(false);

        return (
            <>
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
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                marginRight: "auto",
                                cursor: "pointer",
                                "&:hover": {
                                    opacity: 0.8,
                                    transition: "opacity 0.3s ease",
                                },
                            }}
                            onClick={() => handleNavigation("/admin/dashboard")}
                        >
                            <img
                                src={Logo}
                                alt="Hemis Logo"
                                style={{
                                    width: 40,
                                    height: 40,
                                    marginRight: "8px",
                                }}
                            />
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 900,
                                    fontSize: 25,
                                    color: "black",
                                }}
                            >
                                CHEDRO IX
                            </Typography>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Box sx={{ flexGrow: 1 }}>
                                <Tabs
                                    value={value}
                                    onChange={handleTabChange}
                                    textColor="primary"
                                    indicatorColor="primary"
                                    sx={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                    }}
                                >
                                    {navItems.map(
                                        ({ text, path, isAdmin }, index) =>
                                            isAdmin ? (
                                                <Tab
                                                    key={text}
                                                    label={
                                                        <Box
                                                            sx={{
                                                                display: "flex",
                                                                alignItems:
                                                                    "center",
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
                                                                ? theme.palette
                                                                    .primary.main
                                                                : theme.palette.text
                                                                    .primary,
                                                        "&:hover": {
                                                            bgcolor:
                                                                "rgba(0, 0, 0, 0.04)",
                                                            transition:
                                                                "background-color 0.3s ease",
                                                        },
                                                    }}
                                                />
                                            ) : (
                                                <Tab
                                                    key={text}
                                                    label={text}
                                                    onClick={() =>
                                                        handleNavigation(path)
                                                    }
                                                    sx={{
                                                        fontWeight: 400,
                                                        textTransform: "none",
                                                        color:
                                                            value === index
                                                                ? theme.palette
                                                                    .primary.main
                                                                : theme.palette.text
                                                                    .primary,
                                                        "&:hover": {
                                                            bgcolor:
                                                                "rgba(0, 0, 0, 0.04)",
                                                            transition:
                                                                "background-color 0.3s ease",
                                                        },
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
                                        "&:hover": {
                                            opacity: 0.9,
                                            transition: "opacity 0.3s ease",
                                        },
                                    }}
                                    onClick={(e) => handleMenuOpen(e, "avatar")}
                                >
                                    <Avatar
                                        sx={{
                                            bgcolor: theme.palette.primary.main,
                                            width: 40,
                                            height: 40,
                                            marginLeft: "16px",
                                            transition: "transform 0.2s ease",
                                            "&:hover": {
                                                transform: "scale(1.1)",
                                            },
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
                            )}

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
                                    sx: { mt: 1.5, minWidth: 180, borderRadius: 1 },
                                }}
                            >
                                <MenuItem
                                    onClick={() => {
                                        handleMenuClose();
                                        setOpenProfileDialog(true);
                                    }}
                                    sx={{
                                        "&:hover": {
                                            bgcolor: theme.palette.action.hover,
                                            transition:
                                                "background-color 0.3s ease",
                                        },
                                    }}
                                >
                                    Profile
                                </MenuItem>
                                <Divider />
                                <MenuItem
                                    onClick={handleLogout}
                                    sx={{
                                        "&:hover": {
                                            bgcolor: theme.palette.action.hover,
                                            transition:
                                                "background-color 0.3s ease",
                                        },
                                    }}
                                >
                                    Logout
                                </MenuItem>
                            </Menu>

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
                                    sx: { mt: 1.5, minWidth: 180, borderRadius: 1 },
                                }}
                            >
                                <MenuItem
                                    onClick={() => {
                                        handleMenuClose();
                                        handleNavigation("/admin/settings");
                                    }}
                                    sx={{
                                        "&:hover": {
                                            bgcolor: theme.palette.action.hover,
                                            transition:
                                                "background-color 0.3s ease",
                                        },
                                    }}
                                >
                                    Settings
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        handleMenuClose();
                                        handleNavigation("/admin/user-management");
                                    }}
                                    sx={{
                                        "&:hover": {
                                            bgcolor: theme.palette.action.hover,
                                            transition:
                                                "background-color 0.3s ease",
                                        },
                                    }}
                                >
                                    User Management
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Toolbar>
                </AppBar>

                <Dialog
                    open={openProfileDialog}
                    onClose={() => {
                        setOpenProfileDialog(false);
                        setEditMode(false);
                    }}
                    aria-labelledby="profile-dialog-title"
                    fullWidth
                    maxWidth="sm"
                    PaperProps={{
                        elevation: 3,
                        sx: { borderRadius: 2, overflow: "hidden" },
                    }}
                >
                    <DialogTitle
                        id="profile-dialog-title"
                        sx={{
                            bgcolor: theme.palette.primary.main,
                            color: "#fff",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            px: 3,
                            py: 2,
                        }}
                    >
                        <Typography variant="h6" fontWeight="500" color="white">
                            {editMode ? "Edit Profile" : "User Profile"}
                        </Typography>
                        <Button
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setOpenProfileDialog(false);
                                setEditMode(false);
                            }}
                            sx={{
                                minWidth: "auto",
                                p: 0.5,
                                "&:hover": { bgcolor: "rgba(255,255,255,0.15)" },
                            }}
                        >
                            ✕
                        </Button>
                    </DialogTitle>

                    <DialogContent
                        sx={{
                            p: 0,
                            "&.MuiDialogContent-dividers": {
                                borderTop: "none",
                                borderBottom: "none",
                            },
                        }}
                    >
                        {!user ? (
                            <Box
                                sx={{
                                    p: 3,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: 300,
                                }}
                            >
                                <CircularProgress size={40} />
                            </Box>
                        ) : !editMode ? (
                            <Box sx={{ p: 0 }}>
                                <Box
                                    sx={{
                                        bgcolor: theme.palette.primary.light,
                                        color: theme.palette.primary.contrastText,
                                        p: 3,
                                        textAlign: "center",
                                        position: "relative",
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            width: 100,
                                            height: 100,
                                            mx: "auto",
                                            border: "4px solid white",
                                            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                                            bgcolor: theme.palette.primary.dark,
                                        }}
                                        src={user.profile_image || DP}
                                    >
                                        {(user.name && user.name[0]) || ""}
                                    </Avatar>
                                    <Typography
                                        variant="h5"
                                        sx={{ mt: 2, fontWeight: 600 }}
                                    >
                                        {user.name}
                                    </Typography>
                                    <Chip
                                        label={user.status || "N/A"}
                                        size="small"
                                        color={
                                            user.status?.toLowerCase() === "active"
                                                ? "success"
                                                : "default"
                                        }
                                        sx={{ mt: 1, fontSize: "0.75rem" }}
                                    />
                                </Box>
                                <Box sx={{ p: 3 }}>
                                    <List sx={{ width: "100%" }}>
                                        <ListItem
                                            sx={{
                                                px: 0,
                                                py: 1.5,
                                                borderBottom: `1px solid ${theme.palette.divider}`,
                                            }}
                                        >
                                            <ListItemIcon sx={{ minWidth: 40 }}>
                                                <EmailIcon color="action" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Email"
                                                secondary={user.email}
                                                primaryTypographyProps={{
                                                    variant: "body2",
                                                    color: "text.secondary",
                                                    fontSize: "0.75rem",
                                                }}
                                                secondaryTypographyProps={{
                                                    variant: "body1",
                                                    color: "text.primary",
                                                    fontWeight: 500,
                                                }}
                                            />
                                        </ListItem>
                                        <ListItem
                                            sx={{
                                                px: 0,
                                                py: 1.5,
                                                borderBottom: `1px solid ${theme.palette.divider}`,
                                            }}
                                        >
                                            <ListItemIcon sx={{ minWidth: 40 }}>
                                                <WorkIcon color="action" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Role"
                                                secondary={user.role || "N/A"}
                                                primaryTypographyProps={{
                                                    variant: "body2",
                                                    color: "text.secondary",
                                                    fontSize: "0.75rem",
                                                }}
                                                secondaryTypographyProps={{
                                                    variant: "body1",
                                                    color: "text.primary",
                                                    fontWeight: 500,
                                                }}
                                            />
                                        </ListItem>
                                    </List>
                                </Box>
                            </Box>
                        ) : (
                            <Box sx={{ p: 3 }}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        mb: 3,
                                    }}
                                >
                                    <Box sx={{ position: "relative", mb: 2 }}>
                                        <Avatar
                                            sx={{
                                                width: 100,
                                                height: 100,
                                                border: `2px solid ${theme.palette.primary.main}`,
                                                boxShadow:
                                                    "0 4px 8px rgba(0,0,0,0.1)",
                                                transition: "transform 0.2s ease",
                                                "&:hover": {
                                                    transform: "scale(1.05)",
                                                },
                                            }}
                                            src={editUser.profile_image || DP}
                                        >
                                            {(editUser.name
                                                ? editUser.name[0]
                                                : "") || ""}
                                        </Avatar>
                                        <IconButton
                                            sx={{
                                                position: "absolute",
                                                bottom: 0,
                                                right: 0,
                                                bgcolor: theme.palette.primary.main,
                                                color: "white",
                                                "&:hover": {
                                                    bgcolor:
                                                        theme.palette.primary.dark,
                                                    transform: "scale(1.1)",
                                                },
                                                width: 32,
                                                height: 32,
                                                transition: "all 0.3s ease",
                                            }}
                                            onClick={() =>
                                                fileInputRef.current.click()
                                            }
                                        >
                                            <CameraAltIcon fontSize="small" />
                                        </IconButton>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            ref={fileInputRef}
                                            style={{ display: "none" }}
                                            onChange={handleImageUpload}
                                        />
                                    </Box>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        Click the camera icon to change your profile
                                        picture
                                    </Typography>
                                </Box>
                                <Divider sx={{ my: 2 }} />
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Full Name"
                                            value={editUser.name}
                                            onChange={(e) =>
                                                setEditUser({
                                                    ...editUser,
                                                    name: e.target.value,
                                                })
                                            }
                                            fullWidth
                                            variant="outlined"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PersonIcon color="action" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Email Address"
                                            value={editUser.email}
                                            onChange={(e) =>
                                                setEditUser({
                                                    ...editUser,
                                                    email: e.target.value,
                                                })
                                            }
                                            fullWidth
                                            variant="outlined"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <EmailIcon color="action" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography
                                            variant="subtitle2"
                                            color="primary"
                                            gutterBottom
                                        >
                                            Change Password (Optional)
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            label="New Password"
                                            type="password"
                                            value={editUser.password}
                                            onChange={(e) =>
                                                setEditUser({
                                                    ...editUser,
                                                    password: e.target.value,
                                                })
                                            }
                                            fullWidth
                                            variant="outlined"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LockIcon color="action" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            helperText="Leave blank to keep current password"
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            label="Confirm New Password"
                                            type="password"
                                            value={editUser.confirmPassword}
                                            onChange={(e) =>
                                                setEditUser({
                                                    ...editUser,
                                                    confirmPassword: e.target.value,
                                                })
                                            }
                                            fullWidth
                                            variant="outlined"
                                            error={
                                                editUser.confirmPassword !== "" &&
                                                editUser.password !==
                                                    editUser.confirmPassword
                                            }
                                            helperText={
                                                editUser.confirmPassword !== "" &&
                                                editUser.password !==
                                                    editUser.confirmPassword
                                                    ? "Passwords do not match"
                                                    : ""
                                            }
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        )}
                    </DialogContent>

                    <DialogActions
                        sx={{
                            p: 2,
                            px: 3,
                            borderTop: `1px solid ${theme.palette.divider}`,
                        }}
                    >
                        {editMode ? (
                            <>
                                <Button
                                    onClick={() => {
                                        setEditMode(false);
                                        setEditUser({
                                            name: user.name || "",
                                            email: user.email || "",
                                            profile_image: user.profile_image || "",
                                            password: "",
                                            confirmPassword: "",
                                        });
                                    }}
                                    color="inherit"
                                    sx={{
                                        mr: 1,
                                        "&:hover": {
                                            bgcolor: theme.palette.action.hover,
                                            transition:
                                                "background-color 0.3s ease",
                                        },
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSaveProfile}
                                    color="primary"
                                    variant="contained"
                                    startIcon={
                                        loading ? (
                                            <CircularProgress
                                                size={20}
                                                color="inherit"
                                            />
                                        ) : (
                                            <SaveIcon />
                                        )
                                    }
                                    disabled={loading}
                                    sx={{
                                        "&:hover": {
                                            bgcolor: theme.palette.primary.dark,
                                            transform: "scale(1.02)",
                                            transition: "all 0.3s ease",
                                        },
                                    }}
                                >
                                    {loading ? "Saving..." : "Save Changes"}
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    onClick={() => setOpenProfileDialog(false)}
                                    color="inherit"
                                    sx={{
                                        mr: 1,
                                        "&:hover": {
                                            bgcolor: theme.palette.action.hover,
                                            transition:
                                                "background-color 0.3s ease",
                                        },
                                    }}
                                >
                                    Close
                                </Button>
                                <Button
                                    onClick={() => setEditMode(true)}
                                    color="primary"
                                    variant="contained"
                                    startIcon={<EditIcon />}
                                    sx={{
                                        "&:hover": {
                                            bgcolor: theme.palette.primary.dark,
                                            transform: "scale(1.02)",
                                            transition: "all 0.3s ease",
                                        },
                                    }}
                                >
                                    Edit Profile
                                </Button>
                            </>
                        )}
                    </DialogActions>
                </Dialog>

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
