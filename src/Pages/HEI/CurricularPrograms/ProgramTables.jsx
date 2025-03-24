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
    Fab,
    Dialog,
    DialogTitle,
    DialogContent,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    IconButton,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";

// Register all Handsontable modules
registerAllModules();

const ProgramTables = ({ programs, loading, subTabValue }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredPrograms, setFilteredPrograms] = useState(programs);
    const [openReferenceDialog, setOpenReferenceDialog] = useState(false);

    // Apply search and filters
    useEffect(() => {
        let filtered = [...programs];

        // Apply search
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
                    {
                        data: "program_status",
                        title: "Status",
                        type: "numeric",
                    },
                    {
                        data: "calendar_use_code",
                        title: "Calendar",
                        type: "numeric",
                    },
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
                    id: program.id, // Include ID for API updates
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
                    },
                    {
                        data: "subtotal_female",
                        title: "Subtotal F",
                        type: "numeric",
                    },
                    { data: "grand_total", title: "Total", type: "numeric" },
                ],
                data: filteredPrograms.flatMap(
                    (program) =>
                        program.enrollments?.map((enrollment) => ({
                            program_id: program.id, // Include program ID for reference
                            enrollment_id: enrollment.id, // Include enrollment ID for API updates
                            program_name: program.program_name || "-",
                            new_students_freshmen_male:
                                enrollment.new_students_freshmen_male ?? 0,
                            new_students_freshmen_female:
                                enrollment.new_students_freshmen_female ?? 0,
                            first_year_old_male:
                                enrollment.first_year_old_male ?? 0,
                            first_year_old_female:
                                enrollment.first_year_old_female ?? 0,
                            second_year_male: enrollment.second_year_male ?? 0,
                            second_year_female:
                                enrollment.second_year_female ?? 0,
                            third_year_male: enrollment.third_year_male ?? 0,
                            third_year_female:
                                enrollment.third_year_female ?? 0,
                            fourth_year_male: enrollment.fourth_year_male ?? 0,
                            fourth_year_female:
                                enrollment.fourth_year_female ?? 0,
                            fifth_year_male: enrollment.fifth_year_male ?? 0,
                            fifth_year_female:
                                enrollment.fifth_year_female ?? 0,
                            sixth_year_male: enrollment.sixth_year_male ?? 0,
                            sixth_year_female:
                                enrollment.sixth_year_female ?? 0,
                            seventh_year_male:
                                enrollment.seventh_year_male ?? 0,
                            seventh_year_female:
                                enrollment.seventh_year_female ?? 0,
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
                data: filteredPrograms
                    .filter((program) => program.statistics)
                    .map((program) => ({
                        program_id: program.id, // Include program ID for reference
                        statistics_id: program.statistics?.id, // Include statistics ID for API updates
                        program_name: program.program_name || "-",
                        lecture_units_actual:
                            program.statistics?.lecture_units_actual ?? 0,
                        laboratory_units_actual:
                            program.statistics?.laboratory_units_actual ?? 0,
                        total_units_actual:
                            program.statistics?.total_units_actual ?? 0,
                        graduates_males:
                            program.statistics?.graduates_males ?? 0,
                        graduates_females:
                            program.statistics?.graduates_females ?? 0,
                        graduates_total:
                            program.statistics?.graduates_total ?? 0,
                        externally_funded_merit_scholars:
                            program.statistics
                                ?.externally_funded_merit_scholars ?? 0,
                        internally_funded_grantees:
                            program.statistics?.internally_funded_grantees ?? 0,
                        suc_funded_grantees:
                            program.statistics?.suc_funded_grantees ?? 0,
                    })),
            },
        }),
        [filteredPrograms]
    );

    // Handle cell changes and save to backend
    const handleChanges = useCallback(
        async (changes, source) => {
            if (!changes || source === "loadData") return;

            const updatedPrograms = [...filteredPrograms];
            const token = localStorage.getItem("token");

            for (const [row, prop, , newValue] of changes) {
                const currentConfig =
                    columnConfigs[subTabValue] || columnConfigs[0];
                const programData = currentConfig.data[row];

                // Update the local data based on the subTabValue
                if (subTabValue === 0) {
                    // Programs tab
                    const programIndex = updatedPrograms.findIndex(
                        (p) => p.id === programData.id
                    );
                    if (programIndex !== -1) {
                        updatedPrograms[programIndex][prop] = newValue;

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
                } else if (subTabValue === 1) {
                    // Enrollments tab
                    const programIndex = updatedPrograms.findIndex(
                        (p) => p.id === programData.program_id
                    );
                    if (programIndex !== -1) {
                        const enrollmentIndex = updatedPrograms[
                            programIndex
                        ].enrollments.findIndex(
                            (e) => e.id === programData.enrollment_id
                        );
                        if (enrollmentIndex !== -1) {
                            updatedPrograms[programIndex].enrollments[
                                enrollmentIndex
                            ][prop] = newValue;

                            try {
                                await axios.put(
                                    `http://localhost:8000/api/enrollments/${programData.enrollment_id}`,
                                    updatedPrograms[programIndex].enrollments[
                                        enrollmentIndex
                                    ],
                                    {
                                        headers: {
                                            Authorization: `Bearer ${token}`,
                                        },
                                    }
                                );
                            } catch (error) {
                                console.error(
                                    "Error updating enrollment:",
                                    error
                                );
                            }
                        }
                    }
                } else if (subTabValue === 2) {
                    // Statistics tab
                    const programIndex = updatedPrograms.findIndex(
                        (p) => p.id === programData.program_id
                    );
                    if (programIndex !== -1) {
                        updatedPrograms[programIndex].statistics[prop] =
                            newValue;

                        try {
                            await axios.put(
                                `http://localhost:8000/api/statistics/${programData.statistics_id}`,
                                updatedPrograms[programIndex].statistics,
                                {
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                    },
                                }
                            );
                        } catch (error) {
                            console.error("Error updating statistics:", error);
                        }
                    }
                }
            }

            setFilteredPrograms(updatedPrograms);
        },
        [filteredPrograms, subTabValue, columnConfigs]
    );

    if (loading) return <CircularProgress />;
    const currentConfig = columnConfigs[subTabValue] || columnConfigs[0];

    // Reference data for the dialog
    const referenceData = {
        authority: [
            { code: "GP", label: "Government Permit" },
            { code: "GR", label: "Government Recognition" },
            { code: "BR", label: "Board Resolution" },
        ],
        thesisDissertation: [
            { code: 1, label: "Required" },
            { code: 2, label: "Optional" },
            { code: 3, label: "Not Required" },
        ],
        programStatus: [
            { code: 1, label: "Active" },
            { code: 2, label: "Phased Out" },
            { code: 3, label: "Abolished" },
        ],
        calendar: [
            { code: 1, label: "Sem" },
            { code: 2, label: "Tri Sem" },
            { code: 3, label: "Quarter Sem" },
            { code: 4, label: "Distance Mode" },
        ],
    };

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

            <Box
                sx={{
                    overflowX: "auto",
                    maxHeight: "550px",
                    position: "relative",
                }}
            >
                <HotTable
                    data={currentConfig.data}
                    columns={currentConfig.columns}
                    rowHeaders={true}
                    stretchH="all"
                    height="550px"
                    licenseKey="non-commercial-and-evaluation"
                    settings={{
                        readOnly: false, // Make cells editable
                        manualColumnResize: true,
                        columnSorting: true,
                        contextMenu: true, // Enable context menu for copy/paste
                        afterChange: handleChanges, // Handle cell changes
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

                            // Make "program_name" read-only in Enrollments and Statistics tabs
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

                                // Apply common styles
                                td.style.whiteSpace = "nowrap";
                                td.style.overflow = "hidden";
                                td.style.textOverflow = "ellipsis";
                                td.style.maxWidth =
                                    col === 0 ? "180px" : "120px";
                                td.title = value || "-";

                                // Center-align all columns except "program_name" and "major_name"
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
                {currentConfig.data.length === 0 && (
                    <Box sx={{ textAlign: "center", p: 2, color: "#666" }}>
                        No data available.
                    </Box>
                )}

                {/* Floating Action Button */}
                <Fab
                    color="primary"
                    aria-label="show reference"
                    onClick={() => setOpenReferenceDialog(true)}
                    sx={{
                        position: "absolute",
                        bottom: 16,
                        right: 16,
                    }}
                >
                    <InfoIcon />
                </Fab>
            </Box>

            {/* Reference Dialog */}
            <Dialog
                open={openReferenceDialog}
                onClose={() => setOpenReferenceDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    Reference Table
                    <IconButton
                        aria-label="close"
                        onClick={() => setOpenReferenceDialog(false)}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Authority to Offer Program
                                </TableCell>
                                <TableCell>
                                    Is Thesis/Dissertation Required?
                                </TableCell>
                                <TableCell>Program Status</TableCell>
                                <TableCell>Program Calendar</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {referenceData.authority.map((item, index) => (
                                <TableRow key={`authority-${index}`}>
                                    <TableCell>{`${item.code} - ${item.label}`}</TableCell>
                                    {index <
                                    referenceData.thesisDissertation.length ? (
                                        <TableCell>
                                            {`${referenceData.thesisDissertation[index].code} - ${referenceData.thesisDissertation[index].label}`}
                                        </TableCell>
                                    ) : (
                                        <TableCell>-</TableCell>
                                    )}
                                    {index <
                                    referenceData.programStatus.length ? (
                                        <TableCell>
                                            {`${referenceData.programStatus[index].code} - ${referenceData.programStatus[index].label}`}
                                        </TableCell>
                                    ) : (
                                        <TableCell>-</TableCell>
                                    )}
                                    {index < referenceData.calendar.length ? (
                                        <TableCell>
                                            {`${referenceData.calendar[index].code} - ${referenceData.calendar[index].label}`}
                                        </TableCell>
                                    ) : (
                                        <TableCell>-</TableCell>
                                    )}
                                </TableRow>
                            ))}
                            {referenceData.calendar.length >
                                referenceData.authority.length &&
                                referenceData.calendar
                                    .slice(referenceData.authority.length)
                                    .map((item, index) => (
                                        <TableRow
                                            key={`calendar-extra-${index}`}
                                        >
                                            <TableCell>-</TableCell>
                                            <TableCell>-</TableCell>
                                            <TableCell>-</TableCell>
                                            <TableCell>{`${item.code} - ${item.label}`}</TableCell>
                                        </TableRow>
                                    ))}
                        </TableBody>
                    </Table>
                </DialogContent>
            </Dialog>
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
                    id: PropTypes.number.isRequired, // Ensure enrollment has an ID
                    new_students_freshmen_male: PropTypes.number,
                    new_students_freshmen_female: PropTypes.number,
                    grand_total: PropTypes.number,
                })
            ),
            statistics: PropTypes.shape({
                id: PropTypes.number.isRequired, // Ensure statistics has an ID
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
