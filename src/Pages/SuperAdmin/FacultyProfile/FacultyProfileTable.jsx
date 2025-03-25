import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.min.css";
import { useState, useMemo, useEffect } from "react";
import { registerAllModules } from "handsontable/registry";
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
import axios from "axios";
import config from "../../../utils/config";

// Register all Handsontable modules
registerAllModules();

const FacultyProfileTable = ({ facultyProfiles: initialFacultyProfiles }) => {
    const [tabIndex, setTabIndex] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [searchQuery, setSearchQuery] = useState("");
    const [facultyProfiles, setFacultyProfiles] = useState(
        initialFacultyProfiles
    ); // Manage facultyProfiles in state
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
    const uniqueTenuredOptions = ["1", "2", "3", "4"];
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
                (profile) => String(profile.is_tenured) === isTenuredFilter
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

    // Handle cell changes
    const handleCellChange = (changes, source) => {
        if (source === "edit") {
            const updatedFacultyProfiles = [...facultyProfiles];
            const updatedFilteredData = [...filteredData];

            changes.forEach(([row, prop, , newValue]) => {
                // Find the actual row index in filteredData and facultyProfiles
                const paginatedIndex = row + page * rowsPerPage;
                const profileIndex = facultyProfiles.findIndex(
                    (profile) => profile === filteredData[paginatedIndex]
                );

                if (profileIndex !== -1) {
                    // All fields (including is_tenured, pursuing_next_degree, etc.) are sent as raw values
                    const valueToSave = newValue;

                    // Update the original facultyProfiles
                    updatedFacultyProfiles[profileIndex][prop] = valueToSave;
                    // Update the filteredData
                    updatedFilteredData[paginatedIndex][prop] = valueToSave;
                }
            });

            setFacultyProfiles(updatedFacultyProfiles);
            setFilteredData(updatedFilteredData);

            // Save changes to backend
            changes.forEach(async ([row, prop, , newValue]) => {
                const profile = updatedFilteredData[row + page * rowsPerPage];
                try {
                    const token = localStorage.getItem("token");
                    const dataToSend = { [prop]: newValue };
                    // All fields are already in the correct format (integers), so send as-is
                    await axios.put(
                        `${config.API_URL}/faculty-profiles/${profile.id}`,
                        dataToSend,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                } catch (error) {
                    console.error("Error saving changes:", error);
                }
            });
        }
    };

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
                    },
                ],
                data: paginatedProfiles.map((profile) => ({
                    name: profile.name || "-",
                    generic_faculty_rank: profile.generic_faculty_rank || "-",
                    home_college: profile.home_college || "-",
                    home_department: profile.home_department || "-",
                    is_tenured:
                        profile.is_tenured !== undefined
                            ? profile.is_tenured
                            : null,
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
                        type: "numeric",
                    },
                    {
                        data: "pursuing_next_degree",
                        title: "PURSUING NEXT DEGREE?",
                        type: "numeric",
                    },
                    {
                        data: "discipline_teaching_load_1",
                        title: "DISCIPLINE (1)",
                        type: "numeric",
                    },
                    {
                        data: "discipline_teaching_load_2",
                        title: "DISCIPLINE (2)",
                        type: "numeric",
                    },
                    {
                        data: "discipline_bachelors",
                        title: "BACHELORS DISCIPLINE",
                        type: "numeric",
                    },
                    {
                        data: "discipline_masters",
                        title: "MASTERS DISCIPLINE",
                        type: "numeric",
                    },
                    {
                        data: "discipline_doctorate",
                        title: "DOCTORATE DISCIPLINE",
                        type: "numeric",
                    },
                    {
                        data: "masters_with_thesis",
                        title: "MASTERS W/ THESIS?",
                        type: "numeric",
                    },
                    {
                        data: "doctorate_with_dissertation",
                        title: "DOCTORATE W/ DISSERTATION?",
                        type: "numeric",
                    },
                ],
                data: paginatedProfiles.map((profile) => ({
                    name: profile.name || "-",
                    highest_degree_attained:
                        profile.highest_degree_attained || "-",
                    pursuing_next_degree:
                        profile.pursuing_next_degree !== undefined
                            ? profile.pursuing_next_degree
                            : 0, // Keep as integer
                    discipline_teaching_load_1:
                        profile.discipline_teaching_load_1 || "-",
                    discipline_teaching_load_2:
                        profile.discipline_teaching_load_2 || "-",
                    discipline_bachelors: profile.discipline_bachelors || "-",
                    discipline_masters: profile.discipline_masters || "-",
                    discipline_doctorate: profile.discipline_doctorate || "-",
                    masters_with_thesis:
                        profile.masters_with_thesis !== undefined
                            ? profile.masters_with_thesis
                            : 0, // Keep as integer
                    doctorate_with_dissertation:
                        profile.doctorate_with_dissertation !== undefined
                            ? profile.doctorate_with_dissertation
                            : 0, // Keep as integer
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
                            height="100%"
                            licenseKey="non-commercial-and-evaluation"
                            settings={{
                                readOnly: false, // Enable editing
                                manualColumnResize: true,
                                columnSorting: true,
                                contextMenu: true, // Enable context menu for copy/paste, undo, etc.
                                afterChange: handleCellChange, // Handle cell changes
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
