// Layout.jsx

import { useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import {Outlet } from "react-router-dom";
import PropTypes from "prop-types";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer"; // Import Footer Component

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

            {/* Footer (Imported from Footer.jsx) */}
            <Footer isSidebarOpen={isSidebarOpen} isMinimized={isMinimized} />
        </Box>
    );
};

Layout.propTypes = {
    userRole: PropTypes.string,
};

export default Layout;
