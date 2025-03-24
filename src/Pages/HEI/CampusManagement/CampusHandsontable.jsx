import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.min.css";
import { useMemo, useState, useCallback, useEffect } from "react";
import { registerAllModules } from "handsontable/registry";
import PropTypes from "prop-types";
import axios from "axios";
import { Button } from "@mui/material";

// Register all Handsontable modules (including numeric cell type)
registerAllModules();

const CampusHandsontable = ({ campuses: initialCampuses }) => {
    const [campuses, setCampuses] = useState(initialCampuses);

    // Sync local state with prop changes
    useEffect(() => {
        setCampuses(initialCampuses);
    }, [initialCampuses]);

    // Define column headers and data mapping
    const columns = useMemo(
        () => [
            { data: "suc_name", title: "Campus Name" },
            { data: "campus_type", title: "Type" },
            { data: "institutional_code", title: "Code" },
            { data: "region", title: "Region" },
            { data: "municipality_city_province", title: "City/Province" },
            { data: "former_name", title: "Former Name" },
            { data: "year_first_operation", title: "Established" },
            {
                data: "land_area_hectares",
                title: "Land Area (ha)",
                type: "numeric",
            },
            {
                data: "distance_from_main",
                title: "Distance (km)",
                type: "numeric",
            },
            { data: "autonomous_code", title: "Auto Code" },
            { data: "position_title", title: "Position" },
            { data: "head_full_name", title: "Head" },
            {
                data: "latitude_coordinates",
                title: "Latitude",
                type: "numeric",
            },
            {
                data: "longitude_coordinates",
                title: "Longitude",
                type: "numeric",
            },
        ],
        []
    );

    // Prepare data for Handsontable
    const data = useMemo(() => {
        const mappedData = campuses.map((campus) => ({
            suc_name: campus.suc_name || "",
            campus_type: campus.campus_type || "",
            institutional_code: campus.institutional_code || "",
            region: campus.region || "",
            municipality_city_province: campus.municipality_city_province || "",
            former_name: campus.former_name || "",
            year_first_operation: campus.year_first_operation || "",
            land_area_hectares: campus.land_area_hectares || 0.0,
            distance_from_main: campus.distance_from_main || 0.0,
            autonomous_code: campus.autonomous_code || "",
            position_title: campus.position_title || "",
            head_full_name: campus.head_full_name || "",
            latitude_coordinates: campus.latitude_coordinates || 0.0,
            longitude_coordinates: campus.longitude_coordinates || 0.0,
        }));
        console.log("Handsontable Data:", mappedData); // Debug log
        return mappedData;
    }, [campuses]);

    // Handle changes in the table
    const handleChanges = useCallback(
        async (changes, source) => {
            if (!changes || source === "loadData") return;

            const updatedCampuses = [...campuses];
            const token = localStorage.getItem("token");

            for (const [row, prop, , newValue] of changes) {
                const campus = updatedCampuses[row];
                campus[prop] = newValue;

                try {
                    if (campus.id) {
                        await axios.put(
                            `http://localhost:8000/api/campuses/${campus.id}`,
                            campus,
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                    } else {
                        const response = await axios.post(
                            "http://localhost:8000/api/campuses",
                            campus,
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                        campus.id = response.data.id; // Update with returned ID
                    }
                } catch (error) {
                    console.error("Error saving campus:", error);
                }
            }

            setCampuses(updatedCampuses);
        },
        [campuses]
    );

    // Add a new empty row
    const addRow = useCallback(() => {
        setCampuses((prev) => [
            ...prev,
            {
                suc_name: "",
                campus_type: "",
                institutional_code: "",
                region: "",
                municipality_city_province: "",
                former_name: "",
                year_first_operation: "",
                land_area_hectares: 0.0,
                distance_from_main: 0.0,
                autonomous_code: "",
                position_title: "",
                head_full_name: "",
                latitude_coordinates: 0.0,
                longitude_coordinates: 0.0,
            },
        ]);
    }, []);

    return (
        <div style={{ marginTop: "16px" }}>
            <Button
                variant="contained"
                color="primary"
                onClick={addRow}
                sx={{ mb: 2 }}
            >
                Add Row
            </Button>
            <HotTable
                data={data}
                columns={columns}
                colHeaders={true}
                rowHeaders={true}
                stretchH="all"
                height="65vh"
                licenseKey="non-commercial-and-evaluation"
                settings={{
                    manualColumnResize: true,
                    columnSorting: true,
                    contextMenu: true,
                    afterChange: handleChanges,
                }}
            />
            {data.length === 0 && (
                <div
                    style={{
                        textAlign: "center",
                        padding: "20px",
                        color: "#666",
                    }}
                >
                    No campuses found. Click &#34;Add Row&#34; to start.
                </div>
            )}
        </div>
    );
};

CampusHandsontable.propTypes = {
    campuses: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            suc_name: PropTypes.string,
            campus_type: PropTypes.string,
            institutional_code: PropTypes.string,
            region: PropTypes.string,
            municipality_city_province: PropTypes.string,
            former_name: PropTypes.string,
            year_first_operation: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
            land_area_hectares: PropTypes.number,
            distance_from_main: PropTypes.number,
            autonomous_code: PropTypes.string,
            position_title: PropTypes.string,
            head_full_name: PropTypes.string,
            latitude_coordinates: PropTypes.number,
            longitude_coordinates: PropTypes.number,
        })
    ).isRequired,
};

export default CampusHandsontable;
