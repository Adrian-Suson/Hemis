/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from "react";
import { X, Loader2 } from "lucide-react";
import AlertComponent from "../../../Components/AlertComponent";
import axios from "axios";
import config from "../../../utils/config";
import PropTypes from "prop-types";
import FormInput from "../../../Components/FormInput"; // Adjust the path as needed
import clsx from "clsx";
import useActivityLog from "../../../Hooks/useActivityLog"; // Import the hook

// Constants
const SEX_OPTIONS = [
    { value: "", label: "Select Sex" },
    { value: "M", label: "Male" },
    { value: "F", label: "Female" },
];

const REQUIRED_FIELDS = [
    "student_id",
    "last_name",
    "first_name",
    "sex",
    "date_of_birth",
    "program_name",
];

// Form field configuration
const FORM_FIELDS = [
    {
        name: "student_id",
        label: "Student ID",
        type: "text",
        required: true,
        placeholder: "Enter student ID",
    },
    {
        name: "last_name",
        label: "Last Name",
        type: "text",
        required: true,
        placeholder: "Enter last name",
    },
    {
        name: "first_name",
        label: "First Name",
        type: "text",
        required: true,
        placeholder: "Enter first name",
    },
    {
        name: "middle_name",
        label: "Middle Name",
        type: "text",
        required: false,
        placeholder: "Enter middle name (optional)",
    },
    {
        name: "sex",
        label: "Sex",
        type: "select",
        required: true,
        options: SEX_OPTIONS,
    },
    {
        name: "date_of_birth",
        label: "Date of Birth",
        type: "date",
        required: true,
    },
    {
        name: "date_graduated",
        label: "Date Graduated",
        type: "date",
        required: false,
    },
    {
        name: "program_name",
        label: "Program Name",
        type: "text",
        required: true,
        placeholder: "Enter program name",
    },
    {
        name: "program_major",
        label: "Program Major",
        type: "text",
        required: false,
        placeholder: "Enter program major (optional)",
    },
    {
        name: "year_granted",
        label: "Year Granted",
        type: "number",
        required: false,
        placeholder: "Enter year granted",
        inputProps: { min: 1900, max: new Date().getFullYear() + 10 },
    },
    {
        name: "program_authority_to_operate_graduate",
        label: "Program Authority",
        type: "text",
        required: false,
        placeholder: "Enter program authority (optional)",
    },

];

const ManualGraduateDialog = ({
    open,
    onClose,
    institutionId,
    reportYear,
    onSuccess,
}) => {
    const initialFormData = {
        student_id: "",
        last_name: "",
        first_name: "",
        middle_name: "",
        sex: "",
        date_of_birth: "",
        date_graduated: "",
        program_name: "",
        program_major: "",
        program_authority_to_operate_graduate: "",
        year_granted: "",
    };

    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { createLog } = useActivityLog(); // Use the hook

    // Reset form when dialog opens/closes
    useEffect(() => {
        if (open) {
            setFormData(initialFormData);
            setErrors({});
            setIsSubmitting(false);
        }
    }, [open]);

    // Focus management for accessibility
    useEffect(() => {
        if (open) {
            const firstInput = document.getElementById("student_id");
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    }, [open]);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear error for the field when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    }, [errors]);

    const validateForm = useCallback(() => {
        const newErrors = {};

        // Check required fields
        REQUIRED_FIELDS.forEach((field) => {
            if (!formData[field] || formData[field].toString().trim() === "") {
                const fieldConfig = FORM_FIELDS.find((f) => f.name === field);
                newErrors[field] = `${fieldConfig?.label || field} is required`;
            }
        });

        // Validate year_granted if provided
        if (formData.year_granted) {
            const year = parseInt(formData.year_granted);
            const currentYear = new Date().getFullYear();
            if (isNaN(year) || year < 1900 || year > currentYear + 10) {
                newErrors.year_granted = `Year must be between 1900 and ${currentYear + 10}`;
            }
        }

        // Validate dates
        if (formData.date_of_birth) {
            const birthDate = new Date(formData.date_of_birth);
            const today = new Date();
            if (birthDate > today) {
                newErrors.date_of_birth = "Date of birth cannot be in the future";
            }
        }

        if (formData.date_graduated && formData.date_of_birth) {
            const graduationDate = new Date(formData.date_graduated);
            const birthDate = new Date(formData.date_of_birth);
            if (graduationDate <= birthDate) {
                newErrors.date_graduated = "Graduation date must be after birth date";
            }
        }

        return newErrors;
    }, [formData]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            // Focus first field with error
            const firstErrorField = Object.keys(validationErrors)[0];
            const errorElement = document.getElementById(firstErrorField);
            if (errorElement) {
                errorElement.focus();
            }
            return;
        }

        setIsSubmitting(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                AlertComponent.showAlert(
                    "Authentication token is missing. Please log in again.",
                    "error"
                );
                return;
            }

            const payload = {
                institution_id: institutionId,
                student_id: formData.student_id.trim(),
                last_name: formData.last_name.trim(),
                first_name: formData.first_name.trim(),
                middle_name: formData.middle_name.trim() || null,
                sex: formData.sex,
                date_of_birth: formData.date_of_birth || null,
                date_graduated: formData.date_graduated || null,
                program_name: formData.program_name.trim(),
                program_major: formData.program_major.trim() || null,
                program_authority_to_operate_graduate:
                    formData.program_authority_to_operate_graduate.trim() || null,
                year_granted: formData.year_granted
                    ? parseInt(formData.year_granted)
                    : null,
                report_year: reportYear,
            };

            const response = await axios.post(
                `${config.API_URL}/graduates`,
                [payload],
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            // Log the action
            await createLog({
                action: "Add Graduate",
                description: `Manually added graduate: ${formData.first_name} ${formData.last_name}`,
            });

            AlertComponent.showAlert(
                response.data.message || "Graduate added successfully!",

                "success"
            );

            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error adding graduate:", error);

            let errorMessage = "Failed to add graduate.";

            if (error.response?.status === 422 && error.response?.data?.errors) {
                const errors = error.response.data.errors;
                const errorDetails = Object.values(errors).flat().join("; ");
                errorMessage = `Validation failed: ${errorDetails}`;
            } else if (error.response?.status === 401) {
                errorMessage = "Authentication failed. Please log in again.";
            } else if (error.response?.status === 403) {
                errorMessage = "You don't have permission to perform this action.";
            } else if (error.response?.data?.message) {
                errorMessage = `Failed to add graduate: ${error.response.data.message}`;
            } else if (error.message) {
                errorMessage = `Failed to add graduate: ${error.message}`;
            }

            AlertComponent.showAlert(errorMessage, "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = useCallback(() => {
        if (!isSubmitting) {
            onClose();
        }
    }, [isSubmitting, onClose]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape" && open && !isSubmitting) {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [open, isSubmitting, onClose]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
        >
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
                <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4 sticky top-0 bg-white">
                    <h2 id="dialog-title" className="text-lg font-semibold text-gray-900">
                        Add Graduate
                    </h2>
                    <button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="text-gray-400 hover:text-gray-600 transition-colors duration-200 disabled:opacity-50"
                        aria-label="Close dialog"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {FORM_FIELDS.map((field) => (
                            <div
                                key={field.name}
                                className={clsx(
                                    field.name === "program_authority_to_operate_graduate"
                                        ? "md:col-span-2"
                                        : ""
                                )}
                            >
                                <FormInput
                                    id={field.name}
                                    name={field.name}
                                    label={field.label}
                                    type={field.type}
                                    value={formData[field.name]}
                                    onChange={handleInputChange}
                                    required={field.required}
                                    placeholder={field.placeholder}
                                    errorMessage={errors[field.name]}
                                    options={field.options}
                                    inputProps={field.inputProps}
                                    disabled={isSubmitting}
                                    size="default"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isSubmitting ? "Adding..." : "Add Graduate"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

ManualGraduateDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    institutionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    reportYear: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onSuccess: PropTypes.func.isRequired,
};

export default ManualGraduateDialog;
