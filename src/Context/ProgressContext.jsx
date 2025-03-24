/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { CircularProgress, Box, Typography } from "@mui/material";

const ProgressContext = createContext();

export const ProgressProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0); // Add progress state

    // Show the loading gear with optional initial progress
    const showProgress = useCallback((initialProgress = 0) => {
        setLoading(true);
        setProgress(initialProgress);
    }, []);

    // Hide the loading gear
    const hideProgress = useCallback(() => {
        setLoading(false);
        setProgress(0); // Reset progress when hiding
    }, []);

    // Optional: Function to update progress while loading
    const updateProgress = useCallback((value) => {
        setProgress(Math.min(Math.max(value, 0), 100)); // Keep between 0 and 100
    }, []);

    return (
        <ProgressContext.Provider
            value={{ showProgress, hideProgress, updateProgress }}
        >
            {loading && (
                <Box
                    sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.6)", // Darker background (was rgba(0,0,0,0.5) implicitly)
                        zIndex: 9999,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {/* Rotating gear */}
                    <CircularProgress
                        size={60}
                        thickness={4}
                        value={progress} // Bind progress value
                        variant="determinate" // Show progress as a determinate circle
                        sx={{
                            color: "#1976d2", // Blue color
                        }}
                    />
                    {/* Progress percentage */}
                    <Typography
                        variant="h6"
                        sx={{
                            color: "white",
                            mt: 2,
                        }}
                    >
                        {`${Math.round(progress)}%`}
                    </Typography>
                </Box>
            )}
            {children}
        </ProgressContext.Provider>
    );
};

ProgressProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useProgress = () => {
    const context = useContext(ProgressContext);
    if (!context) {
        throw new Error("useProgress must be used within a ProgressProvider");
    }
    return context;
};
