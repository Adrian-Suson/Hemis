/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";
import { LinearProgress } from "@mui/material";

// Create the context
const ProgressContext = createContext();

// Progress Provider Component
export const ProgressProvider = ({ children }) => {
    const [progress, setProgress] = useState({ visible: false, value: 0 });

    const showProgress = (value) => {
        setProgress({ visible: true, value: Math.min(Math.max(value, 0), 100) });
    };

    const hideProgress = () => {
        setProgress({ visible: false, value: 0 });
    };

    return (
        <ProgressContext.Provider value={{ showProgress, hideProgress }}>
            {progress.visible && (
                <LinearProgress
                    variant="buffer"
                    value={progress.value}
                    valueBuffer={progress.value}
                    sx={{
                        position: "fixed",
                        top: 0,          // Positions it at the very top of the page
                        left: 0,
                        right: 0,        // Spans full width
                        zIndex: 9999,    // High zIndex to stay above all content
                        height: 4,       // Slimmer bar for a minimalist look
                        bgcolor: "grey.300", // Background color for contrast
                    }}
                />
            )}
            {children}
        </ProgressContext.Provider>
    );
};

ProgressProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

// Custom hook to use the progress context
export const useProgress = () => {
    const context = useContext(ProgressContext);
    if (!context) {
        throw new Error("useProgress must be used within a ProgressProvider");
    }
    return context;
};
