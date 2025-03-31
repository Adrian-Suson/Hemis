import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Typography,
    Box,
    IconButton,
    Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import PropTypes from "prop-types";
import { useState } from "react";

const UploadDialog = ({
    openUploadDialog,
    setOpenUploadDialog,
    selectedInstitutionType,
    setSelectedInstitutionType,
    selectedFile,
    setSelectedFile,
    handleFileUpload,
}) => {
    const [fileError, setFileError] = useState(""); // State for file validation errors
    const [typeError, setTypeError] = useState(""); // State for institution type error
    const [validationTriggered, setValidationTriggered] = useState(false); // Track if validation was attempted

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
    const ACCEPTED_FILE_TYPES = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
        "application/vnd.ms-excel", // .xls
    ];

    const handleClose = () => {
        setOpenUploadDialog(false);
        setSelectedFile(null);
        setSelectedInstitutionType("");
        setFileError("");
        setTypeError("");
        setValidationTriggered(false); // Reset validation state
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file || null); // Set file even if invalid, validate on upload
        setFileError(""); // Clear previous error until upload is attempted
        if (validationTriggered) setValidationTriggered(false); // Reset validation trigger if file changes
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setFileError("");
        if (validationTriggered) setValidationTriggered(false); // Reset validation trigger
    };

    const validateInputs = () => {
        let isValid = true;

        // Validate institution type
        if (!selectedInstitutionType) {
            setTypeError("Please select an institution type.");
            isValid = false;
        } else {
            setTypeError("");
        }

        // Validate file
        if (!selectedFile) {
            setFileError("Please choose a file.");
            isValid = false;
        } else if (!ACCEPTED_FILE_TYPES.includes(selectedFile.type)) {
            setFileError("Please upload a valid Excel file (.xlsx or .xls).");
            isValid = false;
        } else if (selectedFile.size > MAX_FILE_SIZE) {
            setFileError("File size exceeds 10MB limit.");
            isValid = false;
        } else {
            setFileError("");
        }

        return isValid;
    };

    const handleUploadClick = () => {
        setValidationTriggered(true); // Mark validation as attempted
        if (validateInputs()) {
            handleFileUpload(); // Proceed with upload if valid
        }
    };

    return (
        <Dialog
            open={openUploadDialog}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    bgcolor: "#f5f5f5",
                    py: 1.5,
                    px: 3,
                    borderBottom: "1px solid #e0e0e0",
                }}
            >
                <Box component="span">
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ fontWeight: 600 }}
                    >
                        Upload Form A
                    </Typography>
                </Box>
                <IconButton
                    onClick={handleClose}
                    size="small"
                    aria-label="Close dialog"
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3, mt: 1 }}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                        mt: 1,
                    }}
                >
                    <FormControl
                        fullWidth
                        variant="outlined"
                        error={!!typeError}
                    >
                        <InputLabel id="institution-type-label">
                            Institution Type
                        </InputLabel>
                        <Select
                            labelId="institution-type-label"
                            value={selectedInstitutionType}
                            onChange={(e) => {
                                setSelectedInstitutionType(e.target.value);
                                if (validationTriggered)
                                    setValidationTriggered(false); // Reset validation trigger
                            }}
                            label="Institution Type"
                            sx={{ bgcolor: "white" }}
                        >
                            <MenuItem value="">
                                <em>Select Type</em>
                            </MenuItem>
                            <MenuItem value="SUC">SUC</MenuItem>
                            <MenuItem value="LUC">LUC</MenuItem>
                            <MenuItem value="PHEI">PHEI</MenuItem>
                        </Select>
                        {typeError && validationTriggered && (
                            <Typography
                                variant="caption"
                                color="error"
                                sx={{ mt: 1 }}
                            >
                                {typeError}
                            </Typography>
                        )}
                    </FormControl>

                    <Box>
                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<UploadFileIcon />}
                            sx={{
                                borderColor: "#1976d2",
                                color: "#1976d2",
                                textTransform: "none",
                                fontWeight: 500,
                                px: 2,
                                py: 1,
                                "&:hover": {
                                    borderColor: "#115293",
                                    bgcolor: "rgba(25, 118, 210, 0.04)",
                                },
                            }}
                        >
                            Choose File
                            <input
                                type="file"
                                hidden
                                accept=".xlsx, .xls"
                                onChange={handleFileChange}
                            />
                        </Button>
                        {selectedFile && (
                            <Box
                                sx={{
                                    mt: 2,
                                    p: 1.5,
                                    bgcolor: "#f9f9f9",
                                    borderRadius: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    border: "1px solid #e0e0e0",
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{ color: "#555" }}
                                >
                                    {selectedFile.name}
                                </Typography>
                                <IconButton
                                    size="small"
                                    onClick={handleRemoveFile}
                                    aria-label="Remove selected file"
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        )}
                        {fileError && validationTriggered && (
                            <Typography
                                variant="caption"
                                color="error"
                                sx={{ mt: 1 }}
                            >
                                {fileError}
                            </Typography>
                        )}
                    </Box>
                </Box>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2 }}>
                <Button
                    onClick={handleClose}
                    variant="outlined"
                    sx={{
                        textTransform: "none",
                        color: "#555",
                        borderColor: "#ccc",
                        "&:hover": { borderColor: "#999" },
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleUploadClick}
                    variant="contained"
                    sx={{
                        textTransform: "none",
                        bgcolor: "#1976d2",
                        "&:hover": { bgcolor: "#115293" },
                        "&:disabled": {
                            bgcolor: "#b0bec5",
                            color: "#fff",
                        },
                    }}
                >
                    Upload
                </Button>
            </DialogActions>
        </Dialog>
    );
};

UploadDialog.propTypes = {
    openUploadDialog: PropTypes.bool.isRequired,
    setOpenUploadDialog: PropTypes.func.isRequired,
    selectedInstitutionType: PropTypes.string.isRequired,
    setSelectedInstitutionType: PropTypes.func.isRequired,
    selectedFile: PropTypes.shape({
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired, // Added for validation
        size: PropTypes.number.isRequired, // Added for validation
    }),
    setSelectedFile: PropTypes.func.isRequired,
    handleFileUpload: PropTypes.func.isRequired,
};

export default UploadDialog;
