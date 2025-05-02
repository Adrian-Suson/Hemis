/* eslint-disable react-hooks/exhaustive-deps */
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
import { useState, useEffect } from "react";
import axios from "axios";
import config from "../../../utils/config";
import { useTheme } from "@mui/material";

const UploadDialog = ({
    openUploadDialog,
    setOpenUploadDialog,
    selectedInstitutionType,
    setSelectedInstitutionType,
    selectedFile,
    setSelectedFile,
    handleFileUpload,
    selectedRegion,
    setSelectedRegion,
    selectedProvince,
    setSelectedProvince,
    selectedMunicipality,
    setSelectedMunicipality,
}) => {
    const [fileError, setFileError] = useState(""); // State for file validation errors
    const [typeError, setTypeError] = useState(""); // State for institution type error
    const [validationTriggered, setValidationTriggered] = useState(false); // Track if validation was attempted
    const [regions, setRegions] = useState([]); // State for regions
    const [provinces, setProvinces] = useState([]); // State for provinces
    const [municipalities, setMunicipalities] = useState([]); // State for municipalities

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
    const ACCEPTED_FILE_TYPES = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
        "application/vnd.ms-excel", // .xls
    ];

    const theme = useTheme();

    // Set default region id to "10" on mount if not already set
    useEffect(() => {
        if (!selectedRegion) {
            setSelectedRegion("10");
        }
    }, []);

    useEffect(() => {
        // Fetch all regions on mount
        const fetchRegions = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`${config.API_URL}/regions`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRegions(res.data);
            } catch {
                setRegions([]);
            }
        };
        fetchRegions();
    }, []);

    useEffect(() => {
        if (selectedRegion) {
            const fetchProvinces = async (regionId) => {
                try {
                    const token = localStorage.getItem("token");
                    const res = await axios.get(
                        `${config.API_URL}/provinces?region_id=${regionId}`,
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );
                    setProvinces(res.data);
                } catch {
                    setProvinces([]);
                }
            };
            fetchProvinces(selectedRegion);
        } else {
            setProvinces([]);
            setMunicipalities([]);
            setSelectedProvince("");
            setSelectedMunicipality("");
        }
    }, [selectedRegion]);

    useEffect(() => {
        if (selectedProvince) {
            const fetchMunicipalities = async (provinceId) => {
                try {
                    const token = localStorage.getItem("token");
                    const res = await axios.get(
                        `${config.API_URL}/municipalities?province_id=${provinceId}`,
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );
                    setMunicipalities(res.data);
                } catch {
                    setMunicipalities([]);
                }
            };
            fetchMunicipalities(selectedProvince);
        } else {
            setMunicipalities([]);
            setSelectedMunicipality("");
        }
    }, [selectedProvince]);

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

                    <FormControl fullWidth variant="outlined">
                        <InputLabel id="region-select-label">Region</InputLabel>
                        <Select
                            labelId="region-select-label"
                            value={selectedRegion}
                            onChange={(e) => setSelectedRegion(e.target.value)}
                            label="Region"
                            sx={{ bgcolor: "white" }}
                        >
                            <MenuItem value="">
                                <em>Select Region</em>
                            </MenuItem>
                            {regions.map((region) => (
                                <MenuItem key={region.id} value={region.id}>
                                    {region.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel id="province-select-label">
                            Province
                        </InputLabel>
                        <Select
                            labelId="province-select-label"
                            value={selectedProvince}
                            onChange={(e) =>
                                setSelectedProvince(e.target.value)
                            }
                            label="Province"
                            sx={{ bgcolor: "white" }}
                        >
                            <MenuItem value="">
                                <em>Select Province</em>
                            </MenuItem>
                            {provinces.map((province) => (
                                <MenuItem key={province.id} value={province.id}>
                                    {province.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel id="municipality-select-label">
                            Municipality
                        </InputLabel>
                        <Select
                            labelId="municipality-select-label"
                            value={selectedMunicipality}
                            onChange={(e) =>
                                setSelectedMunicipality(e.target.value)
                            }
                            label="Municipality"
                            sx={{ bgcolor: "white" }}
                        >
                            <MenuItem value="">
                                <em>Select Municipality</em>
                            </MenuItem>
                            {municipalities.map((municipality) => (
                                <MenuItem
                                    key={municipality.id}
                                    value={municipality.id}
                                >
                                    {municipality.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Box
                        onDrop={(e) => {
                            e.preventDefault();
                            if (
                                e.dataTransfer.files &&
                                e.dataTransfer.files[0]
                            ) {
                                setSelectedFile(e.dataTransfer.files[0]);
                            }
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        sx={{
                            p: 1.5,
                            border: `1px dashed ${theme.palette.primary.main}`,
                            borderRadius: 1.5,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                            cursor: "pointer",
                            bgcolor: "background.paper",
                        }}
                        onClick={() =>
                            document.getElementById("upload-input").click()
                        }
                    >
                        <UploadFileIcon color="primary" sx={{ fontSize: 28 }} />
                        <Typography>
                            Drag & drop file or click to browse
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Supported formats: .xlsx, .xls
                        </Typography>
                        <input
                            id="upload-input"
                            type="file"
                            hidden
                            accept=".xlsx, .xls"
                            onChange={handleFileChange}
                        />
                    </Box>
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
                            <Typography variant="body2" sx={{ color: "#555" }}>
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
    selectedRegion: PropTypes.string.isRequired,
    setSelectedRegion: PropTypes.func.isRequired,
    selectedProvince: PropTypes.string.isRequired,
    setSelectedProvince: PropTypes.func.isRequired,
    selectedMunicipality: PropTypes.string.isRequired,
    setSelectedMunicipality: PropTypes.func.isRequired,
};

export default UploadDialog;
