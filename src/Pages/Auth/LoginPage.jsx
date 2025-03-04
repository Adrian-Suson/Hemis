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
import BFImage from "../../assets/cover.jpg"; // Your background image

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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

            // Store the token and user information in localStorage
            localStorage.setItem("token", response.data.data.token); // Store the token
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.data.user)
            ); // Store the user details (including user ID)

            console.log("Token:", response.data.data.token);
            console.log("User:", response.data.data.user);

            // Set the Authorization header for future requests
            axios.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${response.data.data.token}`;

            // Redirect to dashboard or home page
            navigate("/dashboard");
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
                    backgroundColor: "rgba(255, 255, 255, .9)",
                    maxWidth: "400px", // Limit form width
                    width: "100%",
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Login
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
                                    fontSize: { xs: "0.75rem", sm: "0.875rem" }, // Responsive font size
                                }}
                            >
                                Powered by:{" "}
                                <Link
                                    href="https://chedro9.ph" // Replace with actual URL
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                        color: "#1976d2", // MUI primary color
                                        textDecoration: "none",
                                        "&:hover": {
                                            textDecoration: "underline",
                                            color: "#115293", // Darker shade on hover
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
