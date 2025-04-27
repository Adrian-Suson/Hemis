/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useMemo, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { CircularProgress, Box, Tabs, Tab, Paper, Alert } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import config from "../../../utils/config";

const ROWS_PER_PAGE_OPTIONS = [25, 50, 100, -1];

const ProgramTables = ({ programs, loading, fetchPrograms }) => {
    const [subTabValue, setSubTabValue] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        const savedTab = localStorage.getItem("selectedSubTab");
        if (savedTab !== null) {
            setSubTabValue(Number(savedTab));
        }
    }, []);

    // Data validation function aligned with backend
    const validateProgramData = (data) => {
        const errors = [];
        if (!data.program_name || data.program_name.length > 255) {
            errors.push(
                "Program name must be a string between 1 and 255 characters."
            );
        }
        if (!data.institution_id) {
            errors.push("Institution ID is required.");
        }
        if (!data.program_type) {
            errors.push("Program type is required.");
        }
        // Validate string fields
        [
            "is_thesis_dissertation_required",
            "program_status",
            "calendar_use_code",
            "Year",
            "category",
            "serial",
        ].forEach((field) => {
            if (
                data[field] &&
                (typeof data[field] !== "string" || data[field].length > 255)
            ) {
                errors.push(
                    `${field} must be a string with max 255 characters or null.`
                );
            }
        });
        // Validate numeric fields
        [
            "lab_units",
            "lecture_units",
            "total_units",
            "tuition_per_unit",
            "program_fee",
            "new_students_freshmen_male",
            "new_students_freshmen_female",
            "1st_year_male",
            "1st_year_female",
            "2nd_year_male",
            "2nd_year_female",
            "3rd_year_male",
            "3rd_year_female",
            "4th_year_male",
            "4th_year_female",
            "5th_year_male",
            "5th_year_female",
            "6th_year_male",
            "6th_year_female",
            "7th_year_male",
            "7th_year_female",
            "subtotal_male",
            "subtotal_female",
            "grand_total",
            "lecture_units_actual",
            "laboratory_units_actual",
            "total_units_actual",
            "graduates_males",
            "graduates_females",
            "graduates_total",
            "externally_funded_merit_scholars",
            "internally_funded_grantees",
            "suc_funded_grantees",
            "program_normal_length_in_years",
        ].forEach((field) => {
            if (
                data[field] !== null &&
                (isNaN(data[field]) || data[field] < 0)
            ) {
                errors.push(`${field} must be a non-negative number or null.`);
            }
        });
        return errors.length ? errors : null;
    };

    const columnConfigs = useMemo(
        () => ({
            0: {
                columns: [
                    {
                        field: "program_name",
                        headerName: "Name",
                        flex: 2,
                        editable: true,
                        renderCell: (params) =>
                            params.value !== null && params.value !== undefined
                                ? params.value
                                : "-",
                    },
                    {
                        field: "program_code",
                        headerName: "Code",
                        flex: 1,
                        editable: true,
                        renderCell: (params) =>
                            params.value !== null && params.value !== undefined
                                ? params.value
                                : "-",
                    },
                    {
                        field: "major_name",
                        headerName: "Name",
                        flex: 1,
                        editable: true,
                        renderCell: (params) =>
                            params.value !== null && params.value !== undefined
                                ? params.value
                                : "-",
                    },
                    {
                        field: "major_code",
                        headerName: "Code",
                        flex: 1,
                        editable: true,
                        renderCell: (params) =>
                            params.value !== null && params.value !== undefined
                                ? params.value
                                : "-",
                    },
                    {
                        field: "category",
                        headerName: "Category",
                        flex: 1,
                        editable: true,
                        renderCell: (params) =>
                            params.value !== null && params.value !== undefined
                                ? params.value
                                : "-",
                    },
                    {
                        field: "serial",
                        headerName: "Serial",
                        flex: 1,
                        editable: true,
                        renderCell: (params) =>
                            params.value !== null && params.value !== undefined
                                ? params.value
                                : "-",
                    },
                    {
                        field: "Year",
                        headerName: "Year",
                        flex: 1,
                        editable: true,
                        renderCell: (params) =>
                            params.value !== null && params.value !== undefined
                                ? params.value
                                : "-",
                    },
                    {
                        field: "is_thesis_dissertation_required",
                        headerName: "Thesis/Dissertation",
                        flex: 1,
                        editable: true,
                        renderCell: (params) =>
                            params.value !== null && params.value !== undefined
                                ? params.value
                                : "-",
                    },
                    {
                        field: "program_status",
                        headerName: "Status",
                        flex: 1,
                        editable: true,
                        renderCell: (params) =>
                            params.value !== null && params.value !== undefined
                                ? params.value
                                : "-",
                    },
                    {
                        field: "calendar_use_code",
                        headerName: "Calendar",
                        flex: 1,
                        editable: true,
                        renderCell: (params) =>
                            params.value !== null && params.value !== undefined
                                ? params.value
                                : "-",
                    },
                    {
                        field: "program_normal_length_in_years",
                        headerName: "Length",
                        flex: 1,
                        editable: true,
                        type: "number",
                        align: "center",
                        headerAlign: "center",
                        renderCell: (params) =>
                            params.value !== null && params.value !== undefined
                                ? params.value
                                : "-",
                    },
                    {
                        field: "lab_units",
                        headerName: "Lab Units",
                        flex: 1,
                        editable: true,
                        type: "number",
                        align: "center",
                        headerAlign: "center",
                        renderCell: (params) =>
                            params.value !== null && params.value !== undefined
                                ? params.value
                                : "-",
                    },
                    {
                        field: "lecture_units",
                        headerName: "Lecture Units",
                        flex: 1,
                        editable: true,
                        type: "number",
                        align: "center",
                        headerAlign: "center",
                        renderCell: (params) =>
                            params.value !== null && params.value !== undefined
                                ? params.value
                                : "-",
                    },
                    {
                        field: "total_units",
                        headerName: "Total Units",
                        flex: 1,
                        editable: false,
                        type: "number",
                        align: "center",
                        headerAlign: "center",
                        renderCell: (params) =>
                            params.value !== null && params.value !== undefined
                                ? params.value
                                : "-",
                    },
                    {
                        field: "tuition_per_unit",
                        headerName: "Tuition/Unit",
                        flex: 1,
                        editable: true,
                        type: "number",
                        align: "center",
                        headerAlign: "center",
                        renderCell: (params) =>
                            params.value !== null && params.value !== undefined
                                ? params.value
                                : "-",
                    },
                    {
                        field: "program_fee",
                        headerName: "Program Fee",
                        flex: 1,
                        editable: true,
                        type: "number",
                        align: "center",
                        headerAlign: "center",
                        renderCell: (params) =>
                            params.value !== null && params.value !== undefined
                                ? params.value
                                : "-",
                    },
                ],
                columnGroupingModel: [
                    {
                        groupId: "CURRICULAR PROGRAM",
                        headerName: "CURRICULAR PROGRAM",
                        children: [
                            { field: "program_name" },
                            { field: "program_code" },
                        ],
                    },
                    {
                        groupId: "MAJOR",
                        headerName: "MAJOR",
                        children: [
                            { field: "major_name" },
                            { field: "major_code" },
                        ],
                    },
                    {
                        groupId: "AUTHORITY TO OFFER PROGRAM",
                        headerName: "AUTHORITY TO OFFER PROGRAM",
                        children: [
                            { field: "category" },
                            { field: "serial" },
                            { field: "Year" },
                        ],
                    },
                    {
                        groupId: "status3",
                        headerName: "",
                        children: [
                            { field: "is_thesis_dissertation_required" },
                            { field: "program_status" },
                            { field: "calendar_use_code" },
                            { field: "program_normal_length_in_years" },
                        ],
                    },
                    {
                        groupId: "PROGRAM UNITS EXCLUDING THESIS",
                        headerName: "PROGRAM UNITS EXCLUDING THESIS",
                        children: [
                            { field: "lab_units" },
                            { field: "lecture_units" },
                            { field: "total_units" },
                        ],
                    },
                    {
                        groupId: "FINANCIAL INFORMATION",
                        headerName: "FINANCIAL INFORMATION",
                        children: [
                            { field: "tuition_per_unit" },
                            { field: "program_fee" },
                        ],
                    },
                ],
            },
            1: {
                columns: [
                    {
                        field: "program_name",
                        headerName: "Program Name",
                        flex: 2,
                        editable: false,
                        renderCell: (params) =>
                            params.value !== null && params.value !== undefined
                                ? params.value
                                : "-",
                    },
                    {
                        field: "new_students_freshmen_male",
                        headerName: "Freshmen M",
                        flex: 1,
                        editable: true,
                        type: "number",
                        align: "center",
                        headerAlign: "center",
                        renderCell: (params) =>
                            params.value !== null && params.value !== undefined
                                ? params.value
                                : "-",
                    },
                    {
                        field: "new_students_freshmen_female",
                        headerName: "Freshmen F",
                        flex: 1,
                        editable: true,
                        type: "number",
                        align: "center",
                        headerAlign: "center",
                        renderCell: (params) =>
                            params.value !== null && params.value !== undefined
                                ? params.value
                                : "-",
                    },
                    {
                        field: "1st_year_male",
                        headerName: "Male",
                        flex: 1,
                        editable: true,
                        type: "number",
                        align: "center",
                        headerAlign: "center",
                        renderCell: (params) =>
                            params.value !== null && params.value !== undefined
                                ? params.value
                                : "-",
                    },
                    {
                        field: "1st_year_female",
                        headerName: "Female",
                        flex: 1,
                        editable: true,
                        type: "number",
                        align: "center",
                        headerAlign: "center",
                        renderCell: (params) =>
                            params.value !== null && params.value !== undefined
                                ? params.value
                                : "-",
                    },
                    {
                        field: "2nd_year_male",
                        headerName: "Male",
                        flex: 1,
                        editable: true,
                        type: "number",
                        align: "center",
                        headerAlign: "center",
                        renderCell: (params) =>
                            params.value !== null && params.value !== undefined
                                ? params.value
                                : "-",
                    },
                    {
                        field: "2nd_year_female",
                        headerName: "Female",
                        flex: 1,
                        editable: true,
                        type: "number",
                        align: "center",
                        headerAlign: "center",
                        renderCell: (params) =>
                            params.value !== null && params.value !== undefined
                                ? params.value
                                : "-",
                    },
                    {
                        field: "3rd_year_male",
                        headerName: "Male",
                        flex: 1,
                        editable: true,
                        type: "number",
                        align: "center",
                        headerAlign: "center",
                        renderCell: (params) =>
                            params.value !== null && params.value !== undefined
                                ? params.value
                                : "-",
                    },
                    {
                        field: "3rd_year_female",
                        headerName: "Female",
                        flex: 1,
                        editable: true,
                        type: "number",
                        align: "center",
                        headerAlign: "center",
                        renderCell: (params) =>
                            params.value !== null && params.value !== undefined
                                ? params.value
                                : "-",
                    },
                    {
                        field: "4th_year_male",
                        headerName: "Male",
                        flex: 1,
                        editable: true,
                        type: "number",
                        align: "center",
                        headerAlign: "center",
                        renderCell: (params) =>
                            params.value !== null && params.value !== undefined
                                ? params.value
                                : "-",
                    },
                    {
                        field: "4th_year_female",
                        headerName: "Female",
                        flex: 1,
                        editable: true,
                        type: "number",
                        align: "center",
                        headerAlign: "center",
                        renderCell: (params) =>
                            params.value !== null && params.value !== undefined
                                ? params.value
                                : "-",
                    },
                    {
                        field: "5th_year_male",
                        headerName: "Male",
                        flex: 1,
                        editable: true,
                        type: "number",
                        align: "center",
                        headerAlign: "center",
                        renderCell: (params) =>
                            params.value !== null && params.value !== undefined
                                ? params.value
                                : "-",
                    },
                    {
                        field: "5th_year_female",
                        headerName: "Female",
                        flex: 1,
                        editable: true,
                        type: "number",
                        align: "center",
                        headerAlign: "center",
                        renderCell: (params) =>
                            params.value !== null && params.value !== undefined
                                ? params.value
                                : "-",
                    },
                    {
                        field: "6th_year_male",
                        headerName: "Male",
                        flex: 1,
                        editable: true,
                        type: "number",
                        align: "center",
                        headerAlign: "center",
                        renderCell: (params) =>
                            params.value !== null && params.value !== undefined
                                ? params.value
                                : "-",
                    },
                    {
                        field: "6th_year_female",
                        headerName: "Female",
                        flex: 1,
                        editable: true,
                        type: "number",
                        align: "center",
                        headerAlign: "center",
                        renderCell: (params) =>
                            params.value !== null && params.value !== undefined
                                ? params.value
                                : "-",
                    },
                    {
                        field: "7th_year_male",
                        headerName: "Male",
                        flex: 1,
                        editable: true,
                        type: "number",
                        align: "center",
                        headerAlign: "center",
                        renderCell: (params) =>
                            params.value !== null && params.value !== undefined
                                ? params.value
                                : "-",
                    },
                    {
                        field: "7th_year_female",
                        headerName: "Female",
                        flex: 1,
                        editable: true,
                        type: "number",
                        align: "center",
                        headerAlign: "center",
                        renderCell: (params) =>
                            params.value !== null && params.value !== undefined
                                ? params.value
                                : "-",
                    },
                    {
                        field: "subtotal_male",
                        headerName: "Subtotal M",
                        flex: 1,
                        editable: false,
                        type: "number",
                        align: "center",
                        headerAlign: "center",
                        renderCell: (params) =>
                            params.value !== null && params.value !== undefined
                                ? params.value
                                : "-",
                    },
                    {
                        field: "subtotal_female",
                        headerName: "Subtotal F",
                        flex: 1,
                        editable: false,
                        type: "number",
                        align: "center",
                        headerAlign: "center",
                        renderCell: (params) =>
                            params.value !== null && params.value !== undefined
                                ? params.value
                                : "-",
                    },
                    {
                        field: "grand_total",
                        headerName: "Total",
                        flex: 1,
                        editable: false,
                        type: "number",
                        align: "center",
                        headerAlign: "center",
                        renderCell: (params) =>
                            params.value !== null && params.value !== undefined
                                ? params.value
                                : "-",
                    },
                ],
                columnGroupingModel: [
                    {
                        groupId: "Program Name",
                        headerName: "Program Name",
                        children: [{ field: "program_name" }],
                    },
                    {
                        groupId: "First Year",
                        headerName: "First Year",
                        children: [
                            { field: "new_students_freshmen_male" },
                            { field: "new_students_freshmen_female" },
                            { field: "1st_year_male" },
                            { field: "1st_year_female" },
                        ],
                    },
                    {
                        groupId: "Second Year",
                        headerName: "Second Year",
                        children: [
                            { field: "2nd_year_male" },
                            { field: "2nd_year_female" },
                        ],
                    },
                    {
                        groupId: "Third Year",
                        headerName: "Third Year",
                        children: [
                            { field: "3rd_year_male" },
                            { field: "3rd_year_female" },
                        ],
                    },
                    {
                        groupId: "Fourth Year",
                        headerName: "Fourth Year",
                        children: [
                            { field: "4th_year_male" },
                            { field: "4th_year_female" },
                        ],
                    },
                    {
                        groupId: "Fifth Year",
                        headerName: "Fifth Year",
                        children: [
                            { field: "5th_year_male" },
                            { field: "5th_year_female" },
                        ],
                    },
                    {
                        groupId: "Sixth Year",
                        headerName: "Sixth Year",
                        children: [
                            { field: "6th_year_male" },
                            { field: "6th_year_female" },
                        ],
                    },
                    {
                        groupId: "Seventh Year",
                        headerName: "Seventh Year",
                        children: [
                            { field: "7th_year_male" },
                            { field: "7th_year_female" },
                        ],
                    },
                    {
                        groupId: "Totals",
                        headerName: "Totals",
                        children: [
                            { field: "subtotal_male" },
                            { field: "subtotal_female" },
                            { field: "grand_total" },
                        ],
                    },
                ],
            },
            2: {
                columns: [
                    {
                        field: "program_name",
                        headerName: "Program Name",
                        flex: 2,
                        editable: false,
                        renderCell: (params) =>
                            params.value !== null && params.value !== undefined
                                ? params.value
                                : "-",
                    },
                    {
                        field: "lecture_units_actual",
                        headerName: "Lecture Units",
                        flex: 1,
                        editable: true,
                        type: "number",
                        align: "center",
                        headerAlign: "center",
                        renderCell: (params) =>
                            params.value !== null && params.value !== undefined
                                ? params.value
                                : "-",
                    },
                    {
                        field: "laboratory_units_actual",
                        headerName: "Lab Units",
                        flex: 1,
                        editable: true,
                        type: "number",
                        align: "center",
                        headerAlign: "center",
                        renderCell: (params) =>
                            params.value !== null && params.value !== undefined
                                ? params.value
                                : "-",
                    },
                    {
                        field: "total_units_actual",
                        headerName: "Total Units",
                        flex: 1,
                        editable: false,
                        type: "number",
                        align: "center",
                        headerAlign: "center",
                        renderCell: (params) =>
                            params.value !== null && params.value !== undefined
                                ? params.value
                                : "-",
                    },
                    {
                        field: "graduates_males",
                        headerName: "Grads M",
                        flex: 1,
                        editable: true,
                        type: "number",
                        align: "center",
                        headerAlign: "center",
                        renderCell: (params) =>
                            params.value !== null && params.value !== undefined
                                ? params.value
                                : "-",
                    },
                    {
                        field: "graduates_females",
                        headerName: "Grads F",
                        flex: 1,
                        editable: true,
                        type: "number",
                        align: "center",
                        headerAlign: "center",
                        renderCell: (params) =>
                            params.value !== null && params.value !== undefined
                                ? params.value
                                : "-",
                    },
                    {
                        field: "graduates_total",
                        headerName: "Grads Total",
                        flex: 1,
                        editable: false,
                        type: "number",
                        align: "center",
                        headerAlign: "center",
                        renderCell: (params) =>
                            params.value !== null && params.value !== undefined
                                ? params.value
                                : "-",
                    },
                    {
                        field: "externally_funded_merit_scholars",
                        headerName: "Ext Scholars",
                        flex: 1,
                        editable: true,
                        type: "number",
                        align: "center",
                        headerAlign: "center",
                        renderCell: (params) =>
                            params.value !== null && params.value !== undefined
                                ? params.value
                                : "-",
                    },
                    {
                        field: "internally_funded_grantees",
                        headerName: "Int Grantees",
                        flex: 1,
                        editable: true,
                        type: "number",
                        align: "center",
                        headerAlign: "center",
                        renderCell: (params) =>
                            params.value !== null && params.value !== undefined
                                ? params.value
                                : "-",
                    },
                    {
                        field: "suc_funded_grantees",
                        headerName: "SUC Grantees",
                        flex: 1,
                        editable: true,
                        type: "number",
                        align: "center",
                        headerAlign: "center",
                        renderCell: (params) =>
                            params.value !== null && params.value !== undefined
                                ? params.value
                                : "-",
                    },
                ],
                columnGroupingModel: [
                    {
                        groupId: "Program Name",
                        headerName: "Program Name",
                        children: [{ field: "program_name" }],
                    },
                    {
                        groupId: "Units",
                        headerName: "Units",
                        children: [
                            { field: "lecture_units_actual" },
                            { field: "laboratory_units_actual" },
                            { field: "total_units_actual" },
                        ],
                    },
                    {
                        groupId: "Graduates",
                        headerName: "Graduates",
                        children: [
                            { field: "graduates_males" },
                            { field: "graduates_females" },
                            { field: "graduates_total" },
                        ],
                    },
                    {
                        groupId: "Scholars & Grantees",
                        headerName: "Scholars & Grantees",
                        children: [
                            { field: "externally_funded_merit_scholars" },
                            { field: "internally_funded_grantees" },
                            { field: "suc_funded_grantees" },
                        ],
                    },
                ],
            },
        }),
        [programs]
    );

    const handleCellEditStop = useCallback(
        async (params) => {
            const { id, field, value } = params;
            const token = localStorage.getItem("token");
            if (!token) {
                setError(
                    "Authentication token is missing. Please log in again."
                );
                return;
            }

            const updatedPrograms = [...programs];
            const programIndex = updatedPrograms.findIndex((p) => p.id === id);
            if (programIndex === -1) {
                setError(`Program with id ${id} not found.`);
                return;
            }

            const originalProgram = { ...updatedPrograms[programIndex] };
            updatedPrograms[programIndex][field] = value;

            // Recalculate totals
            if (subTabValue === 0) {
                updatedPrograms[programIndex].total_units =
                    (parseFloat(updatedPrograms[programIndex].lab_units) || 0) +
                    (parseFloat(updatedPrograms[programIndex].lecture_units) ||
                        0);
            } else if (subTabValue === 1) {
                const maleFields = [
                    "new_students_freshmen_male",
                    "1st_year_male",
                    "2nd_year_male",
                    "3rd_year_male",
                    "4th_year_male",
                    "5th_year_male",
                    "6th_year_male",
                    "7th_year_male",
                ];
                const femaleFields = [
                    "new_students_freshmen_female",
                    "1st_year_female",
                    "2nd_year_female",
                    "3rd_year_female",
                    "4th_year_female",
                    "5th_year_female",
                    "6th_year_female",
                    "7th_year_female",
                ];
                updatedPrograms[programIndex].subtotal_male = maleFields.reduce(
                    (sum, field) =>
                        sum +
                        (parseFloat(updatedPrograms[programIndex][field]) || 0),
                    0
                );
                updatedPrograms[programIndex].subtotal_female =
                    femaleFields.reduce(
                        (sum, field) =>
                            sum +
                            (parseFloat(updatedPrograms[programIndex][field]) ||
                                0),
                        0
                    );
                updatedPrograms[programIndex].grand_total =
                    updatedPrograms[programIndex].subtotal_male +
                    updatedPrograms[programIndex].subtotal_female;
            } else if (subTabValue === 2) {
                updatedPrograms[programIndex].total_units_actual =
                    (parseFloat(
                        updatedPrograms[programIndex].lecture_units_actual
                    ) || 0) +
                    (parseFloat(
                        updatedPrograms[programIndex].laboratory_units_actual
                    ) || 0);
                updatedPrograms[programIndex].graduates_total =
                    (parseFloat(
                        updatedPrograms[programIndex].graduates_males
                    ) || 0) +
                    (parseFloat(
                        updatedPrograms[programIndex].graduates_females
                    ) || 0);
            }

            // Validate data
            const validationErrors = validateProgramData(
                updatedPrograms[programIndex]
            );
            if (validationErrors) {
                setError(`Validation failed: ${validationErrors.join(", ")}`);
                updatedPrograms[programIndex] = originalProgram;
                return;
            }

            try {
                await axios.put(
                    `${config.API_URL}/programs/${id}`,
                    updatedPrograms[programIndex],
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setError(null);
                fetchPrograms();
            } catch (error) {
                updatedPrograms[programIndex] = originalProgram;
                const errorMessage =
                    error.response?.data?.error ||
                    "Failed to update program. Changes have been reverted.";
                setError(errorMessage);
                console.error("Error updating program:", error);
            }
        },
        [programs, subTabValue, fetchPrograms]
    );

    if (loading) return <CircularProgress />;

    const currentConfig = columnConfigs[subTabValue] || columnConfigs[0];

    return (
        <Box sx={{ mt: 2, position: "relative" }}>
            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    onClose={() => setError(null)}
                >
                    {error}
                </Alert>
            )}
            <Paper sx={{ borderRadius: 1 }}>
                <Tabs
                    value={subTabValue}
                    onChange={(e, newValue) => {
                        setSubTabValue(newValue);
                        localStorage.setItem("selectedSubTab", newValue);
                    }}
                    aria-label="program sub-tabs"
                    variant="fullWidth"
                    sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                        "& .MuiTab-root": {
                            fontSize: "0.875rem",
                            fontWeight: "medium",
                        },
                    }}
                >
                    <Tab label="Programs" />
                    <Tab label="Enrollments" />
                    <Tab label="Statistics" />
                </Tabs>
            </Paper>
            <Paper
                sx={{
                    borderRadius: 1,
                    display: "flex",
                    flexDirection: "column",
                    height: {
                        xs: "20vh",
                        sm: "30vh",
                        md: "50vh",
                    },
                    overflow: "hidden",
                }}
            >
                <DataGrid
                    rows={programs}
                    columns={currentConfig.columns}
                    editMode="cell"
                    onCellEditStop={handleCellEditStop}
                    columnGroupingModel={currentConfig.columnGroupingModel}
                    experimentalFeatures={{ columnGrouping: true }}
                    disableColumnFilter
                    disableColumnMenu
                    disableColumnSorting
                    density="compact"
                    sx={{
                        border: 0,
                        "& .MuiDataGrid-root": {
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                        },
                        "& .MuiDataGrid-main": {
                            flex: 1,
                            overflow: "auto",
                        },
                        "& .MuiDataGrid-footerContainer": {
                            borderTop: 1,
                            borderColor: "divider",
                            position: "sticky",
                            bottom: 0,
                            backgroundColor: "background.paper",
                            zIndex: 1,
                        },
                        "& .MuiDataGrid-columnSeparator": {
                            visibility: "visible",
                            color: "rgba(0, 0, 0, 0.2)",
                            pointerEvents: "none", // disable manual resize
                            display: "none",
                        },
                        "& .MuiDataGrid-cell": {
                            borderRight: "1px solid",
                            borderColor: "divider",
                        },
                        "& .MuiDataGrid-columnHeader": {
                            borderRight: "1px solid",
                            borderColor: "divider",
                        },
                    }}
                    disableRowSelectionOnClick
                    initialState={{
                        pagination: { paginationModel: { pageSize: 25 } },
                    }}
                    pageSizeOptions={ROWS_PER_PAGE_OPTIONS}
                    getRowId={(row) => row.id}
                />
            </Paper>
        </Box>
    );
};

ProgramTables.propTypes = {
    programs: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            program_name: PropTypes.string.isRequired,
            program_code: PropTypes.number,
            major_name: PropTypes.string,
            major_code: PropTypes.number,
            category: PropTypes.string,
            serial: PropTypes.string,
            Year: PropTypes.string,
            is_thesis_dissertation_required: PropTypes.string,
            program_status: PropTypes.string,
            calendar_use_code: PropTypes.string,
            program_normal_length_in_years: PropTypes.number,
            lab_units: PropTypes.number,
            lecture_units: PropTypes.number,
            total_units: PropTypes.number,
            tuition_per_unit: PropTypes.number,
            program_fee: PropTypes.number,
            program_type: PropTypes.string,
            new_students_freshmen_male: PropTypes.number,
            new_students_freshmen_female: PropTypes.number,
            "1st_year_male": PropTypes.number,
            "1st_year_female": PropTypes.number,
            "2nd_year_male": PropTypes.number,
            "2nd_year_female": PropTypes.number,
            "3rd_year_male": PropTypes.number,
            "3rd_year_female": PropTypes.number,
            "4th_year_male": PropTypes.number,
            "4th_year_female": PropTypes.number,
            "5th_year_male": PropTypes.number,
            "5th_year_female": PropTypes.number,
            "6th_year_male": PropTypes.number,
            "6th_year_female": PropTypes.number,
            "7th_year_male": PropTypes.number,
            "7th_year_female": PropTypes.number,
            subtotal_male: PropTypes.number,
            subtotal_female: PropTypes.number,
            grand_total: PropTypes.number,
            lecture_units_actual: PropTypes.number,
            laboratory_units_actual: PropTypes.number,
            total_units_actual: PropTypes.number,
            graduates_males: PropTypes.number,
            graduates_females: PropTypes.number,
            graduates_total: PropTypes.number,
            externally_funded_merit_scholars: PropTypes.number,
            internally_funded_grantees: PropTypes.number,
            suc_funded_grantees: PropTypes.number,
        })
    ).isRequired,
    loading: PropTypes.bool.isRequired,
    fetchPrograms: PropTypes.func,
};

export default ProgramTables;
