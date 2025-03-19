import {
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
    Box,
    Avatar,
    Typography,
    Divider,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import config from "../utils/config";
import DP from "../assets/Profile.png";
import EmailIcon from "@mui/icons-material/Email";
import WorkIcon from "@mui/icons-material/Work";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import PropTypes from "prop-types";

const ProfileDialog = ({ open, onClose, user, fetchUserProfile }) => {
    const [editMode, setEditMode] = useState(false);
    const [editUser, setEditUser] = useState({
        name: "",
        email: "",
        profile_image: "",
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

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

    const handleSaveProfile = async () => {
        try {
            if (
                editUser.password.trim() !== "" &&
                editUser.password !== editUser.confirmPassword
            ) {
                alert("Passwords do not match."); // Replace with Snackbar if needed
                return;
            }
            setLoading(true);
            const token = localStorage.getItem("token");
            const payload = {
                name: editUser.name,
                email: editUser.email,
                profile_image: editUser.profile_image,
                ...(editUser.password.trim() !== ""
                    ? { password: editUser.password }
                    : {}),
            };
            await axios.patch(`${config.API_URL}/users/${user.id}`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            await fetchUserProfile();
            setEditMode(false);
        } catch (err) {
            console.error("Failed to update profile:", err);
            alert("Failed to update profile."); // Replace with Snackbar if needed
        } finally {
            setLoading(false);
        }
    };

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

    return (
        <Dialog
            open={open}
            onClose={() => {
                onClose();
                setEditMode(false);
            }}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                elevation: 3,
                sx: { borderRadius: 2, overflow: "hidden" },
            }}
        >
            <DialogTitle
                sx={{
                    bgcolor: "#1976d2",
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
                        onClose();
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

            <DialogContent sx={{ p: 0 }}>
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
                                bgcolor: "#e3f2fd",
                                p: 3,
                                textAlign: "center",
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 100,
                                    height: 100,
                                    mx: "auto",
                                    border: "4px solid white",
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
                                        borderBottom: "1px solid #e0e0e0",
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
                                        borderBottom: "1px solid #e0e0e0",
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
                                        border: "2px solid #1976d2",
                                    }}
                                    src={editUser.profile_image || DP}
                                >
                                    {(editUser.name ? editUser.name[0] : "") ||
                                        ""}
                                </Avatar>
                                <IconButton
                                    sx={{
                                        position: "absolute",
                                        bottom: 0,
                                        right: 0,
                                        bgcolor: "#1976d2",
                                        color: "white",
                                        "&:hover": { bgcolor: "#115293" },
                                        width: 32,
                                        height: 32,
                                    }}
                                    onClick={() => fileInputRef.current.click()}
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

            <DialogActions sx={{ p: 2, px: 3, borderTop: "1px solid #e0e0e0" }}>
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
                            onClick={onClose}
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
    );
};

ProfileDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    user: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        email: PropTypes.string,
        profile_image: PropTypes.string,
        status: PropTypes.string,
        role: PropTypes.string,
    }),
    setUser: PropTypes.func.isRequired,
    fetchUserProfile: PropTypes.func.isRequired,
};

export default ProfileDialog;
