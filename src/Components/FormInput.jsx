import { useState, useRef, useEffect } from "react";
import { BsExclamationCircle, BsChevronDown, BsXCircle } from "react-icons/bs";
import PropTypes from "prop-types";
import clsx from "clsx"; // For class merging

/**
 * A versatile input field component with enhanced select/autocomplete functionality
 *
 * @param {Object} props - Component props
 * @param {string} props.id - Unique identifier for the input
 * @param {string} props.name - Name attribute for the input
 * @param {string} props.label - Label text for the input
 * @param {string} [props.type="text"] - Input type (text, email, password, number, date, tel, select, autocomplete, textarea)
 * @param {string|number} [props.value=""] - Current value of the input
 * @param {function} props.onChange - Function to call when input value changes
 * @param {function} [props.onBlur] - Function to call when input loses focus
 * @param {boolean} [props.required=false] - Whether the input is required
 * @param {boolean} [props.disabled=false] - Whether the input is disabled
 * @param {boolean} [props.readOnly=false] - Whether the input is read-only
 * @param {string} [props.placeholder] - Placeholder text for the input
 * @param {string} [props.errorMessage] - Error message to display
 * @param {string} [props.helpText] - Additional help text to display below the input
 * @param {string} [props.className] - Additional CSS classes for the input element (maintained for backward compatibility)
 * @param {string} [props.wrapperClassName] - Additional CSS classes for the wrapper div
 * @param {string} [props.labelClassName] - Additional CSS classes for the label
 * @param {string} [props.inputClassName] - Additional CSS classes for the input/select (replaces className for clarity)
 * @param {string} [props.errorClassName] - Additional CSS classes for the error message
 * @param {string} [props.helpTextClassName] - Additional CSS classes for the help text
 * @param {Object} [props.inputProps] - Additional props to pass to the input element
 * @param {Array} [props.options] - Array of options for select/autocomplete input [{ value: string, label: string }]
 * @param {string} [props.size="default"] - Input size (small, default, large)
 * @param {number} [props.rows=3] - Number of rows for textarea
 * @param {boolean} [props.isMulti=false] - Whether the select allows multiple selections
 * @param {boolean} [props.isClearable=false] - Whether the select has a clear button
 * @param {string} [props.emptyMessage="No options available"] - Message shown when no options match the search
 * @param {boolean} [props.isSearchable=true] - Whether the autocomplete input is searchable
 */
const FormInput = ({
    id,
    name,
    label,
    type = "text",
    value = "",
    onChange,
    onBlur,
    required = false,
    disabled = false,
    readOnly = false,
    placeholder = "Select an option",
    errorMessage,
    helpText,
    className = "", // Maintained for backward compatibility
    wrapperClassName = "",
    labelClassName = "",
    inputClassName = "",
    errorClassName = "",
    helpTextClassName = "",
    inputProps = {},
    options = [],
    size = "default",
    rows = 3,
    isMulti = false,
    isClearable = false,
    emptyMessage = "No options available",
    isSearchable = true,
}) => {
    // States for autocomplete/select2 functionality
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [focusedOptionIndex, setFocusedOptionIndex] = useState(-1);

    // Refs
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);
    const componentRef = useRef(null);

    // Determine if there's an error
    const hasError = !!errorMessage;

    // Generate a unique ID if none is provided
    const inputId =
        id || `input-${name}-${Math.random().toString(36).substr(2, 9)}`;

    // Check if this is an enhanced select
    const isAutocomplete = type === "autocomplete";

    // Initialize selected options when value changes from outside
    useEffect(() => {
        if (isAutocomplete) {
            if (isMulti && Array.isArray(value)) {
                const selected = options.filter((option) =>
                    value.includes(option.value)
                );
                setSelectedOptions(selected);
            } else if (!isMulti && value) {
                const selected = options.find(
                    (option) => option.value === value
                );
                setSelectedOptions(selected ? [selected] : []);
            }
        }
    }, [value, options, isMulti, isAutocomplete]);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                componentRef.current &&
                !componentRef.current.contains(event.target)
            ) {
                setIsOpen(false);
                if (onBlur) onBlur();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onBlur]);

    // Focus the search input when dropdown opens
    useEffect(() => {
        if (isOpen && searchInputRef.current && isSearchable) {
            searchInputRef.current.focus();
        }
    }, [isOpen, isSearchable]);

    // Size-specific classes for height consistency
    const sizeClasses = {
        small: "h-8 text-sm",
        default: "h-10 text-base",
        large: "h-12 text-lg",
    };

    // Adjust padding based on size for consistent appearance
    const paddingClasses = {
        small: "px-2 py-1",
        default: "px-3 py-2",
        large: "px-4 py-3",
    };

    // Default classes for different states
    const defaultLabelClasses = `block text-sm font-medium ${
        disabled ? "text-gray-500" : "text-gray-700"
    } mb-1`;

    // Create consistent sizing classes for inputs
    const defaultInputClasses = `
        w-full
        ${paddingClasses[size]}
        ${type !== "textarea" ? sizeClasses[size] : ""}
        border
        ${
            hasError
                ? "border-red-500"
                : disabled
                ? "border-gray-200"
                : "border-gray-300"
        }
        rounded-md
        shadow-sm
        ${disabled ? "bg-gray-100" : "bg-white"}
        ${readOnly ? "cursor-not-allowed bg-gray-50" : ""}
        focus:outline-none
        focus:ring-2
        ${
            hasError
                ? "focus:ring-red-500 focus:border-red-500"
                : "focus:ring-blue-500 focus:border-blue-500"
        }
        transition
        duration-150
        ease-in-out
        appearance-none
    `;

    // Merge default and custom classes
    const labelClasses = clsx(defaultLabelClasses, labelClassName);
    const inputClasses = clsx(defaultInputClasses, className, inputClassName);
    const wrapperClasses = clsx("relative mb-4", wrapperClassName);
    const errorClasses = clsx(
        "mt-1 text-sm text-red-600 animate-fadeIn",
        errorClassName
    );
    const helpTextClasses = clsx(
        "mt-1 text-sm text-gray-500",
        helpTextClassName
    );

    // Filter options based on search term
    const filteredOptions = searchTerm
        ? options.filter((option) =>
              option.label.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : options;

    // Handle selection change for autocomplete
    const handleOptionSelect = (option) => {
        let newSelectedOptions = [];
        let newValue;

        if (isMulti) {
            // Check if option is already selected
            const isSelected = selectedOptions.some(
                (selected) => selected.value === option.value
            );

            // Toggle selection
            if (isSelected) {
                newSelectedOptions = selectedOptions.filter(
                    (selected) => selected.value !== option.value
                );
            } else {
                newSelectedOptions = [...selectedOptions, option];
            }

            // Create array of values for onChange
            newValue = newSelectedOptions.map((opt) => opt.value);
        } else {
            // Single select just uses the option
            newSelectedOptions = [option];
            newValue = option.value;
            setIsOpen(false);
        }

        setSelectedOptions(newSelectedOptions);
        setSearchTerm("");

        // Call parent onChange with the new value
        if (onChange) {
            // Create a synthetic event object
            const syntheticEvent = {
                target: {
                    name,
                    value: newValue,
                },
                preventDefault: () => {},
            };
            onChange(syntheticEvent);
        }
    };

    // Handle removing a selected option (for multi-select)
    const handleRemoveOption = (optionToRemove, e) => {
        e.stopPropagation();

        const newSelectedOptions = selectedOptions.filter(
            (option) => option.value !== optionToRemove.value
        );

        setSelectedOptions(newSelectedOptions);

        // Call parent onChange with the new value array
        if (onChange) {
            const newValue = newSelectedOptions.map((opt) => opt.value);
            const syntheticEvent = {
                target: {
                    name,
                    value: newValue,
                },
                preventDefault: () => {},
            };
            onChange(syntheticEvent);
        }
    };

    // Handle clearing all selected options
    const handleClearAll = (e) => {
        e.stopPropagation();

        setSelectedOptions([]);
        setSearchTerm("");

        // Call parent onChange with empty value
        if (onChange) {
            const syntheticEvent = {
                target: {
                    name,
                    value: isMulti ? [] : "",
                },
                preventDefault: () => {},
            };
            onChange(syntheticEvent);
        }
    };

    // Handle keyboard navigation
    const handleKeyDown = (e) => {
        if (!isOpen) {
            if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsOpen(true);
                setFocusedOptionIndex(0);
            }
            return;
        }

        switch (e.key) {
            case "Escape":
                e.preventDefault();
                setIsOpen(false);
                setFocusedOptionIndex(-1);
                break;

            case "ArrowDown":
                e.preventDefault();
                setFocusedOptionIndex((prevIndex) =>
                    prevIndex < filteredOptions.length - 1 ? prevIndex + 1 : 0
                );
                break;

            case "ArrowUp":
                e.preventDefault();
                setFocusedOptionIndex((prevIndex) =>
                    prevIndex > 0 ? prevIndex - 1 : filteredOptions.length - 1
                );
                break;

            case "Enter":
                if (
                    focusedOptionIndex >= 0 &&
                    focusedOptionIndex < filteredOptions.length
                ) {
                    e.preventDefault();
                    handleOptionSelect(filteredOptions[focusedOptionIndex]);
                }
                break;

            default:
                break;
        }
    };

    // Handle number type specific props
    const numberProps =
        type === "number"
            ? {
                  step: inputProps.step || "any",
                  min: inputProps.min,
                  max: inputProps.max,
              }
            : {};

    // Render custom autocomplete/select2 component
    const renderAutocomplete = () => {
        const showClearButton = isClearable && selectedOptions.length > 0;

        return (
            <div
                ref={componentRef}
                className="relative"
                onKeyDown={handleKeyDown}
            >
                {/* Select Input Display */}
                <div
                    className={`${inputClasses} flex items-center cursor-pointer pr-8 ${
                        hasError ? "pr-10" : ""
                    }`}
                    onClick={() => !disabled && !readOnly && setIsOpen(!isOpen)}
                    role="combobox"
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                    aria-controls={`${inputId}-listbox`}
                    aria-invalid={hasError}
                    tabIndex={0}
                >
                    {/* Selected pills for multi-select */}
                    {isMulti && selectedOptions.length > 0 && !isOpen && (
                        <div className="flex flex-wrap gap-1 max-w-full overflow-hidden">
                            {selectedOptions.map((option) => (
                                <div
                                    key={option.value}
                                    className="bg-blue-100 text-blue-800 rounded-full px-2 py-0.5 text-sm flex items-center"
                                >
                                    <span className="truncate">
                                        {option.label}
                                    </span>
                                    <button
                                        type="button"
                                        className="ml-1 text-blue-600 hover:text-blue-800"
                                        onClick={(e) =>
                                            handleRemoveOption(option, e)
                                        }
                                        aria-label={`Remove ${option.label}`}
                                    >
                                        <BsXCircle size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Search input */}
                    {(isOpen ||
                        (!isMulti && selectedOptions.length === 0) ||
                        (isMulti && !selectedOptions.length)) && (
                        <input
                            ref={searchInputRef}
                            type="text"
                            className="bg-transparent border-none p-0 focus:ring-0 focus:outline-none w-full"
                            placeholder={
                                selectedOptions.length ? "" : placeholder
                            }
                            value={searchTerm}
                            onChange={(e) =>
                                isSearchable && setSearchTerm(e.target.value)
                            }
                            onClick={(e) => e.stopPropagation()}
                            disabled={disabled || readOnly}
                            aria-autocomplete="list"
                            autoComplete="off"
                        />
                    )}

                    {/* Single select display value */}
                    {!isMulti && selectedOptions.length > 0 && !isOpen && (
                        <span className="truncate">
                            {selectedOptions[0].label}
                        </span>
                    )}

                    {/* Indicators */}
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        {showClearButton && (
                            <button
                                type="button"
                                className="text-gray-400 hover:text-gray-600 cursor-pointer pointer-events-auto mr-1"
                                onClick={handleClearAll}
                                aria-label="Clear selection"
                            >
                                <BsXCircle size={16} />
                            </button>
                        )}
                        <BsChevronDown
                            className={`h-4 w-4 text-gray-400 transition-transform ${
                                isOpen ? "transform rotate-180" : ""
                            }`}
                        />
                    </div>
                </div>

                {/* Dropdown Menu */}
                {isOpen && (
                    <div
                        ref={dropdownRef}
                        className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none max-h-60"
                        id={`${inputId}-listbox`}
                        role="listbox"
                    >
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option, index) => {
                                const isSelected = selectedOptions.some(
                                    (selected) =>
                                        selected.value === option.value
                                );
                                const isFocused = index === focusedOptionIndex;

                                return (
                                    <div
                                        key={option.value}
                                        className={clsx(
                                            "cursor-pointer select-none relative py-2 pl-3 pr-9",
                                            isFocused
                                                ? "bg-blue-50"
                                                : "hover:bg-gray-50",
                                            isSelected ? "bg-blue-100" : ""
                                        )}
                                        onClick={() =>
                                            handleOptionSelect(option)
                                        }
                                        onMouseEnter={() =>
                                            setFocusedOptionIndex(index)
                                        }
                                        role="option"
                                        aria-selected={isSelected}
                                    >
                                        <span
                                            className={clsx(
                                                "block truncate",
                                                isSelected
                                                    ? "font-medium"
                                                    : "font-normal"
                                            )}
                                        >
                                            {option.label}
                                        </span>

                                        {isSelected && (
                                            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                                                <svg
                                                    className="h-5 w-5"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </span>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-2 px-4 text-sm text-gray-500">
                                {emptyMessage}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    // Render the appropriate input element based on type
    const renderInputElement = () => {
        switch (type) {
            case "autocomplete":
                return renderAutocomplete();

            case "select":
                return (
                    <select
                        id={inputId}
                        name={name}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        disabled={disabled}
                        className={inputClasses}
                        aria-invalid={hasError}
                        aria-describedby={
                            hasError
                                ? `${inputId}-error`
                                : helpText
                                ? `${inputId}-description`
                                : undefined
                        }
                        {...inputProps}
                    >
                        <option value="">{placeholder}</option>
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                );

            case "textarea":
                return (
                    <textarea
                        id={inputId}
                        name={name}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        disabled={disabled}
                        readOnly={readOnly}
                        placeholder={placeholder}
                        rows={rows}
                        className={inputClasses}
                        aria-invalid={hasError}
                        aria-describedby={
                            hasError
                                ? `${inputId}-error`
                                : helpText
                                ? `${inputId}-description`
                                : undefined
                        }
                        {...inputProps}
                    />
                );

            default:
                return (
                    <input
                        id={inputId}
                        name={name}
                        type={type}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        disabled={disabled}
                        readOnly={readOnly}
                        placeholder={placeholder}
                        className={clsx(inputClasses, hasError && "pr-10")}
                        aria-invalid={hasError}
                        aria-describedby={
                            hasError
                                ? `${inputId}-error`
                                : helpText
                                ? `${inputId}-description`
                                : undefined
                        }
                        {...numberProps}
                        {...inputProps}
                    />
                );
        }
    };

    return (
        <div className={wrapperClasses}>
            {/* Label */}
            {label && (
                <label htmlFor={inputId} className={labelClasses}>
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            {/* Input wrapper */}
            <div className="relative">
                {renderInputElement()}

                {/* Error icon */}
                {hasError && type !== "textarea" && type !== "autocomplete" && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <BsExclamationCircle
                            className="h-5 w-5 text-red-500"
                            aria-hidden="true"
                        />
                    </div>
                )}
            </div>

            {/* Error message */}
            {hasError && (
                <p className={errorClasses} id={`${inputId}-error`}>
                    {errorMessage}
                </p>
            )}

            {/* Help text */}
            {helpText && !hasError && (
                <p className={helpTextClasses} id={`${inputId}-description`}>
                    {helpText}
                </p>
            )}
        </div>
    );
};

FormInput.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    type: PropTypes.oneOf([
        "text",
        "email",
        "password",
        "number",
        "date",
        "tel",
        "select",
        "autocomplete",
        "textarea",
        "checkbox",
        "radio",
        "file",
        "color",
        "time",
        "url",
        "search",
        "month",
        "week",
        "datetime-local",
    ]),
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.bool,
        PropTypes.array,
    ]),
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    placeholder: PropTypes.string,
    errorMessage: PropTypes.string,
    helpText: PropTypes.string,
    className: PropTypes.string,
    wrapperClassName: PropTypes.string,
    labelClassName: PropTypes.string,
    inputClassName: PropTypes.string,
    errorClassName: PropTypes.string,
    helpTextClassName: PropTypes.string,
    inputProps: PropTypes.object,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
                .isRequired,
            label: PropTypes.string.isRequired,
        })
    ),
    size: PropTypes.oneOf(["small", "default", "large"]),
    rows: PropTypes.number,
    isMulti: PropTypes.bool,
    isClearable: PropTypes.bool,
    emptyMessage: PropTypes.string,
    isSearchable: PropTypes.bool,
};

export default FormInput;
