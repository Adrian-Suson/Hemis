import PropTypes from "prop-types";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";

const GraduatesUploadDialog = ({ open, onClose }) => {
    const handleUpload = () => {
        // Logic for uploading graduates data
        console.log("Uploading graduates data...");
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Upload Graduates Data</DialogTitle>
            <DialogContent>
                <p>Upload your graduates data file here.</p>
                {/* Add file input or drag-and-drop area */}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">
                    Cancel
                </Button>
                <Button
                    onClick={handleUpload}
                    variant="contained"
                    color="primary"
                >
                    Upload
                </Button>
            </DialogActions>
        </Dialog>
    );
};

GraduatesUploadDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default GraduatesUploadDialog;
