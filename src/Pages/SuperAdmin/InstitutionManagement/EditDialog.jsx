/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import moment from "moment";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Typography,
    Grid,
    Divider,
    IconButton,
    Box,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from "@mui/material";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import useActivityLog from "../../../Hooks/useActivityLog";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import config from "../../../utils/config";

const EditDialog = ({
    open,
    onClose,
    institution,
    onEdit,
    setSnackbarOpen,
    setSnackbarMessage,
    setSnackbarSeverity,
    fetchInstitutions,
}) => {
    const { createLog } = useActivityLog();
    const [formData, setFormData] = useState({
        id: institution?.id || null,
        name: institution?.name || "",
        region: institution?.region || "",
        address_street: institution?.address_street || "",
        municipality_city: institution?.municipality_city || "",
        province: institution?.province || "",
        postal_code: institution?.postal_code || "",
        institutional_telephone: institution?.institutional_telephone || "",
        institutional_fax: institution?.institutional_fax || "",
        head_telephone: institution?.head_telephone || "",
        institutional_email: institution?.institutional_email || "",
        institutional_website: institution?.institutional_website || "",
        year_established: institution?.year_established || null,
        sec_registration: institution?.sec_registration || "",
        year_granted_approved: institution?.year_granted_approved || null,
        year_converted_college: institution?.year_converted_college || null,
        year_converted_university:
            institution?.year_converted_university || null,
        head_name: institution?.head_name || "",
        head_title: institution?.head_title || "",
        head_education: institution?.head_education || "",
        institution_type: institution?.institution_type || "",
    });
    const [errors, setErrors] = useState({});
    const [regions, setRegions] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [municipalities, setMunicipalities] = useState([]);

    useEffect(() => {
        if (open) {
            fetchRegions();
        }
    }, [open]);

    useEffect(() => {
        if (formData.region) {
            fetchProvinces(formData.region);
        } else {
            setProvinces([]);
            setMunicipalities([]);
            setFormData((prev) => ({
                ...prev,
                province: "",
                municipality_city: "",
            }));
        }
    }, [formData.region]);

    useEffect(() => {
        if (formData.province) {
            fetchMunicipalities(formData.province);
        } else {
            setMunicipalities([]);
            setFormData((prev) => ({ ...prev, municipality_city: "" }));
        }
    }, [formData.province]);

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

    const fetchProvinces = async (regionName) => {
        try {
            const token = localStorage.getItem("token");
            const regionObj = regions.find((r) => r.name === regionName);
            if (!regionObj) {
                setProvinces([]);
                return;
            }
            const res = await axios.get(
                `${config.API_URL}/provinces?region_id=${regionObj.id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setProvinces(res.data);
        } catch {
            setProvinces([]);
        }
    };

    const fetchMunicipalities = async (provinceName) => {
        try {
            const token = localStorage.getItem("token");
            const provinceObj = provinces.find((p) => p.name === provinceName);
            if (!provinceObj) {
                setMunicipalities([]);
                return;
            }
            const res = await axios.get(
                `${config.API_URL}/municipalities?province_id=${provinceObj.id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setMunicipalities(res.data);
        } catch {
            setMunicipalities([]);
        }
    };

    const showSnackbar = (message, severity) => {
        if (setSnackbarMessage && setSnackbarOpen && setSnackbarSeverity) {
            setSnackbarMessage(message);
            setSnackbarSeverity(severity);
            setSnackbarOpen(true);
        } else {
            console.log(`[Snackbar] ${severity}: ${message}`);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name?.trim()) {
            newErrors.name = "Institution name is required.";
        } else if (formData.name.length > 255) {
            newErrors.name = "Must be 255 characters or less.";
        }

        if (!formData.region?.trim()) {
            newErrors.region = "Region is required.";
        }

        if (!formData.province?.trim()) {
            newErrors.province = "Province is required.";
        }

        if (!formData.municipality_city?.trim()) {
            newErrors.municipality_city = "Municipality/City is required.";
        }

        if (!formData.id || isNaN(parseInt(formData.id, 10))) {
            newErrors.id = "Valid institution ID is required.";
        }

        if (formData.address_street && formData.address_street.length > 255) {
            newErrors.address_street = "Must be 255 characters or less.";
        }

        if (formData.postal_code && formData.postal_code.length > 10) {
            newErrors.postal_code = "Must be 10 characters or less.";
        }

        if (
            formData.institutional_email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.institutional_email)
        ) {
            newErrors.institutional_email = "Must be a valid email address.";
        }

        if (
            formData.institutional_website &&
            !/^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/.test(
                formData.institutional_website
            )
        ) {
            newErrors.institutional_website = "Must be a valid URL.";
        }

        const yearFields = [
            "year_established",
            "year_granted_approved",
            "year_converted_college",
            "year_converted_university",
        ];
        yearFields.forEach((field) => {
            if (formData[field]) {
                const year = parseInt(formData[field], 10);
                if (isNaN(year)) {
                    newErrors[field] = "Must be a valid year.";
                } else if (year < 1800 || year > new Date().getFullYear()) {
                    newErrors[
                        field
                    ] = `Must be between 1800 and ${new Date().getFullYear()}.`;
                }
            }
        });

        if (
            formData.institutional_telephone &&
            formData.institutional_telephone.length > 20
        ) {
            newErrors.institutional_telephone =
                "Must be 20 characters or less.";
        }

        if (
            formData.institutional_fax &&
            formData.institutional_fax.length > 20
        ) {
            newErrors.institutional_fax = "Must be 20 characters or less.";
        }

        if (formData.head_telephone && formData.head_telephone.length > 20) {
            newErrors.head_telephone = "Must be 20 characters or less.";
        }

        if (
            formData.sec_registration &&
            formData.sec_registration.length > 255
        ) {
            newErrors.sec_registration = "Must be 255 characters or less.";
        }

        if (formData.head_name && formData.head_name.length > 255) {
            newErrors.head_name = "Must be 255 characters or less.";
        }

        if (formData.head_title && formData.head_title.length > 255) {
            newErrors.head_title = "Must be 255 characters or less.";
        }

        if (formData.head_education && formData.head_education.length > 255) {
            newErrors.head_education = "Must be 255 characters or less.";
        }

        if (
            formData.institution_type &&
            !["SUC", "LUC", "Private"].includes(formData.institution_type)
        ) {
            newErrors.institution_type = "Must be SUC, LUC, or Private.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "region") {
            const regionObj = regions.find((r) => r.id === value);
            setFormData((prev) => ({
                ...prev,
                region: regionObj ? regionObj.name : "",
                province: "",
                municipality_city: "",
            }));
            if (regionObj) fetchProvinces(regionObj.name);
            else {
                setProvinces([]);
                setMunicipalities([]);
            }
        } else if (name === "province") {
            const provinceObj = provinces.find((p) => p.id === value);
            setFormData((prev) => ({
                ...prev,
                province: provinceObj ? provinceObj.name : "",
                municipality_city: "",
            }));
            if (provinceObj) fetchMunicipalities(provinceObj.name);
            else setMunicipalities([]);
        } else if (name === "municipality_city") {
            const muniObj = municipalities.find((m) => m.id === value);
            setFormData((prev) => ({
                ...prev,
                municipality_city: muniObj ? muniObj.name : "",
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleYearChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value ? value.year() : null,
        }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const handleCancel = () => {
        setFormData({
            id: institution.id,
            name: institution.name || "",
            region: institution.region || "",
            address_street: institution.address_street || "",
            municipality_city: institution.municipality_city || "",
            province: institution.province || "",
            postal_code: institution.postal_code || "",
            institutional_telephone: institution.institutional_telephone || "",
            institutional_fax: institution.institutional_fax || "",
            head_telephone: institution.head_telephone || "",
            institutional_email: institution.institutional_email || "",
            institutional_website: institution.institutional_website || "",
            year_established: institution.year_established || null,
            sec_registration: institution.sec_registration || "",
            year_granted_approved: institution.year_granted_approved || null,
            year_converted_college: institution.year_converted_college || null,
            year_converted_university:
                institution.year_converted_university || null,
            head_name: institution.head_name || "",
            head_title: institution.head_title || "",
            head_education: institution.head_education || "",
            institution_type: institution.institution_type || "",
        });
        setErrors({});
        setProvinces([]);
        setMunicipalities([]);
        onClose();
    };

    const handleUpdate = async () => {
        if (!validateForm()) {
            showSnackbar("Validation failed. Please check the form.", "error");
            return;
        }

        const token = localStorage.getItem("token");
        try {
            const payload = {
                name: formData.name || null,
                region: formData.region || null,
                address_street: formData.address_street || null,
                municipality_city: formData.municipality_city || null,
                province: formData.province || null,
                postal_code: formData.postal_code || null,
                institutional_telephone:
                    formData.institutional_telephone || null,
                institutional_fax: formData.institutional_fax || null,
                head_telephone: formData.head_telephone || null,
                institutional_email: formData.institutional_email || null,
                institutional_website: formData.institutional_website || null,
                year_established: formData.year_established
                    ? parseInt(formData.year_established, 10) || null
                    : null,
                sec_registration: formData.sec_registration || null,
                year_granted_approved: formData.year_granted_approved
                    ? parseInt(formData.year_granted_approved, 10) || null
                    : null,
                year_converted_college: formData.year_converted_college
                    ? parseInt(formData.year_converted_college, 10) || null
                    : null,
                year_converted_university: formData.year_converted_university
                    ? parseInt(formData.year_converted_university, 10) || null
                    : null,
                head_name: formData.head_name || null,
                head_title: formData.head_title || null,
                head_education: formData.head_education || null,
                institution_type: formData.institution_type || null,
            };

            console.log("[Update Institution] Sending data:", payload);

            const response = await axios.put(
                `${config.API_URL}/institutions/${formData.id}`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("[Update Institution] Server response:", response.data);

            await createLog({
                action: "updated_institution",
                description: `Updated institution: ${formData.name}`,
                modelType: "App\\Models\\Institution",
                modelId: formData.id,
                properties: {
                    name: formData.name,
                    institution_type: formData.institution_type,
                },
            });

            onEdit(response.data || payload);
            showSnackbar("Institution updated successfully!", "success");
            fetchInstitutions();
            onClose();
        } catch (error) {
            console.error(
                "[Update Institution] Error:",
                error.response?.data || error.message
            );
            let errorMessage =
                "Failed to update institution. Please try again.";
            if (error.response?.status === 422) {
                const validationErrors = error.response.data.errors;
                console.log(
                    "[Update Institution] Validation Errors:",
                    validationErrors
                );
                errorMessage =
                    "Validation failed: " +
                    Object.values(validationErrors).flat().join(", ");
                const mappedErrors = {};
                Object.keys(validationErrors).forEach((key) => {
                    const field = key.split(".").pop();
                    mappedErrors[field] = validationErrors[key][0];
                });
                setErrors(mappedErrors);
            }
            showSnackbar(errorMessage, "error");
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleCancel}
            fullWidth
            maxWidth="md"
            PaperProps={{
                sx: { borderRadius: 2 },
            }}
        >
            <DialogTitle
                sx={{
                    borderBottom: 1,
                    borderColor: "divider",
                    p: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Typography variant="h6" component="div">
                    Edit Institution
                </Typography>
                <IconButton
                    edge="end"
                    color="inherit"
                    onClick={handleCancel}
                    aria-label="close"
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ p: 3 }}>
                {/* Basic Information */}
                <Box sx={{ mb: 1 }}>
                    <Typography
                        variant="subtitle1"
                        gutterBottom
                        fontWeight="bold"
                        color="primary"
                    >
                        Basic Information
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item size={{ xs: 12 }}>
                            <TextField
                                name="name"
                                size="small"
                                label="Institution Name"
                                value={formData.name}
                                onChange={handleInputChange}
                                fullWidth
                                variant="outlined"
                                required
                                error={!!errors.name}
                                helperText={errors.name}
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, sm: 6 }}>
                            <TextField
                                name="sec_registration"
                                size="small"
                                label="SEC Registration"
                                value={formData.sec_registration}
                                onChange={handleInputChange}
                                fullWidth
                                variant="outlined"
                                error={!!errors.sec_registration}
                                helperText={errors.sec_registration}
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, sm: 6 }}>
                            <FormControl
                                fullWidth
                                variant="outlined"
                                size="small"
                                required
                                error={!!errors.institution_type}
                            >
                                <InputLabel id="institution-type-label">
                                    Institution Type
                                </InputLabel>
                                <Select
                                    labelId="institution-type-label"
                                    name="institution_type"
                                    value={formData.institution_type}
                                    onChange={handleInputChange}
                                    label="Institution Type"
                                    required
                                    error={!!errors.institution_type}
                                >
                                    <MenuItem value="">
                                        <em>Select Type</em>
                                    </MenuItem>
                                    <MenuItem value="SUC">SUC</MenuItem>
                                    <MenuItem value="LUC">LUC</MenuItem>
                                    <MenuItem value="Private">Private</MenuItem>
                                </Select>
                                {errors.institution_type && (
                                    <Typography variant="caption" color="error">
                                        {errors.institution_type}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box>

                <Divider sx={{ my: 1 }} />

                {/* Address Information */}
                <Box sx={{ mb: 1 }}>
                    <Typography
                        variant="subtitle1"
                        gutterBottom
                        fontWeight="bold"
                        color="primary"
                    >
                        Address Information
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item size={{ xs: 12 }}>
                            <TextField
                                name="address_street"
                                size="small"
                                label="Street Address"
                                value={formData.address_street}
                                onChange={handleInputChange}
                                fullWidth
                                variant="outlined"
                                error={!!errors.address_street}
                                helperText={errors.address_street}
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, sm: 3 }}>
                            <FormControl
                                fullWidth
                                size="small"
                                error={!!errors.region}
                            >
                                <InputLabel id="region-label">
                                    Region
                                </InputLabel>
                                <Select
                                    labelId="region-label"
                                    name="region"
                                    value={
                                        regions.find(
                                            (r) => r.name === formData.region
                                        )?.id || ""
                                    }
                                    onChange={handleInputChange}
                                    label="Region"
                                >
                                    <MenuItem value="">
                                        <em>Select Region</em>
                                    </MenuItem>
                                    {regions.map((region) => (
                                        <MenuItem
                                            key={region.id}
                                            value={region.id}
                                        >
                                            {region.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.region && (
                                    <Typography variant="caption" color="error">
                                        {errors.region}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item size={{ xs: 12, sm: 3 }}>
                            <FormControl
                                fullWidth
                                size="small"
                                error={!!errors.province}
                            >
                                <InputLabel id="province-label">
                                    Province
                                </InputLabel>
                                <Select
                                    labelId="province-label"
                                    name="province"
                                    value={
                                        provinces.find(
                                            (p) => p.name === formData.province
                                        )?.id || ""
                                    }
                                    onChange={handleInputChange}
                                    label="Province"
                                    disabled={!formData.region}
                                >
                                    <MenuItem value="">
                                        <em>Select Province</em>
                                    </MenuItem>
                                    {provinces.map((province) => (
                                        <MenuItem
                                            key={province.id}
                                            value={province.id}
                                        >
                                            {province.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.province && (
                                    <Typography variant="caption" color="error">
                                        {errors.province}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item size={{ xs: 12, sm: 3 }}>
                            <FormControl
                                fullWidth
                                size="small"
                                error={!!errors.municipality_city}
                            >
                                <InputLabel id="municipality-label">
                                    Municipality/City
                                </InputLabel>
                                <Select
                                    labelId="municipality-label"
                                    name="municipality_city"
                                    value={
                                        municipalities.find(
                                            (m) =>
                                                m.name ===
                                                formData.municipality_city
                                        )?.id || ""
                                    }
                                    onChange={handleInputChange}
                                    label="Municipality/City"
                                    disabled={!formData.province}
                                >
                                    <MenuItem value="">
                                        <em>Select Municipality/City</em>
                                    </MenuItem>
                                    {municipalities.map((m) => (
                                        <MenuItem key={m.id} value={m.id}>
                                            {m.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.municipality_city && (
                                    <Typography variant="caption" color="error">
                                        {errors.municipality_city}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item size={{ xs: 12, sm: 3 }}>
                            <TextField
                                name="postal_code"
                                size="small"
                                label="Postal Code"
                                value={formData.postal_code}
                                onChange={handleInputChange}
                                fullWidth
                                variant="outlined"
                                error={!!errors.postal_code}
                                helperText={errors.postal_code}
                            />
                        </Grid>
                    </Grid>
                </Box>

                <Divider sx={{ my: 1 }} />

                {/* Contact Information */}
                <Box sx={{ mb: 1 }}>
                    <Typography
                        variant="subtitle1"
                        gutterBottom
                        fontWeight="bold"
                        color="primary"
                    >
                        Contact Information
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item size={{ xs: 12, sm: 6 }}>
                            <TextField
                                name="institutional_telephone"
                                size="small"
                                label="Institutional Telephone"
                                value={formData.institutional_telephone}
                                onChange={handleInputChange}
                                fullWidth
                                variant="outlined"
                                error={!!errors.institutional_telephone}
                                helperText={errors.institutional_telephone}
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, sm: 6 }}>
                            <TextField
                                name="institutional_fax"
                                size="small"
                                label="Institutional Fax"
                                value={formData.institutional_fax}
                                onChange={handleInputChange}
                                fullWidth
                                variant="outlined"
                                error={!!errors.institutional_fax}
                                helperText={errors.institutional_fax}
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, sm: 6 }}>
                            <TextField
                                name="institutional_email"
                                size="small"
                                label="Institutional Email"
                                value={formData.institutional_email}
                                onChange={handleInputChange}
                                fullWidth
                                variant="outlined"
                                error={!!errors.institutional_email}
                                helperText={errors.institutional_email}
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, sm: 6 }}>
                            <TextField
                                name="institutional_website"
                                size="small"
                                label="Institutional Website"
                                value={formData.institutional_website}
                                onChange={handleInputChange}
                                fullWidth
                                variant="outlined"
                                error={!!errors.institutional_website}
                                helperText={errors.institutional_website}
                            />
                        </Grid>
                    </Grid>
                </Box>

                <Divider sx={{ my: 1 }} />

                {/* Head of Institution */}
                <Box sx={{ mb: 1 }}>
                    <Typography
                        variant="subtitle1"
                        gutterBottom
                        fontWeight="bold"
                        color="primary"
                    >
                        Head of Institution
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item size={{ xs: 12, sm: 6 }}>
                            <TextField
                                name="head_name"
                                size="small"
                                label="Head Name"
                                value={formData.head_name}
                                onChange={handleInputChange}
                                fullWidth
                                variant="outlined"
                                error={!!errors.head_name}
                                helperText={errors.head_name}
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, sm: 6 }}>
                            <TextField
                                name="head_telephone"
                                size="small"
                                label="Head Telephone"
                                value={formData.head_telephone}
                                onChange={handleInputChange}
                                fullWidth
                                variant="outlined"
                                error={!!errors.head_telephone}
                                helperText={errors.head_telephone}
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, sm: 6 }}>
                            <TextField
                                name="head_title"
                                size="small"
                                label="Head Title"
                                value={formData.head_title}
                                onChange={handleInputChange}
                                fullWidth
                                variant="outlined"
                                error={!!errors.head_title}
                                helperText={errors.head_title}
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, sm: 6 }}>
                            <TextField
                                name="head_education"
                                size="small"
                                label="Head Education"
                                value={formData.head_education}
                                onChange={handleInputChange}
                                fullWidth
                                variant="outlined"
                                error={!!errors.head_education}
                                helperText={errors.head_education}
                            />
                        </Grid>
                    </Grid>
                </Box>

                <Divider sx={{ my: 1 }} />

                {/* Historical Dates */}
                <Box>
                    <Typography
                        variant="subtitle1"
                        gutterBottom
                        fontWeight="bold"
                        color="primary"
                    >
                        Historical Dates
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <Grid container spacing={2}>
                            <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
                                <DatePicker
                                    views={["year"]}
                                    label="Year Established"
                                    value={
                                        formData.year_established
                                            ? moment().year(
                                                  formData.year_established
                                              )
                                            : null
                                    }
                                    onChange={(value) =>
                                        handleYearChange(
                                            "year_established",
                                            value
                                        )
                                    }
                                    maxDate={moment()}
                                    slotProps={{
                                        textField: {
                                            size: "small",
                                            fullWidth: true,
                                            error: !!errors.year_established,
                                            helperText: errors.year_established,
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
                                <DatePicker
                                    views={["year"]}
                                    label="Year Approved"
                                    value={
                                        formData.year_granted_approved
                                            ? moment().year(
                                                  formData.year_granted_approved
                                              )
                                            : null
                                    }
                                    onChange={(value) =>
                                        handleYearChange(
                                            "year_granted_approved",
                                            value
                                        )
                                    }
                                    maxDate={moment()}
                                    slotProps={{
                                        textField: {
                                            size: "small",
                                            fullWidth: true,
                                            error: !!errors.year_granted_approved,
                                            helperText:
                                                errors.year_granted_approved,
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
                                <DatePicker
                                    views={["year"]}
                                    label="Year → College"
                                    value={
                                        formData.year_converted_college
                                            ? moment().year(
                                                  formData.year_converted_college
                                              )
                                            : null
                                    }
                                    onChange={(value) =>
                                        handleYearChange(
                                            "year_converted_college",
                                            value
                                        )
                                    }
                                    maxDate={moment()}
                                    slotProps={{
                                        textField: {
                                            size: "small",
                                            fullWidth: true,
                                            error: !!errors.year_converted_college,
                                            helperText:
                                                errors.year_converted_college,
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
                                <DatePicker
                                    views={["year"]}
                                    label="Year → University"
                                    value={
                                        formData.year_converted_university
                                            ? moment().year(
                                                  formData.year_converted_university
                                              )
                                            : null
                                    }
                                    onChange={(value) =>
                                        handleYearChange(
                                            "year_converted_university",
                                            value
                                        )
                                    }
                                    maxDate={moment()}
                                    slotProps={{
                                        textField: {
                                            size: "small",
                                            fullWidth: true,
                                            error: !!errors.year_converted_university,
                                            helperText:
                                                errors.year_converted_university,
                                        },
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </LocalizationProvider>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
                <Button
                    onClick={handleCancel}
                    variant="outlined"
                    color="inherit"
                    startIcon={<CloseIcon />}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleUpdate}
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    disabled={!formData.name || !formData.region}
                >
                    Save Institution
                </Button>
            </DialogActions>
        </Dialog>
    );
};

EditDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    institution: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string,
        region: PropTypes.string,
        address_street: PropTypes.string,
        municipality_city: PropTypes.string,
        province: PropTypes.string,
        postal_code: PropTypes.string,
        institutional_telephone: PropTypes.string,
        institutional_fax: PropTypes.string,
        head_telephone: PropTypes.string,
        institutional_email: PropTypes.string,
        institutional_website: PropTypes.string,
        year_established: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        sec_registration: PropTypes.string,
        year_granted_approved: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        year_converted_college: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        year_converted_university: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        head_name: PropTypes.string,
        head_title: PropTypes.string,
        head_education: PropTypes.string,
        institution_type: PropTypes.string,
    }),
    onEdit: PropTypes.func.isRequired,
    setSnackbarOpen: PropTypes.func,
    setSnackbarMessage: PropTypes.func,
    setSnackbarSeverity: PropTypes.func,
    fetchInstitutions: PropTypes.func,
};

EditDialog.defaultProps = {
    institution: null,
    fetchInstitutions: () => {},
};

export default EditDialog;
