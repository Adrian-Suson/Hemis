import { useState } from "react";
import { Box, useMediaQuery, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Outlet } from "react-router-dom";
import PropTypes from "prop-types";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ userRole }) => {
    const isNonMobile = useMediaQuery("(min-width: 600px)");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMinimized, setIsMinimized] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <Box
            display={isNonMobile ? "flex" : "block"}
            width="100%"
            height="100%"
        >
            {/* Show burger menu on mobile */}
            {!isNonMobile && (
                <Box
                    sx={{
                        position: "fixed",
                        top: "10px",
                        left: "10px",
                        zIndex: 1100,
                    }}
                >
                    <IconButton
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        sx={{
                            color: "primary.main",
                            backgroundColor: "background.paper",
                            "&:hover": { backgroundColor: "background.paper" },
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Box>
            )}

            {!isNonMobile && (
                <Sidebar
                    userRole={userRole}
                    isNonMobile={isNonMobile}
                    drawerWidth="300px"
                    isSidebarOpen={isNonMobile ? isSidebarOpen : mobileMenuOpen}
                    setIsSidebarOpen={
                        isNonMobile ? setIsSidebarOpen : setMobileMenuOpen
                    }
                    isMinimized={isMinimized}
                    setIsMinimized={setIsMinimized}
                />
            )}

            <Box flexGrow={1}>
                {isNonMobile && (
                    <Navbar
                        isNonMobile={isNonMobile}
                        isSidebarOpen={isSidebarOpen}
                        setIsSidebarOpen={setIsSidebarOpen}
                        isMinimized={isMinimized}
                        setIsMinimized={setIsMinimized}
                    />
                )}
                <Outlet />
            </Box>
        </Box>
    );
};

Layout.propTypes = {
    userRole: PropTypes.string,
};

export default Layout;
