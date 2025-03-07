import { Buffer } from "buffer";
window.Buffer = Buffer;

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme.jsx";
import "./main.css";
import { ProgressProvider } from "./Context/ProgressContext";

createRoot(document.getElementById("root")).render(
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <StrictMode>
            <ProgressProvider>
                <App />
            </ProgressProvider>
        </StrictMode>
    </ThemeProvider>
);
