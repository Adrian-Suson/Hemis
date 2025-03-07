import { Box, Typography, IconButton, Link } from "@mui/material";
import { Facebook, YouTube, ArrowUpward } from "@mui/icons-material";
import XIcon from '@mui/icons-material/X';
import PropTypes from "prop-types";
import { useState, useEffect } from "react";

const Footer = ({ isSidebarOpen, isMinimized }) => {
    const [isScrollTopVisible, setIsScrollTopVisible] = useState(false);

    useEffect(() => {
        // Show the "Back to Top" button when scrolled down 200px
        const handleScroll = () => {
            setIsScrollTopVisible(window.scrollY > 200);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <Box
            component="footer"
            sx={{
                position: "fixed",
                bottom: 0,
                left: isSidebarOpen ? (isMinimized ? "64px" : "300px") : "0px",
                width: isSidebarOpen
                    ? isMinimized
                        ? "calc(100% - 64px)"
                        : "calc(100% - 300px)"
                    : "100%",
                backgroundColor: "#f8f9fa", // Modern light gray
                padding: { xs: "10px 15px", sm: "12px 20px" }, // Responsive padding
                textAlign: "center",
                boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.05)", // Softer shadow
                transition: "left 0.3s ease, width 0.3s ease", // Smooth transition
                minHeight: "60px", // Slightly taller for better spacing
                height: "auto", // Height adjusts based on content
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                justifyContent: "space-between",
                zIndex: 1000, // Ensures footer stays above other elements
            }}
        >
            {/* Footer Text */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                }}
            >
                <Typography
                    variant="body1"
                    color="textSecondary"
                    sx={{
                        fontSize: { xs: "0.85rem", sm: "1rem" }, // Responsive font size
                        mb: { xs: 0.5, sm: 0 }, // Margin bottom on mobile
                    }}
                >
                    © {new Date().getFullYear()} CHEDRO IX | All rights
                    reserved.
                </Typography>

                {/* Powered By Link */}
                <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{
                        fontSize: { xs: "0.75rem", sm: "0.875rem" }, // Responsive font size
                        mt: 0, // Margin top to separate from copyright
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
            </Box>

            {/* Social Media Icons */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                <IconButton
                    href="https://www.facebook.com/CHEDRO9"
                    target="_blank"
                    color="primary"
                    sx={{ margin: "0 8px" }}
                >
                    <Facebook />
                </IconButton>
                <IconButton
                    href="https://x.com/chedro9"
                    target="_blank"
                    color="primary"
                    sx={{ margin: "0 8px" }}
                >
                    <XIcon />
                </IconButton>
                <IconButton
                    href="https://www.youtube.com/c/CHEDRO9"
                    target="_blank"
                    color="primary"
                    sx={{ margin: "0 8px" }}
                >
                    <YouTube />
                </IconButton>
            </Box>

            {/* Back to Top Button (Only visible when page is scrollable) */}
            {isScrollTopVisible && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                    <IconButton
                        color="primary"
                        sx={{
                            borderRadius: "50%",
                            backgroundColor: "#1976d2",
                            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
                            "&:hover": {
                                backgroundColor: "#115293", // Darker shade on hover
                            },
                        }}
                        onClick={() => window.scrollTo(0, 0)}
                    >
                        <ArrowUpward />
                    </IconButton>
                </Box>
            )}
        </Box>
    );
};

// Define propTypes for the Footer component
Footer.propTypes = {
    isSidebarOpen: PropTypes.bool.isRequired, // isSidebarOpen is a boolean prop
    isMinimized: PropTypes.bool.isRequired, // isMinimized is a boolean prop
};

export default Footer;
