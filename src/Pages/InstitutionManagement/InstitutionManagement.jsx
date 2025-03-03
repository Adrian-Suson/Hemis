import React, { useState, useEffect, useRef } from "react";
import {
    Box,
    Button,
    Typography,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    CircularProgress,
} from "@mui/material";
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
} from "@mui/icons-material";
import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.css"; // Import Handsontable styles

const InstitutionManagement = () => {
    const [institutions, setInstitutions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentInstitution, setCurrentInstitution] = useState(null);
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [accreditation, setAccreditation] = useState("");
    const tableRef = useRef(null);

    // Sample data for testing
    const sampleData = [
        ["University of Example", "City A, Region 1", "Accredited"],
        ["College of Education", "City B, Region 2", "Pending"],
        ["Tech Institute", "City C, Region 3", "Accredited"],
    ];

    useEffect(() => {
        // Set initial data for Handsontable
        const hot = new Handsontable(tableRef.current, {
            data: sampleData,
            rowHeaders: true,
            colHeaders: ["Name", "Location", "Accreditation"],
            columns: [
                { data: 0 }, // Name
                { data: 1 }, // Location
                { data: 2 }, // Accreditation
            ],
            contextMenu: true, // Enable context menu for adding/removing rows
            afterChange: (changes) => {
                if (changes) {
                    setInstitutions(hot.getData()); // Sync updated data
                }
            },
        });

        return () => hot.destroy(); // Cleanup on unmount
    }, []);

    // Open Dialog for Add/Edit
    const openInstitutionDialog = (institution = null) => {
        setCurrentInstitution(institution);
        setName(institution ? institution[0] : "");
        setLocation(institution ? institution[1] : "");
        setAccreditation(institution ? institution[2] : "");
        setOpenDialog(true);
    };

    // Close the dialog
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentInstitution(null);
        setName("");
        setLocation("");
        setAccreditation("");
    };

    // Add or Update Institution
    const handleSaveInstitution = () => {
        const hot = new Handsontable(tableRef.current);
        const newInstitution = [name, location, accreditation];

        if (currentInstitution) {
            // Update institution
            const rowIndex = institutions.findIndex(
                (institution) => institution[0] === currentInstitution[0]
            );
            hot.setDataAtCell(rowIndex, 0, name);
            hot.setDataAtCell(rowIndex, 1, location);
            hot.setDataAtCell(rowIndex, 2, accreditation);
        } else {
            // Add new institution
            hot.alter("insert_row", institutions.length);
            hot.setDataAtCell(institutions.length, 0, name);
            hot.setDataAtCell(institutions.length, 1, location);
            hot.setDataAtCell(institutions.length, 2, accreditation);
        }

        handleCloseDialog();
    };

    // Delete Institution
    const handleDeleteInstitution = () => {
        const hot = new Handsontable(tableRef.current);
        const rowIndex = institutions.findIndex(
            (institution) => institution[0] === currentInstitution[0]
        );
        if (rowIndex !== -1) {
            hot.alter("remove_row", rowIndex);
            handleCloseDialog();
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Institution Management
            </Typography>

            <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => openInstitutionDialog()}
            >
                Add New Institution
            </Button>

            {loading ? (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    mt={2}
                >
                    <CircularProgress />
                </Box>
            ) : (
                <Box ref={tableRef} id="institution-table" sx={{ mt: 2 }} />
            )}

            {/* Institution Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>
                    {currentInstitution
                        ? "Edit Institution"
                        : "Add New Institution"}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        label="Institution Name"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Location"
                        fullWidth
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Accreditation"
                        fullWidth
                        value={accreditation}
                        onChange={(e) => setAccreditation(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button variant="contained" onClick={handleSaveInstitution}>
                        {currentInstitution
                            ? "Save Changes"
                            : "Add Institution"}
                    </Button>
                    {currentInstitution && (
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleDeleteInstitution}
                        >
                            Delete
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default InstitutionManagement;
