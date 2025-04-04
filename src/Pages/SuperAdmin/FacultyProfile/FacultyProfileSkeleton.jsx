import {
    Table,
    TableBody,
    TableCell,
    TableRow,
    Skeleton,
    Paper,
} from "@mui/material";
import PropTypes from "prop-types";

const FacultyProfileSkeleton = () => {
    return (
        <Paper sx={{ height: "550px", overflow: "auto" }}>
            <Table>
                <TableBody>
                    {[...Array(10)].map((_, index) => (
                        <TableRow key={index}>
                            {[...Array(10)].map((_, cellIndex) => (
                                <TableCell size="small" key={cellIndex}>
                                    <Skeleton variant="text" width={`${100 - cellIndex * 5}%`} />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
};

FacultyProfileSkeleton.propTypes = {
    rowCount: PropTypes.number.isRequired,
};

export default FacultyProfileSkeleton;
