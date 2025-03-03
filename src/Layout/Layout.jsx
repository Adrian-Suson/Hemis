import { useState } from "react";
import { Box, useMediaQuery, Typography } from "@mui/material";
import { Link, Outlet } from "react-router-dom";
import PropTypes from "prop-types";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ userRole }) => {
    const isNonMobile = useMediaQuery("(min-width: 600px)");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMinimized, setIsMinimized] = useState(false);

    return (
        <Box display="flex" flexDirection="column" width="100%" height="100vh">
            {/* Navbar (Fixed at Top) */}
            <Box
                sx={{
                    position: "fixed",
                    top: 0,
                    left: isSidebarOpen
                        ? isMinimized
                            ? "64px"
                            : "300px"
                        : "0px",
                    width: isSidebarOpen
                        ? isMinimized
                            ? "calc(100% - 64px)"
                            : "calc(100% - 300px)"
                        : "100%",
                    zIndex: 1100,
                    transition: "left 0.3s ease",
                    minHeight: "50px !important",
                    height: "50px",
                }}
            >
                <Navbar
                    isNonMobile={isNonMobile}
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    isMinimized={isMinimized}
                    setIsMinimized={setIsMinimized}
                />
            </Box>

            <Box display="flex" flexGrow={1} width="100%" pt="64px">
                {" "}
                {/* Adds padding to prevent content from overlapping navbar */}
                <Sidebar
                    userRole={userRole}
                    isNonMobile={isNonMobile}
                    drawerWidth="300px"
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    isMinimized={isMinimized}
                    setIsMinimized={setIsMinimized}
                />
                <Box
                    flexGrow={1}
                    display="flex"
                    flexDirection="column"
                    overflow="auto"
                >
                    <Box flexGrow={1} px={1.5}>
                        <Outlet />
                    </Box>
                </Box>
            </Box>

            {/* Footer (Fixed at Bottom) */}
            <Box
                component="footer"
                sx={{
                    position: "fixed",
                    bottom: 0,
                    left: isSidebarOpen
                        ? isMinimized
                            ? "64px"
                            : "300px"
                        : "0px",
                    width: isSidebarOpen
                        ? isMinimized
                            ? "calc(100% - 64px)"
                            : "calc(100% - 300px)"
                        : "100%",
                    backgroundColor: "#f8f9fa", // Slightly lighter, modern gray
                    padding: { xs: "10px 15px", sm: "12px 20px" }, // Responsive padding
                    textAlign: "center",
                    boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.05)", // Softer shadow
                    transition: "left 0.3s ease, width 0.3s ease", // Smoother transition
                    minHeight: "60px", // Slightly taller for better spacing
                    height: "auto", // Allow height to adjust based on content
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: "center",
                    zIndex: 1000, // Ensure it stays above other elements
                }}
            >
                <Typography
                    variant="body1"
                    color="textSecondary"
                    sx={{
                        fontSize: { xs: "0.85rem", sm: "1rem" }, // Responsive font size
                        mb: { xs: 1, sm: 0 }, // Margin bottom on mobile
                    }}
                >
                    © {new Date().getFullYear()} CHEDRO IX | All rights
                    reserved.
                </Typography>
                <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{
                        fontSize: { xs: "0.75rem", sm: "0.875rem" }, // Responsive font size
                    }}
                >
                    Powered by:{" "}
                    <Link
                        href="https://chedro9.com" // Replace with actual URL
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
        </Box>
    );
};

Layout.propTypes = {
    userRole: PropTypes.string,
};

export default Layout;
