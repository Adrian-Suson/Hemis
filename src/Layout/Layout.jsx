// src/Layout/Layout.jsx
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useLoading } from "../Context/LoadingContext";

const Layout = () => {
    return (
        <Box display="flex" flexDirection="column" width="100%" height="100vh">
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
                <Navbar />
            </Box>
            <Box display="flex" flexGrow={1} width="100%" pt="50px">
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
            <Footer />
        </Box>
    );
};

Layout.propTypes = {};

export default Layout;
