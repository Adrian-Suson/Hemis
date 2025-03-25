import { Box, Skeleton } from "@mui/material";
import PropTypes from "prop-types";

const InstitutionManagementSkeleton = ({ count = 5 }) => {
    return (
        <Box sx={{ p: 3 }}>
            {/* Institution Table Skeleton */}
            <Box sx={{ mt: 3 }}>
                {Array.from({ length: count }).map((_, index) => (
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
InstitutionManagementSkeleton.propTypes = {
    count: PropTypes.number,
};

export default InstitutionManagementSkeleton;
