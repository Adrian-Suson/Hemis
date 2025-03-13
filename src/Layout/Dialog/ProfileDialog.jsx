import { useState, useRef } from "react";
import DP from "../../assets/Profile.png";
import PropTypes from "prop-types";

const ProfileDialog = ({
    open,
    onClose,
    user,
    onSave,
    loading,
    setSnackbarMessage,
    setSnackbarSeverity,
    setSnackbarOpen,
}) => {
    const [editMode, setEditMode] = useState(false);
    const [editUser, setEditUser] = useState({
        name: user?.name || "",
        email: user?.email || "",
        profile_image: user?.profile_image || "",
        password: "",
        confirmPassword: "",
    });
    const fileInputRef = useRef(null);

    // Update editUser when user prop changes
    const resetEditUser = () => {
        setEditUser({
            name: user?.name || "",
            email: user?.email || "",
            profile_image: user?.profile_image || "",
            password: "",
            confirmPassword: "",
        });
    };

    // Handle image upload
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

    // Handle save
    const handleSaveProfile = async () => {
        if (editUser.password.trim() !== "") {
            if (editUser.password !== editUser.confirmPassword) {
                setSnackbarMessage("Passwords do not match.");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
                return;
            }
        }
        await onSave(editUser);
        setEditMode(false);
    };

    // Handle cancel
    const handleCancel = () => {
        setEditMode(false);
        resetEditUser();
    };

    if (!open) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
            }}
            onClick={() => {
                onClose();
                setEditMode(false);
                resetEditUser();
            }}
        >
            <div
                style={{
                    background: "#fff",
                    borderRadius: "8px",
                    width: "100%",
                    maxWidth: "500px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    overflow: "hidden",
                    margin: "16px",
                }}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                {/* Dialog Title */}
                <div
                    style={{
                        background: "#1976d2",
                        color: "#fff",
                        padding: "16px 24px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <h2
                        style={{
                            margin: 0,
                            fontSize: "1.25rem",
                            fontWeight: 500,
                        }}
                    >
                        {editMode ? "Edit Profile" : "User Profile"}
                    </h2>
                    <button
                        style={{
                            background: "none",
                            border: "none",
                            color: "#fff",
                            fontSize: "1.25rem",
                            cursor: "pointer",
                            padding: "4px 8px",
                        }}
                        onClick={() => {
                            onClose();
                            setEditMode(false);
                            resetEditUser();
                        }}
                    >
                        ✕
                    </button>
                </div>

                {/* Dialog Content */}
                <div style={{ padding: user && editMode ? "24px" : 0 }}>
                    {!user ? (
                        <div
                            style={{
                                padding: "24px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "300px",
                            }}
                        >
                            <div
                                style={{
                                    width: "40px",
                                    height: "40px",
                                    border: "4px solid #1976d2",
                                    borderTop: "4px solid transparent",
                                    borderRadius: "50%",
                                    animation: "spin 1s linear infinite",
                                }}
                            />
                            <style>{`
                                @keyframes spin {
                                    0% { transform: rotate(0deg); }
                                    100% { transform: rotate(360deg); }
                                }
                            `}</style>
                        </div>
                    ) : !editMode ? (
                        <div>
                            <div
                                style={{
                                    background: "#e3f2fd",
                                    padding: "24px",
                                    textAlign: "center",
                                }}
                            >
                                <img
                                    src={user.profile_image || DP}
                                    alt="Profile"
                                    style={{
                                        width: "100px",
                                        height: "100px",
                                        borderRadius: "50%",
                                        border: "4px solid #fff",
                                        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                                        objectFit: "cover",
                                    }}
                                />
                                <h3
                                    style={{
                                        margin: "16px 0 8px",
                                        fontSize: "1.5rem",
                                        fontWeight: 600,
                                    }}
                                >
                                    {user.name}
                                </h3>
                                <span
                                    style={{
                                        display: "inline-block",
                                        padding: "4px 12px",
                                        background:
                                            user.status?.toLowerCase() ===
                                            "active"
                                                ? "#4caf50"
                                                : "#e0e0e0",
                                        color:
                                            user.status?.toLowerCase() ===
                                            "active"
                                                ? "#fff"
                                                : "#000",
                                        borderRadius: "12px",
                                        fontSize: "0.75rem",
                                    }}
                                >
                                    {user.status || "N/A"}
                                </span>
                            </div>
                            <ul
                                style={{
                                    padding: "24px",
                                    margin: 0,
                                    listStyle: "none",
                                }}
                            >
                                <li
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "12px 0",
                                        borderBottom: "1px solid #e0e0e0",
                                    }}
                                >
                                    <span style={{ marginRight: "16px" }}>
                                        📧
                                    </span>
                                    <div>
                                        <span
                                            style={{
                                                display: "block",
                                                fontSize: "0.75rem",
                                                color: "#666",
                                            }}
                                        >
                                            Email
                                        </span>
                                        <span
                                            style={{
                                                fontSize: "1rem",
                                                fontWeight: 500,
                                            }}
                                        >
                                            {user.email}
                                        </span>
                                    </div>
                                </li>
                                <li
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "12px 0",
                                        borderBottom: "1px solid #e0e0e0",
                                    }}
                                >
                                    <span style={{ marginRight: "16px" }}>
                                        💼
                                    </span>
                                    <div>
                                        <span
                                            style={{
                                                display: "block",
                                                fontSize: "0.75rem",
                                                color: "#666",
                                            }}
                                        >
                                            Role
                                        </span>
                                        <span
                                            style={{
                                                fontSize: "1rem",
                                                fontWeight: 500,
                                            }}
                                        >
                                            {user.role || "N/A"}
                                        </span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <div>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    marginBottom: "24px",
                                }}
                            >
                                <div
                                    style={{
                                        position: "relative",
                                        marginBottom: "16px",
                                    }}
                                >
                                    <img
                                        src={editUser.profile_image || DP}
                                        alt="Profile"
                                        style={{
                                            width: "100px",
                                            height: "100px",
                                            borderRadius: "50%",
                                            border: "2px solid #1976d2",
                                            boxShadow:
                                                "0 4px 8px rgba(0,0,0,0.1)",
                                            objectFit: "cover",
                                        }}
                                    />
                                    <button
                                        style={{
                                            position: "absolute",
                                            bottom: 0,
                                            right: 0,
                                            width: "32px",
                                            height: "32px",
                                            background: "#1976d2",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "50%",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                        onClick={() =>
                                            fileInputRef.current.click()
                                        }
                                    >
                                        📷
                                    </button>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        style={{ display: "none" }}
                                        onChange={handleImageUpload}
                                    />
                                </div>
                                <span
                                    style={{
                                        fontSize: "0.75rem",
                                        color: "#666",
                                    }}
                                >
                                    Click the camera icon to change your profile
                                    picture
                                </span>
                            </div>
                            <hr
                                style={{
                                    margin: "16px 0",
                                    border: "1px solid #e0e0e0",
                                }}
                            />
                            <div style={{ display: "grid", gap: "16px" }}>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <span style={{ marginRight: "8px" }}>
                                        👤
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        value={editUser.name}
                                        onChange={(e) =>
                                            setEditUser({
                                                ...editUser,
                                                name: e.target.value,
                                            })
                                        }
                                        style={{
                                            width: "100%",
                                            padding: "8px",
                                            border: "1px solid #ccc",
                                            borderRadius: "4px",
                                        }}
                                    />
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <span style={{ marginRight: "8px" }}>
                                        📧
                                    </span>
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        value={editUser.email}
                                        onChange={(e) =>
                                            setEditUser({
                                                ...editUser,
                                                email: e.target.value,
                                            })
                                        }
                                        style={{
                                            width: "100%",
                                            padding: "8px",
                                            border: "1px solid #ccc",
                                            borderRadius: "4px",
                                        }}
                                    />
                                </div>
                                <div>
                                    <p
                                        style={{
                                            fontSize: "0.875rem",
                                            color: "#1976d2",
                                            margin: "8px 0",
                                        }}
                                    >
                                        Change Password (Optional)
                                    </p>
                                    <div
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: "1fr 1fr",
                                            gap: "16px",
                                        }}
                                    >
                                        <input
                                            type="password"
                                            placeholder="New Password"
                                            value={editUser.password}
                                            onChange={(e) =>
                                                setEditUser({
                                                    ...editUser,
                                                    password: e.target.value,
                                                })
                                            }
                                            style={{
                                                width: "100%",
                                                padding: "8px",
                                                border: "1px solid #ccc",
                                                borderRadius: "4px",
                                            }}
                                        />
                                        <input
                                            type="password"
                                            placeholder="Confirm New Password"
                                            value={editUser.confirmPassword}
                                            onChange={(e) =>
                                                setEditUser({
                                                    ...editUser,
                                                    confirmPassword:
                                                        e.target.value,
                                                })
                                            }
                                            style={{
                                                width: "100%",
                                                padding: "8px",
                                                border:
                                                    editUser.confirmPassword !==
                                                        "" &&
                                                    editUser.password !==
                                                        editUser.confirmPassword
                                                        ? "1px solid #d32f2f"
                                                        : "1px solid #ccc",
                                                borderRadius: "4px",
                                            }}
                                        />
                                    </div>
                                    {editUser.confirmPassword !== "" &&
                                        editUser.password !==
                                            editUser.confirmPassword && (
                                            <span
                                                style={{
                                                    fontSize: "0.75rem",
                                                    color: "#d32f2f",
                                                    marginTop: "4px",
                                                }}
                                            >
                                                Passwords do not match
                                            </span>
                                        )}
                                    <span
                                        style={{
                                            fontSize: "0.75rem",
                                            color: "#666",
                                            marginTop: "4px",
                                        }}
                                    >
                                        Leave blank to keep current password
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Dialog Actions */}
                <div
                    style={{
                        padding: "16px 24px",
                        borderTop: "1px solid #e0e0e0",
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "8px",
                    }}
                >
                    {editMode ? (
                        <>
                            <button
                                style={{
                                    padding: "8px 16px",
                                    background: "#e0e0e0",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                }}
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                            <button
                                style={{
                                    padding: "8px 16px",
                                    background: loading ? "#90caf9" : "#1976d2",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: loading ? "not-allowed" : "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                }}
                                onClick={handleSaveProfile}
                                disabled={loading}
                            >
                                {loading ? (
                                    <div
                                        style={{
                                            width: "20px",
                                            height: "20px",
                                            border: "2px solid #fff",
                                            borderTop: "2px solid transparent",
                                            borderRadius: "50%",
                                            animation:
                                                "spin 1s linear infinite",
                                        }}
                                    />
                                ) : (
                                    "💾"
                                )}
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                style={{
                                    padding: "8px 16px",
                                    background: "#e0e0e0",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                }}
                                onClick={onClose}
                            >
                                Close
                            </button>
                            <button
                                style={{
                                    padding: "8px 16px",
                                    background: "#1976d2",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                }}
                                onClick={() => setEditMode(true)}
                            >
                                ✏️ Edit Profile
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

ProfileDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    user: PropTypes.shape({
        name: PropTypes.string,
        email: PropTypes.string,
        profile_image: PropTypes.string,
        status: PropTypes.string,
        role: PropTypes.string,
    }),
    onSave: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    setSnackbarMessage: PropTypes.func.isRequired,
    setSnackbarSeverity: PropTypes.func.isRequired,
    setSnackbarOpen: PropTypes.func.isRequired,
};

export default ProfileDialog;
