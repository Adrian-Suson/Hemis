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
import { useState, useMemo, useEffect } from "react";
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

// Import your custom Snackbar component
import CustomSnackbar from "../Components/CustomSnackbar"; // Adjust the path as needed

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();

    // Menu anchor states
    const [anchorEl, setAnchorEl] = useState(null);
    const [adminMenuAnchorEl, setAdminMenuAnchorEl] = useState(null);

    // User and form states
    const [user, setUser] = useState(null);
    const [value, setValue] = useState(0);
    const [openProfileDialog, setOpenProfileDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);

    // Form data for editing
    const [editUser, setEditUser] = useState({
        name: "",
        email: "",
        profile_image: "",
        password: "",
        confirmPassword: "",
    });

    // For uploading an image
    const fileInputRef = useRef(null);

    // Loading & error states
    const [loading, setLoading] = useState(false);

    // 1. State for the custom Snackbar
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("info");

    // Navigation items
    const navItems = useMemo(
        () => [
            { text: "Dashboard", path: "/admin/dashboard" },
            { text: "Institutions", path: "/admin/institutions" },
            { text: "Admin", path: "/admin", isAdmin: true },
        ],
        []
    );

    // ------------------------------------------------------------
    // Fetch user profile from the server
    // ------------------------------------------------------------
    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const storedUser = JSON.parse(localStorage.getItem("user"));
            const response = await axios.get(
                `${config.API_URL}/users/${storedUser.id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setUser(response.data);
        } catch (err) {
            console.error("Failed to fetch user:", err);
            // Show error via Snackbar
            setSnackbarMessage("Failed to load user profile.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    // ------------------------------------------------------------
    // On component mount, fetch the user profile
    // ------------------------------------------------------------
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

    // ------------------------------------------------------------
    // Logout
    // ------------------------------------------------------------
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
            // Show error via Snackbar
            setSnackbarMessage("Logout failed.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);

            localStorage.clear();
            navigate("/", { replace: true });
            window.location.reload(false);
        }
    };

    // ------------------------------------------------------------
    // Keep track of the active tab based on current path
    // ------------------------------------------------------------
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

    // ------------------------------------------------------------
    // Save profile updates
    // ------------------------------------------------------------
    const handleSaveProfile = async () => {
        try {
            // Basic password check
            if (editUser.password.trim() !== "") {
                if (editUser.password !== editUser.confirmPassword) {
                    // Show error via Snackbar
                    setSnackbarMessage("Passwords do not match.");
                    setSnackbarSeverity("error");
                    setSnackbarOpen(true);
                    return;
                }
            }

            setLoading(true);

            const token = localStorage.getItem("token");
            const payload = {
                name: editUser.name,
                email: editUser.email,
                profile_image: editUser.profile_image,
            };

            // Only include password if provided
            if (editUser.password.trim() !== "") {
                payload.password = editUser.password;
            }

            // Update user on server
            await axios.patch(`${config.API_URL}/users/${user.id}`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Re-fetch updated user data so we have consistent fields
            await fetchUserProfile();

            setEditMode(false);

            // Show success via Snackbar
            setSnackbarMessage("Profile updated successfully!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
        } catch (err) {
            console.error("Failed to update profile:", err);
            // Show error via Snackbar
            setSnackbarMessage("Failed to update profile.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    // ------------------------------------------------------------
    // Convert selected image to Base64
    // ------------------------------------------------------------
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setEditUser((prev) => ({
                    ...prev,
                    profile_image: reader.result,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    // ------------------------------------------------------------
    // Close the Snackbar
    // ------------------------------------------------------------
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    // ------------------------------------------------------------
    // Render
    // ------------------------------------------------------------
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
                            style={{
                                width: 40,
                                height: 40,
                                marginRight: "8px",
                            }}
                        />
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                color: "black",
                            }}
                        >
                            CHEDRO IX
                        </Typography>
                    </Box>

                    {/* Avatar Dropdown and Tabs for navigation */}
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
                                    setOpenProfileDialog(true);
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

            {/* Profile Dialog */}
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
                    sx: {
                        borderRadius: 2,
                        overflow: "hidden",
                    },
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
                    {/* If no user is loaded yet, show a loading state */}
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
                        // Read-only profile display with improved styling
                        <Box sx={{ p: 0 }}>
                            {/* Header section with larger avatar and name */}
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
                                    sx={{
                                        mt: 1,
                                        fontSize: "0.75rem",
                                    }}
                                />
                            </Box>

                            {/* Details section */}
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
                        // Edit mode form with improved UI
                        <Box sx={{ p: 3 }}>
                            {/* Avatar upload section */}
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
                                            },
                                            width: 32,
                                            height: 32,
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

                            {/* Form fields */}
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
                                    // Reset form to current user data
                                    setEditUser({
                                        name: user.name || "",
                                        email: user.email || "",
                                        profile_image: user.profile_image || "",
                                        password: "",
                                        confirmPassword: "",
                                    });
                                }}
                                color="inherit"
                                sx={{ mr: 1 }}
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
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                onClick={() => setOpenProfileDialog(false)}
                                color="inherit"
                                sx={{ mr: 1 }}
                            >
                                Close
                            </Button>
                            <Button
                                onClick={() => setEditMode(true)}
                                color="primary"
                                variant="contained"
                                startIcon={<EditIcon />}
                            >
                                Edit Profile
                            </Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>

            {/* 2. Use the custom Snackbar component for notifications */}
            <CustomSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={handleSnackbarClose}
                autoHideDuration={5000} // 5 seconds, for example
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            />
        </>
    );
};

export default Navbar;
