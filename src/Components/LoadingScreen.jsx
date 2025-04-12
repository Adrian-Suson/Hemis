import { Box, Typography, CircularProgress, LinearProgress } from "@mui/material";
import PropTypes from "prop-types";

const LoadingScreen = ({ progress, mode }) => {
  const showProgressBar = mode === "progress" && progress > 0 && progress < 100;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1200,
      }}
    >
      {showProgressBar ? (
        <>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ width: "80%", maxWidth: 400, height: 10, borderRadius: 5, mb: 2 }}
          />
          <Typography variant="body1" sx={{ color: "#fff" }}>
            {progress}% loaded
          </Typography>
        </>
      ) : (
        <>
          <CircularProgress size={40} sx={{ color: "#fff", mb: 2 }} />
          <Typography variant="h6" sx={{ color: "#fff" }}>
            Loading...
          </Typography>
        </>
      )}
    </Box>
  );
};

LoadingScreen.propTypes = {
  progress: PropTypes.number.isRequired,
  mode: PropTypes.oneOf(["spinner", "progress"]).isRequired,
};

export default LoadingScreen;
