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
} from "@mui/material";

const FacultyProfileTable = ({ selectedGroup }) => {
    const [facultyProfiles, setFacultyProfiles] = useState([]);

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
    }, [selectedGroup]); // Refetch data when group changes

    return (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ p: 2 }}>
                Faculty Profiles - {selectedGroup}
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Rank</TableCell>
                        <TableCell>Department</TableCell>
                        <TableCell>Gender</TableCell>
                        <TableCell>Salary</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {facultyProfiles.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} align="center">
                                No data available.
                            </TableCell>
                        </TableRow>
                    ) : (
                        facultyProfiles.map((profile, index) => (
                            <TableRow key={index}>
                                <TableCell>{profile.name}</TableCell>
                                <TableCell>
                                    {profile.generic_faculty_rank || "N/A"}
                                </TableCell>
                                <TableCell>
                                    {profile.home_department || "N/A"}
                                </TableCell>
                                <TableCell>
                                    {profile.gender === 1
                                        ? "Male"
                                        : profile.gender === 2
                                        ? "Female"
                                        : "N/A"}
                                </TableCell>
                                <TableCell>
                                    {profile.annual_basic_salary || "N/A"}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
FacultyProfileTable.propTypes = {
    selectedGroup: PropTypes.string.isRequired,
};

export default FacultyProfileTable;
