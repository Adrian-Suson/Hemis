/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useContext, useState, useMemo } from "react";
import PropTypes from "prop-types";
import LoadingScreen from "../Components/LoadingScreen";

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mode, setMode] = useState("spinner"); // 'spinner' or 'progress'

  const showLoading = () => {
    setIsLoading(true);
    setProgress(0);
    setMode("spinner");
  };

  const hideLoading = () => {
    setIsLoading(false);
    setProgress(0);
    setMode("spinner");
  };

  const updateProgress = (value) => {
    const clampedValue = Math.max(0, Math.min(100, value));
    if (!isLoading) {
      setIsLoading(true);
    }
    setProgress(clampedValue);
    setMode("progress");

    // Auto-hide after reaching 100%
    if (clampedValue >= 100) {
      setTimeout(() => {
        hideLoading();
      }, 500); // You can adjust the delay if you want a slight pause
    }
  };

  const contextValue = useMemo(
    () => ({
      isLoading,
      progress,
      mode,
      showLoading,
      hideLoading,
      updateProgress,
    }),
    [isLoading, progress, mode]
  );

  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
      {isLoading && <LoadingScreen progress={progress} mode={mode} />}
    </LoadingContext.Provider>
  );
};

LoadingProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
