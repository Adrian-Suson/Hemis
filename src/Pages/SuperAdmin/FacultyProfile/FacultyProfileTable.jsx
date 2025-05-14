/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useLoading } from "../../../Context/LoadingContext";
import config from "../../../utils/config";
import { ChevronDown, Edit2, Filter, X, Search } from "lucide-react";
import Pagination from "../../../Components/Pagination";
import FilterPopover from "../../../Components/FilterPopover";

const FacultyProfileTable = ({ facultyProfiles: initialFacultyProfiles }) => {
    const [facultyProfiles, setFacultyProfiles] = useState(
        initialFacultyProfiles
    );
    const { showLoading, hideLoading } = useLoading();
    const [tabValue, setTabValue] = useState(0);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRank, setFilterRank] = useState();
    const [filterCollege, setFilterCollege] = useState();
    const [filterGender, setFilterGender] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10); // Update pageSize to be stateful
    const [editingCell, setEditingCell] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false); // State for popover visibility

    useEffect(() => {
        const validProfiles = Array.isArray(initialFacultyProfiles)
            ? initialFacultyProfiles.filter(
                  (profile) =>
                      profile && typeof profile === "object" && profile.id
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
            ranks: [
                "",
                ...Array.from(ranks).sort((a, b) => {
                    const numA = parseFloat(a) || 0;
                    const numB = parseFloat(b) || 0;
                    return numA - numB;
                }),
            ],
            colleges: ["", ...Array.from(colleges).sort()],
            genders: ["", ...Array.from(genders).sort()],
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
            },
            {
                field: "on_leave_without_pay",
                headerName: "On Leave?",
                minWidth: 80,
                flex: 1,
                editable: true,
                sortable: false,
            },
            {
                field: "full_time_equivalent",
                headerName: "FTE",
                minWidth: 60,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
            },
            {
                field: "gender",
                headerName: "Gender",
                minWidth: 80,
                flex: 1,
                editable: true,
                sortable: false,
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
            },
            {
                field: "doctorate_with_dissertation",
                headerName: "Doctorate with Dissertation?",
                minWidth: 180,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
            },
            {
                field: "undergrad_lab_credit_units",
                headerName: "Undergrad Lab Credits",
                minWidth: 120,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
            },
            {
                field: "undergrad_lecture_credit_units",
                headerName: "Undergrad Lecture Credits",
                minWidth: 150,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
            },
            {
                field: "undergrad_total_credit_units",
                headerName: "Undergrad Total Credits",
                minWidth: 150,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
            },
            {
                field: "undergrad_lab_hours_per_week",
                headerName: "Undergrad Lab Hrs/Week",
                minWidth: 150,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
            },
            {
                field: "undergrad_lecture_hours_per_week",
                headerName: "Undergrad Lecture Hrs/Week",
                minWidth: 150,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
            },
            {
                field: "undergrad_total_hours_per_week",
                headerName: "Undergrad Total Hrs/Week",
                minWidth: 150,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
            },
            {
                field: "undergrad_lab_contact_hours",
                headerName: "Undergrad Student Contact Lab",
                minWidth: 180,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
            },
            {
                field: "undergrad_lecture_contact_hours",
                headerName: "Undergrad Student Contact Lecture",
                minWidth: 180,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
            },
            {
                field: "undergrad_total_contact_hours",
                headerName: "Undergrad Total Contact Hrs",
                minWidth: 150,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
            },
            {
                field: "graduate_lab_credit_units",
                headerName: "Graduate Lab Credits",
                minWidth: 120,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
            },
            {
                field: "graduate_lecture_credit_units",
                headerName: "Graduate Lecture Credits",
                minWidth: 150,
                editable: true,
                type: "number",
                sortable: false,
            },
            {
                field: "graduate_total_credit_units",
                headerName: "Graduate Total Credits",
                minWidth: 150,
                editable: true,
                type: "number",
                sortable: false,
            },
            {
                field: "graduate_lab_contact_hours",
                headerName: "Graduate Student Contact Lab",
                minWidth: 180,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
            },
            {
                field: "graduate_lecture_contact_hours",
                headerName: "Graduate Student Contact Lecture",
                minWidth: 180,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
            },
            {
                field: "graduate_total_contact_hours",
                headerName: "Graduate Total Contact Hrs",
                minWidth: 150,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
            },
            {
                field: "research_load",
                headerName: "Research Load",
                minWidth: 100,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
            },
            {
                field: "extension_services_load",
                headerName: "Extension Services Load",
                minWidth: 150,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
            },
            {
                field: "study_load",
                headerName: "Study Load",
                minWidth: 100,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
            },
            {
                field: "production_load",
                headerName: "Production Load",
                minWidth: 100,
                editable: true,
                type: "number",
                sortable: false,
            },
            {
                field: "administrative_load",
                headerName: "Administrative Load",
                minWidth: 120,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
            },
            {
                field: "other_load_credits",
                headerName: "Other Load Credits",
                minWidth: 120,
                flex: 1,
                editable: true,
                type: "number",
                sortable: false,
            },
            {
                field: "total_work_load",
                headerName: "Total Work Load",
                minWidth: 120,
                editable: true,
                type: "number",
                sortable: false,
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
                        (filterRank === "Null" &&
                            !profile.generic_faculty_rank)) &&
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

    const handleCellEdit = useCallback(
        async (id, field, value) => {
            showLoading();
            const updatedFacultyProfiles = [...facultyProfiles];
            const profileIndex = updatedFacultyProfiles.findIndex(
                (profile) => profile.id === id
            );
            if (profileIndex === -1) {
                console.error(`Profile with id ${id} not found`);
                hideLoading();
                return;
            }

            const profile = {
                ...updatedFacultyProfiles[profileIndex],
                [field]: value,
            };
            updatedFacultyProfiles[profileIndex] = profile;
            const token = localStorage.getItem("token");

            try {
                await axios.put(
                    `${config.API_URL}/faculty-profiles/${profile.id}`,
                    { [field]: value },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setFacultyProfiles(updatedFacultyProfiles);
                setSnackbarMessage("Faculty profile updated successfully!");
                setSnackbarSeverity("success");
                setSnackbarOpen(true);
            } catch (error) {
                console.error("Error saving changes:", error);
                setSnackbarMessage("Failed to save faculty profile changes.");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
            } finally {
                hideLoading();
                setEditingCell(null);
            }
        },
        [facultyProfiles]
    );

    const handleTabChange = (newValue) => {
        setTabValue(newValue);
        setCurrentPage(1); // Reset pagination on tab change
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

    // Pagination
    const totalRows = data.length;
    const totalPages = Math.ceil(totalRows / pageSize);
    const paginatedData = data.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    return (
        <div className="mt-2 relative">
            {/* Search and Filter - Combined Row */}
            <div className="flex mb-3 flex-wrap gap-2">
                {/* Search Box */}
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
                {/* Filter Button */}
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

            {/* Tabs - Scrollable for mobile */}
            <div className="flex border-b border-gray-200 mb-3 overflow-x-auto hide-scrollbar">
                {[
                    "Personal Info",
                    "Education",
                    "Teaching Load",
                    "Other Loads",
                ].map((label, index) => (
                    <button
                        key={label}
                        onClick={() => handleTabChange(index)}
                        className={`px-4 py-3 text-sm font-semibold whitespace-nowrap transition-all ${
                            tabValue === index
                                ? "text-blue-700 border-b-4 border-blue-700"
                                : "text-gray-700 hover:text-blue-600 hover:border-b-4 hover:border-blue-600"
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Results Summary */}
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
                </p>
            </div>

            {/* Compact Table Container */}
            <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden mb-3 max-h-[40vh] overflow-y-auto">
                {/* Mobile Card View for small screens */}
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
                                                    <div
                                                        className={`${
                                                            column.editable
                                                                ? "cursor-pointer hover:bg-blue-50 hover:rounded px-1"
                                                                : ""
                                                        }`}
                                                        onClick={() =>
                                                            column.editable &&
                                                            setEditingCell({
                                                                rowId: row.id,
                                                                field: column.field,
                                                            })
                                                        }
                                                    >
                                                        {editingCell?.rowId ===
                                                            row.id &&
                                                        editingCell?.field ===
                                                            column.field ? (
                                                            <input
                                                                type={
                                                                    column.type ===
                                                                    "number"
                                                                        ? "number"
                                                                        : "text"
                                                                }
                                                                value={
                                                                    row[
                                                                        column
                                                                            .field
                                                                    ] ?? ""
                                                                }
                                                                onChange={(e) =>
                                                                    setFacultyProfiles(
                                                                        (
                                                                            prev
                                                                        ) =>
                                                                            prev.map(
                                                                                (
                                                                                    p
                                                                                ) =>
                                                                                    p.id ===
                                                                                    row.id
                                                                                        ? {
                                                                                              ...p,
                                                                                              [column.field]:
                                                                                                  e
                                                                                                      .target
                                                                                                      .value,
                                                                                          }
                                                                                        : p
                                                                            )
                                                                    )
                                                                }
                                                                onBlur={() =>
                                                                    handleCellEdit(
                                                                        row.id,
                                                                        column.field,
                                                                        row[
                                                                            column
                                                                                .field
                                                                        ]
                                                                    )
                                                                }
                                                                onKeyDown={(
                                                                    e
                                                                ) => {
                                                                    if (
                                                                        e.key ===
                                                                        "Enter"
                                                                    ) {
                                                                        handleCellEdit(
                                                                            row.id,
                                                                            column.field,
                                                                            row[
                                                                                column
                                                                                    .field
                                                                            ]
                                                                        );
                                                                    }
                                                                }}
                                                                className="w-full px-1.5 py-0.5 text-xs border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                                autoFocus
                                                            />
                                                        ) : (
                                                            <span className="font-medium">
                                                                {row[
                                                                    column.field
                                                                ] !==
                                                                    undefined &&
                                                                row[
                                                                    column.field
                                                                ] !== null
                                                                    ? column.type ===
                                                                      "number"
                                                                        ? Number(
                                                                              row[
                                                                                  column
                                                                                      .field
                                                                              ]
                                                                          ).toLocaleString()
                                                                        : row[
                                                                              column
                                                                                  .field
                                                                          ]
                                                                    : "-"}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                    <div className="mt-2 flex justify-end">
                                        <button
                                            onClick={() => {
                                                // Implement view details functionality
                                                console.log(
                                                    "View details for:",
                                                    row.id
                                                );
                                            }}
                                            className="text-xs text-blue-600 hover:text-blue-800"
                                        >
                                            View details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Table View for larger screens */}
                <div className="hidden sm:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 table-fixed">
                        {/* Column Grouping Headers */}
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

                        {/* Column Headers */}
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
                                            </span>
                                            {column.sortable && (
                                                <ChevronDown className="h-3 w-3 text-gray-400 flex-shrink-0" />
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        {/* Table Body */}
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
                                                className="px-2 py-1.5 text-xs text-gray-900 border-r border-gray-200"
                                            >
                                                {editingCell?.rowId ===
                                                    row.id &&
                                                editingCell?.field ===
                                                    column.field ? (
                                                    <input
                                                        type={
                                                            column.type ===
                                                            "number"
                                                                ? "number"
                                                                : "text"
                                                        }
                                                        value={
                                                            row[column.field] ??
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            setFacultyProfiles(
                                                                (prev) =>
                                                                    prev.map(
                                                                        (p) =>
                                                                            p.id ===
                                                                            row.id
                                                                                ? {
                                                                                      ...p,
                                                                                      [column.field]:
                                                                                          e
                                                                                              .target
                                                                                              .value,
                                                                                  }
                                                                                : p
                                                                    )
                                                            )
                                                        }
                                                        onBlur={() =>
                                                            handleCellEdit(
                                                                row.id,
                                                                column.field,
                                                                row[
                                                                    column.field
                                                                ]
                                                            )
                                                        }
                                                        onKeyDown={(e) => {
                                                            if (
                                                                e.key ===
                                                                "Enter"
                                                            ) {
                                                                handleCellEdit(
                                                                    row.id,
                                                                    column.field,
                                                                    row[
                                                                        column
                                                                            .field
                                                                    ]
                                                                );
                                                            }
                                                        }}
                                                        className="w-full px-1.5 py-0.5 text-xs border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                        autoFocus
                                                    />
                                                ) : (
                                                    <div className="group relative">
                                                        <div
                                                            onClick={() =>
                                                                column.editable &&
                                                                setEditingCell({
                                                                    rowId: row.id,
                                                                    field: column.field,
                                                                })
                                                            }
                                                            className={`truncate ${
                                                                column.editable
                                                                    ? "cursor-pointer group-hover:bg-blue-50 group-hover:rounded px-1.5 py-0.5"
                                                                    : ""
                                                            }`}
                                                        >
                                                            {row[
                                                                column.field
                                                            ] !== undefined &&
                                                            row[
                                                                column.field
                                                            ] !== null
                                                                ? column.type ===
                                                                  "number"
                                                                    ? Number(
                                                                          row[
                                                                              column
                                                                                  .field
                                                                          ]
                                                                      ).toLocaleString()
                                                                    : row[
                                                                          column
                                                                              .field
                                                                      ]
                                                                : "-"}

                                                            {column.editable && (
                                                                <Edit2 className="w-2.5 h-2.5 text-blue-500 opacity-0 group-hover:opacity-100 absolute right-0.5 top-1/2 transform -translate-y-1/2" />
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
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

            {/* Snackbar */}
            {snackbarOpen && (
                <div
                    className={`fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-auto sm:max-w-xs p-3 rounded-md shadow-lg z-50 flex items-center justify-between ${
                        snackbarSeverity === "success"
                            ? "bg-green-50 border border-green-200"
                            : "bg-red-50 border border-red-200"
                    }`}
                >
                    <div
                        className={`text-xs sm:text-sm ${
                            snackbarSeverity === "success"
                                ? "text-green-700"
                                : "text-red-700"
                        }`}
                    >
                        {snackbarMessage}
                    </div>
                    <button
                        onClick={() => setSnackbarOpen(false)}
                        className="p-1 rounded-full hover:bg-gray-200"
                    >
                        <X className="w-4 h-4 text-gray-500" />
                    </button>
                </div>
            )}

            {/* Add CSS for hiding scrollbars but allowing scrolling */}
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

FacultyProfileTable.propTypes = {
    facultyProfiles: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            name: PropTypes.string,
            generic_faculty_rank: PropTypes.string,
            home_college: PropTypes.string,
            home_department: PropTypes.string,
            is_tenured: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
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
