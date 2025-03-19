import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import DetailDialog from "./DetailDialog"; // Import the updated dialog component
import VisibilityIcon from "@mui/icons-material/Visibility";
import React from "react";

const InstitutionTable = ({ institutions, onEdit }) => {
    const navigate = useNavigate();
const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role || "HEI Staff"
    const [selectedInstitution, setSelectedInstitution] = React.useState(null);
    const [openDialog, setOpenDialog] = React.useState(false);

    const handleOpenDialog = (institution) => {
        // Store the institution ID in localStorage
        localStorage.setItem("institutionId", institution.id);

        setSelectedInstitution(institution);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedInstitution(null);
        // Optional: Remove the institution ID from localStorage when dialog closes
        // localStorage.removeItem("institutionId");
    };

    return (
        <TableContainer component={Paper} sx={{ mt: 4 }}>
            <Table size="small" stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: "bold", padding: "6px" }}>
                            Name
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", padding: "6px" }}>
                            Region
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", padding: "6px" }}>
                            Address
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", padding: "6px" }}>
                            City
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", padding: "6px" }}>
                            Province
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", padding: "6px" }}>
                            Type
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", padding: "6px" }}>
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {institutions.length > 0 ? (
                        institutions.map((institution, index) => (
                            <TableRow key={index}>
                                <TableCell sx={{ padding: "6px" }}>
                                    {institution.name}
                                </TableCell>
                                <TableCell sx={{ padding: "6px" }}>
                                    {institution.region}
                                </TableCell>
                                <TableCell sx={{ padding: "6px" }}>
                                    {institution.address_street || "N/A"}
                                </TableCell>
                                <TableCell sx={{ padding: "6px" }}>
                                    {institution.municipality_city || "N/A"}
                                </TableCell>
                                <TableCell sx={{ padding: "6px" }}>
                                    {institution.province || "N/A"}
                                </TableCell>
                                <TableCell sx={{ padding: "6px" }}>
                                    {institution.institution_type}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        padding: "6px",
                                        display: "flex",
                                        gap: 1,
                                    }}
                                >
                                    {/* View Details Button */}
                                    <Tooltip title="View Details">
                                        <IconButton
                                            color="info"
                                            onClick={() =>
                                                handleOpenDialog(institution)
                                            }
                                        >
                                            <VisibilityIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} align="center">
                                No data uploaded yet.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <DetailDialog
                open={openDialog}
                role={role}
                onClose={handleCloseDialog}
                institution={selectedInstitution}
                onEdit={onEdit}
                navigate={navigate}
            />
        </TableContainer>
    );
};

InstitutionTable.propTypes = {
    institutions: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            region: PropTypes.string.isRequired,
            address_street: PropTypes.string,
            municipality_city: PropTypes.string,
            province: PropTypes.string,
            postal_code: PropTypes.string,
            institutional_telephone: PropTypes.string,
            institutional_fax: PropTypes.string,
            head_telephone: PropTypes.string,
            institutional_email: PropTypes.string,
            institutional_website: PropTypes.string,
            year_established: PropTypes.string,
            sec_registration: PropTypes.string,
            year_granted_approved: PropTypes.string,
            year_converted_college: PropTypes.string,
            year_converted_university: PropTypes.string,
            head_name: PropTypes.string,
            head_title: PropTypes.string,
            head_education: PropTypes.string,
            institution_type: PropTypes.oneOf(["SUC", "LUC", "PHEI"])
                .isRequired,
        })
    ).isRequired,
    onEdit: PropTypes.func.isRequired,
};

InstitutionTable.defaultProps = {
    institutions: [],
};

export default InstitutionTable;
