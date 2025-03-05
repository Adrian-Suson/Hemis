import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    CircularProgress,
    Typography,
    TableContainer,
    Paper,
} from "@mui/material";
import PropTypes from "prop-types";

const ProgramTables = ({
    programs,
    loading,
    subTabValue,
}) => {
    if (loading) {
        return <CircularProgress />;
    }

    if (!programs.length) {
        return <Typography>No data available</Typography>;
    }

    const renderPrograms = () => (
        <TableContainer component={Paper} elevation={3}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>
                            Program Name
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                            Program Code
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                            Major Name
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                            Major Code
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                            Category
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                            Serial
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Year</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                            Thesis Required
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                            Status
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                            Calendar Code
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                            Length (Years)
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                            Lab Units
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                            Lecture Units
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                            Total Units
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                            Tuition/Unit
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                            Program Fee
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                            Program Type
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={17} align="center">
                                <CircularProgress />
                            </TableCell>
                        </TableRow>
                    ) : programs.length > 0 ? (
                        programs.map((program) => (
                            <TableRow key={program.id}>
                                <TableCell>
                                    {program.program_name || "N/A"}
                                </TableCell>
                                <TableCell>
                                    {program.program_code || "N/A"}
                                </TableCell>
                                <TableCell>
                                    {program.major_name || "N/A"}
                                </TableCell>
                                <TableCell>
                                    {program.major_code || "N/A"}
                                </TableCell>
                                <TableCell>
                                    {program.category || "N/A"}
                                </TableCell>
                                <TableCell>{program.serial || "N/A"}</TableCell>
                                <TableCell>{program.year || "N/A"}</TableCell>
                                <TableCell>
                                    {program.is_thesis_dissertation_required ||
                                        "N/A"}
                                </TableCell>
                                <TableCell>
                                    {program.program_status || "N/A"}
                                </TableCell>
                                <TableCell>
                                    {program.calendar_use_code || "N/A"}
                                </TableCell>
                                <TableCell>
                                    {program.program_normal_length_in_years ||
                                        0}
                                </TableCell>
                                <TableCell>{program.lab_units || 0}</TableCell>
                                <TableCell>
                                    {program.lecture_units || 0}
                                </TableCell>
                                <TableCell>
                                    {program.total_units || 0}
                                </TableCell>
                                <TableCell>
                                    {program.tuition_per_unit || 0}
                                </TableCell>
                                <TableCell>
                                    {program.program_fee || 0}
                                </TableCell>
                                <TableCell>
                                    {program.program_type || "N/A"}
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={17} align="center">
                                No programs found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );

    const renderEnrollments = () => (
        <TableContainer component={Paper} elevation={3}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>
                            Program Name
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                            Freshmen Male
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                            Freshmen Female
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                            1st Yr Old Male
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                            1st Yr Old Female
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                            2nd Yr Male
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                            2nd Yr Female
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                            3rd Yr Male
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                            3rd Yr Female
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                            4th Yr Male
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                            4th Yr Female
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                            5th Yr Male
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                            5th Yr Female
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                            6th Yr Male
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                            6th Yr Female
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                            7th Yr Male
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                            7th Yr Female
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                            Subtotal Male
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                            Subtotal Female
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                            Grand Total
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={20} align="center">
                                <CircularProgress />
                            </TableCell>
                        </TableRow>
                    ) : programs.length > 0 ? (
                        programs.map((program) =>
                            program.enrollments?.map((enrollment) => (
                                <TableRow key={enrollment.id}>
                                    <TableCell>
                                        {program.program_name || "N/A"}
                                    </TableCell>
                                    <TableCell>
                                        {enrollment.new_students_freshmen_male ||
                                            0}
                                    </TableCell>
                                    <TableCell>
                                        {enrollment.new_students_freshmen_female ||
                                            0}
                                    </TableCell>
                                    <TableCell>
                                        {enrollment.first_year_old_male || 0}
                                    </TableCell>
                                    <TableCell>
                                        {enrollment.first_year_old_female || 0}
                                    </TableCell>
                                    <TableCell>
                                        {enrollment.second_year_male || 0}
                                    </TableCell>
                                    <TableCell>
                                        {enrollment.second_year_female || 0}
                                    </TableCell>
                                    <TableCell>
                                        {enrollment.third_year_male || 0}
                                    </TableCell>
                                    <TableCell>
                                        {enrollment.third_year_female || 0}
                                    </TableCell>
                                    <TableCell>
                                        {enrollment.fourth_year_male || 0}
                                    </TableCell>
                                    <TableCell>
                                        {enrollment.fourth_year_female || 0}
                                    </TableCell>
                                    <TableCell>
                                        {enrollment.fifth_year_male || 0}
                                    </TableCell>
                                    <TableCell>
                                        {enrollment.fifth_year_female || 0}
                                    </TableCell>
                                    <TableCell>
                                        {enrollment.sixth_year_male || 0}
                                    </TableCell>
                                    <TableCell>
                                        {enrollment.sixth_year_female || 0}
                                    </TableCell>
                                    <TableCell>
                                        {enrollment.seventh_year_male || 0}
                                    </TableCell>
                                    <TableCell>
                                        {enrollment.seventh_year_female || 0}
                                    </TableCell>
                                    <TableCell>
                                        {enrollment.subtotal_male || 0}
                                    </TableCell>
                                    <TableCell>
                                        {enrollment.subtotal_female || 0}
                                    </TableCell>
                                    <TableCell>
                                        {enrollment.grand_total || 0}
                                    </TableCell>
                                </TableRow>
                            ))
                        )
                    ) : (
                        <TableRow>
                            <TableCell colSpan={20} align="center">
                                No enrollments found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );

    const renderStatistics = () => (
        <TableContainer component={Paper} elevation={3}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>
                            Program Name
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                            Lecture Units Actual
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                            Lab Units Actual
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                            Total Units Actual
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                            Graduates Males
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                            Graduates Females
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                            Graduates Total
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                            External Scholars
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                            Internal Grantees
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                            SUC Grantees
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={10} align="center">
                                <CircularProgress />
                            </TableCell>
                        </TableRow>
                    ) : programs.length > 0 ? (
                        programs.map((program) =>
                            program.statistics ? (
                                <TableRow key={program.statistics.id}>
                                    <TableCell>
                                        {program.program_name || "N/A"}
                                    </TableCell>
                                    <TableCell>
                                        {program.statistics
                                            .lecture_units_actual || 0}
                                    </TableCell>
                                    <TableCell>
                                        {program.statistics
                                            .laboratory_units_actual || 0}
                                    </TableCell>
                                    <TableCell>
                                        {program.statistics
                                            .total_units_actual || 0}
                                    </TableCell>
                                    <TableCell>
                                        {program.statistics.graduates_males ||
                                            0}
                                    </TableCell>
                                    <TableCell>
                                        {program.statistics.graduates_females ||
                                            0}
                                    </TableCell>
                                    <TableCell>
                                        {program.statistics.graduates_total ||
                                            0}
                                    </TableCell>
                                    <TableCell>
                                        {program.statistics
                                            .externally_funded_merit_scholars ||
                                            0}
                                    </TableCell>
                                    <TableCell>
                                        {program.statistics
                                            .internally_funded_grantees || 0}
                                    </TableCell>
                                    <TableCell>
                                        {program.statistics
                                            .suc_funded_grantees || 0}
                                    </TableCell>
                                </TableRow>
                            ) : null
                        )
                    ) : (
                        <TableRow>
                            <TableCell colSpan={10} align="center">
                                No statistics found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
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
            program_code: PropTypes.string,
            major_name: PropTypes.string,
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
