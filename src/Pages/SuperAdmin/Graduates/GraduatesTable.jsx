import { useState } from "react";
import PropTypes from "prop-types";
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
import { DataGrid } from "@mui/x-data-grid";

const ROWS_PER_PAGE_OPTIONS = [
    { label: "10", value: 10 },
    { label: "25", value: 25 },
    { label: "50", value: 50 },
    { label: "100", value: 100 },
    { label: "All", value: -1 },
];

const GraduatesTable = ({ graduates }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Handle page change
    const handleChangePage = (event, newPage) => {
        setPage(newPage - 1);
    };

    // Handle rows per page change
    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = event.target.value;
        setRowsPerPage(newRowsPerPage);
        setPage(0);
    };

    // Column definitions for DataGrid
    const columns = [
        {
            field: "student_id",
            headerName: "Student ID",
            minWidth: 120,
            renderCell: (params) =>
                params.value !== null && params.value !== undefined
                    ? params.value
                    : "-",
        },
        {
            field: "last_name",
            headerName: "Last Name",
            minWidth: 150,
            renderCell: (params) =>
                params.value !== null && params.value !== undefined
                    ? params.value
                    : "-",
        },
        {
            field: "first_name",
            headerName: "First Name",
            minWidth: 150,
            renderCell: (params) =>
                params.value !== null && params.value !== undefined
                    ? params.value
                    : "-",
        },
        {
            field: "middle_name",
            headerName: "Middle Name",
            minWidth: 150,
            renderCell: (params) =>
                params.value !== null && params.value !== undefined
                    ? params.value
                    : "-",
        },
        {
            field: "sex",
            headerName: "Sex",
            minWidth: 80,
            renderCell: (params) =>
                params.value !== null && params.value !== undefined
                    ? params.value
                    : "-",
        },
        {
            field: "date_of_birth",
            headerName: "Date of Birth",
            minWidth: 120,
            renderCell: (params) =>
                params.value !== null && params.value !== undefined
                    ? params.value
                    : "-",
        },
        {
            field: "date_graduated",
            headerName: "Date Graduated",
            minWidth: 120,
            renderCell: (params) =>
                params.value !== null && params.value !== undefined
                    ? params.value
                    : "-",
        },
        {
            field: "program_name",
            headerName: "Program Name",
            minWidth: 300,
            renderCell: (params) =>
                params.value !== null && params.value !== undefined
                    ? params.value
                    : "-",
        },
        {
            field: "program_major",
            headerName: "Program Major",
            minWidth: 230,
            renderCell: (params) =>
                params.value !== null && params.value !== undefined
                    ? params.value
                    : "-",
        },
        {
            field: "program_authority_to_operate_graduate",
            headerName: "Program Authority",
            minWidth: 200,
            renderCell: (params) =>
                params.value !== null && params.value !== undefined
                    ? params.value
                    : "-",
        },
        {
            field: "year_granted",
            headerName: "Year Granted",
            minWidth: 150,
            type: "number",
            align: "center",
            headerAlign: "center",
            renderCell: (params) =>
                params.value !== null && params.value !== undefined
                    ? params.value
                    : "-",
        },
    ];

    return (
        <Box sx={{ mb: 2 }}>
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
                        sm: "90vw",
                        md: "95vw",
                    },
                    overflowX: "auto",
                    overflowY: "hidden",
                }}
            >
                <DataGrid
                    rows={graduates}
                    columns={columns}
                    getRowId={(row) => row.student_id}
                    pagination
                    paginationModel={{ page, pageSize: rowsPerPage }}
                    onPaginationModelChange={(newModel) => {
                        setPage(newModel.page);
                        setRowsPerPage(newModel.pageSize);
                    }}
                    pageSizeOptions={ROWS_PER_PAGE_OPTIONS.map(
                        (option) => option.value
                    )}
                    disableRowSelectionOnClick
                    disableColumnFilter
                    disableColumnMenu
                    disableColumnSorting
                    density="compact"
                    sx={{
                        border: 0,
                        "& .MuiDataGrid-root": {
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            minWidth: "fit-content",
                        },
                        "& .MuiDataGrid-main": {
                            flex: 1,
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
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                        },
                        "& .MuiDataGrid-columnSeparator": {
                            visibility: "hidden",
                        },
                        "& .MuiDataGrid-cell": {
                            borderRight: "1px solid",
                            borderColor: "divider",
                            whiteSpace: "normal",
                            wordWrap: "break-word",
                            padding: "4px 8px",
                        },
                        "& .MuiDataGrid-columnHeader": {
                            borderRight: "1px solid",
                            borderColor: "divider",
                            whiteSpace: "normal",
                            wordWrap: "break-word",
                            padding: "4px 8px",
                        },
                    }}
                    slots={{
                        pagination: () => (
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    alignItems: "center",
                                    p: 1,
                                    bgcolor: "grey.50",
                                }}
                            >
                                <FormControl
                                    size="small"
                                    sx={{ minWidth: 80, mr: 1 }}
                                >
                                    <InputLabel sx={{ fontSize: "0.75rem" }}>
                                        Rows
                                    </InputLabel>
                                    <Select
                                        value={rowsPerPage}
                                        onChange={handleChangeRowsPerPage}
                                        label="Rows"
                                        sx={{
                                            height: 32,
                                            fontSize: "0.875rem",
                                        }}
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
                                    count={
                                        Math.ceil(
                                            graduates.length / rowsPerPage
                                        ) || 1
                                    }
                                    page={page + 1}
                                    onChange={handleChangePage}
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
                        ),
                    }}
                />
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
