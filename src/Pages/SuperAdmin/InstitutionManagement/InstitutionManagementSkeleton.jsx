// InstitutionManagementSkeleton.jsx
import {
    Box,
    Breadcrumbs,
    Tabs,
    Tab,
    Skeleton,
    ButtonGroup,
} from "@mui/material";

const InstitutionManagementSkeleton = () => {
    return (
        <Box sx={{ p: 3 }}>
            {/* Breadcrumbs Skeleton */}
            <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 2 }}>
                <Skeleton variant="text" width={80} />
                <Skeleton variant="text" width={120} />
            </Breadcrumbs>

            {/* Button Group Skeleton */}
            <ButtonGroup sx={{ mt: 3, display: "flex" }}>
                <Skeleton
                    variant="rectangular"
                    width={150}
                    height={36}
                    sx={{ mr: 1 }}
                />
                <Skeleton variant="rectangular" width={150} height={36} />
            </ButtonGroup>

            {/* Tabs Skeleton */}
            <Tabs
                value={0}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                    "& .MuiTab-root": {
                        fontWeight: "bold",
                        textTransform: "none",
                    },
                    textUnderlineOffset: 0,
                }}
                TabIndicatorProps={{
                    style: {
                        display: "none", // This removes the underline (indicator)
                    },
                }}
            >
                {Array.from({ length: 3 }).map((_, index) => (
                    <Tab
                        key={index}
                        label={<Skeleton variant="text" width={60} />}
                        disabled // Optionally disable the tab since it's a skeleton
                    />
                ))}
            </Tabs>

            {/* Institution Table Skeleton */}
            <Box sx={{ mt: 3 }}>
                {/* Table Header Skeleton */}
                {/* Table Rows Skeleton */}
                {Array.from({ length: 5 }).map((_, index) => (
                    <Box
                        key={index}
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            p: 2,
                            border: 1,
                            borderColor: "divider",
                            borderRadius: 2,
                            mb: 1,
                        }}
                    >
                        <Skeleton variant="text" width="20%" />
                        <Skeleton variant="text" width="15%" />
                        <Skeleton variant="text" width="25%" />
                        <Skeleton variant="text" width="15%" />
                        <Skeleton
                            variant="rectangular"
                            width={100}
                            height={36}
                        />
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default InstitutionManagementSkeleton;
