import { useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import PropTypes from "prop-types";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer"; // Import Footer Component

const Layout = ({ userRole }) => {
    const isMobile = useMediaQuery("(max-width: 600px)");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <Box display="flex" flexDirection="column" width="100%" height="100vh">
            {/* Navbar (Fixed at Top) */}
            <Box
                sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    zIndex: 1100,
                    height: "50px",
                }}
            >
                <Navbar
                    isMobile={isMobile}
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                />
            </Box>

            <Box display="flex" flexGrow={1} width="100%" pt="50px">
                {/* Sidebar only for mobile */}
                {isMobile && (
                    <Sidebar
                        userRole={userRole}
                        isSidebarOpen={isSidebarOpen}
                        setIsSidebarOpen={setIsSidebarOpen}
                    />
                )}

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

            {/* Footer */}
            <Footer />
        </Box>
    );
};

Layout.propTypes = {
    userRole: PropTypes.string,
};

export default Layout;
