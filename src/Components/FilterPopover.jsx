import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { RotateCcw } from "lucide-react";

const FilterPopover = ({
    open,
    onClose,
    filters,
    onFilterChange,
    onClearFilters,
    filterOptions,
}) => {
    const popoverRef = useRef(null);

    // Close popover on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                popoverRef.current &&
                !popoverRef.current.contains(event.target)
            ) {
                onClose();
            }
        };
        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open, onClose]);

    if (!open) return null;

    const FilterSelect = ({ value, onChange, options, placeholder }) => (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            <option value="">{placeholder}</option>
            {options?.map((item) => (
                <option key={item} value={String(item)}>
                    {item}
                </option>
            ))}
            {options?.length === 0 && <option disabled>No Options</option>}
        </select>
    );

    FilterSelect.propTypes = {
        value: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
        options: PropTypes.arrayOf(PropTypes.string).isRequired,
        placeholder: PropTypes.string.isRequired,
    };

    return (
        <div
            className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-50 border border-gray-200"
            ref={popoverRef}
        >
            {/* Arrow pointing to the filter button */}
            <div className="absolute -top-2 left-4 w-4 h-4 bg-white border-t border-l border-gray-200 transform rotate-45"></div>
            <div className="p-4">
                <div className="grid grid-cols-1 gap-3">
                    {Object.keys(filters).map((filterKey) => (
                        <FilterSelect
                            key={filterKey}
                            value={filters[filterKey]}
                            onChange={(value) =>
                                onFilterChange(filterKey, value)
                            }
                            options={filterOptions[filterKey]}
                            placeholder={`All ${filterKey}`}
                        />
                    ))}
                </div>
                <div className="flex justify-between mt-4">
                    <button
                        onClick={() => {
                            onClearFilters();
                            onClose();
                        }}
                        className="flex items-center px-3 py-1 text-red-600 hover:bg-red-100 rounded-md text-sm font-medium"
                    >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Reset
                    </button>
                    <button
                        onClick={onClose}
                        className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
};

FilterPopover.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    filters: PropTypes.object.isRequired,
    onFilterChange: PropTypes.func.isRequired,
    onClearFilters: PropTypes.func.isRequired,
    filterOptions: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string))
        .isRequired,
};

export default FilterPopover;
