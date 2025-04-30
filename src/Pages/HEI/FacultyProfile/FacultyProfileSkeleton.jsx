// CampusManagementSkeleton.jsx
import { Box, Skeleton, Typography } from "@mui/material";

const FacultyProfileSkeleton = () => {
    return (
        <Box sx={{ p: 3 }}>
            {/* Breadcrumbs Skeleton */}
            <Box sx={{ my: 2, display: "flex", alignItems: "center" }}>
                <Skeleton variant="text" width={80} height={20} />
                <Typography sx={{ mx: 1 }}>›</Typography>
                <Skeleton variant="text" width={150} height={20} />
                <Typography sx={{ mx: 1 }}>›</Typography>
                <Skeleton variant="text" width={150} height={20} />
            </Box>
            {/* Button Skeleton */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                <Skeleton
                    variant="rounded"
                    width={150}
                    height={36}
                    sx={{ ml: 1 }}
                />
                <Skeleton
                    variant="rounded"
                    width={150}
                    height={36}
                    sx={{ ml: 1 }}
                />
            </Box>

            {/* Table Skeleton */}
            <Skeleton variant="rounded" width="100%" height={550} />
        </Box>
    );
};

export default FacultyProfileSkeleton;
