import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.min.css";
import { useState, useMemo, useCallback, useEffect } from "react";
import { registerAllModules } from "handsontable/registry";
import PropTypes from "prop-types";
import axios from "axios";
import {
    CircularProgress,
    Box,
    Tabs,
    Tab,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Pagination,
    Alert,
} from "@mui/material";

// Register all Handsontable modules
registerAllModules();

const ROWS_PER_PAGE_OPTIONS = [
    { label: "25", value: 25 },
    { label: "50", value: 50 },
    { label: "100", value: 100 },
    { label: "All", value: -1 },
];

const ProgramTables = ({ programs, loading, fetchPrograms }) => {
    const [subTabValue, setSubTabValue] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [error, setError] = useState(null);

    useEffect(() => {
        const savedTab = localStorage.getItem('selectedSubTab');
        if (savedTab !== null) {
            setSubTabValue(Number(savedTab));
        }
    }, []);

    const handleChangePage = useCallback((event, newPage) => {
        setPage(newPage);
    }, []);

    const handleChangeRowsPerPage = useCallback((event) => {
        const newRowsPerPage = event.target.value;
        setRowsPerPage(newRowsPerPage);
        setPage(0);
    }, []);

    const paginatedData = useMemo(() => {
        if (rowsPerPage === -1) {
            return programs;
        }
        const startIndex = page * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return programs.slice(startIndex, endIndex);
    }, [programs, page, rowsPerPage]);

    // Data validation function aligned with backend
    const validateProgramData = (data) => {
        const errors = [];
        if (!data.program_name || data.program_name.length > 255) {
            errors.push(
                "Program name must be a string between 1 and 255 characters."
            );
        }
        if (!data.institution_id) {
            errors.push("Institution ID is required.");
        }
        if (!data.program_type) {
            errors.push("Program type is required.");
        }
        // Validate string fields
        [
            "is_thesis_dissertation_required",
            "program_status",
            "calendar_use_code",
            "Year",
            "category",
            "serial",
        ].forEach((field) => {
            if (
                data[field] &&
                (typeof data[field] !== "string" || data[field].length > 255)
            ) {
                errors.push(
                    `${field} must be a string with max 255 characters or null.`
                );
            }
        });
        // Validate numeric fields
        [
            "lab_units",
            "lecture_units",
            "total_units",
            "tuition_per_unit",
            "program_fee",
            "new_students_freshmen_male",
            "new_students_freshmen_female",
            "1st_year_male",
            "1st_year_female",
            "2nd_year_male",
            "2nd_year_female",
            "3rd_year_male",
            "3rd_year_female",
            "4th_year_male",
            "4th_year_female",
            "5th_year_male",
            "5th_year_female",
            "6th_year_male",
            "6th_year_female",
            "7th_year_male",
            "7th_year_female",
            "subtotal_male",
            "subtotal_female",
            "grand_total",
            "lecture_units_actual",
            "laboratory_units_actual",
            "total_units_actual",
            "graduates_males",
            "graduates_females",
            "graduates_total",
            "externally_funded_merit_scholars",
            "internally_funded_grantees",
            "suc_funded_grantees",
            "program_normal_length_in_years",
        ].forEach((field) => {
            if (
                data[field] !== null &&
                (isNaN(data[field]) || data[field] < 0)
            ) {
                errors.push(`${field} must be a non-negative number or null.`);
            }
        });
        return errors.length ? errors : null;
    };

    const columnConfigs = useMemo(
        () => ({
            0: {
                columns: [
                    { data: "program_name", title: "Program Name" },
                    { data: "program_code", title: "Program Code" },
                    { data: "major_name", title: "Major Name" },
                    { data: "major_code", title: "Major Code" },
                    { data: "category", title: "Category" },
                    { data: "serial", title: "Serial" },
                    { data: "Year", title: "Year" },
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
                        readOnly: true,
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
                data: paginatedData.map((program) => ({
                    id: program.id,
                    program_name: program.program_name || "-",
                    program_code: program.program_code || "-",
                    major_name: program.major_name || "-",
                    major_code: program.major_code || "-",
                    category: program.category || "-",
                    serial: program.serial || "-",
                    Year: program.Year || "-",
                    is_thesis_dissertation_required:
                        program.is_thesis_dissertation_required || "-",
                    program_status: program.program_status || "-",
                    calendar_use_code: program.calendar_use_code || "-",
                    program_normal_length_in_years:
                        program.program_normal_length_in_years ?? 0,
                    lab_units: program.lab_units ?? 0,
                    lecture_units: program.lecture_units ?? 0,
                    total_units: program.total_units ?? 0,
                    tuition_per_unit: program.tuition_per_unit ?? 0,
                    program_fee: program.program_fee ?? 0,
                })),
            },
            1: {
                columns: [
                    {
                        data: "program_name",
                        title: "Program Name",
                        readOnly: true,
                    },
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
                        data: "1st_year_male",
                        title: "1st Yr M",
                        type: "numeric",
                    },
                    {
                        data: "1st_year_female",
                        title: "1st Yr F",
                        type: "numeric",
                    },
                    {
                        data: "2nd_year_male",
                        title: "2nd Yr M",
                        type: "numeric",
                    },
                    {
                        data: "2nd_year_female",
                        title: "2nd Yr F",
                        type: "numeric",
                    },
                    {
                        data: "3rd_year_male",
                        title: "3rd Yr M",
                        type: "numeric",
                    },
                    {
                        data: "3rd_year_female",
                        title: "3rd Yr F",
                        type: "numeric",
                    },
                    {
                        data: "4th_year_male",
                        title: "4th Yr M",
                        type: "numeric",
                    },
                    {
                        data: "4th_year_female",
                        title: "4th Yr F",
                        type: "numeric",
                    },
                    {
                        data: "5th_year_male",
                        title: "5th Yr M",
                        type: "numeric",
                    },
                    {
                        data: "5th_year_female",
                        title: "5th Yr F",
                        type: "numeric",
                    },
                    {
                        data: "6th_year_male",
                        title: "6th Yr M",
                        type: "numeric",
                    },
                    {
                        data: "6th_year_female",
                        title: "6th Yr F",
                        type: "numeric",
                    },
                    {
                        data: "7th_year_male",
                        title: "7th Yr M",
                        type: "numeric",
                    },
                    {
                        data: "7th_year_female",
                        title: "7th Yr F",
                        type: "numeric",
                    },
                    {
                        data: "subtotal_male",
                        title: "Subtotal M",
                        type: "numeric",
                        readOnly: true,
                    },
                    {
                        data: "subtotal_female",
                        title: "Subtotal F",
                        type: "numeric",
                        readOnly: true,
                    },
                    {
                        data: "grand_total",
                        title: "Total",
                        type: "numeric",
                        readOnly: true,
                    },
                ],
                data: paginatedData.map((program) => ({
                    id: program.id,
                    program_name: program.program_name || "-",
                    new_students_freshmen_male:
                        program.new_students_freshmen_male ?? 0,
                    new_students_freshmen_female:
                        program.new_students_freshmen_female ?? 0,
                    "1st_year_male": program["1st_year_male"] ?? 0,
                    "1st_year_female": program["1st_year_female"] ?? 0,
                    "2nd_year_male": program["2nd_year_male"] ?? 0,
                    "2nd_year_female": program["2nd_year_female"] ?? 0,
                    "3rd_year_male": program["3rd_year_male"] ?? 0,
                    "3rd_year_female": program["3rd_year_female"] ?? 0,
                    "4th_year_male": program["4th_year_male"] ?? 0,
                    "4th_year_female": program["4th_year_female"] ?? 0,
                    "5th_year_male": program["5th_year_male"] ?? 0,
                    "5th_year_female": program["5th_year_female"] ?? 0,
                    "6th_year_male": program["6th_year_male"] ?? 0,
                    "6th_year_female": program["6th_year_female"] ?? 0,
                    "7th_year_male": program["7th_year_male"] ?? 0,
                    "7th_year_female": program["7th_year_female"] ?? 0,
                    subtotal_male: program.subtotal_male ?? 0,
                    subtotal_female: program.subtotal_female ?? 0,
                    grand_total: program.grand_total ?? 0,
                })),
            },
            2: {
                columns: [
                    {
                        data: "program_name",
                        title: "Program Name",
                        readOnly: true,
                    },
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
                        readOnly: true,
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
                        readOnly: true,
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
                data: paginatedData.map((program) => ({
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
        [paginatedData]
    );

    const handleChanges = useCallback(
        async (changes, source) => {
            if (!changes || source === "loadData") return;

            const token = localStorage.getItem("token");
            if (!token) {
                setError(
                    "Authentication token is missing. Please log in again."
                );
                return;
            }

            const updatedPrograms = [...programs];
            const currentConfig =
                columnConfigs[subTabValue] || columnConfigs[0];
            const updates = [];
            const originalValues = [];

            for (const [row, prop, oldValue, newValue] of changes) {
                const programData = currentConfig.data[row];
                const programIndex = updatedPrograms.findIndex(
                    (p) => p.id === programData.id
                );

                if (programIndex !== -1) {
                    // Store original value for potential reversion
                    originalValues.push({ programIndex, prop, oldValue });

                    // Update the changed field
                    updatedPrograms[programIndex][prop] = newValue;

                    // Recalculate totals
                    if (subTabValue === 0) {
                        updatedPrograms[programIndex].total_units =
                            (parseFloat(
                                updatedPrograms[programIndex].lab_units
                            ) || 0) +
                            (parseFloat(
                                updatedPrograms[programIndex].lecture_units
                            ) || 0);
                    } else if (subTabValue === 1) {
                        const maleFields = [
                            "new_students_freshmen_male",
                            "1st_year_male",
                            "2nd_year_male",
                            "3rd_year_male",
                            "4th_year_male",
                            "5th_year_male",
                            "6th_year_male",
                            "7th_year_male",
                        ];
                        const femaleFields = [
                            "new_students_freshmen_female",
                            "1st_year_female",
                            "2nd_year_female",
                            "3rd_year_female",
                            "4th_year_female",
                            "5th_year_female",
                            "6th_year_female",
                            "7th_year_female",
                        ];
                        updatedPrograms[programIndex].subtotal_male =
                            maleFields.reduce(
                                (sum, field) =>
                                    sum +
                                    (parseFloat(
                                        updatedPrograms[programIndex][field]
                                    ) || 0),
                                0
                            );
                        updatedPrograms[programIndex].subtotal_female =
                            femaleFields.reduce(
                                (sum, field) =>
                                    sum +
                                    (parseFloat(
                                        updatedPrograms[programIndex][field]
                                    ) || 0),
                                0
                            );
                        updatedPrograms[programIndex].grand_total =
                            updatedPrograms[programIndex].subtotal_male +
                            updatedPrograms[programIndex].subtotal_female;
                    } else if (subTabValue === 2) {
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

                    // Validate data
                    const validationErrors = validateProgramData(
                        updatedPrograms[programIndex]
                    );
                    if (validationErrors) {
                        setError(
                            `Validation failed: ${validationErrors.join(", ")}`
                        );
                        continue;
                    }

                    updates.push(updatedPrograms[programIndex]);
                }
            }

            if (updates.length > 0) {
                try {
                    await Promise.all(
                        updates.map((program) =>
                            axios.put(
                                `http://localhost:8000/api/programs/${program.id}`,
                                program,
                                {
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                    },
                                }
                            )
                        )
                    );
                    setError(null);
                    fetchPrograms();
                } catch (error) {
                    // Revert changes
                    originalValues.forEach(
                        ({ programIndex, prop, oldValue }) => {
                            updatedPrograms[programIndex][prop] = oldValue;
                        }
                    );
                    const errorMessage =
                        error.response?.data?.error ||
                        "Failed to update programs. Changes have been reverted.";
                    setError(errorMessage);
                    console.error("Error updating programs:", error);
                }
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [programs, subTabValue, columnConfigs, setError]
    );

    if (loading) return <CircularProgress />;

    const currentConfig = columnConfigs[subTabValue] || columnConfigs[0];

    return (
        <Box sx={{ mt: 2, position: "relative" }}>
            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    onClose={() => setError(null)}
                >
                    {error}
                </Alert>
            )}
            <Paper sx={{ borderRadius: 1 }}>
                <Tabs
                    value={subTabValue}
                    onChange={(e, newValue) => {
                        setSubTabValue(newValue);
                        localStorage.setItem('selectedSubTab', newValue);
                    }}
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
                    maxHeight: "53vh",
                    position: "relative",
                }}
            >
                <HotTable
                    data={currentConfig.data}
                    columns={currentConfig.columns}
                    rowHeaders={true}
                    stretchH="all"
                    height="290"
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

                            cellProperties.renderer = (instance, td) => {
                                td.innerHTML =
                                    value !== undefined && value !== null
                                        ? value
                                        : "-";
                                td.style.whiteSpace = "nowrap";
                                td.style.overflow = "hidden";
                                td.style.textOverflow = "ellipsis";
                                td.style.maxWidth = col === 0 ? "20%" : "10%";
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
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        p: 1,
                        borderTop: 1,
                        borderColor: "divider",
                        bgcolor: "grey.50",
                        position: "sticky",
                        bottom: -0.5,
                        zIndex: 5,
                    }}
                >
                    <FormControl size="small" sx={{ minWidth: 80, mr: 1 }}>
                        <InputLabel sx={{ fontSize: "0.75rem" }}>
                            Rows
                        </InputLabel>
                        <Select
                            value={rowsPerPage}
                            onChange={handleChangeRowsPerPage}
                            label="Rows"
                            sx={{ height: 32, fontSize: "0.875rem" }}
                        >
                            {ROWS_PER_PAGE_OPTIONS.map((option) => (
                                <MenuItem
                                    key={option.value}
                                    value={option.value}
                                    sx={{ fontSize: "0.875rem" }}
                                >
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mr: 1, fontSize: "0.75rem" }}
                    >
                        {programs.length === 0
                            ? "0-0"
                            : `${page * rowsPerPage + 1}-${Math.min(
                                  (page + 1) * rowsPerPage,
                                  programs.length
                              )}`}{" "}
                        of {programs.length}
                    </Typography>
                    <Pagination
                        count={Math.ceil(programs.length / rowsPerPage) || 1}
                        page={page + 1}
                        onChange={(_, value) =>
                            handleChangePage(null, value - 1)
                        }
                        size="small"
                        color="primary"
                        showFirstButton
                        showLastButton
                        sx={{
                            "& .MuiPaginationItem-root": {
                                fontSize: "0.75rem",
                            },
                        }}
                    />
                </Box>
            </Paper>
        </Box>
    );
};

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
            Year: PropTypes.string,
            is_thesis_dissertation_required: PropTypes.string,
            program_status: PropTypes.string,
            calendar_use_code: PropTypes.string,
            program_normal_length_in_years: PropTypes.number,
            lab_units: PropTypes.number,
            lecture_units: PropTypes.number,
            total_units: PropTypes.number,
            tuition_per_unit: PropTypes.number,
            program_fee: PropTypes.number,
            program_type: PropTypes.string,
            new_students_freshmen_male: PropTypes.number,
            new_students_freshmen_female: PropTypes.number,
            "1st_year_male": PropTypes.number,
            "1st_year_female": PropTypes.number,
            "2nd_year_male": PropTypes.number,
            "2nd_year_female": PropTypes.number,
            "3rd_year_male": PropTypes.number,
            "3rd_year_female": PropTypes.number,
            "4th_year_male": PropTypes.number,
            "4th_year_female": PropTypes.number,
            "5th_year_male": PropTypes.number,
            "5th_year_female": PropTypes.number,
            "6th_year_male": PropTypes.number,
            "6th_year_female": PropTypes.number,
            "7th_year_male": PropTypes.number,
            "7th_year_female": PropTypes.number,
            subtotal_male: PropTypes.number,
            subtotal_female: PropTypes.number,
            grand_total: PropTypes.number,
            lecture_units_actual: PropTypes.number,
            laboratory_units_actual: PropTypes.number,
            total_units_actual: PropTypes.number,
            graduates_males: PropTypes.number,
            graduates_females: PropTypes.number,
            graduates_total: PropTypes.number,
            externally_funded_merit_scholars: PropTypes.number,
            internally_funded_grantees: PropTypes.number,
            suc_funded_grantees: PropTypes.number,
        })
    ).isRequired,
    loading: PropTypes.bool.isRequired,
    fetchPrograms: PropTypes.func,
};

export default ProgramTables;
