import { useState } from "react";
import {
    Box,
    useMediaQuery,
    IconButton,
    AppBar,
    Toolbar,
    Typography,
} from "@mui/material";
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
            {/* Show AppBar on mobile */}
            {!isNonMobile && (
                <AppBar position="fixed" sx={{ top: 0, left: 0, zIndex: 1100 }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            sx={{ mr: 1 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{
                                flexGrow: 1,
                                textAlign: "center",
                                fontWeight: "bold",
                                color: "white",
                            }}
                        >
                            CHEDRO IX
                        </Typography>
                    </Toolbar>
                </AppBar>
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

            <Box flexGrow={1} mt={!isNonMobile ? 8 : 0}>
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
