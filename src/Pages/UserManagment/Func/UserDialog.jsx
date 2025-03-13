import { useState, useEffect } from "react";
import {
    Dialog,
    DialogActions,
    DialogTitle,
    Button,
    Typography,
    Divider,
    TextField,
    CircularProgress,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    InputAdornment,
    Box,
    DialogContent,
} from "@mui/material";
import config from "../../../utils/config";
import PropTypes from "prop-types";
import axios from "axios";

const UserDialog = ({ openDialog, onClose, editingUser, onUserUpdated }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [status, setStatus] = useState("Active");
    const [profileImage, setProfileImage] = useState("");
    const [loading, setLoading] = useState(false);

    // Define available roles
    const roles = [
        "Super Admin",
        "CHED Regional Admin",
        "CHED Staff",
        "HEI Admin",
        "HEI Staff",
        "Viewer",
    ];

    useEffect(() => {
        if (editingUser) {
            setName(editingUser.name || "");
            setEmail(editingUser.email || "");
            setRole(editingUser.role || "");
            setStatus(editingUser.status || "Active");
            setProfileImage(editingUser.profile_image || "");
        } else {
            // Reset to default values when adding a new user
            setName("");
            setEmail("");
            setRole("");
            setStatus("Active");
            setProfileImage("");
        }
    }, [editingUser]);

    const handleSave = async () => {
        if (!name || !email || !role) {
            alert("Please fill in all required fields (Name, Email, Role).");
            return;
        }

        setLoading(true);
        const token = localStorage.getItem("token");
        const userData = {
            name,
            email,
            role,
            status,
            profile_image: profileImage,
        };

        try {
            if (editingUser) {
                // Edit existing user
                await axios.put(
                    `${config.API_URL}/users/${editingUser.id}`,
                    userData,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
            } else {
                // Create new user (assuming POST expects a password for new users)
                if (!userData.password) {
                    userData.password = "defaultPassword123"; // Placeholder; adjust as needed
                }
                await axios.post(`${config.API_URL}/users`, userData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
            onUserUpdated();
            onClose();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                    "Error saving user data. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setName("");
        setEmail("");
        setRole("");
        setStatus("Active");
        setProfileImage("");
        onClose();
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const isSaveDisabled = loading || !name || !email || !role;

    return (
        <Dialog open={openDialog} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ pb: 1 }}>
                <Typography variant="h6" component="div">
                    {editingUser ? "Edit User" : "Add New User"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {editingUser
                        ? "Modify user details"
                        : "Create a new user account"}
                </Typography>
            </DialogTitle>
            <Divider />
            <DialogContent sx={{ pt: 3 }}>
                <TextField
                    label="Name"
                    variant="outlined"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={{ mb: 2 }}
                    required
                    error={!name && name !== ""}
                    helperText={!name && name !== "" ? "Name is required" : ""}
                />
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ mb: 2 }}
                    required
                    error={!email && email !== ""}
                    helperText={
                        !email && email !== "" ? "Email is required" : ""
                    }
                />

                {/* Role Selection */}
                <FormControl fullWidth sx={{ mb: 2 }} required>
                    <InputLabel>Role</InputLabel>
                    <Select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        label="Role"
                    >
                        {roles.map((r) => (
                            <MenuItem key={r} value={r}>
                                {r}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Status Selection */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        label="Status"
                    >
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                    </Select>
                </FormControl>

                {/* Profile Image Upload */}
                <TextField
                    type="file"
                    variant="outlined"
                    fullWidth
                    onChange={handleImageUpload}
                    sx={{ mb: 2 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">📷</InputAdornment>
                        ),
                    }}
                    inputProps={{ accept: "image/*" }}
                />
                {profileImage && (
                    <Box sx={{ mt: 2, textAlign: "center" }}>
                        <img
                            src={profileImage}
                            alt="Profile Preview"
                            style={{
                                width: 100,
                                height: 100,
                                objectFit: "cover",
                                borderRadius: "50%",
                            }}
                        />
                    </Box>
                )}
            </DialogContent>
            <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
                <Button onClick={handleClose} disabled={loading}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={isSaveDisabled}
                >
                    {loading ? (
                        <CircularProgress size={24} />
                    ) : editingUser ? (
                        "Save Changes"
                    ) : (
                        "Create User"
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

UserDialog.propTypes = {
    openDialog: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onUserUpdated: PropTypes.func.isRequired,
    editingUser: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        email: PropTypes.string,
        role: PropTypes.string,
        status: PropTypes.string,
        profile_image: PropTypes.string,
    }),
};

export default UserDialog;
