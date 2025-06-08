import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
    DollarSign,
    MoreHorizontal,
    ArrowLeft,
    Eye,
    Download,
    Edit,
    Trash,
    BarChart2,
    PieChart,
    Edit3,
} from "lucide-react";
import Popper from "../../../../Components/Popper";
import Pagination from "../../../../Components/Pagination";
import config from "../../../../utils/config";
import axios from "axios";
import ExcelJS from "exceljs";
import Swal from "sweetalert2";
import PropTypes from "prop-types";

const SucFormGH = () => {
    const { SucDetailId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const heiName = location.state?.heiName || "Unknown Institution";
    const heiUiid = location.state?.heiUiid || "Unknown Uiid";

    // State for Income
    const [incomes, setIncomes] = useState([]);

    // State for Expenditure
    const [expenditures, setExpenditures] = useState([]);

    // State for Allotment
    const [allotments, setAllotments] = useState([]);

    // State for Function Names
    const [validFunctionNames, setValidFunctionNames] = useState([]);

    // Common states
    const [activeTab, setActiveTab] = useState("income");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [exportLoading, setExportLoading] = useState(false);
    const [editingCell, setEditingCell] = useState(null); // { id: item.id, field: 'function_name', type: 'expenditure' | 'allotment' }

    // Fetch data when component mounts
    useEffect(() => {
        fetchData();
        fetchFunctionNames();
    }, []);

    const fetchFunctionNames = async () => {
        try {
            const response = await axios.get(
                `${config.API_URL}/function-names`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                        Accept: "application/json",
                    },
                }
            );
            setValidFunctionNames(response.data.map((fn) => fn.name));
        } catch (err) {
            console.error("Error fetching function names:", err);
        }
    };

    const fetchData = async () => {
        if (!SucDetailId) {
            console.error("SucDetailId is undefined");
            return;
        }

        console.log("Fetching data for SucDetailId:", SucDetailId);

        try {
            // Fetch all data (Income, Expenditure, Allotment) in one go
            const response = await axios.get(
                `${config.API_URL}/suc-form-gh/${SucDetailId}/all-data`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                        Accept: "application/json",
                    },
                }
            );

            const { income, expenditure, allotment } = response.data.data;

            setIncomes(Array.isArray(income) ? income : []);
            console.log("Fetched Income data:", income);

            setExpenditures(Array.isArray(expenditure) ? expenditure : []);
            console.log("Fetched Expenditure data:", expenditure);

            setAllotments(Array.isArray(allotment) ? allotment : []);
            console.log("Fetched Allotment data:", allotment);
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    };

    // Calculate paginated data
    const getPaginatedData = (data) => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return data.slice(startIndex, endIndex);
    };

    const handleBack = () => {
        navigate("/super-admin/institutions/suc");
    };

    const formatCurrency = (amount) => {
        if (!amount) return "₱0";
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const handleExportToExcel = async () => {
        try {
            setExportLoading(true);

            Swal.fire({
                title: "Confirm Export",
                text: `Do you want to export Form GH data for ${heiName}?`,
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Export",
                cancelButtonText: "Cancel",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const workbook = new ExcelJS.Workbook();

                    // Define common styles
                    const thinBorder = {
                        style: "thin",
                        color: { argb: "FF000000" },
                    };
                    const fullBorder = {
                        top: thinBorder,
                        left: thinBorder,
                        bottom: thinBorder,
                        right: thinBorder,
                    };

                    // ===========================================
                    // FORM H: INCOME SHEET
                    // ===========================================
                    const incomeSheet =
                        workbook.addWorksheet("FORM H - INCOME");

                    // Set column widths
                    incomeSheet.columns = [
                        { width: 5 }, // A - Row numbers
                        { width: 25 }, // B - Description
                        { width: 15 }, // C - Tuition Fees
                        { width: 15 }, // D - Miscellaneous
                        { width: 15 }, // E - Other Income
                        { width: 20 }, // F - Total
                    ];

                    // Title and Headers
                    incomeSheet.getCell("A1").value =
                        "FORM H: STATEMENT OF INCOME ( Jan 1 to Dec 31 2023)";
                    incomeSheet.mergeCells("A1:F1");
                    incomeSheet.getCell("A1").font = { bold: true, size: 14 };
                    incomeSheet.getCell("A1").alignment = {
                        horizontal: "center",
                    };

                    incomeSheet.getCell("A2").value = "BY CAMPUS and FUNCTION";
                    incomeSheet.mergeCells("A2:F2");
                    incomeSheet.getCell("A2").font = { bold: true };
                    incomeSheet.getCell("A2").alignment = {
                        horizontal: "center",
                    };

                    incomeSheet.getCell(
                        "A3"
                    ).value = `SUC ${heiName.toUpperCase()}`;
                    incomeSheet.mergeCells("A3:F3");
                    incomeSheet.getCell("A3").font = {
                        bold: true,
                        color: { argb: "FF0000FF" },
                    };
                    incomeSheet.getCell("A3").alignment = {
                        horizontal: "center",
                    };

                    incomeSheet.getCell("A4").value = "CAMPUS";
                    incomeSheet.mergeCells("A4:F4");
                    incomeSheet.getCell("A4").font = {
                        bold: true,
                        color: { argb: "FFFF0000" },
                    };
                    incomeSheet.getCell("A4").alignment = {
                        horizontal: "center",
                    };

                    // Table headers
                    incomeSheet.getCell("A6").value = "";
                    incomeSheet.getCell("B6").value = "SUC CAMPUS";
                    incomeSheet.getCell("C6").value = "TUITION AND MISC FEES";
                    incomeSheet.getCell("D6").value = "MISCELLANEOUS";
                    incomeSheet.getCell("E6").value = "OTHER INCOME";
                    incomeSheet.getCell("F6").value = "TOTAL SUC INCOME";

                    // Style headers
                    ["A6", "B6", "C6", "D6", "E6", "F6"].forEach((cell) => {
                        incomeSheet.getCell(cell).font = { bold: true };
                        incomeSheet.getCell(cell).alignment = {
                            horizontal: "center",
                            vertical: "middle",
                        };
                        incomeSheet.getCell(cell).border = fullBorder;
                        incomeSheet.getCell(cell).fill = {
                            type: "pattern",
                            pattern: "solid",
                            fgColor: { argb: "FFECECEC" },
                        };
                    });

                    // Add income data
                    let currentRow = 7;
                    incomes.forEach((income, index) => {
                        incomeSheet.getCell(`A${currentRow}`).value = `${
                            index + 1
                        }.0`;
                        incomeSheet.getCell(`B${currentRow}`).value =
                            income.income_category || income.campus;
                        incomeSheet.getCell(`C${currentRow}`).value =
                            income.tuition_fees || 0;
                        incomeSheet.getCell(`D${currentRow}`).value =
                            income.miscellaneous_fees || 0;
                        incomeSheet.getCell(`E${currentRow}`).value =
                            income.other_income || 0;
                        incomeSheet.getCell(`F${currentRow}`).value =
                            income.total_income || 0;

                        // Style data rows
                        ["A", "B", "C", "D", "E", "F"].forEach((col) => {
                            const cell = incomeSheet.getCell(
                                `${col}${currentRow}`
                            );
                            cell.border = fullBorder;
                            if (["C", "D", "E", "F"].includes(col)) {
                                cell.numFmt = "#,##0.00";
                                cell.alignment = { horizontal: "right" };
                            }
                        });
                        currentRow++;
                    });

                    // Add totals row
                    incomeSheet.getCell(`B${currentRow}`).value =
                        "GRAND TOTAL FOR SUC";
                    incomeSheet.getCell(`B${currentRow}`).font = { bold: true };
                    ["A", "B", "C", "D", "E", "F"].forEach((col) => {
                        incomeSheet.getCell(`${col}${currentRow}`).border =
                            fullBorder;
                        incomeSheet.getCell(`${col}${currentRow}`).fill = {
                            type: "pattern",
                            pattern: "solid",
                            fgColor: { argb: "FFFFFFF0" },
                        };
                    });

                    // ===========================================
                    // FORM G-2: EXPENDITURE SHEET
                    // ===========================================
                    const expenditureSheet = workbook.addWorksheet(
                        "FORM G-2 - EXPENDITURES"
                    );

                    // Set column widths
                    expenditureSheet.columns = [
                        { width: 5 }, // A - Row numbers
                        { width: 25 }, // B - Function
                        { width: 12 }, // C - Fund 101 PS
                        { width: 12 }, // D - Fund 101 MOOE
                        { width: 12 }, // E - Fund 101 CO
                        { width: 15 }, // F - Fund 101 Total
                        { width: 12 }, // G - Fund 164 PS
                        { width: 12 }, // H - Fund 164 MOOE
                        { width: 12 }, // I - Fund 164 CO
                        { width: 15 }, // J - Fund 164 Total
                        { width: 12 }, // K - Total PS
                        { width: 12 }, // L - Total MOOE
                        { width: 12 }, // M - Total CO
                        { width: 18 }, // N - Grand Total
                    ];

                    // Title and Headers
                    expenditureSheet.getCell("A1").value =
                        "Form G-2: STATEMENT OF EXPENDITURES ( Jan 1 to Dec 31 2023)";
                    expenditureSheet.mergeCells("A1:N1");
                    expenditureSheet.getCell("A1").font = {
                        bold: true,
                        size: 14,
                    };
                    expenditureSheet.getCell("A1").alignment = {
                        horizontal: "center",
                    };

                    expenditureSheet.getCell("A2").value =
                        "BY CAMPUS and FUNCTION";
                    expenditureSheet.mergeCells("A2:N2");
                    expenditureSheet.getCell("A2").font = { bold: true };
                    expenditureSheet.getCell("A2").alignment = {
                        horizontal: "center",
                    };

                    expenditureSheet.getCell(
                        "A3"
                    ).value = `SUC ${heiName.toUpperCase()}`;
                    expenditureSheet.mergeCells("A3:N3");
                    expenditureSheet.getCell("A3").font = {
                        bold: true,
                        color: { argb: "FF0000FF" },
                    };
                    expenditureSheet.getCell("A3").alignment = {
                        horizontal: "center",
                    };

                    expenditureSheet.getCell("A4").value = "CAMPUS";
                    expenditureSheet.mergeCells("A4:N4");
                    expenditureSheet.getCell("A4").font = {
                        bold: true,
                        color: { argb: "FFFF0000" },
                    };
                    expenditureSheet.getCell("A4").alignment = {
                        horizontal: "center",
                    };

                    // Multi-level headers
                    expenditureSheet.getCell("A6").value = "";
                    expenditureSheet.getCell("B6").value = "";
                    expenditureSheet.getCell("C6").value =
                        "EXPENDITURES FROM FUND 101 (GAA)";
                    expenditureSheet.mergeCells("C6:F6");
                    expenditureSheet.getCell("G6").value =
                        "EXPENDITURES FROM FUND 164 ( SUC INCOME )";
                    expenditureSheet.mergeCells("G6:J6");
                    expenditureSheet.getCell("K6").value =
                        "GRAND TOTAL EXPENDITURES";
                    expenditureSheet.mergeCells("K6:N6");

                    expenditureSheet.getCell("A7").value = "FUNCTION";
                    expenditureSheet.getCell("B7").value = "";
                    expenditureSheet.getCell("C7").value = "FUND 101 PS";
                    expenditureSheet.getCell("D7").value = "FUND 101 MOOE";
                    expenditureSheet.getCell("E7").value = "FUND 101 CO";
                    expenditureSheet.getCell("F7").value = "FUND 101 TOTAL";
                    expenditureSheet.getCell("G7").value = "SUC INCOME PS";
                    expenditureSheet.getCell("H7").value = "SUC INCOME MOOE";
                    expenditureSheet.getCell("I7").value = "SUC INCOME CO";
                    expenditureSheet.getCell("J7").value = "SUC INCOME TOTAL";
                    expenditureSheet.getCell("K7").value = "GRAND PS";
                    expenditureSheet.getCell("L7").value = "GRAND MOOE";
                    expenditureSheet.getCell("M7").value = "GRAND CO";
                    expenditureSheet.getCell("N7").value = "GRAND TOTAL";

                    // Style headers
                    [
                        "A6",
                        "B6",
                        "C6",
                        "G6",
                        "K6",
                        "A7",
                        "B7",
                        "C7",
                        "D7",
                        "E7",
                        "F7",
                        "G7",
                        "H7",
                        "I7",
                        "J7",
                        "K7",
                        "L7",
                        "M7",
                        "N7",
                    ].forEach((cell) => {
                        expenditureSheet.getCell(cell).font = { bold: true };
                        expenditureSheet.getCell(cell).alignment = {
                            horizontal: "center",
                            vertical: "middle",
                            wrapText: true,
                        };
                        expenditureSheet.getCell(cell).border = fullBorder;
                        expenditureSheet.getCell(cell).fill = {
                            type: "pattern",
                            pattern: "solid",
                            fgColor: { argb: "FFECECEC" },
                        };
                    });

                    // Add expenditure data
                    currentRow = 8;
                    expenditures.forEach((expenditure, index) => {
                        expenditureSheet.getCell(`A${currentRow}`).value = `${
                            index + 1
                        }.0`;
                        expenditureSheet.getCell(`B${currentRow}`).value =
                            expenditure.function_name;
                        expenditureSheet.getCell(`C${currentRow}`).value =
                            expenditure.fund_101_ps || 0;
                        expenditureSheet.getCell(`D${currentRow}`).value =
                            expenditure.fund_101_mooe || 0;
                        expenditureSheet.getCell(`E${currentRow}`).value =
                            expenditure.fund_101_co || 0;
                        expenditureSheet.getCell(`F${currentRow}`).value =
                            expenditure.fund_101_total || 0;
                        expenditureSheet.getCell(`G${currentRow}`).value =
                            expenditure.fund_164_ps || 0;
                        expenditureSheet.getCell(`H${currentRow}`).value =
                            expenditure.fund_164_mooe || 0;
                        expenditureSheet.getCell(`I${currentRow}`).value =
                            expenditure.fund_164_co || 0;
                        expenditureSheet.getCell(`J${currentRow}`).value =
                            expenditure.fund_164_total || 0;
                        expenditureSheet.getCell(`K${currentRow}`).value =
                            expenditure.total_ps || 0;
                        expenditureSheet.getCell(`L${currentRow}`).value =
                            expenditure.total_mooe || 0;
                        expenditureSheet.getCell(`M${currentRow}`).value =
                            expenditure.total_co || 0;
                        expenditureSheet.getCell(`N${currentRow}`).value =
                            expenditure.total_expend || 0;

                        // Style data rows
                        [
                            "A",
                            "B",
                            "C",
                            "D",
                            "E",
                            "F",
                            "G",
                            "H",
                            "I",
                            "J",
                            "K",
                            "L",
                            "M",
                            "N",
                        ].forEach((col) => {
                            const cell = expenditureSheet.getCell(
                                `${col}${currentRow}`
                            );
                            cell.border = fullBorder;
                            if (
                                [
                                    "C",
                                    "D",
                                    "E",
                                    "F",
                                    "G",
                                    "H",
                                    "I",
                                    "J",
                                    "K",
                                    "L",
                                    "M",
                                    "N",
                                ].includes(col)
                            ) {
                                cell.numFmt = "#,##0.00";
                                cell.alignment = { horizontal: "right" };
                            }
                            // Highlight total columns
                            if (["F", "J", "N"].includes(col)) {
                                cell.fill = {
                                    type: "pattern",
                                    pattern: "solid",
                                    fgColor: { argb: "FFF0F0F0" },
                                };
                            }
                        });
                        currentRow++;
                    });

                    // ===========================================
                    // FORM G-1: ALLOTMENT SHEET
                    // ===========================================
                    const allotmentSheet = workbook.addWorksheet(
                        "FORM G-1 - ALLOTMENTS"
                    );

                    // Set column widths for better presentation
                    allotmentSheet.columns = [
                        { width: 5 }, // A - Row numbers
                        { width: 25 }, // B - Function
                        { width: 12 }, // C - Fund 101 PS
                        { width: 12 }, // D - Fund 101 MOOE
                        { width: 12 }, // E - Fund 101 CO
                        { width: 15 }, // F - Fund 101 Total
                        { width: 12 }, // G - Fund 164 PS
                        { width: 12 }, // H - Fund 164 MOOE
                        { width: 12 }, // I - Fund 164 CO
                        { width: 15 }, // J - Fund 164 Total
                        { width: 12 }, // K - Total PS
                        { width: 12 }, // L - Total MOOE
                        { width: 12 }, // M - Total CO
                        { width: 18 }, // N - Total Allotment
                    ];

                    // Title Rows
                    allotmentSheet.getCell("A1").value =
                        "HEMIS DATA COLLECTION 2024";
                    allotmentSheet.mergeCells("A1:N1");
                    allotmentSheet.getCell("A1").font = {
                        bold: true,
                        size: 12,
                    };
                    allotmentSheet.getCell("A1").alignment = {
                        horizontal: "center",
                    };

                    allotmentSheet.getCell("A2").value =
                        "Form G-1: ALLOTMENTS ( FUND 101 and FUND 164) FY 2023";
                    allotmentSheet.mergeCells("A2:N2");
                    allotmentSheet.getCell("A2").font = {
                        bold: true,
                        size: 14,
                    };
                    allotmentSheet.getCell("A2").alignment = {
                        horizontal: "center",
                    };

                    allotmentSheet.getCell("A3").value =
                        "BY CAMPUS and by FUNCTION";
                    allotmentSheet.mergeCells("A3:N3");
                    allotmentSheet.getCell("A3").font = { bold: true };
                    allotmentSheet.getCell("A3").alignment = {
                        horizontal: "center",
                    };

                    allotmentSheet.getCell(
                        "A4"
                    ).value = `SUC ${heiName.toUpperCase()}`;
                    allotmentSheet.mergeCells("A4:N4");
                    allotmentSheet.getCell("A4").font = {
                        bold: true,
                        color: { argb: "FF0000FF" },
                    };
                    allotmentSheet.getCell("A4").alignment = {
                        horizontal: "center",
                    };

                    allotmentSheet.getCell("A5").value = "CAMPUS";
                    allotmentSheet.mergeCells("A5:N5");
                    allotmentSheet.getCell("A5").font = {
                        bold: true,
                        color: { argb: "FFFF0000" },
                    };
                    allotmentSheet.getCell("A5").alignment = {
                        horizontal: "center",
                    };

                    // Multi-level Headers
                    allotmentSheet.getCell("A7").value = "";
                    allotmentSheet.getCell("B7").value = "";
                    allotmentSheet.getCell("C7").value = "ALLOTMENTS FROM GAA";
                    allotmentSheet.mergeCells("C7:F7");
                    allotmentSheet.getCell("G7").value =
                        "ALLOTMENTS FROM SUC INCOME";
                    allotmentSheet.mergeCells("G7:J7");
                    allotmentSheet.getCell("K7").value =
                        "ALLOTMENTS ( GAA AND SUC INCOME)";
                    allotmentSheet.mergeCells("K7:N7");

                    allotmentSheet.getCell("A8").value = "FUNCTION";
                    allotmentSheet.getCell("B8").value = "";
                    allotmentSheet.getCell("C8").value = "FUND 101";
                    allotmentSheet.mergeCells("C8:F8");
                    allotmentSheet.getCell("G8").value = "FUND 164";
                    allotmentSheet.mergeCells("G8:J8");
                    allotmentSheet.getCell("K8").value = "TOTAL";
                    allotmentSheet.mergeCells("K8:N8");

                    allotmentSheet.getCell("A9").value = "";
                    allotmentSheet.getCell("B9").value = "";
                    allotmentSheet.getCell("C9").value = "PS";
                    allotmentSheet.getCell("D9").value = "MOOE";
                    allotmentSheet.getCell("E9").value = "CO";
                    allotmentSheet.getCell("F9").value = "TOTAL";
                    allotmentSheet.getCell("G9").value = "PS";
                    allotmentSheet.getCell("H9").value = "MOOE";
                    allotmentSheet.getCell("I9").value = "CO";
                    allotmentSheet.getCell("J9").value = "TOTAL";
                    allotmentSheet.getCell("K9").value = "PS";
                    allotmentSheet.getCell("L9").value = "MOOE";
                    allotmentSheet.getCell("M9").value = "CO";
                    allotmentSheet.getCell("N9").value = "TOTAL ALLOT.";

                    // Style headers
                    [
                        "A7",
                        "B7",
                        "C7",
                        "G7",
                        "K7",
                        "A8",
                        "B8",
                        "C8",
                        "G8",
                        "K8",
                        "A9",
                        "B9",
                        "C9",
                        "D9",
                        "E9",
                        "F9",
                        "G9",
                        "H9",
                        "I9",
                        "J9",
                        "K9",
                        "L9",
                        "M9",
                        "N9",
                    ].forEach((cellRef) => {
                        const cell = allotmentSheet.getCell(cellRef);
                        cell.font = { bold: true };
                        cell.alignment = {
                            vertical: "middle",
                            horizontal: "center",
                            wrapText: true,
                        };
                        cell.border = fullBorder;
                        cell.fill = {
                            type: "pattern",
                            pattern: "solid",
                            fgColor: { argb: "FFECECEC" },
                        };
                    });

                    // Data Rows (Starting from Row 10)
                    currentRow = 10;
                    allotments.forEach((allotment, index) => {
                        allotmentSheet.getCell(`A${currentRow}`).value = `${
                            index + 1
                        }.0`;
                        allotmentSheet.getCell(`B${currentRow}`).value =
                            allotment.function_name;
                        allotmentSheet.getCell(`C${currentRow}`).value =
                            allotment.fund_101_ps || 0;
                        allotmentSheet.getCell(`D${currentRow}`).value =
                            allotment.fund_101_mooe || 0;
                        allotmentSheet.getCell(`E${currentRow}`).value =
                            allotment.fund_101_co || 0;
                        allotmentSheet.getCell(`F${currentRow}`).value =
                            allotment.fund_101_total || 0;
                        allotmentSheet.getCell(`G${currentRow}`).value =
                            allotment.fund_164_ps || 0;
                        allotmentSheet.getCell(`H${currentRow}`).value =
                            allotment.fund_164_mooe || 0;
                        allotmentSheet.getCell(`I${currentRow}`).value =
                            allotment.fund_164_co || 0;
                        allotmentSheet.getCell(`J${currentRow}`).value =
                            allotment.fund_164_total || 0;
                        allotmentSheet.getCell(`K${currentRow}`).value =
                            allotment.total_ps || 0;
                        allotmentSheet.getCell(`L${currentRow}`).value =
                            allotment.total_mooe || 0;
                        allotmentSheet.getCell(`M${currentRow}`).value =
                            allotment.total_co || 0;
                        allotmentSheet.getCell(`N${currentRow}`).value =
                            allotment.total_allot || 0;

                        // Style data rows
                        [
                            "A",
                            "B",
                            "C",
                            "D",
                            "E",
                            "F",
                            "G",
                            "H",
                            "I",
                            "J",
                            "K",
                            "L",
                            "M",
                            "N",
                        ].forEach((col) => {
                            const cell = allotmentSheet.getCell(
                                `${col}${currentRow}`
                            );
                            cell.border = fullBorder;
                            if (
                                [
                                    "C",
                                    "D",
                                    "E",
                                    "F",
                                    "G",
                                    "H",
                                    "I",
                                    "J",
                                    "K",
                                    "L",
                                    "M",
                                    "N",
                                ].includes(col)
                            ) {
                                cell.numFmt = "#,##0.00";
                                cell.alignment = { horizontal: "right" };
                            }
                            // Highlight total columns
                            if (["F", "J", "N"].includes(col)) {
                                cell.fill = {
                                    type: "pattern",
                                    pattern: "solid",
                                    fgColor: { argb: "FFF0F0F0" },
                                };
                            }
                        });
                        currentRow++;
                    });

                    // Footer Notes for Allotment Sheet
                    currentRow += 2;
                    allotmentSheet.getCell(`A${currentRow}`).value =
                        "NOTE: THIS, IN EFFECT, IS THE INTERNAL OPERATING BUDGET (IOB) OF THE SUC.";
                    allotmentSheet.mergeCells(`A${currentRow}:N${currentRow}`);
                    allotmentSheet.getCell(`A${currentRow}`).font = {
                        italic: true,
                    };

                    currentRow += 2;
                    allotmentSheet.getCell(`A${currentRow}`).value =
                        "ORIGINAL DATA SUPPLIED BY:";
                    allotmentSheet.mergeCells(`A${currentRow}:C${currentRow}`);
                    allotmentSheet.getCell(`E${currentRow}`).value =
                        "ZANDRA GALE H. TABLANTE, Budget Officer II";
                    allotmentSheet.mergeCells(`E${currentRow}:N${currentRow}`);

                    currentRow += 1;
                    allotmentSheet.getCell(`A${currentRow}`).value =
                        "DATA KEYED IN BY:";
                    allotmentSheet.mergeCells(`A${currentRow}:C${currentRow}`);
                    allotmentSheet.getCell(`E${currentRow}`).value =
                        "ZANDRA GALE H. TABLANTE, Budget Officer II";
                    allotmentSheet.mergeCells(`E${currentRow}:N${currentRow}`);

                    currentRow += 1;
                    allotmentSheet.getCell(`A${currentRow}`).value =
                        "CERTIFIED CORRECT BY:";
                    allotmentSheet.mergeCells(`A${currentRow}:C${currentRow}`);
                    allotmentSheet.getCell(`E${currentRow}`).value =
                        "ZANDRA GALE H. TABLANTE, Budget Officer II";
                    allotmentSheet.mergeCells(`E${currentRow}:N${currentRow}`);

                    // Add footer notes to Income and Expenditure sheets as well
                    // Income Sheet Footer
                    let incomeFooterRow = incomeSheet.lastRow.number + 3;
                    incomeSheet.getCell(`A${incomeFooterRow}`).value =
                        "NOTE: TUITION AND INCOME FROM MISCELLANEOUS FEES SHOULD BE TABULATED SEPARATELY.";
                    incomeSheet.mergeCells(
                        `A${incomeFooterRow}:F${incomeFooterRow}`
                    );
                    incomeSheet.getCell(`A${incomeFooterRow}`).font = {
                        italic: true,
                    };

                    incomeFooterRow += 1;
                    incomeSheet.getCell(`A${incomeFooterRow}`).value =
                        "ALL SUC RECEIVABLES SHOULD BE CERTIFIED BY THE SUC.";
                    incomeSheet.mergeCells(
                        `A${incomeFooterRow}:F${incomeFooterRow}`
                    );
                    incomeSheet.getCell(`A${incomeFooterRow}`).font = {
                        italic: true,
                    };

                    incomeFooterRow += 2;
                    incomeSheet.getCell(`A${incomeFooterRow}`).value =
                        "ORIGINAL DATA SUPPLIED BY:";
                    incomeSheet.mergeCells(
                        `A${incomeFooterRow}:B${incomeFooterRow}`
                    );
                    incomeSheet.getCell(`D${incomeFooterRow}`).value =
                        "MS. ELENA G. GALVEZ, CPA Accountant III 09/27/2024";
                    incomeSheet.mergeCells(
                        `D${incomeFooterRow}:F${incomeFooterRow}`
                    );

                    incomeFooterRow += 1;
                    incomeSheet.getCell(`A${incomeFooterRow}`).value =
                        "DATA KEYED IN BY:";
                    incomeSheet.mergeCells(
                        `A${incomeFooterRow}:B${incomeFooterRow}`
                    );
                    incomeSheet.getCell(`D${incomeFooterRow}`).value =
                        "GLORIA C. BAUTISTA     Date: 09/27/2024";
                    incomeSheet.mergeCells(
                        `D${incomeFooterRow}:F${incomeFooterRow}`
                    );

                    incomeFooterRow += 1;
                    incomeSheet.getCell(`A${incomeFooterRow}`).value =
                        "CERTIFIED CORRECT BY:";
                    incomeSheet.mergeCells(
                        `A${incomeFooterRow}:B${incomeFooterRow}`
                    );
                    incomeSheet.getCell(`D${incomeFooterRow}`).value =
                        "MS. ELENA G. GALVEZ, CPA Accountant III 09/27/2024";
                    incomeSheet.mergeCells(
                        `D${incomeFooterRow}:F${incomeFooterRow}`
                    );

                    // Expenditure Sheet Footer
                    let expenditureFooterRow =
                        expenditureSheet.lastRow.number + 2;
                    expenditureSheet.getCell(`A${expenditureFooterRow}`).value =
                        "ORIGINAL DATA SUPPLIED BY:";
                    expenditureSheet.mergeCells(
                        `A${expenditureFooterRow}:C${expenditureFooterRow}`
                    );
                    expenditureSheet.getCell(`E${expenditureFooterRow}`).value =
                        "ZANDRA GALE H. TABLANTE, Budget Officer II";
                    expenditureSheet.mergeCells(
                        `E${expenditureFooterRow}:N${expenditureFooterRow}`
                    );

                    expenditureFooterRow += 1;
                    expenditureSheet.getCell(`A${expenditureFooterRow}`).value =
                        "DATA KEYED IN BY:";
                    expenditureSheet.mergeCells(
                        `A${expenditureFooterRow}:C${expenditureFooterRow}`
                    );
                    expenditureSheet.getCell(`E${expenditureFooterRow}`).value =
                        "ZANDRA GALE H. TABLANTE, Budget Officer II";
                    expenditureSheet.mergeCells(
                        `E${expenditureFooterRow}:N${expenditureFooterRow}`
                    );

                    expenditureFooterRow += 1;
                    expenditureSheet.getCell(`A${expenditureFooterRow}`).value =
                        "CERTIFIED CORRECT BY:";
                    expenditureSheet.mergeCells(
                        `A${expenditureFooterRow}:C${expenditureFooterRow}`
                    );
                    expenditureSheet.getCell(`E${expenditureFooterRow}`).value =
                        "ZANDRA GALE H. TABLANTE, Budget Officer II";
                    expenditureSheet.mergeCells(
                        `E${expenditureFooterRow}:N${expenditureFooterRow}`
                    );

                    // Generate filename and download
                    const fileName = `${heiUiid}_${heiName.replace(
                        /[^a-zA-Z0-9]/g,
                        "_"
                    )}_FormGH_${new Date().toISOString().split("T")[0]}.xlsx`;
                    const buffer = await workbook.xlsx.writeBuffer();
                    const blob = new Blob([buffer], {
                        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = fileName;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);

                    Swal.fire({
                        title: "Success!",
                        text: "Form GH data exported successfully.",
                        icon: "success",
                        timer: 4000,
                        showConfirmButton: false,
                    });
                }
            });
        } catch (error) {
            console.error("Error exporting data:", error);
            Swal.fire({
                title: "Error!",
                text: "Failed to export data. Please try again.",
                icon: "error",
                confirmButtonText: "OK",
            });
        } finally {
            setExportLoading(false);
        }
    };

    const handleCellClick = (id, field, type) => {
        setEditingCell({ id, field, type });
    };

    const handleCellChange = (e, id, field, type) => {
        const newValue = e.target.value;
        if (type === "expenditure") {
            setExpenditures((prev) =>
                prev.map((item) =>
                    item.id === id ? { ...item, [field]: newValue } : item
                )
            );
        } else if (type === "allotment") {
            setAllotments((prev) =>
                prev.map((item) =>
                    item.id === id ? { ...item, [field]: newValue } : item
                )
            );
        } else if (type === "income") {
            setIncomes((prev) =>
                prev.map((item) =>
                    item.id === id ? { ...item, [field]: newValue } : item
                )
            );
        }
    };

    const handleCellBlur = async (e, item, field, type) => {
        setEditingCell(null);
        let newValue = e.target.value.trim();

        if (field === "function_name") {
            if (!validFunctionNames.includes(newValue)) {
                console.warn(
                    `Invalid function name '${newValue}' for ${type} id ${item.id}. Setting to 'Uncategorized'.`
                );
                newValue = "Uncategorized";
            }
        } else if (typeof item[field] === "number") {
            newValue = parseFloat(newValue) || 0;
        }

        // Update local state immediately before API call for responsiveness
        if (type === "expenditure") {
            setExpenditures((prev) =>
                prev.map((dataItem) =>
                    dataItem.id === item.id
                        ? { ...dataItem, [field]: newValue }
                        : dataItem
                )
            );
        } else if (type === "allotment") {
            setAllotments((prev) =>
                prev.map((dataItem) =>
                    dataItem.id === item.id
                        ? { ...dataItem, [field]: newValue }
                        : dataItem
                )
            );
        } else if (type === "income") {
            setIncomes((prev) =>
                prev.map((dataItem) =>
                    dataItem.id === item.id
                        ? { ...dataItem, [field]: newValue }
                        : dataItem
                )
            );
        }

        try {
            const token = localStorage.getItem("token");
            const endpoint = `${config.API_URL}/suc-form-gh/${type}/${item.id}`;
            const dataToSend = { [field]: newValue };

            // Include report_year and suc_details_id if they are part of the update key
            if (field !== "report_year" && field !== "suc_details_id") {
                dataToSend.report_year = item.report_year;
                dataToSend.suc_details_id = item.suc_details_id;
            }

            await axios.put(endpoint, dataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            Swal.fire({
                icon: "success",
                title: "Saved!",
                showConfirmButton: false,
                timer: 1500,
            });
            fetchData(); // Re-fetch to ensure totals are updated and data is fresh
        } catch (error) {
            console.error(
                `Error updating ${field} for ${type} id ${item.id}:`,
                error
            );
            Swal.fire({
                icon: "error",
                title: "Failed to save!",
                text: "Please try again.",
                confirmButtonText: "OK",
            });
            fetchData(); // Re-fetch to revert to original state if save failed
        }
    };

    const handleCellKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            e.target.blur(); // Trigger blur to save changes
        }
        if (e.key === "Escape") {
            setEditingCell(null);
        }
    };

    // Editable cell component
    const EditableCell = ({
        value,
        item,
        field,
        type,
        isEditable = true,
        isNumber = false,
    }) => {
        const isEditing =
            editingCell?.id === item.id &&
            editingCell?.field === field &&
            editingCell?.type === type;

        if (isEditing) {
            return (
                <input
                    type={isNumber ? "number" : "text"}
                    value={value || ""}
                    onChange={(e) => handleCellChange(e, item.id, field, type)}
                    onBlur={(e) => handleCellBlur(e, item, field, type)}
                    onKeyDown={handleCellKeyDown}
                    className="w-full h-full bg-blue-50 border border-blue-400 px-2 py-1 text-xs focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    autoFocus
                />
            );
        }

        return (
            <div
                className={`w-full h-full px-2 py-1 text-xs truncate group relative ${
                    isEditable ? "cursor-pointer hover:bg-gray-50" : ""
                }`}
                onClick={() =>
                    isEditable && handleCellClick(item.id, field, type)
                }
                title={value}
            >
                <span className="block truncate">
                    {isNumber ? formatCurrency(value) : value}
                </span>
                {isEditable && (
                    <Edit3 className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150 absolute top-1 right-1" />
                )}
            </div>
        );
    };

    EditableCell.propTypes = {
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        item: PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            // Add other properties of 'item' if they are consistently used and need validation
        }).isRequired,
        field: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        isEditable: PropTypes.bool,
        isNumber: PropTypes.bool,
    };

    const renderIncomeTable = () => (
        <div className="w-full overflow-x-auto border border-gray-200">
            <div className="min-w-[800px]">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b border-gray-200">
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-left w-40">
                                Income Category
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-32">
                                Tuition Fees
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-32">
                                Miscellaneous Fees
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-32">
                                Other Income
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-32">
                                Total Income
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-center w-20">
                                Year
                            </th>
                            <th className="px-2 py-2 text-xs font-semibold text-gray-700 text-center w-16">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {getPaginatedData(incomes).map((income, index) => (
                            <tr
                                key={income.id}
                                className={`border-b border-gray-200 hover:bg-gray-50 ${
                                    index % 2 === 0 ? "bg-white" : "bg-gray-25"
                                }`}
                            >
                                <td className="border-r border-gray-200 h-8">
                                    <EditableCell
                                        value={income.income_category}
                                        item={income}
                                        field="income_category"
                                        type="income"
                                    />
                                </td>
                                <td className="border-r border-gray-200 h-8">
                                    <EditableCell
                                        value={income.tuition_fees}
                                        item={income}
                                        field="tuition_fees"
                                        type="income"
                                        isNumber={true}
                                    />
                                </td>
                                <td className="border-r border-gray-200 h-8">
                                    <EditableCell
                                        value={income.miscellaneous_fees}
                                        item={income}
                                        field="miscellaneous_fees"
                                        type="income"
                                        isNumber={true}
                                    />
                                </td>
                                <td className="border-r border-gray-200 h-8">
                                    <EditableCell
                                        value={income.other_income}
                                        item={income}
                                        field="other_income"
                                        type="income"
                                        isNumber={true}
                                    />
                                </td>
                                <td className="border-r border-gray-200 h-8 bg-gray-100">
                                    <EditableCell
                                        value={income.total_income}
                                        item={income}
                                        field="total_income"
                                        type="income"
                                        isNumber={true}
                                        isEditable={false}
                                    />
                                </td>
                                <td className="border-r border-gray-200 h-8 text-center">
                                    <div className="px-2 py-1 text-xs">
                                        {income.report_year}
                                    </div>
                                </td>
                                <td className="h-8 text-center">
                                    <Popper
                                        trigger={
                                            <button className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded">
                                                <MoreHorizontal className="w-3 h-3" />
                                            </button>
                                        }
                                        placement="bottom-end"
                                    >
                                        <div className="py-1 min-w-32">
                                            <button className="flex items-center w-full px-3 py-1 text-xs text-gray-700 hover:bg-blue-50">
                                                <Eye className="w-3 h-3 mr-2" />
                                                View
                                            </button>
                                            <button className="flex items-center w-full px-3 py-1 text-xs text-gray-700 hover:bg-green-50">
                                                <Edit className="w-3 h-3 mr-2" />
                                                Edit
                                            </button>
                                            <button className="flex items-center w-full px-3 py-1 text-xs text-red-700 hover:bg-red-50">
                                                <Trash className="w-3 h-3 mr-2" />
                                                Delete
                                            </button>
                                        </div>
                                    </Popper>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderExpenditureTable = () => (
        <div className="w-full overflow-x-auto border border-gray-200">
            <div className="min-w-[1400px]">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b border-gray-200">
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-left w-40">
                                Function Name
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-24">
                                Fund 101 PS
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-24">
                                Fund 101 MOOE
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-24">
                                Fund 101 CO
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-24 bg-blue-50">
                                Fund 101 Total
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-24">
                                Fund 164 PS
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-24">
                                Fund 164 MOOE
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-24">
                                Fund 164 CO
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-24 bg-blue-50">
                                Fund 164 Total
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-24 bg-green-50">
                                Total PS
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-24 bg-green-50">
                                Total MOOE
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-24 bg-green-50">
                                Total CO
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-32 bg-yellow-50">
                                Total Expenditure
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-center w-16">
                                Year
                            </th>
                            <th className="px-2 py-2 text-xs font-semibold text-gray-700 text-center w-16">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {getPaginatedData(expenditures).map(
                            (expenditure, index) => (
                                <tr
                                    key={expenditure.id}
                                    className={`border-b border-gray-200 hover:bg-gray-50 ${
                                        index % 2 === 0
                                            ? "bg-white"
                                            : "bg-gray-25"
                                    }`}
                                >
                                    <td className="border-r border-gray-200 h-8">
                                        <EditableCell
                                            value={expenditure.function_name}
                                            item={expenditure}
                                            field="function_name"
                                            type="expenditure"
                                        />
                                    </td>
                                    <td className="border-r border-gray-200 h-8">
                                        <EditableCell
                                            value={expenditure.fund_101_ps}
                                            item={expenditure}
                                            field="fund_101_ps"
                                            type="expenditure"
                                            isNumber={true}
                                        />
                                    </td>
                                    <td className="border-r border-gray-200 h-8">
                                        <EditableCell
                                            value={expenditure.fund_101_mooe}
                                            item={expenditure}
                                            field="fund_101_mooe"
                                            type="expenditure"
                                            isNumber={true}
                                        />
                                    </td>
                                    <td className="border-r border-gray-200 h-8">
                                        <EditableCell
                                            value={expenditure.fund_101_co}
                                            item={expenditure}
                                            field="fund_101_co"
                                            type="expenditure"
                                            isNumber={true}
                                        />
                                    </td>
                                    <td className="border-r border-gray-200 h-8 bg-blue-50">
                                        <EditableCell
                                            value={expenditure.fund_101_total}
                                            item={expenditure}
                                            field="fund_101_total"
                                            type="expenditure"
                                            isNumber={true}
                                            isEditable={false}
                                        />
                                    </td>
                                    <td className="border-r border-gray-200 h-8">
                                        <EditableCell
                                            value={expenditure.fund_164_ps}
                                            item={expenditure}
                                            field="fund_164_ps"
                                            type="expenditure"
                                            isNumber={true}
                                        />
                                    </td>
                                    <td className="border-r border-gray-200 h-8">
                                        <EditableCell
                                            value={expenditure.fund_164_mooe}
                                            item={expenditure}
                                            field="fund_164_mooe"
                                            type="expenditure"
                                            isNumber={true}
                                        />
                                    </td>
                                    <td className="border-r border-gray-200 h-8">
                                        <EditableCell
                                            value={expenditure.fund_164_co}
                                            item={expenditure}
                                            field="fund_164_co"
                                            type="expenditure"
                                            isNumber={true}
                                        />
                                    </td>
                                    <td className="border-r border-gray-200 h-8 bg-blue-50">
                                        <EditableCell
                                            value={expenditure.fund_164_total}
                                            item={expenditure}
                                            field="fund_164_total"
                                            type="expenditure"
                                            isNumber={true}
                                            isEditable={false}
                                        />
                                    </td>
                                    <td className="border-r border-gray-200 h-8 bg-green-50">
                                        <EditableCell
                                            value={expenditure.total_ps}
                                            item={expenditure}
                                            field="total_ps"
                                            type="expenditure"
                                            isNumber={true}
                                            isEditable={false}
                                        />
                                    </td>
                                    <td className="border-r border-gray-200 h-8 bg-green-50">
                                        <EditableCell
                                            value={expenditure.total_mooe}
                                            item={expenditure}
                                            field="total_mooe"
                                            type="expenditure"
                                            isNumber={true}
                                            isEditable={false}
                                        />
                                    </td>
                                    <td className="border-r border-gray-200 h-8 bg-green-50">
                                        <EditableCell
                                            value={expenditure.total_co}
                                            item={expenditure}
                                            field="total_co"
                                            type="expenditure"
                                            isNumber={true}
                                            isEditable={false}
                                        />
                                    </td>
                                    <td className="border-r border-gray-200 h-8 bg-yellow-50">
                                        <EditableCell
                                            value={expenditure.total_expend}
                                            item={expenditure}
                                            field="total_expend"
                                            type="expenditure"
                                            isNumber={true}
                                            isEditable={false}
                                        />
                                    </td>
                                    <td className="border-r border-gray-200 h-8 text-center">
                                        <div className="px-2 py-1 text-xs">
                                            {expenditure.report_year}
                                        </div>
                                    </td>
                                    <td className="h-8 text-center">
                                        <Popper
                                            trigger={
                                                <button className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded">
                                                    <MoreHorizontal className="w-3 h-3" />
                                                </button>
                                            }
                                            placement="bottom-end"
                                        >
                                            <div className="py-1 min-w-32">
                                                <button className="flex items-center w-full px-3 py-1 text-xs text-gray-700 hover:bg-blue-50">
                                                    <Eye className="w-3 h-3 mr-2" />
                                                    View
                                                </button>
                                                <button className="flex items-center w-full px-3 py-1 text-xs text-gray-700 hover:bg-green-50">
                                                    <Edit className="w-3 h-3 mr-2" />
                                                    Edit
                                                </button>
                                                <button className="flex items-center w-full px-3 py-1 text-xs text-red-700 hover:bg-red-50">
                                                    <Trash className="w-3 h-3 mr-2" />
                                                    Delete
                                                </button>
                                            </div>
                                        </Popper>
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderAllotmentTable = () => (
        <div className="w-full overflow-x-auto border border-gray-200">
            <div className="min-w-[1400px]">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b border-gray-200">
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-left w-40">
                                Function Name
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-24">
                                Fund 101 PS
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-24">
                                Fund 101 MOOE
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-24">
                                Fund 101 CO
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-24 bg-blue-50">
                                Fund 101 Total
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-24">
                                Fund 164 PS
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-24">
                                Fund 164 MOOE
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-24">
                                Fund 164 CO
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-24 bg-blue-50">
                                Fund 164 Total
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-24 bg-green-50">
                                Total PS
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-24 bg-green-50">
                                Total MOOE
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-24 bg-green-50">
                                Total CO
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-32 bg-yellow-50">
                                Total Allotment
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-center w-16">
                                Year
                            </th>
                            <th className="px-2 py-2 text-xs font-semibold text-gray-700 text-center w-16">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {getPaginatedData(allotments).map(
                            (allotment, index) => (
                                <tr
                                    key={allotment.id}
                                    className={`border-b border-gray-200 hover:bg-gray-50 ${
                                        index % 2 === 0
                                            ? "bg-white"
                                            : "bg-gray-25"
                                    }`}
                                >
                                    <td className="border-r border-gray-200 h-8">
                                        <EditableCell
                                            value={allotment.function_name}
                                            item={allotment}
                                            field="function_name"
                                            type="allotment"
                                        />
                                    </td>
                                    <td className="border-r border-gray-200 h-8">
                                        <EditableCell
                                            value={allotment.fund_101_ps}
                                            item={allotment}
                                            field="fund_101_ps"
                                            type="allotment"
                                            isNumber={true}
                                        />
                                    </td>
                                    <td className="border-r border-gray-200 h-8">
                                        <EditableCell
                                            value={allotment.fund_101_mooe}
                                            item={allotment}
                                            field="fund_101_mooe"
                                            type="allotment"
                                            isNumber={true}
                                        />
                                    </td>
                                    <td className="border-r border-gray-200 h-8">
                                        <EditableCell
                                            value={allotment.fund_101_co}
                                            item={allotment}
                                            field="fund_101_co"
                                            type="allotment"
                                            isNumber={true}
                                        />
                                    </td>
                                    <td className="border-r border-gray-200 h-8 bg-blue-50">
                                        <EditableCell
                                            value={allotment.fund_101_total}
                                            item={allotment}
                                            field="fund_101_total"
                                            type="allotment"
                                            isNumber={true}
                                            isEditable={false}
                                        />
                                    </td>
                                    <td className="border-r border-gray-200 h-8">
                                        <EditableCell
                                            value={allotment.fund_164_ps}
                                            item={allotment}
                                            field="fund_164_ps"
                                            type="allotment"
                                            isNumber={true}
                                        />
                                    </td>
                                    <td className="border-r border-gray-200 h-8">
                                        <EditableCell
                                            value={allotment.fund_164_mooe}
                                            item={allotment}
                                            field="fund_164_mooe"
                                            type="allotment"
                                            isNumber={true}
                                        />
                                    </td>
                                    <td className="border-r border-gray-200 h-8">
                                        <EditableCell
                                            value={allotment.fund_164_co}
                                            item={allotment}
                                            field="fund_164_co"
                                            type="allotment"
                                            isNumber={true}
                                        />
                                    </td>
                                    <td className="border-r border-gray-200 h-8 bg-blue-50">
                                        <EditableCell
                                            value={allotment.fund_164_total}
                                            item={allotment}
                                            field="fund_164_total"
                                            type="allotment"
                                            isNumber={true}
                                            isEditable={false}
                                        />
                                    </td>
                                    <td className="border-r border-gray-200 h-8 bg-green-50">
                                        <EditableCell
                                            value={allotment.total_ps}
                                            item={allotment}
                                            field="total_ps"
                                            type="allotment"
                                            isNumber={true}
                                            isEditable={false}
                                        />
                                    </td>
                                    <td className="border-r border-gray-200 h-8 bg-green-50">
                                        <EditableCell
                                            value={allotment.total_mooe}
                                            item={allotment}
                                            field="total_mooe"
                                            type="allotment"
                                            isNumber={true}
                                            isEditable={false}
                                        />
                                    </td>
                                    <td className="border-r border-gray-200 h-8 bg-green-50">
                                        <EditableCell
                                            value={allotment.total_co}
                                            item={allotment}
                                            field="total_co"
                                            type="allotment"
                                            isNumber={true}
                                            isEditable={false}
                                        />
                                    </td>
                                    <td className="border-r border-gray-200 h-8 bg-yellow-50">
                                        <EditableCell
                                            value={allotment.total_allot}
                                            item={allotment}
                                            field="total_allot"
                                            type="allotment"
                                            isNumber={true}
                                            isEditable={false}
                                        />
                                    </td>
                                    <td className="border-r border-gray-200 h-8 text-center">
                                        <div className="px-2 py-1 text-xs">
                                            {allotment.report_year}
                                        </div>
                                    </td>
                                    <td className="h-8 text-center">
                                        <Popper
                                            trigger={
                                                <button className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded">
                                                    <MoreHorizontal className="w-3 h-3" />
                                                </button>
                                            }
                                            placement="bottom-end"
                                        >
                                            <div className="py-1 min-w-32">
                                                <button className="flex items-center w-full px-3 py-1 text-xs text-gray-700 hover:bg-blue-50">
                                                    <Eye className="w-3 h-3 mr-2" />
                                                    View
                                                </button>
                                                <button className="flex items-center w-full px-3 py-1 text-xs text-gray-700 hover:bg-green-50">
                                                    <Edit className="w-3 h-3 mr-2" />
                                                    Edit
                                                </button>
                                                <button className="flex items-center w-full px-3 py-1 text-xs text-red-700 hover:bg-red-50">
                                                    <Trash className="w-3 h-3 mr-2" />
                                                    Delete
                                                </button>
                                            </div>
                                        </Popper>
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
            <div className="p-4 max-w-full mx-auto">
                {/* Header Section */}
                <div className="mb-6">
                    <div className="flex items-center mb-4">
                        <button
                            onClick={handleBack}
                            className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-lg transition-all duration-200"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-900 mb-1">
                                Financial Management
                            </h1>
                            <p className="text-sm text-gray-600 flex items-center">
                                <DollarSign className="w-4 h-4 mr-2" />
                                {heiName}
                            </p>
                        </div>
                    </div>

                    {/* Controls Section */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 border border-white/20 shadow-sm mb-4">
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col lg:flex-row gap-3 justify-between items-start lg:items-center">
                                <div className="flex flex-col sm:flex-row gap-2 flex-1 w-full lg:w-auto">
                                    {/* You can add filters or search here if needed */}
                                </div>

                                <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                                    <button
                                        onClick={handleExportToExcel}
                                        disabled={exportLoading}
                                        className="inline-flex items-center justify-center px-3 py-2 bg-white/50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-white hover:shadow-md transition-all duration-200"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        {exportLoading
                                            ? "Exporting..."
                                            : "Export Excel"}
                                    </button>
                                </div>
                            </div>

                            {/* Tab Navigation */}
                            <div className="border-b border-gray-200">
                                <nav className="-mb-px flex space-x-6">
                                    <button
                                        onClick={() => {
                                            setActiveTab("income");
                                            setCurrentPage(1);
                                        }}
                                        className={`${
                                            activeTab === "income"
                                                ? "border-blue-500 text-blue-600"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center`}
                                    >
                                        <DollarSign className="w-4 h-4 mr-2" />
                                        Income ({incomes.length})
                                    </button>
                                    <button
                                        onClick={() => {
                                            setActiveTab("expenditure");
                                            setCurrentPage(1);
                                        }}
                                        className={`${
                                            activeTab === "expenditure"
                                                ? "border-blue-500 text-blue-600"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center`}
                                    >
                                        <BarChart2 className="w-4 h-4 mr-2" />
                                        Expenditure ({expenditures.length})
                                    </button>
                                    <button
                                        onClick={() => {
                                            setActiveTab("allotment");
                                            setCurrentPage(1);
                                        }}
                                        className={`${
                                            activeTab === "allotment"
                                                ? "border-blue-500 text-blue-600"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center`}
                                    >
                                        <PieChart className="w-4 h-4 mr-2" />
                                        Allotment ({allotments.length})
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/20">
                    {activeTab === "income" && renderIncomeTable()}
                    {activeTab === "expenditure" && renderExpenditureTable()}
                    {activeTab === "allotment" && renderAllotmentTable()}
                </div>

                {/* Pagination */}
                <div className="mt-4">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(
                            (activeTab === "income"
                                ? incomes.length
                                : activeTab === "expenditure"
                                ? expenditures.length
                                : allotments.length) / pageSize
                        )}
                        onPageChange={setCurrentPage}
                        pageSize={pageSize}
                        onPageSizeChange={setPageSize}
                        pageSizeOptions={[5, 10, 20, 50]}
                        showFirstLast={true}
                        showPageSize={true}
                        maxPageButtons={5}
                    />
                </div>

                {/* Instructions */}
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                        <strong>Excel-like editing:</strong> Click on any
                        editable cell to edit. Press Enter to save or Escape to
                        cancel. Calculated fields (totals) are highlighted and
                        read-only.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SucFormGH;
