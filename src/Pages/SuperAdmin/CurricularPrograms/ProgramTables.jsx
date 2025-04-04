import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.min.css";
import { useState, useMemo, useEffect, useCallback } from "react";
import { registerAllModules } from "handsontable/registry";
import PropTypes from "prop-types";
import axios from "axios";
import {
    CircularProgress,
    Box,
    TextField,
    Grid,
    Tabs,
    Tab,
    Paper,
} from "@mui/material";

// Register all Handsontable modules
registerAllModules();

const ProgramTables = ({ programs, loading }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredPrograms, setFilteredPrograms] = useState(programs);
    const [subTabValue, setSubTabValue] = useState(0); // State for sub-tabs

    // Apply search and filters
    useEffect(() => {
        let filtered = [...programs];

        if (searchQuery) {
            filtered = filtered.filter((program) =>
                Object.values(program).some((value) =>
                    String(value)
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                )
            );
        }

        setFilteredPrograms(filtered);
    }, [programs, searchQuery]);

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
                        title: "Thesis/Dissertation",
                    },
                    { data: "program_status", title: "Status" },
                    { data: "calendar_use_code", title: "Calendar" },
                    {
                        data: "program_normal_length_in_years",
                        title: "Length",
                        type: "numeric",
                    },
                    { data: "lab_units", title: "Lab Units", type: "numeric" },
                    {
                        data: "lecture_units",
                        title: "Lecture Units",
                        type: "numeric",
                    },
                    {
                        data: "total_units",
                        title: "Total Units",
                        type: "numeric",
                        readOnly: true, // Make this read-only since it's calculated
                    },
                    {
                        data: "tuition_per_unit",
                        title: "Tuition/Unit",
                        type: "numeric",
                    },
                    {
                        data: "program_fee",
                        title: "Program Fee",
                        type: "numeric",
                    },
                ],
                data: filteredPrograms.map((program) => ({
                    id: program.id,
                    program_name: program.program_name || "-",
                    program_code: program.program_code || "-",
                    major_name: program.major_name || "-",
                    major_code: program.major_code || "-",
                    category: program.category || "-",
                    serial: program.serial || "-",
                    year: program.year || "-",
                    is_thesis_dissertation_required:
                        program.is_thesis_dissertation_required || "-",
                    program_status: program.program_status || "-",
                    calendar_use_code: program.calendar_use_code || "-",
                    program_normal_length_in_years:
                        program.program_normal_length_in_years || "-",
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
                    {
                        data: "new_students_freshmen_male",
                        title: "Freshmen M",
                        type: "numeric",
                    },
                    {
                        data: "new_students_freshmen_female",
                        title: "Freshmen F",
                        type: "numeric",
                    },
                    {
                        data: "first_year_old_male",
                        title: "1st Yr M",
                        type: "numeric",
                    },
                    {
                        data: "first_year_old_female",
                        title: "1st Yr F",
                        type: "numeric",
                    },
                    {
                        data: "second_year_male",
                        title: "2nd Yr M",
                        type: "numeric",
                    },
                    {
                        data: "second_year_female",
                        title: "2nd Yr F",
                        type: "numeric",
                    },
                    {
                        data: "third_year_male",
                        title: "3rd Yr M",
                        type: "numeric",
                    },
                    {
                        data: "third_year_female",
                        title: "3rd Yr F",
                        type: "numeric",
                    },
                    {
                        data: "fourth_year_male",
                        title: "4th Yr M",
                        type: "numeric",
                    },
                    {
                        data: "fourth_year_female",
                        title: "4th Yr F",
                        type: "numeric",
                    },
                    {
                        data: "fifth_year_male",
                        title: "5th Yr M",
                        type: "numeric",
                    },
                    {
                        data: "fifth_year_female",
                        title: "5th Yr F",
                        type: "numeric",
                    },
                    {
                        data: "sixth_year_male",
                        title: "6th Yr M",
                        type: "numeric",
                    },
                    {
                        data: "sixth_year_female",
                        title: "6th Yr F",
                        type: "numeric",
                    },
                    {
                        data: "seventh_year_male",
                        title: "7th Yr M",
                        type: "numeric",
                    },
                    {
                        data: "seventh_year_female",
                        title: "7th Yr F",
                        type: "numeric",
                    },
                    {
                        data: "subtotal_male",
                        title: "Subtotal M",
                        type: "numeric",
                        readOnly: true, // Already read-only
                    },
                    {
                        data: "subtotal_female",
                        title: "Subtotal F",
                        type: "numeric",
                        readOnly: true, // Already read-only
                    },
                    {
                        data: "grand_total",
                        title: "Total",
                        type: "numeric",
                        readOnly: true, // Already read-only
                    },
                ],
                data: filteredPrograms.map((program) => ({
                    id: program.id,
                    program_name: program.program_name || "-",
                    new_students_freshmen_male:
                        program.new_students_freshmen_male ?? 0,
                    new_students_freshmen_female:
                        program.new_students_freshmen_female ?? 0,
                    first_year_old_male: program.first_year_old_male ?? 0,
                    first_year_old_female: program.first_year_old_female ?? 0,
                    second_year_male: program.second_year_male ?? 0,
                    second_year_female: program.second_year_female ?? 0,
                    third_year_male: program.third_year_male ?? 0,
                    third_year_female: program.third_year_female ?? 0,
                    fourth_year_male: program.fourth_year_male ?? 0,
                    fourth_year_female: program.fourth_year_female ?? 0,
                    fifth_year_male: program.fifth_year_male ?? 0,
                    fifth_year_female: program.fifth_year_female ?? 0,
                    sixth_year_male: program.sixth_year_male ?? 0,
                    sixth_year_female: program.sixth_year_female ?? 0,
                    seventh_year_male: program.seventh_year_male ?? 0,
                    seventh_year_female: program.seventh_year_female ?? 0,
                    subtotal_male: program.subtotal_male ?? 0,
                    subtotal_female: program.subtotal_female ?? 0,
                    grand_total: program.grand_total ?? 0,
                })),
            },
            2: {
                // Statistics
                columns: [
                    { data: "program_name", title: "Program Name" },
                    {
                        data: "lecture_units_actual",
                        title: "Lecture Units",
                        type: "numeric",
                    },
                    {
                        data: "laboratory_units_actual",
                        title: "Lab Units",
                        type: "numeric",
                    },
                    {
                        data: "total_units_actual",
                        title: "Total Units",
                        type: "numeric",
                        readOnly: true, // Make this read-only since it's calculated
                    },
                    {
                        data: "graduates_males",
                        title: "Grads M",
                        type: "numeric",
                    },
                    {
                        data: "graduates_females",
                        title: "Grads F",
                        type: "numeric",
                    },
                    {
                        data: "graduates_total",
                        title: "Grads Total",
                        type: "numeric",
                        readOnly: true, // Make this read-only since it's calculated
                    },
                    {
                        data: "externally_funded_merit_scholars",
                        title: "Ext Scholars",
                        type: "numeric",
                    },
                    {
                        data: "internally_funded_grantees",
                        title: "Int Grantees",
                        type: "numeric",
                    },
                    {
                        data: "suc_funded_grantees",
                        title: "SUC Grantees",
                        type: "numeric",
                    },
                ],
                data: filteredPrograms.map((program) => ({
                    id: program.id,
                    program_name: program.program_name || "-",
                    lecture_units_actual: program.lecture_units_actual ?? 0,
                    laboratory_units_actual:
                        program.laboratory_units_actual ?? 0,
                    total_units_actual: program.total_units_actual ?? 0,
                    graduates_males: program.graduates_males ?? 0,
                    graduates_females: program.graduates_females ?? 0,
                    graduates_total: program.graduates_total ?? 0,
                    externally_funded_merit_scholars:
                        program.externally_funded_merit_scholars ?? 0,
                    internally_funded_grantees:
                        program.internally_funded_grantees ?? 0,
                    suc_funded_grantees: program.suc_funded_grantees ?? 0,
                })),
            },
        }),
        [filteredPrograms]
    );

    // Handle cell changes and save to backend with subtotal/grand total updates
    const handleChanges = useCallback(
        async (changes, source) => {
            if (!changes || source === "loadData") return;

            const updatedPrograms = [...filteredPrograms];
            const token = localStorage.getItem("token");
            const currentConfig =
                columnConfigs[subTabValue] || columnConfigs[0];

            for (const [row, prop, , newValue] of changes) {
                const programData = currentConfig.data[row];
                const programIndex = updatedPrograms.findIndex(
                    (p) => p.id === programData.id
                );

                if (programIndex !== -1) {
                    // Update the changed field
                    updatedPrograms[programIndex][prop] = newValue;

                    // Recalculate totals based on the tab
                    if (subTabValue === 0) {
                        // Programs tab: Update total_units
                        updatedPrograms[programIndex].total_units =
                            (parseFloat(
                                updatedPrograms[programIndex].lab_units
                            ) || 0) +
                            (parseFloat(
                                updatedPrograms[programIndex].lecture_units
                            ) || 0);
                    } else if (subTabValue === 1) {
                        // Enrollments tab: Recalculate subtotals and grand total
                        const maleFields = [
                            "new_students_freshmen_male",
                            "first_year_old_male",
                            "second_year_male",
                            "third_year_male",
                            "fourth_year_male",
                            "fifth_year_male",
                            "sixth_year_male",
                            "seventh_year_male",
                        ];
                        const femaleFields = [
                            "new_students_freshmen_female",
                            "first_year_old_female",
                            "second_year_female",
                            "third_year_female",
                            "fourth_year_female",
                            "fifth_year_female",
                            "sixth_year_female",
                            "seventh_year_female",
                        ];

                        updatedPrograms[programIndex].subtotal_male =
                            maleFields.reduce((sum, field) => {
                                return (
                                    sum +
                                    (parseFloat(
                                        updatedPrograms[programIndex][field]
                                    ) || 0)
                                );
                            }, 0);

                        updatedPrograms[programIndex].subtotal_female =
                            femaleFields.reduce((sum, field) => {
                                return (
                                    sum +
                                    (parseFloat(
                                        updatedPrograms[programIndex][field]
                                    ) || 0)
                                );
                            }, 0);

                        updatedPrograms[programIndex].grand_total =
                            updatedPrograms[programIndex].subtotal_male +
                            updatedPrograms[programIndex].subtotal_female;
                    } else if (subTabValue === 2) {
                        // Statistics tab: Update total_units_actual and graduates_total
                        updatedPrograms[programIndex].total_units_actual =
                            (parseFloat(
                                updatedPrograms[programIndex]
                                    .lecture_units_actual
                            ) || 0) +
                            (parseFloat(
                                updatedPrograms[programIndex]
                                    .laboratory_units_actual
                            ) || 0);

                        updatedPrograms[programIndex].graduates_total =
                            (parseFloat(
                                updatedPrograms[programIndex].graduates_males
                            ) || 0) +
                            (parseFloat(
                                updatedPrograms[programIndex].graduates_females
                            ) || 0);
                    }

                    // Update the backend
                    try {
                        await axios.put(
                            `http://localhost:8000/api/programs/${programData.id}`,
                            updatedPrograms[programIndex],
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );
                    } catch (error) {
                        console.error("Error updating program:", error);
                    }
                }
            }

            // Update the state to reflect changes in the table
            setFilteredPrograms(updatedPrograms);
        },
        [filteredPrograms, subTabValue, columnConfigs]
    );

    if (loading) return <CircularProgress />;
    const currentConfig = columnConfigs[subTabValue] || columnConfigs[0];

    return (
        <Box sx={{ mt: 2, position: "relative" }}>
            {/* Search and Filter Section */}
            <Box sx={{ mb: 1 }}>
                <Grid container spacing={1} alignItems="center">
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Search"
                            variant="outlined"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search..."
                            sx={{
                                "& .MuiInputBase-root": {
                                    fontSize: "0.75rem",
                                    height: "32px",
                                },
                                "& .MuiInputLabel-root": {
                                    fontSize: "0.75rem",
                                    transform: "translate(14px, 8px) scale(1)",
                                },
                                "& .MuiInputLabel-shrink": {
                                    transform:
                                        "translate(14px, -6px) scale(0.75)",
                                },
                            }}
                        />
                    </Grid>
                </Grid>
            </Box>  
            {/* Sub-Tabs Navigation */}
            <Paper sx={{ borderRadius: 1, mb: 2 }}>
                <Tabs
                    value={subTabValue}
                    onChange={(e, newValue) => setSubTabValue(newValue)}
                    aria-label="program sub-tabs"
                    variant="fullWidth"
                    sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                        "& .MuiTab-root": {
                            fontSize: "0.875rem",
                            fontWeight: "medium",
                        },
                    }}
                >
                    <Tab label="Programs" />
                    <Tab label="Enrollments" />
                    <Tab label="Statistics" />
                </Tabs>
            </Paper>

            <Paper
                sx={{
                    overflowX: "auto",
                    maxHeight: "700px",
                    position: "relative",
                }}
            >
                <HotTable
                    data={currentConfig.data}
                    columns={currentConfig.columns}
                    rowHeaders={true}
                    stretchH="all"
                    height="590px"
                    licenseKey="non-commercial-and-evaluation"
                    settings={{
                        readOnly: false,
                        manualColumnResize: true,
                        columnSorting: true,
                        contextMenu: true,
                        afterChange: handleChanges,
                        nestedHeaders: [
                            subTabValue === 0
                                ? [
                                      {
                                          label: "CURRICULAR PROGRAM",
                                          colspan: 2,
                                      },
                                      { label: "MAJOR", colspan: 2 },
                                      {
                                          label: "AUTHORITY TO OFFER PROGRAM",
                                          colspan: 3,
                                      },
                                      { label: "", colspan: 1 },
                                      { label: "", colspan: 1 },
                                      { label: "", colspan: 1 },
                                      { label: "LENGTH", colspan: 1 },
                                      {
                                          label: "PROGRAM UNITS EXCLUDING THESIS",
                                          colspan: 3,
                                      },
                                      {
                                          label: "FINANCIAL INFORMATION",
                                          colspan: 2,
                                      },
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
                                      {
                                          label: "Scholars & Grantees",
                                          colspan: 3,
                                      },
                                  ],
                            currentConfig.columns.map((col) => col.title),
                        ],
                        cells: (row, col) => {
                            const cellProperties = {};
                            const columnData = currentConfig.columns[col].data;
                            const value = currentConfig.data[row]?.[columnData];

                            if (
                                (subTabValue === 1 || subTabValue === 2) &&
                                columnData === "program_name"
                            ) {
                                cellProperties.readOnly = true;
                            }

                            cellProperties.renderer = (instance, td) => {
                                td.innerHTML =
                                    value !== undefined && value !== null
                                        ? value
                                        : "-";
                                td.style.whiteSpace = "nowrap";
                                td.style.overflow = "hidden";
                                td.style.textOverflow = "ellipsis";
                                td.style.maxWidth =
                                    col === 0 ? "180px" : "120px";
                                td.title = value || "-";
                                if (
                                    columnData !== "program_name" &&
                                    columnData !== "major_name"
                                ) {
                                    td.style.textAlign = "center";
                                } else {
                                    td.style.textAlign = "left";
                                }
                            };

                            return cellProperties;
                        },
                    }}
                />
            </Paper>
        </Box>
    );
};

// Define PropTypes
ProgramTables.propTypes = {
    programs: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            program_name: PropTypes.string.isRequired,
            program_code: PropTypes.number,
            major_name: PropTypes.string,
            major_code: PropTypes.number,
            category: PropTypes.string,
            serial: PropTypes.string,
            year: PropTypes.string,
            is_thesis_dissertation_required: PropTypes.string,
            program_status: PropTypes.string,
            calendar_use_code: PropTypes.string,
            program_normal_length_in_years: PropTypes.number,
            lab_units: PropTypes.number,
            lecture_units: PropTypes.number,
            total_units: PropTypes.number,
            tuition_per_unit: PropTypes.number,
            program_fee: PropTypes.number,
            new_students_freshmen_male: PropTypes.number,
            new_students_freshmen_female: PropTypes.number,
            grand_total: PropTypes.number,
            total_units_actual: PropTypes.number,
            graduates_males: PropTypes.number,
            graduates_females: PropTypes.number,
        })
    ).isRequired,
    loading: PropTypes.bool.isRequired,
};

export default ProgramTables;
