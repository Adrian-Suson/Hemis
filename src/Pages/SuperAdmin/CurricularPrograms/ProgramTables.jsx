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

    // Enhanced table styles with visible boxes
    const tableStyles = {
        overflowX: "auto",
        maxHeight: "550px",
        minWidth: "100%",
        "& .MuiTableCell-root": {
            fontSize: "12px",
            padding: "10px",
            whiteSpace: "nowrap",
            border: "1px solid rgba(224, 224, 224, 1)", // Add visible borders to all cells
        },
        "& .MuiTableHead-root .MuiTableCell-root": {
            backgroundColor: "#f5f5f5", // Light background for header cells
            fontWeight: "bold",
        },
        "& .MuiTableRow-root:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
        },
    };

    // Style for main header cells
    const mainHeaderStyle = {
        position: "sticky",
        top: 0, // Stick to the top
        backgroundColor: "#e0e0e0", // Slightly darker than subheaders
        fontWeight: "bold",
        textAlign: "center",
        border: "1px solid rgba(185, 185, 185, 1)",
        zIndex: 11000, // Ensure it stays on top
    };

    const subHeaderStyle = {
        position: "sticky",
        top: 46, // Stick to the top
        backgroundColor: "#e0e0e0", // Slightly darker than subheaders
        fontWeight: "bold",
        textAlign: "center",
        border: "1px solid rgba(185, 185, 185, 1)",
        zIndex: 11000, // Ensure it stays on top
    };


    const renderPrograms = () => (
        <Box sx={{ overflowX: "auto" }}>
            <TableContainer component={Paper} elevation={3} sx={tableStyles}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        {/* Main Header Row with Groupings */}
                        <TableRow>
                            <TableCell colSpan={2} sx={mainHeaderStyle}>
                                CURRICULAR PROGRAM
                            </TableCell>
                            <TableCell colSpan={2} sx={mainHeaderStyle}>
                                MAJOR
                            </TableCell>
                            <TableCell colSpan={3} sx={mainHeaderStyle}>
                                AUTHORITY TO OFFER PROGRAM
                            </TableCell>
                            <TableCell
                                rowSpan={2}
                                colSpan={1}
                                sx={{
                                    ...mainHeaderStyle,
                                    verticalAlign: "middle",
                                }}
                            >
                                IS THESIS/ DISSERTATION REQUIRED? <br />
                                1= REQUIRED 2=OPTIONAL 3=NOT REQ
                            </TableCell>
                            <TableCell
                                rowSpan={2}
                                sx={{
                                    ...mainHeaderStyle,
                                    verticalAlign: "middle",
                                }}
                            >
                                PROGRAM STATUS (USE CODE): <br />1 - ACTIVE;
                                2-PHASED OUT; 3-ABOLISHED
                            </TableCell>
                            <TableCell
                                rowSpan={2}
                                sx={{
                                    ...mainHeaderStyle,
                                    verticalAlign: "middle",
                                }}
                            >
                                PROGRAM CALENDAR (USE CODE): <br />
                                1 - SEM 2 - TRISEM <br />3 - QTR SEM 4 -
                                DISTANCE MODE
                            </TableCell>
                            <TableCell
                                rowSpan={2}
                                sx={{
                                    ...mainHeaderStyle,
                                    verticalAlign: "middle",
                                }}
                            >
                                PROGRAM NORMAL LENGTH
                            </TableCell>
                            <TableCell colSpan={3} sx={mainHeaderStyle}>
                                PROGRAM UNITS EXCLUDING THESIS
                            </TableCell>
                            <TableCell colSpan={3} sx={mainHeaderStyle}>
                                FINANCIAL INFORMATION
                            </TableCell>
                        </TableRow>

                        {/* Sub-header Row */}
                        <TableRow>
                            {[
                                "Program Name",
                                "Program Code",
                                "Major Name",
                                "Major Code",
                                "Category",
                                "Serial",
                                "Year",
                                "Lab Units",
                                "Lecture Units",
                                "Total Units",
                                "Tuition/Unit",
                                "Program Fee",
                            ].map((head) => (
                                <TableCell key={head} sx={subHeaderStyle}>
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
                                ].map((value, index) => (
                                    <TableCell key={index}>
                                        {value || "-"}
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
            <TableContainer component={Paper} elevation={3} sx={tableStyles}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        {/* Main Header Row with Groupings */}
                        <TableRow>
                            <TableCell
                                rowSpan={2}
                                sx={{
                                    ...mainHeaderStyle,
                                    verticalAlign: "middle",
                                }}
                            >
                                Program Name
                            </TableCell>
                            <TableCell colSpan={4} sx={mainHeaderStyle}>
                                First Year
                            </TableCell>
                            <TableCell colSpan={2} sx={mainHeaderStyle}>
                                Second Year
                            </TableCell>
                            <TableCell colSpan={2} sx={mainHeaderStyle}>
                                Third Year
                            </TableCell>
                            <TableCell colSpan={2} sx={mainHeaderStyle}>
                                Fourth Year
                            </TableCell>
                            <TableCell colSpan={2} sx={mainHeaderStyle}>
                                Fifth Year
                            </TableCell>
                            <TableCell colSpan={2} sx={mainHeaderStyle}>
                                Sixth Year
                            </TableCell>
                            <TableCell colSpan={2} sx={mainHeaderStyle}>
                                Seventh Year
                            </TableCell>
                            <TableCell colSpan={3} sx={mainHeaderStyle}>
                                Totals
                            </TableCell>
                        </TableRow>

                        {/* Sub-header Row */}
                        <TableRow>
                            {[
                                "Freshmen M",
                                "Freshmen F",
                                "1st Yr M",
                                "1st Yr F",
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
                                <TableCell key={head} sx={subHeaderStyle}>{head}</TableCell>
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
                                            {value ?? 0}
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
            <TableContainer component={Paper} elevation={3} sx={tableStyles}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell
                                rowSpan={2}
                                sx={{
                                    ...mainHeaderStyle,
                                    verticalAlign: "middle",
                                }}
                            >
                                Program Name
                            </TableCell>
                            <TableCell colSpan={3} sx={mainHeaderStyle}>
                                Units
                            </TableCell>
                            <TableCell colSpan={3} sx={mainHeaderStyle}>
                                Graduates
                            </TableCell>
                            <TableCell colSpan={3} sx={mainHeaderStyle}>
                                Scholars & Grantees
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            {[
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
                                <TableCell key={head} sx={subHeaderStyle}>{head}</TableCell>
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
                                            {value ?? 0}
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
