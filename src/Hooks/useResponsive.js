import { useMediaQuery, useTheme } from "@mui/material";

const useResponsive = () => {
    const theme = useTheme();
    const isExtraSmall = useMediaQuery(theme.breakpoints.down("sm")); // <300px
    const isSmall = useMediaQuery(theme.breakpoints.between("sm", "md")); // 300px to <1000px
    const isMedium = useMediaQuery(theme.breakpoints.between("md", "lg")); // 1000px to <1500px
    const isLarge = useMediaQuery(theme.breakpoints.between("lg", "xl")); // 1500px to <1900px
    const isXLarge = useMediaQuery(theme.breakpoints.up("xl")); // >=1900px

    return { isExtraSmall, isSmall, isMedium, isLarge, isXLarge };
};

export default useResponsive;
