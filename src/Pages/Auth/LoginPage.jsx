import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    TextField,
    Button,
    Container,
    Typography,
    Paper,
    Box,
    Alert,
    Link,
    InputAdornment,
    IconButton,
    useMediaQuery,
    useTheme,
    Fade,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import axios from "axios";
import Logo from "../../assets/ChedLogo.png";
import BFImage from "../../assets/cover.jpg"; // added background image import

const LoginPage = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

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

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Container
            component="main"
            maxWidth="false"
            sx={{
                height: "100vh",
                display: "flex",
                justifyContent: { xs: "center", sm: "flex-end" }, // move form to right on larger screens
                alignItems: "center",
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${BFImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                padding: 0,
            }}
        >
            <Fade in={mounted} timeout={600}>
                <Paper
                    elevation={isMobile ? 1 : 2}
                    sx={{
                        padding: { xs: 3, sm: 4, md: 5 },
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        backgroundColor: "#ffffff",
                        opacity: 0.9, // added opacity to the form
                        width: { xs: "90%", sm: "450px" },
                        borderRadius: "12px",
                        mr: { xs: 0, sm: 4 }, // add some right margin for spacing
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            mb: 4
                        }}
                    >
                        <img
                            src={Logo}
                            alt="CHED Region 9 Logo"
                            style={{
                                width: "70px",
                                height: "70px",
                                marginBottom: "24px",
                            }}
                        />

                        <Typography
                            variant="h5"
                            component="h1"
                            sx={{
                                fontWeight: 600,
                                color: "#333",
                                textAlign: "center",
                                mb: 1
                            }}
                        >
                            Sign in to CHEDRO IX
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color: "#666",
                                textAlign: "center",
                                maxWidth: "320px"
                            }}
                        >
                            Higher Education Management System
                        </Typography>
                    </Box>

                    {error && (
                        <Fade in={!!error}>
                            <Alert
                                severity="error"
                                sx={{
                                    width: "100%",
                                    mb: 3,
                                    borderRadius: "8px",
                                    border: "1px solid rgba(211, 47, 47, 0.1)",
                                    backgroundColor: "rgba(211, 47, 47, 0.05)",
                                    '& .MuiAlert-message': {
                                        width: '100%'
                                    }
                                }}
                                onClose={() => setError("")}
                            >
                                {error}
                            </Alert>
                        </Fade>
                    )}

                    <Box
                        component="form"
                        onSubmit={handleLogin}
                        sx={{
                            width: "100%",
                            mt: error ? 0 : 2
                        }}
                    >
                        <TextField
                            label="Email Address"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailOutlinedIcon sx={{ color: "#9e9e9e" }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                mb: 2.5,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px',
                                    backgroundColor: "#f8f9fa",
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#bdbdbd',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#1976d2',
                                    }
                                },
                                '& .MuiInputLabel-root': {
                                    color: "#757575"
                                }
                            }}
                        />
                        <TextField
                            label="Password"
                            variant="outlined"
                            type={showPassword ? "text" : "password"}
                            fullWidth
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockOutlinedIcon sx={{ color: "#9e9e9e" }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={togglePasswordVisibility}
                                            edge="end"
                                            sx={{ color: "#9e9e9e" }}
                                        >
                                            {showPassword ?
                                                <VisibilityOffOutlinedIcon /> :
                                                <VisibilityOutlinedIcon />
                                            }
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                mb: 4,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px',
                                    backgroundColor: "#f8f9fa",
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#bdbdbd',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#1976d2',
                                    }
                                },
                                '& .MuiInputLabel-root': {
                                    color: "#757575"
                                }
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{
                                py: 1.5,
                                borderRadius: '8px',
                                textTransform: 'none',
                                fontWeight: 500,
                                fontSize: '1rem',
                                backgroundColor: "#1976d2",
                                boxShadow: 'none',
                                '&:hover': {
                                    backgroundColor: "#1565c0",
                                    boxShadow: 'none',
                                }
                            }}
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </Button>

                        <Box
                            sx={{
                                mt: 4,
                                textAlign: "center",
                                pt: 2
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    fontSize: "0.875rem",
                                    color: "#757575"
                                }}
                            >
                                Powered by{" "}
                                <Link
                                    href="https://chedro9.ph"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                        color: "#1976d2",
                                        textDecoration: "none",
                                        fontWeight: 500,
                                        "&:hover": {
                                            textDecoration: "underline",
                                        },
                                    }}
                                >
                                    CHED Region 9
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Fade>
        </Container>
    );
};

export default LoginPage;
