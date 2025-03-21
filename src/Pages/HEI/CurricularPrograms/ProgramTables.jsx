import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.min.css"; // Import Handsontable styles
import { useMemo } from "react";
import { registerAllModules } from "handsontable/registry"; // Register all modules
import PropTypes from "prop-types";
import { CircularProgress, Box } from "@mui/material";

// Register all Handsontable modules (including numeric cell type)
registerAllModules();

const ProgramTables = ({ programs, loading, subTabValue }) => {
    // Define column configurations for each subTabValue
    const columnConfigs = useMemo(
        () => ({
            0: {
                // Programs
                columns: [
                    { data: "program_name", title: "Program Name" },
                    { data: "program_code", title: "Program Code" },
                    { data: "major_name", title: "Major Name" },
                    { data: "major_code", title: "Major Code" },
                    { data: "category", title: "Category" },
                    { data: "serial", title: "Serial" },
                    { data: "year", title: "Year" },
                    {
                        data: "is_thesis_dissertation_required",
                        title: "Thesis/Dissertation", // Shortened title
                        type: "numeric",
                    },
                    {
                        data: "program_status",
                        title: "Status", // Shortened title
                        type: "numeric",
                    },
                    {
                        data: "calendar_use_code",
                        title: "Calendar", // Shortened title
                        type: "numeric",
                    },
                    {
                        data: "program_normal_length_in_years",
                        title: "Length",
                        type: "numeric",
                    },
                    { data: "lab_units", title: "Lab Units", type: "numeric" },
                    { data: "lecture_units", title: "Lecture Units", type: "numeric" },
                    { data: "total_units", title: "Total Units", type: "numeric" },
                    { data: "tuition_per_unit", title: "Tuition/Unit", type: "numeric" },
                    { data: "program_fee", title: "Program Fee", type: "numeric" },
                ],
                data: programs.map((program) => ({
                    program_name: program.program_name || "-",
                    program_code: program.program_code || "-",
                    major_name: program.major_name || "-",
                    major_code: program.major_code || "-",
                    category: program.category || "-",
                    serial: program.serial || "-",
                    year: program.year || "-",
                    is_thesis_dissertation_required: program.is_thesis_dissertation_required || "-",
                    program_status: program.program_status || "-",
                    calendar_use_code: program.calendar_use_code || "-",
                    program_normal_length_in_years: program.program_normal_length_in_years || "-",
                    lab_units: program.lab_units || 0,
                    lecture_units: program.lecture_units || 0,
                    total_units: program.total_units || 0,
                    tuition_per_unit: program.tuition_per_unit || 0,
                    program_fee: program.program_fee || 0,
                })),
            },
            1: {
                // Enrollments
                columns: [
                    { data: "program_name", title: "Program Name" },
                    { data: "new_students_freshmen_male", title: "Freshmen M", type: "numeric" },
                    { data: "new_students_freshmen_female", title: "Freshmen F", type: "numeric" },
                    { data: "first_year_old_male", title: "1st Yr M", type: "numeric" },
                    { data: "first_year_old_female", title: "1st Yr F", type: "numeric" },
                    { data: "second_year_male", title: "2nd Yr M", type: "numeric" },
                    { data: "second_year_female", title: "2nd Yr F", type: "numeric" },
                    { data: "third_year_male", title: "3rd Yr M", type: "numeric" },
                    { data: "third_year_female", title: "3rd Yr F", type: "numeric" },
                    { data: "fourth_year_male", title: "4th Yr M", type: "numeric" },
                    { data: "fourth_year_female", title: "4th Yr F", type: "numeric" },
                    { data: "fifth_year_male", title: "5th Yr M", type: "numeric" },
                    { data: "fifth_year_female", title: "5th Yr F", type: "numeric" },
                    { data: "sixth_year_male", title: "6th Yr M", type: "numeric" },
                    { data: "sixth_year_female", title: "6th Yr F", type: "numeric" },
                    { data: "seventh_year_male", title: "7th Yr M", type: "numeric" },
                    { data: "seventh_year_female", title: "7th Yr F", type: "numeric" },
                    { data: "subtotal_male", title: "Subtotal M", type: "numeric" },
                    { data: "subtotal_female", title: "Subtotal F", type: "numeric" },
                    { data: "grand_total", title: "Total", type: "numeric" },
                ],
                data: programs.flatMap(
                    (program) =>
                        program.enrollments?.map((enrollment) => ({
                            program_name: program.program_name || "-",
                            new_students_freshmen_male: enrollment.new_students_freshmen_male ?? 0,
                            new_students_freshmen_female: enrollment.new_students_freshmen_female ?? 0,
                            first_year_old_male: enrollment.first_year_old_male ?? 0,
                            first_year_old_female: enrollment.first_year_old_female ?? 0,
                            second_year_male: enrollment.second_year_male ?? 0,
                            second_year_female: enrollment.second_year_female ?? 0,
                            third_year_male: enrollment.third_year_male ?? 0,
                            third_year_female: enrollment.third_year_female ?? 0,
                            fourth_year_male: enrollment.fourth_year_male ?? 0,
                            fourth_year_female: enrollment.fourth_year_female ?? 0,
                            fifth_year_male: enrollment.fifth_year_male ?? 0,
                            fifth_year_female: enrollment.fifth_year_female ?? 0,
                            sixth_year_male: enrollment.sixth_year_male ?? 0,
                            sixth_year_female: enrollment.sixth_year_female ?? 0,
                            seventh_year_male: enrollment.seventh_year_male ?? 0,
                            seventh_year_female: enrollment.seventh_year_female ?? 0,
                            subtotal_male: enrollment.subtotal_male ?? 0,
                            subtotal_female: enrollment.subtotal_female ?? 0,
                            grand_total: enrollment.grand_total ?? 0,
                        })) || []
                ),
            },
            2: {
                // Statistics
                columns: [
                    { data: "program_name", title: "Program Name" },
                    { data: "lecture_units_actual", title: "Lecture Units", type: "numeric" },
                    { data: "laboratory_units_actual", title: "Lab Units", type: "numeric" },
                    { data: "total_units_actual", title: "Total Units", type: "numeric" },
                    { data: "graduates_males", title: "Grads M", type: "numeric" },
                    { data: "graduates_females", title: "Grads F", type: "numeric" },
                    { data: "graduates_total", title: "Grads Total", type: "numeric" },
                    { data: "externally_funded_merit_scholars", title: "Ext Scholars", type: "numeric" },
                    { data: "internally_funded_grantees", title: "Int Grantees", type: "numeric" },
                    { data: "suc_funded_grantees", title: "SUC Grantees", type: "numeric" },
                ],
                data: programs
                    .filter((program) => program.statistics)
                    .map((program) => ({
                        program_name: program.program_name || "-",
                        lecture_units_actual: program.statistics?.lecture_units_actual ?? 0,
                        laboratory_units_actual: program.statistics?.laboratory_units_actual ?? 0,
                        total_units_actual: program.statistics?.total_units_actual ?? 0,
                        graduates_males: program.statistics?.graduates_males ?? 0,
                        graduates_females: program.statistics?.graduates_females ?? 0,
                        graduates_total: program.statistics?.graduates_total ?? 0,
                        externally_funded_merit_scholars: program.statistics?.externally_funded_merit_scholars ?? 0,
                        internally_funded_grantees: program.statistics?.internally_funded_grantees ?? 0,
                        suc_funded_grantees: program.statistics?.suc_funded_grantees ?? 0,
                    })),
            },
        }),
        [programs]
    );

    if (loading) return <CircularProgress />;
    const currentConfig = columnConfigs[subTabValue] || columnConfigs[0];

    return (
        <Box sx={{ overflowX: "auto", maxHeight: "550px" }}>
            <HotTable
                data={currentConfig.data}
                columns={currentConfig.columns}
                colHeaders={true}
                rowHeaders={true}
                stretchH="all"
                height="550px" // Match your original maxHeight
                licenseKey="non-commercial-and-evaluation"
                settings={{
                    readOnly: true, // Keep as read-only for display purposes
                    manualColumnResize: true,
                    columnSorting: true,
                    contextMenu: false, // Disable context menu if not needed
                    nestedHeaders: [
                        subTabValue === 0
                            ? [
                                  { label: "CURRICULAR PROGRAM", colspan: 2 },
                                  { label: "MAJOR", colspan: 2 },
                                  { label: "AUTHORITY TO OFFER PROGRAM", colspan: 3 },
                                  { label: "THESIS/DISSERTATION\n1=Required 2=Optional 3=Not Req", colspan: 1 },
                                  { label: "STATUS\n1=Active 2=Phased Out 3=Abolished", colspan: 1 },
                                  { label: "CALENDAR\n1=Sem 2=Trisem 3=Qtr Sem 4=Distance", colspan: 1 },
                                  { label: "LENGTH", colspan: 1 },
                                  { label: "PROGRAM UNITS EXCLUDING THESIS", colspan: 3 },
                                  { label: "FINANCIAL INFORMATION", colspan: 2 },
                              ]
                            : subTabValue === 1
                            ? [
                                  { label: "Program Name", colspan: 1 },
                                  { label: "First Year", colspan: 4 },
                                  { label: "Second Year", colspan: 2 },
                                  { label: "Third Year", colspan: 2 },
                                  { label: "Fourth Year", colspan: 2 },
                                  { label: "Fifth Year", colspan: 2 },
                                  { label: "Sixth Year", colspan: 2 },
                                  { label: "Seventh Year", colspan: 2 },
                                  { label: "Totals", colspan: 3 },
                              ]
                            : [
                                  { label: "Program Name", colspan: 1 },
                                  { label: "Units", colspan: 3 },
                                  { label: "Graduates", colspan: 3 },
                                  { label: "Scholars & Grantees", colspan: 3 },
                              ],
                        currentConfig.columns.map((col) => col.title), // Sub-headers
                    ],
                    cells: (row, col) => {
                        const cellProperties = {};
                        // Apply word wrapping and width constraints to specific columns
                        if (subTabValue === 0 && [7, 8, 9].includes(col)) {
                            cellProperties.renderer = "text";
                            cellProperties.wordWrap = true;
                            cellProperties.width = 100; // Set a reasonable width
                        }
                        return cellProperties;
                    },
                }}
            />
            {currentConfig.data.length === 0 && (
                <Box sx={{ textAlign: "center", p: 2, color: "#666" }}>
                    No data available.
                </Box>
            )}
        </Box>
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
