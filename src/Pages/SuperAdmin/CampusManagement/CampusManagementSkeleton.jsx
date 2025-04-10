// CampusManagementSkeleton.jsx
import { Box, Breadcrumbs, Skeleton } from "@mui/material";

const CampusManagementSkeleton = () => {
    return (
        <Box sx={{ p: 2 }}>
            {/* Breadcrumbs Skeleton */}
            <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 2 }}>
                <Skeleton variant="text" width={80} />
                <Skeleton variant="text" width={120} />
                <Skeleton variant="text" width={150} />
            </Breadcrumbs>

            {/* Handsontable Skeleton */}
            <Box sx={{ mt: 3 }}>
                {/* Table Header Skeleton (if applicable) */}
                <Skeleton
                    variant="rectangular"
                    width={150}
                    height={36}
                    sx={{ mt: 3, ml: "auto" }}
                />
            </Box>
        </Box>
    );
};

export default CampusManagementSkeleton;
