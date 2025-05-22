import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import config from "../../../utils/config";
import { ChevronDown, Filter, X, Search, Check, Edit3, Loader2, AlertCircle } from "lucide-react";
import Pagination from "../../../Components/Pagination";
import FilterPopover from "../../../Components/FilterPopover";
import AlertComponent from "../../../Components/AlertComponent";

// Enhanced EditableCell component integrated directly
const EditableCell = ({
    value,
    field,
    profileId,
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
        onSave(profileId, field, editValue);
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

    // Get default select options for common fields using reference codes
    const getDefaultSelectOptions = () => {
        if (field === "generic_faculty_rank") {
            return [
                { value: "", label: "Select..." },
                { value: "20", label: "INSTRUCTOR" },
                { value: "30", label: "ASSISTANT PROFESSOR" },
                { value: "40", label: "ASSOCIATE PROFESSOR" },
                { value: "50", label: "FULL PROFESSOR (including UNIVERSITY PROFESSOR)" },
                { value: "9", label: "TEACHING FELLOW OR TEACHING ASSOCIATE" },
                { value: "11", label: "LECTURER, SENIOR LECTURER, PROFESSORIAL LECTURER" },
                { value: "12", label: "PROFESSOR EMERITUS" },
                { value: "13", label: "VISITING PROFESSOR (WHATEVER THE ACTUAL RANK)" },
                { value: "14", label: "ADJUNCT OR AFFILIATE FACULTY" },
                { value: "90", label: "OTHERS" }
            ];
        }

        if (field === "is_tenured") {
            return [
                { value: "", label: "Select..." },
                { value: "1", label: "Faculty member is tenured" },
                { value: "2", label: "Faculty member has his own plantilla item but is NOT TENURED" },
                { value: "3", label: "Faculty member has no plantilla item" },
                { value: "4", label: "No information on the matter" }
            ];
        }

        if (field === "ssl_salary_grade") {
            const options = [
                { value: "", label: "Select..." },
                { value: "90", label: "No salary grade (part-time, lecturer, professor emeritus, adjunct or affiliate faculty)" },
                { value: "99", label: "No information on the matter" }
            ];
            // Add salary grades 1-33
            for (let i = 1; i <= 33; i++) {
                options.splice(-2, 0, { value: i.toString(), label: `Salary Grade ${i}` });
            }
            return options;
        }

        if (field === "annual_basic_salary") {
            return [
                { value: "", label: "Select..." },
                { value: "1", label: "60,000 below" },
                { value: "2", label: "60,000 - 69,999" },
                { value: "3", label: "70,000 - 79,999" },
                { value: "4", label: "80,000 - 89,999" },
                { value: "5", label: "90,000 - 99,999" },
                { value: "6", label: "100,000 - 149,999" },
                { value: "7", label: "150,000 - 249,999" },
                { value: "8", label: "250,000 - 499,999" },
                { value: "9", label: "500,000 - UP" }
            ];
        }

        if (field === "on_leave_without_pay") {
            return [
                { value: "", label: "Select..." },
                { value: "1", label: "The faculty member is on OFFICIAL LEAVE WITHOUT PAY" },
                { value: "2", label: "The faculty member is in ACTIVE DUTY OR ON OFFICIAL LEAVE WITH PAY" },
                { value: "3", label: "No information on the matter" }
            ];
        }

        if (field === "full_time_equivalent") {
            return [
                { value: "", label: "Select..." },
                { value: "1", label: "FTEF = 1.00" },
                { value: "2", label: "FTEF = 0.50" },
                { value: "3", label: "FTEF = 0.250" }
            ];
        }

        if (field === "gender") {
            return [
                { value: "", label: "Select..." },
                { value: "1", label: "Male" },
                { value: "2", label: "Female" }
            ];
        }

        if (field === "highest_degree_attained") {
            return [
                { value: "", label: "Select..." },
                { value: "000", label: "No formal education at all" },
                { value: "101", label: "Partial elementary schooling but did not complete Grade 4" },
                { value: "102", label: "Completed Grade 4 but did not graduate from elementary school" },
                { value: "103", label: "Completed Elementary School" },
                { value: "201", label: "Partial completion of High School" },
                { value: "202", label: "Secondary school graduate or equivalent" },
                { value: "301", label: "Partial completion of High School" },
                { value: "302", label: "Completed Tech/Voch" },
                { value: "401", label: "Partial completion of pre-baccalaureate certificate, diploma or associateship" },
                { value: "402", label: "Completed pre-bacc certificate, diploma or associateship" },
                { value: "501", label: "Completed Year 1 of baccalaureate level or equivalent" },
                { value: "502", label: "Completed Year 2 of baccalaureate level or equivalent" },
                { value: "503", label: "Completed Year 3 of baccalaureate level or equivalent" },
                { value: "504", label: "Completed Year 4 of baccalaureate level or equivalent" },
                { value: "505", label: "Completed Year 5 of baccalaureate level or equivalent" },
                { value: "506", label: "Completed Year 6 of baccalaureate level or equivalent" },
                { value: "507", label: "Completed a baccalaureate degree (including DVM, DDM, D Opt)" },
                { value: "601", label: "Partial Completion of postgraduate certificate or diploma program" },
                { value: "602", label: "Completed post-grad certificate or diploma program" },
                { value: "701", label: "Completed Year 1 of MD or LLB (or equivalent)" },
                { value: "702", label: "Completed Year 2 of MD or LLB (or equivalent)" },
                { value: "703", label: "Completed Year 3 of MD or LLB (or equivalent)" },
                { value: "704", label: "Completed Year 4 of MD or LLB (or equivalent)" },
                { value: "705", label: "Completed MD or LLB (or equivalent)" },
                { value: "801", label: "Partial completion of masters degree" },
                { value: "802", label: "Completed all masters requirements except masters thesis (or equivalent)" },
                { value: "803", label: "Completed masters degree or equivalent" },
                { value: "901", label: "Partial completion of doctorate degree (or equivalent)" },
                { value: "902", label: "Completed all doctorate requirements except dissertation (or equivalent)" },
                { value: "903", label: "Completed doctorate degree (or equivalent)" }
            ];
        }

        if (field === "pursuing_next_degree") {
            return [
                { value: "", label: "Select..." },
                { value: "1", label: "Faculty has already completed doctorate degree in the field where he is teaching" },
                { value: "2", label: "Masters degree holder with some PhD units actively pursuing doctorate degree in the discipline where he is teaching" },
                { value: "3", label: "Masters degree holder with some PhD units in the discipline where he is teaching but no longer actively pursuing a PhD" },
                { value: "4", label: "Masters degree holder with no PhD units in the discipline where he is teaching" },
                { value: "5", label: "Bachelors degree holder with some masters units in the discipline where he is teaching actively pursuing masters degree" },
                { value: "6", label: "Bachelors degree holder with some masters units in the discipline where he is teaching but no longer in active pursuit of masters degree" },
                { value: "7", label: "Bachelors degree holder with no masters units in the discipline where he is teaching" },
                { value: "8", label: "Not a faculty member" },
                { value: "9", label: "No information on the matter" }
            ];
        }

        if (field === "masters_with_thesis") {
            return [
                { value: "", label: "Select..." },
                { value: "1", label: "YES. IN OBTAINING MASTERS DEGREE, THE FACULTY MEMBER WROTE A THESIS" },
                { value: "2", label: "NO. IN OBTAINING HIS MASTERS, FACULTY MEMBER DID NOT WRITE A THESIS" },
                { value: "3", label: "NO INFORMATION ON THE MATTER" }
            ];
        }

        if (field === "doctorate_with_dissertation") {
            return [
                { value: "", label: "Select..." },
                { value: "1", label: "YES. IN OBTAINING DOCTORATE, THE FACULTY MEMBER WROTE A DISSERTATION" },
                { value: "2", label: "NO. IN OBTAINING DOCTORATE, FACULTY MEMBER DID NOT WRITE DISSERTATION" },
                { value: "3", label: "NO INFORMATION ON THE MATTER" }
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
        if (field === "generic_faculty_rank") return "select";
        if (field === "is_tenured") return "select";
        if (field === "ssl_salary_grade") return "select";
        if (field === "annual_basic_salary") return "select";
        if (field === "on_leave_without_pay") return "select";
        if (field === "full_time_equivalent") return "select";
        if (field === "gender") return "select";
        if (field === "highest_degree_attained") return "select";
        if (field === "pursuing_next_degree") return "select";
        if (field === "masters_with_thesis") return "select";
        if (field === "doctorate_with_dissertation") return "select";
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
            inputProps.step = field.includes("salary") ? "0.01" : "any";
            if (field === "full_time_equivalent") {
                inputProps.min = "0";
                inputProps.max = "1";
            }
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
        if (field === "generic_faculty_rank") {
            const rankMap = {
                "20": "INSTRUCTOR",
                "30": "ASSISTANT PROFESSOR",
                "40": "ASSOCIATE PROFESSOR",
                "50": "FULL PROFESSOR",
                "9": "TEACHING FELLOW OR TEACHING ASSOCIATE",
                "11": "LECTURER, SENIOR LECTURER, PROFESSORIAL LECTURER",
                "12": "PROFESSOR EMERITUS",
                "13": "VISITING PROFESSOR",
                "14": "ADJUNCT OR AFFILIATE FACULTY",
                "90": "OTHERS"
            };
            return rankMap[val] || val;
        }

        if (field === "is_tenured") {
            const tenureMap = {
                "1": "Tenured",
                "2": "Not Tenured (has plantilla)",
                "3": "No plantilla item",
                "4": "No information"
            };
            return tenureMap[val] || val;
        }

        if (field === "ssl_salary_grade") {
            if (val === "90") return "No salary grade (part-time)";
            if (val === "99") return "No information";
            if (val >= "1" && val <= "33") return `Salary Grade ${val}`;
            return val;
        }

        if (field === "annual_basic_salary") {
            const salaryMap = {
                "1": "60,000 below",
                "2": "60,000 - 69,999",
                "3": "70,000 - 79,999",
                "4": "80,000 - 89,999",
                "5": "90,000 - 99,999",
                "6": "100,000 - 149,999",
                "7": "150,000 - 249,999",
                "8": "250,000 - 499,999",
                "9": "500,000 - UP"
            };
            return salaryMap[val] || val;
        }

        if (field === "on_leave_without_pay") {
            const leaveMap = {
                "1": "On Leave Without Pay",
                "2": "Active Duty/Leave With Pay",
                "3": "No information"
            };
            return leaveMap[val] || val;
        }

        if (field === "full_time_equivalent") {
            const fteMap = {
                "1": "FTEF = 1.00",
                "2": "FTEF = 0.50",
                "3": "FTEF = 0.250"
            };
            return fteMap[val] || val;
        }

        if (field === "gender") {
            const genderMap = {
                "1": "Male",
                "2": "Female"
            };
            return genderMap[val] || val;
        }

        if (field === "highest_degree_attained") {
            const degreeMap = {
                "000": "No formal education",
                "507": "Baccalaureate degree",
                "803": "Masters degree",
                "903": "Doctorate degree"
            };
            return degreeMap[val] || `Degree Code: ${val}`;
        }

        if (field === "pursuing_next_degree") {
            const pursuingMap = {
                "1": "Completed doctorate",
                "2": "Pursuing PhD (active)",
                "3": "Has PhD units (inactive)",
                "4": "Masters holder",
                "5": "Pursuing Masters (active)",
                "6": "Has Masters units (inactive)",
                "7": "Bachelors holder",
                "8": "Not a faculty member",
                "9": "No information"
            };
            return pursuingMap[val] || val;
        }

        if (field === "masters_with_thesis") {
            const thesisMap = {
                "1": "Yes - Wrote thesis",
                "2": "No - No thesis",
                "3": "No information"
            };
            return thesisMap[val] || val;
        }

        if (field === "doctorate_with_dissertation") {
            const dissertationMap = {
                "1": "Yes - Wrote dissertation",
                "2": "No - No dissertation",
                "3": "No information"
            };
            return dissertationMap[val] || val;
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
                onClick={() => onStartEdit(profileId, field)}
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

const FacultyProfileTable = ({ facultyProfiles: initialFacultyProfiles }) => {
    const [facultyProfiles, setFacultyProfiles] = useState(initialFacultyProfiles);
    const [tabValue, setTabValue] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRank, setFilterRank] = useState();
    const [filterCollege, setFilterCollege] = useState();
    const [filterGender, setFilterGender] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [editingCell, setEditingCell] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const validProfiles = Array.isArray(initialFacultyProfiles)
            ? initialFacultyProfiles.filter(
                (profile) => profile && typeof profile === "object" && profile.id
            )
            : [];
        setFacultyProfiles(validProfiles);
    }, [initialFacultyProfiles]);

    const filterOptions = useMemo(() => {
        const ranks = new Set();
        const colleges = new Set();
        const genders = new Set();

        facultyProfiles.forEach((profile) => {
            ranks.add(profile.generic_faculty_rank || "Null");
            colleges.add(profile.home_college || "Null");
            genders.add(
                profile.gender !== undefined && profile.gender !== null
                    ? String(profile.gender)
                    : "Null"
            );
        });

        return {
            ranks: Array.from(ranks).sort((a, b) => {
                const numA = parseFloat(a) || 0;
                const numB = parseFloat(b) || 0;
                return numA - numB;
            }),
            colleges: Array.from(colleges).sort(),
            genders: Array.from(genders).sort(),
        };
    }, [facultyProfiles]);

    const allColumns = useMemo(
        () => [
            {
                field: "name",
                headerName: "Name of Faculty",
                minWidth: 280,
                flex: 2,
                editable: true,
                sortable: false,
                required: true,
            },
            {
                field: "generic_faculty_rank",
                headerName: "Faculty Rank",
                flex: 1,
                minWidth: 100,
                editable: true,
                sortable: false,
            },
            {
                field: "home_college",
                headerName: "Home College",
                minWidth: 120,
                flex: 1,
                editable: true,
                sortable: false,
            },
            {
                field: "home_department",
                headerName: "Home Department",
                minWidth: 120,
                flex: 1,
                editable: true,
                sortable: false,
            },
            {
                field: "is_tenured",
                headerName: "Tenured?",
                minWidth: 80,
                flex: 1,
                editable: true,
                sortable: false,
                fieldType: "boolean",
            },
            {
                field: "ssl_salary_grade",
                headerName: "SSL Grade",
                minWidth: 80,
                flex: 1,
                editable: true,
                sortable: false,
            },
            {
                field: "annual_basic_salary",
                headerName: "Annual Salary",
                minWidth: 100,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
                fieldType: "number",
                validationRules: { min: 0 },
            },
            {
                field: "on_leave_without_pay",
                headerName: "On Leave?",
                minWidth: 80,
                flex: 1,
                editable: true,
                sortable: false,
                fieldType: "boolean",
            },
            {
                field: "full_time_equivalent",
                headerName: "FTE",
                minWidth: 60,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
                fieldType: "number",
                validationRules: { min: 0, max: 1 },
            },
            {
                field: "gender",
                headerName: "Gender",
                minWidth: 80,
                flex: 1,
                editable: true,
                sortable: false,
                fieldType: "select",
            },
            {
                field: "highest_degree_attained",
                headerName: "Highest Degree Attained",
                minWidth: 150,
                flex: 1,
                editable: true,
                sortable: false,
            },
            {
                field: "pursuing_next_degree",
                headerName: "Pursuing Next Degree?",
                minWidth: 150,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
                fieldType: "number",
            },
            {
                field: "discipline_teaching_load_1",
                headerName: "Discipline (1)",
                minWidth: 120,
                flex: 1,
                editable: true,
                sortable: false,
            },
            {
                field: "discipline_teaching_load_2",
                headerName: "Discipline (2)",
                minWidth: 120,
                flex: 1,
                editable: true,
                sortable: false,
            },
            {
                field: "discipline_bachelors",
                headerName: "Bachelors Discipline",
                minWidth: 150,
                flex: 1,
                editable: true,
                sortable: false,
            },
            {
                field: "discipline_masters",
                headerName: "Masters Discipline",
                minWidth: 150,
                flex: 1,
                editable: true,
                sortable: false,
            },
            {
                field: "discipline_doctorate",
                headerName: "Doctorate Discipline",
                minWidth: 150,
                flex: 1,
                editable: true,
                sortable: false,
            },
            {
                field: "masters_with_thesis",
                headerName: "Masters with Thesis?",
                minWidth: 150,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
                fieldType: "number",
            },
            {
                field: "doctorate_with_dissertation",
                headerName: "Doctorate with Dissertation?",
                minWidth: 180,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
                fieldType: "number",
            },
            {
                field: "undergrad_lab_credit_units",
                headerName: "Undergrad Lab Credits",
                minWidth: 120,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
                fieldType: "number",
                validationRules: { min: 0 },
            },
            {
                field: "undergrad_lecture_credit_units",
                headerName: "Undergrad Lecture Credits",
                minWidth: 150,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
                fieldType: "number",
                validationRules: { min: 0 },
            },
            {
                field: "undergrad_total_credit_units",
                headerName: "Undergrad Total Credits",
                minWidth: 150,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
                fieldType: "number",
                validationRules: { min: 0 },
            },
            {
                field: "undergrad_lab_hours_per_week",
                headerName: "Undergrad Lab Hrs/Week",
                minWidth: 150,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
                fieldType: "number",
                validationRules: { min: 0 },
            },
            {
                field: "undergrad_lecture_hours_per_week",
                headerName: "Undergrad Lecture Hrs/Week",
                minWidth: 150,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
                fieldType: "number",
                validationRules: { min: 0 },
            },
            {
                field: "undergrad_total_hours_per_week",
                headerName: "Undergrad Total Hrs/Week",
                minWidth: 150,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
                fieldType: "number",
                validationRules: { min: 0 },
            },
            {
                field: "undergrad_lab_contact_hours",
                headerName: "Undergrad Student Contact Lab",
                minWidth: 180,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
                fieldType: "number",
                validationRules: { min: 0 },
            },
            {
                field: "undergrad_lecture_contact_hours",
                headerName: "Undergrad Student Contact Lecture",
                minWidth: 180,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
                fieldType: "number",
                validationRules: { min: 0 },
            },
            {
                field: "undergrad_total_contact_hours",
                headerName: "Undergrad Total Contact Hrs",
                minWidth: 150,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
                fieldType: "number",
                validationRules: { min: 0 },
            },
            {
                field: "graduate_lab_credit_units",
                headerName: "Graduate Lab Credits",
                minWidth: 120,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
                fieldType: "number",
                validationRules: { min: 0 },
            },
            {
                field: "graduate_lecture_credit_units",
                headerName: "Graduate Lecture Credits",
                minWidth: 150,
                editable: true,
                type: "number",
                sortable: false,
                fieldType: "number",
                validationRules: { min: 0 },
            },
            {
                field: "graduate_total_credit_units",
                headerName: "Graduate Total Credits",
                minWidth: 150,
                editable: true,
                type: "number",
                sortable: false,
                fieldType: "number",
                validationRules: { min: 0 },
            },
            {
                field: "graduate_lab_contact_hours",
                headerName: "Graduate Student Contact Lab",
                minWidth: 180,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
                fieldType: "number",
                validationRules: { min: 0 },
            },
            {
                field: "graduate_lecture_contact_hours",
                headerName: "Graduate Student Contact Lecture",
                minWidth: 180,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
                fieldType: "number",
                validationRules: { min: 0 },
            },
            {
                field: "graduate_total_contact_hours",
                headerName: "Graduate Total Contact Hrs",
                minWidth: 150,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
                fieldType: "number",
                validationRules: { min: 0 },
            },
            {
                field: "research_load",
                headerName: "Research Load",
                minWidth: 100,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
                fieldType: "number",
                validationRules: { min: 0 },
            },
            {
                field: "extension_services_load",
                headerName: "Extension Services Load",
                minWidth: 150,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
                fieldType: "number",
                validationRules: { min: 0 },
            },
            {
                field: "study_load",
                headerName: "Study Load",
                minWidth: 100,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
                fieldType: "number",
                validationRules: { min: 0 },
            },
            {
                field: "production_load",
                headerName: "Production Load",
                minWidth: 100,
                editable: true,
                type: "number",
                sortable: false,
                fieldType: "number",
                validationRules: { min: 0 },
            },
            {
                field: "administrative_load",
                headerName: "Administrative Load",
                minWidth: 120,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
                fieldType: "number",
                validationRules: { min: 0 },
            },
            {
                field: "other_load_credits",
                headerName: "Other Load Credits",
                minWidth: 120,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
                fieldType: "number",
                validationRules: { min: 0 },
            },
            {
                field: "total_work_load",
                headerName: "Total Work Load",
                minWidth: 120,
                editable: true,
                type: "number",
                sortable: false,
                fieldType: "number",
                validationRules: { min: 0 },
            },
        ],
        []
    );

    const tabbedColumns = useMemo(
        () => ({
            personal: [
                allColumns[0], // name
                allColumns[1], // generic_faculty_rank
                allColumns[2], // home_college
                allColumns[3], // home_department
                allColumns[4], // is_tenured
                allColumns[5], // ssl_salary_grade
                allColumns[6], // annual_basic_salary
                allColumns[7], // on_leave_without_pay
                allColumns[8], // full_time_equivalent
                allColumns[9], // gender
            ],
            education: [
                allColumns[0], // name
                allColumns[10], // highest_degree_attained
                allColumns[11], // pursuing_next_degree
                allColumns[12], // discipline_teaching_load_1
                allColumns[13], // discipline_teaching_load_2
                allColumns[14], // discipline_bachelors
                allColumns[15], // discipline_masters
                allColumns[16], // discipline_doctorate
                allColumns[17], // masters_with_thesis
                allColumns[18], // doctorate_with_dissertation
            ],
            teaching: [
                allColumns[0], // name
                allColumns[19], // undergrad_lab_credit_units
                allColumns[20], // undergrad_lecture_credit_units
                allColumns[21], // undergrad_total_credit_units
                allColumns[22], // undergrad_lab_hours_per_week
                allColumns[23], // undergrad_lecture_hours_per_week
                allColumns[24], // undergrad_total_hours_per_week
                allColumns[25], // undergrad_lab_contact_hours
                allColumns[26], // undergrad_lecture_contact_hours
                allColumns[27], // undergrad_total_contact_hours
                allColumns[28], // graduate_lab_credit_units
                allColumns[29], // graduate_lecture_credit_units
                allColumns[30], // graduate_total_credit_units
                allColumns[31], // graduate_lab_contact_hours
                allColumns[32], // graduate_lecture_contact_hours
                allColumns[33], // graduate_total_contact_hours
            ],
            other: [
                allColumns[0], // name
                allColumns[34], // research_load
                allColumns[35], // extension_services_load
                allColumns[36], // study_load
                allColumns[37], // production_load
                allColumns[38], // administrative_load
                allColumns[39], // other_load_credits
                allColumns[40], // total_work_load
            ],
        }),
        [allColumns]
    );

    const data = useMemo(() => {
        return facultyProfiles
            .filter(
                (profile) =>
                    profile &&
                    typeof profile === "object" &&
                    profile.id &&
                    (!searchTerm ||
                        (profile.name &&
                            profile.name
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase()))) &&
                    (!filterRank ||
                        profile.generic_faculty_rank === filterRank ||
                        (filterRank === "Null" && !profile.generic_faculty_rank)) &&
                    (!filterCollege ||
                        profile.home_college === filterCollege ||
                        (filterCollege === "Null" && !profile.home_college)) &&
                    (!filterGender ||
                        String(profile.gender) === filterGender ||
                        (filterGender === "Null" && profile.gender === null))
            )
            .map((profile) => ({
                id: profile.id,
                ...profile,
            }));
    }, [facultyProfiles, searchTerm, filterRank, filterCollege, filterGender]);

    const startEditing = (profileId, field) => {
        if (isSaving) return;
        setEditingCell({ profileId, field });
    };

    const cancelEditing = () => {
        setEditingCell(null);
    };

    const handleCellEdit = useCallback(
        async (id, field, value) => {
            setIsSaving(true);

            try {
                const updatedFacultyProfiles = [...facultyProfiles];
                const profileIndex = updatedFacultyProfiles.findIndex(
                    (profile) => profile.id === id
                );

                if (profileIndex === -1) {
                    console.error(`Profile with id ${id} not found`);
                    setIsSaving(false);
                    return;
                }

                const profile = {
                    ...updatedFacultyProfiles[profileIndex],
                    [field]: value,
                };
                updatedFacultyProfiles[profileIndex] = profile;
                const token = localStorage.getItem("token");

                await axios.put(
                    `${config.API_URL}/faculty-profiles/${profile.id}`,
                    { [field]: value },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                setFacultyProfiles(updatedFacultyProfiles);
                AlertComponent.showAlert("Faculty profile updated successfully!", "success");
            } catch (error) {
                console.error("Error saving changes:", error);
                AlertComponent.showAlert("Failed to save faculty profile changes.", "error");
            } finally {
                setIsSaving(false);
                setEditingCell(null);
            }
        },
        [facultyProfiles]
    );

    const handleTabChange = (newValue) => {
        setTabValue(newValue);
        setCurrentPage(1);
    };

    const currentColumns = useMemo(() => {
        switch (tabValue) {
            case 0:
                return tabbedColumns.personal;
            case 1:
                return tabbedColumns.education;
            case 2:
                return tabbedColumns.teaching;
            case 3:
                return tabbedColumns.other;
            default:
                return tabbedColumns.personal;
        }
    }, [tabValue, tabbedColumns]);

    const columnGroupingModel = useMemo(() => {
        if (tabValue === 2) {
            return [
                {
                    groupId: "name",
                    headerName: " ",
                    children: [{ field: "name" }],
                },
                {
                    groupId: "Undergraduate Teaching Load",
                    headerName: "Undergraduate Teaching Load",
                    children: [
                        { field: "undergrad_lab_credit_units" },
                        { field: "undergrad_lecture_credit_units" },
                        { field: "undergrad_total_credit_units" },
                        { field: "undergrad_lab_hours_per_week" },
                        { field: "undergrad_lecture_hours_per_week" },
                        { field: "undergrad_total_hours_per_week" },
                        { field: "undergrad_lab_contact_hours" },
                        { field: "undergrad_lecture_contact_hours" },
                        { field: "undergrad_total_contact_hours" },
                    ],
                },
                {
                    groupId: "Graduate Teaching Load",
                    headerName: "Graduate Teaching Load",
                    children: [
                        { field: "graduate_lab_credit_units" },
                        { field: "graduate_lecture_credit_units" },
                        { field: "graduate_total_credit_units" },
                        { field: "graduate_lab_contact_hours" },
                        { field: "graduate_lecture_contact_hours" },
                        { field: "graduate_total_contact_hours" },
                    ],
                },
            ];
        }
        return [];
    }, [tabValue]);

    const filters = {
        filterRank,
        filterCollege,
        filterGender,
    };

    const handleFilterChange = (key, value) => {
        switch (key) {
            case "filterRank":
                setFilterRank(value);
                break;
            case "filterCollege":
                setFilterCollege(value);
                break;
            case "filterGender":
                setFilterGender(value);
                break;
            default:
                break;
        }
    };

    const totalRows = data.length;
    const totalPages = Math.ceil(totalRows / pageSize);
    const paginatedData = data.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
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

    return (
        <div className="mt-2 relative">
            <div className="flex mb-3 flex-wrap gap-2">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={16} className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Search by faculty name..."
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm("")}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                            <X
                                size={16}
                                className="text-gray-400 hover:text-gray-600"
                            />
                        </button>
                    )}
                </div>
                <div className="relative">
                    <button
                        onClick={() => setIsFilterOpen((prev) => !prev)}
                        className="px-3 py-2 flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-md text-sm text-gray-700"
                    >
                        <Filter size={16} />
                        Filters
                    </button>
                    <FilterPopover
                        open={isFilterOpen}
                        onClose={() => setIsFilterOpen(false)}
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onClearFilters={() => {
                            setFilterRank();
                            setFilterCollege();
                            setFilterGender();
                        }}
                        filterOptions={{
                            filterRank: filterOptions.ranks,
                            filterCollege: filterOptions.colleges,
                            filterGender: filterOptions.genders,
                        }}
                    />
                </div>
            </div>

            <div className="flex border-b border-gray-300 overflow-x-auto hide-scrollbar shrink-0 mb-3">
                {[
                    "Personal Info",
                    "Education",
                    "Teaching Load",
                    "Other Loads",
                ].map((label, index) => (
                    <button
                        key={label}
                        onClick={() => handleTabChange(index)}
                        className={`flex-1 min-w-[120px] py-3 px-4 text-sm font-medium text-center transition-all relative ${
                            tabValue === index
                                ? "text-blue-700 bg-blue-50/50"
                                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                        }`}
                        aria-selected={tabValue === index}
                        role="tab"
                        aria-controls={`tab-panel-${index}`}
                        id={`tab-${index}`}
                    >
                        {label}
                        {tabValue === index && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-700"></div>
                        )}
                    </button>
                ))}
            </div>

            <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                <p className="text-xs text-gray-600">
                    <span className="font-medium">{paginatedData.length}</span>{" "}
                    of <span className="font-medium">{totalRows}</span> faculty
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

            <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden mb-3 max-h-[40vh] overflow-y-auto">
                <div className="block sm:hidden">
                    {paginatedData.length === 0 ? (
                        <div className="p-4 text-xs text-center text-gray-500">
                            No faculty profiles found matching your criteria
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {paginatedData.map((row) => (
                                <div
                                    key={row.id}
                                    className="p-3 hover:bg-gray-50"
                                >
                                    <div className="font-medium text-sm text-gray-900 mb-1">
                                        {row.name || "Unnamed Faculty"}
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                                        {currentColumns
                                            .slice(1, 5)
                                            .map((column) => (
                                                <div
                                                    key={column.field}
                                                    className="flex flex-col"
                                                >
                                                    <span className="text-gray-500 text-2xs">
                                                        {column.headerName}
                                                    </span>
                                                    <EditableCell
                                                        value={row[column.field]}
                                                        field={column.field}
                                                        profileId={row.id}
                                                        isEditing={
                                                            editingCell?.profileId === row.id &&
                                                            editingCell?.field === column.field
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
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="hidden sm:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 table-fixed">
                        {tabValue === 2 && (
                            <thead>
                                <tr className="bg-gray-50">
                                    {columnGroupingModel.map((group) => (
                                        <th
                                            key={group.groupId}
                                            colSpan={group.children.length}
                                            className="px-2 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 bg-gray-50"
                                        >
                                            {group.headerName}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                        )}

                        <thead className="bg-gray-50 sticky top-0 z-10">
                            <tr>
                                {currentColumns.map((column) => (
                                    <th
                                        key={column.field}
                                        className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-r border-gray-200 truncate"
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="truncate">
                                                {column.headerName}
                                                {column.required && (
                                                    <span className="text-red-500 ml-1">*</span>
                                                )}
                                            </span>
                                            {column.sortable && (
                                                <ChevronDown className="h-3 w-3 text-gray-400 flex-shrink-0" />
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedData.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={currentColumns.length}
                                        className="px-3 py-4 text-xs text-center text-gray-500 bg-gray-50"
                                    >
                                        No faculty profiles found matching your
                                        criteria
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map((row, rowIndex) => (
                                    <tr
                                        key={row.id}
                                        className={`${
                                            rowIndex % 2 === 0
                                                ? "bg-white"
                                                : "bg-gray-50"
                                        } hover:bg-blue-50/50`}
                                    >
                                        {currentColumns.map((column) => (
                                            <td
                                                key={`${row.id}-${column.field}`}
                                                className={`px-2 py-1.5 text-xs text-gray-900 border-r border-gray-200 ${
                                                    editingCell?.profileId === row.id &&
                                                    editingCell?.field === column.field
                                                        ? "bg-blue-50 border-blue-200"
                                                        : ""
                                                }`}
                                            >
                                                <EditableCell
                                                    value={row[column.field]}
                                                    field={column.field}
                                                    profileId={row.id}
                                                    isEditing={
                                                        editingCell?.profileId === row.id &&
                                                        editingCell?.field === column.field
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
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white rounded-md shadow-sm border border-gray-200 p-2">
                <div className="sm:flex justify-end items-center">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        pageSize={pageSize}
                        onPageChange={(page) => setCurrentPage(page)}
                        onPageSizeChange={(size) => {
                            setPageSize(size);
                            setCurrentPage(1);
                        }}
                        showFirstLast={true}
                        showPageInput={true}
                        showPageSize={true}
                        maxPageButtons={5}
                        className="flex justify-between items-center"
                    />
                </div>
            </div>

            <style>{`
        .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .text-2xs {
            font-size: 0.65rem;
        }
        `}</style>
        </div>
    );
};

EditableCell.propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    field: PropTypes.string.isRequired,
    profileId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
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

FacultyProfileTable.propTypes = {
    facultyProfiles: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            name: PropTypes.string,
            generic_faculty_rank: PropTypes.string,
            home_college: PropTypes.string,
            home_department: PropTypes.string,
            is_tenured: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            ssl_salary_grade: PropTypes.string,
            annual_basic_salary: PropTypes.number,
            on_leave_without_pay: PropTypes.string,
            full_time_equivalent: PropTypes.number,
            gender: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            highest_degree_attained: PropTypes.string,
            pursuing_next_degree: PropTypes.number,
            discipline_teaching_load_1: PropTypes.string,
            discipline_teaching_load_2: PropTypes.string,
            discipline_bachelors: PropTypes.string,
            discipline_masters: PropTypes.string,
            discipline_doctorate: PropTypes.string,
            masters_with_thesis: PropTypes.number,
            doctorate_with_dissertation: PropTypes.number,
            undergrad_lab_credit_units: PropTypes.number,
            undergrad_lecture_credit_units: PropTypes.number,
            undergrad_total_credit_units: PropTypes.number,
            undergrad_lab_hours_per_week: PropTypes.number,
            undergrad_lecture_hours_per_week: PropTypes.number,
            undergrad_total_hours_per_week: PropTypes.number,
            undergrad_lab_contact_hours: PropTypes.number,
            undergrad_lecture_contact_hours: PropTypes.number,
            undergrad_total_contact_hours: PropTypes.number,
            graduate_lab_credit_units: PropTypes.number,
            graduate_lecture_credit_units: PropTypes.number,
            graduate_total_credit_units: PropTypes.number,
            graduate_lab_contact_hours: PropTypes.number,
            graduate_lecture_contact_hours: PropTypes.number,
            graduate_total_contact_hours: PropTypes.number,
            research_load: PropTypes.number,
            extension_services_load: PropTypes.number,
            study_load: PropTypes.number,
            production_load: PropTypes.number,
            administrative_load: PropTypes.number,
            other_load_credits: PropTypes.number,
            total_work_load: PropTypes.number,
            data_date: PropTypes.string,
        })
    ).isRequired,
};

export default FacultyProfileTable;
