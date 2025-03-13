import { useState } from "react";
import PropTypes from "prop-types";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Tabs,
    Tab,
    Box,
    Typography,
    Tooltip,
    Chip,
    Alert,
    TablePagination,
} from "@mui/material";

const FacultyProfileTable = ({ facultyProfiles }) => {
    const [tabIndex, setTabIndex] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(15);

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
        setPage(0); // Reset to first page when changing tabs
    };

    // Helper component for table cells with potentially long content
    const CompactCell = ({ value, width = 120 }) => (
        <Tooltip title={value || "-"} arrow placement="top">
            <TableCell
                sx={{
                    maxWidth: width,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    padding: "6px 8px",
                    fontSize: "0.8125rem",
                }}
            >
                {value || "-"}
            </TableCell>
        </Tooltip>
    );

    CompactCell.propTypes = {
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        width: PropTypes.number,
    };

    // Helper component for table headers
    const HeaderCell = ({ children, colSpan, width = 120 }) => (
        <TableCell
            colSpan={colSpan}
            sx={{
                position: "sticky",
                top: 0,
                backgroundColor: "#f5f5f5",
                fontWeight: "bold",
                maxWidth: width,
                padding: "8px",
                fontSize: "0.75rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                zIndex: 1,
                borderBottom: "2px solid #e0e0e0",
            }}
        >
            <Tooltip title={children} arrow placement="top">
                <Typography variant="subtitle2" noWrap>
                    {children}
                </Typography>
            </Tooltip>
        </TableCell>
    );

    HeaderCell.propTypes = {
        children: PropTypes.node.isRequired,
        colSpan: PropTypes.number,
        width: PropTypes.number,
    };

    // Pagination handlers
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to first page when changing rows per page
    };

    // Slice the data based on the current page and rows per page
    const paginatedProfiles = facultyProfiles.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const renderPersonalInfoTable = () => (
        <Box>
            <TableContainer
                component={Paper}
                sx={{
                    mt: 2,
                    height: 500,
                    overflow: "auto",
                    "&::-webkit-scrollbar": {
                        width: 8,
                        height: 8,
                    },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "#bdbdbd",
                        borderRadius: 2,
                    },
                }}
            >
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <HeaderCell width={180}>NAME OF FACULTY</HeaderCell>
                            <HeaderCell width={120}>FACULTY RANK</HeaderCell>
                            <HeaderCell width={120}>HOME COLLEGE</HeaderCell>
                            <HeaderCell width={120}>HOME DEPT</HeaderCell>
                            <HeaderCell width={100}>TENURED?</HeaderCell>
                            <HeaderCell width={100}>SSL GRADE</HeaderCell>
                            <HeaderCell width={120}>ANNUAL SALARY</HeaderCell>
                            <HeaderCell width={100}>ON LEAVE?</HeaderCell>
                            <HeaderCell width={100}>FTE</HeaderCell>
                            <HeaderCell width={80}>GENDER</HeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedProfiles.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={10} align="center">
                                    No data available.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedProfiles.map((profile, index) => (
                                <TableRow
                                    key={index}
                                    sx={{
                                        "&:nth-of-type(odd)": {
                                            backgroundColor: "#fafafa",
                                        },
                                        "&:hover": {
                                            backgroundColor: "#f1f8ff",
                                        },
                                    }}
                                >
                                    <CompactCell
                                        value={profile.name}
                                        width={180}
                                    />
                                    <CompactCell
                                        value={profile.generic_faculty_rank}
                                    />
                                    <CompactCell value={profile.home_college} />
                                    <CompactCell
                                        value={profile.home_department}
                                    />
                                    <TableCell
                                        align="center"
                                        sx={{ padding: "6px 8px" }}
                                    >
                                        <Chip
                                            size="small"
                                            label={
                                                profile.is_tenured
                                                    ? "Yes"
                                                    : "No"
                                            }
                                            color={
                                                profile.is_tenured
                                                    ? "success"
                                                    : "default"
                                            }
                                            sx={{
                                                fontSize: "0.75rem",
                                                height: 20,
                                            }}
                                        />
                                    </TableCell>
                                    <CompactCell
                                        value={profile.ssl_salary_grade}
                                        width={100}
                                    />
                                    <CompactCell
                                        value={profile.annual_basic_salary}
                                    />
                                    <CompactCell
                                        value={profile.on_leave_without_pay}
                                    />
                                    <CompactCell
                                        value={profile.full_time_equivalent}
                                    />
                                    <TableCell
                                        align="center"
                                        sx={{ padding: "6px 8px" }}
                                    >
                                        {profile.gender === 1
                                            ? "Male"
                                            : profile.gender === 2
                                            ? "Female"
                                            : "-"}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[15, 50, 100]}
                component="div"
                count={facultyProfiles.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{ mt: 1 }}
            />
        </Box>
    );

    const renderEducationTable = () => (
        <Box>
            <TableContainer
                component={Paper}
                sx={{
                    mt: 2,
                    height: 500,
                    overflow: "auto",
                    "&::-webkit-scrollbar": {
                        width: 8,
                        height: 8,
                    },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "#bdbdbd",
                        borderRadius: 2,
                    },
                }}
            >
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <HeaderCell width={180}>NAME OF FACULTY</HeaderCell>
                            <HeaderCell width={160}>HIGHEST DEGREE</HeaderCell>
                            <HeaderCell width={140}>
                                PURSUING NEXT DEGREE?
                            </HeaderCell>
                            <HeaderCell width={160}>DISCIPLINE (1)</HeaderCell>
                            <HeaderCell width={160}>DISCIPLINE (2)</HeaderCell>
                            <HeaderCell width={160}>
                                BACHELORS DISCIPLINE
                            </HeaderCell>
                            <HeaderCell width={160}>
                                MASTERS DISCIPLINE
                            </HeaderCell>
                            <HeaderCell width={160}>
                                DOCTORATE DISCIPLINE
                            </HeaderCell>
                            <HeaderCell width={140}>
                                MASTERS W/ THESIS?
                            </HeaderCell>
                            <HeaderCell width={140}>
                                DOCTORATE W/ DISSERTATION?
                            </HeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedProfiles.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={10} align="center">
                                    No data available.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedProfiles.map((profile, index) => (
                                <TableRow
                                    key={index}
                                    sx={{
                                        "&:nth-of-type(odd)": {
                                            backgroundColor: "#fafafa",
                                        },
                                        "&:hover": {
                                            backgroundColor: "#f1f8ff",
                                        },
                                    }}
                                >
                                    <CompactCell
                                        value={profile.name}
                                        width={180}
                                    />
                                    <CompactCell
                                        value={profile.highest_degree_attained}
                                        width={160}
                                    />
                                    <TableCell
                                        align="center"
                                        sx={{ padding: "6px 8px" }}
                                    >
                                        <Chip
                                            size="small"
                                            label={
                                                profile.pursuing_next_degree
                                                    ? "Yes"
                                                    : "No"
                                            }
                                            color={
                                                profile.pursuing_next_degree
                                                    ? "info"
                                                    : "default"
                                            }
                                            sx={{
                                                fontSize: "0.75rem",
                                                height: 20,
                                            }}
                                        />
                                    </TableCell>
                                    <CompactCell
                                        value={
                                            profile.discipline_teaching_load_1
                                        }
                                        width={160}
                                    />
                                    <CompactCell
                                        value={
                                            profile.discipline_teaching_load_2
                                        }
                                        width={160}
                                    />
                                    <CompactCell
                                        value={profile.discipline_bachelors}
                                        width={160}
                                    />
                                    <CompactCell
                                        value={profile.discipline_masters}
                                        width={160}
                                    />
                                    <CompactCell
                                        value={profile.discipline_doctorate}
                                        width={160}
                                    />
                                    <TableCell
                                        align="center"
                                        sx={{ padding: "6px 8px" }}
                                    >
                                        <Chip
                                            size="small"
                                            label={
                                                profile.masters_with_thesis
                                                    ? "Yes"
                                                    : "No"
                                            }
                                            color={
                                                profile.masters_with_thesis
                                                    ? "info"
                                                    : "default"
                                            }
                                            sx={{
                                                fontSize: "0.75rem",
                                                height: 20,
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{ padding: "6px 8px" }}
                                    >
                                        <Chip
                                            size="small"
                                            label={
                                                profile.doctorate_with_dissertation
                                                    ? "Yes"
                                                    : "No"
                                            }
                                            color={
                                                profile.doctorate_with_dissertation
                                                    ? "info"
                                                    : "default"
                                            }
                                            sx={{
                                                fontSize: "0.75rem",
                                                height: 20,
                                            }}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[15, 50, 100]}
                component="div"
                count={facultyProfiles.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{ mt: 1 }}
            />
        </Box>
    );

    const renderTeachingLoadTable = () => (
        <Box>
            <TableContainer
                component={Paper}
                sx={{
                    mt: 2,
                    height: 500,
                    overflow: "auto",
                    "&::-webkit-scrollbar": {
                        width: 8,
                        height: 8,
                    },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "#bdbdbd",
                        borderRadius: 2,
                    },
                }}
            >
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <HeaderCell width={180}> </HeaderCell>
                            <HeaderCell
                                colSpan={9}
                                sx={{
                                    backgroundColor: "#e3f2fd",
                                    textAlign: "center",
                                }}
                            >
                                UNDERGRADUATE TEACHING LOAD
                            </HeaderCell>
                            <HeaderCell
                                colSpan={6}
                                sx={{
                                    backgroundColor: "#e8f5e9",
                                    textAlign: "center",
                                }}
                            >
                                GRADUATE TEACHING LOAD
                            </HeaderCell>
                        </TableRow>
                        <TableRow>
                            <HeaderCell width={180}>NAME OF FACULTY</HeaderCell>
                            {/* Undergraduate headers */}
                            <HeaderCell width={100}>LAB CREDITS</HeaderCell>
                            <HeaderCell width={100}>LECTURE CREDITS</HeaderCell>
                            <HeaderCell width={100}>TOTAL CREDITS</HeaderCell>
                            <HeaderCell width={100}>LAB HRS/WEEK</HeaderCell>
                            <HeaderCell width={100}>
                                LECTURE HRS/WEEK
                            </HeaderCell>
                            <HeaderCell width={100}>TOTAL HRS/WEEK</HeaderCell>
                            <HeaderCell width={110}>
                                STUDENT CONTACT LAB
                            </HeaderCell>
                            <HeaderCell width={110}>
                                STUDENT CONTACT LECTURE
                            </HeaderCell>
                            <HeaderCell width={110}>
                                TOTAL CONTACT HRS
                            </HeaderCell>
                            {/* Graduate headers */}
                            <HeaderCell width={100}>LAB CREDITS</HeaderCell>
                            <HeaderCell width={100}>LECTURE CREDITS</HeaderCell>
                            <HeaderCell width={100}>TOTAL CREDITS</HeaderCell>
                            <HeaderCell width={110}>
                                STUDENT CONTACT LAB
                            </HeaderCell>
                            <HeaderCell width={110}>
                                STUDENT CONTACT LECTURE
                            </HeaderCell>
                            <HeaderCell width={110}>
                                TOTAL CONTACT HRS
                            </HeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedProfiles.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={16} align="center">
                                    No data available.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedProfiles.map((profile, index) => (
                                <TableRow
                                    key={index}
                                    sx={{
                                        "&:nth-of-type(odd)": {
                                            backgroundColor: "#fafafa",
                                        },
                                        "&:hover": {
                                            backgroundColor: "#f1f8ff",
                                        },
                                    }}
                                >
                                    <CompactCell
                                        value={profile.name}
                                        width={180}
                                    />
                                    {/* Undergraduate cells */}
                                    <CompactCell
                                        value={
                                            profile.undergrad_lab_credit_units
                                        }
                                        width={100}
                                    />
                                    <CompactCell
                                        value={
                                            profile.undergrad_lecture_credit_units
                                        }
                                        width={100}
                                    />
                                    <CompactCell
                                        value={
                                            profile.undergrad_total_credit_units
                                        }
                                        width={100}
                                    />
                                    <CompactCell
                                        value={
                                            profile.undergrad_lab_hours_per_week
                                        }
                                        width={100}
                                    />
                                    <CompactCell
                                        value={
                                            profile.undergrad_lecture_hours_per_week
                                        }
                                        width={100}
                                    />
                                    <CompactCell
                                        value={
                                            profile.undergrad_total_hours_per_week
                                        }
                                        width={100}
                                    />
                                    <CompactCell
                                        value={
                                            profile.undergrad_lab_contact_hours
                                        }
                                        width={110}
                                    />
                                    <CompactCell
                                        value={
                                            profile.undergrad_lecture_contact_hours
                                        }
                                        width={110}
                                    />
                                    <CompactCell
                                        value={
                                            profile.undergrad_total_contact_hours
                                        }
                                        width={110}
                                    />
                                    {/* Graduate cells */}
                                    <CompactCell
                                        value={
                                            profile.graduate_lab_credit_units
                                        }
                                        width={100}
                                    />
                                    <CompactCell
                                        value={
                                            profile.graduate_lecture_credit_units
                                        }
                                        width={100}
                                    />
                                    <CompactCell
                                        value={
                                            profile.graduate_total_credit_units
                                        }
                                        width={100}
                                    />
                                    <CompactCell
                                        value={
                                            profile.graduate_lab_contact_hours
                                        }
                                        width={110}
                                    />
                                    <CompactCell
                                        value={
                                            profile.graduate_lecture_contact_hours
                                        }
                                        width={110}
                                    />
                                    <CompactCell
                                        value={
                                            profile.graduate_total_contact_hours
                                        }
                                        width={110}
                                    />
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[15, 50, 100]}
                component="div"
                count={facultyProfiles.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{ mt: 1 }}
            />
        </Box>
    );

    const renderOtherLoadsTable = () => (
        <Box>
            <TableContainer
                component={Paper}
                sx={{
                    mt: 2,
                    height: 500,
                    overflow: "auto",
                    "&::-webkit-scrollbar": {
                        width: 8,
                        height: 8,
                    },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "#bdbdbd",
                        borderRadius: 2,
                    },
                }}
            >
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <HeaderCell width={180}>NAME OF FACULTY</HeaderCell>
                            <HeaderCell width={140}>RESEARCH LOAD</HeaderCell>
                            <HeaderCell width={140}>
                                EXTENSION SERVICES
                            </HeaderCell>
                            <HeaderCell width={140}>STUDY LOAD</HeaderCell>
                            <HeaderCell width={140}>PRODUCTION LOAD</HeaderCell>
                            <HeaderCell width={140}>ADMIN LOAD</HeaderCell>
                            <HeaderCell width={140}>
                                OTHER LOAD CREDITS
                            </HeaderCell>
                            <HeaderCell width={140}>TOTAL WORK LOAD</HeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedProfiles.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    No data available.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedProfiles.map((profile, index) => (
                                <TableRow
                                    key={index}
                                    sx={{
                                        "&:nth-of-type(odd)": {
                                            backgroundColor: "#fafafa",
                                        },
                                        "&:hover": {
                                            backgroundColor: "#f1f8ff",
                                        },
                                    }}
                                >
                                    <CompactCell
                                        value={profile.name}
                                        width={180}
                                    />
                                    <CompactCell
                                        value={profile.research_load}
                                        width={140}
                                    />
                                    <CompactCell
                                        value={profile.extension_services_load}
                                        width={140}
                                    />
                                    <CompactCell
                                        value={profile.study_load}
                                        width={140}
                                    />
                                    <CompactCell
                                        value={profile.production_load}
                                        width={140}
                                    />
                                    <CompactCell
                                        value={profile.administrative_load}
                                        width={140}
                                    />
                                    <CompactCell
                                        value={profile.other_load_credits}
                                        width={140}
                                    />
                                    <TableCell
                                        sx={{
                                            padding: "6px 8px",
                                            fontSize: "0.8125rem",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {profile.total_work_load || "-"}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[15, 50, 100]}
                component="div"
                count={facultyProfiles.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{ mt: 1 }}
            />
        </Box>
    );

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
                    {tabIndex === 0 && renderPersonalInfoTable()}
                    {tabIndex === 1 && renderEducationTable()}
                    {tabIndex === 2 && renderTeachingLoadTable()}
                    {tabIndex === 3 && renderOtherLoadsTable()}
                </>
            )}
        </Box>
    );
};

FacultyProfileTable.propTypes = {
    facultyProfiles: PropTypes.array.isRequired,
};

export default FacultyProfileTable;
