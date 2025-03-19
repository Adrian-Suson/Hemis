import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    TextField,
    Button,
    Container,
    Typography,
    Paper,
    Grid,
    Alert,
    Link,
} from "@mui/material";
import axios from "axios";
import BFImage from "../../assets/cover.jpg"; // Background image
import Logo from "../../assets/ChedLogo.png"; // CHED Region 9 Logo

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        if (!email || !password) {
            setError("Please fill in both fields.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:8000/api/auth/login",
                { email, password }
            );

            const token = response.data.data.token;
            const user = response.data.data.user;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            // Redirect based on user role
            switch (user.role) {
                case "Super Admin":
                    navigate("/super-admin/dashboard");
                    break;
                case "HEI Admin":
                    navigate("/hei-admin/dashboard");
                    break;
                case "HEI Staff":
                case "Viewer":
                    navigate("/hei-staff/dashboard");
                    break;
                default:
                    setError("Unknown role. Please contact support.");
                    localStorage.clear(); // Clear invalid login
                    break;
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "An error occurred during login. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container
            component="main"
            maxWidth="false"
            sx={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundImage: `url(${BFImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                padding: 0,
                overflow: "hidden",
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    padding: "30px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    maxWidth: "400px",
                    width: "100%",
                    borderRadius: "10px",
                }}
            >
                {/* CHED Region 9 Logo */}
                <img
                    src={Logo}
                    alt="CHED Region 9 Logo"
                    style={{
                        width: "80px",
                        height: "80px",
                        marginBottom: "10px",
                    }}
                />

                <Typography variant="h5" gutterBottom>
                    CHEDRO IX - Higher Education Management System
                </Typography>
                <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                >
                    Commission on Higher Education Regional Office 9
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
                        {error}
                    </Alert>
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
                    />
                    <TextField
                        label="Password"
                        variant="outlined"
                        type="password"
                        fullWidth
                        size="small"
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        required
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ marginTop: "16px" }}
                        disabled={loading}
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
            </Paper>
        </Container>
    );
};

export default LoginPage;
