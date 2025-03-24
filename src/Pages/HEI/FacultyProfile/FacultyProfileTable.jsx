import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.min.css"; // Import Handsontable styles
import { useState, useMemo, useEffect } from "react";
import { registerAllModules } from "handsontable/registry"; // Register all modules
import PropTypes from "prop-types";
import {
    Box,
    Paper,
    Tabs,
    Tab,
    Alert,
    TablePagination,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
} from "@mui/material";

// Register all Handsontable modules
registerAllModules();

const FacultyProfileTable = ({ facultyProfiles }) => {
    const [tabIndex, setTabIndex] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredData, setFilteredData] = useState(facultyProfiles);

    // Filter states for each column
    const [facultyRankFilter, setFacultyRankFilter] = useState("");
    const [homeCollegeFilter, setHomeCollegeFilter] = useState("");
    const [isTenuredFilter, setIsTenuredFilter] = useState("");
    const [genderFilter, setGenderFilter] = useState("");

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
        setPage(0); // Reset to first page when changing tabs
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to first page
    };

    // Extract unique values for filters
    const uniqueFacultyRanks = useMemo(
        () => [
            ...new Set(
                facultyProfiles.map(
                    (profile) => profile.generic_faculty_rank || "-"
                )
            ),
        ],
        [facultyProfiles]
    );
    const uniqueHomeColleges = useMemo(
        () => [
            ...new Set(
                facultyProfiles.map((profile) => profile.home_college || "-")
            ),
        ],
        [facultyProfiles]
    );
    const uniqueTenuredOptions = ["Yes", "No"];
    const uniqueGenderOptions = ["Male", "Female", "-"];

    // Apply search and filters
    useEffect(() => {
        let filtered = [...facultyProfiles];

        // Apply search
        if (searchQuery) {
            filtered = filtered.filter((profile) =>
                Object.values(profile).some((value) =>
                    String(value)
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                )
            );
        }

        // Apply filters
        if (facultyRankFilter) {
            filtered = filtered.filter(
                (profile) =>
                    (profile.generic_faculty_rank || "-") === facultyRankFilter
            );
        }
        if (homeCollegeFilter) {
            filtered = filtered.filter(
                (profile) => (profile.home_college || "-") === homeCollegeFilter
            );
        }
        if (isTenuredFilter) {
            filtered = filtered.filter(
                (profile) =>
                    (profile.is_tenured ? "Yes" : "No") === isTenuredFilter
            );
        }
        if (genderFilter) {
            filtered = filtered.filter(
                (profile) =>
                    (profile.gender === 1
                        ? "Male"
                        : profile.gender === 2
                        ? "Female"
                        : "-") === genderFilter
            );
        }

        setFilteredData(filtered);
        setPage(0); // Reset to first page when filters or search change
    }, [
        searchQuery,
        facultyRankFilter,
        homeCollegeFilter,
        isTenuredFilter,
        genderFilter,
        facultyProfiles,
    ]);

    // Slice data for pagination
    const paginatedProfiles = useMemo(
        () =>
            filteredData.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
            ),
        [filteredData, page, rowsPerPage]
    );

    // Define column configurations for each tab
    const columnConfigs = useMemo(
        () => ({
            0: {
                // Personal Info
                columns: [
                    { data: "name", title: "NAME OF FACULTY" },
                    { data: "generic_faculty_rank", title: "FACULTY RANK" },
                    { data: "home_college", title: "HOME COLLEGE" },
                    { data: "home_department", title: "HOME DEPT" },
                    {
                        data: "is_tenured",
                        title: "TENURED?",
                        renderer: (instance, td, row, col, prop, value) => {
                            td.innerHTML = value ? "Yes" : "No";
                            td.style.color = value ? "#2e7d32" : "#616161"; // Green for Yes, gray for No
                        },
                    },
                    { data: "ssl_salary_grade", title: "SSL GRADE" },
                    {
                        data: "annual_basic_salary",
                        title: "ANNUAL SALARY",
                        type: "numeric",
                    },
                    { data: "on_leave_without_pay", title: "ON LEAVE?" },
                    {
                        data: "full_time_equivalent",
                        title: "FTE",
                        type: "numeric",
                    },
                    {
                        data: "gender",
                        title: "GENDER",
                        renderer: (instance, td, row, col, prop, value) => {
                            td.innerHTML =
                                value === 1
                                    ? "Male"
                                    : value === 2
                                    ? "Female"
                                    : "-";
                        },
                    },
                ],
                data: paginatedProfiles.map((profile) => ({
                    name: profile.name || "-",
                    generic_faculty_rank: profile.generic_faculty_rank || "-",
                    home_college: profile.home_college || "-",
                    home_department: profile.home_department || "-",
                    is_tenured: profile.is_tenured || false,
                    ssl_salary_grade: profile.ssl_salary_grade || "-",
                    annual_basic_salary: profile.annual_basic_salary || 0,
                    on_leave_without_pay: profile.on_leave_without_pay || "-",
                    full_time_equivalent: profile.full_time_equivalent || 0,
                    gender: profile.gender || "-",
                })),
            },
            1: {
                // Education
                columns: [
                    { data: "name", title: "NAME OF FACULTY" },
                    {
                        data: "highest_degree_attained",
                        title: "HIGHEST DEGREE",
                    },
                    {
                        data: "pursuing_next_degree",
                        title: "PURSUING NEXT DEGREE?",
                        renderer: (instance, td, row, col, prop, value) => {
                            td.innerHTML = value ? "Yes" : "No";
                            td.style.color = value ? "#0288d1" : "#616161"; // Blue for Yes, gray for No
                        },
                    },
                    {
                        data: "discipline_teaching_load_1",
                        title: "DISCIPLINE (1)",
                    },
                    {
                        data: "discipline_teaching_load_2",
                        title: "DISCIPLINE (2)",
                    },
                    {
                        data: "discipline_bachelors",
                        title: "BACHELORS DISCIPLINE",
                    },
                    { data: "discipline_masters", title: "MASTERS DISCIPLINE" },
                    {
                        data: "discipline_doctorate",
                        title: "DOCTORATE DISCIPLINE",
                    },
                    {
                        data: "masters_with_thesis",
                        title: "MASTERS W/ THESIS?",
                        renderer: (instance, td, row, col, prop, value) => {
                            td.innerHTML = value ? "Yes" : "No";
                            td.style.color = value ? "#0288d1" : "#616161";
                        },
                    },
                    {
                        data: "doctorate_with_dissertation",
                        title: "DOCTORATE W/ DISSERTATION?",
                        renderer: (instance, td, row, col, prop, value) => {
                            td.innerHTML = value ? "Yes" : "No";
                            td.style.color = value ? "#0288d1" : "#616161";
                        },
                    },
                ],
                data: paginatedProfiles.map((profile) => ({
                    name: profile.name || "-",
                    highest_degree_attained:
                        profile.highest_degree_attained || "-",
                    pursuing_next_degree: profile.pursuing_next_degree || false,
                    discipline_teaching_load_1:
                        profile.discipline_teaching_load_1 || "-",
                    discipline_teaching_load_2:
                        profile.discipline_teaching_load_2 || "-",
                    discipline_bachelors: profile.discipline_bachelors || "-",
                    discipline_masters: profile.discipline_masters || "-",
                    discipline_doctorate: profile.discipline_doctorate || "-",
                    masters_with_thesis: profile.masters_with_thesis || false,
                    doctorate_with_dissertation:
                        profile.doctorate_with_dissertation || false,
                })),
            },
            2: {
                // Teaching Load
                columns: [
                    { data: "name", title: "NAME OF FACULTY" },
                    {
                        data: "undergrad_lab_credit_units",
                        title: "LAB CREDITS",
                        type: "numeric",
                    },
                    {
                        data: "undergrad_lecture_credit_units",
                        title: "LECTURE CREDITS",
                        type: "numeric",
                    },
                    {
                        data: "undergrad_total_credit_units",
                        title: "TOTAL CREDITS",
                        type: "numeric",
                    },
                    {
                        data: "undergrad_lab_hours_per_week",
                        title: "LAB HRS/WEEK",
                        type: "numeric",
                    },
                    {
                        data: "undergrad_lecture_hours_per_week",
                        title: "LECTURE HRS/WEEK",
                        type: "numeric",
                    },
                    {
                        data: "undergrad_total_hours_per_week",
                        title: "TOTAL HRS/WEEK",
                        type: "numeric",
                    },
                    {
                        data: "undergrad_lab_contact_hours",
                        title: "STUDENT CONTACT LAB",
                        type: "numeric",
                    },
                    {
                        data: "undergrad_lecture_contact_hours",
                        title: "STUDENT CONTACT LECTURE",
                        type: "numeric",
                    },
                    {
                        data: "undergrad_total_contact_hours",
                        title: "TOTAL CONTACT HRS",
                        type: "numeric",
                    },
                    {
                        data: "graduate_lab_credit_units",
                        title: "LAB CREDITS",
                        type: "numeric",
                    },
                    {
                        data: "graduate_lecture_credit_units",
                        title: "LECTURE CREDITS",
                        type: "numeric",
                    },
                    {
                        data: "graduate_total_credit_units",
                        title: "TOTAL CREDITS",
                        type: "numeric",
                    },
                    {
                        data: "graduate_lab_contact_hours",
                        title: "STUDENT CONTACT LAB",
                        type: "numeric",
                    },
                    {
                        data: "graduate_lecture_contact_hours",
                        title: "STUDENT CONTACT LECTURE",
                        type: "numeric",
                    },
                    {
                        data: "graduate_total_contact_hours",
                        title: "TOTAL CONTACT HRS",
                        type: "numeric",
                    },
                ],
                data: paginatedProfiles.map((profile) => ({
                    name: profile.name || "-",
                    undergrad_lab_credit_units:
                        profile.undergrad_lab_credit_units || 0,
                    undergrad_lecture_credit_units:
                        profile.undergrad_lecture_credit_units || 0,
                    undergrad_total_credit_units:
                        profile.undergrad_total_credit_units || 0,
                    undergrad_lab_hours_per_week:
                        profile.undergrad_lab_hours_per_week || 0,
                    undergrad_lecture_hours_per_week:
                        profile.undergrad_lecture_hours_per_week || 0,
                    undergrad_total_hours_per_week:
                        profile.undergrad_total_hours_per_week || 0,
                    undergrad_lab_contact_hours:
                        profile.undergrad_lab_contact_hours || 0,
                    undergrad_lecture_contact_hours:
                        profile.undergrad_lecture_contact_hours || 0,
                    undergrad_total_contact_hours:
                        profile.undergrad_total_contact_hours || 0,
                    graduate_lab_credit_units:
                        profile.graduate_lab_credit_units || 0,
                    graduate_lecture_credit_units:
                        profile.graduate_lecture_credit_units || 0,
                    graduate_total_credit_units:
                        profile.graduate_total_credit_units || 0,
                    graduate_lab_contact_hours:
                        profile.graduate_lab_contact_hours || 0,
                    graduate_lecture_contact_hours:
                        profile.graduate_lecture_contact_hours || 0,
                    graduate_total_contact_hours:
                        profile.graduate_total_contact_hours || 0,
                })),
            },
            3: {
                // Other Loads
                columns: [
                    { data: "name", title: "NAME OF FACULTY" },
                    {
                        data: "research_load",
                        title: "RESEARCH LOAD",
                        type: "numeric",
                    },
                    {
                        data: "extension_services_load",
                        title: "EXTENSION SERVICES",
                        type: "numeric",
                    },
                    {
                        data: "study_load",
                        title: "STUDY LOAD",
                        type: "numeric",
                    },
                    {
                        data: "production_load",
                        title: "PRODUCTION LOAD",
                        type: "numeric",
                    },
                    {
                        data: "administrative_load",
                        title: "ADMIN LOAD",
                        type: "numeric",
                    },
                    {
                        data: "other_load_credits",
                        title: "OTHER LOAD CREDITS",
                        type: "numeric",
                    },
                    {
                        data: "total_work_load",
                        title: "TOTAL WORK LOAD",
                        type: "numeric",
                    },
                ],
                data: paginatedProfiles.map((profile) => ({
                    name: profile.name || "-",
                    research_load: profile.research_load || 0,
                    extension_services_load:
                        profile.extension_services_load || 0,
                    study_load: profile.study_load || 0,
                    production_load: profile.production_load || 0,
                    administrative_load: profile.administrative_load || 0,
                    other_load_credits: profile.other_load_credits || 0,
                    total_work_load: profile.total_work_load || 0,
                })),
            },
        }),
        [paginatedProfiles]
    );

    const currentConfig = columnConfigs[tabIndex];

    return (
        <Box sx={{ mt: 3 }}>
            <Paper sx={{ borderRadius: 1, mb: 2 }}>
                <Tabs
                    value={tabIndex}
                    onChange={handleTabChange}
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
                    <Tab label="Personal Info" />
                    <Tab label="Education" />
                    <Tab label="Teaching Load" />
                    <Tab label="Other Loads" />
                </Tabs>
            </Paper>

            {facultyProfiles.length === 0 ? (
                <Alert severity="info" sx={{ mt: 2 }}>
                    No faculty profiles available.
                </Alert>
            ) : (
                <>
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
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    placeholder="Search..."
                                    sx={{
                                        "& .MuiInputBase-root": {
                                            fontSize: "0.75rem",
                                            height: "32px",
                                        },
                                        "& .MuiInputLabel-root": {
                                            fontSize: "0.75rem",
                                            transform:
                                                "translate(14px, 8px) scale(1)",
                                        },
                                        "& .MuiInputLabel-shrink": {
                                            transform:
                                                "translate(14px, -6px) scale(0.75)",
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6} sm={2}>
                                <FormControl
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                >
                                    <InputLabel
                                        sx={{
                                            fontSize: "0.75rem",
                                            transform:
                                                "translate(14px, 8px) scale(1)",
                                            "&.MuiInputLabel-shrink": {
                                                transform:
                                                    "translate(14px, -6px) scale(0.75)",
                                            },
                                        }}
                                    >
                                        Faculty Rank
                                    </InputLabel>
                                    <Select
                                        value={facultyRankFilter}
                                        onChange={(e) =>
                                            setFacultyRankFilter(e.target.value)
                                        }
                                        label="Faculty Rank"
                                        sx={{
                                            fontSize: "0.75rem",
                                            height: "32px",
                                            "& .MuiSelect-select": {
                                                padding: "6px 32px 6px 12px",
                                            },
                                        }}
                                    >
                                        <MenuItem
                                            value=""
                                            sx={{ fontSize: "0.75rem" }}
                                        >
                                            All
                                        </MenuItem>
                                        {uniqueFacultyRanks.map((rank) => (
                                            <MenuItem
                                                key={rank}
                                                value={rank}
                                                sx={{ fontSize: "0.75rem" }}
                                            >
                                                {rank}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6} sm={2}>
                                <FormControl
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                >
                                    <InputLabel
                                        sx={{
                                            fontSize: "0.75rem",
                                            transform:
                                                "translate(14px, 8px) scale(1)",
                                            "&.MuiInputLabel-shrink": {
                                                transform:
                                                    "translate(14px, -6px) scale(0.75)",
                                            },
                                        }}
                                    >
                                        Home College
                                    </InputLabel>
                                    <Select
                                        value={homeCollegeFilter}
                                        onChange={(e) =>
                                            setHomeCollegeFilter(e.target.value)
                                        }
                                        label="Home College"
                                        sx={{
                                            fontSize: "0.75rem",
                                            height: "32px",
                                            "& .MuiSelect-select": {
                                                padding: "6px 32px 6px 12px",
                                            },
                                        }}
                                    >
                                        <MenuItem
                                            value=""
                                            sx={{ fontSize: "0.75rem" }}
                                        >
                                            All
                                        </MenuItem>
                                        {uniqueHomeColleges.map((college) => (
                                            <MenuItem
                                                key={college}
                                                value={college}
                                                sx={{ fontSize: "0.75rem" }}
                                            >
                                                {college}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6} sm={2}>
                                <FormControl
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                >
                                    <InputLabel
                                        sx={{
                                            fontSize: "0.75rem",
                                            transform:
                                                "translate(14px, 8px) scale(1)",
                                            "&.MuiInputLabel-shrink": {
                                                transform:
                                                    "translate(14px, -6px) scale(0.75)",
                                            },
                                        }}
                                    >
                                        Tenured
                                    </InputLabel>
                                    <Select
                                        value={isTenuredFilter}
                                        onChange={(e) =>
                                            setIsTenuredFilter(e.target.value)
                                        }
                                        label="Tenured"
                                        sx={{
                                            fontSize: "0.75rem",
                                            height: "32px",
                                            "& .MuiSelect-select": {
                                                padding: "6px 32px 6px 12px",
                                            },
                                        }}
                                    >
                                        <MenuItem
                                            value=""
                                            sx={{ fontSize: "0.75rem" }}
                                        >
                                            All
                                        </MenuItem>
                                        {uniqueTenuredOptions.map((option) => (
                                            <MenuItem
                                                key={option}
                                                value={option}
                                                sx={{ fontSize: "0.75rem" }}
                                            >
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6} sm={2}>
                                <FormControl
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                >
                                    <InputLabel
                                        sx={{
                                            fontSize: "0.75rem",
                                            transform:
                                                "translate(14px, 8px) scale(1)",
                                            "&.MuiInputLabel-shrink": {
                                                transform:
                                                    "translate(14px, -6px) scale(0.75)",
                                            },
                                        }}
                                    >
                                        Gender
                                    </InputLabel>
                                    <Select
                                        value={genderFilter}
                                        onChange={(e) =>
                                            setGenderFilter(e.target.value)
                                        }
                                        label="Gender"
                                        sx={{
                                            fontSize: "0.75rem",
                                            height: "32px",
                                            "& .MuiSelect-select": {
                                                padding: "6px 32px 6px 12px",
                                            },
                                        }}
                                    >
                                        <MenuItem
                                            value=""
                                            sx={{ fontSize: "0.75rem" }}
                                        >
                                            All
                                        </MenuItem>
                                        {uniqueGenderOptions.map((option) => (
                                            <MenuItem
                                                key={option}
                                                value={option}
                                                sx={{ fontSize: "0.75rem" }}
                                            >
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>

                    <Box sx={{ height: 460, overflow: "auto" }}>
                        <HotTable
                            data={currentConfig.data}
                            columns={currentConfig.columns}
                            colHeaders={true}
                            rowHeaders={true}
                            stretchH="all"
                            height="100%" // Fill the container height
                            licenseKey="non-commercial-and-evaluation"
                            settings={{
                                readOnly: true,
                                manualColumnResize: true,
                                columnSorting: true,
                                contextMenu: false,
                                nestedHeaders:
                                    tabIndex === 2
                                        ? [
                                              [
                                                  { label: "", colspan: 1 },
                                                  {
                                                      label: "UNDERGRADUATE TEACHING LOAD",
                                                      colspan: 9,
                                                  },
                                                  {
                                                      label: "GRADUATE TEACHING LOAD",
                                                      colspan: 6,
                                                  },
                                              ],
                                              currentConfig.columns.map(
                                                  (col) => col.title
                                              ),
                                          ]
                                        : [
                                              currentConfig.columns.map(
                                                  (col) => col.title
                                              ),
                                          ],
                                cells: (row, col) => {
                                    const cellProperties = {};
                                    const value =
                                        currentConfig.data[row]?.[
                                            currentConfig.columns[col].data
                                        ];
                                    const columnData =
                                        currentConfig.columns[col].data;

                                    cellProperties.renderer = (
                                        instance,
                                        td
                                    ) => {
                                        td.innerHTML =
                                            value !== undefined &&
                                            value !== null
                                                ? value
                                                : "-";
                                        td.style.whiteSpace = "nowrap";
                                        td.style.overflow = "hidden";
                                        td.style.textOverflow = "ellipsis";
                                        td.style.maxWidth =
                                            col === 0 ? "180px" : "120px";
                                        td.title = value || "-"; // Tooltip

                                        // Center-align all columns except the "name" column
                                        if (columnData !== "name") {
                                            td.style.textAlign = "center";
                                        }
                                    };
                                    return cellProperties;
                                },
                            }}
                        />
                    </Box>
                    <TablePagination
                        rowsPerPageOptions={[20, 50, 100]}
                        component="div"
                        count={filteredData.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        sx={{ mt: 1 }}
                    />
                </>
            )}
        </Box>
    );
};

FacultyProfileTable.propTypes = {
    facultyProfiles: PropTypes.array.isRequired,
};

export default FacultyProfileTable;
