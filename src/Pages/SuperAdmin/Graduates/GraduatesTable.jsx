import React, { useState } from "react";
import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.min.css";
import {
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";

const GraduatesTable = ({ graduates }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [sexFilter, setSexFilter] = useState("");
    const [yearFilter, setYearFilter] = useState("");

    // Get unique years for the year filter dropdown
    const uniqueYears = [
        ...new Set(graduates.map((g) => g.year_granted).filter(Boolean)),
    ].sort();

    // Filter graduates based on search term and selection filters
    const filteredGraduates = graduates.filter((graduate) => {
        const term = searchTerm.toLowerCase();
        const matchesSearch =
            !searchTerm ||
            (graduate.student_id &&
                graduate.student_id.toLowerCase().includes(term)) ||
            (graduate.first_name &&
                graduate.first_name.toLowerCase().includes(term)) ||
            (graduate.last_name &&
                graduate.last_name.toLowerCase().includes(term)) ||
            (graduate.program_name &&
                graduate.program_name.toLowerCase().includes(term));

        const matchesSex = !sexFilter || graduate.sex === sexFilter;
        const matchesYear =
            !yearFilter || String(graduate.year_granted) === yearFilter;

        return matchesSearch && matchesSex && matchesYear;
    });

    const hotSettings = {
        data: filteredGraduates, // Use filtered graduates
        columns: [
            { data: "student_id", title: "Student ID" },
            { data: "last_name", title: "Last Name" },
            { data: "first_name", title: "First Name" },
            { data: "middle_name", title: "Middle Name" },
            { data: "sex", title: "Sex", type: "dropdown", source: ["M", "F"] },
            {
                data: "date_of_birth",
                title: "Date of Birth",
                type: "date",
                dateFormat: "MM/DD/YYYY",
                correctFormat: true,
            },
            {
                data: "date_graduated",
                title: "Date Graduated",
                type: "date",
                dateFormat: "MM/DD/YYYY",
                correctFormat: true,
            },
            { data: "program_name", title: "Program Name" },
            { data: "program_major", title: "Program Major" },
            {
                data: "program_authority_to_operate_graduate",
                title: "Program Authority",
            },
            { data: "year_granted", title: "Year Granted", type: "numeric" },
        ],
        colHeaders: true,
        rowHeaders: true,
        stretchH: "all",
        height: 400,
        licenseKey: "non-commercial-and-evaluation",
    };

    return (
        <Box sx={{ mb: 2 }}>
            {/* Filter Controls */}
            <Box sx={{ mb: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
                <TextField
                    placeholder="Search ID, Name, Program"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    variant="outlined"
                    size="small"
                    sx={{ flex: 1, minWidth: 150 }}
                />
                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel size="small" sx={{ fontSize: "0.9rem" }}>Sex</InputLabel>
                    <Select
                        value={sexFilter}
                        onChange={(e) => setSexFilter(e.target.value)}
                        label="Sex"
                        size="small"
                    >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="M">Male</MenuItem>
                        <MenuItem value="F">Female</MenuItem>
                    </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel size="small" sx={{ fontSize: "0.9rem" }}>Year</InputLabel>
                    <Select
                        value={yearFilter}
                        onChange={(e) => setYearFilter(e.target.value)}
                        label="Year"
                        size="small"
                    >
                        <MenuItem value="">All</MenuItem>
                        {uniqueYears.map((year) => (
                            <MenuItem key={year} value={String(year)}>
                                {year}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* Table */}
            <HotTable settings={hotSettings} />
        </Box>
    );
};

export default GraduatesTable;
