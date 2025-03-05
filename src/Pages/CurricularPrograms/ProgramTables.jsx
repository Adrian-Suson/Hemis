import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    CircularProgress,
    TableContainer,
    Paper,
    Box,
} from "@mui/material";
import PropTypes from "prop-types";

const ProgramTables = ({ programs, loading, subTabValue }) => {
    if (loading) return <CircularProgress />;


    const tableStyles = {
        overflowX: "auto",
        maxHeight: "550px",
        minWidth: "100%", // Set minimum width for the table
        "& th, & td": {
            fontSize: "12px",
            padding: "10px", // Increased padding for better spacing
            whiteSpace: "nowrap", // Prevent text from wrapping
        },
    };

    const renderPrograms = () => (
        <Box sx={{ overflowX: "auto" }}>
            <TableContainer component={Paper} elevation={2} sx={tableStyles}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            {[
                                "Program Name",
                                "Program Code",
                                "Major Name",
                                "Major Code",
                                "Category",
                                "Serial",
                                "Year",
                                "Thesis Req",
                                "Status",
                                "Calendar Code",
                                "Length",
                                "Lab Units",
                                "Lecture Units",
                                "Total Units",
                                "Tuition/Unit",
                                "Program Fee",
                                "Program Type",
                            ].map((head) => (
                                <TableCell
                                    key={head}
                                    sx={{ fontWeight: "bold" }}
                                >
                                    {head}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {programs.map((program) => (
                            <TableRow key={program.id}>
                                {[
                                    program.program_name,
                                    program.program_code,
                                    program.major_name,
                                    program.major_code,
                                    program.category,
                                    program.serial,
                                    program.year,
                                    program.is_thesis_dissertation_required,
                                    program.program_status,
                                    program.calendar_use_code,
                                    program.program_normal_length_in_years,
                                    program.lab_units,
                                    program.lecture_units,
                                    program.total_units,
                                    program.tuition_per_unit,
                                    program.program_fee,
                                    program.program_type,
                                ].map((value, index) => (
                                    <TableCell key={index}>
                                        {value || " "}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

    const renderEnrollments = () => (
        <Box sx={{ overflowX: "auto" }}>
            <TableContainer component={Paper} elevation={2} sx={tableStyles}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            {[
                                "Program Name",
                                "Freshmen M",
                                "Freshmen F",
                                "1st Yr Old M",
                                "1st Yr Old F",
                                "2nd Yr M",
                                "2nd Yr F",
                                "3rd Yr M",
                                "3rd Yr F",
                                "4th Yr M",
                                "4th Yr F",
                                "5th Yr M",
                                "5th Yr F",
                                "6th Yr M",
                                "6th Yr F",
                                "7th Yr M",
                                "7th Yr F",
                                "Subtotal M",
                                "Subtotal F",
                                "Total",
                            ].map((head) => (
                                <TableCell
                                    key={head}
                                    sx={{ fontWeight: "bold" }}
                                >
                                    {head}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {programs.flatMap((program) =>
                            program.enrollments?.map((enrollment) => (
                                <TableRow key={enrollment.id}>
                                    {[
                                        program.program_name,
                                        enrollment.new_students_freshmen_male,
                                        enrollment.new_students_freshmen_female,
                                        enrollment.first_year_old_male,
                                        enrollment.first_year_old_female,
                                        enrollment.second_year_male,
                                        enrollment.second_year_female,
                                        enrollment.third_year_male,
                                        enrollment.third_year_female,
                                        enrollment.fourth_year_male,
                                        enrollment.fourth_year_female,
                                        enrollment.fifth_year_male,
                                        enrollment.fifth_year_female,
                                        enrollment.sixth_year_male,
                                        enrollment.sixth_year_female,
                                        enrollment.seventh_year_male,
                                        enrollment.seventh_year_female,
                                        enrollment.subtotal_male,
                                        enrollment.subtotal_female,
                                        enrollment.grand_total,
                                    ].map((value, index) => (
                                        <TableCell key={index}>
                                            {value || 0}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

    const renderStatistics = () => (
        <Box sx={{ overflowX: "auto" }}>
            <TableContainer component={Paper} elevation={2} sx={tableStyles}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            {[
                                "Program Name",
                                "Lecture Units",
                                "Lab Units",
                                "Total Units",
                                "Grads M",
                                "Grads F",
                                "Grads Total",
                                "Ext Scholars",
                                "Int Grantees",
                                "SUC Grantees",
                            ].map((head) => (
                                <TableCell
                                    key={head}
                                    sx={{ fontWeight: "bold" }}
                                >
                                    {head}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {programs.map((program) =>
                            program.statistics ? (
                                <TableRow key={program.statistics.id}>
                                    {[
                                        program.program_name,
                                        program.statistics.lecture_units_actual,
                                        program.statistics
                                            .laboratory_units_actual,
                                        program.statistics.total_units_actual,
                                        program.statistics.graduates_males,
                                        program.statistics.graduates_females,
                                        program.statistics.graduates_total,
                                        program.statistics
                                            .externally_funded_merit_scholars,
                                        program.statistics
                                            .internally_funded_grantees,
                                        program.statistics.suc_funded_grantees,
                                    ].map((value, index) => (
                                        <TableCell key={index}>
                                            {value || 0}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ) : null
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

    return (
        <>
            {subTabValue === 0 && renderPrograms()}
            {subTabValue === 1 && renderEnrollments()}
            {subTabValue === 2 && renderStatistics()}
        </>
    );
};

// Define PropTypes
ProgramTables.propTypes = {
    programs: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            program_name: PropTypes.string.isRequired,
            enrollments: PropTypes.arrayOf(
                PropTypes.shape({
                    new_students_freshmen_male: PropTypes.number,
                    new_students_freshmen_female: PropTypes.number,
                    grand_total: PropTypes.number,
                })
            ),
            statistics: PropTypes.shape({
                total_units_actual: PropTypes.number,
                graduates_males: PropTypes.number,
                graduates_females: PropTypes.number,
            }),
        })
    ).isRequired,
    loading: PropTypes.bool.isRequired,
    subTabValue: PropTypes.number.isRequired,
};

export default ProgramTables;
