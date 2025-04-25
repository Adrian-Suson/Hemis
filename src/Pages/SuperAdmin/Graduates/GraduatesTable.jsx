import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.min.css";
import {
    Box,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Pagination,
} from "@mui/material";

const ROWS_PER_PAGE_OPTIONS = [
    { label: "10", value: 10 },
    { label: "25", value: 25 },
    { label: "50", value: 50 },
    { label: "100", value: 100 },
    { label: "All", value: -1 },
];

const GraduatesTable = ({ graduates }) => {
    const [page, setPage] = useState(0); // State for current page
    const [rowsPerPage, setRowsPerPage] = useState(10); // State for rows per page

    // Handle page change
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Handle rows per page change
    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = event.target.value;
        setRowsPerPage(newRowsPerPage);
        setPage(0); // Reset to first page when rows per page changes
    };

    // Paginate the graduates data
    const paginatedData = useMemo(() => {
        if (rowsPerPage === -1) {
            return graduates; // Show all rows if "All" is selected
        }
        const startIndex = page * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return graduates.slice(startIndex, endIndex);
    }, [graduates, page, rowsPerPage]);

    const hotSettings = {
        data: paginatedData,
        columns: [
            { data: "student_id", title: "Student ID" },
            { data: "last_name", title: "Last Name" },
            { data: "first_name", title: "First Name" },
            { data: "middle_name", title: "Middle Name" },
            { data: "sex", title: "Sex" },
            {
                data: "date_of_birth",
                title: "Date of Birth",
            },
            {
                data: "date_graduated",
                title: "Date Graduated",
            },
            { data: "program_name", title: "Program Name" },
            { data: "program_major", title: "Program Major" },
            {
                data: "program_authority_to_operate_graduate",
                title: "Program Authority",
            },
            { data: "year_granted", title: "Year Granted", type: "numeric" },
        ],
        colHeaders: true,
        rowHeaders: true,
        stretchH: "all",
        height: "450",
        licenseKey: "non-commercial-and-evaluation",
    };

    return (
        <Box sx={{ mb: 2 }}>
            <Paper sx={{ maxHeight: "50vh", overflowX: "auto" }}>
                <HotTable settings={hotSettings} />

                {/* Pagination Controls */}
                <Box
                    sx={{
                        display: "flex",
                        position: "sticky",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 1,
                        justifyContent: "flex-end",
                        alignItems: "center",
                        p: 1,
                        borderTop: 1,
                        borderColor: "divider",
                        bgcolor: "grey.50",
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
                        {graduates.length === 0
                            ? "0-0"
                            : `${page * rowsPerPage + 1}-${Math.min(
                                  (page + 1) * rowsPerPage,
                                  graduates.length
                              )}`}{" "}
                        of {graduates.length}
                    </Typography>
                    <Pagination
                        count={Math.ceil(graduates.length / rowsPerPage) || 1}
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

GraduatesTable.propTypes = {
    graduates: PropTypes.arrayOf(
        PropTypes.shape({
            student_id: PropTypes.string,
            last_name: PropTypes.string,
            first_name: PropTypes.string,
            middle_name: PropTypes.string,
            sex: PropTypes.oneOf(["M", "F"]),
            date_of_birth: PropTypes.string,
            date_graduated: PropTypes.string,
            program_name: PropTypes.string,
            program_major: PropTypes.string,
            program_authority_to_operate_graduate: PropTypes.string,
            year_granted: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
        })
    ).isRequired,
};

export default GraduatesTable;
