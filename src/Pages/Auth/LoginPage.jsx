import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BFImage from "../../assets/cover.jpg"; // Your background image

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Define role-based redirect paths
    const getRedirectPath = (role) => {
        const rolePaths = {
            "Super Admin": "/admin/dashboard",
            "CHED Regional Admin": "/ched-regional/dashboard",
            "CHED Staff": "/ched-staff/dashboard",
            "HEI Admin": "/hei-admin/dashboard",
            "HEI Staff": "/hei-staff/dashboard",
            Viewer: "/viewer/dashboard",
        };
        return rolePaths[role] || "/viewer/dashboard"; // Default to Viewer if role is unrecognized
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        setError(""); // Reset any previous errors
        setLoading(true); // Set loading state to true

        // Simple validation before sending the request
        if (!email || !password) {
            setError("Please fill in both fields.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:8000/api/auth/login",
                {
                    email,
                    password,
                }
            );

            localStorage.setItem("token", response.data.data.token);
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.data.user)
            );

            axios.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${response.data.data.token}`;

            navigate("/admin/dashboard");
        } catch (err) {
            // If an error occurs, display an error message
            setError(
                err.response?.data?.message ||
                    "An error occurred during login. Please try again."
            );
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div
            style={{
                height: "100vh",
                width: "100vw",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundImage: `url(${BFImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                padding: 0,
                margin: 0,
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    padding: "30px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    backgroundColor: "rgba(255, 255, 255, .9)",
                    maxWidth: "400px",
                    width: "100%",
                    borderRadius: "10px", // Optional rounded corners
                }}
            >
                {/* Logo */}
                <img
                    src={Logo}
                    alt="Logo"
                    style={{
                        width: "80px", // Adjust width as needed
                        height: "80px",
                        marginBottom: "10px",
                    }}
                />

                <Typography variant="h4" gutterBottom>
                    Higher Education Management Information System (HEMIS)
                </Typography>

                {error && (
                    <div
                        style={{
                            width: "100%",
                            padding: "10px",
                            backgroundColor: "#ffebee",
                            color: "#d32f2f",
                            borderRadius: "4px",
                            marginBottom: "20px",
                            textAlign: "center",
                        }}
                    >
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ width: "100%" }}>
                    <TextField
                        label="Email Address"
                        variant="outlined"
                        fullWidth
                        size="small"
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        required
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginBottom: "16px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            fontSize: "14px",
                            outline: "none",
                            boxSizing: "border-box",
                        }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        required
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginBottom: "16px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            fontSize: "14px",
                            outline: "none",
                            boxSizing: "border-box",
                        }}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "12px",
                            backgroundColor: loading ? "#90caf9" : "#1976d2",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            fontSize: "16px",
                            cursor: loading ? "not-allowed" : "pointer",
                            transition: "background-color 0.3s ease",
                        }}
                        onMouseEnter={(e) =>
                            !loading &&
                            (e.currentTarget.style.backgroundColor = "#115293")
                        }
                        onMouseLeave={(e) =>
                            !loading &&
                            (e.currentTarget.style.backgroundColor = "#1976d2")
                        }
                    >
                        {loading ? "Logging in..." : "Login"}
                    </Button>
                    <Grid
                        container
                        justifyContent="center"
                        sx={{ marginTop: "16px" }}
                    >
                        <Grid item>
                            <Typography
                                variant="body2"
                                color="textSecondary"
                                sx={{
                                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                                    mt: 0,
                                }}
                            >
                                Powered by:{" "}
                                <Link
                                    href="https://chedro9.ph"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                        color: "#1976d2",
                                        textDecoration: "none",
                                        "&:hover": {
                                            textDecoration: "underline",
                                            color: "#115293",
                                        },
                                    }}
                                >
                                    CHED Region 9
                                </Link>
                            </Typography>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
