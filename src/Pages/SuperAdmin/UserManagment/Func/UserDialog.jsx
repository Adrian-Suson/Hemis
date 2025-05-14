import { useState, useEffect } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    Typography,
    Divider,
    CircularProgress,
    Box,
} from "@mui/material";
import config from "../../../../utils/config";
import PropTypes from "prop-types";
import axios from "axios";
import FormInput from "../../../../Components/FormInput";

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
                <FormInput
                    id="name"
                    name="name"
                    label="Name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    errorMessage={error && !name ? "Name is required" : ""}
                    wrapperClassName="mb-4"
                />
                <FormInput
                    id="email"
                    name="email"
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    errorMessage={error && !email ? "Email is required" : ""}
                    wrapperClassName="mb-4"
                />
                {!editingUser && (
                    <FormInput
                        id="password"
                        name="password"
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        errorMessage={
                            password && password.length < 8
                                ? "Password must be at least 8 characters"
                                : ""
                        }
                        wrapperClassName="mb-4"
                    />
                )}
                <FormInput
                    id="role"
                    name="role"
                    label="Role"
                    type="select"
                    value={role}
                    onChange={(e) => {
                        setRole(e.target.value);
                        if (e.target.value === "Super Admin")
                            setInstitutionId("");
                    }}
                    options={[
                        { value: "HEI Admin", label: "HEI Admin" },
                        { value: "HEI Staff", label: "HEI Staff" },
                        { value: "Viewer", label: "Viewer" },
                    ]}
                    wrapperClassName="mb-4"
                />
                {role !== "Super Admin" && (
                    <FormInput
                        id="institution"
                        name="institution"
                        label="Institution"
                        type="select"
                        value={institutionId}
                        onChange={(e) => setInstitutionId(e.target.value)}
                        options={[
                            { value: "", label: "Select Institution" },
                            ...institutions.map((inst) => ({
                                value: inst.id,
                                label: inst.name,
                            })),
                        ]}
                        disabled={
                            fetchingInstitutions || institutions.length === 0
                        }
                        errorMessage={
                            role !== "Super Admin" && !institutionId
                                ? "Institution is required"
                                : ""
                        }
                        wrapperClassName="mb-4"
                    />
                )}
                <FormInput
                    id="status"
                    name="status"
                    label="Status"
                    type="select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    options={[
                        { value: "Active", label: "Active" },
                        { value: "Inactive", label: "Inactive" },
                        { value: "Suspended", label: "Suspended" },
                    ]}
                    wrapperClassName="mb-4"
                />
                <FormInput
                    id="profileImage"
                    name="profileImage"
                    label="Profile Image"
                    type="file"
                    onChange={handleImageUpload}
                    inputProps={{ accept: "image/*" }}
                    wrapperClassName="mb-4"
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
