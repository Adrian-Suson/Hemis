/* eslint-disable react-refresh/only-export-components */
// ProgressContext.jsx
import { createContext, useContext, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { LinearProgress } from "@mui/material";

const ProgressContext = createContext();

export const ProgressProvider = ({ children }) => {
    const [progress, setProgress] = useState({ visible: false, value: 0 });

    // Ensure showProgress and hideProgress are stable references
    const showProgress = useCallback((value) => {
        setProgress({
            visible: true,
            value: Math.min(Math.max(value, 0), 100),
        });
    }, []);

    const hideProgress = useCallback(() => {
        setProgress({ visible: false, value: 0 });
    }, []);

    return (
        <ProgressContext.Provider value={{ showProgress, hideProgress }}>
            {progress.visible && (
                <LinearProgress
                    variant="buffer"
                    value={progress.value}
                    valueBuffer={progress.value}
                    sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 9999,
                        height: 4,
                        bgcolor: "grey.300",
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

export const useProgress = () => {
    const context = useContext(ProgressContext);
    if (!context) {
        throw new Error("useProgress must be used within a ProgressProvider");
    }
    return context;
};
