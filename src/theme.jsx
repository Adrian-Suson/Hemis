import { createTheme } from "@mui/material";

const theme = createTheme({
    palette: {
        primary: {
            100: "#D0E4FF",
            200: "#A1C9FF",
            300: "#72ADFF",
            400: "#438FFF",
            main: "#0056D2", // Deep Blue
            600: "#0047B3",
            700: "#003B99",
            800: "#002F7F",
            900: "#002266",
        },
        secondary: {
            100: "#E3E9F5",
            200: "#C6D4EC",
            300: "#A9BFE3",
            400: "#8CAAD9",
            main: "#6F95D0", // Muted Blue Accent
            600: "#5A7BB3",
            700: "#456199",
            800: "#30477F",
            900: "#1B2D66",
        },
        grey: {
            100: "#F8F8F8",
            200: "#EDEDED",
            300: "#D3D3D3",
            400: "#AFAFAF",
            500: "#8A8A8A",
            600: "#5F5F5F",
            700: "#3B3B3B",
            800: "#1F1F1F",
            900: "#121212", // Darkest Black
        },
        background: {
            default: "#FFFFFF", // White Background
            paper: "#F8F9FA", // Slightly Off-White Paper
        },
        text: {
            primary: "#121212", // Black for Contrast
            secondary: "#444444", // Dark Grey for Subtext
            disabled: "#6F6F6F",
            hint: "#A0A0A0",
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontSize: "2.25rem", fontWeight: 600, color: "#121212" },
        h2: { fontSize: "1.875rem", fontWeight: 600, color: "#121212" },
        h3: { fontSize: "1.5rem", fontWeight: 600, color: "#121212" },
        h4: { fontSize: "1.25rem", fontWeight: 500, color: "#333333" },
        h5: { fontSize: "1.125rem", fontWeight: 500, color: "#444444" },
        h6: { fontSize: "1rem", fontWeight: 500, color: "#555555" },
        body1: { fontSize: "1rem", fontWeight: 400, color: "#222222" },
        body2: { fontSize: "0.875rem", fontWeight: 400, color: "#333333" },
        subtitle1: { fontSize: "1rem", fontWeight: 400, color: "#555555" },
        subtitle2: { fontSize: "0.875rem", fontWeight: 400, color: "#666666" },
        button: { textTransform: "none", fontWeight: 600 },
        caption: { fontSize: "0.75rem", fontWeight: 400, color: "#666666" },
        overline: { fontSize: "0.75rem", fontWeight: 400, color: "#777777" },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 6,
                    textTransform: "none",
                    fontWeight: 600,
                },
                containedPrimary: {
                    backgroundColor: "#0056D2",
                    "&:hover": { backgroundColor: "#0047B3" },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
                    backgroundColor: "#FFFFFF",
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    borderRadius: 6,
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: "#121212", // Dark Sidebar Background
                    color: "#FFFFFF",
                },
            },
        },
    },
});

export default theme;
