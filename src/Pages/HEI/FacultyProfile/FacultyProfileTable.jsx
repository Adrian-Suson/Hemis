/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {
    Tabs,
    Tab,
    Paper,
    Box,
    Snackbar,
    Alert,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useLoading } from "../../../Context/LoadingContext";
import config from "../../../utils/config";

const FacultyProfileTable = ({ facultyProfiles: initialFacultyProfiles }) => {
    const [facultyProfiles, setFacultyProfiles] = useState(
        initialFacultyProfiles
    );
    const { showLoading, hideLoading } = useLoading();
    const [tabValue, setTabValue] = useState(0);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRank, setFilterRank] = useState("");
    const [filterCollege, setFilterCollege] = useState("");
    const [filterGender, setFilterGender] = useState("");

    useEffect(() => {
        const validProfiles = Array.isArray(initialFacultyProfiles)
            ? initialFacultyProfiles.filter(
                  (profile) =>
                      profile && typeof profile === "object" && profile.id
              )
            : [];
        setFacultyProfiles(validProfiles);
    }, [initialFacultyProfiles]);

    const filterOptions = useMemo(() => {
        const ranks = new Set();
        const colleges = new Set();
        const genders = new Set();

        facultyProfiles.forEach((profile) => {
            ranks.add(profile.generic_faculty_rank || "Null");
            colleges.add(profile.home_college || "Null");
            genders.add(
                profile.gender !== undefined && profile.gender !== null
                    ? String(profile.gender)
                    : "Null"
            );
        });

        return {
            ranks: ["", ...Array.from(ranks).sort()],
            colleges: ["", ...Array.from(colleges).sort()],
            genders: ["", ...Array.from(genders).sort()],
        };
    }, [facultyProfiles]);

    const allColumns = useMemo(
        () => [
            {
                field: "name",
                headerName: "Name of Faculty",
                minWidth: 280,
                flex: 2,
                editable: true,
                sortable: false,
            },
            {
                field: "generic_faculty_rank",
                headerName: "Faculty Rank",
                flex: 1,
                minWidth: 100,
                editable: true,
                sortable: false,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "home_college",
                headerName: "Home College",
                minWidth: 120,
                flex: 1,
                editable: true,
                sortable: false,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "home_department",
                headerName: "Home Department",
                minWidth: 120,
                flex: 1,
                editable: true,
                sortable: false,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "is_tenured",
                headerName: "Tenured?",
                minWidth: 80,
                flex: 1,
                editable: true,
                sortable: false,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "ssl_salary_grade",
                headerName: "SSL Grade",
                minWidth: 80,
                flex: 1,
                editable: true,
                sortable: false,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "annual_basic_salary",
                headerName: "Annual Salary",
                minWidth: 100,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "on_leave_without_pay",
                headerName: "On Leave?",
                minWidth: 80,
                flex: 1,
                editable: true,
                sortable: false,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "full_time_equivalent",
                headerName: "FTE",
                minWidth: 60,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "gender",
                headerName: "Gender",
                minWidth: 80,
                flex: 1,
                editable: true,
                sortable: false,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "highest_degree_attained",
                headerName: "Highest Degree Attained",
                minWidth: 150,
                flex: 1,
                editable: true,
                sortable: false,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "pursuing_next_degree",
                headerName: "Pursuing Next Degree?",
                minWidth: 150,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "discipline_teaching_load_1",
                headerName: "Discipline (1)",
                minWidth: 120,
                flex: 1,
                editable: true,
                sortable: false,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "discipline_teaching_load_2",
                headerName: "Discipline (2)",
                minWidth: 120,
                flex: 1,
                editable: true,
                sortable: false,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "discipline_bachelors",
                headerName: "Bachelors Discipline",
                minWidth: 150,
                flex: 1,
                editable: true,
                sortable: false,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "discipline_masters",
                headerName: "Masters Discipline",
                minWidth: 150,
                flex: 1,
                editable: true,
                sortable: false,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "discipline_doctorate",
                headerName: "Doctorate Discipline",
                minWidth: 150,
                flex: 1,
                editable: true,
                sortable: false,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "masters_with_thesis",
                headerName: "Masters with Thesis?",
                minWidth: 150,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "doctorate_with_dissertation",
                headerName: "Doctorate with Dissertation?",
                minWidth: 180,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "undergrad_lab_credit_units",
                headerName: "Undergrad Lab Credits",
                minWidth: 120,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "undergrad_lecture_credit_units",
                headerName: "Undergrad Lecture Credits",
                minWidth: 150,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "undergrad_total_credit_units",
                headerName: "Undergrad Total Credits",
                minWidth: 150,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "undergrad_lab_hours_per_week",
                headerName: "Undergrad Lab Hrs/Week",
                minWidth: 150,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "undergrad_lecture_hours_per_week",
                headerName: "Undergrad Lecture Hrs/Week",
                minWidth: 150,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "undergrad_total_hours_per_week",
                headerName: "Undergrad Total Hrs/Week",
                minWidth: 150,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "undergrad_lab_contact_hours",
                headerName: "Undergrad Student Contact Lab",
                minWidth: 180,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "undergrad_lecture_contact_hours",
                headerName: "Undergrad Student Contact Lecture",
                minWidth: 180,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "undergrad_total_contact_hours",
                headerName: "Undergrad Total Contact Hrs",
                minWidth: 150,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "graduate_lab_credit_units",
                headerName: "Graduate Lab Credits",
                minWidth: 120,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "graduate_lecture_credit_units",
                headerName: "Graduate Lecture Credits",
                minWidth: 150,
                editable: true,
                type: "number",
                sortable: false,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "graduate_total_credit_units",
                headerName: "Graduate Total Credits",
                minWidth: 150,
                editable: true,
                type: "number",
                sortable: false,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "graduate_lab_contact_hours",
                headerName: "Graduate Student Contact Lab",
                minWidth: 180,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "graduate_lecture_contact_hours",
                headerName: "Graduate Student Contact Lecture",
                minWidth: 180,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "graduate_total_contact_hours",
                headerName: "Graduate Total Contact Hrs",
                minWidth: 150,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "research_load",
                headerName: "Research Load",
                minWidth: 100,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "extension_services_load",
                headerName: "Extension Services Load",
                minWidth: 150,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "study_load",
                headerName: "Study Load",
                minWidth: 100,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "production_load",
                headerName: "Production Load",
                minWidth: 100,
                editable: true,
                type: "number",
                sortable: false,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "administrative_load",
                headerName: "Administrative Load",
                minWidth: 120,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "other_load_credits",
                headerName: "Other Load Credits",
                minWidth: 120,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "total_work_load",
                headerName: "Total Work Load",
                minWidth: 120,
                editable: true,
                type: "number",
                sortable: false,
                align: "center",
                headerAlign: "center",
            },
        ],
        []
    );

    const tabbedColumns = useMemo(
        () => ({
            personal: [
                allColumns[0], // name
                allColumns[1], // generic_faculty_rank
                allColumns[2], // home_college
                allColumns[3], // home_department
                allColumns[4], // is_tenured
                allColumns[5], // ssl_salary_grade
                allColumns[6], // annual_basic_salary
                allColumns[7], // on_leave_without_pay
                allColumns[8], // full_time_equivalent
                allColumns[9], // gender
            ],
            education: [
                allColumns[0], // name
                allColumns[10], // highest_degree_attained
                allColumns[11], // pursuing_next_degree
                allColumns[12], // discipline_teaching_load_1
                allColumns[13], // discipline_teaching_load_2
                allColumns[14], // discipline_bachelors
                allColumns[15], // discipline_masters
                allColumns[16], // discipline_doctorate
                allColumns[17], // masters_with_thesis
                allColumns[18], // doctorate_with_dissertation
            ],
            teaching: [
                {
                    headerName: "Undergraduate Teaching Load",
                    children: [
                        allColumns[0], // name
                        allColumns[19], // undergrad_lab_credit_units
                        allColumns[20], // undergrad_lecture_credit_units
                        allColumns[21], // undergrad_total_credit_units
                        allColumns[22], // undergrad_lab_hours_per_week
                        allColumns[23], // undergrad_lecture_hours_per_week
                        allColumns[24], // undergrad_total_hours_per_week
                        allColumns[25], // undergrad_lab_contact_hours
                        allColumns[26], // undergrad_lecture_contact_hours
                        allColumns[27], // undergrad_total_contact_hours
                    ],
                },
                {
                    headerName: "Graduate Teaching Load",
                    children: [
                        allColumns[28], // graduate_lab_credit_units
                        allColumns[29], // graduate_lecture_credit_units
                        allColumns[30], // graduate_total_credit_units
                        allColumns[31], // graduate_lab_contact_hours
                        allColumns[32], // graduate_lecture_contact_hours
                        allColumns[33], // graduate_total_contact_hours
                    ],
                },
            ],
            other: [
                allColumns[0], // name
                allColumns[34], // research_load
                allColumns[35], // extension_services_load
                allColumns[36], // study_load
                allColumns[37], // production_load
                allColumns[38], // administrative_load
                allColumns[39], // other_load_credits
                allColumns[40], // total_work_load
            ],
        }),
        [allColumns]
    );

    const data = useMemo(() => {
        return facultyProfiles
            .filter(
                (profile) =>
                    profile &&
                    typeof profile === "object" &&
                    profile.id &&
                    (!searchTerm ||
                        (profile.name &&
                            profile.name
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase()))) &&
                    (!filterRank ||
                        profile.generic_faculty_rank === filterRank ||
                        (filterRank === "Null" &&
                            !profile.generic_faculty_rank)) &&
                    (!filterCollege ||
                        profile.home_college === filterCollege ||
                        (filterCollege === "Null" && !profile.home_college)) &&
                    (!filterGender ||
                        String(profile.gender) === filterGender ||
                        (filterGender === "Null" && profile.gender === null))
            )
            .map((profile) => ({
                id: profile.id,
                ...profile,
            }));
    }, [facultyProfiles, searchTerm, filterRank, filterCollege, filterGender]);

    const handleCellEditStop = useCallback(
        async (params) => {
            const { id, field, value } = params;
            showLoading();
            const updatedFacultyProfiles = [...facultyProfiles];
            const profileIndex = updatedFacultyProfiles.findIndex(
                (profile) => profile.id === id
            );
            if (profileIndex === -1) {
                console.error(`Profile with id ${id} not found`);
                hideLoading();
                return;
            }

            const profile = {
                ...updatedFacultyProfiles[profileIndex],
                [field]: value,
            };
            updatedFacultyProfiles[profileIndex] = profile;
            const token = localStorage.getItem("token");

            try {
                await axios.put(
                    `${config.API_URL}/faculty-profiles/${profile.id}`,
                    { [field]: value },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setFacultyProfiles(updatedFacultyProfiles);
                setSnackbarMessage("Faculty profile updated successfully!");
                setSnackbarSeverity("success");
                setSnackbarOpen(true);
            } catch (error) {
                console.error("Error saving changes:", error);
                setSnackbarMessage("Failed to save faculty profile changes.");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
            } finally {
                hideLoading();
            }
        },
        [facultyProfiles]
    );

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const currentColumns = useMemo(() => {
        switch (tabValue) {
            case 0:
                return tabbedColumns.personal;
            case 1:
                return tabbedColumns.education;
            case 2:
                return [
                    allColumns[0], // name
                    allColumns[19], // undergrad_lab_credit_units
                    allColumns[20], // undergrad_lecture_credit_units
                    allColumns[21], // undergrad_total_credit_units
                    allColumns[22], // undergrad_lab_hours_per_week
                    allColumns[23], // undergrad_lecture_hours_per_week
                    allColumns[24], // undergrad_total_hours_per_week
                    allColumns[25], // undergrad_lab_contact_hours
                    allColumns[26], // undergrad_lecture_contact_hours
                    allColumns[27], // undergrad_total_contact_hours
                    allColumns[28], // graduate_lab_credit_units
                    allColumns[29], // graduate_lecture_credit_units
                    allColumns[30], // graduate_total_credit_units
                    allColumns[31], // graduate_lab_contact_hours
                    allColumns[32], // graduate_lecture_contact_hours
                    allColumns[33], // graduate_total_contact_hours
                ];
            case 3:
                return tabbedColumns.other;
            default:
                return tabbedColumns.personal;
        }
    }, [tabValue, tabbedColumns]);

    const columnGroupingModel = useMemo(() => {
        if (tabValue === 2) {
            return [
                {
                    groupId: " ",
                    children: [{ field: "name" }],
                },
                {
                    groupId: "Undergraduate Teaching Load",
                    headerName: "Undergraduate Teaching Load",
                    children: [
                        { field: "undergrad_lab_credit_units" },
                        { field: "undergrad_lecture_credit_units" },
                        { field: "undergrad_total_credit_units" },
                        { field: "undergrad_lab_hours_per_week" },
                        { field: "undergrad_lecture_hours_per_week" },
                        { field: "undergrad_total_hours_per_week" },
                        { field: "undergrad_lab_contact_hours" },
                        { field: "undergrad_lecture_contact_hours" },
                        { field: "undergrad_total_contact_hours" },
                    ],
                },
                {
                    groupId: "Graduate Teaching Load",
                    headerName: "Graduate Teaching Load",
                    children: [
                        { field: "graduate_lab_credit_units" },
                        { field: "graduate_lecture_credit_units" },
                        { field: "graduate_total_credit_units" },
                        { field: "graduate_lab_contact_hours" },
                        { field: "graduate_lecture_contact_hours" },
                        { field: "graduate_total_contact_hours" },
                    ],
                },
            ];
        }
        return [];
    }, [tabValue]);

    return (
        <Box sx={{ mt: 2, position: "relative" }}>
            <Grid container spacing={1} sx={{ mb: 1 }}>
                <Grid  size={{ xs: 12, sm: 6, md: 3 }}>
                    <TextField
                        fullWidth
                        label="Search by Name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        variant="outlined"
                        size="small"
                        sx={{ "& .MuiInputBase-root": { fontSize: "0.85rem" } }}
                    />
                </Grid>
                <Grid  size={{ xs: 12, sm: 6, md: 3 }}>
                    <FormControl fullWidth size="small">
                        <InputLabel sx={{ fontSize: "0.85rem" }}>
                            Faculty Rank
                        </InputLabel>
                        <Select
                            value={filterRank}
                            onChange={(e) => setFilterRank(e.target.value)}
                            label="Faculty Rank"
                            sx={{ fontSize: "0.85rem" }}
                        >
                            {filterOptions.ranks.map((rank) => (
                                <MenuItem
                                    key={rank || "all"}
                                    value={rank}
                                    sx={{ fontSize: "0.85rem" }}
                                >
                                    {rank || "All"}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid  size={{ xs: 12, sm: 6, md: 3 }}>
                    <FormControl fullWidth size="small">
                        <InputLabel sx={{ fontSize: "0.85rem" }}>
                            Home College
                        </InputLabel>
                        <Select
                            value={filterCollege}
                            onChange={(e) => setFilterCollege(e.target.value)}
                            label="Home College"
                            sx={{ fontSize: "0.85rem" }}
                        >
                            {filterOptions.colleges.map((college) => (
                                <MenuItem
                                    key={college || "all"}
                                    value={college}
                                    sx={{ fontSize: "0.85rem" }}
                                >
                                    {college || "All"}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid  size={{ xs: 12, sm: 6, md: 3 }}>
                    <FormControl fullWidth size="small">
                        <InputLabel sx={{ fontSize: "0.85rem" }}>
                            Gender
                        </InputLabel>
                        <Select
                            value={filterGender}
                            onChange={(e) => setFilterGender(e.target.value)}
                            label="Gender"
                            sx={{ fontSize: "0.85rem" }}
                        >
                            {filterOptions.genders.map((gender) => (
                                <MenuItem
                                    key={gender || "all"}
                                    value={gender}
                                    sx={{ fontSize: "0.85rem" }}
                                >
                                    {gender || "All"}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            <Paper
                sx={{
                    borderRadius: 1,
                    display: "flex",
                    flexDirection: "column",
                    height: {
                        xs: "60vh",
                        sm: "50vh",
                        md: "50vh",
                    },
                    maxWidth: {
                        xs: "100vw",
                        sm: "95vw",
                        md: "98vw",
                    },
                    overflowX: "auto",
                    overflowY: "hidden",
                }}
            >
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    aria-label="faculty data tabs"
                    variant="fullWidth"
                    sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                        "& .MuiTab-root": {
                            fontSize: "0.875rem",
                            fontWeight: "medium",
                        },
                        flexShrink: 0,
                    }}
                >
                    <Tab label="Personal Info" />
                    <Tab label="Education" />
                    <Tab label="Teaching Load" />
                    <Tab label="Other Loads" />
                </Tabs>

                <Paper
                    sx={{
                        borderRadius: 1,
                        display: "flex",
                        flexDirection: "column",
                        height: {
                            xs: "60vh",
                            sm: "50vh",
                            md: "50vh",
                        },
                        maxWidth: {
                            xs: "100vw",
                            sm: "95vw",
                            md: "98vw",
                        },
                        overflowX: "auto",
                        overflowY: "hidden",
                    }}
                >
                    <DataGrid
                        rows={data}
                        columns={currentColumns}
                        editMode="cell"
                        disableColumnFilter
                        disableColumnMenu
                        disableColumnSorting
                        onCellEditStop={handleCellEditStop}
                        density="compact"
                        columnGroupingModel={columnGroupingModel}
                        experimentalFeatures={{ columnGrouping: true }}
                        sx={{
                            border: 0,
                            "& .MuiDataGrid-root": {
                                height: "100%",
                                p: 1,
                                flexDirection: "column",
                                minWidth: "fit-content",
                            },
                            "& .MuiDataGrid-main": {
                                overflowX: "auto",
                                overflowY: "auto",
                                "&::-webkit-scrollbar": {
                                    height: "8px",
                                },
                                "&::-webkit-scrollbar-thumb": {
                                    backgroundColor: "rgba(0,0,0,0.2)",
                                    borderRadius: "4px",
                                },
                            },
                            "& .MuiDataGrid-footerContainer": {
                                borderTop: 1,
                                borderColor: "divider",
                                position: "sticky",
                                bottom: 0,
                                backgroundColor: "background.paper",
                                zIndex: 1,
                                minWidth: "fit-content",
                            },
                            "& .MuiDataGrid-columnSeparator": {
                                visibility: "hidden",
                            },
                            "& .MuiDataGrid-cell": {
                                borderRight: "1px solid",
                                borderColor: "divider",
                                whiteSpace: "normal",
                                wordBreak: "break-word",
                                padding: "4px 8px",
                            },
                            "& .MuiDataGrid-columnHeader": {
                                borderRight: "1px solid",
                                borderColor: "divider",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "clip",
                                padding: "4px 8px",
                            },
                            "& .MuiDataGrid-columnHeaderTitle": {
                                whiteSpace: "nowrap",
                                overflow: "visible",
                            },
                        }}
                        disableRowSelectionOnClick
                        initialState={{
                            pagination: { paginationModel: { pageSize: 10 } },
                        }}
                        pageSizeOptions={[10, 25, 50]}
                    />
                </Paper>
            </Paper>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity={snackbarSeverity}
                    sx={{ width: "100%" }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

FacultyProfileTable.propTypes = {
    facultyProfiles: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            name: PropTypes.string,
            generic_faculty_rank: PropTypes.string,
            home_college: PropTypes.string,
            home_department: PropTypes.string,
            is_tenured: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
            ssl_salary_grade: PropTypes.string,
            annual_basic_salary: PropTypes.number,
            on_leave_without_pay: PropTypes.string,
            full_time_equivalent: PropTypes.number,
            gender: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            highest_degree_attained: PropTypes.string,
            pursuing_next_degree: PropTypes.number,
            discipline_teaching_load_1: PropTypes.string,
            discipline_teaching_load_2: PropTypes.string,
            discipline_bachelors: PropTypes.string,
            discipline_masters: PropTypes.string,
            discipline_doctorate: PropTypes.string,
            masters_with_thesis: PropTypes.number,
            doctorate_with_dissertation: PropTypes.number,
            undergrad_lab_credit_units: PropTypes.number,
            undergrad_lecture_credit_units: PropTypes.number,
            undergrad_total_credit_units: PropTypes.number,
            undergrad_lab_hours_per_week: PropTypes.number,
            undergrad_lecture_hours_per_week: PropTypes.number,
            undergrad_total_hours_per_week: PropTypes.number,
            undergrad_lab_contact_hours: PropTypes.number,
            undergrad_lecture_contact_hours: PropTypes.number,
            undergrad_total_contact_hours: PropTypes.number,
            graduate_lab_credit_units: PropTypes.number,
            graduate_lecture_credit_units: PropTypes.number,
            graduate_total_credit_units: PropTypes.number,
            graduate_lab_contact_hours: PropTypes.number,
            graduate_lecture_contact_hours: PropTypes.number,
            graduate_total_contact_hours: PropTypes.number,
            research_load: PropTypes.number,
            extension_services_load: PropTypes.number,
            study_load: PropTypes.number,
            production_load: PropTypes.number,
            administrative_load: PropTypes.number,
            other_load_credits: PropTypes.number,
            total_work_load: PropTypes.number,
            data_date: PropTypes.string,
        })
    ).isRequired,
};

export default FacultyProfileTable;
