import { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { Check, X, Edit3, Loader2, AlertCircle } from "lucide-react";

const EditableCell = ({
    value,
    field,
    recordId,
    isEditing,
    onStartEdit,
    onSave,
    onCancel,
    isRequired = false,
    isSaving = false,
    columnType,
    fieldType = "text", // "text", "number", "select", "boolean", "date"
    selectOptions = [],
    validationRules = {},
    placeholder = "",
    disabled = false,
    className = "",
    cellClassName = "",
    inputClassName = "",
}) => {
    const [editValue, setEditValue] = useState("");
    const [error, setError] = useState("");
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const inputRef = useRef(null);

    // Initialize edit value when editing starts
    useEffect(() => {
        if (isEditing) {
            const initialValue = value || "";
            setEditValue(initialValue);
            setError("");
            setHasUnsavedChanges(false);

            // Focus and select text after a brief delay
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                    if (inputRef.current.select && fieldType !== "select") {
                        inputRef.current.select();
                    }
                }
            }, 100);
        }
    }, [isEditing, value, fieldType]);

    // Real-time validation
    const validateValue = useCallback((val) => {
        if (isRequired && (!val || val.toString().trim() === "")) {
            return `${field.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} is required`;
        }

        // Custom validation rules
        if (validationRules.min !== undefined && val && Number(val) < validationRules.min) {
            return `Value must be at least ${validationRules.min}`;
        }

        if (validationRules.max !== undefined && val && Number(val) > validationRules.max) {
            return `Value must be at most ${validationRules.max}`;
        }

        if (validationRules.pattern && val && !validationRules.pattern.test(val)) {
            return validationRules.message || "Invalid format";
        }

        // Built-in validation for common field types
        if ((columnType === "number" || fieldType === "number") && val && isNaN(Number(val))) {
            return "Please enter a valid number";
        }

        if (field === "year_granted" && val) {
            const year = parseInt(val);
            const currentYear = new Date().getFullYear();
            if (isNaN(year) || year < 1900 || year > currentYear) {
                return `Year must be between 1900 and ${currentYear}`;
            }
        }

        if (field === "annual_basic_salary" && val) {
            const salary = parseFloat(val);
            if (salary < 0) {
                return "Salary cannot be negative";
            }
        }

        if (field === "full_time_equivalent" && val) {
            const fte = parseFloat(val);
            if (fte < 0 || fte > 1) {
                return "FTE must be between 0 and 1";
            }
        }

        if (field === "date_of_birth" && val) {
            const birthDate = new Date(val);
            const today = new Date();
            if (birthDate > today) {
                return "Date of birth cannot be in the future";
            }
        }

        if (field === "date_graduated" && val) {
            const graduationDate = new Date(val);
            const today = new Date();
            if (graduationDate > today) {
                return "Graduation date cannot be in the future";
            }
        }

        return "";
    }, [field, isRequired, columnType, fieldType, validationRules]);

    // Handle input change with validation
    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setEditValue(newValue);
        setHasUnsavedChanges(newValue !== (value || ""));

        // Real-time validation
        const validationError = validateValue(newValue);
        setError(validationError);
    };

    // Handle keyboard shortcuts
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSave();
        } else if (e.key === "Escape") {
            e.preventDefault();
            handleCancel();
        }
    };

    // Handle save
    const handleSave = () => {
        const validationError = validateValue(editValue);
        if (validationError) {
            setError(validationError);
            return;
        }
        onSave(recordId, field, editValue);
    };

    // Handle cancel with unsaved changes confirmation
    const handleCancel = () => {
        if (hasUnsavedChanges) {
            if (window.confirm("You have unsaved changes. Are you sure you want to cancel?")) {
                onCancel();
            }
        } else {
            onCancel();
        }
    };

    // Get default select options for common fields
    const getDefaultSelectOptions = () => {
        if (field === "sex" || field === "gender") {
            return [
                { value: "", label: "Select..." },
                { value: "M", label: "Male" },
                { value: "F", label: "Female" },
                { value: "Other", label: "Other" }
            ];
        }

        if (field === "is_tenured" || field === "on_leave_without_pay" || fieldType === "boolean") {
            return [
                { value: "", label: "Select..." },
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" }
            ];
        }

        return selectOptions;
    };

    // Determine the actual field type based on field name and props
    const getActualFieldType = () => {
        if (selectOptions.length > 0 || fieldType === "select") return "select";
        if (field === "sex" || field === "gender") return "select";
        if (field === "is_tenured" || field === "on_leave_without_pay") return "select";
        if (fieldType === "boolean") return "select";
        if (fieldType === "date" || field.includes("date")) return "date";
        if (columnType === "number" || fieldType === "number") return "number";
        return "text";
    };

    // Render input based on field type
    const renderInput = () => {
        const baseClasses = `w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            error ? "border-red-500 bg-red-50" : "border-gray-300"
        } ${inputClassName}`;

        const actualFieldType = getActualFieldType();

        if (actualFieldType === "select") {
            const options = getDefaultSelectOptions();
            return (
                <select
                    ref={inputRef}
                    value={editValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className={baseClasses}
                    disabled={isSaving || disabled}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            );
        }

        const inputProps = {};

        if (actualFieldType === "number") {
            inputProps.step = field.includes("salary") ? "0.01" : "any";
            if (field === "full_time_equivalent") {
                inputProps.min = "0";
                inputProps.max = "1";
            }
            if (validationRules.min !== undefined) inputProps.min = validationRules.min;
            if (validationRules.max !== undefined) inputProps.max = validationRules.max;
        }

        if (actualFieldType === "date") {
            if (field === "year_granted") {
                inputProps.min = "1900";
                inputProps.max = new Date().getFullYear().toString();
            }
        }

        return (
            <input
                ref={inputRef}
                type={actualFieldType}
                value={editValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className={baseClasses}
                disabled={isSaving || disabled}
                placeholder={placeholder}
                {...inputProps}
            />
        );
    };

    // Format display value
    const formatDisplayValue = (val) => {
        if (val === null || val === undefined || val === "") return "-";

        if (columnType === "number" && !isNaN(Number(val))) {
            return Number(val).toLocaleString();
        }

        return val;
    };

    if (!isEditing) {
        return (
            <div
                className={`group relative cursor-pointer hover:bg-blue-50 p-1 rounded transition-colors duration-150 ${cellClassName} ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
                onClick={() => !disabled && onStartEdit(recordId, field)}
                title={disabled ? "Editing disabled" : "Click to edit"}
            >
                <span className="block truncate">
                    {formatDisplayValue(value)}
                </span>
                {!disabled && (
                    <Edit3 className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150 absolute top-1 right-1" />
                )}
            </div>
        );
    }

    return (
        <div className={`relative ${className}`}>
            {/* Input Container */}
            <div className="flex items-center gap-1">
                <div className="flex-1 relative">
                    {renderInput()}
                    {error && (
                        <div className="absolute top-full left-0 mt-1 p-2 bg-red-100 border border-red-300 rounded text-xs text-red-700 shadow-lg z-50 min-w-max max-w-xs">
                            <div className="flex items-center gap-1">
                                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={handleSave}
                        disabled={!!error || isSaving}
                        className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Save (Enter)"
                    >
                        {isSaving ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                            <Check className="w-3 h-3" />
                        )}
                    </button>
                    <button
                        onClick={handleCancel}
                        disabled={isSaving}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors duration-150 disabled:opacity-50"
                        title="Cancel (Esc)"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
            </div>

            {/* Keyboard shortcuts hint */}
            <div className="absolute top-full right-0 mt-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded shadow-sm z-40">
                Enter to save • Esc to cancel
            </div>
        </div>
    );
};

EditableCell.propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    field: PropTypes.string.isRequired,
    recordId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    isEditing: PropTypes.bool.isRequired,
    onStartEdit: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    isRequired: PropTypes.bool,
    isSaving: PropTypes.bool,
    columnType: PropTypes.string,
    fieldType: PropTypes.oneOf(["text", "number", "select", "boolean", "date"]),
    selectOptions: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            label: PropTypes.string.isRequired,
        })
    ),
    validationRules: PropTypes.shape({
        min: PropTypes.number,
        max: PropTypes.number,
        pattern: PropTypes.instanceOf(RegExp),
        message: PropTypes.string,
    }),
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    cellClassName: PropTypes.string,
    inputClassName: PropTypes.string,
};

export default EditableCell;
