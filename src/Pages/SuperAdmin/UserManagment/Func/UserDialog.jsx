import { useState, useEffect } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
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
} from "@mui/material";
import config from "../../../../utils/config";
import PropTypes from "prop-types";
import axios from "axios";

const UserDialog = ({ openDialog, onClose, editingUser, onUserUpdated }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("Viewer");
    const [status, setStatus] = useState("Active");
    const [institutionId, setInstitutionId] = useState("");
    const [password, setPassword] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [institutions, setInstitutions] = useState([]);
    const [fetchingInstitutions, setFetchingInstitutions] = useState(false);

    useEffect(() => {
        if (openDialog) {
            fetchInstitutions();
        }
    }, [openDialog]);

    useEffect(() => {
        if (editingUser) {
            setName(editingUser.name || "");
            setEmail(editingUser.email || "");
            setRole(editingUser.role || "Viewer");
            setStatus(editingUser.status || "Active");
            setInstitutionId(editingUser.institution_id || "");
            setProfileImage(editingUser.profile_image || "");
            setPassword("");
        } else {
            setName("");
            setEmail("");
            setRole("Viewer");
            setStatus("Active");
            setInstitutionId("");
            setPassword("");
            setProfileImage("");
        }
    }, [editingUser]);

    const fetchInstitutions = async () => {
        setFetchingInstitutions(true);
        setError("");
        const token = localStorage.getItem("token");

        try {
            const response = await axios.get(`${config.API_URL}/institutions`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setInstitutions(response.data || []);
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to fetch institutions"
            );
        } finally {
            setFetchingInstitutions(false);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        setError("");

        // Client-side password validation
        if (!editingUser && (!password || password.length < 8)) {
            setError("Password is required and must be at least 8 characters.");
            setLoading(false);
            return;
        }

        const userData = {
            name,
            email,
            role,
            status,
            institution_id: role === "Super Admin" ? null : institutionId,
            ...(password && !editingUser ? { password } : {}),
            ...(profileImage ? { profile_image: profileImage } : {}),
        };

        try {
            const token = localStorage.getItem("token");
            if (editingUser) {
                await axios.put(
                    `${config.API_URL}/users/${editingUser.id}`,
                    userData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                await axios.post(`${config.API_URL}/users`, userData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
            onUserUpdated();
            onClose();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    err.message ||
                    "Error saving user data"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setName("");
        setEmail("");
        setRole("Viewer");
        setStatus("Active");
        setInstitutionId("");
        setPassword("");
        setProfileImage("");
        setError("");
        setInstitutions([]);
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
                {error && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}
                <TextField
                    label="Name"
                    variant="outlined"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ mb: 2 }}
                />
                {!editingUser && (
                    <TextField
                        label="Password"
                        variant="outlined"
                        fullWidth
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{ mb: 2 }}
                        error={password && password.length < 8} // Highlight if invalid
                        helperText={
                            password && password.length < 8
                                ? "Password must be at least 8 characters"
                                : ""
                        }
                    />
                )}
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Role</InputLabel>
                    <Select
                        value={role}
                        onChange={(e) => {
                            setRole(e.target.value);
                            if (e.target.value === "Super Admin")
                                setInstitutionId("");
                        }}
                        label="Role"
                    >
                        <MenuItem value="HEI Admin">HEI Admin</MenuItem>
                        <MenuItem value="HEI Staff">HEI Staff</MenuItem>
                        <MenuItem value="Viewer">Viewer</MenuItem>
                    </Select>
                </FormControl>
                {role !== "Super Admin" && (
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Institution</InputLabel>
                        <Select
                            value={institutionId}
                            onChange={(e) => setInstitutionId(e.target.value)}
                            label="Institution"
                            disabled={
                                fetchingInstitutions ||
                                institutions.length === 0
                            }
                        >
                            <MenuItem value="">
                                <em>
                                    {fetchingInstitutions
                                        ? "Loading Institutions..."
                                        : institutions.length === 0
                                        ? "No Institutions Available"
                                        : "Select Institution"}
                                </em>
                            </MenuItem>
                            {institutions.map((inst) => (
                                <MenuItem key={inst.id} value={inst.id}>
                                    {inst.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        label="Status"
                    >
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                        <MenuItem value="Suspended">Suspended</MenuItem>
                    </Select>
                </FormControl>
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
                            alt="Profile"
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
                    disabled={
                        loading ||
                        (!editingUser && (!password || password.length < 8)) ||
                        (role !== "Super Admin" && !institutionId)
                    }
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
        institution_id: PropTypes.number,
        profile_image: PropTypes.string,
    }),
};

export default UserDialog;
