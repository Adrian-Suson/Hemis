import { Box, Skeleton } from "@mui/material";

const FacultyProfileSkeleton = () => {
    return (
        <Box sx={{ width: "100%", mt: 2 }}>
            {/* You can adjust the number and size of Skeletons to match your table layout */}
            <Skeleton variant="rectangular" height={40} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" height={40} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" height={40} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" height={40} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" height={40} sx={{ mb: 1 }} />
        </Box>
    );
};

export default FacultyProfileSkeleton;
