import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const Table = ({
    columns,
    data,
    style = {},
    columnStyles = {},
    rowStyles = {},
}) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const darkModeMediaQuery = window.matchMedia(
            "(prefers-color-scheme: dark)"
        );
        setIsDarkMode(darkModeMediaQuery.matches);

        const handleChange = (e) => setIsDarkMode(e.matches);
        darkModeMediaQuery.addEventListener("change", handleChange);

        return () =>
            darkModeMediaQuery.removeEventListener("change", handleChange);
    }, []);

    const defaultStyles = {
        table: {
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid #ddd",
            backgroundColor: isDarkMode ? "#222" : "white",
            color: isDarkMode ? "#ddd" : "#333",
            ...style, // Allow custom table styles
        },
        th: {
            padding: "10px",
            textAlign: "left",
            backgroundColor: isDarkMode ? "#444" : "#007bff",
            color: "white",
            fontWeight: "bold",
            borderBottom: "2px solid #ddd",
        },
        td: {
            padding: "10px",
            borderBottom: "1px solid #ddd",
        },
        trHover: {
            backgroundColor: isDarkMode ? "#333" : "#f5f5f5",
        },
    };

    return (
        <table style={defaultStyles.table}>
            <thead>
                <tr>
                    {columns.map((col, index) => (
                        <th
                            key={index}
                            style={{
                                ...defaultStyles.th,
                                ...columnStyles[col],
                            }}
                        >
                            {col}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, rowIndex) => (
                    <tr
                        key={rowIndex}
                        style={rowStyles[rowIndex] || {}} // Apply custom row styles
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor =
                                defaultStyles.trHover.backgroundColor)
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor =
                                defaultStyles.table.backgroundColor)
                        }
                    >
                        {row.map((cell, cellIndex) => (
                            <td key={cellIndex} style={defaultStyles.td}>
                                {cell}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

Table.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.string).isRequired,
    data: PropTypes.arrayOf(PropTypes.array).isRequired,
    style: PropTypes.object,
    columnStyles: PropTypes.object,
    rowStyles: PropTypes.object,
};

export default Table;
