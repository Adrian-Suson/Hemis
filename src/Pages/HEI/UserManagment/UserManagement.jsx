import { useState, useEffect } from "react";
import axios from "axios";
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Button,
    TextField,
    Select,
    MenuItem,
    InputAdornment,
    Tooltip,
    Chip,
    TablePagination,
    Alert,
    CircularProgress,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import config from "../../../utils/config";
import UserDialog from "./Func/UserDialog";
import SearchIcon from '@mui/icons-material/Search';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import RefreshIcon from '@mui/icons-material/Refresh';
import PersonIcon from '@mui/icons-material/Person';
import PersonOffIcon from '@mui/icons-material/PersonOff';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [openDialog, setOpenDialog] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.get(`${config.API_URL}/users`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(response.data);
            console.log("response.data:", response.data); // Debug to verify institution data
        } catch {
            setError("Failed to fetch users. Please login again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSearch = (e) => setSearchTerm(e.target.value);
    const handleFilterChange = (e) => setStatusFilter(e.target.value);

    const filteredUsers = users.filter(
        (user) =>
            (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (statusFilter === "All" || user.status === statusFilter)
    );

    const handleEditUser = (user) => {
        setEditingUser(user);
        setOpenDialog(true);
    };

    const handleUserUpdated = () => {
        fetchUsers();
    };

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDeactivateUser = async (id) => {
        const token = localStorage.getItem("token");
        try {
            await axios.delete(`${config.API_URL}/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchUsers();
        } catch {
            setError("Failed to delete user.");
        }
    };

    const handleReactivateUser = async (id) => {
        const token = localStorage.getItem("token");
        try {
            await axios.post(
                `${config.API_URL}/users/${id}/reactivate`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchUsers();
        } catch {
            setError("Failed to reactivate user.");
        }
    };

    return (
        <Box sx={{ p: 3, backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 3, borderRadius: 1 }}
                    onClose={() => setError("")}
                >
                    {error}
                </Alert>
            )}

            {/* Actions Bar */}
            <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
                    <TextField
                        placeholder="Search users..."
                        variant="outlined"
                        size="small"
                        value={searchTerm}
                        onChange={handleSearch}
                        sx={{
                            minWidth: "250px",
                            bgcolor: "white",
                            "& .MuiOutlinedInput-root": {
                                "&:hover fieldset": { borderColor: "primary.main" },
                            },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Select
                        value={statusFilter}
                        onChange={handleFilterChange}
                        size="small"
                        sx={{ minWidth: "150px", bgcolor: "white" }}
                        displayEmpty
                    >
                        <MenuItem value="All">All Status</MenuItem>
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                    </Select>
                    <Box sx={{ flexGrow: 1 }} />
                    <Tooltip title="Refresh list">
                        <IconButton onClick={fetchUsers} size="small">
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                    <Button
                        variant="contained"
                        startIcon={<PersonAddAlt1Icon />}
                        onClick={() => setOpenDialog(true)}
                        sx={{
                            minWidth: "150px",
                            boxShadow: 2,
                            "&:hover": { boxShadow: 4 },
                        }}
                    >
                        Add User
                    </Button>
                </Box>
            </Paper>

            {/* Users Table */}
            <Paper sx={{ borderRadius: 2, overflow: "hidden", boxShadow: (theme) => theme.shadows[2] }}>
                <TableContainer sx={{ maxHeight: "calc(100vh - 300px)" }}>
                    <Table stickyHeader size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600, backgroundColor: "#f8fafc", padding: "4px 8px" }}>
                                    Name
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, backgroundColor: "#f8fafc", padding: "4px 8px" }}>
                                    Role
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, backgroundColor: "#f8fafc", padding: "4px 8px" }}>
                                    Email
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, backgroundColor: "#f8fafc", padding: "4px 8px" }}>
                                    Institution
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, backgroundColor: "#f8fafc", padding: "4px 8px" }}>
                                    Status
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, backgroundColor: "#f8fafc", textAlign: "center", padding: "4px 8px" }}>
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                                <TableRow key={user.id} hover>
                                    <TableCell sx={{ padding: "4px 8px" }}>{user.name}</TableCell>
                                    <TableCell sx={{ padding: "4px 8px" }}>
                                        <Chip
                                            label={user.role}
                                            size="small"
                                            color={user.role === "Super Admin" ? "primary" : "default"} // Updated to match role
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell sx={{ padding: "4px 8px" }}>{user.email}</TableCell>
                                    <TableCell sx={{ padding: "4px 8px" }}>
                                        {user.institution ? user.institution.name : "N/A"}
                                    </TableCell>
                                    <TableCell sx={{ padding: "4px 8px" }}>
                                        <Chip
                                            label={user.status}
                                            size="small"
                                            color={user.status === "Active" ? "success" : "error"}
                                        />
                                    </TableCell>
                                    <TableCell align="center" sx={{ padding: "4px 8px" }}>
                                        <Tooltip title="Edit user">
                                            <Button
                                                size="small"
                                                color="primary"
                                                variant="contained"
                                                onClick={() => handleEditUser(user)}
                                                sx={{ mr: 1 }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </Button>
                                        </Tooltip>
                                        {user.status === "Active" ? (
                                            <Tooltip title="Deactivate user">
                                                <Button
                                                    size="small"
                                                    color="error"
                                                    variant="contained"
                                                    onClick={() => handleDeactivateUser(user.id)}
                                                >
                                                    <PersonOffIcon fontSize="small" />
                                                </Button>
                                            </Tooltip>
                                        ) : (
                                            <Tooltip title="Reactivate user">
                                                <Button
                                                    size="small"
                                                    color="success"
                                                    variant="contained"
                                                    onClick={() => handleReactivateUser(user.id)}
                                                >
                                                    <PersonIcon fontSize="small" />
                                                </Button>
                                            </Tooltip>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {filteredUsers.length === 0 && !loading && (
                    <Box p={3} textAlign="center">
                        <Typography color="text.secondary">No users found</Typography>
                    </Box>
                )}

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredUsers.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

            {loading && (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <CircularProgress />
                </Box>
            )}

            <UserDialog
                openDialog={openDialog}
                onClose={() => {
                    setOpenDialog(false);
                    setEditingUser(null);
                }}
                editingUser={editingUser}
                onUserUpdated={handleUserUpdated}
            />
        </Box>
    );
};

export default UserManagement;
