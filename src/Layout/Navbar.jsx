import PropTypes from "prop-types";
import { AppBar, IconButton, Toolbar, Box, Button } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Navbar = ({
    isMobile,
    isSidebarOpen,
    setIsSidebarOpen,
    isMinimized,
    setIsMinimized,
}) => {
    const navigate = useNavigate();

    const navItems = [
        { text: "Dashboard", path: "/admin/dashboard" },
        { text: "Institutions", path: "/admin/institutions" },
        { text: "Program", path: "/admin/program" },
        { text: "Reports", path: "/admin/reports" },
    ];

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <AppBar
            position="static"
            sx={{ background: "none", boxShadow: "none" }}
        >
            <Toolbar
                sx={{ justifyContent: "space-between", minHeight: "50px" }}
            >
                {/* Menu icon for toggling sidebar */}
                <IconButton
                    onClick={() => {
                        if (isMobile) {
                            setIsSidebarOpen(!isSidebarOpen);
                        } else {
                            setIsMinimized(!isMinimized); // Toggle minimization on desktop
                        }
                    }}
                >
                    <MenuIcon />
                </IconButton>

                {/* Navigation Links for Desktop */}
                {!isMobile && (
                    <Box display="flex" gap={2}>
                        {navItems.map(({ text, path }) => (
                            <Button
                                key={text}
                                onClick={() => handleNavigation(path)}
                            >
                                {text}
                            </Button>
                        ))}
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

Navbar.propTypes = {
    isMobile: PropTypes.bool.isRequired,
    isSidebarOpen: PropTypes.bool.isRequired,
    setIsSidebarOpen: PropTypes.func.isRequired,
    isMinimized: PropTypes.bool.isRequired, // Added for desktop minimization
    setIsMinimized: PropTypes.func.isRequired, // Added for desktop minimization
};

export default Navbar;
