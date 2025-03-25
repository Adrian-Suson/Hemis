import { Box, Typography, IconButton, Link } from "@mui/material";
import { Facebook, YouTube, ArrowUpward } from "@mui/icons-material";
import XIcon from "@mui/icons-material/X";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";

const Footer = ({ isSidebarOpen, isMinimized }) => {
    const [isScrollTopVisible, setIsScrollTopVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrollTopVisible(window.scrollY > 200);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
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
                backgroundColor: "#f8f9fa",
                padding: { xs: "8px 12px", sm: "10px 16px" },
                transition: "left 0.3s ease, width 0.3s ease",
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                gap: { xs: 1, sm: 0 },
                justifyContent: { sm: "space-between" },
                zIndex: 1000,
            }}
        >
            {/* Combined Copyright and Powered By Text */}
            <Typography
                variant="body2"
                color="textSecondary"
                sx={{
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    textAlign: { xs: "center", sm: "left" },
                }}
            >
                © {new Date().getFullYear()} CHEDRO IX | All rights reserved.
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

            {/* Social Media Icons */}
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <IconButton
                    href="https://www.facebook.com/CHEDRO9"
                    target="_blank"
                    color="primary"
                    size="small"
                    sx={{ margin: "0 4px" }}
                >
                    <Facebook />
                </IconButton>
                <IconButton
                    href="https://x.com/chedro9"
                    target="_blank"
                    color="primary"
                    size="small"
                    sx={{ margin: "0 4px" }}
                >
                    <XIcon />
                </IconButton>
                <IconButton
                    href="https://www.youtube.com/c/CHEDRO9"
                    target="_blank"
                    color="primary"
                    size="small"
                    sx={{ margin: "0 4px" }}
                >
                    <YouTube />
                </IconButton>
            </Box>

            {/* Back to Top Button */}
            {isScrollTopVisible && (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <IconButton
                        color="primary"
                        size="small"
                        sx={{
                            borderRadius: "50%",
                            backgroundColor: "#1976d2",
                            "&:hover": { backgroundColor: "#115293" },
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

Footer.propTypes = {
    isSidebarOpen: PropTypes.bool.isRequired,
    isMinimized: PropTypes.bool.isRequired,
};

export default Footer;
