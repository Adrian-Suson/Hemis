import { useMediaQuery, useTheme } from "@mui/material";

const useResponsive = () => {
    const theme = useTheme();
    const isExtraSmall = useMediaQuery(theme.breakpoints.down("xs")); // Extra small screens
    const isSmall = useMediaQuery(theme.breakpoints.down("sm")); // Small screens
    const isMedium = useMediaQuery(theme.breakpoints.down("md")); // Medium screens
    const isLarge = useMediaQuery(theme.breakpoints.down("lg")); // Large screens
    const isXLarge = useMediaQuery(theme.breakpoints.up("lg")); // Extra large screens

    return { isExtraSmall, isSmall, isMedium, isLarge, isXLarge };
};

export default useResponsive;
