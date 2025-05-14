import { useState } from "react";
import PropTypes from "prop-types";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import clsx from "clsx";

const YearPicker = ({
    label,
    name,
    value,
    onChange,
    error,
    icon,
    minYear = 1800,
    maxYear = 2025,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const years = Array.from(
        { length: maxYear - minYear + 1 },
        (_, i) => maxYear - i
    );

    const handleSelectYear = (year) => {
        onChange({ target: { name, value: year.toString() } });
        setIsOpen(false);
    };

    // Match FormInput's default input classes
    const inputClasses = clsx(
        "w-full px-3 py-2 border",
        error ? "border-red-500" : "border-gray-300",
        "rounded-md shadow-sm bg-white",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
        "transition duration-150 ease-in-out",
        "flex justify-between items-center cursor-pointer"
    );

    return (
        <div className="mb-4">
            <label
                htmlFor={name}
                className="flex items-center text-sm font-medium text-gray-700 mb-1"
            >
                {icon && <span className="mr-2 text-blue-500">{icon}</span>}
                {label}
            </label>
            <div className="relative">
                <div
                    className={inputClasses}
                    onClick={() => setIsOpen((prev) => !prev)}
                >
                    <span>{value || `Select ${label}`}</span>
                    {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                </div>

                {isOpen && (
                    <div className="absolute z-10 w-full bottom-full mb-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        <div className="sticky top-0 bg-gray-50 border-b border-gray-200 px-3 py-2 font-medium text-gray-700">
                            Select Year
                        </div>
                        <div className="overflow-y-auto max-h-48">
                            {years.map((year) => (
                                <div
                                    key={year}
                                    className={clsx(
                                        "px-3 py-2 hover:bg-blue-100 cursor-pointer",
                                        value === year.toString()
                                            ? "bg-blue-100"
                                            : ""
                                    )}
                                    onClick={() => handleSelectYear(year)}
                                >
                                    {year}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};

YearPicker.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,
    icon: PropTypes.element,
    minYear: PropTypes.number,
    maxYear: PropTypes.number,
};

export default YearPicker;
