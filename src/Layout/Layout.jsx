import { useState, useEffect } from "react";
import { Box, useMediaQuery, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";
import PropTypes from "prop-types";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ userRole }) => {
    const isNonMobile = useMediaQuery("(min-width: 600px)");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMinimized, setIsMinimized] = useState(false);
    const [navTitle, setNavTitle] = useState(() => {
        return localStorage.getItem("navTitle") || "Dashboard";
    });

    useEffect(() => {
        localStorage.setItem("navTitle", navTitle);
    }, [navTitle]);

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
                    navTitle={navTitle}
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
                    setNavTitle={setNavTitle}
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
                    backgroundColor: "#f5f5f5",
                    padding: "12px 20px",
                    textAlign: "center",
                    boxShadow: "0 -1px 5px rgba(0, 0, 0, 0.1)",
                    transition: "left 0.3s ease",
                    minHeight: "50px !important",
                    height: "50px",
                }}
            >
                <Typography variant="body2" color="textSecondary">
                    © {new Date().getFullYear()} Information Management System |
                    All rights reserved.
                </Typography>
            </Box>
        </Box>
    );
};

Layout.propTypes = {
    userRole: PropTypes.string,
};

export default Layout;
