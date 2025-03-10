import { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Tabs,
    Tab,
    Box,
} from "@mui/material";

const FacultyProfileTable = ({ selectedGroup }) => {
    const [facultyProfiles, setFacultyProfiles] = useState([]);
    const [tabIndex, setTabIndex] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Authentication token is missing.");
            return;
        }

        const fetchFacultyProfiles = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8000/api/faculty-profiles?faculty_group=${selectedGroup}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setFacultyProfiles(response.data);
            } catch (error) {
                console.error("Error fetching faculty profiles:", error);
            }
        };

        fetchFacultyProfiles();
    }, [selectedGroup]);

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    return (
        <Box sx={{ mt: 3 }}>
            <Tabs value={tabIndex} onChange={handleTabChange} centered>
                <Tab label="Personal Info" />
                <Tab label="Education" />
                <Tab label="Teaching Load" />
                <Tab label="Other Loads" />
            </Tabs>

            {/* Personal Info Tab */}
            {tabIndex === 0 && (
                <TableContainer component={Paper}  sx={{ mt: 2, maxHeight: 500, overflow: "auto" }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    NAME OF FACULTY (Last name, first name,
                                    middle initial)
                                </TableCell>
                                <TableCell>GENERIC FACULTY RANK</TableCell>
                                <TableCell>HOME DEPT</TableCell>
                                <TableCell>HOME COLLEGE</TableCell>
                                <TableCell>IS FACULTY TENURED?</TableCell>
                                <TableCell>GENDER</TableCell>
                                <TableCell>SSL SALARY GRADE</TableCell>
                                <TableCell>ANNUAL BASIC SALARY</TableCell>
                                <TableCell>FULL TIME EQUIVALENT</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {facultyProfiles.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} align="center">
                                        No data available.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                facultyProfiles.map((profile, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{profile.name}</TableCell>
                                        <TableCell>
                                            {profile.generic_faculty_rank ||
                                                "N/A"}
                                        </TableCell>
                                        <TableCell>
                                            {profile.home_department || "N/A"}
                                        </TableCell>
                                        <TableCell>
                                            {profile.home_college || "N/A"}
                                        </TableCell>
                                        <TableCell>
                                            {profile.is_tenured ? "Yes" : "No"}
                                        </TableCell>
                                        <TableCell>
                                            {profile.gender === 1
                                                ? "Male"
                                                : profile.gender === 2
                                                ? "Female"
                                                : "N/A"}
                                        </TableCell>
                                        <TableCell>
                                            {profile.ssl_salary_grade || "N/A"}
                                        </TableCell>
                                        <TableCell>
                                            {profile.annual_basic_salary ||
                                                "N/A"}
                                        </TableCell>
                                        <TableCell>
                                            {profile.full_time_equivalent ||
                                                "N/A"}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Education Tab */}
            {tabIndex === 1 && (
              <TableContainer component={Paper}  sx={{ mt: 2, maxHeight: 500, overflow: "auto" }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>HIGHEST DEGREE ATTAINED</TableCell>
                                <TableCell>
                                    ACTIVELY PURSUING NEXT DEGREE?
                                </TableCell>
                                <TableCell>
                                    SPECIFIC DISCIPLINE (1) OF TEACHING LOAD
                                </TableCell>
                                <TableCell>
                                    SPECIFIC DISCIPLINE (2) OF TEACHING LOAD
                                </TableCell>
                                <TableCell>
                                    SPECIFIC DISCIPLINE OF BACHELORS DEGREE
                                </TableCell>
                                <TableCell>
                                    SPECIFIC DISCIPLINE OF MASTERS DEGREE
                                </TableCell>
                                <TableCell>
                                    SPECIFIC DISCIPLINE OF DOCTORATE DEGREE
                                </TableCell>
                                <TableCell>MASTER&apos;S WITH THESIS?</TableCell>
                                <TableCell>
                                    DOCTORATE WITH DISSERTATION?
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {facultyProfiles.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} align="center">
                                        No data available.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                facultyProfiles.map((profile, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            {profile.highest_degree_attained ||
                                                "N/A"}
                                        </TableCell>
                                        <TableCell>
                                            {profile.pursuing_next_degree
                                                ? "Yes"
                                                : "No"}
                                        </TableCell>
                                        <TableCell>
                                            {profile.discipline_teaching_load_1 ||
                                                "N/A"}
                                        </TableCell>
                                        <TableCell>
                                            {profile.discipline_teaching_load_2 ||
                                                "N/A"}
                                        </TableCell>
                                        <TableCell>
                                            {profile.discipline_bachelors ||
                                                "N/A"}
                                        </TableCell>
                                        <TableCell>
                                            {profile.discipline_masters ||
                                                "N/A"}
                                        </TableCell>
                                        <TableCell>
                                            {profile.discipline_doctorate ||
                                                "N/A"}
                                        </TableCell>
                                        <TableCell>
                                            {profile.masters_with_thesis
                                                ? "Yes"
                                                : "No"}
                                        </TableCell>
                                        <TableCell>
                                            {profile.doctorate_with_dissertation
                                                ? "Yes"
                                                : "No"}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Teaching Load Tab */}
            {tabIndex === 2 && (
                <TableContainer component={Paper}  sx={{ mt: 2, maxHeight: 500, overflow: "auto" }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    LECTURE CREDIT UNITS (Lab-Lect)
                                </TableCell>
                                <TableCell>
                                    LECTURE HOURS PER WEEK (Lab-Lect)
                                </TableCell>
                                <TableCell>
                                    LAB CREDIT UNITS (Lab-Lect)
                                </TableCell>
                                <TableCell>
                                    LAB HOURS PER WEEK (Lab-Lect)
                                </TableCell>
                                <TableCell>
                                    TOTAL TEACHING CREDIT UNITS Undergraduate
                                    level (Lab-Lect)
                                </TableCell>
                                <TableCell>
                                    TOTAL TEACHING HOURS Undergraduate level
                                    (Lab-Lect)
                                </TableCell>
                                <TableCell>
                                    TOTAL TEACHING CREDIT UNITS Graduate level
                                    (Lab-Lect)
                                </TableCell>
                                <TableCell>
                                    TOTAL TEACHING HOURS Graduate level
                                    (Lab-Lect)
                                </TableCell>
                                <TableCell>
                                    STUDENT CONTACT: Undergrad Student Contact
                                    Hrs
                                </TableCell>
                                <TableCell>
                                    STUDENT CONTACT: Graduate Student Contact
                                    Hrs
                                </TableCell>
                                <TableCell>STUDENT CONTACT: TOTAL</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {facultyProfiles.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={11} align="center">
                                        No data available.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                facultyProfiles.map((profile, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            {profile.undergrad_lecture_credit_units ||
                                                "N/A"}
                                        </TableCell>
                                        <TableCell>
                                            {profile.undergrad_lecture_hours_per_week ||
                                                "N/A"}
                                        </TableCell>
                                        <TableCell>
                                            {profile.undergrad_lab_credit_units ||
                                                "N/A"}
                                        </TableCell>
                                        <TableCell>
                                            {profile.undergrad_lab_hours_per_week ||
                                                "N/A"}
                                        </TableCell>
                                        <TableCell>
                                            {profile.undergrad_total_credit_units ||
                                                "N/A"}
                                        </TableCell>
                                        <TableCell>
                                            {profile.undergrad_total_hours_per_week ||
                                                "N/A"}
                                        </TableCell>
                                        <TableCell>
                                            {profile.graduate_total_credit_units ||
                                                "N/A"}
                                        </TableCell>
                                        <TableCell>
                                            {profile.graduate_total_contact_hours ||
                                                "N/A"}
                                        </TableCell>
                                        <TableCell>
                                            {profile.undergrad_student_contact_hours ||
                                                "N/A"}
                                        </TableCell>
                                        <TableCell>
                                            {profile.graduate_student_contact_hours ||
                                                "N/A"}
                                        </TableCell>
                                        <TableCell>
                                            {profile.total_student_contact_hours ||
                                                "N/A"}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Other Loads Tab */}
            {tabIndex === 3 && (
               <TableContainer component={Paper}  sx={{ mt: 2, maxHeight: 500, overflow: "auto" }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>OFFICIAL RESEARCH LOAD</TableCell>
                                <TableCell>
                                    OFFICIAL EXTENSION SERVICES LOAD
                                </TableCell>
                                <TableCell>OFFICIAL STUDY LOAD</TableCell>
                                <TableCell>
                                    OTHER OFFICIAL PRODUCTION LOAD
                                </TableCell>
                                <TableCell>
                                    OFFICIAL ADMINISTRATIVE LOAD
                                </TableCell>
                                <TableCell>TOTAL WORK LOAD CREDITS</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {facultyProfiles.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        No data available.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                facultyProfiles.map((profile, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            {profile.research_load || "N/A"}
                                        </TableCell>
                                        <TableCell>
                                            {profile.extension_services_load ||
                                                "N/A"}
                                        </TableCell>
                                        <TableCell>
                                            {profile.study_load || "N/A"}
                                        </TableCell>
                                        <TableCell>
                                            {profile.production_load || "N/A"}
                                        </TableCell>
                                        <TableCell>
                                            {profile.administrative_load ||
                                                "N/A"}
                                        </TableCell>
                                        <TableCell>
                                            {profile.total_work_load || "N/A"}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

FacultyProfileTable.propTypes = {
    selectedGroup: PropTypes.string.isRequired,
};

export default FacultyProfileTable;
