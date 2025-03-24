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
                    variant="text"
                    width={200}
                    height={30}
                    sx={{ mb: 2 }}
                />

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
                        <Skeleton variant="text" width="15%" />
                        <Skeleton variant="text" width="15%" />
                        <Skeleton variant="text" width="20%" />
                        <Skeleton variant="text" width="15%" />
                        <Skeleton variant="text" width="15%" />
                        <Skeleton variant="text" width="10%" />
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default CampusManagementSkeleton;
