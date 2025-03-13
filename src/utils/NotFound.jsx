import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        const destination =
            user?.role === "Super Admin"
                ? "/super-admin/dashboard"
                : user?.role === "HEI Admin"
                ? "/hei-admin/dashboard"
                : "/hei-staff/dashboard"; // Default to hei-staff for HEI Staff or Viewer
        navigate(destination);
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="85vh"
            textAlign="center"
            bgcolor="#f9f9f9"
            p={3}
        >
            <Typography variant="h1" fontWeight={700} color="primary">
                404
            </Typography>
            <Typography
                variant="h5"
                mt={2}
                fontWeight={500}
                color="textSecondary"
            >
                Oops! The page you&apos;re looking for doesn&apos;t exist.
            </Typography>
            <Typography variant="body1" mt={1} color="textSecondary">
                It looks like you might have followed a broken link or entered a
                URL that doesn&apos;t exist.
            </Typography>
            <Button
                variant="contained"
                color="primary"
                sx={{ mt: 3, px: 4, py: 1 }}
                onClick={handleGoBack}
            >
                Go Back to Home
            </Button>
        </Box>
    );
};

export default NotFound;
