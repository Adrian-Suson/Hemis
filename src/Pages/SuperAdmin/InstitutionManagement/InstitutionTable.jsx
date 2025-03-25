// InstitutionTable.jsx
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
import DetailDialog from "./DetailDialog";
import VisibilityIcon from "@mui/icons-material/Visibility";
import React from "react";

const InstitutionTable = ({ institutions, onEdit }) => {
    const navigate = useNavigate();
    const [selectedInstitution, setSelectedInstitution] = React.useState(null);
    const [openDialog, setOpenDialog] = React.useState(false);

    const handleOpenDialog = (institution) => {
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
        <TableContainer component={Paper} sx={{ mt: 2, boxShadow: "none" }}>
            <Table
                size="small"
                stickyHeader
                sx={{ borderCollapse: "collapse" }}
            >
                <TableHead>
                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                        <TableCell sx={{ fontWeight: "bold", py: 1, px: 2 }}>
                            Name
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", py: 1, px: 2 }}>
                            Region
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", py: 1, px: 2 }}>
                            Address
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", py: 1, px: 2 }}>
                            City
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", py: 1, px: 2 }}>
                            Province
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", py: 1, px: 2 }}>
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {institutions.length > 0 ? (
                        institutions.map((institution) => (
                            <TableRow
                                key={institution.id}
                                sx={{
                                    "&:hover": { backgroundColor: "#fafafa" },
                                }}
                            >
                                <TableCell sx={{ py: 0.5, px: 2 }}>
                                    {institution.name}
                                </TableCell>
                                <TableCell sx={{ py: 0.5, px: 2 }}>
                                    {institution.region}
                                </TableCell>
                                <TableCell sx={{ py: 0.5, px: 2 }}>
                                    {institution.address_street || "N/A"}
                                </TableCell>
                                <TableCell sx={{ py: 0.5, px: 2 }}>
                                    {institution.municipality_city || "N/A"}
                                </TableCell>
                                <TableCell sx={{ py: 0.5, px: 2 }}>
                                    {institution.province || "N/A"}
                                </TableCell>
                                <TableCell sx={{ py: 0.5, px: 2 }}>
                                    <Tooltip title="View Details">
                                        <IconButton
                                            size="small"
                                            color="info"
                                            onClick={() =>
                                                handleOpenDialog(institution)
                                            }
                                        >
                                            <VisibilityIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={7}
                                align="center"
                                sx={{ py: 2 }}
                            >
                                No data uploaded yet.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <DetailDialog
                open={openDialog}
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
