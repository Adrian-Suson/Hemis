import { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import Pagination from "../../../Components/Pagination";
import { Check, X, Edit3, Loader2, AlertCircle } from "lucide-react";
import axios from "axios";
import config from "../../../utils/config";
import AlertComponent from "../../../Components/AlertComponent";
import useActivityLog from "../../../Hooks/useActivityLog"; // Import the hook


const ROWS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

const SEX_OPTIONS = [
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

// Enhanced EditableCell component
const EditableCell = ({
    value,
    field,
    student_id,
    graduate_id,
    isEditing,
    onStartEdit,
    onSave,
    onCancel,
    isRequired,
    isSaving,
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
                    if (inputRef.current.select) {
                        inputRef.current.select();
                    }
                }
            }, 100);
        }
    }, [isEditing, value]);

    // Real-time validation
    const validateValue = useCallback((val) => {
        if (isRequired && (!val || val.toString().trim() === "")) {
            return `${field.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} is required`;
        }

        if (field === "year_granted" && val) {
            const year = parseInt(val);
            const currentYear = new Date().getFullYear();
            if (isNaN(year) || year < 1900 || year > currentYear) {
                return `Year must be between 1900 and ${currentYear}`;
            }
        }

        if (field === "sex" && val && !["M", "F"].includes(val)) {
            return "Please select a valid option";
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
    }, [field, isRequired]);

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
        onSave(field, editValue, graduate_id);
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

    // Render input based on field type
    const renderInput = () => {
        const baseClasses = `w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            error ? "border-red-500 bg-red-50" : "border-gray-300"
        }`;

        if (field === "sex") {
            return (
                <select
                    ref={inputRef}
                    value={editValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className={baseClasses}
                    disabled={isSaving}
                >
                    {SEX_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            );
        }

        const inputType =
            field === "year_granted"
                ? "number"
                : field === "date_of_birth" || field === "date_graduated"
                ? "date"
                : "text";

        const inputProps =
            field === "year_granted"
                ? {
                      min: 1900,
                      max: new Date().getFullYear(),
                  }
                : {};

        return (
            <input
                ref={inputRef}
                type={inputType}
                value={editValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className={baseClasses}
                disabled={isSaving}
                {...inputProps}
            />
        );
    };

    if (!isEditing) {
        return (
            <div
                className="group relative cursor-pointer hover:bg-blue-50 p-1 rounded transition-colors duration-150"
                onClick={() => onStartEdit(student_id, field, graduate_id)}
                title="Click to edit"
            >
                <span className="block truncate">
                    {value !== null && value !== undefined && value !== "" ? value : "-"}
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
            <div className="absolute top-full right-0 mt-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded shadow-sm">
                Enter to save • Esc to cancel
            </div>
        </div>
    );
};

const GraduatesTable = ({ graduates, onUpdate, institutionId, reportYear, onSuccess }) => {
    const [page, setPage] = useState(1);
        const { createLog } = useActivityLog(); // Use the hook
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [visibleColumns, setVisibleColumns] = useState(null);
    const [editingCell, setEditingCell] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // Initialize visible columns on first render
    useEffect(() => {
        setVisibleColumns({
            student_id: true,
            last_name: true,
            first_name: true,
            middle_name: true,
            sex: true,
            date_of_birth: true,
            date_graduated: true,
            program_name: true,
            program_major: true,
            program_authority_to_operate_graduate: true,
            year_granted: true,
        });
    }, []);

    // Column definitions
    const columns = [
        { field: "student_id", headerName: "Student ID", minWidth: 120 },
        { field: "last_name", headerName: "Last Name", minWidth: 150 },
        { field: "first_name", headerName: "First Name", minWidth: 150 },
        { field: "middle_name", headerName: "Middle Name", minWidth: 150 },
        { field: "sex", headerName: "Sex", minWidth: 100 },
        { field: "date_of_birth", headerName: "Date of Birth", minWidth: 130 },
        { field: "date_graduated", headerName: "Date Graduated", minWidth: 130 },
        { field: "program_name", headerName: "Program Name", minWidth: 290 },
        { field: "program_major", headerName: "Program Major", minWidth: 230 },
        {
            field: "program_authority_to_operate_graduate",
            headerName: "Program Authority",
            minWidth: 200,
        },
        {
            field: "year_granted",
            headerName: "Year Granted",
            minWidth: 150,
            isNumeric: true,
        },
    ].filter((col) => visibleColumns?.[col.field]);

    // Calculate pagination
    const paginatedGraduates =
        rowsPerPage === -1
            ? graduates
            : graduates.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    const totalPages =
        rowsPerPage === -1 ? 1 : Math.ceil(graduates.length / rowsPerPage);

    const startEditing = (student_id, field, graduate_id) => {
        if (isSaving) return;
        setEditingCell({ student_id, field, graduate_id });
    };

    const cancelEditing = () => {
        setEditingCell(null);
    };

    const saveEdit = async (field, value, graduate_id) => {
        setIsSaving(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                AlertComponent.showAlert(
                    "Authentication token is missing. Please log in again.",
                    "error"
                );
                return;
            }

            // Prepare payload
            const processedValue =
                field === "year_granted" && value
                    ? parseInt(value)
                    : value || null;

            const graduate = graduates.find((g) => g.id === graduate_id);
            if (!graduate) {
                throw new Error("Graduate not found");
            }
            console.log("Graduate found:", graduate);

            // Initialize payload with the updated field
            const payload = {
                [field]: processedValue,
            };

            // Only include other fields if they differ from the updated field
            if (field !== "institution_id") {
                payload.institution_id = institutionId || graduate.institution_id || "";
            }
            if (field !== "report_year") {
                payload.report_year = reportYear || graduate.report_year || new Date().getFullYear();
            }
            if (field !== "student_id") {
                payload.student_id = graduate.student_id;
            }
            if (field !== "last_name") {
                payload.last_name = graduate.last_name;
            }
            if (field !== "first_name") {
                payload.first_name = graduate.first_name;
            }
            if (field !== "sex") {
                payload.sex = graduate.sex;
            }
            if (field !== "date_of_birth") {
                payload.date_of_birth = graduate.date_of_birth;
            }
            if (field !== "program_name") {
                payload.program_name = graduate.program_name;
            }

            console.log("Payload sent:", payload);

            const response = await axios.patch(
                `${config.API_URL}/graduates/${graduate_id}`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            // Handle response
            if (response.data.message === "No changes made to graduate.") {
                AlertComponent.showAlert(
                    "No changes were made to the graduate record.",
                    "info"
                );
            } else {
                 // Log the edit action
            await createLog({
                action: "Edit Graduate",
                description: `Edited field "${field}" for graduate ID: ${graduate_id}`,
            });
                AlertComponent.showAlert(
                    response.data.message || "Graduate updated successfully!",
                    "success"
                );
                if (onSuccess) onSuccess();
            }

            if (onUpdate) onUpdate();
            setEditingCell(null);
        } catch (error) {
            console.error("Error updating graduate:", error);
            let errorMessage = "Failed to update graduate.";

            if (error.response?.status === 422 && error.response?.data?.errors) {
                const errors = error.response.data.errors;
                const errorDetails = Object.values(errors).flat().join("; ");
                errorMessage = `Validation failed: ${errorDetails}`;
            } else if (error.response?.status === 401) {
                errorMessage = "Authentication failed. Please log in again.";
            } else if (error.response?.status === 403) {
                errorMessage = "You don't have permission to perform this action.";
            } else if (error.response?.status === 404) {
                errorMessage = "Graduate not found. Please refresh the page.";
            } else if (error.response?.data?.message) {
                errorMessage = `Failed to update graduate: ${error.response.data.message}`;
            } else if (error.message) {
                errorMessage = `Failed to update graduate: ${error.message}`;
            }

            AlertComponent.showAlert(errorMessage, "error");
        } finally {
            setIsSaving(false);
        }
    };

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

    // Skip if columns are not ready yet
    if (!visibleColumns) {
        return (
            <div className="animate-pulse h-[50vh] w-full bg-gray-100 rounded-md"></div>
        );
    }

    return (
        <div className="mb-4">
            <div className="bg-white rounded-md shadow-sm border border-gray-200 flex flex-col h-[50vh] w-full overflow-hidden">
                {/* Table Header */}
                <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700">
                        Graduates{" "}
                        {editingCell && (
                            <span className="text-blue-600">(Editing)</span>
                        )}
                    </h3>
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
                <div className="flex-1 overflow-auto">
                    <table className="min-w-full divide-y divide-gray-200 table-fixed border-collapse">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                            <tr>
                                {columns.map((column) => (
                                    <th
                                        key={column.field}
                                        className={`px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 bg-gray-50 whitespace-nowrap sticky top-0 ${
                                            column.isNumeric
                                                ? "text-right"
                                                : "text-left"
                                        }`}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="truncate">
                                                {column.headerName}
                                                {REQUIRED_FIELDS.includes(
                                                    column.field
                                                ) && (
                                                    <span className="text-red-500 ml-1">
                                                        *
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedGraduates.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        className="px-3 py-6 text-sm text-center text-gray-500"
                                    >
                                        No graduates found
                                    </td>
                                </tr>
                            ) : (
                                paginatedGraduates.map((graduate, index) => (
                                    <tr
                                        key={graduate.student_id || index}
                                        className={`${
                                            index % 2 === 0
                                                ? "bg-white"
                                                : "bg-gray-50"
                                        } hover:bg-blue-50/30 transition-colors duration-150`}
                                    >
                                        {columns.map((column) => (
                                            <td
                                                key={`${graduate.student_id}-${column.field}`}
                                                className={`px-2 py-2 text-xs border-r border-gray-200 relative ${
                                                    column.isNumeric
                                                        ? "text-right"
                                                        : "text-left"
                                                } ${
                                                    editingCell?.student_id ===
                                                        graduate.student_id &&
                                                    editingCell?.field ===
                                                        column.field
                                                        ? "bg-blue-50 border-blue-200"
                                                        : ""
                                                }`}
                                            >
                                                <EditableCell
                                                    value={
                                                        graduate[column.field]
                                                    }
                                                    field={column.field}
                                                    student_id={
                                                        graduate.student_id
                                                    }
                                                    graduate_id={graduate.id}
                                                    isEditing={
                                                        editingCell?.student_id ===
                                                            graduate.student_id &&
                                                        editingCell?.field ===
                                                            column.field
                                                    }
                                                    onStartEdit={startEditing}
                                                    onSave={saveEdit}
                                                    onCancel={cancelEditing}
                                                    isRequired={REQUIRED_FIELDS.includes(
                                                        column.field
                                                    )}
                                                    isSaving={isSaving}
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="px-3 py-2 bg-gray-50 border-t border-gray-200 flex justify-end items-center sticky bottom-0 z-10">
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                        pageSize={rowsPerPage}
                        onPageSizeChange={(newSize) => {
                            setRowsPerPage(newSize);
                            setPage(1);
                        }}
                        pageSizeOptions={[...ROWS_PER_PAGE_OPTIONS, -1]}
                        showFirstLast={true}
                        showPageSize={true}
                        className="flex justify-end"
                    />
                </div>
            </div>
        </div>
    );
};

EditableCell.propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    field: PropTypes.string.isRequired,
    student_id: PropTypes.string.isRequired,
    graduate_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    isEditing: PropTypes.bool.isRequired,
    onStartEdit: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    isRequired: PropTypes.bool,
    isSaving: PropTypes.bool,
};

GraduatesTable.propTypes = {
    graduates: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
            institution_id: PropTypes.string,
            report_year: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
        })
    ).isRequired,
    onUpdate: PropTypes.func,
    institutionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    reportYear: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onSuccess: PropTypes.func,
};

export default GraduatesTable;
