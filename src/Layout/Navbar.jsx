import PropTypes from "prop-types";
import {
    AppBar,
    IconButton,
    Toolbar,
    Box,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";

const Navbar = ({
    isNonMobile = true,
    isMinimized,
    setIsMinimized,
    isSidebarOpen,
    setIsSidebarOpen,
}) => {



    const handleToggle = () => {
        if (isNonMobile) {
            setIsMinimized(!isMinimized);
        } else {
            setIsSidebarOpen(!isSidebarOpen);
        }
    };

    return (
        <>
            <AppBar
                position="static"
                sx={{
                    background: "none",
                    boxShadow: "none",
                    height: "50px", // Added fixed height
                }}
            >
                <Toolbar
                    sx={{
                        justifyContent: "space-between",
                        minHeight: "50px !important", // Override default Toolbar height
                        height: "50px", // Added fixed height
                    }}
                >
                    {/* Menu icon toggles sidebar or minimization */}
                    <IconButton
                        onClick={handleToggle}
                        sx={{ padding: "8px" }} // Reduced padding for smaller height
                    >
                        <MenuIcon />
                    </IconButton>


                    {/* Right-side buttons */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            ml: "auto",
                            height: "50px", // Match parent height
                        }}
                    />
                </Toolbar>
            </AppBar>
        </>
    );
};

Navbar.propTypes = {
    navTitle: PropTypes.string.isRequired,
    isMinimized: PropTypes.bool.isRequired,
    setIsMinimized: PropTypes.func.isRequired,
    isNonMobile: PropTypes.bool,
    isSidebarOpen: PropTypes.bool.isRequired,
    setIsSidebarOpen: PropTypes.func.isRequired,
};

export default Navbar;
