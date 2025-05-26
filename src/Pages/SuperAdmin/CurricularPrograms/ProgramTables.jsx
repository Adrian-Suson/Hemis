/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import config from "../../../utils/config";
import { X, Check, Edit3, Loader2, AlertCircle } from "lucide-react";
import AlertComponent from "../../../Components/AlertComponent";
import Pagination from "../../../Components/Pagination";
import useActivityLog from "../../../Hooks/useActivityLog"; // Import the hook

// Enhanced EditableCell component for program tables
const EditableCell = ({
    value,
    field,
    programId,
    isEditing,
    onStartEdit,
    onSave,
    onCancel,
    isRequired,
    isSaving,
    columnType,
    fieldType = "text",
    validationRules = {},
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

        // Built-in validation for common field types
        if ((columnType === "number" || fieldType === "number") && val && isNaN(Number(val))) {
            return "Please enter a valid number";
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
        onSave(programId, field, editValue);
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

    // Get default select options for program fields using reference codes
    const getDefaultSelectOptions = () => {
        if (field === "aop_category") {
            return [
                { value: "", label: "Select..." },
                { value: "GP", label: "Government Permit" },
                { value: "GR", label: "Government Recognition" },
                { value: "BR", label: "Board Resolution" }
            ];
        }

        if (field === "is_thesis_dissertation_required") {
            return [
                { value: "", label: "Select..." },
                { value: "1", label: "Required" },
                { value: "2", label: "Optional" },
                { value: "3", label: "Not Required" }
            ];
        }

        if (field === "program_status") {
            return [
                { value: "", label: "Select..." },
                { value: "1", label: "Active" },
                { value: "2", label: "Phased Out" },
                { value: "3", label: "Abolished" }
            ];
        }

        if (field === "calendar_use_code") {
            return [
                { value: "", label: "Select..." },
                { value: "1", label: "Sem" },
                { value: "2", label: "Tri Sem" },
                { value: "3", label: "Quarter Sem" },
                { value: "4", label: "Distance Mode" }
            ];
        }

        if (fieldType === "boolean") {
            return [
                { value: "", label: "Select..." },
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" }
            ];
        }

        return [];
    };

    // Determine the actual field type based on field name and props
    const getActualFieldType = () => {
        if (field === "aop_category") return "select";
        if (field === "is_thesis_dissertation_required") return "select";
        if (field === "program_status") return "select";
        if (field === "calendar_use_code") return "select";
        if (fieldType === "boolean") return "select";
        if (columnType === "number" || fieldType === "number") return "number";
        return "text";
    };

    // Render input based on field type
    const renderInput = () => {
        const baseClasses = `w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            error ? "border-red-500 bg-red-50" : "border-gray-300"
        }`;

        const selectClasses = `w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none cursor-pointer ${
            error ? "border-red-500 bg-red-50" : "border-gray-300"
        }`;

        const actualFieldType = getActualFieldType();

        if (actualFieldType === "select") {
            const options = getDefaultSelectOptions();
            return (
                <div className="relative">
                    <select
                        ref={inputRef}
                        value={editValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        className={selectClasses}
                        disabled={isSaving}
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                            backgroundPosition: 'right 0.5rem center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: '1.5em 1.5em',
                            paddingRight: '2.5rem'
                        }}
                    >
                        {options.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                                className="bg-white text-gray-900 py-1"
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            );
        }

        const inputProps = {};

        if (actualFieldType === "number") {
            if (validationRules.min !== undefined) inputProps.min = validationRules.min;
            if (validationRules.max !== undefined) inputProps.max = validationRules.max;
        }

        return (
            <input
                ref={inputRef}
                type={actualFieldType}
                value={editValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className={baseClasses}
                disabled={isSaving}
                {...inputProps}
            />
        );
    };

    // Format display value
    const formatDisplayValue = (val) => {
        if (val === null || val === undefined || val === "") return "-";

        // Format display values based on field type and reference codes
        if (field === "aop_category") {
            const aopMap = {
                "GP": "GP no.",
                "GR": "GR no.",
                "BR": "BR no."
            };
            return aopMap[val] || val;
        }

        if (field === "is_thesis_dissertation_required") {
            const thesisMap = {
                "1": "Required",
                "2": "Optional",
                "3": "Not Required"
            };
            return thesisMap[val] || val;
        }

        if (field === "program_status") {
            const statusMap = {
                "1": "Active",
                "2": "Phased Out",
                "3": "Abolished"
            };
            return statusMap[val] || val;
        }

        if (field === "calendar_use_code") {
            const calendarMap = {
                "1": "Sem",
                "2": "Tri Sem",
                "3": "Quarter Sem",
                "4": "Distance Mode"
            };
            return calendarMap[val] || val;
        }

        if (columnType === "number" && !isNaN(Number(val))) {
            return Number(val).toLocaleString();
        }

        return val;
    };

    if (!isEditing) {
        return (
            <div
                className="group relative cursor-pointer hover:bg-blue-50 p-1 rounded transition-colors duration-150"
                onClick={() => onStartEdit(programId, field)}
                title="Click to edit"
            >
                <span className="block truncate">
                    {formatDisplayValue(value)}
                </span>
                <Edit3 className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150 absolute top-1 right-1" />
            </div>
        );
    }

    return (
        <div className="relative">
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

const ProgramTables = ({ programs, loading, fetchPrograms, summary }) => {
    const { createLog } = useActivityLog(); // Use the hook
    const { currentCount, totalCount, searchTerm } = summary || {};
    const [subTabValue, setSubTabValue] = useState(0);
    const [error, setError] = useState(null);
    const [pageSize, setPageSize] = useState(25);
    const [currentPage, setCurrentPage] = useState(1);
    const [editingCell, setEditingCell] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const savedTab = localStorage.getItem("selectedSubTab");
        if (savedTab !== null) {
            setSubTabValue(Number(savedTab));
        }
    }, []);

    const columnConfigs = useMemo(
        () => ({
            0: {
                // Program details columns
                columns: [
                    {
                        field: "program_name",
                        headerName: "Program Name",
                        minWidth: 250,
                        editable: true,
                        required: true,
                    },
                    {
                        field: "program_code",
                        headerName: "Program Code",
                        minWidth: 120,
                        editable: true,
                    },
                    {
                        field: "major_name",
                        headerName: "Major Name",
                        minWidth: 250,
                        editable: true,
                    },
                    {
                        field: "major_code",
                        headerName: "Major Code",
                        minWidth: 120,
                        editable: true,
                    },
                    {
                        field: "aop_category",
                        headerName: "Category",
                        minWidth: 120,
                        editable: true,
                        fieldType: "select",
                    },
                    {
                        field: "aop_serial",
                        headerName: "Serial",
                        minWidth: 100,
                        editable: true,
                    },
                    {
                        field: "aop_year",
                        headerName: "Year",
                        minWidth: 100,
                        editable: true,
                    },
                    {
                        field: "is_thesis_dissertation_required",
                        headerName: "Thesis/Dissertation Required",
                        minWidth: 180,
                        editable: true,
                        fieldType: "select",
                    },
                    {
                        field: "program_status",
                        headerName: "Program Status",
                        minWidth: 120,
                        editable: true,
                        fieldType: "select",
                    },
                    {
                        field: "calendar_use_code",
                        headerName: "Calendar Use Code",
                        minWidth: 140,
                        editable: true,
                        fieldType: "select",
                    },
                    {
                        field: "program_normal_length_in_years",
                        headerName: "Program Length (Years)",
                        minWidth: 150,
                        editable: true,
                        type: "number",
                        fieldType: "number",
                        validationRules: { min: 1, max: 10 },
                    },
                    {
                        field: "lab_units",
                        headerName: "Laboratory Units",
                        minWidth: 120,
                        editable: true,
                        type: "number",
                        fieldType: "number",
                        validationRules: { min: 0 },
                    },
                    {
                        field: "lecture_units",
                        headerName: "Lecture Units",
                        minWidth: 120,
                        editable: true,
                        type: "number",
                        fieldType: "number",
                        validationRules: { min: 0 },
                    },
                    {
                        field: "total_units",
                        headerName: "Total Units",
                        minWidth: 120,
                        editable: false,
                        type: "number",
                        fieldType: "number",
                    },
                    {
                        field: "tuition_per_unit",
                        headerName: "Tuition Per Unit",
                        minWidth: 120,
                        editable: true,
                        type: "number",
                        fieldType: "number",
                        validationRules: { min: 0 },
                    },
                    {
                        field: "program_fee",
                        headerName: "Program Fee",
                        minWidth: 120,
                        editable: true,
                        type: "number",
                        fieldType: "number",
                        validationRules: { min: 0 },
                    },
                ],
                // Column groupings for visual organization
                columnGroups: [
                    {
                        id: "program",
                        headerName: "Curricular Program",
                        columns: ["program_name", "program_code"],
                    },
                    {
                        id: "major",
                        headerName: "Major",
                        columns: ["major_name", "major_code"],
                    },
                    {
                        id: "authority",
                        headerName: "Authority to Offer Program",
                        columns: ["aop_category", "aop_serial", "aop_year"],
                    },
                    {
                        id: "status",
                        headerName: "",
                        columns: [
                            "is_thesis_dissertation_required",
                            "program_status",
                            "calendar_use_code",
                            "program_normal_length_in_years",
                        ],
                    },
                    {
                        id: "units",
                        headerName: "Program Units Excluding Thesis",
                        columns: ["lab_units", "lecture_units", "total_units"],
                    },
                    {
                        id: "financial",
                        headerName: "Financial Information",
                        columns: ["tuition_per_unit", "program_fee"],
                    },
                ],
            },
            1: {
                // Enrollment columns
                columns: [
                    {
                        field: "program_name",
                        headerName: "Program Name",
                        minWidth: 250,
                        editable: false,
                    },
                    {
                        field: "new_students_freshmen_male",
                        headerName: "Male",
                        minWidth: 120,
                        editable: true,
                        type: "number",
                        fieldType: "number",
                        validationRules: { min: 0 },
                    },
                    {
                        field: "new_students_freshmen_female",
                        headerName: "Female",
                        minWidth: 120,
                        editable: true,
                        type: "number",
                        fieldType: "number",
                        validationRules: { min: 0 },
                    },
                    {
                        field: "1st_year_male",
                        headerName: "Male",
                        minWidth: 120,
                        editable: true,
                        type: "number",
                        fieldType: "number",
                        validationRules: { min: 0 },
                    },
                    {
                        field: "1st_year_female",
                        headerName: "Female",
                        minWidth: 120,
                        editable: true,
                        type: "number",
                        fieldType: "number",
                        validationRules: { min: 0 },
                    },
                    {
                        field: "2nd_year_male",
                        headerName: "Male",
                        minWidth: 120,
                        editable: true,
                        type: "number",
                        fieldType: "number",
                        validationRules: { min: 0 },
                    },
                    {
                        field: "2nd_year_female",
                        headerName: "Female",
                        minWidth: 120,
                        editable: true,
                        type: "number",
                        fieldType: "number",
                        validationRules: { min: 0 },
                    },
                    {
                        field: "3rd_year_male",
                        headerName: "Male",
                        minWidth: 120,
                        editable: true,
                        type: "number",
                        fieldType: "number",
                        validationRules: { min: 0 },
                    },
                    {
                        field: "3rd_year_female",
                        headerName: "Female",
                        minWidth: 120,
                        editable: true,
                        type: "number",
                        fieldType: "number",
                        validationRules: { min: 0 },
                    },
                    {
                        field: "4th_year_male",
                        headerName: "Male",
                        minWidth: 120,
                        editable: true,
                        type: "number",
                        fieldType: "number",
                        validationRules: { min: 0 },
                    },
                    {
                        field: "4th_year_female",
                        headerName: "Female",
                        minWidth: 120,
                        editable: true,
                        type: "number",
                        fieldType: "number",
                        validationRules: { min: 0 },
                    },
                    {
                        field: "5th_year_male",
                        headerName: "Male",
                        minWidth: 120,
                        editable: true,
                        type: "number",
                        fieldType: "number",
                        validationRules: { min: 0 },
                    },
                    {
                        field: "5th_year_female",
                        headerName: "Female",
                        minWidth: 120,
                        editable: true,
                        type: "number",
                        fieldType: "number",
                        validationRules: { min: 0 },
                    },
                    {
                        field: "6th_year_male",
                        headerName: "Male",
                        minWidth: 120,
                        editable: true,
                        type: "number",
                        fieldType: "number",
                        validationRules: { min: 0 },
                    },
                    {
                        field: "6th_year_female",
                        headerName: "Female",
                        minWidth: 120,
                        editable: true,
                        type: "number",
                        fieldType: "number",
                        validationRules: { min: 0 },
                    },
                    {
                        field: "7th_year_male",
                        headerName: "Male",
                        minWidth: 120,
                        editable: true,
                        type: "number",
                        fieldType: "number",
                        validationRules: { min: 0 },
                    },
                    {
                        field: "7th_year_female",
                        headerName: "Female",
                        minWidth: 120,
                        editable: true,
                        type: "number",
                        fieldType: "number",
                        validationRules: { min: 0 },
                    },
                    {
                        field: "subtotal_male",
                        headerName: "Subtotal Male",
                        minWidth: 120,
                        editable: false,
                        type: "number",
                        fieldType: "number",
                    },
                    {
                        field: "subtotal_female",
                        headerName: "Subtotal Female",
                        minWidth: 120,
                        editable: false,
                        type: "number",
                        fieldType: "number",
                    },
                    {
                        field: "grand_total",
                        headerName: "Grand Total",
                        minWidth: 120,
                        editable: false,
                        type: "number",
                        fieldType: "number",
                    },
                ],
                columnGroups: [
                    {
                        id: "name",
                        headerName: "Program Name",
                        columns: ["program_name"],
                    },
                    {
                        id: "first_year",
                        headerName: "First Year",
                        columns: [
                            "new_students_freshmen_male",
                            "new_students_freshmen_female",
                            "1st_year_male",
                            "1st_year_female",
                        ],
                    },
                    {
                        id: "second_year",
                        headerName: "Second Year",
                        columns: ["2nd_year_male", "2nd_year_female"],
                    },
                    {
                        id: "third_year",
                        headerName: "Third Year",
                        columns: ["3rd_year_male", "3rd_year_female"],
                    },
                    {
                        id: "fourth_year",
                        headerName: "Fourth Year",
                        columns: ["4th_year_male", "4th_year_female"],
                    },
                    {
                        id: "fifth_year",
                        headerName: "Fifth Year",
                        columns: ["5th_year_male", "5th_year_female"],
                    },
                    {
                        id: "sixth_year",
                        headerName: "Sixth Year",
                        columns: ["6th_year_male", "6th_year_female"],
                    },
                    {
                        id: "seventh_year",
                        headerName: "Seventh Year",
                        columns: ["7th_year_male", "7th_year_female"],
                    },
                    {
                        id: "totals",
                        headerName: "Totals",
                        columns: [
                            "subtotal_male",
                            "subtotal_female",
                            "grand_total",
                        ],
                    },
                ],
            },
            2: {
                // Statistics columns
                columns: [
                    {
                        field: "program_name",
                        headerName: "Program Name",
                        minWidth: 250,
                        editable: false,
                    },
                    {
                        field: "lecture_units_actual",
                        headerName: "Lecture Units Actual",
                        minWidth: 150,
                        editable: true,
                        type: "number",
                        fieldType: "number",
                        validationRules: { min: 0 },
                    },
                    {
                        field: "laboratory_units_actual",
                        headerName: "Laboratory Units Actual",
                        minWidth: 150,
                        editable: true,
                        type: "number",
                        fieldType: "number",
                        validationRules: { min: 0 },
                    },
                    {
                        field: "total_units_actual",
                        headerName: "Total Units Actual",
                        minWidth: 150,
                        editable: false,
                        type: "number",
                        fieldType: "number",
                    },
                    {
                        field: "graduates_males",
                        headerName: "Graduates Male",
                        minWidth: 120,
                        editable: true,
                        type: "number",
                        fieldType: "number",
                        validationRules: { min: 0 },
                    },
                    {
                        field: "graduates_females",
                        headerName: "Graduates Female",
                        minWidth: 120,
                        editable: true,
                        type: "number",
                        fieldType: "number",
                        validationRules: { min: 0 },
                    },
                    {
                        field: "graduates_total",
                        headerName: "Graduates Total",
                        minWidth: 120,
                        editable: false,
                        type: "number",
                        fieldType: "number",
                    },
                    {
                        field: "externally_funded_merit_scholars",
                        headerName: "Externally Funded Scholars",
                        minWidth: 180,
                        editable: true,
                        type: "number",
                        fieldType: "number",
                        validationRules: { min: 0 },
                    },
                    {
                        field: "internally_funded_grantees",
                        headerName: "Internally Funded Grantees",
                        minWidth: 180,
                        editable: true,
                        type: "number",
                        fieldType: "number",
                        validationRules: { min: 0 },
                    },
                    {
                        field: "suc_funded_grantees",
                        headerName: "Funded Grantees",
                        minWidth: 180,
                        editable: true,
                        type: "number",
                        fieldType: "number",
                        validationRules: { min: 0 },
                    },
                ],
                columnGroups: [
                    {
                        id: "name",
                        headerName: "Program Name",
                        columns: ["program_name"],
                    },
                    {
                        id: "units",
                        headerName: "Units",
                        columns: [
                            "lecture_units_actual",
                            "laboratory_units_actual",
                            "total_units_actual",
                        ],
                    },
                    {
                        id: "graduates",
                        headerName: "Graduates",
                        columns: [
                            "graduates_males",
                            "graduates_females",
                            "graduates_total",
                        ],
                    },
                    {
                        id: "scholars",
                        headerName: "Scholars & Grantees",
                        columns: [
                            "externally_funded_merit_scholars",
                            "internally_funded_grantees",
                            "suc_funded_grantees",
                        ],
                    },
                ],
            },
        }),
        []
    );

    const startEditing = (programId, field) => {
        if (isSaving) return;
        setEditingCell({ programId, field });
    };

    const cancelEditing = () => {
        setEditingCell(null);
    };

    const handleCellEdit = useCallback(
        async (id, field, value) => {
            setIsSaving(true);

            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    AlertComponent.showAlert(
                        "Authentication token is missing. Please log in again.",
                        "error"
                    );
                    setIsSaving(false);
                    return;
                }

                console.log("Payload being sent:", { [field]: value });
                await axios.put(
                    `${config.API_URL}/curricular_programs/${id}`,
                    { [field]: value },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                fetchPrograms();

                // Log the edit action
                await createLog({
                    action: "Edit Program",
                    description: `Edited field "${field}" for program ID: ${id}`,
                });

                AlertComponent.showAlert(
                    "Program updated successfully",
                    "success"
                );
            } catch (error) {
                console.error("Error updating program:", error);
                AlertComponent.showAlert(
                    error.response?.data?.error ||
                        "Failed to update program. Changes have been reverted.",
                    "error"
                );
            } finally {
                setIsSaving(false);
                setEditingCell(null);
            }
        },
        [fetchPrograms]
    );

    // Handle global keyboard shortcuts
    useEffect(() => {
        const handleGlobalKeyDown = (e) => {
            if (e.key === "Escape" && editingCell) {
                cancelEditing();
            }
        };

        document.addEventListener("keydown", handleGlobalKeyDown);
        return () => document.removeEventListener("keydown", handleGlobalKeyDown);
    }, [editingCell]);

    // Get current page of data
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return programs.slice(startIndex, endIndex);
    }, [programs, currentPage, pageSize]);

    // Total pages calculation
    const totalPages = Math.ceil(programs.length / pageSize);

    // Get current columns and groups based on active tab
    const currentConfig = columnConfigs[subTabValue] || columnConfigs[0];

    // Get all column fields from current column groups
    const getColumnFieldsFromGroups = () => {
        const fields = [];
        currentConfig.columnGroups.forEach((group) => {
            fields.push(...group.columns);
        });
        return fields;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="mt-3 relative">
            {/* Error Alert */}
            {error && (
                <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-md flex justify-between items-center">
                    <p className="text-red-700 text-xs">{error}</p>
                    <button
                        onClick={() => setError(null)}
                        className="text-red-500 hover:text-red-700"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* Tabs */}
            <div className="flex border-b border-gray-300 mb-3 bg-white rounded-t-md overflow-hidden">
                {["Programs", "Enrollments", "Statistics"].map((tab, index) => (
                    <button
                        key={tab}
                        onClick={() => {
                            setSubTabValue(index);
                            localStorage.setItem("selectedSubTab", index);
                        }}
                        className={`flex-1 py-2 px-3 text-xs font-medium text-center transition-colors ${
                            subTabValue === index
                                ? "border-b-2 border-blue-600 text-blue-600 bg-blue-50/50"
                                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                        }`}
                        aria-selected={subTabValue === index}
                        role="tab"
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Summary */}
            <div className="flex justify-between items-center mb-2 flex-wrap gap-1">
                <p className="text-xs text-gray-600">
                    <span className="font-medium">{currentCount}</span> of{" "}
                    <span className="font-medium">{totalCount}</span> programs
                    {searchTerm && (
                        <span className="hidden sm:inline">
                            {" matching "}
                            <strong>&#34;{searchTerm}&#34;</strong>
                        </span>
                    )}
                    {editingCell && (
                        <span className="text-blue-600 ml-2">(Editing)</span>
                    )}
                </p>
                {editingCell && (
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                        <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs">
                            Enter
                        </kbd>{" "}
                        to save
                        <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs">
                            Esc
                        </kbd>{" "}
                        to cancel
                    </div>
                )}
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-3">
                <div className="overflow-auto" style={{ maxHeight: "50vh" }}>
                    <div className="inline-block min-w-full">
                        {/* Fixed Header Container */}
                        <div className="sticky top-0 z-30">
                            {/* Column Group Headers */}
                            <div className="flex border-b border-gray-300 bg-gray-50">
                                {currentConfig.columnGroups.map((group) => {
                                    const groupWidth = group.columns.reduce(
                                        (acc, field) => {
                                            const col = currentConfig.columns.find(
                                                (c) => c.field === field
                                            );
                                            return acc + (col?.minWidth || 80);
                                        },
                                        0
                                    );

                                    return (
                                        <div
                                            key={group.id}
                                            className="px-2 py-1.5 text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300 bg-gray-100 text-center flex items-center justify-center shadow-sm"
                                            style={{
                                                minWidth: groupWidth,
                                                width: groupWidth,
                                            }}
                                            title={group.headerName}
                                            role="columnheader"
                                        >
                                            <span className="truncate text-xs">
                                                {group.headerName}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Column Headers */}
                            <div className="flex bg-white border-b border-gray-300 shadow-sm">
                                {getColumnFieldsFromGroups().map((field) => {
                                    const column = currentConfig.columns.find(
                                        (col) => col.field === field
                                    );
                                    const isNumeric = column?.type === "number";

                                    return (
                                        <div
                                            key={field}
                                            className={`px-2 py-1.5 text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300 bg-gray-50 ${
                                                isNumeric ? "text-right" : "text-left"
                                            }`}
                                            style={{
                                                width: column?.minWidth || 80,
                                                minWidth: column?.minWidth || 80,
                                            }}
                                            title={column?.headerName || field}
                                            role="columnheader"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="truncate text-xs">
                                                    {column?.headerName || field}
                                                    {column?.required && (
                                                        <span className="text-red-500 ml-1">*</span>
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Table Body */}
                        <div role="rowgroup">
                            {paginatedData.length === 0 ? (
                                <div className="text-center py-12 text-gray-500 bg-gray-50/50 w-full" style={{ minHeight: "200px" }}>
                                    <div className="flex flex-col items-center justify-center h-full">
                                        <svg
                                            className="mx-auto h-10 w-10 text-gray-400 mb-2"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="1.5"
                                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                            />
                                        </svg>
                                        <p className="text-xs font-medium">No programs found matching your criteria</p>
                                    </div>
                                </div>
                            ) : (
                                paginatedData.map((row, rowIndex) => (
                                    <div
                                        key={row.id}
                                        className={`flex border-b border-gray-200 ${
                                            rowIndex % 2 === 0
                                                ? "bg-white"
                                                : "bg-gray-50/50"
                                        } hover:bg-blue-50/40 transition-colors duration-150`}
                                        role="row"
                                    >
                                        {getColumnFieldsFromGroups().map((field) => {
                                            const column = currentConfig.columns.find(
                                                (col) => col.field === field
                                            );
                                            const isNumeric = column?.type === "number";
                                            const isEditable = column?.editable;

                                            return (
                                                <div
                                                    key={`${row.id}-${field}`}
                                                    className={`px-2 py-1.5 text-xs border-r border-gray-200 ${
                                                        isNumeric ? "text-right" : "text-left"
                                                    } ${
                                                        editingCell?.programId === row.id &&
                                                        editingCell?.field === field
                                                            ? "bg-blue-50 border-blue-200"
                                                            : ""
                                                    }`}
                                                    style={{
                                                        width: column?.minWidth || 80,
                                                        minWidth: column?.minWidth || 80,
                                                    }}
                                                    role="cell"
                                                >
                                                    {isEditable ? (
                                                        <EditableCell
                                                            value={row[field]}
                                                            field={field}
                                                            programId={row.id}
                                                            isEditing={
                                                                editingCell?.programId === row.id &&
                                                                editingCell?.field === field
                                                            }
                                                            onStartEdit={startEditing}
                                                            onSave={handleCellEdit}
                                                            onCancel={cancelEditing}
                                                            isRequired={column.required}
                                                            isSaving={isSaving}
                                                            columnType={column.type}
                                                            fieldType={column.fieldType}
                                                            validationRules={column.validationRules}
                                                        />
                                                    ) : (
                                                        <div className="truncate">
                                                            {row[field] !== undefined && row[field] !== null && row[field] !== ""
                                                                ? isNumeric
                                                                    ? Number(row[field]).toLocaleString()
                                                                    : row[field]
                                                                : "-"}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-end my-3">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    pageSize={pageSize}
                    onPageSizeChange={setPageSize}
                    pageSizeOptions={[10, 25, 50, 100]}
                    showFirstLast={true}
                    showPageSize={true}
                />
            </div>
        </div>
    );
};

EditableCell.propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    field: PropTypes.string.isRequired,
    programId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    isEditing: PropTypes.bool.isRequired,
    onStartEdit: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    isRequired: PropTypes.bool,
    isSaving: PropTypes.bool,
    columnType: PropTypes.string,
    fieldType: PropTypes.string,
    validationRules: PropTypes.object,
};

ProgramTables.propTypes = {
    programs: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            program_name: PropTypes.string.isRequired,
        })
    ).isRequired,
    loading: PropTypes.bool.isRequired,
    fetchPrograms: PropTypes.func,
    summary: PropTypes.shape({
        currentCount: PropTypes.number,
        totalCount: PropTypes.number,
        searchTerm: PropTypes.string,
    }),
};

export default ProgramTables;
