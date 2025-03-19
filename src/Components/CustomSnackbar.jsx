import PropTypes from "prop-types";
import { Snackbar, Alert } from "@mui/material";

const CustomSnackbar = ({
    open,
    message,
    severity = "info", // Default to 'info'
    autoHideDuration = 6000, // Default to 6 seconds
    onClose,
    anchorOrigin = { vertical: "top", horizontal: "right" }, // Default position
    ...props // Allow additional Snackbar props
}) => {
    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        onClose(event, reason);
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={autoHideDuration}
            onClose={handleClose}
            anchorOrigin={anchorOrigin}
            {...props} // Pass through any additional props
        >
            <Alert
                onClose={handleClose}
                severity={severity}
                sx={{ width: "100%" }}
            >
                {message}
            </Alert>
        </Snackbar>
    );

    
};

// PropTypes for type checking
CustomSnackbar.propTypes = {
    open: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    severity: PropTypes.oneOf(["success", "error", "warning", "info"]),
    autoHideDuration: PropTypes.number,
    onClose: PropTypes.func.isRequired,
    anchorOrigin: PropTypes.shape({
        vertical: PropTypes.oneOf(["top", "bottom"]),
        horizontal: PropTypes.oneOf(["left", "center", "right"]),
    }),
};

// Default props (optional)
CustomSnackbar.defaultProps = {
    severity: "info",
    autoHideDuration: 6000,
    anchorOrigin: { vertical: "bottom", horizontal: "center" },
};

export default CustomSnackbar;
