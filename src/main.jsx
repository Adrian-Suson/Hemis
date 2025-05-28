import { Buffer } from "buffer";
window.Buffer = Buffer;

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./main.css";
import { LoadingProvider } from "./Context/LoadingContext.jsx";

// Create a QueryClient instance

createRoot(document.getElementById("root")).render(
        <StrictMode>
                <LoadingProvider>
                    <App />
                </LoadingProvider>
        </StrictMode>
);
