// src/components/InstitutionManagement/Filters.jsx
import PropTypes from "prop-types";
import { Calendar, RefreshCw } from "lucide-react";

const Filters = ({ reportYearFilter, setReportYearFilter, filterOptions, clearFilters }) => (
    <div className="flex items-center space-x-3">
        <div className="relative">
            <select
                id="reportYear"
                value={reportYearFilter}
                onChange={(e) => setReportYearFilter(e.target.value)}
                className="appearance-none pl-8 pr-10 py-2 text-base border border-gray-300 rounded-lg"
            >
                <option value="">All Years</option>
                {filterOptions.reportYears.map((year) => (
                    <option key={year} value={String(year)}>
                        {year}
                    </option>
                ))}
            </select>
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
        </div>
        <button
            onClick={clearFilters}
            className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
        >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
        </button>
    </div>
);

Filters.propTypes = {
    reportYearFilter: PropTypes.string.isRequired,
    setReportYearFilter: PropTypes.func.isRequired,
    filterOptions: PropTypes.shape({
        reportYears: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
    clearFilters: PropTypes.func.isRequired,
};

export default Filters;